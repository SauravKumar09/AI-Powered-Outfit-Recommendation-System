import { useState, useEffect, useCallback } from 'react';
import { getProducts, getProduct, getFilters } from '../api/api';

export const useProducts = (initialFilters = {}) => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [filters, setFilters] = useState(initialFilters);
  const [pagination, setPagination] = useState({
    count: 0,
    next: null,
    previous: null,
    page: 1,
  });

  const fetchProducts = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await getProducts(filters);
      const list = Array.isArray(response)
        ? response
        : response.results || response.products || [];
      setProducts(list);
      setPagination({
        count: response.count || (Array.isArray(response) ? response.length : 0),
        next: response.next,
        previous: response.previous,
        page: filters.page || 1,
      });
    } catch (err) {
      setError(err.message);
      setProducts([]);
    } finally {
      setLoading(false);
    }
  }, [filters]);

  useEffect(() => {
    fetchProducts();
  }, [fetchProducts]);

  const updateFilters = useCallback((newFilters) => {
    setFilters((prev) => ({
      ...prev,
      ...newFilters,
      page: newFilters.page || 1,
    }));
  }, []);

  const clearFilters = useCallback(() => {
    setFilters({});
  }, []);

  const goToPage = useCallback((page) => {
    setFilters((prev) => ({ ...prev, page }));
  }, []);

  return {
    products,
    loading,
    error,
    filters,
    pagination,
    updateFilters,
    clearFilters,
    goToPage,
    refetch: fetchProducts,
  };
};

export const useProduct = (productId) => {
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchProduct = async () => {
      if (!productId) {
        setProduct(null);
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        setError(null);
        const response = await getProduct(productId);
        setProduct(response);
      } catch (err) {
        setError(err.message);
        setProduct(null);
      } finally {
        setLoading(false);
      }
    };

    fetchProduct();
  }, [productId]);

  return { product, loading, error };
};

export const useFilters = () => {
  const [filterOptions, setFilterOptions] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchFilters = async () => {
      try {
        setLoading(true);
        const response = await getFilters();
        setFilterOptions(response.filters);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchFilters();
  }, []);

  return { filterOptions, loading, error };
};