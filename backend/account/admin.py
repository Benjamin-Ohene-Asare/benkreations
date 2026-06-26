from django.contrib import admin

# Register your models here.
from django.contrib import admin
from django.contrib.auth.admin import UserAdmin

from .models import User, AuthLog, PasswordHistory


@admin.register(User)
class CustomUserAdmin(UserAdmin):
    model = User

    list_display = (
        "email",
        "first_name",
        "last_name",
        "role",
        "email_verified",
        "is_active",
        "is_staff",
    )

    list_filter = (
        "role",
        "email_verified",
        "is_active",
        "is_staff",
    )

    search_fields = (
        "email",
        "first_name",
        "last_name",
    )

    ordering = ("email",)

    fieldsets = UserAdmin.fieldsets + (
        ("Custom Fields", {
            "fields": (
                "role",
                "phone",
                "email_verified",
                "failed_login_attempts",
                "last_failed_login",
                "signup_ip_address",
            )
        }),
    )


@admin.register(AuthLog)
class AuthLogAdmin(admin.ModelAdmin):
    list_display = ("email", "action", "ip_address", "created_at")
    list_filter = ("action", "created_at")
    search_fields = ("email", "ip_address")
    readonly_fields = ("created_at",)


@admin.register(PasswordHistory)
class PasswordHistoryAdmin(admin.ModelAdmin):
    list_display = ("user", "created_at")
    search_fields = ("user__email",)
    readonly_fields = ("password_hash", "created_at")