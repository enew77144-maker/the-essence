from django.urls import path

from .views import create_payment_intent, stripe_webhook

urlpatterns = [
    path("create-intent/", create_payment_intent, name="payments-create-intent"),
    path("webhook/", stripe_webhook, name="payments-webhook"),
]
