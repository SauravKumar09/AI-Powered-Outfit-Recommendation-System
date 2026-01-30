import { useState, useCallback } from 'react';
import { getRecommendations } from '../api/api';

export const useRecommendations = () => {
  const [recommendations, setRecommendations] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [metadata, setMetadata] = useState(null);

  const fetchRecommendations = useCallback(async (productId, preferences = {}) => {
    if (!productId) {
      setError('Product ID is required');
      return;
    }

    try {
      setLoading(true);
      setError(null);
      const response = await getRecommendations(productId, preferences);
      
      if (response.success) {
        setRecommendations(response.recommendations);
        setMetadata({
          baseProduct: response.base_product,
          totalGenerated: response.metadata?.total_generated,
          returned: response.metadata?.returned,
          processingTime: response.response_time_ms,
          cached: response.cached,
          preferences: response.metadata?.preferences,
        });
      } else {
        throw new Error(response.error || 'Failed to get recommendations');
      }
    } catch (err) {
      setError(err.message);
      setRecommendations(null);
      setMetadata(null);
    } finally {
      setLoading(false);
    }
  }, []);

  const clearRecommendations = useCallback(() => {
    setRecommendations(null);
    setMetadata(null);
    setError(null);
  }, []);

  return {
    recommendations,
    metadata,
    loading,
    error,
    fetchRecommendations,
    clearRecommendations,
  };
};