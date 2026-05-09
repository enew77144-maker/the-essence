from __future__ import annotations

from decimal import Decimal

from rest_framework import serializers

from apps.cms.models import DiscountCode
from apps.products.serializers import ProductListSerializer

from .models import Cart, CartItem

FREE_SHIPPING_THRESHOLD = Decimal("30.00")
BASE_SHIPPING = Decimal("4.95")


class CartItemSerializer(serializers.ModelSerializer):
    product = ProductListSerializer(read_only=True)
    line_total = serializers.DecimalField(
        max_digits=10, decimal_places=2, read_only=True
    )

    class Meta:
        model = CartItem
        fields = (
            "id",
            "product",
            "quantity",
            "unit_price",
            "line_total",
            "created_at",
        )
        read_only_fields = ("id", "unit_price", "line_total", "created_at")


def _compute_totals(cart: Cart) -> dict:
    subtotal = sum(
        (i.line_total for i in cart.items.all()),
        Decimal("0"),
    )
    discount = Decimal("0")
    shipping = (
        Decimal("0") if subtotal >= FREE_SHIPPING_THRESHOLD else BASE_SHIPPING
    )
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
    if subtotal == 0:
        shipping = Decimal("0")
    total = max(subtotal + shipping - discount, Decimal("0"))
    return {
        "subtotal": f"{subtotal.quantize(Decimal('0.01')):.2f}",
        "shipping_cost": f"{shipping.quantize(Decimal('0.01')):.2f}",
        "discount_amount": f"{discount.quantize(Decimal('0.01')):.2f}",
        "total": f"{total.quantize(Decimal('0.01')):.2f}",
    }


class CartSerializer(serializers.ModelSerializer):
    items = CartItemSerializer(many=True, read_only=True)
    subtotal = serializers.SerializerMethodField()
    shipping_cost = serializers.SerializerMethodField()
    discount_amount = serializers.SerializerMethodField()
    total = serializers.SerializerMethodField()
    item_count = serializers.SerializerMethodField()
    free_shipping_threshold = serializers.SerializerMethodField()

    class Meta:
        model = Cart
        fields = (
            "id",
            "items",
            "subtotal",
            "shipping_cost",
            "discount_amount",
            "total",
            "item_count",
            "discount_code",
            "free_shipping_threshold",
            "updated_at",
        )

    def get_subtotal(self, obj: Cart) -> str:
        return _compute_totals(obj)["subtotal"]

    def get_shipping_cost(self, obj: Cart) -> str:
        return _compute_totals(obj)["shipping_cost"]

    def get_discount_amount(self, obj: Cart) -> str:
        return _compute_totals(obj)["discount_amount"]

    def get_total(self, obj: Cart) -> str:
        return _compute_totals(obj)["total"]

    def get_item_count(self, obj: Cart) -> int:
        return sum(i.quantity for i in obj.items.all())

    def get_free_shipping_threshold(self, obj: Cart) -> str:
        return f"{FREE_SHIPPING_THRESHOLD:.2f}"


class AddCartItemSerializer(serializers.Serializer):
    product_id = serializers.IntegerField()
    quantity = serializers.IntegerField(min_value=1, default=1)
