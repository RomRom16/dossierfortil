# Où trouver vos clés Supabase

## 🔑 Guide pour obtenir vos credentials Supabase

### Étape 1 : Aller sur Supabase
1. Allez sur https://app.supabase.com
2. Connectez-vous (ou créez un compte gratuit)
3. Créez un nouveau projet ou sélectionnez un existant

### Étape 2 : Trouver l'URL du projet
1. Sur le dashboard, allez à **Settings** (⚙️)
2. Cliquez sur **API** dans le menu de gauche
3. Copiez **Project URL** (format : `https://xxxxx.supabase.co`)

### Étape 3 : Trouver la clé Anon
1. Dans **Settings** → **API**
2. Sous **Project API keys**, trouvez **anon key**
3. Copiez la clé complète

### Étape 4 : Créer le fichier .env.local
À la racine du projet (`/Users/romeoprobst/Desktop/TAF/FORTIL/project/`), créez un fichier `.env.local` :

```env
VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_ANON_KEY=your-anon-key-here
```

Remplacez:
- `your-project` par votre ID de projet
- `your-anon-key-here` par votre clé Anon

### Étape 5 : Vérifier que ça marche
```bash
npm run dev
# Ouvrez http://localhost:5173
# Vous devriez voir la page de login
```

---

## ⚠️ Important

🔒 **JAMAIS** commit `.env.local` (il est dans .gitignore)
🔒 Les clés Supabase sont publiques (c'est normal)
🔒 Pour protéger vos données, utilisez Row Level Security (RLS) dans Supabase

---

## 🆘 Erreur : "Missing Supabase environment variables"

Cela signifie que :
1. `.env.local` n'existe pas OU
2. Les variables ne sont pas correctement copiées OU
3. Le serveur n'a pas rechargé (redémarrez `npm run dev`)

**Solution** :
1. Vérifiez que `.env.local` existe à la racine
2. Vérifiez que vous avez copié les bonnes clés
3. Redémarrez le serveur (`npm run dev`)

---

## 📸 Screenshots des clés Supabase

### Localiser l'URL du projet
```
Dashboard Supabase
  ↓
Settings (⚙️) 
  ↓
API 
  ↓
Project URL (copier ici)
```

### Localiser la clé Anon
```
Settings (⚙️)
  ↓
API
  ↓
Project API keys
  ↓
anon key (copier ici)
```

---

## ✅ Checklist

- [ ] Compte Supabase créé (https://app.supabase.com)
- [ ] Projet Supabase créé
- [ ] URL du projet copiée
- [ ] Clé Anon copiée
- [ ] Fichier `.env.local` créé
- [ ] Variables remplies correctement
- [ ] Serveur redémarré (`npm run dev`)
- [ ] Page de login visible sans erreur

---

Si vous avez une erreur, consultez **AUTHENTIFICATION_MICROSOFT.md** - Troubleshooting
