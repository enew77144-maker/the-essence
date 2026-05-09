from __future__ import annotations

from rest_framework import serializers

from .models import (
    Category,
    Product,
    ProductConcern,
    ProductImage,
    ProductTag,
    WishlistItem,
)


class ProductImageSerializer(serializers.ModelSerializer):
    class Meta:
        model = ProductImage
        fields = ("id", "url", "alt_text", "is_primary", "display_order")


class CategorySerializer(serializers.ModelSerializer):
    product_count = serializers.IntegerField(read_only=True)

    class Meta:
        model = Category
        fields = (
            "id",
            "name",
            "slug",
            "description",
            "image_url",
            "parent",
            "display_order",
            "product_count",
        )


class ProductListSerializer(serializers.ModelSerializer):
    primary_image = serializers.SerializerMethodField()
    category_name = serializers.CharField(source="category.name", read_only=True)
    category_slug = serializers.CharField(source="category.slug", read_only=True)
    is_on_sale = serializers.BooleanField(read_only=True)
    discount_percent = serializers.IntegerField(read_only=True)
    tags = serializers.SerializerMethodField()
    concerns = serializers.SerializerMethodField()

    class Meta:
        model = Product
        fields = (
            "id",
            "name",
            "slug",
            "tagline",
            "key_ingredients",
            "sku",
            "price",
            "compare_price",
            "is_on_sale",
            "discount_percent",
            "stock_qty",
            "is_featured",
            "is_bestseller",
            "is_new",
            "category_name",
            "category_slug",
            "rating_avg",
            "rating_count",
            "primary_image",
            "tags",
            "concerns",
        )

    def get_primary_image(self, obj: Product) -> dict | None:
        image = next(
            (i for i in obj.images.all() if i.is_primary),
            obj.images.first(),
        )
        if not image:
            return None
        return {"url": image.url, "alt_text": image.alt_text}

    def get_tags(self, obj: Product) -> list[str]:
        return [t.tag for t in obj.tags.all()]

    def get_concerns(self, obj: Product) -> list[str]:
        return [c.concern for c in obj.concerns.all()]


class ProductDetailSerializer(ProductListSerializer):
    images = ProductImageSerializer(many=True, read_only=True)

    class Meta(ProductListSerializer.Meta):
        fields = ProductListSerializer.Meta.fields + (
            "description",
            "ingredients",
            "how_to_use",
            "images",
            "created_at",
            "updated_at",
        )


class WishlistItemSerializer(serializers.ModelSerializer):
    product = ProductListSerializer(read_only=True)
    product_id = serializers.PrimaryKeyRelatedField(
        queryset=Product.objects.all(), write_only=True, source="product"
    )

    class Meta:
        model = WishlistItem
        fields = ("id", "product", "product_id", "created_at")
        read_only_fields = ("id", "created_at")
