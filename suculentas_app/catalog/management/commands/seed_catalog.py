from decimal import Decimal
from io import BytesIO
from pathlib import Path

import requests
from django.core.files.base import ContentFile
from django.core.management.base import BaseCommand

from catalog.models import Category, Product

SAMPLES = [
    {
        "category": "suculentas",
        "name": "Echeveria Raindrops PT 11",
        "sku": "ECH-RAIN-11",
        "price": "28.00",
        "old_price": "32.00",
        "featured": True,
        "url": "https://images.unsplash.com/photo-1509423350716-97f9360b4e09?auto=format&fit=crop&w=900&q=80",
        "file": "echeveria-raindrops.jpg",
    },
    {
        "category": "suculentas",
        "name": "Graptoveria Lulu PT 9",
        "sku": "GRA-LULU-09",
        "price": "18.00",
        "old_price": "22.00",
        "featured": True,
        "url": "https://images.unsplash.com/photo-1485955900004-4eecf6f8bb41?auto=format&fit=crop&w=900&q=80",
        "file": "graptopetalum.jpg",
    },
    {
        "category": "suculentas",
        "name": "Echeveria Roman PT 9",
        "sku": "ECH-ROM-09",
        "price": "16.00",
        "old_price": None,
        "featured": True,
        "url": "https://images.unsplash.com/photo-1512428813834-c702c7702b78?auto=format&fit=crop&w=900&q=80",
        "file": "echeveria-roman.jpg",
    },
    {
        "category": "suculentas",
        "name": "Haworthia Zebra PT 9",
        "sku": "HAW-ZEB-09",
        "price": "24.00",
        "old_price": "29.00",
        "featured": True,
        "url": "https://images.unsplash.com/photo-1463936577429-48e3ccee649f?auto=format&fit=crop&w=900&q=80",
        "file": "haworthia.jpg",
    },
    {
        "category": "kits",
        "name": "Kit 6 Suculentas Variadas PT 6",
        "sku": "KIT-SUC-06",
        "price": "69.00",
        "old_price": "84.00",
        "featured": False,
        "url": "https://images.unsplash.com/photo-1416879595882-3373a0480b5b?auto=format&fit=crop&w=900&q=80",
        "file": "kit-suculentas.jpg",
    },
    {
        "category": "kits",
        "name": "Sedum Burrito PT 11",
        "sku": "SED-BUR-11",
        "price": "32.00",
        "old_price": "38.00",
        "featured": False,
        "url": "https://images.unsplash.com/photo-1459411552884-841db9b3aa2f?auto=format&fit=crop&w=900&q=80",
        "file": "sedum-burrito.jpg",
    },
    {
        "category": "kits",
        "name": "Crassula Ovata PT 11",
        "sku": "CRA-OVA-11",
        "price": "35.00",
        "old_price": None,
        "featured": False,
        "url": "https://images.unsplash.com/photo-1501004318641-b39e64514be8?auto=format&fit=crop&w=900&q=80",
        "file": "crassula.jpg",
    },
    {
        "category": "kits",
        "name": "Aloe Vera Mini PT 9",
        "sku": "ALO-MIN-09",
        "price": "22.00",
        "old_price": "26.00",
        "featured": False,
        "url": "https://images.unsplash.com/photo-1509423350716-97f9360b4e09?auto=format&fit=crop&w=900&q=80&sat=-30",
        "file": "aloe-mini.jpg",
    },
    {
        "category": "cactos",
        "name": "Cacto Variado PT 6",
        "sku": "CAC-VAR-06",
        "price": "14.00",
        "old_price": "18.00",
        "featured": False,
        "url": "https://images.unsplash.com/photo-1509937528035-ad76254b0356?auto=format&fit=crop&w=900&q=80",
        "file": "cacto-variado.jpg",
    },
    {
        "category": "cactos",
        "name": "Opuntia Microdasys PT 9",
        "sku": "OPU-MIC-09",
        "price": "26.00",
        "old_price": None,
        "featured": False,
        "url": "https://images.unsplash.com/photo-1519331379826-f10be5486c6f?auto=format&fit=crop&w=900&q=80",
        "file": "opuntia.jpg",
    },
    {
        "category": "cactos",
        "name": "Echinocactus Grusonii PT 11",
        "sku": "ECH-GRU-11",
        "price": "39.00",
        "old_price": "45.00",
        "featured": False,
        "url": "https://images.unsplash.com/photo-1459411552884-841db9b3aa2f?auto=format&fit=crop&w=900&q=80&sat=-40",
        "file": "echinocactus.jpg",
    },
    {
        "category": "cactos",
        "name": "Mammillaria PT 9",
        "sku": "MAM-PT-09",
        "price": "20.00",
        "old_price": "24.00",
        "featured": False,
        "url": "https://images.unsplash.com/photo-1512428813834-c702c7702b78?auto=format&fit=crop&w=900&q=80&sat=-50",
        "file": "mammillaria.jpg",
    },
]

CATEGORIES = [
    ("suculentas", "Suculentas", 1),
    ("cactos", "Cactos", 2),
    ("kits", "Kits", 3),
]


class Command(BaseCommand):
    help = "Cria categorias/produtos e baixa fotos reais para o catálogo"

    def handle(self, *args, **options):
        cats = {}
        for slug, name, order in CATEGORIES:
            cat, _ = Category.objects.get_or_create(
                slug=slug, defaults={"name": name, "order": order}
            )
            if cat.name != name or cat.order != order:
                cat.name = name
                cat.order = order
                cat.save(update_fields=["name", "order"])
            cats[slug] = cat

        # Remove categoria de lista que não usamos (Gibbifloras)
        gibb = Category.objects.filter(slug="gibbifloras").first()
        if gibb:
            Product.objects.filter(category=gibb).delete()
            gibb.delete()
            self.stdout.write("Removida categoria gibbifloras")

        created = 0
        for item in SAMPLES:
            product, was_created = Product.objects.get_or_create(
                sku=item["sku"],
                defaults={
                    "category": cats[item["category"]],
                    "name": item["name"],
                    "price": Decimal(item["price"]),
                    "old_price": Decimal(item["old_price"]) if item["old_price"] else None,
                    "featured": item["featured"],
                    "available": True,
                    "description": "Planta selecionada. Pedido pelo WhatsApp.",
                },
            )
            if was_created:
                created += 1

            if not product.image:
                self._attach_image(product, item["url"], item["file"])

        self.stdout.write(self.style.SUCCESS(f"Seed ok. Novos produtos: {created}"))

    def _attach_image(self, product, url, filename):
        try:
            response = requests.get(url, timeout=30)
            response.raise_for_status()
            product.image.save(filename, ContentFile(response.content), save=True)
            self.stdout.write(f"Foto: {filename}")
        except Exception as exc:  # noqa: BLE001
            self.stdout.write(self.style.WARNING(f"Falha foto {filename}: {exc}"))
