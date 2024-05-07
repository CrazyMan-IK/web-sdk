import { SignalDispatcher } from 'ste-signals';
import LocalizedString from './localized-string';

export enum Locale {
  English = 1,
  Turkish = 2,
  Deutsch = 4,
  Russian = 8
}

export default class Localization {
  //public static event Action LocaleChanged = null;
  private static readonly _localeChanged: SignalDispatcher = new SignalDispatcher();

  //private static readonly _strings: { [key: string]: { [key in Locale]: string } } = {
  private static readonly _strings: Record<string, Readonly<Record<Locale, string>> | undefined> = {};
  private static readonly _localizedStrings: Record<string, LocalizedString> = {};
  private static _allowedLocales: Locale = Locale.English | Locale.Turkish | Locale.Deutsch | Locale.Russian;
  private static _locale: Locale = Locale.English;

  public static get localeChanged() {
    return this._localeChanged.asEvent();
  }

  public static get locale() {
    return this._locale;
  }

  public static set locale(value) {
    if (this._locale == value || !(value & this._allowedLocales)) {
      return;
    }

    this._locale = value;
    this._localeChanged.dispatch();
  }

  public static setAllowedLocales(allowedLocales: Locale) {
    if (allowedLocales < 1) {
      return;
    }

    this._allowedLocales = allowedLocales;
  }

  public static isLocaleAllowed(locale: Locale): boolean {
    return (this._allowedLocales & locale) == locale;
  }

  public static addString(key: string, values: Readonly<Record<Locale, string>>) {
    this._strings[key] = values;
  }

  public static addStrings(values: Record<string, Readonly<Record<Locale, string>> | undefined>) {
    for (const [key, value] of Object.entries(values)) {
      this._strings[key] = value;
    }
  }

  public static getLocalizedString(key: string, fallback: string | undefined = undefined) {
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

  public static getLocalizedValue(key: string) {
    const value = this._strings[key];

    if (value !== undefined) {
      return value[this._locale];
    }

    return key;
  }
}
