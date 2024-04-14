import { IntRange } from '../global';
import { Locale } from '../localization';
import SDKWrapper, {
  Player,
  DeviceInfo,
  Purchase,
  Signature,
  Product,
  FlagsParams,
  LeaderboardEntry,
  LeaderboardEntries,
  RewardedCallbacks,
  InterstitialCallbacks,
  CanReviewResponse
} from '../sdk-wrapper';
import { YandexGamesSDK, Player as YPlayer, Payments, Leaderboards } from './yandex-sdk-definitions';

declare const window: {
  ym(counterId: number, arg: string, data?: Record<string, any>): void;
  ym(counterId: number, arg: string, eventName: string, data?: Record<string, any>): void;
  yandexMetricaCounterId: number;
} & Window;

export default class YandexGamesSDKWrapper extends SDKWrapper {
  //private readonly _overridedProductsCatalog: Product[] = [];
  private readonly _sdk: YandexGamesSDK;
  private readonly _isDraft: boolean;

  private _player: Player | null = null;
  private _yplayer: YPlayer | null = null;
  private _payments: Payments | null = null;
  private _leaderboards: Leaderboards | null = null;
  private _isAuthorized: boolean = false;

  public constructor(sdk: YandexGamesSDK) {
    super();

    this._sdk = sdk;
    this._isDraft = location.hash.search('draft=true') >= 0;
  }

  public get canShowAdOnLoading(): boolean {
    return true;
  }

  public get locale(): Locale {
    let result = Locale.Russian;

    switch (this.lang) {
      case 'ru':
      case 'be':
      case 'kk':
      case 'uk':
      case 'uz':
        result = Locale.Russian;
        break;
      case 'tr':
        result = Locale.Turkish;
        break;
      case 'de':
        result = Locale.Deutsch;
        break;
      default:
        result = Locale.English;
        break;
    }

    return result;
  }

  public get lang(): string {
    return this._sdk.environment.i18n.lang;
  }

  public get tld(): string {
    return this._sdk.environment.i18n.tld;
  }

  public get id(): string {
    return this._sdk.environment.app.id;
  }

  public get deviceInfo(): DeviceInfo {
    return this._sdk.deviceInfo;
  }

  public get environment() {
    return this._sdk.environment;
  }

  public get isAuthorized() {
    return this._isAuthorized;
  }

  public get isDraft() {
    return this._isDraft;
  }

  public async initialize(): Promise<void> {
    (function (m: any, e: any, t: any, r: any, i: any, k?: any, a?: any) {
      m[i] =
        m[i] ||
        function (...rest: any[]) {
          (m[i].a = m[i].a || []).push(rest);
        };
      m[i].l = new Date().getTime();
      for (let j = 0; j < document.scripts.length; j++) {
        if (document.scripts[j].src === r) {
          return;
        }
      }
      (k = e.createElement(t)), (a = e.getElementsByTagName(t)[0]), (k.async = 1), (k.src = r), a.parentNode.insertBefore(k, a);
    })(window, document, 'script', 'https://mc.yandex.ru/metrika/tag.js', 'ym');

    window.ym(window.yandexMetricaCounterId, 'init', {
      clickmap: true,
      trackLinks: true,
      accurateTrackBounce: true
    });

    window.ym(window.yandexMetricaCounterId, 'reachGoal', 'pageOpen');

    const domContentLoaded = () => {
      const navigationTiming = performance.getEntriesByType('navigation')[0] as PerformanceNavigationTiming;
      const pageLoadTime = navigationTiming.domContentLoadedEventStart - navigationTiming.startTime; // performance.timing.domContentLoadedEventStart - performance.timing.navigationStart;
      window.ym(window.yandexMetricaCounterId, 'reachGoal', 'pageLoad', { pageLoadTime: pageLoadTime / 1000 });
    };

    if (document.readyState !== 'loading') {
      domContentLoaded();
    } else {
      window.addEventListener('DOMContentLoaded', domContentLoaded);
    }

    await this.getPlayer();

    /*const leaderboardInitializationPromise = this._sdk
      .getLeaderboards()
      .then(function (leaderboard) {
        yandexGames.leaderboard = leaderboard;
      })
      .catch(function () {
        throw new Error('Leaderboard failed to initialize.');
      });

    const billingInitializationPromise = sdk
      .getPayments({ signed: true })
      .then(function (billing) {
        yandexGames.billing = billing;
      })
      .catch(function () {
        throw new Error('Billing failed to initialize.');
      });*/
  }

  public ready(): void {
    this._sdk.features.LoadingAPI?.ready();
  }

  public gameplayStart(): void {
    console.log('Gameplay Start');
  }

  public gameplayStop(): void {
    console.log('Gameplay Stop');
  }

  public happyTime(): void {
    console.log('Happy Time');
  }

  public async isMe(uniqueID: string): Promise<boolean> {
    return this.getPlayer()
      .then((player) => player.uuid == uniqueID)
      .catch(() => false);
  }

  public async authorizePlayer(): Promise<void> {
    return this._sdk.auth.openAuthDialog().then(async () => {
      this._yplayer = null;

      await this.getPlayerInternal();
    });
  }

  public async getPlayer(): Promise<Player> {
    if (this._player !== null) {
      return this._player;
    }

    return this.getPlayerInternal()
      .then((player) => {
        this._player = {
          get isAuthorized() {
            return player.getMode() !== 'lite';
          },
          get hasNamePermission() {
            return player._personalInfo.scopePermissions.public_name == 'allow';
          },
          get hasPhotoPermission() {
            return player._personalInfo.scopePermissions.avatar == 'allow';
          },
          get name() {
            return player.getName();
          },
          get photo() {
            return {
              small: player.getPhoto('small'),
              medium: player.getPhoto('medium'),
              large: player.getPhoto('large')
            };
          },
          get uuid() {
            return player.getUniqueID();
          }
        };

        return this._player;
      })
      .catch(() => {
        this._player = {
          get isAuthorized() {
            return false;
          },
          get hasNamePermission() {
            return false;
          },
          get hasPhotoPermission() {
            return false;
          },
          get name() {
            return '';
          },
          get photo() {
            return {
              small: '',
              medium: '',
              large: ''
            };
          },
          get uuid() {
            return '';
          }
        };

        return this._player;
      });
  }

  public sendAnalyticsEvent(eventName: string, data?: Record<string, any>): void {
    window.ym(window.yandexMetricaCounterId, 'reachGoal', eventName, data);
  }

  public showInterstitial(callbacks?: InterstitialCallbacks): void {
    this._sdk.adv.showFullscreenAdv({ callbacks });
  }

  public showRewarded(callbacks?: RewardedCallbacks): void {
    this._sdk.adv.showRewardedVideo({ callbacks });
  }

  public async canReview(): Promise<CanReviewResponse> {
    return this._sdk.feedback.canReview();
  }

  public async requestReview(): Promise<{ feedbackSent: boolean }> {
    return this._sdk.feedback.requestReview();
  }

  public async getPlayerInternal(): Promise<YPlayer> {
    if (this._yplayer !== null) {
      return this._yplayer;
    }

    return this._sdk.getPlayer({ scopes: false }).then((player) => {
      this._isAuthorized = player.getMode() !== 'lite';

      this._yplayer = player;

      return player;
    });
  }

  public async getPayments(): Promise<Payments> {
    if (this._payments !== null) {
      return this._payments;
    }

    return this._sdk.getPayments().then((payments) => {
      this._payments = payments;

      return payments;
    });
  }

  public async getLeaderboards(): Promise<Leaderboards> {
    if (!this._isAuthorized) {
      return Promise.reject();
    }

    if (this._leaderboards !== null) {
      return this._leaderboards;
    }

    return this._sdk.getLeaderboards().then((leaderboards) => {
      this._leaderboards = leaderboards;

      return leaderboards;
    });
  }

  public async getPurchasedProducts(): Promise<Purchase[] & Signature> {
    return this.getPayments().then((payments) => {
      return payments.getPurchases();
    });
  }

  public overrideProductsCatalog(/* catalog: Product[] */): void {
    /* this._overridedProductsCatalog.length = 0;
    this._overridedProductsCatalog.push(...catalog); */
  }

  public async getProductCatalog(): Promise<Product[]> {
    /* return this._overridedProductsCatalog.length > 0 && this._overridedProductsCatalog[0].prices.YAN
      ? Promise.resolve(this._overridedProductsCatalog)
      :  */
    return this.getPayments().then(async (payments) => {
      const catalog = await payments.getCatalog();

      const result = catalog.map<Product>((x) => ({
        id: x.id,
        imageURI: x.imageURI,
        meta: {
          en: {
            name: x.title,
            description: x.description
          },
          ru: {
            name: x.title,
            description: x.description
          }
        },
        prices: {
          YAN: parseFloat(x.priceValue)
        }
      }));

      return result;
    });
  }

  public async purchaseProduct(productID: string, developerPayload?: string): Promise<{ purchaseData: Purchase } & Signature> {
    return this.getPayments().then((payments) => {
      return payments.purchase({ id: productID, developerPayload });
    });
  }

  public async consumeProduct(purchasedProductToken: string): Promise<void> {
    return this.getPayments().then((payments) => {
      return payments.consumePurchase(purchasedProductToken);
    });
  }

  public async setLeaderboardScore(leaderboardName: string, score: number, extraData?: string): Promise<void> {
    return this.getLeaderboards().then((leaderboards) => {
      return leaderboards.setLeaderboardScore(leaderboardName, score, extraData);
    });
  }

  public async getLeaderboardEntries(
    leaderboardName: string,
    topPlayersCount?: IntRange<1, 21>,
    competingPlayersCount?: IntRange<1, 11>,
    includeSelf?: boolean
  ): Promise<LeaderboardEntries> {
    return this.getLeaderboards().then(async (leaderboards) => {
      const response = await leaderboards.getLeaderboardEntries(leaderboardName, {
        includeUser: includeSelf,
        quantityAround: competingPlayersCount,
        quantityTop: topPlayersCount
      });

      const result: LeaderboardEntries = {
        ...response,
        entries: response.entries.map<LeaderboardEntry>((entry) => ({
          ...entry,
          player: {
            ...entry.player,
            isAuthorized: entry.player.scopePermissions.avatar != 'not_set',
            hasNamePermission: entry.player.scopePermissions.public_name == 'allow',
            hasPhotoPermission: entry.player.scopePermissions.avatar == 'allow',
            name: entry.player.publicName,
            photo: {
              small: entry.player.getAvatarSrc('small'),
              medium: entry.player.getAvatarSrc('medium'),
              large: entry.player.getAvatarSrc('large')
            },
            uuid: entry.player.uniqueID
          }
        }))
      };

      return result;
    });
  }

  public async getFlags(params: FlagsParams): Promise<Record<string, string>> {
    return this._sdk.getFlags(params);
  }

  public async getPlayerData(keys: string[] | undefined = undefined): Promise<Record<string, any>> {
    //if (this._player === null) {
    return this.getPlayerInternal()
      .then((player) => {
        return player.getData(keys);
      })
      .catch(() => {
        return super.getPlayerData(keys);
      });
    //}

    /* return this._player.getData(keys).catch(() => {
      return super.getPlayerData(keys);
    }); */
  }

  public async setPlayerData(values: Record<string, any>): Promise<void> {
    //if (this._player === null) {
    return this.getPlayerInternal()
      .then((player) => {
        return player.setData(values);
      })
      .finally(() => {
        return super.setPlayerData(values);
      });
    //}

    /* return this._player.setData(values).finally(() => {
      return super.setPlayerData(values);
    }); */
  }
}
