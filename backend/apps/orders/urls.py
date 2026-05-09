from django.urls import include, path
from rest_framework.routers import DefaultRouter

from .views import OrderByNumberView, OrderViewSet

router = DefaultRouter()
router.register(r"", OrderViewSet, basename="order")

urlpatterns = [
    path(
        "by-number/<str:order_number>/",
        OrderByNumberView.as_view(),
        name="order-by-number",
    ),
    path("", include(router.urls)),
]
