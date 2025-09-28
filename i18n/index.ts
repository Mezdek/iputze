export const locales = [
    "ar",
    "bg",
    "de",
    "el",
    "en",
    "sq"
] as const;

export const FALLBACK_LOCALE = "en"

export type Locale = typeof locales[number];