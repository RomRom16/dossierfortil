from cv2doc.analyse_cv.ai_analyzing import analyze_img
from cv2doc.json2doc.json_rendering import render_json2doc
from cv2doc.helpers.pdf_rendering import pdf2imgs
from cv2doc.settings import CV2DOCSettings
from pathlib import Path
from pydantic import BaseModel



def run_processing(cv_path) -> Path:
    settings = CV2DOCSettings()
    
    image_data = pdf2imgs(cv_path)
    
    result = analyze_img(image_data, settings)

    if not isinstance(result, BaseModel):
        raise ValueError("LLM output is not a valid BaseModel instance.")

    json_output_path = Path(settings.json_output_dir + "/" + cv_path.name.split(".")[0] + ".json")
    json_output_path.parent.mkdir(parents=True, exist_ok=True)
    with open(json_output_path, "w+") as output_file:
        output_file.write(result.model_dump_json(by_alias=True, indent=2))


    output_path = Path(settings.results_dir + "/" + cv_path.name.split(".")[0] + ".docx")
    output_path.parent.mkdir(parents=True, exist_ok=True)
    render_json2doc(settings.dox_template_path, output_path, json_output_path)
    
    return output_path
