import { PureComponent, createContext, createElement } from "react";

const contexts = {};

export function stateful(render) {
  class StatefulComponent extends PureComponent {
    didMountHandlers = [];

    useHook = type => {
      const { hookContext } = this;
      const { index, hooks } = hookContext;
      // create new hook if not any
      const hook =
        hooks[index] ||
        (hooks[index] = {
          type,
          index: hooks.length
        });
      if (type !== hook.type) {
        throw new Error("Invalid hook usage");
      }
      hookContext.index++;
      return hook;
    };

    memoize = (hook, factory, inputs = []) => {
      if (
        !hook.inputs ||
        hook.inputs.some((input, index) => input !== inputs[index])
      ) {
        hook.value = factory(...inputs);
        hook.inputs = inputs;
      }
      return hook.value;
    };

    hookContext = {
      hooks: [],
      index: 0,

      reducer: (reducer, initialState) => {
        const [state, setState] = this.hookContext.state(initialState);

        function dispatch(...args) {
          setState(reducer(state, ...args));
        }

        return [state, dispatch];
      },

      ref: () => {
        const hook = this.useHook("ref");
        if (!hook.setter) {
          hook.setter = value => (hook.setter.current = value);
        }
        return hook.setter;
      },

      state: defaultValue => {
        const hook = this.useHook("state");
        if (!hook.setter) {
          hook.value = defaultValue;
          hook.setter = nextValue => {
            if (nextValue === hook.value) return;
            hook.value = nextValue;
            this.forceUpdate();
          };
        }

        return [hook.value, hook.setter];
      },

      use: (hook, ...args) => hook(this.hookContext, ...args),

      effect: (factory, inputs) => {
        const hook = this.useHook("effect");
        return this.memoize(
          hook,
          (...args) =>
            this.onMount(() => {
              hook.dispose && hook.dispose();
              hook.dispose = factory(...args);
            }),
          inputs
        );
      },

      memo: (factory, inputs) => {
        const hook = this.useHook("memo");
        return this.memoize(hook, factory, inputs);
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
