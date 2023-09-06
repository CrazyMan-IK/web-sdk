import { EventDispatcher, IEvent } from 'ste-events';

export default class Timer {
  private _ticked: EventDispatcher<Timer, void> = new EventDispatcher<Timer, void>();

  private _duration: number;
  private _time: number = 0;
  private _isPaused: boolean = false;

  constructor(duration: number) {
    this._duration = duration;

    requestAnimationFrame(this.update.bind(this));
  }

  public get ticked(): IEvent<Timer, void> {
    return this._ticked.asEvent();
  }

  public get duration(): number {
    return this._duration;
  }

  public set duration(value: number) {
    if (value <= 0) {
      throw new Error('ArgumentOutOfRangeException: value');
    }

    if (this._duration !== value) {
      this._duration = value;
    }
  }

  public get tickedTime(): number {
    return this._time;
  }

  public get timeLeft(): number {
    return this._duration - this._time;
  }

  public get timeLeftPercentage(): number {
    return this._time / this._duration;
  }

  public get isPaused(): boolean {
    return this._isPaused;
  }

  public start(): void {
    this._isPaused = false;

    requestAnimationFrame(this.update.bind(this));
  }

  public pause(): void {
    this._isPaused = true;
  }

  public reset(): void {
    this._time = 0;
  }

  public stop(): void {
    this.pause();
    this.reset();
  }

  private update(deltaTime: number): void {
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
