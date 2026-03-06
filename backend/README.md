# Backend FORTIL

API Node.js (Express) pour la plateforme FORTIL : gestion des candidats, dossiers de compétences, authentification et génération de documents.

## Prérequis

- Node.js 20+
- Base SQLite (`profiles.db` créée automatiquement au démarrage)

## Installation

```bash
cd backend
npm install
```

## Démarrage

```bash
npm start
# ou depuis la racine : npm run dev:backend
```

API disponible sur **http://localhost:4000** (ou `PORT` défini dans `.env`).

## Variables d'environnement

| Variable | Description |
|----------|-------------|
| `PORT` | Port du serveur (défaut : 4000) |
| `OPENAI_API_KEY` | Clé OpenAI (parsing CV texte) |
| `AI_API_KEY` | Clé Gemini (CV2DOC, si utilisé) |
| `FASTAPI_URL` | URL de l'API FastAPI (défaut : http://localhost:8000) |
| `N8N_WEBHOOK_URL_DOCX` | URL du webhook n8n pour génération DOCX (optionnel) |

Le backend charge le `.env` à la racine du projet.

## Base de données (SQLite)

### Tables principales

| Table | Description |
|-------|-------------|
| `users` | Utilisateurs (id, email, full_name) |
| `user_roles` | Rôles : admin, business_manager, consultant |
| `candidates` | Candidats (manager_id, full_name, email, phone) |
| `profiles` | Dossiers de compétences (liés à un candidat) |
| `general_expertises` | Expertises d'un profil |
| `tools` | Outils par profil |
| `experiences` | Expériences professionnelles |
| `educations` | Formations / diplômes |
| `candidate_documents` | DOCX générés (liés au candidat) |

### Stockage des fichiers

- **Uploads** : `uploads/` (CV, fichiers temporaires)
- **Documents générés** : `uploads/documents/<candidate_id>/<uuid>.docx`

## Routes API

### Santé

| Méthode | Route | Description |
|---------|-------|-------------|
| GET | `/api/health` | Health check |

### Authentification (Supabase)

| Méthode | Route | Description |
|---------|-------|-------------|
| POST | `/api/auth/signup` | Inscription (création user + rôle) |
| POST | `/api/auth/signin` | Connexion (vérification rôles) |
| GET | `/api/me` | Utilisateur connecté (auth requise) |
| GET | `/api/me/candidate` | Profil candidat si consultant |

### Administration

| Méthode | Route | Description |
|---------|-------|-------------|
| GET | `/api/admin/users` | Liste des utilisateurs (admin) |
| POST | `/api/admin/users/:id/roles` | Attribuer des rôles (admin) |

### Candidats

| Méthode | Route | Description |
|---------|-------|-------------|
| GET | `/api/candidates` | Liste des candidats (filtrée par rôle) |
| POST | `/api/candidates` | Créer un candidat |
| GET | `/api/candidates/:id` | Détail d'un candidat |
| PUT | `/api/candidates/:id` | Modifier un candidat |
| DELETE | `/api/candidates/:id` | Supprimer un candidat |
| GET | `/api/candidates/:id/documents` | Liste des DOCX du candidat |

### Dossiers (profiles)

| Méthode | Route | Description |
|---------|-------|-------------|
| POST | `/api/profiles` | Créer un dossier |
| GET | `/api/profiles` | Liste des dossiers |
| GET | `/api/profiles/:id` | Détail d'un dossier |
| DELETE | `/api/profiles/:id` | Supprimer un dossier |

### Génération DOCX

| Méthode | Route | Description |
|---------|-------|-------------|
| POST | `/api/process-cv-docx` | Générer un DOCX depuis un CV PDF (query: `candidate_id`) |

Envoie le PDF à n8n (si `N8N_WEBHOOK_URL_DOCX` défini) ou à FastAPI directement. Enregistre le DOCX en BDD et sur disque, renvoie le fichier.

### Autres

| Méthode | Route | Description |
|---------|-------|-------------|
| POST | `/api/parse-cv` | Parser un CV (OpenAI, extraction texte) |
| POST | `/api/parse-cv-gemini` | Parser un CV (Gemini, extraction JSON) |
| GET | `/api/documents/:id` | Télécharger un document par ID |

## Scripts utilitaires

- `scripts/set-role.mjs` : Attribuer un rôle à un utilisateur
- `scripts/set_admin.mjs` : Créer ou promouvoir un admin

## Voir aussi

- [DOCUMENTATION-CV2DOC.md](../CV2DOC-n8n-flow-main/DOCUMENTATION-CV2DOC.md) — Intégration CV2DOC / génération DOCX
- [README principal](../README.md) — Installation et lancement global
