declare class Player {
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

declare class YandexGamesSDK {
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
}

interface Window {
  ym(counterId: number, arg: string, eventName: string, data?: Record<string, any>): void;
  yandexMetricaCounterId: number;
}
