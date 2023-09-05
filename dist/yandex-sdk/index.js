import { Locale } from '../localization';
import SDKWrapper from '../sdk-wrapper';
export default class YandexGamesSDKWrapper extends SDKWrapper {
    _sdk;
    _player = null;
    _isAuthorized = false;
    _isDraft = false;
    constructor(sdk) {
        super();
        this._sdk = sdk;
        this._isDraft = location.hash.search('draft=true') >= 0;
    }
    get locale() {
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
    get deviceInfo() {
        return this._sdk.deviceInfo;
    }
    get environment() {
        return this._sdk.environment;
    }
    get isDraft() {
        return this._isDraft;
    }
    async initialize() {
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
    ready() {
        this._sdk.features.LoadingAPI?.ready();
    }
    showInterstitial(callbacks) {
        this._sdk.adv.showFullscreenAdv({ callbacks });
    }
    showRewarded(callbacks) {
        this._sdk.adv.showRewardedVideo({ callbacks });
    }
    async getPlayer() {
        if (this._player !== null) {
            return this._player;
        }
        return this._sdk.getPlayer({ scopes: false }).then((player) => {
            this._isAuthorized = player.getMode() !== 'lite';
            this._player = player;
            return player;
        });
    }
    async getPlayerData(keys = undefined) {
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
    async setPlayerData(values) {
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
//# sourceMappingURL=index.js.map