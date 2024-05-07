import LocalizedString from './localized-string';
export declare enum Locale {
    English = 1,
    Turkish = 2,
    Deutsch = 4,
    Russian = 8
}
export default class Localization {
    private static readonly _localeChanged;
    private static readonly _strings;
    private static readonly _localizedStrings;
    private static _allowedLocales;
    private static _locale;
    static get localeChanged(): import("ste-signals").ISignal;
    static get locale(): Locale;
    static set locale(value: Locale);
    static setAllowedLocales(allowedLocales: Locale): void;
    static isLocaleAllowed(locale: Locale): boolean;
    static addString(key: string, values: Readonly<Record<Locale, string>>): void;
    static addStrings(values: Record<string, Readonly<Record<Locale, string>> | undefined>): void;
    static getLocalizedString(key: string, fallback?: string | undefined): LocalizedString;
    static getLocalizedValue(key: string): string;
}
