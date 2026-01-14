import { supabase } from '../../lib/supabase';

/**
 * Сервис для работы с Supabase Storage
 */

const BUCKET_NAME = 'product-images';

/**
 * Загрузить изображение товара в Storage
 * @param {File} file - Файл изображения
 * @param {number} productId - ID товара
 * @param {string} fileName - Имя файла (опционально)
 * @returns {Promise<Object>} Объект с информацией о загруженном файле
 */
export const uploadProductImage = async (file, productId, fileName = null) => {
  try {
    if (!file) {
      throw new Error('File is required');
    }

    // Генерируем имя файла если не предоставлено
    const timestamp = Date.now();
    const randomString = Math.random().toString(36).substring(2, 8);
    const finalFileName = fileName || `product_${productId}_${timestamp}_${randomString}`;
    const filePath = `products/${productId}/${finalFileName}`;

    // Загружаем файл
    const { data, error } = await supabase.storage
      .from(BUCKET_NAME)
      .upload(filePath, file, {
        cacheControl: '3600',
        upsert: true,
        contentType: file.type
      });

    if (error) {
      throw error;
    }

    // Получаем публичный URL
    const publicUrl = getImageUrl(filePath);

    return {
      path: data.path,
      fullPath: data.fullPath,
      url: publicUrl
    };
  } catch (error) {
    console.error('Error uploading product image:', error);
    throw error;
  }
};

/**
 * Получить публичный URL изображения
 * @param {string} filePath - Путь файла в storage
 * @returns {string} Публичный URL
 */
export const getImageUrl = (filePath) => {
  try {
    const { data } = supabase.storage.from(BUCKET_NAME).getPublicUrl(filePath);
    return data.publicUrl;
  } catch (error) {
    console.error('Error getting image URL:', error);
    throw error;
  }
};

/**
 * Скачать файл из Storage
 * @param {string} filePath - Путь файла
 * @returns {Promise<Blob>} Блоб файла
 */
export const downloadFile = async (filePath) => {
  try {
    const { data, error } = await supabase.storage.from(BUCKET_NAME).download(filePath);

    if (error) {
      throw error;
    }

    return data;
  } catch (error) {
    console.error('Error downloading file:', error);
    throw error;
  }
};

/**
 * Удалить изображение из Storage
 * @param {string} filePath - Путь файла
 * @returns {Promise<boolean>} True если успешно удалено
 */
export const deleteImage = async (filePath) => {
  try {
    const { error } = await supabase.storage.from(BUCKET_NAME).remove([filePath]);

    if (error) {
      throw error;
    }

    return true;
  } catch (error) {
    console.error('Error deleting image:', error);
    throw error;
  }
};

/**
 * Удалить несколько изображений
 * @param {Array<string>} filePaths - Массив путей файлов
 * @returns {Promise<number>} Количество удаленных файлов
 */
export const deleteImages = async (filePaths) => {
  try {
    if (!filePaths || filePaths.length === 0) {
      return 0;
    }

    const { error } = await supabase.storage.from(BUCKET_NAME).remove(filePaths);

    if (error) {
      throw error;
    }

    return filePaths.length;
  } catch (error) {
    console.error('Error deleting images:', error);
    throw error;
  }
};

/**
 * Список файлов в папке
 * @param {string} folderPath - Путь к папке
 * @returns {Promise<Array>} Массив файлов
 */
export const listFiles = async (folderPath) => {
  try {
    const { data, error } = await supabase.storage.from(BUCKET_NAME).list(folderPath);

    if (error) {
      throw error;
    }

    return data || [];
  } catch (error) {
    console.error('Error listing files:', error);
    throw error;
  }
};

/**
 * Проверить существование файла
 * @param {string} filePath - Путь файла
 * @returns {Promise<boolean>} True если файл существует
 */
export const fileExists = async (filePath) => {
  try {
    const { data, error } = await supabase.storage.from(BUCKET_NAME).list();

    if (error) {
      throw error;
    }

    return data.some((file) => file.name === filePath.split('/').pop());
  } catch (error) {
    console.error('Error checking file existence:', error);
    return false;
  }
};

export default {
  uploadProductImage,
  getImageUrl,
  downloadFile,
  deleteImage,
  deleteImages,
  listFiles,
  fileExists
};
