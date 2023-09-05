(function webpackUniversalModuleDefinition(root, factory) {
	if(typeof exports === 'object' && typeof module === 'object')
		module.exports = factory();
	else if(typeof define === 'function' && define.amd)
		define([], factory);
	else {
		var a = factory();
		for(var i in a) (typeof exports === 'object' ? exports : root)[i] = a[i];
	}
})(global, () => {
return /******/ (() => { // webpackBootstrap
/******/ 	"use strict";
/******/ 	var __webpack_modules__ = ({

/***/ 2:
/***/ ((__unused_webpack_module, exports) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.DispatchError = void 0;
/**
 * Indicates an error with dispatching.
 *
 * @export
 * @class DispatchError
 * @extends {Error}
 */
class DispatchError extends Error {
    /**
     * Creates an instance of DispatchError.
     * @param {string} message The message.
     *
     * @memberOf DispatchError
     */
    constructor(message) {
        super(message);
    }
}
exports.DispatchError = DispatchError;


/***/ }),

/***/ 980:
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.SubscriptionChangeEventDispatcher = exports.DispatcherBase = void 0;
const DispatcherWrapper_1 = __webpack_require__(611);
const Subscription_1 = __webpack_require__(458);
const EventManagement_1 = __webpack_require__(621);
/**
 * Base class for implementation of the dispatcher. It facilitates the subscribe
 * and unsubscribe methods based on generic handlers. The TEventType specifies
 * the type of event that should be exposed. Use the asEvent to expose the
 * dispatcher as event.
 *
 * @export
 * @abstract
 * @class DispatcherBase
 * @implements {ISubscribable<TEventHandler>}
 * @template TEventHandler The type of event handler.
 */
class DispatcherBase {
    constructor() {
        /**
         * The subscriptions.
         *
         * @protected
         *
         * @memberOf DispatcherBase
         */
        this._subscriptions = new Array();
    }
    /**
     * Returns the number of subscriptions.
     *
     * @readonly
     * @type {number}
     * @memberOf DispatcherBase
     */
    get count() {
        return this._subscriptions.length;
    }
    /**
     * Triggered when subscriptions are changed (added or removed).
     *
     * @readonly
     * @type {ISubscribable<SubscriptionChangeEventHandler>}
     * @memberOf DispatcherBase
     */
    get onSubscriptionChange() {
        if (this._onSubscriptionChange == null) {
            this._onSubscriptionChange = new SubscriptionChangeEventDispatcher();
        }
        return this._onSubscriptionChange.asEvent();
    }
    /**
     * Subscribe to the event dispatcher.
     *
     * @param {TEventHandler} fn The event handler that is called when the event is dispatched.
     * @returns A function that unsubscribes the event handler from the event.
     *
     * @memberOf DispatcherBase
     */
    subscribe(fn) {
        if (fn) {
            this._subscriptions.push(this.createSubscription(fn, false));
            this.triggerSubscriptionChange();
        }
        return () => {
            this.unsubscribe(fn);
        };
    }
    /**
     * Subscribe to the event dispatcher.
     *
     * @param {TEventHandler} fn The event handler that is called when the event is dispatched.
     * @returns A function that unsubscribes the event handler from the event.
     *
     * @memberOf DispatcherBase
     */
    sub(fn) {
        return this.subscribe(fn);
    }
    /**
     * Subscribe once to the event with the specified name.
     *
     * @param {TEventHandler} fn The event handler that is called when the event is dispatched.
     * @returns A function that unsubscribes the event handler from the event.
     *
     * @memberOf DispatcherBase
     */
    one(fn) {
        if (fn) {
            this._subscriptions.push(this.createSubscription(fn, true));
            this.triggerSubscriptionChange();
        }
        return () => {
            this.unsubscribe(fn);
        };
    }
    /**
     * Checks it the event has a subscription for the specified handler.
     *
     * @param {TEventHandler} fn The event handler.
     *
     * @memberOf DispatcherBase
     */
    has(fn) {
        if (!fn)
            return false;
        return this._subscriptions.some((sub) => sub.handler == fn);
    }
    /**
     * Unsubscribes the handler from the dispatcher.
     *
     * @param {TEventHandler} fn The event handler.
     *
     * @memberOf DispatcherBase
     */
    unsubscribe(fn) {
        if (!fn)
            return;
        let changes = false;
        for (let i = 0; i < this._subscriptions.length; i++) {
            if (this._subscriptions[i].handler == fn) {
                this._subscriptions.splice(i, 1);
                changes = true;
                break;
            }
        }
        if (changes) {
            this.triggerSubscriptionChange();
        }
    }
    /**
     * Unsubscribes the handler from the dispatcher.
     *
     * @param {TEventHandler} fn The event handler.
     *
     * @memberOf DispatcherBase
     */
    unsub(fn) {
        this.unsubscribe(fn);
    }
    /**
     * Generic dispatch will dispatch the handlers with the given arguments.
     *
     * @protected
     * @param {boolean} executeAsync `True` if the even should be executed async.
     * @param {*} scope The scope of the event. The scope becomes the `this` for handler.
     * @param {IArguments} args The arguments for the event.
     * @returns {(IPropagationStatus | null)} The propagation status, or if an `executeAsync` is used `null`.
     *
     * @memberOf DispatcherBase
     */
    _dispatch(executeAsync, scope, args) {
        //execute on a copy because of bug #9
        for (let sub of [...this._subscriptions]) {
            let ev = new EventManagement_1.EventManagement(() => this.unsub(sub.handler));
            let nargs = Array.prototype.slice.call(args);
            nargs.push(ev);
            let s = sub;
            s.execute(executeAsync, scope, nargs);
            //cleanup subs that are no longer needed
            this.cleanup(sub);
            if (!executeAsync && ev.propagationStopped) {
                return { propagationStopped: true };
            }
        }
        if (executeAsync) {
            return null;
        }
        return { propagationStopped: false };
    }
    /**
     * Creates a subscription.
     *
     * @protected
     * @param {TEventHandler} handler The handler.
     * @param {boolean} isOnce True if the handler should run only one.
     * @returns {ISubscription<TEventHandler>} The subscription.
     *
     * @memberOf DispatcherBase
     */
    createSubscription(handler, isOnce) {
        return new Subscription_1.Subscription(handler, isOnce);
    }
    /**
     * Cleans up subs that ran and should run only once.
     *
     * @protected
     * @param {ISubscription<TEventHandler>} sub The subscription.
     *
     * @memberOf DispatcherBase
     */
    cleanup(sub) {
        let changes = false;
        if (sub.isOnce && sub.isExecuted) {
            let i = this._subscriptions.indexOf(sub);
            if (i > -1) {
                this._subscriptions.splice(i, 1);
                changes = true;
            }
        }
        if (changes) {
            this.triggerSubscriptionChange();
        }
    }
    /**
     * Creates an event from the dispatcher. Will return the dispatcher
     * in a wrapper. This will prevent exposure of any dispatcher methods.
     *
     * @returns {ISubscribable<TEventHandler>}
     *
     * @memberOf DispatcherBase
     */
    asEvent() {
        if (this._wrap == null) {
            this._wrap = new DispatcherWrapper_1.DispatcherWrapper(this);
        }
        return this._wrap;
    }
    /**
     * Clears the subscriptions.
     *
     * @memberOf DispatcherBase
     */
    clear() {
        if (this._subscriptions.length != 0) {
            this._subscriptions.splice(0, this._subscriptions.length);
            this.triggerSubscriptionChange();
        }
    }
    /**
     * Triggers the subscription change event.
     *
     * @private
     *
     * @memberOf DispatcherBase
     */
    triggerSubscriptionChange() {
        if (this._onSubscriptionChange != null) {
            this._onSubscriptionChange.dispatch(this.count);
        }
    }
}
exports.DispatcherBase = DispatcherBase;
/**
 * Dispatcher for subscription changes.
 *
 * @export
 * @class SubscriptionChangeEventDispatcher
 * @extends {DispatcherBase<SubscriptionChangeEventHandler>}
 */
class SubscriptionChangeEventDispatcher extends DispatcherBase {
    /**
     * Dispatches the event.
     *
     * @param {number} count The currrent number of subscriptions.
     *
     * @memberOf SubscriptionChangeEventDispatcher
     */
    dispatch(count) {
        this._dispatch(false, this, arguments);
    }
}
exports.SubscriptionChangeEventDispatcher = SubscriptionChangeEventDispatcher;


/***/ }),

/***/ 611:
/***/ ((__unused_webpack_module, exports) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.DispatcherWrapper = void 0;
/**
 * Hides the implementation of the event dispatcher. Will expose methods that
 * are relevent to the event.
 *
 * @export
 * @class DispatcherWrapper
 * @implements {ISubscribable<TEventHandler>}
 * @template TEventHandler The type of event handler.
 */
class DispatcherWrapper {
    /**
     * Creates an instance of DispatcherWrapper.
     * @param {ISubscribable<TEventHandler>} dispatcher
     *
     * @memberOf DispatcherWrapper
     */
    constructor(dispatcher) {
        this._subscribe = (fn) => dispatcher.subscribe(fn);
        this._unsubscribe = (fn) => dispatcher.unsubscribe(fn);
        this._one = (fn) => dispatcher.one(fn);
        this._has = (fn) => dispatcher.has(fn);
        this._clear = () => dispatcher.clear();
        this._count = () => dispatcher.count;
        this._onSubscriptionChange = () => dispatcher.onSubscriptionChange;
    }
    /**
     * Triggered when subscriptions are changed (added or removed).
     *
     * @readonly
     * @type {ISubscribable<SubscriptionChangeEventHandler>}
     * @memberOf DispatcherWrapper
     */
    get onSubscriptionChange() {
        return this._onSubscriptionChange();
    }
    /**
     * Returns the number of subscriptions.
     *
     * @readonly
     * @type {number}
     * @memberOf DispatcherWrapper
     */
    get count() {
        return this._count();
    }
    /**
     * Subscribe to the event dispatcher.
     *
     * @param {TEventHandler} fn The event handler that is called when the event is dispatched.
     * @returns {() => void} A function that unsubscribes the event handler from the event.
     *
     * @memberOf DispatcherWrapper
     */
    subscribe(fn) {
        return this._subscribe(fn);
    }
    /**
     * Subscribe to the event dispatcher.
     *
     * @param {TEventHandler} fn The event handler that is called when the event is dispatched.
     * @returns {() => void} A function that unsubscribes the event handler from the event.
     *
     * @memberOf DispatcherWrapper
     */
    sub(fn) {
        return this.subscribe(fn);
    }
    /**
     * Unsubscribe from the event dispatcher.
     *
     * @param {TEventHandler} fn The event handler that is called when the event is dispatched.
     *
     * @memberOf DispatcherWrapper
     */
    unsubscribe(fn) {
        this._unsubscribe(fn);
    }
    /**
     * Unsubscribe from the event dispatcher.
     *
     * @param {TEventHandler} fn The event handler that is called when the event is dispatched.
     *
     * @memberOf DispatcherWrapper
     */
    unsub(fn) {
        this.unsubscribe(fn);
    }
    /**
     * Subscribe once to the event with the specified name.
     *
     * @returns {() => void} A function that unsubscribes the event handler from the event.
     *
     * @memberOf DispatcherWrapper
     */
    one(fn) {
        return this._one(fn);
    }
    /**
     * Checks it the event has a subscription for the specified handler.
     *
     * @param {TEventHandler} fn The event handler that is called when the event is dispatched.
     *
     * @memberOf DispatcherWrapper
     */
    has(fn) {
        return this._has(fn);
    }
    /**
     * Clears all the subscriptions.
     *
     * @memberOf DispatcherWrapper
     */
    clear() {
        this._clear();
    }
}
exports.DispatcherWrapper = DispatcherWrapper;


/***/ }),

/***/ 925:
/***/ ((__unused_webpack_module, exports) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.EventListBase = void 0;
/**
 * Base class for event lists classes. Implements the get and remove.
 *
 * @export
 * @abstract
 * @class EventListBaset
 * @template TEventDispatcher The type of event dispatcher.
 */
class EventListBase {
    constructor() {
        this._events = {};
    }
    /**
     * Gets the dispatcher associated with the name.
     *
     * @param {string} name The name of the event.
     * @returns {TEventDispatcher} The disptacher.
     *
     * @memberOf EventListBase
     */
    get(name) {
        let event = this._events[name];
        if (event) {
            return event;
        }
        event = this.createDispatcher();
        this._events[name] = event;
        return event;
    }
    /**
     * Removes the dispatcher associated with the name.
     *
     * @param {string} name
     *
     * @memberOf EventListBase
     */
    remove(name) {
        delete this._events[name];
    }
}
exports.EventListBase = EventListBase;


/***/ }),

/***/ 334:
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.PromiseDispatcherBase = void 0;
const PromiseSubscription_1 = __webpack_require__(244);
const EventManagement_1 = __webpack_require__(621);
const DispatcherBase_1 = __webpack_require__(980);
const DispatchError_1 = __webpack_require__(2);
/**
 * Dispatcher base for dispatchers that use promises. Each promise
 * is awaited before the next is dispatched, unless the event is
 * dispatched with the executeAsync flag.
 *
 * @export
 * @abstract
 * @class PromiseDispatcherBase
 * @extends {DispatcherBase<TEventHandler>}
 * @template TEventHandler The type of event handler.
 */
class PromiseDispatcherBase extends DispatcherBase_1.DispatcherBase {
    /**
     * The normal dispatch cannot be used in this class.
     *
     * @protected
     * @param {boolean} executeAsync `True` if the even should be executed async.
     * @param {*} scope The scope of the event. The scope becomes the `this` for handler.
     * @param {IArguments} args The arguments for the event.
     * @returns {(IPropagationStatus | null)} The propagation status, or if an `executeAsync` is used `null`.
     *
     * @memberOf DispatcherBase
     */
    _dispatch(executeAsync, scope, args) {
        throw new DispatchError_1.DispatchError("_dispatch not supported. Use _dispatchAsPromise.");
    }
    /**
     * Crates a new subscription.
     *
     * @protected
     * @param {TEventHandler} handler The handler.
     * @param {boolean} isOnce Indicates if the handler should only run once.
     * @returns {ISubscription<TEventHandler>} The subscription.
     *
     * @memberOf PromiseDispatcherBase
     */
    createSubscription(handler, isOnce) {
        return new PromiseSubscription_1.PromiseSubscription(handler, isOnce);
    }
    /**
     * Generic dispatch will dispatch the handlers with the given arguments.
     *
     * @protected
     * @param {boolean} executeAsync `True` if the even should be executed async.
     * @param {*} scope The scope of the event. The scope becomes the `this` for handler.
     * @param {IArguments} args The arguments for the event.
     * @returns {(IPropagationStatus | null)} The propagation status, or if an `executeAsync` is used `null`.
     *
     * @memberOf DispatcherBase
     */
    async _dispatchAsPromise(executeAsync, scope, args) {
        //execute on a copy because of bug #9
        for (let sub of [...this._subscriptions]) {
            let ev = new EventManagement_1.EventManagement(() => this.unsub(sub.handler));
            let nargs = Array.prototype.slice.call(args);
            nargs.push(ev);
            let ps = sub;
            await ps.execute(executeAsync, scope, nargs);
            //cleanup subs that are no longer needed
            this.cleanup(sub);
            if (!executeAsync && ev.propagationStopped) {
                return { propagationStopped: true };
            }
        }
        if (executeAsync) {
            return null;
        }
        return { propagationStopped: false };
    }
}
exports.PromiseDispatcherBase = PromiseDispatcherBase;


/***/ }),

/***/ 244:
/***/ ((__unused_webpack_module, exports) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.PromiseSubscription = void 0;
/**
 * Subscription implementation for events with promises.
 *
 * @export
 * @class PromiseSubscription
 * @implements {ISubscription<TEventHandler>}
 * @template TEventHandler The type of event handler.
 */
class PromiseSubscription {
    /**
     * Creates an instance of PromiseSubscription.
     * @param {TEventHandler} handler The handler for the subscription.
     * @param {boolean} isOnce Indicates if the handler should only be executed once.
     *
     * @memberOf PromiseSubscription
     */
    constructor(handler, isOnce) {
        this.handler = handler;
        this.isOnce = isOnce;
        /**
         * Indicates if the subscription has been executed before.
         *
         * @memberOf PromiseSubscription
         */
        this.isExecuted = false;
    }
    /**
     * Executes the handler.
     *
     * @param {boolean} executeAsync True if the even should be executed async.
     * @param {*} scope The scope the scope of the event.
     * @param {IArguments} args The arguments for the event.
     *
     * @memberOf PromiseSubscription
     */
    async execute(executeAsync, scope, args) {
        if (!this.isOnce || !this.isExecuted) {
            this.isExecuted = true;
            //TODO: do we need to cast to any -- seems yuck
            var fn = this.handler;
            if (executeAsync) {
                setTimeout(() => {
                    fn.apply(scope, args);
                }, 1);
                return;
            }
            let result = fn.apply(scope, args);
            await result;
        }
    }
}
exports.PromiseSubscription = PromiseSubscription;


/***/ }),

/***/ 458:
/***/ ((__unused_webpack_module, exports) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.Subscription = void 0;
/**
 * Stores a handler. Manages execution meta data.
 * @class Subscription
 * @template TEventHandler
 */
class Subscription {
    /**
     * Creates an instance of Subscription.
     *
     * @param {TEventHandler} handler The handler for the subscription.
     * @param {boolean} isOnce Indicates if the handler should only be executed once.
     */
    constructor(handler, isOnce) {
        this.handler = handler;
        this.isOnce = isOnce;
        /**
         * Indicates if the subscription has been executed before.
         */
        this.isExecuted = false;
    }
    /**
     * Executes the handler.
     *
     * @param {boolean} executeAsync True if the even should be executed async.
     * @param {*} scope The scope the scope of the event.
     * @param {IArguments} args The arguments for the event.
     */
    execute(executeAsync, scope, args) {
        if (!this.isOnce || !this.isExecuted) {
            this.isExecuted = true;
            var fn = this.handler;
            if (executeAsync) {
                setTimeout(() => {
                    fn.apply(scope, args);
                }, 1);
            }
            else {
                fn.apply(scope, args);
            }
        }
    }
}
exports.Subscription = Subscription;


/***/ }),

/***/ 277:
/***/ ((__unused_webpack_module, exports) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.HandlingBase = void 0;
/**
 * Base class that implements event handling. With a an
 * event list this base class will expose events that can be
 * subscribed to. This will give your class generic events.
 *
 * @export
 * @abstract
 * @class HandlingBase
 * @template TEventHandler The type of event handler.
 * @template TDispatcher The type of dispatcher.
 * @template TList The type of event list.
 */
class HandlingBase {
    /**
     * Creates an instance of HandlingBase.
     * @param {TList} events The event list. Used for event management.
     *
     * @memberOf HandlingBase
     */
    constructor(events) {
        this.events = events;
    }
    /**
     * Subscribes once to the event with the specified name.
     * @param {string} name The name of the event.
     * @param {TEventHandler} fn The event handler.
     *
     * @memberOf HandlingBase
     */
    one(name, fn) {
        this.events.get(name).one(fn);
    }
    /**
     * Checks it the event has a subscription for the specified handler.
     * @param {string} name The name of the event.
     * @param {TEventHandler} fn The event handler.
     *
     * @memberOf HandlingBase
     */
    has(name, fn) {
        return this.events.get(name).has(fn);
    }
    /**
     * Subscribes to the event with the specified name.
     * @param {string} name The name of the event.
     * @param {TEventHandler} fn The event handler.
     *
     * @memberOf HandlingBase
     */
    subscribe(name, fn) {
        this.events.get(name).subscribe(fn);
    }
    /**
     * Subscribes to the event with the specified name.
     * @param {string} name The name of the event.
     * @param {TEventHandler} fn The event handler.
     *
     * @memberOf HandlingBase
     */
    sub(name, fn) {
        this.subscribe(name, fn);
    }
    /**
     * Unsubscribes from the event with the specified name.
     * @param {string} name The name of the event.
     * @param {TEventHandler} fn The event handler.
     *
     * @memberOf HandlingBase
     */
    unsubscribe(name, fn) {
        this.events.get(name).unsubscribe(fn);
    }
    /**
     * Unsubscribes from the event with the specified name.
     * @param {string} name The name of the event.
     * @param {TEventHandler} fn The event handler.
     *
     * @memberOf HandlingBase
     */
    unsub(name, fn) {
        this.unsubscribe(name, fn);
    }
}
exports.HandlingBase = HandlingBase;


/***/ }),

/***/ 210:
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {


/*!
 * Strongly Typed Events for TypeScript - Core
 * https://github.com/KeesCBakker/StronlyTypedEvents/
 * http://keestalkstech.com
 *
 * Copyright Kees C. Bakker / KeesTalksTech
 * Released under the MIT license
 */
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.SubscriptionChangeEventDispatcher = exports.HandlingBase = exports.PromiseDispatcherBase = exports.PromiseSubscription = exports.DispatchError = exports.EventManagement = exports.EventListBase = exports.DispatcherWrapper = exports.DispatcherBase = exports.Subscription = void 0;
const DispatcherBase_1 = __webpack_require__(980);
Object.defineProperty(exports, "DispatcherBase", ({ enumerable: true, get: function () { return DispatcherBase_1.DispatcherBase; } }));
Object.defineProperty(exports, "SubscriptionChangeEventDispatcher", ({ enumerable: true, get: function () { return DispatcherBase_1.SubscriptionChangeEventDispatcher; } }));
const DispatchError_1 = __webpack_require__(2);
Object.defineProperty(exports, "DispatchError", ({ enumerable: true, get: function () { return DispatchError_1.DispatchError; } }));
const DispatcherWrapper_1 = __webpack_require__(611);
Object.defineProperty(exports, "DispatcherWrapper", ({ enumerable: true, get: function () { return DispatcherWrapper_1.DispatcherWrapper; } }));
const EventListBase_1 = __webpack_require__(925);
Object.defineProperty(exports, "EventListBase", ({ enumerable: true, get: function () { return EventListBase_1.EventListBase; } }));
const EventManagement_1 = __webpack_require__(621);
Object.defineProperty(exports, "EventManagement", ({ enumerable: true, get: function () { return EventManagement_1.EventManagement; } }));
const HandlingBase_1 = __webpack_require__(277);
Object.defineProperty(exports, "HandlingBase", ({ enumerable: true, get: function () { return HandlingBase_1.HandlingBase; } }));
const PromiseDispatcherBase_1 = __webpack_require__(334);
Object.defineProperty(exports, "PromiseDispatcherBase", ({ enumerable: true, get: function () { return PromiseDispatcherBase_1.PromiseDispatcherBase; } }));
const PromiseSubscription_1 = __webpack_require__(244);
Object.defineProperty(exports, "PromiseSubscription", ({ enumerable: true, get: function () { return PromiseSubscription_1.PromiseSubscription; } }));
const Subscription_1 = __webpack_require__(458);
Object.defineProperty(exports, "Subscription", ({ enumerable: true, get: function () { return Subscription_1.Subscription; } }));


/***/ }),

/***/ 621:
/***/ ((__unused_webpack_module, exports) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.EventManagement = void 0;
/**
 * Allows the user to interact with the event.
 *
 * @export
 * @class EventManagement
 * @implements {IEventManagement}
 */
class EventManagement {
    /**
     * Creates an instance of EventManagement.
     * @param {() => void} unsub An unsubscribe handler.
     *
     * @memberOf EventManagement
     */
    constructor(unsub) {
        this.unsub = unsub;
        this.propagationStopped = false;
    }
    /**
     * Stops the propagation of the event.
     * Cannot be used when async dispatch is done.
     *
     * @memberOf EventManagement
     */
    stopPropagation() {
        this.propagationStopped = true;
    }
}
exports.EventManagement = EventManagement;


/***/ }),

/***/ 764:
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.EventDispatcher = void 0;
const ste_core_1 = __webpack_require__(210);
/**
 * Dispatcher implementation for events. Can be used to subscribe, unsubscribe
 * or dispatch events. Use the ToEvent() method to expose the event.
 *
 * @export
 * @class EventDispatcher
 * @extends {DispatcherBase<IEventHandler<TSender, TArgs>>}
 * @implements {IEvent<TSender, TArgs>}
 * @template TSender The sender type.
 * @template TArgs The event arguments type.
 */
class EventDispatcher extends ste_core_1.DispatcherBase {
    /**
     * Creates an instance of EventDispatcher.
     *
     * @memberOf EventDispatcher
     */
    constructor() {
        super();
    }
    /**
     * Dispatches the event.
     *
     * @param {TSender} sender The sender.
     * @param {TArgs} args The arguments.
     * @returns {IPropagationStatus} The propagation status to interact with the event
     *
     * @memberOf EventDispatcher
     */
    dispatch(sender, args) {
        const result = this._dispatch(false, this, arguments);
        if (result == null) {
            throw new ste_core_1.DispatchError("Got `null` back from dispatch.");
        }
        return result;
    }
    /**
     * Dispatches the event in an async way. Does not support event interaction.
     *
     * @param {TSender} sender The sender.
     * @param {TArgs} args The arguments.
     *
     * @memberOf EventDispatcher
     */
    dispatchAsync(sender, args) {
        this._dispatch(true, this, arguments);
    }
    /**
     * Creates an event from the dispatcher. Will return the dispatcher
     * in a wrapper. This will prevent exposure of any dispatcher methods.
     *
     * @returns {IEvent<TSender, TArgs>} The event.
     *
     * @memberOf EventDispatcher
     */
    asEvent() {
        return super.asEvent();
    }
}
exports.EventDispatcher = EventDispatcher;


/***/ }),

/***/ 719:
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.EventHandlingBase = void 0;
const ste_core_1 = __webpack_require__(210);
const EventList_1 = __webpack_require__(11);
/**
 * Extends objects with signal event handling capabilities.
 */
class EventHandlingBase extends ste_core_1.HandlingBase {
    constructor() {
        super(new EventList_1.EventList());
    }
}
exports.EventHandlingBase = EventHandlingBase;


/***/ }),

/***/ 11:
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.EventList = void 0;
const ste_core_1 = __webpack_require__(210);
const EventDispatcher_1 = __webpack_require__(764);
/**
 * Storage class for multiple events that are accessible by name.
 * Events dispatchers are automatically created.
 */
class EventList extends ste_core_1.EventListBase {
    /**
     * Creates a new EventList instance.
     */
    constructor() {
        super();
    }
    /**
     * Creates a new dispatcher instance.
     */
    createDispatcher() {
        return new EventDispatcher_1.EventDispatcher();
    }
}
exports.EventList = EventList;


/***/ }),

/***/ 672:
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.NonUniformEventList = void 0;
const EventDispatcher_1 = __webpack_require__(764);
/**
 * Similar to EventList, but instead of TArgs, a map of event names ang argument types is provided with TArgsMap.
 */
class NonUniformEventList {
    constructor() {
        this._events = {};
    }
    /**
     * Gets the dispatcher associated with the name.
     * @param name The name of the event.
     */
    get(name) {
        if (this._events[name]) {
            // @TODO avoid typecasting. Not sure why TS thinks this._events[name] could still be undefined.
            return this._events[name];
        }
        const event = this.createDispatcher();
        this._events[name] = event;
        return event;
    }
    /**
     * Removes the dispatcher associated with the name.
     * @param name The name of the event.
     */
    remove(name) {
        delete this._events[name];
    }
    /**
     * Creates a new dispatcher instance.
     */
    createDispatcher() {
        return new EventDispatcher_1.EventDispatcher();
    }
}
exports.NonUniformEventList = NonUniformEventList;


/***/ }),

/***/ 132:
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {

var __webpack_unused_export__;

/*!
 * Strongly Typed Events for TypeScript - Core
 * https://github.com/KeesCBakker/StronlyTypedEvents/
 * http://keestalkstech.com
 *
 * Copyright Kees C. Bakker / KeesTalksTech
 * Released under the MIT license
 */
__webpack_unused_export__ = ({ value: true });
__webpack_unused_export__ = __webpack_unused_export__ = __webpack_unused_export__ = exports.pB = void 0;
const EventDispatcher_1 = __webpack_require__(764);
Object.defineProperty(exports, "pB", ({ enumerable: true, get: function () { return EventDispatcher_1.EventDispatcher; } }));
const EventHandlingBase_1 = __webpack_require__(719);
__webpack_unused_export__ = ({ enumerable: true, get: function () { return EventHandlingBase_1.EventHandlingBase; } });
const EventList_1 = __webpack_require__(11);
__webpack_unused_export__ = ({ enumerable: true, get: function () { return EventList_1.EventList; } });
const NonUniformEventList_1 = __webpack_require__(672);
__webpack_unused_export__ = ({ enumerable: true, get: function () { return NonUniformEventList_1.NonUniformEventList; } });


/***/ }),

/***/ 154:
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.SignalDispatcher = void 0;
const ste_core_1 = __webpack_require__(210);
/**
 * The dispatcher handles the storage of subsciptions and facilitates
 * subscription, unsubscription and dispatching of a signal event.
 *
 * @export
 * @class SignalDispatcher
 * @extends {DispatcherBase<ISignalHandler>}
 * @implements {ISignal}
 */
class SignalDispatcher extends ste_core_1.DispatcherBase {
    /**
     * Dispatches the signal.
     *
     * @returns {IPropagationStatus} The status of the signal.
     *
     * @memberOf SignalDispatcher
     */
    dispatch() {
        const result = this._dispatch(false, this, arguments);
        if (result == null) {
            throw new ste_core_1.DispatchError("Got `null` back from dispatch.");
        }
        return result;
    }
    /**
     * Dispatches the signal without waiting for the result.
     *
     * @memberOf SignalDispatcher
     */
    dispatchAsync() {
        this._dispatch(true, this, arguments);
    }
    /**
     * Creates an event from the dispatcher. Will return the dispatcher
     * in a wrapper. This will prevent exposure of any dispatcher methods.
     *
     * @returns {ISignal} The signal.
     *
     * @memberOf SignalDispatcher
     */
    asEvent() {
        return super.asEvent();
    }
}
exports.SignalDispatcher = SignalDispatcher;


/***/ }),

/***/ 702:
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.SignalHandlingBase = void 0;
const ste_core_1 = __webpack_require__(210);
const SignalList_1 = __webpack_require__(208);
/**
 * Extends objects with signal event handling capabilities.
 *
 * @export
 * @abstract
 * @class SignalHandlingBase
 * @extends {HandlingBase<ISignalHandler, SignalDispatcher, SignalList>}
 * @implements {ISignalHandling}
 */
class SignalHandlingBase extends ste_core_1.HandlingBase {
    /**
     * Creates an instance of SignalHandlingBase.
     *
     * @memberOf SignalHandlingBase
     */
    constructor() {
        super(new SignalList_1.SignalList());
    }
}
exports.SignalHandlingBase = SignalHandlingBase;


/***/ }),

/***/ 208:
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.SignalList = void 0;
const ste_core_1 = __webpack_require__(210);
const SignalDispatcher_1 = __webpack_require__(154);
/**
 * Storage class for multiple signal events that are accessible by name.
 * Events dispatchers are automatically created.
 *
 * @export
 * @class SignalList
 * @extends {EventListBase<SignalDispatcher>}
 */
class SignalList extends ste_core_1.EventListBase {
    /**
     * Creates an instance of SignalList.
     *
     * @memberOf SignalList
     */
    constructor() {
        super();
    }
    /**
     * Creates a new dispatcher instance.
     *
     * @protected
     * @returns {SignalDispatcher}
     *
     * @memberOf SignalList
     */
    createDispatcher() {
        return new SignalDispatcher_1.SignalDispatcher();
    }
}
exports.SignalList = SignalList;


/***/ }),

/***/ 106:
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {

var __webpack_unused_export__;

/*!
 * Strongly Typed Events for TypeScript - Promise Signals
 * https://github.com/KeesCBakker/StronlyTypedEvents/
 * http://keestalkstech.com
 *
 * Copyright Kees C. Bakker / KeesTalksTech
 * Released under the MIT license
 */
__webpack_unused_export__ = ({ value: true });
__webpack_unused_export__ = __webpack_unused_export__ = exports.nz = void 0;
const SignalDispatcher_1 = __webpack_require__(154);
Object.defineProperty(exports, "nz", ({ enumerable: true, get: function () { return SignalDispatcher_1.SignalDispatcher; } }));
const SignalHandlingBase_1 = __webpack_require__(702);
__webpack_unused_export__ = ({ enumerable: true, get: function () { return SignalHandlingBase_1.SignalHandlingBase; } });
const SignalList_1 = __webpack_require__(208);
__webpack_unused_export__ = ({ enumerable: true, get: function () { return SignalList_1.SignalList; } });


/***/ }),

/***/ 221:
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.NonUniformSimpleEventList = void 0;
const SimpleEventDispatcher_1 = __webpack_require__(924);
/**
 * Similar to EventList, but instead of TArgs, a map of event names ang argument types is provided with TArgsMap.
 */
class NonUniformSimpleEventList {
    constructor() {
        this._events = {};
    }
    /**
     * Gets the dispatcher associated with the name.
     * @param name The name of the event.
     */
    get(name) {
        if (this._events[name]) {
            // @TODO avoid typecasting. Not sure why TS thinks this._events[name] could still be undefined.
            return this._events[name];
        }
        const event = this.createDispatcher();
        this._events[name] = event;
        return event;
    }
    /**
     * Removes the dispatcher associated with the name.
     * @param name The name of the event.
     */
    remove(name) {
        delete this._events[name];
    }
    /**
     * Creates a new dispatcher instance.
     */
    createDispatcher() {
        return new SimpleEventDispatcher_1.SimpleEventDispatcher();
    }
}
exports.NonUniformSimpleEventList = NonUniformSimpleEventList;


/***/ }),

/***/ 924:
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.SimpleEventDispatcher = void 0;
const ste_core_1 = __webpack_require__(210);
/**
 * The dispatcher handles the storage of subsciptions and facilitates
 * subscription, unsubscription and dispatching of a simple event
 *
 * @export
 * @class SimpleEventDispatcher
 * @extends {DispatcherBase<ISimpleEventHandler<TArgs>>}
 * @implements {ISimpleEvent<TArgs>}
 * @template TArgs
 */
class SimpleEventDispatcher extends ste_core_1.DispatcherBase {
    /**
     * Creates an instance of SimpleEventDispatcher.
     *
     * @memberOf SimpleEventDispatcher
     */
    constructor() {
        super();
    }
    /**
     * Dispatches the event.
     *
     * @param {TArgs} args The arguments object.
     * @returns {IPropagationStatus} The status of the event.
     *
     * @memberOf SimpleEventDispatcher
     */
    dispatch(args) {
        const result = this._dispatch(false, this, arguments);
        if (result == null) {
            throw new ste_core_1.DispatchError("Got `null` back from dispatch.");
        }
        return result;
    }
    /**
     * Dispatches the event without waiting for the result.
     *
     * @param {TArgs} args The arguments object.
     *
     * @memberOf SimpleEventDispatcher
     */
    dispatchAsync(args) {
        this._dispatch(true, this, arguments);
    }
    /**
     * Creates an event from the dispatcher. Will return the dispatcher
     * in a wrapper. This will prevent exposure of any dispatcher methods.
     *
     * @returns {ISimpleEvent<TArgs>} The event.
     *
     * @memberOf SimpleEventDispatcher
     */
    asEvent() {
        return super.asEvent();
    }
}
exports.SimpleEventDispatcher = SimpleEventDispatcher;


/***/ }),

/***/ 645:
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.SimpleEventHandlingBase = void 0;
const ste_core_1 = __webpack_require__(210);
const SimpleEventList_1 = __webpack_require__(678);
/**
 * Extends objects with signal event handling capabilities.
 */
class SimpleEventHandlingBase extends ste_core_1.HandlingBase {
    constructor() {
        super(new SimpleEventList_1.SimpleEventList());
    }
}
exports.SimpleEventHandlingBase = SimpleEventHandlingBase;


/***/ }),

/***/ 678:
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.SimpleEventList = void 0;
const ste_core_1 = __webpack_require__(210);
const SimpleEventDispatcher_1 = __webpack_require__(924);
/**
 * Storage class for multiple simple events that are accessible by name.
 * Events dispatchers are automatically created.
 */
class SimpleEventList extends ste_core_1.EventListBase {
    /**
     * Creates a new SimpleEventList instance.
     */
    constructor() {
        super();
    }
    /**
     * Creates a new dispatcher instance.
     */
    createDispatcher() {
        return new SimpleEventDispatcher_1.SimpleEventDispatcher();
    }
}
exports.SimpleEventList = SimpleEventList;


/***/ }),

/***/ 602:
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {

var __webpack_unused_export__;

__webpack_unused_export__ = ({ value: true });
__webpack_unused_export__ = __webpack_unused_export__ = __webpack_unused_export__ = exports.FK = void 0;
const SimpleEventDispatcher_1 = __webpack_require__(924);
Object.defineProperty(exports, "FK", ({ enumerable: true, get: function () { return SimpleEventDispatcher_1.SimpleEventDispatcher; } }));
const SimpleEventHandlingBase_1 = __webpack_require__(645);
__webpack_unused_export__ = ({ enumerable: true, get: function () { return SimpleEventHandlingBase_1.SimpleEventHandlingBase; } });
const NonUniformSimpleEventList_1 = __webpack_require__(221);
__webpack_unused_export__ = ({ enumerable: true, get: function () { return NonUniformSimpleEventList_1.NonUniformSimpleEventList; } });
const SimpleEventList_1 = __webpack_require__(678);
__webpack_unused_export__ = ({ enumerable: true, get: function () { return SimpleEventList_1.SimpleEventList; } });


/***/ }),

/***/ 644:
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   Z: () => (/* binding */ Localization),
/* harmony export */   g: () => (/* binding */ Locale)
/* harmony export */ });
/* harmony import */ var ste_signals__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(106);
/* harmony import */ var _localized_string__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(427);


var Locale;
(function (Locale) {
    Locale[Locale["English"] = 0] = "English";
    Locale[Locale["Turkish"] = 1] = "Turkish";
    Locale[Locale["Deutsch"] = 2] = "Deutsch";
    Locale[Locale["Russian"] = 3] = "Russian";
})(Locale || (Locale = {}));
class Localization {
    //public static event Action LocaleChanged = null;
    static _localeChanged = new ste_signals__WEBPACK_IMPORTED_MODULE_0__/* .SignalDispatcher */ .nz();
    //private static readonly _strings: { [key: string]: { [key in Locale]: string } } = {
    static _strings = {};
    static _localizedStrings = {};
    static _locale = Locale.English;
    static get localeChanged() {
        return this._localeChanged.asEvent();
    }
    static get locale() {
        return this._locale;
    }
    static set locale(value) {
        if (this._locale == value) {
            return;
        }
        this._locale = value;
        this._localeChanged.dispatch();
    }
    static addString(key, values) {
        this._strings[key] = values;
    }
    static addStrings(values) {
        for (const [key, value] of Object.entries(values)) {
            this._strings[key] = value;
        }
    }
    static getLocalizedString(key, fallback = undefined) {
        if (fallback === undefined) {
            fallback = key;
        }
        let value = this._localizedStrings[key];
        if (value !== undefined) {
            return value;
        }
        value = new _localized_string__WEBPACK_IMPORTED_MODULE_1__/* ["default"] */ .Z(key, fallback);
        this._localizedStrings[key] = value;
        return value;
    }
    static getLocalizedValue(key) {
        const value = this._strings[key];
        if (value !== undefined) {
            return value[this._locale];
        }
        return key;
    }
}


/***/ }),

/***/ 427:
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   Z: () => (/* binding */ LocalizedString)
/* harmony export */ });
/* harmony import */ var ste_events__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(132);
/* harmony import */ var _index__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(644);


class LocalizedString {
    _changed = new ste_events__WEBPACK_IMPORTED_MODULE_0__/* .EventDispatcher */ .pB();
    _key = '';
    _fallback = '';
    _value = '';
    constructor(key, fallback) {
        this._key = key;
        this._fallback = fallback;
        this._value = _index__WEBPACK_IMPORTED_MODULE_1__/* ["default"] */ .Z.getLocalizedValue(key);
        _index__WEBPACK_IMPORTED_MODULE_1__/* ["default"] */ .Z.localeChanged.subscribe(this.onLocaleChanged.bind(this));
    }
    get changed() {
        return this._changed.asEvent();
    }
    get value() {
        return this._value;
    }
    toString() {
        return this._value;
    }
    onLocaleChanged() {
        this._value = _index__WEBPACK_IMPORTED_MODULE_1__/* ["default"] */ .Z.getLocalizedValue(this._key);
        if (this._value === this._key) {
            this._value = this._fallback;
        }
        this._changed.dispatch(this);
    }
}


/***/ })

/******/ 	});
/************************************************************************/
/******/ 	// The module cache
/******/ 	var __webpack_module_cache__ = {};
/******/ 	
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/ 		// Check if module is in cache
/******/ 		var cachedModule = __webpack_module_cache__[moduleId];
/******/ 		if (cachedModule !== undefined) {
/******/ 			return cachedModule.exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = __webpack_module_cache__[moduleId] = {
/******/ 			// no module.id needed
/******/ 			// no module.loaded needed
/******/ 			exports: {}
/******/ 		};
/******/ 	
/******/ 		// Execute the module function
/******/ 		__webpack_modules__[moduleId](module, module.exports, __webpack_require__);
/******/ 	
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/ 	
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = __webpack_modules__;
/******/ 	
/************************************************************************/
/******/ 	/* webpack/runtime/define property getters */
/******/ 	(() => {
/******/ 		// define getter functions for harmony exports
/******/ 		__webpack_require__.d = (exports, definition) => {
/******/ 			for(var key in definition) {
/******/ 				if(__webpack_require__.o(definition, key) && !__webpack_require__.o(exports, key)) {
/******/ 					Object.defineProperty(exports, key, { enumerable: true, get: definition[key] });
/******/ 				}
/******/ 			}
/******/ 		};
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/ensure chunk */
/******/ 	(() => {
/******/ 		__webpack_require__.f = {};
/******/ 		// This file contains only the entry chunk.
/******/ 		// The chunk loading function for additional chunks
/******/ 		__webpack_require__.e = (chunkId) => {
/******/ 			return Promise.all(Object.keys(__webpack_require__.f).reduce((promises, key) => {
/******/ 				__webpack_require__.f[key](chunkId, promises);
/******/ 				return promises;
/******/ 			}, []));
/******/ 		};
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/get javascript chunk filename */
/******/ 	(() => {
/******/ 		// This function allow to reference async chunks
/******/ 		__webpack_require__.u = (chunkId) => {
/******/ 			// return url for filenames based on template
/******/ 			return "" + "yandex-sdk" + ".js";
/******/ 		};
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/hasOwnProperty shorthand */
/******/ 	(() => {
/******/ 		__webpack_require__.o = (obj, prop) => (Object.prototype.hasOwnProperty.call(obj, prop))
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/make namespace object */
/******/ 	(() => {
/******/ 		// define __esModule on exports
/******/ 		__webpack_require__.r = (exports) => {
/******/ 			if(typeof Symbol !== 'undefined' && Symbol.toStringTag) {
/******/ 				Object.defineProperty(exports, Symbol.toStringTag, { value: 'Module' });
/******/ 			}
/******/ 			Object.defineProperty(exports, '__esModule', { value: true });
/******/ 		};
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/require chunk loading */
/******/ 	(() => {
/******/ 		// no baseURI
/******/ 		
/******/ 		// object to store loaded chunks
/******/ 		// "1" means "loaded", otherwise not loaded yet
/******/ 		var installedChunks = {
/******/ 			826: 1
/******/ 		};
/******/ 		
/******/ 		// no on chunks loaded
/******/ 		
/******/ 		var installChunk = (chunk) => {
/******/ 			var moreModules = chunk.modules, chunkIds = chunk.ids, runtime = chunk.runtime;
/******/ 			for(var moduleId in moreModules) {
/******/ 				if(__webpack_require__.o(moreModules, moduleId)) {
/******/ 					__webpack_require__.m[moduleId] = moreModules[moduleId];
/******/ 				}
/******/ 			}
/******/ 			if(runtime) runtime(__webpack_require__);
/******/ 			for(var i = 0; i < chunkIds.length; i++)
/******/ 				installedChunks[chunkIds[i]] = 1;
/******/ 		
/******/ 		};
/******/ 		
/******/ 		// require() chunk loading for javascript
/******/ 		__webpack_require__.f.require = (chunkId, promises) => {
/******/ 			// "1" is the signal for "already loaded"
/******/ 			if(!installedChunks[chunkId]) {
/******/ 				if(true) { // all chunks have JS
/******/ 					installChunk(require("./" + __webpack_require__.u(chunkId)));
/******/ 				} else installedChunks[chunkId] = 1;
/******/ 			}
/******/ 		};
/******/ 		
/******/ 		// no external install chunk
/******/ 		
/******/ 		// no HMR
/******/ 		
/******/ 		// no HMR manifest
/******/ 	})();
/******/ 	
/************************************************************************/
var __webpack_exports__ = {};
// This entry need to be wrapped in an IIFE because it need to be isolated against other modules in the chunk.
(() => {
// ESM COMPAT FLAG
__webpack_require__.r(__webpack_exports__);

// EXPORTS
__webpack_require__.d(__webpack_exports__, {
  Locale: () => (/* reexport */ localization/* Locale */.g),
  Localization: () => (/* reexport */ localization/* default */.Z),
  LocalizedString: () => (/* reexport */ localized_string/* default */.Z),
  "default": () => (/* binding */ src)
});

// EXTERNAL MODULE: ./node_modules/ste-simple-events/dist/index.js
var dist = __webpack_require__(602);
// EXTERNAL MODULE: ./src/localization/index.ts
var localization = __webpack_require__(644);
;// CONCATENATED MODULE: ./src/sdk.ts


const STATIC_INIT = Symbol();
class SDK {
    static _adOpened = new dist/* SimpleEventDispatcher */.FK();
    static _adClosed = new dist/* SimpleEventDispatcher */.FK();
    static _initialized = new dist/* SimpleEventDispatcher */.FK();
    static _rewardedAdReward = new dist/* SimpleEventDispatcher */.FK();
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
        localization/* default */.Z.locale = sdk.locale;
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
        /* webpack-strip-block:removed */
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
        /* webpack-strip-block:removed */
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
        const YandexGamesSDKWrapper = (await __webpack_require__.e(/* import() | yandex-sdk */ 504).then(__webpack_require__.bind(__webpack_require__, 112))).default;
        return SDK[STATIC_INIT](new YandexGamesSDKWrapper(sdk));
    });
}

// EXTERNAL MODULE: ./src/localization/localized-string.ts
var localized_string = __webpack_require__(427);
;// CONCATENATED MODULE: ./src/index.ts



/* harmony default export */ const src = (SDK);


})();

/******/ 	return __webpack_exports__;
/******/ })()
;
});