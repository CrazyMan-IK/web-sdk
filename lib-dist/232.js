"use strict";(self.webpackChunkSDK=self.webpackChunkSDK||[]).push([[232],{232:(e,t,r)=>{r.r(t),r.d(t,{default:()=>o});var a=r(983),s=r(973);class o extends s.Z{static UniquePlayerID="UniquePlayerID";_lang;_tld;_isDraft;_isAuthorized=!1;constructor(){super();const e=new URL(location.href).searchParams;this._lang=e.get("lang")??"ru",this._tld=e.get("tld")??"ru",this._isDraft="true"===e.get("draft")}get locale(){let e=a.g.Russian;switch(this.lang){case"ru":case"be":case"kk":case"uk":case"uz":e=a.g.Russian;break;case"tr":e=a.g.Turkish;break;case"de":e=a.g.Deutsch;break;default:e=a.g.English}return e}get lang(){return this._lang}get tld(){return this._tld}get id(){return"0"}get isAuthorized(){return this._isAuthorized}async initialize(){return await this.getPlayer(),Promise.resolve()}ready(){console.log("Ready")}gameplayStart(){console.log("Gameplay Start")}gameplayStop(){console.log("Gameplay Stop")}happyTime(){console.log("Happy Time")}async isMe(e){return e==o.UniquePlayerID}async authorizePlayer(){return this._isAuthorized=!0,Promise.resolve()}async getPlayer(){const e=this._isAuthorized,t={get isAuthorized(){return e},get hasNamePermission(){return this.isAuthorized},get hasPhotoPermission(){return this.isAuthorized},get name(){return"ABOBUS"},get photo(){return{small:"https://i.pravatar.cc/256",medium:"https://i.pravatar.cc/256",large:"https://i.pravatar.cc/256"}},get uuid(){return o.UniquePlayerID}};return Promise.resolve(t)}sendAnalyticsEvent(e,t){console.log(`Analytic event sended (${e}) with data: ${t}`)}showInterstitial(e){e?.onOpen?.(),e?.onClose?.(!0),console.log("Interstitial Showed")}showRewarded(e){e?.onOpen?.(),e?.onRewarded?.(),e?.onClose?.(!0),console.log("Rewarded Showed")}async canReview(){const e=0!=Math.round(Math.random()),t=e?{value:e}:{value:e,reason:"UNKNOWN"};return Promise.resolve(t)}async requestReview(){return console.log("Review requested"),Promise.resolve({feedbackSent:0!=Math.round(Math.random())})}async getPurchasedProducts(){return Promise.resolve([])}async getProductCatalog(){return Promise.resolve([])}async purchaseProduct(e,t){return Promise.resolve({productID:e,purchaseToken:"",developerPayload:t,signature:""})}async consumeProduct(e){return console.log(`Product with token (${e}) consumed`),Promise.resolve()}async setLeaderboardScore(e,t,r){return console.log(`Set leaderboard (${e}) score (${t}) with extraData (${r})`),Promise.resolve()}async getLeaderboardEntries(e,t,r,a){const s={leaderboard:{name:e,dеfault:!1,description:{invert_sort_order:!1,score_format:{options:{decimal_offset:0}},type:"numeric"}},ranges:[],userRank:0,entries:[]};r??=5;const n=a?Math.floor(Math.random()*r+1):-1;for(let e=r;e>0;e--){const t={score:1e3*Math.random()+1e3*e,extraData:"",rank:r-e+1,player:{get isAuthorized(){return!0},get hasNamePermission(){return!0},get hasPhotoPermission(){return!0},get name(){return"Debug Name"},get photo(){return{small:"https://i.pravatar.cc/256",medium:"https://i.pravatar.cc/256",large:"https://i.pravatar.cc/256"}},get uuid(){return e==n?o.UniquePlayerID:""}},formattedScore:""};s.entries.push(t)}return Promise.resolve(s)}}},973:(e,t,r)=>{r.d(t,{Z:()=>a});class a{get deviceInfo(){return{type:"desktop",isDesktop:()=>!0,isMobile:()=>!1,isTablet:()=>!1,isTV:()=>!1}}async getPlayerData(e){const t=JSON.parse(function(e){try{return localStorage.getItem("DATA")}catch{return null}}()??"{}");if(void 0===e)return t;const r={};for(const a of e)r[a]=t[a];return r}async setPlayerData(e){!function(e,t){try{localStorage.setItem("DATA",t)}catch{return}}(0,JSON.stringify(e))}}}}]);