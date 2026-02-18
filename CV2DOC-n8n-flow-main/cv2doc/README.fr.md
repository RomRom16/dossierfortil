# CV2DOC
[English](./README.md) | [Français (Traduit à l’aide de l’IA)](./README.fr.md)

___

**CV.pdf -> Dossier_de_compétences.docx**

Petit package conçu pour analyser des CV au format PDF et extraire les informations nécessaires à la création d’un « dossier de compétences » au format DOCX.

Dans le dossier `src`, vous trouverez le package `cv2doc`. Il est conçu pour pouvoir être facilement intégré dans un autre projet ou utilisé comme script dans un flux d’automatisation.

Le fichier `main.py` est destiné à tester `cv2doc` en ligne de commande. Après avoir configuré le projet, exécutez : `uv run python main.py [ args ]`
Passez un CV PDF en argument, ou un dossier contenant plusieurs CV PDF si vous souhaitez traiter plusieurs CV à la fois.

### Stack technique

* Python **3.13**
* Gestion du projet / des dépendances : **uv**
* Orchestration LLM : **LangChain**
* Validation de sortie : **Pydantic**
* Génération DOCX : **docxtpl**
* Exécution multiplateforme : **Docker**

### Structure du dépôt

```shell
.
├── CVs
│   └── CV_1.pdf                   # Dossier d’exemple pour les tests
├── Dockerfile
├── JSON_outputs
│   └── CV_1.json                  # Sortie IA (créée pendant le processus)
├── README.fr.md
├── README.md
├── main.py                        # Point d’entrée CLI (pour les tests)
├── pyproject.toml
├── results
│   └── CV_1.docx                  # Sortie finale (créée pendant le processus)
├── src
│   └── cv2doc                     # Package principal
│       ├── analyse_cv
│       │   ├── ai_analyzing.py
│       │   ├── models.py
│       │   └── prompt.md
│       ├── helpers
│       │   └── pdf_rendering.py
│       ├── json2doc
│       │   ├── json_rendering.py
│       │   └── template.docx      # Modèle pour la sortie finale
│       ├── main.py                # Module principal
│       └── settings.py
└── uv.lock
```

### Sorties
Les fichiers de sortie qui seront générés au cours du processus :

* DOCX de sortie : `./results/<nom du CV>.docx`
* JSON intermédiaire : `./JSON_outputs/<nom du CV>.json`

> Leur chemin doit être spécifié dans le fichier `.env`

## ENVIRONNEMENT

Le module CV2DOC utilise un fichier `.env` pour configurer les chemins de fichiers requis au fonctionnement de l’application, ainsi que la clé secrète permettant d’utiliser le LLM.

Ces variables d’environnement sont chargées dans `src/cv2doc/settings.py`. Pour configurer votre environnement, créez un fichier `.env` à partir de `.env.template`. Le template contient déjà les variables requises et les chemins de sortie par défaut.

> Modifiez ces chemins avec précaution et uniquement si vous comprenez ce qu’ils impactent. Ne committez pas le fichier .env (assurez-vous qu’il est dans .gitignore).*

## Exécution via Docker

Construire l’image :

```shell
docker build -t cv2doc .
```

Lancer un shell dans le conteneur avec le projet monté dans /app :

```shell
docker run --rm -it --env-file .env --mount type=bind,source="$(pwd)",target=/app cv2doc sh
```

**À l’intérieur du conteneur :**

Pour exécuter le script :
```shell
uv run python main.py [args]
```

Exemple : `uv run python main.py CVs/CV_1.pdf`

## Traitement d’un CV, étape par étape :

1. La fonction `run_processing()` prend en entrée un chemin vers un fichier CV. Le fichier est censé être au format PDF.

2. Le PDF est converti en images via `pdf2imgs()` afin que tous les éléments graphiques du CV soient inclus dans l’analyse.

3. Chaque image est analysée par `analyze_img()`, qui reçoit l’image et la configuration (variables chargées depuis le fichier `.env` ; voir [paramètres ENVIRONNEMENT](#environment)). Dans cette fonction, LangChain est utilisé pour se connecter à Gemini. Ensuite, pour chaque chaîne, le pipeline définit la structure attendue de la réponse IA via `CVSchema`, définit le prompt, puis exécute l’analyse d’image par le LLM selon la tâche du prompt.

4. En sortie, le système produit une instance de `BaseModel` (Pydantic), qui est ensuite sérialisée en JSON, enregistrée dans un fichier comme sortie du LLM, puis transmise à `render_json2doc()` pour générer un document à partir de `template.docx`.

Le nom du document de sortie correspond au nom du fichier CV d’origine passé à la fonction initiale. Si un document portant le même nom existe déjà, il sera écrasé. *(De même pour les fichiers JSON intermédiaires.)*

### Modèle DOCX

Le modèle de document contient des tags Jinja2, par exemple : `{{ var }}`. Consultez la [documentation docxtpl](https://docxtpl.readthedocs.io/) pour mieux comprendre comment fonctionnent les boucles dans un modèle `.docx`.

Ces tags doivent correspondre aux clés du JSON produit par l’analyse IA. Ce JSON est déjà validé à l’aide de modèles Pydantic (`CVSchema`).

### Modèles Pydantic

[Pydantic](https://pypi.org/project/pydantic/) est une bibliothèque qui aide à la validation de données et qui est également utilisée dans [LangChain](https://docs.langchain.com/oss/python/langchain/models#pydantic). Dans CV2DOC, les modèles Pydantic fournissent une validation automatique de la structure de la sortie de l’analyse IA. Par ailleurs, les propriétés de champ `description` et `examples` permettent d’ajouter des informations de clarification pour chaque champ.

Fonctionnement des propriétés de champ :

* `alias` : la chaîne utilisée comme clé dans la sortie JSON
* `description` : une explication de la signification du champ
* `examples` : des exemples de ce qui est attendu dans ce champ

> Utilisez ces propriétés uniquement lorsque vous devez contrôler les données de sortie. Elles ne doivent pas être utilisées comme prompt pour analyser le contenu en entrée. Elles doivent décrire le format de sortie attendu après l’analyse.*

### Clé GEMINI

L’analyse d’images utilise ici le modèle de chat [Google GenAI](https://docs.langchain.com/oss/python/integrations/providers/google), qui nécessite une [clé API provenant de Google AI Studio](https://ai.google.dev/gemini-api/docs/api-key).

Si vous devez basculer vers un autre modèle, utilisez une autre classe de modèle de chat.

Par exemple, remplacez cette partie du code :

```Python
from langchain_google_genai import ChatGoogleGenerativeAI

llm = ChatGoogleGenerativeAI(
        model="gemini-3-flash-preview", 
        temperature=0,
        api_key=settings.ai_api_key.get_secret_value()
    )
```

par celle-ci :

```Python
from langchain_openai import ChatOpenAI

llm = ChatOpenAI(
    model="gpt-5-nano",
    temperature=0,
    api_key=settings.ai_api_key.get_secret_value() # après mise à jour de la clé dans le .env
)
```

**[Cette section liste toutes les options disponibles, avec la documentation de chaque modèle.](https://docs.langchain.com/oss/python/integrations/chat)**
