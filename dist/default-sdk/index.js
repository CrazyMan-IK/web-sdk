import { Locale } from '../localization';
import SDKWrapper from '../sdk-wrapper';
export default class DefaultSDKWrapper extends SDKWrapper {
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
        return Promise.resolve();
    }
    ready() {
        //
    }
    async isMe(uniqueID) {
        return Promise.resolve(true);
    }
    async authorizePlayer() {
        return Promise.resolve();
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
        return Promise.resolve();
    }
    async setLeaderboardScore(leaderboardName, score, extraData) {
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