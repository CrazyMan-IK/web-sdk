import { SimpleEventDispatcher } from 'ste-simple-events';
import { IntRange, keyof } from '../global';
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
  ProductMeta,
  FlagsParams
} from '../sdk-wrapper';
import { InitializeObject, CrazyGamesSDK } from './crazy-games-sdk-definitions';

declare const window: {
  readonly CrazyGames: {
    readonly SDK: CrazyGamesSDK;
  };
} & Window;

export default class CrazyGamesSDKWrapper extends SDKWrapper {
  private readonly _adErrorReceived: SimpleEventDispatcher<Error> = new SimpleEventDispatcher();
  private readonly _adStartedReceived: SimpleEventDispatcher<void> = new SimpleEventDispatcher();
  private readonly _adCompletedReceived: SimpleEventDispatcher<boolean> = new SimpleEventDispatcher();
  private readonly _gamePauseReceived: SimpleEventDispatcher<void> = new SimpleEventDispatcher();
  private readonly _gameStartReceived: SimpleEventDispatcher<void> = new SimpleEventDispatcher();
  private readonly _rewardedRewardReceived: SimpleEventDispatcher<void> = new SimpleEventDispatcher();

  private readonly _overridedProductsCatalog: Product[] = [];
  private readonly _isDraft: boolean;

  private _player: Player | null = null;
  private _sdk: CrazyGamesSDK | null = null;
  //private _initObject: InitializeObject | null = null;
  //private _playerInfo: UserInfo | null = null;
  private _isAuthorized: boolean = false;
  private _appID: string = '0';
  private _lang: string = 'EN';

  public constructor() {
    super(keyof({ CrazyGamesSDKWrapper }));

    this._isDraft = location.href.startsWith('https://prod-dpgames.crazygames.com/');
  }

  public get contentPauseRequested() {
    return this._gamePauseReceived.asEvent();
  }
  public get contentContinueRequested() {
    return this._gameStartReceived.asEvent();
  }
  public get adOpened() {
    return this._adStartedReceived.asEvent();
  }
  public get adClosed() {
    return this._adCompletedReceived.asEvent();
  }
  public get rewardedRewardReceived() {
    return this._rewardedRewardReceived.asEvent();
  }

  public get canShowAdOnLoading(): boolean {
    return false;
  }

  public get locale(): Locale {
    let result = Locale.Russian;

    switch (this.lang) {
      case 'RU':
      case 'BY':
      case 'KZ':
      case 'UA':
      case 'UZ':
        result = Locale.Russian;
        break;
      case 'TR':
        result = Locale.Turkish;
        break;
      case 'DE':
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
    script.src = 'https://sdk.crazygames.com/crazygames-sdk-v3.js';
    document.head.appendChild(script);

    return new Promise((resolve) => {
      script.addEventListener('load', async () => {
        this._sdk = window.CrazyGames.SDK;

        /* this._sdk.addInitCallback((initObject) => {
          this._initObject = initObject;

          this._appID = initObject.gameId ?? '0';
          this._lang = initObject.systemInfo.countryCode ?? 'EN';

          this._sdk.game.sdkGameLoadingStart();

          resolve();
        }); */

        await this._sdk.init();

        this._appID = this._sdk.game.id;
        this._lang = this._sdk.user.systemInfo.countryCode ?? 'EN';

        await new Promise((resolve) => setTimeout(resolve, 100));

        this._sdk.game.loadingStart();

        resolve();
      });
    });
  }

  public ready(): void {
    this._sdk?.game.loadingStop();
  }

  public gameplayStart(): void {
    this._sdk?.game.gameplayStart();
  }

  public gameplayStop(): void {
    this._sdk?.game.gameplayStop();
  }

  public happyTime(): void {
    this._sdk?.game.happytime();
  }

  public async isMe(uniqueID: string): Promise<boolean> {
    if (this._player == null) {
      return Promise.reject();
    }

    return uniqueID == this._player.uuid;
  }

  public async authorizePlayer(): Promise<void> {
    this._sdk?.user.showAuthPrompt();

    return Promise.reject();

    /* return new Promise((resolve, reject) => {
      this._registerUserCallbackReceived.one((info) => {
        if (info.status == 'error') {
          reject(info.errmsg);

          return;
        }

        resolve();
      });

      this._sdk?.registerUser();
    }); */
  }

  public async getPlayer(): Promise<Player> {
    if (this._player !== null) {
      return this._player;
    }

    const user = await this._sdk?.user.getUser();

    if (!user) {
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
    }

    const token = await this._sdk?.user.getUserToken();
    const data = this.parseJwt(token);

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
        return data.username;
      },
      get photo() {
        return {
          small: data.profilePictureUrl,
          medium: data.profilePictureUrl,
          large: data.profilePictureUrl
        };
      },
      get uuid() {
        return data.userId;
      }
    };

    return this._player;
    /* return new Promise((resolve, reject) => {
      this._getLoginStatusCallbackReceived.one(async (loginStatus) => {
        if (loginStatus.status == 'error') {
          reject(loginStatus.errmsg);

          return;
        }

        if (loginStatus.loginStatus == 1) {
          await new Promise<void>((resolve, reject) => {
            this._registerUserCallbackReceived.one((info) => {
              if (info.status == 'error') {
                reject(info.errmsg);

                return;
              }

              resolve();
            });

            this._sdk?.registerUser();
          });
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
    }); */
  }

  public sendAnalyticsEvent(eventName: string, data?: Record<string, any>): void {
    this.log(`Analytic event sended (${eventName}) with data: ${JSON.stringify(data)}`);
  }

  public showInterstitial(/* callbacks?: InterstitialCallbacks */): void {
    let isAdShowed = true;
    this._sdk?.ad.requestAd('midgame', {
      adStarted: () => {
        //callbacks?.onOpen?.();
        this._gamePauseReceived.dispatch();
        this._adStartedReceived.dispatch();
      },
      adError: (error, errorData) => {
        isAdShowed = false;
        //callbacks?.onError?.(new Error(error));
        this._adErrorReceived.dispatch(new Error(error));
      },
      adFinished: () => {
        //callbacks?.onClose?.(isAdShowed);
        this._adCompletedReceived.dispatch(isAdShowed);
        this._gameStartReceived.dispatch();
      }
    });
  }

  public showRewarded(/* callbacks?: RewardedCallbacks */): void {
    let isAdShowed = true;
    this._sdk?.ad.requestAd('rewarded', {
      adStarted: () => {
        //callbacks?.onOpen?.();
        this._gamePauseReceived.dispatch();
        this._adStartedReceived.dispatch();
      },
      adError: (error, errorData) => {
        isAdShowed = false;
        //callbacks?.onError?.(new Error(error));
        this._adErrorReceived.dispatch(new Error(error));
      },
      adFinished: () => {
        //callbacks?.onRewarded?.();
        //callbacks?.onClose?.(isAdShowed);
        this._rewardedRewardReceived.dispatch();
        this._adCompletedReceived.dispatch(isAdShowed);
        this._gameStartReceived.dispatch();
      }
    });
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
    return Promise.reject();
  }

  public async consumeProduct(purchasedProductToken: string): Promise<void> {
    this.log(`Product with token (${purchasedProductToken}) consumed`);

    return Promise.resolve();
  }

  public async setLeaderboardScore(leaderboardName: string, score: number, extraData?: string): Promise<void> {
    this.log(`Set leaderboard (${leaderboardName}) score (${score}) with extraData (${extraData})`);

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
        score: Math.round(Math.random() * 1000 + 1000 * i),
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
              small: 'https://i.pravatar.cc/256?i=' + i,
              medium: 'https://i.pravatar.cc/256?i=' + i,
              large: 'https://i.pravatar.cc/256?i=' + i
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

  public async getFlags(params: FlagsParams): Promise<Record<string, string>> {
    return params.defaultFlags ?? {};
  }

  public async getPlayerData(keys: string[] | undefined = undefined): Promise<Record<string, any>> {
    const data = this._sdk?.data?.getItem('DATA');

    if (!data) {
      return super.getPlayerData(keys);
    }

    const dataJson = JSON.parse(data);

    if (keys === undefined) {
      return dataJson;
    }

    const result: Record<string, any> = {};

    for (const key of keys) {
      result[key] = dataJson[key];
    }

    return result;
  }

  public async setPlayerData(values: Record<string, any>): Promise<void> {
    this._sdk?.data.setItem('DATA', JSON.stringify(values));

    super.setPlayerData(values);
  }

  private parseJwt(token?: string): Record<string, any> {
    if (!token) {
      return {};
    }

    const base64Url = token.split('.')[1];
    const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
    const jsonPayload = decodeURIComponent(
      window
        .atob(base64)
        .split('')
        .map(function (c) {
          return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
        })
        .join('')
    );

    return JSON.parse(jsonPayload);
  }
}
