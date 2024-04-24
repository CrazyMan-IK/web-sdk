import { IntRange } from '../global';
import { Locale } from '../localization';
import SDKWrapper, { Player, Purchase, Signature, Product, LeaderboardEntries, CanReviewResponse, FlagsParams } from '../sdk-wrapper';
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
    private readonly _adErrorReceived;
    private readonly _adStartedReceived;
    private readonly _adCompletedReceived;
    private readonly _gamePauseReceived;
    private readonly _gameStartReceived;
    private readonly _rewardedRewardReceived;
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
    get contentPauseRequested(): import("ste-simple-events").ISimpleEvent<void>;
    get contentContinueRequested(): import("ste-simple-events").ISimpleEvent<void>;
    get adOpened(): import("ste-simple-events").ISimpleEvent<void>;
    get adClosed(): import("ste-simple-events").ISimpleEvent<boolean>;
    get rewardedRewardReceived(): import("ste-simple-events").ISimpleEvent<void>;
    get canShowAdOnLoading(): boolean;
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
    showInterstitial(): void;
    showRewarded(): void;
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
    getFlags(params: FlagsParams): Promise<Record<string, string>>;
}
