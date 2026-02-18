# CV2DOC
[English](./README.md) | [Français (Traduit à l’aide de l’IA)](./README.fr.md)
___

**CV.pdf → Dossier_de_compétences.docx**

This is a small package designed to analyze CVs in PDF format and extract the information needed to create a “dossier de compétences” in DOCX format.

In the src folder, you will find the cv2doc package. It is built so it can be easily integrated into another project or used as a script in an automation flow.

The main.py file is intended for testing cv2doc from the command line. After setting up the project, run: `uv run python main.py [ args ]`
Pass a PDF CV file as an argument, or a folder containing multiple PDF CVs if you want to process several CVs at once.

### Tech stack

* Python **3.13**
* Dependency / project management: **uv**
* LLM orchestration: **LangChain**
* Output validation: **Pydantic**
* DOCX generation: **docxtpl**
* Cross-platform execution: **Docker**

### Repository structure

```shell
.
├── CVs
│   └── CV_1.pdf                   # Example dir for testing
├── Dockerfile
├── JSON_outputs                   
│   └── CV_1.json                  # AI output (created during the process)
├── README.fr.md
├── README.md
├── main.py                        # CLI entry point (for testing)
├── pyproject.toml
├── results
│   └── CV_1.docx                  # Final output (created during the process)
├── src
│   └── cv2doc                     # Main package
│       ├── analyse_cv
│       │   ├── ai_analyzing.py
│       │   ├── models.py
│       │   └── prompt.md
│       ├── helpers
│       │   └── pdf_rendering.py
│       ├── json2doc
│       │   ├── json_rendering.py
│       │   └── template.docx      # Template for final output
│       ├── main.py                # Main module
│       └── settings.py
└── uv.lock
```

### Outputs
The output files that will be generated during the process:

* Output DOCX: `./results/<CV name>.docx`
* Intermediate JSON: `./JSON_outputs/<CV name>.json`

> Their path must be specified in the `.env` file

## ENVIRONMENT

The CV2DOC module uses `.env` file to configure file paths required for the app to work, and secret key for using the LLM.

These environment variables are loaded in `src/cv2doc/settings.py`. To set up your environment, create a `.env` file based on `.env.template`. The template already contains the required variables and default output paths.

>Edit these paths carefully and only if you understand what they affect. Do not commit .env (ensure it is in .gitignore)

## Run via Docker

Build the image:

```shell
docker build -t cv2doc .
```

Run a container shell with your project mounted into /app:

```shell
docker run --rm -it --env-file .env --mount type=bind,source="$(pwd)",target=/app cv2doc sh
```

**Inside the container:**

To run the script:
```shell
uv run python main.py [args]
```
Example: ```uv run python main.py CVs/CV_1.pdf```

## CV processing, step by step:

1. The `run_processing()` function takes a path to a CV file. The file is expected to be in PDF format.

2. The PDF is converted into images using `pdf2imgs()` so that any graphical elements in the CV are included in the analysis.

3. Each image is analyzed by `analyze_img()`, which receives the image and settings (variables loaded from the .env file; see [ENVIRONMENT settings](#environment)). Inside this function, LangChain is used to connect to Gemini. Then, for each chain, the pipeline sets the expected AI response structure via CVSchema, sets the prompt, and runs the LLM image analysis according to the prompt task.

4. As a result, the system produces a BaseModel (Pydantic) instance, which is then serialized to JSON, saved to a file as the LLM output, and passed to `render_json2doc()` to generate a document based on `template.docx`.

The output document name matches the original CV filename passed into the initial function. If a document with the same name already exists, it will be overwritten.
*(The same applies to intermediate JSON files)*

### Template docx
The document template contains Jinja2 tags, for example: ```{{ var }}```. See the [docxtpl documentation](https://docxtpl.readthedocs.io/) to better understand how loops work inside a `.docx` template.

These tags must match the keys in the JSON produced by the AI analysis. This JSON is already validated using Pydantic models (`CVSchema`).

### Pydantic models
[Pydantic](https://pypi.org/project/pydantic/) is a library that helps with data validation and is also used in [LangChain](https://docs.langchain.com/oss/python/langchain/models#pydantic). In CV2DOC, Pydantic models provide automatic validation for the structure of the AI analysis output. At the same time, the `description` and `examples` field properties let you add clarifying information for each field.

How the field properties work:

* `alias`: the string used as the key in the JSON output
* `description`: an explanation of what the field means
* `examples`: examples of what is expected in this field

>Use these properties only when you need to control the output data. They should not be used as a prompt for analyzing the input content. They should describe the expected output format after the analysis.

### GEMINI key

Image analysis here uses the [Google GenAI](https://docs.langchain.com/oss/python/integrations/providers/google) chat model, which requires an [API key from Google AI Studio](https://ai.google.dev/gemini-api/docs/api-key).

If you need to switch to a different model, use a different chat model class. 

For example, replace this part of the code:
```Python
from langchain_google_genai import ChatGoogleGenerativeAI

llm = ChatGoogleGenerativeAI(
        model="gemini-3-flash-preview", 
        temperature=0,
        api_key=settings.ai_api_key.get_secret_value()
    )
```
with this one:
```Python
from langchain_openai import ChatOpenAI

llm = ChatOpenAI(
    model="gpt-5-nano",
    temperature=0,
    api_key=settings.ai_api_key.get_secret_value() # after updating the .env key
)
```

**[This section lists all available options, with documentation for each model.](https://docs.langchain.com/oss/python/integrations/chat)**
