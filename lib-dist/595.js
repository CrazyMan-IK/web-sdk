"use strict";(self.webpackChunkSDK=self.webpackChunkSDK||[]).push([[595],{973:(e,t,a)=>{a.d(t,{Z:()=>r});class r{get deviceInfo(){return{type:"desktop",isDesktop:()=>!0,isMobile:()=>!1,isTablet:()=>!1,isTV:()=>!1}}async getPlayerData(e){const t=JSON.parse(function(e){try{return localStorage.getItem("DATA")}catch{return null}}()??"{}");if(void 0===e)return t;const a={};for(const r of e)a[r]=t[r];return a}async setPlayerData(e){!function(e,t){try{localStorage.setItem("DATA",t)}catch{return}}(0,JSON.stringify(e))}}},595:(e,t,a)=>{a.r(t),a.d(t,{default:()=>n});var r=a(983),s=a(973);class n extends s.Z{_sdk;_isDraft=!1;_player=null;_yplayer=null;_payments=null;_leaderboards=null;_isAuthorized=!1;constructor(e){super(),this._sdk=e,this._isDraft=location.hash.search("draft=true")>=0}get locale(){let e=r.g.Russian;switch(this.lang){case"ru":case"be":case"kk":case"uk":case"uz":e=r.g.Russian;break;case"tr":e=r.g.Turkish;break;case"de":e=r.g.Deutsch;break;default:e=r.g.English}return e}get lang(){return this._sdk.environment.i18n.lang}get tld(){return this._sdk.environment.i18n.tld}get id(){return this._sdk.environment.app.id}get deviceInfo(){return this._sdk.deviceInfo}get environment(){return this._sdk.environment}get isAuthorized(){return this._isAuthorized}get isDraft(){return this._isDraft}async initialize(){!function(e,t,a,r,s,n,i){e[s]=e[s]||function(...t){(e[s].a=e[s].a||[]).push(...t)},e[s].l=(new Date).getTime();for(let e=0;e<document.scripts.length;e++)if(document.scripts[e].src===r)return;n=t.createElement(a),i=t.getElementsByTagName(a)[0],n.async=1,n.src=r,i.parentNode.insertBefore(n,i)}(window,document,"script","https://mc.yandex.ru/metrika/tag.js","ym"),window.ym(window.yandexMetricaCounterId,"init",{clickmap:!0,trackLinks:!0,accurateTrackBounce:!0}),window.ym(window.yandexMetricaCounterId,"reachGoal","pageOpen"),window.addEventListener("DOMContentLoaded",(()=>{const e=performance.getEntriesByType("navigation")[0],t=e.domContentLoadedEventStart-e.startTime;window.ym(window.yandexMetricaCounterId,"reachGoal","pageLoad",{pageLoadTime:t/1e3})})),await this.getPlayer()}ready(){this._sdk.features.LoadingAPI?.ready()}gameplayStart(){console.log("Gameplay Start")}gameplayStop(){console.log("Gameplay Stop")}happyTime(){console.log("Happy Time")}async isMe(e){return this.getPlayer().then((t=>t.uuid==e)).catch((()=>!1))}async authorizePlayer(){return this._sdk.auth.openAuthDialog()}async getPlayer(){return null!==this._player?this._player:this.getPlayerInternal().then((e=>(this._player={get isAuthorized(){return"lite"!==e.getMode()},get hasNamePermission(){return"allow"==e._personalInfo.scopePermissions.public_name},get hasPhotoPermission(){return"allow"==e._personalInfo.scopePermissions.avatar},get name(){return e.getName()},get photo(){return{small:e.getPhoto("small"),medium:e.getPhoto("medium"),large:e.getPhoto("large")}},get uuid(){return e.getUniqueID()}},this._player)))}sendAnalyticsEvent(e,t){window.ym(window.yandexMetricaCounterId,"reachGoal",e,t)}showInterstitial(e){this._sdk.adv.showFullscreenAdv({callbacks:e})}showRewarded(e){this._sdk.adv.showRewardedVideo({callbacks:e})}async canReview(){return this._sdk.feedback.canReview()}async requestReview(){return this._sdk.feedback.requestReview()}async getPlayerInternal(){return null!==this._yplayer?this._yplayer:this._sdk.getPlayer({scopes:!1}).then((e=>(this._isAuthorized="lite"!==e.getMode(),this._yplayer=e,e)))}async getPayments(){return null!==this._payments?this._payments:this._sdk.getPayments().then((e=>(this._payments=e,e)))}async getLeaderboards(){return this._isAuthorized?null!==this._leaderboards?this._leaderboards:this._sdk.getLeaderboards().then((e=>(this._leaderboards=e,e))):Promise.reject()}async getPurchasedProducts(){return this.getPayments().then((e=>e.getPurchases()))}async getProductCatalog(){return this.getPayments().then((async e=>(await e.getCatalog()).map((e=>({id:e.id,imageURI:e.imageURI,meta:{[this.locale]:{name:e.title,description:e.description}},prices:{YAN:parseFloat(e.priceValue)}})))))}async purchaseProduct(e,t){return this.getPayments().then((a=>a.purchase({id:e,developerPayload:t})))}async consumeProduct(e){return this.getPayments().then((t=>t.consumePurchase(e)))}async setLeaderboardScore(e,t,a){return this.getLeaderboards().then((r=>r.setLeaderboardScore(e,t,a)))}async getLeaderboardEntries(e,t,a,r){return this.getLeaderboards().then((async s=>{const n=await s.getLeaderboardEntries(e,{includeUser:r,quantityAround:a,quantityTop:t});return{...n,entries:n.entries.map((e=>({...e,player:{...e.player,avatar:e.player.getAvatarSrc("large")}})))}}))}async getPlayerData(e=void 0){return this.getPlayerInternal().then((t=>t.getData(e))).catch((()=>super.getPlayerData(e)))}async setPlayerData(e){return this.getPlayerInternal().then((t=>t.setData(e))).finally((()=>super.setPlayerData(e)))}}}}]);