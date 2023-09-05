"use strict";
exports.id = 504;
exports.ids = [504];
exports.modules = {

/***/ 112:
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

// ESM COMPAT FLAG
__webpack_require__.r(__webpack_exports__);

// EXPORTS
__webpack_require__.d(__webpack_exports__, {
  "default": () => (/* binding */ YandexGamesSDKWrapper)
});

// EXTERNAL MODULE: ./src/localization/index.ts
var localization = __webpack_require__(644);
;// CONCATENATED MODULE: ./src/sdk-wrapper.ts
function getLocalStorageItem(key) {
    try {
        return localStorage.getItem(key);
    }
    catch {
        return null;
    }
}
function setLocalStorageItem(key, value) {
    try {
        localStorage.setItem(key, value);
    }
    catch {
        return;
    }
}
class SDKWrapper {
    get deviceInfo() {
        return {
            type: 'desktop',
            isDesktop: () => true,
            isMobile: () => false,
            isTablet: () => false,
            isTV: () => false
        };
    }
    async getPlayerData(keys) {
        const data = JSON.parse(getLocalStorageItem('DATA') ?? '{}');
        if (keys === undefined) {
            return data;
        }
        const result = {};
        for (const key of keys) {
            result[key] = data[key];
        }
        return result;
    }
    async setPlayerData(values) {
        setLocalStorageItem('DATA', JSON.stringify(values));
    }
}

;// CONCATENATED MODULE: ./src/yandex-sdk/index.ts


class YandexGamesSDKWrapper extends SDKWrapper {
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
        let result = localization/* Locale */.g.Russian;
        const lang = this._sdk.environment.i18n.lang;
        switch (lang) {
            case 'ru':
            case 'be':
            case 'kk':
            case 'uk':
            case 'uz':
                result = localization/* Locale */.g.Russian;
                break;
            case 'tr':
                result = localization/* Locale */.g.Turkish;
                break;
            case 'de':
                result = localization/* Locale */.g.Deutsch;
                break;
            default:
                result = localization/* Locale */.g.English;
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


/***/ })

};
;