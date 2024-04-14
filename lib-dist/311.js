"use strict";(self.webpackChunkSDK=self.webpackChunkSDK||[]).push([[311],{973:(e,t,a)=>{a.d(t,{Z:()=>r});class r{get deviceInfo(){return{type:"desktop",isDesktop:()=>!0,isMobile:()=>!1,isTablet:()=>!1,isTV:()=>!1}}async getPlayerData(e){const t=JSON.parse(function(e){try{return localStorage.getItem("DATA")}catch{return null}}()??"{}");if(void 0===e)return t;const a={};for(const r of e)a[r]=t[r];return a}async setPlayerData(e){!function(e,t){try{localStorage.setItem("DATA",t)}catch{return}}(0,JSON.stringify(e))}}},311:(e,t,a)=>{a.r(t),a.d(t,{default:()=>o});var r=a(602),s=a(983),i=a(973);class o extends i.Z{_getLoginStatusCallbackReceived=new r.FK;_registerUserCallbackReceived=new r.FK;_getAuthTokenCallbackReceived=new r.FK;_userInfoCallbackReceived=new r.FK;_adsCallbackReceived=new r.FK;_paymentCompletedCallbackReceived=new r.FK;_confirmWindowClosedCallbackReceived=new r.FK;_userConfirmCallbackReceived=new r.FK;_getGameInventoryItemsReceived=new r.FK;_userProfileCallbackReceived=new r.FK;_userFriendsCallbackReceived=new r.FK;_userSocialFriendsCallbackReceived=new r.FK;_overridedProductsCatalog=[];_isDraft;_appID;_lang;_callbacks;_player=null;_sdk=null;_playerInfo=null;_isAuthorized=!1;constructor(){super();const e=new URL(location.href).searchParams;this._isDraft=location.href.startsWith("https://astetrio.github.io/web-games/draft/"),this._appID=e.get("appid")??"0",this._lang=e.get("lang")??"ru_RU",this._callbacks={appid:this._appID,getLoginStatusCallback:e=>{this._getLoginStatusCallbackReceived.dispatch(e),console.log(`getLoginStatusCallback(${JSON.stringify(e)})`)},registerUserCallback:e=>{"ok"==e.status&&(this._isAuthorized=!0,this._playerInfo=e),this._registerUserCallbackReceived.dispatch(e),console.log(`registerUserCallback(${JSON.stringify(e)})`)},getAuthTokenCallback:e=>{this._getAuthTokenCallbackReceived.dispatch(e),console.log(`getAuthTokenCallback(${JSON.stringify(e)})`)},userInfoCallback:e=>{"ok"==e.status&&(this._isAuthorized=!0,this._playerInfo=e),this._userInfoCallbackReceived.dispatch(e),console.log(`userInfoCallback(${JSON.stringify(e)})`)},adsCallback:e=>{this._adsCallbackReceived.dispatch(e),console.log(`adsCallback(${JSON.stringify(e)})`)},paymentWaitCallback:e=>{console.log(`paymentWaitCallback(${JSON.stringify(e)})`)},paymentReceivedCallback:e=>{this._paymentCompletedCallbackReceived.dispatch({status:"received",uid:e.uid}),console.log(`paymentReceivedCallback(${JSON.stringify(e)})`)},paymentWindowClosedCallback:()=>{this._paymentCompletedCallbackReceived.dispatch({status:"closed"}),console.log("paymentWindowClosedCallback")},confirmWindowClosedCallback:()=>{this._confirmWindowClosedCallbackReceived.dispatch(),console.log("confirmWindowClosedCallback")},userConfirmCallback:()=>{this._userConfirmCallbackReceived.dispatch(),console.log("userConfirmCallback")},getGameInventoryItems:()=>{this._getGameInventoryItemsReceived.dispatch(),console.log("getGameInventoryItems")},userProfileCallback:e=>{this._userProfileCallbackReceived.dispatch(e),console.log(`userProfileCallback(${JSON.stringify(e)})`)},userFriendsCallback:e=>{this._userFriendsCallbackReceived.dispatch(e),console.log(`userFriendsCallback(${JSON.stringify(e)})`)},userSocialFriendsCallback:e=>{this._userSocialFriendsCallbackReceived.dispatch(e),console.log(`userSocialFriendsCallback(${JSON.stringify(e)})`)}}}get canShowAdOnLoading(){return!0}get locale(){let e=s.g.Russian;switch(this.lang){case"ru":case"be":case"kk":case"uk":case"uz":e=s.g.Russian;break;case"tr":e=s.g.Turkish;break;case"de":e=s.g.Deutsch;break;default:e=s.g.English}return e}get lang(){return this._lang.substring(0,2)}get tld(){return this._lang}get id(){return this._appID}get isAuthorized(){return this._isAuthorized}get isDraft(){return this._isDraft}async initialize(){const e=document.createElement("script");return e.src=`//vkplay.ru/app/${this._appID}/static/mailru.core.js`,document.head.appendChild(e),new Promise((t=>{e.addEventListener("load",(()=>{window.iframeApi(this._callbacks,{debug:this._isDraft}).then((async e=>{this._sdk=e,await this.getPlayer(),t()})).catch((e=>{throw new Error("Could not init external api "+e)}))}))}))}ready(){console.log("Ready")}gameplayStart(){console.log("Gameplay Start")}gameplayStop(){console.log("Gameplay Stop")}happyTime(){console.log("Happy Time")}async isMe(e){return null==this._playerInfo?Promise.reject():e==this._playerInfo.uid.toString()}async authorizePlayer(){return this._sdk?.authUser(),Promise.reject()}async getPlayer(){return null!==this._player?this._player:new Promise(((e,t)=>{this._getLoginStatusCallbackReceived.one((async a=>{if("error"!=a.status){if(1==a.loginStatus&&await new Promise(((e,t)=>{this._registerUserCallbackReceived.one((a=>{"error"!=a.status?e():t(a.errmsg)})),this._sdk?.registerUser()})),a.loginStatus>1)return this._userProfileCallbackReceived.one((a=>{"error"!=a.status?(this._player={get isAuthorized(){return!0},get hasNamePermission(){return!0},get hasPhotoPermission(){return!0},get name(){return a.nick},get photo(){return{small:a.avatar,medium:a.avatar,large:a.avatar}},get uuid(){return a.slug}},this._sdk?.userInfo(),e(this._player)):t(a.errmsg)})),void this._sdk?.userProfile();this._player={get isAuthorized(){return!1},get hasNamePermission(){return!1},get hasPhotoPermission(){return!1},get name(){return""},get photo(){return{small:"",medium:"",large:""}},get uuid(){return""}},e(this._player)}else t(a.errmsg)})),this._sdk?.getLoginStatus()}))}sendAnalyticsEvent(e,t){console.log(`Analytic event sended (${e}) with data: ${JSON.stringify(t)}`)}showInterstitial(e){this._adsCallbackReceived.one((t=>{"adError"==t.type&&e?.onError?.(new Error(t.code));const a="adCompleted"==t.type;setTimeout((()=>{e?.onClose?.(a)}),1e3)})),e?.onOpen?.(),this._sdk?.showAds({interstitial:!0})}showRewarded(e){this._adsCallbackReceived.one((t=>{"adError"==t.type&&e?.onError?.(new Error(t.code));let a=!1;"adCompleted"==t.type&&(e?.onRewarded?.(),a=!0),setTimeout((()=>{e?.onClose?.(a)}),1e3)})),e?.onOpen?.(),this._sdk?.showAds({interstitial:!1})}async canReview(){return Promise.resolve({value:!1,reason:"UNKNOWN"})}async requestReview(){return Promise.reject()}async getPurchasedProducts(){const e=[];return e.signature="",Promise.resolve(e)}overrideProductsCatalog(e){this._overridedProductsCatalog.length=0,this._overridedProductsCatalog.push(...e)}async getProductCatalog(){return Promise.resolve(this._overridedProductsCatalog)}async purchaseProduct(e,t){return new Promise(((a,r)=>{const s=this._overridedProductsCatalog.find((t=>t.id==e));if(null==s||null==s.prices.RUB||s.prices.RUB<=0)return void r();let i;switch(this._paymentCompletedCallbackReceived.one((s=>{"closed"!=s.status?a({purchaseData:{productID:e,purchaseTime:0,purchaseToken:s.uid.toString(),developerPayload:t},signature:""}):r()})),this.lang){case"ru":i=s.meta.ru;break;case"tr":i=s.meta.tr;break;case"de":i=s.meta.de;break;default:i=s.meta.en}i?.description||(i=s.meta.en),this._sdk?.paymentFrame({merchant_param:{amount:s.prices.RUB,item_id:s.id,description:i.description,currency:"RUB",currency_auto_convert:!0}})}))}async consumeProduct(e){return console.log(`Product with token (${e}) consumed`),Promise.resolve()}async setLeaderboardScore(e,t,a){return console.log(`Set leaderboard (${e}) score (${t}) with extraData (${a})`),Promise.resolve()}async getLeaderboardEntries(e,t,a,r){const s={leaderboard:{name:e,dеfault:!1,description:{invert_sort_order:!1,score_format:{options:{decimal_offset:0}},type:"numeric"}},ranges:[],userRank:0,entries:[]};a??=5;for(let e=a;e>0;e--){const t={score:Math.round(1e3*Math.random()+1e3*e),extraData:"",rank:a-e+1,player:{get isAuthorized(){return!0},get hasNamePermission(){return!0},get hasPhotoPermission(){return!0},get name(){return"Debug Name"},get photo(){return{small:"https://i.pravatar.cc/256",medium:"https://i.pravatar.cc/256",large:"https://i.pravatar.cc/256"}},get uuid(){return""}},formattedScore:""};s.entries.push(t)}return Promise.resolve(s)}async getFlags(e){return e.defaultFlags??{}}}}}]);