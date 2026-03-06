# 📚 Documentation FORTIL

Index central de la documentation du projet.

---

## 🎯 Par où commencer ?

| Profil | Document | Description |
|--------|----------|-------------|
| **Nouveau sur le projet** | [README.md](README.md) | Vue d'ensemble, installation, lancement |
| **Configuration locale** | [README.md#lancement-en-local](README.md) | 3 terminaux : backend, FastAPI, frontend |
| **Déploiement Docker** | [README.md#lancement-avec-docker](README.md) | Docker Compose, n8n, webhook |
| **Authentification** | [INDEX_AUTH.md](INDEX_AUTH.md) | Auth Microsoft, Supabase, Azure AD |
| **Génération DOCX (CV2DOC)** | [CV2DOC-n8n-flow-main/DOCUMENTATION-CV2DOC.md](CV2DOC-n8n-flow-main/DOCUMENTATION-CV2DOC.md) | Pipeline PDF → DOCX, IA, template |

---

## 📂 Structure de la documentation

### Projet principal

| Fichier | Contenu |
|---------|---------|
| [README.md](README.md) | Installation, lancement local/Docker, structure, auth |
| [.env.example](.env.example) | Variables d'environnement (template) |
| [INDEX_AUTH.md](INDEX_AUTH.md) | Index de la doc authentification Microsoft |
| [INSTALLATION_COMPLETE.md](INSTALLATION_COMPLETE.md) | Checklist post-installation auth |

### Backend

| Fichier | Contenu |
|---------|---------|
| [backend/README.md](backend/README.md) | API Express, routes, base SQLite, variables |

### CV2DOC (génération de dossiers)

| Fichier | Contenu |
|---------|---------|
| [CV2DOC-n8n-flow-main/DOCUMENTATION-CV2DOC.md](CV2DOC-n8n-flow-main/DOCUMENTATION-CV2DOC.md) | Documentation complète du pipeline CV2DOC |
| [CV2DOC-n8n-flow-main/README.md](CV2DOC-n8n-flow-main/README.md) | Instructions n8n, workflows, dépannage |
| [CV2DOC-n8n-flow-main/cv2doc/README.md](CV2DOC-n8n-flow-main/cv2doc/README.md) | Package Python cv2doc (EN) |
| [CV2DOC-n8n-flow-main/cv2doc/README.fr.md](CV2DOC-n8n-flow-main/cv2doc/README.fr.md) | Package Python cv2doc (FR) |

### Authentification (références INDEX_AUTH)

- `QUICK_START.md` — Démarrage rapide (5 min)
- `AUTHENTIFICATION_MICROSOFT.md` — Config Azure & Supabase
- `README_AUTH.md` — Guide complet auth
- `EXEMPLES_AUTH.md` — Exemples de code
- `ARCHITECTURE.md` — Architecture auth

---

## 🏗️ Architecture globale

```
┌─────────────┐     ┌─────────────┐     ┌─────────────┐
│  Frontend   │────▶│   Backend   │────▶│   SQLite    │
│  (React)    │     │  (Express)  │     │  profiles   │
│  :5173/8080 │     │   :4000     │     │    .db      │
└─────────────┘     └──────┬──────┘     └─────────────┘
                           │
              ┌────────────┼────────────┐
              │            │            │
              ▼            ▼            ▼
       ┌──────────┐  ┌──────────┐  ┌──────────┐
       │   n8n    │  │ FastAPI  │  │  OpenAI  │
       │  (webhook)│  │ (CV2DOC)│  │  (parse) │
       │  :5678   │  │  :8000   │  │          │
       └──────────┘  └──────────┘  └──────────┘
```

---

## 🔧 Points clés

### Génération DOCX (« Générer depuis CV »)

- **Sans n8n** : Backend → FastAPI (`/process_cv/`) directement
- **Avec n8n** : Backend → Webhook n8n → FastAPI → DOCX
- Template : `CV2DOC-n8n-flow-main/cv2doc/src/cv2doc/json2doc/template.docx`
- Variables : `{{ nom }}`, `{{ contexte }}`, `{%p for d in diplômes%}`, etc.

### Rôles

- **admin** : Accès complet, gestion des utilisateurs
- **business_manager** : Gestion des candidats et dossiers
- **consultant** : Accès à son propre profil candidat

---

## 📞 Dépannage

| Problème | Voir |
|----------|-----|
| Webhook n8n non enregistré | [DOCUMENTATION-CV2DOC.md § 10](CV2DOC-n8n-flow-main/DOCUMENTATION-CV2DOC.md) |
| Quota Gemini épuisé | Message explicite dans l'app ; nouvelle clé sur aistudio.google.com |
| Erreur auth Microsoft | [INDEX_AUTH.md](INDEX_AUTH.md) → AUTHENTIFICATION_MICROSOFT.md |
| Template DOCX vide (contexte, diplômes) | Réinstaller cv2doc : `cd endpoint && uv sync --reinstall-package cv2doc` |

---

*Dernière mise à jour : février 2025*
