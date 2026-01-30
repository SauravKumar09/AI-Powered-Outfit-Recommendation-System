import axios from 'axios';

// Create axios instance with base configuration
const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000/api',
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor
api.interceptors.request.use(
  (config) => {
    // Add timestamp to prevent caching issues
    if (config.method === 'get') {
      config.params = {
        ...config.params,
        _t: Date.now(),
      };
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor
api.interceptors.response.use(
  (response) => {
    return response.data;
  },
  (error) => {
    const message = error.response?.data?.error || 
                    error.message || 
                    'An unexpected error occurred';
    return Promise.reject(new Error(message));
  }
);

// API Functions

/**
 * Health Check
 */
export const checkHealth = async () => {
  return api.get('/health/');
};

/**
 * Get system statistics
 */
export const getStats = async () => {
  return api.get('/stats/');
};

/**
 * Get all products with optional filters
 */
export const getProducts = async (filters = {}) => {
  const params = new URLSearchParams();
  
  if (filters.category) params.append('category', filters.category);
  if (filters.style) params.append('style', filters.style);
  if (filters.color) params.append('color', filters.color);
  if (filters.price_range) params.append('price_range', filters.price_range);
  if (filters.search) params.append('search', filters.search);
  if (filters.page) params.append('page', filters.page);
  
  return api.get(`/products/?${params.toString()}`);
};

/**
 * Get single product by ID
 */
export const getProduct = async (productId) => {
  return api.get(`/products/${productId}/`);
};

/**
 * Get products by category
 */
export const getProductsByCategory = async (category) => {
  return api.get(`/products/category/${category}/`);
};

/**
 * Get available filters
 */
export const getFilters = async () => {
  return api.get('/products/filters/');
};

/**
 * Get outfit recommendations
 */
export const getRecommendations = async (productId, preferences = {}) => {
  const params = new URLSearchParams();
  
  if (preferences.gender) params.append('gender', preferences.gender);
  if (preferences.occasion) params.append('occasion', preferences.occasion);
  if (preferences.season) params.append('season', preferences.season);
  if (preferences.budget) params.append('budget', preferences.budget);
  if (preferences.limit) params.append('limit', preferences.limit);
  
  return api.get(`/recommendations/${productId}/?${params.toString()}`);
};

/**
 * Get bulk recommendations
 */
export const getBulkRecommendations = async (productIds, preferences = {}, limit = 3) => {
  return api.post('/recommendations/bulk/', {
    product_ids: productIds,
    preferences,
    limit,
  });
};

export default api;