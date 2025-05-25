export type LanguageCode = "es" | "en";

export const LanguageDisplayNames = {
	es: "Español",
	en: "English",
} as const;

export type LanguageDisplayName = (typeof LanguageDisplayNames)[LanguageCode];
