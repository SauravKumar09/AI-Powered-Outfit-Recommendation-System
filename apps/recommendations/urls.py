"""
Recommendation URL patterns.
"""

from django.urls import path
from .views import RecommendationView, BulkRecommendationView

urlpatterns = [
    path('<int:product_id>/', RecommendationView.as_view(), name='get-recommendations'),
    path('bulk/', BulkRecommendationView.as_view(), name='bulk-recommendations'),
]