import { SimpleEventDispatcher } from 'ste-simple-events';
import { IntRange } from '../global';
import { Locale } from '../localization';
import SDKWrapper, {
  Player,
  InterstitialCallbacks,
  Purchase,
  Signature,
  Product,
  LeaderboardEntries,
  LeaderboardEntry,
  RewardedCallbacks,
  CanReviewResponse,
  ProductMeta
} from '../sdk-wrapper';
import { VKPlaySDK } from './vk-play-sdk-definitions';

type VKError = {
  status: 'error';
  errcode: number;
  errmsg: string;
};

type UserInfo = {
  status: 'ok';
  uid: number;
  hash: string;
};

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
  registerUserCallback(info: UserInfo | VKError): void;
  getAuthTokenCallback(token: { status: 'ok'; uid: number; hash: string } | VKError): void;
  userInfoCallback(info: UserInfo | VKError): void;

  adsCallback(
    context: { type: 'adCompleted' | 'adDismissed' } | { type: 'adError'; code: 'UndefinedAdError' | 'AdblockDetectedAdError' | 'WaterfallConfigLoadFailed' }
  ): void;

  paymentWaitCallback(data: any): void;
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
  }
}

export default class VKPlaySDKWrapper extends SDKWrapper {
  private readonly _getLoginStatusCallbackReceived: SimpleEventDispatcher<{ status: 'ok'; loginStatus: 0 | 1 | 2 | 3 } | VKError> = new SimpleEventDispatcher();
  private readonly _registerUserCallbackReceived: SimpleEventDispatcher<UserInfo | VKError> = new SimpleEventDispatcher();
  private readonly _getAuthTokenCallbackReceived: SimpleEventDispatcher<{ status: 'ok'; uid: number; hash: string } | VKError> = new SimpleEventDispatcher();
  private readonly _userInfoCallbackReceived: SimpleEventDispatcher<UserInfo | VKError> = new SimpleEventDispatcher();
  private readonly _adsCallbackReceived: SimpleEventDispatcher<
    { type: 'adCompleted' | 'adDismissed' } | { type: 'adError'; code: 'UndefinedAdError' | 'AdblockDetectedAdError' | 'WaterfallConfigLoadFailed' }
  > = new SimpleEventDispatcher();
  private readonly _paymentCompletedCallbackReceived: SimpleEventDispatcher<{ status: 'received'; uid: number } | { status: 'closed' }> =
    new SimpleEventDispatcher();
  private readonly _confirmWindowClosedCallbackReceived: SimpleEventDispatcher<void> = new SimpleEventDispatcher();
  private readonly _userConfirmCallbackReceived: SimpleEventDispatcher<void> = new SimpleEventDispatcher();
  private readonly _getGameInventoryItemsReceived: SimpleEventDispatcher<void> = new SimpleEventDispatcher();
  private readonly _userProfileCallbackReceived: SimpleEventDispatcher<({ status: 'ok' } & ExtendedUserProfile) | VKError> = new SimpleEventDispatcher();
  private readonly _userFriendsCallbackReceived: SimpleEventDispatcher<{ status: 'ok'; friends: CommonUserProfile[] } | VKError> = new SimpleEventDispatcher();
  private readonly _userSocialFriendsCallbackReceived: SimpleEventDispatcher<{ status: 'ok'; friends: SocialUserProfile[] } | VKError> =
    new SimpleEventDispatcher();

  private readonly _overridedProductsCatalog: Product[] = [];
  private readonly _isDraft: boolean;
  private readonly _appID: string;
  private readonly _lang: string;
  private readonly _callbacks: CallbacksContainer;

  private _player: Player | null = null;
  private _sdk: VKPlaySDK | null = null;
  private _playerInfo: UserInfo | null = null;
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

      getLoginStatusCallback: (status) => {
        this._getLoginStatusCallbackReceived.dispatch(status);
        console.log(`getLoginStatusCallback(${JSON.stringify(status)})`);
      },
      registerUserCallback: (info) => {
        if (info.status == 'ok') {
          this._isAuthorized = true;
          this._playerInfo = info;
        }

        this._registerUserCallbackReceived.dispatch(info);
        console.log(`registerUserCallback(${JSON.stringify(info)})`);
      },
      getAuthTokenCallback: (token) => {
        this._getAuthTokenCallbackReceived.dispatch(token);
        console.log(`getAuthTokenCallback(${JSON.stringify(token)})`);
      },
      userInfoCallback: (info) => {
        if (info.status == 'ok') {
          this._isAuthorized = true;
          this._playerInfo = info;
        }

        this._userInfoCallbackReceived.dispatch(info);
        console.log(`userInfoCallback(${JSON.stringify(info)})`);
      },

      adsCallback: (context) => {
        this._adsCallbackReceived.dispatch(context);
        console.log(`adsCallback(${JSON.stringify(context)})`);
      },

      paymentWaitCallback: (data) => {
        console.log(`paymentWaitCallback(${JSON.stringify(data)})`);
      },
      paymentReceivedCallback: (data) => {
        this._paymentCompletedCallbackReceived.dispatch({ status: 'received', uid: data.uid });
        console.log(`paymentReceivedCallback(${JSON.stringify(data)})`);
      },
      paymentWindowClosedCallback: () => {
        this._paymentCompletedCallbackReceived.dispatch({ status: 'closed' });
        console.log('paymentWindowClosedCallback');
      },
      confirmWindowClosedCallback: () => {
        this._confirmWindowClosedCallbackReceived.dispatch();
        console.log('confirmWindowClosedCallback');
      },
      userConfirmCallback: () => {
        this._userConfirmCallbackReceived.dispatch();
        console.log('userConfirmCallback');
      },
      getGameInventoryItems: () => {
        this._getGameInventoryItemsReceived.dispatch();
        console.log('getGameInventoryItems');
      },

      userProfileCallback: (profile) => {
        this._userProfileCallbackReceived.dispatch(profile);
        console.log(`userProfileCallback(${JSON.stringify(profile)})`);
      },
      userFriendsCallback: (data) => {
        this._userFriendsCallbackReceived.dispatch(data);
        console.log(`userFriendsCallback(${JSON.stringify(data)})`);
      },
      userSocialFriendsCallback: (data) => {
        this._userSocialFriendsCallbackReceived.dispatch(data);
        console.log(`userSocialFriendsCallback(${JSON.stringify(data)})`);
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
          .then(async (sdk: VKPlaySDK) => {
            this._sdk = sdk;

            await this.getPlayer();

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
    if (this._playerInfo == null) {
      return Promise.reject();
    }

    return uniqueID == this._playerInfo.uid.toString();
  }

  public async authorizePlayer(): Promise<void> {
    return new Promise((resolve, reject) => {
      this._registerUserCallbackReceived.one((info) => {
        if (info.status == 'error') {
          reject(info.errmsg);

          return;
        }

        /* this._isAuthorized = true;
        this._playerInfo = info; */

        resolve();
      });

      this._sdk?.registerUser();
    });
  }

  public async getPlayer(): Promise<Player> {
    if (this._player !== null) {
      return this._player;
    }

    return new Promise((resolve, reject) => {
      this._getLoginStatusCallbackReceived.one((loginStatus) => {
        if (loginStatus.status == 'error') {
          reject(loginStatus.errmsg);

          return;
        }

        if (loginStatus.loginStatus > 1) {
          this._userProfileCallbackReceived.one((userProfile) => {
            if (userProfile.status == 'error') {
              reject(userProfile.errmsg);

              return;
            }

            this._player = {
              get isAuthorized() {
                return true;
              },
              get hasNamePermission() {
                return true;
              },
              get hasPhotoPermission() {
                return true;
              },
              get name() {
                return userProfile.nick;
              },
              get photo() {
                return {
                  small: userProfile.avatar,
                  medium: userProfile.avatar,
                  large: userProfile.avatar
                };
              },
              get uuid() {
                return userProfile.slug;
              }
            };

            this._sdk?.userInfo();

            resolve(this._player);
          });

          this._sdk?.userProfile();

          return;
        }

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

        resolve(this._player);
      });

      this._sdk?.getLoginStatus();
    });
  }

  public sendAnalyticsEvent(eventName: string, data?: Record<string, any>): void {
    console.log(`Analytic event sended (${eventName}) with data: ${JSON.stringify(data)}`);
  }

  public showInterstitial(callbacks?: InterstitialCallbacks): void {
    this._adsCallbackReceived.one((context) => {
      if (context.type == 'adError') {
        callbacks?.onError?.(new Error(context.code));
      }

      const isAdShowed = context.type == 'adCompleted';
      setTimeout(() => {
        callbacks?.onClose?.(isAdShowed);
      }, 1000);
    });

    callbacks?.onOpen?.();

    this._sdk?.showAds({ interstitial: true });
  }

  public showRewarded(callbacks?: RewardedCallbacks): void {
    this._adsCallbackReceived.one((context) => {
      if (context.type == 'adError') {
        callbacks?.onError?.(new Error(context.code));
      }

      let isAdShowed = false;
      if (context.type == 'adCompleted') {
        callbacks?.onRewarded?.();

        isAdShowed = true;
      }

      setTimeout(() => {
        callbacks?.onClose?.(isAdShowed);
      }, 1000);
    });

    callbacks?.onOpen?.();

    this._sdk?.showAds({ interstitial: false });
  }

  public async canReview(): Promise<CanReviewResponse> {
    return Promise.resolve({ value: false, reason: 'UNKNOWN' });
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

  public async getPurchasedProducts(): Promise<Purchase[] & Signature> {
    const result: Purchase[] & Signature = [] as any;
    (result as any).signature = '';

    return Promise.resolve(result);
  }

  public overrideProductsCatalog(catalog: Product[]): void {
    this._overridedProductsCatalog.length = 0;
    this._overridedProductsCatalog.push(...catalog);
  }

  public async getProductCatalog(): Promise<Product[]> {
    return Promise.resolve(this._overridedProductsCatalog);
  }

  public async purchaseProduct(productID: string, developerPayload?: string) {
    return new Promise<{ purchaseData: Purchase } & Signature>((resolve, reject) => {
      const product = this._overridedProductsCatalog.find((x) => x.id == productID);

      if (product == null || product.prices.RUB == null || product.prices.RUB <= 0) {
        reject();

        return;
      }

      this._paymentCompletedCallbackReceived.one((result) => {
        if (result.status == 'closed') {
          reject();

          return;
        }

        resolve({
          purchaseData: {
            productID: productID,
            purchaseTime: 0,
            purchaseToken: result.uid.toString(),
            developerPayload: developerPayload
          },
          signature: ''
        });
      });

      let meta: ProductMeta | undefined;
      switch (this.lang) {
        case 'ru':
          meta = product.meta.ru;
          break;
        case 'tr':
          meta = product.meta.tr;
          break;
        case 'de':
          meta = product.meta.de;
          break;
        default:
          meta = product.meta.en;
          break;
      }

      if (!meta?.description) {
        meta = product.meta.en;
      }

      this._sdk?.paymentFrame({
        merchant_param: {
          amount: product.prices.RUB,
          item_id: product.id,
          description: meta.description,
          currency: 'RUB',
          currency_auto_convert: true
        }
      });
    });
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
        name: leaderboardName,
        dеfault: false,

        description: {
          invert_sort_order: false,

          score_format: {
            options: {
              decimal_offset: 0
            }
          },

          type: 'numeric'
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
          get isAuthorized() {
            return true;
          },
          get hasNamePermission() {
            return true;
          },
          get hasPhotoPermission() {
            return true;
          },
          get name() {
            return 'Debug Name';
          },
          get photo() {
            return {
              small: 'https://i.pravatar.cc/256',
              medium: 'https://i.pravatar.cc/256',
              large: 'https://i.pravatar.cc/256'
            };
          },
          get uuid() {
            return '';
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
