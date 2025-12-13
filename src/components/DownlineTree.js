import React, { useState, useEffect, useCallback } from 'react';
import { FaUsers, FaChevronDown, FaChevronRight, FaTrophy, FaSpinner } from 'react-icons/fa';
import { GRADE_CONFIG } from '../config';
import './DownlineTree.css';

const DownlineTree = ({ contract, rootAddress, maxDepth = 10 }) => {
  const [treeData, setTreeData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [expandedNodes, setExpandedNodes] = useState(new Set([rootAddress]));
  const [hasLoaded, setHasLoaded] = useState(false); // ✅ Flag pour éviter les rechargements

  // Fonction récursive pour charger tout le downline
  const loadDownlineRecursive = useCallback(async (address, depth = 0) => {
    if (depth > maxDepth) {
      return null;
    }

    try {
      // Charger les infos du compte
      const accountInfo = await contract.getAccountFullInfo(address);

      // Parser les données
      const nodeData = {
        address: address,
        grade: accountInfo[2] ? Number(accountInfo[2]) : 1,
        level: accountInfo[3] ? Number(accountInfo[3]) : 0,
        networkCount: accountInfo[4] ? Number(accountInfo[4]) : 0,
        totalEarnings: accountInfo[5] ? accountInfo[5].toString() : "0",
        depth: depth,
        children: []
      };

      // Charger les referrals (filleuls directs)
      let referrals = [];
      try {
        referrals = await contract.getReferrals(address);
        console.log(`✅ Filleuls de ${address.slice(0, 8)}:`, referrals.length);
      } catch (err) {
        console.warn(`⚠️ Impossible de charger les filleuls de ${address}:`, err.message);
      }

      // Charger récursivement tous les enfants
      if (referrals && referrals.length > 0) {
        for (const referral of referrals) {
          const childData = await loadDownlineRecursive(referral, depth + 1);
          if (childData) {
            nodeData.children.push(childData);
          }
        }
      }

      return nodeData;
    } catch (err) {
      console.error(`❌ Erreur pour ${address}:`, err);
      return null;
    }
  }, [contract, maxDepth]);

  // Charger l'arbre complet
  useEffect(() => {
    const loadTree = async () => {
      // ✅ Ne charger qu'une seule fois
      if (!contract || !rootAddress || hasLoaded) return;

      setLoading(true);
      setError(null);

      try {
        console.log("📡 Chargement du downline complet pour:", rootAddress);
        const tree = await loadDownlineRecursive(rootAddress, 0);
        setTreeData(tree);
        setHasLoaded(true); // ✅ Marquer comme chargé
        console.log("✅ Arbre complet chargé:", tree);
      } catch (err) {
        console.error("❌ Erreur chargement downline:", err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    loadTree();
  }, [contract, rootAddress, hasLoaded, loadDownlineRecursive]);

  // ✅ Fonction pour recharger manuellement
  const reloadTree = async () => {
    setHasLoaded(false);
    setTreeData(null);
    setError(null);
    // Le useEffect se déclenchera automatiquement
  };

  // Toggle expansion d'un noeud
  const toggleNode = (address) => {
    setExpandedNodes(prev => {
      const newSet = new Set(prev);
      if (newSet.has(address)) {
        newSet.delete(address);
      } else {
        newSet.add(address);
      }
      return newSet;
    });
  };

  // Compter le total de membres dans un sous-arbre
  const countTotalMembers = (node) => {
    if (!node) return 0;
    let count = 1; // Le noeud lui-même
    if (node.children && node.children.length > 0) {
      for (const child of node.children) {
        count += countTotalMembers(child);
      }
    }
    return count;
  };

  // Rendu d'un noeud
  const renderNode = (node, isRoot = false) => {
    if (!node) return null;

    const isExpanded = expandedNodes.has(node.address);
    const hasChildren = node.children && node.children.length > 0;
    const gradeInfo = GRADE_CONFIG[node.grade] || GRADE_CONFIG[1];
    const totalMembers = countTotalMembers(node);

    return (
      <div key={node.address} className={`tree-node ${isRoot ? 'root-node' : ''}`}>
        <div className="node-card" onClick={() => hasChildren && toggleNode(node.address)}>
          <div className="node-header">
            <div className="node-expand">
              {hasChildren ? (
                isExpanded ? <FaChevronDown /> : <FaChevronRight />
              ) : (
                <span className="no-children">•</span>
              )}
            </div>

            <div className="node-info">
              <div className="node-address">
                {node.address.slice(0, 6)}...{node.address.slice(-4)}
              </div>
              <div className="node-stats">
                <span className="node-grade" style={{ background: gradeInfo.color }}>
                  <FaTrophy />
                  {gradeInfo.name} L{node.level}
                </span>
                <span className="node-network">
                  <FaUsers />
                  {node.networkCount}
                </span>
                {!isRoot && (
                  <span className="node-downline">
                    Downline: {totalMembers - 1}
                  </span>
                )}
              </div>
            </div>
          </div>
        </div>

        {hasChildren && isExpanded && (
          <div className="node-children">
            {node.children.map(child => renderNode(child, false))}
          </div>
        )}
      </div>
    );
  };

  if (loading) {
    return (
      <div className="downline-tree-loading">
        <FaSpinner className="spinner-icon" />
        <p>Chargement du downline complet...</p>
        <p className="loading-subtitle">Cela peut prendre quelques instants</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="downline-tree-error">
        <p>Erreur lors du chargement du downline</p>
        <p className="error-details">{error}</p>
      </div>
    );
  }

  if (!treeData) {
    return null;
  }

  const totalDownline = countTotalMembers(treeData) - 1; // Exclure le noeud racine

  return (
    <div className="downline-tree-container">
      <div className="downline-tree-header">
        <h3>
          <FaUsers />
          Votre Downline Complet
        </h3>
        <div className="downline-stats">
          <span className="stat-badge">
            Total: {totalDownline} membre{totalDownline > 1 ? 's' : ''}
          </span>
          <button
            className="btn-reload"
            onClick={reloadTree}
            disabled={loading}
            title="Recharger le downline"
          >
            🔄 Actualiser
          </button>
          <button
            className="btn-expand-all"
            onClick={() => {
              // Expand all nodes
              const allAddresses = [];
              const collectAddresses = (node) => {
                allAddresses.push(node.address);
                if (node.children) {
                  node.children.forEach(collectAddresses);
                }
              };
              collectAddresses(treeData);
              setExpandedNodes(new Set(allAddresses));
            }}
          >
            Tout Déplier
          </button>
          <button
            className="btn-collapse-all"
            onClick={() => setExpandedNodes(new Set([rootAddress]))}
          >
            Tout Replier
          </button>
        </div>
      </div>

      <div className="downline-tree">
        {renderNode(treeData, true)}
      </div>
    </div>
  );
};

export default DownlineTree;
