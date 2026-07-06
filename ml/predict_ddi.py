"""Sanity check: load the trained DDI model and score one drug pair.

Usage:
    python predict_ddi.py                       # uses two built-in demo SMILES
    python predict_ddi.py "<smiles1>" "<smiles2>"
"""
import os
import sys

import joblib
import numpy as np
from rdkit import Chem
from rdkit.Chem import AllChem

HERE = os.path.dirname(os.path.abspath(__file__))
MODEL_PATH = os.path.join(HERE, "models", "ddi_model.pkl")


def fingerprint(smiles: str, bits: int):
    mol = Chem.MolFromSmiles(smiles)
    if mol is None:
        raise ValueError(f"Invalid SMILES: {smiles}")
    return np.array(AllChem.GetMorganFingerprintAsBitVect(mol, 2, bits), dtype=np.int8)


def main():
    bundle = joblib.load(MODEL_PATH)
    model, bits = bundle["model"], bundle["fp_bits"]

    if len(sys.argv) >= 3:
        s1, s2 = sys.argv[1], sys.argv[2]
    else:
        # warfarin + aspirin (a known interacting pair)
        s1 = "CC(=O)CC(c1ccccc1)c1c(O)c2ccccc2oc1=O"
        s2 = "CC(=O)OC1=CC=CC=C1C(=O)O"

    x = np.concatenate([fingerprint(s1, bits), fingerprint(s2, bits)]).reshape(1, -1)
    prob = float(model.predict_proba(x)[0, 1])
    print(f"Interaction probability: {prob:.3f}  ->  {'INTERACTION' if prob > 0.5 else 'no interaction'}")


if __name__ == "__main__":
    main()
