import React, { useState, useEffect, useCallback } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import ProductGrid from '../components/products/ProductGrid';
import PreferencesForm from '../components/recommendations/PreferencesForm';
import RecommendationPanel from '../components/recommendations/RecommendationPanel';
import { useProducts } from '../hooks/useProducts';
import { useRecommendations } from '../hooks/useRecommendations';
import { Sparkles } from 'lucide-react';

const RecommendationsPage = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const navigate = useNavigate();
  
  const productIdFromUrl = searchParams.get('productId');
  const [selectedProductId, setSelectedProductId] = useState(
    productIdFromUrl ? parseInt(productIdFromUrl) : null
  );
  
  const [preferences, setPreferences] = useState({
    gender: 'male',
    occasion: null,
    season: null,
    budget: null,
    limit: 5,
  });

  const {
    products,
    loading: productsLoading,
    error: productsError,
    refetch: refetchProducts,
  } = useProducts();

  const {
    recommendations,
    metadata,
    loading: recsLoading,
    error: recsError,
    fetchRecommendations,
    clearRecommendations,
  } = useRecommendations();

  // Fetch recommendations when product or preferences change
  useEffect(() => {
    if (selectedProductId) {
      fetchRecommendations(selectedProductId, preferences);
    }
  }, [selectedProductId, preferences, fetchRecommendations]);

  const handleSelectProduct = useCallback((product) => {
    setSelectedProductId(product.id);
    setSearchParams({ productId: product.id.toString() });
  }, [setSearchParams]);

  const handlePreferenceChange = useCallback((newPrefs) => {
    setPreferences((prev) => ({ ...prev, ...newPrefs }));
  }, []);

  const handleBack = useCallback(() => {
    setSelectedProductId(null);
    clearRecommendations();
    setSearchParams({});
  }, [clearRecommendations, setSearchParams]);

  const handleRetry = useCallback(() => {
    if (selectedProductId) {
      fetchRecommendations(selectedProductId, preferences);
    } else {
      refetchProducts();
    }
  }, [selectedProductId, preferences, fetchRecommendations, refetchProducts]);

  // Show product selection if no product is selected
  if (!selectedProductId) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Page Header */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-primary-100 rounded-full mb-4">
            <Sparkles className="w-8 h-8 text-primary-600" />
          </div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Get Styled by AI
          </h1>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Select any product below and our AI will create complete outfit recommendations for you
          </p>
        </div>

        {/* Preferences */}
        <PreferencesForm
          preferences={preferences}
          onPreferenceChange={handlePreferenceChange}
        />

        {/* Product Selection */}
        <div className="mb-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">
            Choose a Starting Piece
          </h2>
        </div>
        
        <ProductGrid
          products={products}
          loading={productsLoading}
          error={productsError}
          onSelectProduct={handleSelectProduct}
          onGetRecommendations={handleSelectProduct}
          selectedProductId={selectedProductId}
          onRetry={refetchProducts}
        />
      </div>
    );
  }

  // Show recommendations
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Preferences - Always visible for adjustments */}
      <PreferencesForm
        preferences={preferences}
        onPreferenceChange={handlePreferenceChange}
      />

      {/* Recommendations Panel */}
      <RecommendationPanel
        recommendations={recommendations}
        metadata={metadata}
        loading={recsLoading}
        error={recsError}
        onBack={handleBack}
        onRetry={handleRetry}
        gender={preferences.gender}
      />
    </div>
  );
};

export default RecommendationsPage;