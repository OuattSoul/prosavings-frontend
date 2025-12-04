import React from 'react';
import { 
  FaUsers, 
  FaNetworkWired, 
  FaTrophy, 
  FaCoins, 
  FaCalendar,
  FaChartLine,
  //FaRedo
} from 'react-icons/fa';
import { GRADE_CONFIG } from '../config';
import ErrorMessage from './ErrorMessage';
import EmptyState from './EmptyState';
import './Dashboard.css';

const Dashboard = ({ accountData, loading, error, onRetry }) => {
  // État de chargement
  if (loading) {
    return (
      <div className="loading-container">
        <div className="spinner"></div>
        <p>Chargement des données...</p>
      </div>
    );
  }

  // Gestion des erreurs
  if (error) {
    // Erreur : Compte non inscrit
    if (error.includes('non inscrit') || error.includes('not registered')) {
      return (
        <div className="dashboard">
          <div className="container">
            <EmptyState
              icon="user"
              type="warning"
              title="Compte Non Inscrit"
              message="Vous n'êtes pas encore inscrit dans le réseau ProSavings. Contactez votre sponsor pour obtenir un lien d'inscription."
              action={onRetry}
              actionLabel="Vérifier à nouveau"
            />
            <ErrorMessage
              type="info"
              title="Comment s'inscrire ?"
              message="Pour rejoindre ProSavings, vous avez besoin :"
              details="1. D'un lien de parrainage (fourni par votre sponsor)
2. De 20 tokens USDT dans votre wallet
3. D'approuver le contrat pour utiliser vos tokens"
            />
          </div>
        </div>
      );
    }

    // Erreur : Mauvaise adresse de contrat
    if (error.includes('out of result range') || error.includes('result range')) {
      return (
        <div className="dashboard">
          <div className="container">
            <ErrorMessage
              type="error"
              title="Erreur de Configuration"
              message="L'adresse du contrat semble incorrecte ou vous êtes sur le mauvais réseau."
              details={`Erreur technique: ${error}`}
              onRetry={onRetry}
            />
            <ErrorMessage
              type="info"
              title="Solutions possibles"
              message="Vérifiez les points suivants :"
              details="1. L'adresse du contrat dans src/config.js est correcte
2. Vous êtes connecté au réseau BSC (Mainnet ou Testnet)
3. Le contrat est bien déployé à cette adresse"
            />
          </div>
        </div>
      );
    }

    // Erreur : Problème de réseau
    if (error.includes('network') || error.includes('connection')) {
      return (
        <div className="dashboard">
          <div className="container">
            <ErrorMessage
              type="warning"
              title="Problème de Connexion"
              message="Impossible de se connecter au réseau blockchain."
              details={error}
              onRetry={onRetry}
            />
          </div>
        </div>
      );
    }

    // Erreur générique
    return (
      <div className="dashboard">
        <div className="container">
          <ErrorMessage
            type="error"
            title="Une Erreur est Survenue"
            message="Impossible de charger les données de votre compte."
            details={error}
            onRetry={onRetry}
          />
        </div>
      </div>
    );
  }

  // Pas de données
  if (!accountData) {
    return (
      <div className="dashboard">
        <div className="container">
          <EmptyState
            icon="wallet"
            type="info"
            title="Aucune Donnée"
            message="Connectez votre wallet pour voir vos informations."
          />
        </div>
      </div>
    );
  }

  // Compte non inscrit (via isRegistered = false)
  if (!accountData.isRegistered) {
    return (
      <div className="dashboard">
        <div className="container">
          <EmptyState
            icon="user"
            type="warning"
            title="Compte Non Inscrit"
            message="Vous n'êtes pas encore membre du réseau ProSavings."
            action={onRetry}
            actionLabel="Vérifier à nouveau"
          />
          <div className="grid grid-2">
            <ErrorMessage
              type="info"
              title="Pour vous inscrire"
              message="Vous avez besoin d'un lien de parrainage fourni par votre sponsor."
              details="Format du lien: https://app.prosavings.io/?sponsor=0x..."
            />
            <ErrorMessage
              type="info"
              title="Prérequis"
              message="Avant de vous inscrire, assurez-vous d'avoir :"
              details="• 20 USDT dans votre wallet
- Assez de BNB pour le gas (~0.001 BNB)
- Approuvé le contrat ProSavings"
            />
          </div>
        </div>
      </div>
    );
  }

  // ✅ AFFICHAGE NORMAL (compte inscrit)
  const { 
    grade, 
    level, 
    networkCount, 
    totalEarnings, 
    referralsCount,
    gradesUnlockedCount,
    isFirstAccount
  } = accountData;

  const currentGrade = GRADE_CONFIG[grade] || GRADE_CONFIG[1];

  return (
    <div className="dashboard">
      <div className="container">
        {/* En-tête */}
        <div className="dashboard-header">
          <h2>Mon Tableau de Bord</h2>
          {isFirstAccount && (
            <span className="badge badge-orange">👑 Compte Fondateur</span>
          )}
        </div>

        {/* Statistiques Principales */}
        <div className="stats-grid grid grid-4">
          {/* Grade */}
          <div className="stat-card card">
            <div className="stat-icon" style={{ background: currentGrade.color }}>
              <FaTrophy />
            </div>
            <div className="stat-content">
              <h3>{currentGrade.name}</h3>
              <p className="stat-label">Grade Actuel</p>
              <div className="stat-detail">
                <span className="badge badge-green">Niveau {level}</span>
              </div>
            </div>
          </div>

          {/* Réseau */}
          <div className="stat-card card">
            <div className="stat-icon orange">
              <FaNetworkWired />
            </div>
            <div className="stat-content">
              <h3>{networkCount}</h3>
              <p className="stat-label">Taille du Réseau</p>
              <div className="stat-detail">
                <FaChartLine className="text-green" />
                <span className="text-green">En croissance</span>
              </div>
            </div>
          </div>

          {/* Filleuls Directs */}
          <div className="stat-card card">
            <div className="stat-icon green">
              <FaUsers />
            </div>
            <div className="stat-content">
              <h3>{referralsCount} / 2</h3>
              <p className="stat-label">Filleuls Directs</p>
              <div className="stat-detail">
                {referralsCount === 2 ? (
                  <span className="badge badge-success">✓ Complet</span>
                ) : (
                  <span className="badge badge-warning">
                    {2 - referralsCount} restant{2 - referralsCount > 1 ? 's' : ''}
                  </span>
                )}
              </div>
            </div>
          </div>

          {/* Gains Totaux */}
          <div className="stat-card card">
            <div className="stat-icon orange">
              <FaCoins />
            </div>
            <div className="stat-content">
              <h3>{parseFloat(totalEarnings).toFixed(2)}</h3>
              <p className="stat-label">Gains Totaux (USDT)</p>
              <div className="stat-detail">
                <span className="text-muted">Depuis le début</span>
              </div>
            </div>
          </div>
        </div>

        {/* Progression des Grades */}
        <div className="grades-section">
          <div className="card">
            <div className="card-header">
              <h3 className="card-title">
                <FaTrophy className="text-orange" />
                Progression des Grades
              </h3>
            </div>
            <div className="card-body">
              <div className="grades-list">
                {[1, 2, 3].map((gradeNum) => {
                  const gradeInfo = GRADE_CONFIG[gradeNum];
                  const isUnlocked = accountData.gradesUnlocked[gradeNum];
                  const isCurrent = gradeNum === grade;

                  return (
                    <div 
                      key={gradeNum}
                      className={`grade-item ${isUnlocked ? 'unlocked' : 'locked'} ${isCurrent ? 'current' : ''}`}
                    >
                      <div className="grade-badge" style={{ 
                        background: isUnlocked ? gradeInfo.color : '#4A5568',
                        opacity: isUnlocked ? 1 : 0.5
                      }}>
                        <FaTrophy />
                      </div>
                      <div className="grade-info">
                        <h4>{gradeInfo.name}</h4>
                        <p>Coût: {gradeInfo.cost} USDT</p>
                        <p>Réseau min: {gradeInfo.minNetwork}</p>
                      </div>
                      <div className="grade-status">
                        {isUnlocked ? (
                          <span className="badge badge-success">✓ Débloqué</span>
                        ) : (
                          <span className="badge badge-warning">🔒 Verrouillé</span>
                        )}
                        {isCurrent && (
                          <span className="badge badge-orange">Actuel</span>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </div>

        {/* Infos Supplémentaires */}
        <div className="grid grid-2">
          {/* Infos Compte */}
          <div className="card">
            <div className="card-header">
              <h3 className="card-title">
                <FaCalendar className="text-green" />
                Informations du Compte
              </h3>
            </div>
            <div className="card-body">
              <div className="info-list">
                <div className="info-item">
                  <span className="info-label">Grade actuel:</span>
                  <span className="info-value">
                    {currentGrade.name} (Niveau {level})
                  </span>
                </div>
                <div className="info-item">
                  <span className="info-label">Grades débloqués:</span>
                  <span className="info-value">{gradesUnlockedCount} / 3</span>
                </div>
                <div className="info-item">
                  <span className="info-label">Statut:</span>
                  <span className="info-value">
                    {isFirstAccount ? (
                      <span className="badge badge-orange">Fondateur</span>
                    ) : (
                      <span className="badge badge-green">Membre</span>
                    )}
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Performance */}
          <div className="card">
            <div className="card-header">
              <h3 className="card-title">
                <FaChartLine className="text-orange" />
                Performance
              </h3>
            </div>
            <div className="card-body">
              <div className="info-list">
                <div className="info-item">
                  <span className="info-label">Taux de remplissage:</span>
                  <span className="info-value">{((referralsCount / 2) * 100).toFixed(0)}%</span>
                </div>
                <div className="info-item">
                  <span className="info-label">Gains moyens/personne:</span>
                  <span className="info-value">
                    {networkCount > 0 ? (parseFloat(totalEarnings) / networkCount).toFixed(2) : '0.00'} USDT
                  </span>
                </div>
                <div className="info-item">
                  <span className="info-label">Réseau actif:</span>
                  <span className="info-value">
                    <span className="badge badge-success">✓ Actif</span>
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;