"""
Recommendation serializers.
"""

from rest_framework import serializers


class PreferencesSerializer(serializers.Serializer):
    """Serializer for recommendation preferences."""

    occasion = serializers.CharField(required=False, allow_blank=True)
    season = serializers.CharField(required=False, allow_blank=True)
    budget = serializers.CharField(required=False, allow_blank=True)
    limit = serializers.IntegerField(
        required=False, default=5, min_value=1, max_value=20
    )


class OutfitItemSerializer(serializers.Serializer):
    """Serializer for an outfit item."""

    id = serializers.IntegerField()
    name = serializers.CharField()
    category = serializers.CharField()
    sub_category = serializers.CharField()
    color = serializers.CharField()
    style = serializers.CharField()
    price = serializers.FloatField()
    price_range = serializers.CharField()
    image_url = serializers.URLField(allow_blank=True, allow_null=True)


class ScoreBreakdownSerializer(serializers.Serializer):
    """Serializer for score breakdown."""

    color_harmony = serializers.FloatField()
    style_match = serializers.FloatField()
    occasion_fit = serializers.FloatField()
    season_match = serializers.FloatField()
    budget_alignment = serializers.FloatField()


class ScoreExplanationSerializer(serializers.Serializer):
    """Serializer for score explanation."""

    rating = serializers.CharField()
    details = serializers.ListField(child=serializers.CharField())


class OutfitRecommendationSerializer(serializers.Serializer):
    """Serializer for a complete outfit recommendation."""

    id = serializers.CharField()
    top = OutfitItemSerializer()
    bottom = OutfitItemSerializer()
    footwear = OutfitItemSerializer()
    accessories = OutfitItemSerializer(many=True)
    total_price = serializers.FloatField()
    score = serializers.FloatField()
    score_breakdown = ScoreBreakdownSerializer()
    explanation = ScoreExplanationSerializer()


class RecommendationResponseSerializer(serializers.Serializer):
    """Serializer for the complete recommendation response."""

    success = serializers.BooleanField(default=True)
    base_product = OutfitItemSerializer()
    recommendations = OutfitRecommendationSerializer(many=True)
    metadata = serializers.DictField()
    cached = serializers.BooleanField()
    response_time_ms = serializers.FloatField()
