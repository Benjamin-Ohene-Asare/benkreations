from django.contrib import admin
from .models import (
    Category,
    Product,
    ProductPreviewImage,
    Cart,
    CartItem,
    Order,
    OrderItem,
    Transaction,
)


@admin.register(Category)
class CategoryAdmin(admin.ModelAdmin):
    list_display = ("name", "slug", "status", "products_count", "created_at")
    list_filter = ("status",)
    search_fields = ("name", "slug")
    prepopulated_fields = {"slug": ("name",)}

    def products_count(self, obj):
        return obj.products.count()


class ProductPreviewImageInline(admin.TabularInline):
    model = ProductPreviewImage
    extra = 1


@admin.register(Product)
class ProductAdmin(admin.ModelAdmin):
    list_display = (
        "title",
        "category",
        "price",
        "status",
        "is_featured",
        "download_count",
        "sales_count",
        "created_at",
    )
    list_filter = ("status", "is_featured", "category")
    search_fields = ("title", "slug", "category__name")
    prepopulated_fields = {"slug": ("title",)}
    inlines = [ProductPreviewImageInline]


@admin.register(ProductPreviewImage)
class ProductPreviewImageAdmin(admin.ModelAdmin):
    list_display = ("product", "created_at")


@admin.register(Cart)
class CartAdmin(admin.ModelAdmin):
    list_display = ("id", "user", "created_at", "updated_at")
    search_fields = ("user__email",)


@admin.register(CartItem)
class CartItemAdmin(admin.ModelAdmin):
    list_display = ("cart", "product", "added_at")
    search_fields = ("cart__user__email", "product__title")


class OrderItemInline(admin.TabularInline):
    model = OrderItem
    extra = 0
    readonly_fields = ("product", "price")
    can_delete = False


@admin.register(Order)
class OrderAdmin(admin.ModelAdmin):
    list_display = (
        "id",
        "user",
        "total_amount",
        "status",
        "paystack_reference",
        "created_at",
    )
    list_filter = ("status", "created_at")
    search_fields = ("user__email", "paystack_reference")
    readonly_fields = (
        "user",
        "total_amount",
        "paystack_reference",
        "created_at",
    )
    inlines = [OrderItemInline]


@admin.register(OrderItem)
class OrderItemAdmin(admin.ModelAdmin):
    list_display = ("order", "product", "price")
    search_fields = (
        "order__paystack_reference",
        "product__title",
    )


@admin.register(Transaction)
class TransactionAdmin(admin.ModelAdmin):
    list_display = (
        "reference",
        "user",
        "amount",
        "status",
        "created_at",
    )
    list_filter = ("status",)
    search_fields = (
        "reference",
        "user__email",
    )
    readonly_fields = (
        "user",
        "order",
        "reference",
        "amount",
        "status",
        "paystack_response",
        "created_at",
    )