import { PureComponent, createContext, createElement } from "react";

const contexts = {};

export function stateful(render) {
  class StatefulComponent extends PureComponent {
    didMountHandlers = [];

    useHook = (type, inputs = []) => {
      const { hookContext } = this;
      const { index, hooks } = hookContext;
      // create new hook if not any
      let hook = hooks[index];
      // reset hook if inputs changed
      if (!hook || !arrayEqual(hook.inputs, inputs)) {
        hooks[index] = hook = {
          type,
          inputs,
          index: hooks.length
        };
      }
      if (type !== hook.type) {
        throw new Error("Invalid hook usage");
      }
      hookContext.index++;
      return hook;
    };

    hookContext = {
      hooks: [],
      index: 0,

      reducer: (reducer, initialState, onChange) => {
        let [state, setState] = this.hookContext.state(initialState, onChange);

        function dispatch(...args) {
          const nextState = reducer(state, ...args);
          if (nextState !== state) {
            setState((state = nextState));
          }
        }

        return [state, dispatch];
      },

      store: (options, inputs = []) => {
        const { initialState, onChange } = options;

        const hook = this.useHook("store", inputs);

        if (!hook.value) {
          if (typeof options === "function") {
            options = { reducer: options };
          }

          const set = new WeakSet();
          const reducer = [];
          const middleware = [];
          let initialized = false;
          let state = initialState;

          const store = {
            ...state,
            getState: () => state,
            reducer: (...values) => {
              let added = false;
              values.forEach(r => {
                if (set.has(r)) {
                  return;
                }

                set.add(r);
                reducer.push(r);
                added = true;
              });
              added && store.dispatch({ type: "@@init" });
            },
            middleware: (...values) => {
              values.forEach(r => {
                if (set.has(r)) {
                  return;
                }

                set.add(r);
                middleware.push(r(store));
              });
            },
            dispatch: action => {
              if (typeof action === "function") {
                return action(store.dispatch, store.getState);
              }
              middleware.reduce(
                (next, mw) => action => mw(next)(action),
                action => {
                  const nextState = reducer.reduce((state, reducer) => {
                    if (typeof reducer === "function") {
                      return reducer(state, action);
                    }
                    const keys = Object.keys(reducer);
                    const prevState = state;
                    for (const key of keys) {
                      const prevValue = state[key];
                      const nextValue = reducer[key](prevValue, action);
                      if (prevValue !== nextValue) {
                        if (prevState === state) {
                          state = { ...prevState };
                        }
                        state[key] = nextValue;
                      }
                    }
                    return state;
                  }, state);
                  if (nextState !== state) {
                    state = nextState;
                    // should renew hook value to make sure context updated
                    hook.value = Object.assign({}, store, state);
                    onChange && onChange(state);
                    if (initialized) {
                      this.forceUpdate();
                    } else {
                      this.onMount(() => this.forceUpdate());
                    }
                  }
                }
              )(action);
            }
          };

          // reducer if any
          if (options.reducer) {
            store.reducer(
              ...(Array.isArray(options.reducer)
                ? options.reducer
                : [options.reducer])
            );
          }

          // add middleware if any
          if (options.middleware) {
            store.middleware(
              ...(Array.isArray(options.middleware)
                ? options.middleware
                : [options.middleware])
            );
          }
          hook.value = store;
          initialized = true;
        }
        return hook.value;
      },

      ref: () => {
        const hook = this.useHook("ref");
        if (!hook.setter) {
          hook.setter = value => (hook.setter.current = value);
        }
        return hook.setter;
      },

      state: (defaultValue, onChange) => {
        const hook = this.useHook("state");
        if (!hook.setter) {
          hook.value = defaultValue;
          hook.setter = nextValue => {
            if (nextValue === hook.value) return;
            hook.value = nextValue;
            onChange && onChange(hook.value);
            // perform forceUpdate instead of setState({}) because it works faster
            this.forceUpdate();
          };
        }

        return [hook.value, hook.setter];
      },

      use: (hook, ...args) => hook(this.hookContext, ...args),

      effect: (factory, inputs) => {
        const hook = this.useHook("effect", inputs);
        if (!hook.binded) {
          hook.binded = true;
          this.onMount(() => {
            hook.dispose && hook.dispose();
            hook.dispose = factory(...inputs);
          });
        }
      },

      memo: (factory, inputs) => {
        const hook = this.useHook("memo", inputs);
        if (!hook.binded) {
          hook.binded = true;
          hook.value = factory();
        }
        return hook.value;
      },

      context: (...args) => {
        let contextName = "default";
        if (typeof args[0] === "string") {
          contextName = args.shift();
        }
        const context =
          contexts[contextName] || (contexts[contextName] = createContext());

        // is consumer
        if (typeof args[0] === "function") {
          return createElement(context.Consumer, {}, args[0]);
        }
        return createElement(context.Provider, {
          value: args[0],
          children: args[1]
        });
      }
    };

    onMount = handler => {
      if (this.mount) {
        handler();
      } else {
        this.didMountHandlers.push(handler);
      }
    };

    componentDidMount() {
      this.mount = true;
      this.didMountHandlers.forEach(handler => handler());
      this.didMountHandlers.length = 0;
    }

    componentWillUnmount() {
      this.mount = false;
      this.hookContext.hooks.forEach(hook => {
        hook.type === "effect" && hook.dispose && hook.dispose();
      });
    }

    render() {
      const { props, hookContext } = this;
      // reset hook index
      hookContext.index = 0;
      return render(props, hookContext);
    }
  }

  StatefulComponent.displayName = render.displayName || render.name;

  return StatefulComponent;
}

function arrayEqual(a, b) {
  return a.every((value, index) => b[index] === value);
}
