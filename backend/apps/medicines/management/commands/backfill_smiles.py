"""Populate Medicine.smiles for the DDI model.

Resolution order per medicine (by generic_name, else name):
  1. built-in offline dict (apps.medicines.smiles_data)
  2. PubChem PUG-REST lookup (best-effort; skipped/ignored if offline)

Idempotent — only fills empty values unless --force is passed.
Usage: python manage.py backfill_smiles [--force]
"""
from django.core.management.base import BaseCommand

from apps.medicines.models import Medicine
from apps.medicines.smiles_data import lookup_smiles

PUBCHEM_URL = (
    "https://pubchem.ncbi.nlm.nih.gov/rest/pug/compound/name/{name}/property/CanonicalSMILES/TXT"
)


def _pubchem_smiles(name: str) -> str:
    """Best-effort PubChem lookup; returns '' on any failure (offline, 404, timeout)."""
    try:
        import urllib.parse
        import urllib.request

        url = PUBCHEM_URL.format(name=urllib.parse.quote(name))
        with urllib.request.urlopen(url, timeout=5) as resp:  # noqa: S310
            return resp.read().decode().strip().splitlines()[0].strip()
    except Exception:
        return ""


class Command(BaseCommand):
    help = "Backfill Medicine.smiles from the offline dict, falling back to PubChem."

    def add_arguments(self, parser):
        parser.add_argument("--force", action="store_true", help="Overwrite existing SMILES.")
        parser.add_argument(
            "--no-pubchem", action="store_true", help="Skip the PubChem network lookup."
        )

    def handle(self, *args, **options):
        qs = Medicine.objects.all() if options["force"] else Medicine.objects.filter(smiles="")
        filled = 0
        for med in qs:
            key = med.generic_name or med.name
            smiles = lookup_smiles(key)
            if not smiles and not options["no_pubchem"]:
                smiles = _pubchem_smiles(key)
            if smiles:
                med.smiles = smiles
                med.save(update_fields=["smiles", "updated_at"])
                filled += 1
                self.stdout.write(f"  {med.name} -> {smiles[:40]}…")

        total = Medicine.objects.count()
        with_smiles = Medicine.objects.exclude(smiles="").count()
        self.stdout.write(
            self.style.SUCCESS(f"Filled {filled}. {with_smiles}/{total} medicines now have SMILES.")
        )
