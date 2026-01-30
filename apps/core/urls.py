"""
Core URL patterns.
"""

from django.urls import path
from .views import HealthCheckView, SystemStatsView

urlpatterns = [
    path('health/', HealthCheckView.as_view(), name='health-check'),
    path('stats/', SystemStatsView.as_view(), name='system-stats'),
]