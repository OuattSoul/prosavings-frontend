# ⚡ DÉMARRAGE RAPIDE - ProSavings Dashboard

## 🎯 En 5 Minutes Chrono !

### Étape 1 : Installation (2 min)

```bash
# Ouvrir le terminal dans le dossier prosavings-dapp
cd prosavings-dapp

# Installer les dépendances
npm install
```

### Étape 2 : Configuration (1 min)

Ouvrir `src/config.js` et remplacer :

```javascript
address: "0xYOUR_CONTRACT_ADDRESS_HERE"
```

Par l'adresse de votre contrat ProSavings déployé.

### Étape 3 : Lancer (30 sec)

```bash
npm start
```

✅ **C'est tout !** L'application s'ouvre sur http://localhost:3000

---

## 🔥 Checklist Avant Premier Test

- [ ] Node.js installé (vérifier avec `node -v`)
- [ ] npm installé (vérifier avec `npm -v`)
- [ ] MetaMask installé dans le navigateur
- [ ] Wallet connecté au réseau BSC
- [ ] Au moins 0.002 BNB dans le wallet (pour le gas)
- [ ] Adresse du contrat configurée dans `src/config.js`

---

## 🎨 Aperçu de l'Interface

### Header (Orange & Vert)
```
┌─────────────────────────────────────────────────┐
│ [PS] ProSavings           [🔗 0x1234...5678] [X]│
│      Network Dashboard                          │
└─────────────────────────────────────────────────┘
```

### Dashboard
```
┌─────────┐ ┌─────────┐ ┌─────────┐ ┌─────────┐
│ 🏆 Gold │ │ 📊 1,250│ │ 👥 2/2  │ │ 💰 45.2 │
│ Niveau 5│ │ Réseau  │ │ Filleuls│ │ USDT    │
└─────────┘ └─────────┘ └─────────┘ └─────────┘
```

### Réseau
```
Mes Filleuls Directs          Ma Ligne de Sponsors
├─ 0x1234...5678             ├─ Niveau -1: 0xABCD...
└─ 0x9ABC...DEF0             └─ Niveau -2: 0x1234...
```

---

## 🚨 Problèmes Courants

### "MetaMask n'est pas installé"
👉 Installer depuis https://metamask.io/download/

### "Mauvais réseau"
👉 Cliquer sur le bouton "Mauvais réseau" dans le header

### "Données ne se chargent pas"
👉 Vérifier l'adresse du contrat dans `src/config.js`

### Page blanche
👉 Ouvrir la console (F12) et vérifier les erreurs

---

## 📞 Aide Rapide

**Console de Développement** : F12 (Chrome/Firefox)
**Logs détaillés** : Voir la console pour les messages ✅ et ❌

---

## 🎉 Prêt à Déployer ?

### Build Production

```bash
npm run build
```

### Déployer sur Vercel

```bash
npm install -g vercel
vercel
```

**C'est parti !** 🚀
