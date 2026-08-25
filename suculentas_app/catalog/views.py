from django.shortcuts import get_object_or_404, render

from .models import Category, Product


def home(request):
    featured = Product.objects.filter(available=True, featured=True)[:8]
    categories = Category.objects.prefetch_related("products").all()
    products_by_slug = {
        cat.slug: cat.products.filter(available=True) for cat in categories
    }
    return render(
        request,
        "catalog/home.html",
        {
            "featured": featured,
            "categories": categories,
            "products_by_slug": products_by_slug,
        },
    )


def category_detail(request, slug):
    category = get_object_or_404(Category, slug=slug)
    products = category.products.filter(available=True)
    return render(
        request,
        "catalog/category.html",
        {"category": category, "products": products},
    )
