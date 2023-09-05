import { EventDispatcher } from 'ste-events';
import Localization from './index';
export default class LocalizedString {
    _changed = new EventDispatcher();
    _key = '';
    _fallback = '';
    _value = '';
    constructor(key, fallback) {
        this._key = key;
        this._fallback = fallback;
        this._value = Localization.getLocalizedValue(key);
        Localization.localeChanged.subscribe(this.onLocaleChanged.bind(this));
    }
    get changed() {
        return this._changed.asEvent();
    }
    get value() {
        return this._value;
    }
    toString() {
        return this._value;
    }
    onLocaleChanged() {
        this._value = Localization.getLocalizedValue(this._key);
        if (this._value === this._key) {
            this._value = this._fallback;
        }
        this._changed.dispatch(this);
    }
}
//# sourceMappingURL=localized-string.js.map