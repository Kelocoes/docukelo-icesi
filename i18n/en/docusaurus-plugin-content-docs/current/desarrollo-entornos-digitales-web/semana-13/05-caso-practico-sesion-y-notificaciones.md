---
sidebar_position: 5
description: "Practical case: migrate the week 12 login session to a Zustand store with persistence and build a notification system with delivery criteria."
---

# Practical Case: Session and Notifications with Zustand

Now we apply everything to the week 12 project. You have a login that stores the token in `localStorage` through `session.ts`, an `AuthGuard` and a dashboard. In this practice:

1. **We migrate the session** to a Zustand store with `persist`, so any component can react to login and logout.
2. **We build a notification system** that is emitted from one screen and read in the navigation bar, without passing `props`.
3. **We verify with Redux DevTools** what happens on each change.

:::note[Starting point]
Work on your [week 12](../semana-12/02-caso-de-estudio-login-register.md) project. You must have `LoginForm`, `RegisterForm`, `AuthGuard`, `apiFetch` and the `(app)` layout working.
:::

---

## 1. What We Are Going to Change

| File (week 12) | What happens in week 13 |
| :--- | :--- |
| `shared/lib/session.ts` | Replaced by `shared/store/session.store.ts` |
| `shared/lib/api.ts` | Reads the token from the store with `getState()` |
| `features/auth/services/auth.service.ts` | Saves and deletes the token in the store |
| `features/auth/components/AuthGuard.tsx` | Waits for the session to be restored and reads the store with a selector |
| `app/(app)/layout.tsx` | Restores the session and shows the notification bell |
| (new) `features/notifications/...` | Notification store, creator and bell |

---

## 2. Step by Step

<StepByStep>
  <Step number="1" title="Install Zustand">
    ```bash
    npm install zustand
    ```
  </Step>
  <Step number="2" title="Create the session store">
    Create `src/shared/store/session.store.ts`. It only keeps the token and a flag to know whether the session has already been restored from `localStorage`.
  </Step>
  <Step number="3" title="Connect the HTTP client and the authentication service">
    `api.ts` and `auth.service.ts` read and write the token in the store.
  </Step>
  <Step number="4" title="Update AuthGuard and the layout">
    The guard waits for the restore; the layout triggers it once.
  </Step>
  <Step number="5" title="Create the notifications store and its components">
    Reuse the store from [lesson 3](./03-configuracion-zustand-nextjs.md#3-create-the-first-store).
  </Step>
  <Step number="6" title="Emit notifications from the login">
    Notify when the session is started and closed, and look at the result in Redux DevTools.
  </Step>
</StepByStep>

---

## 3. The Session Store

```typescript title="src/shared/store/session.store.ts" showLineNumbers
import { create } from 'zustand';
import { devtools, persist, createJSONStorage } from 'zustand/middleware';

type SessionState = {
  token: string | null;
  hasHydrated: boolean;
  setToken: (token: string) => void;
  clearSession: () => void;
  setHasHydrated: (value: boolean) => void;
};

export const useSessionStore = create<SessionState>()(
  devtools(
    persist(
      (set) => ({
        token: null,
        hasHydrated: false,

        setToken: (token) => set({ token }, undefined, 'session/setToken'),
        clearSession: () => set({ token: null }, undefined, 'session/clear'),
        setHasHydrated: (value) => set({ hasHydrated: value }, undefined, 'session/hydrated'),
      }),
      {
        name: 'auth_token',                       // same key as week 12
        storage: createJSONStorage(() => localStorage),
        partialize: (state) => ({ token: state.token }),
        skipHydration: true,                      // we restore it ourselves, after the first render
        onRehydrateStorage: () => (state) => {
          state?.setHasHydrated(true);
        },
      },
    ),
    { name: 'SessionStore', enabled: process.env.NODE_ENV !== 'production' },
  ),
);
```

What decisions are here, and which lesson they come from:

- **`partialize`** only saves `token`. `hasHydrated` is browsing-session data, not something that should persist.
- **`skipHydration`** avoids the hydration mismatch we discussed in [lesson 4](./04-capacidades-de-zustand.md#3-middleware-layers-around-the-store).
- **`onRehydrateStorage`** tells us when it has finished restoring, so we can turn on `hasHydrated`.
- **Action names** (third argument of `set`) to read the history in Redux DevTools.

:::warning[Same key, different format]
`persist` saves a JSON object (`{"state":{"token":"..."},"version":0}`), whereas `session.ts` saved the token as plain text under `auth_token`. If your browser keeps a week 12 session, delete that key (`localStorage.removeItem('auth_token')` in the console) or log in again.
:::

---

## 4. Connect the HTTP Client and the Service

`api.ts` no longer imports `session`. It reads the token with `getState()`, because it is not a component:

```typescript title="src/shared/lib/api.ts (changes)" showLineNumbers
import { useSessionStore } from '@/shared/store/session.store';

export async function apiFetch<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
  const token = useSessionStore.getState().token;
  // ... the rest stays the same as in week 12
}
```

The authentication service writes to the store instead of `localStorage`:

```typescript title="src/features/auth/services/auth.service.ts (changes)" showLineNumbers
import { useSessionStore } from '@/shared/store/session.store';

export const authService = {
  async login(credentials: LoginCredentials): Promise<string> {
    const token = await apiFetch<string>('/auth/login', {
      method: 'POST',
      body: JSON.stringify(credentials),
    });
    useSessionStore.getState().setToken(token);
    return token;
  },

  logout(): void {
    useSessionStore.getState().clearSession();
  },
  // register() does not change
};
```

:::tip[Why getState() and not the hook]
`authService` and `apiFetch` are normal functions, not components. Hooks can only be called inside components, while `getState()` works in any file.
:::

---

## 5. AuthGuard and Layout

The guard no longer consults `localStorage`. It uses two selectors and a `useEffect` to decide:

```tsx title="src/features/auth/components/AuthGuard.tsx" showLineNumbers
'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useSessionStore } from '@/shared/store/session.store';

export function AuthGuard({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const hasHydrated = useSessionStore((s) => s.hasHydrated);
  const isAuthenticated = useSessionStore((s) => s.token !== null);

  useEffect(() => {
    if (hasHydrated && !isAuthenticated) {
      router.replace('/login');
    }
  }, [hasHydrated, isAuthenticated, router]);

  if (!hasHydrated) {
    return <p className="p-8">Verifying access authorization...</p>;
  }

  if (!isAuthenticated) return null;

  return <>{children}</>;
}
```

Notice what we gain: if the token is deleted **anywhere** (a `logout`, a backend `401`), the guard finds out on its own and redirects. In week 12 it only checked once, when mounting.

The layout restores the session once and shows the bell:

```tsx title="src/app/(app)/layout.tsx (changes)" showLineNumbers
'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { authService } from '@/features/auth/services/auth.service';
import { AuthGuard } from '@/features/auth/components/AuthGuard';
import { NotificationBell } from '@/features/notifications/components/NotificationBell';
import { useSessionStore } from '@/shared/store/session.store';

export default function AppLayout({ children }: { children: React.ReactNode }) {
  const router = useRouter();

  // Restore the saved session, only once when mounting
  useEffect(() => {
    useSessionStore.persist.rehydrate();
  }, []);

  const handleLogout = () => {
    authService.logout();
    router.replace('/login');
  };

  return (
    <AuthGuard>
      <header className="navbar border-b border-base-200 px-4">
        <div className="flex-1" />
        <NotificationBell />
        <button type="button" className="btn btn-ghost" onClick={handleLogout}>
          Log out
        </button>
      </header>
      <main className="p-8">{children}</main>
    </AuthGuard>
  );
}
```

:::important[A detail that often fails]
`rehydrate()` is called in the layout, not inside `AuthGuard`, so that it happens **only once per page load** and not every time the guard mounts. If the login page also needs to know whether there is already a session (to skip the form), apply the same pattern in `app/(auth)/layout.tsx`.
:::

---

## 6. Notifications

Create the store with the code from [lesson 3](./03-configuracion-zustand-nextjs.md#3-create-the-first-store) in `features/notifications/store/notifications.store.ts`, and the `NotificationCreator` and `NotificationBell` components from section 4 of that lesson. With that, `NotificationBell` already updates when someone emits a notification.

### Emit from the Login

Outside React the action is called with `getState()`. Add this in `auth.service.ts`:

```typescript title="src/features/auth/services/auth.service.ts (notifications)" showLineNumbers
import { useNotificationsStore } from '@/features/notifications/store/notifications.store';

// inside login(), after saving the token:
useNotificationsStore.getState().addNotification('Login successful');

// inside logout():
useNotificationsStore.getState().addNotification('Session closed');
```

Now login and logout notify the navigation bar without any component passing them along. That is the whole connection.

---

## 7. Verify with Redux DevTools

Install the **Redux DevTools** extension and open the tab on the dashboard page. Check:

1. When the page loads, `session/hydrated` appears: the session was restored.
2. When you log in, you see `session/setToken` with the token in the state.
3. When you log out, you see `session/clear`.
4. With the **Diff** tab, confirm that each action changed only what it should.

---

## 8. Delivery Criteria

<CardGrid cols={2}>
  <Card
    title="Functional"
    description="Login saves the session in the store; reloading the page keeps it; logging out deletes it and redirects to /login."
  />
  <Card
    title="Structure"
    description="Each store in its folder (shared/store or features/<x>/store), with types separated into data and actions."
  />
  <Card
    title="Performance"
    description="All components use selectors; NotificationCreator does not re-render when a notification arrives."
  />
  <Card
    title="Evidence"
    description="Screenshot of Redux DevTools with the session/hydrated, session/setToken and session/clear actions."
  />
</CardGrid>

### Optional Challenges

- **Mark as read:** add a dropdown menu with the notification list and the `markRead` and `markAllRead` buttons.
- **Persist notifications:** apply `persist` with `partialize` to the notifications store and decide whether they should survive logout (hint: `subscribe` and `setState` from [lesson 4](./04-capacidades-de-zustand.md#5-outside-react-subscriptions-and-testing)).
- **Light and dark theme:** create `shared/store/ui.store.ts` with the theme and a `toggleTheme` action.
- **Respond to 401:** if `apiFetch` receives a `401`, call `clearSession()` and let the `AuthGuard` kick the user out.

---

## Self-Assessment Quiz

<Quiz id="dedw-s13-05-caso-practico-sesion-notificaciones-quiz">
  <Question title="Why is the session store located in shared/store and not in features/auth?">
    <Option>Because Zustand only allows stores inside shared.</Option>
    <Option correct>Because the shared HTTP client needs the token and shared must not depend on a feature.</Option>
    <Option>Because features/ does not accept TypeScript files.</Option>
    <Option>Because the session store must run on the server.</Option>
  </Question>
  <Question title="Why does api.ts use useSessionStore.getState() instead of calling the hook?">
    <Option>Because getState() is faster than the hook.</Option>
    <Option correct>Because apiFetch is not a component and hooks can only be called inside components.</Option>
    <Option>Because the hook cannot read the token.</Option>
    <Option>Because getState() subscribes the function to store changes.</Option>
  </Question>
  <Question title="What is the hasHydrated flag in the session store for?">
    <Option>To save the token in localStorage.</Option>
    <Option correct>So that AuthGuard knows the session has already been restored and does not redirect to login too early.</Option>
    <Option>To prevent the token from being sent to the backend.</Option>
    <Option>To reset the store when the user logs out.</Option>
  </Question>
  <Question title="What improvement does the AuthGuard with selectors bring compared to the week 12 one?">
    <Option>It no longer needs useEffect.</Option>
    <Option>It works as a Server Component.</Option>
    <Option correct>It automatically reacts if the token is deleted from another part of the application, instead of checking only when it mounts.</Option>
    <Option>It prevents the user from being able to log out.</Option>
  </Question>
  <Question title="What is expected to be seen in Redux DevTools when logging out?">
    <Option>A session/hydrated action and the token intact.</Option>
    <Option correct>A session/clear action with the token set to null.</Option>
    <Option>No action, because persist prevents recording changes.</Option>
    <Option>An addNotification action with the token as payload.</Option>
  </Question>
</Quiz>
