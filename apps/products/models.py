"""
Product models for the outfit recommendation system.
"""

from django.db import models
from django.core.validators import MinValueValidator, MaxValueValidator


class Product(models.Model):
    """
    Product model representing clothing items and accessories.
    """

    # Category choices
    CATEGORY_CHOICES = [
        ("top", "Top"),
        ("bottom", "Bottom"),
        ("footwear", "Footwear"),
        ("accessory", "Accessory"),
    ]

    # Style choices
    STYLE_CHOICES = [
        ("formal", "Formal"),
        ("smart_casual", "Smart Casual"),
        ("casual", "Casual"),
        ("sporty", "Sporty"),
    ]

    # Price range choices
    PRICE_RANGE_CHOICES = [
        ("budget", "Budget"),
        ("mid", "Mid-Range"),
        ("premium", "Premium"),
        ("luxury", "Luxury"),
    ]

    # Gender choices
    GENDER_CHOICES = [
        ("male", "Male"),
        ("female", "Female"),
        ("unisex", "Unisex"),
    ]

    # Basic fields
    name = models.CharField(max_length=255)
    category = models.CharField(max_length=20, choices=CATEGORY_CHOICES, db_index=True)
    sub_category = models.CharField(max_length=50)

    # Appearance
    color = models.CharField(max_length=50, db_index=True)
    image_url = models.URLField(blank=True, null=True)

    # Classification
    style = models.CharField(max_length=20, choices=STYLE_CHOICES, db_index=True)
    gender = models.CharField(max_length=10, choices=GENDER_CHOICES, default="unisex")

    # Pricing
    price = models.DecimalField(
        max_digits=10, decimal_places=2, validators=[MinValueValidator(0)]
    )
    price_range = models.CharField(max_length=20, choices=PRICE_RANGE_CHOICES)

    # Metadata
    sku = models.CharField(max_length=64, blank=True, null=True, db_index=True)
    description = models.TextField(blank=True, null=True)
    tags = models.JSONField(default=list, blank=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    is_active = models.BooleanField(default=True)

    class Meta:
        db_table = "products"
        ordering = ["category", "name"]
        indexes = [
            models.Index(fields=["category", "style"]),
            models.Index(fields=["category", "color"]),
            models.Index(fields=["style", "color"]),
        ]

    def __str__(self):
        return f"{self.name} ({self.category})"


class ProductOccasion(models.Model):
    """
    Many-to-many relationship for product occasions.
    """

    OCCASION_CHOICES = [
        ("office", "Office"),
        ("casual", "Casual"),
        ("party", "Party"),
        ("wedding", "Wedding"),
        ("date", "Date"),
        ("interview", "Interview"),
        ("beach", "Beach"),
        ("vacation", "Vacation"),
        ("weekend", "Weekend"),
        ("outdoor", "Outdoor"),
        ("formal", "Formal"),
        ("brunch", "Brunch"),
    ]

    product = models.ForeignKey(
        Product, on_delete=models.CASCADE, related_name="occasions"
    )
    occasion = models.CharField(max_length=20, choices=OCCASION_CHOICES)

    class Meta:
        db_table = "product_occasions"
        unique_together = ["product", "occasion"]

    def __str__(self):
        return f"{self.product.name} - {self.occasion}"


class ProductSeason(models.Model):
    """
    Many-to-many relationship for product seasons.
    """

    SEASON_CHOICES = [
        ("summer", "Summer"),
        ("winter", "Winter"),
        ("spring", "Spring"),
        ("fall", "Fall"),
        ("all", "All Seasons"),
    ]

    product = models.ForeignKey(
        Product, on_delete=models.CASCADE, related_name="seasons"
    )
    season = models.CharField(max_length=10, choices=SEASON_CHOICES)

    class Meta:
        db_table = "product_seasons"
        unique_together = ["product", "season"]

    def __str__(self):
        return f"{self.product.name} - {self.season}"
