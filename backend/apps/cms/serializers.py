from __future__ import annotations

from rest_framework import serializers

from .models import Banner, Concern, DiscountCode


class BannerSerializer(serializers.ModelSerializer):
    class Meta:
        model = Banner
        fields = (
            "id",
            "title",
            "subtitle",
            "cta_text",
            "cta_url",
            "image_url",
            "mobile_image_url",
            "display_order",
        )


class ConcernSerializer(serializers.ModelSerializer):
    class Meta:
        model = Concern
        fields = ("id", "name", "slug", "description", "image_url", "display_order")


class DiscountCodeSerializer(serializers.ModelSerializer):
    class Meta:
        model = DiscountCode
        fields = ("id", "code", "type", "value", "min_order_amount", "expires_at")
        read_only_fields = fields
