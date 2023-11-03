import { IntRange } from '../global';
import { Locale } from '../localization';
import SDKWrapper, { DeviceInfo, InterstitialCallbacks, Purchase, Product, LeaderboardEntries, LeaderboardEntry, RewardedCallbacks } from '../sdk-wrapper';
import { VKPlaySDK } from './vk-play-sdk-definitions';

type VKError = {
  status: 'error';
  errcode: number;
  errmsg: string;
};

type UserInfo =
  | {
      status: 'ok';
      uid: number;
      hash: string;
    }
  | VKError;

type BaseUserProfile = {
  nick: string;
  slug: string;
  avatar: string;
};

type CommonUserProfile = BaseUserProfile & {
  uid: number;
};

type SocialUserProfile = BaseUserProfile & {
  online: number;
};

type ExtendedUserProfile = CommonUserProfile & {
  birthyear: string;
  sex: 'male' | 'female';
};

type CallbacksContainer = {
  readonly appid: string;

  getLoginStatusCallback(status: { status: 'ok'; loginStatus: 0 | 1 | 2 | 3 } | VKError): void;
  registerUserCallback(info: UserInfo): void;
  getAuthTokenCallback(token: { status: 'ok'; uid: number; hash: string } | VKError): void;
  userInfoCallback(info: UserInfo): void;

  paymentReceivedCallback(data: { uid: number }): void;
  paymentWindowClosedCallback(): void;
  confirmWindowClosedCallback(): void;
  userConfirmCallback(): void;
  getGameInventoryItems(): void;

  userProfileCallback(profile: ({ status: 'ok' } & ExtendedUserProfile) | VKError): void;
  userFriendsCallback(data: { status: 'ok'; friends: CommonUserProfile[] } | VKError): void;
  userSocialFriendsCallback(data: { status: 'ok'; friends: SocialUserProfile[] } | VKError): void;
};

declare global {
  interface Window {
    iframeApi(myApi: CallbacksContainer, options: { debug: boolean }): Promise<VKPlaySDK>;
    ym(counterId: number, arg: string, eventName: string, data?: Record<string, any>): void;
    yandexMetricaCounterId: number;
  }
}

export default class VKPlaySDKWrapper extends SDKWrapper {
  private readonly _isDraft: boolean;
  private readonly _appID: string;
  private readonly _lang: string;
  private readonly _callbacks: CallbacksContainer;
  private _sdk: VKPlaySDK | null = null;

  private _isAuthorized: boolean = false;

  public constructor() {
    super();

    //https://astetrio.github.io/web-games/draft/alchemy-elements/index.html?appid=32200&lang=ru_RU&currency=RUB&status=1&version=1

    const urlParams = new URL(location.href).searchParams;

    this._isDraft = location.href.startsWith('https://astetrio.github.io/web-games/draft/');
    this._appID = urlParams.get('appid') ?? '0';
    this._lang = urlParams.get('lang') ?? 'ru_RU';
    this._callbacks = {
      appid: this._appID,

      getLoginStatusCallback(status) {
        console.log(`getLoginStatusCallback(${status})`);
      },
      registerUserCallback(info) {
        console.log(`registerUserCallback(${info})`);
      },
      getAuthTokenCallback(token) {
        console.log(`getAuthTokenCallback(${token})`);
      },
      userInfoCallback(info) {
        console.log(`userInfoCallback(${info})`);
      },

      paymentReceivedCallback(data) {
        console.log(`paymentReceivedCallback(${data})`);
      },
      paymentWindowClosedCallback() {
        console.log('paymentWindowClosedCallback');
      },
      confirmWindowClosedCallback() {
        console.log('confirmWindowClosedCallback');
      },
      userConfirmCallback() {
        console.log('userConfirmCallback');
      },
      getGameInventoryItems() {
        console.log('getGameInventoryItems');
      },

      userProfileCallback(profile) {
        console.log(`userProfileCallback(${profile})`);
      },
      userFriendsCallback(profile) {
        console.log(`userFriendsCallback(${profile})`);
      },
      userSocialFriendsCallback(profile) {
        console.log(`userSocialFriendsCallback(${profile})`);
      }
    };
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
    return this._lang.substring(0, 2);
  }

  public get tld(): string {
    return this._lang;
  }

  public get id(): string {
    return this._appID;
  }

  public get isAuthorized() {
    return this._isAuthorized;
  }

  public get isDraft() {
    return this._isDraft;
  }

  public async initialize(): Promise<void> {
    const script = document.createElement('script');
    script.src = `//vkplay.ru/app/${this._appID}/static/mailru.core.js`;
    document.head.appendChild(script);

    return new Promise((resolve) => {
      script.addEventListener('load', () => {
        window
          .iframeApi(this._callbacks, { debug: this._isDraft })
          .then((sdk: VKPlaySDK) => {
            this._sdk = sdk;

            resolve();
          })
          .catch((err: Error) => {
            throw new Error('Could not init external api ' + err);
          });
      });
    });
  }

  public ready(): void {
    console.log('Ready');
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
    return false;
  }

  public async authorizePlayer(): Promise<void> {
    return Promise.resolve();
  }

  public sendAnalyticsEvent(eventName: string, data?: Record<string, any>): void {
    window.ym(window.yandexMetricaCounterId, 'reachGoal', eventName, data);
  }

  public showInterstitial(callbacks?: InterstitialCallbacks): void {
    //this._sdk.adv.showFullscreenAdv({ callbacks });
  }

  public showRewarded(callbacks?: RewardedCallbacks): void {
    //this._sdk.adv.showRewardedVideo({ callbacks });
  }

  public async canReview(): Promise<boolean> {
    return Promise.resolve(false);
  }

  public async requestReview(): Promise<{ feedbackSent: boolean }> {
    return Promise.reject();
  }

  /* public async getPlayer(): Promise<Player> {
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
  } */

  public async getPurchasedProducts(): Promise<Purchase[]> {
    return Promise.resolve([]);
  }

  public async getProductCatalog(): Promise<Product[]> {
    return Promise.resolve([]);
  }

  public async purchaseProduct(productID: string, developerPayload?: string): Promise<Purchase> {
    return Promise.resolve({
      productID: productID,
      purchaseToken: '',
      developerPayload: developerPayload,
      signature: ''
    } as Purchase);
  }

  public async consumeProduct(purchasedProductToken: string): Promise<void> {
    console.log(`Product with token (${purchasedProductToken}) consumed`);

    return Promise.resolve();
  }

  public async setLeaderboardScore(leaderboardName: string, score: number, extraData?: string): Promise<void> {
    console.log(`Set leaderboard (${leaderboardName}) score (${score}) with extraData (${extraData})`);

    return Promise.resolve();
  }

  public async getLeaderboardEntries(
    leaderboardName: string,
    topPlayersCount?: IntRange<1, 21>,
    competingPlayersCount?: IntRange<1, 11>,
    includeSelf?: boolean
  ): Promise<LeaderboardEntries> {
    const result: LeaderboardEntries = {
      leaderboard: {
        appID: '',
        dеfault: false,

        description: {
          invert_sort_order: false,

          score_format: {
            options: {
              decimal_offset: 0
            }
          },

          type: ''
        },

        name: leaderboardName,

        title: {
          en: '',
          ru: ''
        }
      },
      ranges: [],
      userRank: 0,
      entries: []
    };

    competingPlayersCount ??= 5;
    for (let i = competingPlayersCount; i > 0; i--) {
      const entry: LeaderboardEntry = {
        score: Math.random() * 1000 + 1000 * i,
        extraData: '',
        rank: competingPlayersCount - i + 1,

        player: {
          lang: 'ru',
          publicName: 'Debug Name',

          scopePermissions: {
            avatar: 'allow',
            public_name: 'allow'
          },

          uniqueID: '',

          getAvatarSrc(size: 'small' | 'medium' | 'large'): string {
            return 'https://i.pravatar.cc/256';
          },
          getAvatarSrcSet(size: 'small' | 'medium' | 'large'): string {
            return 'https://i.pravatar.cc/256';
          }
        },

        formattedScore: ''
      };

      result.entries.push(entry);
    }

    return Promise.resolve(result);
  }

  /* public async getPlayerData(keys: string[] | undefined = undefined): Promise<Record<string, any>> {
    return this.getPlayer()
      .then((player) => {
        return player.getData(keys);
      })
      .catch(() => {
        return super.getPlayerData(keys);
      });
  }

  public async setPlayerData(values: Record<string, any>): Promise<void> {
    return this.getPlayer()
      .then((player) => {
        return player.setData(values);
      })
      .finally(() => {
        return super.setPlayerData(values);
      });
  } */
}
