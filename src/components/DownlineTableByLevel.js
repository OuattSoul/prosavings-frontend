import React, { useState, useEffect, useCallback } from 'react';
import { FaUsers, FaTrophy, FaSpinner, FaChevronLeft, FaChevronRight } from 'react-icons/fa';
import { GRADE_CONFIG } from '../config';
import './DownlineTable.css';

const DownlineTableByLevel = ({ contract, rootAddress, maxDepth = 15 }) => {
  const [downlineByLevel, setDownlineByLevel] = useState({});
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [hasLoaded, setHasLoaded] = useState(false);
  const [selectedLevel, setSelectedLevel] = useState(1);

  // Fonction récursive pour collecter tous les membres du downline
  const collectDownlineMembers = useCallback(async (address, depth = 0, parentAddress = null) => {
    if (depth > maxDepth) {
      return [];
    }

    try {
      // Charger les infos du compte
      const accountInfo = await contract.getAccountFullInfo(address);

      // Parser les données
      const member = {
        address: address,
        grade: accountInfo[2] ? Number(accountInfo[2]) : 1,
        level: accountInfo[3] ? Number(accountInfo[3]) : 0,
        networkCount: accountInfo[4] ? Number(accountInfo[4]) : 0,
        totalEarnings: accountInfo[5] ? accountInfo[5].toString() : "0",
        depth: depth,
        parentAddress: parentAddress
      };

      let allMembers = [];

      // Ne pas inclure le noeud racine (depth 0)
      if (depth > 0) {
        allMembers.push(member);
      }

      // Charger les referrals (filleuls directs)
      let referrals = [];
      try {
        referrals = await contract.getReferrals(address);
      } catch (err) {
        console.warn(`Impossible de charger les filleuls de ${address}:`, err.message);
      }

      // Charger récursivement tous les enfants
      if (referrals && referrals.length > 0) {
        for (const referral of referrals) {
          const childMembers = await collectDownlineMembers(referral, depth + 1, address);
          allMembers = [...allMembers, ...childMembers];
        }
      }

      return allMembers;
    } catch (err) {
      console.error(`Erreur pour ${address}:`, err);
      return [];
    }
  }, [contract, maxDepth]);

  // Charger et organiser le downline par niveaux
  useEffect(() => {
    const loadDownline = async () => {
      if (!contract || !rootAddress || hasLoaded) return;

      setLoading(true);
      setError(null);

      try {
        console.log("📡 Chargement du downline complet pour:", rootAddress);
        const members = await collectDownlineMembers(rootAddress, 0);

        // Organiser les membres par niveau (depth)
        const byLevel = {};
        members.forEach(member => {
          if (!byLevel[member.depth]) {
            byLevel[member.depth] = [];
          }
          byLevel[member.depth].push(member);
        });

        setDownlineByLevel(byLevel);
        setHasLoaded(true);
        console.log("✅ Downline chargé et organisé par niveaux:", byLevel);
      } catch (err) {
        console.error("❌ Erreur chargement downline:", err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    loadDownline();
  }, [contract, rootAddress, hasLoaded, collectDownlineMembers]);

  // Fonction pour recharger manuellement
  const reloadDownline = async () => {
    setHasLoaded(false);
    setDownlineByLevel({});
    setError(null);
    setSelectedLevel(1);
  };

  // Calculer les niveaux disponibles et les statistiques
  const availableLevels = Object.keys(downlineByLevel)
    .map(Number)
    .sort((a, b) => a - b);

  const totalMembers = Object.values(downlineByLevel).reduce((sum, members) => sum + members.length, 0);

  // Membres du niveau sélectionné
  const currentLevelMembers = downlineByLevel[selectedLevel] || [];

  // Navigation entre niveaux
  const goToPrevLevel = () => {
    const currentIndex = availableLevels.indexOf(selectedLevel);
    if (currentIndex > 0) {
      setSelectedLevel(availableLevels[currentIndex - 1]);
    }
  };

  const goToNextLevel = () => {
    const currentIndex = availableLevels.indexOf(selectedLevel);
    if (currentIndex < availableLevels.length - 1) {
      setSelectedLevel(availableLevels[currentIndex + 1]);
    }
  };

  // Formater l'adresse
  const formatAddress = (address) => {
    return `${address.slice(0, 6)}...${address.slice(-4)}`;
  };

  // Formater les gains
  const formatEarnings = (earnings) => {
    const value = parseFloat(earnings) / 1e18; // Conversion depuis Wei
    return value.toFixed(2);
  };

  if (loading) {
    return (
      <div className="downline-table-loading">
        <FaSpinner className="spinner-icon" />
        <p>Chargement du downline complet...</p>
        <p className="loading-subtitle">Cela peut prendre quelques instants</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="downline-table-error">
        <p>Erreur lors du chargement du downline</p>
        <p className="error-details">{error}</p>
      </div>
    );
  }

  if (!hasLoaded) {
    return null;
  }

  return (
    <div className="downline-table-container">
      <div className="downline-table-header">
        <h3>
          <FaUsers />
          Votre Downline par Niveaux
        </h3>
        <div className="downline-stats">
          <span className="stat-badge">
            Total: {totalMembers} membre{totalMembers > 1 ? 's' : ''}
          </span>
          <button
            className="btn-reload"
            onClick={reloadDownline}
            disabled={loading}
            title="Recharger le downline"
          >
            🔄 Actualiser
          </button>
        </div>
      </div>

      {totalMembers === 0 ? (
        <div className="empty-downline">
          <p>Aucun membre dans votre downline pour le moment</p>
          <p className="empty-subtitle">Commencez à parrainer pour développer votre réseau</p>
        </div>
      ) : (
        <>
          {/* Navigation par niveaux */}
          <div className="level-navigation">
            <button
              className="level-nav-btn"
              onClick={goToPrevLevel}
              disabled={availableLevels.indexOf(selectedLevel) === 0}
            >
              <FaChevronLeft />
              Niveau Précédent
            </button>

            <div className="level-tabs">
              {availableLevels.map(level => (
                <button
                  key={level}
                  className={`level-tab ${level === selectedLevel ? 'active' : ''}`}
                  onClick={() => setSelectedLevel(level)}
                >
                  <div className="level-tab-label">Niveau {level}</div>
                  <div className="level-tab-count">
                    {downlineByLevel[level].length} membre{downlineByLevel[level].length > 1 ? 's' : ''}
                  </div>
                </button>
              ))}
            </div>

            <button
              className="level-nav-btn"
              onClick={goToNextLevel}
              disabled={availableLevels.indexOf(selectedLevel) === availableLevels.length - 1}
            >
              Niveau Suivant
              <FaChevronRight />
            </button>
          </div>

          {/* Info du niveau actuel */}
          <div className="level-info">
            <h4>Niveau {selectedLevel}</h4>
            <p>
              {currentLevelMembers.length} membre{currentLevelMembers.length > 1 ? 's' : ''} à ce niveau
              {selectedLevel === 1 && ' (vos filleuls directs)'}
            </p>
          </div>

          {/* Tableau des membres du niveau */}
          <div className="table-wrapper">
            <table className="downline-table">
              <thead>
                <tr>
                  <th>#</th>
                  <th>Adresse</th>
                  <th>Grade</th>
                  <th>Niveau Grade</th>
                  <th>Réseau</th>
                  <th>Gains (USDT)</th>
                </tr>
              </thead>
              <tbody>
                {currentLevelMembers.map((member, index) => {
                  const gradeInfo = GRADE_CONFIG[member.grade] || GRADE_CONFIG[1];

                  return (
                    <tr key={member.address}>
                      <td>{index + 1}</td>
                      <td className="address-cell">
                        <span className="address-text" title={member.address}>
                          {formatAddress(member.address)}
                        </span>
                      </td>
                      <td>
                        <span className="grade-badge" style={{ background: gradeInfo.color }}>
                          <FaTrophy />
                          {gradeInfo.name}
                        </span>
                      </td>
                      <td>
                        <span className="level-badge">
                          L{member.level}
                        </span>
                      </td>
                      <td>{member.networkCount}</td>
                      <td>{formatEarnings(member.totalEarnings)}</td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>

          {/* Résumé des niveaux */}
          <div className="levels-summary">
            <h4>Résumé par Niveaux</h4>
            <div className="levels-summary-grid">
              {availableLevels.map(level => (
                <div key={level} className={`summary-item ${level === selectedLevel ? 'active' : ''}`}>
                  <div className="summary-level">Niveau {level}</div>
                  <div className="summary-count">{downlineByLevel[level].length}</div>
                </div>
              ))}
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default DownlineTableByLevel;
