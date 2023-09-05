import { Locale } from '../localization';
import SDKWrapper, { DeviceInfo, InterstitialCallbacks } from '../sdk-wrapper';
export default class YandexGamesSDKWrapper extends SDKWrapper {
    private readonly _sdk;
    private _player;
    private _isAuthorized;
    private _isDraft;
    constructor(sdk: YandexGamesSDK);
    get locale(): Locale;
    get deviceInfo(): DeviceInfo;
    get environment(): {
        readonly app: {
            readonly id: string;
        };
        readonly browser: {
            readonly lang: string;
        };
        readonly i18n: {
            readonly lang: string;
            readonly tld: string;
        };
        readonly payload?: string | undefined;
    };
    get isDraft(): boolean;
    initialize(): Promise<void>;
    ready(): void;
    showInterstitial(callbacks?: InterstitialCallbacks): void;
    showRewarded(callbacks?: InterstitialCallbacks): void;
    getPlayer(): Promise<Player>;
    getPlayerData(keys?: string[] | undefined): Promise<Record<string, any>>;
    setPlayerData(values: Record<string, any>): Promise<void>;
}
