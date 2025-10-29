# Backend — Restaurant Ecosystem

Setup (desarrollo):
- python -m venv env && source env/bin/activate
- pip install -r requirements.txt
- cp .env.example .env (configurar variables)
- python manage.py migrate
- python manage.py createsuperuser
- python manage.py runserver

Endpoints:
- /api/auth/login/  (POST) -> obtener tokens
- /api/auth/token/refresh/
- /api/menu/items/
- /api/orders/

Notes:
- AUTH_USER_MODEL está en apps.authentication.User
- Para real-time, configurar Channels y Redis (opcional)
