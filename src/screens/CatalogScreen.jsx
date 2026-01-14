import { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { useHapticFeedback } from '../hooks/useTelegramWebApp';
import useProducts from '../hooks/useProducts';
import useFavorites from '../hooks/useFavorites';
import { useTelegramWebApp } from '../hooks/useTelegramWebApp';
import './CatalogScreen.css';

export const CatalogScreen = () => {
  const navigate = useNavigate();
  const { user } = useTelegramWebApp();
  const { impactOccurred, selectionChanged } = useHapticFeedback();
  
  const {
    products,
    activeFilter,
    searchQuery,
    loading,
    setSearchQuery,
    handleFilterChange,
    getFilteredProducts,
  } = useProducts();

  const { favoriteIds, toggleFavorite, isFavorite } = useFavorites(user?.id);

  const filters = [
    { id: 'all', label: 'Все' },
    { id: 'new', label: 'Новинки' },
    { id: 'sale', label: 'Скидки' },
    { id: 'popular', label: 'Популярное' }
  ];

  const handleToggleFavorite = useCallback((itemId, itemTitle, e) => {
    e.stopPropagation();
    impactOccurred('light');
    
    if (user?.id) {
      toggleFavorite(itemId, itemTitle);
    }
  }, [user?.id, toggleFavorite, impactOccurred]);

  const handleSearch = (e) => {
    setSearchQuery(e.target.value);
  };

  const handleFilterChangeWithFeedback = (filterId) => {
    selectionChanged();
    handleFilterChange(filterId);
  };

  const handleItemClick = (itemId) => {
    impactOccurred('light');
    navigate(`/item/${itemId}`);
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
          <span className="search-icon" role="img" aria-label="search">🔍</span>
          <input
            type="text"
            className="search-input"
            placeholder="Поиск мебели..."
            value={searchQuery}
            onChange={handleSearch}
            aria-label="Поиск мебели"
          />
          {searchQuery && (
            <button 
              className="search-clear"
              onClick={() => setSearchQuery('')}
              aria-label="Очистить поиск"
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
              onClick={() => handleFilterChangeWithFeedback(filter.id)}
              aria-label={`Фильтр ${filter.label}`}
              aria-pressed={activeFilter === filter.id}
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
            <p>Загрузка товаров...</p>
          </div>
        ) : (
          <div className="items-grid">
            {getFilteredProducts(searchQuery).map(item => (
              <div 
                key={item.id} 
                className="item-card"
                onClick={() => handleItemClick(item.id)}
                role="button"
                tabIndex={0}
                onKeyPress={(e) => {
                  if (e.key === 'Enter') handleItemClick(item.id);
                }}
              >
                <div className="item-image-container">
                  <img 
                    src={item.image} 
                    alt={item.title}
                    className="item-image"
                  />
                  {item.on_sale && (
                    <div className="item-badge sale-badge">Скидка</div>
                  )}
                  {item.is_new && (
                    <div className="item-badge new-badge">Новинка</div>
                  )}
                  <button
                    className={`favorite-button ${isFavorite(item.id) ? 'active' : ''}`}
                    onClick={(e) => handleToggleFavorite(item.id, item.title, e)}
                    aria-label={isFavorite(item.id) ? 'Убрать из избранного' : 'Добавить в избранное'}
                  >
                    {isFavorite(item.id) ? '♥' : '♡'}
                  </button>
                </div>
                
                <div className="item-info">
                  <h3 className="item-title">{item.title}</h3>
                  <p className="item-description">{item.description}</p>
                  <div className="item-price-container">
                    <span className="item-price">{item.price.toLocaleString('ru-RU')} ₽</span>
                    {item.originalPrice && (
                      <span className="item-original-price">
                        {item.originalPrice.toLocaleString('ru-RU')} ₽
                      </span>
                    )}
                  </div>
                  {item.rating && (
                    <div className="item-rating">
                      <span className="rating-stars">⭐ {item.rating}</span>
                      <span className="rating-count">({item.reviewsCount})</span>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}

        {!loading && getFilteredProducts(searchQuery).length === 0 && (
          <div className="empty-state">
            <div className="empty-icon">🔍</div>
            <h3>Ничего не найдено</h3>
            <p>Попробуйте изменить поиск или фильтры</p>
            <button 
              className="reset-button"
              onClick={() => {
                setSearchQuery('');
                handleFilterChange('all');
              }}
            >
              Сбросить фильтры
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
