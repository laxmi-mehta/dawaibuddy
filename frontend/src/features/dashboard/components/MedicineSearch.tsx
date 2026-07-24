import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Search } from "lucide-react";
import { useTranslation } from "react-i18next";
import { Card } from "@/components/ui/card";
import { Chip } from "@/components/ui/badge";

const POPULAR = ["Metformin", "Amlodipine", "Pantoprazole", "Cetirizine"];

export function MedicineSearch() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [query, setQuery] = useState("");

  function goToMedicines(search: string) {
    navigate("/medicines", { state: { search } });
  }

  return (
    <Card className="p-6">
      <h2 className="text-h3 font-extrabold text-ink">{t("dashboard.searchMedicines")}</h2>

      <form
        className="relative mt-4"
        onSubmit={(e) => {
          e.preventDefault();
          goToMedicines(query);
        }}
      >
        <Search
          className="pointer-events-none absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-muted"
          strokeWidth={1.9}
        />
        <input
          type="search"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder={t("dashboard.searchMedicinesPlaceholder")}
          className="h-12 w-full rounded-full border border-line bg-surface pl-12 pr-4 text-body text-ink placeholder:text-muted focus-visible:border-brand focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand/30"
        />
      </form>

      <div className="mt-4 flex flex-wrap gap-2">
        {POPULAR.map((m) => (
          <Chip key={m} onClick={() => goToMedicines(m)}>
            {m}
          </Chip>
        ))}
      </div>
    </Card>
  );
}
