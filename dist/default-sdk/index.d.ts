import { IntRange } from '../global';
import { Locale } from '../localization';
import SDKWrapper, { Player, InterstitialCallbacks, Purchase, Product, LeaderboardEntries, RewardedCallbacks, CanReviewResponse } from '../sdk-wrapper';
export default class DefaultSDKWrapper extends SDKWrapper {
    static readonly UniquePlayerID: string;
    private readonly _overridedProductsCatalog;
    private readonly _lang;
    private readonly _tld;
    private readonly _isDraft;
    private _isAuthorized;
    constructor();
    get locale(): Locale;
    get lang(): string;
    get tld(): string;
    get id(): string;
    get isAuthorized(): boolean;
    initialize(): Promise<void>;
    ready(): void;
    gameplayStart(): void;
    gameplayStop(): void;
    happyTime(): void;
    isMe(uniqueID: string): Promise<boolean>;
    authorizePlayer(): Promise<void>;
    getPlayer(): Promise<Player>;
    sendAnalyticsEvent(eventName: string, data?: Record<string, any> | undefined): void;
    showInterstitial(callbacks?: InterstitialCallbacks): void;
    showRewarded(callbacks?: RewardedCallbacks): void;
    canReview(): Promise<CanReviewResponse>;
    requestReview(): Promise<{
        feedbackSent: boolean;
    }>;
    getPurchasedProducts(): Promise<Purchase[]>;
    overrideProductsCatalog(catalog: Product[]): void;
    getProductCatalog(): Promise<Product[]>;
    purchaseProduct(productID: string, developerPayload?: string): Promise<Purchase>;
    consumeProduct(purchasedProductToken: string): Promise<void>;
    setLeaderboardScore(leaderboardName: string, score: number, extraData?: string): Promise<void>;
    getLeaderboardEntries(leaderboardName: string, topPlayersCount?: IntRange<1, 21>, competingPlayersCount?: IntRange<1, 11>, includeSelf?: boolean): Promise<LeaderboardEntries>;
}
