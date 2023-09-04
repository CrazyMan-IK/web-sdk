import { EventDispatcher } from 'ste-events';
import Localization from './index';

export default class LocalizedString {
  private readonly _changed: EventDispatcher<LocalizedString, void> = new EventDispatcher<LocalizedString, void>();

  private readonly _key: string = '';
  private readonly _fallback: string = '';
  private _value: string = '';

  constructor(key: string, fallback: string) {
    this._key = key;
    this._fallback = fallback;
    this._value = Localization.getLocalizedValue(key);

    Localization.localeChanged.subscribe(this.onLocaleChanged.bind(this));
  }

  public get changed() {
    return this._changed.asEvent();
  }

  public get value() {
    return this._value;
  }

  public toString() {
    return this._value;
  }

  private onLocaleChanged() {
    this._value = Localization.getLocalizedValue(this._key);

    if (this._value === this._key) {
      this._value = this._fallback;
    }

    this._changed.dispatch(this);
  }
}
