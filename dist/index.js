/*! For license information please see index.js.LICENSE.txt */
!function(e,t){if("object"==typeof exports&&"object"==typeof module)module.exports=t();else if("function"==typeof define&&define.amd)define([],t);else{var s=t();for(var i in s)("object"==typeof exports?exports:e)[i]=s[i]}}(self,(()=>(()=>{"use strict";var e,t,s={2:(e,t)=>{Object.defineProperty(t,"__esModule",{value:!0}),t.DispatchError=void 0;class s extends Error{constructor(e){super(e)}}t.DispatchError=s},980:(e,t,s)=>{Object.defineProperty(t,"__esModule",{value:!0}),t.SubscriptionChangeEventDispatcher=t.DispatcherBase=void 0;const i=s(611),n=s(458),r=s(621);class a{constructor(){this._subscriptions=new Array}get count(){return this._subscriptions.length}get onSubscriptionChange(){return null==this._onSubscriptionChange&&(this._onSubscriptionChange=new o),this._onSubscriptionChange.asEvent()}subscribe(e){return e&&(this._subscriptions.push(this.createSubscription(e,!1)),this.triggerSubscriptionChange()),()=>{this.unsubscribe(e)}}sub(e){return this.subscribe(e)}one(e){return e&&(this._subscriptions.push(this.createSubscription(e,!0)),this.triggerSubscriptionChange()),()=>{this.unsubscribe(e)}}has(e){return!!e&&this._subscriptions.some((t=>t.handler==e))}unsubscribe(e){if(!e)return;let t=!1;for(let s=0;s<this._subscriptions.length;s++)if(this._subscriptions[s].handler==e){this._subscriptions.splice(s,1),t=!0;break}t&&this.triggerSubscriptionChange()}unsub(e){this.unsubscribe(e)}_dispatch(e,t,s){for(let i of[...this._subscriptions]){let n=new r.EventManagement((()=>this.unsub(i.handler))),a=Array.prototype.slice.call(s);if(a.push(n),i.execute(e,t,a),this.cleanup(i),!e&&n.propagationStopped)return{propagationStopped:!0}}return e?null:{propagationStopped:!1}}createSubscription(e,t){return new n.Subscription(e,t)}cleanup(e){let t=!1;if(e.isOnce&&e.isExecuted){let s=this._subscriptions.indexOf(e);s>-1&&(this._subscriptions.splice(s,1),t=!0)}t&&this.triggerSubscriptionChange()}asEvent(){return null==this._wrap&&(this._wrap=new i.DispatcherWrapper(this)),this._wrap}clear(){0!=this._subscriptions.length&&(this._subscriptions.splice(0,this._subscriptions.length),this.triggerSubscriptionChange())}triggerSubscriptionChange(){null!=this._onSubscriptionChange&&this._onSubscriptionChange.dispatch(this.count)}}t.DispatcherBase=a;class o extends a{dispatch(e){this._dispatch(!1,this,arguments)}}t.SubscriptionChangeEventDispatcher=o},611:(e,t)=>{Object.defineProperty(t,"__esModule",{value:!0}),t.DispatcherWrapper=void 0,t.DispatcherWrapper=class{constructor(e){this._subscribe=t=>e.subscribe(t),this._unsubscribe=t=>e.unsubscribe(t),this._one=t=>e.one(t),this._has=t=>e.has(t),this._clear=()=>e.clear(),this._count=()=>e.count,this._onSubscriptionChange=()=>e.onSubscriptionChange}get onSubscriptionChange(){return this._onSubscriptionChange()}get count(){return this._count()}subscribe(e){return this._subscribe(e)}sub(e){return this.subscribe(e)}unsubscribe(e){this._unsubscribe(e)}unsub(e){this.unsubscribe(e)}one(e){return this._one(e)}has(e){return this._has(e)}clear(){this._clear()}}},925:(e,t)=>{Object.defineProperty(t,"__esModule",{value:!0}),t.EventListBase=void 0,t.EventListBase=class{constructor(){this._events={}}get(e){let t=this._events[e];return t||(t=this.createDispatcher(),this._events[e]=t,t)}remove(e){delete this._events[e]}}},334:(e,t,s)=>{Object.defineProperty(t,"__esModule",{value:!0}),t.PromiseDispatcherBase=void 0;const i=s(244),n=s(621),r=s(980),a=s(2);class o extends r.DispatcherBase{_dispatch(e,t,s){throw new a.DispatchError("_dispatch not supported. Use _dispatchAsPromise.")}createSubscription(e,t){return new i.PromiseSubscription(e,t)}async _dispatchAsPromise(e,t,s){for(let i of[...this._subscriptions]){let r=new n.EventManagement((()=>this.unsub(i.handler))),a=Array.prototype.slice.call(s);a.push(r);let o=i;if(await o.execute(e,t,a),this.cleanup(i),!e&&r.propagationStopped)return{propagationStopped:!0}}return e?null:{propagationStopped:!1}}}t.PromiseDispatcherBase=o},244:(e,t)=>{Object.defineProperty(t,"__esModule",{value:!0}),t.PromiseSubscription=void 0,t.PromiseSubscription=class{constructor(e,t){this.handler=e,this.isOnce=t,this.isExecuted=!1}async execute(e,t,s){if(!this.isOnce||!this.isExecuted){this.isExecuted=!0;var i=this.handler;if(e)return void setTimeout((()=>{i.apply(t,s)}),1);let n=i.apply(t,s);await n}}}},458:(e,t)=>{Object.defineProperty(t,"__esModule",{value:!0}),t.Subscription=void 0,t.Subscription=class{constructor(e,t){this.handler=e,this.isOnce=t,this.isExecuted=!1}execute(e,t,s){if(!this.isOnce||!this.isExecuted){this.isExecuted=!0;var i=this.handler;e?setTimeout((()=>{i.apply(t,s)}),1):i.apply(t,s)}}}},277:(e,t)=>{Object.defineProperty(t,"__esModule",{value:!0}),t.HandlingBase=void 0,t.HandlingBase=class{constructor(e){this.events=e}one(e,t){this.events.get(e).one(t)}has(e,t){return this.events.get(e).has(t)}subscribe(e,t){this.events.get(e).subscribe(t)}sub(e,t){this.subscribe(e,t)}unsubscribe(e,t){this.events.get(e).unsubscribe(t)}unsub(e,t){this.unsubscribe(e,t)}}},210:(e,t,s)=>{Object.defineProperty(t,"__esModule",{value:!0}),t.SubscriptionChangeEventDispatcher=t.HandlingBase=t.PromiseDispatcherBase=t.PromiseSubscription=t.DispatchError=t.EventManagement=t.EventListBase=t.DispatcherWrapper=t.DispatcherBase=t.Subscription=void 0;const i=s(980);Object.defineProperty(t,"DispatcherBase",{enumerable:!0,get:function(){return i.DispatcherBase}}),Object.defineProperty(t,"SubscriptionChangeEventDispatcher",{enumerable:!0,get:function(){return i.SubscriptionChangeEventDispatcher}});const n=s(2);Object.defineProperty(t,"DispatchError",{enumerable:!0,get:function(){return n.DispatchError}});const r=s(611);Object.defineProperty(t,"DispatcherWrapper",{enumerable:!0,get:function(){return r.DispatcherWrapper}});const a=s(925);Object.defineProperty(t,"EventListBase",{enumerable:!0,get:function(){return a.EventListBase}});const o=s(621);Object.defineProperty(t,"EventManagement",{enumerable:!0,get:function(){return o.EventManagement}});const c=s(277);Object.defineProperty(t,"HandlingBase",{enumerable:!0,get:function(){return c.HandlingBase}});const h=s(334);Object.defineProperty(t,"PromiseDispatcherBase",{enumerable:!0,get:function(){return h.PromiseDispatcherBase}});const u=s(244);Object.defineProperty(t,"PromiseSubscription",{enumerable:!0,get:function(){return u.PromiseSubscription}});const l=s(458);Object.defineProperty(t,"Subscription",{enumerable:!0,get:function(){return l.Subscription}})},621:(e,t)=>{Object.defineProperty(t,"__esModule",{value:!0}),t.EventManagement=void 0,t.EventManagement=class{constructor(e){this.unsub=e,this.propagationStopped=!1}stopPropagation(){this.propagationStopped=!0}}},764:(e,t,s)=>{Object.defineProperty(t,"__esModule",{value:!0}),t.EventDispatcher=void 0;const i=s(210);class n extends i.DispatcherBase{constructor(){super()}dispatch(e,t){const s=this._dispatch(!1,this,arguments);if(null==s)throw new i.DispatchError("Got `null` back from dispatch.");return s}dispatchAsync(e,t){this._dispatch(!0,this,arguments)}asEvent(){return super.asEvent()}}t.EventDispatcher=n},719:(e,t,s)=>{Object.defineProperty(t,"__esModule",{value:!0}),t.EventHandlingBase=void 0;const i=s(210),n=s(11);class r extends i.HandlingBase{constructor(){super(new n.EventList)}}t.EventHandlingBase=r},11:(e,t,s)=>{Object.defineProperty(t,"__esModule",{value:!0}),t.EventList=void 0;const i=s(210),n=s(764);class r extends i.EventListBase{constructor(){super()}createDispatcher(){return new n.EventDispatcher}}t.EventList=r},672:(e,t,s)=>{Object.defineProperty(t,"__esModule",{value:!0}),t.NonUniformEventList=void 0;const i=s(764);t.NonUniformEventList=class{constructor(){this._events={}}get(e){if(this._events[e])return this._events[e];const t=this.createDispatcher();return this._events[e]=t,t}remove(e){delete this._events[e]}createDispatcher(){return new i.EventDispatcher}}},132:(e,t,s)=>{t.pB=void 0;const i=s(764);Object.defineProperty(t,"pB",{enumerable:!0,get:function(){return i.EventDispatcher}});s(719),s(11),s(672)},154:(e,t,s)=>{Object.defineProperty(t,"__esModule",{value:!0}),t.SignalDispatcher=void 0;const i=s(210);class n extends i.DispatcherBase{dispatch(){const e=this._dispatch(!1,this,arguments);if(null==e)throw new i.DispatchError("Got `null` back from dispatch.");return e}dispatchAsync(){this._dispatch(!0,this,arguments)}asEvent(){return super.asEvent()}}t.SignalDispatcher=n},702:(e,t,s)=>{Object.defineProperty(t,"__esModule",{value:!0}),t.SignalHandlingBase=void 0;const i=s(210),n=s(208);class r extends i.HandlingBase{constructor(){super(new n.SignalList)}}t.SignalHandlingBase=r},208:(e,t,s)=>{Object.defineProperty(t,"__esModule",{value:!0}),t.SignalList=void 0;const i=s(210),n=s(154);class r extends i.EventListBase{constructor(){super()}createDispatcher(){return new n.SignalDispatcher}}t.SignalList=r},106:(e,t,s)=>{t.nz=void 0;const i=s(154);Object.defineProperty(t,"nz",{enumerable:!0,get:function(){return i.SignalDispatcher}});s(702),s(208)},221:(e,t,s)=>{Object.defineProperty(t,"__esModule",{value:!0}),t.NonUniformSimpleEventList=void 0;const i=s(924);t.NonUniformSimpleEventList=class{constructor(){this._events={}}get(e){if(this._events[e])return this._events[e];const t=this.createDispatcher();return this._events[e]=t,t}remove(e){delete this._events[e]}createDispatcher(){return new i.SimpleEventDispatcher}}},924:(e,t,s)=>{Object.defineProperty(t,"__esModule",{value:!0}),t.SimpleEventDispatcher=void 0;const i=s(210);class n extends i.DispatcherBase{constructor(){super()}dispatch(e){const t=this._dispatch(!1,this,arguments);if(null==t)throw new i.DispatchError("Got `null` back from dispatch.");return t}dispatchAsync(e){this._dispatch(!0,this,arguments)}asEvent(){return super.asEvent()}}t.SimpleEventDispatcher=n},645:(e,t,s)=>{Object.defineProperty(t,"__esModule",{value:!0}),t.SimpleEventHandlingBase=void 0;const i=s(210),n=s(678);class r extends i.HandlingBase{constructor(){super(new n.SimpleEventList)}}t.SimpleEventHandlingBase=r},678:(e,t,s)=>{Object.defineProperty(t,"__esModule",{value:!0}),t.SimpleEventList=void 0;const i=s(210),n=s(924);class r extends i.EventListBase{constructor(){super()}createDispatcher(){return new n.SimpleEventDispatcher}}t.SimpleEventList=r},602:(e,t,s)=>{t.FK=void 0;const i=s(924);Object.defineProperty(t,"FK",{enumerable:!0,get:function(){return i.SimpleEventDispatcher}});s(645),s(221),s(678)},467:(e,t,s)=>{s.d(t,{g:()=>i,Z:()=>o});var i,n=s(106),r=s(132);class a{_changed=new r.pB;_key="";_fallback="";_value="";constructor(e,t){this._key=e,this._fallback=t,this._value=o.getLocalizedValue(e),o.localeChanged.subscribe(this.onLocaleChanged.bind(this))}get changed(){return this._changed.asEvent()}get value(){return this._value}toString(){return this._value}onLocaleChanged(){this._value=o.getLocalizedValue(this._key),this._value===this._key&&(this._value=this._fallback),this._changed.dispatch(this)}}!function(e){e[e.English=0]="English",e[e.Turkish=1]="Turkish",e[e.Deutsch=2]="Deutsch",e[e.Russian=3]="Russian"}(i||(i={}));class o{static _localeChanged=new n.nz;static _strings={};static _localizedStrings={};static _locale=i.English;static get localeChanged(){return this._localeChanged.asEvent()}static get locale(){return this._locale}static set locale(e){this._locale!=e&&(this._locale=e,this._localeChanged.dispatch())}static addString(e,t){this._strings[e]=t}static addStrings(e){for(const[t,s]of Object.entries(e))this._strings[t]=s}static getLocalizedString(e,t=void 0){void 0===t&&(t=e);let s=this._localizedStrings[e];return void 0!==s||(s=new a(e,t),this._localizedStrings[e]=s),s}static getLocalizedValue(e){const t=this._strings[e];return void 0!==t?t[this._locale]:e}}}},i={};function n(e){var t=i[e];if(void 0!==t)return t.exports;var r=i[e]={exports:{}};return s[e](r,r.exports,n),r.exports}n.m=s,n.d=(e,t)=>{for(var s in t)n.o(t,s)&&!n.o(e,s)&&Object.defineProperty(e,s,{enumerable:!0,get:t[s]})},n.f={},n.e=e=>Promise.all(Object.keys(n.f).reduce(((t,s)=>(n.f[s](e,t),t)),[])),n.u=e=>"yandex-sdk.js",n.g=function(){if("object"==typeof globalThis)return globalThis;try{return this||new Function("return this")()}catch(e){if("object"==typeof window)return window}}(),n.o=(e,t)=>Object.prototype.hasOwnProperty.call(e,t),e={},t="web-sdk:",n.l=(s,i,r,a)=>{if(e[s])e[s].push(i);else{var o,c;if(void 0!==r)for(var h=document.getElementsByTagName("script"),u=0;u<h.length;u++){var l=h[u];if(l.getAttribute("src")==s||l.getAttribute("data-webpack")==t+r){o=l;break}}o||(c=!0,(o=document.createElement("script")).charset="utf-8",o.timeout=120,n.nc&&o.setAttribute("nonce",n.nc),o.setAttribute("data-webpack",t+r),o.src=s),e[s]=[i];var d=(t,i)=>{o.onerror=o.onload=null,clearTimeout(p);var n=e[s];if(delete e[s],o.parentNode&&o.parentNode.removeChild(o),n&&n.forEach((e=>e(i))),t)return t(i)},p=setTimeout(d.bind(null,void 0,{type:"timeout",target:o}),12e4);o.onerror=d.bind(null,o.onerror),o.onload=d.bind(null,o.onload),c&&document.head.appendChild(o)}},n.r=e=>{"undefined"!=typeof Symbol&&Symbol.toStringTag&&Object.defineProperty(e,Symbol.toStringTag,{value:"Module"}),Object.defineProperty(e,"__esModule",{value:!0})},(()=>{var e;n.g.importScripts&&(e=n.g.location+"");var t=n.g.document;if(!e&&t&&(t.currentScript&&(e=t.currentScript.src),!e)){var s=t.getElementsByTagName("script");if(s.length)for(var i=s.length-1;i>-1&&!e;)e=s[i--].src}if(!e)throw new Error("Automatic publicPath is not supported in this browser");e=e.replace(/#.*$/,"").replace(/\?.*$/,"").replace(/\/[^\/]+$/,"/"),n.p=e})(),(()=>{var e={826:0};n.f.j=(t,s)=>{var i=n.o(e,t)?e[t]:void 0;if(0!==i)if(i)s.push(i[2]);else{var r=new Promise(((s,n)=>i=e[t]=[s,n]));s.push(i[2]=r);var a=n.p+n.u(t),o=new Error;n.l(a,(s=>{if(n.o(e,t)&&(0!==(i=e[t])&&(e[t]=void 0),i)){var r=s&&("load"===s.type?"missing":s.type),a=s&&s.target&&s.target.src;o.message="Loading chunk "+t+" failed.\n("+r+": "+a+")",o.name="ChunkLoadError",o.type=r,o.request=a,i[1](o)}}),"chunk-"+t,t)}};var t=(t,s)=>{var i,r,[a,o,c]=s,h=0;if(a.some((t=>0!==e[t]))){for(i in o)n.o(o,i)&&(n.m[i]=o[i]);c&&c(n)}for(t&&t(s);h<a.length;h++)r=a[h],n.o(e,r)&&e[r]&&e[r][0](),e[r]=0},s=self.webpackChunkweb_sdk=self.webpackChunkweb_sdk||[];s.forEach(t.bind(null,0)),s.push=t.bind(null,s.push.bind(s))})();var r={};return(()=>{n.r(r),n.d(r,{Localization:()=>t.Z,default:()=>a});var e=n(602),t=n(467);const s=Symbol();class i{static _adOpened=new e.FK;static _adClosed=new e.FK;static _initialized=new e.FK;static _rewardedAdReward=new e.FK;static _sdk;static _prefs=void 0;static _settingPromise=void 0;static _settingTimeout=void 0;static _nextData=void 0;static _isInitialized=!1;static _isGettingData=!1;static _gettings=new Map;static _settingDataCooldown=2;static async[s](e){if(this._isInitialized)return;this._sdk=e,await e.initialize(),t.Z.locale=e.locale,await this.getPlayerData(),window.addEventListener("beforeunload",(()=>{this._prefs&&(this._settingTimeout||this._settingPromise)&&(clearTimeout(this._settingTimeout),this._settingTimeout=void 0,this._settingPromise=void 0)}));let s=0;window.addEventListener("keydown",(e=>{if(e.ctrlKey&&e.shiftKey&&"ShiftRight"==e.code){if(e.timeStamp-s>250)return void(s=e.timeStamp);console.log("DATA RESETED"),this.removeKeyByPredicate((()=>!0))}})),this._isInitialized=!0,this._initialized.dispatch(),this._sdk.ready()}static get adOpened(){return this._adOpened.asEvent()}static get adClosed(){return this._adClosed.asEvent()}static get rewardedAdReward(){return this._rewardedAdReward.asEvent()}static get deviceInfo(){return this._sdk.deviceInfo}static get isInitialized(){return this._isInitialized}static async waitInitialization(){return new Promise((e=>{const t=()=>{this._isInitialized?e():setTimeout(t,50)};t()}))}static sendAnalyticsEvent(e,t){window.ym(window.yandexMetricaCounterId,"reachGoal",e,t),console.log(`Analytic event sended (${e}) with data: ${t}`)}static async showInterstitial(e){this._sdk.showInterstitial({onOpen:()=>{e.onOpen?.call(void 0),this._adOpened.dispatch()},onClose:t=>{e.onClose?.call(void 0,t),this._adClosed.dispatch()},onError:e.onError})}static async showRewarded(e,t){this._sdk.showRewarded({onOpen:()=>{t.onOpen?.call(void 0),this._adOpened.dispatch()},onRewarded:()=>{t.onRewarded?.call(void 0),this._rewardedAdReward.dispatch(e)},onClose:e=>{t.onClose?.call(void 0,e),this._adClosed.dispatch()},onError:t.onError})}static async getValues(e,t){if(!this.isInitialized)return new Promise((s=>{this._gettings.set([e,t],s)}));if(this._prefs){const s=t;for(let i=0;i<e.length;i++){const n=e[i];s[i]=this._prefs[n]??t[i]}return s}return this.getPlayerData().then((s=>{const i=t;for(let n=0;n<e.length;n++){const r=e[n];i[n]=s[r]??t[n]}return i})).catch((()=>new Promise((s=>{this._gettings.set([e,t],s)}))))}static async setValues(e){if(this.isInitialized)if(this._prefs){for(const t in e)this._prefs[t]=e[t];this.setPlayerData(this._prefs)}else this.getPlayerData().then((t=>{for(const s in e)t[s]=e[s];this.setPlayerData(t)}))}static async removeKeys(e){if(this.isInitialized)if(this._prefs){for(let t=0;t<e.length;t++)delete this._prefs[e[t]];this.setPlayerData(this._prefs)}else this.getPlayerData().then((t=>{for(let s=0;s<e.length;s++)delete t.remove[e[s]];this.setPlayerData(t)}))}static async removeKeyByPredicate(e){if(!this.isInitialized)return;if(!this._prefs)return void this.getPlayerData().then((t=>{const s=Object.keys(t).filter(e);this.removeKeys(s)}));const t=Object.keys(this._prefs).filter(e);this.removeKeys(t)}static async getPlayerData(){return this._isGettingData?Promise.reject():(this._isGettingData=!0,new Promise((e=>{this._sdk.getPlayerData().then((t=>{this._prefs=t,this.onDataGetted(),this._isGettingData=!1,e(t)}))})))}static onDataGetted(){const e=this._gettings;this._gettings=new Map,e.forEach(((e,t)=>{const s=[];for(let e=0;e<t[0].length;e++){const i=t[0][e];s[e]=this._prefs?.[i]??t[1][e]}e(s)})),this._gettings.size>0&&this.onDataGetted()}static setPlayerData(e){this._settingPromise?this._nextData=e:(this._settingTimeout&&clearTimeout(this._settingTimeout),this._settingTimeout=setTimeout((()=>{this._settingTimeout=void 0,this._settingPromise=this.setPlayerDataRuntime(e)}),50))}static async setPlayerDataRuntime(e){this._sdk.setPlayerData(e),await new Promise((e=>setTimeout(e,1e3*this._settingDataCooldown))),this._settingPromise&&(this._settingPromise=void 0,this._nextData&&(e=this._nextData,this._nextData=void 0,this.setPlayerData(e)))}}"YaGames"in window&&window.YaGames.init().then((async e=>{const t=(await n.e(504).then(n.bind(n,112))).default;return i[s](new t(e))}));const a=i})(),r})()));