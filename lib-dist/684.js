"use strict";(self.webpackChunkSDK=self.webpackChunkSDK||[]).push([[684],{684:(e,t,r)=>{r.r(t),r.d(t,{default:()=>o});var a=r(602),s=r(13),i=r(983),n=r(973);class o extends n.Z{_adErrorReceived=new a.FK;_adStartedReceived=new a.FK;_adCompletedReceived=new a.FK;_sdkReadyReceived=new a.FK;_gamePauseReceived=new a.FK;_gameStartReceived=new a.FK;_rewardedRewardReceived=new a.FK;_overridedProductsCatalog=[];_isDraft;_appID;_lang;_options;_player=null;_sdk=null;_isAuthorized=!1;constructor(e){super((0,s.m)({GameDistributionSDKWrapper:o})),this._isDraft=location.href.startsWith("https://revision.gamedistribution.com/"),this._appID=e,this._lang=navigator.language,this._options={gameId:this._appID,onEvent:e=>{switch(this.log("received native sdk event: ",e),e.name){case"AD_ERROR":this._adErrorReceived.dispatch(new Error(e.message));break;case"STARTED":this._adStartedReceived.dispatch();break;case"COMPLETE":case"SKIPPED":this._adCompletedReceived.dispatch(!0);break;case"SDK_READY":this._sdkReadyReceived.dispatch();break;case"SDK_GAME_PAUSE":this._gamePauseReceived.dispatch();break;case"SDK_GAME_START":this._gameStartReceived.dispatch();break;case"SDK_REWARDED_WATCH_COMPLETE":this._rewardedRewardReceived.dispatch()}}},window.GD_OPTIONS=this._options}get contentPauseRequested(){return this._gamePauseReceived.asEvent()}get contentContinueRequested(){return this._gameStartReceived.asEvent()}get adOpened(){return this._adStartedReceived.asEvent()}get adClosed(){return this._adCompletedReceived.asEvent()}get rewardedRewardReceived(){return this._rewardedRewardReceived.asEvent()}get canShowAdOnLoading(){return!1}get locale(){let e=i.g.Russian;switch(this.lang){case"ru":case"be":case"kk":case"uk":case"uz":e=i.g.Russian;break;case"tr":e=i.g.Turkish;break;case"de":e=i.g.Deutsch;break;default:e=i.g.English}return e}get lang(){return this._lang.substring(0,2)}get tld(){return this._lang}get id(){return this._appID}get isAuthorized(){return this._isAuthorized}get isDraft(){return this._isDraft}async initialize(){const e=document.createElement("script");return e.id="gamedistribution-jssdk",e.src="https://html5.api.gamedistribution.com/main.min.js",document.head.appendChild(e),new Promise((e=>{this._sdkReadyReceived.one((()=>{this._sdk=window.gdsdk,e()}))}))}ready(){this.log("Ready")}gameplayStart(){this.log("Gameplay Start")}gameplayStop(){this.log("Gameplay Stop")}happyTime(){this.log("Happy Time")}async isMe(e){return null==this._player?Promise.reject():e==this._player.uuid}async authorizePlayer(){return Promise.reject()}async getPlayer(){return null!==this._player?this._player:(this._player={get isAuthorized(){return!1},get hasNamePermission(){return!1},get hasPhotoPermission(){return!1},get name(){return""},get photo(){return{small:"",medium:"",large:""}},get uuid(){return""}},Promise.resolve(this._player))}sendAnalyticsEvent(e,t){this.log(`Analytic event sended (${e}) with data: ${JSON.stringify(t)}`),("track-milestone"==e&&null!=t&&"isAuthorized"in t&&"milestoneDescription"in t||"game_event"==e&&null!=t&&"level"in t&&"score"in t)&&this._sdk?.sendEvent({eventName:e,data:t})}showInterstitial(){this._sdk?.showAd(this._sdk?.AdType.Interstitial)}showRewarded(){this._sdk?.showAd(this._sdk?.AdType.Rewarded)}async canReview(){return Promise.resolve({value:!1,reason:"UNKNOWN"})}async requestReview(){return Promise.reject()}async getPurchasedProducts(){const e=[];return e.signature="",Promise.resolve(e)}overrideProductsCatalog(e){this._overridedProductsCatalog.length=0,this._overridedProductsCatalog.push(...e)}async getProductCatalog(){return Promise.resolve(this._overridedProductsCatalog)}async purchaseProduct(e,t){return Promise.reject()}async consumeProduct(e){return this.log(`Product with token (${e}) consumed`),Promise.resolve()}async setLeaderboardScore(e,t,r){return this.log(`Set leaderboard (${e}) score (${t}) with extraData (${r})`),Promise.resolve()}async getLeaderboardEntries(e,t,r,a){const s={leaderboard:{name:e,dеfault:!1,description:{invert_sort_order:!1,score_format:{options:{decimal_offset:0}},type:"numeric"}},ranges:[],userRank:0,entries:[]};r??=5;for(let e=r;e>0;e--){const t={score:Math.round(1e3*Math.random()+1e3*e),extraData:"",rank:r-e+1,player:{get isAuthorized(){return!0},get hasNamePermission(){return!0},get hasPhotoPermission(){return!0},get name(){return"Debug Name"},get photo(){return{small:"https://i.pravatar.cc/256",medium:"https://i.pravatar.cc/256",large:"https://i.pravatar.cc/256"}},get uuid(){return""}},formattedScore:""};s.entries.push(t)}return Promise.resolve(s)}async getFlags(e){return e.defaultFlags??{}}}},13:(e,t,r)=>{function a(e){const t=Object.keys(e);return 1===t.length?t[0]:void 0}r.d(t,{m:()=>a})},973:(e,t,r)=>{r.d(t,{Z:()=>a});class a{_logName="";constructor(e){this._logName=e}get deviceInfo(){return{type:"desktop",isDesktop:()=>!0,isMobile:()=>!1,isTablet:()=>!1,isTV:()=>!1}}async getPlayerData(e){const t=JSON.parse(function(e){try{return localStorage.getItem("DATA")}catch{return null}}()??"{}");if(void 0===e)return t;const r={};for(const a of e)r[a]=t[a];return r}async setPlayerData(e){!function(e,t){try{localStorage.setItem("DATA",t)}catch{return}}(0,JSON.stringify(e))}log(...e){console.log(`%c[${this._logName}]:`,"background: wheat; color: #1E324B; font-family: tahoma, verdana, helvetica, arial; font-size: 14px; font-weight: 900; text-align: center; padding: 6px 2px; border-radius: 6px; border: 2px solid #434975",...e)}}}}]);