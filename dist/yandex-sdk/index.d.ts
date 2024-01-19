import { IntRange } from '../global';
import { Locale } from '../localization';
import SDKWrapper, { Player, DeviceInfo, Purchase, Signature, Product, FlagsParams, LeaderboardEntries, RewardedCallbacks, InterstitialCallbacks, CanReviewResponse } from '../sdk-wrapper';
import { YandexGamesSDK, Player as YPlayer, Payments, Leaderboards } from './yandex-sdk-definitions';
export default class YandexGamesSDKWrapper extends SDKWrapper {
    private readonly _sdk;
    private readonly _isDraft;
    private _player;
    private _yplayer;
    private _payments;
    private _leaderboards;
    private _isAuthorized;
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
    gameplayStart(): void;
    gameplayStop(): void;
    happyTime(): void;
    isMe(uniqueID: string): Promise<boolean>;
    authorizePlayer(): Promise<void>;
    getPlayer(): Promise<Player>;
    sendAnalyticsEvent(eventName: string, data?: Record<string, any>): void;
    showInterstitial(callbacks?: InterstitialCallbacks): void;
    showRewarded(callbacks?: RewardedCallbacks): void;
    canReview(): Promise<CanReviewResponse>;
    requestReview(): Promise<{
        feedbackSent: boolean;
    }>;
    getPlayerInternal(): Promise<YPlayer>;
    getPayments(): Promise<Payments>;
    getLeaderboards(): Promise<Leaderboards>;
    getPurchasedProducts(): Promise<Purchase[] & Signature>;
    overrideProductsCatalog(): void;
    getProductCatalog(): Promise<Product[]>;
    purchaseProduct(productID: string, developerPayload?: string): Promise<{
        purchaseData: Purchase;
    } & Signature>;
    consumeProduct(purchasedProductToken: string): Promise<void>;
    setLeaderboardScore(leaderboardName: string, score: number, extraData?: string): Promise<void>;
    getLeaderboardEntries(leaderboardName: string, topPlayersCount?: IntRange<1, 21>, competingPlayersCount?: IntRange<1, 11>, includeSelf?: boolean): Promise<LeaderboardEntries>;
    getFlags(params: FlagsParams): Promise<Record<string, string>>;
    getPlayerData(keys?: string[] | undefined): Promise<Record<string, any>>;
    setPlayerData(values: Record<string, any>): Promise<void>;
}
