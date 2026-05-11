from __future__ import annotations

from django.db.models import Count, Prefetch
from rest_framework import permissions, status, viewsets
from rest_framework.decorators import action
from rest_framework.response import Response

from .filters import ProductFilter
from .models import Category, Product, ProductImage, WishlistItem
from .serializers import (
    CategorySerializer,
    ProductDetailSerializer,
    ProductListSerializer,
    WishlistItemSerializer,
)


class CategoryViewSet(viewsets.ReadOnlyModelViewSet):
    serializer_class = CategorySerializer
    lookup_field = "slug"

    def get_queryset(self):
        return Category.objects.annotate(product_count=Count("products")).order_by(
            "display_order", "name"
        )


SORT_MAP: dict[str, tuple[str, ...]] = {
    # Frontend-friendly sort tokens -> Django ORM ordering tuples.
    "featured": ("-is_featured", "-created_at"),
    "bestselling": ("-is_bestseller", "-rating_avg", "-created_at"),
    "price_asc": ("price",),
    "price_desc": ("-price",),
    "rating": ("-rating_avg", "-created_at"),
    "newest": ("-created_at",),
}


class ProductViewSet(viewsets.ReadOnlyModelViewSet):
    lookup_field = "slug"
    filterset_class = ProductFilter
    search_fields = ["name", "tagline", "description", "key_ingredients", "sku"]
    ordering_fields = ["price", "rating_avg", "created_at", "name"]
    ordering = ["-created_at"]

    def get_queryset(self):
        return (
            Product.objects.select_related("category")
            .prefetch_related(
                Prefetch("images", queryset=ProductImage.objects.all()),
                "tags",
                "concerns",
            )
        )

    def filter_queryset(self, queryset):
        # Run DRF's default filters (search, ordering, filterset) first, then
        # translate our frontend-friendly ?sort= token into ORM ordering so it
        # always wins over the default `ordering = ["-created_at"]` on the
        # viewset.
        queryset = super().filter_queryset(queryset)
        sort = self.request.query_params.get("sort")
        if sort and sort in SORT_MAP:
            queryset = queryset.order_by(*SORT_MAP[sort])
        return queryset

    def get_serializer_class(self):
        if self.action == "retrieve":
            return ProductDetailSerializer
        return ProductListSerializer

    @action(detail=False, methods=["get"], url_path="featured")
    def featured(self, request):
        qs = self.get_queryset().filter(is_featured=True)[:8]
        return Response(self.get_serializer(qs, many=True).data)

    @action(detail=False, methods=["get"], url_path="bestsellers")
    def bestsellers(self, request):
        qs = self.get_queryset().filter(is_bestseller=True)[:12]
        return Response(self.get_serializer(qs, many=True).data)

    @action(detail=False, methods=["get"], url_path="new")
    def new_arrivals(self, request):
        qs = self.get_queryset().filter(is_new=True)[:12]
        return Response(self.get_serializer(qs, many=True).data)

    @action(detail=True, methods=["get"], url_path="related")
    def related(self, request, slug=None):
        product = self.get_object()
        qs = (
            self.get_queryset()
            .filter(category=product.category)
            .exclude(pk=product.pk)[:6]
        )
        return Response(ProductListSerializer(qs, many=True).data)


class WishlistViewSet(viewsets.ModelViewSet):
    serializer_class = WishlistItemSerializer
    permission_classes = [permissions.IsAuthenticated]
    http_method_names = ["get", "post", "delete"]

    def get_queryset(self):
        return WishlistItem.objects.filter(user=self.request.user).select_related(
            "product", "product__category"
        )

    def create(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        product = serializer.validated_data["product"]
        item, _ = WishlistItem.objects.get_or_create(
            user=request.user, product=product
        )
        return Response(self.get_serializer(item).data, status=status.HTTP_201_CREATED)
