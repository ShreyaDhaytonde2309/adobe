import numpy as np
from utils.embedding import embed_batch

def rank_sections(model, sections: list, persona_vec, job_vec, weights=(0.7, 0.3)):
    """Rank sections based on persona + job-to-be-done similarity."""
    query_vec = weights[0] * persona_vec + weights[1] * job_vec
    
    texts = [s.get("text", s.get("title", "")) for s in sections]
    sec_vecs = embed_batch(model, texts)
    
    similarities = sec_vecs @ query_vec  # Cosine similarity via dot product
    order = np.argsort(-similarities)
    
    ranked = []
    for rank, idx in enumerate(order, 1):
        s = sections[idx]
        ranked.append({
            "section": s.get("text", s.get("title", "")),
            "level": s.get("level", ""),
            "page": s.get("page", 0),
            "similarity": float(similarities[idx]),
            "importance_rank": rank
        })
    return ranked
