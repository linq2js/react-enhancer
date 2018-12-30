# react-enhancer

## Using state(defaultValue), refer https://reactjs.org/docs/hooks-reference.html#usestate

```jsx harmony
import React from "react";
import { render } from "react-dom";
import { stateful } from "react-enhancer";

const App = stateful((props, { state }) => {
  const defaultValue1 = 1;
  const defaultValue2 = 2;
  const [value1, setValue1] = state(defaultValue1);
  const [value2, setValue2] = state(defaultValue2);

  function handleCounter1() {
    setValue1(value1 + 1);
  }

  function handleCounter2() {
    setValue2(value2 + 1);
  }

  return (
    <>
      <button onClick={handleCounter1}>Increase Counter 1</button>
      <h2>Counter Value 1: {value1}</h2>
      <button onClick={handleCounter2}>Increase Counter 2</button>
      <h2>Counter Value 2: {value2}</h2>
    </>
  );
});

render(<App />, document.getElementById("root"));
```

## Using ref(), refer https://reactjs.org/docs/hooks-reference.html#useref

```jsx harmony
import React from "react";
import { render } from "react-dom";
import { stateful } from "react-enhancer";

const App = stateful((props, { ref }) => {
  const inputRef = ref();

  function handleSubmit(e) {
    e.preventDefault();
    alert(inputRef.current.value);
  }

  return (
    <>
      <form onSubmit={handleSubmit}>
        <input ref={inputRef} />
      </form>
    </>
  );
});

render(<App />, document.getElementById("root"));
```

## Using effect(factory, inputs), refer https://reactjs.org/docs/hooks-reference.html#useeffect

The default behavior for effects is to fire the effect once after completed render. That way an effect is always recreated if one of its inputs changes.

```jsx harmony
import React from "react";
import { render } from "react-dom";
import { stateful } from "react-enhancer";

const App = stateful((props, { effect, state }) => {
  const [userInfo, setUserInfo] = state("Loading...");

  effect(() => {
    setTimeout(
      () =>
        fetch("https://api.github.com/users/linq2js")
          .then(res => res.text())
          .then(res => setUserInfo(res)),
      2000
    );
  });

  return <>{userInfo}</>;
});

render(<App />, document.getElementById("root"));
```

## Using use() to invoke custom hook

```jsx harmony
import React from "react";
import { render } from "react-dom";
import { stateful } from "react-enhancer";

const userInfoHook = ({ effect, state }, name) => {
  const [userInfo, setUserInfo] = state("Loading...");
  effect(() => {
    setTimeout(
      () =>
        fetch("https://api.github.com/users/" + name)
          .then(res => res.text())
          .then(res => setUserInfo(res)),
      2000
    );
  });

  return userInfo;
};

const App = stateful((props, { use }) => {
  const userInfo = use(userInfoHook, "linq2js");

  return <>{userInfo}</>;
});

render(<App />, document.getElementById("root"));
```

## Using memo(factory, inputs), refer https://reactjs.org/docs/hooks-reference.html#usememo

```jsx harmony
import React from "react";
import { render } from "react-dom";
import { stateful } from "react-enhancer";

const App = stateful((props, { memo, state }) => {
  const [regenerated, setRegenerated] = state(false);
  const randomValue = memo(() => Math.random(), [regenerated]);
  const [counter, setCounter] = state(1);

  function handleRegenerated() {
    setRegenerated(!regenerated);
  }

  function handleCounter() {
    setCounter(counter + 1);
  }

  return (
    <>
      <button onClick={handleCounter}>Increase Counter</button>
      <h2>Counter Value: {counter}</h2>
      <button onClick={handleRegenerated}>Regenerate random value</button>
      <h2>Random Value: {randomValue}</h2>
    </>
  );
});

render(<App />, document.getElementById("root"));
```

## Using context() to create simple todo app

```jsx harmony
import React from "react";
import { render } from "react-dom";
import { stateful } from "react-enhancer";

const initialState = [{ id: 1, text: "item 1" }, { id: 2, text: "item 2" }];

const reducer = (state, action) => {
  if (action.type === "add") {
    return [...state, { id: new Date().getTime(), text: action.payload }];
  }
  if (action.type === "remove") {
    return state.filter(todo => todo.id !== action.payload);
  }
  if (action.type === "toggle") {
    return state.map(todo =>
      todo.id === action.payload ? { ...todo, done: !todo.done } : todo
    );
  }
  return state;
};

const TodoForm = stateful((props, { ref, context }) => {
  const inputRef = ref();

  return context(({ dispatch }) => {
    function handleSubmit(e) {
      e.preventDefault();
      dispatch("add", inputRef.current.value);
      inputRef.current.value = "";
    }

    return (
      <form onSubmit={handleSubmit}>
        <input ref={inputRef} />
      </form>
    );
  });
});

const TodoList = stateful((props, { context }) => {
  return context(({ todos, dispatch }) => {
    return (
      <ul>
        {todos.map(todo => (
          <li key={todo.id} style={{ opacity: todo.done ? 0.5 : 1 }}>
            <button onClick={() => dispatch("toggle", todo.id)}>toggle</button>
            <button onClick={() => dispatch("remove", todo.id)}>remove</button>
            {todo.text}
          </li>
        ))}
      </ul>
    );
  });
});

const App = stateful((props, { context, state }) => {
  const [todos, setTodos] = state(initialState);
  const dispatch = (type, payload) =>
    setTodos(reducer(todos, { type, payload }));
  return context(
    { todos, dispatch },
    <>
      <TodoForm />
      <TodoList />
    </>
  );
});

render(<App />, document.getElementById("root"));
```
