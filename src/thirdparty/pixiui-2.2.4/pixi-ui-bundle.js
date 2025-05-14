var PIXIUI = (function (exports, pixi_js) {
	'use strict';

	function unwrapExports (x) {
		return x && x.__esModule && Object.prototype.hasOwnProperty.call(x, 'default') ? x['default'] : x;
	}

	function createCommonjsModule(fn, module) {
		return module = { exports: {} }, fn(module, module.exports), module.exports;
	}

	var Collector_1 = createCommonjsModule(function (module, exports) {
	Object.defineProperty(exports, "__esModule", { value: true });
	exports.Collector = void 0;
	/**
	 * Base class for collectors.
	 *
	 * @typeparam THandler The function signature to be implemented by handlers.
	 */
	class Collector {
	    /**
	     * Create a new collector.
	     *
	     * @param signal The signal to emit.
	     */
	    constructor(signal) {
	        // eslint-disable-next-line dot-notation
	        this.emit = (...args) => {
	            // eslint-disable-next-line dot-notation
	            signal["emitCollecting"](this, args);
	        };
	    }
	}
	exports.Collector = Collector;
	});

	unwrapExports(Collector_1);
	Collector_1.Collector;

	var CollectorArray_1 = createCommonjsModule(function (module, exports) {
	Object.defineProperty(exports, "__esModule", { value: true });
	exports.CollectorArray = void 0;

	/**
	 * Returns the result of the all signal handlers from a signal emission in an array.
	 *
	 * @typeparam THandler The function signature to be implemented by handlers.
	 */
	class CollectorArray extends Collector_1.Collector {
	    constructor() {
	        super(...arguments);
	        this.result = [];
	    }
	    handleResult(result) {
	        this.result.push(result);
	        return true;
	    }
	    /**
	     * Get the list of results from the signal handlers.
	     */
	    getResult() {
	        return this.result;
	    }
	    /**
	     * Reset the result
	     */
	    reset() {
	        this.result.length = 0;
	    }
	}
	exports.CollectorArray = CollectorArray;
	});

	unwrapExports(CollectorArray_1);
	CollectorArray_1.CollectorArray;

	var CollectorLast_1 = createCommonjsModule(function (module, exports) {
	Object.defineProperty(exports, "__esModule", { value: true });
	exports.CollectorLast = void 0;

	/**
	 * Returns the result of the last signal handler from a signal emission.
	 *
	 * @typeparam THandler The function signature to be implemented by handlers.
	 */
	class CollectorLast extends Collector_1.Collector {
	    handleResult(result) {
	        this.result = result;
	        return true;
	    }
	    /**
	     * Get the result of the last signal handler.
	     */
	    getResult() {
	        return this.result;
	    }
	    /**
	     * Reset the result
	     */
	    reset() {
	        delete this.result;
	    }
	}
	exports.CollectorLast = CollectorLast;
	});

	unwrapExports(CollectorLast_1);
	CollectorLast_1.CollectorLast;

	var CollectorUntil0_1 = createCommonjsModule(function (module, exports) {
	Object.defineProperty(exports, "__esModule", { value: true });
	exports.CollectorUntil0 = void 0;

	/**
	 * Keep signal emissions going while all handlers return true.
	 *
	 * @typeparam THandler The function signature to be implemented by handlers.
	 */
	class CollectorUntil0 extends Collector_1.Collector {
	    constructor() {
	        super(...arguments);
	        this.result = false;
	    }
	    handleResult(result) {
	        this.result = result;
	        return this.result;
	    }
	    /**
	     * Get the result of the last signal handler.
	     */
	    getResult() {
	        return this.result;
	    }
	    /**
	     * Reset the result
	     */
	    reset() {
	        this.result = false;
	    }
	}
	exports.CollectorUntil0 = CollectorUntil0;
	});

	unwrapExports(CollectorUntil0_1);
	CollectorUntil0_1.CollectorUntil0;

	var CollectorWhile0_1 = createCommonjsModule(function (module, exports) {
	Object.defineProperty(exports, "__esModule", { value: true });
	exports.CollectorWhile0 = void 0;

	/**
	 * Keep signal emissions going while all handlers return false.
	 *
	 * @typeparam THandler The function signature to be implemented by handlers.
	 */
	class CollectorWhile0 extends Collector_1.Collector {
	    constructor() {
	        super(...arguments);
	        this.result = false;
	    }
	    handleResult(result) {
	        this.result = result;
	        return !this.result;
	    }
	    /**
	     * Get the result of the last signal handler.
	     */
	    getResult() {
	        return this.result;
	    }
	    /**
	     * Reset the result
	     */
	    reset() {
	        this.result = false;
	    }
	}
	exports.CollectorWhile0 = CollectorWhile0;
	});

	unwrapExports(CollectorWhile0_1);
	CollectorWhile0_1.CollectorWhile0;

	var SignalConnection = createCommonjsModule(function (module, exports) {
	Object.defineProperty(exports, "__esModule", { value: true });
	exports.SignalConnectionImpl = void 0;
	/**
	 * Implementation of SignalConnection, for internal use only.
	 * @private
	 */
	class SignalConnectionImpl {
	    /**
	     * @param link The actual link of the connection.
	     * @param parentCleanup Callback to cleanup the parent signal when a connection is disconnected
	     */
	    constructor(link, parentCleanup) {
	        this.link = link;
	        this.parentCleanup = parentCleanup;
	    }
	    disconnect() {
	        if (this.link !== null) {
	            this.link.unlink();
	            this.link = null;
	            // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
	            this.parentCleanup();
	            this.parentCleanup = null;
	            return true;
	        }
	        return false;
	    }
	    set enabled(enable) {
	        if (this.link)
	            this.link.setEnabled(enable);
	    }
	    get enabled() {
	        // eslint-disable-next-line @typescript-eslint/prefer-optional-chain
	        return this.link !== null && this.link.isEnabled();
	    }
	}
	exports.SignalConnectionImpl = SignalConnectionImpl;
	});

	unwrapExports(SignalConnection);
	SignalConnection.SignalConnectionImpl;

	var SignalLink_1 = createCommonjsModule(function (module, exports) {
	Object.defineProperty(exports, "__esModule", { value: true });
	exports.SignalLink = void 0;
	/**
	 * SignalLink implements a doubly-linked ring with nodes containing the signal handlers.
	 * @private
	 */
	class SignalLink {
	    constructor(prev = null, next = null, order = 0) {
	        this.enabled = true;
	        this.newLink = false;
	        this.callback = null;
	        this.prev = prev !== null && prev !== void 0 ? prev : this;
	        this.next = next !== null && next !== void 0 ? next : this;
	        this.order = order;
	    }
	    isEnabled() {
	        return this.enabled && !this.newLink;
	    }
	    setEnabled(flag) {
	        this.enabled = flag;
	    }
	    unlink() {
	        this.callback = null;
	        this.next.prev = this.prev;
	        this.prev.next = this.next;
	    }
	    insert(callback, order) {
	        let after = this.prev;
	        while (after !== this) {
	            if (after.order <= order)
	                break;
	            after = after.prev;
	        }
	        const link = new SignalLink(after, after.next, order);
	        link.callback = callback;
	        after.next = link;
	        link.next.prev = link;
	        return link;
	    }
	}
	exports.SignalLink = SignalLink;
	});

	unwrapExports(SignalLink_1);
	SignalLink_1.SignalLink;

	var Signal_1 = createCommonjsModule(function (module, exports) {
	Object.defineProperty(exports, "__esModule", { value: true });
	exports.Signal = void 0;


	/**
	 * A signal is a way to publish and subscribe to events.
	 *
	 * @typeparam THandler The function signature to be implemented by handlers.
	 */
	class Signal {
	    constructor() {
	        this.head = new SignalLink_1.SignalLink();
	        this.hasNewLinks = false;
	        this.emitDepth = 0;
	        this.connectionsCount = 0;
	    }
	    /**
	     * @returns The number of connections on this signal.
	     */
	    getConnectionsCount() {
	        return this.connectionsCount;
	    }
	    /**
	     * @returns true if this signal has connections.
	     */
	    hasConnections() {
	        return this.connectionsCount > 0;
	    }
	    /**
	     * Subscribe to this signal.
	     *
	     * @param callback This callback will be run when emit() is called.
	     * @param order Handlers with a higher order value will be called later.
	     */
	    connect(callback, order = 0) {
	        this.connectionsCount++;
	        const link = this.head.insert(callback, order);
	        if (this.emitDepth > 0) {
	            this.hasNewLinks = true;
	            link.newLink = true;
	        }
	        return new SignalConnection.SignalConnectionImpl(link, () => this.decrementConnectionCount());
	    }
	    decrementConnectionCount() {
	        this.connectionsCount--;
	    }
	    /**
	     * Unsubscribe from this signal with the original callback instance.
	     * While you can use this method, the SignalConnection returned by connect() will not be updated!
	     *
	     * @param callback The callback you passed to connect().
	     */
	    disconnect(callback) {
	        for (let link = this.head.next; link !== this.head; link = link.next) {
	            if (link.callback === callback) {
	                this.decrementConnectionCount();
	                link.unlink();
	                return true;
	            }
	        }
	        return false;
	    }
	    /**
	     * Disconnect all handlers from this signal event.
	     */
	    disconnectAll() {
	        while (this.head.next !== this.head) {
	            this.head.next.unlink();
	        }
	        this.connectionsCount = 0;
	    }
	    /**
	     * Publish this signal event (call all handlers).
	     */
	    emit(...args) {
	        this.emitDepth++;
	        for (let link = this.head.next; link !== this.head; link = link.next) {
	            if (link.isEnabled() && link.callback)
	                link.callback.apply(null, args);
	        }
	        this.emitDepth--;
	        this.unsetNewLink();
	    }
	    emitCollecting(collector, args) {
	        this.emitDepth++;
	        for (let link = this.head.next; link !== this.head; link = link.next) {
	            if (link.isEnabled() && link.callback) {
	                const result = link.callback.apply(null, args);
	                if (!collector.handleResult(result))
	                    break;
	            }
	        }
	        this.emitDepth--;
	        this.unsetNewLink();
	    }
	    unsetNewLink() {
	        if (this.hasNewLinks && this.emitDepth === 0) {
	            for (let link = this.head.next; link !== this.head; link = link.next)
	                link.newLink = false;
	            this.hasNewLinks = false;
	        }
	    }
	}
	exports.Signal = Signal;
	});

	unwrapExports(Signal_1);
	Signal_1.Signal;

	var SignalConnections_1 = createCommonjsModule(function (module, exports) {
	Object.defineProperty(exports, "__esModule", { value: true });
	exports.SignalConnections = void 0;
	/**
	 * Represents a list of connections to a signal for easy disconnect.
	 */
	class SignalConnections {
	    constructor() {
	        this.list = [];
	    }
	    /**
	     * Add a connection to the list.
	     * @param connection
	     */
	    add(connection) {
	        this.list.push(connection);
	    }
	    /**
	     * Disconnect all connections in the list and empty the list.
	     */
	    disconnectAll() {
	        for (const connection of this.list) {
	            connection.disconnect();
	        }
	        this.list = [];
	    }
	    /**
	     * @returns The number of connections in this list.
	     */
	    getCount() {
	        return this.list.length;
	    }
	    /**
	     * @returns true if this list is empty.
	     */
	    isEmpty() {
	        return this.list.length === 0;
	    }
	}
	exports.SignalConnections = SignalConnections;
	});

	unwrapExports(SignalConnections_1);
	SignalConnections_1.SignalConnections;

	var dist = createCommonjsModule(function (module, exports) {
	Object.defineProperty(exports, "__esModule", { value: true });
	exports.SignalConnections = exports.Signal = exports.CollectorWhile0 = exports.CollectorUntil0 = exports.CollectorLast = exports.CollectorArray = exports.Collector = void 0;

	Object.defineProperty(exports, "Collector", { enumerable: true, get: function () { return Collector_1.Collector; } });

	Object.defineProperty(exports, "CollectorArray", { enumerable: true, get: function () { return CollectorArray_1.CollectorArray; } });

	Object.defineProperty(exports, "CollectorLast", { enumerable: true, get: function () { return CollectorLast_1.CollectorLast; } });

	Object.defineProperty(exports, "CollectorUntil0", { enumerable: true, get: function () { return CollectorUntil0_1.CollectorUntil0; } });

	Object.defineProperty(exports, "CollectorWhile0", { enumerable: true, get: function () { return CollectorWhile0_1.CollectorWhile0; } });

	Object.defineProperty(exports, "Signal", { enumerable: true, get: function () { return Signal_1.Signal; } });

	Object.defineProperty(exports, "SignalConnections", { enumerable: true, get: function () { return SignalConnections_1.SignalConnections; } });
	});

	unwrapExports(dist);
	dist.SignalConnections;
	var dist_2 = dist.Signal;
	dist.CollectorWhile0;
	dist.CollectorUntil0;
	dist.CollectorLast;
	dist.CollectorArray;
	dist.Collector;

	var __defProp$j = Object.defineProperty;
	var __defNormalProp$j = (obj, key, value) => key in obj ? __defProp$j(obj, key, { enumerable: true, configurable: true, writable: true, value }) : obj[key] = value;
	var __publicField$j = (obj, key, value) => __defNormalProp$j(obj, typeof key !== "symbol" ? key + "" : key, value);
	class ButtonEvents {
	  constructor() {
	    __publicField$j(this, "_isMouseIn");
	    __publicField$j(this, "_isDown");
	    /** Event that is fired when the button is down. */
	    __publicField$j(this, "onDown");
	    /**
	     * Event that fired when a down event happened inside the button
	     * and up event happened inside or outside of the button
	     */
	    __publicField$j(this, "onUp");
	    /**
	     * Event that fired when mouse up event happens outside of the button
	     * after the down event happened inside the button boundaries.
	     */
	    __publicField$j(this, "onUpOut");
	    /** Event that fired when the mouse is out of the view */
	    __publicField$j(this, "onOut");
	    /** Event that is fired when the button is pressed. */
	    __publicField$j(this, "onPress");
	    /** Event that is fired when the mouse hovers the button. Fired only if device is not mobile.*/
	    __publicField$j(this, "onHover");
	    this.onPress = new dist_2();
	    this.onDown = new dist_2();
	    this.onUp = new dist_2();
	    this.onHover = new dist_2();
	    this.onOut = new dist_2();
	    this.onUpOut = new dist_2();
	  }
	  connectEvents(view) {
	    if (pixi_js.isMobile.any) {
	      view.on("pointerdown", this.processDown, this);
	      view.on("pointerup", this.processUp, this);
	      view.on("pointerupoutside", this.processUpOut, this);
	      view.on("pointerout", this.processOut, this);
	      view.on("pointertap", this.processPress, this);
	      view.on("pointerover", this.processOver, this);
	    } else {
	      view.on("mousedown", this.processDown, this);
	      view.on("mouseup", this.processUp, this);
	      view.on("mouseupoutside", this.processUpOut, this);
	      view.on("mouseout", this.processOut, this);
	      view.on("click", this.processPress, this);
	      view.on("mouseover", this.processOver, this);
	    }
	  }
	  disconnectEvents(view) {
	    if (pixi_js.isMobile.any) {
	      view.off("pointerdown", this.processDown, this);
	      view.off("pointerup", this.processUp, this);
	      view.off("pointerupoutside", this.processUpOut, this);
	      view.off("pointerout", this.processOut, this);
	      view.off("pointertap", this.processPress, this);
	      view.off("pointerover", this.processOver, this);
	    } else {
	      view.off("mousedown", this.processDown, this);
	      view.off("mouseup", this.processUp, this);
	      view.off("mouseupoutside", this.processUpOut, this);
	      view.off("mouseout", this.processOut, this);
	      view.off("click", this.processPress, this);
	      view.off("mouseover", this.processOver, this);
	    }
	  }
	  processDown(e) {
	    this._isDown = true;
	    this.onDown.emit(this, e);
	    this.down(e);
	  }
	  processUp(e) {
	    if (this._isDown) {
	      this.onUp.emit(this, e);
	      this.up(e);
	    }
	    this._isDown = false;
	  }
	  processUpOut(e) {
	    if (this._isDown) {
	      this.onUp.emit(this, e);
	      this.onUpOut.emit(this, e);
	      this.up(e);
	      this.upOut(e);
	    }
	    this._isDown = false;
	  }
	  processOut(e) {
	    if (this._isMouseIn) {
	      this._isMouseIn = false;
	      this.onOut.emit(this, e);
	      this.out(e);
	    }
	  }
	  processPress(e) {
	    this._isDown = false;
	    this.onPress.emit(this, e);
	    this.press(e);
	  }
	  processOver(e) {
	    if (pixi_js.isMobile.any) return;
	    this._isMouseIn = true;
	    this.onHover.emit(this, e);
	    this.hover(e);
	  }
	  /**
	   * Method called when the button pressed.
	   * To be overridden.
	   * @param {FederatedPointerEvent} _e - event data
	   */
	  down(_e) {
	  }
	  /**
	   * Method called when the button is up.
	   * To be overridden.
	   * @param {FederatedPointerEvent} _e - event data
	   */
	  up(_e) {
	  }
	  /**
	   * Method called when the up event happens outside of the button,
	   * after the down event happened inside the button boundaries.
	   * To be overridden.
	   * @param {FederatedPointerEvent} _e - event data
	   */
	  upOut(_e) {
	  }
	  /**
	   * Method called when the mouse leaves the button.
	   * To be overridden.
	   * @param {FederatedPointerEvent} _e - event data
	   */
	  out(_e) {
	  }
	  /**
	   * Method called when the mouse press down the button.
	   * To be overridden.
	   * @param {FederatedPointerEvent} _e - event data
	   */
	  press(_e) {
	  }
	  /**
	   * Method called when the mouse hovers the button.
	   * To be overridden.
	   * Fired only if device is not mobile.
	   * @param {FederatedPointerEvent} _e - event data
	   */
	  hover(_e) {
	  }
	  /** Getter that returns if the button is down. */
	  get isDown() {
	    return this._isDown;
	  }
	}

	var __defProp$i = Object.defineProperty;
	var __defNormalProp$i = (obj, key, value) => key in obj ? __defProp$i(obj, key, { enumerable: true, configurable: true, writable: true, value }) : obj[key] = value;
	var __publicField$i = (obj, key, value) => __defNormalProp$i(obj, typeof key !== "symbol" ? key + "" : key, value);
	class Button extends ButtonEvents {
	  /**
	   * Turns a given container-based view into a button by adding all button events.
	   * @param {Container} view - instance of container, to be turned into button.
	   */
	  constructor(view) {
	    super();
	    /** Container, given as a constructor parameter that is a button view. */
	    __publicField$i(this, "_view");
	    if (view) {
	      this.view = view;
	      this.enabled = true;
	    }
	  }
	  /** Set button view, that all the interaction events are applied to. */
	  set view(view) {
	    const wasItInitiated = !!this._view;
	    if (wasItInitiated) this.disconnectEvents(this._view);
	    this._view = view;
	    this.connectEvents(this._view);
	  }
	  /** Get button view, thar all the interaction events are applied to. */
	  get view() {
	    return this._view;
	  }
	  /**
	   * Switcher, which prevents all button events from firing if off.
	   * @param {boolean} enabled
	   */
	  set enabled(enabled) {
	    if (!this.view) {
	      console.error("Button view is not set. Please set it before enabling the button.");
	      return;
	    }
	    this.view.eventMode = enabled ? "static" : "auto";
	    this.view.cursor = enabled ? "pointer" : "default";
	    if (!enabled && this.isDown) {
	      this.processUp();
	    }
	  }
	  /** Getter that returns button state. */
	  get enabled() {
	    return this.view.eventMode === "static";
	  }
	}
	class ButtonContainer extends pixi_js.Container {
	  constructor(view) {
	    super();
	    __publicField$i(this, "button");
	    __publicField$i(this, "onDown");
	    __publicField$i(this, "onUp");
	    __publicField$i(this, "onUpOut");
	    __publicField$i(this, "onOut");
	    __publicField$i(this, "onPress");
	    __publicField$i(this, "onHover");
	    this.button = new Button(this);
	    this.button.enabled = true;
	    if (view) {
	      this.addChild(view);
	    }
	    this.onPress = this.button.onPress;
	    this.onDown = this.button.onDown;
	    this.onUp = this.button.onUp;
	    this.onHover = this.button.onHover;
	    this.onOut = this.button.onOut;
	    this.onUpOut = this.button.onUpOut;
	  }
	  set enabled(enabled) {
	    this.button.enabled = enabled;
	  }
	  get enabled() {
	    return this.button.enabled;
	  }
	}

	function getView(view) {
	  if (typeof view === "string") {
	    return pixi_js.Sprite.from(view);
	  }
	  if (view instanceof pixi_js.Texture) {
	    return new pixi_js.Sprite(view);
	  }
	  return view;
	}

	var __defProp$h = Object.defineProperty;
	var __defNormalProp$h = (obj, key, value) => key in obj ? __defProp$h(obj, key, { enumerable: true, configurable: true, writable: true, value }) : obj[key] = value;
	var __publicField$h = (obj, key, value) => __defNormalProp$h(obj, typeof key !== "symbol" ? key + "" : key, value);
	class Switcher extends pixi_js.Container {
	  /**
	   * @param {Array<Container | string>} views - Array of views or textures that will be switching.
	   * @param triggerEvents - Button events, to switch views (can be one event or an array of events).
	   * @param activeViewID - The id of the view, visible by default.
	   */
	  constructor(views, triggerEvents, activeViewID) {
	    super();
	    __publicField$h(this, "_triggerEvents", /* @__PURE__ */ new Set(["onPress"]));
	    /** Container that holds all the content of the component. */
	    __publicField$h(this, "innerView");
	    /** The id of the visible(active) view. */
	    __publicField$h(this, "_active");
	    /** Fired when active view changes. */
	    __publicField$h(this, "onChange");
	    this.innerView = new pixi_js.Container();
	    this.addChild(this.innerView);
	    this.onChange = new dist_2();
	    if (views) this.views = views;
	    if (triggerEvents) this.triggerEvents = triggerEvents;
	    if (activeViewID && this.views.length > 0) this.active = activeViewID;
	    this.setInteractionEvents();
	  }
	  setInteractionEvents() {
	    this.innerView.eventMode = "static";
	    this.innerView.on("pointerdown", () => this.handleEvents("onDown"));
	    this.innerView.on("pointerup", () => this.handleEvents("onUp"));
	    this.innerView.on("pointerupoutside", () => this.handleEvents("onUpOut"));
	    this.innerView.on("pointerout", () => this.handleEvents("onOut"));
	    this.innerView.on("pointertap", () => this.handleEvents("onPress"));
	    this.innerView.on("pointerover", () => this.handleEvents("onHover"));
	  }
	  handleEvents(event) {
	    if (this._triggerEvents.has(event)) {
	      this.switch();
	    }
	  }
	  /** Returns the active view. */
	  get activeView() {
	    if (this.views && this.views[this.active]) {
	      return this.views[this.active];
	    }
	    return void 0;
	  }
	  /** Sets the list of instances for switching. */
	  set views(views) {
	    this.innerView.removeChildren();
	    views.forEach((stateView) => this.add(stateView));
	  }
	  /** Returns all the switchable views */
	  get views() {
	    return this.innerView.children;
	  }
	  /**
	   * Adds view instance to a switching list.
	   * @param view
	   */
	  add(view) {
	    const viewInstance = getView(view);
	    this.innerView.addChild(viewInstance);
	    viewInstance.visible = false;
	    if (this.views.length === 1) {
	      this.active = 0;
	    }
	  }
	  /**
	   * Removes view instance from a switching list by id.
	   * @param id - id of the view to remove.
	   */
	  remove(id) {
	    if (this.views[id]) {
	      this.innerView.removeChild(this.views[id]);
	    }
	  }
	  /**
	   * Sets a list of events that will make a switcher switch to the next view.
	   * @param {ButtonEvent | ButtonEvent[]} triggerEvents - Button events,
	   * to switch views (can be one event or an array of events).
	   */
	  set triggerEvents(triggerEvents) {
	    this._triggerEvents = new Set(
	      Array.isArray(triggerEvents) ? triggerEvents : [triggerEvents]
	    );
	  }
	  /** Returns a list of events that will make a switcher switch to the next view. */
	  get triggerEvents() {
	    return Array.from(this._triggerEvents);
	  }
	  /**
	   * Show a view by id, or to next one by order, if no ID provided.
	   * @param {number} id - optional id of the view to show. If not set, will switch to the next view.
	   */
	  switch(id) {
	    if (id !== void 0 && id === this.active) return;
	    const exID = this.active;
	    this.forceSwitch(id);
	    if (exID !== this.active) {
	      const res = this.views.length > 2 ? this.active : this.active === 1;
	      this.onChange.emit(res);
	    }
	  }
	  /**
	   * Switches a view to a given one without triggering the onChange event.
	   * @param {number} id - optional id of the view to show. If not set, will switch to the next view.
	   */
	  forceSwitch(id) {
	    if (id !== void 0 && id === this.active) return;
	    if (this.activeView) {
	      this.activeView.visible = false;
	    }
	    if (id !== void 0 && !this.views[id]) {
	      throw new Error(`View with id ${id} does not exist.`);
	    }
	    this._active = id !== void 0 ? id : this.nextActive;
	    if (this._active === void 0) {
	      return;
	    }
	    this.views[this.active].visible = true;
	  }
	  /** Returns the id of the next view in order. Or undefined, if order is empty. */
	  get nextActive() {
	    if (this.views.length === 0) return void 0;
	    return this.active < this.views.length - 1 ? this.active + 1 : 0;
	  }
	  /** Sets the id of the visible(active) view and shows to it. */
	  set active(id) {
	    this.switch(id);
	  }
	  /** Gets the id of the visible(active) view. */
	  get active() {
	    return this._active;
	  }
	}

	function cleanup(element) {
	  if (!element) return;
	  if (element.parent) {
	    element.parent.removeChild(element);
	  }
	  element.destroy();
	  element = null;
	}

	var __defProp$g = Object.defineProperty;
	var __defNormalProp$g = (obj, key, value) => key in obj ? __defProp$g(obj, key, { enumerable: true, configurable: true, writable: true, value }) : obj[key] = value;
	var __publicField$g = (obj, key, value) => __defNormalProp$g(obj, typeof key !== "symbol" ? key + "" : key, value);
	class CheckBox extends Switcher {
	  constructor(options) {
	    super();
	    //* Text label */
	    __publicField$g(this, "labelText");
	    /** Signal emitted when checkbox state changes. */
	    __publicField$g(this, "onCheck");
	    __publicField$g(this, "_style");
	    __publicField$g(this, "_textClass");
	    this._textClass = options.TextClass ?? pixi_js.Text;
	    this.text = options.text;
	    this.style = options.style;
	    this.checked = options.checked;
	    this.triggerEvents = ["onPress"];
	    this.innerView.cursor = "pointer";
	    this.onCheck = new dist_2();
	    this.onChange.connect(() => this.onCheck.emit(this.checked));
	  }
	  addLabel(text, style) {
	    if (!text) return;
	    this.labelText = new this._textClass({
	      text: text ?? "",
	      style: style ?? this._style?.text
	    });
	    this.addChild(this.labelText);
	    this.labelText.cursor = "pointer";
	    this.labelText.eventMode = "static";
	    this.labelText.on("pointertap", () => this.checked = !this.checked);
	  }
	  /** Setter, which sets a checkbox text. */
	  set text(text) {
	    if (!text) {
	      cleanup(this.labelText);
	      return;
	    }
	    this.labelText ? this.labelText.text = text : this.addLabel(text);
	  }
	  /** Getter, which returns a checkbox text. */
	  get text() {
	    return this.labelText?.text ?? "";
	  }
	  /** Setter, which sets a checkbox style settings. */
	  set style(style) {
	    const wasChecked = this.checked;
	    this._style = style;
	    const { unchecked, checked } = style;
	    const uncheckedView = getView(unchecked);
	    const checkedView = getView(checked);
	    this.views = [uncheckedView, checkedView];
	    if (wasChecked) {
	      checkedView.visible = true;
	      this.active = 1;
	    } else {
	      uncheckedView.visible = true;
	    }
	    if (this.labelText) {
	      checkedView.visible = true;
	      this.active = 1;
	      if (style.text) {
	        this.labelText.style = style.text;
	      }
	      this.labelText.x = uncheckedView.width + 10 + (style.textOffset?.x ?? 0);
	      this.labelText.y = (uncheckedView.height - this.labelText.height) / 2 + (style.textOffset?.y ?? 0);
	    } else {
	      uncheckedView.visible = true;
	    }
	  }
	  /** Getter, which returns a checkbox style settings. */
	  get style() {
	    return this._style;
	  }
	  /** Getter, which returns a checkbox state. */
	  get checked() {
	    return this.active === 1;
	  }
	  /** Setter, which sets a checkbox state. */
	  set checked(checked) {
	    this.switch(checked ? 1 : 0);
	  }
	  /**
	   * Setter, that sets a checkbox state without emitting a signal.
	   * @param checked
	   */
	  forceCheck(checked) {
	    this.forceSwitch(checked ? 1 : 0);
	  }
	}

	var __defProp$f = Object.defineProperty;
	var __defNormalProp$f = (obj, key, value) => key in obj ? __defProp$f(obj, key, { enumerable: true, configurable: true, writable: true, value }) : obj[key] = value;
	var __publicField$f = (obj, key, value) => __defNormalProp$f(obj, typeof key !== "symbol" ? key + "" : key, value);
	class CircularProgressBar extends pixi_js.Container {
	  /**
	   * Creates a Circular ProgressBar.
	   * @param { number } options - Options object to use.
	   * @param { ColorSource } options.backgroundColor - Background color.
	   * @param { ColorSource } options.fillColor - Fill color.
	   * @param { number } options.lineWidth - Line width.
	   * @param { number } options.radius - Radius.
	   * @param { number } options.value - Progress value.
	   * @param { number } options.backgroundAlpha - Background alpha.
	   * @param { number } options.fillAlpha - Fill alpha.
	   * @param { 'butt' | 'round' | 'square' } options.cap - Line cap.
	   */
	  constructor(options) {
	    super();
	    __publicField$f(this, "_progress", 0);
	    __publicField$f(this, "options");
	    __publicField$f(this, "bgCircle", new pixi_js.Graphics());
	    __publicField$f(this, "fillCircle", new pixi_js.Graphics());
	    /** Container, that holds all inner views. */
	    __publicField$f(this, "innerView", new pixi_js.Container());
	    this.options = options;
	    this.addChild(this.innerView);
	    this.innerView.addChild(this.bgCircle, this.fillCircle);
	    this.addBackground();
	    if (options.value) {
	      this.progress = options.value;
	    }
	  }
	  addBackground() {
	    const { backgroundColor, lineWidth, radius, backgroundAlpha } = this.options;
	    let alpha = 1;
	    if (backgroundAlpha > 0) {
	      alpha = backgroundAlpha;
	    }
	    if (backgroundColor === void 0) {
	      alpha = 1e-6;
	    }
	    this.bgCircle.circle(0, 0, radius).stroke({
	      width: lineWidth,
	      color: backgroundColor,
	      alpha
	    });
	  }
	  /**
	   * Set progress value.
	   * @param { number } value - Progress value.
	   */
	  set progress(value) {
	    if (value > 100) {
	      value = 100;
	    }
	    if (value < 0) {
	      value = 0;
	    }
	    this._progress = value;
	    const { lineWidth, radius, fillColor, fillAlpha, cap } = this.options;
	    if (value === 0 && fillAlpha === 0) {
	      this.fillCircle.clear();
	      return;
	    }
	    const startAngle = 0;
	    const endAngle = 360 / 100 * value;
	    this.fillCircle.clear().arc(
	      0,
	      0,
	      radius,
	      (0 - 90 + startAngle) * pixi_js.DEG_TO_RAD,
	      (0 - 90 + startAngle + endAngle) * pixi_js.DEG_TO_RAD
	    ).stroke({
	      width: lineWidth,
	      color: fillColor,
	      cap,
	      alpha: fillAlpha
	    });
	  }
	  /**
	   * Current progress value.
	   * @returns { number } - Progress value.
	   */
	  get progress() {
	    return this._progress;
	  }
	}

	var __defProp$e = Object.defineProperty;
	var __defNormalProp$e = (obj, key, value) => key in obj ? __defProp$e(obj, key, { enumerable: true, configurable: true, writable: true, value }) : obj[key] = value;
	var __publicField$e = (obj, key, value) => __defNormalProp$e(obj, typeof key !== "symbol" ? key + "" : key, value);
	class ProgressBar extends pixi_js.Container {
	  /**
	   * Creates a ProgressBar.
	   * @param options - Options.
	   * @param { Sprite | Graphics | Texture | string } options.bg - Background of the ProgressBar.
	   * <br> If you pass a string, it will be used as a texture name.
	   * <br> If you want to use NineSliceSprite, you have to pass a text
	   * (name of texture) or an instance of Texture as a parameter here.
	   * @param { Sprite | Graphics | Texture | string } options.fill - Fill of the ProgressBar.
	   * <br> If you pass a string, it will be used as a texture name.
	   * <br> If you want to use NineSliceSprite, you have to pass a text
	   * (name of texture) or an instance of Texture as a parameter here.
	   * @param { FillPaddings } options.fillPaddings - Fill offsets.
	   * @param { number } options.fillPaddings.top - Fill top offset.
	   * @param { number } options.fillPaddings.right - Fill right offset.
	   * @param { number } options.fillPaddings.bottom - Fill bottom offset.
	   * @param { number } options.fillPaddings.left - Fill left offset.
	   * @param { NineSliceSprite } options.nineSliceSprite - NineSliceSprite values for bg and fill.
	   * @param { Array } options.nineSliceSprite.bg - NineSliceSprite config for bg ([number, number, number, number]).
	   * <br> <b>!!! IMPORTANT:</b> To make it work, you have to pass a bg parameter as texture name or texture instance.
	   * @param { Array } options.nineSliceSprite.fill - NineSliceSprite config fill ([number, number, number, number]).
	   * <br> <b>!!! IMPORTANT:</b> To make it work, you have to pass a fill parameter as texture name or texture instance.
	   * @param { number } options.progress - Initial progress value.
	   */
	  constructor(options) {
	    super();
	    __publicField$e(this, "bg");
	    __publicField$e(this, "fill");
	    __publicField$e(this, "fillMask");
	    __publicField$e(this, "progressStart", 0);
	    __publicField$e(this, "_progress", 0);
	    __publicField$e(this, "options");
	    /** Container, that holds all inner views. */
	    __publicField$e(this, "innerView");
	    /** Container, given as a constructor parameter that is a button view. */
	    __publicField$e(this, "_view");
	    this.options = options;
	    this.innerView = new pixi_js.Container();
	    this.addChild(this.innerView);
	    if (options?.bg && options?.fill) {
	      this.init(options);
	    }
	  }
	  /**
	   * Initialize ProgressBar.
	   * @param root0
	   * @param root0.bg - Background texture.
	   * @param root0.fill - Fill texture.
	   * @param root0.fillPaddings - Fill offset.
	   * @param root0.progress - Initial progress value.
	   */
	  init({ bg, fill, fillPaddings, progress }) {
	    this.setBackground(bg);
	    this.setFill(fill, fillPaddings);
	    this.progress = progress;
	  }
	  /**
	   * Set bg.
	   * @param bg
	   */
	  setBackground(bg) {
	    if (this.bg) {
	      this.bg.destroy();
	    }
	    if (this.options?.nineSliceSprite) {
	      if (typeof bg === "string") {
	        this.bg = new pixi_js.NineSliceSprite({
	          texture: pixi_js.Texture.from(bg),
	          leftWidth: this.options.nineSliceSprite.bg[0],
	          topHeight: this.options.nineSliceSprite.bg[1],
	          rightWidth: this.options.nineSliceSprite.bg[2],
	          bottomHeight: this.options.nineSliceSprite.bg[3]
	        });
	      } else if (bg instanceof pixi_js.Texture) {
	        this.bg = new pixi_js.NineSliceSprite({
	          texture: bg,
	          leftWidth: this.options.nineSliceSprite.bg[0],
	          topHeight: this.options.nineSliceSprite.bg[1],
	          rightWidth: this.options.nineSliceSprite.bg[2],
	          bottomHeight: this.options.nineSliceSprite.bg[3]
	        });
	      } else {
	        console.warn(`NineSliceSprite can not be used with views set as Container.
                    Pass the texture or texture name as instead of the Container extended instance.`);
	      }
	    }
	    if (!this.bg) {
	      this.bg = getView(bg);
	    }
	    this.innerView.addChildAt(this.bg, 0);
	  }
	  /**
	   * Set fill.
	   * @param fill
	   * @param fillPadding
	   */
	  setFill(fill, fillPadding) {
	    if (this.fill) {
	      this.fill.destroy();
	    }
	    if (this.bg instanceof pixi_js.Sprite && fill === this.bg) {
	      console.warn("Can not use same Sprite instance for bg and fill.");
	      return;
	    }
	    if (this.options?.nineSliceSprite) {
	      if (typeof fill === "string" || fill instanceof pixi_js.Texture) {
	        this.fill = new pixi_js.NineSliceSprite({
	          texture: typeof fill === "string" ? pixi_js.Texture.from(fill) : fill,
	          leftWidth: this.options.nineSliceSprite.fill[0],
	          topHeight: this.options.nineSliceSprite.fill[1],
	          rightWidth: this.options.nineSliceSprite.fill[2],
	          bottomHeight: this.options.nineSliceSprite.fill[3]
	        });
	      } else {
	        console.warn(`NineSliceSprite can not be used with views set as Container.
                    Pass the texture or texture name as instead of the Container extended instance.`);
	        this.fill = getView(fill);
	      }
	    } else {
	      this.fill = getView(fill);
	    }
	    this.innerView.addChildAt(this.fill, 1);
	    const offsetX = fillPadding?.left ?? 0;
	    const offsetY = fillPadding?.top ?? 0;
	    this.fill.x = offsetX;
	    this.fill.y = offsetY;
	    if (this.fillMask) {
	      this.fill.mask = null;
	      this.fillMask.destroy();
	    }
	    const leftWidth = this.fill.width / 2;
	    const rightWidth = this.fill.width / 2;
	    const topHeight = this.fill.height / 2;
	    const bottomHeight = this.fill.height / 2;
	    let texture = pixi_js.Texture.WHITE;
	    if (this.fill instanceof pixi_js.Sprite && this.fill.texture) {
	      texture = this.fill.texture;
	    }
	    this.fillMask = new pixi_js.NineSliceSprite({
	      texture,
	      leftWidth,
	      topHeight,
	      rightWidth,
	      bottomHeight
	    });
	    this.fillMask.position.copyFrom(this.fill);
	    this.addChild(this.fillMask);
	    this.fill.mask = this.fillMask;
	  }
	  validate(progress) {
	    progress = Math.round(progress);
	    if (progress < 0) {
	      return 0;
	    }
	    if (progress > 100) {
	      return 100;
	    }
	    return progress;
	  }
	  /** Set current progress percentage value. */
	  set progress(progress) {
	    this._progress = this.validate(progress);
	    if (!this.fill) return;
	    if (this.fillMask) {
	      this.fill.mask = null;
	      this.fillMask.width = this.fill.width / 100 * (this._progress - this.progressStart);
	      this.fillMask.x = this.progressStart / 100 * this.fill.width + this.fill.x;
	      this.fillMask.height = this.fill.height;
	      this.fill.mask = this.fillMask;
	    }
	  }
	  /** Return current progress percentage value. */
	  get progress() {
	    return this._progress;
	  }
	  /**
	   * Sets width of a ProgressBars background and fill.
	   * If nineSliceSprite is set, then width will be set to nineSliceSprite.
	   * If nineSliceSprite is not set, then width will control components width as Container.
	   * @param width - Width value.
	   */
	  set width(width) {
	    if (this.options?.nineSliceSprite) {
	      if (this.bg) {
	        this.bg.width = width;
	      }
	      if (this.fill) {
	        const leftPadding = this.options.fillPaddings?.left ?? 0;
	        const rightPadding = this.options.fillPaddings?.right ?? 0;
	        this.fill.width = width - leftPadding - rightPadding;
	        this.fillMask.width = width - leftPadding - rightPadding;
	      }
	      this.progress = this._progress;
	    } else {
	      super.width = width;
	    }
	  }
	  /** Gets width of a ProgressBar. */
	  get width() {
	    return super.width;
	  }
	  /**
	   * Sets height of a ProgressBars background and fill.
	   * If nineSliceSprite is set, then height will be set to nineSliceSprite.
	   * If nineSliceSprite is not set, then height will control components height as Container.
	   * @param height - Height value.
	   */
	  set height(height) {
	    if (this.options?.nineSliceSprite) {
	      if (this.bg) {
	        this.bg.height = height;
	      }
	      if (this.fill) {
	        const topPadding = this.options.fillPaddings?.top ?? 0;
	        const bottomPadding = this.options.fillPaddings?.bottom ?? 0;
	        this.fill.height = height - topPadding - bottomPadding;
	        this.fillMask.height = height - topPadding - bottomPadding;
	      }
	      this.progress = this._progress;
	    } else {
	      super.height = height;
	    }
	  }
	  /** Gets height of a ProgressBar. */
	  get height() {
	    return super.height;
	  }
	  setSize(value, height) {
	    if (this.options?.nineSliceSprite) {
	      if (this.bg) {
	        this.bg.setSize(value, height);
	      }
	      if (this.fill) {
	        if (typeof value === "object") {
	          height = value.height ?? value.width;
	          value = value.width;
	        } else {
	          height = height ?? value;
	        }
	        const topPadding = this.options.fillPaddings?.top ?? 0;
	        const bottomPadding = this.options.fillPaddings?.bottom ?? 0;
	        const leftPadding = this.options.fillPaddings?.left ?? 0;
	        const rightPadding = this.options.fillPaddings?.right ?? 0;
	        this.fill.setSize(
	          value - leftPadding - rightPadding,
	          height - topPadding - bottomPadding
	        );
	        this.fillMask.setSize(
	          value - leftPadding - rightPadding,
	          height - topPadding - bottomPadding
	        );
	      }
	      this.progress = this._progress;
	    } else {
	      super.setSize(value, height);
	    }
	  }
	}

	var __defProp$d = Object.defineProperty;
	var __defNormalProp$d = (obj, key, value) => key in obj ? __defProp$d(obj, key, { enumerable: true, configurable: true, writable: true, value }) : obj[key] = value;
	var __publicField$d = (obj, key, value) => __defNormalProp$d(obj, typeof key !== "symbol" ? key + "" : key, value);
	class SliderBase extends ProgressBar {
	  constructor(options) {
	    super(options);
	    __publicField$d(this, "_slider1");
	    __publicField$d(this, "_slider2");
	    __publicField$d(this, "value1Text");
	    __publicField$d(this, "value2Text");
	    __publicField$d(this, "_value1");
	    __publicField$d(this, "_value2");
	    __publicField$d(this, "dragging", 0);
	    /** Minimal value. */
	    __publicField$d(this, "_min", 0);
	    /** Maximal value. */
	    __publicField$d(this, "_max", 100);
	    /** Progress value step */
	    __publicField$d(this, "_step", 1);
	    __publicField$d(this, "startX");
	    __publicField$d(this, "startUpdateValue1");
	    __publicField$d(this, "startUpdateValue2");
	    __publicField$d(this, "settings");
	    this.settings = options;
	    this.slider1 = options.slider1;
	    this.slider2 = options.slider2;
	    this.min = options.min ?? 0;
	    this.max = options.max ?? 100;
	  }
	  init(progressBarOptions) {
	    super.init(progressBarOptions);
	    if (this.fill) {
	      this.fill.eventMode = "none";
	    }
	  }
	  /**
	   * Sets Slider1 instance.
	   * @param value - Container or string with texture name.
	   */
	  set slider1(value) {
	    if (!value) return;
	    if (this._slider1) {
	      this.slider1.removeAllListeners();
	      this.slider1.destroy();
	    }
	    this._slider1 = this.createSlider(value);
	    if (this.settings.showValue && !this.value1Text) {
	      const TextClass = this.settings.valueTextClass ?? pixi_js.Text;
	      this.value1Text = new TextClass({
	        text: "",
	        style: this.settings.valueTextStyle || { fill: 16777215 }
	      });
	      this.value1Text.anchor.set(0.5);
	      this.addChild(this.value1Text);
	    }
	  }
	  /** Get Slider1 instance. */
	  get slider1() {
	    return this._slider1;
	  }
	  /**
	   * Sets Slider2 instance.
	   * @param value - Container or string with texture name.
	   */
	  set slider2(value) {
	    if (!value) return;
	    if (this._slider2) {
	      this.slider2.removeAllListeners();
	      this.slider2.destroy();
	    }
	    this._slider2 = this.createSlider(value);
	    if (this.settings.showValue && !this.value2Text) {
	      const TextClass = this.settings.valueTextClass ?? pixi_js.Text;
	      this.value2Text = new TextClass({
	        text: "",
	        style: this.settings.valueTextStyle || { fill: 16777215 }
	      });
	      this.value2Text.anchor.set(0.5);
	      this.addChild(this.value2Text);
	    }
	  }
	  /** Get Slider2 instance. */
	  get slider2() {
	    return this._slider2;
	  }
	  /**
	   * Set bg.
	   * @param bg
	   */
	  setBackground(bg) {
	    if (this.bg) {
	      this.bg.removeAllListeners();
	    }
	    super.setBackground(bg);
	    this.activateBG();
	  }
	  activateBG() {
	    this.bg.eventMode = "static";
	    this.bg.on("pointerdown", this.startUpdate, this).on("globalpointermove", this.update, this).on("pointerup", this.endUpdate, this).on("pointerupoutside", this.endUpdate, this);
	  }
	  createSlider(sliderData) {
	    const slider = getView(sliderData);
	    const onPointerDown = (event) => {
	      if (this.bg) {
	        event.currentTarget = this.bg;
	      }
	      this.startUpdate(event);
	    };
	    slider.eventMode = "static";
	    slider.on("pointerdown", onPointerDown).on("pointerup", this.endUpdate, this).on("pointerupoutside", this.endUpdate, this);
	    slider.x = slider.width / 2;
	    const container = new pixi_js.Container();
	    container.addChild(slider);
	    if (slider instanceof pixi_js.Sprite) {
	      slider.anchor.set(0.5);
	    }
	    container.y = this.bg?.height ? this.bg?.height / 2 : 0;
	    this.addChild(container);
	    return container;
	  }
	  startUpdate(event) {
	    this.dragging = 1;
	    const obj = event.currentTarget;
	    this.startX = obj.parent.worldTransform.applyInverse(event.global).x;
	    this.startUpdateValue1 = this._value1;
	    this.startUpdateValue2 = this._value2;
	    this.update(event);
	  }
	  endUpdate() {
	    if (!this.dragging) return;
	    this.dragging = 0;
	    if (!!this.startX || this.startUpdateValue1 !== this._value1 || this.startUpdateValue2 !== this._value2) {
	      this.change();
	    }
	    this.startUpdateValue1 = null;
	    this.startUpdateValue2 = null;
	  }
	  onClick() {
	    this.change();
	  }
	  /* Called when dragging started and on every move. */
	  update(_event) {
	    const obj = _event.currentTarget;
	    const { x } = obj.parent.worldTransform.applyInverse(_event.global);
	    if (x !== this.startX) {
	      this.startX = null;
	    }
	  }
	  /** Called when dragging stopped. */
	  change() {
	  }
	  /**
	   * Set max value.
	   * @param value
	   */
	  set max(value) {
	    this._max = value;
	  }
	  /** Get max value. */
	  get max() {
	    return this._max;
	  }
	  /**
	   * Set min value.
	   * @param value
	   */
	  set min(value) {
	    this._min = value;
	  }
	  /** Get min value. */
	  get min() {
	    return this._min;
	  }
	  /**
	   * Set step value.
	   * @param value
	   */
	  set step(value) {
	    this._step = value;
	  }
	  /** Get step value. */
	  get step() {
	    return this._step;
	  }
	}

	var __defProp$c = Object.defineProperty;
	var __defNormalProp$c = (obj, key, value) => key in obj ? __defProp$c(obj, key, { enumerable: true, configurable: true, writable: true, value }) : obj[key] = value;
	var __publicField$c = (obj, key, value) => __defNormalProp$c(obj, typeof key !== "symbol" ? key + "" : key, value);
	class DoubleSlider extends SliderBase {
	  constructor(options) {
	    super(options);
	    __publicField$c(this, "sliderOptions");
	    __publicField$c(this, "activeValue");
	    /** Signal that fires when value have changed. */
	    __publicField$c(this, "onChange", new dist_2());
	    /** Signal that fires when value is changing. */
	    __publicField$c(this, "onUpdate", new dist_2());
	    this.sliderOptions = options;
	    this.setInitialState();
	  }
	  setInitialState() {
	    this.validateValues();
	    const { value1, value2 } = this.sliderOptions;
	    this.updateProgress(value1, value2);
	    this.value2 = value2;
	    this.value1 = value1;
	  }
	  updateProgress(value1 = this.value1, value2 = this.value2) {
	    this.progressStart = (value1 - this.min) / (this.max - this.min) * 100;
	    this.progress = (value2 - this.min) / (this.max - this.min) * 100;
	  }
	  validateValues() {
	    if (!this.sliderOptions.value1) {
	      this.sliderOptions.value1 = this.min;
	    }
	    if (!this.sliderOptions.value2) {
	      this.sliderOptions.value2 = this.sliderOptions.max;
	    }
	    if (this.sliderOptions.value2 < this.sliderOptions.value1) {
	      this.sliderOptions.value2 = this.sliderOptions.value1;
	    }
	    if (this.sliderOptions.value1 < this.sliderOptions.min) {
	      this.sliderOptions.value1 = this.sliderOptions.min;
	    }
	    if (this.sliderOptions.value1 > this.sliderOptions.max) {
	      this.sliderOptions.value1 = this.sliderOptions.max;
	    }
	    if (this.sliderOptions.value2 > this.sliderOptions.max) {
	      this.sliderOptions.value2 = this.sliderOptions.max;
	    }
	  }
	  /** Returns left value. */
	  get value1() {
	    return this._value1;
	  }
	  /** Sets left value. */
	  set value1(value1) {
	    if (value1 === this._value1) return;
	    if (value1 < this.min) value1 = this.min;
	    if (value1 > this._value2) value1 = this._value2;
	    this._value1 = value1;
	    this.updateSlider1();
	    this.onUpdate?.emit(this.value1, this.value2);
	  }
	  /** Returns right value. */
	  get value2() {
	    return this._value2;
	  }
	  /** Sets right value. */
	  set value2(value2) {
	    if (value2 === this._value2) return;
	    if (value2 < this._value1) value2 = this._value1;
	    if (value2 > this.max) value2 = this.max;
	    this._value2 = value2;
	    this.updateSlider2();
	    this.onUpdate?.emit(this.value1, this.value2);
	  }
	  update(event) {
	    super.update(event);
	    if (!this.dragging) return;
	    const obj = event.currentTarget;
	    const { x } = obj.parent.worldTransform.applyInverse(event.global);
	    const slider1Dist = Math.abs(x - this._slider1.x - this._slider1.width);
	    const slider2Dist = Math.abs(x - this._slider2.x);
	    if (!this.activeValue) {
	      if (this.slider1 && x < this.slider1.x) {
	        this.activeValue = "value1";
	      } else if (this.slider2 && x > this.slider2.x) {
	        this.activeValue = "value2";
	      } else {
	        this.activeValue = slider1Dist < slider2Dist ? "value1" : "value2";
	      }
	    }
	    const progress = this.validate(x / this.bg?.width * 100);
	    if (this.activeValue === "value1") {
	      this.progressStart = progress;
	      this.value1 = this.min + (this.max - this.min) / 100 * progress;
	      this.updateProgress(this.value1, this.value2);
	    } else {
	      this.progress = progress;
	      this.value2 = this.min + (this.max - this.min) / 100 * progress;
	      this.updateProgress(this.value1, this.value2);
	    }
	  }
	  endUpdate() {
	    super.endUpdate();
	    this.activeValue = null;
	  }
	  change() {
	    this.onChange?.emit(this.value1, this.value2);
	  }
	  /**
	   * Set Slider1 instance.
	   * @param value - Container or string with texture name.
	   */
	  set slider1(value) {
	    super.slider1 = value;
	    this.updateSlider1();
	  }
	  /** Get Slider1 instance. */
	  get slider1() {
	    return this._slider1;
	  }
	  /**
	   * Sets Slider instance.
	   * @param value - Container or string with texture name.
	   */
	  set slider2(value) {
	    super.slider2 = value;
	    this.updateSlider2();
	  }
	  /** Get Slider2 instance. */
	  get slider2() {
	    return this._slider2;
	  }
	  updateSlider1() {
	    this.updateProgress(this.value1, this.value2);
	    this._slider1.x = this.bg?.width / 100 * this.progressStart - this._slider1.width / 2;
	    this._slider1.y = this.bg?.height / 2;
	    if (this._slider2 && this._slider1.x > this._slider2.x) {
	      this._slider1.x = this._slider2.x;
	    }
	    if (this.sliderOptions?.showValue) {
	      this.value1Text.text = `${Math.round(this.value1)}`;
	      const sliderPosX = this._slider1.x + this._slider1.width / 2;
	      const sliderPosY = this._slider1.y;
	      this.value1Text.x = sliderPosX + (this.sliderOptions.valueTextOffset?.x ?? 0);
	      this.value1Text.y = sliderPosY + (this.sliderOptions.valueTextOffset?.y ?? 0);
	    }
	  }
	  updateSlider2() {
	    this.updateProgress(this.value1, this.value2);
	    this._slider2.x = this.bg?.width / 100 * this.progress - this._slider2.width / 2;
	    this._slider2.y = this.bg?.height / 2;
	    if (this._slider2.x < this._slider1.x) {
	      this._slider2.x = this._slider1.x;
	    }
	    if (this.sliderOptions?.showValue) {
	      this.value2Text.text = `${Math.round(this.value2)}`;
	      const sliderPosX = this._slider2.x + this._slider2.width / 2;
	      const sliderPosY = this._slider2.y;
	      this.value2Text.x = sliderPosX + (this.sliderOptions.valueTextOffset?.x ?? 0);
	      this.value2Text.y = sliderPosY + (this.sliderOptions.valueTextOffset?.y ?? 0);
	    }
	  }
	  /**
	   * Sets width of a Sliders background and fill.
	   * If nineSliceSprite is set, then width will be set to nineSliceSprite.
	   * If nineSliceSprite is not set, then width will control components width as Container.
	   * @param value - Width value.
	   */
	  set width(value) {
	    super.width = value;
	    this.updateSlider1();
	    this.updateSlider2();
	  }
	  /** Gets width of a Slider. */
	  get width() {
	    return super.width;
	  }
	  /**
	   * Sets height of a Sliders background and fill.
	   * If nineSliceSprite is set, then height will be set to nineSliceSprite.
	   * If nineSliceSprite is not set, then height will control components height as Container.
	   * @param value - Height value.
	   */
	  set height(value) {
	    super.height = value;
	    this.updateSlider1();
	    this.updateSlider2();
	  }
	  /** Gets height of a Slider. */
	  get height() {
	    return super.height;
	  }
	  setSize(value, height) {
	    super.setSize(value, height);
	    this.updateSlider1();
	    this.updateSlider2();
	  }
	}

	/* eslint-disable */
	 
	/*!
	 * tweedle.js - v2.1.0
	 * Compiled Wed, 05 Apr 2023 15:21:25 UTC
	 *
	 * tweedle.js is licensed under the MIT License.
	 * http://www.opensource.org/licenses/mit-license
	 * 
	 * Copyright 2019-2021, Milton Candelero <miltoncandelero@gmail.com>, All Rights Reserved
	 */
	/**
	 * Polyfilled function to get the current time in miliseconds.
	 * It tries to use `process.hrtime()`, `performance.now()`, `Date.now()` or `new Date().getTime()` in that order.
	 */
	let NOW;

	// Include a performance.now polyfill.
	// In node.js, use process.hrtime.

	// @ts-ignore
	if (typeof self == "undefined" && typeof process !== "undefined" && process.hrtime) {
		NOW = function () {
			// @ts-ignore
			const time = process.hrtime();

			// Convert [seconds, nanoseconds] to milliseconds.
			return time[0] * 1000 + time[1] / 1000000;
		};
	}
	// In a browser, use self.performance.now if it is available.
	else if (typeof self !== "undefined" && self.performance !== undefined && self.performance.now !== undefined) {
		// This must be bound, because directly assigning this function
		// leads to an invocation exception in Chrome.
		NOW = self.performance.now.bind(self.performance);
	}
	// Use Date.now if it is available.
	else if (Date.now !== undefined) {
		NOW = Date.now;
	}
	// Otherwise, use 'new Date().getTime()'.
	else {
		NOW = function () {
			return new Date().getTime();
		};
	}

	/**
	 * A group is a class that allows you to manage many tweens from one place.
	 *
	 * A tween will ALWAYS belong to a group. If no group is assigned it will default to the static shared group: `Group.shared`.
	 */
	class Group {constructor() { Group.prototype.__init.call(this);Group.prototype.__init2.call(this);Group.prototype.__init3.call(this);Group.prototype.__init4.call(this); }
		 __init() {this._tweens

	 = {};}

		

		/**
		 * A tween without an explicit group will default to this shared static one.
		 */
		 static get shared() {
			if (!Group._shared) {
				Group._shared = new Group();
			}
			return Group._shared;
		}

		 __init2() {this._paused = false;}

		/**
		 * A paused group will skip updating all the asociated tweens.
		 * _To control all tweens, use {@link Group.getAll} to get an array with all tweens._
		 * @returns returns true if this group is paused.
		 */
		 isPaused() {
			return this._paused;
		}

		/**
		 * Pauses this group. If a group was already paused, this has no effect.
		 * A paused group will skip updating all the asociated tweens.
		 * _To control all tweens, use {@link Group.getAll} to get an array with all tweens._
		 */
		 pause() {
			this._paused = true;
		}

		/**
		 * Resumes this group. If a group was not paused, this has no effect.
		 * A paused group will skip updating all the asociated tweens.
		 * _To control all tweens, use {@link Group.getAll} to get an array with all tweens._
		 */
		 resume() {
			this._paused = false;
		}

		 __init3() {this._lastUpdateTime = undefined;}

		/**
		 * Function used by the group to know what time is it.
		 * Used to calculate the deltaTime in case you call update without the parameter.
		 */
		 __init4() {this.now = NOW;} // used to calculate deltatime in case you stop providing one

		/**
		 * Returns all the tweens in this group.
		 *
		 * _note: only **running** tweens are in a group._
		 * @returns all the running tweens.
		 */
		 getAll() {
			return Object.keys(this._tweens).map((tweenId) => this._tweens[tweenId]);
		}

		/**
		 * Removes all the tweens in this group.
		 *
		 * _note: this will not modify the group reference inside the tween object_
		 */
		 removeAll() {
			this._tweens = {};
		}

		/**
		 * Adds a tween to this group.
		 *
		 * _note: this will not modify the group reference inside the tween object_
		 * @param tween Tween to add.
		 */
		 add(tween) {
			this._tweens[tween.getId()] = tween;
		}

		/**
		 * Removes a tween from this group.
		 *
		 * _note: this will not modify the group reference inside the tween object_
		 * @param tween
		 */
		 remove(tween) {
			delete this._tweens[tween.getId()];
		}

		/**
		 * Updates all the tweens in this group.
		 *
		 * If a tween is stopped, paused, finished or non started it will be removed from the group.
		 *
		 *  Tweens are updated in "batches". If you add a new tween during an
		 *  update, then the new tween will be updated in the next batch.
		 *  If you remove a tween during an update, it may or may not be updated.
		 *  However, if the removed tween was added during the current batch,
		 *  then it will not be updated.
		 * @param deltaTime - Amount of **miliseconds** that have passed since last excecution. If not provided it will be calculated using the {@link Group.now} function
		 * @param preserve - Prevent the removal of stopped, paused, finished or non started tweens.
		 * @returns returns true if the group is not empty and it is not paused.
		 */
		 update(deltaTime, preserve = false) {
			// move forward the automatic dt if needed
			if (deltaTime == undefined) {
				// now varies from line to line, that's why I manually use 0 as dt
				if (this._lastUpdateTime == undefined) {
					this._lastUpdateTime = this.now();
					deltaTime = 0;
				} else {
					deltaTime = this.now() - this._lastUpdateTime;
				}
			}
			this._lastUpdateTime = this.now();

			// exit early if the entire group is paused
			if (this._paused) {
				return false;
			}

			const tweenIds = Object.keys(this._tweens);
			if (tweenIds.length == 0) {
				return false;
			}

			for (let i = 0; i < tweenIds.length; i++) {
				const tween = this._tweens[tweenIds[i]];

				// groups call the preserve with true because they like to delete themselves in a different way.
				if (tween && tween.update(deltaTime, true) == false && !preserve) {
					delete this._tweens[tweenIds[i]];
				}
			}

			return true;
		}
	}

	/**
	 * The type for a function that takes a number between 0 and 1 and returns another number between 0 and 1
	 */


	/**
	 * The Ease class provides a collection of easing functions.
	 *
	 * These functions take in a parameter between 0 and 1 as the ratio and give out a new ratio.
	 *
	 * These are [Robert Penner](http://www.robertpenner.com/easing_terms_of_use.html)'s optimized formulas.
	 *
	 * Need help picking one? [Check this out!](https://easings.net/)
	 */
	const Easing = {
		Linear: {
			None(amount) {
				return amount;
			},
		}};

	/**
	 * The type for a function that picks a value by interpolating the elements of the array given.
	 */


	/**
	 * Object containing common interpolation functions.
	 * These functions can be passed in the {@link Tween.interpolation} argument and **will only affect fields where you gave an array as target value**
	 */
	const Interpolation = {
		/**
		 * Geometric interpolation functions. Good for interpolating positions in space.
		 */
		Geom: {
			/**
			 * Linear interpolation is like drawing straight lines between the points.
			 */
			Linear(v, k) {
				const m = v.length - 1;
				const f = m * k;
				const i = Math.floor(f);
				const fn = Interpolation.Utils.Linear;

				if (k < 0) {
					return fn(v[0], v[1], f);
				}

				if (k > 1) {
					return fn(v[m], v[m - 1], m - f);
				}

				return fn(v[i], v[i + 1 > m ? m : i + 1], f - i);
			}},
		/**
		 * Helper functions used to calculate the different interpolations
		 */
		Utils: {
			Linear(p0, p1, t) {
				return (p1 - p0) * t + p0;
			}},
	};

	/**
	 * ARGB color format
	 * Alpha, Red, Green, Blue.
	 */

	/**
	 * Silly class to have a shared number that goes up.
	 */
	class Sequence {
		 static __initStatic() {this._nextId = 0;}

		 static nextId() {
			return Sequence._nextId++;
		}
	} Sequence.__initStatic();

	/**
	 * Default values used **during tween creation**.
	 * Allows to change the default values for all tweens.
	 */
	const DEFAULTS = {
		safetyCheckFunction: (_) => true,
		easingFunction: Easing.Linear.None,
		yoyoEasingFunction: undefined,
		interpolationFunction: Interpolation.Geom.Linear,
	};

	/**
	 * A Tween is basically an animation command.
	 * For example: _Go from here to there in this amount of time._
	 *
	 * Tweens won't start by themselves. **Remeber to call {@link Tween.start} when you want your tweens to start!**
	 *
	 * Most methods will return the same object to allow for daisy chaining.
	 * @template Target of the tween
	 */
	class Tween {
		 __init() {this._isPaused = false;}
		 __init2() {this._valuesStart = {};}
		 __init3() {this._valuesEnd = {};}
		 __init4() {this._valuesStartRepeat = {};}
		 __init5() {this._duration = 0;}
		 __init6() {this._repeatCount = 0;}
		 __init7() {this._repeat = 0;}
		
		 __init8() {this._yoyo = false;}
		 __init9() {this._isPlaying = false;}
		 get _reversed() {
			return this.yoyo && this._repeatCount % 2 !== 0;
		}
		 __init10() {this._delayTime = 0;}
		 __init11() {this._startTime = 0;}
		 __init12() {this._elapsedTime = 0;}
		 __init13() {this._timescale = 1;}
		 __init14() {this._safetyCheckFunction = DEFAULTS.safetyCheckFunction;}
		 __init15() {this._easingFunction = DEFAULTS.easingFunction;}
		 __init16() {this._yoyoEasingFunction = DEFAULTS.yoyoEasingFunction;}
		 __init17() {this._interpolationFunction = DEFAULTS.interpolationFunction;}
		 __init18() {this._chainedTweens = [];}
		
		 __init19() {this._onStartCallbackFired = false;}
		
		 __init20() {this._onAfterDelayCallbackFired = false;}
		
		
		
		
		 __init21() {this._id = Sequence.nextId();}
		 __init22() {this._isChainStopped = false;}
		
		
		 get _group() {
			if (this._groupRef) {
				return this._groupRef;
			} else {
				return Group.shared;
			}
		}
		 set _group(value) {
			this._groupRef = value;
		}

		/**
		 * Creates an instance of tween.
		 * @param object - The target object which properties you want to animate
		 * @param group - The {@link Group} this new Tween will belong to. If none is provided it will default to the static {@link Group.shared}
		 */
		constructor(object, group) {Tween.prototype.__init.call(this);Tween.prototype.__init2.call(this);Tween.prototype.__init3.call(this);Tween.prototype.__init4.call(this);Tween.prototype.__init5.call(this);Tween.prototype.__init6.call(this);Tween.prototype.__init7.call(this);Tween.prototype.__init8.call(this);Tween.prototype.__init9.call(this);Tween.prototype.__init10.call(this);Tween.prototype.__init11.call(this);Tween.prototype.__init12.call(this);Tween.prototype.__init13.call(this);Tween.prototype.__init14.call(this);Tween.prototype.__init15.call(this);Tween.prototype.__init16.call(this);Tween.prototype.__init17.call(this);Tween.prototype.__init18.call(this);Tween.prototype.__init19.call(this);Tween.prototype.__init20.call(this);Tween.prototype.__init21.call(this);Tween.prototype.__init22.call(this);
			this._object = object;
			this._group = group;
		}

		/**
		 * Gets the id for this tween. A tween id is a number that increases perpetually with each tween created. It is used inside {@link Group} to keep track of tweens
		 * @returns returns the id for this tween.
		 */
		 getId() {
			return this._id;
		}

		/**
		 * Gets {@link Group} that this tween belongs to.
		 * @returns returns the {@link Group} for this tween.
		 */
		 getGroup() {
			return this._group;
		}

		/**
		 * Gets the timescale for this tween. The timescale is a factor by which each deltatime is multiplied, allowing to speed up or slow down the tween.
		 * @returns returns the timescale for this tween.
		 */
		 getTimescale() {
			return this._timescale;
		}

		/**
		 * A tween is playing when it has been started but hasn't ended yet. This has nothing to do with pausing. For that see {@link Tween.isPaused}.
		 * @returns returns true if this tween is playing.
		 */
		 isPlaying() {
			return this._isPlaying;
		}

		/**
		 * A tween can only be paused if it was playing.
		 * @returns returns true if this tween is paused.
		 */
		 isPaused() {
			return this._isPaused;
		}

		/**
		 * Writes the starting values of the tween.
		 *
		 * **Starting values generated from {@link Tween.start} will be overwritten.**
		 * @param properties - Starting values for this tween.
		 * @returns returns this tween for daisy chaining methods.
		 */
		

		 from(properties) {
			try {
				JSON.stringify(properties);
			} catch (e) {
				throw new Error("The object you provided to the from() method has a circular reference!");
			}
			this._setupProperties(properties, this._valuesStart, properties, this._valuesStartRepeat, true);
			return this;
		}

		/**
		 * Set the final values for the target object's properties by copy.
		 * This will try to create a deep copy of the `properties` parameter.
		 * If you want the tween to keep a reference to the final values use {@link Tween.dynamicTo}.
		 *
		 * If an array value is provided for a value that originally wasn't an array, it will be interpreted as an interpolable curve and the values inside the array will be interpolated using the function provided in {@link Tween.interpolation}
		 *
		 * If a string value that starts with either `+` or `-`is provided it will be taken as a _relative value_ to the start value.
		 * @param properties - final values for the target object.
		 * @param duration - if given it will be used as the duration in **miliseconds**. if not, a call to {@link Tween.duration} will be needed.
		 * @returns returns this tween for daisy chaining methods.
		 */
		

		 to(properties, duration) {
			try {
				this._valuesEnd = JSON.parse(JSON.stringify(properties));
			} catch (e) {
				// recursive object. this gonna crash!
				console.warn("The object you provided to the to() method has a circular reference!. It can't be cloned. Falling back to dynamic targeting");
				return this.dynamicTo(properties, duration);
			}

			if (duration !== undefined) {
				this._duration = duration;
			}

			return this;
		}

		/**
		 * Set the final values for the target object's properties by reference.
		 * This will store a reference to the properties object allowing you to change the final values while the tween is running.
		 * If you want the tween to make a copy of the final values use {@link Tween.to}.
		 * @param properties - final values for the target object.
		 * @param duration - if given it will be used as the duration in **miliseconds**. if not, a call to {@link Tween.duration} will be needed.
		 * @returns returns this tween for daisy chaining methods.
		 */
		

		 dynamicTo(properties, duration) {
			this._valuesEnd = properties; // JSON.parse(JSON.stringify(properties));

			if (duration !== undefined) {
				this._duration = duration;
			}

			return this;
		}

		/**
		 * Sets the duration for this tween in **miliseconds**.
		 * @param d - The duration for this tween in **miliseconds**.
		 * @returns returns this tween for daisy chaining methods.
		 */
		 duration(d) {
			this._duration = d;

			return this;
		}

		/**
		 * Tweens won't start by themselves when created. Call this to start the tween.
		 * Starting values for the animation will be stored at this moment.
		 *
		 * **This function can't overwrite the starting values set by {@link Tween.from}**
		 *
		 * You can call this method on a finished tween to restart it without changing the starting values.
		 * To restart a tween and reset the starting values use {@link Tween.restart}
		 * @param delay - if given it will be used as the delay in **miliseconds**.
		 * @returns returns this tween for daisy chaining methods.
		 */
		 start(delay) {
			if (this._isPlaying) {
				return this;
			}

			if (delay != undefined) {
				this._delayTime = delay;
			}

			this._group.add(this);

			if (this._reversed) {
				this._swapEndStartRepeatValues(this._valuesStartRepeat, this._valuesEnd);
				this._valuesStart = JSON.parse(JSON.stringify(this._valuesStartRepeat));
			}

			this._repeatCount = 0; // This must be after we check for the _reversed flag!!.

			this._isPlaying = true;

			this._isPaused = false;

			this._onStartCallbackFired = false;

			this._onAfterDelayCallbackFired = false;

			this._isChainStopped = false;

			this._startTime = -this._delayTime;

			this._elapsedTime = 0;

			this._setupProperties(this._object, this._valuesStart, this._valuesEnd, this._valuesStartRepeat, false);

			return this;
		}

		/**
		 * @experimental
		 * Forces a tween to restart.
		 * Starting values for the animation will be stored at this moment.
		 * This literally calls {@link Tween.reset} and then {@link Tween.start}.
		 *
		 * **Starting values will be cleared!. This function will erase all values created from {@link Tween.from} and/or {@link Tween.start}**
		 * @param delay - if given it will be used as the delay in **miliseconds**.
		 * @returns returns this tween for daisy chaining methods.
		 */
		 restart(delay) {
			this.reset();
			return this.start(delay);
		}

		/**
		 * @experimental
		 * Clears the starting and loop starting values.
		 *
		 * **Starting values will be cleared!. This function will erase all values created from {@link Tween.from} and/or {@link Tween.start}**
		 * @returns returns this tween for daisy chaining methods.
		 */
		 reset() {
			if (this._isPlaying) {
				this.stop();
			}
			this._valuesStart = {};
			this._valuesStartRepeat = {};
			return this;
		}

		/**
		 * @experimental
		 * Stops the tween and sets the values to the starting ones.
		 *
		 * @returns returns this tween for daisy chaining methods.
		 */
		 rewind() {
			if (this._isPlaying) {
				this.stop();
			}

			if (this._reversed) {
				// if you rewind from a reversed position, we unreverse.
				this._swapEndStartRepeatValues(this._valuesStartRepeat, this._valuesEnd);
			}

			const value = this._easingFunction(0);

			// properties transformations
			this._updateProperties(this._object, this._valuesStart, this._valuesEnd, value);

			return this;
		}

		 _setupProperties(_object, _valuesStart, _valuesEnd, _valuesStartRepeat, overwrite) {
			for (const property in _valuesEnd) {
				const startValue = _object[property];
				const startValueIsArray = Array.isArray(startValue);
				const startValueIsNumber = !Number.isNaN(Number(startValue));
				const propType = startValueIsArray ? "array" : typeof startValue;
				const startValueIsObject = propType == "object";
				const endValueIsObject = typeof _valuesEnd[property] == "object";
				const isInterpolationList = !startValueIsArray && Array.isArray(_valuesEnd[property]);

				// If to() specifies a property that doesn't exist in the source object,
				// we should not set that property in the object
				if (propType == "undefined" || propType == "function" || _valuesEnd[property] == undefined || (!startValueIsArray && !startValueIsNumber && !startValueIsObject)) {
					continue;
				}

				// handle the deepness of the values
				if ((startValueIsObject || startValueIsArray || endValueIsObject) && startValue && !isInterpolationList) {
					if (typeof _valuesStart[property] == "undefined") {
						_valuesStart[property] = startValueIsArray ? [] : {};
					}
					if (typeof _valuesStartRepeat[property] == "undefined") {
						_valuesStartRepeat[property] = startValueIsArray ? [] : {};
					}

					this._setupProperties(startValue, _valuesStart[property], _valuesEnd[property], _valuesStartRepeat[property], overwrite);
				} else {
					// Save the starting value, but only once.
					if (typeof _valuesStart[property] == "undefined" || overwrite) {
						_valuesStart[property] = startValue;
					}

					if (typeof _valuesStartRepeat[property] == "undefined" || overwrite) {
						if (isInterpolationList) {
							_valuesStartRepeat[property] = _valuesEnd[property].slice().reverse()[0];
						} else {
							_valuesStartRepeat[property] = _valuesStart[property] || 0;
						}
					}
				}
			}
		}

		/**
		 * Stops this tween
		 * @returns returns this tween for daisy chaining methods.
		 */
		 stop() {
			if (!this._isChainStopped) {
				this._isChainStopped = true;
				this.stopChainedTweens();
			}

			if (!this._isPlaying) {
				return this;
			}

			this._group.remove(this);

			this._isPlaying = false;

			this._isPaused = false;

			if (this._onStopCallback) {
				this._onStopCallback(this._object, this);
			}

			return this;
		}

		/**
		 * Fastforwards this tween to the end by triggering an update with an infinite value.
		 * This will work even on paused tweens.
		 * @returns returns this tween for daisy chaining methods.
		 */
		 end(endChainedTweens = false) {
			let protectedChainedTweens = [];

			if (!endChainedTweens) {
				protectedChainedTweens = this._chainedTweens;
				this._chainedTweens = [];
			}

			this.resume();
			this.update(Infinity);

			if (!endChainedTweens) {
				this._chainedTweens = protectedChainedTweens;
				for (let i = 0, numChainedTweens = this._chainedTweens.length; i < numChainedTweens; i++) {
					this._chainedTweens[i].start();
				}
			}

			return this;
		}

		/**
		 * @experimental
		 * Skips forward the in the repeats of this tween by triggering a biiiiig update.
		 * Think of this as a less agressive {@link Tween.end}.
		 *
		 * @param amount - The amount of repeats to skip.
		 * @param resetCurrentLoop - If true, the time will become zero and the object will return to the initial value in the next update.
		 * @returns returns this tween for daisy chaining methods.
		 */
		 skip(amount, resetCurrentLoop = false) {
			this.resume();

			this.update(amount * this._duration - (resetCurrentLoop ? this._elapsedTime : 0));

			return this;
		}

		/**
		 * Pauses this tween. Does nothing is if the tween was already paused or wasn't playing.
		 * Paused tweens ignore all update calls.
		 * @returns returns this tween for daisy chaining methods.
		 */
		 pause() {
			if (this._isPaused || !this._isPlaying) {
				return this;
			}

			this._isPaused = true;

			this._group.remove(this);

			return this;
		}

		/**
		 * Resumes this tween. Does nothing if the tween wasn't paused nor running.
		 * @returns returns this tween for daisy chaining methods.
		 */
		 resume() {
			if (!this._isPaused || !this._isPlaying) {
				return this;
			}

			this._isPaused = false;

			this._group.add(this);

			return this;
		}

		/**
		 * @experimental
		 * Stops tweens chained to this tween. To chain a tween see {@link Tween.chain}.
		 *
		 * @returns returns this tween for daisy chaining methods.
		 */
		 stopChainedTweens() {
			for (let i = 0, numChainedTweens = this._chainedTweens.length; i < numChainedTweens; i++) {
				this._chainedTweens[i].stop();
			}

			return this;
		}

		/**
		 * @experimental
		 * Starts all tweens chained to this tween. To chain a tween see {@link Tween.chain}.
		 *
		 * @param stopThis - If true, this tween will be stopped before it starts the chained tweens.
		 * @returns returns this tween for daisy chaining methods.
		 */
		 startChainedTweens(stopThis = false) {
			if (stopThis) {
				this.stop();
			}

			for (let i = 0, numChainedTweens = this._chainedTweens.length; i < numChainedTweens; i++) {
				this._chainedTweens[i].start();
			}

			return this;
		}

		/**
		 * Sets the {@link Group} for this tween.
		 * @param group - the group for this tween. If undefined or null is given, the group will default to {@link Group.shared}.
		 * @returns returns this tween for daisy chaining methods.
		 */
		 group(group) {
			this._group = group;

			return this;
		}

		/**
		 * Sets the delay for this tween.
		 *
		 * This will only be applied at the start of the tween. For delaying the repeating of a tween, see {@link Tween.repeatDelay}
		 *
		 * **This will only work before calling {@link Tween.start}.**
		 * @param amount - the delay for this tween.
		 * @returns returns this tween for daisy chaining methods.
		 */
		 delay(amount) {
			this._delayTime = amount;

			return this;
		}

		/**
		 * Sets the timescale for this tween.
		 * The deltaTime inside the update will be multiplied by this value allowing to speed up or slow down the flow of time.
		 * @param multiplier - the timescale value for this tween.
		 * @returns returns this tween for daisy chaining methods.
		 */
		 timescale(multiplier) {
			this._timescale = multiplier;

			return this;
		}

		/**
		 * Sets the number of times this tween will loop
		 * @param times - the number of loops. For endless loops use `Infinity`
		 * @returns returns this tween for daisy chaining methods.
		 */
		 repeat(times = Infinity) {
			this._repeat = times;

			return this;
		}

		/**
		 * Sets the repeat delay for this tween.
		 *
		 * This will only be applied at the start of every repeat. For delaying only the start, see {@link Tween.delay}
		 * @param amount - the repeat delay for this tween.
		 * @returns returns this tween for daisy chaining methods.
		 */
		 repeatDelay(amount) {
			this._repeatDelayTime = amount;

			return this;
		}

		/**
		 * Sets if this tween should yoyo (reflect) itself when repeating.
		 * @param yoyo - the yoyo value for this tween.
		 * @returns returns this tween for daisy chaining methods.
		 */
		 yoyo(yoyo = true) {
			this._yoyo = yoyo;

			return this;
		}

		/**
		 * Sets the easing function to interpolate the starting values with the final values.
		 *
		 * You can use the functions inside the {@link Easing} object.
		 * @param easingFunction - a function that takes a number between 0 and 1 and returns another number between 0 and 1
		 * @returns returns this tween for daisy chaining methods.
		 */
		 easing(easingFunction) {
			this._easingFunction = easingFunction;

			return this;
		}

		/**
		 * @experimental
		 * Sets the safety check function to test if the tweening object is still valid.
		 * If the function returns a non-truthy value, the tween will skip the update loop.
		 * @param safetyCheckFunction - a function that takes the target object for this tween and returns true if the object is still valid.
		 * @returns returns this tween for daisy chaining methods.
		 */
		 safetyCheck(safetyCheckFunction) {
			this._safetyCheckFunction = safetyCheckFunction;

			return this;
		}

		/**
		 * @experimental
		 * Sets the easing function to interpolate the starting values with the final values on the way back due to a yoyo tween.
		 *
		 * You can use the functions inside the {@link Easing} object.
		 * @param easingFunction - a function that takes a number between 0 and 1 and returns another number between 0 and 1
		 * @returns returns this tween for daisy chaining methods.
		 */
		 yoyoEasing(easingFunction) {
			this._yoyoEasingFunction = easingFunction;

			return this;
		}

		/**
		 * Sets the easing function to interpolate the starting values with the final values when the final value is an array of objects.
		 * Use this to create bezier curves or interpolate colors.
		 *
		 * You can use the functions inside the {@link Interpolation} object.
		 * @param interpolationFunction
		 * @returns returns this tween for daisy chaining methods.
		 */
		 interpolation(interpolationFunction) {
			this._interpolationFunction = interpolationFunction;

			return this;
		}

		/**
		 * Adds tweens to be called when this tween ends.
		 * The tweens here will be called all at the same time.
		 * @param tweens - tweens to be started when this tween ends
		 * @returns returns this tween for daisy chaining methods.
		 */
		 chain(...tweens) {
			this._chainedTweens = tweens;

			return this;
		}

		/**
		 * Sets the onStart callback. This will be called as soon as you call {@link Tween.start}.
		 * @param callback - the function to call on start. It will recieve the target object and this tween as a parameter.
		 * @returns returns this tween for daisy chaining methods.
		 */
		 onStart(callback) {
			this._onStartCallback = callback;

			return this;
		}

		/**
		 * Sets the onAfterDelay callback. This will be called when the delay is over.
		 * @param callback - the function to call on start. It will recieve the target object and this tween as a parameter.
		 * @returns returns this tween for daisy chaining methods.
		 */
		 onAfterDelay(callback) {
			this._onAfterDelayCallback = callback;

			return this;
		}

		/**
		 * Sets the onStart callback
		 * @param callback - the function to call on start. It will recieve the target object, this tween, and a number between 0 and 1 determining the progress as a parameter.
		 * @returns returns this tween for daisy chaining methods.
		 */
		 onUpdate(callback) {
			this._onUpdateCallback = callback;

			return this;
		}

		/**
		 * Sets the onRepeat callback
		 * @param callback - the function to call on repeat. It will recieve the target object and this tween as a parameter.
		 * @returns returns this tween for daisy chaining methods.
		 */
		 onRepeat(callback) {
			this._onRepeatCallback = callback;

			return this;
		}

		/**
		 * Sets the onComplete callback
		 * @param callback - the function to call on complete. It will recieve the target object and this tween as a parameter.
		 * @returns returns this tween for daisy chaining methods.
		 */
		 onComplete(callback) {
			this._onCompleteCallback = callback;

			return this;
		}

		/**
		 * Sets the onStop callback
		 * @param callback - the function to call on stop. It will recieve the target object and this tween as a parameter.
		 * @returns returns this tween for daisy chaining methods.
		 */
		 onStop(callback) {
			this._onStopCallback = callback;

			return this;
		}

		/**
		 * Updates this tween
		 * @param deltaTime - the amount of time that passed since last update in **miliseconds**
		 * @param preserve - Prevent the removal of stopped, paused, finished or non started tweens from their group.
		 * @returns returns true if the tween hasn't finished yet.
		 */
		 update(deltaTime, preserve = false) {
			const retval = this._internalUpdate(deltaTime);
			if (!retval && !preserve) {
				this._group.remove(this);
			}
			return retval;
		}

		 _internalUpdate(deltaTime) {
			if (!this._safetyCheckFunction(this._object)) {
				return false;
			}

			if (this._isPaused) {
				return false;
			}

			deltaTime *= this._timescale;

			let elapsed;

			this._elapsedTime += deltaTime;

			const endTime = this._duration;
			const currentTime = this._startTime + this._elapsedTime;

			if (currentTime > endTime && !this._isPlaying) {
				return false;
			}

			// If the tween was already finished,
			if (!this.isPlaying) {
				this.start();
			}

			if (this._onStartCallbackFired == false) {
				if (this._onStartCallback) {
					this._onStartCallback(this._object, this);
				}

				this._onStartCallbackFired = true;
			}

			if (this._onAfterDelayCallbackFired == false && currentTime >= 0) {
				if (this._onAfterDelayCallback) {
					this._onAfterDelayCallback(this._object, this);
				}

				this._onAfterDelayCallbackFired = true;
			}

			elapsed = currentTime / this._duration;
			// zero duration makes elapsed a NaN. We need to fix this!
			if (this._duration == 0) {
				// positive currentTime means we have no delay to wait for!
				if (currentTime >= 0) {
					elapsed = 1;
				} else {
					elapsed = 0;
				}
			}
			// otherwise, clamp the result
			elapsed = Math.min(1, elapsed);
			elapsed = Math.max(0, elapsed);

			let leftOverTime = Number.isFinite(currentTime) ? currentTime % this._duration : currentTime; // leftover time
			if (Number.isNaN(leftOverTime)) {
				leftOverTime = 0;
			}
			const loopsMade = Math.floor(currentTime / this._duration); // if we overloop, how many loops did we eat?

			// check which easing to use...
			let value;
			if (this._reversed && this._yoyoEasingFunction) {
				value = this._yoyoEasingFunction(elapsed);
			} else {
				value = this._easingFunction(elapsed);
			}

			// properties transformations
			this._updateProperties(this._object, this._valuesStart, this._valuesEnd, value);

			// if there is absolutely no chance to loop, call update. we will be done.
			if (this._onUpdateCallback && (elapsed != 1 || this._repeat - this._repeatCount <= 0)) {
				this._onUpdateCallback(this._object, elapsed, this);
			}

			if (elapsed == 1) {
				if (this._repeat - this._repeatCount > 0) {
					// increase loops
					const oldCount = this._repeatCount;
					this._repeatCount = Math.min(this._repeat + 1, this._repeatCount + loopsMade);

					if (this._onUpdateCallback && (this._repeat - this._repeatCount < 0 || leftOverTime <= 0)) {
						this._onUpdateCallback(this._object, elapsed, this);
					}

					// fix starting values for yoyo or relative
					if (this._yoyo) {
						this._swapEndStartRepeatValues(this._valuesStartRepeat, this._valuesEnd);
					} else {
						this._moveForwardStartRepeatValues(this._valuesStartRepeat, this._valuesEnd);
					}

					// Reassign starting values
					this._valuesStart = JSON.parse(JSON.stringify(this._valuesStartRepeat));

					// restart start time
					if (this._repeatDelayTime !== undefined) {
						this._startTime = -this._repeatDelayTime;
					} else {
						this._startTime = 0;
					}

					if (this._onRepeatCallback) {
						// We fallback to only one call.
						let callbackCount = 1;

						if (Number.isFinite(loopsMade)) {
							// if we have a logical number of loops, we trigger the callback that many times
							callbackCount = this._repeatCount - oldCount;
						} else if (Number.isFinite(this._repeat)) {
							// if the amount of loops is infinite, we trigger the callback the amount of loops remaining
							callbackCount = this._repeat - oldCount;
						}

						for (let i = 0; i < callbackCount; i++) {
							this._onRepeatCallback(this._object, oldCount + 1 + i, this);
						}
					}

					this._elapsedTime = 0; // reset the elapsed time

					// if we have more loops to go, then go
					if (this._repeat - this._repeatCount >= 0) {
						// update with the leftover time
						if (leftOverTime > 0 && Number.isFinite(this._repeat)) {
							// only if it is greater than 0 and do not emit onupdate events...
							this._internalUpdate(leftOverTime);
						}
						return true;
					}
				}

				// If we are here, either we are not a looping boi or we are a finished looping boi
				if (this._onCompleteCallback) {
					this._onCompleteCallback(this._object, this);
				}

				for (let i = 0, numChainedTweens = this._chainedTweens.length; i < numChainedTweens; i++) {
					// Make the chained tweens start exactly at the time they should,
					// even if the update method was called way past the duration of the tween
					this._chainedTweens[i].start();
					if (leftOverTime > 0) {
						this._chainedTweens[i].update(leftOverTime);
					}
				}

				this._isPlaying = false;

				return false;
			}

			return true;
		}

		 _updateProperties(_object, _valuesStart, _valuesEnd, value) {
			for (const property in _valuesEnd) {
				// Don't update properties that do not exist in the source object
				if (_valuesStart[property] == undefined) {
					continue;
				}

				const start = _valuesStart[property];
				let end = _valuesEnd[property];
				const startIsArray = Array.isArray(_object[property]);
				const endIsArray = Array.isArray(end);
				const isInterpolationList = !startIsArray && endIsArray;

				if (isInterpolationList) {
					if (this._reversed) {
						_object[property] = this._interpolationFunction(end.concat([start]) , value);
					} else {
						_object[property] = this._interpolationFunction([start].concat(end) , value);
					}
				} else if (typeof end == "object" && end) {
					this._updateProperties(_object[property], start, end, value);
				} else {
					// Parses relative end values with start as base (e.g.: +10, -3)
					end = this._handleRelativeValue(start , end );

					// Protect against non numeric properties.
					if (typeof end == "number" && (typeof start == "number" || typeof start == "string")) {
						// I am certain that start here won't anser NaN or it would have been filtrated on the setupProperties
						_object[property] = Number(start) + (end - Number(start)) * value;

						// if it was originally a string, we make it back to string. keep it tidy
						if (typeof start == "string") {
							_object[property] = String(_object[property]);
						}
					}
				}
			}
		}

		 _handleRelativeValue(start, end) {
			if (typeof end !== "string") {
				return end;
			}

			if (end.charAt(0) == "+" || end.charAt(0) == "-") {
				return start + Number(end);
			}

			return Number(end);
		}

		 _swapEndStartRepeatValues(_valuesStartRepeat, _valuesEnd) {
			for (const property in _valuesStartRepeat) {
				const isInterpolationList = !Array.isArray(_valuesStartRepeat[property]) && Array.isArray(_valuesEnd[property]);

				if (typeof _valuesStartRepeat[property] == "object") {
					this._swapEndStartRepeatValues(_valuesStartRepeat[property], _valuesEnd[property]);
				} else {
					const tmp = _valuesStartRepeat[property];
					if (typeof _valuesEnd[property] == "string") {
						_valuesStartRepeat[property] = Number(_valuesStartRepeat[property]) + Number(_valuesEnd[property]);
						_valuesEnd[property] = tmp;
					} else if (isInterpolationList) {
						const aux = _valuesEnd[property].slice().reverse();
						_valuesStartRepeat[property] = aux[0];
						_valuesEnd[property] = aux;
					} else {
						_valuesStartRepeat[property] = _valuesEnd[property];
						_valuesEnd[property] = tmp;
					}
				}
			}
		}

		 _moveForwardStartRepeatValues(_valuesStartRepeat, _valuesEnd) {
			for (const property in _valuesStartRepeat) {
				if (typeof _valuesEnd[property] == "object") {
					this._moveForwardStartRepeatValues(_valuesStartRepeat[property], _valuesEnd[property]);
				} else {
					if (typeof _valuesEnd[property] == "string") {
						_valuesStartRepeat[property] = Number(_valuesStartRepeat[property]) + Number(_valuesEnd[property]);
					}
				}
			}
		}
	}

	function fitToView(parent, child, padding = 0, uniformScaling = true) {
	  let scaleX = child.scale.x;
	  let scaleY = child.scale.y;
	  if (!parent) {
	    throw new Error("Parent is not defined");
	  }
	  const maxWidth = parent.width - padding * 2;
	  const maxHeight = parent.height - padding * 2;
	  const widthOverflow = maxWidth - Math.round(child.width);
	  const heightOverflow = maxHeight - Math.round(child.height);
	  if (widthOverflow < 0) {
	    scaleX = maxWidth / (child.width / scaleX);
	  }
	  if (heightOverflow < 0) {
	    scaleY = maxHeight / (child.height / scaleY);
	  }
	  if (scaleX <= 0 || scaleY <= 0) {
	    child.scale.set(0);
	    return;
	  }
	  if (uniformScaling || child.scale.x === child.scale.y) {
	    const scale = Math.min(scaleX, scaleY);
	    child.scale.set(scale, scale);
	  } else {
	    const ratio = child.scale.x / child.scale.y;
	    if (widthOverflow < heightOverflow) {
	      child.scale.set(scaleX, scaleX / ratio);
	    } else {
	      child.scale.set(scaleY * ratio, scaleY);
	    }
	  }
	}

	function getTextView(text) {
	  if (typeof text === "string" || typeof text === "number") {
	    return new pixi_js.Text({ text: String(text) });
	  }
	  return text;
	}

	var __defProp$b = Object.defineProperty;
	var __defNormalProp$b = (obj, key, value) => key in obj ? __defProp$b(obj, key, { enumerable: true, configurable: true, writable: true, value }) : obj[key] = value;
	var __publicField$b = (obj, key, value) => __defNormalProp$b(obj, typeof key !== "symbol" ? key + "" : key, value);
	class FancyButton extends ButtonContainer {
	  /**
	   * Creates a button with a lot of tweaks.
	   * @param {object} options - Button options.
	   * @param { string | Texture | Container | Sprite | Graphics } options.defaultView - Container-based view that is shown when non of the button events are active.
	   *                                                                                   <br> Can be a string (name of texture) or an instance of Texture, Container, Sprite or Graphics.
	   *                                                                                   <br> If you want to use NineSliceSprite, you have to pass a text (name of texture) or an instance of Texture as a parameter here.
	   * @param { string | Texture | Container | Sprite | Graphics } options.hoverView - Container-based view that is shown when the mouse hovers over the button.
	   *                                                                                   <br> Can be a string (name of texture) or an instance of Texture, Container, Sprite or Graphics.
	   *                                                                                   <br> If you want to use NineSliceSprite, you have to pass a text (name of texture) or an instance of Texture as a parameter here.
	   * @param { string | Texture | Container | Sprite | Graphics } options.pressedView - Container-based view, shown when the mouse press on the component.
	   *                                                                                   <br> Can be a string (name of texture) or an instance of Texture, Container, Sprite or Graphics.
	   *                                                                                   <br> If you want to use NineSliceSprite, you have to pass a text (name of texture) or an instance of Texture as a parameter here.
	   * @param { string | Texture | Container | Sprite | Graphics } options.disabledView - Container-based view shown when the button is disabled.
	   *                                                                                   <br> Can be a string (name of texture) or an instance of Texture, Container, Sprite or Graphics.
	   *                                                                                   <br> If you want to use NineSliceSprite, you have to pass a text (name of texture) or an instance of Texture as a parameter here.
	   * @param { string | Texture | Container | Sprite | Graphics } options.icon - Container-based view for the button icon.
	   * @param {Text} options.text - Text-based view for the button text.
	   * @param {number} options.padding - Padding of the button text and icon views.
	   * If button text or icon does not fit active view + padding it will scale down to fit.
	   * @param {Point} options.offset - Offset of the button state views.
	   * @param {Point} options.textOffset - Offset of the text view.
	   * @param {Point} options.iconOffset - Offset of the icon view.
	   * @param {number} options.scale - Scale of the button. Scale will be applied to a main container,
	   * when all animations scales will be applied to the inner view.
	   * @param {number} options.defaultTextScale - Base text scaling to take into account when fitting inside the button.
	   * @param {number} options.defaultIconScale - Base icon scaling to take into account when fitting inside the button.
	   * @param {number} options.defaultTextAnchor - Base text anchor to take into account when fitting and placing inside the button.
	   * @param {number} options.defaultIconAnchor - Base icon anchor to take into account when fitting and placing inside the button.
	   * @param {number} options.anchor - Anchor point of the button.
	   * @param {number} options.anchorX - Horizontal anchor point of the button.
	   * @param {number} options.anchorY - Vertical anchor point of the button.
	   * @param { Array } options.nineSliceSprite - NineSliceSprite values for views ([number, number, number, number]).
	   *                                      <br> <b>!!! IMPORTANT:</b> To make it work, you have to pass a views (defaultView, hoverView, pressedView, disabledView) parameters as texture name or texture instance.
	   * @param options.animations - Animations that will be played when the button state changes.
	   */
	  constructor(options) {
	    super();
	    __publicField$b(this, "animations");
	    __publicField$b(this, "originalInnerViewState");
	    __publicField$b(this, "defaultDuration", 100);
	    /** FancyButton options. */
	    __publicField$b(this, "options");
	    /** Padding of the button text view. If button text does not fit active view + padding it will scale down to fit. */
	    __publicField$b(this, "_padding");
	    /** Offset of the button state views. If state views have different sizes, this option can help adjust them. */
	    __publicField$b(this, "_offset");
	    /** Offset of the text view. Can be set to any state of the button. */
	    __publicField$b(this, "_textOffset");
	    /** Offset of the icon view. Can be set to any state of the button. */
	    __publicField$b(this, "iconOffset");
	    //* View that holds all button inner views */
	    __publicField$b(this, "innerView", new pixi_js.Container());
	    __publicField$b(this, "_views", {});
	    /** State of the button. Possible valuers are: 'default', 'hover', 'pressed', 'disabled' */
	    __publicField$b(this, "state");
	    /** Anchor point of the button. */
	    __publicField$b(this, "anchor");
	    /** Base text scaling to take into account when fitting inside the button */
	    __publicField$b(this, "_defaultTextScale", { x: 1, y: 1 });
	    /** Base icon scaling to take into account when fitting inside the button */
	    __publicField$b(this, "_defaultIconScale", { x: 1, y: 1 });
	    /** Base text anchor to take into account when fitting and placing inside the button */
	    __publicField$b(this, "_defaultTextAnchor", { x: 0.5, y: 0.5 });
	    /** Base icon anchor to take into account when fitting and placing inside the button */
	    __publicField$b(this, "_defaultIconAnchor", { x: 0.5, y: 0.5 });
	    this.options = options ?? {};
	    const {
	      defaultView,
	      hoverView,
	      pressedView,
	      disabledView,
	      text,
	      padding,
	      offset,
	      textOffset,
	      iconOffset,
	      defaultTextScale: textScale,
	      defaultIconScale: iconScale,
	      defaultTextAnchor: textAnchor,
	      defaultIconAnchor: iconAnchor,
	      scale,
	      anchor,
	      anchorX,
	      anchorY,
	      icon,
	      animations
	    } = options ?? {};
	    this.addChild(this.innerView);
	    this.anchor = new pixi_js.ObservablePoint({
	      _onUpdate: () => this.updateAnchor()
	    });
	    this.anchor.set(anchorX ?? anchor ?? 0, anchorY ?? anchor ?? 0);
	    this.padding = padding ?? 0;
	    this.offset = offset;
	    this.textOffset = textOffset;
	    this.iconOffset = iconOffset;
	    this.defaultTextScale = textScale;
	    this.defaultIconScale = iconScale;
	    this.defaultTextAnchor = textAnchor;
	    this.defaultIconAnchor = iconAnchor;
	    this.scale.set(scale ?? 1);
	    if (animations) {
	      this.animations = animations;
	      pixi_js.Ticker.shared.add(() => Group.shared.update());
	    }
	    this.setState("default");
	    this.defaultView = defaultView;
	    this.hoverView = hoverView;
	    this.pressedView = pressedView;
	    this.disabledView = disabledView;
	    this.text = text;
	    this.iconView = icon;
	    this.initStateControl();
	  }
	  /**
	   * Updates the text of the button and updates its scaling basing on the new size.
	   * @param {string | number} text
	   */
	  set text(text) {
	    if (!text || text === 0) {
	      this.removeView("textView");
	      return;
	    }
	    if (!this._views.textView) {
	      this.createTextView(text);
	      return;
	    }
	    this._views.textView.text = text.toString();
	  }
	  /** Returns the text string of the button text element. */
	  get text() {
	    return this._views.textView?.text;
	  }
	  /**
	   * Setter, that prevents all button events from firing.
	   * @param {boolean} enabled
	   */
	  set enabled(enabled) {
	    this.button.enabled = enabled;
	    this.setState(enabled ? "default" : "disabled");
	  }
	  get enabled() {
	    return this.button.enabled;
	  }
	  /**
	   * Updates button state and shows the according views.
	   *
	   * Updates positions and offsets of the views.
	   *
	   * Plays animations if they are set.
	   * @param {State} newState
	   * @param force
	   */
	  setState(newState, force = false) {
	    if (!force && this.state === newState) {
	      return;
	    }
	    const currentView = this.getStateView(this.state);
	    if (currentView) currentView.visible = false;
	    this.state = newState;
	    const activeView = this.getStateView(newState);
	    if (activeView) {
	      this.setOffset(activeView, newState, this.offset);
	      activeView.visible = true;
	    }
	    this.updateAnchor();
	    this.playAnimations(newState);
	  }
	  /**
	   *
	   * Manage button text view.
	   * @param {string | Text} text - can be a string, Text, BitmapText ot HTMLText (Container-based element).
	   */
	  createTextView(text) {
	    this._views.textView = getTextView(text);
	    if (this.options?.defaultTextScale === void 0) {
	      const { x, y } = this._views.textView.scale;
	      this._defaultTextScale = { x, y };
	    }
	    this.innerView.addChild(this._views.textView);
	    this.adjustTextView(this.state);
	  }
	  /**
	   * Manages views offsets if it's set.
	   * @param view
	   * @param state
	   * @param offset
	   */
	  setOffset(view, state, offset) {
	    const stateOffset = offset ? offset[state] : {
	      x: 0,
	      y: 0
	    };
	    const defaultStateOffset = offset?.default;
	    if (stateOffset) {
	      view.x += stateOffset.x ?? 0;
	      view.y += stateOffset.y ?? 0;
	    } else if (defaultStateOffset) {
	      view.x += defaultStateOffset.x ?? 0;
	      view.y += defaultStateOffset.y ?? 0;
	    } else if (offset.x || offset.y) {
	      view.x += offset.x ?? 0;
	      view.y += offset.y ?? 0;
	    }
	  }
	  /**
	   * Returns active view for the state.
	   * @param state
	   */
	  getStateView(state) {
	    if (!this._views) return void 0;
	    switch (state) {
	      case "hover":
	        return this._views.hoverView ?? this._views.defaultView ?? void 0;
	      case "pressed":
	        return this._views.pressedView ?? this._views.hoverView ?? this._views.defaultView ?? void 0;
	      case "disabled":
	        return this._views.disabledView ?? this._views.defaultView ?? void 0;
	      case "default":
	        return this._views.defaultView ?? void 0;
	      default:
	        return void 0;
	    }
	  }
	  /**
	   * Adjusts text view position and scale.
	   * @param {State} state
	   */
	  adjustTextView(state) {
	    if (!this.text) return;
	    const activeView = this.getStateView(this.state);
	    const { x: anchorX, y: anchorY } = this._defaultTextAnchor;
	    if (activeView) {
	      if (!this.options.ignoreRefitting) {
	        this._views.textView.scale.set(this._defaultTextScale.x, this._defaultTextScale.y);
	      }
	      if (this.contentFittingMode === "default") {
	        fitToView(activeView, this._views.textView, this.padding, false);
	      }
	      if (this.contentFittingMode === "fill") {
	        this._views.textView.scale.set(1);
	        const availableWidth = activeView.width - this.padding * 2;
	        const availableHeight = activeView.height - this.padding * 2;
	        const targetScaleX = availableWidth / this._views.textView.width;
	        const targetScaleY = availableHeight / this._views.textView.height;
	        const scale = Math.min(targetScaleX, targetScaleY);
	        this._views.textView.scale.set(
	          scale * this._defaultTextScale.x,
	          scale * this._defaultTextScale.y
	        );
	      }
	      this._views.textView.x = activeView.x + activeView.width / 2;
	      this._views.textView.y = activeView.y + activeView.height / 2;
	    }
	    this._views.textView.anchor.set(anchorX, anchorY);
	    this.setOffset(this._views.textView, state, this.textOffset);
	  }
	  /**
	   * Adjusts icon view position and scale.
	   * @param {State} state
	   */
	  adjustIconView(state) {
	    if (!this._views.iconView) {
	      return;
	    }
	    const activeView = this.getStateView(state);
	    if (!activeView) {
	      return;
	    }
	    if (!this.options.ignoreRefitting) {
	      this._views.iconView.scale.set(this._defaultIconScale.x, this._defaultIconScale.y);
	    }
	    if (this.contentFittingMode === "default") {
	      fitToView(activeView, this._views.iconView, this.padding, false);
	    }
	    if (this.contentFittingMode === "fill") {
	      this._views.iconView.scale.set(1);
	      const availableWidth = activeView.width - this.padding * 2;
	      const availableHeight = activeView.height - this.padding * 2;
	      const targetScaleX = availableWidth / this._views.iconView.width;
	      const targetScaleY = availableHeight / this._views.iconView.height;
	      const scale = Math.min(targetScaleX, targetScaleY);
	      this._views.iconView.scale.set(
	        scale * this._defaultIconScale.x,
	        scale * this._defaultIconScale.y
	      );
	    }
	    const { x: anchorX, y: anchorY } = this._defaultIconAnchor;
	    if ("anchor" in this._views.iconView) {
	      this._views.iconView.anchor.set(anchorX, anchorY);
	    } else {
	      this._views.iconView.pivot.set(
	        anchorX * (this._views.iconView.width / this._views.iconView.scale.x),
	        anchorY * (this._views.iconView.height / this._views.iconView.scale.y)
	      );
	    }
	    this._views.iconView.x = activeView.x + activeView.width / 2;
	    this._views.iconView.y = activeView.y + activeView.height / 2;
	    this.setOffset(this._views.iconView, state, this.iconOffset);
	  }
	  /**
	   * Reset views positions according to the button anchor setting.
	   * We have to set the anchor position for each view individually, as each of them
	   * can be a different type of view (container without anchor, sprite with anchor, etc)
	   * we have to reset all anchors to 0,0 and then set the positions manually.
	   */
	  updateAnchor() {
	    if (!this._views) return;
	    const anchorX = this.anchor.x ?? 0;
	    const anchorY = this.anchor.y ?? 0;
	    const views = [
	      this._views.defaultView,
	      this._views.hoverView,
	      this._views.pressedView,
	      this._views.disabledView
	    ];
	    views.forEach((view) => {
	      if (!view) return;
	      view.anchor?.set(0);
	      view.x = -view.width * anchorX;
	      view.y = -view.height * anchorY;
	    });
	    if (this._views.defaultView) {
	      const { x, y, width, height } = this._views.defaultView;
	      this.hitArea = new pixi_js.Rectangle(x, y, width, height);
	    }
	    this.adjustIconView(this.state);
	    this.adjustTextView(this.state);
	  }
	  /**
	   * Sets the fitting mode for the button's content.
	   * @param {ContentFittingMode} mode - fitting mode type.
	   */
	  set contentFittingMode(mode) {
	    this.options.contentFittingMode = mode;
	  }
	  /** Returns the fitting mode for the button's content, defaulting to 'default'. */
	  get contentFittingMode() {
	    return this.options.contentFittingMode ?? "default";
	  }
	  /**
	   * Sets the default view of the button.
	   * @param { string | Container } view - string (path to the image) or a Container-based view
	   */
	  set defaultView(view) {
	    this.updateView("defaultView", view);
	    if (this._views.disabledView && this.state !== "default") {
	      this._views.disabledView.visible = false;
	    }
	  }
	  /** Returns the default view of the button. */
	  get defaultView() {
	    return this._views.defaultView;
	  }
	  /**
	   * Sets the hover view of the button.
	   * @param { string | Container } view - string (path to the image) or a Container-based view
	   */
	  set hoverView(view) {
	    this.updateView("hoverView", view);
	    if (this._views.hoverView && this.state !== "hover") {
	      this._views.hoverView.visible = false;
	    }
	  }
	  /** Returns the hover view of the button. */
	  get hoverView() {
	    return this._views.hoverView;
	  }
	  /** Sets the pressed view of the button. */
	  set pressedView(view) {
	    this.updateView("pressedView", view);
	    if (this._views.pressedView && this.state !== "pressed") {
	      this._views.pressedView.visible = false;
	    }
	  }
	  /** Returns the pressed view of the button. */
	  get pressedView() {
	    return this._views.pressedView;
	  }
	  /** Sets the disabled view of the button. */
	  set disabledView(view) {
	    this.updateView("disabledView", view);
	    if (this._views.disabledView && this.state !== "disabled") {
	      this._views.disabledView.visible = false;
	    }
	  }
	  /** Returns the disabled view of the button. */
	  get disabledView() {
	    return this._views.disabledView;
	  }
	  /**
	   * Helper method to update or cleanup button views.
	   * @param { 'defaultView' | 'hoverView' | 'pressedView' | 'disabledView' } viewType - type of the view to update
	   * @param { string | Texture | Container | null } view - new view
	   */
	  updateView(viewType, view) {
	    if (view === void 0) return;
	    this.removeView(viewType);
	    if (view === null) {
	      return;
	    }
	    if (this.options?.nineSliceSprite) {
	      if (typeof view === "string") {
	        this._views[viewType] = new pixi_js.NineSliceSprite({
	          texture: pixi_js.Texture.from(view),
	          leftWidth: this.options.nineSliceSprite[0],
	          topHeight: this.options.nineSliceSprite[1],
	          rightWidth: this.options.nineSliceSprite[2],
	          bottomHeight: this.options.nineSliceSprite[3]
	        });
	      } else if (view instanceof pixi_js.Texture) {
	        this._views[viewType] = new pixi_js.NineSliceSprite({
	          texture: view,
	          leftWidth: this.options.nineSliceSprite[0],
	          topHeight: this.options.nineSliceSprite[1],
	          rightWidth: this.options.nineSliceSprite[2],
	          bottomHeight: this.options.nineSliceSprite[3]
	        });
	      } else {
	        console.warn("NineSliceSprite can not be used with views set as Container. Pass the texture or texture name as instead of the Container extended instance.");
	      }
	    }
	    if (!this._views[viewType]) {
	      this._views[viewType] = getView(view);
	    }
	    this.setOffset(this._views[viewType], this.state, this.offset);
	    if (!this._views[viewType].parent) {
	      this.innerView.addChild(this._views[viewType]);
	    }
	    this.updateAnchor();
	    if (this._views.iconView) {
	      this.innerView.addChild(this._views.iconView);
	    }
	    if (this._views.textView) {
	      this.innerView.addChild(this._views.textView);
	    }
	    this.setState(this.state, true);
	  }
	  /**
	   * Removes button view by type
	   * @param {'defaultView' | 'hoverView' | 'pressedView' | 'disabledView'} viewType - type of the view to remove
	   */
	  removeView(viewType) {
	    if (this._views[viewType]) {
	      this.innerView.removeChild(this._views[viewType]);
	      this._views[viewType] = null;
	    }
	  }
	  /**
	   * Sets the textView of the button.
	   * @param { string | number | PixiText | Text | BitmapText | HTMLText } textView - string, text or pixi text instance.
	   */
	  set textView(textView) {
	    if (textView === void 0) return;
	    this.removeView("textView");
	    if (textView === null) {
	      return;
	    }
	    this.createTextView(textView);
	  }
	  /**
	   * Returns the text view of the button.
	   * @returns pixi text instance or undefined.
	   */
	  get textView() {
	    return this._views.textView;
	  }
	  /**
	   * Sets the iconView of the button.
	   * @param { string | Texture | Container } view - string (path to the image), texture instance or a Container-based view
	   */
	  set iconView(view) {
	    if (view === void 0) return;
	    this.removeView("iconView");
	    if (view === null) {
	      return;
	    }
	    this._views.iconView = getView(view);
	    if (this.options?.defaultIconScale === void 0) {
	      const { x, y } = this._views.iconView.scale;
	      this._defaultIconScale = { x, y };
	    }
	    if (!this._views.iconView.parent) {
	      this.innerView.addChild(this._views.iconView);
	    }
	    this.setState(this.state, true);
	  }
	  /** Returns the icon view of the button. */
	  get iconView() {
	    return this._views.iconView;
	  }
	  /**
	   * Starts animation for the current button state if configured.
	   * @param {State} state
	   */
	  playAnimations(state) {
	    if (!this.animations) return;
	    if (state === "default" && !this.originalInnerViewState) {
	      this.originalInnerViewState = {
	        x: this.innerView.x,
	        y: this.innerView.y,
	        width: this.innerView.width,
	        height: this.innerView.height,
	        scale: {
	          x: this.innerView.scale.x,
	          y: this.innerView.scale.y
	        }
	      };
	      const defaultStateAnimation = this.animations?.default;
	      if (defaultStateAnimation) {
	        this.innerView.x = defaultStateAnimation.props.x ?? this.originalInnerViewState.x;
	        this.innerView.y = defaultStateAnimation.props.y ?? this.originalInnerViewState.y;
	        this.innerView.width = defaultStateAnimation.props.width ?? this.originalInnerViewState.width;
	        this.innerView.height = defaultStateAnimation.props.height ?? this.originalInnerViewState.height;
	        this.innerView.scale.x = defaultStateAnimation.props.scale.x ?? this.originalInnerViewState.scale.x;
	        this.innerView.scale.y = defaultStateAnimation.props.scale.y ?? this.originalInnerViewState.scale.y;
	        return;
	      }
	    }
	    const stateAnimation = this.animations[state] ?? this.animations.default;
	    if (stateAnimation) {
	      const data = stateAnimation;
	      this.defaultDuration = data.duration;
	      new Tween(this.innerView).to(data.props, data.duration).start();
	      return;
	    }
	    new Tween(this.innerView).to(this.originalInnerViewState, this.defaultDuration).start();
	  }
	  initStateControl() {
	    this.onDown.connect(() => {
	      this.setState("pressed");
	    });
	    this.onUp.connect(() => {
	      pixi_js.isMobile.any ? this.setState("default") : this.setState("hover");
	    });
	    this.onUpOut.connect(() => {
	      this.setState("default");
	    });
	    this.onOut.connect(() => {
	      if (!this.button.isDown) {
	        this.setState("default");
	      }
	    });
	    this.onPress.connect(() => {
	      pixi_js.isMobile.any ? this.setState("default") : this.setState("hover");
	    });
	    this.onHover.connect(() => {
	      if (!this.button.isDown) {
	        pixi_js.isMobile.any ? this.setState("default") : this.setState("hover");
	      }
	    });
	  }
	  /**
	   * Sets the button padding.
	   * @param {number} padding - padding of the button text and icon views.
	   */
	  set padding(padding) {
	    this._padding = padding;
	    this.adjustTextView(this.state);
	    this.adjustIconView(this.state);
	  }
	  /** Returns the button padding. */
	  get padding() {
	    return this._padding;
	  }
	  /**
	   * Sets the button offset.
	   * @param { { x?: number; y?: number } } offset - offset of the button.
	   * Can be set for each state of the button.
	   */
	  set offset(offset) {
	    this._offset = offset;
	    this.updateAnchor();
	  }
	  /** Returns the button offset. */
	  get offset() {
	    return this._offset;
	  }
	  /**
	   * Sets the button text offset.
	   * @param { { x?: number; y?: number } } textOffset - offsets of the button text view.
	   * can be set for each state of the button.
	   */
	  set textOffset(textOffset) {
	    this._textOffset = textOffset;
	    this.adjustTextView(this.state);
	  }
	  /** Returns the button text offset. */
	  get textOffset() {
	    return this._textOffset;
	  }
	  /**
	   * Sets the base scale for the text view to take into account when fitting inside the button.
	   * @param {Pos | number} scale - base scale of the text view.
	   */
	  set defaultTextScale(scale) {
	    if (scale === void 0) return;
	    this.options.defaultTextScale = scale;
	    const isNumber = typeof scale === "number";
	    this._defaultTextScale.x = isNumber ? scale : scale.x ?? 1;
	    this._defaultTextScale.y = isNumber ? scale : scale.y ?? 1;
	    this.adjustTextView(this.state);
	  }
	  /** Returns the text view base scale. */
	  get defaultTextScale() {
	    return this.defaultTextScale;
	  }
	  /**
	   * Sets the base scale for the icon view to take into account when fitting inside the button.
	   * @param {Pos | number} scale - base scale of the icon view.
	   */
	  set defaultIconScale(scale) {
	    if (scale === void 0) return;
	    this.options.defaultIconScale = scale;
	    const isNumber = typeof scale === "number";
	    this._defaultIconScale.x = isNumber ? scale : scale.x ?? 1;
	    this._defaultIconScale.y = isNumber ? scale : scale.y ?? 1;
	    this.adjustIconView(this.state);
	  }
	  /** Returns the icon view base scale. */
	  get defaultIconScale() {
	    return this.defaultIconScale;
	  }
	  /**
	   * Sets the base anchor for the text view to take into account when fitting and placing inside the button.
	   * @param {Pos | number} anchor - base anchor of the text view.
	   */
	  set defaultTextAnchor(anchor) {
	    if (anchor === void 0) return;
	    this.options.defaultTextAnchor = anchor;
	    const isNumber = typeof anchor === "number";
	    this._defaultTextAnchor.x = isNumber ? anchor : anchor.x ?? 1;
	    this._defaultTextAnchor.y = isNumber ? anchor : anchor.y ?? 1;
	    this.adjustTextView(this.state);
	  }
	  /** Returns the text view base anchor. */
	  get defaultTextAnchor() {
	    return this.defaultTextAnchor;
	  }
	  /**
	   * Sets the base anchor for the icon view to take into account when fitting and placing inside the button.
	   * @param {Pos | number} anchor - base anchor of the icon view.
	   */
	  set defaultIconAnchor(anchor) {
	    if (anchor === void 0) return;
	    this.options.defaultIconAnchor = anchor;
	    const isNumber = typeof anchor === "number";
	    this._defaultIconAnchor.x = isNumber ? anchor : anchor.x ?? 1;
	    this._defaultIconAnchor.y = isNumber ? anchor : anchor.y ?? 1;
	    this.adjustIconView(this.state);
	  }
	  /** Returns the icon view base anchor. */
	  get defaultIconAnchor() {
	    return this.defaultIconAnchor;
	  }
	  /**
	   * Sets width of a FancyButtons state views.
	   * If nineSliceSprite is set, then width will be set to nineSliceSprites of a views.
	   * If nineSliceSprite is not set, then width will control components width as Container.
	   * @param width - Width value.
	   */
	  set width(width) {
	    if (this.options?.nineSliceSprite) {
	      if (this._views.defaultView) {
	        this._views.defaultView.width = width;
	      }
	      if (this._views.hoverView) {
	        this._views.hoverView.width = width;
	      }
	      if (this._views.pressedView) {
	        this._views.pressedView.width = width;
	      }
	      if (this._views.disabledView) {
	        this._views.disabledView.width = width;
	      }
	      this.adjustTextView(this.state);
	      this.adjustIconView(this.state);
	      this.updateAnchor();
	    } else {
	      super.width = width;
	    }
	  }
	  /** Gets width of a FancyButton. */
	  get width() {
	    return super.width;
	  }
	  /**
	   * Sets height of a FancyButtons state views.
	   * If nineSliceSprite is set, then height will be set to nineSliceSprites of a views.
	   * If nineSliceSprite is not set, then height will control components height as Container.
	   * @param height - Height value.
	   */
	  set height(height) {
	    if (this.options?.nineSliceSprite) {
	      if (this._views.defaultView) {
	        this._views.defaultView.height = height;
	      }
	      if (this._views.hoverView) {
	        this._views.hoverView.height = height;
	      }
	      if (this._views.pressedView) {
	        this._views.pressedView.height = height;
	      }
	      if (this._views.disabledView) {
	        this._views.disabledView.height = height;
	      }
	      this.adjustTextView(this.state);
	      this.adjustIconView(this.state);
	      this.updateAnchor();
	    } else {
	      super.height = height;
	    }
	  }
	  /** Gets height of a FancyButton. */
	  get height() {
	    return super.height;
	  }
	  setSize(value, height) {
	    if (this.options?.nineSliceSprite) {
	      if (this._views.defaultView) {
	        this._views.defaultView.setSize(value, height);
	      }
	      if (this._views.hoverView) {
	        this._views.hoverView.setSize(value, height);
	      }
	      if (this._views.pressedView) {
	        this._views.pressedView.setSize(value, height);
	      }
	      if (this._views.disabledView) {
	        this._views.disabledView.setSize(value, height);
	      }
	      this.adjustTextView(this.state);
	      this.adjustIconView(this.state);
	      this.updateAnchor();
	    } else {
	      super.setSize(value, height);
	    }
	  }
	}

	var __defProp$a = Object.defineProperty;
	var __defNormalProp$a = (obj, key, value) => key in obj ? __defProp$a(obj, key, { enumerable: true, configurable: true, writable: true, value }) : obj[key] = value;
	var __publicField$a = (obj, key, value) => __defNormalProp$a(obj, typeof key !== "symbol" ? key + "" : key, value);
	const SECURE_CHARACTER = "*";
	class Input extends pixi_js.Container {
	  /**
	   * Creates an input.
	   * @param { number } options - Options object to use.
	   * @param { Sprite | Graphics | Texture | string } options.bg - Background of the Input.
	   * <br> Can be a string (name of texture) or an instance of Texture, Sprite or Graphics.
	   * <br> If you want to use NineSliceSprite, you have to pass a text (name of texture)
	   * or an instance of Texture as a parameter.
	   * @param { PixiTextStyle } options.textStyle - Text style of the Input.
	   * @param { string } options.placeholder - Placeholder of the Input.
	   * @param { string } options.value - Value of the Input.
	   * @param { number } options.maxLength - Max length of the Input.
	   * @param { 'left' | 'center' | 'right' } options.align - Align of the Input.
	   * @param { Padding } options.padding - Padding of the Input.
	   * @param { number } options.padding.top - Top padding of the Input.
	   * @param { number } options.padding.right - Right padding of the Input.
	   * @param { number } options.padding.bottom - Bottom padding of the Input.
	   * @param { number } options.padding.left - Left padding of the Input.
	   * @param { boolean } options.cleanOnFocus - Clean Input on focus.
	   * @param { boolean } options.addMask - Add mask to the Input text, so it is cut off when it does not fit.
	   * @param { Array } options.nineSliceSprite - NineSliceSprite values for bg and fill ([number, number, number, number]).
	   * <br> <b>!!! IMPORTANT:</b> To make it work, you have to pass a texture name or texture instance as a bg parameter.
	   */
	  constructor(options) {
	    super();
	    __publicField$a(this, "_bg");
	    __publicField$a(this, "inputMask");
	    __publicField$a(this, "_cursor");
	    __publicField$a(this, "_value", "");
	    __publicField$a(this, "_secure");
	    __publicField$a(this, "inputField");
	    __publicField$a(this, "placeholder");
	    __publicField$a(this, "editing", false);
	    __publicField$a(this, "tick", 0);
	    __publicField$a(this, "lastInputData");
	    __publicField$a(this, "activation", false);
	    __publicField$a(this, "options");
	    __publicField$a(this, "input");
	    __publicField$a(this, "handleActivationBinding", this.handleActivation.bind(this));
	    __publicField$a(this, "onKeyUpBinding", this.onKeyUp.bind(this));
	    __publicField$a(this, "stopEditingBinding", this.stopEditing.bind(this));
	    __publicField$a(this, "onInputBinding", this.onInput.bind(this));
	    __publicField$a(this, "onPasteBinding", this.onPaste.bind(this));
	    /** Fires when input loses focus. */
	    __publicField$a(this, "onEnter");
	    /** Fires every time input string is changed. */
	    __publicField$a(this, "onChange");
	    /** Top side padding */
	    __publicField$a(this, "paddingTop", 0);
	    /** Right side padding */
	    __publicField$a(this, "paddingRight", 0);
	    /** Bottom side padding */
	    __publicField$a(this, "paddingBottom", 0);
	    /** Left side padding */
	    __publicField$a(this, "paddingLeft", 0);
	    this.options = options;
	    this.options = options;
	    this.padding = options.padding;
	    this._secure = options.secure ?? false;
	    this.cursor = "text";
	    this.interactive = true;
	    this.on("pointertap", () => {
	      this.activation = true;
	      pixi_js.isMobile.any && this.handleActivation();
	    });
	    window.addEventListener(pixi_js.isMobile.any ? "touchstart" : "click", this.handleActivationBinding);
	    this.onEnter = new dist_2();
	    this.onChange = new dist_2();
	    pixi_js.Ticker.shared.add((ticker) => this.update(ticker.deltaTime));
	    if (options.bg) {
	      this.bg = options.bg;
	    } else {
	      console.error("Input: bg is not defined, please define it.");
	    }
	  }
	  onInput(e) {
	    this.lastInputData = e.data;
	  }
	  onKeyUp(e) {
	    const key = e.key;
	    const keysToSkip = [
	      "Shift",
	      "Control",
	      "Alt",
	      "Meta",
	      "ArrowLeft",
	      "ArrowRight",
	      "ArrowUp",
	      "ArrowDown",
	      "CapsLock",
	      "AltGraph",
	      "Tab",
	      "ContextMenu",
	      "F1",
	      "F2",
	      "F3",
	      "F4",
	      "F5",
	      "F6",
	      "F7",
	      "F8",
	      "F9",
	      "F10",
	      "F11",
	      "F12",
	      "ScrollLock",
	      "Pause",
	      "Insert",
	      "Delete",
	      "Home",
	      "End",
	      "PageUp",
	      "PageDown",
	      "NumLock",
	      "Dead"
	    ];
	    if (keysToSkip.includes(key)) return;
	    if (e.metaKey) return;
	    if (e.ctrlKey) return;
	    if (key === "Backspace") {
	      this._delete();
	    } else if (key === "Escape" || key === "Enter") {
	      this.stopEditing();
	    } else if (key.length === 1) {
	      this._add(key);
	    } else if (this.lastInputData && this.lastInputData.length === 1) {
	      this._add(this.lastInputData);
	    }
	    if (this.input) {
	      this.input.value = "";
	    }
	  }
	  init() {
	    const options = this.options;
	    const defaultTextStyle = {
	      fill: 0,
	      align: "center"
	    };
	    this.options.textStyle = options.textStyle ?? defaultTextStyle;
	    this.options.TextClass = options.TextClass ?? pixi_js.Text;
	    const textStyle = { ...defaultTextStyle, ...options.textStyle };
	    const colorSource = textStyle.fill && pixi_js.Color.isColorLike(textStyle.fill) ? textStyle.fill : 0;
	    this.inputField = new this.options.TextClass({
	      text: "",
	      style: textStyle
	    });
	    this._cursor = new pixi_js.Sprite(pixi_js.Texture.WHITE);
	    this._cursor.tint = colorSource;
	    this._cursor.anchor.set(0.5);
	    this._cursor.width = 2;
	    this._cursor.height = this.inputField.height * 0.8;
	    this._cursor.alpha = 0;
	    this.placeholder = new this.options.TextClass({
	      text: options.placeholder,
	      style: textStyle ?? defaultTextStyle
	    });
	    this.placeholder.visible = !!options.placeholder;
	    this.addChild(this.inputField, this.placeholder, this._cursor);
	    this.value = options.value ?? "";
	    this.align();
	  }
	  set bg(bg) {
	    if (this._bg) {
	      this._bg.destroy();
	    }
	    if (this.options?.nineSliceSprite) {
	      if (typeof bg === "string") {
	        this._bg = new pixi_js.NineSliceSprite({
	          texture: pixi_js.Texture.from(bg),
	          leftWidth: this.options.nineSliceSprite[0],
	          topHeight: this.options.nineSliceSprite[1],
	          rightWidth: this.options.nineSliceSprite[2],
	          bottomHeight: this.options.nineSliceSprite[3]
	        });
	      } else if (bg instanceof pixi_js.Texture) {
	        this._bg = new pixi_js.NineSliceSprite({
	          texture: bg,
	          leftWidth: this.options.nineSliceSprite[0],
	          topHeight: this.options.nineSliceSprite[1],
	          rightWidth: this.options.nineSliceSprite[2],
	          bottomHeight: this.options.nineSliceSprite[3]
	        });
	      } else {
	        console.warn(`NineSliceSprite can not be used with views set as Container.
                    Pass the texture or texture name as instead of the Container extended instance.`);
	      }
	    }
	    if (!this._bg) {
	      this._bg = getView(bg);
	    }
	    this._bg.cursor = "text";
	    this._bg.interactive = true;
	    this.addChildAt(this._bg, 0);
	    if (!this.inputField) {
	      this.init();
	    }
	    if (this.options.addMask) {
	      this.createInputMask(bg);
	    }
	  }
	  get bg() {
	    return this._bg;
	  }
	  _add(key) {
	    if (!this.editing) {
	      return;
	    }
	    if (this.options.maxLength && this.value.length >= this.options.maxLength) {
	      return;
	    }
	    this.value = this.value + key;
	    this.onChange.emit(this.value);
	  }
	  _delete() {
	    const length = this.value.length;
	    if (!this.editing || length === 0) return;
	    this.value = this.value.substring(0, length - 1);
	    this.onChange.emit(this.value);
	  }
	  _startEditing() {
	    if (this.options.cleanOnFocus) {
	      this.value = "";
	    }
	    this.tick = 0;
	    this.editing = true;
	    this.placeholder.visible = false;
	    this._cursor.alpha = 1;
	    this.createInputField();
	    this.align();
	  }
	  createInputField() {
	    if (this.input) {
	      this.input.removeEventListener("blur", this.stopEditingBinding);
	      this.input.removeEventListener("keydown", this.onKeyUpBinding);
	      this.input.removeEventListener("input", this.onInputBinding);
	      this.input.removeEventListener("paste", this.onPasteBinding);
	      this.input?.blur();
	      this.input?.remove();
	      this.input = null;
	    }
	    const input = document.createElement("input");
	    document.body.appendChild(input);
	    input.style.position = "fixed";
	    input.style.left = `${this.getGlobalPosition().x}px`;
	    input.style.top = `${this.getGlobalPosition().y}px`;
	    input.style.opacity = "0.0000001";
	    input.style.width = `${this._bg.width}px`;
	    input.style.height = `${this._bg.height}px`;
	    input.style.border = "none";
	    input.style.outline = "none";
	    input.style.background = "white";
	    if (pixi_js.isMobile.android.device) {
	      setTimeout(() => {
	        input.focus();
	        input.click();
	      }, 100);
	    } else {
	      input.focus();
	      input.click();
	    }
	    input.addEventListener("blur", this.stopEditingBinding);
	    input.addEventListener("keydown", this.onKeyUpBinding);
	    input.addEventListener("input", this.onInputBinding);
	    input.addEventListener("paste", this.onPasteBinding);
	    this.input = input;
	    this.align();
	  }
	  handleActivation() {
	    if (this.editing) return;
	    this.stopEditing();
	    if (this.activation) {
	      this._startEditing();
	      this.activation = false;
	    }
	  }
	  stopEditing() {
	    if (!this.editing) return;
	    this._cursor.alpha = 0;
	    this.editing = false;
	    if (this.inputField.text === "") {
	      this.placeholder.visible = true;
	    }
	    if (this.value.length === 0) this.placeholder.visible = true;
	    this.input?.blur();
	    this.input?.remove();
	    this.input = null;
	    this.align();
	    this.onEnter.emit(this.value);
	  }
	  update(dt) {
	    if (!this.editing) return;
	    this.tick += dt * 0.1;
	    this._cursor.alpha = Math.round(Math.sin(this.tick) * 0.5 + 0.5);
	  }
	  align() {
	    if (!this._bg) return;
	    const align = this.getAlign();
	    this.inputField.anchor.set(align, 0.5);
	    this.inputField.x = this._bg.width * align + (align === 1 ? -this.paddingRight : this.paddingLeft);
	    this.inputField.y = this._bg.height / 2 + this.paddingTop - this.paddingBottom;
	    this.placeholder.anchor.set(align, 0.5);
	    this.placeholder.x = this._bg.width * align + (align === 1 ? -this.paddingRight : this.paddingLeft);
	    this.placeholder.y = this._bg.height / 2;
	    this._cursor.x = this.getCursorPosX();
	    this._cursor.y = this.inputField.y;
	  }
	  getAlign() {
	    const maxWidth = this._bg.width * 0.95;
	    const paddings = this.paddingLeft + this.paddingRight - 10;
	    const isOverflowed = this.inputField.width + paddings > maxWidth;
	    if (isOverflowed) {
	      return this.editing ? 1 : 0;
	    }
	    switch (this.options.align) {
	      case "left":
	        return 0;
	      case "center":
	        return 0.5;
	      case "right":
	        return 1;
	      default:
	        return 0;
	    }
	  }
	  getCursorPosX() {
	    const align = this.getAlign();
	    switch (align) {
	      case 0:
	        return this.inputField.x + this.inputField.width;
	      case 0.5:
	        return this.inputField.x + this.inputField.width * 0.5;
	      case 1:
	        return this.inputField.x;
	      default:
	        return 0;
	    }
	  }
	  /** Sets the input text. */
	  set value(text) {
	    const textLength = text.length;
	    this._value = text;
	    this.inputField.text = this.secure ? SECURE_CHARACTER.repeat(textLength) : text;
	    if (textLength !== 0) {
	      this.placeholder.visible = false;
	    } else {
	      this.placeholder.visible = !this.editing;
	    }
	    this.align();
	  }
	  /** Return text of the input. */
	  get value() {
	    return this._value;
	  }
	  set secure(val) {
	    this._secure = val;
	    this.value = this._value;
	  }
	  get secure() {
	    return this._secure;
	  }
	  /**
	   * Set paddings
	   * @param value - number, array of 4 numbers or object with keys: top, right, bottom, left
	   * or: [top, right, bottom, left]
	   * or: [top&bottom, right&left]
	   * or: {
	   *  left: 10,
	   *  right: 10,
	   *  top: 10,
	   *  bottom: 10,
	   * }
	   */
	  set padding(value) {
	    if (typeof value === "number") {
	      this.paddingTop = value;
	      this.paddingRight = value;
	      this.paddingBottom = value;
	      this.paddingLeft = value;
	    }
	    if (Array.isArray(value)) {
	      this.paddingTop = value[0] ?? 0;
	      this.paddingRight = value[1] ?? value[0] ?? 0;
	      this.paddingBottom = value[2] ?? value[0] ?? 0;
	      this.paddingLeft = value[3] ?? value[1] ?? value[0] ?? 0;
	    } else if (typeof value === "object") {
	      this.paddingTop = value.top ?? 0;
	      this.paddingRight = value.right ?? 0;
	      this.paddingBottom = value.bottom ?? 0;
	      this.paddingLeft = value.left ?? 0;
	    }
	  }
	  // Return array of paddings [top, right, bottom, left]
	  get padding() {
	    return [this.paddingTop, this.paddingRight, this.paddingBottom, this.paddingLeft];
	  }
	  destroy(options) {
	    this.off("pointertap");
	    window.removeEventListener(pixi_js.isMobile.any ? "touchstart" : "click", this.handleActivationBinding);
	    super.destroy(options);
	  }
	  /**
	   * Sets width of a Input.
	   * If nineSliceSprite is set, then width will be set to nineSliceSprite.
	   * If nineSliceSprite is not set, then width will control components width as Container.
	   * @param width - Width value.
	   */
	  set width(width) {
	    if (this.options?.nineSliceSprite) {
	      if (this._bg) {
	        this._bg.width = width;
	      }
	      this.updateInputMaskSize();
	      this.align();
	    } else {
	      super.width = width;
	    }
	  }
	  /** Gets width of Input. */
	  get width() {
	    return super.width;
	  }
	  /**
	   * Sets height of a Input.
	   * If nineSliceSprite is set, then height will be set to nineSliceSprite.
	   * If nineSliceSprite is not set, then height will control components height as Container.
	   * @param height - Height value.
	   */
	  set height(height) {
	    if (this.options?.nineSliceSprite) {
	      if (this._bg) {
	        this._bg.height = height;
	      }
	      this.updateInputMaskSize();
	      this.align();
	    } else {
	      super.height = height;
	    }
	  }
	  /** Gets height of Input. */
	  get height() {
	    return super.height;
	  }
	  setSize(value, height) {
	    if (this.options?.nineSliceSprite) {
	      if (this._bg) {
	        this._bg.setSize(value, height);
	      }
	      this.updateInputMaskSize();
	      this.align();
	    } else {
	      super.setSize(value, height);
	    }
	  }
	  createInputMask(bg) {
	    if (this.inputMask) {
	      this.inputField.mask = null;
	      this._cursor.mask = null;
	      this.inputMask.destroy();
	    }
	    if (this.options?.nineSliceSprite && typeof bg === "string") {
	      this.inputMask = new pixi_js.NineSliceSprite({
	        texture: pixi_js.Texture.from(bg),
	        leftWidth: this.options.nineSliceSprite[0],
	        topHeight: this.options.nineSliceSprite[1],
	        rightWidth: this.options.nineSliceSprite[2],
	        bottomHeight: this.options.nineSliceSprite[3]
	      });
	    } else if (bg instanceof pixi_js.Sprite) {
	      this.inputMask = new pixi_js.Sprite(bg.texture);
	    } else if (bg instanceof pixi_js.Graphics) {
	      this.inputMask = bg.clone(true);
	    } else {
	      this.inputMask = getView(bg);
	    }
	    this.inputField.mask = this.inputMask;
	    this._cursor.mask = this.inputMask;
	    this.updateInputMaskSize();
	    this.addChildAt(this.inputMask, 0);
	  }
	  updateInputMaskSize() {
	    if (!this.inputMask || !this._bg) return;
	    this.inputMask.setSize(
	      this._bg.width - this.paddingLeft - this.paddingRight,
	      this._bg.height - this.paddingTop - this.paddingBottom
	    );
	    this.inputMask.position.set(this.paddingLeft, this.paddingTop);
	  }
	  onPaste(e) {
	    e.preventDefault();
	    const text = (e.clipboardData || window.clipboardData).getData("text");
	    if (!text) return;
	    this._add(text);
	  }
	}

	var __defProp$9 = Object.defineProperty;
	var __defNormalProp$9 = (obj, key, value) => key in obj ? __defProp$9(obj, key, { enumerable: true, configurable: true, writable: true, value }) : obj[key] = value;
	var __publicField$9 = (obj, key, value) => __defNormalProp$9(obj, typeof key !== "symbol" ? key + "" : key, value);
	class List extends pixi_js.Container {
	  constructor(options) {
	    super();
	    __publicField$9(this, "options");
	    /** Container, that holds all inner elements. */
	    __publicField$9(this, "view");
	    /** Arrange direction. */
	    __publicField$9(this, "_type");
	    /** Width of area to fit elements when arrange. (If not set parent width will be used). */
	    __publicField$9(this, "_maxWidth");
	    /** Returns all arranged elements. */
	    __publicField$9(this, "children", []);
	    if (options) {
	      if (options.maxWidth) {
	        this._maxWidth = options.maxWidth;
	      }
	      this.init(options);
	    }
	    options?.items?.forEach((item) => this.addChild(item));
	    this.on("added", () => this.arrangeChildren());
	    this.on("childAdded", () => this.arrangeChildren());
	  }
	  /**
	   * Initiates list component.
	   * @param options
	   */
	  init(options) {
	    this.options = options;
	    if (options?.type) {
	      this.type = options.type;
	    }
	    if (options?.children) {
	      options.children.forEach((child) => this.addChild(child));
	    }
	  }
	  /**
	   * Set items arrange direction.
	   * @param type - Arrange direction.
	   */
	  set type(type) {
	    this._type = type;
	    this.arrangeChildren();
	  }
	  /**
	   * Get items arrange direction.
	   * @returns Arrange direction.
	   */
	  get type() {
	    return this._type;
	  }
	  /**
	   * Set element margin.
	   * @param margin - Margin between elements.
	   */
	  set elementsMargin(margin) {
	    if (!this.options) throw new Error("List has not been initiated!");
	    this.options.elementsMargin = margin;
	    this.arrangeChildren();
	  }
	  /**
	   * Get element margin.
	   * @returns Margin between elements.
	   */
	  get elementsMargin() {
	    return this.options?.elementsMargin ?? 0;
	  }
	  /**
	   * Set padding, overriding all padding options.
	   * @param padding - Padding surrounding list elements and its border.
	   */
	  set padding(padding) {
	    if (!this.options) throw new Error("List has not been initiated!");
	    this.options.padding = padding;
	    this.options.vertPadding = padding;
	    this.options.horPadding = padding;
	    this.options.leftPadding = padding;
	    this.options.rightPadding = padding;
	    this.options.topPadding = padding;
	    this.options.bottomPadding = padding;
	    this.arrangeChildren();
	  }
	  /**
	   * Get padding.
	   * @returns Padding surrounding list elements and its border.
	   */
	  get padding() {
	    return this.options?.padding ?? 0;
	  }
	  /**
	   * Set vertical padding, overriding all top and bottom padding options.
	   * @param padding - Vertical padding between list border and its elements.
	   */
	  set vertPadding(padding) {
	    if (!this.options) throw new Error("List has not been initiated!");
	    this.options.vertPadding = padding;
	    this.options.topPadding = padding;
	    this.options.bottomPadding = padding;
	    this.arrangeChildren();
	  }
	  /**
	   * Get vertical padding.
	   * @returns Vertical padding between list border and its elements.
	   */
	  get vertPadding() {
	    return this.options?.vertPadding ?? this.padding ?? 0;
	  }
	  /**
	   * Set horizontal padding, overriding all left and right padding options.
	   * @param padding - Horizontal padding between list border and its elements.
	   */
	  set horPadding(padding) {
	    if (!this.options) throw new Error("List has not been initiated!");
	    this.options.horPadding = padding;
	    this.options.leftPadding = padding;
	    this.options.rightPadding = padding;
	    this.arrangeChildren();
	  }
	  /**
	   * Get horizontal padding.
	   * @returns Horizontal padding between list border and its elements.
	   */
	  get horPadding() {
	    return this.options?.horPadding ?? this.padding ?? 0;
	  }
	  /**
	   * Set left padding.
	   * @param padding - Left padding between list border and its elements.
	   */
	  set leftPadding(padding) {
	    if (!this.options) throw new Error("List has not been initiated!");
	    this.options.leftPadding = padding;
	    this.arrangeChildren();
	  }
	  /**
	   * Get left padding.
	   * @returns Left padding between list border and its elements.
	   */
	  get leftPadding() {
	    return this.options?.leftPadding ?? this.horPadding;
	  }
	  /**
	   * Set right padding.
	   * @param padding - Right padding between list border and its elements.
	   */
	  set rightPadding(padding) {
	    if (!this.options) throw new Error("List has not been initiated!");
	    this.options.rightPadding = padding;
	    this.arrangeChildren();
	  }
	  /**
	   * Get right padding.
	   * @returns Right padding between list border and its elements.
	   */
	  get rightPadding() {
	    return this.options?.rightPadding ?? this.horPadding;
	  }
	  /**
	   * Set top padding.
	   * @param padding - Top padding between list border and its elements.
	   */
	  set topPadding(padding) {
	    if (!this.options) throw new Error("List has not been initiated!");
	    this.options.topPadding = padding;
	    this.arrangeChildren();
	  }
	  /**
	   * Get top padding.
	   * @returns Top padding between list border and its elements.
	   */
	  get topPadding() {
	    return this.options?.topPadding ?? this.vertPadding;
	  }
	  /**
	   * Set bottom padding.
	   * @param padding - Bottom padding between list border and its elements.
	   */
	  set bottomPadding(padding) {
	    if (!this.options) throw new Error("List has not been initiated!");
	    this.options.bottomPadding = padding;
	    this.arrangeChildren();
	  }
	  /**
	   * Get bottom padding.
	   * @returns Bottom padding between list border and its elements.
	   */
	  get bottomPadding() {
	    return this.options?.bottomPadding ?? this.vertPadding;
	  }
	  /**
	   * Arrange all elements basing in their sizes and component options.
	   * Can be arranged vertically, horizontally or bidirectional.
	   */
	  arrangeChildren() {
	    let maxHeight = 0;
	    let x = this.leftPadding;
	    let y = this.topPadding;
	    const elementsMargin = this.options?.elementsMargin ?? 0;
	    let maxWidth = this.maxWidth ?? this.parent?.width;
	    if (this.rightPadding) {
	      maxWidth -= this.rightPadding;
	    }
	    this.children.forEach((child, id) => {
	      switch (this.type) {
	        case "vertical":
	          child.y = y;
	          child.x = x;
	          y += elementsMargin + child.height;
	          break;
	        case "horizontal":
	          child.x = x;
	          child.y = y;
	          x += elementsMargin + child.width;
	          break;
	        case "bidirectional":
	        default:
	          child.x = x;
	          child.y = y;
	          if (child.x + child.width > maxWidth && id > 0) {
	            y += elementsMargin + maxHeight;
	            x = this.leftPadding;
	            child.x = x;
	            child.y = y;
	            maxHeight = 0;
	          }
	          maxHeight = Math.max(maxHeight, child.height);
	          x += elementsMargin + child.width;
	          break;
	      }
	    });
	  }
	  /**
	   * Removes items from the list. (Does not destroy them)
	   * @param itemID - Item to remove (starting from 0).
	   */
	  removeItem(itemID) {
	    const child = this.children[itemID];
	    if (!child) {
	      return;
	    }
	    this.removeChild(child);
	    this.arrangeChildren();
	  }
	  /** Set width of area to fit elements when arrange. (If not set parent width will be used). */
	  set maxWidth(width) {
	    this._maxWidth = width;
	    this.arrangeChildren();
	  }
	  /** Get width of area to fit elements when arrange. (If not set parent width will be used). */
	  get maxWidth() {
	    return this._maxWidth;
	  }
	}

	var __defProp$8 = Object.defineProperty;
	var __defNormalProp$8 = (obj, key, value) => key in obj ? __defProp$8(obj, key, { enumerable: true, configurable: true, writable: true, value }) : obj[key] = value;
	var __publicField$8 = (obj, key, value) => __defNormalProp$8(obj, typeof key !== "symbol" ? key + "" : key, value);
	class MaskedFrame extends pixi_js.Container {
	  constructor(options) {
	    super();
	    /** Target container. */
	    __publicField$8(this, "target");
	    __publicField$8(this, "border", new pixi_js.Graphics());
	    __publicField$8(this, "_targetMask");
	    __publicField$8(this, "maskData");
	    __publicField$8(this, "borderWidth");
	    __publicField$8(this, "borderColor");
	    if (options?.target) {
	      this.init(options);
	    }
	  }
	  /**
	   * Initializes a component.
	   * @param root0
	   * @param root0.target - Container to apply a mask or a border.
	   * @param root0.mask - Mask.
	   * @param root0.borderWidth - Border width.
	   * @param root0.borderColor - Border color.
	   */
	  init({ target, mask, borderWidth, borderColor }) {
	    if (this.target) {
	      this.removeChild(this.target);
	    }
	    this.target = getView(target);
	    this.addChild(this.border, this.target);
	    if (mask) this.applyMask(mask);
	    if (borderWidth) this.setBorder(borderWidth, borderColor);
	  }
	  /**
	   * Applies a mask to a target container.
	   * @param mask
	   */
	  applyMask(mask) {
	    this.maskData = mask;
	    this._targetMask = getView(mask);
	    this.addChild(this._targetMask);
	    this.target.mask = this._targetMask;
	  }
	  /**
	   * Shows a border around the target Container, same shape as the mask.
	   * @param borderWidth
	   * @param borderColor
	   */
	  setBorder(borderWidth, borderColor) {
	    this.borderWidth = borderWidth;
	    this.borderColor = borderColor;
	    this.showBorder();
	    if (this.maskData) {
	      const borderMask = typeof this.maskData === "string" ? pixi_js.Sprite.from(this.maskData) : this.maskData.clone(true);
	      borderMask.width += borderWidth * 2;
	      borderMask.height += borderWidth * 2;
	      this.mask = borderMask;
	      this.addChild(borderMask);
	      this._targetMask.position.set(borderWidth);
	    }
	  }
	  /** Hides a border. */
	  showBorder() {
	    const width = this.borderWidth * 2;
	    this.border.clear().rect(0, 0, this.target.width + width, this.target.height + width).fill(this.borderColor);
	    this.target.x = this.borderWidth;
	    this.target.y = this.borderWidth;
	  }
	  /** Hides a border. */
	  hideBorder() {
	    this.border.clear();
	  }
	}

	var __defProp$7 = Object.defineProperty;
	var __defNormalProp$7 = (obj, key, value) => key in obj ? __defProp$7(obj, key, { enumerable: true, configurable: true, writable: true, value }) : obj[key] = value;
	var __publicField$7 = (obj, key, value) => __defNormalProp$7(obj, typeof key !== "symbol" ? key + "" : key, value);
	class RadioGroup extends pixi_js.Container {
	  constructor(options) {
	    super();
	    __publicField$7(this, "items", []);
	    /** {@link List}, that holds and control all inned checkboxes.  */
	    __publicField$7(this, "innerView");
	    /** Text value of the selected item. */
	    __publicField$7(this, "value");
	    /** ID of the selected item. */
	    __publicField$7(this, "selected");
	    /** Fires, when new item is selected. */
	    __publicField$7(this, "onChange");
	    __publicField$7(this, "options");
	    if (options) {
	      this.init(options);
	    }
	    this.onChange = new dist_2();
	  }
	  /**
	   * Initiates a group.
	   * @param options
	   */
	  init(options) {
	    this.options = options;
	    this.value = options.items[options.selectedItem || 0].labelText?.text;
	    this.selected = options.selectedItem ?? 0;
	    if (this.innerView) {
	      this.innerView.type = options.type;
	      this.innerView.elementsMargin = options.elementsMargin;
	    } else {
	      this.innerView = new List({
	        type: options.type,
	        elementsMargin: options.elementsMargin
	      });
	    }
	    this.addItems(options.items);
	    this.addChild(this.innerView);
	    this.selectItem(this.selected);
	  }
	  /**
	   * Add items to a group.
	   * @param {CheckBox[]} items - array of {@link CheckBox} instances.
	   */
	  addItems(items) {
	    items.forEach((checkBox, id) => {
	      checkBox.onChange.connect(() => this.selectItem(id));
	      this.items.push(checkBox);
	      this.innerView.addChild(checkBox);
	    });
	  }
	  /**
	   * Remove items from a group.
	   * @param ids
	   */
	  removeItems(ids) {
	    ids.forEach((id) => {
	      const item = this.items[id];
	      if (!item) return;
	      item.onChange.disconnectAll();
	      this.innerView.removeChild(item);
	      this.items.splice(id, 1);
	    });
	  }
	  /**
	   * Select item by ID.
	   * @param id
	   */
	  selectItem(id) {
	    this.items.forEach((item, key) => {
	      item.forceCheck(key === id);
	    });
	    if (this.selected !== id) {
	      this.onChange.emit(id, this.items[id].labelText?.text);
	    }
	    this.value = this.options.items[id].labelText?.text;
	    this.selected = id;
	  }
	}

	var __defProp$6 = Object.defineProperty;
	var __defNormalProp$6 = (obj, key, value) => key in obj ? __defProp$6(obj, key, { enumerable: true, configurable: true, writable: true, value }) : obj[key] = value;
	var __publicField$6 = (obj, key, value) => __defNormalProp$6(obj, typeof key !== "symbol" ? key + "" : key, value);
	class Spring {
	  constructor(options = {}) {
	    __publicField$6(this, "x");
	    __publicField$6(this, "ax");
	    __publicField$6(this, "dx");
	    __publicField$6(this, "tx");
	    __publicField$6(this, "_options");
	    this.x = 0;
	    this.ax = 0;
	    this.dx = 0;
	    this.tx = 0;
	    this._options = options;
	    this._options.max = options.max || 160;
	    this._options.damp = options.damp || 0.8;
	    this._options.springiness = options.springiness || 0.1;
	  }
	  update() {
	    this.ax = (this.tx - this.x) * this._options.springiness;
	    this.dx += this.ax;
	    this.dx *= this._options.damp;
	    if (this.dx < -this._options.max) this.dx = -this._options.max;
	    else if (this.dx > this._options.max) this.dx = this._options.max;
	    this.x += this.dx;
	  }
	  reset() {
	    this.x = 0;
	    this.ax = 0;
	    this.dx = 0;
	    this.tx = 0;
	  }
	  get max() {
	    return this._options.max;
	  }
	  set max(value) {
	    this._options.max = value;
	  }
	  get damp() {
	    return this._options.damp;
	  }
	  set damp(value) {
	    this._options.damp = value;
	  }
	  get springiness() {
	    return this._options.springiness;
	  }
	  set springiness(value) {
	    this._options.springiness = value;
	  }
	}

	var __defProp$5 = Object.defineProperty;
	var __defNormalProp$5 = (obj, key, value) => key in obj ? __defProp$5(obj, key, { enumerable: true, configurable: true, writable: true, value }) : obj[key] = value;
	var __publicField$5 = (obj, key, value) => __defNormalProp$5(obj, typeof key !== "symbol" ? key + "" : key, value);
	class ScrollSpring {
	  constructor() {
	    __publicField$5(this, "done");
	    __publicField$5(this, "to");
	    __publicField$5(this, "_spring");
	    __publicField$5(this, "_pos");
	    __publicField$5(this, "_speed");
	    __publicField$5(this, "_correctSpeed");
	    this._spring = new Spring();
	    this._pos = 0;
	    this.to = 0;
	  }
	  start(speed, pos, to) {
	    this._speed = speed;
	    this._pos = pos;
	    this.to = to;
	    this.done = false;
	    this._spring.x = this._pos;
	    this._spring.tx = this.to;
	    const diff = this.to - this._pos;
	    const toDirection = Math.abs(diff) / diff;
	    const currentDirection = Math.abs(this._speed) / this._speed;
	    if (toDirection !== currentDirection) {
	      this._correctSpeed = true;
	    } else {
	      this._correctSpeed = false;
	    }
	  }
	  update() {
	    if (this._correctSpeed) {
	      this._speed *= 0.6;
	      if (Math.abs(this._speed) < 2) {
	        this._correctSpeed = false;
	      }
	      this._pos += this._speed;
	      this._spring.x = this._pos;
	    } else {
	      const diff = this.to - this._pos;
	      if (Math.abs(diff) < 0.05) {
	        this._pos = this.to;
	        this.done = true;
	      } else {
	        this._spring.tx = this.to;
	        this._spring.update();
	        this._pos = this._spring.x;
	      }
	    }
	    return this._pos;
	  }
	  cancel() {
	  }
	}

	var __defProp$4 = Object.defineProperty;
	var __defNormalProp$4 = (obj, key, value) => key in obj ? __defProp$4(obj, key, { enumerable: true, configurable: true, writable: true, value }) : obj[key] = value;
	var __publicField$4 = (obj, key, value) => __defNormalProp$4(obj, typeof key !== "symbol" ? key + "" : key, value);
	class SlidingNumber {
	  constructor(options = {}) {
	    __publicField$4(this, "position", 0);
	    __publicField$4(this, "constrain", true);
	    __publicField$4(this, "min", 0);
	    // the window width of the drag
	    __publicField$4(this, "max", 0);
	    // the window width of the drag
	    __publicField$4(this, "maxSpeed", 400);
	    __publicField$4(this, "_ease");
	    __publicField$4(this, "_offset", 0);
	    __publicField$4(this, "_prev", 0);
	    __publicField$4(this, "_speed", 0);
	    __publicField$4(this, "_hasStopped");
	    __publicField$4(this, "_targetSpeed", 0);
	    __publicField$4(this, "_speedChecker", 0);
	    __publicField$4(this, "_grab", 0);
	    __publicField$4(this, "_activeEase");
	    this.constrain = options.constrain ?? true;
	    this.maxSpeed = options.maxSpeed ?? 400;
	    this._ease = options.ease ?? new ScrollSpring();
	  }
	  set value(n) {
	    this._speed = 0;
	    this.position = n;
	  }
	  get value() {
	    return this.position;
	  }
	  grab(offset) {
	    this._grab = offset;
	    this._offset = this.position - offset;
	    this._speedChecker = 0;
	    this._targetSpeed = this._speed = 0;
	    this._hasStopped = false;
	  }
	  hold(newPosition) {
	    this._speedChecker++;
	    this.position = newPosition + this._offset;
	    if (this._speedChecker > 1) {
	      this._targetSpeed = this.position - this._prev;
	    }
	    this._speed += (this._targetSpeed - this._speed) / 2;
	    if (this._speed > this.maxSpeed) this._speed = this.maxSpeed;
	    else if (this._speed < -this.maxSpeed) this._speed = -this.maxSpeed;
	    this._prev = this.position;
	    if (this.constrain) {
	      this._activeEase = null;
	      if (this.position > this.min) {
	        this.position -= (this.position - this.min) / 1.5;
	      } else if (this.position < this.max) {
	        this.position += (this.max - this.position) / 1.5;
	      }
	    }
	  }
	  slide(instant = false) {
	    if (this._hasStopped) return;
	    if (this.constrain) {
	      this._updateConstrain(instant);
	    } else {
	      this._updateDefault();
	    }
	  }
	  get moveAmount() {
	    return -(this.position - this._offset - this._grab);
	  }
	  _updateDefault() {
	    this._speed *= 0.9;
	    this.position += this._speed;
	    if ((this._speed < 0 ? this._speed * -1 : this._speed) < 0.01) {
	      this._hasStopped = true;
	    }
	  }
	  _updateConstrain(instant = false) {
	    const max = this.max;
	    if (instant) {
	      if (this.value > 0) {
	        this.value = 0;
	      }
	      if (this.value > 0) {
	        this.value = 0;
	      }
	      if (this.value < this.max) {
	        this.value = this.max;
	      }
	      if (this.value < this.max) {
	        this.value = this.max;
	      }
	    } else if (this.position > this.min || this.position < max || this._activeEase) {
	      if (!this._activeEase) {
	        this._activeEase = this._ease;
	        if (this.position > this.min) {
	          this._activeEase.start(this._speed, this.position, this.min);
	        } else {
	          this._activeEase.start(this._speed, this.position, max);
	        }
	      }
	      this.position = this._activeEase.update();
	      if (this._activeEase.done) {
	        this.position = this._activeEase.to;
	        this._speed = 0;
	        this._activeEase = null;
	      }
	    } else {
	      this._updateDefault();
	    }
	  }
	}

	var __defProp$3 = Object.defineProperty;
	var __defNormalProp$3 = (obj, key, value) => key in obj ? __defProp$3(obj, key, { enumerable: true, configurable: true, writable: true, value }) : obj[key] = value;
	var __publicField$3 = (obj, key, value) => __defNormalProp$3(obj, typeof key !== "symbol" ? key + "" : key, value);
	class Trackpad {
	  constructor(options) {
	    __publicField$3(this, "xAxis");
	    __publicField$3(this, "yAxis");
	    __publicField$3(this, "_isDown");
	    __publicField$3(this, "_globalPosition");
	    __publicField$3(this, "_frame");
	    __publicField$3(this, "_bounds");
	    __publicField$3(this, "_dirty");
	    __publicField$3(this, "disableEasing", false);
	    this.xAxis = new SlidingNumber({
	      ease: options.xEase,
	      maxSpeed: options.maxSpeed,
	      constrain: options.constrain
	    });
	    this.yAxis = new SlidingNumber({
	      ease: options.yEase,
	      maxSpeed: options.maxSpeed,
	      constrain: options.constrain
	    });
	    this.disableEasing = options.disableEasing ?? false;
	    this._frame = new pixi_js.Rectangle();
	    this._bounds = new pixi_js.Rectangle();
	    this._globalPosition = new pixi_js.Point();
	  }
	  pointerDown(pos) {
	    this._globalPosition = pos;
	    this.xAxis.grab(pos.x);
	    this.yAxis.grab(pos.y);
	    this._isDown = true;
	  }
	  pointerUp() {
	    this._isDown = false;
	  }
	  pointerMove(pos) {
	    this._globalPosition = pos;
	  }
	  update() {
	    if (this._dirty) {
	      this._dirty = false;
	      this.xAxis.min = this._bounds.left;
	      this.xAxis.min = this._bounds.right - this._frame.width;
	      this.xAxis.min = this._bounds.top;
	      this.xAxis.min = this._bounds.bottom - this._frame.height;
	    }
	    if (this._isDown) {
	      this.xAxis.hold(this._globalPosition.x);
	      this.yAxis.hold(this._globalPosition.y);
	    } else {
	      this.xAxis.slide(this.disableEasing);
	      this.yAxis.slide(this.disableEasing);
	    }
	  }
	  resize(w, h) {
	    this._frame.x = 0;
	    this._frame.width = w;
	    this._frame.y = 0;
	    this._frame.height = h;
	    this._dirty = true;
	  }
	  setBounds(minX, maxX, minY, maxY) {
	    this._bounds.x = minX;
	    this._bounds.width = maxX - minX;
	    this._bounds.y = minY;
	    this._bounds.height = maxY - minY;
	    this._dirty = true;
	  }
	  get x() {
	    return this.xAxis.value;
	  }
	  get y() {
	    return this.yAxis.value;
	  }
	}

	var __defProp$2 = Object.defineProperty;
	var __defNormalProp$2 = (obj, key, value) => key in obj ? __defProp$2(obj, key, { enumerable: true, configurable: true, writable: true, value }) : obj[key] = value;
	var __publicField$2 = (obj, key, value) => __defNormalProp$2(obj, typeof key !== "symbol" ? key + "" : key, value);
	class ScrollBox extends pixi_js.Container {
	  /**
	   * @param options
	   * @param {number} options.background - background color of the ScrollBox.
	   * @param {number} options.width - width of the ScrollBox.
	   * @param {number} options.height - height of the ScrollBox.
	   * @param {number} options.radius - radius of the ScrollBox and its masks corners.
	   * @param {number} options.elementsMargin - margin between elements.
	   * @param {number} options.vertPadding - vertical padding of the ScrollBox.
	   * @param {number} options.horPadding - horizontal padding of the ScrollBox.
	   * @param {number} options.padding - padding of the ScrollBox (same horizontal and vertical).
	   * @param {boolean} options.disableDynamicRendering - disables dynamic rendering of the ScrollBox,
	   * so even elements the are not visible will be rendered. Be careful with this options as it can impact performance.
	   * @param {boolean} [options.globalScroll=true] - if true, the ScrollBox will scroll even if the mouse is not over it.
	   * @param {boolean} [options.shiftScroll=false] - if true, the ScrollBox will only scroll horizontally if the shift key
	   * is pressed, and the type is set to 'horizontal'.
	   */
	  constructor(options) {
	    super();
	    __publicField$2(this, "background");
	    __publicField$2(this, "borderMask");
	    __publicField$2(this, "lastWidth");
	    __publicField$2(this, "lastHeight");
	    __publicField$2(this, "_width", 0);
	    __publicField$2(this, "_height", 0);
	    __publicField$2(this, "_dimensionChanged", false);
	    /**
	     * Arrange container, that holds all inner elements.
	     * Use this control inner arrange container size in case of bidirectional scroll type.
	     */
	    __publicField$2(this, "list");
	    __publicField$2(this, "_trackpad");
	    __publicField$2(this, "isDragging", 0);
	    __publicField$2(this, "interactiveStorage", []);
	    __publicField$2(this, "visibleItems", []);
	    __publicField$2(this, "pressedChild");
	    __publicField$2(this, "ticker", pixi_js.Ticker.shared);
	    __publicField$2(this, "options");
	    __publicField$2(this, "stopRenderHiddenItemsTimeout");
	    __publicField$2(this, "onMouseScrollBinding", this.onMouseScroll.bind(this));
	    __publicField$2(this, "dragStarTouchPoint");
	    __publicField$2(this, "isOver", false);
	    __publicField$2(this, "proximityRange");
	    __publicField$2(this, "proximityStatusCache", []);
	    __publicField$2(this, "lastScrollX");
	    __publicField$2(this, "lastScrollY");
	    __publicField$2(this, "proximityCheckFrameCounter", 0);
	    __publicField$2(this, "onProximityChange", new dist_2());
	    __publicField$2(this, "onScroll", new dist_2());
	    if (options) {
	      this.init(options);
	    }
	    this.ticker.add(this.update, this);
	  }
	  /**
	   * Initiates ScrollBox.
	   * @param options
	   * @param {number} options.background - background color of the ScrollBox.
	   * @param {number} options.width - width of the ScrollBox.
	   * @param {number} options.height - height of the ScrollBox.
	   * @param {number} options.radius - radius of the ScrollBox and its masks corners.
	   * @param {number} options.elementsMargin - margin between elements.
	   * @param {number} options.vertPadding - vertical padding of the ScrollBox.
	   * @param {number} options.horPadding - horizontal padding of the ScrollBox.
	   * @param {number} options.padding - padding of the ScrollBox (same horizontal and vertical).
	   * @param {boolean} options.disableDynamicRendering - disables dynamic rendering of the ScrollBox,
	   * so even elements the are not visible will be rendered. Be careful with this options as it can impact performance.
	   * @param {boolean} [options.globalScroll=true] - if true, the ScrollBox will scroll even if the mouse is not over it.
	   * @param {boolean} [options.shiftScroll=false] - if true, the ScrollBox will only scroll horizontally if the shift key
	   */
	  init(options) {
	    this.options = options;
	    this.setBackground(options.background);
	    this._width = options.width | this.background.width;
	    this._height = options.height | this.background.height;
	    this.proximityRange = options.proximityRange ?? 0;
	    if (!this.list) {
	      this.list = new List();
	      super.addChild(this.list);
	    }
	    this.list.init({
	      type: options.type,
	      elementsMargin: options.elementsMargin,
	      padding: options.padding,
	      vertPadding: options.vertPadding,
	      horPadding: options.horPadding,
	      topPadding: options.topPadding,
	      bottomPadding: options.bottomPadding,
	      leftPadding: options.leftPadding,
	      rightPadding: options.rightPadding
	    });
	    this.addItems(options.items);
	    if (this.hasBounds) {
	      this.addMask();
	      this.makeScrollable();
	    }
	    this._trackpad.xAxis.value = 0;
	    this._trackpad.yAxis.value = 0;
	    this.options.globalScroll = options.globalScroll ?? true;
	    this.options.shiftScroll = options.shiftScroll ?? false;
	    this.resize();
	  }
	  get hasBounds() {
	    return !!this._width || !!this._height;
	  }
	  /**
	   *  Adds array of items to a scrollable list.
	   * @param {Container[]} items - items to add.
	   */
	  addItems(items) {
	    if (!items?.length) return;
	    items.forEach((item) => this.addItem(item));
	  }
	  /** Remove all items from a scrollable list. */
	  removeItems() {
	    this.proximityStatusCache.length = 0;
	    this.list.removeChildren();
	  }
	  /**
	   * Adds one or more items to a scrollable list.
	   * @param {Container} items - one or more items to add.
	   */
	  addItem(...items) {
	    if (items.length > 1) {
	      items.forEach((item) => this.addItem(item));
	    } else {
	      const child = items[0];
	      if (!child.width || !child.height) {
	        console.error("ScrollBox item should have size");
	      }
	      child.eventMode = "static";
	      this.list.addChild(child);
	      this.proximityStatusCache.push(false);
	      if (!this.options.disableDynamicRendering) {
	        child.renderable = this.isItemVisible(child);
	      }
	    }
	    this.resize();
	    return items[0];
	  }
	  /**
	   * Removes an item from a scrollable list.
	   * @param {number} itemID - id of the item to remove.
	   */
	  removeItem(itemID) {
	    this.list.removeItem(itemID);
	    this.proximityStatusCache.splice(itemID, 1);
	    this.resize();
	  }
	  /**
	   * Checks if the item is visible or scrolled out of the visible part of the view.* Adds an item to a scrollable list.
	   * @param {Container} item - item to check.
	   * @param padding - proximity padding to consider the item visible.
	   */
	  isItemVisible(item, padding = 0) {
	    let isVisible = false;
	    const list = this.list;
	    if (this.isVertical || this.isBidirectional) {
	      const posY = item.y + list.y;
	      if (posY + item.height >= -padding && posY <= this.options.height + padding) {
	        isVisible = true;
	      }
	    }
	    if (this.isHorizontal || this.isBidirectional) {
	      const posX = item.x + list.x;
	      if (posX + item.width >= -padding && posX <= this.options.width + padding) {
	        isVisible = true;
	      }
	    }
	    return isVisible;
	  }
	  /**
	   * Returns all inner items in a list.
	   * @returns {Array<Container> | Array} - list of items.
	   */
	  get items() {
	    return this.list?.children ?? [];
	  }
	  /**
	   * Set ScrollBox background.
	   * @param {number | string} background - background color or texture.
	   */
	  setBackground(background) {
	    if (this.background) {
	      this.removeChild(this.background);
	    }
	    this.options.background = background;
	    this.background = new pixi_js.Graphics();
	    this.addChildAt(this.background, 0);
	    this.resize();
	  }
	  addMask() {
	    if (!this.borderMask) {
	      this.borderMask = new pixi_js.Graphics();
	      super.addChild(this.borderMask);
	      this.mask = this.borderMask;
	    }
	    this.resize();
	  }
	  makeScrollable() {
	    if (!this._trackpad) {
	      this._trackpad = new Trackpad({
	        disableEasing: this.options.disableEasing
	      });
	    }
	    this.on("pointerdown", (e) => {
	      this.renderAllItems();
	      this.isDragging = 1;
	      this.dragStarTouchPoint = this.worldTransform.applyInverse(e.global);
	      this._trackpad.pointerDown(this.dragStarTouchPoint);
	      const listTouchPoint = this.list.worldTransform.applyInverse(e.global);
	      this.visibleItems.forEach((item) => {
	        if (item.x < listTouchPoint.x && item.x + item.width > listTouchPoint.x && item.y < listTouchPoint.y && item.y + item.height > listTouchPoint.y) {
	          this.pressedChild = item;
	        }
	      });
	    });
	    this.on("pointerup", () => {
	      this.isDragging = 0;
	      this._trackpad.pointerUp();
	      this.restoreItemsInteractivity();
	      this.pressedChild = null;
	      this.stopRenderHiddenItems();
	    });
	    this.on("pointerover", () => {
	      this.isOver = true;
	    });
	    this.on("pointerout", () => {
	      this.isOver = false;
	    });
	    this.on("pointerupoutside", () => {
	      this.isDragging = 0;
	      this._trackpad.pointerUp();
	      this.restoreItemsInteractivity();
	      this.pressedChild = null;
	      this.stopRenderHiddenItems();
	    });
	    this.on("globalpointermove", (e) => {
	      if (!this.isDragging) return;
	      const touchPoint = this.worldTransform.applyInverse(e.global);
	      if (this.dragStarTouchPoint) {
	        const dragTrashHold = this.options.dragTrashHold ?? 10;
	        if (this.isHorizontal || this.isBidirectional) {
	          const xDist = touchPoint.x - this.dragStarTouchPoint.x;
	          if (Math.abs(xDist) > dragTrashHold) {
	            this.isDragging = 2;
	          }
	        }
	        if (this.isVertical || this.isBidirectional) {
	          const yDist = touchPoint.y - this.dragStarTouchPoint.y;
	          if (Math.abs(yDist) > dragTrashHold) {
	            this.isDragging = 2;
	          }
	        }
	      }
	      if (this.dragStarTouchPoint && this.isDragging !== 2) return;
	      this._trackpad.pointerMove(touchPoint);
	      if (this.pressedChild) {
	        this.revertClick(this.pressedChild);
	        this.pressedChild = null;
	      }
	      if (this.isBidirectional) {
	        this.onScroll?.emit({ x: this.scrollX, y: this.scrollY });
	      } else {
	        this.onScroll?.emit(this.isVertical ? this.scrollY : this.scrollX);
	      }
	    });
	    document.addEventListener("wheel", this.onMouseScrollBinding, true);
	  }
	  setInteractive(interactive) {
	    this.eventMode = interactive ? "static" : "auto";
	  }
	  get listHeight() {
	    return this.list.height + this.list.topPadding + this.list.bottomPadding;
	  }
	  get listWidth() {
	    return this.list.width + this.list.leftPadding + this.list.rightPadding;
	  }
	  /**
	   * Controls item positions and visibility.
	   * @param force
	   */
	  resize(force = false) {
	    if (!this.hasBounds) return;
	    this.renderAllItems();
	    if (this.borderMask && (force || this._dimensionChanged || this.lastWidth !== this.listWidth || this.lastHeight !== this.listHeight)) {
	      if (!this.options.width) {
	        this._width += this.listWidth;
	      }
	      if (!this.options.height) {
	        this._height += this.listHeight;
	      }
	      this.borderMask.clear().roundRect(0, 0, this._width, this._height, this.options.radius | 0).fill(16711935).stroke(0);
	      this.borderMask.eventMode = "none";
	      const color = this.options.background;
	      this.background.clear().roundRect(0, 0, this._width, this._height, this.options.radius | 0).fill({
	        color: color ?? 0,
	        alpha: color ? 1 : 1e-7
	        // if color is not set, set alpha to 0 to be able to drag by click on bg
	      });
	      if (this.isBidirectional) {
	        this.setInteractive(this.listWidth > this._width || this.listHeight > this._height);
	      } else if (this.isHorizontal) {
	        this.setInteractive(this.listWidth > this._width);
	      } else {
	        this.setInteractive(this.listHeight > this._height);
	      }
	      this.lastWidth = this.listWidth;
	      this.lastHeight = this.listHeight;
	    }
	    if (this._trackpad) {
	      const maxWidth = this.borderMask.width - this.list.width - this.list.leftPadding - this.list.rightPadding;
	      const maxHeight = this.borderMask.height - this.list.height - this.list.topPadding - this.list.bottomPadding;
	      if (this.isBidirectional) {
	        this._trackpad.yAxis.max = -Math.abs(maxHeight);
	        this._trackpad.xAxis.max = -Math.abs(maxWidth);
	      } else if (this.isVertical) {
	        this._trackpad.yAxis.max = -Math.abs(maxHeight);
	      } else if (this.isHorizontal) {
	        this._trackpad.xAxis.max = -Math.abs(maxWidth);
	      }
	    }
	    if (this._dimensionChanged) {
	      this.list.arrangeChildren();
	      this.stopRenderHiddenItems();
	      this._dimensionChanged = false;
	    } else {
	      if (force) this.list.arrangeChildren();
	      this.updateVisibleItems();
	    }
	    this.lastScrollX = null;
	    this.lastScrollY = null;
	  }
	  onMouseScroll(event) {
	    if (!this.isOver && !this.options.globalScroll) return;
	    this.renderAllItems();
	    const shiftScroll = !!this.options.shiftScroll;
	    const scrollOnX = shiftScroll ? typeof event.deltaX !== "undefined" || typeof event.deltaY !== "undefined" : typeof event.deltaX !== "undefined";
	    const scrollOnY = typeof event.deltaY !== "undefined";
	    if ((this.isHorizontal || this.isBidirectional) && scrollOnX) {
	      const delta = shiftScroll || this.isBidirectional ? event.deltaX : event.deltaY;
	      const targetPos = this.list.x - delta;
	      if (this.listWidth < this._width) {
	        this._trackpad.xAxis.value = 0;
	      } else {
	        const min = this._width - this.listWidth;
	        const max = 0;
	        this._trackpad.xAxis.value = Math.min(max, Math.max(min, targetPos));
	      }
	    }
	    if ((this.isVertical || this.isBidirectional) && scrollOnY) {
	      const targetPos = this.list.y - event.deltaY;
	      if (this.listHeight < this._height) {
	        this._trackpad.yAxis.value = 0;
	      } else {
	        const min = this._height - this.listHeight;
	        const max = 0;
	        this._trackpad.yAxis.value = Math.min(max, Math.max(min, targetPos));
	      }
	    }
	    if (this.isBidirectional && (scrollOnX || scrollOnY)) {
	      this.onScroll?.emit({ x: this._trackpad.xAxis.value, y: this._trackpad.yAxis.value });
	    } else if (this.isHorizontal && scrollOnX) {
	      this.onScroll?.emit(this._trackpad.xAxis.value);
	    } else if (this.isVertical && scrollOnY) {
	      this.onScroll?.emit(this._trackpad.yAxis.value);
	    }
	    this.stopRenderHiddenItems();
	  }
	  /** Makes it scroll down to the last element. */
	  scrollBottom() {
	    if (!this.interactive) {
	      this.scrollTop();
	    } else {
	      this.scrollTo(this.list.children.length - 1);
	    }
	  }
	  /** Makes it scroll up to the first element. */
	  scrollTop() {
	    this.renderAllItems();
	    this._trackpad.xAxis.value = 0;
	    this._trackpad.yAxis.value = 0;
	    this.stopRenderHiddenItems();
	  }
	  renderAllItems() {
	    clearTimeout(this.stopRenderHiddenItemsTimeout);
	    this.stopRenderHiddenItemsTimeout = null;
	    if (this.options.disableDynamicRendering) {
	      return;
	    }
	    this.items.forEach((child) => {
	      child.renderable = true;
	    });
	  }
	  stopRenderHiddenItems() {
	    if (this.options.disableDynamicRendering) {
	      return;
	    }
	    if (this.stopRenderHiddenItemsTimeout) {
	      clearTimeout(this.stopRenderHiddenItemsTimeout);
	      this.stopRenderHiddenItemsTimeout = null;
	    }
	    this.stopRenderHiddenItemsTimeout = setTimeout(() => this.updateVisibleItems(), 2e3);
	  }
	  updateVisibleItems() {
	    this.visibleItems.length = 0;
	    this.items.forEach((child) => {
	      child.renderable = this.isItemVisible(child);
	      this.visibleItems.push(child);
	    });
	  }
	  /**
	   * Scrolls to the element with the given ID.
	   * @param elementID
	   */
	  scrollTo(elementID) {
	    if (!this.interactive) {
	      return;
	    }
	    const target = this.list.children[elementID];
	    if (!target) {
	      return;
	    }
	    this.renderAllItems();
	    this._trackpad.xAxis.value = this.isHorizontal || this.isBidirectional ? this._width - target.x - target.width - this.list.rightPadding : 0;
	    this._trackpad.yAxis.value = this.isVertical || this.isBidirectional ? this._height - target.y - target.height - this.list.bottomPadding : 0;
	    this.stopRenderHiddenItems();
	  }
	  /**
	   * Scrolls to the given position.
	   * @param position - x and y position object.
	   * @param position.x - x position.
	   * @param position.y - y position.
	   */
	  scrollToPosition({ x, y }) {
	    if (x === void 0 && y === void 0) return;
	    this.renderAllItems();
	    if (x !== void 0) this.scrollX = -x;
	    if (y !== void 0) this.scrollY = -y;
	    this.stopRenderHiddenItems();
	  }
	  /** Gets component height. */
	  get height() {
	    return this._height;
	  }
	  set height(value) {
	    this._height = value;
	    this._dimensionChanged = true;
	    this.resize();
	    this.scrollTop();
	  }
	  /** Gets component width. */
	  get width() {
	    return this._width;
	  }
	  set width(value) {
	    this._width = value;
	    this._dimensionChanged = true;
	    this.resize();
	    this.scrollTop();
	  }
	  setSize(value, height) {
	    if (typeof value === "object") {
	      height = value.height ?? value.width;
	      value = value.width;
	    } else {
	      height = height ?? value;
	    }
	    this._width = value;
	    this._height = height;
	    this._dimensionChanged = true;
	    this.resize();
	    this.scrollTop();
	  }
	  getSize(out) {
	    out = out || { width: 0, height: 0 };
	    out.width = this._width;
	    out.height = this._height;
	    return out;
	  }
	  /** Gets the current raw scroll position on the x-axis (Negated Value). */
	  get scrollX() {
	    return this._trackpad.xAxis.value;
	  }
	  /** Sets the current raw scroll position on the x-axis (Negated Value). */
	  set scrollX(value) {
	    this._trackpad.xAxis.value = value;
	  }
	  /** Gets the current raw scroll position on the y-axis (Negated Value). */
	  get scrollY() {
	    return this._trackpad.yAxis.value;
	  }
	  /** Sets the current raw scroll position on the y-axis (Negated Value). */
	  set scrollY(value) {
	    this._trackpad.yAxis.value = value;
	  }
	  update() {
	    if (!this.list) return;
	    this._trackpad.update();
	    if (this.isHorizontal || this.isBidirectional) {
	      if (this.list.x !== this._trackpad.x) {
	        this.list.x = this._trackpad.x;
	      }
	    }
	    if (this.isVertical || this.isBidirectional) {
	      if (this.list.y !== this._trackpad.y) {
	        this.list.y = this._trackpad.y;
	      }
	    }
	    if (!this.options.disableProximityCheck && (this._trackpad.x !== this.lastScrollX || this._trackpad.y !== this.lastScrollY)) {
	      this.proximityCheckFrameCounter++;
	      if (this.proximityCheckFrameCounter >= (this.options.proximityDebounce ?? 10)) {
	        this.items.forEach((item, index) => {
	          const inRange = this.isItemVisible(item, this.proximityRange);
	          const wasInRange = this.proximityStatusCache[index];
	          if (inRange !== wasInRange) {
	            this.proximityStatusCache[index] = inRange;
	            this.onProximityChange.emit({ item, index, inRange });
	          }
	        });
	        this.lastScrollX = this._trackpad.x;
	        this.lastScrollY = this._trackpad.y;
	        this.proximityCheckFrameCounter = 0;
	      }
	    }
	  }
	  /**
	   * Destroys the component.
	   * @param {boolean | DestroyOptions} [options] - Options parameter.
	   * A boolean will act as if all options have been set to that value
	   */
	  destroy(options) {
	    this.ticker.remove(this.update, this);
	    document.removeEventListener("wheel", this.onMouseScrollBinding, true);
	    this.background.destroy();
	    this.list.destroy();
	    super.destroy(options);
	  }
	  restoreItemsInteractivity() {
	    this.interactiveStorage.forEach((element) => {
	      element.item.eventMode = element.eventMode;
	    });
	    this.interactiveStorage.length = 0;
	  }
	  revertClick(item) {
	    if (item.eventMode !== "auto") {
	      pixi_js.isMobile.any ? item.emit("pointerupoutside", null) : item.emit("mouseupoutside", null);
	      this.interactiveStorage.push({
	        item,
	        eventMode: item.eventMode
	      });
	      item.eventMode = "auto";
	    }
	    if (item instanceof pixi_js.Container && item.children) {
	      item.children.forEach((child) => this.revertClick(child));
	    }
	  }
	  get scrollHeight() {
	    return this.list.height;
	  }
	  get scrollWidth() {
	    return this.list.width;
	  }
	  get isVertical() {
	    const type = this.options.type ?? "vertical";
	    return type === "vertical";
	  }
	  get isHorizontal() {
	    return this.options.type === "horizontal";
	  }
	  get isBidirectional() {
	    return this.options.type === "bidirectional";
	  }
	}

	var __defProp$1 = Object.defineProperty;
	var __defNormalProp$1 = (obj, key, value) => key in obj ? __defProp$1(obj, key, { enumerable: true, configurable: true, writable: true, value }) : obj[key] = value;
	var __publicField$1 = (obj, key, value) => __defNormalProp$1(obj, typeof key !== "symbol" ? key + "" : key, value);
	const defaultVisibleItems = 5;
	class Select extends pixi_js.Container {
	  constructor(options) {
	    super();
	    __publicField$1(this, "view", new pixi_js.Container());
	    __publicField$1(this, "openButton");
	    __publicField$1(this, "closeButton");
	    __publicField$1(this, "openView");
	    __publicField$1(this, "scrollBox");
	    /** Selected value ID. */
	    __publicField$1(this, "value");
	    /** Fires when selected value is changed. */
	    __publicField$1(this, "onSelect");
	    this.addChild(this.view);
	    this.onSelect = new dist_2();
	    if (options) {
	      this.init(options);
	    }
	  }
	  /**
	   * Initiates Select.
	   * @param root0
	   * @param root0.closedBG
	   * @param root0.textStyle
	   * @param root0.items
	   * @param root0.openBG
	   * @param root0.selected
	   * @param root0.selectedTextOffset
	   * @param root0.scrollBox
	   * @param root0.visibleItems
	   * @param root0.TextClass
	   */
	  init({
	    closedBG,
	    textStyle,
	    TextClass,
	    items,
	    openBG,
	    selected,
	    selectedTextOffset,
	    scrollBox,
	    visibleItems
	  }) {
	    TextClass = TextClass ?? pixi_js.Text;
	    if (this.openView && this.openView !== openBG) {
	      this.view.removeChild(this.openView);
	    }
	    if (!this.openButton) {
	      this.openButton = new FancyButton({
	        defaultView: closedBG,
	        text: new TextClass({
	          text: items?.items ? items.items[0] : "",
	          style: textStyle
	        }),
	        textOffset: selectedTextOffset
	      });
	      this.openButton.onPress.connect(() => this.toggle());
	      this.addChild(this.openButton);
	    } else {
	      this.openButton.defaultView = getView(closedBG);
	      this.openButton.textView = new TextClass({
	        text: items?.items ? items.items[0] : "",
	        style: textStyle
	      });
	      this.openButton.textOffset = selectedTextOffset;
	    }
	    if (this.openView !== openBG) {
	      this.openView = getView(openBG);
	      this.view.visible = false;
	      this.view.addChild(this.openView);
	    }
	    if (!this.closeButton) {
	      this.closeButton = new FancyButton({
	        defaultView: new pixi_js.Graphics().rect(0, 0, this.openButton.width, this.openButton.height).fill({ color: 0, alpha: 1e-5 }),
	        text: new TextClass({
	          text: items?.items ? items.items[0] : "",
	          style: textStyle
	        }),
	        textOffset: selectedTextOffset
	      });
	      this.closeButton.onPress.connect(() => this.toggle());
	      this.view.addChild(this.closeButton);
	    } else {
	      this.closeButton.defaultView = new pixi_js.Graphics().rect(0, 0, this.openButton.width, this.openButton.height).fill({ color: 0, alpha: 1e-5 });
	      this.closeButton.textView = new TextClass({
	        text: items?.items ? items.items[0] : "",
	        style: textStyle
	      });
	      this.openButton.textOffset = selectedTextOffset;
	    }
	    if (!this.scrollBox) {
	      this.scrollBox = new ScrollBox();
	      this.view.addChild(this.scrollBox);
	    } else {
	      this.scrollBox.removeItems();
	    }
	    this.scrollBox.init({
	      type: "vertical",
	      elementsMargin: 0,
	      width: this.openButton.width,
	      height: this.openButton.height * (visibleItems ?? defaultVisibleItems),
	      radius: 0,
	      padding: 0,
	      ...scrollBox
	    });
	    this.scrollBox.y = this.openButton.height;
	    if (scrollBox?.offset) {
	      this.scrollBox.x = scrollBox.offset.x ?? 0;
	      this.scrollBox.y += scrollBox.offset.y ?? 0;
	    }
	    this.addItems(items, selected);
	  }
	  /**
	   * Adds items to the dropdown.
	   * @param items
	   * @param selected
	   */
	  addItems(items, selected = 0) {
	    this.convertItemsToButtons(items).forEach((button, id) => {
	      const text = button.text;
	      if (id === selected) {
	        this.openButton.text = text;
	        this.closeButton.text = text;
	      }
	      button.onPress.connect(() => {
	        this.value = id;
	        this.onSelect.emit(id, text);
	        this.openButton.text = text;
	        this.closeButton.text = text;
	        this.close();
	      });
	      this.scrollBox.addItem(button);
	    });
	  }
	  /**
	   * Remove items from the dropdown.
	   * @param itemID - Item to remove (starting from 0).
	   */
	  removeItem(itemID) {
	    this.scrollBox.removeItem(itemID);
	  }
	  /** Toggle the select state (open if closed, closes - id open). */
	  toggle() {
	    this.view.visible = !this.view.visible;
	    this.openButton.visible = !this.openButton.visible;
	  }
	  /** Show dropdown. */
	  open() {
	    this.view.visible = true;
	    this.openButton.visible = false;
	  }
	  /** Hide dropdown. */
	  close() {
	    this.view.visible = false;
	    this.openButton.visible = true;
	  }
	  convertItemsToButtons({
	    items,
	    backgroundColor,
	    hoverColor,
	    width,
	    height,
	    textStyle,
	    TextClass,
	    radius
	  }) {
	    TextClass = TextClass ?? pixi_js.Text;
	    const buttons = [];
	    items.forEach((item) => {
	      const defaultView = new pixi_js.Graphics().roundRect(0, 0, width, height, radius).fill(backgroundColor);
	      const color = hoverColor ?? backgroundColor;
	      const hoverView = new pixi_js.Graphics().roundRect(0, 0, width, height, radius).fill(color);
	      const text = new TextClass({ text: item, style: textStyle });
	      const button = new FancyButton({ defaultView, hoverView, text });
	      buttons.push(button);
	    });
	    return buttons;
	  }
	}

	var __defProp = Object.defineProperty;
	var __defNormalProp = (obj, key, value) => key in obj ? __defProp(obj, key, { enumerable: true, configurable: true, writable: true, value }) : obj[key] = value;
	var __publicField = (obj, key, value) => __defNormalProp(obj, typeof key !== "symbol" ? key + "" : key, value);
	class Slider extends SliderBase {
	  constructor(options) {
	    super({
	      slider1: options.slider,
	      value1: options.value,
	      ...options
	    });
	    __publicField(this, "sliderOptions");
	    /** Fires when value is changing, on every move of slider. */
	    __publicField(this, "onUpdate", new dist_2());
	    /** Fires when value changed, only when slider is released. */
	    __publicField(this, "onChange", new dist_2());
	    this.sliderOptions = options;
	    this.step = options.step || 1;
	    this.value = options.value ?? this.min;
	    this.updateSlider();
	  }
	  /** Return selected value. */
	  get value() {
	    return this._value1;
	  }
	  /** Set selected value. */
	  set value(value) {
	    if (value === this._value1) return;
	    if (value < this.min) value = this.min;
	    if (value > this.max) value = this.max;
	    this._value1 = value;
	    this.updateSlider();
	    this.onUpdate?.emit(this.value);
	  }
	  set max(value) {
	    super.max = value;
	    this.updateSlider();
	  }
	  get max() {
	    return super.max;
	  }
	  set min(value) {
	    super.min = value;
	    this.updateSlider();
	  }
	  get min() {
	    return super.min;
	  }
	  set step(value) {
	    super.step = value;
	    this.updateSlider();
	  }
	  get step() {
	    return super.step;
	  }
	  /** Set slider instance ot texture. */
	  // eslint-disable-next-line accessor-pairs
	  set slider(value) {
	    this.slider1 = value;
	    this.updateSlider();
	  }
	  update(event) {
	    super.update(event);
	    if (!this.dragging) return;
	    const obj = event.currentTarget;
	    const { x } = obj.parent.worldTransform.applyInverse(event.global);
	    const positionRatio = x / (this.bg?.width || 1);
	    const rawValue = this.min + positionRatio * (this.max - this.min);
	    this.value = Math.round(rawValue / this.step) * this.step;
	  }
	  change() {
	    this.onChange?.emit(this.value);
	  }
	  updateSlider() {
	    this.progress = ((this.value ?? this.min) - this.min) / (this.max - this.min) * 100;
	    this._slider1.x = this.bg?.width / 100 * this.progress - this._slider1.width / 2;
	    this._slider1.y = this.bg?.height / 2;
	    if (this.sliderOptions?.showValue) {
	      this.value1Text.text = `${Math.round(this.value)}`;
	      const sliderPosX = this._slider1.x + this._slider1.width / 2;
	      const sliderPosY = this._slider1.y;
	      this.value1Text.x = sliderPosX + (this.sliderOptions.valueTextOffset?.x ?? 0);
	      this.value1Text.y = sliderPosY + (this.sliderOptions.valueTextOffset?.y ?? 0);
	    }
	  }
	  /**
	   * Sets width of a Sliders background and fill.
	   * If nineSliceSprite is set, then width will be set to nineSliceSprite.
	   * If nineSliceSprite is not set, then width will control components width as Container.
	   * @param value - Width value.
	   */
	  set width(value) {
	    super.width = value;
	    this.updateSlider();
	  }
	  /** Gets width of a Slider. */
	  get width() {
	    return super.width;
	  }
	  /**
	   * Sets height of a Sliders background and fill.
	   * If nineSliceSprite is set, then height will be set to nineSliceSprite.
	   * If nineSliceSprite is not set, then height will control components height as Container.
	   * @param value - Height value.
	   */
	  set height(value) {
	    super.height = value;
	    this.updateSlider();
	  }
	  /** Gets height of a Slider. */
	  get height() {
	    return super.height;
	  }
	  setSize(value, height) {
	    super.setSize(value, height);
	    this.updateSlider();
	  }
	}

	exports.Button = Button;
	exports.ButtonContainer = ButtonContainer;
	exports.CheckBox = CheckBox;
	exports.CircularProgressBar = CircularProgressBar;
	exports.DoubleSlider = DoubleSlider;
	exports.FancyButton = FancyButton;
	exports.Input = Input;
	exports.List = List;
	exports.MaskedFrame = MaskedFrame;
	exports.ProgressBar = ProgressBar;
	exports.RadioGroup = RadioGroup;
	exports.ScrollBox = ScrollBox;
	exports.Select = Select;
	exports.Slider = Slider;
	exports.Switcher = Switcher;

	return exports;

})({}, PIXI);
