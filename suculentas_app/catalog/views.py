from django.db.models import Min, Max
from django.http import Http404
from django.shortcuts import get_object_or_404, render

from .models import Category, Product
from .payments import get_checkout_provider


THEMES = {
    1: {
        "label": "Musgo",
        "bg": "#FFFFFF",
        "bg_soft": "#F4F6F3",
        "text": "#1F1F1F",
        "muted": "#777777",
        "line": "#E4E8E3",
        "accent": "#4F7A4F",
        "accent_dark": "#3F6340",
        "accent_soft": "#E8F0E8",
        "adbar": "#3F6340",
        "header_bg": "#FFFFFF",
        "btn_text": "#FFFFFF",
        "hero_bg": "#EEF2EC",
        "hero_title": "#4F7A4F",
        "footer_copy": "#EFEFEF",
    },
    2: {
        "label": "Escuro botanical",
        "bg": "#1A221A",
        "bg_soft": "#243024",
        "text": "#E8EDE8",
        "muted": "#A3B1A3",
        "line": "#2E3A2E",
        "accent": "#7BA87B",
        "accent_dark": "#6A946A",
        "accent_soft": "#2A352A",
        "adbar": "#7BA87B",
        "header_bg": "#141A14",
        "btn_text": "#142014",
        "hero_bg": "#121812",
        "hero_title": "#9BC49B",
        "footer_copy": "#121812",
    },
    3: {
        "label": "Terra suave",
        "bg": "#F7F4EF",
        "bg_soft": "#EFE8DE",
        "text": "#2C2A26",
        "muted": "#7A746A",
        "line": "#E5DFD4",
        "accent": "#6B7F5A",
        "accent_dark": "#556647",
        "accent_soft": "#E7EBDF",
        "adbar": "#6B7F5A",
        "header_bg": "#F7F4EF",
        "btn_text": "#FFFFFF",
        "hero_bg": "#EFE8DE",
        "hero_title": "#8B6B4A",
        "footer_copy": "#EBE5DB",
    },
}

PREVIEW_PRODUCTS = [
    {
        "name": "Echeveria Raindrops PT 11",
        "price": "R$ 28,00",
        "inst": "3 x de R$ 9,33",
        "img": "https://images.unsplash.com/photo-1509423350716-97f9360b4e09?auto=format&fit=crop&w=500&q=80",
    },
    {
        "name": "Graptoveria Lulu PT 9",
        "price": "R$ 18,00",
        "inst": "3 x de R$ 6,00",
        "img": "https://images.unsplash.com/photo-1485955900004-4eecf6f8bb41?auto=format&fit=crop&w=500&q=80",
    },
    {
        "name": "Haworthia Zebra PT 9",
        "price": "R$ 24,00",
        "inst": "3 x de R$ 8,00",
        "img": "https://images.unsplash.com/photo-1463936577429-48e3ccee649f?auto=format&fit=crop&w=500&q=80",
    },
    {
        "name": "Kit 6 Suculentas",
        "price": "R$ 69,00",
        "inst": "3 x de R$ 23,00",
        "img": "https://images.unsplash.com/photo-1416879595882-3373a0480b5b?auto=format&fit=crop&w=500&q=80",
    },
]


def home(request):
    featured = Product.objects.filter(available=True, featured=True)[:8]
    novidades = Product.objects.filter(available=True).order_by("-created_at", "order")[:8]
    categories = Category.objects.prefetch_related("products").all()
    products_by_slug = {
        cat.slug: list(cat.products.filter(available=True)[:12]) for cat in categories
    }
    return render(
        request,
        "catalog/home.html",
        {
            "featured": featured,
            "novidades": novidades,
            "categories": categories,
            "products_by_slug": products_by_slug,
        },
    )


def category_detail(request, slug):
    category = get_object_or_404(Category, slug=slug)
    products = Product.objects.filter(available=True, category=category)

    price_min = request.GET.get("de") or request.GET.get("min")
    price_max = request.GET.get("ate") or request.GET.get("max")
    sort = request.GET.get("ordenar", "relevancia")

    if price_min:
        try:
            products = products.filter(price__gte=float(price_min.replace(",", ".")))
        except ValueError:
            pass
    if price_max:
        try:
            products = products.filter(price__lte=float(price_max.replace(",", ".")))
        except ValueError:
            pass

    if sort == "menor-preco":
        products = products.order_by("price", "name")
    elif sort == "maior-preco":
        products = products.order_by("-price", "name")
    elif sort == "nome":
        products = products.order_by("name")
    else:
        products = products.order_by("order", "name")

    bounds = Product.objects.filter(available=True, category=category).aggregate(
        lo=Min("price"), hi=Max("price")
    )

    return render(
        request,
        "catalog/category.html",
        {
            "category": category,
            "products": products,
            "all_categories": Category.objects.all(),
            "price_min": price_min or "",
            "price_max": price_max or "",
            "sort": sort,
            "bound_min": bounds["lo"] or 0,
            "bound_max": bounds["hi"] or 0,
        },
    )


def checkout(request):
    provider = get_checkout_provider()
    return render(
        request,
        "catalog/checkout.html",
        {
            "checkout_provider": provider.name,
            "checkout_ready": provider.is_ready(),
        },
    )


def como_pedir(request):
    return render(request, "catalog/como_pedir.html")


def contato(request):
    return render(request, "catalog/contato.html")


def preview_cores(request):
    return render(request, "catalog/preview_index.html")


def preview_theme(request, n):
    try:
        n = int(n)
        theme = THEMES[n]
    except (TypeError, ValueError, KeyError):
        raise Http404("Opção inválida")
    return render(
        request,
        "catalog/preview_theme.html",
        {
            "n": n,
            "theme": theme,
            "label": theme["label"],
            "title": f"Opção {n} · {theme['label']}",
            "products": PREVIEW_PRODUCTS,
        },
    )
