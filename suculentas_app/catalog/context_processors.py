from django.conf import settings


def store_settings(request):
    general = (
        f"Olá! Vi o site {settings.STORE_NAME} e quero saber o que tem disponível."
    )
    from urllib.parse import quote

    return {
        "STORE_NAME": settings.STORE_NAME,
        "WHATSAPP_NUMBER": settings.WHATSAPP_NUMBER,
        "WHATSAPP_LABEL": settings.WHATSAPP_LABEL,
        "WHATSAPP_GENERAL_URL": (
            f"https://wa.me/{settings.WHATSAPP_NUMBER}?text={quote(general)}"
        ),
    }
