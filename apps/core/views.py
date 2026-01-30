"""
Core views - Health check and system stats.
"""

from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from django.core.cache import cache
from django.db import connection
from drf_spectacular.utils import extend_schema, OpenApiResponse
import time

from apps.products.models import Product


class HealthCheckView(APIView):
    """
    Health check endpoint to verify system status.
    """
    
    @extend_schema(
        tags=['Health'],
        summary='Health Check',
        description='Check if the API is running and all services are healthy.',
        responses={
            200: OpenApiResponse(description='System is healthy'),
            503: OpenApiResponse(description='System is unhealthy'),
        }
    )
    def get(self, request):
        health_status = {
            'status': 'healthy',
            'timestamp': time.strftime('%Y-%m-%dT%H:%M:%SZ', time.gmtime()),
            'services': {}
        }
        
        # Check database
        try:
            with connection.cursor() as cursor:
                cursor.execute('SELECT 1')
            health_status['services']['database'] = 'healthy'
        except Exception as e:
            health_status['services']['database'] = f'unhealthy: {str(e)}'
            health_status['status'] = 'unhealthy'
        
        # Check Redis cache
        try:
            cache.set('health_check', 'ok', 10)
            if cache.get('health_check') == 'ok':
                health_status['services']['cache'] = 'healthy'
            else:
                health_status['services']['cache'] = 'unhealthy: cache read failed'
                health_status['status'] = 'unhealthy'
        except Exception as e:
            health_status['services']['cache'] = f'unhealthy: {str(e)}'
            health_status['status'] = 'unhealthy'
        
        status_code = status.HTTP_200_OK if health_status['status'] == 'healthy' else status.HTTP_503_SERVICE_UNAVAILABLE
        return Response(health_status, status=status_code)


class SystemStatsView(APIView):
    """
    System statistics endpoint.
    """
    
    @extend_schema(
        tags=['Health'],
        summary='System Statistics',
        description='Get system statistics including product counts and cache info.',
        responses={
            200: OpenApiResponse(description='Statistics retrieved successfully'),
        }
    )
    def get(self, request):
        # Get product statistics
        total_products = Product.objects.count()
        products_by_category = {
            'tops': Product.objects.filter(category='top').count(),
            'bottoms': Product.objects.filter(category='bottom').count(),
            'footwear': Product.objects.filter(category='footwear').count(),
            'accessories': Product.objects.filter(category='accessory').count(),
        }
        
        # Get cache statistics
        try:
            cache_info = {
                'backend': 'Redis',
                'status': 'connected'
            }
        except Exception:
            cache_info = {
                'backend': 'Redis',
                'status': 'disconnected'
            }
        
        return Response({
            'success': True,
            'products': {
                'total': total_products,
                'by_category': products_by_category
            },
            'cache': cache_info,
            'api_version': '1.0.0'
        })