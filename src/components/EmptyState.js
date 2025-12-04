import React from 'react';
import { FaUser, FaWallet, FaExclamationCircle } from 'react-icons/fa';
import './EmptyState.css';

const EmptyState = ({ 
  icon = 'user',
  title, 
  message, 
  action,
  actionLabel,
  type = 'info'
}) => {
  const getIcon = () => {
    switch (icon) {
      case 'user':
        return <FaUser />;
      case 'wallet':
        return <FaWallet />;
      case 'warning':
        return <FaExclamationCircle />;
      default:
        return <FaUser />;
    }
  };

  return (
    <div className={`empty-state empty-state-${type}`}>
      <div className="empty-state-icon">
        {getIcon()}
      </div>
      <h2 className="empty-state-title">{title}</h2>
      <p className="empty-state-message">{message}</p>
      {action && (
        <button className="btn btn-primary" onClick={action}>
          {actionLabel || 'Action'}
        </button>
      )}
    </div>
  );
};

export default EmptyState;