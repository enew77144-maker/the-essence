from __future__ import annotations

from decimal import Decimal

from django.db import models
from django.utils.text import slugify


class Category(models.Model):
    name = models.CharField(max_length=120)
    slug = models.SlugField(max_length=140, unique=True)
    description = models.TextField(blank=True)
    image_url = models.URLField(blank=True)
    parent = models.ForeignKey(
        "self",
        related_name="children",
        on_delete=models.SET_NULL,
        null=True,
        blank=True,
    )
    display_order = models.PositiveIntegerField(default=0)
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        db_table = "categories"
        ordering = ["display_order", "name"]
        verbose_name_plural = "categories"

    def __str__(self) -> str:
        return self.name

    def save(self, *args, **kwargs):
        if not self.slug:
            self.slug = slugify(self.name)
        super().save(*args, **kwargs)


class Product(models.Model):
    name = models.CharField(max_length=200)
    slug = models.SlugField(max_length=220, unique=True)
    tagline = models.CharField(max_length=200, blank=True)
    description = models.TextField(blank=True)
    ingredients = models.TextField(blank=True, help_text="Full INCI list")
    key_ingredients = models.CharField(
        max_length=200,
        blank=True,
        help_text="e.g. 'Niacinamide 10% + Zinc 1%'",
    )
    how_to_use = models.TextField(blank=True)
    sku = models.CharField(max_length=64, unique=True)
    price = models.DecimalField(max_digits=10, decimal_places=2)
    compare_price = models.DecimalField(
        max_digits=10, decimal_places=2, null=True, blank=True
    )
    stock_qty = models.PositiveIntegerField(default=0)
    is_featured = models.BooleanField(default=False)
    is_bestseller = models.BooleanField(default=False)
    is_new = models.BooleanField(default=False)
    category = models.ForeignKey(
        Category, related_name="products", on_delete=models.PROTECT
    )
    rating_avg = models.DecimalField(
        max_digits=3, decimal_places=2, default=Decimal("0.00")
    )
    rating_count = models.PositiveIntegerField(default=0)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        db_table = "products"
        ordering = ["-created_at"]
        indexes = [
            models.Index(fields=["category", "is_featured"]),
            models.Index(fields=["is_bestseller"]),
            models.Index(fields=["is_new"]),
        ]

    def __str__(self) -> str:
        return self.name

    def save(self, *args, **kwargs):
        if not self.slug:
            self.slug = slugify(self.name)
        super().save(*args, **kwargs)

    @property
    def is_on_sale(self) -> bool:
        return bool(self.compare_price and self.compare_price > self.price)

    @property
    def discount_percent(self) -> int:
        if not self.is_on_sale or not self.compare_price:
            return 0
        diff = self.compare_price - self.price
        return int(round((diff / self.compare_price) * 100))


class ProductImage(models.Model):
    product = models.ForeignKey(
        Product, related_name="images", on_delete=models.CASCADE
    )
    url = models.URLField()
    alt_text = models.CharField(max_length=200, blank=True)
    is_primary = models.BooleanField(default=False)
    display_order = models.PositiveIntegerField(default=0)

    class Meta:
        db_table = "product_images"
        ordering = ["-is_primary", "display_order"]


class ProductTag(models.Model):
    product = models.ForeignKey(
        Product, related_name="tags", on_delete=models.CASCADE
    )
    tag = models.CharField(max_length=64)

    class Meta:
        db_table = "product_tags"
        unique_together = ("product", "tag")


class ProductConcern(models.Model):
    product = models.ForeignKey(
        Product, related_name="concerns", on_delete=models.CASCADE
    )
    concern = models.CharField(max_length=64)

    class Meta:
        db_table = "product_concerns"
        unique_together = ("product", "concern")


class WishlistItem(models.Model):
    user = models.ForeignKey(
        "users.User", related_name="wishlist", on_delete=models.CASCADE
    )
    product = models.ForeignKey(
        Product, related_name="wishlisted_by", on_delete=models.CASCADE
    )
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        db_table = "wishlists"
        unique_together = ("user", "product")
        ordering = ["-created_at"]
