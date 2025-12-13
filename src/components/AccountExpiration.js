import React from 'react';
import './AccountExpiration.css';

const AccountExpiration = ({ isExpired, grade, level }) => {
  if (!isExpired) {
    return null;
  }

  return (
    <div className="account-expiration-container">
      <div className="expiration-card">
        <div className="expiration-icon">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <circle cx="12" cy="12" r="10"></circle>
            <line x1="12" y1="8" x2="12" y2="12"></line>
            <line x1="12" y1="16" x2="12.01" y2="16"></line>
          </svg>
        </div>

        <div className="expiration-content">
          <h2 className="expiration-title">Compte Expiré</h2>
          <p className="expiration-message">
            Félicitations ! Vous avez atteint le niveau maximum (Grade {grade}, Niveau {level}).
          </p>
          <p className="expiration-details">
            Vous avez terminé de recevoir tous les gains possibles du programme ProSavings.
            Votre compte est maintenant marqué comme complété.
          </p>
        </div>

        <div className="expiration-status">
          <div className="status-badge expired">
            <span className="status-icon">✓</span>
            <span className="status-text">Complété</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AccountExpiration;
