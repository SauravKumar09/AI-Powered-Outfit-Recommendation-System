"""DRF serializers for products."""

from rest_framework import serializers

from .models import Product, ProductOccasion, ProductSeason


class ProductOccasionSerializer(serializers.ModelSerializer):
    class Meta:
        model = ProductOccasion
        fields = ["occasion"]


class ProductSeasonSerializer(serializers.ModelSerializer):
    class Meta:
        model = ProductSeason
        fields = ["season"]


class ProductSerializer(serializers.ModelSerializer):
    occasions = ProductOccasionSerializer(many=True, read_only=True)
    seasons = ProductSeasonSerializer(many=True, read_only=True)

    class Meta:
        model = Product
        fields = [
            "id",
            "sku",
            "name",
            "category",
            "sub_category",
            "color",
            "image_url",
            "description",
            "style",
            "gender",
            "price",
            "price_range",
            "tags",
            "is_active",
            "created_at",
            "updated_at",
            "occasions",
            "seasons",
        ]


class ProductListSerializer(serializers.ModelSerializer):
    class Meta:
        model = Product
        fields = [
            "id",
            "sku",
            "name",
            "category",
            "color",
            "price",
            "image_url",
            "style",
        ]


class ProductCreateSerializer(serializers.ModelSerializer):
    occasions = serializers.ListField(
        child=serializers.CharField(), write_only=True, required=False
    )
    seasons = serializers.ListField(
        child=serializers.CharField(), write_only=True, required=False
    )

    class Meta:
        model = Product
        fields = [
            "id",
            "name",
            "category",
            "sub_category",
            "color",
            "image_url",
            "style",
            "gender",
            "price",
            "price_range",
            "tags",
            "sku",
            "description",
            "occasions",
            "seasons",
        ]

    def create(self, validated_data):
        occasions = validated_data.pop("occasions", [])
        seasons = validated_data.pop("seasons", [])
        product = Product.objects.create(**validated_data)
        for occ in occasions:
            ProductOccasion.objects.create(product=product, occasion=occ)
        for sea in seasons:
            ProductSeason.objects.create(product=product, season=sea)
        return product
