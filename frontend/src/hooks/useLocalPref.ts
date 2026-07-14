import { useState } from "react";

const PREFIX = "dawaibuddy:pref:";

/** Boolean preference persisted to localStorage (client-side only — no backend preferences model exists yet). */
export function useLocalPref(key: string, defaultValue: boolean): [boolean, (v: boolean) => void] {
  const storageKey = PREFIX + key;
  const [value, setValue] = useState(() => {
    const stored = localStorage.getItem(storageKey);
    return stored === null ? defaultValue : stored === "true";
  });

  function update(next: boolean) {
    setValue(next);
    localStorage.setItem(storageKey, String(next));
  }

  return [value, update];
}
