import { useState, useEffect, useCallback } from 'react';
import { ethers } from 'ethers';
import { CONTRACT_CONFIG, BSC_MAINNET } from '../config';
import ProSavingsABI from '../prosavings-abi.json';

export const useWallet = () => {
  const [account, setAccount] = useState(null);
  const [provider, setProvider] = useState(null);
  const [signer, setSigner] = useState(null);
  const [contract, setContract] = useState(null);
  const [chainId, setChainId] = useState(null);
  const [isConnecting, setIsConnecting] = useState(false);
  const [error, setError] = useState(null);

  // Vérifier si MetaMask est installé
  const isMetaMaskInstalled = () => {
    return typeof window !== 'undefined' && typeof window.ethereum !== 'undefined';
  };

  // Connecter le wallet
  const connectWallet = useCallback(async () => {
    if (!isMetaMaskInstalled()) {
      setError('MetaMask n\'est pas installé. Veuillez l\'installer depuis metamask.io');
      return;
    }

    setIsConnecting(true);
    setError(null);

    try {
      // Demander la connexion
      const accounts = await window.ethereum.request({
        method: 'eth_requestAccounts'
      });

      // Créer le provider
      const web3Provider = new ethers.BrowserProvider(window.ethereum);
      const web3Signer = await web3Provider.getSigner();
      const network = await web3Provider.getNetwork();

      // Créer l'instance du contrat
      const contractInstance = new ethers.Contract(
        CONTRACT_CONFIG.address,
        ProSavingsABI,
        web3Signer
      );

      setAccount(accounts[0]);
      setProvider(web3Provider);
      setSigner(web3Signer);
      setContract(contractInstance);
      setChainId(Number(network.chainId));

      console.log('✅ Wallet connecté:', accounts[0]);
    } catch (err) {
      console.error('❌ Erreur connexion wallet:', err);
      setError(err.message);
    } finally {
      setIsConnecting(false);
    }
  }, []);

  // Déconnecter le wallet
  const disconnectWallet = useCallback(() => {
    setAccount(null);
    setProvider(null);
    setSigner(null);
    setContract(null);
    setChainId(null);
    setError(null);
    console.log('👋 Wallet déconnecté');
  }, []);

  // Changer de réseau vers BSC
  const switchToBSC = useCallback(async () => {
    if (!isMetaMaskInstalled()) return;

    try {
      await window.ethereum.request({
        method: 'wallet_switchEthereumChain',
        params: [{ chainId: BSC_MAINNET.chainId }]
      });
    } catch (switchError) {
      // Si le réseau n'existe pas, l'ajouter
      if (switchError.code === 4902) {
        try {
          await window.ethereum.request({
            method: 'wallet_addEthereumChain',
            params: [BSC_MAINNET]
          });
        } catch (addError) {
          console.error('❌ Erreur ajout réseau BSC:', addError);
          setError('Impossible d\'ajouter le réseau BSC');
        }
      } else {
        console.error('❌ Erreur changement réseau:', switchError);
        setError('Impossible de changer de réseau');
      }
    }
  }, []);

  // Écouter les changements de compte
  useEffect(() => {
    if (!isMetaMaskInstalled()) return;

    const handleAccountsChanged = (accounts) => {
      if (accounts.length === 0) {
        disconnectWallet();
      } else if (accounts[0] !== account) {
        setAccount(accounts[0]);
        console.log('🔄 Compte changé:', accounts[0]);
      }
    };

    const handleChainChanged = (chainIdHex) => {
      const newChainId = parseInt(chainIdHex, 16);
      setChainId(newChainId);
      console.log('🔄 Réseau changé:', newChainId);
      // Recharger la page pour éviter les incohérences
      window.location.reload();
    };

    window.ethereum.on('accountsChanged', handleAccountsChanged);
    window.ethereum.on('chainChanged', handleChainChanged);

    return () => {
      if (window.ethereum.removeListener) {
        window.ethereum.removeListener('accountsChanged', handleAccountsChanged);
        window.ethereum.removeListener('chainChanged', handleChainChanged);
      }
    };
  }, [account, disconnectWallet]);

  // Auto-connexion au chargement si déjà connecté
  useEffect(() => {
    const checkIfWalletIsConnected = async () => {
      if (!isMetaMaskInstalled()) return;

      try {
        const accounts = await window.ethereum.request({
          method: 'eth_accounts'
        });

        if (accounts.length > 0) {
          await connectWallet();
        }
      } catch (err) {
        console.error('❌ Erreur vérification wallet:', err);
      }
    };

    checkIfWalletIsConnected();
  }, [connectWallet]);

  return {
    account,
    provider,
    signer,
    contract,
    chainId,
    isConnecting,
    error,
    isConnected: !!account,
    isMetaMaskInstalled: isMetaMaskInstalled(),
    connectWallet,
    disconnectWallet,
    switchToBSC
  };
};
