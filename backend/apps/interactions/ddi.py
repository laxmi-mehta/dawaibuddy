"""DDI model inference — loads the trained classifier and scores drug pairs.

All heavy imports (joblib, rdkit, numpy) are done lazily inside functions so the
module import never fails; if the model or its deps are missing, predict() returns
None and callers fall back to the known-interactions table.
"""
import functools
import os

MODEL_PATH = os.path.join(os.path.dirname(__file__), "ml", "ddi_model.pkl")


@functools.lru_cache(maxsize=1)
def _bundle():
    try:
        import joblib

        return joblib.load(MODEL_PATH)
    except Exception:
        return None


def model_available() -> bool:
    return _bundle() is not None


def _fingerprint(smiles: str, bits: int):
    try:
        import numpy as np
        from rdkit import Chem
        from rdkit.Chem import AllChem

        mol = Chem.MolFromSmiles(smiles)
        if mol is None:
            return None
        return np.array(AllChem.GetMorganFingerprintAsBitVect(mol, 2, bits))
    except Exception:
        return None


def predict(smiles_a: str, smiles_b: str):
    """Return interaction probability [0,1], or None if it can't be computed."""
    bundle = _bundle()
    if not bundle or not smiles_a or not smiles_b:
        return None
    try:
        import numpy as np

        fa = _fingerprint(smiles_a, bundle["fp_bits"])
        fb = _fingerprint(smiles_b, bundle["fp_bits"])
        if fa is None or fb is None:
            return None
        x = np.concatenate([fa, fb]).reshape(1, -1)
        return float(bundle["model"].predict_proba(x)[0, 1])
    except Exception:
        return None


def severity_from_prob(prob: float) -> str:
    if prob >= 0.75:
        return "severe"
    if prob >= 0.5:
        return "moderate"
    if prob >= 0.25:
        return "mild"
    return "none"
