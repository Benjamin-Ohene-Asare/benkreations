from django.shortcuts import render

# Create your views here.
from rest_framework import generics, permissions
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from .models import Category, Product, Cart, CartItem
from .serializers import CategorySerializer, ProductSerializer, CartSerializer


class IsAdminOnly(permissions.BasePermission):
    def has_permission(self, request, view):
        return request.user and request.user.is_authenticated and request.user.role == "admin"


class CategoryListCreateView(generics.ListCreateAPIView):
    queryset = Category.objects.all()
    serializer_class = CategorySerializer

    def get_permissions(self):
        if self.request.method == "GET":
            return [permissions.AllowAny()]
        return [IsAdminOnly()]


class CategoryDetailView(generics.RetrieveUpdateDestroyAPIView):
    queryset = Category.objects.all()
    serializer_class = CategorySerializer
    permission_classes = [IsAdminOnly]

class ProductListCreateView(generics.ListCreateAPIView):
    serializer_class = ProductSerializer

    def get_queryset(self):
        queryset = Product.objects.select_related(
            "category"
        ).prefetch_related(
            "preview_images"
        )

        # Admin sees everything
        if (
            self.request.user.is_authenticated
            and getattr(self.request.user, "role", None) == "admin"
        ):
            return queryset

        queryset = queryset.filter(
            status="published",
            category__status="active"
        )

        featured = self.request.query_params.get("featured")

        if featured == "true":
            queryset = queryset.filter(is_featured=True)

        return queryset
class ProductDetailView(generics.RetrieveUpdateDestroyAPIView):
    queryset = Product.objects.select_related("category").prefetch_related("preview_images")
    serializer_class = ProductSerializer
    permission_classes = [IsAdminOnly]


class CartView(APIView):
    permission_classes = [permissions.IsAuthenticated]

    def get(self, request):
        cart, created = Cart.objects.get_or_create(user=request.user)
        serializer = CartSerializer(cart, context={"request": request})
        return Response(serializer.data)


class AddToCartView(APIView):
    permission_classes = [permissions.IsAuthenticated]

    def post(self, request):
        product_id = request.data.get("product_id")

        if not product_id:
            return Response(
                {"message": "Product ID is required."},
                status=status.HTTP_400_BAD_REQUEST
            )

        try:
            product = Product.objects.get(
                id=product_id,
                status="published",
                category__status="active"
            )
        except Product.DoesNotExist:
            return Response(
                {"message": "Product not found or unavailable."},
                status=status.HTTP_404_NOT_FOUND
            )

        cart, created = Cart.objects.get_or_create(user=request.user)

        CartItem.objects.get_or_create(
            cart=cart,
            product=product
        )

        serializer = CartSerializer(cart, context={"request": request})
        return Response(serializer.data, status=status.HTTP_200_OK)


class RemoveFromCartView(APIView):
    permission_classes = [permissions.IsAuthenticated]

    def delete(self, request, item_id):
        try:
            cart = Cart.objects.get(user=request.user)
            item = CartItem.objects.get(id=item_id, cart=cart)
            item.delete()
        except (Cart.DoesNotExist, CartItem.DoesNotExist):
            return Response(
                {"message": "Cart item not found."},
                status=status.HTTP_404_NOT_FOUND
            )

        serializer = CartSerializer(cart, context={"request": request})
        return Response(serializer.data)


class ClearCartView(APIView):
    permission_classes = [permissions.IsAuthenticated]

    def delete(self, request):
        cart, created = Cart.objects.get_or_create(user=request.user)
        cart.items.all().delete()

        serializer = CartSerializer(cart, context={"request": request})
        return Response(serializer.data)    