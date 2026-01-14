import { useEffect, useState } from 'react';

/**
 * Custom hook для работы с Telegram WebApp SDK
 * @returns {Object} Telegram WebApp API
 */
export const useTelegramWebApp = () => {
  const [webApp, setWebApp] = useState(null);
  const [user, setUser] = useState(null);
  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    if (window.Telegram?.WebApp) {
      const tg = window.Telegram.WebApp;
      
      // Инициализация WebApp
      tg.ready();
      tg.expand();
      
      // Включаем отображение кнопки закрытия
      tg.enableClosingConfirmation();
      
      setWebApp(tg);
      setUser(tg.initDataUnsafe?.user || null);
      setIsReady(true);

      // Логирование для отладки
      console.log('Telegram WebApp initialized:', {
        version: tg.version,
        platform: tg.platform,
        colorScheme: tg.colorScheme,
        user: tg.initDataUnsafe?.user
      });
    } else {
      // Fallback для разработки вне Telegram
      console.warn('Telegram WebApp SDK not found. Running in development mode.');
      
      const mockWebApp = {
        ready: () => {},
        expand: () => {},
        close: () => {},
        enableClosingConfirmation: () => {},
        disableClosingConfirmation: () => {},
        isClosingConfirmationEnabled: false,
        initDataUnsafe: {
          user: {
            id: 12345,
            first_name: 'Test',
            last_name: 'User',
            username: 'testuser'
          }
        },
        themeParams: {
          bg_color: '#ffffff',
          text_color: '#000000',
          hint_color: '#999999',
          link_color: '#3390ec',
          button_color: '#3390ec',
          button_text_color: '#ffffff'
        },
        colorScheme: 'light',
        platform: 'unknown',
        version: '7.0',
        MainButton: {
          text: '',
          color: '#3390ec',
          textColor: '#ffffff',
          isVisible: false,
          isActive: true,
          isProgressVisible: false,
          setText: () => {},
          onClick: () => {},
          offClick: () => {},
          show: () => {},
          hide: () => {},
          enable: () => {},
          disable: () => {},
          showProgress: () => {},
          hideProgress: () => {}
        },
        BackButton: {
          isVisible: false,
          onClick: () => {},
          offClick: () => {},
          show: () => {},
          hide: () => {}
        },
        HapticFeedback: {
          impactOccurred: (style) => {
            console.log('Haptic impact:', style);
          },
          notificationOccurred: (type) => {
            console.log('Haptic notification:', type);
          },
          selectionChanged: () => {
            console.log('Haptic selection changed');
          }
        }
      };

      setWebApp(mockWebApp);
      setUser(mockWebApp.initDataUnsafe.user);
      setIsReady(true);
    }
  }, []);

  return {
    webApp,
    user,
    isReady,
    platform: webApp?.platform,
    colorScheme: webApp?.colorScheme,
    themeParams: webApp?.themeParams
  };
};

/**
 * Hook для работы с Main Button
 */
export const useMainButton = () => {
  const { webApp } = useTelegramWebApp();
  const [isVisible, setIsVisible] = useState(false);

  const show = (text, onClick) => {
    if (webApp?.MainButton) {
      webApp.MainButton.setText(text);
      webApp.MainButton.onClick(onClick);
      webApp.MainButton.show();
      setIsVisible(true);
    }
  };

  const hide = () => {
    if (webApp?.MainButton) {
      webApp.MainButton.hide();
      setIsVisible(false);
    }
  };

  const setText = (text) => {
    if (webApp?.MainButton) {
      webApp.MainButton.setText(text);
    }
  };

  const showProgress = () => {
    if (webApp?.MainButton) {
      webApp.MainButton.showProgress();
    }
  };

  const hideProgress = () => {
    if (webApp?.MainButton) {
      webApp.MainButton.hideProgress();
    }
  };

  return {
    show,
    hide,
    setText,
    showProgress,
    hideProgress,
    isVisible
  };
};

/**
 * Hook для работы с Back Button
 */
export const useBackButton = (onClick) => {
  const { webApp } = useTelegramWebApp();

  useEffect(() => {
    if (webApp?.BackButton && onClick) {
      webApp.BackButton.onClick(onClick);
      webApp.BackButton.show();

      return () => {
        webApp.BackButton.offClick(onClick);
        webApp.BackButton.hide();
      };
    }
  }, [webApp, onClick]);
};

/**
 * Hook для Haptic Feedback
 */
export const useHapticFeedback = () => {
  const { webApp } = useTelegramWebApp();

  const impactOccurred = (style = 'light') => {
    if (webApp?.HapticFeedback) {
      webApp.HapticFeedback.impactOccurred(style);
    }
  };

  const notificationOccurred = (type = 'success') => {
    if (webApp?.HapticFeedback) {
      webApp.HapticFeedback.notificationOccurred(type);
    }
  };

  const selectionChanged = () => {
    if (webApp?.HapticFeedback) {
      webApp.HapticFeedback.selectionChanged();
    }
  };

  return {
    impactOccurred,
    notificationOccurred,
    selectionChanged
  };
};
