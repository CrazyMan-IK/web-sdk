import { SimpleEventDispatcher } from 'ste-simple-events';
import Localization from './localization';
const STATIC_INIT = Symbol();
export default class SDK {
    static _contentPauseRequested = new SimpleEventDispatcher();
    static _contentContinueRequested = new SimpleEventDispatcher();
    static _initialized = new SimpleEventDispatcher();
    static _rewardedAdReward = new SimpleEventDispatcher();
    static _sdk;
    static _prefs = undefined;
    static _settingPromise = undefined;
    static _settingTimeout = undefined;
    static _nextData = undefined;
    static _currentRewardedID = '';
    static _isInitialized = false;
    static _isGettingData = false;
    static _isAdOpened = false;
    static _gettings = new Map();
    static _settingDataCooldown = 2;
    static _gameplayStopsCount = 1;
    /*private _startDelay: number = 0.25;
    private _isPlayerAuthorized: boolean = true;
    private _showFakeAdvertisement: boolean = true;
    private _locale: string = 'ru';*/
    //Locale.private _debugProducts: CatalogProduct[] = [];
    static async [STATIC_INIT](sdk) {
        if (this._isInitialized) {
            return;
        }
        this._sdk = sdk;
        await this._sdk.initialize();
        this._sdk.contentPauseRequested.subscribe(this._contentPauseRequested.dispatch.bind(this._contentPauseRequested));
        this._sdk.contentContinueRequested.subscribe(this._contentContinueRequested.dispatch.bind(this._contentContinueRequested));
        this._sdk.adOpened.subscribe(this.onAdOpened.bind(this));
        this._sdk.adClosed.subscribe(this.onAdClosed.bind(this));
        this._sdk.rewardedRewardReceived.subscribe(this.onRewardedRewardReceived.bind(this));
        /*let lang = YandexGamesSdk.Environment.i18n.lang;
        switch (lang) {
          case 'ru':
          case 'be':
          case 'kk':
          case 'uk':
          case 'uz':
            lang = Locale.Russian;
            break;
          case 'tr':
            lang = Locale.Turkish;
            break;
          case 'de':
            lang = Locale.Deutsch;
            break;
          default:
            lang = Locale.English;
            break;
        }*/
        //Localization.locale = lang;
        Localization.locale = this._sdk.locale;
        await this.getPlayerData();
        if (this._sdk.canShowAdOnLoading && window.showAdOnLoading && !this._prefs?.ADS_DISABLED) {
            this.getFlags({ defaultFlags: { ad_show_startup: 'true' } }).then((values) => {
                if (values['ad_show_startup'] == 'true') {
                    this.showInterstitial();
                }
            });
        }
        window.addEventListener('beforeunload', () => {
            if (!this._prefs) {
                return;
            }
            if (!this._settingTimeout && !this._settingPromise) {
                return;
            }
            clearTimeout(this._settingTimeout);
            this._settingTimeout = undefined;
            this._settingPromise = undefined;
            /* let isWorking = true;
            try {
              this._sdk.setPlayerData(this._prefs).finally(() => (isWorking = false));
            } finally {
              isWorking = false;
            }
      
            while (isWorking); */
            /* if (navigator.sendBeacon && this._sdk instanceof YandexGamesSDKWrapper) {
              navigator.sendBeacon(
                `https://games-sdk.yandex.ru/games/api/sdk/v1/player/data?${this._sdk.isDraft ? 'draft=true&' : ''}app-id=${this._sdk.environment.app.id}`,
                JSON.stringify(this._prefs)
              );
            } */
        });
        let lastCShiftTime = 0;
        window.addEventListener('keydown', (e) => {
            if (e.ctrlKey && e.shiftKey && e.code == 'ShiftRight') {
                if (e.timeStamp - lastCShiftTime > 250) {
                    lastCShiftTime = e.timeStamp;
                    return;
                }
                console.log('DATA RESETED');
                this.removeKeyByPredicate(() => true);
            }
        });
        this._isInitialized = true;
        this._initialized.dispatch();
        //setLocalStorageItem('DATA', JSON.stringify(this._prefs));
        if (!window.externalReady) {
            this.ready();
        }
        /*if (this._sdk.isAdOpened) {
          this._adOpened.dispatch();
          while (this._sdk.isAdOpened) {
            await new Promise((resolve) => setTimeout(resolve, 0));
          }
          this._adClosed.dispatch();
        }*/
    }
    static get contentPauseRequested() {
        return this._contentPauseRequested.asEvent();
    }
    static get contentContinueRequested() {
        return this._contentContinueRequested.asEvent();
    }
    static get rewardedAdReward() {
        return this._rewardedAdReward.asEvent();
    }
    static get currentSdkName() {
        return this._sdk.name;
    }
    static get isAuthorized() {
        return this._sdk.isAuthorized;
    }
    static get tld() {
        return this._sdk.tld;
    }
    static get lang() {
        return this._sdk.lang;
    }
    static get id() {
        return this._sdk.id;
    }
    static get deviceInfo() {
        return this._sdk.deviceInfo;
    }
    static get isInitialized() {
        return this._isInitialized;
    }
    static get isAdOpened() {
        return this._isAdOpened;
    }
    static async waitInitialization() {
        if (this._isInitialized) {
            return Promise.resolve();
        }
        const promise = new Promise((resolve) => {
            this._initialized.one(() => {
                resolve();
            });
        });
        /* const promise = new Promise<void>((resolve) => {
          const loop = () => {
            if (this._isInitialized) {
              resolve();
    
              return;
            }
    
            setTimeout(loop, 50);
          };
    
          loop();
        }); */
        return promise;
    }
    static ready() {
        this._sdk.ready();
    }
    static async isMe(uniqueID) {
        return this._sdk.isMe(uniqueID);
    }
    static gameplayStart() {
        if (this._gameplayStopsCount > 0 && --this._gameplayStopsCount === 0) {
            this._sdk.gameplayStart();
        }
    }
    static gameplayStop() {
        if (this._gameplayStopsCount++ === 0) {
            this._sdk.gameplayStop();
        }
    }
    static happyTime() {
        this._sdk.happyTime();
    }
    static async authorizePlayer() {
        return this._sdk.authorizePlayer();
    }
    static async getPlayer() {
        return this._sdk.getPlayer();
    }
    static sendAnalyticsEvent(eventName, data) {
        this._sdk.sendAnalyticsEvent(eventName, data);
    }
    static requestAdPreload(adType) {
        //this._sdk.tryRequestAdPreload
    }
    static showInterstitial() {
        if (this._isAdOpened) {
            return false;
        }
        this._sdk.showInterstitial( /* {
          onOpen: () => {
            this._isAdOpened = true;
    
            callbacks?.onOpen?.();
            this._adOpened.dispatch();
          },
          onClose: (wasShown) => {
            this._isAdOpened = false;
    
            callbacks?.onClose?.(wasShown);
            this._adClosed.dispatch();
          },
          onError: callbacks?.onError
        } */);
        return true;
    }
    static showRewarded(id) {
        if (this._isAdOpened) {
            return false;
        }
        this._currentRewardedID = id;
        this._sdk.showRewarded( /* {
          onOpen: () => {
            this._isAdOpened = true;
    
            callbacks?.onOpen?.();
            this._adOpened.dispatch();
          },
          onRewarded: () => {
            callbacks?.onRewarded?.();
            this._rewardedAdReward.dispatch(id);
          },
          onClose: (wasShown) => {
            this._isAdOpened = false;
    
            callbacks?.onClose?.(wasShown);
            this._adClosed.dispatch();
          },
          onError: callbacks?.onError
        } */);
        return true;
    }
    static async canReview() {
        return this._sdk.canReview();
    }
    static async requestReview() {
        return this._sdk.requestReview();
    }
    static async getPurchasedProducts() {
        return this._sdk.getPurchasedProducts();
    }
    static overrideProductsCatalog(catalog) {
        this._sdk.overrideProductsCatalog(catalog);
    }
    static async getProductCatalog() {
        return this._sdk.getProductCatalog();
    }
    static async purchaseProduct(productId, developerPayload) {
        return this._sdk.purchaseProduct(productId, developerPayload);
    }
    static async consumeProduct(purchasedProductToken) {
        return this._sdk.consumeProduct(purchasedProductToken);
    }
    static async setLeaderboardScore(leaderboardName, score, extraData) {
        return this._sdk.setLeaderboardScore(leaderboardName, score, extraData);
    }
    static async getLeaderboardEntries(leaderboardName, topPlayersCount, competingPlayersCount, includeSelf) {
        return this._sdk.getLeaderboardEntries(leaderboardName, topPlayersCount, competingPlayersCount, includeSelf);
    }
    static async getFlags(params) {
        return this._sdk.getFlags(params);
    }
    static async getAllValues() {
        if (!this.isInitialized) {
            return new Promise((resolve) => {
                this._gettings.set(null, resolve);
            });
        }
        if (this._prefs) {
            return this._prefs;
        }
        return this.getPlayerData()
            .then((data) => {
            return data;
        })
            .catch(() => {
            return new Promise((resolve) => {
                this._gettings.set(null, resolve);
            });
        });
    }
    static async getValues(keys, defaultValues) {
        if (!this.isInitialized) {
            return new Promise((resolve) => {
                this._gettings.set([keys, defaultValues], resolve);
            });
        }
        if (this._prefs) {
            const result = defaultValues;
            for (let i = 0; i < keys.length; i++) {
                const key = keys[i];
                result[i] = this._prefs[key] ?? defaultValues[i];
            }
            return result;
        }
        return this.getPlayerData()
            .then((data) => {
            const result = defaultValues;
            for (let i = 0; i < keys.length; i++) {
                const key = keys[i];
                result[i] = data[key] ?? defaultValues[i];
            }
            return result;
        })
            .catch(() => {
            return new Promise((resolve) => {
                this._gettings.set([keys, defaultValues], resolve);
            });
        });
    }
    static setValues(values) {
        if (!this.isInitialized) {
            return;
        }
        if (!this._prefs) {
            this.getPlayerData().then((data) => {
                for (const key in values) {
                    data[key] = values[key];
                }
                this.setPlayerData(data);
            });
            return;
        }
        for (const key in values) {
            this._prefs[key] = values[key];
        }
        this.setPlayerData(this._prefs);
    }
    static async replaceValues(values) {
        this._prefs = values;
        this.setPlayerData(this._prefs);
    }
    static async removeKeys(keys) {
        if (!this.isInitialized) {
            return;
        }
        if (!this._prefs) {
            this.getPlayerData().then((data) => {
                for (let i = 0; i < keys.length; i++) {
                    delete data.remove[keys[i]];
                }
                this.setPlayerData(data);
            });
            return;
        }
        for (let i = 0; i < keys.length; i++) {
            delete this._prefs[keys[i]];
        }
        this.setPlayerData(this._prefs);
    }
    static async removeKeyByPredicate(predicate) {
        if (!this.isInitialized) {
            return;
        }
        if (!this._prefs) {
            this.getPlayerData().then((data) => {
                const keys = Object.keys(data).filter(predicate);
                this.removeKeys(keys);
            });
            return;
        }
        const keys = Object.keys(this._prefs).filter(predicate);
        this.removeKeys(keys);
    }
    static forceSaveChanges() {
        if (this._settingTimeout) {
            const data = this._nextData ?? this._prefs;
            if (!data) {
                return;
            }
            this._nextData = undefined;
            clearTimeout(this._settingTimeout);
            this._settingPromise = this.setPlayerDataRuntime(data);
        }
    }
    /*public static async tryRequestReview(): Promise<boolean> {}
  
    private static async showAdEditor(): Promise<void> {}
  
    private static async showInterstitialEditor(): Promise<void> {}
  
    private static async showRewardedEditor(id: string): Promise<void> {}
  
    private static async tryGetProductCatalog(): Promise<GetProductCatalogResponse> {}
  
    private static async tryGetPurchasedProducts(): Promise<GetPurchasedProductsResponse> {}
  
    private static async tryGetLeaderboardEntries(
      leaderboardName: string,
      topPlayersCount: number = 5,
      competingPlayersCount: number = 5,
      includeSelf: boolean = true
    ): Promise<LeaderboardGetEntriesResponse> {}*/
    static async getPlayerData() {
        if (this._isGettingData) {
            return Promise.reject();
        }
        this._isGettingData = true;
        return new Promise((resolve) => {
            this._sdk.getPlayerData().then((data) => {
                this._prefs = data;
                this.onDataGetted();
                this._isGettingData = false;
                resolve(data);
            }) /*
              .catch(() => {
                const prefsData = getLocalStorageItem('DATA');
      
                let prefs;
                if (prefsData !== null) {
                  prefs = JSON.parse(prefsData);
                } else {
                  prefs = {};
                }
                this._prefs = prefs;
      
                this.onDataGetted();
      
                this._isGettingData = false;
      
                resolve(prefs);
              })*/;
        });
    }
    static onDataGetted() {
        //var getting = this._getting.ToDictionary(x => x.Key, x => x.Value);
        //_getting.Clear();
        const gettings = this._gettings;
        this._gettings = new Map();
        //for (const key in getting) {
        //var value = _prefs[key] ?? defaultValue;
        /* DEV_START */
        //console.log(`Get (${key}, ${defaultValue}) = ${value}`);
        /* DEV_END */
        //callback?.Invoke(value);
        //gettings.get(key)?.call(undefined);
        //}
        gettings.forEach((value, values) => {
            if (values == null) {
                value(this._prefs);
                return;
            }
            const result = [];
            for (let i = 0; i < values[0].length; i++) {
                const key = values[0][i];
                result[i] = this._prefs?.[key] ?? values[1][i];
            }
            /*for (const key in values) {
              result[key] = this._prefs?.[key] ?? values[key];
            }*/
            value(result);
        });
        //var gettings = _gettings.ToDictionary(x => x.Key, x => x.Value);
        //_gettings.Clear();
        /*foreach (var ((key, defaultValue), callback) in gettings)
        {
            var values = new int[key.Length];
            for (int i = 0; i < key.Length; i++)
            {
                values[i] = _prefs.GetValue(key[i])?.Value<int>() ?? defaultValue[i];
            }*/
        /* DEV_START */
        //Debug.Log($"Get ({keys}, {defaultValues}) = {values}");
        /* DEV_END */
        //callback?.Invoke(values);
        //}
        if (this._gettings.size > 0) {
            // || _gettings.Count > 0)
            //GetPlayerData(null);
            this.onDataGetted();
        }
    }
    static setPlayerData(data) {
        //data = { ...data };
        if (this._settingPromise) {
            this._nextData = data;
            return;
        }
        if (this._settingTimeout) {
            clearTimeout(this._settingTimeout);
        }
        this._settingTimeout = setTimeout(() => {
            this._settingTimeout = undefined;
            this._settingPromise = this.setPlayerDataRuntime(data);
        }, 50);
    }
    static async setPlayerDataRuntime(data) {
        //const str = JSON.stringify(data);
        this._sdk.setPlayerData(data);
        //localStorage.setItem('DATA', str);
        await new Promise((resolve) => setTimeout(resolve, this._settingDataCooldown * 1000));
        if (!this._settingPromise) {
            return;
        }
        this._settingPromise = undefined;
        if (this._nextData) {
            data = this._nextData;
            this._nextData = undefined;
            this.setPlayerData(data);
        }
    }
    static onAdOpened() {
        this._isAdOpened = true;
    }
    static onAdClosed() {
        this._isAdOpened = false;
    }
    static onRewardedRewardReceived() {
        this._rewardedAdReward.dispatch(this._currentRewardedID);
        this._currentRewardedID = '';
    }
}
const isInitialized = (() => {
    let match = location.hostname.match(/app-\d{6}\.games\.s3\.yandex\.net/);
    if (!match) {
        match = decodeURIComponent(location.hash).match(/origin=https:\/\/yandex\.(.+)&draft=true/);
    }
    if (match) {
        /* (window as any).YaGames.init().then(async (sdk: YandexGamesSDK) => {
          const YandexGamesSDKWrapper = (await import('./yandex-sdk')).default;
    
          return SDK[STATIC_INIT](new YandexGamesSDKWrapper(sdk));
        }); */
        (async () => {
            const YandexGamesSDKWrapper = (await import('./yandex-sdk')).default;
            return SDK[STATIC_INIT](new YandexGamesSDKWrapper());
        })();
        return true;
    }
    match = location.hostname.match(/game-files\.crazygames\.com/);
    if (!match) {
        match = location.hostname.match(/prod-dpgames\.crazygames\.com/);
    }
    if (match || location.href.search('platform=CrazyGames') >= 0) {
        (async () => {
            const CrazyGamesSDKWrapper = (await import('./crazy-games-sdk')).default;
            return SDK[STATIC_INIT](new CrazyGamesSDKWrapper());
        })();
        return true;
    }
    match = location.href.match(/appid=(\d+)/);
    if (match && location.href.search('platform=VKPlay') >= 0) {
        (async () => {
            const VKPlaySDKWrapper = (await import('./vk-play-sdk')).default;
            return SDK[STATIC_INIT](new VKPlaySDKWrapper());
        })();
        return true;
    }
    match = location.href.match(/gamedistribution\.com\/(?:.+\/)?(.{32})/);
    if (match || location.href.search('platform=GameDistribution') >= 0) {
        (async () => {
            const GameDistributionSDKWrapper = (await import('./game-distribution-sdk')).default;
            return SDK[STATIC_INIT](new GameDistributionSDKWrapper(match?.[1] ?? ''));
        })();
        return true;
    }
    if ('_cordovaNative' in window) {
        (async () => {
            const AndroidSDKWrapper = (await import('./android-sdk')).default;
            return SDK[STATIC_INIT](new AndroidSDKWrapper());
        })();
        return true;
    }
    return false;
})();
if (!isInitialized) {
    (async () => {
        const DefaultSDKWrapper = (await import('./default-sdk')).default;
        return SDK[STATIC_INIT](new DefaultSDKWrapper());
    })();
}
//# sourceMappingURL=sdk.js.map