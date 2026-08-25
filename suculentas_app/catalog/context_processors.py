from urllib.parse import quote

from django.conf import settings

from .models import Category


def store_settings(request):
    general = (
        f"Olá! Vi o site {settings.STORE_NAME} e quero saber quais suculentas estão disponíveis."
    )
    return {
        "STORE_NAME": settings.STORE_NAME,
        "WHATSAPP_NUMBER": settings.WHATSAPP_NUMBER,
        "WHATSAPP_LABEL": settings.WHATSAPP_LABEL,
        "WHATSAPP_GENERAL_URL": (
            f"https://wa.me/{settings.WHATSAPP_NUMBER}?text={quote(general)}"
        ),
        "PAYMENT_PROVIDER": settings.PAYMENT_PROVIDER,
        "STRIPE_ENABLED": settings.STRIPE_ENABLED,
        "NAV_CATEGORIES": Category.objects.all(),
    }
