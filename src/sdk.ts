import { SimpleEventDispatcher } from 'ste-simple-events';
import { IntRange } from './global';
import Localization from './localization';
import SDKWrapper, { Player, Purchase, Signature, Product, LeaderboardEntries, DeviceInfo, CanReviewResponse, FlagsParams } from './sdk-wrapper';

const STATIC_INIT = Symbol();

declare const window: {
  externalReady?: boolean;
  showAdOnLoading?: boolean;
} & Window;

export default abstract class SDK {
  private static readonly _contentPauseRequested: SimpleEventDispatcher<void> = new SimpleEventDispatcher();
  private static readonly _contentContinueRequested: SimpleEventDispatcher<void> = new SimpleEventDispatcher();
  private static readonly _initialized: SimpleEventDispatcher<void> = new SimpleEventDispatcher();
  private static readonly _rewardedAdReward: SimpleEventDispatcher<string> = new SimpleEventDispatcher();

  private static _sdk: SDKWrapper;

  private static _prefs?: Record<string, any> = undefined;
  private static _settingPromise?: Promise<void> = undefined;
  private static _settingTimeout?: NodeJS.Timeout = undefined;
  private static _nextData?: Record<string, any> = undefined;
  private static _currentRewardedID: string = '';
  private static _isInitialized: boolean = false;
  private static _isGettingData: boolean = false;
  private static _isAdOpened: boolean = false;

  private static _gettings: Map<[string[], Record<number, any>] | null, (value: any[]) => void> = new Map();

  private static readonly _settingDataCooldown: number = 2;
  /*private _startDelay: number = 0.25;
  private _isPlayerAuthorized: boolean = true;
  private _showFakeAdvertisement: boolean = true;
  private _locale: string = 'ru';*/
  //Locale.private _debugProducts: CatalogProduct[] = [];

  public static async [STATIC_INIT](sdk: SDKWrapper): Promise<void> {
    if (this._isInitialized) {
      return;
    }

    this._sdk = sdk;

    await this._sdk.initialize();

    this._sdk.contentPauseRequested.subscribe(this._contentPauseRequested.dispatch.bind(this._contentPauseRequested));
    this._sdk.contentContinueRequested.subscribe(this._contentContinueRequested.dispatch.bind(this._contentContinueRequested));
    this._sdk.adOpened.subscribe(this.onAdOpened.bind(this));
    this._sdk.adClosed.subscribe(this.onAdClosed.bind(this));
    this._sdk.rewardedRewardReceived.subscribe(this.onRewardedRewardReceived.bind(this));

    /*let lang = YandexGamesSdk.Environment.i18n.lang;
    switch (lang) {
      case 'ru':
      case 'be':
      case 'kk':
      case 'uk':
      case 'uz':
        lang = Locale.Russian;
        break;
      case 'tr':
        lang = Locale.Turkish;
        break;
      case 'de':
        lang = Locale.Deutsch;
        break;
      default:
        lang = Locale.English;
        break;
    }*/

    //Localization.locale = lang;
    Localization.locale = this._sdk.locale;

    await this.getPlayerData();

    if (this._sdk.canShowAdOnLoading && window.showAdOnLoading && !this._prefs?.ADS_DISABLED) {
      this.getFlags({ defaultFlags: { ad_show_startup: 'true' } }).then((values) => {
        if (values['ad_show_startup'] == 'true') {
          this.showInterstitial();
        }
      });
    }

    window.addEventListener('beforeunload', () => {
      if (!this._prefs) {
        return;
      }

      if (!this._settingTimeout && !this._settingPromise) {
        return;
      }

      clearTimeout(this._settingTimeout);
      this._settingTimeout = undefined;
      this._settingPromise = undefined;

      /* let isWorking = true;
      try {
        this._sdk.setPlayerData(this._prefs).finally(() => (isWorking = false));
      } finally {
        isWorking = false;
      }

      while (isWorking); */

      /* if (navigator.sendBeacon && this._sdk instanceof YandexGamesSDKWrapper) {
        navigator.sendBeacon(
          `https://games-sdk.yandex.ru/games/api/sdk/v1/player/data?${this._sdk.isDraft ? 'draft=true&' : ''}app-id=${this._sdk.environment.app.id}`,
          JSON.stringify(this._prefs)
        );
      } */
    });

    let lastCShiftTime = 0;
    window.addEventListener('keydown', (e) => {
      if (e.ctrlKey && e.shiftKey && e.code == 'ShiftRight') {
        if (e.timeStamp - lastCShiftTime > 250) {
          lastCShiftTime = e.timeStamp;

          return;
        }

        console.log('DATA RESETED');

        this.removeKeyByPredicate(() => true);
      }
    });

    this._isInitialized = true;

    this._initialized.dispatch();

    //setLocalStorageItem('DATA', JSON.stringify(this._prefs));

    if (!window.externalReady) {
      this.ready();
    }

    /*if (this._sdk.isAdOpened) {
      this._adOpened.dispatch();
      while (this._sdk.isAdOpened) {
        await new Promise((resolve) => setTimeout(resolve, 0));
      }
      this._adClosed.dispatch();
    }*/
  }

  public static get contentPauseRequested() {
    return this._contentPauseRequested.asEvent();
  }

  public static get contentContinueRequested() {
    return this._contentContinueRequested.asEvent();
  }

  public static get rewardedAdReward() {
    return this._rewardedAdReward.asEvent();
  }

  public static get currentSdkName(): string {
    return this._sdk.name;
  }

  public static get isAuthorized(): boolean {
    return this._sdk.isAuthorized;
  }

  public static get tld(): string {
    return this._sdk.tld;
  }

  public static get lang(): string {
    return this._sdk.lang;
  }

  public static get id(): string {
    return this._sdk.id;
  }

  public static get deviceInfo(): DeviceInfo {
    return this._sdk.deviceInfo;
  }

  public static get isInitialized(): boolean {
    return this._isInitialized;
  }

  public static get isAdOpened(): boolean {
    return this._isAdOpened;
  }

  public static async waitInitialization(): Promise<void> {
    if (this._isInitialized) {
      return Promise.resolve();
    }

    const promise = new Promise<void>((resolve) => {
      this._initialized.one(() => {
        resolve();
      });
    });

    /* const promise = new Promise<void>((resolve) => {
      const loop = () => {
        if (this._isInitialized) {
          resolve();

          return;
        }

        setTimeout(loop, 50);
      };

      loop();
    }); */

    return promise;
  }

  public static ready(): void {
    this._sdk.ready();
  }

  public static async isMe(uniqueID: string): Promise<boolean> {
    return this._sdk.isMe(uniqueID);
  }

  public static gameplayStart(): void {
    this._sdk.gameplayStart();
  }

  public static gameplayStop(): void {
    this._sdk.gameplayStop();
  }

  public static happyTime(): void {
    this._sdk.happyTime();
  }

  public static async authorizePlayer(): Promise<void> {
    return this._sdk.authorizePlayer();
  }

  public static async getPlayer(): Promise<Player> {
    return this._sdk.getPlayer();
  }

  public static sendAnalyticsEvent(eventName: string, data?: Record<string, any>): void {
    this._sdk.sendAnalyticsEvent(eventName, data);
  }

  public static requestAdPreload(adType: 'interstitial' | 'rewarded'): void {
    //this._sdk.tryRequestAdPreload
  }

  public static showInterstitial(): boolean {
    if (this._isAdOpened) {
      return false;
    }

    this._sdk.showInterstitial(/* {
      onOpen: () => {
        this._isAdOpened = true;

        callbacks?.onOpen?.();
        this._adOpened.dispatch();
      },
      onClose: (wasShown) => {
        this._isAdOpened = false;

        callbacks?.onClose?.(wasShown);
        this._adClosed.dispatch();
      },
      onError: callbacks?.onError
    } */);

    return true;
  }

  public static showRewarded(id: string): boolean {
    if (this._isAdOpened) {
      return false;
    }

    this._currentRewardedID = id;

    this._sdk.showRewarded(/* {
      onOpen: () => {
        this._isAdOpened = true;

        callbacks?.onOpen?.();
        this._adOpened.dispatch();
      },
      onRewarded: () => {
        callbacks?.onRewarded?.();
        this._rewardedAdReward.dispatch(id);
      },
      onClose: (wasShown) => {
        this._isAdOpened = false;

        callbacks?.onClose?.(wasShown);
        this._adClosed.dispatch();
      },
      onError: callbacks?.onError
    } */);

    return true;
  }

  public static async canReview(): Promise<CanReviewResponse> {
    return this._sdk.canReview();
  }

  public static async requestReview(): Promise<{ feedbackSent: boolean }> {
    return this._sdk.requestReview();
  }

  public static async getPurchasedProducts(): Promise<Purchase[] & Signature> {
    return this._sdk.getPurchasedProducts();
  }

  public static overrideProductsCatalog(catalog: Product[]): void {
    this._sdk.overrideProductsCatalog(catalog);
  }

  public static async getProductCatalog(): Promise<Product[]> {
    return this._sdk.getProductCatalog();
  }

  public static async purchaseProduct(productId: string, developerPayload?: string): Promise<{ purchaseData: Purchase } & Signature> {
    return this._sdk.purchaseProduct(productId, developerPayload);
  }

  public static async consumeProduct(purchasedProductToken: string): Promise<void> {
    return this._sdk.consumeProduct(purchasedProductToken);
  }

  public static async setLeaderboardScore(leaderboardName: string, score: number, extraData?: string): Promise<void> {
    return this._sdk.setLeaderboardScore(leaderboardName, score, extraData);
  }

  public static async getLeaderboardEntries(
    leaderboardName: string,
    topPlayersCount?: IntRange<1, 21>,
    competingPlayersCount?: IntRange<1, 11>,
    includeSelf?: boolean
  ): Promise<LeaderboardEntries> {
    return this._sdk.getLeaderboardEntries(leaderboardName, topPlayersCount, competingPlayersCount, includeSelf);
  }

  public static async getFlags(params: FlagsParams): Promise<Record<string, string>> {
    return this._sdk.getFlags(params);
  }

  public static async getAllValues(): Promise<Record<string, any>> {
    if (!this.isInitialized) {
      return new Promise((resolve) => {
        this._gettings.set(null, resolve);
      });
    }

    if (this._prefs) {
      return this._prefs;
    }

    return this.getPlayerData()
      .then((data) => {
        return data;
      })
      .catch(() => {
        return new Promise((resolve) => {
          this._gettings.set(null, resolve);
        });
      });
  }

  public static async getValues<T extends ([] | string[]) & (number extends T['length'] ? readonly string[] : unknown)>(
    keys: T,
    defaultValues: { [K in keyof T]: any }
  ): Promise<{ [K in keyof T]: any }> {
    if (!this.isInitialized) {
      return new Promise((resolve) => {
        this._gettings.set([keys, defaultValues], resolve);
      }) as { [K in keyof T]: any };
    }

    if (this._prefs) {
      const result: { [K in keyof T]: any } = defaultValues;

      for (let i = 0; i < keys.length; i++) {
        const key = keys[i];
        result[i] = this._prefs[key] ?? defaultValues[i];
      }

      return result;
    }

    return this.getPlayerData()
      .then((data) => {
        const result: { [K in keyof T]: any } = defaultValues;

        for (let i = 0; i < keys.length; i++) {
          const key = keys[i];
          result[i] = data[key] ?? defaultValues[i];
        }

        return result;
      })
      .catch(() => {
        return new Promise((resolve) => {
          this._gettings.set([keys, defaultValues], resolve);
        }) as { [K in keyof T]: any };
      });
  }

  public static setValues(values: Record<string, any>): void {
    if (!this.isInitialized) {
      return;
    }

    if (!this._prefs) {
      this.getPlayerData().then((data) => {
        for (const key in values) {
          data[key] = values[key];
        }

        this.setPlayerData(data);
      });

      return;
    }

    for (const key in values) {
      this._prefs[key] = values[key];
    }

    this.setPlayerData(this._prefs);
  }

  public static async replaceValues(values: Record<string, any>): Promise<void> {
    this._prefs = values;

    this.setPlayerData(this._prefs);
  }

  public static async removeKeys(keys: string[]): Promise<void> {
    if (!this.isInitialized) {
      return;
    }

    if (!this._prefs) {
      this.getPlayerData().then((data) => {
        for (let i = 0; i < keys.length; i++) {
          delete data.remove[keys[i]];
        }

        this.setPlayerData(data);
      });

      return;
    }

    for (let i = 0; i < keys.length; i++) {
      delete this._prefs[keys[i]];
    }

    this.setPlayerData(this._prefs);
  }

  public static async removeKeyByPredicate(predicate: (key: string) => boolean): Promise<void> {
    if (!this.isInitialized) {
      return;
    }

    if (!this._prefs) {
      this.getPlayerData().then((data) => {
        const keys = Object.keys(data).filter(predicate);

        this.removeKeys(keys);
      });

      return;
    }

    const keys = Object.keys(this._prefs).filter(predicate);

    this.removeKeys(keys);
  }

  public static forceSaveChanges() {
    if (this._settingTimeout) {
      const data = this._nextData ?? this._prefs;
      if (!data) {
        return;
      }

      this._nextData = undefined;

      clearTimeout(this._settingTimeout);

      this._settingPromise = this.setPlayerDataRuntime(data);
    }
  }

  /*public static async tryRequestReview(): Promise<boolean> {}

  private static async showAdEditor(): Promise<void> {}

  private static async showInterstitialEditor(): Promise<void> {}

  private static async showRewardedEditor(id: string): Promise<void> {}

  private static async tryGetProductCatalog(): Promise<GetProductCatalogResponse> {}

  private static async tryGetPurchasedProducts(): Promise<GetPurchasedProductsResponse> {}

  private static async tryGetLeaderboardEntries(
    leaderboardName: string,
    topPlayersCount: number = 5,
    competingPlayersCount: number = 5,
    includeSelf: boolean = true
  ): Promise<LeaderboardGetEntriesResponse> {}*/

  private static async getPlayerData(): Promise<Record<string, any>> {
    if (this._isGettingData) {
      return Promise.reject();
    }

    this._isGettingData = true;
    return new Promise((resolve) => {
      this._sdk.getPlayerData().then((data) => {
        this._prefs = data;

        this.onDataGetted();

        this._isGettingData = false;

        resolve(data);
      }) /*
        .catch(() => {
          const prefsData = getLocalStorageItem('DATA');

          let prefs;
          if (prefsData !== null) {
            prefs = JSON.parse(prefsData);
          } else {
            prefs = {};
          }
          this._prefs = prefs;

          this.onDataGetted();

          this._isGettingData = false;

          resolve(prefs);
        })*/;
    });
  }

  private static onDataGetted() {
    //var getting = this._getting.ToDictionary(x => x.Key, x => x.Value);
    //_getting.Clear();
    const gettings = this._gettings;
    this._gettings = new Map();

    //for (const key in getting) {
    //var value = _prefs[key] ?? defaultValue;

    /* DEV_START */
    //console.log(`Get (${key}, ${defaultValue}) = ${value}`);
    /* DEV_END */

    //callback?.Invoke(value);

    //gettings.get(key)?.call(undefined);
    //}

    gettings.forEach((value, values) => {
      if (values == null) {
        value(this._prefs as any);

        return;
      }

      const result: any[] = [];

      for (let i = 0; i < values[0].length; i++) {
        const key = values[0][i];
        result[i] = this._prefs?.[key] ?? values[1][i];
      }
      /*for (const key in values) {
        result[key] = this._prefs?.[key] ?? values[key];
      }*/

      value(result);
    });

    //var gettings = _gettings.ToDictionary(x => x.Key, x => x.Value);
    //_gettings.Clear();

    /*foreach (var ((key, defaultValue), callback) in gettings)
    {
        var values = new int[key.Length];
        for (int i = 0; i < key.Length; i++)
        {
            values[i] = _prefs.GetValue(key[i])?.Value<int>() ?? defaultValue[i];
        }*/

    /* DEV_START */
    //Debug.Log($"Get ({keys}, {defaultValues}) = {values}");
    /* DEV_END */

    //callback?.Invoke(values);
    //}

    if (this._gettings.size > 0) {
      // || _gettings.Count > 0)
      //GetPlayerData(null);
      this.onDataGetted();
    }
  }

  private static setPlayerData(data: Record<string, any>) {
    //data = { ...data };

    if (this._settingPromise) {
      this._nextData = data;
      return;
    }

    if (this._settingTimeout) {
      clearTimeout(this._settingTimeout);
    }

    this._settingTimeout = setTimeout(() => {
      this._settingTimeout = undefined;
      this._settingPromise = this.setPlayerDataRuntime(data);
    }, 50);
  }

  private static async setPlayerDataRuntime(data: Record<string, any>): Promise<void> {
    //const str = JSON.stringify(data);
    this._sdk.setPlayerData(data);
    //localStorage.setItem('DATA', str);

    await new Promise((resolve) => setTimeout(resolve, this._settingDataCooldown * 1000));

    if (!this._settingPromise) {
      return;
    }

    this._settingPromise = undefined;

    if (this._nextData) {
      data = this._nextData;
      this._nextData = undefined;
      this.setPlayerData(data);
    }
  }

  private static onAdOpened(): void {
    this._isAdOpened = true;
  }

  private static onAdClosed(): void {
    this._isAdOpened = false;
  }

  private static onRewardedRewardReceived(): void {
    this._rewardedAdReward.dispatch(this._currentRewardedID);

    this._currentRewardedID = '';
  }
}

const isInitialized = (() => {
  let match = location.hostname.match(/app-\d{6}\.games\.s3\.yandex\.net/);
  if (!match) {
    match = decodeURIComponent(location.hash).match(/origin=https:\/\/yandex\.(.+)&draft=true/);
  }
  if (match) {
    /* (window as any).YaGames.init().then(async (sdk: YandexGamesSDK) => {
      const YandexGamesSDKWrapper = (await import('./yandex-sdk')).default;

      return SDK[STATIC_INIT](new YandexGamesSDKWrapper(sdk));
    }); */
    (async () => {
      const YandexGamesSDKWrapper = (await import('./yandex-sdk')).default;

      return SDK[STATIC_INIT](new YandexGamesSDKWrapper());
    })();

    return true;
  }

  match = location.hostname.match(/game-files\.crazygames\.com/);
  if (match || location.href.search('platform=CrazyGames') >= 0) {
    (async () => {
      const CrazyGamesSDKWrapper = (await import('./crazy-games-sdk')).default;

      return SDK[STATIC_INIT](new CrazyGamesSDKWrapper());
    })();

    return true;
  }

  match = location.href.match(/appid=(\d+)/);
  if (match && location.href.search('platform=VKPlay') >= 0) {
    (async () => {
      const VKPlaySDKWrapper = (await import('./vk-play-sdk')).default;

      return SDK[STATIC_INIT](new VKPlaySDKWrapper());
    })();

    return true;
  }

  match = location.href.match(/gamedistribution\.com\/(?:.+\/)?(.{32})/);
  if (match || location.href.search('platform=GameDistribution') >= 0) {
    (async () => {
      const GameDistributionSDKWrapper = (await import('./game-distribution-sdk')).default;

      return SDK[STATIC_INIT](new GameDistributionSDKWrapper(match?.[1] ?? ''));
    })();

    return true;
  }

  if ('_cordovaNative' in window) {
    (async () => {
      const AndroidSDKWrapper = (await import('./android-sdk')).default;

      return SDK[STATIC_INIT](new AndroidSDKWrapper());
    })();

    return true;
  }

  return false;
})();

if (!isInitialized) {
  (async () => {
    const DefaultSDKWrapper = (await import('./default-sdk')).default;

    return SDK[STATIC_INIT](new DefaultSDKWrapper());
  })();
}
