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
  CanReviewResponse
} from '../sdk-wrapper';

export default class DefaultSDKWrapper extends SDKWrapper {
  public static readonly UniquePlayerID: string = 'UniquePlayerID';

  private readonly _overridedProductsCatalog: Product[] = [];
  private readonly _lang: string;
  private readonly _tld: string;
  private readonly _isDraft: boolean;
  private _isAuthorized: boolean = false;

  public constructor() {
    super();

    const urlParams = new URL(location.href).searchParams;

    this._lang = urlParams.get('lang') ?? 'ru';
    this._tld = urlParams.get('tld') ?? 'ru';
    this._isDraft = urlParams.get('draft') === 'true';
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
    return this._lang;
  }

  public get tld(): string {
    return this._tld;
  }

  public get id(): string {
    return '0';
  }

  /* public get deviceInfo(): DeviceInfo {
    let deviceType = 'desktop';

    const userAgent = navigator.userAgent.toLowerCase();
    if (/android|webos|iphone|ipad|ipod|blackberry|iemobile|opera mini/i.test(userAgent)) {
      deviceType = 'mobile';
    } else if (/tablet|ipad|playbook|silk|(puffin(?!.*(IP|AP|WP))))/.test(userAgent)) {
      deviceType = 'tablet';
    } else if (/smart-tv|googlebot|google-tv|tv|netcast.televisions|nettv.tv/i.test(userAgent)) {
      deviceType = 'tv';
    }

    return {
      type: deviceType,
      isDesktop() {
        return deviceType == 'desktop';
      },
      isMobile() {
        return deviceType == 'mobile';
      },
      isTablet() {
        return deviceType == 'tablet';
      },
      isTV() {
        return deviceType == 'tv';
      }
    };
  }

  public get environment() {
    return {};
  } */

  public get isAuthorized() {
    return this._isAuthorized;
  }

  /* public get isDraft() {
    return this._isDraft;
  } */

  public async initialize(): Promise<void> {
    //this.getPlayer();
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

    await this.getPlayer();

    return Promise.resolve();
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
    return uniqueID == DefaultSDKWrapper.UniquePlayerID;
  }

  public async authorizePlayer(): Promise<void> {
    this._isAuthorized = true;

    return Promise.resolve();
  }

  public async getPlayer(): Promise<Player> {
    const isAuthorized = this._isAuthorized;
    const player: Player = {
      get isAuthorized() {
        return isAuthorized;
      },
      get hasNamePermission() {
        return this.isAuthorized;
      },
      get hasPhotoPermission() {
        return this.isAuthorized;
      },
      get name() {
        return 'ABOBUS';
      },
      get photo() {
        return {
          small: 'https://i.pravatar.cc/256',
          medium: 'https://i.pravatar.cc/256',
          large: 'https://i.pravatar.cc/256'
        };
      },
      get uuid() {
        return DefaultSDKWrapper.UniquePlayerID;
      }
    };

    return Promise.resolve(player);
  }

  public sendAnalyticsEvent(eventName: string, data?: Record<string, any> | undefined): void {
    console.log(`Analytic event sended (${eventName}) with data: ${data}`);
  }

  public showInterstitial(callbacks?: InterstitialCallbacks): void {
    callbacks?.onOpen?.();
    callbacks?.onClose?.(true);

    console.log('Interstitial Showed');
  }

  public showRewarded(callbacks?: RewardedCallbacks): void {
    callbacks?.onOpen?.();
    callbacks?.onRewarded?.();
    callbacks?.onClose?.(true);

    console.log('Rewarded Showed');
  }

  public async canReview(): Promise<CanReviewResponse> {
    const value = Math.round(Math.random()) != 0;
    const result: CanReviewResponse = value ? { value } : { value, reason: 'UNKNOWN' };

    return Promise.resolve(result);
  }

  public async requestReview(): Promise<{ feedbackSent: boolean }> {
    console.log('Review requested');

    return Promise.resolve({ feedbackSent: Math.round(Math.random()) != 0 });
  }

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
    return Promise.resolve<{ purchaseData: Purchase } & Signature>({
      purchaseData: {
        productID: productID,
        purchaseTime: 0,
        purchaseToken: '',
        developerPayload: developerPayload
      },
      signature: ''
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
    const me = includeSelf ? Math.floor(Math.random() * competingPlayersCount + 1) : -1;
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
            return i == me ? DefaultSDKWrapper.UniquePlayerID : '';
          }
        },

        formattedScore: ''
      };

      result.entries.push(entry);
    }

    return Promise.resolve(result);
  }
}
