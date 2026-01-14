import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTelegramWebApp } from '../hooks/useTelegramWebApp';
import './SplashScreen.css';

export const SplashScreen = () => {
  const navigate = useNavigate();
  const { webApp, isReady } = useTelegramWebApp();

  useEffect(() => {
    if (isReady && webApp) {
      // Инициализация WebApp уже выполнена в хуке
      // Симуляция загрузки (2 секунды)
      const timer = setTimeout(() => {
        navigate('/home');
      }, 2000);

      return () => clearTimeout(timer);
    }
  }, [isReady, webApp, navigate]);

  return (
    <div className="splash-screen">
      <div className="splash-content">
        <div className="splash-logo">
          <svg
            width="80"
            height="80"
            viewBox="0 0 80 80"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <circle cx="40" cy="40" r="38" fill="var(--tg-theme-button-color, #3390ec)" />
            <path
              d="M40 20L50 35H30L40 20Z"
              fill="white"
            />
            <rect x="30" y="35" width="20" height="25" fill="white" />
            <path
              d="M25 45H55V55H25V45Z"
              fill="rgba(255,255,255,0.7)"
            />
          </svg>
        </div>
        <h1 className="splash-title">Мебель AR</h1>
        <div className="splash-loader">
          <span className="loader-spinner"></span>
          <p className="loader-text">Загрузка...</p>
        </div>
      </div>
    </div>
  );
};
