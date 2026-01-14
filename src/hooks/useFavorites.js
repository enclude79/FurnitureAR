import { useState, useEffect, useCallback } from 'react';
import * as favoritesService from '../services/database/favorites';
import * as activityService from '../services/database/activity';

/**
 * Custom hook для работы с избранным
 */
export const useFavorites = (userId = null) => {
  const [favorites, setFavorites] = useState([]);
  const [favoriteIds, setFavoriteIds] = useState(new Set());
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  /**
   * Загрузить избранные товары пользователя
   */
  const loadFavorites = useCallback(async () => {
    if (!userId) {
      setFavorites([]);
      setFavoriteIds(new Set());
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const data = await favoritesService.getUserFavorites(userId);
      setFavorites(data);

      // Создаем Set ID избранных товаров для быстрого поиска
      const ids = new Set(data.map((item) => item.id));
      setFavoriteIds(ids);
    } catch (err) {
      console.error('Error loading favorites:', err);
      setError('Failed to load favorites');
      setFavorites([]);
      setFavoriteIds(new Set());
    } finally {
      setLoading(false);
    }
  }, [userId]);

  /**
   * Загружаем избранное при изменении userId
   */
  useEffect(() => {
    loadFavorites();
  }, [userId, loadFavorites]);

  /**
   * Добавить товар в избранное
   */
  const addToFavorites = useCallback(
    async (productId, productTitle = '') => {
      if (!userId) {
        setError('User not initialized');
        return false;
      }

      try {
        await favoritesService.addToFavorites(userId, productId);

        // Обновляем локальное состояние
        setFavoriteIds((prev) => new Set([...prev, productId]));

        // Логируем активность
        if (productTitle) {
          await activityService.logAddFavorite(userId, productId, productTitle);
        }

        return true;
      } catch (err) {
        console.error('Error adding to favorites:', err);
        setError('Failed to add to favorites');
        throw err;
      }
    },
    [userId]
  );

  /**
   * Удалить товар из избранного
   */
  const removeFromFavorites = useCallback(
    async (productId, productTitle = '') => {
      if (!userId) {
        setError('User not initialized');
        return false;
      }

      try {
        await favoritesService.removeFromFavorites(userId, productId);

        // Обновляем локальное состояние
        setFavoriteIds((prev) => {
          const newSet = new Set(prev);
          newSet.delete(productId);
          return newSet;
        });

        // Удаляем из favorites
        setFavorites((prev) => prev.filter((item) => item.id !== productId));

        // Логируем активность
        if (productTitle) {
          await activityService.logRemoveFavorite(userId, productId, productTitle);
        }

        return true;
      } catch (err) {
        console.error('Error removing from favorites:', err);
        setError('Failed to remove from favorites');
        throw err;
      }
    },
    [userId]
  );

  /**
   * Переключить состояние избранного
   */
  const toggleFavorite = useCallback(
    async (productId, productTitle = '') => {
      const isFav = favoriteIds.has(productId);

      if (isFav) {
        return removeFromFavorites(productId, productTitle);
      } else {
        return addToFavorites(productId, productTitle);
      }
    },
    [favoriteIds, addToFavorites, removeFromFavorites]
  );

  /**
   * Проверить, находится ли товар в избранном
   */
  const isFavorite = useCallback(
    (productId) => {
      return favoriteIds.has(productId);
    },
    [favoriteIds]
  );

  /**
   * Получить количество избранных товаров
   */
  const getFavoritesCount = useCallback(() => {
    return favoriteIds.size;
  }, [favoriteIds]);

  /**
   * Очистить избранное
   */
  const clearFavorites = useCallback(async () => {
    if (!userId) {
      setError('User not initialized');
      return false;
    }

    try {
      await favoritesService.clearUserFavorites(userId);
      setFavorites([]);
      setFavoriteIds(new Set());
      return true;
    } catch (err) {
      console.error('Error clearing favorites:', err);
      setError('Failed to clear favorites');
      throw err;
    }
  }, [userId]);

  /**
   * Очистить ошибку
   */
  const clearError = useCallback(() => {
    setError(null);
  }, []);

  return {
    favorites,
    favoriteIds,
    loading,
    error,
    loadFavorites,
    addToFavorites,
    removeFromFavorites,
    toggleFavorite,
    isFavorite,
    getFavoritesCount,
    clearFavorites,
    clearError
  };
};

export default useFavorites;
