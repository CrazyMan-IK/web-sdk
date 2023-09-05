import { SignalDispatcher } from 'ste-signals';
import LocalizedString from './localized-string';
export var Locale;
(function (Locale) {
    Locale[Locale["English"] = 0] = "English";
    Locale[Locale["Turkish"] = 1] = "Turkish";
    Locale[Locale["Deutsch"] = 2] = "Deutsch";
    Locale[Locale["Russian"] = 3] = "Russian";
})(Locale || (Locale = {}));
export default class Localization {
    //public static event Action LocaleChanged = null;
    static _localeChanged = new SignalDispatcher();
    //private static readonly _strings: { [key: string]: { [key in Locale]: string } } = {
    static _strings = {};
    static _localizedStrings = {};
    static _locale = Locale.English;
    static get localeChanged() {
        return this._localeChanged.asEvent();
    }
    static get locale() {
        return this._locale;
    }
    static set locale(value) {
        if (this._locale == value) {
            return;
        }
        this._locale = value;
        this._localeChanged.dispatch();
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