import React, { useState, useEffect } from "react";
import {
  FaUsers,
  FaNetworkWired,
  FaCoins,
  FaChartLine,
  FaShieldAlt,
  FaPause,
  FaPlay,
  FaMoneyBillWave,
  FaUserShield,
  //FaCog,
  //FaExclamationTriangle,
  FaCheckCircle,
  FaTimesCircle,
  FaTrophy,
  FaWallet,
  //FaExchangeAlt,
} from "react-icons/fa";
import { ethers } from "ethers";
import { toast } from "react-toastify";
import "./OwnerDashboard.css";

const OwnerDashboard = ({ contract, account }) => {
  const [globalStats, setGlobalStats] = useState({
    totalAccounts: 0,
    isPaused: false,
    registrationFee: "20",
    owner: null,
    tokenAddress: null,
    contractBalance: "0",
  });

  const [gradeStats, setGradeStats] = useState({
    gold: 0,
    emeraude: 0,
    diamond: 0,
  });

  const [loading, setLoading] = useState(false);
  //const [actionLoading, setActionLoading] = useState(false);

  // Charger les statistiques globales
  useEffect(() => {
    loadAllStats();
  }, [contract]);

  const loadAllStats = async () => {
    if (!contract) return;

    setLoading(true);
    try {
      // Stats de base
      const totalAccounts = await contract.getTotalAccounts();
      const isPaused = await contract.isPaused();
      const regFee = await contract.REGISTRATION_FEE();
      const owner = await contract.owner();
      const tokenAddress = await contract.paymentToken();

      // Tenter de récupérer le solde du contrat (si fonction existe)
      let contractBalance = "0";
      try {
        const provider = contract.provider || contract.runner.provider;
        const balance = await provider.getBalance(await contract.getAddress());
        contractBalance = ethers.formatEther(balance);
      } catch (err) {
        console.log("Balance non disponible");
      }

      setGlobalStats({
        totalAccounts: Number(totalAccounts),
        isPaused: isPaused,
        registrationFee: ethers.formatEther(regFee),
        owner: owner,
        tokenAddress: tokenAddress,
        contractBalance: contractBalance,
      });

      console.log("✅ Stats globales chargées:", {
        totalAccounts: Number(totalAccounts),
        isPaused,
        owner,
        tokenAddress,
      });

      // Charger les stats par grade (approximation)
      await loadGradeStats();
    } catch (err) {
      console.error("❌ Erreur chargement stats:", err);
      toast.error("Erreur lors du chargement des statistiques");
    } finally {
      setLoading(false);
    }
  };

  const loadGradeStats = async () => {
    // Note: Cette fonction nécessite d'itérer sur les comptes
    // ou d'avoir une fonction dédiée dans le contrat
    // Pour l'instant, on affiche des stats approximatives

    try {
      const total = globalStats.totalAccounts || 0;
      // Estimation : 60% gold, 30% emeraude, 10% Gold
      setGradeStats({
        gold: Math.floor(total * 0.6),
        emeraude: Math.floor(total * 0.3),
        diamond: Math.floor(total * 0.1),
      });
    } catch (err) {
      console.error("Erreur stats grades:", err);
    }
  };

  // Pause/Unpause le contrat
  /*const handlePauseToggle = async () => {
    if (!contract) return;

    setActionLoading(true);
    try {
      const signer = contract.runner;
      if (!signer) {
        throw new Error("Signer non disponible");
      }

      const contractWithSigner = contract.connect(signer);

      let tx;
      if (globalStats.isPaused) {
        tx = await contractWithSigner.unpause();
        toast.info("Dépause du contrat en cours...");
      } else {
        tx = await contractWithSigner.pause();
        toast.info("Pause du contrat en cours...");
      }

      console.log("📤 Transaction envoyée:", tx.hash);
      await tx.wait();

      toast.success(
        globalStats.isPaused ? "✅ Contrat dépausé !" : "✅ Contrat pausé !"
      );
      await loadAllStats();
    } catch (err) {
      console.error("❌ Erreur pause/unpause:", err);
      toast.error(`Erreur: ${err.message}`);
    } finally {
      setActionLoading(false);
    }
  };*/

  // Retirer les fonds (si fonction existe)
  /*const handleWithdraw = async () => {
    if (!contract) return;

    const confirmed = window.confirm(
      "Êtes-vous sûr de vouloir retirer tous les fonds du contrat ?"
    );

    if (!confirmed) return;

    setActionLoading(true);
    try {
      const signer = contract.runner;
      if (!signer) {
        throw new Error("Signer non disponible");
      }

      const contractWithSigner = contract.connect(signer);

      // Vérifier si la fonction withdraw existe
      if (typeof contractWithSigner.withdraw !== "function") {
        toast.error("La fonction withdraw n'existe pas dans ce contrat");
        return;
      }

      const tx = await contractWithSigner.withdraw();
      toast.info("Retrait en cours...");

      console.log("📤 Transaction envoyée:", tx.hash);
      await tx.wait();

      toast.success("✅ Fonds retirés avec succès !");
      await loadAllStats();
    } catch (err) {
      console.error("❌ Erreur retrait:", err);
      toast.error(`Erreur: ${err.message}`);
    } finally {
      setActionLoading(false);
    }
  };*/

  // Transférer la propriété
  /*const handleTransferOwnership = async () => {
    const newOwner = window.prompt(
      "Entrez l'adresse du nouveau propriétaire :"
    );

    if (!newOwner) return;

    if (!ethers.isAddress(newOwner)) {
      toast.error("Adresse invalide");
      return;
    }

    const confirmed = window.confirm(
      `Confirmer le transfert de propriété à ${newOwner} ?\n\n⚠️ Cette action est IRRÉVERSIBLE !`
    );

    if (!confirmed) return;

    setActionLoading(true);
    try {
      const signer = contract.runner;
      if (!signer) {
        throw new Error("Signer non disponible");
      }

      const contractWithSigner = contract.connect(signer);

      const tx = await contractWithSigner.transferOwnership(newOwner);
      toast.info("Transfert de propriété en cours...");

      console.log("📤 Transaction envoyée:", tx.hash);
      await tx.wait();

      toast.success("✅ Propriété transférée avec succès !");
      toast.warning("Vous n'êtes plus le propriétaire du contrat");

      // Recharger la page après 3 secondes
      setTimeout(() => {
        window.location.reload();
      }, 3000);
    } catch (err) {
      console.error("❌ Erreur transfert:", err);
      toast.error(`Erreur: ${err.message}`);
    } finally {
      setActionLoading(false);
    }
  };*/

  if (loading) {
    return (
      <div className="loading-container">
        <div className="spinner"></div>
        <p>Chargement du panneau propriétaire...</p>
      </div>
    );
  }

  return (
    <div className="owner-dashboard">
      <div className="container">
        {/* En-tête Owner */}
        <div className="owner-header">
          <div className="owner-title">
            <FaShieldAlt className="shield-icon" />
            <div>
              <h2>Panneau Propriétaire</h2>
              <p className="owner-subtitle">Contrôle Total du Smart Contract</p>
            </div>
          </div>
          <div className="owner-badges">
            <span className="badge badge-owner">
              <FaUserShield />
              Propriétaire
            </span>
            <span
              className={`badge ${
                globalStats.isPaused ? "badge-error" : "badge-success"
              }`}
            >
              {globalStats.isPaused ? (
                <>
                  <FaPause />
                  Contrat Pausé
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

        {/* Statistiques Globales */}
        <div className="stats-section">
          <h3 className="section-title">
            <FaChartLine className="text-purple" />
            Statistiques Globales du Réseau
          </h3>
          <div className="stats-grid grid grid-4">
            {/* Total Membres */}
            <div className="stat-card card owner-stat">
              <div className="stat-icon purple">
                <FaUsers />
              </div>
              <div className="stat-content">
                <h3>{globalStats.totalAccounts}</h3>
                <p className="stat-label">Membres Totaux</p>
                <div className="stat-detail">
                  <span className="text-green">Réseau complet</span>
                </div>
              </div>
            </div>

            {/* Volume Total */}
            <div className="stat-card card owner-stat">
              <div className="stat-icon blue">
                <FaMoneyBillWave />
              </div>
              <div className="stat-content">
                <h3>
                  {(
                    globalStats.totalAccounts *
                    parseFloat(globalStats.registrationFee)
                  ).toFixed(0)}
                </h3>
                <p className="stat-label">Volume Inscriptions</p>
                <div className="stat-detail">
                  <span className="text-muted">USDT collectés</span>
                </div>
              </div>
            </div>

            {/* Frais d'Inscription */}
            <div className="stat-card card owner-stat">
              <div className="stat-icon orange">
                <FaTrophy />
              </div>
              <div className="stat-content">
                <h3>{globalStats.registrationFee}</h3>
                <p className="stat-label">Frais d'Inscription</p>
                <div className="stat-detail">
                  <span className="text-muted">USDT</span>
                </div>
              </div>
            </div>

            {/* Balance Contrat */}
            <div className="stat-card card owner-stat">
              <div className="stat-icon green">
                <FaWallet />
              </div>
              <div className="stat-content">
                <h3>{parseFloat(globalStats.contractBalance).toFixed(4)}</h3>
                <p className="stat-label">Balance Contrat</p>
                <div className="stat-detail">
                  <span className="text-muted">BNB</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Répartition par Grades */}
        <div className="grades-stats">
          <h3 className="section-title">
            <FaTrophy className="text-orange" />
            Répartition par Grades
          </h3>
          <div className="grid grid-3">
            <div className="grade-stat-card card">
              <div className="grade-stat-header gold">
                <FaTrophy />
                <h4>Gold</h4>
              </div>
              <div className="grade-stat-body">
                <div className="grade-stat-value">{gradeStats.gold}</div>
                <div className="grade-stat-label">Membres</div>
                <div className="grade-stat-percentage">
                  {globalStats.totalAccounts > 0
                    ? (
                        (gradeStats.gold / globalStats.totalAccounts) *
                        100
                      ).toFixed(1)
                    : 0}
                  %
                </div>
              </div>
            </div>

            <div className="grade-stat-card card">
              <div className="grade-stat-header emeraude">
                <FaTrophy />
                <h4>Emeraude</h4>
              </div>
              <div className="grade-stat-body">
                <div className="grade-stat-value">{gradeStats.emeraude}</div>
                <div className="grade-stat-label">Membres</div>
                <div className="grade-stat-percentage">
                  {globalStats.totalAccounts > 0
                    ? (
                        (gradeStats.emeraude / globalStats.totalAccounts) *
                        100
                      ).toFixed(1)
                    : 0}
                  %
                </div>
              </div>
            </div>

            <div className="grade-stat-card card">
              <div className="grade-stat-header diamond">
                <FaTrophy />
                <h4>Diamond</h4>
              </div>
              <div className="grade-stat-body">
                <div className="grade-stat-value">{gradeStats.gold}</div>
                <div className="grade-stat-label">Membres</div>
                <div className="grade-stat-percentage">
                  {globalStats.totalAccounts > 0
                    ? (
                        (gradeStats.gold / globalStats.totalAccounts) *
                        100
                      ).toFixed(1)
                    : 0}
                  %
                </div>
              </div>
            </div>
          </div>
        </div>

        
        

        {/* Informations Système */}
        <div className="system-info">
          <h3 className="section-title">
            <FaNetworkWired className="text-blue" />
            Informations Système
          </h3>
          <div className="card">
            <div className="card-body">
              <div className="info-grid">
                <div className="info-item">
                  <span className="info-label">
                    <FaShieldAlt className="text-purple" />
                    Propriétaire
                  </span>
                  <span className="info-value mono">
                    {globalStats.owner ? (
                      <>
                        {globalStats.owner.slice(0, 6)}...
                        {globalStats.owner.slice(-4)}
                        {globalStats.owner.toLowerCase() ===
                          account.toLowerCase() && (
                          <span className="badge badge-success ml-2">Vous</span>
                        )}
                      </>
                    ) : (
                      "Chargement..."
                    )}
                  </span>
                </div>

                <div className="info-item">
                  <span className="info-label">
                    <FaCoins className="text-orange" />
                    Token USDT
                  </span>
                  <span className="info-value mono">
                    {globalStats.tokenAddress ? (
                      <>
                        {globalStats.tokenAddress.slice(0, 6)}...
                        {globalStats.tokenAddress.slice(-4)}
                      </>
                    ) : (
                      "Chargement..."
                    )}
                  </span>
                </div>

                <div className="info-item">
                  <span className="info-label">
                    <FaCheckCircle className="text-green" />
                    Statut du Contrat
                  </span>
                  <span className="info-value">
                    {globalStats.isPaused ? (
                      <span className="badge badge-error">
                        <FaTimesCircle />
                        Pausé
                      </span>
                    ) : (
                      <span className="badge badge-success">
                        <FaCheckCircle />
                        Actif
                      </span>
                    )}
                  </span>
                </div>

                <div className="info-item">
                  <span className="info-label">
                    <FaNetworkWired className="text-blue" />
                    Réseau
                  </span>
                  <span className="info-value">
                    <span className="badge badge-blue">BSC Mainnet</span>
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>

        

        {/* Note Propriétaire */}
        <div className="owner-note">
          <FaShieldAlt className="note-icon" />
          <div className="note-content">
            <h4>À propos de ce Panneau</h4>
            <p>
              Vous êtes le <strong>propriétaire du smart contract</strong>. Vous
              avez un accès complet à toutes les fonctions administratives et
              pouvez gérer l'ensemble du système. Utilisez ces privilèges avec
              précaution.
            </p>
            
          </div>
        </div>
      </div>
    </div>
  );
};

export default OwnerDashboard;
