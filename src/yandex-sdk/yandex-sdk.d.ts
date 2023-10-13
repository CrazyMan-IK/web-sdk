import { IntRange } from '../global';

declare global {
  class Player {
    public getMode(): 'lite' | '';

    public setData(data: Record<string, any>, flush?: boolean): Promise<void>;
    public getData(keys?: string[]): Promise<Record<string, any>>;
    public setStats(data: Record<string, number>): Promise<void>;
    public getStats(keys?: string[]): Promise<Record<string, number>>;

    public getName(): string;
    public getPhoto(size: 'small' | 'medium' | 'large'): string;
    public getUniqueID(): string;
    public getIDsPerGame(): Promise<{ appID: string; userID: string }>;
  }

  class Purchase {
    public readonly productID: string;
    public readonly purchaseToken: string;
    public readonly developerPayload: string;
    public readonly signature: string;
  }

  class Product {
    public readonly id: string;
    public readonly title: string;
    public readonly description: string;
    public readonly imageURI: string;
    public readonly price: string;
    public readonly priceValue: string;
    public readonly priceCurrencyCode: string;

    public getPriceCurrencyImage(size: 'small' | 'medium' | 'svg'): string;
  }

  class Payments {
    public purchase(options?: { id: string; developerPayload?: string }): Promise<Purchase>;
    public getPurchases(): Promise<Purchase[]>;
    public getCatalog(): Promise<Product[]>;
    public consumePurchase(purchasedProductToken: string): Promise<void>;
  }

  class LeaderboardDescription {
    public readonly appID: string;
    public readonly dеfault: boolean;

    public readonly description: {
      readonly invert_sort_order: boolean;

      readonly score_format: {
        readonly options: {
          readonly decimal_offset: number;
        };
      };

      readonly type: string;
    };

    public readonly name: string;

    public readonly title: {
      readonly en: string;
      readonly ru: string;
    };
  }

  class LeaderboardEntry {
    public readonly score: number;
    public readonly extraData: string;
    public readonly rank: number;

    public readonly player: {
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

    public readonly formattedScore: string;
  }

  class LeaderboardEntries {
    public readonly leaderboard: LeaderboardDescription;
    public readonly ranges: {
      readonly start: number;
      readonly size: number;
    }[];
    public readonly userRank: number;
    public readonly entries: LeaderboardEntry[];
  }

  class Leaderboards {
    public getLeaderboardDescription(leaderboardName: string): Promise<LeaderboardDescription>;
    public setLeaderboardScore(leaderboardName: string, score: number, extraData?: string): Promise<void>;
    public getLeaderboardPlayerEntry(leaderboardName: string): Promise<void>;
    public getLeaderboardEntries(
      leaderboardName: string,
      options?: { includeUser?: boolean; quantityAround?: IntRange<1, 11>; quantityTop?: IntRange<1, 21> }
    ): Promise<LeaderboardEntries>;
  }

  class YandexGamesSDK {
    public readonly features: {
      readonly LoadingAPI?: {
        ready: () => void;
      };
    };

    public readonly deviceInfo: {
      readonly type: string;
      isDesktop: () => boolean;
      isMobile: () => boolean;
      isTablet: () => boolean;
      isTV: () => boolean;
    };

    public readonly adv: {
      showFullscreenAdv: (params: {
        callbacks?: { onOpen?: () => void; onClose?: (wasShown: boolean) => void; onError?: (error: Error) => void; onOffline?: () => void };
      }) => void;
      showRewardedVideo: (params: {
        callbacks?: { onOpen?: () => void; onRewarded?: () => void; onClose?: (wasShown: boolean) => void; onError?: (error: Error) => void };
      }) => void;
    };

    public readonly environment: {
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

    public getPlayer(options?: { scopes?: boolean; signed?: boolean }): Promise<Player>;
    public getPayments(options?: { signed?: boolean }): Promise<Payments>;
    public getLeaderboards(): Promise<Leaderboards>;
  }

  interface Window {
    ym(counterId: number, arg: string, eventName: string, data?: Record<string, any>): void;
    yandexMetricaCounterId: number;
  }
}
