import { useState, useEffect, useCallback } from 'react';
import { ethers } from 'ethers';

export const useProSavings = (contract, account) => {
  const [accountData, setAccountData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [globalStats, setGlobalStats] = useState({ totalAccounts: 0 });

  const loadAccountData = useCallback(async () => {
    if (!contract || !account) {
      console.log("⏸️ Pas de contrat ou compte");
      return;
    }

    setLoading(true);
    setError(null);

    try {
      console.log("📡 Chargement données pour:", account);

      // ✅ CHARGER LES STATISTIQUES GLOBALES
      let totalAccountsRegistered = 0;
      try {
        const totalAccounts = await contract.totalAccountsRegistered();
        totalAccountsRegistered = Number(totalAccounts);
        setGlobalStats({ totalAccounts: totalAccountsRegistered });
        console.log("✅ Total de comptes dans le réseau:", totalAccountsRegistered);
      } catch (err) {
        console.warn("⚠️ Impossible de charger totalAccountsRegistered:", err.message);
      }
      
      // Appeler getAccountFullInfo
      const data = await contract.getAccountFullInfo(account);
      
      console.log("✅ Données brutes:", data);
      console.log("📊 Longueur:", data.length);
      
      // VÉRIFICATION : Longueur correcte
      if (!data || data.length < 7) {
        throw new Error(`Données incomplètes: longueur ${data?.length || 0}, attendu 7`);
      }
      
      // ✅ PARSER SELON LA VRAIE STRUCTURE
      // [0] wallet (address)
      // [1] sponsor (address)
      // [2] grade (uint256)
      // [3] level (uint256)
      // [4] networkCount (uint256)
      // [5] totalEarnings (uint256)
      // [6] isFirstAccount (bool)
      
      const accountInfo = {
        wallet: data[0] || ethers.ZeroAddress,
        sponsor: data[1] || ethers.ZeroAddress,
        grade: data[2] ? Number(data[2]) : 1,
        level: data[3] ? Number(data[3]) : 0,
        networkCount: data[4] ? Number(data[4]) : 0,
        totalEarnings: data[5] ? ethers.formatEther(data[5]) : "0",
        isFirstAccount: Boolean(data[6]),

        // ✅ CHAMPS CALCULÉS/DÉRIVÉS
        // isRegistered: On considère inscrit si le compte a un sponsor valide (différent de l'adresse zéro) OU si c'est le compte fondateur
        isRegistered: (data[1] && data[1] !== ethers.ZeroAddress) || Boolean(data[6]),
        
        // pendingBalance: Non disponible dans votre contrat
        pendingBalance: "0",
        
        // registrationTime: Non disponible
        registrationTime: 0,
        
        // referrals: À charger séparément avec getReferrals()
        referrals: [],
        
        // gradesUnlocked: À calculer en fonction du grade
        // Grade 1 = Bronze, Grade 2 = Silver, Grade 3 = Gold
        gradesUnlocked: [
          false, // Index 0 (non utilisé)
          true,  // Bronze (toujours débloqué)
          Number(data[2]) >= 2, // Silver
          Number(data[2]) >= 3  // Gold
        ]
      };

      console.log("✅ Données parsées:", accountInfo);

      // VÉRIFICATION : Compte inscrit
      if (!accountInfo.isRegistered) {
        console.warn("⚠️ Compte non inscrit:", account);
        setAccountData(null);
        setError("Compte non inscrit");
        setLoading(false);
        return;
      }

      // ✅ CHARGER LES RÉFÉRRALS SÉPARÉMENT
      let referrals = [];
      try {
        referrals = await contract.getReferrals(account);
        accountInfo.referrals = referrals;
        console.log("✅ Référrals chargés:", referrals);
      } catch (err) {
        console.warn("⚠️ Impossible de charger les référrals:", err.message);
        accountInfo.referrals = [];
      }

      // Calculer métriques
      const referralsCount = accountInfo.referrals.length;
      const gradesUnlockedCount = accountInfo.gradesUnlocked.filter((unlocked, index) =>
        index > 0 && unlocked
      ).length;

      // ✅ VÉRIFIER SI LE COMPTE EST EXPIRÉ
      // Un compte est expiré quand il atteint le grade 3, niveau 9 (dernier niveau possible)
      // et qu'il a terminé de recevoir ses gains
      const isExpired = accountInfo.grade === 3 && accountInfo.level === 9;

      const finalData = {
        ...accountInfo,
        referralsCount,
        gradesUnlockedCount,
        registrationDate: null, // Non disponible dans votre contrat
        isExpired, // ✅ Nouveau champ pour indiquer l'expiration
        totalAccountsRegistered // ✅ Nombre total de membres dans le réseau global
      };

      setAccountData(finalData);
      console.log("✅ Données finales:", finalData);

    } catch (err) {
      console.error("❌ Erreur chargement:", err);
      console.error("Message:", err.message);
      
      setError(err.message);
      setAccountData(null);
    } finally {
      setLoading(false);
    }
  }, [contract, account]);

  // Obtenir le sponsor chain
  const getSponsorChain = useCallback(async (address) => {
    if (!contract || !address) return [];
    try {
      const chain = await contract.getSponsorChain(address);
      return chain;
    } catch (err) {
      console.error('❌ Erreur sponsor chain:', err);
      return [];
    }
  }, [contract]);

  // Obtenir les référrals
  const getReferrals = useCallback(async (address) => {
    if (!contract || !address) return [];
    try {
      const referrals = await contract.getReferrals(address);
      return referrals;
    } catch (err) {
      console.error('❌ Erreur référrals:', err);
      return [];
    }
  }, [contract]);

  // Vérifier si peut débloquer grade suivant
  const canUnlockNextGrade = useCallback(async (address) => {
    if (!contract || !address) return { canUnlock: false, message: '' };
    try {
      const result = await contract.canUnlockNextGrade(address);
      return {
        canUnlock: result[0],
        message: result[1]
      };
    } catch (err) {
      console.error('❌ Erreur vérification grade:', err);
      return { canUnlock: false, message: err.message };
    }
  }, [contract]);

  // S'inscrire
  const register = useCallback(async (sponsorAddress) => {
    if (!contract || !account) {
      throw new Error('Wallet non connecté');
    }
    try {
      const tx = await contract.register(sponsorAddress);
      console.log('📤 Transaction envoyée:', tx.hash);
      const receipt = await tx.wait();
      console.log('✅ Transaction confirmée:', receipt);
      await loadAccountData();
      return receipt;
    } catch (err) {
      console.error('❌ Erreur inscription:', err);
      throw err;
    }
  }, [contract, account, loadAccountData]);

  // Charger au montage
  useEffect(() => {
    loadAccountData();
  }, [loadAccountData]);

  // ❌ Auto-refresh désactivé (causait des problèmes avec le chargement du downline)
  // Si vous souhaitez réactiver, décommentez le code ci-dessous
  /*
  useEffect(() => {
    if (!contract || !account) return;
    const interval = setInterval(() => {
      loadAccountData();
    }, 30000);
    return () => clearInterval(interval);
  }, [contract, account, loadAccountData]);
  */

  return {
    accountData,
    loading,
    error,
    loadAccountData,
    getSponsorChain,
    getReferrals,
    canUnlockNextGrade,
    register,
    globalStats // ✅ Statistiques globales du réseau
  };
};