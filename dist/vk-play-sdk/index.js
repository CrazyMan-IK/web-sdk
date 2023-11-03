import { SimpleEventDispatcher } from 'ste-simple-events';
import { Locale } from '../localization';
import SDKWrapper from '../sdk-wrapper';
export default class VKPlaySDKWrapper extends SDKWrapper {
    _getLoginStatusCallbackReceived = new SimpleEventDispatcher();
    _registerUserCallbackReceived = new SimpleEventDispatcher();
    _getAuthTokenCallbackReceived = new SimpleEventDispatcher();
    _userInfoCallbackReceived = new SimpleEventDispatcher();
    _adsCallbackReceived = new SimpleEventDispatcher();
    _paymentReceivedCallbackReceived = new SimpleEventDispatcher();
    _paymentWindowClosedCallbackReceived = new SimpleEventDispatcher();
    _confirmWindowClosedCallbackReceived = new SimpleEventDispatcher();
    _userConfirmCallbackReceived = new SimpleEventDispatcher();
    _getGameInventoryItemsReceived = new SimpleEventDispatcher();
    _userProfileCallbackReceived = new SimpleEventDispatcher();
    _userFriendsCallbackReceived = new SimpleEventDispatcher();
    _userSocialFriendsCallbackReceived = new SimpleEventDispatcher();
    _isDraft;
    _appID;
    _lang;
    _callbacks;
    _sdk = null;
    _isAuthorized = false;
    constructor() {
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
                this._registerUserCallbackReceived.dispatch(info);
                console.log(`registerUserCallback(${JSON.stringify(info)})`);
            },
            getAuthTokenCallback: (token) => {
                this._getAuthTokenCallbackReceived.dispatch(token);
                console.log(`getAuthTokenCallback(${JSON.stringify(token)})`);
            },
            userInfoCallback: (info) => {
                this._userInfoCallbackReceived.dispatch(info);
                console.log(`userInfoCallback(${JSON.stringify(info)})`);
            },
            adsCallback: (context) => {
                this._adsCallbackReceived.dispatch(context);
                console.log(`adsCallback(${JSON.stringify(context)})`);
            },
            paymentReceivedCallback: (data) => {
                this._paymentReceivedCallbackReceived.dispatch(data);
                console.log(`paymentReceivedCallback(${JSON.stringify(data)})`);
            },
            paymentWindowClosedCallback: () => {
                this._paymentWindowClosedCallbackReceived.dispatch();
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
        return this._lang.substring(0, 2);
    }
    get tld() {
        return this._lang;
    }
    get id() {
        return this._appID;
    }
    get isAuthorized() {
        return this._isAuthorized;
    }
    get isDraft() {
        return this._isDraft;
    }
    async initialize() {
        const script = document.createElement('script');
        script.src = `//vkplay.ru/app/${this._appID}/static/mailru.core.js`;
        document.head.appendChild(script);
        return new Promise((resolve) => {
            script.addEventListener('load', () => {
                window
                    .iframeApi(this._callbacks, { debug: this._isDraft })
                    .then((sdk) => {
                    this._sdk = sdk;
                    resolve();
                })
                    .catch((err) => {
                    throw new Error('Could not init external api ' + err);
                });
            });
        });
    }
    ready() {
        console.log('Ready');
    }
    gameplayStart() {
        console.log('Gameplay Start');
    }
    gameplayStop() {
        console.log('Gameplay Stop');
    }
    happyTime() {
        console.log('Happy Time');
    }
    async isMe(uniqueID) {
        return false;
    }
    async authorizePlayer() {
        return Promise.resolve();
    }
    sendAnalyticsEvent(eventName, data) {
        window.ym(window.yandexMetricaCounterId, 'reachGoal', eventName, data);
    }
    showInterstitial(callbacks) {
        this._adsCallbackReceived.one((context) => {
            if (context.type == 'adError') {
                callbacks?.onError?.(new Error(context.code));
            }
            callbacks?.onClose?.(context.type == 'adCompleted');
        });
        callbacks?.onOpen?.();
        this._sdk?.showAds({ interstitial: true });
    }
    showRewarded(callbacks) {
        this._adsCallbackReceived.one((context) => {
            if (context.type == 'adError') {
                callbacks?.onError?.(new Error(context.code));
            }
            if (context.type == 'adCompleted') {
                callbacks?.onRewarded?.();
                callbacks?.onClose?.(true);
            }
            else {
                callbacks?.onClose?.(false);
            }
        });
        callbacks?.onOpen?.();
        this._sdk?.showAds({ interstitial: false });
    }
    async canReview() {
        return Promise.resolve(false);
    }
    async requestReview() {
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
    async getPurchasedProducts() {
        return Promise.resolve([]);
    }
    async getProductCatalog() {
        return Promise.resolve([]);
    }
    async purchaseProduct(productID, developerPayload) {
        return Promise.resolve({
            productID: productID,
            purchaseToken: '',
            developerPayload: developerPayload,
            signature: ''
        });
    }
    async consumeProduct(purchasedProductToken) {
        console.log(`Product with token (${purchasedProductToken}) consumed`);
        return Promise.resolve();
    }
    async setLeaderboardScore(leaderboardName, score, extraData) {
        console.log(`Set leaderboard (${leaderboardName}) score (${score}) with extraData (${extraData})`);
        return Promise.resolve();
    }
    async getLeaderboardEntries(leaderboardName, topPlayersCount, competingPlayersCount, includeSelf) {
        const result = {
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
            const entry = {
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
                    getAvatarSrc(size) {
                        return 'https://i.pravatar.cc/256';
                    },
                    getAvatarSrcSet(size) {
                        return 'https://i.pravatar.cc/256';
                    }
                },
                formattedScore: ''
            };
            result.entries.push(entry);
        }
        return Promise.resolve(result);
    }
}
//# sourceMappingURL=index.js.map