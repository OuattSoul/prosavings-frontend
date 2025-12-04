import React, { useState, useEffect } from 'react';
import { 
  FaUsers, 
  FaNetworkWired, 
  FaTrophy, 
  FaCoins,
  FaChartLine,
  FaCrown,
  FaUserShield,
  FaPause,
  FaPlay,
  FaExclamationTriangle
} from 'react-icons/fa';
import { ethers } from 'ethers';
import './AdminDashboard.css';

const AdminDashboard = ({ accountData, contract, loading }) => {
  const [globalStats, setGlobalStats] = useState({
    totalAccounts: 0,
    isPaused: false,
    registrationFee: "20"
  });
  const [loadingStats, setLoadingStats] = useState(false);

  // Charger les statistiques globales
  useEffect(() => {
    const loadGlobalStats = async () => {
      if (!contract) return;

      setLoadingStats(true);
      try {
        // Total de comptes inscrits
        const totalAccounts = await contract.totalAccountsRegistered();
        
        // Statut du contrat (pause)
        const isPaused = await contract.isPaused();
        
        // Frais d'inscription
        const regFee = await contract.REGISTRATION_FEE();

        setGlobalStats({
          totalAccounts: Number(totalAccounts),
          isPaused: isPaused,
          registrationFee: ethers.formatEther(regFee)
        });

        console.log("✅ Stats globales chargées:", {
          totalAccounts: Number(totalAccounts),
          isPaused,
          registrationFee: ethers.formatEther(regFee)
        });

      } catch (err) {
        console.error("❌ Erreur chargement stats globales:", err);
      } finally {
        setLoadingStats(false);
      }
    };

    loadGlobalStats();
  }, [contract]);

  if (loading || loadingStats) {
    return (
      <div className="loading-container">
        <div className="spinner"></div>
        <p>Chargement du dashboard administrateur...</p>
      </div>
    );
  }

  const { networkCount, totalEarnings, grade, level } = accountData;

  return (
    <div className="admin-dashboard">
      <div className="container">
        {/* En-tête Admin */}
        <div className="admin-header">
          <div className="admin-title">
            <FaCrown className="crown-icon" />
            <div>
              <h2>Dashboard Administrateur</h2>
              <p className="admin-subtitle">Compte Fondateur • Contrôle Total</p>
            </div>
          </div>
          <div className="admin-badges">
            <span className="badge badge-orange">
              <FaUserShield />
              Administrateur
            </span>
            <span className={`badge ${globalStats.isPaused ? 'badge-warning' : 'badge-green'}`}>
              {globalStats.isPaused ? (
                <>
                  <FaPause />
                  Contrat en Pause
                </>
              ) : (
                <>
                  <FaPlay />
                  Contrat Actif
                </>
              )}
            </span>
          </div>
        </div>

        {/* Statistiques Globales du Réseau */}
        <div className="stats-section">
          <h3 className="section-title">
            <FaChartLine className="text-orange" />
            Statistiques Globales du Réseau
          </h3>
          <div className="stats-grid grid grid-4">
            {/* Total Membres */}
            <div className="stat-card card admin-stat">
              <div className="stat-icon orange">
                <FaUsers />
              </div>
              <div className="stat-content">
                <h3>{globalStats.totalAccounts}</h3>
                <p className="stat-label">Membres Inscrits</p>
                <div className="stat-detail">
                  <span className="text-green">Total du réseau</span>
                </div>
              </div>
            </div>

            {/* Votre Réseau Direct */}
            <div className="stat-card card admin-stat">
              <div className="stat-icon green">
                <FaNetworkWired />
              </div>
              <div className="stat-content">
                <h3>{networkCount}</h3>
                <p className="stat-label">Votre Réseau</p>
                <div className="stat-detail">
                  <span className="text-muted">Descendance directe</span>
                </div>
              </div>
            </div>

            {/* Frais d'Inscription */}
            <div className="stat-card card admin-stat">
              <div className="stat-icon orange">
                <FaTrophy />
              </div>
              <div className="stat-content">
                <h3>{globalStats.registrationFee}</h3>
                <p className="stat-label">Frais d'Inscription</p>
                <div className="stat-detail">
                  <span className="text-muted">USDT par membre</span>
                </div>
              </div>
            </div>

            {/* Revenus Totaux */}
            <div className="stat-card card admin-stat">
              <div className="stat-icon green">
                <FaCoins />
              </div>
              <div className="stat-content">
                <h3>{parseFloat(totalEarnings).toFixed(2)}</h3>
                <p className="stat-label">Vos Revenus</p>
                <div className="stat-detail">
                  <span className="text-green">USDT</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Informations Admin */}
        <div className="grid grid-2">
          {/* Statut du Compte */}
          <div className="card admin-card">
            <div className="card-header">
              <h3 className="card-title">
                <FaCrown className="text-orange" />
                Statut du Compte Fondateur
              </h3>
            </div>
            <div className="card-body">
              <div className="info-list">
                <div className="info-item">
                  <span className="info-label">Type de compte:</span>
                  <span className="info-value">
                    <span className="badge badge-orange">
                      <FaCrown />
                      Fondateur
                    </span>
                  </span>
                </div>
                <div className="info-item">
                  <span className="info-label">Grade:</span>
                  <span className="info-value">
                    Grade {grade} • Niveau {level}
                  </span>
                </div>
                <div className="info-item">
                  <span className="info-label">Privilèges:</span>
                  <span className="info-value">
                    <span className="badge badge-green">Administrateur Total</span>
                  </span>
                </div>
                <div className="info-item">
                  <span className="info-label">Auto-parrainage:</span>
                  <span className="info-value">
                    <span className="badge badge-success">✓ Autorisé</span>
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Capacités Admin */}
          <div className="card admin-card">
            <div className="card-header">
              <h3 className="card-title">
                <FaUserShield className="text-green" />
                Capacités Administrateur
              </h3>
            </div>
            <div className="card-body">
              <div className="admin-capabilities">
                <div className="capability-item">
                  <FaPlay className="capability-icon text-green" />
                  <div>
                    <h4>Gestion du Contrat</h4>
                    <p>Pause / Unpause du système</p>
                  </div>
                </div>
                <div className="capability-item">
                  <FaTrophy className="capability-icon text-orange" />
                  <div>
                    <h4>Upgrades Manuels</h4>
                    <p>Débloquer les grades des membres</p>
                  </div>
                </div>
                <div className="capability-item">
                  <FaNetworkWired className="capability-icon text-green" />
                  <div>
                    <h4>Vue Complète</h4>
                    <p>Accès à tout le réseau</p>
                  </div>
                </div>
                <div className="capability-item">
                  <FaChartLine className="capability-icon text-orange" />
                  <div>
                    <h4>Statistiques Globales</h4>
                    <p>Métriques du réseau complet</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Métriques de Performance */}
        <div className="card admin-card">
          <div className="card-header">
            <h3 className="card-title">
              <FaChartLine className="text-orange" />
              Métriques de Performance Globale
            </h3>
          </div>
          <div className="card-body">
            <div className="grid grid-3">
              <div className="metric-card">
                <div className="metric-value">
                  {networkCount > 0 
                    ? ((networkCount / globalStats.totalAccounts) * 100).toFixed(1)
                    : 0}%
                </div>
                <div className="metric-label">Votre Part du Réseau</div>
                <div className="metric-sublabel">
                  {networkCount} sur {globalStats.totalAccounts} membres
                </div>
              </div>

              <div className="metric-card">
                <div className="metric-value">
                  {networkCount > 0
                    ? (parseFloat(totalEarnings) / networkCount).toFixed(2)
                    : '0.00'}
                </div>
                <div className="metric-label">Revenu Moyen / Membre</div>
                <div className="metric-sublabel">USDT par personne</div>
              </div>

              <div className="metric-card">
                <div className="metric-value">
                  {(globalStats.totalAccounts * parseFloat(globalStats.registrationFee)).toFixed(0)}
                </div>
                <div className="metric-label">Volume Total Inscriptions</div>
                <div className="metric-sublabel">USDT collectés</div>
              </div>
            </div>
          </div>
        </div>

        {/* Note Spéciale Admin */}
        <div className="admin-note">
          <div className="admin-note-icon">
            <FaExclamationTriangle />
          </div>
          <div className="admin-note-content">
            <h4>Note pour le Compte Fondateur</h4>
            <p>
              En tant que compte fondateur, vous n'avez pas de parrain ni de filleuls directs traditionnels. 
              Votre réseau représente l'ensemble de votre descendance dans le système. 
              Vous bénéficiez de privilèges administratifs complets sur le smart contract.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;