from django.db import models
from django.contrib.auth.models import AbstractUser

class User(AbstractUser):
    ROLE_WAITER = "WAITER"
    ROLE_CASHIER = "CASHIER"
    ROLE_ADMIN = "ADMIN"
    ROLE_CHOICES = [
        (ROLE_WAITER, "Camarero"),
        (ROLE_CASHIER, "Caja"),
        (ROLE_ADMIN, "Admin"),
    ]

    role = models.CharField(max_length=20, choices=ROLE_CHOICES, default=ROLE_WAITER)

    def is_waiter(self):
        return self.role == self.ROLE_WAITER

    def is_cashier(self):
        return self.role == self.ROLE_CASHIER

    def is_admin(self):
        return self.role == self.ROLE_ADMIN
