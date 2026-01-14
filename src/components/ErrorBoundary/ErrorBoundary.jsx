import { Component } from 'react';
import PropTypes from 'prop-types';

class ErrorBoundary extends Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null, errorInfo: null };
  }

  static getDerivedStateFromError() {
    return { hasError: true };
  }

  componentDidCatch(error, errorInfo) {
    console.error('ErrorBoundary caught an error:', error, errorInfo);
    this.setState({
      error,
      errorInfo
    });
  }

  handleReset = () => {
    this.setState({ hasError: false, error: null, errorInfo: null });
    window.location.href = '/';
  };

  render() {
    if (this.state.hasError) {
      return (
        <div className="app-error">
          <div className="app-error-content">
            <div className="app-error-icon">⚠️</div>
            <h1 className="app-error-title">Что-то пошло не так</h1>
            <p className="app-error-message">
              Произошла ошибка при загрузке приложения. Пожалуйста, попробуйте еще раз.
            </p>
            {import.meta.env.DEV && this.state.error && (
              <details style={{ marginTop: '20px', textAlign: 'left' }}>
                <summary style={{ cursor: 'pointer', marginBottom: '8px' }}>
                  Детали ошибки
                </summary>
                <pre style={{ 
                  fontSize: '12px', 
                  overflow: 'auto', 
                  padding: '12px', 
                  background: 'rgba(0,0,0,0.05)', 
                  borderRadius: '8px' 
                }}>
                  {this.state.error.toString()}
                  {this.state.errorInfo?.componentStack}
                </pre>
              </details>
            )}
            <button 
              className="app-error-button" 
              onClick={this.handleReset}
            >
              Перезагрузить
            </button>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

ErrorBoundary.propTypes = {
  children: PropTypes.node.isRequired
};

export default ErrorBoundary;
