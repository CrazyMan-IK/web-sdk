import SFX from './sfx';
export default class MusicPlayer {
    private readonly _maxVolume;
    private readonly _sources;
    private readonly _sfxs;
    private readonly _oneTimeSFXs;
    private _current?;
    private _isMusicEnabled;
    private _isSfxEnabled;
    constructor(maxVolume: number);
    EnableMusic(): void;
    DisableMusic(): void;
    EnableSFX(): void;
    DisableSFX(): void;
    SwitchTo(src?: string | string[], isLooped?: boolean, speed?: number, killPrevious?: boolean): void;
    PlaySFX(src: string | string[], volumeScale?: number, isLooped?: boolean, pitch?: number, fadeSpeed?: number): SFX | undefined;
    private createHowl;
    private onSFXStopped;
}
declare const musicPlayer: MusicPlayer;
export { musicPlayer };
