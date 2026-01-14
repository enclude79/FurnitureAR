import { useState, useEffect, useCallback } from 'react';
import * as usersService from '../services/database/users';

/**
 * Custom hook для работы с пользователем
 * Управляет получением, созданием и обновлением данных пользователя
 */
export const useUser = () => {
  const [user, setUser] = useState(null);
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  /**
   * Инициализировать пользователя по данным Telegram
   */
  const initializeUser = useCallback(async (telegramUser) => {
    setLoading(true);
    setError(null);

    try {
      const userData = await usersService.getOrCreateUser(telegramUser);
      setUser(userData);

      // Получаем статистику пользователя
      try {
        const statsData = await usersService.getUserStats(userData.id);
        setStats(statsData);
      } catch (statsError) {
        console.error('Error fetching user stats:', statsError);
        // Не критично если не получим статистику
      }
    } catch (err) {
      setError(err.message || 'Failed to initialize user');
      console.error('Error initializing user:', err);
    } finally {
      setLoading(false);
    }
  }, []);

  /**
   * Обновить данные пользователя
   */
  const updateUser = useCallback(async (data) => {
    if (!user) {
      setError('User not initialized');
      return;
    }

    try {
      const updatedUser = await usersService.updateUser(user.id, data);
      setUser(updatedUser);
      return updatedUser;
    } catch (err) {
      setError(err.message || 'Failed to update user');
      console.error('Error updating user:', err);
      throw err;
    }
  }, [user]);

  /**
   * Получить свежие данные статистики
   */
  const refreshStats = useCallback(async () => {
    if (!user) {
      setError('User not initialized');
      return;
    }

    try {
      const statsData = await usersService.getUserStats(user.id);
      setStats(statsData);
      return statsData;
    } catch (err) {
      setError(err.message || 'Failed to fetch user stats');
      console.error('Error fetching user stats:', err);
      throw err;
    }
  }, [user]);

  /**
   * Обновить статистику пользователя
   */
  const updateStats = useCallback(async (statsData) => {
    if (!user) {
      setError('User not initialized');
      return;
    }

    try {
      const updatedStats = await usersService.updateUserStats(user.id, statsData);
      setStats(updatedStats);
      return updatedStats;
    } catch (err) {
      setError(err.message || 'Failed to update user stats');
      console.error('Error updating user stats:', err);
      throw err;
    }
  }, [user]);

  /**
   * Очистить ошибку
   */
  const clearError = useCallback(() => {
    setError(null);
  }, []);

  return {
    user,
    stats,
    loading,
    error,
    initializeUser,
    updateUser,
    refreshStats,
    updateStats,
    clearError,
    isInitialized: !!user
  };
};

export default useUser;
