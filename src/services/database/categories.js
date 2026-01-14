import { supabase } from '../../lib/supabase';

/**
 * Сервис для работы с категориями
 */

/**
 * Получить все активные категории
 * @returns {Promise<Array>} Массив категорий
 */
export const getCategories = async () => {
  try {
    const { data, error } = await supabase
      .from('categories')
      .select('*')
      .eq('is_active', true)
      .order('sort_order', { ascending: true });

    if (error) {
      throw error;
    }

    return data || [];
  } catch (error) {
    console.error('Error fetching categories:', error);
    throw error;
  }
};

/**
 * Получить категорию по ID
 * @param {number} categoryId - ID категории
 * @returns {Promise<Object>} Данные категории
 */
export const getCategoryById = async (categoryId) => {
  try {
    const { data, error } = await supabase
      .from('categories')
      .select('*')
      .eq('id', categoryId)
      .single();

    if (error) {
      throw error;
    }

    return data;
  } catch (error) {
    console.error('Error fetching category by ID:', error);
    throw error;
  }
};

/**
 * Получить категорию по коду
 * @param {string} code - Код категории (например, 'sofas', 'tables')
 * @returns {Promise<Object>} Данные категории
 */
export const getCategoryByCode = async (code) => {
  try {
    const { data, error } = await supabase
      .from('categories')
      .select('*')
      .eq('code', code)
      .single();

    if (error) {
      throw error;
    }

    return data;
  } catch (error) {
    console.error('Error fetching category by code:', error);
    throw error;
  }
};

export default {
  getCategories,
  getCategoryById,
  getCategoryByCode
};
