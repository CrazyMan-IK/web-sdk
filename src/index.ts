import SDK from './sdk';
import Localization, { Locale } from './localization';
import LocalizedString from './localization/localized-string';
import { musicPlayer } from './audio/music-player';
import Timer from './timer';

export default SDK;
export { Localization, Locale, LocalizedString, musicPlayer, Timer };
export * from './game-pause';
export * from './scaler';
