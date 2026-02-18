from pydantic import SecretStr
from pydantic_settings import BaseSettings

class CV2DOCSettings(BaseSettings, env_file=".env"):
    ai_api_key: SecretStr

    prompt_path: str
    json_output_dir: str
    results_dir: str
    dox_template_path: str
