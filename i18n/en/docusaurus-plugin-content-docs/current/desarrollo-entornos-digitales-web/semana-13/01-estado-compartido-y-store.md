---
sidebar_position: 1
description: "Understand what state is in an interface, why sharing it between components gets complicated and what problem a global store solves before using Zustand."
---

# Shared State: The Problem a Store Solves

In week 12 we built a login with `useState`, stored the token in `localStorage` and protected routes with an `AuthGuard`. It works, but every screen that needs to know **who the user is** has to read `localStorage` on its own, and no component finds out when the session changes.

Before installing any library it is worth understanding the problem precisely. A state tool is chosen well only when you know which pain it removes. In this lesson we go from the simplest case (`useState`) to the point where a **global store** stops being a luxury.

---

## 1. What Is State

**State** is the information that changes over time and on which what you see on screen depends. When the state changes, React draws the interface again.

Not all state is the same type, and mixing them up is the source of most tangles:

| Type | Example in our app | Where it should live |
| :--- | :--- | :--- |
| **Local to a component** | Text typed in the login input, whether a menu is open | `useState` inside the component |
| **Shared between components** | Authenticated user, notifications, cart, visual theme | A store (what we will see this week) |
| **From the server** (*server state*) | List of users returned by `GET /users` | A data layer (fetch, cache); it is not the same as UI state |
| **From the URL** | Search filters, current page, route `id` | The URL itself (`searchParams`, `params`) |

:::tip[Rule of thumb]
Always start with the **most local state possible**. Lift it only when two components that are not parent and child need the same data.
:::

---

## 2. How State Travels in React

Walk through the component tree of a page. You will see where state lives, how it is lifted to the common ancestor (*lifting state up*), why *prop drilling* appears and what `Context` achieves (and what it does not).

:::note[The interactive graphics are in Spanish]
The interactive pieces of this chapter are shared with the Spanish version and keep their Spanish text. The example uses the gym routines domain from Computación en Internet 3.
:::

<InteractiveFrame
  src="/interactive/computacion-3/semana-12/arbol-estado/index.html"
  title="How state travels through the component tree"
  height={700}
/>

The essentials of that walkthrough:

1. **Data only goes down** the tree (from parent to child, as `props`). There is no sideways path between branches.
2. **Lifting the state** to the common ancestor solves the first problem, but forces you to pass `props` through components that do not use them (*prop drilling*).
3. **Context** takes a direct jump, but when its `value` changes **all** consumers are rendered again, even if they only care about one part.

---

## 3. A Concrete Problem: The User Session

Think about the login case study application from week 12. The session is needed by:

- The `AuthGuard`, to decide whether to let the user in.
- The navigation bar, to show the name and the "Log out" button.
- The dashboard, to request `GET /users` with the token.
- Any form that signs a request.

With what we know so far there are three ways out, all with a cost:

```tsx title="Three ways to share the session" showLineNumbers
// 1. Props: the data goes down through every intermediate (prop drilling)
<AppLayout user={user}>
  <Navbar user={user} />        {/* Navbar only forwards it */}
</AppLayout>

// 2. Context: a Provider and useContext, but every consumer re-renders
<AuthContext.Provider value={{ user, token, login, logout }}>
  <App />
</AuthContext.Provider>

// 3. localStorage directly (what we did in week 12): nobody finds out about the change
const token = session.getToken();
```

None is wrong. What happens is that as the app grows, each one accumulates debt: repeated `props`, re-renders you cannot see, or screens that do not update when you log out somewhere else in the app.

---

## 4. What Is a Global Store

A **store** is an object that lives **outside** the component tree and keeps two things together:

1. The shared **state** (`user`, `token`, `notifications`).
2. The **actions** that modify it (`login()`, `logout()`, `addNotification()`).

Any component **subscribes** to the part it cares about and React draws it again only when that part changes.

> **Analogy:** the faculty bulletin board. Anyone can go and read the notice they care about, and when the coordination office changes a notice, only the people who were looking at that notice find out. Nobody carries the paper by hand to every classroom.

What changes compared to the previous approaches:

| Before | With a store |
| :--- | :--- |
| Data goes down through `props` | The component reads it **directly** from the store |
| Changes go up through callbacks | The component calls the store **action** |
| Context re-renders everyone | Each component subscribes only to what it uses (selectors) |
| State lives in the tree | State lives **outside**, and survives a component unmounting |

### When It Is NOT Needed

A global store is not the answer to everything. Do not use it for:

- The value of an input while the user types (it is local state).
- Data from the server that is requested again on every screen (that is *server state*; a store can hold it, but it does not replace a cache strategy).
- Something used only by one component and its direct children.

---

## 5. The Week at a Glance

This week we walk the path in this order:

<StepByStep>
  <Step number="1" title="Concept: the store and its flow">
    What Zustand is, what a store looks like, what `set` is, what a selector is and how it compares with Redux and Context. See [Zustand Concepts](./02-zustand-conceptos.md).
  </Step>
  <Step number="2" title="Setup in Next.js">
    Installation, typing with TypeScript, store location by feature, `'use client'` and the care needed with the server. See [Zustand Setup](./03-configuracion-zustand-nextjs.md).
  </Step>
  <Step number="3" title="Capabilities">
    Selectors, `useShallow`, async actions, middleware (`devtools`, `persist`, `immer`) and use outside React. See [Zustand Capabilities](./04-capacidades-de-zustand.md).
  </Step>
  <Step number="4" title="Practical case">
    We migrate the week 12 session to a store with persistence and build a notification system. See [Practical Case](./05-caso-practico-sesion-y-notificaciones.md).
  </Step>
</StepByStep>

---

## Self-Assessment Quiz

<Quiz id="dedw-s13-01-estado-compartido-y-store-quiz">
  <Question title="Which type of state should keep living inside the component itself with useState?">
    <Option>The user session that the navigation bar and the dashboard consult.</Option>
    <Option correct>The text the user is typing in a login form input.</Option>
    <Option>The list of notifications shown on several screens.</Option>
    <Option>The token that must be attached to every HTTP request.</Option>
  </Question>
  <Question title="What problem does Context have when the value of its Provider changes?">
    <Option>It prevents child components from using useState.</Option>
    <Option>It forces the component to become a Server Component.</Option>
    <Option correct>All components that consume that context render again, even if they only use part of the value.</Option>
    <Option>It deletes the state of the components that do not consume it.</Option>
  </Question>
  <Question title="What does a global store keep?">
    <Option>Only the data, because functions must live in the components.</Option>
    <Option correct>The shared state and the actions that modify it, outside the component tree.</Option>
    <Option>Only the data that comes from the server.</Option>
    <Option>A copy of the DOM to avoid rendering again.</Option>
  </Question>
  <Question title="Which of these cases does NOT justify a global store?">
    <Option>The authenticated user, used by the guard, the navbar and the dashboard.</Option>
    <Option>The shopping cart, visible in the header and on the checkout page.</Option>
    <Option correct>Whether a dropdown menu is open or closed, when only that component uses it.</Option>
    <Option>The notifications, emitted on one screen and read on another.</Option>
  </Question>
</Quiz>
