import os
from rest_framework import serializers
from .models import Category, Product, ProductPreviewImage


ALLOWED_IMAGE_EXTENSIONS = [".jpg", ".jpeg", ".png", ".webp"]
ALLOWED_PSD_EXTENSIONS = [".psd"]
ALLOWED_ZIP_EXTENSIONS = [".zip"]

MAX_IMAGE_SIZE = 5 * 1024 * 1024
MAX_PSD_SIZE = 200 * 1024 * 1024
MAX_ZIP_SIZE = 300 * 1024 * 1024


def validate_file_extension(file, allowed_extensions, field_name):
    ext = os.path.splitext(file.name)[1].lower()

    if ext not in allowed_extensions:
        raise serializers.ValidationError(
            f"{field_name} must be one of: {', '.join(allowed_extensions)}"
        )


def validate_file_size(file, max_size, field_name):
    if file.size > max_size:
        max_mb = max_size // (1024 * 1024)
        raise serializers.ValidationError(
            f"{field_name} must not exceed {max_mb}MB."
        )


class CategorySerializer(serializers.ModelSerializer):
    label = serializers.CharField(source="name", read_only=True)
    products_count = serializers.SerializerMethodField()

    class Meta:
        model = Category
        fields = [
            "id",
            "name",
            "label",
            "slug",
            "description",
            "status",
            "products_count",
            "created_at",
        ]
        read_only_fields = [
            "id",
            "label",
            "slug",
            "products_count",
            "created_at",
        ]

    def get_products_count(self, obj):
        return obj.products.count()


class ProductPreviewImageSerializer(serializers.ModelSerializer):
    class Meta:
        model = ProductPreviewImage
        fields = ["id", "image", "created_at"]


class ProductSerializer(serializers.ModelSerializer):
    preview_images = ProductPreviewImageSerializer(many=True, read_only=True)

    uploaded_preview_images = serializers.ListField(
        child=serializers.ImageField(),
        write_only=True,
        required=True
    )

    category_name = serializers.CharField(source="category.name", read_only=True)

    class Meta:
        model = Product
        fields = [
            "id",
            "title",
            "slug",
            "category",
            "category_name",
            "short_description",
            "full_description",
            "price",
            "thumbnail",
            "psd_file",
            "zip_file",
            "tags",
            "status",
            "is_featured",
            "download_count",
            "sales_count",
            "preview_images",
            "uploaded_preview_images",
            "created_at",
            "updated_at",
        ]

        read_only_fields = [
            "id",
            "slug",
            "download_count",
            "sales_count",
            "created_at",
            "updated_at",
        ]

    def validate_price(self, value):
        if value < 0:
            raise serializers.ValidationError("Price cannot be negative.")

        if value > 999999:
            raise serializers.ValidationError("Price is too high.")

        return value

    def validate_thumbnail(self, file):
        validate_file_extension(file, ALLOWED_IMAGE_EXTENSIONS, "Thumbnail")
        validate_file_size(file, MAX_IMAGE_SIZE, "Thumbnail")
        return file

    def validate_psd_file(self, file):
        validate_file_extension(file, ALLOWED_PSD_EXTENSIONS, "PSD file")
        validate_file_size(file, MAX_PSD_SIZE, "PSD file")
        return file

    def validate_zip_file(self, file):
        if file:
            validate_file_extension(file, ALLOWED_ZIP_EXTENSIONS, "ZIP file")
            validate_file_size(file, MAX_ZIP_SIZE, "ZIP file")

        return file

    def validate_uploaded_preview_images(self, images):
        if not images:
            raise serializers.ValidationError("At least one preview image is required.")

        if len(images) > 8:
            raise serializers.ValidationError("You can upload a maximum of 8 preview images.")

        for image in images:
            validate_file_extension(image, ALLOWED_IMAGE_EXTENSIONS, "Preview image")
            validate_file_size(image, MAX_IMAGE_SIZE, "Preview image")

        return images

    def create(self, validated_data):
        preview_images = validated_data.pop("uploaded_preview_images", [])
        request = self.context.get("request")

        if request and request.user.is_authenticated:
            validated_data["uploaded_by"] = request.user

        product = Product.objects.create(**validated_data)

        for image in preview_images:
            ProductPreviewImage.objects.create(
                product=product,
                image=image
            )

        return product
    
from .models import Cart, CartItem


class CartItemSerializer(serializers.ModelSerializer):
    product_id = serializers.IntegerField(source="product.id", read_only=True)
    title = serializers.CharField(source="product.title", read_only=True)
    price = serializers.DecimalField(
        source="product.price",
        max_digits=10,
        decimal_places=2,
        read_only=True
    )
    thumbnail = serializers.ImageField(source="product.thumbnail", read_only=True)
    category_name = serializers.CharField(source="product.category.name", read_only=True)

    class Meta:
        model = CartItem
        fields = [
            "id",
            "product_id",
            "title",
            "price",
            "thumbnail",
            "category_name",
            "added_at",
        ]


class CartSerializer(serializers.ModelSerializer):
    items = CartItemSerializer(many=True, read_only=True)
    total_amount = serializers.SerializerMethodField()

    class Meta:
        model = Cart
        fields = ["id", "items", "total_amount", "created_at", "updated_at"]

    def get_total_amount(self, obj):
        return obj.total_amount()    
    