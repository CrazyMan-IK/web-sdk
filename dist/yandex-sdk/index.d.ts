import { IntRange } from '../global';
import { Locale } from '../localization';
import SDKWrapper, { DeviceInfo, InterstitialCallbacks, Purchase, Product, LeaderboardEntries } from '../sdk-wrapper';
export default class YandexGamesSDKWrapper extends SDKWrapper {
    private readonly _sdk;
    private _player;
    private _payments;
    private _leaderboards;
    private _isAuthorized;
    private _isDraft;
    constructor(sdk: YandexGamesSDK);
    get locale(): Locale;
    get lang(): string;
    get tld(): string;
    get id(): string;
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
    get isAuthorized(): boolean;
    get isDraft(): boolean;
    initialize(): Promise<void>;
    ready(): void;
    showInterstitial(callbacks?: InterstitialCallbacks): void;
    showRewarded(callbacks?: InterstitialCallbacks): void;
    getPlayer(): Promise<Player>;
    getPayments(): Promise<Payments>;
    getLeaderboards(): Promise<Leaderboards>;
    getPurchasedProducts(): Promise<Purchase[]>;
    getProductCatalog(): Promise<Product[]>;
    purchaseProduct(productID: string, developerPayload?: string): Promise<Purchase>;
    consumeProduct(purchasedProductToken: string): Promise<void>;
    setLeaderboardScore(leaderboardName: string, score: number, extraData?: string): Promise<void>;
    getLeaderboardEntries(leaderboardName: string, topPlayersCount?: IntRange<1, 21>, competingPlayersCount?: IntRange<1, 11>, includeSelf?: boolean): Promise<LeaderboardEntries>;
    getPlayerData(keys?: string[] | undefined): Promise<Record<string, any>>;
    setPlayerData(values: Record<string, any>): Promise<void>;
}
