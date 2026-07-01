"""Offline SMILES lookup for common demo medicines (keyed by lowercased generic name).

Used by seed_demo and backfill_smiles so the DDI model has structures to featurize
without needing a network call. Extend as the catalog grows.
"""

SMILES_BY_GENERIC = {
    "metformin": "CN(C)C(=N)N=C(N)N",
    "amlodipine": "CCOC(=O)C1=C(COCCN)NC(C)=C(C(=O)OC)C1c1ccccc1Cl",
    "atorvastatin": "CC(C)c1c(C(=O)Nc2ccccc2)c(-c2ccccc2)c(-c2ccc(F)cc2)n1CC[C@@H](O)C[C@@H](O)CC(=O)O",
    "pantoprazole": "COc1ccc2[nH]c(S(=O)Cc3ncc(C)c(OC(F)F)c3OC)nc2c1",
    "azithromycin": "CC[C@H]1OC(=O)[C@H](C)[C@@H](O[C@H]2C[C@@](C)(OC)[C@@H](O)[C@H](C)O2)[C@H](C)[C@@H](O[C@@H]2O[C@H](C)C[C@H](N(C)C)[C@H]2O)[C@](C)(O)C[C@@H](C)CN(C)[C@H](C)[C@@H](O)[C@]1(C)O",
    "cetirizine": "OC(=O)COCCN1CCN(CC1)C(c1ccccc1)c1ccc(Cl)cc1",
}


def lookup_smiles(generic_name: str) -> str:
    return SMILES_BY_GENERIC.get((generic_name or "").strip().lower(), "")
