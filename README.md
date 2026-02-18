# 📄 Plateforme FORTIL - Dossiers de Compétences

Cette plateforme permet de gérer les candidatures et de générer des **Dossiers de Compétences** professionnels à partir de CV au format PDF. Elle utilise l'intelligence artificielle pour extraire les informations clés et automatiser la création de documents DOCX.

## 🚀 Fonctionnalités Clés

- **Extraction IA** : Analyse automatique des CV (PDF) pour extraire expériences, formations, compétences et outils.
- **Gestion des Candidats** : Suivi complet des candidats par les Business Managers.
- **Génération de Dossiers** : Création de dossiers de compétences structurés et exportables.
- **Authentification Microsoft** : Connexion sécurisée via Azure AD et Supabase.
- **Validation Multi-Rôles** : Accès différenciés pour les Administrateurs, Business Managers et Consultants.

## 🏗️ Architecture Technique

Le projet est divisé en trois composants principaux :

1.  **Frontend (React)** : Une application moderne sous Vite, React et Tailwind CSS.
2.  **Backend (Node.js)** : API Express gérant la base de données SQLite (`better-sqlite3`) et l'orchestration des données.
3.  **Pipeline CV2DOC (n8n & FastAPI)** : Module optionnel pour la génération avancée de documents via des workflows n8n et l'IA Gemini.

## 🛠️ Installation et Démarrage

### Pré-requis
- [Docker & Docker Compose](https://www.docker.com/)
- Un compte [OpenAI](https://openai.com/) (pour l'extraction de données)
- Un compte [Supabase](https://supabase.com/) & Azure AD (pour l'authentification)

### Configuration
1. Clonez le dépôt.
2. Créez un fichier `.env` à la racine en vous basant sur `.env.example`.
3. Configurez les variables d'environnement suivantes :
   ```env
   # Backend
   OPENAI_API_KEY=votre_cle_openai
   PORT=4000

   # Frontend
   VITE_SUPABASE_URL=votre_url_supabase
   VITE_SUPABASE_ANON_KEY=votre_cle_anonyme
   ```

### Lancement avec Docker
Le moyen le plus simple de lancer l'application complète est d'utiliser Docker Compose :

```bash
docker compose up --build -d
```
- Frontend : `http://localhost:8080`
- Backend : `http://localhost:4000`

### Pipeline CV2DOC (Optionnel)
Si vous souhaitez utiliser le pipeline n8n :
```bash
cd CV2DOC-n8n-flow-main
docker compose up -d
```
- n8n : `http://localhost:5678`

## 📂 Structure du Projet

```text
├── backend/               # Serveur API Node.js & SQLite
├── src/                   # Source Frontend (React + Vite)
├── public/                # Assets statiques
├── CV2DOC-n8n-flow-main/  # Module de traitement CV (n8n/Python)
├── docker-compose.yml     # Orchestration globale
└── profiles.db            # Base de données locale (SQLite)
```

## 🔒 Authentification
L'authentification est gérée par **Supabase** avec le fournisseur **Azure AD** (Microsoft). 
Pour plus de détails sur la configuration, consultez le fichier `AUTHENTIFICATION_MICROSOFT.md`.

## 📄 Licence
Propriété de FORTIL.
