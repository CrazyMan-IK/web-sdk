import { IntRange } from '../global';
export type Player = {
    readonly _personalInfo: {
        readonly scopePermissions: {
            readonly avatar: 'not_set' | 'forbid' | 'allow';
            readonly public_name: 'not_set' | 'forbid' | 'allow';
        };
    };
    getMode(): 'lite' | '';
    setData(data: Record<string, any>, flush?: boolean): Promise<void>;
    getData(keys?: string[]): Promise<Record<string, any>>;
    setStats(data: Record<string, number>): Promise<void>;
    getStats(keys?: string[]): Promise<Record<string, number>>;
    getName(): string;
    getPhoto(size: 'small' | 'medium' | 'large'): string;
    getUniqueID(): string;
    getIDsPerGame(): Promise<{
        appID: string;
        userID: string;
    }>;
};
export type Purchase = {
    readonly productID: string;
    readonly purchaseToken: string;
    readonly developerPayload: string;
    readonly signature: string;
};
export type Product = {
    readonly id: string;
    readonly title: string;
    readonly description: string;
    readonly imageURI: string;
    readonly price: string;
    readonly priceValue: string;
    readonly priceCurrencyCode: string;
    getPriceCurrencyImage(size: 'small' | 'medium' | 'svg'): string;
};
export type Payments = {
    purchase(options?: {
        id: string;
        developerPayload?: string;
    }): Promise<Purchase>;
    getPurchases(): Promise<Purchase[]>;
    getCatalog(): Promise<Product[]>;
    consumePurchase(purchasedProductToken: string): Promise<void>;
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
        readonly type: 'numeric' | 'time';
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
            readonly avatar: 'not_set' | 'forbid' | 'allow';
            readonly public_name: 'not_set' | 'forbid' | 'allow';
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
export type Leaderboards = {
    getLeaderboardDescription(leaderboardName: string): Promise<LeaderboardDescription>;
    setLeaderboardScore(leaderboardName: string, score: number, extraData?: string): Promise<void>;
    getLeaderboardPlayerEntry(leaderboardName: string): Promise<void>;
    getLeaderboardEntries(leaderboardName: string, options?: {
        includeUser?: boolean;
        quantityAround?: IntRange<1, 11>;
        quantityTop?: IntRange<1, 21>;
    }): Promise<LeaderboardEntries>;
};
export type YandexGamesSDK = {
    readonly features: {
        readonly LoadingAPI?: {
            ready(): void;
        };
    };
    readonly deviceInfo: {
        readonly type: string;
        isDesktop(): boolean;
        isMobile(): boolean;
        isTablet(): boolean;
        isTV(): boolean;
    };
    readonly adv: {
        showFullscreenAdv(params: {
            callbacks?: {
                onOpen?: () => void;
                onClose?: (wasShown: boolean) => void;
                onError?: (error: Error) => void;
                onOffline?: () => void;
            };
        }): void;
        showRewardedVideo(params: {
            callbacks?: {
                onOpen?: () => void;
                onRewarded?: () => void;
                onClose?: (wasShown: boolean) => void;
                onError?: (error: Error) => void;
            };
        }): void;
    };
    readonly auth: {
        openAuthDialog(): Promise<void>;
    };
    readonly feedback: {
        canReview(): Promise<{
            value: true;
        } | {
            value: false;
            reason: 'NO_AUTH' | 'GAME_RATED' | 'REVIEW_ALREADY_REQUESTED ' | 'REVIEW_WAS_REQUESTED' | 'UNKNOWN';
        }>;
        requestReview(): Promise<{
            feedbackSent: boolean;
        }>;
    };
    readonly environment: {
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
        readonly payload?: string;
    };
    getPlayer(options?: {
        scopes?: boolean;
        signed?: boolean;
    }): Promise<Player>;
    getPayments(options?: {
        signed?: boolean;
    }): Promise<Payments>;
    getLeaderboards(): Promise<Leaderboards>;
};
