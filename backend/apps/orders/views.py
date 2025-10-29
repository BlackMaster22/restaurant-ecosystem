from rest_framework import viewsets, permissions, status
from rest_framework.decorators import action
from rest_framework.response import Response
from .models import Order
from .serializers import OrderSerializer
from apps.authentication.permissions import IsCashierOrAdmin, IsWaiter

class OrderViewSet(viewsets.ModelViewSet):
    serializer_class = OrderSerializer
    queryset = Order.objects.all().order_by("-created_at")

    def get_permissions(self):
        if self.action in ["create"]:
            return [permissions.IsAuthenticated(), IsWaiter()]
        if self.action in ["update", "partial_update", "destroy", "change_status"]:
            return [permissions.IsAuthenticated(), IsCashierOrAdmin()]
        return [permissions.IsAuthenticated()]

    def get_queryset(self):
        user = self.request.user
        if not user.is_authenticated:
            return Order.objects.none()
        if user.is_admin() or user.is_cashier():
            return Order.objects.all().order_by("-created_at")
        if user.is_waiter():
            return Order.objects.filter(waiter=user).order_by("-created_at")
        return Order.objects.none()

    @action(detail=True, methods=["post"])
    def change_status(self, request, pk=None):
        order = self.get_object()
        new_status = request.data.get("status")
        if new_status not in dict(Order.STATUS_CHOICES):
            return Response({"detail": "Estado inválido"}, status=status.HTTP_400_BAD_REQUEST)
        order.status = new_status
        order.save()
        return Response({"status": order.status})
