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

  public get deviceInfo(): DeviceInfo {
    return {
      type: 'desktop',
      isDesktop: () => true,
      isMobile: () => false,
      isTablet: () => false,
      isTV: () => false
    };
  }

  public abstract initialize(): Promise<void>;
  public abstract ready(): void;

  public abstract showInterstitial(callbacks?: InterstitialCallbacks): void;
  public abstract showRewarded(callbacks?: RewardedCallbacks): void;

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
