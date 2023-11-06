import { IntRange } from '../global';
import { Locale } from '../localization';
import SDKWrapper, { DeviceInfo, InterstitialCallbacks, Purchase, Product, LeaderboardEntries, RewardedCallbacks } from '../sdk-wrapper';
import { YandexGamesSDK, Player, Payments, Leaderboards } from './yandex-sdk-definitions';

declare global {
  interface Window {
    ym(counterId: number, arg: string, data?: Record<string, any>): void;
    ym(counterId: number, arg: string, eventName: string, data?: Record<string, any>): void;
    yandexMetricaCounterId: number;
  }
}

export default class YandexGamesSDKWrapper extends SDKWrapper {
  private readonly _sdk: YandexGamesSDK;
  private readonly _isDraft: boolean = false;

  private _player: Player | null = null;
  private _payments: Payments | null = null;
  private _leaderboards: Leaderboards | null = null;
  private _isAuthorized: boolean = false;

  public constructor(sdk: YandexGamesSDK) {
    super();

    this._sdk = sdk;
    this._isDraft = location.hash.search('draft=true') >= 0;
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
          (m[i].a = m[i].a || []).push(...rest);
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

    window.addEventListener('DOMContentLoaded', () => {
      const navigationTiming = performance.getEntriesByType('navigation')[0] as PerformanceNavigationTiming;
      const pageLoadTime = navigationTiming.domContentLoadedEventStart - navigationTiming.startTime; // performance.timing.domContentLoadedEventStart - performance.timing.navigationStart;
      window.ym(window.yandexMetricaCounterId, 'reachGoal', 'pageLoad', { pageLoadTime: pageLoadTime / 1000 });
    });

    this.getPlayer();

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
      .then((player) => player.getUniqueID() == uniqueID)
      .catch(() => false);
  }

  public async authorizePlayer(): Promise<void> {
    return this._sdk.auth.openAuthDialog();
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

  public async canReview(): Promise<boolean> {
    return this._sdk.feedback.canReview();
  }

  public async requestReview(): Promise<{ feedbackSent: boolean }> {
    return this._sdk.feedback.requestReview();
  }

  public async getPlayer(): Promise<Player> {
    if (this._player !== null) {
      return this._player;
    }

    return this._sdk.getPlayer({ scopes: false }).then((player) => {
      this._isAuthorized = player.getMode() !== 'lite';

      this._player = player;

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

  public async getPurchasedProducts(): Promise<Purchase[]> {
    return this.getPayments().then((payments) => {
      return payments.getPurchases();
    });
  }

  public async getProductCatalog(): Promise<Product[]> {
    return this.getPayments().then((payments) => {
      return payments.getCatalog();
    });
  }

  public async purchaseProduct(productID: string, developerPayload?: string): Promise<Purchase> {
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
    return this.getLeaderboards().then((leaderboards) => {
      return leaderboards.getLeaderboardEntries(leaderboardName, {
        includeUser: includeSelf,
        quantityAround: competingPlayersCount,
        quantityTop: topPlayersCount
      });
    });
  }

  public async getPlayerData(keys: string[] | undefined = undefined): Promise<Record<string, any>> {
    //if (this._player === null) {
    return this.getPlayer()
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
    return this.getPlayer()
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
