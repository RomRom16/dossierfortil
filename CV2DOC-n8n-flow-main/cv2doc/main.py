from pathlib import Path
import argparse
from cv2doc.main import run_processing


def collect_pdfs(path: Path) -> list[Path]:
    if not path.exists():
        raise FileNotFoundError(path)

    if path.is_dir():
        return [p for p in path.iterdir() if p.is_file() and p.suffix.lower() == ".pdf"]

    if path.is_file():
        if path.suffix.lower() != ".pdf":
            raise ValueError(f"Not a PDF file: {path}")
        return [path]

    raise ValueError(f"Unsupported path type: {path}")


if __name__ == "__main__":
    parser = argparse.ArgumentParser()
    parser.add_argument("path", type=Path, help="Path to a CV PDF file or to a folder containing CV PDFs")
    args = parser.parse_args()

    pdfs = collect_pdfs(args.path)
    if not pdfs:
        raise ValueError(f"{args.path} does not contain any PDF files")

    print("Starting CV to Document conversion...")
    for cv_path in pdfs:
        print(f"Processing CV: {cv_path.name}")
        run_processing(cv_path)
        print("Processing CV completed.")

    print("Conversion completed.")
