"""Build a real DDI training CSV from Therapeutics Data Commons (TDC).

TDC's DrugBank DDI gives interacting drug pairs (with SMILES) as multi-class types.
We turn it into a balanced binary set: known pairs = 1, random non-listed pairs = 0.

Output: ml/data/ddi.csv  (columns: drug1_smiles, drug2_smiles, label)
Usage:  python prep_data.py [--max-pos 5000]
"""
import argparse
import os
import random

import pandas as pd
from tdc.multi_pred import DDI

HERE = os.path.dirname(os.path.abspath(__file__))
random.seed(42)


def main():
    ap = argparse.ArgumentParser()
    ap.add_argument("--max-pos", type=int, default=5000, help="Max positive pairs to keep.")
    args = ap.parse_args()

    print("Downloading TDC DrugBank DDI…")
    df = DDI(name="DrugBank").get_data()  # cols: Drug1_ID, Drug1, Drug2_ID, Drug2, Y
    print(f"  raw interacting pairs: {len(df)}")

    # SMILES per drug id (for negative sampling).
    smiles = {}
    for _, r in df.iterrows():
        smiles[r["Drug1_ID"]] = r["Drug1"]
        smiles[r["Drug2_ID"]] = r["Drug2"]
    drug_ids = list(smiles)
    print(f"  unique drugs: {len(drug_ids)}")

    # Positives (any interaction type -> 1).
    positives = {frozenset((r["Drug1_ID"], r["Drug2_ID"])) for _, r in df.iterrows()}
    pos_list = [tuple(p) for p in positives if len(p) == 2]
    random.shuffle(pos_list)
    pos_list = pos_list[: args.max_pos]

    # Negatives: random drug pairs not in the positive set.
    neg_list, seen = [], set(positives)
    target = len(pos_list)
    while len(neg_list) < target:
        a, b = random.sample(drug_ids, 2)
        key = frozenset((a, b))
        if key in seen:
            continue
        seen.add(key)
        neg_list.append((a, b))

    rows = [{"drug1_smiles": smiles[a], "drug2_smiles": smiles[b], "label": 1} for a, b in pos_list]
    rows += [{"drug1_smiles": smiles[a], "drug2_smiles": smiles[b], "label": 0} for a, b in neg_list]
    random.shuffle(rows)

    out = os.path.join(HERE, "data", "ddi.csv")
    os.makedirs(os.path.dirname(out), exist_ok=True)
    pd.DataFrame(rows).to_csv(out, index=False)
    print(f"Wrote {len(rows)} rows ({len(pos_list)} pos / {len(neg_list)} neg) -> {out}")


if __name__ == "__main__":
    main()
