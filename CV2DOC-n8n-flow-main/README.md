# CV2DOC n8n flow

### This repository contains:

* [**`cv2doc` package**](./cv2doc/) — a simple Python package that:

  * accepts a path to a CV in **PDF format**
  * sends it to an AI service for analysis
  * generates a structured document based on a predefined template

* [**API endpoint**](./endpoint/) — accepts a file upload and forwards it to `cv2doc`.

The endpoint is designed to run alongside **n8n** in Docker and act as a node inside an n8n workflow.

**User → n8n Flow → Custom Endpoint → `cv2doc` → AI → Generated Document → user**


## Running the Project

Create a `.env` file based on the provided template:

```bash
cp .env.template .env
```

Obtain a [Google API](https://ai.google.dev/gemini-api/docs/api-key?authuser=2&hl=fr) key and place it in the `.env` file:

```
AI_API_KEY=your_key_here
```

Run Docker Compose:

```bash
docker compose up -d 
```

Navigate to http://localhost:5678

In the n8n interface, create a new flow. 
Then import a n8n flow from the file: [n8n_workflows/CV.pdf → Dossier_de_compétences.docx  (fastAPI flow).json](./n8n_workflows/CV.pdf%20→%20Dossier_de_compétences.docx%20%20(fastAPI%20flow).json)

**Important:** After importing, **activate** the workflow (toggle **Active** in the top right). The form URL is only available when the workflow is active.

### Déclencher n8n depuis l’app FORTIL (frontend)

Pour que le bouton **« Générer depuis CV »** dans l’app FORTIL déclenche un workflow n8n au lieu d’appeler FastAPI directement :

1. **Importer le workflow webhook**  
   Fichier : [n8n_workflows/CV2DOC-webhook-docx (trigger depuis app FORTIL).json](./n8n_workflows/CV2DOC-webhook-docx%20(trigger%20depuis%20app%20FORTIL).json)  
   Ce workflow expose un webhook `POST` sur le chemin `cv2doc-docx`, reçoit le fichier, appelle FastAPI puis renvoie le DOCX.

2. **Activer le workflow** (toggle **Active**), puis noter l’**URL de production** du nœud « Webhook DOCX » (ex. `http://fortil-n8n:5678/webhook/cv2doc-docx`).

3. **Configurer le backend**  
   Dans le `.env` à la racine du projet (ou dans les variables d’environnement du backend) :
   ```bash
   N8N_WEBHOOK_URL_DOCX=http://fortil-n8n:5678/webhook/cv2doc-docx
   ```
   En Docker, le backend et n8n sont sur le même réseau ; utilisez le nom du conteneur n8n (`fortil-n8n`) et le port interne `5678`.

4. **Redémarrer le backend**  
   À chaque requête « Générer depuis CV » depuis l’app, le backend enverra le PDF au webhook n8n, qui appellera FastAPI et renverra le DOCX.

## Execute the Flow

1. **Use the Form URL**  
   Open the **Production URL** (or **Test URL**) shown in the **On form submission** (Form Trigger) node. Open it in your browser with a normal navigation (GET). Do not call this URL with POST only — the form page is served with GET, and the submission uses POST.
2. Upload a CV in **PDF format**.
3. The workflow returns a generated document based on the template.

## Troubleshooting: "Method not allowed"

If you see **"Method not allowed - please check you are using the right HTTP method"**:

1. **Activate the workflow**  
   The workflow is imported with **Active** off. Turn **Active** on (top right), then save. The Form Trigger registers both GET (to display the form) and POST (to submit). If the workflow is inactive, the form URL may not work or may only accept one method.

2. **Use the correct URL**  
   Use the **Form URL** displayed in the Form Trigger node (Production URL or Test URL). Open it in the browser by pasting the URL in the address bar (GET). Do not use the general n8n URL (`http://localhost:5678`) or an API path that expects only POST.

3. **Reverse proxy**  
   If n8n is behind Nginx or another proxy, ensure the form path allows **GET** and **POST**. Some proxies block GET on webhook paths and cause 405.

## Troubleshooting: requête vers FastAPI sans le bon chemin

Si la requête part vers **`http://fastapi-app:8000`** sans le chemin **`/process_cv/`** (visible dans les logs ou l’exécution n8n), FastAPI reçoit un POST sur `/` qui n’existe qu’en GET → erreur 405 Method Not Allowed.

**À faire :**

1. Ouvrir le workflow dans n8n.
2. Cliquer sur le nœud **HTTP Request**.
3. Vérifier que l’URL est **exactement** :  
   **`http://fastapi-app:8000/process_cv/`**  
   (avec le chemin `/process_cv/` à la fin).
4. Si l’URL affichée est seulement `http://fastapi-app:8000`, ajouter **`/process_cv/`** à la fin.
5. Sauvegarder et réactiver le workflow.

En cas de doute, ré-importer le workflow depuis le fichier [n8n_workflows/CV.pdf → Dossier_de_compétences.docx (fastAPI flow).json](./n8n_workflows/) (l’URL complète y est définie).

---

## Direct Package Usage

If you want to use `cv2doc` without n8n, refer to its dedicated [README](./cv2doc/README.md)
