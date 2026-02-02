# 🔍 Diagnostic de Configuration Supabase

## Erreur reçue
```
"Unsupported provider: provider is not enabled"
```

## Checklist de Diagnostic

### 1. Vérifier .env.local
```bash
# Depuis le terminal du projet
cat .env.local
```

Doit afficher:
```
VITE_SUPABASE_URL=https://xxxxx.supabase.co
VITE_SUPABASE_ANON_KEY=xxxxxxxxxxxxxxx
```

**✅ OK?** Continuez  
**❌ Erreur ou vide?** Créez le fichier (voir SUPABASE_CREDENTIALS.md)

---

### 2. Vérifier que Supabase charge
Ouvrez le navigateur (F12 → Console) et collez:
```javascript
console.log(window.supabase)
```

**✅ Affiche un objet?** OK  
**❌ undefined?** Les variables d'env ne sont pas bonnes

---

### 3. Vérifier dans Supabase Dashboard

1. Allez sur https://app.supabase.com
2. Sélectionnez votre projet
3. Allez à **Settings** (⚙️) en bas à gauche
4. Cliquez sur **API** dans le menu
5. Vérifiez:
   - Project URL correspond à .env.local
   - anon key correspond à .env.local

**✅ Correspond?** OK  
**❌ Différent?** Mettez à jour .env.local

---

### 4. Vérifier Azure dans Supabase

1. Supabase Dashboard → votre projet
2. **Authentification** → **Fournisseurs**
3. Cherchez **Azure**
4. Cliquez sur Azure pour ouvrir
5. Vérifiez:
   - Le toggle **Enabled** est **bleu/ON**
   - **Client ID** n'est pas vide
   - **Tenant ID** n'est pas vide
   - **Client Secret** n'est pas vide

**✅ Tous remplis et Enabled?** OK  
**❌ Vide ou Disabled?** Cliquez sur Azure et remplissez

---

### 5. Vérifier vos credentials Azure

Si les champs dans Supabase sont vides, obtenez vos credentials:

1. Allez sur https://portal.azure.com
2. **Azure Active Directory**
3. **App registrations**
4. Cherchez votre app "FORTIL"
5. Cliquez dessus
6. **Overview** → Copiez:
   - **Application (client) ID** → Client ID
   - **Directory (tenant) ID** → Tenant ID
7. **Certificates & secrets** → Copiez:
   - La **Value** du secret → Client Secret

---

## 🔧 Étapes de correction

### Si Azure est disabled dans Supabase:
```
1. Supabase → Authentification → Fournisseurs → Azure
2. Cliquez sur le toggle pour l'activer
3. Remplissez les 3 champs
4. Cliquez Save
5. Attendez 10 secondes
6. Testez
```

### Si credentials sont vides:
```
1. Allez sur portal.azure.com
2. Copiez vos 3 credentials
3. Allez sur Supabase
4. Collez dans les 3 champs
5. Cliquez Save
6. Attendez 10 secondes
7. Testez
```

### Si credentials sont invalides:
```
1. Vérifiez dans portal.azure.com que l'app existe
2. Vérifiez les credentials (pas de typo)
3. Regenerez le secret si nécessaire
4. Mettez à jour dans Supabase
5. Attendez 10 secondes
6. Testez
```

---

## 🧪 Tester après correction

```bash
# 1. Redémarrer le serveur
npm run dev

# 2. Ouvrir http://localhost:5173
# 3. Ouvrir console du navigateur (F12)
# 4. Cliquer sur "Connexion Microsoft"
# 5. Vérifier qu'il n'y a pas d'erreur
```

---

## 📱 Vérifier dans le navigateur

Appuyez sur **F12** → **Console** et cherchez:

✅ **OK** - Pas d'erreur rouge
❌ **ERREUR** - Voir le message d'erreur complet

Erreurs courantes:
- `CORS error` → Vérifier configuration Supabase
- `Invalid redirect_uri` → Vérifier URL dans Azure
- `Invalid client id` → Vérifier credentials
- `Provider not enabled` → Voir cette page

---

## 🎯 Plan d'action rapide

**Si vous voyez l'erreur:**
1. Allez sur Supabase Dashboard
2. Cherchez Authentification → Fournisseurs → Azure
3. Vérifiez que Azure est **Enabled**
4. Vérifiez les 3 champs sont remplis
5. Attendez 10 secondes
6. Testez

**Si ça ne marche toujours pas:**
1. Allez sur Azure Portal
2. Copiez vos credentials
3. Allez sur Supabase
4. Collez les credentials
5. Attendez 10 secondes
6. Testez

---

## 📞 Besoin d'aide?

Consultez:
- **AUTHENTIFICATION_MICROSOFT.md** - Configuration complète Azure
- **SUPABASE_CREDENTIALS.md** - Où trouver les clés
- **FIX_PROVIDER_NOT_ENABLED.md** - Ce fichier
