// hooks/useLanguage.ts
import { useEffect, useState } from "react";
import axios from "axios";
import { LanguageCode } from "@/types/languages";

export function useLanguage(initialLang: LanguageCode) {
	const [language, setLanguage] = useState<LanguageCode>(initialLang);

	useEffect(() => {
		// Update the <html> tag's lang attribute
		document.documentElement.lang = language;

		// Set the default Accept-Language header for Axios
		axios.defaults.headers.common["Accept-Language"] = language;
	}, [language]);

	return { language, setLanguage };
}
