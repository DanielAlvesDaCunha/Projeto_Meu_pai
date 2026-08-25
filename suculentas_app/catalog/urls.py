from django.urls import path

from . import views

urlpatterns = [
    path("", views.home, name="home"),
    path("pedido/", views.checkout, name="checkout"),
    path("como-pedir/", views.como_pedir, name="como_pedir"),
    path("contato/", views.contato, name="contato"),
    path("preview-cores/", views.preview_cores, name="preview_cores"),
    path("preview-cores/<int:n>/", views.preview_theme, name="preview_theme"),
    # URLs no padrão EST: /suculentas/, /cactos/, /kits/, /gibbifloras/
    path("<slug:slug>/", views.category_detail, name="category"),
]
