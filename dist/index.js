"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.stateful = stateful;

var _react = require("react");

function _typeof(obj) { if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

function _toConsumableArray(arr) { return _arrayWithoutHoles(arr) || _iterableToArray(arr) || _nonIterableSpread(); }

function _nonIterableSpread() { throw new TypeError("Invalid attempt to spread non-iterable instance"); }

function _iterableToArray(iter) { if (Symbol.iterator in Object(iter) || Object.prototype.toString.call(iter) === "[object Arguments]") return Array.from(iter); }

function _arrayWithoutHoles(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = new Array(arr.length); i < arr.length; i++) { arr2[i] = arr[i]; } return arr2; } }

function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i] != null ? arguments[i] : {}; var ownKeys = Object.keys(source); if (typeof Object.getOwnPropertySymbols === 'function') { ownKeys = ownKeys.concat(Object.getOwnPropertySymbols(source).filter(function (sym) { return Object.getOwnPropertyDescriptor(source, sym).enumerable; })); } ownKeys.forEach(function (key) { _defineProperty(target, key, source[key]); }); } return target; }

function _slicedToArray(arr, i) { return _arrayWithHoles(arr) || _iterableToArrayLimit(arr, i) || _nonIterableRest(); }

function _nonIterableRest() { throw new TypeError("Invalid attempt to destructure non-iterable instance"); }

function _iterableToArrayLimit(arr, i) { var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"] != null) _i["return"](); } finally { if (_d) throw _e; } } return _arr; }

function _arrayWithHoles(arr) { if (Array.isArray(arr)) return arr; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

function _possibleConstructorReturn(self, call) { if (call && (_typeof(call) === "object" || typeof call === "function")) { return call; } return _assertThisInitialized(self); }

function _getPrototypeOf(o) { _getPrototypeOf = Object.setPrototypeOf ? Object.getPrototypeOf : function _getPrototypeOf(o) { return o.__proto__ || Object.getPrototypeOf(o); }; return _getPrototypeOf(o); }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function"); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, writable: true, configurable: true } }); if (superClass) _setPrototypeOf(subClass, superClass); }

function _setPrototypeOf(o, p) { _setPrototypeOf = Object.setPrototypeOf || function _setPrototypeOf(o, p) { o.__proto__ = p; return o; }; return _setPrototypeOf(o, p); }

function _assertThisInitialized(self) { if (self === void 0) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return self; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

var contexts = {};

function stateful(_render) {
  var StatefulComponent =
  /*#__PURE__*/
  function (_PureComponent) {
    _inherits(StatefulComponent, _PureComponent);

    function StatefulComponent() {
      var _getPrototypeOf2;

      var _this;

      _classCallCheck(this, StatefulComponent);

      for (var _len = arguments.length, _args = new Array(_len), _key = 0; _key < _len; _key++) {
        _args[_key] = arguments[_key];
      }

      _this = _possibleConstructorReturn(this, (_getPrototypeOf2 = _getPrototypeOf(StatefulComponent)).call.apply(_getPrototypeOf2, [this].concat(_args)));

      _defineProperty(_assertThisInitialized(_assertThisInitialized(_this)), "didMountHandlers", []);

      _defineProperty(_assertThisInitialized(_assertThisInitialized(_this)), "useHook", function (type) {
        var inputs = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : [];

        var _assertThisInitialize = _assertThisInitialized(_assertThisInitialized(_this)),
            hookContext = _assertThisInitialize.hookContext;

        var index = hookContext.index,
            hooks = hookContext.hooks; // create new hook if not any

        var hook = hooks[index]; // reset hook if inputs changed

        if (!hook || !arrayEqual(hook.inputs, inputs)) {
          hooks[index] = hook = {
            type: type,
            inputs: inputs,
            index: hooks.length
          };
        }

        if (type !== hook.type) {
          throw new Error("Invalid hook usage");
        }

        hookContext.index++;
        return hook;
      });

      _defineProperty(_assertThisInitialized(_assertThisInitialized(_this)), "hookContext", {
        hooks: [],
        index: 0,
        reducer: function reducer(_reducer, initialState, onChange) {
          var _this$hookContext$sta = _this.hookContext.state(initialState, onChange),
              _this$hookContext$sta2 = _slicedToArray(_this$hookContext$sta, 2),
              state = _this$hookContext$sta2[0],
              setState = _this$hookContext$sta2[1];

          function dispatch() {
            for (var _len2 = arguments.length, args = new Array(_len2), _key2 = 0; _key2 < _len2; _key2++) {
              args[_key2] = arguments[_key2];
            }

            var nextState = _reducer.apply(void 0, [state].concat(args));

            if (nextState !== state) {
              setState(state = nextState);
            }
          }

          return [state, dispatch];
        },
        store: function store(options) {
          var inputs = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : [];
          var _options = options,
              initialState = _options.initialState,
              onChange = _options.onChange;

          var hook = _this.useHook("store", inputs);

          if (!hook.value) {
            if (typeof options === "function") {
              options = {
                reducer: options
              };
            }

            var set = new WeakSet();
            var _reducer2 = [];
            var _middleware = [];
            var initialized = false;
            var state = initialState;

            var store = _objectSpread({}, state, {
              getState: function getState() {
                return state;
              },
              reducer: function reducer() {
                var added = false;

                for (var _len3 = arguments.length, values = new Array(_len3), _key3 = 0; _key3 < _len3; _key3++) {
                  values[_key3] = arguments[_key3];
                }

                values.forEach(function (r) {
                  if (set.has(r)) {
                    return;
                  }

                  set.add(r);

                  _reducer2.push(r);

                  added = true;
                });
                added && store.dispatch({
                  type: "@@init"
                });
              },
              middleware: function middleware() {
                for (var _len4 = arguments.length, values = new Array(_len4), _key4 = 0; _key4 < _len4; _key4++) {
                  values[_key4] = arguments[_key4];
                }

                values.forEach(function (r) {
                  if (set.has(r)) {
                    return;
                  }

                  set.add(r);

                  _middleware.push(r(store));
                });
              },
              dispatch: function dispatch(action) {
                if (typeof action === "function") {
                  return action(store.dispatch, store.getState);
                }

                _middleware.reduce(function (next, mw) {
                  return function (action) {
                    return mw(next)(action);
                  };
                }, function (action) {
                  var nextState = _reducer2.reduce(function (state, reducer) {
                    if (typeof reducer === "function") {
                      return reducer(state, action);
                    }

                    var keys = Object.keys(reducer);
                    var prevState = state;

                    for (var _i2 = 0; _i2 < keys.length; _i2++) {
                      var key = keys[_i2];
                      var prevValue = state[key];
                      var nextValue = reducer[key](prevValue, action);

                      if (prevValue !== nextValue) {
                        if (prevState === state) {
                          state = _objectSpread({}, prevState);
                        }

                        state[key] = nextValue;
                      }
                    }

                    return state;
                  }, state);

                  if (nextState !== state) {
                    state = nextState; // should renew hook value to make sure context updated

                    hook.value = Object.assign({}, store, state);
                    onChange && onChange(state);

                    if (initialized) {
                      _this.forceUpdate();
                    } else {
                      _this.onMount(function () {
                        return _this.forceUpdate();
                      });
                    }
                  }
                })(action);
              }
            }); // reducer if any


            if (options.reducer) {
              store.reducer.apply(store, _toConsumableArray(Array.isArray(options.reducer) ? options.reducer : [options.reducer]));
            } // add middleware if any


            if (options.middleware) {
              store.middleware.apply(store, _toConsumableArray(Array.isArray(options.middleware) ? options.middleware : [options.middleware]));
            }

            hook.value = store;
            initialized = true;
          }

          return hook.value;
        },
        ref: function ref() {
          var hook = _this.useHook("ref");

          if (!hook.setter) {
            hook.setter = function (value) {
              return hook.setter.current = value;
            };
          }

          return hook.setter;
        },
        state: function state(defaultValue, onChange) {
          var hook = _this.useHook("state");

          if (!hook.setter) {
            hook.value = defaultValue;

            hook.setter = function (nextValue) {
              if (nextValue === hook.value) return;
              hook.value = nextValue;
              onChange && onChange(hook.value); // perform forceUpdate instead of setState({}) because it works faster

              _this.forceUpdate();
            };
          }

          return [hook.value, hook.setter];
        },
        use: function use(hook) {
          for (var _len5 = arguments.length, args = new Array(_len5 > 1 ? _len5 - 1 : 0), _key5 = 1; _key5 < _len5; _key5++) {
            args[_key5 - 1] = arguments[_key5];
          }

          return hook.apply(void 0, [_this.hookContext].concat(args));
        },
        effect: function effect(factory, inputs) {
          var hook = _this.useHook("effect", inputs);

          if (!hook.binded) {
            hook.binded = true;

            _this.onMount(function () {
              hook.dispose && hook.dispose();
              hook.dispose = factory.apply(void 0, _toConsumableArray(inputs));
            });
          }
        },
        memo: function memo(factory, inputs) {
          var hook = _this.useHook("memo", inputs);

          if (!hook.binded) {
            hook.binded = true;
            hook.value = factory();
          }

          return hook.value;
        },
        context: function context() {
          var contextName = "default";

          for (var _len6 = arguments.length, args = new Array(_len6), _key6 = 0; _key6 < _len6; _key6++) {
            args[_key6] = arguments[_key6];
          }

          if (typeof args[0] === "string") {
            contextName = args.shift();
          }

          var context = contexts[contextName] || (contexts[contextName] = (0, _react.createContext)()); // is consumer

          if (typeof args[0] === "function") {
            return (0, _react.createElement)(context.Consumer, {}, args[0]);
          }

          return (0, _react.createElement)(context.Provider, {
            value: args[0],
            children: args[1]
          });
        }
      });

      _defineProperty(_assertThisInitialized(_assertThisInitialized(_this)), "onMount", function (handler) {
        if (_this.mount) {
          handler();
        } else {
          _this.didMountHandlers.push(handler);
        }
      });

      return _this;
    }

    _createClass(StatefulComponent, [{
      key: "componentDidMount",
      value: function componentDidMount() {
        this.mount = true;
        this.didMountHandlers.forEach(function (handler) {
          return handler();
        });
        this.didMountHandlers.length = 0;
      }
    }, {
      key: "componentWillUnmount",
      value: function componentWillUnmount() {
        this.mount = false;
        this.hookContext.hooks.forEach(function (hook) {
          hook.type === "effect" && hook.dispose && hook.dispose();
        });
      }
    }, {
      key: "render",
      value: function render() {
        var props = this.props,
            hookContext = this.hookContext; // reset hook index

        hookContext.index = 0;
        return _render(props, hookContext);
      }
    }]);

    return StatefulComponent;
  }(_react.PureComponent);

  StatefulComponent.displayName = _render.displayName || _render.name;
  return StatefulComponent;
}

function arrayEqual(a, b) {
  return a.every(function (value, index) {
    return b[index] === value;
  });
}
//# sourceMappingURL=index.js.map