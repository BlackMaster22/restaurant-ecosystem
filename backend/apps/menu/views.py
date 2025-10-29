from rest_framework import viewsets, permissions
from .models import Category, MenuItem
from .serializers import CategorySerializer, MenuItemSerializer
from apps.authentication.permissions import IsCashierOrAdmin

class CategoryViewSet(viewsets.ModelViewSet):
    queryset = Category.objects.all().order_by("order")
    serializer_class = CategorySerializer
    permission_classes = [permissions.IsAuthenticatedOrReadOnly, IsCashierOrAdmin]

class MenuItemViewSet(viewsets.ModelViewSet):
    queryset = MenuItem.objects.filter(is_active=True).select_related("category")
    serializer_class = MenuItemSerializer

    def get_permissions(self):
        if self.request.method in ["POST", "PUT", "PATCH", "DELETE"]:
            return [permissions.IsAuthenticated(), IsCashierOrAdmin()]
        return [permissions.AllowAny()]
