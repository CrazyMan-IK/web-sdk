import { IntRange } from './global';
import { Locale } from './localization';
export type Purchase = {
    readonly productID: string;
    readonly purchaseToken: string;
    readonly developerPayload: string;
    readonly signature: string;
};
export type Product = {
    readonly id: string;
    readonly imageURI: string;
    readonly price: string;
};
export type LeaderboardDescription = {
    readonly appID: string;
    readonly dеfault: boolean;
    readonly description: {
        readonly invert_sort_order: boolean;
        readonly score_format: {
            readonly options: {
                readonly decimal_offset: number;
            };
        };
        readonly type: string;
    };
    readonly name: string;
    readonly title: {
        readonly en: string;
        readonly ru: string;
    };
};
export type LeaderboardEntry = {
    readonly score: number;
    readonly extraData: string;
    readonly rank: number;
    readonly player: {
        readonly lang: string;
        readonly publicName: string;
        readonly scopePermissions: {
            readonly avatar: string;
            readonly public_name: string;
        };
        readonly uniqueID: string;
        getAvatarSrc(size: 'small' | 'medium' | 'large'): string;
        getAvatarSrcSet(size: 'small' | 'medium' | 'large'): string;
    };
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
export default abstract class SDKWrapper {
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
    abstract sendAnalyticsEvent(eventName: string, data?: Record<string, any>): void;
    abstract showInterstitial(callbacks?: InterstitialCallbacks): void;
    abstract showRewarded(callbacks?: RewardedCallbacks): void;
    abstract canReview(): Promise<boolean>;
    abstract requestReview(): Promise<{
        feedbackSent: boolean;
    }>;
    abstract getPurchasedProducts(): Promise<Purchase[]>;
    abstract getProductCatalog(): Promise<Product[]>;
    abstract purchaseProduct(productID: string, developerPayload?: string): Promise<Purchase>;
    abstract consumeProduct(purchasedProductToken: string): Promise<void>;
    abstract setLeaderboardScore(leaderboardName: string, score: number, extraData?: string): Promise<void>;
    abstract getLeaderboardEntries(leaderboardName: string, topPlayersCount?: IntRange<1, 21>, competingPlayersCount?: IntRange<1, 11>, includeSelf?: boolean): Promise<LeaderboardEntries>;
    getPlayerData(keys?: string[]): Promise<Record<string, any>>;
    setPlayerData(values: Record<string, any>): Promise<void>;
}
