"use strict";(self.webpackChunkSDK=self.webpackChunkSDK||[]).push([[311],{973:(e,a,t)=>{t.d(a,{Z:()=>s});class s{get deviceInfo(){return{type:"desktop",isDesktop:()=>!0,isMobile:()=>!1,isTablet:()=>!1,isTV:()=>!1}}async getPlayerData(e){const a=JSON.parse(function(e){try{return localStorage.getItem("DATA")}catch{return null}}()??"{}");if(void 0===e)return a;const t={};for(const s of e)t[s]=a[s];return t}async setPlayerData(e){!function(e,a){try{localStorage.setItem("DATA",a)}catch{return}}(0,JSON.stringify(e))}}},311:(e,a,t)=>{t.r(a),t.d(a,{default:()=>i});var s=t(602),r=t(983),l=t(973);class i extends l.Z{_getLoginStatusCallbackReceived=new s.FK;_registerUserCallbackReceived=new s.FK;_getAuthTokenCallbackReceived=new s.FK;_userInfoCallbackReceived=new s.FK;_adsCallbackReceived=new s.FK;_paymentReceivedCallbackReceived=new s.FK;_paymentWindowClosedCallbackReceived=new s.FK;_confirmWindowClosedCallbackReceived=new s.FK;_userConfirmCallbackReceived=new s.FK;_getGameInventoryItemsReceived=new s.FK;_userProfileCallbackReceived=new s.FK;_userFriendsCallbackReceived=new s.FK;_userSocialFriendsCallbackReceived=new s.FK;_isDraft;_appID;_lang;_callbacks;_sdk=null;_isAuthorized=!1;constructor(){super();const e=new URL(location.href).searchParams;this._isDraft=location.href.startsWith("https://astetrio.github.io/web-games/draft/"),this._appID=e.get("appid")??"0",this._lang=e.get("lang")??"ru_RU",this._callbacks={appid:this._appID,getLoginStatusCallback:e=>{this._getLoginStatusCallbackReceived.dispatch(e),console.log(`getLoginStatusCallback(${JSON.stringify(e)})`)},registerUserCallback:e=>{this._registerUserCallbackReceived.dispatch(e),console.log(`registerUserCallback(${JSON.stringify(e)})`)},getAuthTokenCallback:e=>{this._getAuthTokenCallbackReceived.dispatch(e),console.log(`getAuthTokenCallback(${JSON.stringify(e)})`)},userInfoCallback:e=>{this._userInfoCallbackReceived.dispatch(e),console.log(`userInfoCallback(${JSON.stringify(e)})`)},adsCallback:e=>{this._adsCallbackReceived.dispatch(e),console.log(`adsCallback(${JSON.stringify(e)})`)},paymentReceivedCallback:e=>{this._paymentReceivedCallbackReceived.dispatch(e),console.log(`paymentReceivedCallback(${JSON.stringify(e)})`)},paymentWindowClosedCallback:()=>{this._paymentWindowClosedCallbackReceived.dispatch(),console.log("paymentWindowClosedCallback")},confirmWindowClosedCallback:()=>{this._confirmWindowClosedCallbackReceived.dispatch(),console.log("confirmWindowClosedCallback")},userConfirmCallback:()=>{this._userConfirmCallbackReceived.dispatch(),console.log("userConfirmCallback")},getGameInventoryItems:()=>{this._getGameInventoryItemsReceived.dispatch(),console.log("getGameInventoryItems")},userProfileCallback:e=>{this._userProfileCallbackReceived.dispatch(e),console.log(`userProfileCallback(${JSON.stringify(e)})`)},userFriendsCallback:e=>{this._userFriendsCallbackReceived.dispatch(e),console.log(`userFriendsCallback(${JSON.stringify(e)})`)},userSocialFriendsCallback:e=>{this._userSocialFriendsCallbackReceived.dispatch(e),console.log(`userSocialFriendsCallback(${JSON.stringify(e)})`)}}}get locale(){let e=r.g.Russian;switch(this.lang){case"ru":case"be":case"kk":case"uk":case"uz":e=r.g.Russian;break;case"tr":e=r.g.Turkish;break;case"de":e=r.g.Deutsch;break;default:e=r.g.English}return e}get lang(){return this._lang.substring(0,2)}get tld(){return this._lang}get id(){return this._appID}get isAuthorized(){return this._isAuthorized}get isDraft(){return this._isDraft}async initialize(){const e=document.createElement("script");return e.src=`//vkplay.ru/app/${this._appID}/static/mailru.core.js`,document.head.appendChild(e),new Promise((a=>{e.addEventListener("load",(()=>{window.iframeApi(this._callbacks,{debug:this._isDraft}).then((e=>{this._sdk=e,a()})).catch((e=>{throw new Error("Could not init external api "+e)}))}))}))}ready(){console.log("Ready")}gameplayStart(){console.log("Gameplay Start")}gameplayStop(){console.log("Gameplay Stop")}happyTime(){console.log("Happy Time")}async isMe(e){return!1}async authorizePlayer(){return Promise.resolve()}sendAnalyticsEvent(e,a){window.ym(window.yandexMetricaCounterId,"reachGoal",e,a)}showInterstitial(e){this._adsCallbackReceived.one((a=>{"adError"==a.type&&e?.onError?.(new Error(a.code)),e?.onClose?.("adCompleted"==a.type)})),e?.onOpen?.(),this._sdk?.showAds({interstitial:!0})}showRewarded(e){this._adsCallbackReceived.one((a=>{"adError"==a.type&&e?.onError?.(new Error(a.code)),"adCompleted"==a.type?(e?.onRewarded?.(),e?.onClose?.(!0)):e?.onClose?.(!1)})),e?.onOpen?.(),this._sdk?.showAds({interstitial:!1})}async canReview(){return Promise.resolve(!1)}async requestReview(){return Promise.reject()}async getPurchasedProducts(){return Promise.resolve([])}async getProductCatalog(){return Promise.resolve([])}async purchaseProduct(e,a){return Promise.resolve({productID:e,purchaseToken:"",developerPayload:a,signature:""})}async consumeProduct(e){return console.log(`Product with token (${e}) consumed`),Promise.resolve()}async setLeaderboardScore(e,a,t){return console.log(`Set leaderboard (${e}) score (${a}) with extraData (${t})`),Promise.resolve()}async getLeaderboardEntries(e,a,t,s){const r={leaderboard:{appID:"",dеfault:!1,description:{invert_sort_order:!1,score_format:{options:{decimal_offset:0}},type:""},name:e,title:{en:"",ru:""}},ranges:[],userRank:0,entries:[]};t??=5;for(let e=t;e>0;e--){const a={score:1e3*Math.random()+1e3*e,extraData:"",rank:t-e+1,player:{lang:"ru",publicName:"Debug Name",scopePermissions:{avatar:"allow",public_name:"allow"},uniqueID:"",getAvatarSrc:e=>"https://i.pravatar.cc/256",getAvatarSrcSet:e=>"https://i.pravatar.cc/256"},formattedScore:""};r.entries.push(a)}return Promise.resolve(r)}}}}]);