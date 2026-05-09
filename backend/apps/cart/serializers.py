from __future__ import annotations

from decimal import Decimal

from rest_framework import serializers

from apps.products.serializers import ProductListSerializer

from .models import Cart, CartItem


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


class CartSerializer(serializers.ModelSerializer):
    items = CartItemSerializer(many=True, read_only=True)
    subtotal = serializers.SerializerMethodField()
    item_count = serializers.SerializerMethodField()
    free_shipping_threshold = serializers.SerializerMethodField()

    class Meta:
        model = Cart
        fields = (
            "id",
            "items",
            "subtotal",
            "item_count",
            "discount_code",
            "free_shipping_threshold",
            "updated_at",
        )

    def get_subtotal(self, obj: Cart) -> str:
        return f"{obj.subtotal:.2f}"

    def get_item_count(self, obj: Cart) -> int:
        return sum(i.quantity for i in obj.items.all())

    def get_free_shipping_threshold(self, obj: Cart) -> str:
        return "30.00"


class AddCartItemSerializer(serializers.Serializer):
    product_id = serializers.IntegerField()
    quantity = serializers.IntegerField(min_value=1, default=1)
