from decimal import Decimal
from urllib.parse import quote

from django.conf import settings
from django.db import models
from django.utils.text import slugify


class Category(models.Model):
    name = models.CharField("Nome", max_length=80)
    slug = models.SlugField(unique=True, blank=True)
    order = models.PositiveIntegerField("Ordem", default=0)

    class Meta:
        ordering = ["order", "name"]
        verbose_name = "Categoria"
        verbose_name_plural = "Categorias"

    def __str__(self):
        return self.name

    def save(self, *args, **kwargs):
        if not self.slug:
            self.slug = slugify(self.name)
        super().save(*args, **kwargs)


class Product(models.Model):
    category = models.ForeignKey(
        Category,
        on_delete=models.PROTECT,
        related_name="products",
        verbose_name="Categoria",
    )
    name = models.CharField("Nome", max_length=160)
    sku = models.CharField("SKU", max_length=40, blank=True)
    description = models.TextField("Descrição", blank=True)
    price = models.DecimalField("Preço", max_digits=10, decimal_places=2)
    old_price = models.DecimalField(
        "Preço anterior", max_digits=10, decimal_places=2, null=True, blank=True
    )
    image = models.ImageField("Foto", upload_to="products/", blank=True)
    featured = models.BooleanField("Destaque", default=False)
    available = models.BooleanField("Disponível", default=True)
    order = models.PositiveIntegerField("Ordem", default=0)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        ordering = ["order", "name"]
        verbose_name = "Produto"
        verbose_name_plural = "Produtos"

    def __str__(self):
        return self.name

    @property
    def discount_percent(self):
        if self.old_price and self.old_price > self.price:
            return int(round(((self.old_price - self.price) / self.old_price) * 100))
        return None

    @property
    def pix_price(self):
        return (self.price * Decimal("0.97")).quantize(Decimal("0.01"))

    @property
    def installment_text(self):
        price = float(self.price)
        if price < 20:
            n = 3
        else:
            n = min(6, max(3, int(price // 5)))
        parcela = self.price / Decimal(n)
        return f"{n} x de R$ {parcela:.2f}".replace(".", ",")

    @property
    def price_br(self):
        return f"R$ {self.price:.2f}".replace(".", ",")

    def whatsapp_url(self):
        number = settings.WHATSAPP_NUMBER
        text = f"Olá! Quero comprar: {self.name} ({self.price_br}). Ainda está disponível?"
        return f"https://wa.me/{number}?text={quote(text)}"
