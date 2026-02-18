import base64
from pathlib import Path
from math import ceil

import fitz


def pdf2imgs(pdf_path: Path, zoom: float = 2.0) -> list[str]:
    doc = fitz.open(pdf_path)
    out = []
    page_width_pt = doc[0].rect.width  # PDF points
    scale = ceil(1500 / page_width_pt)
    mat = fitz.Matrix(scale, scale)
    for i, page in enumerate(doc):
        pix = page.get_pixmap(matrix=mat)
        img_bytes = pix.tobytes("jpeg")
        out.append("data:image/jpeg;base64," + base64.b64encode(img_bytes).decode("utf-8"))
    doc.close()
    return out
