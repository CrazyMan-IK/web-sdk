import anime from 'animejs';
import { Howl } from 'howler';
import SFX from './sfx';
export default class MusicPlayer {
    _maxVolume;
    _sources = new Map();
    _sfxs = new Map();
    _oneTimeSFXs = new Map();
    //private readonly _sources: Map<string, Howl> = new Map();
    _current;
    _isMusicEnabled = true;
    _isSfxEnabled = true;
    constructor(maxVolume) {
        this._maxVolume = maxVolume;
    }
    EnableMusic() {
        this._isMusicEnabled = true;
        this._sources.forEach((value) => {
            //value.howl.play();
            value.howl.volume(1);
        });
    }
    DisableMusic() {
        this._isMusicEnabled = false;
        this._sources.forEach((value) => {
            //value.howl.pause();
            value.howl.volume(0);
        });
    }
    EnableSFX() {
        this._isSfxEnabled = true;
    }
    DisableSFX() {
        this._isSfxEnabled = false;
        this._sfxs.forEach((value) => {
            value.stop();
        });
        this._oneTimeSFXs.forEach((value) => {
            value.stop();
        });
    }
    SwitchTo(src, isLooped = true, speed = 0.25, killPrevious = true) {
        if (speed < 0) {
            throw new Error('ArgumentOutOfRangeException: speed');
        }
        if (src === this._current) {
            return;
        }
        if (this._current) {
            const howl = this._sources.get(this._current);
            if (howl) {
                const current = this._current;
                anime.remove(howl);
                anime({
                    targets: howl,
                    volume: 0,
                    duration: (1000 / speed) * howl.volume,
                    update: function () {
                        howl.howl.volume(howl.volume);
                    },
                    complete: () => {
                        if (!killPrevious) {
                            return;
                        }
                        howl.howl.stop();
                        this._sources.delete(current);
                    }
                });
            }
        }
        this._current = src;
        if (src) {
            const howl = this._sources.get(src);
            if (howl) {
                anime.remove(howl);
                anime({
                    targets: howl,
                    volume: this._maxVolume,
                    duration: (1000 / speed) * (this._maxVolume - howl.volume),
                    update: function () {
                        howl.howl.volume(howl.volume);
                    }
                });
            }
        }
        this.createHowl(src, this._maxVolume, isLooped, speed);
    }
    PlaySFX(src, volumeScale = 0.75, isLooped = false, fadeSpeed = 1.0 /*, Vector3 position = default*/) {
        if (!src) {
            return undefined;
        }
        let sfx = this._sfxs.get(src);
        if (sfx) {
            return sfx;
        }
        if (!this._isSfxEnabled) {
            return undefined;
        }
        if (!isLooped) {
            const oneTimeSFX = this._oneTimeSFXs.get(src);
            if (oneTimeSFX) {
                oneTimeSFX.play();
                return undefined;
            }
            const howl = new Howl({
                src: src,
                volume: volumeScale
            });
            howl.play();
            this._oneTimeSFXs.set(src, howl);
            return undefined;
        }
        const howl = this.createHowl(src, volumeScale, isLooped, fadeSpeed, true);
        if (!howl) {
            return undefined;
        }
        sfx = new SFX(howl.howl, src);
        /*{
              Position = position
          }*/
        this._sfxs.set(src, sfx);
        sfx.stopped.subscribe(this.onSFXStopped.bind(this));
        return sfx;
    }
    createHowl(src, volumeScale = 1, isLooped = true, speed = 0.25, isSfx = false) {
        if (!src) {
            return undefined;
        }
        const oldHowl = this._sources.get(src);
        if (oldHowl) {
            return oldHowl;
        }
        const result = {
            volume: 0,
            howl: new Howl({
                src: src,
                loop: isLooped,
                volume: 0
            })
        };
        anime({
            targets: result,
            volume: [0, volumeScale],
            duration: 1000 / speed,
            update: function () {
                result.howl.volume(result.volume);
            }
        });
        if (isSfx ? this._isSfxEnabled : this._isMusicEnabled) {
            result.howl.play();
        }
        this._sources.set(src, result);
        return result;
    }
    onSFXStopped(sfx) {
        sfx.stopped.unsubscribe(this.onSFXStopped);
        const howl = this._sources.get(sfx.src);
        if (!howl) {
            throw new Error('Unknown error');
        }
        this._sources.delete(sfx.src);
        this._sfxs.delete(sfx.src);
        anime.remove(howl);
        anime({
            targets: howl,
            volume: 0,
            duration: (1000 / 1) * howl.volume,
            update: function () {
                howl.howl.volume(howl.volume);
            },
            complete: function () {
                howl.howl.stop();
            }
        });
    }
}
const musicPlayer = new MusicPlayer(0.75);
export { musicPlayer };
//# sourceMappingURL=music-player.js.map