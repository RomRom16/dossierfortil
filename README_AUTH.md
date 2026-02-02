# 🔐 Authentification Microsoft - FORTIL

## Vue d'ensemble

Ce projet intègre une authentification complète avec Microsoft (Azure AD) via Supabase. Les utilisateurs peuvent se connecter avec leur compte Microsoft et accéder à la gestion des profils.

## 📁 Structure des fichiers

```
src/
├── contexts/
│   └── AuthContext.tsx          # Contexte d'authentification global
├── components/
│   ├── Login.tsx                # Page de connexion
│   ├── UserHeader.tsx           # Barre utilisateur avec déconnexion
│   └── ... autres composants
└── pages/
    └── AuthCallback.tsx         # Page de callback OAuth
```

## 🚀 Configuration rapide

### 1. Variables d'environnement

Créez un fichier `.env.local` :

```env
VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_ANON_KEY=your_anon_key_here
```

### 2. Installation des dépendances

```bash
npm install
```

### 3. Configuration Azure AD

Suivez les étapes détaillées dans `AUTHENTIFICATION_MICROSOFT.md`

## 🔄 Flux d'authentification

```
Utilisateur
    ↓
[Page de connexion]
    ↓ (Clique sur "Connexion avec Microsoft")
[Redirection vers Azure]
    ↓ (Authentification Microsoft)
[Callback URL] (/auth/callback)
    ↓
[Dashboard protégé]
```

## 🛠️ API et Hooks

### `useAuth()`

Hook pour accéder au contexte d'authentification :

```typescript
import { useAuth } from './contexts/AuthContext';

function MyComponent() {
  const { user, loading, signInWithMicrosoft, signOut } = useAuth();
  
  // user: User | null - Utilisateur actuellement connecté
  // loading: boolean - État de chargement initial
  // signInWithMicrosoft: () => Promise<void> - Initie la connexion
  // signOut: () => Promise<void> - Déconnecte l'utilisateur
}
```

### Informations utilisateur

```typescript
const { user } = useAuth();

if (user) {
  console.log(user.email);                      // Email
  console.log(user.user_metadata?.full_name);   // Nom complet
  console.log(user.id);                         // ID unique Supabase
}
```

## 🔒 Protection des routes

Les routes sont automatiquement protégées :
- ✅ Route `/` : Accessible uniquement si connecté
- ✅ Route `/login` : Accessible uniquement si non connecté
- ✅ Route `/auth/callback` : Pour le callback OAuth

## 📦 Dépendances ajoutées

- `@supabase/supabase-js` : Client Supabase
- `react-router-dom` : Routage côté client
- `lucide-react` : Icônes

## 🐛 Débogage

### Logs de session

```typescript
import { supabase } from './lib/supabase';

const { data, error } = await supabase.auth.getSession();
console.log('Session:', data);
console.log('Erreur:', error);
```

### Vérifier l'utilisateur actuel

```typescript
const { data: { user }, error } = await supabase.auth.getUser();
console.log('Utilisateur:', user);
```

## 🚨 Erreurs courantes

| Erreur | Solution |
|--------|----------|
| "Missing Supabase environment variables" | Vérifiez `.env.local` |
| "Invalid redirect URI" | Mettez à jour l'URL dans Azure et Supabase |
| "UseAuth must be used within AuthProvider" | Assurez-vous AuthProvider wraps l'app |
| Pas de redirection après connexion | Vérifiez la page AuthCallback |

## 📱 Responsive Design

La page de connexion est entièrement responsive avec Tailwind CSS :
- Mobile : Stack vertical
- Desktop : Centré avec max-width

## 🎨 Personnalisation

### Changer les couleurs

Modifiez `src/components/Login.tsx` et `src/components/UserHeader.tsx` :

```typescript
// Exemple : Changer la couleur primaire de blue à purple
className="bg-purple-600 hover:bg-purple-700"
```

### Ajouter un logo

Mettez à jour le texte "FORTIL" en `Login.tsx` :

```typescript
<img src="/logo.png" alt="FORTIL" className="w-12 h-12 mb-4" />
```

## 🔗 Ressources

- [Documentation Supabase Auth](https://supabase.com/docs/guides/auth)
- [Microsoft Azure AD](https://azure.microsoft.com/services/active-directory/)
- [React Router v6](https://reactrouter.com/)

## ✅ Checklist déploiement

- [ ] Variables d'environnement configurées
- [ ] Azure AD app créée
- [ ] Secrets configurés dans Supabase
- [ ] URL de callback mise à jour
- [ ] Tous les fichiers créés
- [ ] `npm install` exécuté
- [ ] `npm run dev` fonctionne
- [ ] Authentification Microsoft testée

## 📝 Notes

- La session est persistée en local storage par Supabase
- Les tokens sont automatiquement refreshés
- Le logout efface la session locale
- L'authentification fonctionne en offline (avec la session en cache)
