import React from 'react';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { useWallet } from './hooks/useWallet';
import { useProSavings } from './hooks/useProSavings';
import Header from './components/Header';
import Dashboard from './components/Dashboard';
import AdminDashboard from './components/AdminDashboard';
import OwnerDashboard from './components/OwnerDashboard'; // ← AJOUTER
import NetworkView from './components/NetworkView';
import ErrorMessage from './components/ErrorMessage';
import EmptyState from './components/EmptyState';
import './App.css';

function App() {
  const {
    account,
    contract,
    chainId,
    isConnecting,
    error: walletError,
    isConnected,
    isMetaMaskInstalled,
    connectWallet,
    disconnectWallet,
    switchToBSC
  } = useWallet();

  const {
    accountData,
    loading: dataLoading,
    error: dataError,
    loadAccountData
  } = useProSavings(contract, account);

  // ✅ ÉTAT POUR L'OWNER
  const [contractOwner, setContractOwner] = React.useState(null);
  const [loadingOwner, setLoadingOwner] = React.useState(false);

  // ✅ CHARGER L'OWNER DU CONTRAT
  React.useEffect(() => {
    const loadOwner = async () => {
      if (!contract) return;

      setLoadingOwner(true);
      try {
        const owner = await contract.owner();
        setContractOwner(owner);
        console.log("✅ Owner du contrat:", owner);
      } catch (err) {
        console.error("❌ Erreur chargement owner:", err);
      } finally {
        setLoadingOwner(false);
      }
    };

    loadOwner();
  }, [contract]);

  // Afficher les erreurs wallet via toast
  React.useEffect(() => {
    if (walletError) {
      toast.error(walletError, {
        position: "top-right",
        autoClose: 5000
      });
    }
  }, [walletError]);

  // Vérifier si on est sur le bon réseau
  const isCorrectNetwork = chainId === 56; // BSC Mainnet

  // ✅ DÉTERMINER LE RÔLE
  const isOwner = contractOwner && account && 
                  contractOwner.toLowerCase() === account.toLowerCase();
  const isAdmin = accountData?.isFirstAccount === true && !isOwner;

  return (
    <div className="App">
      <ToastContainer
        theme="dark"
        position="top-right"
        autoClose={5000}
        hideProgressBar={false}
        newestOnTop
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
      />

      {/* Header */}
      <Header
        account={account}
        chainId={chainId}
        isConnecting={isConnecting}
        connectWallet={connectWallet}
        disconnectWallet={disconnectWallet}
        switchToBSC={switchToBSC}
      />

      {/* Main Content */}
      <main className="main-content">
        {/* Not Connected */}
        {!isConnected && (
          <div className="welcome-section">
            <div className="container">
              {!isMetaMaskInstalled ? (
                <div className="card welcome-card">
                  <EmptyState
                    icon="wallet"
                    type="warning"
                    title="MetaMask Requis"
                    message="Pour utiliser ProSavings Dashboard, vous devez installer MetaMask dans votre navigateur."
                  />
                  <ErrorMessage
                    type="info"
                    title="Comment installer MetaMask ?"
                    message="MetaMask est un wallet crypto pour navigateur qui vous permet d'interagir avec les applications blockchain."
                    details="Visitez https://metamask.io/download/ pour télécharger l'extension."
                  />
                  <a
                    href="https://metamask.io/download/"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="btn btn-primary btn-large"
                  >
                    Installer MetaMask
                  </a>
                </div>
              ) : (
                <div className="card welcome-card">
                  <EmptyState
                    icon="wallet"
                    type="info"
                    title="Bienvenue sur ProSavings"
                    message="Consultez la progression de votre réseau et suivez vos gains en temps réel."
                    action={connectWallet}
                    actionLabel={isConnecting ? 'Connexion...' : 'Connecter mon Wallet'}
                  />
                </div>
              )}
            </div>
          </div>
        )}

        {/* Connected but wrong network */}
        {isConnected && !isCorrectNetwork && (
          <div className="welcome-section">
            <div className="container">
              <div className="card welcome-card">
                <EmptyState
                  icon="warning"
                  type="warning"
                  title="Réseau Incorrect"
                  message="Vous devez être connecté au réseau BSC Mainnet pour utiliser ProSavings."
                  action={switchToBSC}
                  actionLabel="Basculer vers BSC Mainnet"
                />
                <ErrorMessage
                  type="info"
                  title="Réseau détecté"
                  message={`Vous êtes actuellement sur le réseau : ChainID ${chainId}`}
                  details="ProSavings fonctionne sur BSC Mainnet (ChainID 56)"
                />
              </div>
            </div>
          </div>
        )}

        {/* Connected and correct network */}
        {isConnected && isCorrectNetwork && (
          <>
            {/* ✅ AFFICHER LE BON DASHBOARD SELON LE RÔLE */}
            {loadingOwner || dataLoading ? (
              <div className="loading-container">
                <div className="spinner"></div>
                <p>Chargement...</p>
              </div>
            ) : isOwner ? (
              // PROPRIÉTAIRE DU CONTRAT
              <OwnerDashboard 
                contract={contract}
                account={account}
              />
            ) : isAdmin ? (
              // COMPTE FONDATEUR (isFirstAccount = true)
              <AdminDashboard 
                accountData={accountData}
                contract={contract}
                loading={dataLoading}
              />
            ) : (
              // MEMBRE NORMAL
              <Dashboard 
                accountData={accountData} 
                loading={dataLoading}
                error={dataError}
                onRetry={loadAccountData}
              />
            )}

            {/* Vue Réseau (pour les membres normaux seulement) */}
            {accountData && accountData.isRegistered && !isOwner && !isAdmin && (
              <NetworkView 
                accountData={accountData}
                contract={contract}
                account={account}
              />
            )}
          </>
        )}
      </main>

      {/* Footer */}
      <footer className="footer">
        <div className="container">
          <div className="footer-content">
            <p>&copy; 2025 ProSavings. Tous droits réservés.</p>
            <div className="footer-links">
              <a href="#" className="footer-link">Documentation</a>
              <a href="#" className="footer-link">Support</a>
              <a href="#" className="footer-link">Conditions</a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}

export default App;