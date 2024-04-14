export type AdvertismentCallbacks = {
  adFinished(): void;
  adError(error: any, errorData: { reason: 'unfilled' | 'other'; message: '' }): void;
  adStarted(): void;
};

export type User = {
  readonly username: string;
  readonly profilePictureUrl: string;
};

export type SystemInformation = {
  readonly browser: {
    readonly name: string;
    readonly version: string;
  };
  readonly countryCode: string;
  readonly os: {
    readonly name: string;
    readonly version: string;
  };
};

export type InitializeObject = {
  readonly dataModule: {
    readonly isEnabled: boolean;
    readonly saveIntervalMs: number;
  };
  readonly debug: boolean;
  readonly disableBannerCheck: boolean;
  readonly gameId: string;
  readonly gameLink: string;
  readonly isQaTool: boolean;
  readonly locale: string;
  readonly rafvertizingUrl: string;
  readonly systemInfo: SystemInformation;
  readonly useTestAds: boolean;
  readonly userAccountAvailable: boolean;
  readonly userInfo: SystemInformation;
};

export type CrazyGamesSDK = {
  readonly ad: {
    requestAd(type: 'midgame' | 'rewarded', callbacks: AdvertismentCallbacks): void;
    hasAdblock(): Promise<boolean>;
  };

  readonly game: {
    sdkGameLoadingStart(): Promise<void>;
    sdkGameLoadingStop(): Promise<void>;
    gameplayStart(): Promise<void>;
    gameplayStop(): Promise<void>;
    happytime(): Promise<void>;
    inviteLink(params: Record<string, any>): Promise<string>;
    showInviteButton(params: Record<string, any>): Promise<string>;
    hideInviteButton(): Promise<void>;
    //setScreenshotHandler(): void;
    //setScreenshotHandlerAsync(): void;
  };

  readonly user: {
    isUserAccountAvailable(): Promise<boolean>;
    getSystemInfo(): Promise<SystemInformation>;
    getUser(): Promise<User>;
    getUserToken(): Promise<string>;
    //getXsollaUserToken(): Promise<void>;
    addScore(): Promise<void>; // ?
    addScoreEncrypted(): Promise<void>; // ?
    addAuthListener(listener: (user: User) => void): void;
    removeAuthListener(listener: (user: User) => void): void;
    showAccountLinkPrompt(): Promise<{ response: 'yes' | 'no' }>;
    showAuthPrompt(): Promise<User>;
  };

  readonly data: {
    clear(): void;
    getItem(key: string): string | null;
    setItem(key: string, value: string): void;
    removeItem(key: string): void;
  };

  init(): Promise<void>;
  addInitCallback(callback: (initObject: InitializeObject) => void): void;
};
