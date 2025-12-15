import React, { useState, useEffect, useCallback } from 'react';
import { FaUsers, FaTrophy, FaSpinner, FaChevronLeft, FaChevronRight } from 'react-icons/fa';
import { GRADE_CONFIG } from '../config';
import './DownlineTable.css';

const DownlineTable = ({ contract, rootAddress, maxDepth = 15 }) => {
  const [downlineList, setDownlineList] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [hasLoaded, setHasLoaded] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

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

  // Charger la liste complète du downline
  useEffect(() => {
    const loadDownline = async () => {
      if (!contract || !rootAddress || hasLoaded) return;

      setLoading(true);
      setError(null);

      try {
        console.log("📡 Chargement du downline complet pour:", rootAddress);
        const members = await collectDownlineMembers(rootAddress, 0);
        setDownlineList(members);
        setHasLoaded(true);
        console.log("✅ Downline chargé:", members.length, "membres");
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
    setDownlineList([]);
    setError(null);
    setCurrentPage(1);
  };

  // Calcul de la pagination
  const totalPages = Math.ceil(downlineList.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentMembers = downlineList.slice(startIndex, endIndex);

  // Navigation pagination
  const goToPage = (page) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page);
    }
  };

  const goToPrevPage = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
    }
  };

  const goToNextPage = () => {
    if (currentPage < totalPages) {
      setCurrentPage(currentPage + 1);
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
          Votre Downline Complet
        </h3>
        <div className="downline-stats">
          <span className="stat-badge">
            Total: {downlineList.length} membre{downlineList.length > 1 ? 's' : ''}
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

      {downlineList.length === 0 ? (
        <div className="empty-downline">
          <p>Aucun membre dans votre downline pour le moment</p>
          <p className="empty-subtitle">Commencez à parrainer pour développer votre réseau</p>
        </div>
      ) : (
        <>
          <div className="table-wrapper">
            <table className="downline-table">
              <thead>
                <tr>
                  <th>#</th>
                  <th>Adresse</th>
                  <th>Grade</th>
                  <th>Niveau</th>
                  <th>Réseau</th>
                  <th>Gains (USDT)</th>
                  <th>Profondeur</th>
                </tr>
              </thead>
              <tbody>
                {currentMembers.map((member, index) => {
                  const gradeInfo = GRADE_CONFIG[member.grade] || GRADE_CONFIG[1];
                  const globalIndex = startIndex + index + 1;

                  return (
                    <tr key={member.address}>
                      <td>{globalIndex}</td>
                      <td className="address-cell">
                        <span className="address-text" title={member.address}>
                          {formatAddress(member.address)}
                        </span>
                      </td>
                      <td>
                        <span className="grade-badge">
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
                      <td>
                        <span className="depth-badge">
                          Niveau {member.depth}
                        </span>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="pagination">
              <button
                className="pagination-btn"
                onClick={goToPrevPage}
                disabled={currentPage === 1}
              >
                <FaChevronLeft />
                Précédent
              </button>

              <div className="pagination-pages">
                {/* Première page */}
                {currentPage > 3 && (
                  <>
                    <button
                      className="pagination-page"
                      onClick={() => goToPage(1)}
                    >
                      1
                    </button>
                    {currentPage > 4 && <span className="pagination-ellipsis">...</span>}
                  </>
                )}

                {/* Pages autour de la page actuelle */}
                {Array.from({ length: totalPages }, (_, i) => i + 1)
                  .filter(page => {
                    return page === currentPage ||
                           page === currentPage - 1 ||
                           page === currentPage + 1 ||
                           page === currentPage - 2 ||
                           page === currentPage + 2;
                  })
                  .map(page => (
                    <button
                      key={page}
                      className={`pagination-page ${page === currentPage ? 'active' : ''}`}
                      onClick={() => goToPage(page)}
                    >
                      {page}
                    </button>
                  ))}

                {/* Dernière page */}
                {currentPage < totalPages - 2 && (
                  <>
                    {currentPage < totalPages - 3 && <span className="pagination-ellipsis">...</span>}
                    <button
                      className="pagination-page"
                      onClick={() => goToPage(totalPages)}
                    >
                      {totalPages}
                    </button>
                  </>
                )}
              </div>

              <button
                className="pagination-btn"
                onClick={goToNextPage}
                disabled={currentPage === totalPages}
              >
                Suivant
                <FaChevronRight />
              </button>
            </div>
          )}

          {/* Info pagination */}
          <div className="pagination-info">
            Affichage de {startIndex + 1} à {Math.min(endIndex, downlineList.length)} sur {downlineList.length} membres
          </div>
        </>
      )}
    </div>
  );
};

export default DownlineTable;
