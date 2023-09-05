import LocalizedString from './localized-string';
export declare enum Locale {
    English = 0,
    Turkish = 1,
    Deutsch = 2,
    Russian = 3
}
export default class Localization {
    private static readonly _localeChanged;
    private static readonly _strings;
    private static readonly _localizedStrings;
    private static _locale;
    static get localeChanged(): import("ste-signals").ISignal;
    static get locale(): Locale;
    static set locale(value: Locale);
    static addString(key: string, values: Readonly<Record<Locale, string>>): void;
    static addStrings(values: Record<string, Readonly<Record<Locale, string>> | undefined>): void;
    static getLocalizedString(key: string, fallback?: string | undefined): LocalizedString;
    static getLocalizedValue(key: string): string;
}
