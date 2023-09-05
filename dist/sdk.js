import { SimpleEventDispatcher } from 'ste-simple-events';
import Localization from './localization';
const STATIC_INIT = Symbol();
export default class SDK {
    static _adOpened = new SimpleEventDispatcher();
    static _adClosed = new SimpleEventDispatcher();
    static _initialized = new SimpleEventDispatcher();
    static _rewardedAdReward = new SimpleEventDispatcher();
    static _sdk;
    static _prefs = undefined;
    static _settingPromise = undefined;
    static _settingTimeout = undefined;
    static _nextData = undefined;
    static _isInitialized = false;
    static _isGettingData = false;
    static _gettings = new Map();
    static _settingDataCooldown = 2;
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
        await sdk.initialize();
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
        Localization.locale = sdk.locale;
        await this.getPlayerData();
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
        this._sdk.ready();
        /*if (this._sdk.isAdOpened) {
          this._adOpened.dispatch();
          while (this._sdk.isAdOpened) {
            await new Promise((resolve) => setTimeout(resolve, 0));
          }
          this._adClosed.dispatch();
        }*/
    }
    static get adOpened() {
        return this._adOpened.asEvent();
    }
    static get adClosed() {
        return this._adClosed.asEvent();
    }
    static get rewardedAdReward() {
        return this._rewardedAdReward.asEvent();
    }
    /*public static get IsAuthorized(): boolean {
      return PlayerAccount.IsAuthorized;
    }
  
    public static get TLD(): string {
      return YandexGamesSdk.Environment.i18n.tld;
    }*/
    /* public static get Lang(): string {
      return this._sdk.environment.i18n.lang;
    } */
    /* public static get ID(): string {
      return this._sdk.environment.app.id;
    } */
    static get deviceInfo() {
        return this._sdk.deviceInfo;
    }
    static get isInitialized() {
        return this._isInitialized;
    }
    static async waitInitialization() {
        const promise = new Promise((resolve) => {
            const loop = () => {
                if (this._isInitialized) {
                    resolve();
                    return;
                }
                setTimeout(loop, 50);
            };
            loop();
        });
        return promise;
    }
    //public static async authorizePlayer(): Promise<void> {}
    static sendAnalyticsEvent(eventName, data) {
        window.ym(window.yandexMetricaCounterId, 'reachGoal', eventName, data);
        console.log(`Analytic event sended (${eventName}) with data: ${data}`);
    }
    static async showInterstitial(callbacks) {
        this._sdk.showInterstitial({
            onOpen: () => {
                callbacks.onOpen?.call(undefined);
                this._adOpened.dispatch();
            },
            onClose: (wasShown) => {
                callbacks.onClose?.call(undefined, wasShown);
                this._adClosed.dispatch();
            },
            onError: callbacks.onError
        });
    }
    static async showRewarded(id, callbacks) {
        this._sdk.showRewarded({
            onOpen: () => {
                callbacks.onOpen?.call(undefined);
                this._adOpened.dispatch();
            },
            onRewarded: () => {
                callbacks.onRewarded?.call(undefined);
                this._rewardedAdReward.dispatch(id);
            },
            onClose: (wasShown) => {
                callbacks.onClose?.call(undefined, wasShown);
                this._adClosed.dispatch();
            },
            onError: callbacks.onError
        });
    }
    /*public static async getPurchasedProducts(): Promise<GetPurchasedProductsResponse> {}
  
    public static async getProductCatalog(): Promise<GetProductCatalogResponse> {}
  
    public static async purchaseProduct(productId: string, playersCount: number = 5, includeSelf: boolean = true): Promise<PurchaseProductResponse> {}*/
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
    static async setValues(values) {
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
}
if ('YaGames' in window) {
    window.YaGames.init().then(async (sdk) => {
        const YandexGamesSDKWrapper = (await import(/* webpackChunkName: 'yandex-sdk' */ './yandex-sdk')).default;
        return SDK[STATIC_INIT](new YandexGamesSDKWrapper(sdk));
    });
}
//# sourceMappingURL=sdk.js.map