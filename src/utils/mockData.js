// Mock Data Service
// Симуляция API запросов с задержками

/**
 * Получить список категорий мебели
 * @returns {Promise<Array>}
 */
export const getCategories = () => {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve([
        { id: 'all', name: 'Все', icon: '🏠', isActive: true },
        { id: 'sofas', name: 'Диваны', icon: '🛋️', isActive: true },
        { id: 'tables', name: 'Столы', icon: '🪵', isActive: true },
        { id: 'chairs', name: 'Кресла', icon: '🪑', isActive: true },
        { id: 'cabinets', name: 'Шкафы', icon: '📚', isActive: true },
        { id: 'beds', name: 'Кровати', icon: '🛏️', isActive: true }
      ]);
    }, 200);
  });
};

/**
 * Получить статистику пользователя
 * @returns {Promise<Object>}
 */
export const getUserStats = () => {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve({
        items: 123,
        views: 456,
        likes: 789
      });
    }, 300);
  });
};

/**
 * Получить последнюю активность пользователя
 * @returns {Promise<Array>}
 */
export const getRecentActivity = () => {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve([
        { 
          id: 1, 
          title: 'Просмотрел товар "Кресло Релакс"', 
          time: '2 часа назад',
          type: 'view'
        },
        { 
          id: 2, 
          title: 'Добавил в избранное "Стол Классик"', 
          time: '5 часов назад',
          type: 'favorite'
        },
        { 
          id: 3, 
          title: 'Оставил отзыв на "Диван Комфорт"', 
          time: '1 день назад',
          type: 'review'
        }
      ]);
    }, 500);
  });
};

/**
 * Получить список товаров каталога
 * @param {Object} options - Опции фильтрации
 * @returns {Promise<Array>}
 */
export const getCatalogItems = (options = {}) => {
  return new Promise((resolve) => {
    setTimeout(() => {
      const allItems = [
        {
          id: 1,
          title: 'Угловой диван "Комфорт"',
          description: 'Удобный 3-местный угловой диван',
          price: 45000,
          image: 'https://via.placeholder.com/600x400/9c27b0/ffffff?text=Диван+Комфорт',
          isNew: true,
          onSale: false,
          category: 'sofas',
          rating: 4.9,
          reviewsCount: 123
        },
        {
          id: 2,
          title: 'Диван-кровать "Модерн"',
          description: 'Раскладной диван с ортопедическим матрасом',
          price: 38000,
          originalPrice: 52000,
          image: 'https://via.placeholder.com/600x400/3f51b5/ffffff?text=Диван+Модерн',
          isNew: false,
          onSale: true,
          category: 'sofas',
          rating: 4.7,
          reviewsCount: 89
        },
        {
          id: 3,
          title: 'Обеденный стол "Классик"',
          description: 'Стол из массива дуба на 6 персон',
          price: 28000,
          image: 'https://via.placeholder.com/600x400/4caf50/ffffff?text=Стол+Классик',
          isNew: true,
          onSale: false,
          category: 'tables',
          rating: 4.8,
          reviewsCount: 67
        },
        {
          id: 4,
          title: 'Журнальный столик "Лофт"',
          description: 'Стильный столик в стиле лофт',
          price: 12000,
          originalPrice: 16000,
          image: 'https://via.placeholder.com/600x400/e91e63/ffffff?text=Столик+Лофт',
          isNew: false,
          onSale: true,
          category: 'tables',
          rating: 4.6,
          reviewsCount: 56
        },
        {
          id: 5,
          title: 'Кресло "Релакс"',
          description: 'Мягкое кресло с подставкой для ног',
          price: 18000,
          image: 'https://via.placeholder.com/600x400/3390ec/ffffff?text=Кресло+Релакс',
          isNew: true,
          onSale: false,
          category: 'chairs',
          rating: 4.5,
          reviewsCount: 45
        },
        {
          id: 6,
          title: 'Офисное кресло "Эрго"',
          description: 'Эргономичное кресло для работы',
          price: 9500,
          originalPrice: 12000,
          image: 'https://via.placeholder.com/600x400/00bcd4/ffffff?text=Кресло+Эрго',
          isNew: false,
          onSale: true,
          category: 'chairs',
          rating: 4.4,
          reviewsCount: 78
        },
        {
          id: 7,
          title: 'Шкаф-купе "Премиум"',
          description: 'Вместительный шкаф с зеркалом',
          price: 55000,
          image: 'https://via.placeholder.com/600x400/795548/ffffff?text=Шкаф+Премиум',
          isNew: true,
          onSale: false,
          category: 'cabinets',
          rating: 4.8,
          reviewsCount: 92
        },
        {
          id: 8,
          title: 'Комод "Скандинавия"',
          description: 'Вместительный комод в скандинавском стиле',
          price: 16000,
          image: 'https://via.placeholder.com/600x400/2196f3/ffffff?text=Комод',
          isNew: false,
          onSale: false,
          category: 'cabinets',
          rating: 4.7,
          reviewsCount: 34
        },
        {
          id: 9,
          title: 'Кровать "Люкс" 160x200',
          description: 'Двуспальная кровать с подъемным механизмом',
          price: 42000,
          originalPrice: 55000,
          image: 'https://via.placeholder.com/600x400/ff9800/ffffff?text=Кровать+Люкс',
          isNew: false,
          onSale: true,
          category: 'beds',
          rating: 4.9,
          reviewsCount: 115
        },
        {
          id: 10,
          title: 'Детская кровать "Облако"',
          description: 'Кровать с бортиками 80x160',
          price: 22000,
          image: 'https://via.placeholder.com/600x400/ffeb3b/ffffff?text=Кровать+Облако',
          isNew: true,
          onSale: false,
          category: 'beds',
          rating: 4.6,
          reviewsCount: 48
        },
        {
          id: 11,
          title: 'Прямой диван "Престиж"',
          description: 'Классический прямой диван',
          price: 35000,
          image: 'https://via.placeholder.com/600x400/673ab7/ffffff?text=Диван+Престиж',
          isNew: false,
          onSale: false,
          category: 'sofas',
          rating: 4.6,
          reviewsCount: 71
        },
        {
          id: 12,
          title: 'Рабочий стол "Профи"',
          description: 'Письменный стол с ящиками',
          price: 15000,
          image: 'https://via.placeholder.com/600x400/009688/ffffff?text=Стол+Профи',
          isNew: true,
          onSale: false,
          category: 'tables',
          rating: 4.7,
          reviewsCount: 52
        }
      ];

      let filteredItems = [...allItems];

      // Применяем фильтры
      if (options.filter) {
        switch (options.filter) {
          case 'new':
            filteredItems = filteredItems.filter(item => item.isNew);
            break;
          case 'sale':
            filteredItems = filteredItems.filter(item => item.onSale);
            break;
          case 'popular':
            filteredItems = filteredItems.sort((a, b) => b.reviewsCount - a.reviewsCount);
            break;
        }
      }

      // Применяем поиск
      if (options.search) {
        const searchLower = options.search.toLowerCase();
        filteredItems = filteredItems.filter(item =>
          item.title.toLowerCase().includes(searchLower) ||
          item.description.toLowerCase().includes(searchLower)
        );
      }

      resolve(filteredItems);
    }, 600);
  });
};

/**
 * Получить детали товара по ID
 * @param {number} itemId
 * @returns {Promise<Object>}
 */
export const getItemDetails = (itemId) => {
  return new Promise((resolve) => {
    setTimeout(() => {
      // Простая логика для демонстрации разных товаров
      const itemsMap = {
        1: {
          id: 1,
          title: 'Угловой диван "Комфорт"',
          description: 'Удобный 3-местный угловой диван с мягкими подушками и прочным каркасом. Идеально подходит для просторных гостиных. Обивка из качественной износостойкой ткани.',
          price: 45000,
          originalPrice: null,
          images: [
            'https://via.placeholder.com/600x400/9c27b0/ffffff?text=Диван+Комфорт+1',
            'https://via.placeholder.com/600x400/7b1fa2/ffffff?text=Диван+Комфорт+2',
            'https://via.placeholder.com/600x400/6a1b9a/ffffff?text=Диван+Комфорт+3'
          ],
          isNew: true,
          onSale: false,
          category: 'sofas',
          rating: 4.9,
          reviewsCount: 123,
          specifications: {
            Материал: 'Велюр премиум',
            Размеры: '280x180x85 см',
            Вес: '95 кг',
            Цвет: 'Серый'
          },
          features: [
            'Раскладной механизм',
            'Ортопедическое основание',
            'Съемные чехлы',
            'Бельевой ящик',
            'Гарантия 2 года'
          ],
          inStock: true,
          deliveryTime: '2-3 рабочих дня'
        },
        4: {
          id: 4,
          title: 'Журнальный столик "Лофт"',
          description: 'Стильный журнальный столик в индустриальном стиле. Сочетание металла и натурального дерева создает уникальный дизайн.',
          price: 12000,
          originalPrice: 16000,
          images: [
            'https://via.placeholder.com/600x400/e91e63/ffffff?text=Столик+Лофт+1',
            'https://via.placeholder.com/600x400/c2185b/ffffff?text=Столик+Лофт+2',
            'https://via.placeholder.com/600x400/ad1457/ffffff?text=Столик+Лофт+3'
          ],
          isNew: false,
          onSale: true,
          category: 'tables',
          rating: 4.6,
          reviewsCount: 56,
          specifications: {
            Материал: 'Дуб + металл',
            Размеры: '100x60x45 см',
            Вес: '18 кг',
            Цвет: 'Орех'
          },
          features: [
            'Натуральное дерево',
            'Металлический каркас',
            'Нижняя полка для хранения',
            'Защитное покрытие',
            'Легко чистится'
          ],
          inStock: true,
          deliveryTime: '1-2 рабочих дня'
        }
      };

      // Возвращаем конкретный товар или дефолтный
      const item = itemsMap[itemId] || {
        id: itemId,
        title: 'Товар #' + itemId,
        description: 'Качественная мебель для вашего дома. Современный дизайн и комфорт.',
        price: 25000,
        images: [
          `https://via.placeholder.com/600x400/3390ec/ffffff?text=Товар+${itemId}+Фото+1`,
          `https://via.placeholder.com/600x400/2196f3/ffffff?text=Товар+${itemId}+Фото+2`,
          `https://via.placeholder.com/600x400/03a9f4/ffffff?text=Товар+${itemId}+Фото+3`
        ],
        isNew: false,
        onSale: false,
        category: 'furniture',
        rating: 4.5,
        reviewsCount: 45,
        specifications: {
          Материал: 'ЛДСП',
          Размеры: '100x50x75 см',
          Вес: '20 кг',
          Цвет: 'Белый'
        },
        features: [
          'Прочная конструкция',
          'Легкая сборка',
          'Современный дизайн',
          'Гарантия 1 год'
        ],
        inStock: true,
        deliveryTime: '3-5 рабочих дней'
      };
      
      resolve(item);
    }, 400);
  });
};

/**
 * Получить профиль пользователя (дополнительные данные)
 * @returns {Promise<Object>}
 */
export const getUserProfile = () => {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve({
        joined: 'Январь 2024',
        totalItems: 15,
        totalLikes: 128,
        totalReviews: 8,
        level: 'Серебряный участник',
        points: 450
      });
    }, 300);
  });
};

/**
 * Получить избранные товары пользователя
 * @returns {Promise<Array>}
 */
export const getFavoriteItems = () => {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve([
        {
          id: 2,
          title: 'Диван-кровать "Модерн"',
          description: 'Раскладной диван с ортопедическим матрасом',
          price: 38000,
          originalPrice: 52000,
          image: 'https://via.placeholder.com/600x400/3f51b5/ffffff?text=Диван+Модерн',
          onSale: true
        },
        {
          id: 1,
          title: 'Угловой диван "Комфорт"',
          description: 'Удобный 3-местный угловой диван',
          price: 45000,
          image: 'https://via.placeholder.com/600x400/9c27b0/ffffff?text=Диван+Комфорт',
          onSale: false
        }
      ]);
    }, 500);
  });
};

/**
 * Добавить товар в избранное
 * @param {number} itemId
 * @returns {Promise<boolean>}
 */
export const addToFavorites = (itemId) => {
  return new Promise((resolve) => {
    setTimeout(() => {
      console.log(`Item ${itemId} added to favorites`);
      resolve(true);
    }, 200);
  });
};

/**
 * Удалить товар из избранного
 * @param {number} itemId
 * @returns {Promise<boolean>}
 */
export const removeFromFavorites = (itemId) => {
  return new Promise((resolve) => {
    setTimeout(() => {
      console.log(`Item ${itemId} removed from favorites`);
      resolve(true);
    }, 200);
  });
};
