from django.urls import path

from .views import ProductReviewListCreateView, ReviewDeleteView

urlpatterns = [
    path(
        "products/<slug:slug>/reviews/",
        ProductReviewListCreateView.as_view(),
        name="product-reviews",
    ),
    path(
        "reviews/<int:pk>/",
        ReviewDeleteView.as_view(),
        name="review-detail",
    ),
]
