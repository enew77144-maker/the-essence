from django.urls import path

from .views import CartViewSet

urlpatterns = [
    path("", CartViewSet.as_view({"get": "list"}), name="cart-detail"),
    path("items/", CartViewSet.as_view({"post": "add_item"}), name="cart-add-item"),
    path(
        "items/<int:item_id>/",
        CartViewSet.as_view({"patch": "update_item", "delete": "remove_item"}),
        name="cart-item",
    ),
    path(
        "apply-discount/",
        CartViewSet.as_view({"post": "apply_discount"}),
        name="cart-apply-discount",
    ),
    path(
        "discount/",
        CartViewSet.as_view({"delete": "remove_discount"}),
        name="cart-remove-discount",
    ),
]
