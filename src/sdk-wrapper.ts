import { IntRange } from './global';
import { Locale } from './localization';

function getLocalStorageItem(key: string) {
  try {
    return localStorage.getItem(key);
  } catch {
    return null;
  }
}

function setLocalStorageItem(key: string, value: string) {
  try {
    localStorage.setItem(key, value);
  } catch {
    return;
  }
}

export type Purchase = {
  readonly productID: string;
  readonly purchaseToken: string;
  readonly developerPayload?: string;
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
  public abstract get locale(): Locale;
  public abstract get lang(): string;
  public abstract get tld(): string;
  public abstract get id(): string;

  public get deviceInfo(): DeviceInfo {
    return {
      type: 'desktop',
      isDesktop: () => true,
      isMobile: () => false,
      isTablet: () => false,
      isTV: () => false
    };
  }

  public abstract get isAuthorized(): boolean;

  public abstract initialize(): Promise<void>;
  public abstract ready(): void;
  public abstract gameplayStart(): void;
  public abstract gameplayStop(): void;
  public abstract happyTime(): void;

  public abstract isMe(uniqueID: string): Promise<boolean>;
  public abstract authorizePlayer(): Promise<void>;

  public abstract sendAnalyticsEvent(eventName: string, data?: Record<string, any>): void;

  public abstract showInterstitial(callbacks?: InterstitialCallbacks): void;
  public abstract showRewarded(callbacks?: RewardedCallbacks): void;

  public abstract canReview(): Promise<boolean>;
  public abstract requestReview(): Promise<{ feedbackSent: boolean }>;

  public abstract getPurchasedProducts(): Promise<Purchase[]>;
  public abstract getProductCatalog(): Promise<Product[]>;
  public abstract purchaseProduct(productID: string, developerPayload?: string): Promise<Purchase>;
  public abstract consumeProduct(purchasedProductToken: string): Promise<void>;

  public abstract setLeaderboardScore(leaderboardName: string, score: number, extraData?: string): Promise<void>;
  public abstract getLeaderboardEntries(
    leaderboardName: string,
    topPlayersCount?: IntRange<1, 21>,
    competingPlayersCount?: IntRange<1, 11>,
    includeSelf?: boolean
  ): Promise<LeaderboardEntries>;

  public async getPlayerData(keys?: string[]): Promise<Record<string, any>> {
    const data = JSON.parse(getLocalStorageItem('DATA') ?? '{}');

    if (keys === undefined) {
      return data;
    }

    const result: Record<string, any> = {};

    for (const key of keys) {
      result[key] = data[key];
    }

    return result;
  }

  public async setPlayerData(values: Record<string, any>): Promise<void> {
    setLocalStorageItem('DATA', JSON.stringify(values));
  }
}
