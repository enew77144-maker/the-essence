from __future__ import annotations

import secrets

from django.shortcuts import get_object_or_404
from rest_framework import generics, status, viewsets
from rest_framework.decorators import action
from rest_framework.permissions import AllowAny
from rest_framework.response import Response

from apps.cms.models import DiscountCode
from apps.products.models import Product

from .models import Cart, CartItem
from .serializers import AddCartItemSerializer, CartItemSerializer, CartSerializer


def _get_or_create_cart(request) -> Cart:
    if request.user.is_authenticated:
        cart, _ = Cart.objects.prefetch_related("items__product__images").get_or_create(
            user=request.user
        )
        return cart
    sid = request.headers.get("X-Cart-Session") or request.query_params.get("session")
    if not sid:
        sid = secrets.token_urlsafe(24)
    cart, _ = Cart.objects.prefetch_related("items__product__images").get_or_create(
        session_id=sid, user__isnull=True
    )
    return cart


class CartViewSet(viewsets.ViewSet):
    permission_classes = [AllowAny]

    def list(self, request):
        cart = _get_or_create_cart(request)
        data = CartSerializer(cart).data
        if not request.user.is_authenticated:
            data["session_id"] = cart.session_id
        return Response(data)

    @action(detail=False, methods=["post"], url_path="items")
    def add_item(self, request):
        serializer = AddCartItemSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        product = get_object_or_404(Product, pk=serializer.validated_data["product_id"])
        cart = _get_or_create_cart(request)
        item, created = CartItem.objects.get_or_create(
            cart=cart,
            product=product,
            defaults={
                "quantity": serializer.validated_data["quantity"],
                "unit_price": product.price,
            },
        )
        if not created:
            item.quantity += serializer.validated_data["quantity"]
            item.unit_price = product.price
            item.save()
        return Response(
            CartItemSerializer(item).data, status=status.HTTP_201_CREATED
        )

    @action(detail=False, methods=["patch"], url_path=r"items/(?P<item_id>\d+)")
    def update_item(self, request, item_id=None):
        cart = _get_or_create_cart(request)
        item = get_object_or_404(CartItem, pk=item_id, cart=cart)
        qty = int(request.data.get("quantity", item.quantity))
        if qty <= 0:
            item.delete()
            return Response(CartSerializer(cart).data)
        item.quantity = qty
        item.save()
        return Response(CartSerializer(cart).data)

    @action(detail=False, methods=["delete"], url_path=r"items/(?P<item_id>\d+)/remove")
    def remove_item(self, request, item_id=None):
        cart = _get_or_create_cart(request)
        get_object_or_404(CartItem, pk=item_id, cart=cart).delete()
        return Response(CartSerializer(cart).data)

    @action(detail=False, methods=["post"], url_path="apply-discount")
    def apply_discount(self, request):
        code = (request.data.get("code") or "").strip().upper()
        if not code:
            return Response({"detail": "Code required"}, status=400)
        try:
            discount = DiscountCode.objects.get(code=code, is_active=True)
        except DiscountCode.DoesNotExist:
            return Response({"detail": "Invalid code"}, status=404)
        cart = _get_or_create_cart(request)
        cart.discount_code = discount.code
        cart.save(update_fields=["discount_code"])
        return Response(CartSerializer(cart).data)

    @action(detail=False, methods=["delete"], url_path="discount")
    def remove_discount(self, request):
        cart = _get_or_create_cart(request)
        cart.discount_code = ""
        cart.save(update_fields=["discount_code"])
        return Response(CartSerializer(cart).data)
