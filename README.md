# 📋 Candidate Dossier Management

Application de gestion de dossiers de compétences pour candidats.

## 🚀 Déploiement sur Vercel

**Guide rapide** : Consultez [`DEPLOY_QUICK_START.md`](./DEPLOY_QUICK_START.md)  
**Guide complet** : Consultez [`VERCEL_DEPLOYMENT.md`](./VERCEL_DEPLOYMENT.md)

### Résumé en 3 étapes

1. **Créez une base Neon** sur [neon.tech](https://neon.tech)
2. **Déployez sur Vercel** via [vercel.com](https://vercel.com)
3. **Configurez les variables** d'environnement dans Vercel

## 💻 Développement local

### Prérequis

- Node.js 18+
- npm

### Installation

```bash
# Installer les dépendances
npm install

# Copier le fichier d'environnement
cp .env.example .env

# Ajouter votre clé OpenAI dans .env
```

### Lancement

```bash
# Terminal 1 : Frontend
npm run dev

# Terminal 2 : Backend SQLite (développement local)
cd backend
npm start
```

L'application sera disponible sur `http://localhost:5173`

## 📦 Structure du projet

```
project/
├── src/                    # Frontend React
│   ├── components/         # Composants UI
│   ├── contexts/          # Contextes React (Auth, etc.)
│   └── lib/               # Utilitaires et API client
├── backend/
│   ├── index.mjs          # Backend SQLite (dev local)
│   ├── index-postgres.mjs # Backend Neon (production Vercel)
│   └── scripts/           # Scripts utilitaires
├── dist/                  # Build de production
└── vercel.json           # Configuration Vercel
```

## 🔑 Fonctionnalités

- ✅ Gestion de candidats
- ✅ Création de dossiers de compétences
- ✅ Parsing de CV avec IA (OpenAI)
- ✅ Authentification par email
- ✅ Gestion des rôles (Admin, Business Manager)
- ✅ Suppression avec confirmation modale
- ✅ Édition des informations candidat

## 🛠️ Technologies

**Frontend:**
- React 18
- TypeScript
- Vite
- TailwindCSS
- Lucide Icons

**Backend:**
- Node.js / Express
- SQLite (développement local)
- PostgreSQL / Neon (production Vercel)

**Déploiement:**
- Vercel (Frontend + Backend serverless)
- Neon (Base de données PostgreSQL)

## 📝 Variables d'environnement

### Développement local (`.env`)

```bash
OPENAI_API_KEY=sk-...
OPENAI_CV_MODEL=gpt-4-turbo-preview
```

### Production Vercel

```bash
DATABASE_URL=postgresql://...
OPENAI_API_KEY=sk-...
OPENAI_CV_MODEL=gpt-4-turbo-preview
NODE_ENV=production
FRONTEND_URL=https://votre-app.vercel.app
```

## 🧪 Tests

```bash
# Build de production
npm run build

# Preview du build
npm run preview
```

## 📚 Documentation

- [Guide de déploiement rapide](./DEPLOY_QUICK_START.md)
- [Guide de déploiement complet](./VERCEL_DEPLOYMENT.md)
- [Architecture](./ARCHITECTURE.md)

## 🤝 Contribution

1. Fork le projet
2. Créez une branche (`git checkout -b feature/AmazingFeature`)
3. Commit vos changements (`git commit -m 'Add AmazingFeature'`)
4. Push vers la branche (`git push origin feature/AmazingFeature`)
5. Ouvrez une Pull Request

## 📄 Licence

Ce projet est sous licence privée.