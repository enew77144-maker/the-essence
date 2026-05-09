from __future__ import annotations

from rest_framework import generics, permissions, status, viewsets
from rest_framework.decorators import action
from rest_framework.response import Response

from .models import Order
from .serializers import CreateOrderSerializer, OrderSerializer


class OrderViewSet(viewsets.ModelViewSet):
    serializer_class = OrderSerializer
    permission_classes = [permissions.AllowAny]
    http_method_names = ["get", "post", "patch"]

    def get_queryset(self):
        if self.request.user.is_authenticated:
            return (
                Order.objects.filter(user=self.request.user)
                .prefetch_related("items")
                .order_by("-created_at")
            )
        return Order.objects.none()

    def create(self, request, *args, **kwargs):
        serializer = CreateOrderSerializer(data=request.data, context={"request": request})
        serializer.is_valid(raise_exception=True)
        order = serializer.save()
        return Response(OrderSerializer(order).data, status=status.HTTP_201_CREATED)

    @action(detail=True, methods=["patch"], url_path="cancel")
    def cancel(self, request, pk=None):
        order = self.get_object()
        if order.status not in (Order.Status.PENDING, Order.Status.PROCESSING):
            return Response(
                {"detail": "Order cannot be cancelled at this stage."},
                status=400,
            )
        order.status = Order.Status.CANCELLED
        order.save(update_fields=["status"])
        return Response(OrderSerializer(order).data)


class OrderByNumberView(generics.RetrieveAPIView):
    serializer_class = OrderSerializer
    permission_classes = [permissions.AllowAny]
    queryset = Order.objects.all().prefetch_related("items")
    lookup_field = "order_number"
