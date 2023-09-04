import SDKWrapper, { DeviceInfo, InterstitialCallbacks, RewardedCallbacks } from './sdk-wrapper';
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
    private static _gettings;
    private static readonly _settingDataCooldown;
    static [STATIC_INIT](sdk: SDKWrapper): Promise<void>;
    static get adOpened(): import("ste-simple-events").ISimpleEvent<void>;
    static get adClosed(): import("ste-simple-events").ISimpleEvent<void>;
    static get rewardedAdReward(): import("ste-simple-events").ISimpleEvent<string>;
    static get deviceInfo(): DeviceInfo;
    static get isInitialized(): boolean;
    static waitInitialization(): Promise<void>;
    static sendAnalyticsEvent(eventName: string, data?: Record<string, any>): void;
    static showInterstitial(callbacks: InterstitialCallbacks): Promise<void>;
    static showRewarded(id: string, callbacks: RewardedCallbacks): Promise<void>;
    static getValues<T extends ([] | string[]) & (number extends T['length'] ? readonly string[] : unknown)>(keys: T, defaultValues: {
        [K in keyof T]: any;
    }): Promise<{
        [K in keyof T]: any;
    }>;
    static setValues(values: Record<string, any>): Promise<void>;
    static removeKeys(keys: string[]): Promise<void>;
    static removeKeyByPredicate(predicate: (key: string) => boolean): Promise<void>;
    private static getPlayerData;
    private static onDataGetted;
    private static setPlayerData;
    private static setPlayerDataRuntime;
}
export {};
