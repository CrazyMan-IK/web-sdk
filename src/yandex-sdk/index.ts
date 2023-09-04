import { Locale } from '../localization';
import SDKWrapper, { DeviceInfo, InterstitialCallbacks } from '../sdk-wrapper';

export default class YandexGamesSDKWrapper extends SDKWrapper {
  private readonly _sdk: YandexGamesSDK;

  private _player: Player | null = null;
  private _isAuthorized: boolean = false;
  private _isDraft: boolean = false;

  public constructor(sdk: YandexGamesSDK) {
    super();

    this._sdk = sdk;
    this._isDraft = location.hash.search('draft=true') >= 0;
  }

  public get locale(): Locale {
    let result = Locale.Russian;

    const lang = this._sdk.environment.i18n.lang;
    switch (lang) {
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

  public get deviceInfo(): DeviceInfo {
    return this._sdk.deviceInfo;
  }

  public get environment() {
    return this._sdk.environment;
  }

  public get isDraft() {
    return this._isDraft;
  }

  public async initialize(): Promise<void> {
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

  public showInterstitial(callbacks?: InterstitialCallbacks): void {
    this._sdk.adv.showFullscreenAdv({ callbacks });
  }

  public showRewarded(callbacks?: InterstitialCallbacks): void {
    this._sdk.adv.showRewardedVideo({ callbacks });
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

  public async getPlayerData(keys: string[] | undefined = undefined): Promise<Record<string, any>> {
    if (this._player === null) {
      return this.getPlayer()
        .then((player) => {
          return player.getData(keys);
        })
        .catch(() => {
          return super.getPlayerData(keys);
        });
    }

    return this._player.getData(keys).catch(() => {
      return super.getPlayerData(keys);
    });
  }

  public async setPlayerData(values: Record<string, any>): Promise<void> {
    if (this._player === null) {
      return this.getPlayer()
        .then((player) => {
          return player.setData(values);
        })
        .finally(() => {
          return super.setPlayerData(values);
        });
    }

    return this._player.setData(values).finally(() => {
      return super.setPlayerData(values);
    });
  }
}
