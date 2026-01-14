import { useEffect } from 'react';
import PropTypes from 'prop-types';
import './Layout.css';

const Layout = ({ children }) => {
  useEffect(() => {
    // Apply Telegram theme colors to CSS variables
    if (window.Telegram?.WebApp) {
      const tg = window.Telegram.WebApp;
      const theme = tg.themeParams;

      if (theme.bg_color) {
        document.documentElement.style.setProperty('--tg-theme-bg-color', theme.bg_color);
      }
      if (theme.text_color) {
        document.documentElement.style.setProperty('--tg-theme-text-color', theme.text_color);
      }
      if (theme.hint_color) {
        document.documentElement.style.setProperty('--tg-theme-hint-color', theme.hint_color);
      }
      if (theme.link_color) {
        document.documentElement.style.setProperty('--tg-theme-link-color', theme.link_color);
      }
      if (theme.button_color) {
        document.documentElement.style.setProperty('--tg-theme-button-color', theme.button_color);
      }
      if (theme.button_text_color) {
        document.documentElement.style.setProperty('--tg-theme-button-text-color', theme.button_text_color);
      }
      if (theme.secondary_bg_color) {
        document.documentElement.style.setProperty('--tg-theme-secondary-bg-color', theme.secondary_bg_color);
      }
      if (theme.header_bg_color) {
        document.documentElement.style.setProperty('--tg-theme-header-bg-color', theme.header_bg_color);
      }
      if (theme.section_bg_color) {
        document.documentElement.style.setProperty('--tg-theme-section-bg-color', theme.section_bg_color);
      }
      if (theme.section_separator_color) {
        document.documentElement.style.setProperty('--tg-theme-section-separator-color', theme.section_separator_color);
      }
      if (theme.accent_text_color) {
        document.documentElement.style.setProperty('--tg-theme-accent-text-color', theme.accent_text_color);
      }
      if (theme.destructive_text_color) {
        document.documentElement.style.setProperty('--tg-theme-destructive-text-color', theme.destructive_text_color);
      }
      if (theme.subtitle_text_color) {
        document.documentElement.style.setProperty('--tg-theme-subtitle-text-color', theme.subtitle_text_color);
      }

      // Apply viewport height
      const setViewportHeight = () => {
        const vh = window.innerHeight * 0.01;
        document.documentElement.style.setProperty('--vh', `${vh}px`);
        
        if (tg.viewportHeight) {
          document.documentElement.style.setProperty('--tg-viewport-height', `${tg.viewportHeight}px`);
        }
      };

      setViewportHeight();
      window.addEventListener('resize', setViewportHeight);

      return () => {
        window.removeEventListener('resize', setViewportHeight);
      };
    }
  }, []);

  return (
    <div className="layout">
      <main className="layout-main">
        {children}
      </main>
    </div>
  );
};

Layout.propTypes = {
  children: PropTypes.node.isRequired
};

export default Layout;
