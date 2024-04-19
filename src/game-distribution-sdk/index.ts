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
import { GameDistributionSDK } from './game-distribution-sdk-definitions';

type GDEventSDKNames =
  | 'SDK_READY' //When the SDK is ready
  | 'SDK_ERROR' //When the SDK has hit a critical error
  | 'SDK_GAME_START' //When the game should start
  | 'SDK_GAME_PAUSE' //When the game should pause
  | 'SDK_GDPR_TRACKING' //When the publishers' client has requested to not track his/her data. Hook into this event to find out if you can record client tracking data
  | 'SDK_GDPR_TARGETING' //When the publishers' client has requested to not get personalized advertisements. Hook into this event to find out if you can display personalized advertisements in case you use another ad solution
  | 'SDK_GDPR_THIRD_PARTY' //When the publishers' client has requested to not load third party services. Hook into this event to find out if you can third party services like Facebook, AddThis, and such alike
  | 'SDK_REWARDED_WATCH_COMPLETE'; //When your user completely watched rewarded ad
type GDEventIMASDKNames =
  | 'AD_SDK_MANAGER_READY' //When the adsManager instance is ready with ads
  | 'AD_SDK_CANCELED'; //When the ad is cancelled or stopped because it's done running an ad
type GDEventADNames =
  | 'AD_ERROR' //When the ad it self has an error
  | 'AD_BREAK_READY' //Fired when an ad rule or a VMAP ad break would have played if autoPlayAdBreaks is false
  | 'AD_METADATA' //Fired when an ads list is loaded
  | 'ALL_ADS_COMPLETED' //Fired when the ads manager is done playing all the ads
  | 'CLICK' //Fired when the ad is clicked
  | 'COMPLETE' //Fired when the ad completes playing
  | 'CONTENT_PAUSE_REQUESTED' //Fired when content should be paused. This usually happens right before an ad is about to cover the content
  | 'CONTENT_RESUME_REQUESTED' //Fired when content should be resumed. This usually happens when an ad finishes or collapses
  | 'DURATION_CHANGE' //Fired when the ad's duration changes
  | 'FIRST_QUARTILE' //Fired when the ad playhead crosses first quartile
  | 'IMPRESSION' //Fired when the impression URL has been pinged
  | 'INTERACTION' //Fired when an ad triggers the interaction callback. Ad interactions contain an interaction ID string in the ad data
  | 'LINEAR_CHANGED' //Fired when the displayed ad changes from linear to nonlinear, or vice versa
  | 'LOADED' //Fired when ad data is available
  | 'LOG' //Fired when a non-fatal error is encountered. The user need not take any action since the SDK will continue with the same or next ad playback depending on the error situation
  | 'MIDPOINT' //Fired when the ad playhead crosses midpoint
  | 'PAUSED' //Fired when the ad is paused
  | 'RESUMED' //Fired when the ad is resumed
  | 'SKIPPABLE_STATE_CHANGED' //Fired when the displayed ads skippable state is changed
  | 'SKIPPED' //Fired when the ad is skipped by the user
  | 'STARTED' //Fired when the ad starts playing
  | 'THIRD_QUARTILE' //Fired when the ad playhead crosses third quartile
  | 'USER_CLOSE' //Fired when the ad is closed by the user
  | 'VOLUME_CHANGED' //Fired when the ad volume has changed
  | 'VOLUME_MUTED'; //Fired when the ad volume has been muted

type GDEvent = {
  adPosition?: 'rewarded' | 'preroll' | 'midroll' | 'interstitial';
  message: string;
  name: GDEventSDKNames | GDEventIMASDKNames | GDEventADNames;
  skipForward?: boolean;
  status: 'success' | 'warning' | 'error';
};

type GameDistributionOptions = {
  readonly gameId: string;
  readonly prefix?: string;
  readonly advertisementSettings?: {
    debug?: boolean;
    autoplay?: boolean;
    locale?: string;
  };
  onEvent?(event: GDEvent): void;
};

declare const window: {
  readonly gdsdk: GameDistributionSDK;
  GD_OPTIONS: GameDistributionOptions;
} & Window;

export default class GameDistributionSDKWrapper extends SDKWrapper {
  private readonly _adErrorReceived: SimpleEventDispatcher<void> = new SimpleEventDispatcher();
  private readonly _gamePauseReceived: SimpleEventDispatcher<void> = new SimpleEventDispatcher();
  private readonly _gameStartReceived: SimpleEventDispatcher<void> = new SimpleEventDispatcher();
  private readonly _rewardedRewardReceived: SimpleEventDispatcher<void> = new SimpleEventDispatcher();

  private readonly _overridedProductsCatalog: Product[] = [];
  private readonly _isDraft: boolean;
  private readonly _appID: string;
  private readonly _lang: string;
  private readonly _options: GameDistributionOptions;

  private _player: Player | null = null;
  private _sdk: GameDistributionSDK | null = null;
  private _isAuthorized: boolean = false;

  public constructor(appID: string) {
    super();

    //https://revision.gamedistribution.com/765220aabfd34362b969a612682949e8/
    //https://html5.gamedistribution.com/rvvASMiM/282636e45a99479897f4cc6dae83e27b/index.html
    //https://html5.gamedistribution.com/1253e3f36b984801811d744f4db1125d/
    //https://html5.gamedistribution.com/264b40aeb81246f59a19310cde99bdcd/
    //https://html5.gamedistribution.com/rvvASMiM/264b40aeb81246f59a19310cde99bdcd/index.html

    this._isDraft = location.href.startsWith('https://revision.gamedistribution.com/');
    this._appID = appID;
    this._lang = 'en_US';
    this._options = {
      gameId: this._appID,

      onEvent: (event) => {
        console.log(`${keyof({ GameDistributionSDKWrapper })} received native sdk event: `, event);

        switch (event.name) {
          case 'AD_ERROR':
            this._adErrorReceived.dispatch();
            break;
          case 'SDK_GAME_PAUSE':
            this._gamePauseReceived.dispatch();
            break;
          case 'SDK_GAME_START':
            this._gameStartReceived.dispatch();
            break;
          case 'SDK_REWARDED_WATCH_COMPLETE':
            this._rewardedRewardReceived.dispatch();
            break;
        }
      }
    };

    window.GD_OPTIONS = this._options;
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
    script.id = 'gamedistribution-jssdk';
    script.src = 'https://html5.api.gamedistribution.com/main.min.js';
    document.head.appendChild(script);

    return new Promise((resolve) => {
      script.addEventListener('load', () => {
        this._sdk = window.gdsdk;

        resolve();
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
    if (this._player == null) {
      return Promise.reject();
    }

    return uniqueID == this._player.uuid;
  }

  public async authorizePlayer(): Promise<void> {
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

    return Promise.resolve(this._player);
  }

  public sendAnalyticsEvent(eventName: string, data?: Record<string, any>): void {
    console.log(`Analytic event sended (${eventName}) with data: ${JSON.stringify(data)}`);

    if (eventName == 'track-milestone' && data != null && 'isAuthorized' in data && 'milestoneDescription' in data) {
      this._sdk?.sendEvent({
        eventName,
        data: data as { isAuthorized: boolean; milestoneDescription: string }
      });
    } else if (eventName == 'game_event' && data != null && 'level' in data && 'score' in data) {
      this._sdk?.sendEvent({
        eventName,
        data: data as { level: number; score: number }
      });
    }
  }

  public showInterstitial(callbacks?: InterstitialCallbacks): void {
    this._gamePauseReceived.one(() => {
      callbacks?.onOpen?.();
    });

    this._gameStartReceived.one(() => {
      callbacks?.onClose?.(true);
    });

    this._sdk?.showAd(this._sdk?.AdType.Interstitial);
  }

  public showRewarded(callbacks?: RewardedCallbacks): void {
    this._gamePauseReceived.one(() => {
      callbacks?.onOpen?.();
    });

    this._rewardedRewardReceived.one(() => {
      callbacks?.onRewarded?.();
    });

    this._gameStartReceived.one(() => {
      callbacks?.onClose?.(true);
    });

    this._sdk?.showAd(this._sdk?.AdType.Rewarded);
  }

  public async canReview(): Promise<CanReviewResponse> {
    return Promise.resolve({ value: false, reason: 'UNKNOWN' });
  }

  public async requestReview(): Promise<{ feedbackSent: boolean }> {
    return Promise.reject();
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
    return Promise.reject();
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

  public async getFlags(params: FlagsParams): Promise<Record<string, string>> {
    return params.defaultFlags ?? {};
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
