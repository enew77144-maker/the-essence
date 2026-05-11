from __future__ import annotations

import logging
from decimal import Decimal

import stripe
from django.conf import settings
from django.shortcuts import get_object_or_404
from django.views.decorators.csrf import csrf_exempt
from rest_framework import status
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import AllowAny
from rest_framework.response import Response

from apps.cart.models import Cart
from apps.orders.models import Order
from apps.orders.serializers import CreateOrderSerializer

logger = logging.getLogger(__name__)


def _stripe_client() -> stripe:  # type: ignore[valid-type]
    stripe.api_key = settings.STRIPE_SECRET_KEY
    return stripe


def _resolve_cart(request) -> Cart | None:
    if request.user.is_authenticated:
        return (
            Cart.objects.filter(user=request.user)
            .prefetch_related("items__product")
            .first()
        )
    session_id = request.data.get("cart_session") or request.headers.get(
        "X-Cart-Session"
    )
    if not session_id:
        return None
    return (
        Cart.objects.filter(session_id=session_id, user__isnull=True)
        .prefetch_related("items__product")
        .first()
    )


@api_view(["POST"])
@permission_classes([AllowAny])
def create_payment_intent(request):
    """Create a PaymentIntent for the active cart (preferred) or an existing
    order. Frontend may call this before the order exists — in that case we
    compute the amount from the user's cart. Once the order is created, the
    `payment_intent_id` returned here is attached to the order.
    """
    order_id = request.data.get("order_id")
    order: Order | None = None
    if order_id:
        order = get_object_or_404(Order, pk=order_id)
        amount_decimal = order.total
    else:
        cart = _resolve_cart(request)
        if not cart or not cart.items.exists():
            return Response(
                {"detail": "Your cart is empty. Add a product before checking out."},
                status=400,
            )
        _, _, _, amount_decimal = CreateOrderSerializer()._compute_totals(cart)

    amount_cents = int((amount_decimal * Decimal("100")).to_integral_value())

    if not settings.STRIPE_SECRET_KEY:
        # Dev fallback: simulate a successful payment intent without contacting Stripe.
        if order is not None:
            order.stripe_payment_status = "succeeded_dev"
            order.status = Order.Status.PROCESSING
            order.save(update_fields=["stripe_payment_status", "status"])
        return Response(
            {
                "client_secret": "dev_intent_secret",
                "payment_intent_id": f"pi_dev_{int(amount_cents)}",
                "dev_mode": True,
            }
        )

    client = _stripe_client()
    metadata: dict[str, str | int] = {}
    if order is not None:
        metadata = {"order_id": order.id, "order_number": order.order_number}
    intent = client.PaymentIntent.create(
        amount=amount_cents,
        currency="eur",
        metadata=metadata,
        automatic_payment_methods={"enabled": True},
    )
    if order is not None:
        order.stripe_payment_intent_id = intent["id"]
        order.save(update_fields=["stripe_payment_intent_id"])
    return Response(
        {
            "client_secret": intent["client_secret"],
            "payment_intent_id": intent["id"],
        }
    )


@csrf_exempt
@api_view(["POST"])
@permission_classes([AllowAny])
def stripe_webhook(request):
    if not settings.STRIPE_WEBHOOK_SECRET:
        return Response({"detail": "Webhook secret not configured"}, status=400)

    sig_header = request.META.get("HTTP_STRIPE_SIGNATURE", "")
    payload = request.body
    client = _stripe_client()
    try:
        event = client.Webhook.construct_event(
            payload, sig_header, settings.STRIPE_WEBHOOK_SECRET
        )
    except (ValueError, stripe.error.SignatureVerificationError) as exc:
        logger.warning("Stripe webhook verification failed: %s", exc)
        return Response({"detail": "Invalid signature"}, status=400)

    event_type = event["type"]
    obj = event["data"]["object"]
    if event_type == "payment_intent.succeeded":
        intent_id = obj["id"]
        Order.objects.filter(stripe_payment_intent_id=intent_id).update(
            stripe_payment_status="succeeded",
            status=Order.Status.PROCESSING,
        )
    elif event_type == "payment_intent.payment_failed":
        intent_id = obj["id"]
        Order.objects.filter(stripe_payment_intent_id=intent_id).update(
            stripe_payment_status="failed"
        )
    return Response({"received": True}, status=status.HTTP_200_OK)
