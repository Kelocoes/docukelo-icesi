---
sidebar_position: 4
description: "Explore what Zustand allows: selectors and useShallow, async actions, middleware (devtools, persist, immer), slices and use outside React."
---

# Zustand Capabilities

With `create`, `set` and selectors you can already solve most of the cases in the course. This lesson gathers what Zustand adds **when the store grows**: precisely controlling what renders again, making requests from actions, saving the state in `localStorage`, debugging it with Redux tools and splitting it across several files.

---

## 1. Selectors and Re-renders

Zustand's promise is that **a component only renders when what it selected changes**. Watch in the navigation bar tree which components are painted again when a notification arrives, with and without selectors:

:::note[The interactive graphics are in Spanish]
The interactive pieces are shared with the Spanish version and keep their Spanish text.
:::

<InteractiveFrame
  src="/interactive/desarrollo-entornos-digitales-web/semana-13/selectores-y-rerender/index.html"
  title="Which components re-render depending on the selector"
  height={700}
/>

The rule Zustand uses to decide: after each `set`, it runs the selector of each subscribed component again and compares the new result with the previous one using `Object.is` (reference equality). If they are equal, there is no render.

| Selector | What it returns | When does it re-render? |
| :--- | :--- | :--- |
| `useStore()` | The whole store | On **any** change |
| `useStore((s) => s.notifications)` | The array | When the array is replaced by another one |
| `useStore((s) => s.addNotification)` | A function | Never (the reference does not change) |
| `useStore((s) => s.notifications.length)` | A number | Only if the count changes |

### `useShallow`: Selecting Several Values

It is tempting to ask for several things at once with an object:

```tsx title="This causes a loop in Zustand 5" showLineNumbers
// Every render creates a NEW object, Object.is sees it as different and renders again
const { user, token } = useAuthStore((s) => ({ user: s.user, token: s.token }));
```

In Zustand 5 this ends in a "maximum update depth exceeded" error. The solution is to wrap the selector with **`useShallow`**, which compares the content of the object property by property instead of by reference:

```tsx title="Several values with useShallow" showLineNumbers
import { useShallow } from 'zustand/react/shallow';

const { user, token } = useAuthStore(
  useShallow((s) => ({ user: s.user, token: s.token })),
);
```

:::tip[Another option, without useShallow]
Use **one selector per value**: `const user = useAuthStore((s) => s.user);` and `const token = useAuthStore((s) => s.token);`. It is just as efficient and needs no import. Keep `useShallow` for when you want to group many values.
:::

### Derived State

When a value is **computed** from the state (how many unread notifications, cart total), do not store it: derive it.

```tsx title="Deriving in the selector" showLineNumbers
// Good: returns a number (primitive), only changes if the count changes
const unread = useNotificationsStore((s) => s.notifications.filter((n) => !n.read).length);

// Careful: filter returns a NEW array on every selector execution.
// If you need the filtered list, select the original array and filter in the component.
const all = useNotificationsStore((s) => s.notifications);
const unreadItems = all.filter((n) => !n.read);
```

---

## 2. Async Actions

In Redux, requests require a *thunk*. In Zustand an action can simply be an `async` function. Keep the request state (`isLoading`, `error`) in the store so the interface can show it:

```typescript title="src/features/auth/store/auth.store.ts (async action)" showLineNumbers
import { create } from 'zustand';
import { authService } from '../services/auth.service';
import type { LoginCredentials } from '../types';

type AuthState = {
  token: string | null;
  isLoading: boolean;
  error: string | null;
  login: (credentials: LoginCredentials) => Promise<boolean>;
  logout: () => void;
};

export const useAuthStore = create<AuthState>()((set) => ({
  token: null,
  isLoading: false,
  error: null,

  login: async (credentials) => {
    set({ isLoading: true, error: null });
    try {
      const token = await authService.login(credentials);
      set({ token, isLoading: false });
      return true;
    } catch (err) {
      set({
        isLoading: false,
        error: err instanceof Error ? err.message : 'Could not log in',
      });
      return false;
    }
  },

  logout: () => set({ token: null }),
}));
```

The component only calls the action and reacts to the result:

```tsx title="Use in LoginForm" showLineNumbers
const login = useAuthStore((s) => s.login);
const isLoading = useAuthStore((s) => s.isLoading);
const error = useAuthStore((s) => s.error);

const onSubmit = async (data: LoginCredentials) => {
  const ok = await login(data);
  if (ok) router.replace('/dashboard');
};
```

:::note[Same cycle as a thunk]
`isLoading = true` before, `token` when it ends well, `error` when it fails: it is the `pending`, `fulfilled` and `rejected` cycle of `createAsyncThunk`, without the extra machinery. In exchange, you are responsible for writing it completely and consistently in all your stores.
:::

---

## 3. Middleware: Layers Around the Store

A **middleware** is a function that wraps the creation of the store and adds a capability to it, without changing how you write your actions. They are imported from `zustand/middleware` and nested around the store function. Walk through what each layer does and what happens on a `set` call and when reloading the page:

<InteractiveFrame
  src="/interactive/desarrollo-entornos-digitales-web/semana-13/middleware-en-capas/index.html"
  title="Zustand middleware as layers around the store"
  height={740}
/>

| Middleware | What it is for | Import |
| :--- | :--- | :--- |
| `devtools` | Connects the store with the Redux DevTools extension: change history and time travel | `zustand/middleware` |
| `persist` | Saves the state in `localStorage` (or other storage) and restores it on reload | `zustand/middleware` |
| `immer` | Lets you write actions by "mutating" the state, while producing immutable copies | `zustand/middleware/immer` |
| `subscribeWithSelector` | Lets you subscribe outside React to a specific value, not the whole store | `zustand/middleware` |

### `persist`: Making the State Survive a Reload

The most common use case: not losing the session when refreshing the browser.

```typescript title="persist with partialize" showLineNumbers
import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      token: null,
      isLoading: false,
      error: null,
      login: async (credentials) => { /* ... */ return true; },
      logout: () => set({ token: null }),
    }),
    {
      name: 'auth-storage',                       // key in localStorage
      storage: createJSONStorage(() => localStorage),
      partialize: (state) => ({ token: state.token }), // only saves what is needed
      version: 1,                                 // to migrate if the shape changes
    },
  ),
);
```

Three details that avoid common mistakes:

- **`partialize`**: decides what is saved. Do not persist `isLoading` or `error`: after a reload, a screen stuck on "loading" is a bug.
- **`version`**: if you change the shape of the saved state, raise the version and define `migrate`; this way users with old data do not break the app.
- **Functions are not saved**: `JSON.stringify` drops them, and when the state is restored the actions are taken from the code again.

:::warning[Persistence and server-side rendering]
`localStorage` does not exist on the server. If the store restores data when it is created, the browser draws something different from the HTML the server sent and React warns with a **hydration mismatch** error. The solution is to delay the restore until the component mounts:

```typescript title="persist without hydration mismatch" showLineNumbers
persist(creator, {
  name: 'auth-storage',
  skipHydration: true,           // do not restore when creating the store
  partialize: (s) => ({ token: s.token }),
});

// In a Client Component high in the tree (for example, the layout):
useEffect(() => {
  useAuthStore.persist.rehydrate();
}, []);
```

We will use it in the practical case so the `AuthGuard` waits to know the session before deciding whether to kick the user out.
:::

### `devtools`: Seeing the History

```typescript title="devtools with action name" showLineNumbers
import { devtools } from 'zustand/middleware';

export const useNotificationsStore = create<NotificationsState>()(
  devtools(
    (set) => ({
      notifications: [],
      addNotification: (title) =>
        set(
          (s) => ({ notifications: [{ id: Date.now(), title, read: false }, ...s.notifications] }),
          undefined,
          'notifications/add', // appears as the action name in Redux DevTools
        ),
    }),
    { name: 'NotificationsStore', enabled: process.env.NODE_ENV !== 'production' },
  ),
);
```

Install the **Redux DevTools** extension in your browser: you will see each `set` with its name, the state before and after, and you will be able to move through the history just like with Redux.

### `immer`: Writing as If You Mutated

First install it (`npm install immer`). Then, instead of building copies by hand, you write the change directly and the middleware produces the immutable state:

```typescript title="immer in an action" showLineNumbers
import { immer } from 'zustand/middleware/immer';

export const useNotificationsStore = create<NotificationsState>()(
  immer((set) => ({
    notifications: [],
    addNotification: (title) =>
      set((state) => {
        state.notifications.unshift({ id: Date.now(), title, read: false });
      }),
    markRead: (id) =>
      set((state) => {
        const n = state.notifications.find((x) => x.id === id);
        if (n) n.read = true;
      }),
  })),
);
```

It is the same Immer that Redux Toolkit uses inside. It is worth it when the state has nested objects; for flat states, `set` with an object is simpler.

### Combining Middleware

They are nested inside one another. The recommended order: `devtools` on the outside (to see everything), then `persist`, and `immer` closest to your code.

```typescript title="All three together" showLineNumbers
export const useNotificationsStore = create<NotificationsState>()(
  devtools(
    persist(
      immer((set) => ({ /* state and actions */ })),
      { name: 'notifications-storage' },
    ),
    { name: 'NotificationsStore' },
  ),
);
```

---

## 4. Splitting a Large Store into Slices

When a store accumulates too many responsibilities, you can split it into **slices** and combine them. Each slice is a function that describes a part of the state:

```typescript title="Slices pattern" showLineNumbers
import { create, type StateCreator } from 'zustand';

type SessionSlice = { token: string | null; logout: () => void };
type UiSlice = { sidebarOpen: boolean; toggleSidebar: () => void };
type AppState = SessionSlice & UiSlice;

const createSessionSlice: StateCreator<AppState, [], [], SessionSlice> = (set) => ({
  token: null,
  logout: () => set({ token: null }),
});

const createUiSlice: StateCreator<AppState, [], [], UiSlice> = (set) => ({
  sidebarOpen: true,
  toggleSidebar: () => set((s) => ({ sidebarOpen: !s.sidebarOpen })),
});

export const useAppStore = create<AppState>()((...args) => ({
  ...createSessionSlice(...args),
  ...createUiSlice(...args),
}));
```

:::important[Slices or several stores?]
In the course we prefer **several small stores per feature** (lesson 3). Slices are useful when several parts **must live in the same store** (for example, so that one action modifies two parts at once), or when you join a project that already uses them.
:::

---

## 5. Outside React: Subscriptions and Testing

`subscribeWithSelector` lets you react to a specific value from any file. A typical case: clearing data when the session is closed.

```typescript title="Reacting to logout" showLineNumbers
import { subscribeWithSelector } from 'zustand/middleware';

// auth.store.ts: wrap the creator with subscribeWithSelector
// create<AuthState>()(subscribeWithSelector((set) => ({ ... })))

useAuthStore.subscribe(
  (state) => state.token,
  (token) => {
    if (token === null) {
      useNotificationsStore.setState({ notifications: [] });
    }
  },
);
```

For **tests**, a store's state persists from one test to the next because it lives at module level. Reset it with the initial state the hook itself keeps:

```typescript title="Resetting a store in a test" showLineNumbers
beforeEach(() => {
  useNotificationsStore.setState(useNotificationsStore.getInitialState(), true);
});
```

The second argument `true` indicates **replacing** the whole state instead of merging it.

---

## 6. Summary of Capabilities

| I need... | I use |
| :--- | :--- |
| A component to render only when one piece of data changes | One selector per value |
| To read several values with a single hook | `useShallow` |
| To make a request and show loading or error | `async` action with `isLoading` and `error` |
| The session to survive a reload | `persist` with `partialize` (and `skipHydration` in Next.js) |
| To see and rewind the changes | `devtools` + Redux DevTools |
| To write actions on nested state without manual copies | `immer` |
| To split a large store | Slices or several stores |
| To use the store in an HTTP client or utility | `getState()` / `setState()` / `subscribe()` |
| To reset the store in a test | `setState(getInitialState(), true)` |

---

## Self-Assessment Quiz

<Quiz id="dedw-s13-04-capacidades-de-zustand-quiz">
  <Question title="What problem does useShallow avoid in Zustand 5?">
    <Option>The store being saved twice in localStorage.</Option>
    <Option correct>A selector that returns a new object on every execution causing endless renders.</Option>
    <Option>Async actions running on the server.</Option>
    <Option>Actions being lost when the page reloads.</Option>
  </Question>
  <Question title="What does the partialize option of the persist middleware do?">
    <Option>It splits the store into several smaller files.</Option>
    <Option>It delays restoring the state until the component mounts.</Option>
    <Option correct>It defines which part of the state is saved in storage, so data like isLoading or error is not persisted.</Option>
    <Option>It automatically turns actions into pure functions.</Option>
  </Question>
  <Question title="Why is skipHydration used together with persist in Next.js?">
    <Option>Because localStorage is too slow to read when creating the store.</Option>
    <Option correct>So that the browser's first render matches the server HTML and the state is restored afterward, avoiding a hydration error.</Option>
    <Option>So that the persisted state is shared among all server users.</Option>
    <Option>To prevent the devtools middleware from recording actions.</Option>
  </Question>
  <Question title="What is the main difference between a Zustand async action and a Redux Toolkit createAsyncThunk?">
    <Option>The Zustand action cannot catch errors with try/catch.</Option>
    <Option correct>In Zustand it is a normal async function inside the store, and you write the loading and error cycle; the thunk generates pending, fulfilled and rejected automatically.</Option>
    <Option>The thunk works without a store, while Zustand requires a Provider.</Option>
    <Option>Zustand forces you to use dispatch for every request.</Option>
  </Question>
  <Question title="How do you reset a Zustand store between two tests?">
    <Option>By restarting the Next.js development server.</Option>
    <Option>By calling useStore() without a selector in the beforeEach.</Option>
    <Option correct>With setState(getInitialState(), true), which replaces the whole state with the initial one.</Option>
    <Option>It is not necessary, because the state resets itself after each test.</Option>
  </Question>
</Quiz>
