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

from apps.orders.models import Order

logger = logging.getLogger(__name__)


def _stripe_client() -> stripe:  # type: ignore[valid-type]
    stripe.api_key = settings.STRIPE_SECRET_KEY
    return stripe


@api_view(["POST"])
@permission_classes([AllowAny])
def create_payment_intent(request):
    order_id = request.data.get("order_id")
    if not order_id:
        return Response({"detail": "order_id required"}, status=400)
    order = get_object_or_404(Order, pk=order_id)

    if not settings.STRIPE_SECRET_KEY:
        # Dev fallback: simulate a successful payment without contacting Stripe.
        order.stripe_payment_status = "succeeded_dev"
        order.status = Order.Status.PROCESSING
        order.save(update_fields=["stripe_payment_status", "status"])
        return Response({"client_secret": "dev_intent_secret", "dev_mode": True})

    client = _stripe_client()
    intent = client.PaymentIntent.create(
        amount=int((order.total * Decimal("100")).to_integral_value()),
        currency="eur",
        metadata={"order_id": order.id, "order_number": order.order_number},
        automatic_payment_methods={"enabled": True},
    )
    order.stripe_payment_intent_id = intent["id"]
    order.save(update_fields=["stripe_payment_intent_id"])
    return Response({"client_secret": intent["client_secret"]})


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
