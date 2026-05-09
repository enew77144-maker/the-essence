from __future__ import annotations

import django_filters

from .models import Product


class ProductFilter(django_filters.FilterSet):
    category = django_filters.CharFilter(field_name="category__slug")
    min_price = django_filters.NumberFilter(field_name="price", lookup_expr="gte")
    max_price = django_filters.NumberFilter(field_name="price", lookup_expr="lte")
    tag = django_filters.CharFilter(field_name="tags__tag", lookup_expr="iexact")
    concern = django_filters.CharFilter(
        field_name="concerns__concern", lookup_expr="iexact"
    )
    min_rating = django_filters.NumberFilter(
        field_name="rating_avg", lookup_expr="gte"
    )
    is_featured = django_filters.BooleanFilter(field_name="is_featured")
    is_bestseller = django_filters.BooleanFilter(field_name="is_bestseller")
    is_new = django_filters.BooleanFilter(field_name="is_new")
    on_sale = django_filters.BooleanFilter(method="filter_on_sale")

    class Meta:
        model = Product
        fields: list[str] = []

    def filter_on_sale(self, queryset, name, value):
        if value:
            return queryset.filter(compare_price__isnull=False, compare_price__gt=models_price())
        return queryset


def models_price():
    from django.db.models import F

    return F("price")
