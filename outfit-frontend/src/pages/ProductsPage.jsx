import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import ProductGrid from '../components/products/ProductGrid';
import ProductFilters from '../components/products/ProductFilters';
import ProductDetail from '../components/products/ProductDetail';
import { useProducts, useFilters } from '../hooks/useProducts';

const ProductsPage = () => {
  const navigate = useNavigate();
  const [selectedProduct, setSelectedProduct] = useState(null);
  
  const {
    products,
    loading,
    error,
    filters,
    updateFilters,
    clearFilters,
    refetch,
  } = useProducts();

  const { filterOptions } = useFilters();

  const handleSelectProduct = (product) => {
    setSelectedProduct(product);
  };

  const handleGetRecommendations = (product) => {
    navigate(`/recommendations?productId=${product.id}`);
  };

  const handleCloseDetail = () => {
    setSelectedProduct(null);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Page Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">
          Product Catalog
        </h1>
        <p className="text-gray-600">
          Browse our collection and click "Style" to get outfit recommendations
        </p>
      </div>

      {/* Filters */}
      <ProductFilters
        filters={filters}
        onFilterChange={updateFilters}
        onClearFilters={clearFilters}
        filterOptions={filterOptions}
      />

      {/* Products Grid */}
      <ProductGrid
        products={products}
        loading={loading}
        error={error}
        onSelectProduct={handleSelectProduct}
        onGetRecommendations={handleGetRecommendations}
        onRetry={refetch}
      />

      {/* Product Detail Modal */}
      {selectedProduct && (
        <ProductDetail
          product={selectedProduct}
          onClose={handleCloseDetail}
          onGetRecommendations={handleGetRecommendations}
        />
      )}
    </div>
  );
};

export default ProductsPage;