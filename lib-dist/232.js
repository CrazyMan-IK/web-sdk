"use strict";(self.webpackChunkSDK=self.webpackChunkSDK||[]).push([[232],{232:(e,r,t)=>{t.r(r),t.d(r,{default:()=>o});var a=t(983),s=t(973);class o extends s.Z{static UniquePlayerID="UniquePlayerID";_lang;_tld;_isDraft;_isAuthorized=!1;constructor(){super();const e=new URL(location.href).searchParams;this._lang=e.get("lang")??"ru",this._tld=e.get("tld")??"ru",this._isDraft="true"===e.get("draft")}get locale(){let e=a.g.Russian;switch(this.lang){case"ru":case"be":case"kk":case"uk":case"uz":e=a.g.Russian;break;case"tr":e=a.g.Turkish;break;case"de":e=a.g.Deutsch;break;default:e=a.g.English}return e}get lang(){return this._lang}get tld(){return this._tld}get id(){return"0"}get isAuthorized(){return this._isAuthorized}async initialize(){return Promise.resolve()}ready(){}async isMe(e){return e==o.UniquePlayerID}async authorizePlayer(){return Promise.resolve()}showInterstitial(e){e?.onOpen?.(),e?.onClose?.(!0),console.log("Interstitial Showed")}showRewarded(e){e?.onOpen?.(),e?.onRewarded?.(),e?.onClose?.(!0),console.log("Rewarded Showed")}async getPurchasedProducts(){return Promise.resolve([])}async getProductCatalog(){return Promise.resolve([])}async purchaseProduct(e,r){return Promise.resolve({productID:e,purchaseToken:"",developerPayload:r,signature:""})}async consumeProduct(e){return console.log(`Product with token (${e}) consumed`),Promise.resolve()}async setLeaderboardScore(e,r,t){return console.log(`Set leaderboard (${e}) score (${r}) with extraData (${t})`),Promise.resolve()}async getLeaderboardEntries(e,r,t,a){const s={leaderboard:{appID:"",dеfault:!1,description:{invert_sort_order:!1,score_format:{options:{decimal_offset:0}},type:""},name:e,title:{en:"",ru:""}},ranges:[],userRank:0,entries:[]};t??=5;const n=a?Math.floor(Math.random()*t+1):-1;for(let e=t;e>0;e--){const r={score:1e3*Math.random()+1e3*e,extraData:"",rank:t-e+1,player:{lang:"ru",publicName:"Debug Name",scopePermissions:{avatar:"allow",public_name:"allow"},uniqueID:e==n?o.UniquePlayerID:"",getAvatarSrc:e=>"https://i.pravatar.cc/256",getAvatarSrcSet:e=>"https://i.pravatar.cc/256"},formattedScore:""};s.entries.push(r)}return Promise.resolve(s)}}},973:(e,r,t)=>{t.d(r,{Z:()=>a});class a{get deviceInfo(){return{type:"desktop",isDesktop:()=>!0,isMobile:()=>!1,isTablet:()=>!1,isTV:()=>!1}}async getPlayerData(e){const r=JSON.parse(function(e){try{return localStorage.getItem("DATA")}catch{return null}}()??"{}");if(void 0===e)return r;const t={};for(const a of e)t[a]=r[a];return t}async setPlayerData(e){!function(e,r){try{localStorage.setItem("DATA",r)}catch{return}}(0,JSON.stringify(e))}}}}]);