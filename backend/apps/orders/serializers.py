from __future__ import annotations

from decimal import Decimal

from rest_framework import serializers

from apps.cart.models import Cart
from apps.cms.models import DiscountCode

from .models import Order, OrderItem


class OrderItemSerializer(serializers.ModelSerializer):
    class Meta:
        model = OrderItem
        fields = (
            "id",
            "product",
            "product_name",
            "product_image",
            "quantity",
            "unit_price",
            "total_price",
        )
        read_only_fields = fields


class OrderSerializer(serializers.ModelSerializer):
    items = OrderItemSerializer(many=True, read_only=True)

    class Meta:
        model = Order
        fields = (
            "id",
            "order_number",
            "email",
            "status",
            "subtotal",
            "shipping_cost",
            "discount_amount",
            "total",
            "shipping_address",
            "billing_address",
            "stripe_payment_status",
            "notes",
            "items",
            "created_at",
            "updated_at",
        )
        read_only_fields = (
            "id",
            "order_number",
            "status",
            "subtotal",
            "shipping_cost",
            "discount_amount",
            "total",
            "stripe_payment_status",
            "items",
            "created_at",
            "updated_at",
        )


class CreateOrderSerializer(serializers.Serializer):
    email = serializers.EmailField()
    shipping_address = serializers.DictField()
    billing_address = serializers.DictField(required=False)
    notes = serializers.CharField(required=False, allow_blank=True)
    cart_session = serializers.CharField(required=False, allow_blank=True)
    payment_intent_id = serializers.CharField(required=False, allow_blank=True)

    FREE_SHIPPING_THRESHOLD = Decimal("30.00")
    BASE_SHIPPING = Decimal("4.95")

    def _resolve_cart(self, request) -> Cart:
        if request.user.is_authenticated:
            cart = (
                Cart.objects.filter(user=request.user)
                .prefetch_related("items__product")
                .first()
            )
        else:
            session_id = self.validated_data.get("cart_session") or request.headers.get(
                "X-Cart-Session"
            )
            cart = (
                Cart.objects.filter(session_id=session_id, user__isnull=True)
                .prefetch_related("items__product")
                .first()
            )
        if not cart or not cart.items.exists():
            raise serializers.ValidationError({"cart": "Cart is empty."})
        return cart

    def _compute_totals(self, cart: Cart) -> tuple[Decimal, Decimal, Decimal, Decimal]:
        subtotal = sum((i.line_total for i in cart.items.all()), Decimal("0"))
        discount = Decimal("0")
        shipping = Decimal("0") if subtotal >= self.FREE_SHIPPING_THRESHOLD else self.BASE_SHIPPING
        if cart.discount_code:
            try:
                code = DiscountCode.objects.get(code=cart.discount_code, is_active=True)
                if code.type == DiscountCode.Type.PERCENTAGE:
                    discount = (subtotal * code.value / Decimal("100")).quantize(
                        Decimal("0.01")
                    )
                elif code.type == DiscountCode.Type.FIXED:
                    discount = code.value
                elif code.type == DiscountCode.Type.FREE_SHIPPING:
                    shipping = Decimal("0")
            except DiscountCode.DoesNotExist:
                pass
        total = max(subtotal + shipping - discount, Decimal("0"))
        return subtotal.quantize(Decimal("0.01")), shipping, discount, total.quantize(
            Decimal("0.01")
        )

    def create(self, validated_data: dict) -> Order:
        request = self.context["request"]
        cart = self._resolve_cart(request)
        subtotal, shipping, discount, total = self._compute_totals(cart)

        order = Order.objects.create(
            user=request.user if request.user.is_authenticated else None,
            email=validated_data["email"],
            subtotal=subtotal,
            shipping_cost=shipping,
            discount_amount=discount,
            total=total,
            shipping_address=validated_data["shipping_address"],
            billing_address=validated_data.get("billing_address", {}),
            notes=validated_data.get("notes", ""),
            stripe_payment_intent_id=validated_data.get("payment_intent_id", ""),
        )
        for item in cart.items.all():
            primary_image = next(
                (img for img in item.product.images.all() if img.is_primary),
                item.product.images.first(),
            )
            OrderItem.objects.create(
                order=order,
                product=item.product,
                product_name=item.product.name,
                product_image=primary_image.url if primary_image else "",
                quantity=item.quantity,
                unit_price=item.unit_price,
                total_price=item.line_total,
            )
        cart.items.all().delete()
        cart.discount_code = ""
        cart.save(update_fields=["discount_code"])
        return order
