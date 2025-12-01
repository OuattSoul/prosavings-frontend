# 🚀 ProSavings Dashboard

Interface React moderne pour consulter et gérer votre réseau ProSavings sur BSC (Binance Smart Chain).

## 🎨 Palette de Couleurs

- **Orange Principal** : #FF6B35 (Actions, boutons)
- **Vert Bouteille** : #2D5016 (Accents, succès)
- **Fond Sombre** : #0F1419 (Background principal)

## ✨ Fonctionnalités

✅ **Connexion Wallet** : MetaMask et autres wallets Web3
✅ **Dashboard Complet** : Vue d'ensemble de votre compte
✅ **Statistiques Réseau** : Taille du réseau, filleuls, gains
✅ **Progression Grades** : Suivi Bronze, Silver, Gold
✅ **Visualisation Réseau** : Filleuls directs et ligne de sponsors
✅ **Lien de Parrainage** : Génération et copie facile
✅ **Design Responsive** : Mobile, tablette, desktop
✅ **Auto-refresh** : Mise à jour automatique toutes les 30s

## 📋 Prérequis

- Node.js 16+ et npm
- MetaMask installé dans le navigateur
- Wallet avec des BNB pour les frais de gas
- Accès au réseau BSC Mainnet ou Testnet

## 🛠️ Installation

### 1. Cloner le Projet

```bash
git clone <votre-repo>
cd prosavings-dapp
```

### 2. Installer les Dépendances

```bash
npm install
```

### 3. Configuration du Contrat

Ouvrir `src/config.js` et mettre à jour :

```javascript
export const CONTRACT_CONFIG = {
  // ⚠️ IMPORTANT : Remplacer par l'adresse de votre contrat déployé
  address: "0xYOUR_CONTRACT_ADDRESS_HERE",
  
  // Réseau (BSC Mainnet par défaut)
  network: {
    chainId: 56, // 56 = BSC Mainnet, 97 = BSC Testnet
    name: "BSC Mainnet",
    rpcUrl: "https://bsc-dataseed.binance.org/",
    blockExplorer: "https://bscscan.com"
  },
  
  // Token de paiement
  token: {
    symbol: "USDT",
    decimals: 18,
    registrationFee: "20"
  }
};
```

### 4. Lancer en Développement

```bash
npm start
```

L'application sera accessible sur : `http://localhost:3000`

## 📦 Build Production

### Créer le Build

```bash
npm run build
```

Les fichiers optimisés seront dans le dossier `build/`.

### Déploiement

#### Option 1 : Vercel (Recommandé)

```bash
# Installer Vercel CLI
npm install -g vercel

# Déployer
vercel
```

#### Option 2 : Netlify

```bash
# Installer Netlify CLI
npm install -g netlify-cli

# Déployer
netlify deploy --prod --dir=build
```

#### Option 3 : Serveur Custom

```bash
# Installer serve
npm install -g serve

# Lancer le serveur
serve -s build -p 3000
```

## 🔧 Configuration Avancée

### Changer de Réseau (Testnet)

Dans `src/config.js` :

```javascript
export const CONTRACT_CONFIG = {
  address: "0xYOUR_TESTNET_CONTRACT",
  network: {
    chainId: 97, // BSC Testnet
    name: "BSC Testnet",
    rpcUrl: "https://data-seed-prebsc-1-s1.binance.org:8545/",
    blockExplorer: "https://testnet.bscscan.com"
  }
};
```

### Personnaliser les Couleurs

Dans `src/App.css`, modifier les variables CSS :

```css
:root {
  --primary-orange: #FF6B35;
  --primary-green: #2D5016;
  /* ... autres couleurs ... */
}
```

## 📱 Structure du Projet

```
prosavings-dapp/
├── public/
│   └── index.html
├── src/
│   ├── components/
│   │   ├── Header.js          # En-tête avec connexion wallet
│   │   ├── Header.css
│   │   ├── Dashboard.js       # Dashboard principal
│   │   ├── Dashboard.css
│   │   ├── NetworkView.js     # Vue réseau et parrainage
│   │   └── NetworkView.css
│   ├── hooks/
│   │   ├── useWallet.js       # Hook connexion wallet
│   │   └── useProSavings.js   # Hook données contrat
│   ├── config.js              # Configuration contrat/réseau
│   ├── prosavings-abi.json    # ABI du contrat
│   ├── App.js                 # Composant racine
│   ├── App.css                # Styles globaux
│   └── index.js               # Point d'entrée
├── package.json
└── README.md
```

## 🎯 Fonctionnalités Principales

### 1. Connexion Wallet

- Détection automatique de MetaMask
- Vérification du réseau BSC
- Basculement automatique vers BSC si besoin
- Gestion des changements de compte/réseau

### 2. Dashboard

- **Statistiques** : Grade, niveau, réseau, gains
- **Progression** : Déblocage des grades Bronze/Silver/Gold
- **Performance** : Taux de remplissage, gains moyens

### 3. Vue Réseau

- **Filleuls Directs** : Liste des 2 filleuls max
- **Ligne de Sponsors** : Remontée de la chaîne
- **Lien de Parrainage** : Génération et copie

## 🔒 Sécurité

- ✅ Aucune clé privée stockée
- ✅ Connexion via MetaMask uniquement
- ✅ Vérification automatique du réseau
- ✅ Protection contre les erreurs courantes
- ✅ Messages d'erreur clairs et informatifs

## 🐛 Résolution de Problèmes

### Wallet ne se connecte pas

1. Vérifier que MetaMask est installé
2. Actualiser la page
3. Vérifier les permissions MetaMask

### Mauvais réseau

1. Cliquer sur "Mauvais réseau" dans le header
2. Accepter le changement de réseau dans MetaMask
3. Actualiser si nécessaire

### Données ne se chargent pas

1. Vérifier l'adresse du contrat dans `config.js`
2. Vérifier le réseau (Mainnet vs Testnet)
3. Vérifier la console pour les erreurs

### Erreur "execution reverted"

1. Vérifier la balance BNB (minimum 0.001 BNB)
2. Vérifier l'approbation du token
3. Vérifier que le sponsor est valide

## 📊 Gas et Coûts

| Action | Gas estimé | Coût (3 Gwei) |
|--------|-----------|---------------|
| Connexion | 0 | Gratuit ✅ |
| Lecture données | 0 | Gratuit ✅ |
| Register | ~300,000 | ~0.0009 BNB |

**Recommandation** : Garder au minimum 0.002 BNB pour les transactions.

## 🎨 Personnalisation UI

### Modifier le Logo

Remplacer dans `src/components/Header.js` :

```javascript
<div className="logo-icon">PS</div>
```

### Ajouter un Favicon

Placer votre `favicon.ico` dans `public/`

### Modifier les Textes

Tous les textes sont dans les fichiers `.js` des composants, facilement modifiables.

## 📈 Améliorations Futures

- [ ] Mode sombre/clair
- [ ] Graphiques de progression
- [ ] Notifications push
- [ ] Export PDF des statistiques
- [ ] Multi-langues (FR/EN)
- [ ] Historique des transactions
- [ ] Calculateur de gains potentiels

## 🤝 Support

Pour toute question ou problème :

1. Vérifier la documentation ci-dessus
2. Consulter les logs de la console (F12)
3. Vérifier BSCScan pour les transactions
4. Contacter le support technique

## 📄 Licence

MIT License - Libre d'utilisation et modification

## 🙏 Crédits

- **React** : Framework UI
- **Ethers.js** : Interaction blockchain
- **React Icons** : Icônes
- **React Toastify** : Notifications

---

**Développé avec ❤️ pour la communauté ProSavings**

🚀 **Bon déploiement !**
