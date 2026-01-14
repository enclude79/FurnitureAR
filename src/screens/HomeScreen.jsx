import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTelegramWebApp, useHapticFeedback } from '../hooks/useTelegramWebApp';
import useProducts from '../hooks/useProducts';
import './HomeScreen.css';

export const HomeScreen = () => {
  const navigate = useNavigate();
  const { user } = useTelegramWebApp();
  const { impactOccurred, selectionChanged } = useHapticFeedback();
  
  const {
    products,
    categories,
    activeCategory,
    loading,
    searchQuery,
    setSearchQuery,
    handleCategoryChange: changeCategory,
    getFilteredProducts,
  } = useProducts();

  const [displayedItems, setDisplayedItems] = useState([]);
  const [page, setPage] = useState(1);
  const ITEMS_PER_PAGE = 6;

  // Инициализируем отображаемые товары
  useEffect(() => {
    const filtered = getFilteredProducts(searchQuery);
    setDisplayedItems(filtered.slice(0, ITEMS_PER_PAGE));
    setPage(1);
  }, [products, searchQuery, getFilteredProducts]);

  // Infinite scroll
  useEffect(() => {
    const handleScroll = () => {
      if (window.innerHeight + window.scrollY >= document.documentElement.scrollHeight - 500) {
        loadMoreItems();
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, [products, displayedItems, page, searchQuery]);

  const loadMoreItems = () => {
    const filtered = getFilteredProducts(searchQuery);
    const nextPage = page + 1;
    const startIndex = page * ITEMS_PER_PAGE;
    const endIndex = startIndex + ITEMS_PER_PAGE;
    const newItems = filtered.slice(startIndex, endIndex);
    
    if (newItems.length > 0) {
      setDisplayedItems(prev => [...prev, ...newItems]);
      setPage(nextPage);
    }
  };

  const handleCategoryChange = (categoryId) => {
    selectionChanged();
    changeCategory(categoryId);
  };

  const handleSearch = (e) => {
    setSearchQuery(e.target.value);
  };

  const filteredItems = getFilteredProducts(searchQuery);

  const handleItemClick = (itemId) => {
    impactOccurred('light');
    navigate(`/item/${itemId}`);
  };


  return (
    <div className="home-screen">
      <header className="home-header">
        <div className="header-content">
          <h1 className="greeting">
            👋 Привет, {user?.first_name || 'Гость'}!
          </h1>
        </div>
      </header>

      <div className="home-content">
        {/* Search Bar */}
        <div className="search-section">
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
        </div>

        {/* Categories */}
        <section className="categories-section">
          <div className="categories-scroll">
            {categories.filter(cat => cat.isActive).map(category => (
              <button
                key={category.id}
                className={`category-chip ${activeCategory === category.id ? 'active' : ''}`}
                onClick={() => handleCategoryChange(category.id)}
                aria-label={`Категория ${category.name}`}
                aria-pressed={activeCategory === category.id}
              >
                <span className="category-icon">{category.icon}</span>
                <span className="category-name">{category.name}</span>
              </button>
            ))}
          </div>
        </section>

        {/* Catalog Grid */}
        <section className="catalog-section">
          {loading ? (
            <div className="loading-container">
              <div className="spinner"></div>
              <p>Загрузка товаров...</p>
            </div>
          ) : (
            <>
              <div className="items-grid">
                {filteredItems.map(item => (
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
                      {item.onSale && (
                        <div className="item-badge sale-badge">Скидка</div>
                      )}
                      {item.isNew && (
                        <div className="item-badge new-badge">Новинка</div>
                      )}
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

              {!loading && filteredItems.length === 0 && (
                <div className="empty-state">
                  <div className="empty-icon">🔍</div>
                  <h3>Ничего не найдено</h3>
                  <p>Попробуйте изменить поисковый запрос</p>
                </div>
              )}

              {displayedItems.length < filteredItems.length && (
                <div className="loading-more">
                  <div className="spinner-small"></div>
                  <p>Загрузка...</p>
                </div>
              )}
            </>
          )}
        </section>

        {/* Bottom Navigation */}
        <section className="bottom-nav">
          <button 
            className="nav-button"
            onClick={() => { impactOccurred('light'); navigate('/profile'); }}
          >
            <span className="nav-icon">👤</span>
            <span className="nav-label">Профиль</span>
          </button>
          <button 
            className="nav-button"
            onClick={() => { impactOccurred('light'); navigate('/favorites'); }}
          >
            <span className="nav-icon">⭐</span>
            <span className="nav-label">Избранное</span>
          </button>
          <button 
            className="nav-button"
            onClick={() => { impactOccurred('light'); navigate('/settings'); }}
          >
            <span className="nav-icon">⚙️</span>
            <span className="nav-label">Настройки</span>
          </button>
        </section>
      </div>
    </div>
  );
};
