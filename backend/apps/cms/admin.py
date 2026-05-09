from django.contrib import admin

from .models import Banner, Concern, DiscountCode


@admin.register(Banner)
class BannerAdmin(admin.ModelAdmin):
    list_display = ("title", "is_active", "display_order", "created_at")
    list_filter = ("is_active",)
    search_fields = ("title", "subtitle")


@admin.register(Concern)
class ConcernAdmin(admin.ModelAdmin):
    list_display = ("name", "slug", "display_order")
    prepopulated_fields = {"slug": ("name",)}


@admin.register(DiscountCode)
class DiscountCodeAdmin(admin.ModelAdmin):
    list_display = ("code", "type", "value", "is_active", "used_count", "expires_at")
    list_filter = ("type", "is_active")
    search_fields = ("code",)
