import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useHapticFeedback, useTelegramWebApp } from '../hooks/useTelegramWebApp';
import useFavorites from '../hooks/useFavorites';
import './FavoritesScreen.css';

export const FavoritesScreen = () => {
  const navigate = useNavigate();
  const { user } = useTelegramWebApp();
  const { impactOccurred, notificationOccurred } = useHapticFeedback();
  
  const { favorites, loading, removeFromFavorites } = useFavorites(user?.id);

  const removeFavorite = (itemId, itemTitle, e) => {
    e.stopPropagation();
    notificationOccurred('warning');
    if (user?.id) {
      removeFromFavorites(itemId, itemTitle);
    }
  };

  const handleItemClick = (itemId) => {
    impactOccurred('light');
    navigate(`/item/${itemId}`);
  };

  return (
    <div className="favorites-screen">
      <header className="favorites-header">
        <h1>⭐ Избранное</h1>
        {!loading && favorites.length > 0 && (
          <span className="favorites-count">{favorites.length} товаров</span>
        )}
      </header>

      <div className="favorites-content">
        {loading ? (
          <div className="loading-container">
            <div className="spinner"></div>
            <p>Загрузка избранного...</p>
          </div>
        ) : favorites.length === 0 ? (
          <div className="empty-state">
            <div className="empty-icon">⭐</div>
            <h3>Пока пусто</h3>
            <p>Добавленные в избранное товары появятся здесь</p>
            <button 
              className="explore-button"
              onClick={() => navigate('/catalog')}
            >
              Перейти в каталог
            </button>
          </div>
        ) : (
          <div className="items-grid">
            {favorites.map(item => (
              <div 
                key={item.id} 
                className="item-card"
                onClick={() => handleItemClick(item.id)}
                role="button"
                tabIndex={0}
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
                  <button
                    className="favorite-button active"
                    onClick={(e) => removeFavorite(item.id, item.title, e)}
                    aria-label="Убрать из избранного"
                  >
                    ♥
                  </button>
                </div>
                
                <div className="item-info">
                  <h3 className="item-title">{item.title}</h3>
                  <p className="item-description">{item.description}</p>
                  <div className="item-price-container">
                    <span className="item-price">{item.price.toLocaleString('ru-RU')} ₽</span>
                    {item.original_price && (
                      <span className="item-original-price">
                        {item.original_price.toLocaleString('ru-RU')} ₽
                      </span>
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
