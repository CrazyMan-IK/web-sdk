import { Locale } from '../localization';
import SDKWrapper from '../sdk-wrapper';
export default class DefaultSDKWrapper extends SDKWrapper {
    static UniquePlayerID = 'UniquePlayerID';
    _overridedProductsCatalog = [];
    _lang;
    _tld;
    _isDraft;
    _isAuthorized = false;
    constructor() {
        super();
        const urlParams = new URL(location.href).searchParams;
        this._lang = urlParams.get('lang') ?? 'ru';
        this._tld = urlParams.get('tld') ?? 'ru';
        this._isDraft = urlParams.get('draft') === 'true';
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
        return this._lang;
    }
    get tld() {
        return this._tld;
    }
    get id() {
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
    get isAuthorized() {
        return this._isAuthorized;
    }
    /* public get isDraft() {
      return this._isDraft;
    } */
    async initialize() {
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
        return uniqueID == DefaultSDKWrapper.UniquePlayerID;
    }
    async authorizePlayer() {
        this._isAuthorized = true;
        return Promise.resolve();
    }
    async getPlayer() {
        const isAuthorized = this._isAuthorized;
        const player = {
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
    sendAnalyticsEvent(eventName, data) {
        console.log(`Analytic event sended (${eventName}) with data: ${data}`);
    }
    showInterstitial(callbacks) {
        callbacks?.onOpen?.();
        callbacks?.onClose?.(true);
        console.log('Interstitial Showed');
    }
    showRewarded(callbacks) {
        callbacks?.onOpen?.();
        callbacks?.onRewarded?.();
        callbacks?.onClose?.(true);
        console.log('Rewarded Showed');
    }
    async canReview() {
        const value = Math.round(Math.random()) != 0;
        const result = value ? { value } : { value, reason: 'UNKNOWN' };
        return Promise.resolve(result);
    }
    async requestReview() {
        console.log('Review requested');
        return Promise.resolve({ feedbackSent: Math.round(Math.random()) != 0 });
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
        return Promise.resolve({
            purchaseData: {
                productID: productID,
                purchaseTime: 0,
                purchaseToken: '',
                developerPayload: developerPayload
            },
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
                        return i == me ? DefaultSDKWrapper.UniquePlayerID : '';
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