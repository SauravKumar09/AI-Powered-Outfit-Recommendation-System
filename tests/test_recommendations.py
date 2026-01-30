"""
Tests for the products app.
"""

import pytest
from django.urls import reverse
from rest_framework.test import APIClient
from rest_framework import status

from apps.products.models import Product, ProductOccasion, ProductSeason


@pytest.fixture
def api_client():
    return APIClient()


@pytest.fixture
def sample_product(db):
    """Create a sample product for testing."""
    product = Product.objects.create(
        name='Test Navy Shirt',
        category='top',
        sub_category='shirt',
        color='navy',
        style='formal',
        gender='male',
        price=59.99,
        price_range='mid',
        image_url='https://example.com/test.jpg',
        tags=['test', 'sample'],
    )
    ProductOccasion.objects.create(product=product, occasion='office')
    ProductSeason.objects.create(product=product, season='all')
    return product


@pytest.mark.django_db
class TestProductEndpoints:
    """Tests for product API endpoints."""
    
    def test_list_products(self, api_client, sample_product):
        """Test listing all products."""
        url = reverse('product-list')
        response = api_client.get(url)
        
        assert response.status_code == status.HTTP_200_OK
        assert len(response.data['results']) >= 1
    
    def test_get_product_detail(self, api_client, sample_product):
        """Test getting a single product."""
        url = reverse('product-detail', kwargs={'pk': sample_product.id})
        response = api_client.get(url)
        
        assert response.status_code == status.HTTP_200_OK
        assert response.data['name'] == sample_product.name
    
    def test_filter_products_by_category(self, api_client, sample_product):
        """Test filtering products by category."""
        url = reverse('product-list')
        response = api_client.get(url, {'category': 'top'})
        
        assert response.status_code == status.HTTP_200_OK
        for product in response.data['results']:
            assert product['category'] == 'top'
    
    def test_product_not_found(self, api_client):
        """Test 404 for non-existent product."""
        url = reverse('product-detail', kwargs={'pk': 99999})
        response = api_client.get(url)
        
        assert response.status_code == status.HTTP_404_NOT_FOUND