import { SimpleEventDispatcher } from 'ste-simple-events';
import { keyof } from '../global';
import { Locale } from '../localization';
import SDKWrapper from '../sdk-wrapper';
export default class YandexGamesSDKWrapper extends SDKWrapper {
    _adErrorReceived = new SimpleEventDispatcher();
    _adStartedReceived = new SimpleEventDispatcher();
    _adCompletedReceived = new SimpleEventDispatcher();
    _gamePauseReceived = new SimpleEventDispatcher();
    _gameStartReceived = new SimpleEventDispatcher();
    _rewardedRewardReceived = new SimpleEventDispatcher();
    //private readonly _overridedProductsCatalog: Product[] = [];
    _isYandex;
    _isDraft;
    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
    _sdk = null;
    _player = null;
    _yplayer = null;
    _payments = null;
    _leaderboards = null;
    _isAuthorized = false;
    constructor( /* sdk: YandexGamesSDK */) {
        super(keyof({ YandexGamesSDKWrapper }));
        //this._sdk = sdk;
        this._isYandex = !!(location.hostname.match(/app-\d{6}\.games\.s3\.yandex\.net/) || decodeURIComponent(location.hash).match(/origin=https:\/\/yandex\.(.+)&draft=true/));
        this._isDraft = location.hash.search('draft=true') >= 0;
    }
    get contentPauseRequested() {
        return this._gamePauseReceived.asEvent();
    }
    get contentContinueRequested() {
        return this._gameStartReceived.asEvent();
    }
    get adOpened() {
        return this._adStartedReceived.asEvent();
    }
    get adClosed() {
        return this._adCompletedReceived.asEvent();
    }
    get rewardedRewardReceived() {
        return this._rewardedRewardReceived.asEvent();
    }
    get canShowAdOnLoading() {
        return true;
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
        (function (m, e, t, r, i, k, a) {
            m[i] =
                m[i] ||
                    function (...rest) {
                        (m[i].a = m[i].a || []).push(rest);
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
        const domContentLoaded = () => {
            const navigationTiming = performance.getEntriesByType('navigation')[0];
            const pageLoadTime = navigationTiming.domContentLoadedEventStart - navigationTiming.startTime; // performance.timing.domContentLoadedEventStart - performance.timing.navigationStart;
            window.ym(window.yandexMetricaCounterId, 'reachGoal', 'pageLoad', { pageLoadTime: pageLoadTime / 1000 });
        };
        if (document.readyState !== 'loading') {
            domContentLoaded();
        }
        else {
            window.addEventListener('DOMContentLoaded', domContentLoaded);
        }
        const script = document.createElement('script');
        script.src = this._isYandex ? '/sdk.js' : 'https://sdk.games.s3.yandex.net/sdk.js';
        document.head.appendChild(script);
        await new Promise((resolve) => {
            script.addEventListener('load', () => {
                window.YaGames.init().then(async (sdk) => {
                    this._sdk = sdk;
                    resolve();
                });
            });
        });
        await this.getPlayer();
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
    gameplayStart() {
        this.log('Gameplay Start');
        this._sdk.features.GameplayAPI?.start();
    }
    gameplayStop() {
        this.log('Gameplay Stop');
        this._sdk.features.GameplayAPI?.stop();
    }
    happyTime() {
        this.log('Happy Time');
    }
    async isMe(uniqueID) {
        return this.getPlayer()
            .then((player) => player.uuid == uniqueID)
            .catch(() => false);
    }
    async authorizePlayer() {
        return this._sdk.auth.openAuthDialog().then(async () => {
            this._yplayer = null;
            await this.getPlayerInternal();
        });
    }
    async getPlayer() {
        if (this._player !== null) {
            return this._player;
        }
        return this.getPlayerInternal()
            .then((player) => {
            this._player = {
                get isAuthorized() {
                    return player.getMode() !== 'lite';
                },
                get hasNamePermission() {
                    return player._personalInfo.scopePermissions.public_name == 'allow';
                },
                get hasPhotoPermission() {
                    return player._personalInfo.scopePermissions.avatar == 'allow';
                },
                get name() {
                    return player.getName();
                },
                get photo() {
                    return {
                        small: player.getPhoto('small'),
                        medium: player.getPhoto('medium'),
                        large: player.getPhoto('large')
                    };
                },
                get uuid() {
                    return player.getUniqueID();
                }
            };
            return this._player;
        })
            .catch(() => {
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
        });
    }
    sendAnalyticsEvent(eventName, data) {
        window.ym(window.yandexMetricaCounterId, 'reachGoal', eventName, data);
    }
    showInterstitial( /* callbacks?: InterstitialCallbacks */) {
        //this._sdk.adv.showFullscreenAdv({ callback });
        this._gamePauseReceived.dispatch();
        this._sdk.adv.showFullscreenAdv({
            callbacks: {
                onOpen: () => {
                    this._adStartedReceived.dispatch();
                },
                onClose: (wasShown) => {
                    this._adCompletedReceived.dispatch(wasShown);
                    this._gameStartReceived.dispatch();
                },
                onError: (error) => {
                    this._adErrorReceived.dispatch(error);
                }
            }
        });
    }
    showRewarded( /* callbacks?: RewardedCallbacks */) {
        //this._sdk.adv.showRewardedVideo({ callbacks });
        this._gamePauseReceived.dispatch();
        this._sdk.adv.showRewardedVideo({
            callbacks: {
                onOpen: () => {
                    this._adStartedReceived.dispatch();
                },
                onRewarded: () => {
                    this._rewardedRewardReceived.dispatch();
                },
                onClose: (wasShown) => {
                    this._adCompletedReceived.dispatch(wasShown);
                    this._gameStartReceived.dispatch();
                },
                onError: (error) => {
                    this._adErrorReceived.dispatch(error);
                }
            }
        });
    }
    async canReview() {
        return this._sdk.feedback.canReview();
    }
    async requestReview() {
        return this._sdk.feedback.requestReview();
    }
    async getPlayerInternal() {
        if (this._yplayer !== null) {
            return this._yplayer;
        }
        return this._sdk.getPlayer({ scopes: false }).then((player) => {
            this._isAuthorized = player.getMode() !== 'lite';
            this._yplayer = player;
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
    overrideProductsCatalog( /* catalog: Product[] */) {
        /* this._overridedProductsCatalog.length = 0;
        this._overridedProductsCatalog.push(...catalog); */
    }
    async getProductCatalog() {
        /* return this._overridedProductsCatalog.length > 0 && this._overridedProductsCatalog[0].prices.YAN
          ? Promise.resolve(this._overridedProductsCatalog)
          :  */
        return this.getPayments().then(async (payments) => {
            const catalog = await payments.getCatalog();
            const result = catalog.map((x) => ({
                id: x.id,
                imageURI: x.imageURI,
                currencyImageURI: x.getPriceCurrencyImage('medium'),
                svgCurrencyImageURI: x.getPriceCurrencyImage('svg'),
                meta: {
                    en: {
                        name: x.title,
                        description: x.description
                    },
                    ru: {
                        name: x.title,
                        description: x.description
                    }
                },
                prices: {
                    YAN: parseFloat(x.priceValue)
                }
            }));
            return result;
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
        return this.getLeaderboards().then(async (leaderboards) => {
            const response = await leaderboards.getLeaderboardEntries(leaderboardName, {
                includeUser: includeSelf,
                quantityAround: competingPlayersCount,
                quantityTop: topPlayersCount
            });
            const result = {
                ...response,
                entries: response.entries.map((entry) => ({
                    ...entry,
                    player: {
                        ...entry.player,
                        isAuthorized: entry.player.scopePermissions.avatar != 'not_set',
                        hasNamePermission: entry.player.scopePermissions.public_name == 'allow',
                        hasPhotoPermission: entry.player.scopePermissions.avatar == 'allow',
                        name: entry.player.publicName,
                        photo: {
                            small: entry.player.getAvatarSrc('small'),
                            medium: entry.player.getAvatarSrc('medium'),
                            large: entry.player.getAvatarSrc('large')
                        },
                        uuid: entry.player.uniqueID
                    }
                }))
            };
            return result;
        });
    }
    async getFlags(params) {
        return this._sdk.getFlags(params);
    }
    async getPlayerData(keys = undefined) {
        //if (this._player === null) {
        return this.getPlayerInternal()
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
        return this.getPlayerInternal()
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