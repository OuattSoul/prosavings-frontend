import { ethers } from 'ethers';
import { CONTRACT_CONFIG } from './config';
import ProSavingsABI from './prosavings-abi.json';

export const debugContract = async (account) => {
  console.log("=== 🔍 DEBUG PROSAVINGS ===");
  
  try {
    // 1. Vérifier la connexion
    if (!window.ethereum) {
      console.error("❌ MetaMask non détecté");
      return;
    }
    
    const provider = new ethers.BrowserProvider(window.ethereum);
    const network = await provider.getNetwork();
    
    console.log("✅ Réseau connecté:", {
      chainId: Number(network.chainId),
      name: network.name
    });
    
    console.log("✅ Adresse du contrat:", CONTRACT_CONFIG.address);
    console.log("✅ Compte wallet:", account);
    
    // 2. Créer l'instance du contrat
    const contract = new ethers.Contract(
      CONTRACT_CONFIG.address,
      ProSavingsABI,
      provider
    );
    
    console.log("✅ Contrat créé");
    
    // 3. Vérifier que le contrat existe
    const code = await provider.getCode(CONTRACT_CONFIG.address);
    if (code === '0x') {
      console.error("❌ ERREUR CRITIQUE: Aucun contrat à cette adresse!");
      console.error("→ Vérifiez l'adresse dans src/config.js");
      return;
    }
    console.log("✅ Contrat existe à cette adresse");
    
    // 4. Tester des fonctions simples d'abord
    try {
      const totalAccounts = await contract.totalAccountsRegistered();
      console.log("✅ Total comptes inscrits:", totalAccounts.toString());
    } catch (err) {
      console.error("❌ Erreur lecture totalAccountsRegistered:", err.message);
    }
    
    try {
      const isPaused = await contract.isPaused();
      console.log("✅ Contrat en pause:", isPaused);
    } catch (err) {
      console.error("❌ Erreur lecture isPaused:", err.message);
    }
    
    // 5. Tester getAccountFullInfo
    console.log("\n--- Test getAccountFullInfo ---");
    try {
      const data = await contract.getAccountFullInfo(account);
      console.log("✅ Données brutes reçues:");
      console.log("Type:", typeof data);
      console.log("Longueur:", data.length);
      console.log("Contenu:", data);
      
      // Parser les données
      console.log("\n--- Parsing des données ---");
      console.log("[0] wallet:", data[0]);
      console.log("[1] sponsor:", data[1]);
      console.log("[2] registrationTime:", data[2]?.toString());
      console.log("[3] totalEarnings:", data[3]?.toString());
      console.log("[4] pendingBalance:", data[4]?.toString());
      console.log("[5] networkCount:", data[5]?.toString());
      console.log("[6] isRegistered:", data[6]);
      /*console.log("[7] referrals:", data[7]);
      console.log("[8] isFirstAccount:", data[8]);
      console.log("[9] grade:", data[9]?.toString());
      console.log("[10] level:", data[10]?.toString());
      console.log("[11] gradesUnlocked:", data[11]);*/
      
      if (!data[6]) {
        console.error("❌ isRegistered = false !");
        console.error("→ Le compte n'est PAS inscrit sur CE contrat");
      } else {
        console.log("✅ Compte inscrit !");
      }
      
    } catch (err) {
      console.error("❌ ERREUR getAccountFullInfo:", err);
      console.error("Message:", err.message);
      console.error("Code:", err.code);
      
      if (err.message.includes("out of result range")) {
        console.error("\n🔥 DIAGNOSTIC:");
        console.error("→ Le contrat ne retourne pas les données attendues");
        console.error("→ Vérifiez que l'adresse du contrat est correcte");
        console.error("→ Vérifiez que vous êtes sur le bon réseau");
      }
    }
    
    // 6. Tester avec l'adresse 0 (premier compte)
    console.log("\n--- Test avec adresse 0 (devrait échouer) ---");
    try {
      const data = await contract.getAccountFullInfo(ethers.ZeroAddress);
      console.log("Données pour adresse 0:", data);
    } catch (err) {
      console.log("✅ Normal: adresse 0 renvoie une erreur");
    }
    
    console.log("\n=== FIN DEBUG ===");
    
  } catch (err) {
    console.error("❌ ERREUR FATALE:", err);
  }
};