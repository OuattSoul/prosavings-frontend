// Configuration du contrat ProSavings
export const CONTRACT_CONFIG = {
  // Adresse du contrat déployé (à remplacer par votre adresse)
  address: "0xdEC200Bb7c040DDFe9CE3Db50Aaa784F4238E396",
  
  // Réseau (BSC Mainnet ou Testnet)
  network: {
    chainId: 56, // BSC Mainnet (97 pour BSC Testnet)
    name: "BSC Mainnet",
    rpcUrl: "https://bsc-dataseed.binance.org/",
    blockExplorer: "https://bscscan.com",
    nativeCurrency: {
      name: "BNB",
      symbol: "BNB",
      decimals: 18
    }
  },
  
  // Token de paiement (cUSD, USDT, etc.)
  token: {
    symbol: "USDT",
    decimals: 18,
    registrationFee: "20" // 20 tokens
  }
};

// Configuration des grades
export const GRADE_CONFIG = {
  1: { name: "Gold", cost: "0", minNetwork: 0, color: "#FFD700" },
  2: { name: "Emeraude", cost: "60", minNetwork: 15, color: "#00674F" },
  3: { name: "Diamond", cost: "250", minNetwork: 128, color: "#b9f2ff" } //#CD7F32
};

// Paramètres réseau BSC
export const BSC_MAINNET = {
  chainId: '0x38', // 56 en hex
  chainName: 'BSC Mainnet',
  nativeCurrency: {
    name: 'BNB',
    symbol: 'BNB',
    decimals: 18
  },
  rpcUrls: ['https://bsc-dataseed.binance.org/'],
  blockExplorerUrls: ['https://bscscan.com']
};

export const BSC_TESTNET = {
  chainId: '0x61', // 97 en hex
  chainName: 'BSC Testnet',
  nativeCurrency: {
    name: 'BNB',
    symbol: 'BNB',
    decimals: 18
  },
  rpcUrls: ['https://data-seed-prebsc-1-s1.binance.org:8545/'],
  blockExplorerUrls: ['https://testnet.bscscan.com']
};
