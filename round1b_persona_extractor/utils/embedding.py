from sentence_transformers import SentenceTransformer
import numpy as np

_MODEL_NAME = "sentence-transformers/all-MiniLM-L6-v2"  # 90MB model
_model = None

def get_model():
    global _model
    if _model is None:
        _model = SentenceTransformer(_MODEL_NAME, device="cpu")
    return _model

def embed_batch(model, sentences: list):
    return model.encode(sentences, batch_size=64, normalize_embeddings=True)
