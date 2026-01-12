import React, { useState, useEffect } from 'react';
import { FaUsers, FaUserFriends, FaCopy, FaCheck } from 'react-icons/fa';
import './NetworkView.css';

const NetworkView = ({ accountData, contract, account }) => {
  const [referrals, setReferrals] = useState([]);
  const [sponsorChain, setSponsorChain] = useState([]);
  const [loading, setLoading] = useState(false);
  const [copied, setCopied] = useState(false);

  // Charger les référrals et la chaîne de sponsors
  useEffect(() => {
    const loadNetworkData = async () => {
      if (!contract || !account) return;

      setLoading(true);
      try {
        // Charger les référrals (filleuls directs)
        const refs = await contract.getReferrals(account);
        setReferrals(refs);

        // Charger la chaîne de sponsors
        const chain = await contract.getSponsorChain(account);
        setSponsorChain(chain);
      } catch (err) {
        console.error('❌ Erreur chargement réseau:', err);
      } finally {
        setLoading(false);
      }
    };

    loadNetworkData();
  }, [contract, account]);

  const formatAddress = (address) => {
    if (!address) return '';
    return `${address.slice(0, 6)}...${address.slice(-4)}`;
  };

  const copyToClipboard = (text) => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const referralLink = account ? `${window.location.origin}/?sponsor=${account}` : '';

  if (!accountData || !accountData.isRegistered) {
    return null;
  }

  return (
    <div className="network-view">
      <div className="container">
        <h2 className="section-title">
          <FaUserFriends className="text-orange" />
          Mon Réseau
        </h2>

        <div className="grid grid-2">
          {/* Filleuls Directs */}
          <div className="card">
            <div className="card-header">
              <h3 className="card-title">
                <FaUsers className="text-green" />
                Mes Filleuls Directs
              </h3>
              <span className="badge badge-orange">
                {referrals.length} / 2
              </span>
            </div>
            <div className="card-body">
              {loading ? (
                <div className="loading-container">
                  <div className="spinner"></div>
                  <p>Chargement...</p>
                </div>
              ) : referrals.length === 0 ? (
                <div className="empty-state">
                  <p className="text-muted">Vous n'avez pas encore de filleuls directs.</p>
                  <p className="empty-state-subtitle">
                    Partagez votre lien de parrainage pour développer votre réseau et commencer à gagner des commissions !
                  </p>
                </div>
              ) : (
                <div className="referrals-list">
                  {referrals.map((address, index) => (
                    <div key={index} className="referral-item">
                      <div className="referral-icon">
                        {index + 1}
                      </div>
                      <div className="referral-address">
                        {formatAddress(address)}
                      </div>
                      <button
                        className="btn-copy"
                        onClick={() => copyToClipboard(address)}
                        title="Copier l'adresse"
                      >
                        {copied ? <FaCheck /> : <FaCopy />}
                      </button>
                    </div>
                  ))}
                  {referrals.length < 2 && (
                    <div className="referral-item empty">
                      <div className="referral-icon empty">
                        {referrals.length + 1}
                      </div>
                      <div className="referral-address text-muted">
                        Place disponible
                      </div>
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>

          
        </div>

        
      </div>
    </div>
  );
};

export default NetworkView;
