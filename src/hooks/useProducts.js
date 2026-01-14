import { useState, useEffect, useCallback } from 'react';
import * as productsService from '../services/database/products';
import * as categoriesService from '../services/database/categories';

/**
 * Custom hook для работы с товарами и категориями
 */
export const useProducts = () => {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [activeCategory, setActiveCategory] = useState('all');
  const [activeFilter, setActiveFilter] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  /**
   * Загрузить категории при инициализации хука
   */
  useEffect(() => {
    loadCategories();
  }, []);

  /**
   * Загрузить товары при изменении категории или фильтра
   */
  useEffect(() => {
    loadProducts();
  }, [activeCategory, activeFilter]);

  /**
   * Загрузить категории
   */
  const loadCategories = useCallback(async () => {
    try {
      const data = await categoriesService.getCategories();
      // Добавляем категорию "Все" в начало
      const allCategories = [
        { id: 'all', code: 'all', name: 'Все', icon: '🏠', is_active: true, sort_order: -1 },
        ...data
      ];
      setCategories(allCategories);
    } catch (err) {
      console.error('Error loading categories:', err);
      setError('Failed to load categories');
    }
  }, []);

  /**
   * Загрузить товары с фильтрацией
   */
  const loadProducts = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      let categoryId = null;
      if (activeCategory !== 'all') {
        categoryId = parseInt(activeCategory);
      }

      const data = await productsService.getProducts({
        filter: activeFilter !== 'all' ? activeFilter : undefined,
        categoryId: categoryId,
        limit: 100
      });

      setProducts(data);
    } catch (err) {
      console.error('Error loading products:', err);
      setError('Failed to load products');
      setProducts([]);
    } finally {
      setLoading(false);
    }
  }, [activeCategory, activeFilter]);

  /**
   * Поиск товаров
   */
  const searchProducts = useCallback(async (query) => {
    setSearchQuery(query);
    setLoading(true);
    setError(null);

    try {
      if (query.trim().length === 0) {
        // Если запрос пустой, загружаем товары нормально
        await loadProducts();
        return;
      }

      const data = await productsService.searchProducts(query, 50);
      setProducts(data);
    } catch (err) {
      console.error('Error searching products:', err);
      setError('Failed to search products');
      setProducts([]);
    } finally {
      setLoading(false);
    }
  }, [loadProducts]);

  /**
   * Получить товар по ID
   */
  const getProductById = useCallback(async (productId) => {
    try {
      const data = await productsService.getProductById(productId);
      return data;
    } catch (err) {
      console.error('Error fetching product by ID:', err);
      setError('Failed to load product');
      throw err;
    }
  }, []);

  /**
   * Фильтровать товары локально (для быстрого поиска)
   */
  const getFilteredProducts = useCallback((query) => {
    if (!query || query.trim().length === 0) {
      return products;
    }

    const queryLower = query.toLowerCase();
    return products.filter(
      (product) =>
        product.title.toLowerCase().includes(queryLower) ||
        product.description.toLowerCase().includes(queryLower)
    );
  }, [products]);

  /**
   * Изменить активную категорию
   */
  const handleCategoryChange = useCallback((categoryId) => {
    setActiveCategory(categoryId);
    setSearchQuery('');
  }, []);

  /**
   * Изменить активный фильтр
   */
  const handleFilterChange = useCallback((filter) => {
    setActiveFilter(filter);
    setSearchQuery('');
  }, []);

  /**
   * Очистить ошибку
   */
  const clearError = useCallback(() => {
    setError(null);
  }, []);

  return {
    products,
    categories,
    activeCategory,
    activeFilter,
    searchQuery,
    loading,
    error,
    loadProducts,
    loadCategories,
    searchProducts,
    getProductById,
    getFilteredProducts,
    handleCategoryChange,
    handleFilterChange,
    setSearchQuery,
    clearError
  };
};

export default useProducts;
