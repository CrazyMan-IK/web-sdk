import { IntRange } from '../global';
import { Locale } from '../localization';
import SDKWrapper, { Player, InterstitialCallbacks, Purchase, Signature, Product, LeaderboardEntries, RewardedCallbacks, CanReviewResponse } from '../sdk-wrapper';
import { VKPlaySDK } from './vk-play-sdk-definitions';
type VKError = {
    status: 'error';
    errcode: number;
    errmsg: string;
};
type UserInfo = {
    status: 'ok';
    uid: number;
    hash: string;
};
type BaseUserProfile = {
    nick: string;
    slug: string;
    avatar: string;
};
type CommonUserProfile = BaseUserProfile & {
    uid: number;
};
type SocialUserProfile = BaseUserProfile & {
    online: number;
};
type ExtendedUserProfile = CommonUserProfile & {
    birthyear: string;
    sex: 'male' | 'female';
};
type CallbacksContainer = {
    readonly appid: string;
    getLoginStatusCallback(status: {
        status: 'ok';
        loginStatus: 0 | 1 | 2 | 3;
    } | VKError): void;
    registerUserCallback(info: UserInfo | VKError): void;
    getAuthTokenCallback(token: {
        status: 'ok';
        uid: number;
        hash: string;
    } | VKError): void;
    userInfoCallback(info: UserInfo | VKError): void;
    adsCallback(context: {
        type: 'adCompleted' | 'adDismissed';
    } | {
        type: 'adError';
        code: 'UndefinedAdError' | 'AdblockDetectedAdError' | 'WaterfallConfigLoadFailed';
    }): void;
    paymentWaitCallback(data: any): void;
    paymentReceivedCallback(data: {
        uid: number;
    }): void;
    paymentWindowClosedCallback(): void;
    confirmWindowClosedCallback(): void;
    userConfirmCallback(): void;
    getGameInventoryItems(): void;
    userProfileCallback(profile: ({
        status: 'ok';
    } & ExtendedUserProfile) | VKError): void;
    userFriendsCallback(data: {
        status: 'ok';
        friends: CommonUserProfile[];
    } | VKError): void;
    userSocialFriendsCallback(data: {
        status: 'ok';
        friends: SocialUserProfile[];
    } | VKError): void;
};
declare global {
    interface Window {
        iframeApi(myApi: CallbacksContainer, options: {
            debug: boolean;
        }): Promise<VKPlaySDK>;
    }
}
export default class VKPlaySDKWrapper extends SDKWrapper {
    private readonly _getLoginStatusCallbackReceived;
    private readonly _registerUserCallbackReceived;
    private readonly _getAuthTokenCallbackReceived;
    private readonly _userInfoCallbackReceived;
    private readonly _adsCallbackReceived;
    private readonly _paymentCompletedCallbackReceived;
    private readonly _confirmWindowClosedCallbackReceived;
    private readonly _userConfirmCallbackReceived;
    private readonly _getGameInventoryItemsReceived;
    private readonly _userProfileCallbackReceived;
    private readonly _userFriendsCallbackReceived;
    private readonly _userSocialFriendsCallbackReceived;
    private readonly _overridedProductsCatalog;
    private readonly _isDraft;
    private readonly _appID;
    private readonly _lang;
    private readonly _callbacks;
    private _player;
    private _sdk;
    private _playerInfo;
    private _isAuthorized;
    constructor();
    get locale(): Locale;
    get lang(): string;
    get tld(): string;
    get id(): string;
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
    getPurchasedProducts(): Promise<Purchase[] & Signature>;
    overrideProductsCatalog(catalog: Product[]): void;
    getProductCatalog(): Promise<Product[]>;
    purchaseProduct(productID: string, developerPayload?: string): Promise<{
        purchaseData: Purchase;
    } & Signature>;
    consumeProduct(purchasedProductToken: string): Promise<void>;
    setLeaderboardScore(leaderboardName: string, score: number, extraData?: string): Promise<void>;
    getLeaderboardEntries(leaderboardName: string, topPlayersCount?: IntRange<1, 21>, competingPlayersCount?: IntRange<1, 11>, includeSelf?: boolean): Promise<LeaderboardEntries>;
}
export {};
