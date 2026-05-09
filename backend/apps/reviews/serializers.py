from __future__ import annotations

from rest_framework import serializers

from .models import Review


class ReviewSerializer(serializers.ModelSerializer):
    user_name = serializers.SerializerMethodField()

    class Meta:
        model = Review
        fields = (
            "id",
            "product",
            "user",
            "user_name",
            "author_name",
            "rating",
            "title",
            "body",
            "verified_purchase",
            "helpful_count",
            "created_at",
        )
        read_only_fields = (
            "id",
            "user",
            "verified_purchase",
            "helpful_count",
            "created_at",
        )

    def get_user_name(self, obj: Review) -> str:
        if obj.user:
            full = f"{obj.user.first_name} {obj.user.last_name}".strip()
            return full or obj.user.email.split("@")[0]
        return obj.author_name or "Anonymous"

    def validate_rating(self, value: int) -> int:
        if not 1 <= value <= 5:
            raise serializers.ValidationError("Rating must be between 1 and 5.")
        return value
