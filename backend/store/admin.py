from django.contrib import admin

# Register your models here.
from django.contrib import admin
from .models import Category, Product, ProductPreviewImage


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