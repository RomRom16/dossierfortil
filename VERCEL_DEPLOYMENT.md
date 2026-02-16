# 🚀 Guide de déploiement Vercel avec Neon PostgreSQL

## Étape 1 : Créer une base de données Neon

1. Allez sur [neon.tech](https://neon.tech)
2. Créez un compte gratuit
3. Créez un nouveau projet
4. Copiez la **Connection String** (elle ressemble à : `postgresql://user:password@host/database`)

## Étape 2 : Préparer le projet

### 2.1 Installer les dépendances

```bash
npm install
```

### 2.2 Tester localement avec Neon (optionnel)

Créez un fichier `.env.local` :

```bash
DATABASE_URL=postgresql://votre-connection-string
OPENAI_API_KEY=votre-clé-openai
OPENAI_CV_MODEL=gpt-4-turbo-preview
NODE_ENV=development
```

Puis lancez le backend PostgreSQL :

```bash
node backend/index-postgres.mjs
```

## Étape 3 : Déployer sur Vercel

### 3.1 Via l'interface Vercel (recommandé)

1. Allez sur [vercel.com](https://vercel.com)
2. Connectez votre compte GitHub
3. Cliquez sur "New Project"
4. Importez ce repository
5. Vercel détectera automatiquement Vite

### 3.2 Configurer les variables d'environnement

Dans les paramètres du projet Vercel, ajoutez :

| Variable | Valeur |
|----------|--------|
| `DATABASE_URL` | Votre connection string Neon |
| `OPENAI_API_KEY` | Votre clé API OpenAI |
| `OPENAI_CV_MODEL` | `gpt-4-turbo-preview` |
| `NODE_ENV` | `production` |
| `FRONTEND_URL` | `https://votre-app.vercel.app` (sera fourni après le premier déploiement) |

### 3.3 Déployer

Cliquez sur "Deploy" !

Vercel va :
1. Builder le frontend Vite
2. Déployer le backend comme serverless function
3. Vous donner une URL de production

## Étape 4 : Initialiser la base de données

Après le premier déploiement :

1. Allez sur votre URL Vercel : `https://votre-app.vercel.app/api/health`
2. Cela déclenchera l'initialisation des tables
3. Vous devriez voir : `{"status":"ok","timestamp":"..."}`

## Étape 5 : Créer un utilisateur admin

### Option A : Via Neon SQL Editor

Connectez-vous à Neon et exécutez :

```sql
-- Créer un utilisateur
INSERT INTO users (id, email, full_name)
VALUES ('admin-001', 'votre-email@example.com', 'Admin');

-- Lui donner le rôle admin
INSERT INTO user_roles (user_id, role)
VALUES ('admin-001', 'admin');
```

### Option B : Via script (à créer)

Créez un fichier `backend/scripts/create-admin-neon.mjs` :

```javascript
import { neon } from '@neondatabase/serverless';

const sql = neon(process.env.DATABASE_URL);

const userId = 'admin-001';
const email = 'votre-email@example.com';
const fullName = 'Admin';

await sql`
  INSERT INTO users (id, email, full_name)
  VALUES (${userId}, ${email}, ${fullName})
  ON CONFLICT (id) DO NOTHING
`;

await sql`
  INSERT INTO user_roles (user_id, role)
  VALUES (${userId}, 'admin')
  ON CONFLICT (user_id, role) DO NOTHING
`;

console.log('✅ Admin user created');
```

Puis exécutez :

```bash
DATABASE_URL="votre-connection-string" node backend/scripts/create-admin-neon.mjs
```

## Étape 6 : Mettre à jour FRONTEND_URL

Après le premier déploiement, Vercel vous donne une URL (ex: `https://votre-app.vercel.app`).

1. Retournez dans les paramètres Vercel
2. Mettez à jour `FRONTEND_URL` avec cette URL
3. Redéployez (ou attendez le prochain commit)

## 🔄 Déploiements futurs

Chaque fois que vous pushez sur la branche `main` (ou `master`), Vercel redéploiera automatiquement !

## 🐛 Dépannage

### Erreur : "Database connection failed"

- Vérifiez que `DATABASE_URL` est bien configurée dans Vercel
- Vérifiez que votre IP est autorisée dans Neon (par défaut, Neon accepte toutes les connexions)

### Erreur : "CORS"

- Vérifiez que `FRONTEND_URL` correspond à votre URL Vercel
- Assurez-vous qu'il n'y a pas de `/` à la fin

### Les tables ne se créent pas

- Visitez `/api/health` pour déclencher l'initialisation
- Vérifiez les logs Vercel pour voir les erreurs

## 📊 Monitoring

- **Logs** : Allez dans l'onglet "Logs" de votre projet Vercel
- **Database** : Utilisez le dashboard Neon pour voir vos données
- **Performance** : Vercel Analytics (gratuit pour les projets personnels)

## 💰 Coûts

- **Vercel** : Gratuit jusqu'à 100GB de bande passante/mois
- **Neon** : Gratuit jusqu'à 0.5GB de stockage
- **OpenAI** : Selon votre utilisation

## 🎉 C'est fait !

Votre application est maintenant déployée sur Vercel avec une base de données PostgreSQL hébergée sur Neon !

URL de production : `https://votre-app.vercel.app`
