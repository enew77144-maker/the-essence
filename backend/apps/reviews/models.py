from __future__ import annotations

from decimal import Decimal

from django.conf import settings
from django.db import models
from django.db.models import Avg, Count


class Review(models.Model):
    product = models.ForeignKey(
        "products.Product", related_name="reviews", on_delete=models.CASCADE
    )
    user = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        related_name="reviews",
        on_delete=models.CASCADE,
        null=True,
        blank=True,
    )
    author_name = models.CharField(max_length=120, blank=True)
    rating = models.PositiveSmallIntegerField()
    title = models.CharField(max_length=200, blank=True)
    body = models.TextField()
    verified_purchase = models.BooleanField(default=False)
    helpful_count = models.PositiveIntegerField(default=0)
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        db_table = "reviews"
        ordering = ["-created_at"]
        constraints = [
            models.CheckConstraint(
                check=models.Q(rating__gte=1) & models.Q(rating__lte=5),
                name="reviews_rating_1_5",
            )
        ]

    def __str__(self) -> str:
        return f"{self.product.name} — {self.rating}★"


def refresh_product_rating(product) -> None:
    agg = product.reviews.aggregate(avg=Avg("rating"), n=Count("id"))
    product.rating_avg = Decimal(str(round(agg["avg"] or 0, 2)))
    product.rating_count = agg["n"] or 0
    product.save(update_fields=["rating_avg", "rating_count"])
