"""
Main recommendation service that orchestrates outfit generation.
"""

import logging
import time
import hashlib
import json
from typing import Dict, List, Optional, Any
from decimal import Decimal

from django.core.cache import cache
from django.conf import settings

from apps.products.models import Product
from .color_service import ColorService
from .scoring_service import ScoringService
from .constants import STYLE_COMPATIBILITY, OUTFIT_CATEGORIES

logger = logging.getLogger(__name__)


class RecommendationService:
    """
    Main service for generating outfit recommendations.
    """

    CACHE_TTL = getattr(settings, "CACHE_TTL", 300)  # 5 minutes default
    MAX_COMBINATIONS = 30
    MAX_PER_CATEGORY = 4

    @classmethod
    def generate_recommendations(
        cls,
        base_product_id: int,
        preferences: Optional[Dict[str, str]] = None,
        limit: int = 3,
    ) -> Dict[str, Any]:
        """
        Generate outfit recommendations based on a base product.

        Args:
            base_product_id: The ID of the product to build outfit around
            preferences: User preferences (occasion, season, budget)
            limit: Maximum number of outfits to return

        Returns:
            Dictionary containing recommendations and metadata
        """
        start_time = time.time()
        preferences = preferences or {}

        # Generate cache key
        cache_key = cls._generate_cache_key(base_product_id, preferences, limit)

        # Check cache first
        cached_result = cache.get(cache_key)
        if cached_result:
            cached_result["cached"] = True
            cached_result["response_time_ms"] = round(
                (time.time() - start_time) * 1000, 2
            )
            logger.info(f"Cache hit for product {base_product_id}")
            return cached_result

        # Get base product
        try:
            base_product = Product.objects.prefetch_related("occasions", "seasons").get(
                id=base_product_id, is_active=True
            )
        except Product.DoesNotExist:
            raise ValueError(f"Product not found: {base_product_id}")

        # Determine needed categories
        needed_categories = [
            cat for cat in OUTFIT_CATEGORIES if cat != base_product.category
        ]

        # Get compatible items for each category
        compatible_items = {}
        for category in needed_categories:
            compatible_items[category] = cls._get_compatible_products(
                base_product, category, preferences
            )

        # Generate outfit combinations
        outfits = cls._generate_outfit_combinations(
            base_product, compatible_items, preferences
        )

        # Score and rank outfits
        scored_outfits = []
        for outfit in outfits:
            score_data = ScoringService.calculate_outfit_score(outfit, preferences)
            outfit_with_score = {
                **outfit,
                "score": score_data["overall"],
                "score_breakdown": score_data["breakdown"],
                "explanation": ScoringService.get_score_explanation(score_data),
            }
            scored_outfits.append(outfit_with_score)

        # Sort by score (highest first), de-dup combos by item ids, and limit results
        scored_outfits.sort(key=lambda x: x["score"], reverse=True)
        seen = set()
        top_outfits = []
        for outfit in scored_outfits:
            key = tuple(
                sorted(
                    [
                        outfit["top"]["id"],
                        outfit["bottom"]["id"],
                        outfit["footwear"]["id"],
                        *[acc["id"] for acc in outfit.get("accessories", [])],
                    ]
                )
            )
            if key in seen:
                continue
            seen.add(key)
            top_outfits.append(outfit)
            if len(top_outfits) >= limit:
                break

        processing_time = round((time.time() - start_time) * 1000, 2)

        result = {
            "base_product": cls._serialize_product(base_product),
            "recommendations": top_outfits,
            "metadata": {
                "total_generated": len(outfits),
                "returned": len(top_outfits),
                "processing_time_ms": processing_time,
                "preferences": preferences,
            },
            "cached": False,
            "response_time_ms": processing_time,
        }

        # Cache the result
        cache.set(cache_key, result, cls.CACHE_TTL)
        logger.info(
            f"Generated {len(top_outfits)} recommendations for product {base_product_id} in {processing_time}ms"
        )

        return result

    @classmethod
    def _generate_cache_key(cls, product_id: int, preferences: Dict, limit: int) -> str:
        """Generate a unique cache key."""
        key_data = {
            "product_id": product_id,
            "preferences": preferences,
            "limit": limit,
        }
        key_string = json.dumps(key_data, sort_keys=True)
        key_hash = hashlib.md5(key_string.encode()).hexdigest()
        return f"outfit_rec_{key_hash}"

    @classmethod
    def _get_compatible_products(
        cls, base_product: Product, category: str, preferences: Dict[str, str]
    ) -> List[Dict[str, Any]]:
        """Get products compatible with the base product for a specific category."""

        # Start with all products in the category
        queryset = Product.objects.filter(
            category=category, is_active=True
        ).prefetch_related("occasions", "seasons")

        # Filter by style compatibility
        compatible_styles = STYLE_COMPATIBILITY.get(
            base_product.style, [base_product.style]
        )
        queryset = queryset.filter(style__in=compatible_styles)

        # Filter by gender compatibility
        if base_product.gender != "unisex":
            queryset = queryset.filter(gender__in=[base_product.gender, "unisex"])

        # Filter by occasion if specified
        if preferences.get("occasion"):
            queryset = queryset.filter(
                occasions__occasion=preferences["occasion"]
            ).distinct()

        # Filter by season if specified
        if preferences.get("season"):
            queryset = queryset.filter(
                seasons__season__in=[preferences["season"], "all"]
            ).distinct()

        # Convert to list and filter by color compatibility
        products = list(queryset)
        compatible_products = []

        for product in products:
            if ColorService.are_colors_compatible(base_product.color, product.color):
                compatibility_score = ColorService.get_color_harmony_score(
                    base_product.color, product.color
                )
                product_data = cls._serialize_product(product)
                product_data["compatibility_score"] = compatibility_score
                compatible_products.append(product_data)

        # Sort by compatibility score and limit
        compatible_products.sort(key=lambda x: x["compatibility_score"], reverse=True)
        return compatible_products[: cls.MAX_PER_CATEGORY]

    @classmethod
    def _generate_outfit_combinations(
        cls,
        base_product: Product,
        compatible_items: Dict[str, List[Dict]],
        preferences: Dict[str, str],
    ) -> List[Dict[str, Any]]:
        """Generate outfit combinations from compatible items."""

        outfits = []
        base_data = cls._serialize_product(base_product)

        # Setup categories based on base product
        categories = {
            "top": (
                [base_data]
                if base_product.category == "top"
                else compatible_items.get("top", [])
            ),
            "bottom": (
                [base_data]
                if base_product.category == "bottom"
                else compatible_items.get("bottom", [])
            ),
            "footwear": (
                [base_data]
                if base_product.category == "footwear"
                else compatible_items.get("footwear", [])
            ),
            "accessory": (
                [base_data]
                if base_product.category == "accessory"
                else compatible_items.get("accessory", [])
            ),
        }

        # Generate combinations
        combination_count = 0

        for top in categories["top"][: cls.MAX_PER_CATEGORY]:
            for bottom in categories["bottom"][: cls.MAX_PER_CATEGORY]:
                for footwear in categories["footwear"][: cls.MAX_PER_CATEGORY]:
                    # Get accessory combinations
                    accessory_combos = cls._get_accessory_combinations(
                        categories["accessory"]
                    )

                    for accessories in accessory_combos:
                        if combination_count >= cls.MAX_COMBINATIONS:
                            break

                        outfit = {
                            "id": f"outfit_{int(time.time() * 1000)}_{combination_count}",
                            "top": top,
                            "bottom": bottom,
                            "footwear": footwear,
                            "accessories": accessories,
                            "total_price": cls._calculate_total_price(
                                [top, bottom, footwear] + accessories
                            ),
                        }
                        outfits.append(outfit)
                        combination_count += 1

                    if combination_count >= cls.MAX_COMBINATIONS:
                        break
                if combination_count >= cls.MAX_COMBINATIONS:
                    break
            if combination_count >= cls.MAX_COMBINATIONS:
                break

        return outfits

    @staticmethod
    def _get_accessory_combinations(accessories: List[Dict]) -> List[List[Dict]]:
        """Get accessory combinations (1-2 accessories per outfit)."""
        if not accessories:
            return [[]]

        combinations = []

        # Single accessory combinations
        for acc in accessories[:3]:
            combinations.append([acc])

        # Double accessory combinations (different sub-categories)
        for i in range(min(len(accessories), 3)):
            for j in range(i + 1, min(len(accessories), 4)):
                if accessories[i].get("sub_category") != accessories[j].get(
                    "sub_category"
                ):
                    combinations.append([accessories[i], accessories[j]])

        return combinations[:4]  # Limit accessory combinations

    @staticmethod
    def _calculate_total_price(items: List[Dict]) -> float:
        """Calculate total price of outfit items."""
        total = sum(float(item.get("price", 0)) for item in items)
        return round(total, 2)

    @staticmethod
    def _serialize_product(product: Product) -> Dict[str, Any]:
        """Serialize a Product model to dictionary."""
        return {
            "id": product.id,
            "name": product.name,
            "category": product.category,
            "sub_category": product.sub_category,
            "color": product.color,
            "style": product.style,
            "price": float(product.price),
            "price_range": product.price_range,
            "image_url": product.image_url,
            "gender": product.gender,
            "occasions": list(product.occasions.values_list("occasion", flat=True)),
            "seasons": list(product.seasons.values_list("season", flat=True)),
            "tags": product.tags,
        }
