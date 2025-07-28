from typing import List, Tuple  # ✅ Added this line
import numpy as np
from sklearn.cluster import KMeans
from collections import Counter, OrderedDict

BOLD_FLAG = 1 << 4
SCORE_WEIGHTS = dict(font=0.6, bold=0.3, pos=0.1)

def detect_headings(spans: List[dict], page_heights: List[float]) -> Tuple[str, List[dict]]:
    """Apply weighted scoring to identify headings and classify hierarchy."""
    body_size = Counter([s["size"] for s in spans]).most_common(1)[0][0]
    
    # Score each span based on font size, boldness, and position
    heading_cand = []
    for s in spans:
        norm_font = s["size"] / body_size
        bold = bool(s["flags"] & BOLD_FLAG or "Bold" in s["font"])
        pos_score = 1 - (s["bbox"][1] / page_heights[s["page_no"] - 1])
        score = (SCORE_WEIGHTS["font"] * norm_font + 
                 SCORE_WEIGHTS["bold"] * bold + 
                 SCORE_WEIGHTS["pos"] * pos_score)
        
        if score > 1.0:  # Threshold for heading candidates
            heading_cand.append(s)
    
    # Cluster font sizes into H1-H3 levels
    sizes = sorted(set([s["size"] for s in heading_cand]), reverse=True)
    if len(sizes) >= 3:
        km = KMeans(n_clusters=3, random_state=0).fit(np.array(sizes).reshape(-1, 1))
        size_lvl_map = {sz: km.labels_[i] for i, sz in enumerate(sizes)}
    else:
        size_lvl_map = {sz: i for i, sz in enumerate(sizes)}
    
    # Generate final heading list
    headings = []
    seen = set()
    for sp in sorted(heading_cand, key=lambda x: (x["page_no"], x["bbox"][1])):
        lvl = size_lvl_map[sp["size"]]
        if lvl > 2:  # Limit to H1-H3
            continue
        key = (sp["text"].lower(), lvl)
        if key not in seen:
            seen.add(key)
            headings.append({
                "text": sp["text"],
                "level": f"H{lvl + 1}",
                "page": sp["page_no"]
            })
    
    # Extract title (first H1 on page 1)
    title = next((h["text"] for h in headings if h["level"] == "H1" and h["page"] == 1), "")
    return title, headings
