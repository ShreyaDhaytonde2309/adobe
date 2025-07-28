import fitz  # PyMuPDF for fast C-backed extraction
from typing import List, Tuple, Dict

def extract_sections(pdf_path: str) -> Tuple[List[dict], List[float]]:
    """Extract text spans with font metadata from PDF pages."""
    doc = fitz.open(pdf_path)
    page_heights = [p.rect.height for p in doc]
    spans = []
    
    for page in doc:
        for block in page.get_text("dict")["blocks"]:
            if block["type"] != 0:  # Skip non-text blocks
                continue
            for line in block["lines"]:
                for sp in line["spans"]:
                    text = sp["text"].strip()
                    if not text:
                        continue
                    spans.append({
                        "text": text,
                        "size": sp["size"],
                        "flags": sp["flags"],
                        "font": sp["font"],
                        "page_no": page.number + 1,
                        "bbox": sp["bbox"],
                    })
    doc.close()
    return spans, page_heights
