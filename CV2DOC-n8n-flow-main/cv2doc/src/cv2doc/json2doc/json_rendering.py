import json
from docxtpl import DocxTemplate


def render_json2doc(template_path: str, output_path: str, json_path: str) -> None:
    tpl = DocxTemplate(template_path)

    with open(json_path, "r") as json_file:
        data = json.load(json_file)

    if not isinstance(data, dict):
        raise TypeError("JSON root must be an object (key/value mapping).")


    tpl.render(data)
    tpl.save(output_path)
