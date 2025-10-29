from django.db import models
from django.conf import settings

class Order(models.Model):
    STATUS_PENDING = "PENDING"
    STATUS_PREPARING = "PREPARING"
    STATUS_READY = "READY"
    STATUS_DELIVERED = "DELIVERED"
    STATUS_CANCELLED = "CANCELLED"

    STATUS_CHOICES = [
        (STATUS_PENDING, "Pendiente"),
        (STATUS_PREPARING, "En preparación"),
        (STATUS_READY, "Listo"),
        (STATUS_DELIVERED, "Entregado"),
        (STATUS_CANCELLED, "Cancelado"),
    ]

    table = models.CharField(max_length=50)
    waiter = models.ForeignKey(settings.AUTH_USER_MODEL, related_name="orders", on_delete=models.SET_NULL, null=True)
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default=STATUS_PENDING)
    total = models.DecimalField(max_digits=10, decimal_places=2, default=0)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return f"Order {self.id} - Table {self.table}"

class OrderItem(models.Model):
    order = models.ForeignKey(Order, related_name="items", on_delete=models.CASCADE)
    menu_item = models.ForeignKey("apps.menu.MenuItem", on_delete=models.PROTECT)
    quantity = models.PositiveIntegerField(default=1)
    notes = models.TextField(blank=True)
    options = models.JSONField(default=dict, blank=True)
    price_at_order = models.DecimalField(max_digits=8, decimal_places=2)

    def __str__(self):
        return f"{self.quantity} x {self.menu_item.name}"
