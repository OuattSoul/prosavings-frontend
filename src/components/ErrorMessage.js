import React from 'react';
import { 
  FaExclamationTriangle, 
  FaInfoCircle, 
  FaCheckCircle,
  FaTimesCircle,
  FaRedo 
} from 'react-icons/fa';
import './ErrorMessage.css';

const ErrorMessage = ({ 
  type = 'error', 
  title, 
  message, 
  details,
  onRetry,
  showIcon = true 
}) => {
  const getIcon = () => {
    switch (type) {
      case 'error':
        return <FaTimesCircle />;
      case 'warning':
        return <FaExclamationTriangle />;
      case 'info':
        return <FaInfoCircle />;
      case 'success':
        return <FaCheckCircle />;
      default:
        return <FaInfoCircle />;
    }
  };

  const getConfig = () => {
    switch (type) {
      case 'error':
        return {
          className: 'error-message error-type-error',
          iconColor: '#E53E3E',
          title: title || 'Erreur'
        };
      case 'warning':
        return {
          className: 'error-message error-type-warning',
          iconColor: '#ED8936',
          title: title || 'Attention'
        };
      case 'info':
        return {
          className: 'error-message error-type-info',
          iconColor: '#3182CE',
          title: title || 'Information'
        };
      case 'success':
        return {
          className: 'error-message error-type-success',
          iconColor: '#38A169',
          title: title || 'Succès'
        };
      default:
        return {
          className: 'error-message error-type-info',
          iconColor: '#3182CE',
          title: title || 'Information'
        };
    }
  };

  const config = getConfig();

  return (
    <div className={config.className}>
      {showIcon && (
        <div className="error-icon" style={{ color: config.iconColor }}>
          {getIcon()}
        </div>
      )}
      <div className="error-content">
        <h3 className="error-title">{config.title}</h3>
        {message && <p className="error-message-text">{message}</p>}
        {details && <p className="error-details">{details}</p>}
        {onRetry && (
          <button className="btn btn-primary error-retry" onClick={onRetry}>
            <FaRedo />
            Réessayer
          </button>
        )}
      </div>
    </div>
  );
};

export default ErrorMessage;