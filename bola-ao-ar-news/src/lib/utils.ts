export function formatDateISO(iso: string, locale = "pt-PT") {
  return new Date(iso).toLocaleDateString(locale, { year: "numeric", month: "short", day: "2-digit" });
}
