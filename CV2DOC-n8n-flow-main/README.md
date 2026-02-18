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


## Execute the Flow

1. Press "Execute the Flow" button
2. Upload a CV in **PDF format**.
3. The workflow returns a generated document based on the template.

---

## Direct Package Usage

If you want to use `cv2doc` without n8n, refer to its dedicated [README](./cv2doc/README.md)
