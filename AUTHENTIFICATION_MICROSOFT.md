# Configuration de l'Authentification Microsoft (Azure)

## Étape 1 : Créer une application Azure AD

1. Allez sur [Azure Portal](https://portal.azure.com)
2. Connectez-vous avec votre compte Microsoft
3. Allez à **Azure Active Directory** > **Enregistrements d'applications**
4. Cliquez sur **Nouvel enregistrement**
5. Remplissez les champs :
   - **Nom** : FORTIL
   - **Types de comptes supportés** : Comptes dans n'importe quel répertoire d'organisation et comptes Microsoft personnels
   - **URI de redirection** : Web
     - URL : `https://[your-project].supabase.co/auth/v1/callback?provider=azure`

## Étape 2 : Configurer le secret client

1. Accédez à votre application créée
2. Allez à **Certificats et secrets**
3. Cliquez sur **Nouveau secret client**
4. Définissez l'expiration (recommandé : 24 mois)
5. **Copiez la valeur** du secret

## Étape 3 : Obtenir les IDs

1. Dans votre application Azure, allez à **Aperçu**
2. Copiez :
   - **ID d'application (client)** : `Azure-app-id`
   - **ID du répertoire (client)** : `Azure-tenant-id`

## Étape 4 : Configurer Supabase

1. Allez à votre projet Supabase : https://app.supabase.com
2. Allez à **Authentification** > **Fournisseurs**
3. Cliquez sur **Azure**
4. Activez le fournisseur
5. Remplissez les champs :
   - **Client ID** : `[votre-Azure-app-id]`
   - **Tenant ID** : `[votre-Azure-tenant-id]`
   - **Client Secret** : `[votre-secret-client]`
6. Cliquez sur **Enregistrer**

## Étape 5 : Configuration locale (.env.local)

Créez un fichier `.env.local` à la racine du projet :

```env
VITE_SUPABASE_URL=https://[your-project].supabase.co
VITE_SUPABASE_ANON_KEY=your_anon_key
```

## Étape 6 : Mettre à jour la page de callback

Assurez-vous que l'URL de callback dans le fichier `src/pages/AuthCallback.tsx` correspond à votre domaine.

Pour le développement local, vous pouvez utiliser :
- `http://localhost:5173/auth/callback`

## Tester l'authentification

1. Installez les dépendances :
   ```bash
   npm install
   ```

2. Démarrez le serveur de développement :
   ```bash
   npm run dev
   ```

3. Allez à `http://localhost:5173` et cliquez sur "Connexion avec Microsoft"

## Troubleshooting

### Erreur : "Invalid redirect URI"
- Vérifiez que l'URL de redirection dans Azure correspond exactement à celle dans Supabase
- L'URL doit inclure le protocole (https://)

### Erreur : "Invalid client secret"
- Régénérez le secret client dans Azure
- Mettez à jour la clé dans Supabase

### La session n'est pas conservée
- Vérifiez que les cookies sont activés
- Vérifiez les variables d'environnement Supabase
