import { supabase } from '../../lib/supabase';

/**
 * Сервис для работы с товарами
 */

/**
 * Получить товары с фильтрацией и поиском
 * @param {Object} options - Опции фильтрации
 * @param {string} options.filter - Фильтр: 'new', 'sale', 'popular' или 'all'
 * @param {number} options.categoryId - ID категории для фильтрации
 * @param {string} options.search - Поисковый запрос (полнотекстовый поиск)
 * @param {number} options.limit - Максимальное количество результатов
 * @param {number} options.offset - Смещение для пагинации
 * @returns {Promise<Array>} Массив товаров
 */
export const getProducts = async (options = {}) => {
  const { filter = 'all', categoryId = null, search = '', limit = 100, offset = 0 } = options;

  try {
    let query = supabase
      .from('products')
      .select('id, title, description, category_id, price, original_price, is_new, on_sale, rating, reviews_count, in_stock, delivery_time');

    // Применяем фильтры
    if (filter === 'new') {
      query = query.eq('is_new', true);
    } else if (filter === 'sale') {
      query = query.eq('on_sale', true);
    } else if (filter === 'popular') {
      query = query.order('reviews_count', { ascending: false });
    }

    // Фильтруем по категории
    if (categoryId && categoryId !== 'all') {
      query = query.eq('category_id', categoryId);
    }

    // Применяем поиск (если search не пустой)
    if (search) {
      // Используем простой поиск по title и description
      // Для полнотекстового поиска нужно использовать SQL функции
      const searchLower = search.toLowerCase();
      query = query.or(`title.ilike.%${searchLower}%,description.ilike.%${searchLower}%`);
    }

    // Применяем пагинацию
    query = query
      .range(offset, offset + limit - 1)
      .order('id', { ascending: true });

    const { data, error } = await query;

    if (error) {
      throw error;
    }

    // Получаем изображения для каждого товара
    if (data && data.length > 0) {
      const productsWithImages = await Promise.all(
        data.map(async (product) => {
          const images = await getProductImages(product.id);
          return {
            ...product,
            image: images.find((img) => img.is_primary)?.image_url || images[0]?.image_url || null,
            images: images.map((img) => img.image_url)
          };
        })
      );
      return productsWithImages;
    }

    return [];
  } catch (error) {
    console.error('Error fetching products:', error);
    throw error;
  }
};

/**
 * Получить товар по ID с полными деталями
 * @param {number} productId - ID товара
 * @returns {Promise<Object>} Полные данные товара с изображениями
 */
export const getProductById = async (productId) => {
  try {
    const { data, error } = await supabase
      .from('products')
      .select('*')
      .eq('id', productId)
      .single();

    if (error) {
      throw error;
    }

    if (!data) {
      return null;
    }

    // Получаем изображения товара
    const images = await getProductImages(productId);

    return {
      ...data,
      images: images.map((img) => img.image_url)
    };
  } catch (error) {
    console.error('Error fetching product by ID:', error);
    throw error;
  }
};

/**
 * Получить изображения товара
 * @param {number} productId - ID товара
 * @returns {Promise<Array>} Массив изображений
 */
export const getProductImages = async (productId) => {
  try {
    const { data, error } = await supabase
      .from('product_images')
      .select('id, product_id, image_url, sort_order, is_primary')
      .eq('product_id', productId)
      .order('sort_order', { ascending: true });

    if (error) {
      throw error;
    }

    return data || [];
  } catch (error) {
    console.error('Error fetching product images:', error);
    throw error;
  }
};

/**
 * Поиск товаров по названию или описанию
 * @param {string} query - Поисковый запрос
 * @param {number} limit - Максимальное количество результатов
 * @returns {Promise<Array>} Массив найденных товаров
 */
export const searchProducts = async (query, limit = 20) => {
  if (!query || query.trim().length === 0) {
    return [];
  }

  try {
    const searchQuery = query.toLowerCase();
    
    const { data, error } = await supabase
      .from('products')
      .select('id, title, description, category_id, price, original_price, is_new, on_sale, rating, reviews_count, in_stock')
      .or(`title.ilike.%${searchQuery}%,description.ilike.%${searchQuery}%`)
      .limit(limit);

    if (error) {
      throw error;
    }

    // Получаем изображения для каждого товара
    if (data && data.length > 0) {
      const productsWithImages = await Promise.all(
        data.map(async (product) => {
          const images = await getProductImages(product.id);
          return {
            ...product,
            image: images.find((img) => img.is_primary)?.image_url || images[0]?.image_url || null,
            images: images.map((img) => img.image_url)
          };
        })
      );
      return productsWithImages;
    }

    return [];
  } catch (error) {
    console.error('Error searching products:', error);
    throw error;
  }
};

/**
 * Получить товары определенной категории
 * @param {number} categoryId - ID категории
 * @param {Object} options - Дополнительные опции
 * @returns {Promise<Array>} Массив товаров
 */
export const getProductsByCategory = async (categoryId, options = {}) => {
  return getProducts({ ...options, categoryId });
};

/**
 * Получить новые товары
 * @param {number} limit - Максимальное количество результатов
 * @returns {Promise<Array>} Массив новых товаров
 */
export const getNewProducts = async (limit = 10) => {
  return getProducts({ filter: 'new', limit });
};

/**
 * Получить товары со скидкой
 * @param {number} limit - Максимальное количество результатов
 * @returns {Promise<Array>} Массив товаров со скидкой
 */
export const getSaleProducts = async (limit = 10) => {
  return getProducts({ filter: 'sale', limit });
};

/**
 * Получить популярные товары
 * @param {number} limit - Максимальное количество результатов
 * @returns {Promise<Array>} Массив популярных товаров
 */
export const getPopularProducts = async (limit = 10) => {
  return getProducts({ filter: 'popular', limit });
};

export default {
  getProducts,
  getProductById,
  getProductImages,
  searchProducts,
  getProductsByCategory,
  getNewProducts,
  getSaleProducts,
  getPopularProducts
};
