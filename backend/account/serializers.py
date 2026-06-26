import bleach

from django.contrib.auth import authenticate, get_user_model
from django.contrib.auth.password_validation import validate_password
from django.core.exceptions import ValidationError as DjangoValidationError

from rest_framework import serializers
from rest_framework_simplejwt.tokens import RefreshToken

from .models import AuthLog
from .validators import normalize_email

User = get_user_model()


class RegisterSerializer(serializers.ModelSerializer):
    password = serializers.CharField(
        write_only=True,
        min_length=10,
        style={"input_type": "password"},
    )
    confirm_password = serializers.CharField(
        write_only=True,
        style={"input_type": "password"},
    )

    class Meta:
        model = User
        fields = (
            "first_name",
            "last_name",
            "email",
            "phone",
            "password",
            "confirm_password",
        )

    def validate_first_name(self, value):
        value = bleach.clean(value.strip(), tags=[], strip=True)
        if len(value) > 100:
            raise serializers.ValidationError("First name cannot exceed 100 characters.")
        return value

    def validate_last_name(self, value):
        value = bleach.clean(value.strip(), tags=[], strip=True)
        if len(value) > 100:
            raise serializers.ValidationError("Last name cannot exceed 100 characters.")
        return value

    def validate_email(self, value):
        value = normalize_email(value)
        if User.objects.filter(email=value).exists():
            raise serializers.ValidationError("An account with this email already exists.")
        return value

    def validate_password(self, value):
        try:
            validate_password(value)
        except DjangoValidationError as e:
            raise serializers.ValidationError(e.messages)

        if value.isdigit():
            raise serializers.ValidationError("Password cannot be entirely numeric.")

        return value

    def validate(self, attrs):
        if attrs["password"] != attrs["confirm_password"]:
            raise serializers.ValidationError({
                "confirm_password": "Passwords do not match."
            })
        return attrs

    def create(self, validated_data):
        validated_data.pop("confirm_password")
        password = validated_data.pop("password")

        request = self.context.get("request")
        signup_ip = None

        if request:
            forwarded = request.META.get("HTTP_X_FORWARDED_FOR")
            signup_ip = forwarded.split(",")[0].strip() if forwarded else request.META.get("REMOTE_ADDR")

        user = User.objects.create_user(
            password=password,
            signup_ip_address=signup_ip,
            **validated_data,
        )

        AuthLog.objects.create(
            user=user,
            email=user.email,
            action="register",
            ip_address=signup_ip,
            user_agent=request.META.get("HTTP_USER_AGENT", "") if request else "",
        )

        return user


class LoginSerializer(serializers.Serializer):
    email = serializers.EmailField()
    password = serializers.CharField(
        write_only=True,
        style={"input_type": "password"},
    )

    def validate_email(self, value):
        return normalize_email(value)

    def validate(self, attrs):
        request = self.context.get("request")
        email = attrs.get("email")
        password = attrs.get("password")

        ip_address = None
        user_agent = ""

        if request:
            forwarded = request.META.get("HTTP_X_FORWARDED_FOR")
            ip_address = forwarded.split(",")[0].strip() if forwarded else request.META.get("REMOTE_ADDR")
            user_agent = request.META.get("HTTP_USER_AGENT", "")

        existing_user = User.objects.filter(email=email).first()

        if existing_user and existing_user.failed_login_attempts >= 5:
            AuthLog.objects.create(
                user=existing_user,
                email=email,
                action="login_failed",
                ip_address=ip_address,
                user_agent=user_agent,
            )
            raise serializers.ValidationError(
                "Account locked because of too many failed login attempts. Please contact support."
            )

        user = authenticate(
            request=request,
            username=email,
            password=password,
        )

        if not user:
            if existing_user:
                existing_user.record_failed_login()

            AuthLog.objects.create(
                user=existing_user,
                email=email,
                action="login_failed",
                ip_address=ip_address,
                user_agent=user_agent,
            )

            raise serializers.ValidationError("Invalid email or password.")

      

        if not user.is_active:
            raise serializers.ValidationError("Your account is not active.")

        user.reset_failed_login()

        AuthLog.objects.create(
            user=user,
            email=user.email,
            action="login_success",
            ip_address=ip_address,
            user_agent=user_agent,
        )

        refresh = RefreshToken.for_user(user)

        return {
            "refresh": str(refresh),
            "access": str(refresh.access_token),
            "user": {
                "id": user.id,
                "first_name": user.first_name,
                "last_name": user.last_name,
                "email": user.email,
                "phone": user.phone,
                "role": user.role,
            },
        }


class UserProfileSerializer(serializers.ModelSerializer):
    name = serializers.SerializerMethodField()
    avatar = serializers.SerializerMethodField()
    member_since = serializers.SerializerMethodField()

    class Meta:
        model = User
        fields = (
            "id",
            "name",
            "first_name",
            "last_name",
            "email",
            "phone",
            "role",
            "avatar",
            "member_since",
        )

    def get_name(self, obj):
        full_name = f"{obj.first_name} {obj.last_name}".strip()
        return full_name or obj.email

    def get_avatar(self, obj):
        first = obj.first_name[:1] if obj.first_name else ""
        last = obj.last_name[:1] if obj.last_name else ""

        initials = f"{first}{last}".upper()

        if initials:
            return initials

        return obj.email[:1].upper()

    def get_member_since(self, obj):
        return obj.date_joined.strftime("%B %Y")       