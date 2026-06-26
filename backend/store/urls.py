from django.urls import path
from .views import (
    CategoryListCreateView,
    CategoryDetailView,
    ProductListCreateView,
    ProductDetailView,
    CartView,
    AddToCartView,
    RemoveFromCartView,
    ClearCartView,
)

urlpatterns = [
    path("categories/", CategoryListCreateView.as_view(), name="category-list-create"),
    path("categories/<int:pk>/", CategoryDetailView.as_view(), name="category-detail"),

    path("products/", ProductListCreateView.as_view(), name="product-list-create"),
    path("products/<int:pk>/", ProductDetailView.as_view(), name="product-detail"),
    path("cart/", CartView.as_view(), name="cart"),
path("cart/add/", AddToCartView.as_view(), name="cart-add"),
path("cart/remove/<int:item_id>/", RemoveFromCartView.as_view(), name="cart-remove"),
path("cart/clear/", ClearCartView.as_view(), name="cart-clear"),
]