import uuid
import requests
from decimal import Decimal

from django.conf import settings

from rest_framework import generics, permissions, status
from rest_framework.views import APIView
from rest_framework.response import Response

from .models import (
    Category,
    Product,
    Cart,
    CartItem,
    Order,
    OrderItem,
    Transaction,
)

from .serializers import (
    CategorySerializer,
    ProductSerializer,
    CartSerializer,
)
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
    queryset = Product.objects.select_related(
        "category"
    ).prefetch_related(
        "preview_images"
    )
    serializer_class = ProductSerializer

    def get_permissions(self):
        if self.request.method == "GET":
            return [permissions.AllowAny()]

        return [IsAdminOnly()]

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
    
class InitializePaymentView(APIView):
    permission_classes = [permissions.IsAuthenticated]

    def post(self, request):
        cart, created = Cart.objects.get_or_create(user=request.user)
        cart_items = cart.items.select_related("product")

        if not cart_items.exists():
            return Response({"message": "Your cart is empty."}, status=400)

        total_amount = sum(item.product.price for item in cart_items)
        reference = f"BK-{uuid.uuid4().hex[:12].upper()}"

        order = Order.objects.create(
            user=request.user,
            total_amount=total_amount,
            status="pending",
            paystack_reference=reference,
        )

        for item in cart_items:
            OrderItem.objects.create(
                order=order,
                product=item.product,
                price=item.product.price,
            )

        Transaction.objects.create(
            user=request.user,
            order=order,
            reference=reference,
            amount=total_amount,
            status="pending",
        )

        payload = {
            "email": request.user.email,
            "amount": int(total_amount * Decimal("100")),
            "currency": "GHS",
            "reference": reference,
            "callback_url": f"{settings.FRONTEND_URL}/payment/success",
        }

        headers = {
            "Authorization": f"Bearer {settings.PAYSTACK_SECRET_KEY}",
            "Content-Type": "application/json",
        }

        res = requests.post(
            "https://api.paystack.co/transaction/initialize",
            json=payload,
            headers=headers,
            timeout=20,
        )

        data = res.json()

        if not data.get("status"):
            order.status = "failed"
            order.save()
            return Response({"message": "Payment initialization failed.", "paystack": data}, status=400)

        return Response({
            "message": "Payment initialized.",
            "authorization_url": data["data"]["authorization_url"],
            "reference": reference,
            "order_id": order.id,
        })  
        
class VerifyPaymentView(APIView):
    permission_classes = [permissions.IsAuthenticated]

    def get(self, request):
        reference = request.query_params.get("reference")

        if not reference:
            return Response({"message": "Payment reference is required."}, status=400)

        try:
            transaction = Transaction.objects.select_related("order").get(
                reference=reference,
                user=request.user,
            )
        except Transaction.DoesNotExist:
            return Response({"message": "Transaction not found."}, status=404)

        headers = {
            "Authorization": f"Bearer {settings.PAYSTACK_SECRET_KEY}",
        }

        res = requests.get(
            f"https://api.paystack.co/transaction/verify/{reference}",
            headers=headers,
            timeout=20,
        )

        data = res.json()
        transaction.paystack_response = data

        if data.get("status") and data.get("data", {}).get("status") == "success":
            amount_paid = Decimal(data["data"]["amount"]) / Decimal("100")

            if amount_paid >= transaction.amount:
                transaction.status = "success"
                transaction.order.status = "paid"
                transaction.order.save()

                Cart.objects.filter(user=request.user).delete()

                transaction.save()

                return Response({
                    "message": "Payment verified successfully.",
                    "status": "success",
                    "order_id": transaction.order.id,
                })

        transaction.status = "failed"
        transaction.order.status = "failed"
        transaction.order.save()
        transaction.save()

        return Response(
            {"message": "Payment verification failed.", "status": "failed"},
            status=400
        ) 

class OrderDownloadView(APIView):
    permission_classes = [permissions.IsAuthenticated]

    def get(self, request, order_id):
        try:
            order = Order.objects.prefetch_related("items__product").get(
                id=order_id,
                user=request.user,
                status="paid",
            )
        except Order.DoesNotExist:
            return Response(
                {"message": "Paid order not found."},
                status=status.HTTP_404_NOT_FOUND,
            )

        downloads = []

        for item in order.items.all():
            product = item.product

            downloads.append({
                "product_id": product.id,
                "title": product.title,
                "thumbnail": request.build_absolute_uri(product.thumbnail.url)
                if product.thumbnail else None,
                "psd_file": request.build_absolute_uri(product.psd_file.url)
                if product.psd_file else None,
                "zip_file": request.build_absolute_uri(product.zip_file.url)
                if product.zip_file else None,
            })

        return Response({
            "order_id": order.id,
            "status": order.status,
            "downloads": downloads,
        }) 
        

class CustomerDashboardView(APIView):
    permission_classes = [permissions.IsAuthenticated]

    def get(self, request):
        paid_orders = Order.objects.filter(user=request.user, status="paid").prefetch_related(
            "items__product"
        )

        all_orders = Order.objects.filter(user=request.user).order_by("-created_at")

        library = []
        for order in paid_orders:
            for item in order.items.all():
                product = item.product
                library.append({
                    "order_id": order.id,
                    "product_id": product.id,
                    "title": product.title,
                    "category": product.category.name,
                    "thumbnail": request.build_absolute_uri(product.thumbnail.url)
                    if product.thumbnail else None,

                    "price": str(item.price),
                    "created_at": order.created_at,

                    "psd_file": request.build_absolute_uri(product.psd_file.url)
                    if product.psd_file else None,

                    "zip_file": request.build_absolute_uri(product.zip_file.url)
                    if product.zip_file else None,
                })

        recent_orders = [
            {
                "id": order.id,
                "amount": str(order.total_amount),
                "status": order.status,
                "reference": order.paystack_reference,
                "created_at": order.created_at,
            }
            for order in all_orders[:5]
        ]

        return Response({
            "stats": {
                "purchases": len(library),
                "total_orders": all_orders.count(),
                "completed": paid_orders.count(),
            },
           "library": library,
            "orders": recent_orders,
        })                         