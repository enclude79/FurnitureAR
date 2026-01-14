import { createClient } from '@supabase/supabase-js';

/**
 * Инициализация Supabase клиента
 * 
 * Использует переменные окружения:
 * - REACT_APP_SUPABASE_URL: URL проекта Supabase
 * - NEXT_PUBLIC_SUPABASE_ANON_KEY: Публичный анонимный ключ
 */

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || process.env.REACT_APP_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  console.warn(
    'Supabase URL или ANON_KEY не найдены в переменных окружения. ' +
    'Установите REACT_APP_SUPABASE_URL и NEXT_PUBLIC_SUPABASE_ANON_KEY в .env.local'
  );
}

/**
 * Singleton инстанс Supabase клиента
 */
export const supabase = createClient(supabaseUrl || '', supabaseAnonKey || '', {
  auth: {
    autoRefreshToken: true,
    persistSession: false,
    detectSessionInUrl: false
  }
});

/**
 * Утилита для обработки ошибок Supabase
 * @param {Object} error - Объект ошибки от Supabase
 * @returns {string} Сообщение об ошибке на русском
 */
export const getErrorMessage = (error) => {
  if (!error) return 'Неизвестная ошибка';
  
  if (error.message) {
    // Переводим основные сообщения об ошибках
    const message = error.message.toLowerCase();
    
    if (message.includes('not found')) {
      return 'Данные не найдены';
    }
    if (message.includes('duplicate')) {
      return 'Такие данные уже существуют';
    }
    if (message.includes('unauthorized') || message.includes('401')) {
      return 'Ошибка аутентификации';
    }
    if (message.includes('forbidden') || message.includes('403')) {
      return 'Доступ запрещен';
    }
    if (message.includes('network') || message.includes('connection')) {
      return 'Ошибка подключения к сети';
    }
    
    return error.message;
  }
  
  return JSON.stringify(error);
};

export default supabase;
