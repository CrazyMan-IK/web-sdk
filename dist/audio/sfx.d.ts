import { Howl } from 'howler';
export default class SFX {
    private readonly _stopped;
    private readonly _howl;
    private readonly _src;
    constructor(howl: Howl, src: string | string[]);
    get stopped(): import("ste-events").IEvent<SFX, void>;
    get src(): string | string[];
    stop(): void;
}
