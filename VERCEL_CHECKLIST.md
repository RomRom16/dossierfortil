# ✅ Migration vers Vercel - Checklist

## 📋 Fichiers créés/modifiés

### Nouveaux fichiers

- ✅ `backend/index-postgres.mjs` - Backend PostgreSQL pour Vercel
- ✅ `backend/scripts/create-admin-neon.mjs` - Script de création d'admin
- ✅ `vercel.json` - Configuration Vercel
- ✅ `.vercelignore` - Fichiers à ignorer
- ✅ `.env.vercel.example` - Template variables Vercel
- ✅ `.env.local.example` - Template pour test local avec Neon
- ✅ `VERCEL_DEPLOYMENT.md` - Guide complet
- ✅ `DEPLOY_QUICK_START.md` - Guide rapide
- ✅ `README.md` - Documentation mise à jour

### Fichiers modifiés

- ✅ `package.json` - Ajout de `@neondatabase/serverless`

### Fichiers conservés (développement local)

- ✅ `backend/index.mjs` - Backend SQLite original
- ✅ `.env` - Variables locales

## 🎯 Prochaines actions

### 1. Créer une base de données Neon

```bash
# 1. Allez sur https://neon.tech
# 2. Créez un compte (gratuit)
# 3. Créez un nouveau projet
# 4. Copiez la Connection String
#    Format: postgresql://user:password@host/database
```

### 2. Tester localement avec Neon (optionnel)

```bash
# Créez .env.local
cp .env.local.example .env.local

# Ajoutez votre DATABASE_URL de Neon
# Puis lancez :
node backend/index-postgres.mjs

# Dans un autre terminal :
npm run dev
```

### 3. Déployer sur Vercel

#### Option A : Via l'interface web (recommandé)

1. Allez sur [vercel.com](https://vercel.com)
2. Connectez votre GitHub
3. Cliquez "New Project"
4. Importez ce repository
5. Ajoutez les variables d'environnement :
   - `DATABASE_URL` : Votre connection string Neon
   - `OPENAI_API_KEY` : Votre clé OpenAI
   - `OPENAI_CV_MODEL` : `gpt-4-turbo-preview`
   - `NODE_ENV` : `production`
6. Cliquez "Deploy"

#### Option B : Via CLI

```bash
# Installer Vercel CLI
npm install -g vercel

# Se connecter
vercel login

# Déployer
vercel

# Ou directement en production
vercel --prod
```

### 4. Initialiser la base de données

```bash
# Visitez votre URL Vercel pour initialiser les tables
https://votre-app.vercel.app/api/health

# Vous devriez voir :
# {"status":"ok","timestamp":"..."}
```

### 5. Créer un utilisateur admin

#### Méthode 1 : Via le script

```bash
DATABASE_URL="postgresql://..." \
ADMIN_EMAIL="votre-email@example.com" \
ADMIN_NAME="Votre Nom" \
node backend/scripts/create-admin-neon.mjs
```

#### Méthode 2 : Via Neon SQL Editor

```sql
-- Dans l'éditeur SQL de Neon
INSERT INTO users (id, email, full_name)
VALUES ('admin-001', 'votre-email@example.com', 'Admin');

INSERT INTO user_roles (user_id, role)
VALUES ('admin-001', 'admin');
```

### 6. Mettre à jour FRONTEND_URL

```bash
# Après le premier déploiement, Vercel vous donne une URL
# Retournez dans les paramètres Vercel et ajoutez :
FRONTEND_URL=https://votre-app.vercel.app

# Puis redéployez (ou attendez le prochain commit)
```

## ✅ Vérification finale

- [ ] Base de données Neon créée
- [ ] Projet déployé sur Vercel
- [ ] Variables d'environnement configurées
- [ ] Tables initialisées (`/api/health` fonctionne)
- [ ] Utilisateur admin créé
- [ ] `FRONTEND_URL` mise à jour
- [ ] Application accessible et fonctionnelle

## 🎉 C'est terminé !

Votre application est maintenant déployée sur Vercel avec PostgreSQL !

**URL de production** : `https://votre-app.vercel.app`

## 📊 Monitoring

- **Logs Vercel** : https://vercel.com/dashboard → Votre projet → Logs
- **Base de données Neon** : https://console.neon.tech
- **Analytics** : Vercel Analytics (gratuit)

## 🆘 Besoin d'aide ?

Consultez :
- `VERCEL_DEPLOYMENT.md` pour le guide détaillé
- `DEPLOY_QUICK_START.md` pour un résumé rapide
- Les logs Vercel pour le débogage

## 💡 Astuces

### Déploiement automatique

Chaque push sur `main` redéploie automatiquement !

### Environnements

- **Production** : branche `main`
- **Preview** : autres branches (URL temporaire)

### Rollback

Dans Vercel Dashboard → Deployments → Cliquez sur un ancien déploiement → "Promote to Production"

## 🔄 Développement continu

### Workflow recommandé

1. **Développez localement** avec SQLite (`npm run dev` + `cd backend && npm start`)
2. **Committez** vos changements
3. **Pushez** sur GitHub
4. **Vercel redéploie** automatiquement avec PostgreSQL

### Tester avec Neon localement

Si vous voulez tester exactement comme en production :

```bash
# Utilisez .env.local avec DATABASE_URL de Neon
node backend/index-postgres.mjs
```

## 📝 Notes importantes

- **SQLite** reste pour le développement local
- **PostgreSQL/Neon** est utilisé en production sur Vercel
- Les deux backends ont **exactement la même API**
- Seule la couche de données change

---

**Prêt à déployer ?** Suivez les étapes ci-dessus ! 🚀
