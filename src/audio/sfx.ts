import { Howl } from 'howler';
import { EventDispatcher } from 'ste-events';

export default class SFX {
  private readonly _stopped: EventDispatcher<SFX, void> = new EventDispatcher();
  private readonly _howl: Howl;
  private readonly _src: string | string[];

  constructor(howl: Howl, src: string | string[]) {
    this._howl = howl;
    this._src = src;
  }

  public get stopped() {
    return this._stopped.asEvent();
  }

  public get src() {
    return this._src;
  }

  public stop(): void {
    this._stopped.dispatch(this);
  }
}
