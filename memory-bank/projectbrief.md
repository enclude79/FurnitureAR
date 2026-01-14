# Project Requirement Document: Telegram Mini App

## 1. Обзор проекта

### 1.1 Описание
Telegram Mini App - современное веб-приложение, интегрированное в экосистему Telegram, предоставляющее пользователям удобный интерфейс для взаимодействия с функционалом приложения непосредственно в мессенджере.

### 1.2 Целевая аудитория
- Пользователи Telegram (iOS, Android, Desktop)
- Возрастная группа: 18-45 лет
- Технически подкованные пользователи, ценящие удобство и скорость

---

## 2. Стек технологий

### 2.1 Frontend
- **Framework**: React 18+
- **Template**: [Telegram-Mini-Apps/reactjs-template](https://github.com/Telegram-Mini-Apps/reactjs-template)
- **UI Library**: Telegram UI Components (@telegram-apps/telegram-ui)
- **Routing**: React Router DOM
- **State Management**: React Context API / Zustand
- **HTTP Client**: Axios / Fetch API
- **Styling**: CSS Modules / Styled Components
- **Build Tool**: Vite
- **SDK**: @telegram-apps/sdk-react

### 2.2 Backend (будущая интеграция)
- **BaaS**: Supabase
- **Database**: PostgreSQL (через Supabase)
- **Authentication**: Telegram Auth (через Supabase)
- **Storage**: Supabase Storage
- **Real-time**: Supabase Realtime

### 2.3 Текущее состояние
- Использование mock данных на frontend
- Локальное state management
- Эмуляция API запросов через задержки (setTimeout)

---

## 3. Ключевые фичи

### 3.1 Core Features
1. **Аутентификация через Telegram**
   - Автоматическая авторизация через Telegram WebApp
   - Получение данных пользователя (ID, имя, фото)

2. **Главный экран (Dashboard)**
   - Приветствие пользователя
   - Статистика активности
   - Быстрый доступ к основным разделам

3. **Профиль пользователя**
   - Отображение информации профиля
   - Редактирование настроек
   - История активности

4. **Каталог/Список элементов**
   - Просмотр списка элементов
   - Поиск и фильтрация
   - Детальный просмотр элемента

5. **Избранное**
   - Добавление/удаление из избранного
   - Просмотр избранных элементов

6. **Уведомления**
   - Центр уведомлений
   - Push-уведомления через Telegram

---

## 4. Основные экраны приложения

### 4.1 Splash Screen (Загрузочный экран)

#### Описание
Первый экран, который видит пользователь при запуске приложения. Отображается во время инициализации Telegram WebApp SDK.

#### Дизайн и стиль

**Визуальная концепция:**
- Минималистичный экран с центрированным логотипом
- Цветовая схема соответствует Telegram theme
- Плавная анимация появления

**Цветовая палитра:**
- Background: `var(--tg-theme-bg-color)` или `#ffffff` (light) / `#212121` (dark)
- Accent: `var(--tg-theme-button-color)` или `#3390ec`
- Logo/Text: `var(--tg-theme-text-color)` или `#000000` (light) / `#ffffff` (dark)

**Типографика:**
- App name: SF Pro Display / System, 24px, 600 weight
- Loading text: SF Pro Text / System, 14px, 400 weight

**Компоненты:**
```
┌─────────────────────────┐
│                         │
│                         │
│         [LOGO]          │
│                         │
│       App Name          │
│                         │
│    ⟳ Loading...         │
│                         │
│                         │
└─────────────────────────┘
```

#### Техническое задание

**Структура компонента:**
```jsx
// src/screens/SplashScreen.jsx
import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTelegramWebApp } from '@telegram-apps/sdk-react';
import './SplashScreen.css';

export const SplashScreen = () => {
  const navigate = useNavigate();
  const webApp = useTelegramWebApp();

  useEffect(() => {
    // Инициализация WebApp
    webApp.ready();
    webApp.expand();
    
    // Симуляция загрузки (2 секунды)
    const timer = setTimeout(() => {
      navigate('/home');
    }, 2000);

    return () => clearTimeout(timer);
  }, []);

  return (
    <div className="splash-screen">
      <div className="splash-content">
        <div className="splash-logo">
          {/* SVG Logo или иконка */}
        </div>
        <h1 className="splash-title">App Name</h1>
        <div className="splash-loader">
          <span className="loader-spinner"></span>
          <p className="loader-text">Loading...</p>
        </div>
      </div>
    </div>
  );
};
```

**CSS Стили:**
```css
/* src/screens/SplashScreen.css */
.splash-screen {
  display: flex;
  align-items: center;
  justify-content: center;
  min-height: 100vh;
  background: var(--tg-theme-bg-color, #ffffff);
  padding: 20px;
}

.splash-content {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 24px;
  animation: fadeIn 0.6s ease-out;
}

.splash-logo {
  width: 80px;
  height: 80px;
  display: flex;
  align-items: center;
  justify-content: center;
  animation: scaleIn 0.6s ease-out;
}

.splash-title {
  font-size: 24px;
  font-weight: 600;
  color: var(--tg-theme-text-color, #000000);
  margin: 0;
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
}

.splash-loader {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 12px;
}

.loader-spinner {
  width: 24px;
  height: 24px;
  border: 2px solid var(--tg-theme-hint-color, #999999);
  border-top-color: var(--tg-theme-button-color, #3390ec);
  border-radius: 50%;
  animation: spin 0.8s linear infinite;
}

.loader-text {
  font-size: 14px;
  color: var(--tg-theme-hint-color, #999999);
  margin: 0;
}

@keyframes fadeIn {
  from { opacity: 0; }
  to { opacity: 1; }
}

@keyframes scaleIn {
  from { 
    opacity: 0;
    transform: scale(0.8);
  }
  to { 
    opacity: 1;
    transform: scale(1);
  }
}

@keyframes spin {
  to { transform: rotate(360deg); }
}
```

**Требования:**
- Адаптивность: 100% viewport height, центрирование контента
- Анимация: плавное появление (fade-in 600ms)
- Spinner: вращающийся loader (CSS animation)
- Auto-redirect: через 2 секунды переход на Home
- Theme support: использование Telegram theme variables

---

### 4.2 Home Screen (Главный экран)

#### Описание
Основной экран приложения с приветствием пользователя, статистикой и быстрым доступом к основным функциям.

#### Дизайн и стиль

**Визуальная концепция:**
- Карточный layout с тенями
- Яркие акцентные цвета для кнопок действий
- Информационные блоки в виде cards
- Sticky header с градиентом

**Цветовая палитра:**
- Background: `#f5f5f5` (light) / `#1a1a1a` (dark)
- Cards: `#ffffff` (light) / `#2a2a2a` (dark)
- Accent: `#3390ec` (Telegram blue)
- Success: `#4caf50`
- Warning: `#ff9800`
- Shadow: `rgba(0, 0, 0, 0.08)`

**Типографика:**
- Greeting: SF Pro Display, 28px, 700 weight
- Section titles: SF Pro Text, 18px, 600 weight
- Card text: SF Pro Text, 16px, 400 weight
- Stats numbers: SF Pro Display, 32px, 700 weight
- Stats labels: SF Pro Text, 13px, 400 weight

**Компоненты:**
```
┌─────────────────────────┐
│ ┌─ Header ────────────┐ │
│ │ 👋 Hi, Username!    │ │
│ │ Welcome back        │ │
│ └─────────────────────┘ │
│                         │
│ ┌─ Stats ─────────────┐ │
│ │ [123]  [456]  [789] │ │
│ │ Items  Views  Likes │ │
│ └─────────────────────┘ │
│                         │
│ ┌─ Quick Actions ─────┐ │
│ │ [Explore] [Profile] │ │
│ │ [Favorites] [More]  │ │
│ └─────────────────────┘ │
│                         │
│ ┌─ Recent Activity ───┐ │
│ │ • Item 1            │ │
│ │ • Item 2            │ │
│ │ • Item 3            │ │
│ └─────────────────────┘ │
└─────────────────────────┘
```

#### Техническое задание

**Структура компонента:**
```jsx
// src/screens/HomeScreen.jsx
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTelegramWebApp, useMainButton } from '@telegram-apps/sdk-react';
import './HomeScreen.css';

export const HomeScreen = () => {
  const navigate = useNavigate();
  const webApp = useTelegramWebApp();
  const mainButton = useMainButton();
  
  const [userData, setUserData] = useState(null);
  const [stats, setStats] = useState({
    items: 0,
    views: 0,
    likes: 0
  });
  const [recentActivity, setRecentActivity] = useState([]);

  useEffect(() => {
    // Mock данные пользователя
    const user = webApp.initDataUnsafe?.user || {
      first_name: 'User',
      id: 12345
    };
    setUserData(user);

    // Mock статистика
    setTimeout(() => {
      setStats({
        items: 123,
        views: 456,
        likes: 789
      });
    }, 300);

    // Mock активность
    setTimeout(() => {
      setRecentActivity([
        { id: 1, title: 'Item 1', time: '2 hours ago' },
        { id: 2, title: 'Item 2', time: '5 hours ago' },
        { id: 3, title: 'Item 3', time: '1 day ago' }
      ]);
    }, 500);
  }, []);

  const quickActions = [
    { id: 'explore', label: 'Explore', icon: '🔍', path: '/catalog' },
    { id: 'profile', label: 'Profile', icon: '👤', path: '/profile' },
    { id: 'favorites', label: 'Favorites', icon: '⭐', path: '/favorites' },
    { id: 'settings', label: 'Settings', icon: '⚙️', path: '/settings' }
  ];

  return (
    <div className="home-screen">
      <header className="home-header">
        <div className="header-content">
          <h1 className="greeting">
            👋 Hi, {userData?.first_name || 'User'}!
          </h1>
          <p className="subgreeting">Welcome back</p>
        </div>
      </header>

      <div className="home-content">
        {/* Stats Section */}
        <section className="stats-section">
          <div className="stat-card">
            <div className="stat-number">{stats.items}</div>
            <div className="stat-label">Items</div>
          </div>
          <div className="stat-card">
            <div className="stat-number">{stats.views}</div>
            <div className="stat-label">Views</div>
          </div>
          <div className="stat-card">
            <div className="stat-number">{stats.likes}</div>
            <div className="stat-label">Likes</div>
          </div>
        </section>

        {/* Quick Actions */}
        <section className="actions-section">
          <h2 className="section-title">Quick Actions</h2>
          <div className="actions-grid">
            {quickActions.map(action => (
              <button
                key={action.id}
                className="action-button"
                onClick={() => navigate(action.path)}
              >
                <span className="action-icon">{action.icon}</span>
                <span className="action-label">{action.label}</span>
              </button>
            ))}
          </div>
        </section>

        {/* Recent Activity */}
        <section className="activity-section">
          <h2 className="section-title">Recent Activity</h2>
          <div className="activity-list">
            {recentActivity.map(item => (
              <div key={item.id} className="activity-item">
                <div className="activity-dot"></div>
                <div className="activity-content">
                  <p className="activity-title">{item.title}</p>
                  <p className="activity-time">{item.time}</p>
                </div>
              </div>
            ))}
          </div>
        </section>
      </div>
    </div>
  );
};
```

**CSS Стили:**
```css
/* src/screens/HomeScreen.css */
.home-screen {
  min-height: 100vh;
  background: var(--tg-theme-secondary-bg-color, #f5f5f5);
  padding-bottom: 20px;
}

.home-header {
  background: linear-gradient(135deg, 
    var(--tg-theme-button-color, #3390ec) 0%, 
    #2a7fd8 100%);
  padding: 24px 20px 32px;
  color: white;
  border-radius: 0 0 24px 24px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
}

.header-content {
  max-width: 600px;
  margin: 0 auto;
}

.greeting {
  font-size: 28px;
  font-weight: 700;
  margin: 0 0 4px 0;
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
}

.subgreeting {
  font-size: 16px;
  margin: 0;
  opacity: 0.9;
}

.home-content {
  max-width: 600px;
  margin: -16px auto 0;
  padding: 0 20px;
}

/* Stats Section */
.stats-section {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 12px;
  margin-bottom: 24px;
}

.stat-card {
  background: var(--tg-theme-bg-color, #ffffff);
  border-radius: 16px;
  padding: 20px 12px;
  text-align: center;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08);
  transition: transform 0.2s, box-shadow 0.2s;
}

.stat-card:active {
  transform: scale(0.98);
  box-shadow: 0 1px 4px rgba(0, 0, 0, 0.12);
}

.stat-number {
  font-size: 32px;
  font-weight: 700;
  color: var(--tg-theme-button-color, #3390ec);
  margin-bottom: 4px;
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
}

.stat-label {
  font-size: 13px;
  color: var(--tg-theme-hint-color, #999999);
  text-transform: uppercase;
  letter-spacing: 0.5px;
}

/* Quick Actions */
.actions-section,
.activity-section {
  margin-bottom: 24px;
}

.section-title {
  font-size: 18px;
  font-weight: 600;
  color: var(--tg-theme-text-color, #000000);
  margin: 0 0 16px 0;
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
}

.actions-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 12px;
}

.action-button {
  background: var(--tg-theme-bg-color, #ffffff);
  border: none;
  border-radius: 16px;
  padding: 24px 16px;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 8px;
  cursor: pointer;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08);
  transition: transform 0.2s, box-shadow 0.2s;
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
}

.action-button:active {
  transform: scale(0.98);
  box-shadow: 0 1px 4px rgba(0, 0, 0, 0.12);
}

.action-icon {
  font-size: 32px;
}

.action-label {
  font-size: 15px;
  font-weight: 500;
  color: var(--tg-theme-text-color, #000000);
}

/* Recent Activity */
.activity-list {
  background: var(--tg-theme-bg-color, #ffffff);
  border-radius: 16px;
  padding: 16px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08);
}

.activity-item {
  display: flex;
  align-items: flex-start;
  gap: 12px;
  padding: 12px 0;
  border-bottom: 1px solid var(--tg-theme-section-separator-color, #e5e5e5);
}

.activity-item:last-child {
  border-bottom: none;
}

.activity-dot {
  width: 8px;
  height: 8px;
  border-radius: 50%;
  background: var(--tg-theme-button-color, #3390ec);
  margin-top: 6px;
  flex-shrink: 0;
}

.activity-content {
  flex: 1;
}

.activity-title {
  font-size: 16px;
  font-weight: 500;
  color: var(--tg-theme-text-color, #000000);
  margin: 0 0 4px 0;
}

.activity-time {
  font-size: 13px;
  color: var(--tg-theme-hint-color, #999999);
  margin: 0;
}

/* Responsive */
@media (max-width: 360px) {
  .home-header {
    padding: 20px 16px 28px;
  }
  
  .greeting {
    font-size: 24px;
  }
  
  .stat-number {
    font-size: 28px;
  }
  
  .actions-grid {
    gap: 8px;
  }
  
  .action-button {
    padding: 20px 12px;
  }
}
```

**Требования:**
- Responsive: адаптация под экраны от 320px до 600px
- Animations: smooth transitions на buttons (200ms)
- Touch targets: минимум 44x44px для кнопок
- Loading states: skeleton screens для stats и activity
- Error handling: fallback для отсутствующих данных
- Accessibility: semantic HTML, ARIA labels

---

### 4.3 Catalog Screen (Экран каталога)

#### Описание
Экран со списком элементов, поиском, фильтрацией и возможностью добавления в избранное.

#### Дизайн и стиль

**Визуальная концепция:**
- Sticky search bar с плавающей тенью
- Grid layout для карточек товаров
- Pull-to-refresh функционал
- Infinite scroll для подгрузки

**Цветовая палитра:**
- Search bar bg: `#ffffff` (light) / `#2a2a2a` (dark)
- Item cards: `#ffffff` (light) / `#2a2a2a` (dark)
- Price color: `#4caf50`
- Discount badge: `#ff5722`
- Favorite icon: `#ff4081`

**Типографика:**
- Search placeholder: 16px, 400 weight
- Item title: 15px, 600 weight
- Item description: 13px, 400 weight
- Price: 18px, 700 weight

**Компоненты:**
```
┌─────────────────────────┐
│ ┌─ Search ────────────┐ │
│ │ 🔍 Search items...  │ │
│ └─────────────────────┘ │
│                         │
│ ┌─ Filters ───────────┐ │
│ │ [All] [New] [Sale]  │ │
│ └─────────────────────┘ │
│                         │
│ ┌──────┐  ┌──────┐     │
│ │ IMG  │  │ IMG  │     │
│ │Title │  │Title │     │
│ │$99   │  │$149  │     │
│ │  ♡   │  │  ♥   │     │
│ └──────┘  └──────┘     │
│                         │
│ ┌──────┐  ┌──────┐     │
│ │ IMG  │  │ IMG  │     │
│ │Title │  │Title │     │
│ │$79   │  │$199  │     │
│ │  ♡   │  │  ♡   │     │
│ └──────┘  └──────┘     │
└─────────────────────────┘
```

#### Техническое задание

**Структура компонента:**
```jsx
// src/screens/CatalogScreen.jsx
import { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { useHapticFeedback } from '@telegram-apps/sdk-react';
import './CatalogScreen.css';

export const CatalogScreen = () => {
  const navigate = useNavigate();
  const haptic = useHapticFeedback();
  
  const [searchQuery, setSearchQuery] = useState('');
  const [activeFilter, setActiveFilter] = useState('all');
  const [items, setItems] = useState([]);
  const [favorites, setFavorites] = useState(new Set());
  const [loading, setLoading] = useState(true);

  const filters = [
    { id: 'all', label: 'All' },
    { id: 'new', label: 'New' },
    { id: 'sale', label: 'Sale' },
    { id: 'popular', label: 'Popular' }
  ];

  useEffect(() => {
    loadItems();
  }, [activeFilter]);

  const loadItems = async () => {
    setLoading(true);
    
    // Mock данные
    setTimeout(() => {
      const mockItems = [
        {
          id: 1,
          title: 'Product One',
          description: 'Amazing product description',
          price: 99,
          image: 'https://via.placeholder.com/300x200/3390ec/ffffff?text=Product+1',
          isNew: true,
          onSale: false
        },
        {
          id: 2,
          title: 'Product Two',
          description: 'Another great product',
          price: 149,
          originalPrice: 199,
          image: 'https://via.placeholder.com/300x200/4caf50/ffffff?text=Product+2',
          isNew: false,
          onSale: true
        },
        {
          id: 3,
          title: 'Product Three',
          description: 'Premium quality item',
          price: 79,
          image: 'https://via.placeholder.com/300x200/ff9800/ffffff?text=Product+3',
          isNew: true,
          onSale: false
        },
        {
          id: 4,
          title: 'Product Four',
          description: 'Best seller product',
          price: 199,
          image: 'https://via.placeholder.com/300x200/9c27b0/ffffff?text=Product+4',
          isNew: false,
          onSale: false
        }
      ];
      
      setItems(mockItems);
      setLoading(false);
    }, 600);
  };

  const toggleFavorite = useCallback((itemId) => {
    haptic.impactOccurred('light');
    
    setFavorites(prev => {
      const newFavorites = new Set(prev);
      if (newFavorites.has(itemId)) {
        newFavorites.delete(itemId);
      } else {
        newFavorites.add(itemId);
      }
      return newFavorites;
    });
  }, [haptic]);

  const handleSearch = (e) => {
    setSearchQuery(e.target.value);
  };

  const handleFilterChange = (filterId) => {
    haptic.selectionChanged();
    setActiveFilter(filterId);
  };

  const filteredItems = items.filter(item =>
    item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    item.description.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="catalog-screen">
      {/* Search Bar */}
      <div className="catalog-header">
        <div className="search-container">
          <span className="search-icon">🔍</span>
          <input
            type="text"
            className="search-input"
            placeholder="Search items..."
            value={searchQuery}
            onChange={handleSearch}
          />
          {searchQuery && (
            <button 
              className="search-clear"
              onClick={() => setSearchQuery('')}
            >
              ✕
            </button>
          )}
        </div>

        {/* Filters */}
        <div className="filters-container">
          {filters.map(filter => (
            <button
              key={filter.id}
              className={`filter-chip ${activeFilter === filter.id ? 'active' : ''}`}
              onClick={() => handleFilterChange(filter.id)}
            >
              {filter.label}
            </button>
          ))}
        </div>
      </div>

      {/* Items Grid */}
      <div className="catalog-content">
        {loading ? (
          <div className="loading-container">
            <div className="spinner"></div>
            <p>Loading items...</p>
          </div>
        ) : (
          <div className="items-grid">
            {filteredItems.map(item => (
              <div 
                key={item.id} 
                className="item-card"
                onClick={() => navigate(`/item/${item.id}`)}
              >
                <div className="item-image-container">
                  <img 
                    src={item.image} 
                    alt={item.title}
                    className="item-image"
                  />
                  {item.onSale && (
                    <div className="item-badge sale-badge">Sale</div>
                  )}
                  {item.isNew && (
                    <div className="item-badge new-badge">New</div>
                  )}
                  <button
                    className="favorite-button"
                    onClick={(e) => {
                      e.stopPropagation();
                      toggleFavorite(item.id);
                    }}
                  >
                    {favorites.has(item.id) ? '♥' : '♡'}
                  </button>
                </div>
                
                <div className="item-info">
                  <h3 className="item-title">{item.title}</h3>
                  <p className="item-description">{item.description}</p>
                  <div className="item-price-container">
                    <span className="item-price">${item.price}</span>
                    {item.originalPrice && (
                      <span className="item-original-price">
                        ${item.originalPrice}
                      </span>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {!loading && filteredItems.length === 0 && (
          <div className="empty-state">
            <div className="empty-icon">🔍</div>
            <h3>No items found</h3>
            <p>Try adjusting your search or filters</p>
          </div>
        )}
      </div>
    </div>
  );
};
```

**CSS Стили:**
```css
/* src/screens/CatalogScreen.css */
.catalog-screen {
  min-height: 100vh;
  background: var(--tg-theme-secondary-bg-color, #f5f5f5);
}

.catalog-header {
  position: sticky;
  top: 0;
  background: var(--tg-theme-bg-color, #ffffff);
  padding: 16px 20px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08);
  z-index: 100;
}

.search-container {
  display: flex;
  align-items: center;
  gap: 12px;
  background: var(--tg-theme-secondary-bg-color, #f5f5f5);
  border-radius: 12px;
  padding: 12px 16px;
  margin-bottom: 16px;
}

.search-icon {
  font-size: 18px;
}

.search-input {
  flex: 1;
  border: none;
  background: transparent;
  font-size: 16px;
  color: var(--tg-theme-text-color, #000000);
  outline: none;
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
}

.search-input::placeholder {
  color: var(--tg-theme-hint-color, #999999);
}

.search-clear {
  background: none;
  border: none;
  font-size: 18px;
  color: var(--tg-theme-hint-color, #999999);
  cursor: pointer;
  padding: 0;
  display: flex;
  align-items: center;
  justify-content: center;
}

.filters-container {
  display: flex;
  gap: 8px;
  overflow-x: auto;
  -webkit-overflow-scrolling: touch;
  scrollbar-width: none;
}

.filters-container::-webkit-scrollbar {
  display: none;
}

.filter-chip {
  flex-shrink: 0;
  padding: 8px 16px;
  border: 1px solid var(--tg-theme-section-separator-color, #e5e5e5);
  border-radius: 20px;
  background: var(--tg-theme-bg-color, #ffffff);
  color: var(--tg-theme-text-color, #000000);
  font-size: 14px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s;
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
}

.filter-chip.active {
  background: var(--tg-theme-button-color, #3390ec);
  color: var(--tg-theme-button-text-color, #ffffff);
  border-color: var(--tg-theme-button-color, #3390ec);
}

.catalog-content {
  padding: 20px;
  max-width: 600px;
  margin: 0 auto;
}

.loading-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 60px 20px;
  gap: 16px;
}

.spinner {
  width: 40px;
  height: 40px;
  border: 3px solid var(--tg-theme-hint-color, #999999);
  border-top-color: var(--tg-theme-button-color, #3390ec);
  border-radius: 50%;
  animation: spin 0.8s linear infinite;
}

@keyframes spin {
  to { transform: rotate(360deg); }
}

.items-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 16px;
}

.item-card {
  background: var(--tg-theme-bg-color, #ffffff);
  border-radius: 16px;
  overflow: hidden;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08);
  cursor: pointer;
  transition: transform 0.2s, box-shadow 0.2s;
}

.item-card:active {
  transform: scale(0.98);
  box-shadow: 0 1px 4px rgba(0, 0, 0, 0.12);
}

.item-image-container {
  position: relative;
  width: 100%;
  padding-top: 66.67%;
  background: var(--tg-theme-secondary-bg-color, #f5f5f5);
}

.item-image {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.item-badge {
  position: absolute;
  top: 8px;
  left: 8px;
  padding: 4px 8px;
  border-radius: 8px;
  font-size: 11px;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.5px;
}

.sale-badge {
  background: #ff5722;
  color: white;
}

.new-badge {
  background: #4caf50;
  color: white;
}

.favorite-button {
  position: absolute;
  top: 8px;
  right: 8px;
  width: 32px;
  height: 32px;
  border-radius: 50%;
  background: rgba(255, 255, 255, 0.9);
  border: none;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 18px;
  cursor: pointer;
  transition: transform 0.2s;
}

.favorite-button:active {
  transform: scale(0.9);
}

.item-info {
  padding: 12px;
}

.item-title {
  font-size: 15px;
  font-weight: 600;
  color: var(--tg-theme-text-color, #000000);
  margin: 0 0 4px 0;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.item-description {
  font-size: 13px;
  color: var(--tg-theme-hint-color, #999999);
  margin: 0 0 8px 0;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.item-price-container {
  display: flex;
  align-items: center;
  gap: 8px;
}

.item-price {
  font-size: 18px;
  font-weight: 700;
  color: #4caf50;
}

.item-original-price {
  font-size: 14px;
  color: var(--tg-theme-hint-color, #999999);
  text-decoration: line-through;
}

.empty-state {
  text-align: center;
  padding: 60px 20px;
}

.empty-icon {
  font-size: 64px;
  margin-bottom: 16px;
}

.empty-state h3 {
  font-size: 20px;
  font-weight: 600;
  color: var(--tg-theme-text-color, #000000);
  margin: 0 0 8px 0;
}

.empty-state p {
  font-size: 14px;
  color: var(--tg-theme-hint-color, #999999);
  margin: 0;
}

@media (max-width: 360px) {
  .items-grid {
    gap: 12px;
  }
  
  .item-info {
    padding: 10px;
  }
}
```

**Требования:**
- Sticky search header при скролле
- Haptic feedback при добавлении в избранное и смене фильтров
- Smooth animations для всех интерактивных элементов
- Empty state для пустых результатов поиска
- Оптимизация изображений (lazy loading в будущем)

---

### 4.4 Profile Screen (Экран профиля)

#### Описание
Экран профиля пользователя с личной информацией, настройками и статистикой активности.

#### Дизайн и стиль

**Визуальная концепция:**
- Header с аватаром и основной информацией
- Секционный layout (информация, статистика, настройки)
- List-based дизайн для пунктов меню

**Цветовая палитра:**
- Header gradient: как на Home Screen
- Sections: белые карточки с разделителями
- Icons: accent color (#3390ec)

**Компоненты:**
```
┌─────────────────────────┐
│ ┌─ Header ────────────┐ │
│ │   [Avatar Photo]    │ │
│ │   Username          │ │
│ │   @username         │ │
│ └─────────────────────┘ │
│                         │
│ ┌─ Stats ─────────────┐ │
│ │ Joined: Jan 2024    │ │
│ │ Total Items: 15     │ │
│ └─────────────────────┘ │
│                         │
│ ┌─ Settings ──────────┐ │
│ │ › Edit Profile      │ │
│ │ › Notifications     │ │
│ │ › Privacy           │ │
│ │ › About             │ │
│ └─────────────────────┘ │
└─────────────────────────┘
```

#### Техническое задание

**Структура компонента:**
```jsx
// src/screens/ProfileScreen.jsx
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTelegramWebApp, useHapticFeedback } from '@telegram-apps/sdk-react';
import './ProfileScreen.css';

export const ProfileScreen = () => {
  const navigate = useNavigate();
  const webApp = useTelegramWebApp();
  const haptic = useHapticFeedback();
  const [userData, setUserData] = useState(null);
  const [stats, setStats] = useState({
    joined: '',
    totalItems: 0,
    totalLikes: 0
  });

  useEffect(() => {
    const user = webApp.initDataUnsafe?.user || {
      first_name: 'User',
      last_name: '',
      username: 'username',
      id: 12345
    };
    setUserData(user);

    // Mock stats
    setTimeout(() => {
      setStats({
        joined: 'January 2024',
        totalItems: 15,
        totalLikes: 128
      });
    }, 300);
  }, []);

  const menuItems = [
    { id: 'edit', label: 'Edit Profile', icon: '✏️', path: '/profile/edit' },
    { id: 'notifications', label: 'Notifications', icon: '🔔', path: '/profile/notifications' },
    { id: 'privacy', label: 'Privacy', icon: '🔒', path: '/profile/privacy' },
    { id: 'about', label: 'About', icon: 'ℹ️', path: '/about' }
  ];

  const handleMenuClick = (item) => {
    haptic.impactOccurred('light');
    navigate(item.path);
  };

  return (
    <div className="profile-screen">
      <header className="profile-header">
        <div className="profile-avatar">
          {userData?.photo_url ? (
            <img src={userData.photo_url} alt="Profile" />
          ) : (
            <div className="avatar-placeholder">
              {userData?.first_name?.charAt(0) || 'U'}
            </div>
          )}
        </div>
        <h1 className="profile-name">
          {userData?.first_name || 'User'} {userData?.last_name || ''}
        </h1>
        {userData?.username && (
          <p className="profile-username">@{userData.username}</p>
        )}
      </header>

      <div className="profile-content">
        <section className="profile-stats">
          <div className="stat-row">
            <span className="stat-label">Joined</span>
            <span className="stat-value">{stats.joined}</span>
          </div>
          <div className="stat-row">
            <span className="stat-label">Total Items</span>
            <span className="stat-value">{stats.totalItems}</span>
          </div>
          <div className="stat-row">
            <span className="stat-label">Total Likes</span>
            <span className="stat-value">{stats.totalLikes}</span>
          </div>
        </section>

        <section className="profile-menu">
          {menuItems.map((item, index) => (
            <button
              key={item.id}
              className="menu-item"
              onClick={() => handleMenuClick(item)}
            >
              <span className="menu-icon">{item.icon}</span>
              <span className="menu-label">{item.label}</span>
              <span className="menu-arrow">›</span>
            </button>
          ))}
        </section>
      </div>
    </div>
  );
};
```

**CSS Стили:**
```css
/* src/screens/ProfileScreen.css */
.profile-screen {
  min-height: 100vh;
  background: var(--tg-theme-secondary-bg-color, #f5f5f5);
}

.profile-header {
  background: linear-gradient(135deg, 
    var(--tg-theme-button-color, #3390ec) 0%, 
    #2a7fd8 100%);
  padding: 40px 20px;
  text-align: center;
  color: white;
  border-radius: 0 0 24px 24px;
}

.profile-avatar {
  width: 100px;
  height: 100px;
  margin: 0 auto 16px;
  border-radius: 50%;
  overflow: hidden;
  border: 4px solid rgba(255, 255, 255, 0.3);
}

.profile-avatar img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.avatar-placeholder {
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  background: rgba(255, 255, 255, 0.2);
  font-size: 40px;
  font-weight: 700;
}

.profile-name {
  font-size: 24px;
  font-weight: 700;
  margin: 0 0 4px 0;
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
}

.profile-username {
  font-size: 16px;
  margin: 0;
  opacity: 0.9;
}

.profile-content {
  max-width: 600px;
  margin: -16px auto 0;
  padding: 0 20px 20px;
}

.profile-stats {
  background: var(--tg-theme-bg-color, #ffffff);
  border-radius: 16px;
  padding: 16px;
  margin-bottom: 16px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08);
}

.stat-row {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 12px 0;
  border-bottom: 1px solid var(--tg-theme-section-separator-color, #e5e5e5);
}

.stat-row:last-child {
  border-bottom: none;
}

.stat-label {
  font-size: 15px;
  color: var(--tg-theme-hint-color, #999999);
}

.stat-value {
  font-size: 15px;
  font-weight: 600;
  color: var(--tg-theme-text-color, #000000);
}

.profile-menu {
  background: var(--tg-theme-bg-color, #ffffff);
  border-radius: 16px;
  overflow: hidden;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08);
}

.menu-item {
  width: 100%;
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 16px;
  border: none;
  background: transparent;
  border-bottom: 1px solid var(--tg-theme-section-separator-color, #e5e5e5);
  cursor: pointer;
  transition: background 0.2s;
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
}

.menu-item:last-child {
  border-bottom: none;
}

.menu-item:active {
  background: var(--tg-theme-secondary-bg-color, #f5f5f5);
}

.menu-icon {
  font-size: 20px;
}

.menu-label {
  flex: 1;
  text-align: left;
  font-size: 16px;
  color: var(--tg-theme-text-color, #000000);
}

.menu-arrow {
  font-size: 20px;
  color: var(--tg-theme-hint-color, #999999);
}
```

---

### 4.5 Favorites Screen (Экран избранного)

#### Описание
Экран с сохраненными пользователем элементами, аналогичный каталогу, но только с избранными товарами.

#### Дизайн и стиль

Использует тот же дизайн, что и Catalog Screen, но:
- Без поиска и фильтров
- Показывает только избранные элементы
- Empty state с призывом добавить что-то в избранное

**Компоненты:**
```
┌─────────────────────────┐
│ ┌─ Header ────────────┐ │
│ │ ⭐ Favorites         │ │
│ └─────────────────────┘ │
│                         │
│ ┌──────┐  ┌──────┐     │
│ │ IMG  │  │ IMG  │     │
│ │Title │  │Title │     │
│ │$99 ♥ │  │$149 ♥│     │
│ └──────┘  └──────┘     │
└─────────────────────────┘
```

#### Техническое задание

```jsx
// src/screens/FavoritesScreen.jsx
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useHapticFeedback } from '@telegram-apps/sdk-react';
import './FavoritesScreen.css';

export const FavoritesScreen = () => {
  const navigate = useNavigate();
  const haptic = useHapticFeedback();
  const [favorites, setFavorites] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadFavorites();
  }, []);

  const loadFavorites = () => {
    setLoading(true);
    // Mock данные
    setTimeout(() => {
      setFavorites([
        {
          id: 2,
          title: 'Product Two',
          description: 'Another great product',
          price: 149,
          originalPrice: 199,
          image: 'https://via.placeholder.com/300x200/4caf50/ffffff?text=Product+2',
          onSale: true
        }
      ]);
      setLoading(false);
    }, 500);
  };

  const removeFavorite = (itemId) => {
    haptic.notificationOccurred('warning');
    setFavorites(prev => prev.filter(item => item.id !== itemId));
  };

  return (
    <div className="favorites-screen">
      <header className="favorites-header">
        <h1>⭐ Favorites</h1>
      </header>

      <div className="favorites-content">
        {loading ? (
          <div className="loading-container">
            <div className="spinner"></div>
            <p>Loading favorites...</p>
          </div>
        ) : favorites.length === 0 ? (
          <div className="empty-state">
            <div className="empty-icon">⭐</div>
            <h3>No favorites yet</h3>
            <p>Items you favorite will appear here</p>
            <button 
              className="explore-button"
              onClick={() => navigate('/catalog')}
            >
              Explore Items
            </button>
          </div>
        ) : (
          <div className="items-grid">
            {favorites.map(item => (
              <div 
                key={item.id} 
                className="item-card"
                onClick={() => navigate(`/item/${item.id}`)}
              >
                <div className="item-image-container">
                  <img src={item.image} alt={item.title} className="item-image" />
                  {item.onSale && <div className="item-badge sale-badge">Sale</div>}
                  <button
                    className="favorite-button active"
                    onClick={(e) => {
                      e.stopPropagation();
                      removeFavorite(item.id);
                    }}
                  >
                    ♥
                  </button>
                </div>
                <div className="item-info">
                  <h3 className="item-title">{item.title}</h3>
                  <p className="item-description">{item.description}</p>
                  <div className="item-price-container">
                    <span className="item-price">${item.price}</span>
                    {item.originalPrice && (
                      <span className="item-original-price">${item.originalPrice}</span>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
```

**CSS Стили:**
```css
/* src/screens/FavoritesScreen.css */
.favorites-screen {
  min-height: 100vh;
  background: var(--tg-theme-secondary-bg-color, #f5f5f5);
}

.favorites-header {
  background: var(--tg-theme-bg-color, #ffffff);
  padding: 20px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08);
}

.favorites-header h1 {
  font-size: 24px;
  font-weight: 700;
  margin: 0;
  color: var(--tg-theme-text-color, #000000);
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
}

.favorites-content {
  padding: 20px;
  max-width: 600px;
  margin: 0 auto;
}

.explore-button {
  margin-top: 20px;
  padding: 12px 24px;
  background: var(--tg-theme-button-color, #3390ec);
  color: var(--tg-theme-button-text-color, #ffffff);
  border: none;
  border-radius: 12px;
  font-size: 16px;
  font-weight: 600;
  cursor: pointer;
  transition: transform 0.2s;
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
}

.explore-button:active {
  transform: scale(0.98);
}

.favorite-button.active {
  color: #ff4081;
}

/* Reuse styles from CatalogScreen */
```

---

### 4.6 Item Detail Screen (Экран детального просмотра)

#### Описание
Подробная информация о выбранном элементе с галереей изображений, описанием, ценой и действиями.

**Компоненты:**
```
┌─────────────────────────┐
│ [← Back]                │
│                         │
│ ┌─ Image Gallery ────┐ │
│ │  [Large Image]     │ │
│ │  • • •             │ │
│ └────────────────────┘ │
│                         │
│ Title of Product        │
│ ⭐ 4.5 (123 reviews)   │
│                         │
│ $99.00                  │
│                         │
│ Description text here   │
│ ...more text...         │
│                         │
│ [Add to Cart] [♥ Save] │
└─────────────────────────┘
```

---

### 4.7 Settings Screen (Экран настроек)

#### Описание
Настройки приложения: уведомления, тема, язык.

**Компоненты:**
```
┌─────────────────────────┐
│ ⚙️ Settings              │
│                         │
│ ┌─ Notifications ─────┐ │
│ │ Push Notifications  │ │
│ │ [Toggle ON/OFF]     │ │
│ └─────────────────────┘ │
│                         │
│ ┌─ Appearance ────────┐ │
│ │ Theme: Auto         │ │
│ │ [System/Light/Dark] │ │
│ └─────────────────────┘ │
│                         │
│ ┌─ About ─────────────┐ │
│ │ Version: 1.0.0      │ │
│ │ Terms & Privacy     │ │
│ └─────────────────────┘ │
└─────────────────────────┘
```

---

## 5. Навигация и роутинг

### 5.1 Структура маршрутов

```jsx
<Routes>
  <Route path="/" element={<SplashScreen />} />
  <Route path="/home" element={<HomeScreen />} />
  <Route path="/catalog" element={<CatalogScreen />} />
  <Route path="/item/:id" element={<ItemDetailScreen />} />
  <Route path="/favorites" element={<FavoritesScreen />} />
  <Route path="/profile" element={<ProfileScreen />} />
  <Route path="/profile/edit" element={<EditProfileScreen />} />
  <Route path="/profile/notifications" element={<NotificationsSettingsScreen />} />
  <Route path="/profile/privacy" element={<PrivacySettingsScreen />} />
  <Route path="/settings" element={<SettingsScreen />} />
  <Route path="/about" element={<AboutScreen />} />
  <Route path="*" element={<NotFoundScreen />} />
</Routes>
```

### 5.2 Bottom Navigation (опционально)

Для удобства навигации можно добавить нижнее меню:

```
┌─────────────────────────┐
│                         │
│    [Content Area]       │
│                         │
└─────────────────────────┘
│ [Home][Catalog][♥][👤] │
└─────────────────────────┘
```

---

## 6. Общие компоненты

### 6.1 Layout Component

Обертка для всех экранов, применяющая Telegram theme и обработку ошибок.

### 6.2 ErrorBoundary Component

Компонент для перехвата и отображения ошибок React.

### 6.3 LoadingSpinner Component

Переиспользуемый компонент загрузки.

### 6.4 EmptyState Component

Универсальный компонент для пустых состояний.

### 6.5 Button Component

Стандартизированные кнопки с Telegram styling.

---

## 7. Интеграция с Telegram

### 7.1 Telegram WebApp SDK

```javascript
// Инициализация
const webApp = window.Telegram.WebApp;
webApp.ready();
webApp.expand();

// Получение данных пользователя
const user = webApp.initDataUnsafe.user;

// Haptic Feedback
webApp.HapticFeedback.impactOccurred('light');
webApp.HapticFeedback.notificationOccurred('success');

// Main Button
webApp.MainButton.setText('Continue');
webApp.MainButton.show();
webApp.MainButton.onClick(callback);

// Back Button
webApp.BackButton.show();
webApp.BackButton.onClick(callback);

// Theme Colors
const bgColor = webApp.themeParams.bg_color;
const textColor = webApp.themeParams.text_color;
```

### 7.2 Theme Support

Приложение автоматически адаптируется под тему Telegram (light/dark).

---

## 8. Mock Data Structure

### 8.1 User Data
```javascript
{
  id: 12345,
  first_name: "John",
  last_name: "Doe",
  username: "johndoe",
  photo_url: "https://..."
}
```

### 8.2 Item Data
```javascript
{
  id: 1,
  title: "Product Name",
  description: "Product description",
  price: 99.99,
  originalPrice: 149.99,
  image: "https://...",
  images: ["url1", "url2"],
  isNew: true,
  onSale: false,
  rating: 4.5,
  reviewsCount: 123
}
```

### 8.3 Stats Data
```javascript
{
  items: 123,
  views: 456,
  likes: 789,
  joined: "January 2024",
  totalItems: 15,
  totalLikes: 128
}
```

---

## 9. Best Practices

### 9.1 Performance
- Lazy loading для изображений
- Code splitting для маршрутов
- Мемоизация expensive компонентов
- Debounce для поиска

### 9.2 Accessibility
- Semantic HTML
- ARIA labels
- Keyboard navigation
- Screen reader support
- Минимум 44x44px touch targets

### 9.3 Mobile Optimization
- Mobile-first подход
- Touch-friendly интерфейс
- Оптимизация под медленные сети
- Responsive images

### 9.4 Code Quality
- Функциональные компоненты с hooks
- Переиспользуемые компоненты
- Чистый и читаемый код
- Комментарии для сложной логики

---

## 10. Будущие улучшения

### 10.1 Phase 2 Features
- Интеграция с Supabase
- Real-time updates
- Push notifications
- Shopping cart
- Payment integration
- User reviews and ratings

### 10.2 Technical Improvements
- Service Worker для offline support
- Progressive Web App (PWA)
- Advanced analytics
- A/B testing
- Error tracking (Sentry)

---

## Заключение

Этот документ описывает полную структуру Telegram Mini App с фокусом на MVP версию (Splash + Home экраны). Все экраны спроектированы с учетом:
- Telegram Design Guidelines
- Mobile-first подхода
- Accessibility стандартов (WCAG 2.1 AA)
- Performance best practices
- Современных UI/UX трендов

Текущая реализация использует mock данные для прототипирования, с последующей интеграцией Supabase для production.
