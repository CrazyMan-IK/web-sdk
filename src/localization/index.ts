import { SignalDispatcher } from 'ste-signals';
import LocalizedString from './localized-string';

export enum Locale {
  English,
  Turkish,
  Deutsch,
  Russian
}

export default class Localization {
  //public static event Action LocaleChanged = null;
  private static readonly _localeChanged: SignalDispatcher = new SignalDispatcher();

  //private static readonly _strings: { [key: string]: { [key in Locale]: string } } = {
  private static readonly _strings: Record<string, Readonly<Record<Locale, string>> | undefined> = {};
  private static readonly _localizedStrings: Record<string, LocalizedString> = {};
  private static _locale: Locale = Locale.English;

  public static get localeChanged() {
    return this._localeChanged.asEvent();
  }

  public static get locale() {
    return this._locale;
  }

  public static set locale(value) {
    if (this._locale == value) {
      return;
    }

    this._locale = value;
    this._localeChanged.dispatch();
  }

  public static addString(key: string, values: Readonly<Record<Locale, string>>) {
    this._strings[key] = values;
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
