import { ISimpleEvent } from 'ste-simple-events';
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

export type Player = {
  get isAuthorized(): boolean;
  get hasNamePermission(): boolean;
  get hasPhotoPermission(): boolean;
  get name(): string;
  get photo(): { [key in 'small' | 'medium' | 'large']: string };
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

export type CanReviewResponse =
  | { value: true }
  | { value: false; reason: 'NO_AUTH' | 'GAME_RATED' | 'REVIEW_ALREADY_REQUESTED ' | 'REVIEW_WAS_REQUESTED' | 'UNKNOWN' };

export default abstract class SDKWrapper {
  private readonly _logName: string = '';

  protected constructor(logName: string) {
    this._logName = logName;
  }

  public abstract get contentPauseRequested(): ISimpleEvent<void>;
  public abstract get contentContinueRequested(): ISimpleEvent<void>;
  public abstract get adOpened(): ISimpleEvent<void>;
  public abstract get adClosed(): ISimpleEvent<boolean>;
  public abstract get rewardedRewardReceived(): ISimpleEvent<void>;

  public abstract get canShowAdOnLoading(): boolean;
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
  public abstract getPlayer(): Promise<Player>;

  public abstract sendAnalyticsEvent(eventName: string, data?: Record<string, any>): void;

  public abstract showInterstitial(): void;
  public abstract showRewarded(): void;

  public abstract canReview(): Promise<CanReviewResponse>;
  public abstract requestReview(): Promise<{ feedbackSent: boolean }>;

  public abstract getPurchasedProducts(): Promise<Purchase[] & Signature>;
  public abstract overrideProductsCatalog(catalog: Product[]): void;
  public abstract getProductCatalog(): Promise<Product[]>;
  public abstract purchaseProduct(productID: string, developerPayload?: string): Promise<{ purchaseData: Purchase } & Signature>;
  public abstract consumeProduct(purchasedProductToken: string): Promise<void>;

  public abstract setLeaderboardScore(leaderboardName: string, score: number, extraData?: string): Promise<void>;
  public abstract getLeaderboardEntries(
    leaderboardName: string,
    topPlayersCount?: IntRange<1, 21>,
    competingPlayersCount?: IntRange<1, 11>,
    includeSelf?: boolean
  ): Promise<LeaderboardEntries>;

  public abstract getFlags(params: FlagsParams): Promise<Record<string, string>>;

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

  protected log(...message: any): void {
    const style =
      'background: wheat; color: #1E324B; font-family: tahoma, verdana, helvetica, arial; font-size: 14px; font-weight: 900; text-align: center; padding: 6px 2px; border-radius: 6px; border: 2px solid #434975';

    console.log(`%c[${this._logName}]:`, style, ...message);
  }
}
