# Guide de déploiement Vercel

## ⚠️ Limitation importante : SQLite sur Vercel

Vercel utilise des **serverless functions** qui sont **stateless** (sans état). Cela signifie que :
- La base de données SQLite locale (`profiles.db`) **ne persistera pas** entre les requêtes
- Chaque invocation de fonction repart d'une base vide

## 🎯 Solutions recommandées

### Option 1 : Utiliser une base de données hébergée (RECOMMANDÉ)

Remplacez SQLite par une base de données cloud :

#### A. **Vercel Postgres** (intégration native)
```bash
# Installer le client Vercel Postgres
npm install @vercel/postgres
```

Puis modifiez `backend/index.mjs` pour utiliser Vercel Postgres au lieu de SQLite.

#### B. **Supabase** (PostgreSQL gratuit)
- Créez un projet sur [supabase.com](https://supabase.com)
- Utilisez le client PostgreSQL
- Ajoutez les variables d'environnement dans Vercel

#### C. **PlanetScale** (MySQL serverless)
- Alternative MySQL gratuite
- Excellente pour les applications serverless

### Option 2 : Déployer le backend ailleurs

Si vous voulez garder SQLite :

1. **Backend sur Railway/Render** (gratuit)
   - Déployez le dossier `backend/` sur Railway ou Render
   - Ces plateformes supportent SQLite avec stockage persistant
   
2. **Frontend sur Vercel**
   - Déployez uniquement le frontend
   - Configurez `VITE_API_URL` pour pointer vers votre backend Railway/Render

## 📦 Déploiement sur Vercel (avec la configuration actuelle)

### Étape 1 : Préparer le projet

```bash
# Installer Vercel CLI
npm install -g vercel

# Se connecter à Vercel
vercel login
```

### Étape 2 : Configurer les variables d'environnement

Dans le dashboard Vercel, ajoutez :
- `OPENAI_API_KEY` : Votre clé API OpenAI
- `OPENAI_CV_MODEL` : Le modèle à utiliser (ex: gpt-4)
- Toute autre variable nécessaire

### Étape 3 : Déployer

```bash
# Depuis la racine du projet
vercel

# Pour déployer en production
vercel --prod
```

## 🔧 Modifications nécessaires pour Vercel

### 1. Adapter le backend pour serverless

Le fichier `backend/index.mjs` doit exporter une fonction handler :

```javascript
// Au lieu de app.listen(4000)
export default app;
```

### 2. Gérer la base de données

**Option temporaire (pour tester)** : Utiliser une base en mémoire
```javascript
// Dans backend/index.mjs
const db = new Database(':memory:');
```

**Option production** : Migrer vers Vercel Postgres ou Supabase

### 3. Mettre à jour vite.config.ts

Le proxy n'est plus nécessaire en production :

```typescript
export default defineConfig({
  plugins: [react()],
  server: {
    proxy: process.env.NODE_ENV === 'development' ? {
      '/api': {
        target: 'http://localhost:4000',
        changeOrigin: true,
      }
    } : undefined
  }
});
```

## 🚀 Déploiement recommandé (Architecture hybride)

### Frontend : Vercel
- Build automatique du frontend Vite
- CDN global
- HTTPS automatique

### Backend : Railway (gratuit)
1. Créez un compte sur [railway.app](https://railway.app)
2. Connectez votre repo GitHub
3. Sélectionnez le dossier `backend/`
4. Railway détectera automatiquement Node.js
5. Ajoutez les variables d'environnement
6. Railway vous donnera une URL (ex: `https://your-app.railway.app`)

### Configuration finale
Dans Vercel, ajoutez la variable :
```
VITE_API_URL=https://your-app.railway.app/api
```

## 📝 Checklist avant déploiement

- [ ] Choisir la stratégie de base de données
- [ ] Configurer les variables d'environnement
- [ ] Tester le build localement : `npm run build`
- [ ] Vérifier que `dist/` se génère correctement
- [ ] Adapter le backend si nécessaire
- [ ] Créer un compte Vercel
- [ ] Connecter le repository GitHub (recommandé)
- [ ] Configurer les variables d'environnement dans Vercel
- [ ] Déployer et tester

## 🆘 Besoin d'aide ?

Je peux vous aider à :
1. Migrer vers Vercel Postgres
2. Configurer Railway pour le backend
3. Adapter le code pour le déploiement serverless
4. Créer les fichiers de configuration nécessaires

Quelle option préférez-vous ?
