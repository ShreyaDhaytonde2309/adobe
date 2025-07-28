#!/usr/bin/env python3
import sys
import json
from pathlib import Path
from utils.pdf_parser import extract_sections
from utils.heading_classifier import detect_headings

def build_outline(pdf_path: str):
    spans, page_heights = extract_sections(pdf_path)
    title, headings = detect_headings(spans, page_heights)
    return {"title": title, "headings": headings}

def main():
    if len(sys.argv) != 3:
        print("Usage: python main.py <input_pdf> <output_json>")
        sys.exit(1)
    
    input_pdf = sys.argv[1]
    output_json = sys.argv[2]

    try:
        outline_json = build_outline(input_pdf)
        Path(output_json).write_text(json.dumps(outline_json, indent=2))
        print(f"[✔] Outline written to {output_json}")
    except Exception as e:
        print(f"[✘] Failed to extract outline: {e}")
        sys.exit(1)

if __name__ == "__main__":
    main()
