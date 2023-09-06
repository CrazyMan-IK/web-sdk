import SDK from './sdk';
import Localization, { Locale } from './localization';
import LocalizedString from './localization/localized-string';
import MusicPlayer, { musicPlayer } from './audio/music-player';
import Timer from './timer';
import Scaler from './scaler';

export default SDK;
export { Localization, Locale, LocalizedString, MusicPlayer, musicPlayer, Timer, Scaler };
export * from './game-pause';
