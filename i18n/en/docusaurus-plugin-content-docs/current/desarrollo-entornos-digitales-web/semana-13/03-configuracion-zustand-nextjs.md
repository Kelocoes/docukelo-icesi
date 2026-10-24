---
sidebar_position: 3
description: "Set up Zustand in Next.js step by step: installation, TypeScript typing, store location by feature, use in Client Components and the care needed with the server."
---

# Zustand Setup in Next.js

We already know what a store is. Now we get it working in a Next.js project (App Router) with TypeScript, following the feature-based structure from week 12. The installation is short; what deserves attention is **where to put each file** and **what to watch for because Next.js also runs on the server**.

---

## 1. Installation

From the root of the Next.js project:

```bash
npm install zustand
```

Zustand 5 requires React 18 or higher; with Next.js 16 and React 19 there is nothing else to configure. You do not need to register a `Provider`, a plugin, or touch `next.config`.

---

## 2. Where Stores Live

We apply the same rule we already use for the rest of the code: **a store belongs to the feature that needs it**. Only what several features use goes to `shared/`.

```plaintext
src/
├── app/
│   └── (app)/layout.tsx
├── features/
│   ├── auth/
│   │   ├── components/
│   │   ├── services/
│   │   └── types.ts
│   └── notifications/
│       ├── components/
│       │   ├── NotificationCreator.tsx
│       │   └── NotificationBell.tsx
│       └── store/
│           └── notifications.store.ts <-- notification list (only this feature uses it)
└── shared/
    └── store/
        ├── session.store.ts           <-- session token (needed by api.ts and several features)
        └── ui.store.ts                <-- cross-cutting UI state (sidebar, theme)
```

Look at the session: the HTTP client (`shared/lib/api.ts`) needs the token, and `shared/` cannot depend on a feature. That is why the session store lives in `shared/store/` and not in `features/auth/`. It is the same reason why in week 12 `session.ts` was in `shared/lib/`.

Conventions we will use in the course:

| Convention | Example |
| :--- | :--- |
| File: `<name>.store.ts` | `notifications.store.ts` |
| Exported hook: `use<Name>Store` | `useNotificationsStore` |
| One store per responsibility | Do not put session, notifications and theme in a single one |
| Components import the **hook**, never the internal state | `import { useNotificationsStore } from '../store/notifications.store'` |

:::tip[One store per responsibility, not one store per app]
Unlike Redux, where there is a single store, in Zustand it is normal to have **several small stores**. It is easier to understand and each component subscribes only to what it needs. If two stores must collaborate, one can read the other with `useOtherStore.getState()`.
:::

---

## 3. Create the First Store

A well-written store separates **data** and **actions** in the type, and names actions with verbs:

```typescript title="src/features/notifications/store/notifications.store.ts" showLineNumbers
import { create } from 'zustand';

export type NotificationItem = {
  id: number;
  title: string;
  read: boolean;
  createdAt: string;
};

type NotificationsData = {
  notifications: NotificationItem[];
};

type NotificationsActions = {
  addNotification: (title: string) => void;
  markRead: (id: number) => void;
  markAllRead: () => void;
  removeNotification: (id: number) => void;
};

export type NotificationsState = NotificationsData & NotificationsActions;

const initialState: NotificationsData = {
  notifications: [],
};

export const useNotificationsStore = create<NotificationsState>()((set) => ({
  ...initialState,

  addNotification: (title) =>
    set((state) => ({
      notifications: [
        { id: Date.now(), title, read: false, createdAt: new Date().toISOString() },
        ...state.notifications,
      ],
    })),

  markRead: (id) =>
    set((state) => ({
      notifications: state.notifications.map((n) =>
        n.id === id ? { ...n, read: true } : n,
      ),
    })),

  markAllRead: () =>
    set((state) => ({
      notifications: state.notifications.map((n) => ({ ...n, read: true })),
    })),

  removeNotification: (id) =>
    set((state) => ({
      notifications: state.notifications.filter((n) => n.id !== id),
    })),
}));
```

Why separate `initialState`: we reuse it to **reset** the store (for example when logging out, or between tests) without repeating the values.

---

## 4. Using It in Components

Zustand hooks only work in **Client Components**, so the file carries `'use client'` on its first line. Remember the week 11 rule: the directive goes in the component that uses the hook, not in the store.

```tsx title="src/features/notifications/components/NotificationCreator.tsx" showLineNumbers
'use client';

import { useState } from 'react';
import { useNotificationsStore } from '../store/notifications.store';

export function NotificationCreator() {
  const [title, setTitle] = useState('');

  // Only the action: this component does NOT re-render when the list changes
  const addNotification = useNotificationsStore((s) => s.addNotification);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;
    addNotification(title.trim());
    setTitle('');
  };

  return (
    <form onSubmit={handleSubmit} className="flex gap-2">
      <input
        className="input input-bordered"
        placeholder="Notification title"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
      />
      <button className="btn btn-primary" type="submit">Emit</button>
    </form>
  );
}
```

```tsx title="src/features/notifications/components/NotificationBell.tsx" showLineNumbers
'use client';

import { useNotificationsStore } from '../store/notifications.store';

export function NotificationBell() {
  // Selector that returns a number: it only changes when the number of unread items changes
  const unread = useNotificationsStore(
    (s) => s.notifications.filter((n) => !n.read).length,
  );

  return (
    <button className="btn btn-ghost" type="button">
      Notifications
      {unread > 0 && <span className="badge badge-secondary ml-2">{unread}</span>}
    </button>
  );
}
```

`NotificationCreator` and `NotificationBell` **do not know each other**: they share no `props`, no common parent that keeps the state, and no `Provider`. Both talk to the store. That is what replaces the *prop drilling* from lesson 1.

:::note[A Server Component does not use the store]
If you try to call `useNotificationsStore(...)` in a Server Component, Next.js fails with a hooks error. A Zustand store is **browser** state: Server Components can render a Client Component that uses it, but never read or write it.
:::

---

## 5. Watch Out for the Server

In the Redux lesson we saw why a store shared as a global variable is dangerous in Next.js: the Node.js server serves many users with **the same process**, and a module-level variable is shared across all requests.

With Zustand the risk exists, but it is narrower. It is worth knowing exactly when it appears:

| Situation | Is a module-level `create` safe? |
| :--- | :--- |
| The state only changes through user events (clicks, forms) | **Yes.** Those actions only run in the browser, where each tab has its own copy of the store |
| The initial data comes from the server (for example the request user) and you put it in the store while rendering | **No.** A user could see the previous user's data |
| You write to the store while a component renders | **No.** It also happens on the server |

### What We Will Do in the Course

In the course we use stores **only for browser interaction and session** (notifications, token, theme), so a module-level `create`, as in section 3, is enough and is the simplest option.

When you need to initialize the store with data that comes from the server, the pattern recommended in the official documentation is to create **one store per request** with `createStore` and deliver it with a Context:

```tsx title="src/shared/store/counter-provider.tsx (per-request pattern)" showLineNumbers
'use client';

import { createContext, useContext, useRef } from 'react';
import { createStore, useStore, type StoreApi } from 'zustand';

type CounterState = { count: number; increment: () => void };

// Factory: each call returns a new, independent store
const createCounterStore = (initialCount: number) =>
  createStore<CounterState>()((set) => ({
    count: initialCount,
    increment: () => set((s) => ({ count: s.count + 1 })),
  }));

const CounterContext = createContext<StoreApi<CounterState> | null>(null);

export function CounterProvider({
  initialCount,
  children,
}: {
  initialCount: number;
  children: React.ReactNode;
}) {
  const storeRef = useRef<StoreApi<CounterState>>(null);
  if (!storeRef.current) {
    storeRef.current = createCounterStore(initialCount);
  }
  return (
    <CounterContext.Provider value={storeRef.current}>
      {children}
    </CounterContext.Provider>
  );
}

export function useCounterStore<T>(selector: (s: CounterState) => T): T {
  const store = useContext(CounterContext);
  if (!store) throw new Error('useCounterStore must be used inside <CounterProvider>');
  return useStore(store, selector);
}
```

The idea is the same as `makeStore` in Redux: a **factory** that creates one instance per request, instead of a global instance. If you studied that lesson, you will recognize the pattern.

:::important[Practical decision]
Start with the simple version (module-level `create`). Move to the per-request pattern only when you need to **hydrate the store with server data**. Do not use it "just in case": it adds a `Provider` and several lines you do not need yet.
:::

---

## 6. Checklist

Before continuing, check that your project meets all of this:

- [ ] `zustand` appears in `dependencies` in `package.json`.
- [ ] Each store is in `features/<feature>/store/<feature>.store.ts` (or in `shared/store/` if several features or the `shared/` layer need it).
- [ ] The state type separates data and actions, and the store is created with `create<State>()(...)`.
- [ ] Components that use the hook have `'use client'`.
- [ ] Each component uses **selectors** (it does not call the hook without arguments).
- [ ] No Server Component reads or writes the store.

---

## Self-Assessment Quiz

<Quiz id="dedw-s13-03-configuracion-zustand-nextjs-quiz">
  <Question title="Where should a store that only the notifications feature uses be located?">
    <Option>In app/, next to the page that displays it.</Option>
    <Option correct>In features/notifications/store/notifications.store.ts.</Option>
    <Option>In a single global store.ts file with all the app stores.</Option>
    <Option>Inside each component, so that it is not shared.</Option>
  </Question>
  <Question title="What happens if a Server Component tries to call a Zustand hook?">
    <Option>It works the same, because Next.js synchronizes the store with the server.</Option>
    <Option>It reads the state of the last user who visited the page.</Option>
    <Option correct>It fails, because hooks only work in Client Components; the store is browser state.</Option>
    <Option>It automatically creates one store per request.</Option>
  </Question>
  <Question title="Why does NotificationCreator select only the addNotification action?">
    <Option>Because it is the only way to call the action in TypeScript.</Option>
    <Option>So that the store keeps the title the user types.</Option>
    <Option correct>Because actions have a stable reference, so the component does not render again when the list changes.</Option>
    <Option>Because Zustand does not allow reading data and actions in the same component.</Option>
  </Question>
  <Question title="When is it necessary to move from a module-level create to the one-store-per-request pattern?">
    <Option>Whenever the application has more than one store.</Option>
    <Option>When TypeScript is used.</Option>
    <Option correct>When the store must be initialized with data coming from the server, to avoid sharing data between requests.</Option>
    <Option>When the state includes async actions.</Option>
  </Question>
</Quiz>
