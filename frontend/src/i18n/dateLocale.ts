const LOCALE_BY_LANGUAGE: Record<string, string> = {
  en: "en-IN",
  hi: "hi-IN",
  mr: "mr-IN",
};

/** Maps the active i18next language to an Intl locale for date formatting. */
export function localeForLanguage(language: string): string {
  return LOCALE_BY_LANGUAGE[language] ?? "en-IN";
}
