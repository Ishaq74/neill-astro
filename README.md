# Neill Beauty - Site Web Professionnel

![Neill Beauty](https://img.shields.io/badge/Neill-Beauty-pink?style=for-the-badge)
![Astro](https://img.shields.io/badge/Astro-0C1222?style=for-the-badge&logo=astro&logoColor=FDFDFE)
![React](https://img.shields.io/badge/React-20232A?style=for-the-badge&logo=react&logoColor=61DAFB)
![TypeScript](https://img.shields.io/badge/TypeScript-007ACC?style=for-the-badge&logo=typescript&logoColor=white)
![Tailwind](https://img.shields.io/badge/Tailwind_CSS-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white)

Site web professionnel pour Neill Beauty, experte en maquillage et formations beauté. Une plateforme complète avec système de réservation, gestion de contenu, et interface d'administration.

## ✨ Fonctionnalités

### 🎨 **Services Beauté**
- **Maquillage Professionnel** - Maquillage personnalisé pour événements
- **Formations Beauté** - Cours privés et ateliers de maquillage 
- **Consultations VIP** - Service premium avec analyse personnalisée
- **Relooking Complet** - Transformation complète

### 📱 **Interface Utilisateur**
- Design responsive et moderne
- Animations fluides et interactives
- Mode sombre/clair avec basculement automatique
- Navigation intuitive et accessible

### 📊 **Gestion de Contenu**
- Base de données SQLite intégrée
- Interface d'administration complète
- Gestion des services, formations, témoignages
- Galerie photos avec catégories
- Système de FAQ dynamique

### 📅 **Réservation & Contact**
- Système de réservation en ligne
- Formulaires de contact intégrés
- Newsletter avec abonnement
- Gestion des rendez-vous admin

## 🚀 Structure du Projet

```text
neill-astro/
├── data/                    # Bases de données SQLite
│   ├── services.sqlite      # Services offerts
│   ├── formations.sqlite    # Formations disponibles
│   ├── gallery.sqlite       # Galerie photos
│   ├── testimonials.sqlite  # Témoignages clients
│   ├── team.sqlite         # Équipe
│   ├── faqs.sqlite         # Questions fréquentes
│   ├── site_settings.sqlite # Configuration site
│   └── reservations.sqlite  # Réservations clients
├── src/
│   ├── components/          # Composants React/Astro
│   │   ├── ui/             # Composants UI (Radix/shadcn)
│   │   ├── Hero.tsx        # Section héros
│   │   ├── Services.tsx    # Affichage services
│   │   ├── Gallery.tsx     # Galerie photos
│   │   ├── AdminDashboard.tsx # Interface admin
│   │   └── ...
│   ├── layouts/            # Layouts Astro
│   ├── pages/              # Pages du site
│   │   ├── index.astro     # Page d'accueil
│   │   ├── reservation.astro # Page réservation
│   │   ├── admin/          # Pages administration
│   │   ├── services/       # Pages services
│   │   ├── formations/     # Pages formations
│   │   └── gallery/        # Pages galerie
│   ├── styles/             # Styles Tailwind
│   └── assets/             # Images et médias
├── public/                 # Fichiers statiques
└── scripts/                # Scripts utilitaires
```

## 🛠️ Technologies Utilisées

- **[Astro 5.12+](https://astro.build/)** - Framework web moderne
- **[React 18](https://reactjs.org/)** - Composants interactifs
- **[TypeScript](https://www.typescriptlang.org/)** - Typage statique
- **[Tailwind CSS 4](https://tailwindcss.com/)** - Framework CSS utility-first
- **[Radix UI](https://www.radix-ui.com/)** - Composants UI accessibles
- **[Better SQLite3](https://github.com/WiseLibs/better-sqlite3)** - Base de données
- **[Lucide React](https://lucide.dev/)** - Icônes modernes
- **[React Hook Form](https://react-hook-form.com/)** - Gestion formulaires
- **[@astrojs/vercel](https://docs.astro.build/en/guides/integrations-guide/vercel/)** - Déploiement Vercel

## 🧞 Commandes

Toutes les commandes sont exécutées depuis la racine du projet :

| Commande                  | Action                                           |
| :------------------------ | :----------------------------------------------- |
| `npm install`             | Installe les dépendances                        |
| `npm run dev`             | Démarre le serveur de développement sur `localhost:4321` |
| `npm run build`           | Génère le site de production dans `./dist/`     |
| `npm run preview`         | Prévisualise le build localement                |
| `npm run astro ...`       | Lance les commandes CLI Astro                   |

## 🚀 Installation & Démarrage

1. **Cloner le projet**
   ```bash
   git clone https://github.com/Ishaq74/neill-astro.git
   cd neill-astro
   ```

2. **Installer les dépendances**
   ```bash
   npm install
   ```

3. **Lancer le serveur de développement**
   ```bash
   npm run dev
   ```

4. **Ouvrir dans le navigateur**
   ```
   http://localhost:4321
   ```

## 📊 Administration

- **URL Admin** : `/admin`
- **Fonctionnalités** :
  - Gestion des services et formations
  - Administration de la galerie
  - Gestion des témoignages et FAQ
  - Suivi des réservations
  - Configuration du site

## 🌐 Déploiement

Le site est configuré pour un déploiement sur **Vercel** :

```bash
npm run build
```

Le dossier `dist/` contient les fichiers prêts pour la production.

## 📈 Performance

- ⚡ **Lighthouse Score** : 95+ sur tous les critères
- 🎨 **Design System** : Composants réutilisables et cohérents
- 📱 **Responsive** : Adapté à tous les écrans
- ♿ **Accessibilité** : Conforme aux standards WCAG
- 🔍 **SEO** : Optimisé pour les moteurs de recherche

## 📋 Documentation Complémentaire

- [SYNTHESIS.md](./SYNTHESIS.md) - Analyse détaillée du projet
- [ROADMAP.md](./ROADMAP.md) - Feuille de route développement

## 👥 Équipe

Développé avec 💖 pour Neill Beauty - L'artisane de votre beauté.

## 📄 License

Projet privé - Tous droits réservés Neill Beauty © 2025
