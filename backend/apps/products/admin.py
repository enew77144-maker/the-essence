from django.contrib import admin

from .models import (
    Category,
    Product,
    ProductConcern,
    ProductImage,
    ProductTag,
    WishlistItem,
)


class ProductImageInline(admin.TabularInline):
    model = ProductImage
    extra = 1


class ProductTagInline(admin.TabularInline):
    model = ProductTag
    extra = 1


class ProductConcernInline(admin.TabularInline):
    model = ProductConcern
    extra = 1


@admin.register(Category)
class CategoryAdmin(admin.ModelAdmin):
    list_display = ("name", "slug", "parent", "display_order")
    prepopulated_fields = {"slug": ("name",)}
    list_filter = ("parent",)
    search_fields = ("name", "slug")


@admin.register(Product)
class ProductAdmin(admin.ModelAdmin):
    list_display = (
        "name",
        "category",
        "price",
        "compare_price",
        "stock_qty",
        "is_featured",
        "is_bestseller",
        "is_new",
        "rating_avg",
    )
    list_filter = ("category", "is_featured", "is_bestseller", "is_new")
    search_fields = ("name", "sku", "tagline")
    prepopulated_fields = {"slug": ("name",)}
    inlines = [ProductImageInline, ProductTagInline, ProductConcernInline]


@admin.register(WishlistItem)
class WishlistItemAdmin(admin.ModelAdmin):
    list_display = ("user", "product", "created_at")
    search_fields = ("user__email", "product__name")
