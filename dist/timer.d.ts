import { IEvent } from 'ste-events';
export default class Timer {
    private _ticked;
    private _duration;
    private _time;
    private _isPaused;
    constructor(duration: number);
    get ticked(): IEvent<Timer, void>;
    get duration(): number;
    set duration(value: number);
    get tickedTime(): number;
    get timeLeft(): number;
    get timeLeftPercentage(): number;
    get isPaused(): boolean;
    start(): void;
    pause(): void;
    reset(): void;
    stop(): void;
    private update;
}
