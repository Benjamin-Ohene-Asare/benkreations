from django.urls import path
from .views import (
    RegisterView,
    LoginView,
    UserProfileView,
    ChangePasswordView,
    ForgotPasswordView,
    ResetPasswordView,
)

urlpatterns = [
    path("signup/", RegisterView.as_view(), name="signup"),
    path("login/", LoginView.as_view(), name="login"),
    path("profile/", UserProfileView.as_view(), name="profile"),
    path("change-password/", ChangePasswordView.as_view(), name="change-password"),
    path("forgot-password/", ForgotPasswordView.as_view(), name="forgot-password"),
    path(
        "reset-password/<str:uid>/<str:token>/",
        ResetPasswordView.as_view(),
        name="reset-password",
    ),
]