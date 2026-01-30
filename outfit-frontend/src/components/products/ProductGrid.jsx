import React from 'react';
import ProductCard from './ProductCard';
import { ProductCardSkeleton } from '../common/Loading';
import ErrorMessage from '../common/ErrorMessage';
import { PackageX } from 'lucide-react';

const ProductGrid = ({ 
  products, 
  loading, 
  error, 
  onSelectProduct, 
  onGetRecommendations,
  selectedProductId,
  onRetry 
}) => {
  if (loading) {
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {[...Array(8)].map((_, i) => (
          <ProductCardSkeleton key={i} />
        ))}
      </div>
    );
  }

  if (error) {
    return (
      <ErrorMessage 
        message={error} 
        onRetry={onRetry}
      />
    );
  }

  if (!products || products.length === 0) {
    return (
      <div className="text-center py-16">
        <div className="inline-flex items-center justify-center w-16 h-16 bg-gray-100 rounded-full mb-4">
          <PackageX className="w-8 h-8 text-gray-400" />
        </div>
        <h3 className="text-lg font-medium text-gray-900 mb-2">
          No products found
        </h3>
        <p className="text-gray-500">
          Try adjusting your filters or search terms
        </p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
      {products.map((product) => (
        <ProductCard
          key={product.id}
          product={product}
          onSelect={onSelectProduct}
          onGetRecommendations={onGetRecommendations}
          isSelected={product.id === selectedProductId}
        />
      ))}
    </div>
  );
};

export default ProductGrid;