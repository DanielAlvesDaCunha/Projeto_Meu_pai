from django.contrib import admin

from .models import Category, Product


@admin.register(Category)
class CategoryAdmin(admin.ModelAdmin):
    list_display = ("name", "slug", "order")
    prepopulated_fields = {"slug": ("name",)}
    search_fields = ("name",)


@admin.register(Product)
class ProductAdmin(admin.ModelAdmin):
    list_display = (
        "name",
        "category",
        "price",
        "featured",
        "available",
        "order",
    )
    list_filter = ("category", "featured", "available")
    search_fields = ("name", "sku")
    list_editable = ("price", "featured", "available", "order")
