"""
Camada de checkout — hoje WhatsApp; Stripe entra sem reescrever o catálogo.

Uso futuro:
  from catalog.payments import get_checkout_provider
  provider = get_checkout_provider()
  return provider.start_checkout(request, cart_items, customer)

Com PAYMENT_PROVIDER=stripe, implementar StripeCheckout.start_checkout
criando uma Checkout Session e redirecionando para session.url.
"""

from django.conf import settings


class WhatsAppCheckout:
    """Checkout atual: monta pedido no front e abre wa.me."""

    name = "whatsapp"

    def is_ready(self) -> bool:
        return bool(settings.WHATSAPP_NUMBER)


class StripeCheckout:
    """Placeholder para cartão online (Stripe Checkout / Payment Element)."""

    name = "stripe"

    def is_ready(self) -> bool:
        return bool(
            getattr(settings, "STRIPE_SECRET_KEY", "")
            and getattr(settings, "STRIPE_PUBLISHABLE_KEY", "")
        )

    def start_checkout(self, request, cart_items, customer):
        raise NotImplementedError(
            "Stripe ainda não está ligado. Defina as chaves e implemente "
            "a Checkout Session quando for ativar pagamentos online."
        )


def get_checkout_provider():
    provider = (getattr(settings, "PAYMENT_PROVIDER", "whatsapp") or "whatsapp").lower()
    if provider == "stripe":
        return StripeCheckout()
    return WhatsAppCheckout()
