import { SignalDispatcher } from 'ste-signals';
import LocalizedString from './localized-string';
export var Locale;
(function (Locale) {
    Locale[Locale["English"] = 1] = "English";
    Locale[Locale["Turkish"] = 2] = "Turkish";
    Locale[Locale["Deutsch"] = 4] = "Deutsch";
    Locale[Locale["Russian"] = 8] = "Russian";
})(Locale || (Locale = {}));
export default class Localization {
    //public static event Action LocaleChanged = null;
    static _localeChanged = new SignalDispatcher();
    //private static readonly _strings: { [key: string]: { [key in Locale]: string } } = {
    static _strings = {};
    static _localizedStrings = {};
    static _allowedLocales = Locale.English | Locale.Turkish | Locale.Deutsch | Locale.Russian;
    static _locale = Locale.English;
    static get localeChanged() {
        return this._localeChanged.asEvent();
    }
    static get locale() {
        return this._locale;
    }
    static set locale(value) {
        if (this._locale == value || !(value & this._allowedLocales)) {
            return;
        }
        this._locale = value;
        this._localeChanged.dispatch();
    }
    static setAllowedLocales(allowedLocales) {
        if (allowedLocales < 1) {
            return;
        }
        this._allowedLocales = allowedLocales;
    }
    static isLocaleAllowed(locale) {
        return (this._allowedLocales & locale) == locale;
    }
    static addString(key, values) {
        this._strings[key] = values;
    }
    static addStrings(values) {
        for (const [key, value] of Object.entries(values)) {
            this._strings[key] = value;
        }
    }
    static getLocalizedString(key, fallback = undefined) {
        if (fallback === undefined) {
            fallback = key;
        }
        let value = this._localizedStrings[key];
        if (value !== undefined) {
            return value;
        }
        value = new LocalizedString(key, fallback);
        this._localizedStrings[key] = value;
        return value;
    }
    static getLocalizedValue(key) {
        const value = this._strings[key];
        if (value !== undefined) {
            return value[this._locale];
        }
        return key;
    }
}
//# sourceMappingURL=index.js.map