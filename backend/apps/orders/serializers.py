from rest_framework import serializers
from .models import Order, OrderItem
from apps.menu.serializers import MenuItemSerializer
from apps.menu.models import MenuItem
from decimal import Decimal

class OrderItemSerializer(serializers.ModelSerializer):
    menu_item = MenuItemSerializer(read_only=True)
    menu_item_id = serializers.PrimaryKeyRelatedField(queryset=MenuItem.objects.all(), source="menu_item", write_only=True)

    class Meta:
        model = OrderItem
        fields = ("id", "menu_item", "menu_item_id", "quantity", "notes", "options", "price_at_order")

class OrderSerializer(serializers.ModelSerializer):
    items = OrderItemSerializer(many=True)
    waiter = serializers.PrimaryKeyRelatedField(read_only=True)

    class Meta:
        model = Order
        fields = ("id", "table", "waiter", "status", "total", "items", "created_at", "updated_at")

    def create(self, validated_data):
        items_data = validated_data.pop("items", [])
        request = self.context.get("request")
        if request and request.user.is_authenticated:
            validated_data["waiter"] = request.user
        order = Order.objects.create(**validated_data)
        total = Decimal("0.00")
        for item in items_data:
            menu_item = item["menu_item"]
            quantity = item.get("quantity", 1)
            price = menu_item.price
            price_at_order = price
            OrderItem.objects.create(
                order=order,
                menu_item=menu_item,
                quantity=quantity,
                notes=item.get("notes", ""),
                options=item.get("options", {}),
                price_at_order=price_at_order,
            )
            total += (price_at_order * quantity)
        order.total = total
        order.save()
        return order

    def update(self, instance, validated_data):
        items_data = validated_data.pop("items", None)
        for attr, val in validated_data.items():
            setattr(instance, attr, val)
        if items_data is not None:
            instance.items.all().delete()
            total = Decimal("0.00")
            for item in items_data:
                menu_item = item["menu_item"]
                quantity = item.get("quantity", 1)
                price_at_order = menu_item.price
                OrderItem.objects.create(
                    order=instance,
                    menu_item=menu_item,
                    quantity=quantity,
                    notes=item.get("notes", ""),
                    options=item.get("options", {}),
                    price_at_order=price_at_order,
                )
                total += (price_at_order * quantity)
            instance.total = total
        instance.save()
        return instance
