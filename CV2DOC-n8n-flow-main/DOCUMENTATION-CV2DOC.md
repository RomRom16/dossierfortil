# Documentation CV2DOC

Cette documentation décrit l’ensemble du sous-projet **CV2DOC** : package Python, API FastAPI, workflows n8n et intégration avec l’application FORTIL.

---

## 1. Vue d’ensemble

**Objectif** : à partir d’un CV au format **PDF**, produire un **Dossier de compétences** au format **DOCX** en s’appuyant sur une analyse IA (Gemini) et un modèle de document (template Word avec Jinja2).

**Flux global** :

```
Utilisateur (PDF) → n8n ou FastAPI → cv2doc → Gemini → JSON structuré → template.docx → DOCX
```

- **Sans n8n** : le backend FORTIL envoie le PDF directement à l’API FastAPI (`/process_cv/`).
- **Avec n8n** : le backend envoie le PDF au webhook n8n, qui appelle FastAPI puis renvoie le DOCX.

---

## 2. Architecture

| Composant | Rôle |
|-----------|------|
| **Package `cv2doc`** | PDF → images → analyse IA (Gemini) → JSON → DOCX via template |
| **Endpoint FastAPI** | Expose `POST /process_cv/` et `POST /extract_json/` ; utilisé par n8n ou par le backend FORTIL |
| **n8n** | Orchestration : formulaire standalone ou webhook déclenché par l’app FORTIL |
| **Backend FORTIL** | Route `POST /api/process-cv-docx` : envoie le PDF à n8n ou FastAPI, enregistre le DOCX en BDD et sur disque, renvoie le fichier |

---

## 3. Structure des dossiers

```
CV2DOC-n8n-flow-main/
├── cv2doc/                          # Package Python
│   ├── src/cv2doc/
│   │   ├── main.py                  # Point d’entrée : run_processing(cv_path)
│   │   ├── settings.py               # Chargement .env (clé API, chemins)
│   │   ├── analyse_cv/
│   │   │   ├── ai_analyzing.py      # Appel Gemini + structured output (CVSchema)
│   │   │   ├── models.py            # Modèles Pydantic (CVSchema, Expertise, etc.)
│   │   │   └── prompt.md            # Prompt d’analyse du CV
│   │   ├── helpers/
│   │   │   └── pdf_rendering.py     # pdf2imgs() : PDF → images base64 (PyMuPDF)
│   │   └── json2doc/
│   │       ├── json_rendering.py    # render_json2doc() : JSON + template → DOCX
│   │       └── template.docx        # Modèle Word (Jinja2)
│   ├── pyproject.toml
│   └── README.md
├── endpoint/                        # API FastAPI
│   ├── main.py                      # Routes /process_cv/, /extract_json/
│   ├── .env / .env.template         # AI_API_KEY, chemins (prompt, template, sorties)
│   └── (réutilise le package cv2doc installé)
├── n8n_workflows/
│   ├── CV2DOC-webhook-docx (trigger depuis app FORTIL).json   # Webhook pour « Générer depuis CV »
│   └── CV.pdf → Dossier_de_compétences.docx  (fastAPI flow).json  # Formulaire standalone
├── README.md                        # Instructions n8n, Docker, dépannage
└── DOCUMENTATION-CV2DOC.md          # Ce fichier
```

---

## 4. Flux de traitement détaillé (cv2doc)

1. **Entrée** : chemin vers un fichier PDF (CV).
2. **PDF → images** : `pdf2imgs()` (PyMuPDF) convertit chaque page en image JPEG (base64, format attendu par l’API Gemini).
3. **Analyse IA** : `analyze_img()` envoie les images à Gemini avec le prompt `prompt.md` et le schéma structuré `CVSchema` ; retour d’une instance Pydantic.
4. **JSON** : le modèle est sérialisé en JSON (avec alias) et sauvegardé dans `json_output_dir` (optionnel, selon settings).
5. **DOCX** : `render_json2doc()` charge le JSON et le template Word, applique les variables Jinja2, enregistre le DOCX dans `results_dir`.
6. **Sortie** : chemin du fichier `.docx` généré.

---

## 5. Package cv2doc

### 5.1 `main.py` — `run_processing(cv_path) -> Path`

- Charge les settings (`.env`).
- Appelle `pdf2imgs(cv_path)` → liste d’images base64.
- Appelle `analyze_img(image_data, settings)` → instance `CVSchema`.
- Écrit le JSON dans `json_output_dir` (nom dérivé du nom du CV).
- Appelle `render_json2doc(template_path, output_path, json_path)`.
- Retourne le `Path` du DOCX généré.

### 5.2 `settings.py` — `CV2DOCSettings`

Variables lues depuis `.env` (voir `.env.template`) :

| Variable | Description |
|----------|-------------|
| `AI_API_KEY` | Clé API Google (Gemini), type SecretStr |
| `PROMPT_PATH` | Chemin vers le fichier de prompt (ex. `prompt.md`) |
| `DOX_TEMPLATE_PATH` | Chemin vers `template.docx` |
| `JSON_OUTPUT_DIR` | Dossier de sortie des JSON intermédiaires |
| `RESULTS_DIR` | Dossier de sortie des DOCX |

### 5.3 `analyse_cv/ai_analyzing.py`

- Utilise **LangChain** avec `ChatGoogleGenerativeAI` (modèle `gemini-2.5-flash-lite`).
- `llm.with_structured_output(schema=CVSchema)` pour obtenir une sortie typée.
- Construit un message avec `SystemMessage` (prompt formaté avec la date du jour) et `HumanMessage` (images en `image_url`).
- Retourne une instance de `CVSchema`.

### 5.4 `analyse_cv/models.py` — Schéma de sortie

Modèles Pydantic avec **alias** pour le JSON (noms français) :

- **CVSchema** : `full_name` (alias `nom`), `phone_e164` (`téléphone`), `primary_industry` (`secteur_d_activité`), listes `expertises`, `savoir_etre`, `languages`, `experiences`.
- **Expertise** : titre, liste à puces de compétences, niveau (Junior / Autonome / Expert).
- **SavoirEtre** : compétences comportementales (texte court).
- **Language** : nom de langue, niveau (Novice / Intermédiaire / Courant / Maternelle).
- **Experience** : début, fin, société, secteur, programme, poste, objectif, activités, environnement technique, expertises mobilisées.

Ces champs alimentent le template DOCX ; les alias définissent les clés du JSON.

### 5.5 `analyse_cv/prompt.md`

- Règles d’extraction : uniquement les informations **explicitement présentes** dans le CV ; sinon « INFO NON DISPONIBLE » ou « INFO NON DÉTAILLÉE ».
- Ordre : analyser d’abord l’expérience professionnelle, puis déduire les niveaux d’expertise.
- Séparation **savoir-faire** (techniques) / **savoir-être** (comportementaux).
- Règles pour les langues : niveaux déduits du texte ou des indicateurs graphiques (barres de progression), avec plages de pourcentages (Novice / Intermédiaire / Courant / Maternelle).
- Variable `{date}` injectée (date du jour) pour les durées « en cours ».

### 5.6 `helpers/pdf_rendering.py` — `pdf2imgs(pdf_path, zoom=2.0)`

- Ouvre le PDF avec PyMuPDF (`fitz`).
- Pour chaque page : mise à l’échelle, rendu en pixmap, export JPEG, encodage base64.
- Retourne une liste de chaînes `data:image/jpeg;base64,...` pour l’API Gemini.

### 5.7 `json2doc/json_rendering.py` — `render_json2doc(template_path, output_path, json_path)`

- Charge le template avec **docxtpl** (`DocxTemplate`).
- Charge le JSON depuis `json_path`.
- `tpl.render(data)` remplit les balises Jinja2 du `.docx` avec les clés du JSON (alias du schéma).
- Sauvegarde le DOCX dans `output_path`.

### 5.8 Template DOCX

- Fichier Word (`.docx`) contenant des balises **Jinja2** (ex. `{{ nom }}`, boucles sur `expertises`, `expériences`, etc.).
- Les noms des variables doivent correspondre aux **alias** des champs Pydantic (ou aux clés du JSON produit par l’IA).
- Voir la [doc docxtpl](https://docxtpl.readthedocs.io/) pour les boucles et la mise en forme.

---

## 6. Endpoint FastAPI (`endpoint/main.py`)

### 6.1 Routes

| Méthode | Chemin | Description |
|---------|--------|-------------|
| GET | `/` | Health check simple (`{"Hello": "World"}`). |
| POST | `/process_cv/` | Corps : multipart/form-data, champ `cv` = fichier PDF. Lance `run_processing()`, retourne le DOCX en binaire (`FileResponse`). |
| POST | `/extract_json/` | Même entrée PDF. Appelle `pdf2imgs` + `analyze_img` uniquement, retourne le JSON (pas de génération DOCX). |

### 6.2 Gestion des erreurs

- **415** : type de contenu autre que PDF.
- **503** : erreur Gemini (quota dépassé, etc.) ; corps JSON avec `error` et éventuellement `message` explicatif (quota épuisé).

### 6.3 Variables d’environnement (endpoint)

À définir dans `endpoint/.env` (voir `endpoint/.env.template`) :

- `AI_API_KEY` : clé Gemini.
- `PROMPT_PATH`, `DOX_TEMPLATE_PATH` : chemins vers `prompt.md` et `template.docx` (relatifs au contexte d’exécution, ex. `../cv2doc/...` en dev).
- `JSON_OUTPUT_DIR`, `RESULTS_DIR` : répertoires de sortie pour JSON et DOCX.

Le package `cv2doc` lit son `.env` (ou celui du projet) ; l’endpoint doit s’exécuter avec un répertoire de travail et des chemins cohérents (ou définir les mêmes variables).

---

## 7. Workflows n8n

### 7.1 Webhook pour l’app FORTIL — « Générer depuis CV »

**Fichier** : `n8n_workflows/CV2DOC-webhook-docx (trigger depuis app FORTIL).json`

- **Trigger** : Webhook POST, path **`cv2doc-docx`**.
- **Corps** : formulaire multipart, propriété binaire nommée `cv` (fichier PDF).
- **Nœud suivant** : HTTP Request POST vers **`http://fastapi-app:8000/process_cv/`** (en Docker), en passant le binaire `cv` en `multipart-form-data`.
- **Réponse** : nœud « Respond to Webhook » renvoie le binaire reçu (DOCX).

**Points importants** :

- Le workflow doit être **actif** pour que l’URL de **production** soit enregistrée : `/webhook/cv2doc-docx` (pas `/webhook-test/...`).
- L’URL appelée par le backend FORTIL doit être celle de production (ex. `http://fortil-n8n:5678/webhook/cv2doc-docx` en Docker).

### 7.2 Formulaire standalone — CV → Dossier de compétences

**Fichier** : `n8n_workflows/CV.pdf → Dossier_de_compétences.docx  (fastAPI flow).json`

- **Trigger** : Form Trigger (formulaire avec champ fichier « PDF »).
- **Flux** : envoi du fichier à `http://fastapi-app:8000/process_cv/` (même logique que le webhook), puis nœud Form pour afficher un message de complétion et proposer le téléchargement du DOCX.

Utilisation : ouvrir l’URL du formulaire (GET) dans le navigateur, uploader un PDF, récupérer le DOCX.

---

## 8. Intégration avec le backend FORTIL

### 8.1 Route backend

- **Route** : `POST /api/process-cv-docx`
- **Auth** : `authMiddleware` (utilisateur connecté).
- **Corps** : `multipart/form-data` avec champ `cv` (fichier PDF).
- **Query ou body** : `candidate_id` (obligatoire).

Le backend vérifie que le candidat existe et que l’utilisateur a le droit d’y accéder (admin ou manager du candidat).

### 8.2 Choix de l’URL cible

- Si **`N8N_WEBHOOK_URL_DOCX`** est défini dans l’environnement du backend → envoi du PDF au **webhook n8n** (ex. `http://fortil-n8n:5678/webhook/cv2doc-docx`).
- Sinon → envoi direct à l’API FastAPI : **`FASTAPI_URL`** ou `http://localhost:8000`, chemin **`/process_cv/`**.

### 8.3 Après réception du DOCX

- Le backend reçoit le binaire DOCX, enregistre le fichier dans `uploads/documents/<candidate_id>/<uuid>.docx`.
- Insertion en BDD dans `candidate_documents` (id, candidate_id, filename, file_path, created_at).
- Réponse HTTP : fichier DOCX en téléchargement + enregistrement côté app (liste des dossiers du candidat, etc.).

### 8.4 Gestion des erreurs

- Si n8n renvoie 404 (webhook non enregistré) ou message du type « not registered », le backend renvoie un message explicite invitant à activer le workflow « CV2DOC Webhook DOCX » et à utiliser l’URL de production.
- Erreurs Gemini (quota, 503) remontées avec un message lisible pour l’utilisateur.

---

## 9. Configuration et déploiement

### 9.1 Sans Docker (local)

- **Backend FORTIL** : ne pas définir `N8N_WEBHOOK_URL_DOCX` ; le backend appellera `http://localhost:8000/process_cv/` (ou `FASTAPI_URL` si défini).
- **FastAPI** : lancer l’endpoint depuis `CV2DOC-n8n-flow-main/endpoint/` avec un `.env` contenant `AI_API_KEY` et les chemins vers prompt, template et dossiers de sortie (adapter selon l’emplacement du package `cv2doc`).
- **Frontend** : optionnel `VITE_N8N_URL` pour le lien « Ouvrir n8n » en cas d’erreur (par défaut déduit de l’API ou `http://localhost:5678`).

### 9.2 Avec Docker (n8n inclus)

- Définir **`N8N_WEBHOOK_URL_DOCX=http://fortil-n8n:5678/webhook/cv2doc-docx`** dans le `.env` du backend (ou des variables d’environnement du conteneur).
- Importer le workflow **CV2DOC-webhook-docx (trigger depuis app FORTIL)** dans n8n, **activer** le workflow, sauvegarder.
- Le nœud HTTP Request du workflow doit pointer vers **`http://fastapi-app:8000/process_cv/`** (nom du service FastAPI dans le même réseau Docker).

### 9.3 Dépendances principales (cv2doc)

- Python ≥ 3.13
- **uv** (gestion du projet)
- **LangChain** + **langchain-google-genai** (Gemini)
- **Pydantic** / **pydantic-settings**
- **docxtpl**, **python-docx**, **Jinja2**
- **PyMuPDF** (fitz) pour le rendu PDF → images

---

## 10. Dépannage rapide

| Problème | Piste de résolution |
|----------|----------------------|
| « Webhook not registered » (404) | Activer le workflow n8n (toggle Actif), utiliser l’URL de **production** `/webhook/cv2doc-docx`. |
| 405 Method Not Allowed sur FastAPI | Vérifier que le nœud HTTP Request n8n appelle bien **`http://fastapi-app:8000/process_cv/`** (avec le slash final si attendu). |
| Quota Gemini (429 / 503) | Nouvelle clé sur aistudio.google.com ou attendre le reset ; message explicite renvoyé par FastAPI et affiché dans l’app. |
| Formulaire n8n « Method not allowed » | Activer le workflow (GET + POST enregistrés) ; utiliser l’URL du Form Trigger, pas une URL générique. |

Pour plus de détails (formulaire, proxy, etc.), voir le **README.md** à la racine de `CV2DOC-n8n-flow-main`.

---

## 11. Résumé des fichiers clés

| Fichier | Rôle |
|---------|------|
| `cv2doc/src/cv2doc/main.py` | Orchestration : PDF → images → IA → JSON → DOCX |
| `cv2doc/src/cv2doc/analyse_cv/ai_analyzing.py` | Appel Gemini avec CVSchema |
| `cv2doc/src/cv2doc/analyse_cv/models.py` | Schéma Pydantic (alias JSON français) |
| `cv2doc/src/cv2doc/analyse_cv/prompt.md` | Règles d’extraction et niveau des langues |
| `cv2doc/src/cv2doc/helpers/pdf_rendering.py` | PDF → images base64 |
| `cv2doc/src/cv2doc/json2doc/json_rendering.py` | JSON + template → DOCX |
| `cv2doc/src/cv2doc/json2doc/template.docx` | Modèle Word (Jinja2) |
| `endpoint/main.py` | API FastAPI : `/process_cv/`, `/extract_json/` |
| `n8n_workflows/CV2DOC-webhook-docx (trigger depuis app FORTIL).json` | Webhook pour « Générer depuis CV » |
| Backend FORTIL `index.mjs` | Route `/api/process-cv-docx`, envoi n8n ou FastAPI, enregistrement DOCX |

Cette documentation couvre l’ensemble de la chaîne CV2DOC du PDF au DOCX et de son intégration dans FORTIL.
