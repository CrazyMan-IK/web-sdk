import { ISimpleEvent } from 'ste-simple-events';
import { IntRange } from './global';
import { Locale } from './localization';
export type Player = {
    get isAuthorized(): boolean;
    get hasNamePermission(): boolean;
    get hasPhotoPermission(): boolean;
    get name(): string;
    get photo(): {
        [key in 'small' | 'medium' | 'large']: string;
    };
    get uuid(): string;
};
export type Signature = {
    readonly signature: string;
};
export type Purchase = {
    readonly productID: string;
    readonly purchaseTime: number;
    readonly purchaseToken: string;
    readonly developerPayload?: string;
};
export type ProductMeta = {
    readonly name: string;
    readonly description: string;
};
export type Product = {
    readonly id: string;
    readonly meta: Record<'en' | 'ru', ProductMeta> & Partial<Record<'tr' | 'de', ProductMeta>>;
    readonly imageURI: string;
    readonly currencyImageURI: string;
    readonly svgCurrencyImageURI: string;
    readonly prices: Partial<Record<'YAN' | 'RUB' | 'USD' | 'EUR', number>>;
};
export type LeaderboardDescription = {
    readonly name: string;
    readonly dеfault: boolean;
    readonly description: {
        readonly invert_sort_order: boolean;
        readonly score_format: {
            readonly options: {
                readonly decimal_offset: number;
            };
        };
        readonly type: 'numeric' | 'time';
    };
};
export type LeaderboardEntry = {
    readonly score: number;
    readonly extraData: string;
    readonly rank: number;
    readonly player: Player;
    readonly formattedScore: string;
};
export type LeaderboardEntries = {
    readonly leaderboard: LeaderboardDescription;
    readonly ranges: {
        readonly start: number;
        readonly size: number;
    }[];
    readonly userRank: number;
    readonly entries: LeaderboardEntry[];
};
export type FlagsParams = {
    readonly defaultFlags?: Record<string, string>;
    readonly clientFeatures?: {
        readonly name: string;
        readonly value: string;
    }[];
};
export type DeviceInfo = {
    readonly type: string;
    isDesktop: () => boolean;
    isMobile: () => boolean;
    isTablet: () => boolean;
    isTV: () => boolean;
};
export type InterstitialCallbacks = {
    onOpen?: () => void;
    onClose?: (wasShown: boolean) => void;
    onError?: (error: Error) => void;
};
export type RewardedCallbacks = {
    onRewarded?: () => void;
} & InterstitialCallbacks;
export type CanReviewResponse = {
    value: true;
} | {
    value: false;
    reason: 'NO_AUTH' | 'GAME_RATED' | 'REVIEW_ALREADY_REQUESTED ' | 'REVIEW_WAS_REQUESTED' | 'UNKNOWN';
};
export default abstract class SDKWrapper {
    private readonly _logName;
    protected constructor(logName: string);
    abstract get contentPauseRequested(): ISimpleEvent<void>;
    abstract get contentContinueRequested(): ISimpleEvent<void>;
    abstract get adOpened(): ISimpleEvent<void>;
    abstract get adClosed(): ISimpleEvent<boolean>;
    abstract get rewardedRewardReceived(): ISimpleEvent<void>;
    abstract get canShowAdOnLoading(): boolean;
    abstract get locale(): Locale;
    abstract get lang(): string;
    abstract get tld(): string;
    abstract get id(): string;
    get deviceInfo(): DeviceInfo;
    abstract get isAuthorized(): boolean;
    abstract initialize(): Promise<void>;
    abstract ready(): void;
    abstract gameplayStart(): void;
    abstract gameplayStop(): void;
    abstract happyTime(): void;
    abstract isMe(uniqueID: string): Promise<boolean>;
    abstract authorizePlayer(): Promise<void>;
    abstract getPlayer(): Promise<Player>;
    abstract sendAnalyticsEvent(eventName: string, data?: Record<string, any>): void;
    abstract showInterstitial(): void;
    abstract showRewarded(): void;
    abstract canReview(): Promise<CanReviewResponse>;
    abstract requestReview(): Promise<{
        feedbackSent: boolean;
    }>;
    abstract getPurchasedProducts(): Promise<Purchase[] & Signature>;
    abstract overrideProductsCatalog(catalog: Product[]): void;
    abstract getProductCatalog(): Promise<Product[]>;
    abstract purchaseProduct(productID: string, developerPayload?: string): Promise<{
        purchaseData: Purchase;
    } & Signature>;
    abstract consumeProduct(purchasedProductToken: string): Promise<void>;
    abstract setLeaderboardScore(leaderboardName: string, score: number, extraData?: string): Promise<void>;
    abstract getLeaderboardEntries(leaderboardName: string, topPlayersCount?: IntRange<1, 21>, competingPlayersCount?: IntRange<1, 11>, includeSelf?: boolean): Promise<LeaderboardEntries>;
    abstract getFlags(params: FlagsParams): Promise<Record<string, string>>;
    getPlayerData(keys?: string[]): Promise<Record<string, any>>;
    setPlayerData(values: Record<string, any>): Promise<void>;
    protected log(...message: any): void;
}
