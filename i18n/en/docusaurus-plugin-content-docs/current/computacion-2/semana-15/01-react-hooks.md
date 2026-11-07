---
sidebar_position: 1
description: "Learn how to give components memory and effects in React with useState, useEffect and custom hooks, and see how React updates the component tree."
---

# React Hooks: useState, useEffect and custom hooks

So far your components only draw data they receive through props. For an interface to respond to the user they need two more things: to **remember** something between one render and the next, and to **connect** with things React does not control (the page title, a server, a timer). **Hooks** are the functions that give them those abilities. Their name always starts with `use`.

This chapter follows the «Learn» section of [react.dev](https://react.dev/learn): first memory (`useState`), then effects (`useEffect`), and finally how to reuse both in your own hooks.

:::note[Interactive graphics]
The interactive graphics in this chapter are shown in Spanish.
:::

## Why a component needs memory

Try to build a counter with a plain variable:

```jsx title="Contador.jsx (does not work)" showLineNumbers
function Contador() {
  let count = 0;

  return (
    <button onClick={() => { count = count + 1; }}>
      Clics: {count}
    </button>
  );
}
```

The button never changes, for two reasons:

- **Local variables do not survive a render:** every time React runs `Contador`, `count` starts over at 0.
- **Changing a local variable does not tell React anything:** nothing tells it that it must draw the screen again.

`useState` solves both at once: it stores the value **outside the function**, and its `set` function tells React that something changed.

## useState: the component's memory

```jsx title="Contador.jsx" showLineNumbers
import { useState } from "react";

function Contador() {
  const [count, setCount] = useState(0);

  return (
    <button onClick={() => setCount(count + 1)}>
      Clics: {count}
    </button>
  );
}
```

`useState(0)` returns an array with two elements, which we pull out with destructuring:

| Element | What it is | What it does |
| --- | --- | --- |
| `count` | The **state variable** | The current value. React keeps it between renders; the `0` is only used the first time. |
| `setCount` | The **setter** function | Saves a new value **and** asks React to draw the component again. |

See what React runs when you press a button and what changes in the DOM. At the end you will see that two copies of the same component each have their own state.

<InteractiveFrame
  src="/interactive/computacion-2/semana-15/usestate-actualiza/index.html"
  title="What React runs when a button that changes state with useState is pressed, and what changes in the DOM"
  height={680}
/>

### What you should take away

- **State is private to each copy:** React associates it with the place the component occupies in the tree. Two `<Contador />` never share their `count`.
- **Changing state triggers a render:** React runs the component that changed again (and its children) and compares the result with the previous one (the Virtual DOM phases you already saw).
- **Only what changed is touched:** the rest of the DOM stays as it was.

### State is a snapshot

There is a detail that is confusing at first. Asking for a new value **does not change the `count` you already have**: each render gets its own «snapshot» of the state, and the event handler always sees the snapshot of its render.

```jsx title="Three setCount calls in a row" showLineNumbers
<button onClick={() => {
  setCount(count + 1);
  setCount(count + 1);
  setCount(count + 1);
}}>
  +3
</button>
```

How much is `count` after the click? **1, not 3.** In that snapshot `count` is 0, so the three calls ask for the same thing: «set 0 + 1». React puts them in a queue and applies them in order. If the new value depends on the previous one, pass an **updater function**: React calls it with the result of the previous one.

```jsx title="Updater function" showLineNumbers
setCount((c) => c + 1); // 0 → 1
setCount((c) => c + 1); // 1 → 2
setCount((c) => c + 1); // 2 → 3
```

Go through it in the piece and turn on the switch to compare the two forms:

<InteractiveFrame
  src="/interactive/computacion-2/semana-15/usestate-instantanea/index.html"
  title="How React processes several calls to setCount: with a value based on the render snapshot and with an updater function"
  height={720}
/>

:::warning[Do not mutate state: replace it]
If the state is an object or an array, do not modify it (`user.name = "Ana"`, `lista.push(x)`). React compares by reference: it only notices the change if you give it a **new** value.

```jsx title="Replace instead of mutate" showLineNumbers
setUser({ ...user, name: "Ana" });       // new object with one field changed
setItems([...items, nuevoItem]);         // new array with one more element
setItems(items.filter((i) => i.id !== id)); // new array without one element
```
:::

### Rules of hooks

React knows which state belongs to each `useState` by **the order** in which they are called. That is why they have two rules:

- **Only at the top level:** do not call them inside `if`, loops or nested functions. That way the order is the same on every render.
- **Only in components or in other hooks:** not in regular JavaScript functions.

## useEffect: synchronizing with the outside world

Rendering must be **pure**: the body of the component only calculates what to draw, without touching anything outside of it. But sometimes you need to do something that does touch the outside: connect to a chat, change the tab title, start a timer. That is an **effect**, and `useEffect` runs it **after** React has updated the DOM.

```jsx title="Chat.jsx" showLineNumbers
import { useState, useEffect } from "react";

function Chat({ roomId }) {
  const [message, setMessage] = useState("");

  useEffect(() => {
    const conn = connect(roomId);      // setup: connect
    return () => conn.disconnect();    // cleanup: disconnect
  }, [roomId]);                        // dependencies

  // ...
}
```

An effect has three parts:

| Part | When it runs | What it is for |
| --- | --- | --- |
| **Setup** (the body) | After drawing, the first time and every time a dependency changes | Open the connection, subscribe, start the timer |
| **Cleanup** (what it returns) | Before repeating the effect and on unmount | Undo what the setup did |
| **Dependencies** (the array) | Compared on every render | Decide whether the effect must repeat |

Dependencies are the **reactive** values (props, state) that the effect reads. The array decides when it runs:

| Array | The effect runs |
| --- | --- |
| `[roomId]` | On mount and every time `roomId` changes. |
| `[]` | Only on mount. |
| _(no array)_ | After **every** render. |

Change the dependencies in the piece and see when the chat connects and when it is cleaned up. With `[]` the most common mistake appears: the effect uses `roomId`, but it does not notice that it changed.

<InteractiveFrame
  src="/interactive/computacion-2/semana-15/useeffect-dependencias/index.html"
  title="When a useEffect that connects to a chat runs and when it is cleaned up, depending on the dependency array"
  height={780}
/>

:::note[Why does my effect run twice?]
In development, with `<StrictMode>` (the Vite template includes it), React mounts the component, **runs the cleanup** and mounts it again. It does this on purpose to check that your cleanup properly undoes what the setup did. In production it runs only once.
:::

### An effect to fetch data

Fetching data from the server is a classic effect: it does not depend on the render but on something external. This version includes the cleanup that prevents a slow response from overwriting a newer one:

```jsx title="Usuario.jsx" showLineNumbers
function Usuario({ userId }) {
  const [user, setUser] = useState(null);

  useEffect(() => {
    let ignore = false;

    fetch(`https://jsonplaceholder.typicode.com/users/${userId}`)
      .then((res) => res.json())
      .then((data) => {
        if (!ignore) setUser(data);
      });

    return () => { ignore = true; };
  }, [userId]);

  if (!user) return <p>Cargando...</p>;
  return <h1>{user.name}</h1>;
}
```

If `userId` changes while the first request is in flight, the cleanup sets `ignore = true` and that response is discarded. In week 16 you will see how Axios simplifies this code.

:::tip[Do I always need an effect?]
No. An effect is for **synchronizing with something external**. If you are only calculating a value from props or state, calculate it during the render. If it is the response to a click, put it in the event handler. Read [You Might Not Need an Effect](https://react.dev/learn/you-might-not-need-an-effect).
:::

## Custom hooks: reusing logic

When several components repeat the same state and the same effect, you extract them into a function whose name starts with `use`. That is a **custom hook**: it is not a new React API, it is your own function that calls other hooks.

Go through the code of a hook that tells you whether there is an internet connection and see how two components use it:

<InteractiveFrame
  src="/interactive/computacion-2/semana-15/custom-hook-reuso/index.html"
  title="Anatomy of a custom hook, useOnlineStatus, with its state, its effect and its cleanup, and two components that use it"
  height={940}
/>

Using it replaces all that state and that effect with a single line:

```jsx title="StatusBar.jsx" showLineNumbers
function StatusBar() {
  const online = useOnlineStatus();
  return <h1>{online ? "Conectado" : "Sin conexión"}</h1>;
}

function SaveButton() {
  const online = useOnlineStatus();
  return <button disabled={!online}>Guardar</button>;
}
```

### What you should take away

- **The logic is shared, not the state:** each call to `useOnlineStatus()` creates its own `online`.
- **The name matters:** it starts with `use` so that React and the linter apply the rules of hooks.
- **One hook, one task:** `useOnlineStatus`, `useWindowWidth`, `useFetch`. If it does too much, split it.
- **Where it lives:** in the `hooks/` folder we proposed for the project structure (`src/hooks/useOnlineStatus.js`).

## Further Reading

- [State: A Component's Memory](https://react.dev/learn/state-a-components-memory)
- [State as a Snapshot](https://react.dev/learn/state-as-a-snapshot)
- [Queueing a Series of State Updates](https://react.dev/learn/queueing-a-series-of-state-updates)
- [Synchronizing with Effects](https://react.dev/learn/synchronizing-with-effects)
- [Lifecycle of Reactive Effects](https://react.dev/learn/lifecycle-of-reactive-effects)
- [You Might Not Need an Effect](https://react.dev/learn/you-might-not-need-an-effect)
- [Reusing Logic with Custom Hooks](https://react.dev/learn/reusing-logic-with-custom-hooks)
- [Rules of Hooks](https://react.dev/reference/rules/rules-of-hooks)

---

## Self-Assessment Quiz

<Quiz id="compunet2-s15-react-hooks-quiz">
  <Question title="Why does a counter built with a plain variable (let count = 0) not work in a component?">
    <Option>Because React does not allow declaring variables inside a component.</Option>
    <Option correct>Because the variable is reset on every render and, in addition, changing it does not tell React that it must draw again.</Option>
    <Option>Because local variables can only be modified with a setter function.</Option>
    <Option>Because the browser discards variables when the DOM changes.</Option>
  </Question>
  <Question title="What does useState(0) return?">
    <Option>Only the current value of the state.</Option>
    <Option>A function that saves the value and shows it on screen.</Option>
    <Option correct>An array with the current value of the state and the function to change it and request a new render.</Option>
    <Option>An object with the state and the DOM that represents it.</Option>
  </Question>
  <Question title="Do two copies of the same Contador component share their state?">
    <Option>Yes, because they run the same function.</Option>
    <Option>Yes, as long as they are inside the same parent.</Option>
    <Option correct>No, React associates the state with each copy according to its place in the component tree.</Option>
    <Option>Only if the state is a number.</Option>
  </Question>
  <Question title="In a handler with three consecutive calls to setCount(count + 1) and count = 0, how much is count in the next render?">
    <Option>3, because each call adds 1.</Option>
    <Option>0, because setCount does not change the value.</Option>
    <Option correct>1, because the three calls use the same state snapshot (count = 0) and ask for «set 0 + 1».</Option>
    <Option>It depends on the browser.</Option>
  </Question>
  <Question title="What should you do when the state is an array and you want to add an element?">
    <Option>Use items.push(nuevo) and then call setItems(items).</Option>
    <Option correct>Pass setItems a new array, for example [...items, nuevo].</Option>
    <Option>Call useState again with the modified array.</Option>
    <Option>Modify the array directly: React detects the change on its own.</Option>
  </Question>
  <Question title="When does a useEffect with an empty dependency array ([]) run?">
    <Option>After every render.</Option>
    <Option>Every time any state of the component changes.</Option>
    <Option correct>Only when the component mounts (and its cleanup, when it unmounts).</Option>
    <Option>Never, because an empty array disables the effect.</Option>
  </Question>
  <Question title="What is the function that a useEffect returns for?">
    <Option>To run the effect again when the state changes.</Option>
    <Option>To return the value that the component is going to draw.</Option>
    <Option correct>To undo what the effect did (close the connection, remove the subscription) before repeating it and on unmount.</Option>
    <Option>To prevent React from running the effect twice in development.</Option>
  </Question>
  <Question title="What do two components that use the same custom hook share?">
    <Option>The same state, because the hook runs only once.</Option>
    <Option correct>The same logic, but each one has its own state.</Option>
    <Option>Nothing: a hook can only be used in one component.</Option>
    <Option>The same effect, which runs only once for both.</Option>
  </Question>
</Quiz>
