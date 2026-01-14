import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import PropTypes from 'prop-types';
import ErrorBoundary from './components/ErrorBoundary/ErrorBoundary';
import Layout from './components/Layout/Layout';
import { SplashScreen } from './screens/SplashScreen';
import { HomeScreen } from './screens/HomeScreen';
import { CatalogScreen } from './screens/CatalogScreen';
import { ItemDetailScreen } from './screens/ItemDetailScreen';
import { FavoritesScreen } from './screens/FavoritesScreen';
import { ProfileScreen } from './screens/ProfileScreen';
import './App.css';

// Placeholder компонент для будущих экранов
const ComingSoon = ({ title }) => {
  return (
    <div className="coming-soon">
      <div className="coming-soon-content">
        <div className="coming-soon-icon">🚧</div>
        <h2 className="coming-soon-title">{title}</h2>
        <p className="coming-soon-text">Эта функция скоро появится!</p>
        <button 
          className="coming-soon-button"
          onClick={() => window.history.back()}
        >
          Назад
        </button>
      </div>
    </div>
  );
};

ComingSoon.propTypes = {
  title: PropTypes.string.isRequired
};

function App() {
  return (
    <ErrorBoundary>
      <Router>
        <Layout>
          <Routes>
            {/* Main Routes */}
            <Route path="/" element={<SplashScreen />} />
            <Route path="/home" element={<HomeScreen />} />
            <Route path="/catalog" element={<CatalogScreen />} />
            <Route path="/item/:id" element={<ItemDetailScreen />} />
            <Route path="/favorites" element={<FavoritesScreen />} />
            <Route path="/profile" element={<ProfileScreen />} />
            
            {/* Placeholder Routes */}
            <Route 
              path="/orders" 
              element={<ComingSoon title="Мои заказы" />} 
            />
            <Route 
              path="/help" 
              element={<ComingSoon title="Помощь" />} 
            />
            <Route 
              path="/profile/edit" 
              element={<ComingSoon title="Редактирование профиля" />} 
            />
            <Route 
              path="/profile/notifications" 
              element={<ComingSoon title="Настройки уведомлений" />} 
            />
            <Route 
              path="/profile/privacy" 
              element={<ComingSoon title="Приватность" />} 
            />
            <Route 
              path="/settings" 
              element={<ComingSoon title="Настройки" />} 
            />
            <Route 
              path="/about" 
              element={<ComingSoon title="О приложении" />} 
            />
            
            {/* 404 - Not Found */}
            <Route 
              path="/404" 
              element={
                <div className="not-found">
                  <div className="not-found-content">
                    <div className="not-found-icon">404</div>
                    <h2 className="not-found-title">Страница не найдена</h2>
                    <p className="not-found-text">
                      Запрашиваемая страница не существует.
                    </p>
                    <button 
                      className="not-found-button"
                      onClick={() => window.location.href = '/home'}
                    >
                      На главную
                    </button>
                  </div>
                </div>
              } 
            />
            
            {/* Redirect all unmatched routes to 404 */}
            <Route path="*" element={<Navigate to="/404" replace />} />
          </Routes>
        </Layout>
      </Router>
    </ErrorBoundary>
  );
}

export default App;
