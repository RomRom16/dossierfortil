# Quick Start - Authentification Microsoft

## ⚡ Démarrage rapide en 5 minutes

### Prérequis
- Node.js 16+
- Compte Microsoft
- Compte Supabase (gratuit)
- Compte Azure

### Étape 1 : Configuration Azure (3 minutes)
```
1. https://portal.azure.com → Azure Active Directory
2. Enregistrements d'applications → Nouvel enregistrement
3. Nom: FORTIL
4. Types: Comptes multi-tenant
5. Redirection: Web → https://[project].supabase.co/auth/v1/callback?provider=azure
6. Créer
7. Copier: Client ID & Tenant ID
8. Certificats et secrets → Nouveau → Copier Value
```

### Étape 2 : Configuration Supabase (1 minute)
```
1. https://app.supabase.com → Authentification → Fournisseurs
2. Azure → Activer
3. Coller: Client ID, Tenant ID, Client Secret
4. Enregistrer
```

### Étape 3 : Configuration locale (1 minute)
```bash
# Créer .env.local
VITE_SUPABASE_URL=https://xxxxx.supabase.co
VITE_SUPABASE_ANON_KEY=xxxxxxxxxxxx

# Installer & lancer
npm install
npm run dev
```

### Étape 4 : Tester (1 minute)
```
1. Ouvrir http://localhost:5173
2. Cliquer "Connexion avec Microsoft"
3. Se connecter avec son compte Microsoft
4. Vérifier le redirect
```

## 📱 Structure finale

```
✅ Login page
✅ Microsoft OAuth flow
✅ Session persistence
✅ Protected routes
✅ User header
✅ Logout functionality
✅ Error handling
✅ Loading states
```

## 🎨 Personnalisations rapides

### Changer les couleurs (Login.tsx & UserHeader.tsx)
```
blue-600 → purple-600
blue-700 → purple-700
```

### Ajouter logo
```tsx
<img src="/your-logo.png" alt="Logo" className="w-12 h-12" />
```

### Changer le texte
```tsx
"FORTIL" → "Votre app"
"Gestion des profils" → "Votre slogan"
```

## 🔗 Ressources
- [Supabase Auth Docs](https://supabase.com/docs/guides/auth)
- [Microsoft Azure AD](https://azure.microsoft.com/services/active-directory/)
- [React Router](https://reactrouter.com/)

## ⚠️ Erreurs courantes

| Erreur | Fix |
|--------|-----|
| "Invalid redirect URI" | Vérifier l'URL dans Azure & Supabase |
| CORS error | Ajouter origin dans Supabase |
| Session vide | Vérifier .env.local |
| Route not found | Vérifier React Router setup |

## 🆘 Debug

```bash
# Voir les logs
npm run dev

# Vérifier les types
npm run typecheck

# Lint
npm run lint
```

## ✅ Checklist finale

- [ ] Azure app créée
- [ ] Credentials copiés
- [ ] Supabase configuré
- [ ] .env.local créé
- [ ] npm install exécuté
- [ ] npm run dev lancé
- [ ] Page de login visible
- [ ] Bouton Microsoft cliquable
- [ ] Authentification réussie
- [ ] Session persistée

---

**Status: ✅ Prêt à l'emploi**

Besoin d'aide ? Consultez README_AUTH.md ou EXEMPLES_AUTH.md
