/**
 * Mock for rettime - a typed event emitter library.
 * rettime is a pure ESM package that Jest (CJS) cannot load directly.
 * This mock provides a minimal implementation of the Emitter class
 * that MSW uses internally.
 */

class TypedEvent extends MessageEvent {
  constructor(type, init) {
    super(type, init || { data: undefined });
    this._defaultPrevented = false;
    this._propagationStopped = false;
  }

  get defaultPrevented() {
    return this._defaultPrevented;
  }

  preventDefault() {
    this._defaultPrevented = true;
  }

  stopImmediatePropagation() {
    this._propagationStopped = true;
  }
}

class Emitter {
  constructor() {
    this._listeners = {};
    this.hooks = {
      on: () => {},
      removeListener: () => {}
    };
  }

  on(type, listener, options) {
    if (!this._listeners[type]) {
      this._listeners[type] = [];
    }
    this._listeners[type].push({ listener, options });
    return this;
  }

  once(type, listener, options) {
    const wrappedListener = (event) => {
      this.removeListener(type, wrappedListener);
      return listener(event);
    };
    return this.on(type, wrappedListener, { ...options, once: true });
  }

  earlyOn(type, listener, options) {
    if (!this._listeners[type]) {
      this._listeners[type] = [];
    }
    this._listeners[type].unshift({ listener, options });
    return this;
  }

  earlyOnce(type, listener, options) {
    const wrappedListener = (event) => {
      this.removeListener(type, wrappedListener);
      return listener(event);
    };
    return this.earlyOn(type, wrappedListener, { ...options, once: true });
  }

  emit(event) {
    const listeners = this._listeners[event.type] || [];
    for (const { listener } of listeners) {
      listener(event);
    }
    return listeners.length > 0;
  }

  emitAsPromise(event) {
    const listeners = this._listeners[event.type] || [];
    return Promise.all(listeners.map(({ listener }) => listener(event)));
  }

  removeListener(type, listener) {
    if (this._listeners[type]) {
      this._listeners[type] = this._listeners[type].filter(
        (l) => l.listener !== listener
      );
    }
  }

  removeAllListeners(type) {
    if (type) {
      delete this._listeners[type];
    } else {
      this._listeners = {};
    }
  }

  listeners(type) {
    if (type) {
      return (this._listeners[type] || []).map((l) => l.listener);
    }
    return Object.values(this._listeners)
      .flat()
      .map((l) => l.listener);
  }

  listenerCount(type) {
    if (type) {
      return (this._listeners[type] || []).length;
    }
    return Object.values(this._listeners).reduce(
      (count, arr) => count + arr.length,
      0
    );
  }
}

module.exports = { Emitter, TypedEvent };
