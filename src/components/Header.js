import React from 'react';
import { FaWallet, FaSignOutAlt, FaExclamationTriangle } from 'react-icons/fa';
import ThemeToggle from './ThemeToggle';
import { BSC_MAINNET } from '../config';
import './Header.css';

const Header = ({
  account,
  chainId,
  isConnecting,
  connectWallet,
  disconnectWallet,
  switchToBSC
}) => {
  const isCorrectNetwork = chainId === BSC_MAINNET.chainId;

  const formatAddress = (address) => {
    if (!address) return '';
    return `${address.slice(0, 6)}...${address.slice(-4)}`;
  };

  return (
    <header className="header">
      <div className="container">
        <div className="header-content">
          {/* Logo */}
          <div className="logo">
            <div className="logo-icon">PS</div>
            <span className="logo-text">ProSavings</span>
          </div>

          {/* Actions */}
          <div className="header-actions">
            {/* Theme Toggle */}
            <ThemeToggle />

            {/* Alerte Réseau */}
            {account && !isCorrectNetwork && (
              <button 
                className="btn btn-warning btn-network"
                onClick={switchToBSC}
                title="Changer de réseau"
              >
                <FaExclamationTriangle />
                <span>Mauvais réseau</span>
              </button>
            )}

            {/* Wallet */}
            {account ? (
              <div className="wallet-info">
                <div className="wallet-address">
                  <FaWallet />
                  <span>{formatAddress(account)}</span>
                </div>
                <button 
                  className="btn btn-secondary btn-disconnect"
                  onClick={disconnectWallet}
                  title="Déconnecter le wallet"
                  aria-label="Déconnecter"
                >
                  <FaSignOutAlt />
                </button>
              </div>
            ) : (
              <button 
                className="btn btn-primary"
                onClick={connectWallet}
                disabled={isConnecting}
              >
                <FaWallet />
                <span>{isConnecting ? 'Connexion...' : 'Connecter Wallet'}</span>
              </button>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
