// ============================================================================
// locales.js - Definition of locales ( language UI + holidays country )
// Un 'locales' united together: flag, label, language UI and holidays country.
// The multi-languages ( Switzerland, Belgium) appear several times.
// ============================================================================

export const LOCALES= {
    'it-IT': { flag: '🇮🇹',  label: 'Italiano', lang: 'it', country: 'IT'},
    'en-GB': { flag: '🇬🇧', label: 'English', lang: 'en', country: 'UK'},
    'en-US': { flag: '🇺🇸', label: 'English', lang: 'en', country: 'US'},
    'de-DE': { flag: '🇩🇪', label: 'Deutsch (Deutschland)', lang: 'de', country: 'DE'},
    'fr-FR': { flag: '🇫🇷', label: 'Français (France)', lang: 'fr', country: 'FR'},
    'es-ES': { flag: '🇪🇸', label: 'Español (España)', lang: 'es', country: 'ES'},
    'nl-NL': { flag: '🇳🇱', label: 'Nederlands', lang: 'nl', country: 'NL'},
    'pt-PT': { flag: '🇵🇹', label: 'Português', lang: 'pt', country: 'PT'},
    'de-CH': { flag: '🇨🇭', label: 'Deutsch (Schweiz)', lang: 'de', country: 'CH' },
    'fr-CH': { flag: '🇨🇭', label: 'Français (Suisse)', lang: 'fr', country: 'CH'},
    'it-CH': { flag: '🇨🇭', label: 'Italiano (Svizzera)', lang: 'it', country: 'CH'},
    'fr-BE': { flag: '🇧🇪', label: 'Français (Belgique)', lang: 'fr', country: 'BE'},
    'nl-BE': { flag: '🇧🇪', label: 'Nederlands (België)', lang: 'nl', country: 'BE'},
}

export const DEFAULT_LOCALES = 'it-IT';

export function getLocal(){
    const saved = localStorage.getItem('leave_local');
    return (saved && LOCALES[saved]) ? saved : DEFAULT_LOCALES;
}

export function setLocal(code){
    if (LOCALES[code]) localStorage.setItem('leave_local', code);
}