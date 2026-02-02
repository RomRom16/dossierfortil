# 🔧 FIX: "Unsupported provider: provider is not enabled"

## Erreur
```json
{
  "code": 400,
  "error_code": "validation_failed",
  "msg": "Unsupported provider: provider is not enabled"
}
```

## Cause
Le fournisseur Azure AD n'est pas activé dans Supabase.

## ✅ Solution en 4 étapes

### Étape 1: Aller sur Supabase
1. Allez sur https://app.supabase.com
2. Sélectionnez votre projet
3. Allez à **Authentification** (dans le menu de gauche)
4. Cliquez sur **Fournisseurs** (ou "Providers")

### Étape 2: Vérifier que Azure est activé
1. Trouvez **Azure** dans la liste des fournisseurs
2. Cliquez sur **Azure**
3. Vérifiez que le toggle **Enabled** est **ON** (bleu)

### Étape 3: Remplir les credentials
Les champs suivants doivent être complétés:
- **Client ID** (de Azure AD)
- **Tenant ID** (de Azure AD)  
- **Client Secret** (de Azure AD)

**❌ Si vides** → Remplissez-les
**✅ Si remplis** → Vérifiez qu'ils sont corrects

### Étape 4: Enregistrer
Cliquez sur **Sauvegarder** ou **Save** en bas de la page

---

## 📋 Checklist avant de tester

- [ ] Allez sur app.supabase.com
- [ ] Section Authentification > Fournisseurs
- [ ] Trouvez Azure
- [ ] Vérifiez que "Enabled" est ON
- [ ] Client ID est rempli
- [ ] Tenant ID est rempli
- [ ] Client Secret est rempli
- [ ] Cliquez Sauvegarder
- [ ] Attendez 5-10 secondes
- [ ] Testez à nouveau

---

## 🔄 Si vous n'avez pas de credentials Azure

Suivez AUTHENTIFICATION_MICROSOFT.md:

1. Allez sur https://portal.azure.com
2. Créez une nouvelle app Azure AD
3. Obtenez les 3 credentials
4. Revenez à Supabase et remplissez les champs
5. Enregistrez
6. Attendez 10 secondes
7. Testez

---

## 🧪 Après avoir corrigé

1. Redémarrez le serveur: `npm run dev`
2. Ouvrez http://localhost:5173
3. Cliquez "Connexion avec Microsoft"
4. L'erreur ne devrait plus apparaître

---

## 💡 Tips

- Les credentials prennent 5-10 secondes à se synchroniser
- Si ça ne marche pas, attendez 30 secondes
- Rafraîchissez la page du navigateur (F5)
- Vérifiez la console du navigateur (F12)
- Vérifiez que .env.local a les bonnes clés Supabase

---

## ❓ Vérifier votre configuration

Depuis le terminal:
```bash
# Vérifier que .env.local existe
cat .env.local

# Vérifier les logs
npm run dev
```

Dans le navigateur (F12 → Console):
- Cherchez les erreurs
- Vérifiez que Supabase est bien chargé
