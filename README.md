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
3. Configurez les variables d'environnement (voir `.env.example` pour la liste complète).

### Lancement en local (sans Docker)

Pour tout faire tourner en local (frontend, backend, FastAPI pour l’IA) :

1. **Fichier `.env`** à la racine (voir Configuration ci‑dessus). En local, **ne pas** définir `N8N_WEBHOOK_URL_DOCX` (ou le laisser vide) pour que le backend appelle FastAPI directement.

2. **Terminal 1 – Backend**  
   Depuis la racine (charge le `.env` à la racine, Node 20+) :
   ```bash
   cd backend && npm install && cd ..
   npm run dev:backend
   ```
   → API sur **http://localhost:4000**

3. **Terminal 2 – FastAPI (CV2DOC / Gemini)**  
   Depuis le dossier du projet :
   ```bash
   cd CV2DOC-n8n-flow-main/endpoint && uv run fastapi run main.py --port 8000 --host 0.0.0.0
   ```
   (Prérequis : [uv](https://docs.astral.sh/uv/). Si besoin : `curl -LsSf https://astral.sh/uv/install.sh | sh`.)  
   → Service sur **http://localhost:8000** (extraction JSON + génération DOCX).

4. **Terminal 3 – Frontend**
   ```bash
   npm install && npm run dev
   ```
   → App sur **http://localhost:5173** (le proxy envoie `/api` vers le backend).

Ouvrir **http://localhost:5173** dans le navigateur. L’extraction par Gemini et la génération DOCX depuis un CV fonctionnent si le backend et FastAPI tournent.

---

### Lancement avec Docker (n8n inclus)

Le moyen le plus simple de lancer l'application complète (frontend, backend, FastAPI, n8n) :

```bash
# À la racine du projet
cp .env.example .env
# Éditer .env : AI_API_KEY (Gemini), VITE_SUPABASE_*, OPENAI_API_KEY si besoin

docker compose up --build -d
```

**URLs :**
- **Frontend** : http://localhost:8080
- **Backend API** : http://localhost:4000
- **n8n** : http://localhost:5678
- **FastAPI (CV2DOC)** : exposé en interne sur le réseau Docker (port 8000)

**Pour que « Générer depuis CV » fonctionne avec n8n :**

1. **Activer le webhook n8n dans le `.env`** (pour Docker, le backend doit appeler n8n) :
   ```bash
   N8N_WEBHOOK_URL_DOCX=http://fortil-n8n:5678/webhook/cv2doc-docx
   ```
   Puis redémarrer le backend : `docker compose restart backend`

2. **Configurer n8n**  
   - Ouvrir http://localhost:5678 (n8n).  
   - Importer le workflow : **Settings** (engrenage) → **Import from File** → choisir  
     `CV2DOC-n8n-flow-main/n8n_workflows/CV2DOC-webhook-docx (trigger depuis app FORTIL).json`  
   - Dans le nœud **HTTP Request**, vérifier que l’URL est :  
     **`http://fastapi-app:8000/process_cv/`** (avec le `/process_cv/` à la fin).  
   - **Activer** le workflow (toggle **Active** en haut à droite) et **Sauvegarder**.

3. Depuis l’app (http://localhost:8080), sur la fiche d’un candidat, cliquer sur **« Générer depuis CV »**, choisir un PDF : le flux passe par n8n → FastAPI → DOCX téléchargé et enregistré en BDD.

**Sans n8n (backend appelle FastAPI directement)**  
Dans le `.env`, commenter ou vider `N8N_WEBHOOK_URL_DOCX`, puis `docker compose restart backend`. La génération DOCX ira directement à FastAPI sans passer par n8n.

## 📚 Documentation complète

Pour une documentation détaillée de l’ensemble du projet (backend, CV2DOC, template, dépannage), consultez **[DOCUMENTATION.md](./DOCUMENTATION.md)**.

## 📂 Structure du Projet

```text
├── backend/               # Serveur API Node.js & SQLite
├── src/                   # Source Frontend (React + Vite)
├── public/                # Assets statiques
├── CV2DOC-n8n-flow-main/  # Module de traitement CV (n8n/Python)
├── docker-compose.yml     # Orchestration globale
└── profiles.db            # Base de données locale (SQLite)
```

## 📚 Documentation

Une documentation détaillée du projet est disponible dans **[DOCUMENTATION.md](./DOCUMENTATION.md)**. Elle regroupe :

- **Backend** : API, base de données, routes → `backend/README.md`
- **CV2DOC** : extraction IA, template DOCX, n8n → `CV2DOC-n8n-flow-main/DOCUMENTATION-CV2DOC.md`
- **Authentification** : Azure AD, Supabase → `INDEX_AUTH.md`, `AUTHENTIFICATION_MICROSOFT.md`

## 🔒 Authentification
L'authentification est gérée par **Supabase** avec le fournisseur **Azure AD** (Microsoft). 
Pour plus de détails sur la configuration, consultez le fichier `AUTHENTIFICATION_MICROSOFT.md`.

## 📚 Documentation complète
Voir **[DOCUMENTATION.md](./DOCUMENTATION.md)** pour l’index de toute la documentation du projet (backend, CV2DOC, authentification, etc.).

## 📄 Licence
Propriété de FORTIL.
