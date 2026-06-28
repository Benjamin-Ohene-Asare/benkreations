from django.shortcuts import render

from django.conf import settings
from django.contrib.auth import (
    get_user_model,
    update_session_auth_hash,
)
from django.contrib.auth.tokens import default_token_generator
from django.core.mail import send_mail
from django.utils.encoding import force_bytes, force_str
from django.utils.http import (
    urlsafe_base64_encode,
    urlsafe_base64_decode,
)

from rest_framework import status
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from rest_framework.views import APIView

from .serializers import (
    RegisterSerializer,
    LoginSerializer,
    UserProfileSerializer,
)

class RegisterView(APIView):
    authentication_classes = []
    permission_classes = []

    def post(self, request):
        serializer = RegisterSerializer(
            data=request.data,
            context={"request": request}
        )

        if serializer.is_valid():
            serializer.save()

            return Response(
                {
                    "message": "Account created successfully. Please verify your email before logging in."
                },
                status=status.HTTP_201_CREATED
            )

        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


class LoginView(APIView):
    authentication_classes = []
    permission_classes = []

    def post(self, request):
        serializer = LoginSerializer(
            data=request.data,
            context={"request": request}
        )

        if serializer.is_valid():
            return Response(serializer.validated_data, status=status.HTTP_200_OK)

        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
class UserProfileView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        serializer = UserProfileSerializer(request.user)

        return Response(
            {
                "user": serializer.data,
                "stats": {
                    "purchases": 0,
                    "total_orders": 0,
                    "completed": 0,
                }
            },
            status=status.HTTP_200_OK
        ) 
        
class ChangePasswordView(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request):
        old_password = request.data.get("old_password")
        new_password = request.data.get("new_password")
        confirm_password = request.data.get("confirm_password")

        if not old_password or not new_password or not confirm_password:
            return Response(
                {"message": "All password fields are required."},
                status=status.HTTP_400_BAD_REQUEST
            )

        if not request.user.check_password(old_password):
            return Response(
                {"message": "Current password is incorrect."},
                status=status.HTTP_400_BAD_REQUEST
            )

        if new_password != confirm_password:
            return Response(
                {"message": "New passwords do not match."},
                status=status.HTTP_400_BAD_REQUEST
            )

        if len(new_password) < 8:
            return Response(
                {"message": "Password must be at least 8 characters."},
                status=status.HTTP_400_BAD_REQUEST
            )

        request.user.set_password(new_password)
        request.user.save()

        update_session_auth_hash(request, request.user)

        return Response(
            {"message": "Password changed successfully."},
            status=status.HTTP_200_OK
        )        


User = get_user_model()


class ForgotPasswordView(APIView):
    authentication_classes = []
    permission_classes = []

    def post(self, request):
        email = request.data.get("email")

        if not email:
            return Response(
                {"message": "Email is required."},
                status=status.HTTP_400_BAD_REQUEST
            )

        user = User.objects.filter(email=email).first()

        # Always return the same response for security
        if not user:
            return Response(
                {
                    "message": "If an account with that email exists, a password reset link has been sent."
                },
                status=status.HTTP_200_OK,
            )

        uid = urlsafe_base64_encode(force_bytes(user.pk))
        token = default_token_generator.make_token(user)

        reset_link = (
            f"{settings.FRONTEND_URL}/reset-password/{uid}/{token}"
        )

        send_mail(
            subject="Reset Your Ben Kreations Password",
            message=f"""
Hello {user.first_name or user.email},

Click the link below to reset your password:

{reset_link}

If you did not request this, simply ignore this email.

Ben Kreations
""",
            from_email=settings.DEFAULT_FROM_EMAIL,
            recipient_list=[user.email],
            fail_silently=False,
        )

        return Response(
            {
                "message": "If an account with that email exists, a password reset link has been sent."
            },
            status=status.HTTP_200_OK,
        )

class ResetPasswordView(APIView):
    authentication_classes = []
    permission_classes = []

    def post(self, request, uid, token):
        password = request.data.get("password")
        confirm_password = request.data.get("confirm_password")

        if not password or not confirm_password:
            return Response(
                {"message": "Both password fields are required."},
                status=status.HTTP_400_BAD_REQUEST
            )

        if password != confirm_password:
            return Response(
                {"message": "Passwords do not match."},
                status=status.HTTP_400_BAD_REQUEST
            )

        if len(password) < 8:
            return Response(
                {"message": "Password must be at least 8 characters."},
                status=status.HTTP_400_BAD_REQUEST
            )

        try:
            user_id = force_str(urlsafe_base64_decode(uid))
            user = User.objects.get(pk=user_id)
        except Exception:
            return Response(
                {"message": "Invalid reset link."},
                status=status.HTTP_400_BAD_REQUEST
            )

        if not default_token_generator.check_token(user, token):
            return Response(
                {"message": "Reset link is invalid or has expired."},
                status=status.HTTP_400_BAD_REQUEST
            )

        user.set_password(password)
        user.save()

        return Response(
            {"message": "Password reset successfully."},
            status=status.HTTP_200_OK
        )