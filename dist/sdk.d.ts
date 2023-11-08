import { IntRange } from './global';
import SDKWrapper, { Player, Purchase, Signature, Product, LeaderboardEntries, DeviceInfo, InterstitialCallbacks, RewardedCallbacks, CanReviewResponse } from './sdk-wrapper';
declare const STATIC_INIT: unique symbol;
export default abstract class SDK {
    private static readonly _adOpened;
    private static readonly _adClosed;
    private static readonly _initialized;
    private static readonly _rewardedAdReward;
    private static _sdk;
    private static _prefs?;
    private static _settingPromise?;
    private static _settingTimeout?;
    private static _nextData?;
    private static _isInitialized;
    private static _isGettingData;
    private static _isAdOpened;
    private static _gettings;
    private static readonly _settingDataCooldown;
    static [STATIC_INIT](sdk: SDKWrapper): Promise<void>;
    static get adOpened(): import("ste-simple-events").ISimpleEvent<void>;
    static get adClosed(): import("ste-simple-events").ISimpleEvent<void>;
    static get rewardedAdReward(): import("ste-simple-events").ISimpleEvent<string>;
    static get isAuthorized(): boolean;
    static get tld(): string;
    static get lang(): string;
    static get id(): string;
    static get deviceInfo(): DeviceInfo;
    static get isInitialized(): boolean;
    static get isAdOpened(): boolean;
    static waitInitialization(): Promise<void>;
    static isMe(uniqueID: string): Promise<boolean>;
    static authorizePlayer(): Promise<void>;
    static getPlayer(): Promise<Player>;
    static sendAnalyticsEvent(eventName: string, data?: Record<string, any>): void;
    static showInterstitial(callbacks?: InterstitialCallbacks): Promise<void>;
    static showRewarded(id: string, callbacks?: RewardedCallbacks): Promise<void>;
    static canReview(): Promise<CanReviewResponse>;
    static requestReview(): Promise<{
        feedbackSent: boolean;
    }>;
    static getPurchasedProducts(): Promise<Purchase[] & Signature>;
    static overrideProductsCatalog(catalog: Product[]): void;
    static getProductCatalog(): Promise<Product[]>;
    static purchaseProduct(productId: string, developerPayload?: string): Promise<{
        purchaseData: Purchase;
    } & Signature>;
    static consumeProduct(purchasedProductToken: string): Promise<void>;
    static setLeaderboardScore(leaderboardName: string, score: number, extraData?: string): Promise<void>;
    static getLeaderboardEntries(leaderboardName: string, topPlayersCount?: IntRange<1, 21>, competingPlayersCount?: IntRange<1, 11>, includeSelf?: boolean): Promise<LeaderboardEntries>;
    static getAllValues(): Promise<Record<string, any>>;
    static getValues<T extends ([] | string[]) & (number extends T['length'] ? readonly string[] : unknown)>(keys: T, defaultValues: {
        [K in keyof T]: any;
    }): Promise<{
        [K in keyof T]: any;
    }>;
    static setAllValues(values: Record<string, any>): Promise<void>;
    static setValues(values: Record<string, any>): Promise<void>;
    static removeKeys(keys: string[]): Promise<void>;
    static removeKeyByPredicate(predicate: (key: string) => boolean): Promise<void>;
    private static getPlayerData;
    private static onDataGetted;
    private static setPlayerData;
    private static setPlayerDataRuntime;
}
export {};
