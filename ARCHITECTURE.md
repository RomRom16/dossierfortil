# Architecture de l'Authentification Microsoft

## 🏗️ Vue d'ensemble

```
┌─────────────────────────────────────────────────────────┐
│                    FORTIL Application                   │
├─────────────────────────────────────────────────────────┤
│                                                         │
│  ┌──────────────────────────────────────────────────┐  │
│  │         main.tsx                                 │  │
│  │  ├─ BrowserRouter                               │  │
│  │  └─ AuthProvider (AuthContext.tsx)              │  │
│  └──────────────────────────────────────────────────┘  │
│                      ↓                                  │
│  ┌──────────────────────────────────────────────────┐  │
│  │         App.tsx                                  │  │
│  │  ├─ Routes                                       │  │
│  │  │  ├─ /login → <Login />                        │  │
│  │  │  ├─ /auth/callback → <AuthCallback />         │  │
│  │  │  └─ / → <Dashboard /> (protected)             │  │
│  │  └─ useAuth() pour vérifier la connexion        │  │
│  └──────────────────────────────────────────────────┘  │
│                                                         │
│  Components:                                            │
│  ├─ Login.tsx                                           │
│  │  └─ Bouton "Connexion Microsoft"                     │
│  ├─ UserHeader.tsx                                      │
│  │  └─ Infos utilisateur + Logout                       │
│  ├─ AuthCallback.tsx                                    │
│  │  └─ Gère le redirect OAuth                           │
│  └─ ProtectedRoute.tsx (optionnel)                      │
│     └─ Wrapper pour les routes protégées                │
│                                                         │
└─────────────────────────────────────────────────────────┘
              ↓                         ↑
┌─────────────────────────────────────────────────────────┐
│           Supabase (Backend)                            │
├─────────────────────────────────────────────────────────┤
│                                                         │
│  ┌──────────────────────────────────────────────────┐  │
│  │  Auth Service (Supabase)                         │  │
│  │  ├─ Provider: Azure (Microsoft)                  │  │
│  │  ├─ signInWithOAuth()                            │  │
│  │  ├─ signOut()                                    │  │
│  │  ├─ onAuthStateChange()                          │  │
│  │  └─ getSession()                                 │  │
│  └──────────────────────────────────────────────────┘  │
│                      ↓                                  │
│  ┌──────────────────────────────────────────────────┐  │
│  │  Azure AD (Microsoft)                            │  │
│  │  ├─ login.microsoftonline.com                    │  │
│  │  ├─ Authentification utilisateur                 │  │
│  │  └─ Retour du token                              │  │
│  └──────────────────────────────────────────────────┘  │
│                                                         │
└─────────────────────────────────────────────────────────┘
```

## 🔄 Flux d'Authentification détaillé

```
                        USER
                         ↓
                   Visite /login
                         ↓
            ┌────────────────────────┐
            │   Page de connexion    │
            │   (Login.tsx)          │
            │   ┌────────────────┐   │
            │   │ Connexion avec │   │
            │   │   Microsoft    │   │
            │   └────────────────┘   │
            └────────────────────────┘
                    ↓ (Click)
          signInWithMicrosoft()
                    ↓
    ┌─────────────────────────────────┐
    │  Supabase Auth Service          │
    │  signInWithOAuth({              │
    │    provider: 'azure',           │
    │    redirectTo: /auth/callback   │
    │  })                             │
    └─────────────────────────────────┘
                    ↓
        ┌───────────────────────────┐
        │  Redirection vers Azure   │
        │  login.microsoftonline    │
        └───────────────────────────┘
                    ↓
         User se connecte à Microsoft
                    ↓
        ┌───────────────────────────┐
        │  Azure retourne Token     │
        └───────────────────────────┘
                    ↓
   Supabase crée une session utilisateur
                    ↓
    ┌─────────────────────────────────┐
    │  Redirection vers              │
    │  /auth/callback?code=...       │
    └─────────────────────────────────┘
                    ↓
        ┌───────────────────────────┐
        │  AuthCallback.tsx         │
        │  ├─ getSession()          │
        │  ├─ Navigation vers "/"   │
        │  └─ Dashboard loaded      │
        └───────────────────────────┘
                    ↓
            ┌──────────────┐
            │  Dashboard   │
            │  Protected   │
            │  ✓ Connected │
            └──────────────┘
```

## 📦 État du contexte (AuthContext)

```typescript
interface AuthContextType {
  user: User | null;              // Utilisateur Supabase complet
  loading: boolean;               // État de chargement initial
  signInWithMicrosoft: () => Promise<void>;  // Initier connexion
  signOut: () => Promise<void>;    // Déconnecter
}

// Dans user, vous avez accès à:
user.id                     // UUID unique
user.email                  // Email Microsoft
user.user_metadata.full_name // Nom complet (optionnel)
user.created_at            // Date de création
user.last_sign_in_at       // Dernière connexion
```

## 🔐 Sécurité

```
┌─────────────────────────────────────────────┐
│         Sécurité en 4 couches              │
├─────────────────────────────────────────────┤
│                                             │
│  1. OAuth 2.0 / OpenID Connect             │
│     └─ Standard d'industrie Microsoft      │
│                                             │
│  2. JWT Tokens (Supabase)                  │
│     └─ Stockés en localStorage              │
│     └─ Valides 1 heure                     │
│     └─ Auto-refresh                        │
│                                             │
│  3. Session Validation                     │
│     └─ Vérifiée au démarrage                │
│     └─ Listener sur changements             │
│                                             │
│  4. Route Protection                       │
│     └─ Redirect automatique /login          │
│     └─ Si pas de session                    │
│                                             │
└─────────────────────────────────────────────┘
```

## 📂 Fichiers et responsabilités

```
src/
│
├── contexts/
│   └── AuthContext.tsx ........................ Gestion d'état auth
│      ├─ createContext()
│      ├─ AuthProvider (wrapper)
│      ├─ useAuth() (hook)
│      └─ Listeners Supabase
│
├── components/
│   ├─ Login.tsx ............................. Interface de connexion
│   │  ├─ UI pour le bouton Microsoft
│   │  └─ Gestion d'erreurs
│   │
│   ├─ UserHeader.tsx ........................ Barre utilisateur
│   │  ├─ Affiche email & nom
│   │  └─ Bouton logout
│   │
│   ├─ ProtectedRoute.tsx (optionnel) ........ Wrapper route
│   │  ├─ Check isAuthenticated
│   │  └─ Redirect à /login si besoin
│   │
│   ├─ ProfileForm.tsx ....................... Existant
│   └─ ProfilesList.tsx ...................... Existant
│
├── pages/
│   └─ AuthCallback.tsx ...................... Callback OAuth
│      ├─ Récupère la session
│      ├─ Redirige vers /
│      └─ Gère les erreurs
│
├── lib/
│   └── supabase.ts .......................... Client Supabase
│      ├─ createClient()
│      └─ Types Supabase
│
├── App.tsx ................................. Router principal
│   ├─ Routes setup
│   ├─ useAuth() check
│   └─ Route protection
│
├── main.tsx ................................ Entry point
│   ├─ BrowserRouter
│   └─ AuthProvider wrapper
│
└── index.css .............................. Styles
```

## 🔗 Interactions entre composants

```
main.tsx (Entry)
    ↓
BrowserRouter
    ↓
AuthProvider (AuthContext)
    ├─ Initialise les listeners Supabase
    ├─ Met à jour l'état utilisateur
    └─ Fournit useAuth() hook
        ↓
    App.tsx (Router)
        ├─ Utilise useAuth() pour user & loading
        ├─ Route /login → Login.tsx
        │  └─ Utilise useAuth() pour signInWithMicrosoft
        │
        ├─ Route /auth/callback → AuthCallback.tsx
        │  └─ Utilise supabase.auth.getSession()
        │
        └─ Route / → Dashboard
           ├─ Affiche UserHeader.tsx
           │  └─ Utilise useAuth() pour user & signOut
           │
           ├─ Affiche ProfileForm.tsx
           └─ Affiche ProfilesList.tsx
```

## 🚀 Performances

```
Optimisations implémentées:

✅ Lazy loading routes (React Router)
✅ Code splitting automatique (Vite)
✅ Session persistée (localStorage)
✅ Auto-refresh tokens (Supabase)
✅ Minimal re-renders (Context + useAuth)
✅ CSS optimisé (Tailwind + PostCSS)
```

## 📱 Responsive Design

```
Mobile (< 640px)
├─ Login form: Full width
├─ UserHeader: Stack vertical
└─ Dashboard: Adapté

Tablet (640px - 1024px)
├─ Login form: Max-width 90%
├─ UserHeader: Flex horizontal
└─ Dashboard: 2 colonnes

Desktop (> 1024px)
├─ Login form: Max-width 400px
├─ UserHeader: Full flex
└─ Dashboard: 3+ colonnes
```

---

**Architecture Complète - Prête pour la Production** 🚀
