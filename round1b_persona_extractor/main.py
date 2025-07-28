#!/usr/bin/env python3
import sys
import json
from utils.embedding import get_model, embed_batch
from utils.ranker import rank_sections

def main():
    if len(sys.argv) != 5:
        print("Usage: python main.py <outline_json> <persona_txt> <job_txt> <output_json>")
        sys.exit(1)

    outline_path = sys.argv[1]
    persona_path = sys.argv[2]
    job_path = sys.argv[3]
    output_path = sys.argv[4]

    try:
        # Load inputs
        with open(outline_path, 'r') as f:
            outline = json.load(f)

        sections = outline["headings"]

        persona = Path(persona_path).read_text().strip()
        job = Path(job_path).read_text().strip()

        # Embed and rank
        model = get_model()
        persona_vec = embed_batch(model, [persona])[0]
        job_vec = embed_batch(model, [job])[0]
        ranked = rank_sections(model, sections, persona_vec, job_vec)

        # Write output
        with open(output_path, 'w') as f:
            json.dump(ranked, f, indent=2)
        print(f"[✔] Ranking saved to {output_path}")
        
    except Exception as e:
        print(f"[✘] Failed to rank sections: {e}")
        sys.exit(1)

if __name__ == "__main__":
    main()
