# 🚀 CI/CD & Deployment Setup - Neill Beauty

## 🎯 Objectif
Ce guide explique comment configurer et utiliser le pipeline CI/CD pour assurer que **Turso DB + Vercel + Development** fonctionnent de manière fiable dans tous les environnements.

## 📋 Solution Complète

### ✅ Ce qui a été mis en place

#### 1. 🤖 **GitHub Actions CI/CD Pipeline**
- **Tests automatisés** avant chaque déploiement
- **Validation de la base de données** Turso
- **Build automatique** et déploiement vers Vercel
- **Health checks** post-déploiement

#### 2. 🗃️ **Gestion Database Robuste**
- **Setup automatique** des tables Turso au premier lancement
- **Migration automatique** des données existantes
- **Validation** des variables d'environnement
- **Scripts de diagnostic** et réparation

#### 3. 🌐 **Configuration Vercel Optimisée**
- **Headers de sécurité** automatiques
- **Build hooks** pour setup database
- **Configuration d'environnement** appropriée
- **Timeout optimisé** pour les fonctions API

#### 4. 🔧 **Scripts d'Automatisation**
- **Health checks** complets
- **Setup environnement** intelligent
- **Diagnostics** avancés
- **Tests d'intégration**

---

## 🚀 Configuration Initiale

### 1. GitHub Secrets (OBLIGATOIRE)
Dans votre repository GitHub → Settings → Secrets and Variables → Actions, ajoutez :

```bash
# Turso Database
TURSO_DATABASE_URL=libsql://your-database.turso.io
TURSO_AUTH_TOKEN=your_auth_token_here

# Vercel Deployment
VERCEL_TOKEN=your_vercel_token
ORG_ID=your_vercel_org_id  
PROJECT_ID=your_vercel_project_id
```

### 2. Variables Vercel (OBLIGATOIRE)
Dans Vercel Dashboard → Votre Projet → Settings → Environment Variables :

```bash
TURSO_DATABASE_URL=libsql://your-database.turso.io
TURSO_AUTH_TOKEN=your_auth_token_here
```

### 3. Configuration locale
```bash
# Copier le template d'environnement
cp .env.example .env

# Éditer avec vos vraies valeurs
nano .env
```

---

## 📋 Commandes Disponibles

### 🔧 **Setup & Maintenance**
```bash
# Setup complet de l'environnement (RECOMMANDÉ)
npm run environment-setup

# Diagnostic complet
npm run turso-diagnostics

# Health check complet
npm run health-check

# Setup BDD uniquement
npm run turso-complete-setup
```

### 👨‍💻 **Développement**
```bash
# Démarrage avec setup automatique
npm run dev

# Build avec setup automatique  
npm run build

# Preview local
npm run preview
```

### 🤖 **CI/CD (automatique)**
```bash
# Build CI (sans setup auto)
npm run ci:build

# Tests CI
npm run ci:test
```

---

## 🔄 Workflow CI/CD

### 📤 Push vers `main` ou `develop`
1. **🧪 Tests** : Validation code et database
2. **🏗️ Build** : Setup database + compilation
3. **🚀 Deploy** : Déploiement automatique Vercel
4. **🏥 Health Check** : Vérification post-déploiement

### 📥 Pull Request
1. **🧪 Tests uniquement** : Validation sans déploiement
2. **💬 Commentaires** : Feedback automatique sur les erreurs

---

## 🛠️ Résolution de Problèmes

### ❌ "Database is empty"
```bash
# Solution automatique
npm run environment-setup

# Ou manuel
npm run turso-complete-setup
```

### ❌ "TURSO_DATABASE_URL not found"
1. Vérifiez votre `.env` (développement)
2. Vérifiez variables Vercel (production)
3. Vérifiez GitHub Secrets (CI)

### ❌ "Build failed in CI"
1. Vérifiez que tous les secrets GitHub sont configurés
2. Vérifiez les logs GitHub Actions pour plus de détails
3. Testez localement : `npm run ci:build`

### ❌ "Vercel deployment failed"
1. Vérifiez `VERCEL_TOKEN` et `PROJECT_ID` dans GitHub Secrets
2. Vérifiez variables environnement dans Vercel Dashboard
3. Vérifiez logs de déploiement Vercel

---

## 📊 Monitoring & Health Checks

### 🏥 Health Check Manuel
```bash
npm run health-check
```

### 📋 Diagnostics Complet
```bash
npm run turso-diagnostics
```

### 🔍 Debug Logs
```bash
# Activer les logs détaillés
DEBUG=true npm run dev
```

---

## 🔐 Sécurité

### ✅ Mesures Implémentées
- Headers de sécurité automatiques (XSS, CSRF, etc.)
- Variables d'environnement sécurisées
- Timeout appropriés pour les API
- Validation des inputs

### 🔒 Bonnes Pratiques
- Ne jamais commit les fichiers `.env`
- Utiliser des tokens avec permissions minimales
- Rotationner les tokens régulièrement
- Monitorer les accès database

---

## 🎉 Avantages de cette Solution

### ✅ **Fiabilité**
- Setup database automatique dans tous les environnements
- Tests avant chaque déploiement
- Health checks post-déploiement

### ⚡ **Performance** 
- Build optimisé avec cache
- CDN Vercel intégré
- Database connection pooling

### 🔧 **Maintenance**
- Scripts de diagnostic automatiques
- Logs détaillés pour debug
- Documentation complète

### 🚀 **Productivité**
- Déploiement automatique sur push
- Setup environnement en une commande
- Intégration continue complète

---

## 📞 Support

### 🆘 En cas de problème
1. **Diagnostic** : `npm run health-check`
2. **Logs** : Vérifiez GitHub Actions ou Vercel logs
3. **Reset** : `npm run environment-setup`
4. **Documentation** : Consultez `TURSO_SETUP.md` et `SOLUTION.md`

---

**Résumé** : Avec cette configuration, votre application Neill Beauty fonctionnera de manière fiable dans tous les environnements. Le pipeline CI/CD gère automatiquement la base de données, les tests et le déploiement ! 🚀