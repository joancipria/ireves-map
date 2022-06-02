import { createI18n } from "vue-i18n";
import { settings } from "@/core/Settings";

// Import language files
import es from "./es-ES.json"
import en from "./en-US.json"
import ca from "./ca.json"

const messages = {
    en: en,
    es: es,
    ca: ca
}

// Create Vuei18n instance
export const vuei18n = createI18n({
    locale: settings.locale || 'es', // Set locale from settings. Use spanish by default
    fallbackLocale: 'en', // set fallback locale
    messages, // set locale messages
});

/**
 * Changes locale
 *
 * @export
 * @param {string} locale
 */
export function changeLocale(locale: string): void {
    vuei18n.global.locale = locale;
}

export const availableLocales = vuei18n.global.availableLocales;
export const i18n = vuei18n.global.t;
export const locale = vuei18n.global.locale;