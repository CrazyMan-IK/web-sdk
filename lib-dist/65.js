"use strict";(self.webpackChunkSDK=self.webpackChunkSDK||[]).push([[65],{65:(e,t,r)=>{r.r(t),r.d(t,{default:()=>d});var a=r(602),s=r(13),i=r(983),n=r(973);class d extends n.Z{_adErrorReceived=new a.FK;_adStartedReceived=new a.FK;_adCompletedReceived=new a.FK;_gamePauseReceived=new a.FK;_gameStartReceived=new a.FK;_rewardedRewardReceived=new a.FK;_overridedProductsCatalog=[];_isDraft;_player=null;_sdk=null;_initObject=null;_isAuthorized=!1;_appID="0";_lang="EN";constructor(){super((0,s.m)({CrazyGamesSDKWrapper:d})),this._isDraft=location.href.startsWith("https://prod-dpgames.crazygames.com/")}get contentPauseRequested(){return this._gamePauseReceived.asEvent()}get contentContinueRequested(){return this._gameStartReceived.asEvent()}get adOpened(){return this._adStartedReceived.asEvent()}get adClosed(){return this._adCompletedReceived.asEvent()}get rewardedRewardReceived(){return this._rewardedRewardReceived.asEvent()}get canShowAdOnLoading(){return!1}get locale(){let e=i.g.Russian;switch(this.lang){case"RU":case"BY":case"KZ":case"UA":case"UZ":e=i.g.Russian;break;case"TR":e=i.g.Turkish;break;case"DE":e=i.g.Deutsch;break;default:e=i.g.English}return e}get lang(){return this._lang.substring(0,2)}get tld(){return this._lang}get id(){return this._appID}get isAuthorized(){return this._isAuthorized}get isDraft(){return this._isDraft}async initialize(){const e=document.createElement("script");return e.src="https://sdk.crazygames.com/crazygames-sdk-v2.js",document.head.appendChild(e),new Promise((t=>{e.addEventListener("load",(()=>{this._sdk=window.CrazyGames.SDK,this._sdk.addInitCallback((e=>{this._initObject=e,this._appID=e.gameId??"0",this._lang=e.systemInfo.countryCode??"EN",this._sdk?.game.sdkGameLoadingStart(),t()}))}))}))}ready(){this._sdk?.game.sdkGameLoadingStop()}gameplayStart(){this._sdk?.game.gameplayStart()}gameplayStop(){this._sdk?.game.gameplayStop()}happyTime(){this._sdk?.game.happytime()}async isMe(e){return null==this._player?Promise.reject():e==this._player.uuid}async authorizePlayer(){return this._sdk?.user.showAuthPrompt(),Promise.reject()}async getPlayer(){if(null!==this._player)return this._player;if(!await(this._sdk?.user.getUser()))return this._player={get isAuthorized(){return!1},get hasNamePermission(){return!1},get hasPhotoPermission(){return!1},get name(){return""},get photo(){return{small:"",medium:"",large:""}},get uuid(){return""}},this._player;const e=await(this._sdk?.user.getUserToken()),t=this.parseJwt(e);return this._player={get isAuthorized(){return!0},get hasNamePermission(){return!0},get hasPhotoPermission(){return!0},get name(){return t.username},get photo(){return{small:t.profilePictureUrl,medium:t.profilePictureUrl,large:t.profilePictureUrl}},get uuid(){return t.userId}},this._player}sendAnalyticsEvent(e,t){this.log(`Analytic event sended (${e}) with data: ${JSON.stringify(t)}`)}showInterstitial(){let e=!0;this._sdk?.ad.requestAd("midgame",{adStarted:()=>{this._gamePauseReceived.dispatch(),this._adStartedReceived.dispatch()},adError:(t,r)=>{e=!1,this._adErrorReceived.dispatch(new Error(t))},adFinished:()=>{this._adCompletedReceived.dispatch(e),this._gameStartReceived.dispatch()}})}showRewarded(){let e=!0;this._sdk?.ad.requestAd("rewarded",{adStarted:()=>{this._gamePauseReceived.dispatch(),this._adStartedReceived.dispatch()},adError:(t,r)=>{e=!1,this._adErrorReceived.dispatch(new Error(t))},adFinished:()=>{this._rewardedRewardReceived.dispatch(),this._adCompletedReceived.dispatch(e),this._gameStartReceived.dispatch()}})}async canReview(){return Promise.resolve({value:!1,reason:"UNKNOWN"})}async requestReview(){return Promise.reject()}async getPurchasedProducts(){const e=[];return e.signature="",Promise.resolve(e)}overrideProductsCatalog(e){this._overridedProductsCatalog.length=0,this._overridedProductsCatalog.push(...e)}async getProductCatalog(){return Promise.resolve(this._overridedProductsCatalog)}async purchaseProduct(e,t){return Promise.reject()}async consumeProduct(e){return this.log(`Product with token (${e}) consumed`),Promise.resolve()}async setLeaderboardScore(e,t,r){return this.log(`Set leaderboard (${e}) score (${t}) with extraData (${r})`),Promise.resolve()}async getLeaderboardEntries(e,t,r,a){const s={leaderboard:{name:e,dеfault:!1,description:{invert_sort_order:!1,score_format:{options:{decimal_offset:0}},type:"numeric"}},ranges:[],userRank:0,entries:[]};r??=5;for(let e=r;e>0;e--){const t={score:Math.round(1e3*Math.random()+1e3*e),extraData:"",rank:r-e+1,player:{get isAuthorized(){return!0},get hasNamePermission(){return!0},get hasPhotoPermission(){return!0},get name(){return"Debug Name"},get photo(){return{small:"https://i.pravatar.cc/256",medium:"https://i.pravatar.cc/256",large:"https://i.pravatar.cc/256"}},get uuid(){return""}},formattedScore:""};s.entries.push(t)}return Promise.resolve(s)}async getFlags(e){return e.defaultFlags??{}}parseJwt(e){if(!e)return{};const t=e.split(".")[1].replace(/-/g,"+").replace(/_/g,"/"),r=decodeURIComponent(window.atob(t).split("").map((function(e){return"%"+("00"+e.charCodeAt(0).toString(16)).slice(-2)})).join(""));return JSON.parse(r)}}},13:(e,t,r)=>{function a(e){const t=Object.keys(e);return 1===t.length?t[0]:void 0}r.d(t,{m:()=>a})},973:(e,t,r)=>{r.d(t,{Z:()=>a});class a{_logName="";constructor(e){this._logName=e}get deviceInfo(){return{type:"desktop",isDesktop:()=>!0,isMobile:()=>!1,isTablet:()=>!1,isTV:()=>!1}}async getPlayerData(e){const t=JSON.parse(function(e){try{return localStorage.getItem("DATA")}catch{return null}}()??"{}");if(void 0===e)return t;const r={};for(const a of e)r[a]=t[a];return r}async setPlayerData(e){!function(e,t){try{localStorage.setItem("DATA",t)}catch{return}}(0,JSON.stringify(e))}log(...e){console.log(`%c[${this._logName}]:`,"background: wheat; color: #1E324B; font-family: tahoma, verdana, helvetica, arial; font-size: 14px; font-weight: 900; text-align: center; padding: 6px 2px; border-radius: 6px; border: 2px solid #434975",...e)}}}}]);