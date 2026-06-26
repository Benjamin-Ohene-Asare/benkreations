from django.contrib.auth.models import AbstractUser, BaseUserManager
from django.db import models
from django.utils import timezone


class UserManager(BaseUserManager):
    def create_user(self, email, password=None, **extra_fields):
        if not email:
            raise ValueError("Email address is required.")

        email = self.normalize_email(email.strip().lower())

        user = self.model(
            email=email,
            username=email,
            **extra_fields
        )

        user.set_password(password)
        user.save(using=self._db)

        PasswordHistory.objects.create(
            user=user,
            password_hash=user.password
        )

        return user

    def create_superuser(self, email, password=None, **extra_fields):
        extra_fields.setdefault("role", "admin")
        extra_fields.setdefault("is_staff", True)
        extra_fields.setdefault("is_superuser", True)
        extra_fields.setdefault("is_active", True)
        extra_fields.setdefault("email_verified", True)

        return self.create_user(email, password, **extra_fields)


class User(AbstractUser):
    ROLE_CHOICES = (
        ("admin", "Admin"),
        ("customer", "Customer"),
    )

    username = models.CharField(max_length=150, blank=True)
    email = models.EmailField(unique=True)

    phone = models.CharField(max_length=20, blank=True)

    role = models.CharField(
        max_length=20,
        choices=ROLE_CHOICES,
        default="customer",
    )

    email_verified = models.BooleanField(default=True)

    failed_login_attempts = models.PositiveIntegerField(default=0)
    last_failed_login = models.DateTimeField(null=True, blank=True)

    signup_ip_address = models.GenericIPAddressField(
        null=True,
        blank=True
    )

    is_active = models.BooleanField(default=True)

    USERNAME_FIELD = "email"
    REQUIRED_FIELDS = []

    objects = UserManager()

    def record_failed_login(self):
        self.failed_login_attempts += 1
        self.last_failed_login = timezone.now()
        self.save(
            update_fields=[
                "failed_login_attempts",
                "last_failed_login",
            ]
        )

    def reset_failed_login(self):
        self.failed_login_attempts = 0
        self.last_failed_login = None
        self.save(
            update_fields=[
                "failed_login_attempts",
                "last_failed_login",
            ]
        )

    def __str__(self):
        return self.email


class PasswordHistory(models.Model):
    user = models.ForeignKey(
        User,
        on_delete=models.CASCADE,
        related_name="password_history",
    )

    password_hash = models.CharField(max_length=255)

    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        ordering = ["-created_at"]

    def __str__(self):
        return f"{self.user.email} Password History"


class AuthLog(models.Model):
    ACTION_CHOICES = (
        ("register", "Register"),
        ("login_success", "Login Success"),
        ("login_failed", "Login Failed"),
        ("logout", "Logout"),
        ("password_changed", "Password Changed"),
        ("password_reset", "Password Reset"),
    )

    user = models.ForeignKey(
        User,
        on_delete=models.SET_NULL,
        null=True,
        blank=True,
    )

    email = models.EmailField(blank=True)

    action = models.CharField(
        max_length=30,
        choices=ACTION_CHOICES,
    )

    ip_address = models.GenericIPAddressField(
        null=True,
        blank=True,
    )

    user_agent = models.TextField(blank=True)

    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        ordering = ["-created_at"]

    def __str__(self):
        return f"{self.email} - {self.action}"