import { createI18n } from "vue-i18n";

// Import language files
import es from "./es-ES.json"
import en from "./en-US.json"

const messages = {
    en: en,
    es: es
}

// Create Vuei18n instance
export const i18nn = createI18n({
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
    i18nn.global.locale = locale;
}