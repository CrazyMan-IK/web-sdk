import { EventDispatcher } from 'ste-events';
export default class SFX {
    _stopped = new EventDispatcher();
    _howl;
    _src;
    constructor(howl, src) {
        this._howl = howl;
        this._src = src;
    }
    get stopped() {
        return this._stopped.asEvent();
    }
    get src() {
        return this._src;
    }
    stop() {
        this._stopped.dispatch(this);
    }
}
//# sourceMappingURL=sfx.js.map