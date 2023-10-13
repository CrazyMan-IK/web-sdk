import { Locale } from '../localization';
import SDKWrapper from '../sdk-wrapper';
export default class YandexGamesSDKWrapper extends SDKWrapper {
    _sdk;
    _player = null;
    _payments = null;
    _leaderboards = null;
    _isAuthorized = false;
    _isDraft = false;
    constructor(sdk) {
        super();
        this._sdk = sdk;
        this._isDraft = location.hash.search('draft=true') >= 0;
    }
    get locale() {
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
    get lang() {
        return this._sdk.environment.i18n.lang;
    }
    get tld() {
        return this._sdk.environment.i18n.tld;
    }
    get id() {
        return this._sdk.environment.app.id;
    }
    get deviceInfo() {
        return this._sdk.deviceInfo;
    }
    get environment() {
        return this._sdk.environment;
    }
    get isAuthorized() {
        return this._isAuthorized;
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
    async isMe(uniqueID) {
        return this.getPlayer()
            .then((player) => player.getUniqueID() == uniqueID)
            .catch(() => false);
    }
    async authorizePlayer() {
        return this._sdk.auth.openAuthDialog();
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
    async getPayments() {
        if (this._payments !== null) {
            return this._payments;
        }
        return this._sdk.getPayments().then((payments) => {
            this._payments = payments;
            return payments;
        });
    }
    async getLeaderboards() {
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
    async getPurchasedProducts() {
        return this.getPayments().then((payments) => {
            return payments.getPurchases();
        });
    }
    async getProductCatalog() {
        return this.getPayments().then((payments) => {
            return payments.getCatalog();
        });
    }
    async purchaseProduct(productID, developerPayload) {
        return this.getPayments().then((payments) => {
            return payments.purchase({ id: productID, developerPayload });
        });
    }
    async consumeProduct(purchasedProductToken) {
        return this.getPayments().then((payments) => {
            return payments.consumePurchase(purchasedProductToken);
        });
    }
    async setLeaderboardScore(leaderboardName, score, extraData) {
        return this.getLeaderboards().then((leaderboards) => {
            return leaderboards.setLeaderboardScore(leaderboardName, score, extraData);
        });
    }
    async getLeaderboardEntries(leaderboardName, topPlayersCount, competingPlayersCount, includeSelf) {
        return this.getLeaderboards().then((leaderboards) => {
            return leaderboards.getLeaderboardEntries(leaderboardName, {
                includeUser: includeSelf,
                quantityAround: competingPlayersCount,
                quantityTop: topPlayersCount
            });
        });
    }
    async getPlayerData(keys = undefined) {
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
    async setPlayerData(values) {
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
//# sourceMappingURL=index.js.map