import { supabase } from '../../lib/supabase';
import { getProductImages } from './products';

/**
 * Сервис для работы с избранным
 */

/**
 * Получить избранные товары пользователя
 * @param {number} userId - ID пользователя
 * @returns {Promise<Array>} Массив избранных товаров
 */
export const getUserFavorites = async (userId) => {
  try {
    const { data, error } = await supabase
      .from('favorites')
      .select(
        `
        id,
        product_id,
        products!inner(
          id, title, description, category_id, price, original_price, 
          is_new, on_sale, rating, reviews_count, in_stock
        ),
        created_at
      `
      )
      .eq('user_id', userId)
      .order('created_at', { ascending: false });

    if (error) {
      throw error;
    }

    if (!data) {
      return [];
    }

    // Получаем изображения для каждого товара
    const favoritesWithImages = await Promise.all(
      data.map(async (favorite) => {
        const images = await getProductImages(favorite.product_id);
        return {
          id: favorite.products.id,
          title: favorite.products.title,
          description: favorite.products.description,
          category_id: favorite.products.category_id,
          price: favorite.products.price,
          original_price: favorite.products.original_price,
          is_new: favorite.products.is_new,
          on_sale: favorite.products.on_sale,
          rating: favorite.products.rating,
          reviews_count: favorite.products.reviews_count,
          in_stock: favorite.products.in_stock,
          image: images.find((img) => img.is_primary)?.image_url || images[0]?.image_url || null,
          images: images.map((img) => img.image_url)
        };
      })
    );

    return favoritesWithImages;
  } catch (error) {
    console.error('Error fetching user favorites:', error);
    throw error;
  }
};

/**
 * Добавить товар в избранное
 * @param {number} userId - ID пользователя
 * @param {number} productId - ID товара
 * @returns {Promise<Object>} Созданная запись избранного
 */
export const addToFavorites = async (userId, productId) => {
  try {
    // Проверяем, есть ли уже такой товар в избранном
    const { data: existing } = await supabase
      .from('favorites')
      .select('id')
      .eq('user_id', userId)
      .eq('product_id', productId)
      .single();

    if (existing) {
      // Уже в избранном
      return existing;
    }

    const { data, error } = await supabase
      .from('favorites')
      .insert([
        {
          user_id: userId,
          product_id: productId
        }
      ])
      .select('id, user_id, product_id, created_at')
      .single();

    if (error) {
      throw error;
    }

    return data;
  } catch (error) {
    console.error('Error adding to favorites:', error);
    throw error;
  }
};

/**
 * Удалить товар из избранного
 * @param {number} userId - ID пользователя
 * @param {number} productId - ID товара
 * @returns {Promise<boolean>} True если успешно удалено
 */
export const removeFromFavorites = async (userId, productId) => {
  try {
    const { error } = await supabase
      .from('favorites')
      .delete()
      .eq('user_id', userId)
      .eq('product_id', productId);

    if (error) {
      throw error;
    }

    return true;
  } catch (error) {
    console.error('Error removing from favorites:', error);
    throw error;
  }
};

/**
 * Проверить, находится ли товар в избранном
 * @param {number} userId - ID пользователя
 * @param {number} productId - ID товара
 * @returns {Promise<boolean>} True если в избранном
 */
export const isFavorite = async (userId, productId) => {
  try {
    const { data, error } = await supabase
      .from('favorites')
      .select('id')
      .eq('user_id', userId)
      .eq('product_id', productId)
      .single();

    if (error && error.code === 'PGRST116') {
      // PGRST116 означает "no rows found"
      return false;
    }

    if (error) {
      throw error;
    }

    return !!data;
  } catch (error) {
    console.error('Error checking favorite:', error);
    throw error;
  }
};

/**
 * Получить количество избранных товаров пользователя
 * @param {number} userId - ID пользователя
 * @returns {Promise<number>} Количество избранных товаров
 */
export const getFavoritesCount = async (userId) => {
  try {
    const { count, error } = await supabase
      .from('favorites')
      .select('*', { count: 'exact', head: true })
      .eq('user_id', userId);

    if (error) {
      throw error;
    }

    return count || 0;
  } catch (error) {
    console.error('Error fetching favorites count:', error);
    throw error;
  }
};

/**
 * Удалить все избранное пользователя
 * @param {number} userId - ID пользователя
 * @returns {Promise<boolean>} True если успешно удалено
 */
export const clearUserFavorites = async (userId) => {
  try {
    const { error } = await supabase
      .from('favorites')
      .delete()
      .eq('user_id', userId);

    if (error) {
      throw error;
    }

    return true;
  } catch (error) {
    console.error('Error clearing favorites:', error);
    throw error;
  }
};

export default {
  getUserFavorites,
  addToFavorites,
  removeFromFavorites,
  isFavorite,
  getFavoritesCount,
  clearUserFavorites
};
