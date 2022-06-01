import { createI18n } from "vue-i18n";

// Import language files
import es from "./es-ES.json"
import en from "./en-US.json"

const messages = {
    en: en,
    es: es
}

// Create Vuei18n instance
export const vuei18n = createI18n({
    locale: 'es', // set locale
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
export const i18n = vuei18n.global.messages[vuei18n.global.locale];
export const locale = vuei18n.global.locale;