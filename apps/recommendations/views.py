"""
Recommendation views.
"""

import logging
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from drf_spectacular.utils import extend_schema, OpenApiParameter, OpenApiResponse

from .services.recommendation_service import RecommendationService
from .serializers import RecommendationResponseSerializer

logger = logging.getLogger(__name__)


class RecommendationView(APIView):
    """
    Get outfit recommendations based on a product.
    """

    @extend_schema(
        tags=["Recommendations"],
        summary="Get Outfit Recommendations",
        description="""
        Generate complete outfit recommendations based on a single product.
        
        The system analyzes:
        - **Color Harmony**: How well colors complement each other
        - **Style Compatibility**: Formal with formal, casual with casual
        - **Occasion Fit**: Office wear with office wear
        - **Season Match**: Winter items with winter items
        - **Budget Alignment**: Similar price ranges
        
        **Performance**: Response time is guaranteed to be under 1 second.
        """,
        parameters=[
            OpenApiParameter(
                name="product_id",
                description="ID of the base product",
                required=True,
                type=int,
                location=OpenApiParameter.PATH,
            ),
            OpenApiParameter(
                name="occasion",
                description="Target occasion (office, casual, party, wedding, date, etc.)",
                required=False,
                type=str,
            ),
            OpenApiParameter(
                name="season",
                description="Target season (summer, winter, spring, fall)",
                required=False,
                type=str,
            ),
            OpenApiParameter(
                name="budget",
                description="Budget preference (budget, mid, premium, luxury)",
                required=False,
                type=str,
            ),
            OpenApiParameter(
                name="limit",
                description="Maximum number of recommendations (default: 5, max: 20)",
                required=False,
                type=int,
            ),
        ],
        responses={
            200: OpenApiResponse(
                response=RecommendationResponseSerializer,
                description="Recommendations generated successfully",
            ),
            400: OpenApiResponse(description="Bad request"),
            404: OpenApiResponse(description="Product not found"),
            500: OpenApiResponse(description="Internal server error"),
        },
    )
    def get(self, request, product_id):
        """
        Get outfit recommendations for a product.
        """
        try:
            # Parse query parameters
            preferences = {
                "occasion": request.query_params.get("occasion"),
                "season": request.query_params.get("season"),
                "budget": request.query_params.get("budget"),
            }
            # Remove None values
            preferences = {k: v for k, v in preferences.items() if v}

            limit = int(request.query_params.get("limit", 3))
            limit = min(max(limit, 1), 20)  # Clamp between 1 and 20

            # Generate recommendations
            result = RecommendationService.generate_recommendations(
                base_product_id=product_id,
                preferences=preferences,
                limit=limit,
            )

            return Response(
                {
                    "success": True,
                    **result,
                }
            )

        except ValueError as e:
            logger.warning(f"Value error in recommendations: {str(e)}")
            return Response(
                {
                    "success": False,
                    "error": str(e),
                },
                status=status.HTTP_404_NOT_FOUND,
            )

        except Exception as e:
            logger.error(f"Error generating recommendations: {str(e)}", exc_info=True)
            return Response(
                {
                    "success": False,
                    "error": "An error occurred while generating recommendations",
                },
                status=status.HTTP_500_INTERNAL_SERVER_ERROR,
            )


class BulkRecommendationView(APIView):
    """
    Get recommendations for multiple products at once.
    """

    @extend_schema(
        tags=["Recommendations"],
        summary="Get Bulk Recommendations",
        description="Generate recommendations for multiple products in a single request.",
        request={
            "application/json": {
                "type": "object",
                "properties": {
                    "product_ids": {
                        "type": "array",
                        "items": {"type": "integer"},
                        "description": "List of product IDs",
                    },
                    "preferences": {
                        "type": "object",
                        "properties": {
                            "occasion": {"type": "string"},
                            "season": {"type": "string"},
                            "budget": {"type": "string"},
                        },
                    },
                    "limit": {
                        "type": "integer",
                        "default": 3,
                    },
                },
                "required": ["product_ids"],
            },
        },
    )
    def post(self, request):
        """
        Get recommendations for multiple products.
        """
        try:
            product_ids = request.data.get("product_ids", [])
            preferences = request.data.get("preferences", {})
            limit = request.data.get("limit", 3)

            if not product_ids:
                return Response(
                    {
                        "success": False,
                        "error": "product_ids is required",
                    },
                    status=status.HTTP_400_BAD_REQUEST,
                )

            if len(product_ids) > 10:
                return Response(
                    {
                        "success": False,
                        "error": "Maximum 10 products allowed per request",
                    },
                    status=status.HTTP_400_BAD_REQUEST,
                )

            results = []
            for product_id in product_ids:
                try:
                    result = RecommendationService.generate_recommendations(
                        base_product_id=product_id,
                        preferences=preferences,
                        limit=limit,
                    )
                    results.append(
                        {
                            "product_id": product_id,
                            "success": True,
                            **result,
                        }
                    )
                except ValueError as e:
                    results.append(
                        {
                            "product_id": product_id,
                            "success": False,
                            "error": str(e),
                        }
                    )

            return Response(
                {
                    "success": True,
                    "results": results,
                }
            )

        except Exception as e:
            logger.error(f"Error in bulk recommendations: {str(e)}", exc_info=True)
            return Response(
                {
                    "success": False,
                    "error": "An error occurred",
                },
                status=status.HTTP_500_INTERNAL_SERVER_ERROR,
            )
