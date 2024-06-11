import { SimpleEventDispatcher } from 'ste-simple-events';
import { keyof } from '../global';
import { Locale } from '../localization';
import SDKWrapper from '../sdk-wrapper';
export default class CrazyGamesSDKWrapper extends SDKWrapper {
    _adErrorReceived = new SimpleEventDispatcher();
    _adStartedReceived = new SimpleEventDispatcher();
    _adCompletedReceived = new SimpleEventDispatcher();
    _gamePauseReceived = new SimpleEventDispatcher();
    _gameStartReceived = new SimpleEventDispatcher();
    _rewardedRewardReceived = new SimpleEventDispatcher();
    _overridedProductsCatalog = [];
    _isDraft;
    _player = null;
    _sdk = null;
    //private _initObject: InitializeObject | null = null;
    //private _playerInfo: UserInfo | null = null;
    _isAuthorized = false;
    _appID = '0';
    _lang = 'EN';
    constructor() {
        super(keyof({ CrazyGamesSDKWrapper }));
        this._isDraft = location.href.startsWith('https://prod-dpgames.crazygames.com/');
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
        return false;
    }
    get locale() {
        let result = Locale.Russian;
        switch (this.lang) {
            case 'RU':
            case 'BY':
            case 'KZ':
            case 'UA':
            case 'UZ':
                result = Locale.Russian;
                break;
            case 'TR':
                result = Locale.Turkish;
                break;
            case 'DE':
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
        script.src = 'https://sdk.crazygames.com/crazygames-sdk-v3.js';
        document.head.appendChild(script);
        return new Promise((resolve) => {
            script.addEventListener('load', async () => {
                this._sdk = window.CrazyGames.SDK;
                /* this._sdk.addInitCallback((initObject) => {
                  this._initObject = initObject;
        
                  this._appID = initObject.gameId ?? '0';
                  this._lang = initObject.systemInfo.countryCode ?? 'EN';
        
                  this._sdk.game.sdkGameLoadingStart();
        
                  resolve();
                }); */
                await this._sdk.init();
                this._appID = this._sdk.game.id;
                this._lang = this._sdk.user.systemInfo.countryCode ?? 'EN';
                this._sdk.game.sdkGameLoadingStart();
                resolve();
            });
        });
    }
    ready() {
        this._sdk?.game.sdkGameLoadingStop();
    }
    gameplayStart() {
        this._sdk?.game.gameplayStart();
    }
    gameplayStop() {
        this._sdk?.game.gameplayStop();
    }
    happyTime() {
        this._sdk?.game.happytime();
    }
    async isMe(uniqueID) {
        if (this._player == null) {
            return Promise.reject();
        }
        return uniqueID == this._player.uuid;
    }
    async authorizePlayer() {
        this._sdk?.user.showAuthPrompt();
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
        const user = await this._sdk?.user.getUser();
        if (!user) {
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
        }
        const token = await this._sdk?.user.getUserToken();
        const data = this.parseJwt(token);
        this._player = {
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
                return data.username;
            },
            get photo() {
                return {
                    small: data.profilePictureUrl,
                    medium: data.profilePictureUrl,
                    large: data.profilePictureUrl
                };
            },
            get uuid() {
                return data.userId;
            }
        };
        return this._player;
        /* return new Promise((resolve, reject) => {
          this._getLoginStatusCallbackReceived.one(async (loginStatus) => {
            if (loginStatus.status == 'error') {
              reject(loginStatus.errmsg);
    
              return;
            }
    
            if (loginStatus.loginStatus == 1) {
              await new Promise<void>((resolve, reject) => {
                this._registerUserCallbackReceived.one((info) => {
                  if (info.status == 'error') {
                    reject(info.errmsg);
    
                    return;
                  }
    
                  resolve();
                });
    
                this._sdk?.registerUser();
              });
            }
    
            if (loginStatus.loginStatus > 1) {
              this._userProfileCallbackReceived.one((userProfile) => {
                if (userProfile.status == 'error') {
                  reject(userProfile.errmsg);
    
                  return;
                }
    
                this._player = {
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
                    return userProfile.nick;
                  },
                  get photo() {
                    return {
                      small: userProfile.avatar,
                      medium: userProfile.avatar,
                      large: userProfile.avatar
                    };
                  },
                  get uuid() {
                    return userProfile.slug;
                  }
                };
    
                this._sdk?.userInfo();
    
                resolve(this._player);
              });
    
              this._sdk?.userProfile();
    
              return;
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
    
            resolve(this._player);
          });
    
          this._sdk?.getLoginStatus();
        }); */
    }
    sendAnalyticsEvent(eventName, data) {
        this.log(`Analytic event sended (${eventName}) with data: ${JSON.stringify(data)}`);
    }
    showInterstitial( /* callbacks?: InterstitialCallbacks */) {
        let isAdShowed = true;
        this._sdk?.ad.requestAd('midgame', {
            adStarted: () => {
                //callbacks?.onOpen?.();
                this._gamePauseReceived.dispatch();
                this._adStartedReceived.dispatch();
            },
            adError: (error, errorData) => {
                isAdShowed = false;
                //callbacks?.onError?.(new Error(error));
                this._adErrorReceived.dispatch(new Error(error));
            },
            adFinished: () => {
                //callbacks?.onClose?.(isAdShowed);
                this._adCompletedReceived.dispatch(isAdShowed);
                this._gameStartReceived.dispatch();
            }
        });
    }
    showRewarded( /* callbacks?: RewardedCallbacks */) {
        let isAdShowed = true;
        this._sdk?.ad.requestAd('rewarded', {
            adStarted: () => {
                //callbacks?.onOpen?.();
                this._gamePauseReceived.dispatch();
                this._adStartedReceived.dispatch();
            },
            adError: (error, errorData) => {
                isAdShowed = false;
                //callbacks?.onError?.(new Error(error));
                this._adErrorReceived.dispatch(new Error(error));
            },
            adFinished: () => {
                //callbacks?.onRewarded?.();
                //callbacks?.onClose?.(isAdShowed);
                this._rewardedRewardReceived.dispatch();
                this._adCompletedReceived.dispatch(isAdShowed);
                this._gameStartReceived.dispatch();
            }
        });
    }
    async canReview() {
        return Promise.resolve({ value: false, reason: 'UNKNOWN' });
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
        this.log(`Product with token (${purchasedProductToken}) consumed`);
        return Promise.resolve();
    }
    async setLeaderboardScore(leaderboardName, score, extraData) {
        this.log(`Set leaderboard (${leaderboardName}) score (${score}) with extraData (${extraData})`);
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
                            small: 'https://i.pravatar.cc/256?i=' + i,
                            medium: 'https://i.pravatar.cc/256?i=' + i,
                            large: 'https://i.pravatar.cc/256?i=' + i
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
    async getPlayerData(keys = undefined) {
        const data = this._sdk?.data?.getItem('DATA');
        if (!data) {
            return super.getPlayerData(keys);
        }
        const dataJson = JSON.parse(data);
        if (keys === undefined) {
            return dataJson;
        }
        const result = {};
        for (const key of keys) {
            result[key] = dataJson[key];
        }
        return result;
    }
    async setPlayerData(values) {
        this._sdk?.data.setItem('DATA', JSON.stringify(values));
        super.setPlayerData(values);
    }
    parseJwt(token) {
        if (!token) {
            return {};
        }
        const base64Url = token.split('.')[1];
        const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
        const jsonPayload = decodeURIComponent(window
            .atob(base64)
            .split('')
            .map(function (c) {
            return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
        })
            .join(''));
        return JSON.parse(jsonPayload);
    }
}
//# sourceMappingURL=index.js.map