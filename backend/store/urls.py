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
    InitializePaymentView,
    VerifyPaymentView,
    OrderDownloadView,
    CustomerDashboardView,
    
)

urlpatterns = [
    # Categories
    path(
        "categories/",
        CategoryListCreateView.as_view(),
        name="category-list-create",
    ),
    path(
        "categories/<int:pk>/",
        CategoryDetailView.as_view(),
        name="category-detail",
    ),

    # Products
    path(
        "products/",
        ProductListCreateView.as_view(),
        name="product-list-create",
    ),
    path(
        "products/<int:pk>/",
        ProductDetailView.as_view(),
        name="product-detail",
    ),

    # Cart
    path("cart/", CartView.as_view(), name="cart"),
    path("cart/add/", AddToCartView.as_view(), name="cart-add"),
    path("cart/remove/<int:item_id>/", RemoveFromCartView.as_view(), name="cart-remove"),
    path("cart/clear/", ClearCartView.as_view(), name="cart-clear"),

    # Payments
    path(
        "payments/initialize/",
        InitializePaymentView.as_view(),
        name="payment-initialize",
    ),
    path(
        "payments/verify/",
        VerifyPaymentView.as_view(),
        name="payment-verify",
    ),
    
    path(
    "orders/<int:order_id>/downloads/",
    OrderDownloadView.as_view(),
    name="order-downloads",
),
    path("dashboard/", CustomerDashboardView.as_view(), name="customer-dashboard"),
]