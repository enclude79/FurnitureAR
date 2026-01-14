import { supabase } from '../../lib/supabase';

/**
 * Сервис для работы с пользователями
 */

/**
 * Получить пользователя по Telegram ID или создать нового
 * @param {Object} telegramUser - Данные пользователя из Telegram
 * @param {number} telegramUser.id - Telegram ID
 * @param {string} telegramUser.first_name - Имя
 * @param {string} telegramUser.last_name - Фамилия
 * @param {string} telegramUser.username - Username
 * @param {string} telegramUser.photo_url - URL аватара
 * @returns {Promise<Object>} Объект пользователя и статистики
 */
export const getOrCreateUser = async (telegramUser) => {
  if (!telegramUser || !telegramUser.id) {
    throw new Error('Telegram user data is required');
  }

  try {
    // Пытаемся получить существующего пользователя
    const { data: existingUser, error: fetchError } = await supabase
      .from('users')
      .select('id, telegram_id, username, first_name, last_name, photo_url, language_code')
      .eq('telegram_id', telegramUser.id)
      .single();

    if (existingUser) {
      // Пользователь найден, обновляем его данные если они изменились
      if (
        existingUser.first_name !== telegramUser.first_name ||
        existingUser.last_name !== telegramUser.last_name ||
        existingUser.username !== telegramUser.username
      ) {
        await updateUser(existingUser.id, telegramUser);
      }
      return existingUser;
    }

    // Пользователь не найден, создаем нового
    const { data: newUser, error: createError } = await supabase
      .from('users')
      .insert([
        {
          telegram_id: telegramUser.id,
          username: telegramUser.username || null,
          first_name: telegramUser.first_name || null,
          last_name: telegramUser.last_name || null,
          photo_url: telegramUser.photo_url || null,
          language_code: telegramUser.language_code || 'ru'
        }
      ])
      .select('id, telegram_id, username, first_name, last_name, photo_url, language_code')
      .single();

    if (createError) {
      throw createError;
    }

    // Создаем статистику для нового пользователя
    await supabase
      .from('user_stats')
      .insert([
        {
          user_id: newUser.id,
          total_items: 0,
          total_views: 0,
          total_likes: 0,
          total_reviews: 0,
          points: 0,
          level: 'Новичок'
        }
      ])
      .select()
      .single();

    return newUser;
  } catch (error) {
    console.error('Error in getOrCreateUser:', error);
    throw error;
  }
};

/**
 * Получить пользователя по ID
 * @param {number} userId - ID пользователя в базе
 * @returns {Promise<Object>} Данные пользователя
 */
export const getUserById = async (userId) => {
  try {
    const { data, error } = await supabase
      .from('users')
      .select('*')
      .eq('id', userId)
      .single();

    if (error) {
      throw error;
    }

    return data;
  } catch (error) {
    console.error('Error fetching user by ID:', error);
    throw error;
  }
};

/**
 * Получить пользователя по Telegram ID
 * @param {number} telegramId - Telegram ID
 * @returns {Promise<Object>} Данные пользователя
 */
export const getUserByTelegramId = async (telegramId) => {
  try {
    const { data, error } = await supabase
      .from('users')
      .select('*')
      .eq('telegram_id', telegramId)
      .single();

    if (error && error.code !== 'PGRST116') {
      // PGRST116 означает "no rows found" - это нормально для нового пользователя
      throw error;
    }

    return data || null;
  } catch (error) {
    console.error('Error fetching user by Telegram ID:', error);
    throw error;
  }
};

/**
 * Обновить данные пользователя
 * @param {number} userId - ID пользователя
 * @param {Object} data - Данные для обновления
 * @returns {Promise<Object>} Обновленные данные пользователя
 */
export const updateUser = async (userId, data) => {
  try {
    const updateData = {};

    if (data.first_name !== undefined) updateData.first_name = data.first_name;
    if (data.last_name !== undefined) updateData.last_name = data.last_name;
    if (data.username !== undefined) updateData.username = data.username;
    if (data.photo_url !== undefined) updateData.photo_url = data.photo_url;
    if (data.language_code !== undefined) updateData.language_code = data.language_code;

    if (Object.keys(updateData).length === 0) {
      return getUserById(userId);
    }

    const { data: updatedUser, error } = await supabase
      .from('users')
      .update(updateData)
      .eq('id', userId)
      .select('*')
      .single();

    if (error) {
      throw error;
    }

    return updatedUser;
  } catch (error) {
    console.error('Error updating user:', error);
    throw error;
  }
};

/**
 * Получить статистику пользователя
 * @param {number} userId - ID пользователя
 * @returns {Promise<Object>} Статистика пользователя
 */
export const getUserStats = async (userId) => {
  try {
    const { data, error } = await supabase
      .from('user_stats')
      .select('*')
      .eq('user_id', userId)
      .single();

    if (error) {
      throw error;
    }

    return data;
  } catch (error) {
    console.error('Error fetching user stats:', error);
    throw error;
  }
};

/**
 * Обновить статистику пользователя
 * @param {number} userId - ID пользователя
 * @param {Object} stats - Статистика для обновления
 * @returns {Promise<Object>} Обновленная статистика
 */
export const updateUserStats = async (userId, stats) => {
  try {
    const { data, error } = await supabase
      .from('user_stats')
      .update(stats)
      .eq('user_id', userId)
      .select('*')
      .single();

    if (error) {
      throw error;
    }

    return data;
  } catch (error) {
    console.error('Error updating user stats:', error);
    throw error;
  }
};

export default {
  getOrCreateUser,
  getUserById,
  getUserByTelegramId,
  updateUser,
  getUserStats,
  updateUserStats
};
