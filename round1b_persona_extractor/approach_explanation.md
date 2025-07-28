### Concept

1. **Outline first** – We reuse the headings detected in Round-1a and treat each heading + its body paragraph as a “section”.
2. **Sentence Embeddings** – `all-MiniLM-L6-v2` (≈90 MB) strikes a balance between speed and semantic accuracy.
3. **Composite Query** – A weighted average of persona (0.7) and job description (0.3) yields a single vector.
4. **Exact Cosine Search** – For ≤100 k sections, a dense dot product in NumPy is faster than FAISS with negligible RAM overhead.
5. **Output** – Sections returned in descending similarity with the field `importance_rank`.

Total pipeline stays under 10 s for 50-page PDFs on a 4-core CPU.
