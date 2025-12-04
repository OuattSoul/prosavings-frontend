import React, { useState, useEffect } from 'react';
import { FaUsers, FaNetworkWired, FaChartBar } from 'react-icons/fa';
import './AdminNetworkView.css';

const AdminNetworkView = ({ accountData, contract }) => {
  //const [directDescendants, setDirectDescendants] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const loadDirectDescendants = async () => {
      if (!contract || !accountData) return;

      setLoading(true);
      try {
        // Charger les descendants directs (si la fonction existe)
        // Sinon, afficher les statistiques du réseau
        console.log("Chargement descendants admin...");
        
        // Exemple : récupérer tous les comptes qui ont l'admin comme sponsor
        // Note: Cette fonction peut ne pas exister dans votre contrat
        // Dans ce cas, afficher seulement les stats globales
        
      } catch (err) {
        console.error("Erreur chargement descendants:", err);
      } finally {
        setLoading(false);
      }
    };

    loadDirectDescendants();
  }, [contract, accountData]);

  return (
    <div className="admin-network-view">
      <div className="container">
        <h2 className="section-title">
          <FaNetworkWired className="text-orange" />
          Vue Réseau Administrateur
        </h2>

        <div className="card">
          <div className="card-header">
            <h3 className="card-title">
              <FaUsers className="text-green" />
              Votre Descendance Directe
            </h3>
            <span className="badge badge-orange">
              {accountData.networkCount} membres
            </span>
          </div>
          <div className="card-body">
            <div className="admin-network-info">
              <FaChartBar className="info-icon" />
              <div>
                <h4>Réseau en Croissance</h4>
                <p>
                  Votre réseau compte {accountData.networkCount} membres actifs. 
                  En tant que fondateur, tous les membres du système font partie de votre descendance.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Note */}
        <div className="admin-note">
          <p className="text-muted">
            💡 <strong>Note :</strong> Le compte fondateur n'a pas de filleuls directs traditionnels. 
            Votre networkCount représente l'ensemble de votre descendance dans le système ProSavings.
          </p>
        </div>
      </div>
    </div>
  );
};

export default AdminNetworkView;