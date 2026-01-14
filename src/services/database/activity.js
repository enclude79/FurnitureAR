import { supabase } from '../../lib/supabase';

/**
 * Сервис для работы с активностью пользователей
 */

/**
 * Записать активность пользователя
 * @param {number} userId - ID пользователя
 * @param {string} activityType - Тип активности: 'view', 'favorite', 'review', 'order'
 * @param {string} title - Описание активности
 * @param {number} productId - ID товара (опционально)
 * @param {Object} metadata - Дополнительные данные (опционально)
 * @returns {Promise<Object>} Созданная запись активности
 */
export const logActivity = async (userId, activityType, title, productId = null, metadata = null) => {
  try {
    const { data, error } = await supabase
      .from('user_activity')
      .insert([
        {
          user_id: userId,
          activity_type: activityType,
          title: title,
          product_id: productId,
          metadata: metadata ? JSON.stringify(metadata) : null
        }
      ])
      .select('*')
      .single();

    if (error) {
      throw error;
    }

    return data;
  } catch (error) {
    console.error('Error logging activity:', error);
    throw error;
  }
};

/**
 * Получить активность пользователя
 * @param {number} userId - ID пользователя
 * @param {number} limit - Максимальное количество записей
 * @param {number} offset - Смещение для пагинации
 * @returns {Promise<Array>} Массив активности
 */
export const getUserActivity = async (userId, limit = 10, offset = 0) => {
  try {
    const { data, error } = await supabase
      .from('user_activity')
      .select('id, activity_type, title, product_id, metadata, created_at')
      .eq('user_id', userId)
      .order('created_at', { ascending: false })
      .range(offset, offset + limit - 1);

    if (error) {
      throw error;
    }

    return data || [];
  } catch (error) {
    console.error('Error fetching user activity:', error);
    throw error;
  }
};

/**
 * Получить активность определенного типа
 * @param {number} userId - ID пользователя
 * @param {string} activityType - Тип активности
 * @param {number} limit - Максимальное количество записей
 * @returns {Promise<Array>} Массив активности
 */
export const getActivityByType = async (userId, activityType, limit = 10) => {
  try {
    const { data, error } = await supabase
      .from('user_activity')
      .select('id, activity_type, title, product_id, metadata, created_at')
      .eq('user_id', userId)
      .eq('activity_type', activityType)
      .order('created_at', { ascending: false })
      .limit(limit);

    if (error) {
      throw error;
    }

    return data || [];
  } catch (error) {
    console.error('Error fetching activity by type:', error);
    throw error;
  }
};

/**
 * Логировать просмотр товара
 * @param {number} userId - ID пользователя
 * @param {number} productId - ID товара
 * @param {string} productTitle - Название товара
 * @returns {Promise<Object>} Созданная запись активности
 */
export const logProductView = async (userId, productId, productTitle) => {
  return logActivity(
    userId,
    'view',
    `Просмотрел товар "${productTitle}"`,
    productId,
    { product_id: productId, product_title: productTitle }
  );
};

/**
 * Логировать добавление в избранное
 * @param {number} userId - ID пользователя
 * @param {number} productId - ID товара
 * @param {string} productTitle - Название товара
 * @returns {Promise<Object>} Созданная запись активности
 */
export const logAddFavorite = async (userId, productId, productTitle) => {
  return logActivity(
    userId,
    'favorite',
    `Добавил в избранное "${productTitle}"`,
    productId,
    { product_id: productId, product_title: productTitle, action: 'add' }
  );
};

/**
 * Логировать удаление из избранного
 * @param {number} userId - ID пользователя
 * @param {number} productId - ID товара
 * @param {string} productTitle - Название товара
 * @returns {Promise<Object>} Созданная запись активности
 */
export const logRemoveFavorite = async (userId, productId, productTitle) => {
  return logActivity(
    userId,
    'favorite',
    `Убрал из избранного "${productTitle}"`,
    productId,
    { product_id: productId, product_title: productTitle, action: 'remove' }
  );
};

/**
 * Удалить активность пользователя (старше определенного времени)
 * @param {number} userId - ID пользователя
 * @param {Date} beforeDate - Удалить активность до этой даты
 * @returns {Promise<number>} Количество удаленных записей
 */
export const deleteOldActivity = async (userId, beforeDate) => {
  try {
    const { count, error } = await supabase
      .from('user_activity')
      .delete()
      .eq('user_id', userId)
      .lt('created_at', beforeDate.toISOString());

    if (error) {
      throw error;
    }

    return count;
  } catch (error) {
    console.error('Error deleting old activity:', error);
    throw error;
  }
};

export default {
  logActivity,
  getUserActivity,
  getActivityByType,
  logProductView,
  logAddFavorite,
  logRemoveFavorite,
  deleteOldActivity
};
