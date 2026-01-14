import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTelegramWebApp, useHapticFeedback } from '../hooks/useTelegramWebApp';
import useUser from '../hooks/useUser';
import './ProfileScreen.css';

export const ProfileScreen = () => {
  const navigate = useNavigate();
  const { user } = useTelegramWebApp();
  const { impactOccurred } = useHapticFeedback();
  
  const { stats, loading, initializeUser } = useUser();

  useEffect(() => {
    if (user) {
      initializeUser(user);
    }
  }, [user, initializeUser]);

  const menuItems = [
    { id: 'edit', label: 'Редактировать профиль', icon: '✏️', path: '/profile/edit' },
    { id: 'orders', label: 'Мои заказы', icon: '📦', path: '/orders' },
    { id: 'notifications', label: 'Уведомления', icon: '🔔', path: '/profile/notifications' },
    { id: 'privacy', label: 'Приватность', icon: '🔒', path: '/profile/privacy' },
    { id: 'help', label: 'Помощь', icon: '❓', path: '/help' },
    { id: 'about', label: 'О приложении', icon: 'ℹ️', path: '/about' }
  ];

  const handleMenuClick = (item) => {
    impactOccurred('light');
    navigate(item.path);
  };

  if (loading) {
    return (
      <div className="profile-screen loading">
        <div className="loading-container">
          <div className="spinner"></div>
          <p>Загрузка профиля...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="profile-screen">
      <header className="profile-header">
        <div className="profile-avatar">
          {user?.photo_url ? (
            <img src={user.photo_url} alt="Profile" />
          ) : (
            <div className="avatar-placeholder">
              {user?.first_name?.charAt(0) || 'U'}
            </div>
          )}
        </div>
        <h1 className="profile-name">
          {user?.first_name || 'User'} {user?.last_name || ''}
        </h1>
        {user?.username && (
          <p className="profile-username">@{user.username}</p>
        )}
        {stats?.level && (
          <div className="profile-level">{stats.level}</div>
        )}
      </header>

      <div className="profile-content">
        <section className="profile-stats">
          <div className="stat-row">
            <span className="stat-label">С нами с</span>
            <span className="stat-value">{stats?.created_at ? new Date(stats.created_at).toLocaleDateString('ru-RU', { month: 'long', year: 'numeric' }) : 'Январь 2024'}</span>
          </div>
          <div className="stat-row">
            <span className="stat-label">Всего заказов</span>
            <span className="stat-value">{stats?.total_items || 0}</span>
          </div>
          <div className="stat-row">
            <span className="stat-label">Отметок "нравится"</span>
            <span className="stat-value">{stats?.total_likes || 0}</span>
          </div>
          <div className="stat-row">
            <span className="stat-label">Отзывов написано</span>
            <span className="stat-value">{stats?.total_reviews || 0}</span>
          </div>
          {stats?.points !== undefined && (
            <div className="stat-row">
              <span className="stat-label">Баллы</span>
              <span className="stat-value highlight">{stats.points} б</span>
            </div>
          )}
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

        <section className="profile-actions">
          <button 
            className="logout-button"
            onClick={() => {
              impactOccurred('medium');
              // TODO: Implement logout
              alert('Функция выхода скоро будет доступна!');
            }}
          >
            🚪 Выход
          </button>
        </section>
      </div>
    </div>
  );
};
