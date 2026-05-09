from django.contrib import admin

from .models import Review


@admin.register(Review)
class ReviewAdmin(admin.ModelAdmin):
    list_display = ("product", "rating", "title", "verified_purchase", "created_at")
    list_filter = ("rating", "verified_purchase")
    search_fields = ("product__name", "title", "body", "user__email")
