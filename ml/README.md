# DawaiBuddy — ML (Drug–Drug Interaction model)

Trains a classifier that predicts whether two drugs interact, from their chemical structure
(SMILES → Morgan fingerprint → XGBoost). Runs on CPU.

## Setup (one time)
```bash
cd ml
python3 -m venv .venv
source .venv/bin/activate
pip install -r requirements.txt
```

## Run
```bash
# 1. Prove the pipeline works right now (tiny built-in demo data):
python train_ddi.py --demo        # -> models/ddi_model.pkl

# 2. Sanity-check a prediction:
python predict_ddi.py

# 3. Real training (after you add data/ddi.csv, see below):
python train_ddi.py
```

## Real dataset
Put a CSV at `data/ddi.csv` with these columns:

| column | meaning |
|---|---|
| `drug1_smiles` | SMILES string of drug A |
| `drug2_smiles` | SMILES string of drug B |
| `label` | 1 = known interaction, 0 = no known interaction |

Where to get data (pick one):
- **DrugBank** — drug info + interactions (free academic license).
- **BioSNAP ChCh-Miner** — public drug–drug interaction edge list (all positive; sample random
  non-edges as negatives).
- **TWOSIDES / OFFSIDES** — drug-pair adverse effects from FDA FAERS.

If your source has **drug names** not SMILES, resolve them via PubChem
(`https://pubchem.ncbi.nlm.nih.gov/rest/pug/compound/name/<name>/property/CanonicalSMILES/TXT`)
and build the CSV above.

Aim for a few thousand balanced pairs for a meaningful AUROC.

## Workflow (research lifecycle)
1. Baseline (this XGBoost script) → 2. try more data / features → 3. tune → 4. error analysis →
5. final test-set number → 6. hand `models/ddi_model.pkl` over to the backend for `/interactions/check/`.

## Notes
- `models/*.pkl` and `data/*.csv` are gitignored (large / licensed).
- Drug-disjoint splitting (a drug not in both train & test) gives a more honest score — add it once
  you move past the baseline.
