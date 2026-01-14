import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useHapticFeedback, useBackButton, useTelegramWebApp } from '../hooks/useTelegramWebApp';
import useProducts from '../hooks/useProducts';
import useFavorites from '../hooks/useFavorites';
import './ItemDetailScreen.css';

export const ItemDetailScreen = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useTelegramWebApp();
  const { impactOccurred, notificationOccurred } = useHapticFeedback();
  
  const { getProductById } = useProducts();
  const { isFavorite, toggleFavorite } = useFavorites(user?.id);
  
  const [item, setItem] = useState(null);
  const [loading, setLoading] = useState(true);
  const [selectedImage, setSelectedImage] = useState(0);
  const [quantity, setQuantity] = useState(1);

  // Back button
  useBackButton(() => navigate(-1));

  useEffect(() => {
    loadItemDetails();
  }, [id]);

  const loadItemDetails = async () => {
    setLoading(true);
    try {
      const data = await getProductById(parseInt(id));
      setItem(data);
    } catch (error) {
      console.error('Error loading item:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleToggleFavorite = () => {
    impactOccurred('medium');
    if (user?.id && item) {
      toggleFavorite(item.id, item.title);
    }
  };

  const handleAddToCart = () => {
    notificationOccurred('success');
    // TODO: Add to cart functionality
  };

  const handleImageSelect = (index) => {
    impactOccurred('light');
    setSelectedImage(index);
  };

  const handleQuantityChange = (delta) => {
    impactOccurred('light');
    setQuantity(Math.max(1, quantity + delta));
  };

  if (loading) {
    return (
      <div className="item-detail-screen loading">
        <div className="loading-container">
          <div className="spinner"></div>
          <p>Загрузка товара...</p>
        </div>
      </div>
    );
  }

  if (!item) {
    return (
      <div className="item-detail-screen error">
        <div className="error-container">
          <div className="error-icon">❌</div>
          <h2>Товар не найден</h2>
          <button onClick={() => navigate('/catalog')}>
            Вернуться в каталог
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="item-detail-screen">
      {/* Image Gallery */}
      <div className="gallery-section">
        <div className="main-image-container">
          <img 
            src={item.images[selectedImage]} 
            alt={item.title}
            className="main-image"
          />
          <button 
            className={`favorite-button ${isFavorite(item.id) ? 'active' : ''}`}
            onClick={handleToggleFavorite}
            aria-label={isFavorite(item.id) ? 'Remove from favorites' : 'Add to favorites'}
          >
            {isFavorite(item.id) ? '♥' : '♡'}
          </button>
          {item.on_sale && (
            <div className="sale-badge">Sale</div>
          )}
          {item.is_new && (
            <div className="new-badge">New</div>
          )}
        </div>
        
        {item.images.length > 1 && (
          <div className="thumbnails">
            {item.images.map((image, index) => (
              <button
                key={index}
                className={`thumbnail ${selectedImage === index ? 'active' : ''}`}
                onClick={() => handleImageSelect(index)}
              >
                <img src={image} alt={`${item.title} ${index + 1}`} />
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Item Info */}
      <div className="item-content">
        <div className="item-header">
          <div className="item-category">{item.category}</div>
          <h1 className="item-title">{item.title}</h1>
          
          <div className="item-rating-section">
            <div className="rating-display">
              <span className="stars">⭐ {item.rating}</span>
              <span className="reviews-count">({item.reviewsCount} отзывов)</span>
            </div>
            {item.inStock ? (
              <div className="stock-status in-stock">✓ В наличии</div>
            ) : (
              <div className="stock-status out-of-stock">✗ Нет в наличии</div>
            )}
          </div>

          <div className="price-section">
            <div className="current-price">${item.price}</div>
            {item.originalPrice && (
              <div className="original-price">${item.originalPrice}</div>
            )}
            {item.originalPrice && (
              <div className="discount-badge">
                -{Math.round((1 - item.price / item.originalPrice) * 100)}%
              </div>
            )}
          </div>
        </div>

        {/* Description */}
        <div className="item-section">
          <h2 className="section-title">Description</h2>
          <p className="item-description">{item.description}</p>
        </div>

        {/* Specifications */}
        {item.specifications && (
          <div className="item-section">
            <h2 className="section-title">Specifications</h2>
            <div className="specifications-grid">
              {Object.entries(item.specifications).map(([key, value]) => (
                <div key={key} className="spec-item">
                  <span className="spec-label">{key}:</span>
                  <span className="spec-value">{value}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Features */}
        {item.features && item.features.length > 0 && (
          <div className="item-section">
            <h2 className="section-title">Features</h2>
            <ul className="features-list">
              {item.features.map((feature, index) => (
                <li key={index} className="feature-item">
                  <span className="feature-icon">✓</span>
                  {feature}
                </li>
              ))}
            </ul>
          </div>
        )}

        {/* Delivery Info */}
        {item.deliveryTime && (
          <div className="item-section">
            <h2 className="section-title">Доставка</h2>
            <div className="delivery-info">
              <span className="delivery-icon">🚚</span>
              <span className="delivery-text">Срок доставки: {item.deliveryTime}</span>
            </div>
          </div>
        )}
      </div>

      {/* Bottom Actions */}
      <div className="bottom-actions">
        <div className="quantity-selector">
          <button 
            className="quantity-button"
            onClick={() => handleQuantityChange(-1)}
            disabled={quantity <= 1}
            aria-label="Уменьшить количество"
          >
            −
          </button>
          <span className="quantity-value">{quantity}</span>
          <button 
            className="quantity-button"
            onClick={() => handleQuantityChange(1)}
            aria-label="Увеличить количество"
          >
            +
          </button>
        </div>
        
        <button 
          className="add-to-cart-button"
          onClick={handleAddToCart}
          disabled={!item.inStock}
        >
          {item.inStock ? `В корзину • ${(item.price * quantity).toLocaleString('ru-RU')} ₽` : 'Нет в наличии'}
        </button>
      </div>
    </div>
  );
};
