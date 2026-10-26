---
sidebar_position: 2
description: "Master horizontal navigation with NavigationBar in Flutter: the host Screen with state, IndexedStack and the key difference between setState and Navigator.push."
---

# Horizontal Navigation with BottomNavigationBar

In the previous chapter you saw that `Navigator` manages a **stack**: each new screen is pushed on top and *Back* pops it (hierarchical navigation, *drilling down*). But an app also has **main sections** (Courses, Saved, Profile) that the user jumps between with one tap, without going "deeper". That is **horizontal tab navigation**, and it **does not use the stack**.

In this chapter you will learn:
* Why switching tabs and opening a detail are **two different movements**, and which one to use in each case.
* The **host `Screen`** pattern: a single stateful widget that holds an index and decides which page to show.
* How **`IndexedStack`** keeps what the user typed in each tab.
* Which file holds each part of the code.

---

## 1. Two movements: horizontal and hierarchical

The golden rule of Flutter fits in one sentence:

> **Switching tabs is `setState`. Opening a detail is `push`.**

A very common mistake when starting out is using `Navigator.pushNamed` to switch between the bottom menu tabs, or the other way around, using `setState` to show the detail of a product. Try both movements on the phone and watch what happens to the **route stack** on the right:

<InteractiveFrame
  src="/interactive/seminario-de-i-d-i/semana-13/tabs-vs-push/index.html"
  title="Switching tabs versus opening a detail: what happens to the route stack"
  height={640}
/>

| Criterion | Switching tabs (`setState`) | Opening a detail (`Navigator.push`) |
| :--- | :--- | :--- |
| **Direction** | **Horizontal**: between sibling sections. | **Hierarchical**: from a summary to a specific item. |
| **Route stack** | **Does not change**: it stays at one route (`MainScreen`). | **Grows**: a new route is pushed. |
| **Bottom bar** | **Always visible.** | **Covered** by the new screen. |
| **Back button** | **Does not exist**: there is no parent-child relationship. | **Automatic**: the `AppBar` draws the arrow (`pop`). |

To decide in a new case, ask yourself these questions in order:

```
Is it a main section the user will come back to often?
   ├── YES ──> Tab (NavigationBar + setState).
   └── NO  ──> Does it come from tapping an item to view or edit it?
                 ├── YES ──> Navigator.push / pushNamed (covers the screen).
                 └── NO  ──> Is it a quick action or a confirmation?
                               └── showModalBottomSheet or showDialog.
```

---

## 2. The host Screen: an index that decides what is shown

Tabs need two different roles:

* **Host `Screen` (`MainScreen`):** a `StatefulWidget` with the root `Scaffold`, the bottom bar and **a single state variable: `int _selectedIndex`**.
* **Content `Page` (`CursosPage`, `GuardadosPage`, `PerfilPage`):** widgets that draw only the **body** of each section. They **do not declare their own `Scaffold`** or another bar: they return columns, lists or containers.

When a tab is tapped, the bar callback (`onDestinationSelected`) calls `setState` with the new index; `build()` runs again and the `body` shows the matching page.

:::tip[Material 3: NavigationBar]
In modern Flutter, **`NavigationBar`** with **`NavigationDestination`** children is recommended. It is the successor of `BottomNavigationBar` (pill-shaped indicator, better contrast), and both share the same mental model: an index and `setState`.
:::

### Keeping state: `IndexedStack` versus the direct list

There are two ways to write the `body`, and they behave differently:

* `_paginas[_selectedIndex]`: only the chosen page exists. When you switch tabs the previous one **is destroyed** and, when you return, it is born again: whatever the user had typed or their scroll position is lost.
* `IndexedStack(index: _selectedIndex, children: _paginas)`: **all pages stay mounted** and only one is shown. What was typed and the scroll are kept.

Type something in "Buscar", switch tabs and come back; then toggle between the two forms and repeat:

<InteractiveFrame
  src="/interactive/seminario-de-i-d-i/semana-13/bottom-nav-anfitriona/index.html"
  title="Host screen: the State index and the pages kept alive with IndexedStack"
  height={600}
/>

---

## 3. The code, file by file

The project separates each role into its own folder:

```
lib/
├── main.dart                        # starts the app: MaterialApp(home: MainScreen())
├── screens/                         # full screens (they have a Scaffold)
│   ├── main_screen.dart             #   the host: _selectedIndex + NavigationBar
│   └── detalle_curso_screen.dart    #   the detail, opened with push
└── pages/                           # tab bodies (no Scaffold)
    ├── cursos_page.dart
    ├── guardados_page.dart
    └── perfil_page.dart
```

The difference between the two folders is the same as in the previous section: a **screen** is a full screen with its `Scaffold`; a **page** is just the content the host places in its `body`.

Tap a tab or a course on the phone and see which file opens and which line runs; or press **▶** in the code and watch the phone and the stack change. With the **cambiar a lista directa** button (in `main_screen.dart`) you can check what is lost without `IndexedStack`.

<InteractiveFrame
  src="/interactive/seminario-de-i-d-i/semana-13/tabs-codigo/index.html"
  title="Dart code by file linked to the phone and the route stack for tab navigation"
  height={680}
/>

---

## 4. Best Practices and Common Mistakes

1. **Do not nest `Scaffold` needlessly:** if the host already has the `Scaffold` with its bottom bar, the `Page` widgets do not need another one, unless a tab requires its own `FloatingActionButton` or background.
2. **Use `IndexedStack` when a tab has state that matters:** half-filled forms, scrolled lists or pagination. It costs more memory, but it prevents the user from losing their place.
3. **The detail always covers the bottom bar:** if the user opens a product, the bar should not compete for attention; the detail's `Scaffold` covers it thanks to `Navigator.push`.
4. **A tab is not opened with `pushNamed`:** it would push a copy of the host on every tap and *Back* would have to undo them one by one.

---

## 5. Self-Assessment Questions

<Quiz id="quiz-bottom-nav-horizontal">
  <Question title="Why does switching tabs in a NavigationBar not increase the depth of the Navigator stack?">
    <Option correct>Because no route is pushed: only setState runs on the host and its body shows another page.</Option>
    <Option>Because Flutter stores the tabs on disk instead of in memory.</Option>
    <Option>Because the bar automatically runs pop() before showing the new tab.</Option>
    <Option>Because each tab is a different app with its own Navigator.</Option>
  </Question>

  <Question title="What is the advantage of IndexedStack over _paginas[_selectedIndex] in the body?">
    <Option>It cuts memory use in half by discarding the invisible pages.</Option>
    <Option correct>It keeps all pages mounted, so what was typed and the scroll of each tab are preserved.</Option>
    <Option>It adds flip animations between tabs with no extra code.</Option>
    <Option>It avoids having to call setState when switching tabs.</Option>
  </Question>

  <Question title="What does the host Screen's State keep in order to know which page to show?">
    <Option>A reference to the Navigator and the current route.</Option>
    <Option>The list of pages already visited, so it can go back to them.</Option>
    <Option correct>An integer (_selectedIndex) with the position of the chosen tab.</Option>
    <Option>Nothing: the bottom bar remembers the tab on its own.</Option>
  </Question>

  <Question title="The user taps a contact in the list to see their full profile with an edit button. What should you use?">
    <Option>Change the bar index with setState to show the contact in a hidden tab.</Option>
    <Option correct>Navigator.push (or pushNamed): the detail is hierarchical, covers the bottom bar and offers the back arrow.</Option>
    <Option>pushNamedAndRemoveUntil with (route) => false.</Option>
    <Option>showDialog, because a detail is always a pop-up window.</Option>
  </Question>

  <Question title="Which folder does CursosPage belong in, and what distinguishes it from a screen?">
    <Option>screens/: because every class that extends StatelessWidget is a screen.</Option>
    <Option>models/: because it contains the course data.</Option>
    <Option correct>pages/: it is only the body of a tab and does not declare its own Scaffold.</Option>
    <Option>routes/: because every tab needs a route name.</Option>
  </Question>
</Quiz>
