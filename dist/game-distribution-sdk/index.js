import { SimpleEventDispatcher } from 'ste-simple-events';
import { Locale } from '../localization';
import SDKWrapper from '../sdk-wrapper';
export default class GameDistributionSDKWrapper extends SDKWrapper {
    _adErrorReceived = new SimpleEventDispatcher();
    _gamePauseReceived = new SimpleEventDispatcher();
    _gameStartReceived = new SimpleEventDispatcher();
    _rewardedRewardReceived = new SimpleEventDispatcher();
    _overridedProductsCatalog = [];
    _isDraft;
    _appID;
    _lang;
    _options;
    _player = null;
    _sdk = null;
    _isAuthorized = false;
    constructor(appID) {
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
                console.log(`${GameDistributionSDKWrapper.name} received native sdk event: `, event);
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
        if (this._player == null) {
            return Promise.reject();
        }
        return uniqueID == this._player.uuid;
    }
    async authorizePlayer() {
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
    async getPlayer() {
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
    sendAnalyticsEvent(eventName, data) {
        console.log(`Analytic event sended (${eventName}) with data: ${JSON.stringify(data)}`);
        if (eventName == 'track-milestone' && data != null && 'isAuthorized' in data && 'milestoneDescription' in data) {
            this._sdk?.sendEvent({
                eventName,
                data: data
            });
        }
        else if (eventName == 'game_event' && data != null && 'level' in data && 'score' in data) {
            this._sdk?.sendEvent({
                eventName,
                data: data
            });
        }
    }
    showInterstitial(callbacks) {
        this._gamePauseReceived.one(() => {
            callbacks?.onOpen?.();
        });
        this._gameStartReceived.one(() => {
            callbacks?.onClose?.(true);
        });
        this._sdk?.showAd(this._sdk?.AdType.Interstitial);
    }
    showRewarded(callbacks) {
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
    async canReview() {
        return Promise.resolve({ value: false, reason: 'UNKNOWN' });
    }
    async requestReview() {
        return Promise.reject();
    }
    async getPurchasedProducts() {
        const result = [];
        result.signature = '';
        return Promise.resolve(result);
    }
    overrideProductsCatalog(catalog) {
        this._overridedProductsCatalog.length = 0;
        this._overridedProductsCatalog.push(...catalog);
    }
    async getProductCatalog() {
        return Promise.resolve(this._overridedProductsCatalog);
    }
    async purchaseProduct(productID, developerPayload) {
        return Promise.reject();
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
            const entry = {
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
    async getFlags(params) {
        return params.defaultFlags ?? {};
    }
}
//# sourceMappingURL=index.js.map