"""Train a Drug–Drug Interaction (DDI) classifier.

Each row = two drugs (as SMILES) + a binary label (1 = interaction, 0 = none).
Features = Morgan fingerprint(drugA) concatenated with fingerprint(drugB).
Model    = XGBoost. Output = models/ddi_model.pkl.

Usage:
    python train_ddi.py --demo         # tiny built-in dataset, proves the pipeline
    python train_ddi.py                # real run, reads data/ddi.csv
        (data/ddi.csv needs columns: drug1_smiles, drug2_smiles, label)
"""
import argparse
import os

import joblib
import numpy as np
import pandas as pd
from rdkit import Chem
from rdkit.Chem import AllChem
from sklearn.ensemble import HistGradientBoostingClassifier
from sklearn.metrics import classification_report, f1_score, roc_auc_score
from sklearn.model_selection import train_test_split

FP_BITS = 1024
HERE = os.path.dirname(os.path.abspath(__file__))

# Valid SMILES for common drugs (used by the demo dataset).
SMILES = {
    "metformin": "CN(C)C(=N)N=C(N)N",
    "amlodipine": "CCOC(=O)C1=C(COCCN)NC(C)=C(C(=O)OC)C1c1ccccc1Cl",
    "atorvastatin": "CC(C)c1c(C(=O)Nc2ccccc2)c(-c2ccccc2)c(-c2ccc(F)cc2)n1CC[C@@H](O)C[C@@H](O)CC(=O)O",
    "pantoprazole": "COc1ccc2[nH]c(S(=O)Cc3ncc(C)c(OC(F)F)c3OC)nc2c1",
    "azithromycin": "CC[C@H]1OC(=O)[C@H](C)[C@@H](O)[C@H](C)C[C@](C)(O)[C@@H](O[C@@H]2O[C@H](C)C[C@H](N(C)C)[C@H]2O)[C@H](C)[C@@H](O[C@H]2C[C@@](C)(OC)[C@@H](O)[C@H](C)O2)[C@H](C)C(=O)O1",
    "cetirizine": "OC(=O)COCCN1CCN(CC1)C(c1ccccc1)c1ccc(Cl)cc1",
    "aspirin": "CC(=O)OC1=CC=CC=C1C(=O)O",
    "ibuprofen": "CC(C)Cc1ccc(cc1)C(C)C(=O)O",
    "warfarin": "CC(=O)CC(c1ccccc1)c1c(O)c2ccccc2oc1=O",
    "simvastatin": "CCC(C)(C)C(=O)OC1CC(C)C=C2C=CC(C)C(CCC3CC(O)CC(=O)O3)C12",
}

# Well-known interacting pairs among the demo drugs (order-independent) → label 1.
# Everything else among the drugs is labeled 0. Small + curated: proves the pipeline
# and gives the integration a real model. Replace with data/ddi.csv for a real one.
KNOWN_INTERACTIONS = {
    frozenset(("warfarin", "aspirin")),
    frozenset(("warfarin", "ibuprofen")),
    frozenset(("warfarin", "simvastatin")),
    frozenset(("warfarin", "azithromycin")),
    frozenset(("warfarin", "atorvastatin")),
    frozenset(("atorvastatin", "azithromycin")),
    frozenset(("simvastatin", "azithromycin")),
    frozenset(("atorvastatin", "amlodipine")),
    frozenset(("simvastatin", "amlodipine")),
    frozenset(("aspirin", "ibuprofen")),
    frozenset(("azithromycin", "amlodipine")),
    frozenset(("aspirin", "warfarin")),
}


def demo_pairs():
    """All unique drug pairs among the known SMILES, labeled from KNOWN_INTERACTIONS."""
    from itertools import combinations

    pairs = []
    for a, b in combinations(sorted(SMILES), 2):
        label = 1 if frozenset((a, b)) in KNOWN_INTERACTIONS else 0
        pairs.append((a, b, label))
    return pairs


DEMO_PAIRS = demo_pairs()


def fingerprint(smiles: str):
    mol = Chem.MolFromSmiles(smiles)
    if mol is None:
        return None
    bitvect = AllChem.GetMorganFingerprintAsBitVect(mol, radius=2, nBits=FP_BITS)
    return np.array(bitvect, dtype=np.int8)


def build_features(df: pd.DataFrame):
    X, y, skipped = [], [], 0
    for _, row in df.iterrows():
        fa, fb = fingerprint(row["drug1_smiles"]), fingerprint(row["drug2_smiles"])
        if fa is None or fb is None:
            skipped += 1
            continue
        X.append(np.concatenate([fa, fb]))
        y.append(int(row["label"]))
    if skipped:
        print(f"  (skipped {skipped} rows with invalid SMILES)")
    return np.array(X), np.array(y)


def demo_frame() -> pd.DataFrame:
    rows = [
        {"drug1_smiles": SMILES[a], "drug2_smiles": SMILES[b], "label": lbl}
        for a, b, lbl in DEMO_PAIRS
    ]
    return pd.DataFrame(rows)


def main():
    parser = argparse.ArgumentParser()
    parser.add_argument("--demo", action="store_true", help="Use the built-in demo dataset.")
    parser.add_argument("--data", default=os.path.join(HERE, "data", "ddi.csv"))
    args = parser.parse_args()

    if args.demo:
        print("Using built-in DEMO dataset (tiny — proves the pipeline, not a real model).")
        df = demo_frame()
    else:
        print(f"Loading dataset: {args.data}")
        df = pd.read_csv(args.data)

    X, y = build_features(df)
    print(f"Dataset: {X.shape[0]} pairs, {X.shape[1]} features, positives={int(y.sum())}")

    stratify = y if len(np.unique(y)) > 1 and len(y) >= 8 else None
    X_tr, X_te, y_tr, y_te = train_test_split(
        X, y, test_size=0.25, random_state=42, stratify=stratify
    )

    # HistGradientBoosting = fast gradient boosting, pure scikit-learn (no native deps).
    # Swap for xgboost.XGBClassifier later if you want (needs `brew install libomp`).
    model = HistGradientBoostingClassifier(
        max_iter=300,
        max_depth=6,
        learning_rate=0.1,
        class_weight="balanced",
        random_state=42,
    )
    model.fit(X_tr, y_tr)

    proba = model.predict_proba(X_te)[:, 1]
    preds = (proba > 0.5).astype(int)
    print("\n=== Evaluation (held-out) ===")
    if len(np.unique(y_te)) > 1:
        print("AUROC:", round(roc_auc_score(y_te, proba), 3))
    print("F1:   ", round(f1_score(y_te, preds, zero_division=0), 3))
    print(classification_report(y_te, preds, zero_division=0))

    os.makedirs(os.path.join(HERE, "models"), exist_ok=True)
    out = os.path.join(HERE, "models", "ddi_model.pkl")
    joblib.dump({"model": model, "fp_bits": FP_BITS}, out)
    print(f"Saved -> {out}")


if __name__ == "__main__":
    main()
