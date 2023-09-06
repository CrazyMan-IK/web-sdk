import { EventDispatcher } from 'ste-events';
export default class Timer {
    _ticked = new EventDispatcher();
    _duration;
    _time = 0;
    _isPaused = false;
    constructor(duration) {
        this._duration = duration;
        requestAnimationFrame(this.update.bind(this));
    }
    get ticked() {
        return this._ticked.asEvent();
    }
    get duration() {
        return this._duration;
    }
    set duration(value) {
        if (value <= 0) {
            throw new Error('ArgumentOutOfRangeException: value');
        }
        if (this._duration !== value) {
            this._duration = value;
        }
    }
    get tickedTime() {
        return this._time;
    }
    get timeLeft() {
        return this._duration - this._time;
    }
    get timeLeftPercentage() {
        return this._time / this._duration;
    }
    get isPaused() {
        return this._isPaused;
    }
    start() {
        this._isPaused = false;
        requestAnimationFrame(this.update.bind(this));
    }
    pause() {
        this._isPaused = true;
    }
    reset() {
        this._time = 0;
    }
    stop() {
        this.pause();
        this.reset();
    }
    update(deltaTime) {
        if (this._isPaused) {
            return;
        }
        this._time += deltaTime;
        while (this._time >= this._duration) {
            this._time -= this._duration;
            this._ticked.dispatch(this);
        }
        requestAnimationFrame(this.update.bind(this));
    }
}
//# sourceMappingURL=timer.js.map