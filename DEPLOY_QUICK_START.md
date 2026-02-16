# 🚀 Déploiement Vercel - Résumé Rapide

## ✅ Ce qui a été fait

1. ✅ Migration du backend de SQLite vers **Neon PostgreSQL**
2. ✅ Nouveau fichier backend : `backend/index-postgres.mjs`
3. ✅ Configuration Vercel : `vercel.json`
4. ✅ Script de création d'admin : `backend/scripts/create-admin-neon.mjs`
5. ✅ Guide complet : `VERCEL_DEPLOYMENT.md`

## 🎯 Prochaines étapes

### 1. Créer une base de données Neon (5 min)

```bash
# Allez sur https://neon.tech
# Créez un compte gratuit
# Créez un nouveau projet
# Copiez la Connection String
```

### 2. Déployer sur Vercel (10 min)

```bash
# Option A : Via l'interface web (recommandé)
# 1. Allez sur https://vercel.com
# 2. Connectez votre GitHub
# 3. Importez ce repo
# 4. Ajoutez les variables d'environnement :
#    - DATABASE_URL (de Neon)
#    - OPENAI_API_KEY
#    - OPENAI_CV_MODEL=gpt-4-turbo-preview
# 5. Déployez !

# Option B : Via CLI
npm install -g vercel
vercel login
vercel
```

### 3. Créer un utilisateur admin

```bash
# Méthode 1 : Via le script
DATABASE_URL="votre-connection-string" \
ADMIN_EMAIL="votre-email@example.com" \
ADMIN_NAME="Votre Nom" \
node backend/scripts/create-admin-neon.mjs

# Méthode 2 : Via Neon SQL Editor
# Copiez-collez dans l'éditeur SQL de Neon :
INSERT INTO users (id, email, full_name)
VALUES ('admin-001', 'votre-email@example.com', 'Admin');

INSERT INTO user_roles (user_id, role)
VALUES ('admin-001', 'admin');
```

### 4. Tester

```bash
# Visitez votre URL Vercel
https://votre-app.vercel.app

# Testez l'API
https://votre-app.vercel.app/api/health
```

## 📝 Variables d'environnement Vercel

Ajoutez ces variables dans les paramètres de votre projet Vercel :

```
DATABASE_URL=postgresql://user:pass@host/db
OPENAI_API_KEY=sk-...
OPENAI_CV_MODEL=gpt-4-turbo-preview
NODE_ENV=production
FRONTEND_URL=https://votre-app.vercel.app
```

## 🔧 Développement local avec Neon

Si vous voulez tester localement avec Neon :

```bash
# Créez .env.local
DATABASE_URL=postgresql://...
OPENAI_API_KEY=sk-...
OPENAI_CV_MODEL=gpt-4-turbo-preview

# Lancez le backend PostgreSQL
node backend/index-postgres.mjs

# Dans un autre terminal, lancez le frontend
npm run dev
```

## 📚 Documentation complète

Consultez `VERCEL_DEPLOYMENT.md` pour le guide détaillé !

## ⚠️ Important

- L'ancien backend SQLite (`backend/index.mjs`) reste intact pour le développement local
- Le nouveau backend PostgreSQL (`backend/index-postgres.mjs`) est utilisé sur Vercel
- Les deux backends ont la même API, seule la couche de données change

## 🆘 Besoin d'aide ?

Consultez les sections de dépannage dans `VERCEL_DEPLOYMENT.md` ou demandez-moi !
