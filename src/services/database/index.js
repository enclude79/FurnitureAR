/**
 * Экспорт всех сервисов базы данных
 */

export * as usersService from './users';
export * as categoriesService from './categories';
export * as productsService from './products';
export * as favoritesService from './favorites';
export * as activityService from './activity';
export * as storageService from './storage';

// Для удобства импорта
export { default as users } from './users';
export { default as categories } from './categories';
export { default as products } from './products';
export { default as favorites } from './favorites';
export { default as activity } from './activity';
export { default as storage } from './storage';
