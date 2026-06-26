import re
import bleach
from django.contrib.auth.password_validation import validate_password
from django.core.exceptions import ValidationError


def clean_text(value, field_name="Field", max_length=150):
    """
    Strip spaces, remove HTML, and limit text length.
    """
    if not value:
        return ""

    value = bleach.clean(value.strip(), tags=[], strip=True)

    if len(value) > max_length:
        raise ValidationError(f"{field_name} cannot exceed {max_length} characters.")

    return value


def normalize_email(email):
    """
    Normalize email: lowercase and remove spaces.
    """
    if not email:
        raise ValidationError("Email is required.")

    return email.strip().lower()


def validate_secure_password(password, user=None):
    """
    Enforce strong password rules.
    """
    if not password:
        raise ValidationError("Password is required.")

    if len(password) < 10:
        raise ValidationError("Password must be at least 10 characters long.")

    if password.isdigit():
        raise ValidationError("Password cannot be entirely numeric.")

    if re.search(r"\s", password):
        raise ValidationError("Password cannot contain spaces.")

    validate_password(password, user=user)

    return password