---
sidebar_position: 3
description: "Understand what state is, how a StatefulWidget is structured, what setState does, and how Flutter updates the widget tree."
---

import Tabs from '@theme/Tabs';
import TabItem from '@theme/TabItem';

# StatefulWidget and Tree Rebuild

Up to this point in the course, all screens and components you built have been **static and immutable** using `StatelessWidget`. However, real-world applications must respond to user events: pressing buttons, typing into text fields, toggling switches, and loading dynamic data.

In this session you will learn **what state is**, how a `StatefulWidget` is organized (and why it takes two classes), what exactly `setState()` does, and how Flutter decides which part of the screen to update.

:::note[About the interactive pieces]
The interactive simulators in this chapter use the course's Spanish identifiers (for example `_contador`, which is `_counter` in the code samples below).
:::

---

## 1. What Is State?

**State** is any piece of data that **changes over time** and that decides **how the interface looks** at a given moment.

| Example | Is it state? | Why |
| :--- | :---: | :--- |
| A click counter (`int _counter`) | Yes | It changes with every tap and the screen must show it. |
| The text the user types into a field | Yes | It changes while typing. |
| A list of contacts | Yes | It grows and shrinks as items are added or removed. |
| An `isLoading` flag | Yes | It toggles between loading and loaded. |
| The fixed title `const Text('Agenda')` | No | It never changes: it is configuration, not state. |

In modern frontend frameworks (Flutter, React, SwiftUI), the interface is not modified by directly touching visual elements, as in JavaFX or the JavaScript DOM. Instead, the interface is **the result of a function** that receives the state:

$$UI = f(state)$$

* **$state$ (State):** the data describing the application at a given instant (a counter at `0`, a boolean `isLoading: true`, a list of contacts).
* **$f$ (Render Function):** the `build(BuildContext context)` method. It describes how the interface should look given that data.
* **$UI$ (User Interface):** the visible pixels drawn on screen by Flutter's graphics engine (Impeller or Skia) at 60 or 120 frames per second.

When state changes, Flutter re-evaluates function $f$ and updates what you see. Your job is to **change the state**; the framework redraws.

:::tip[Key idea]
A `StatelessWidget` can only display what its parent hands to it: it has nowhere to keep data that changes. For a widget to **remember and change** something by itself, you need a `StatefulWidget`.
:::

---

## 2. Anatomy of a StatefulWidget

One of the most frequent questions when learning Flutter is: *why does a `StatefulWidget` require two classes instead of just one?* Walk through the parts of this chapter's counter to find out:

<iframe
  src="/interactive/seminario-de-i-d-i/semana-11/anatomia-stateful/index.html"
  title="Interactive anatomy of a StatefulWidget: Widget class, State class, the state, build and setState"
  style={{ width: '100%', height: 1030, border: 0 }}
  loading="lazy"
/>

The answer lies in how Flutter manages memory and performance:

1. **The `Widget` class is `@immutable` (immutable and ephemeral):**
   * Widgets are lightweight UI configurations (blueprints).
   * When something changes, Flutter can discard and recreate thousands of widgets per second with no noticeable impact.
   * If mutable variables lived inside the widget, they would be lost every time the parent widget rebuilt.

2. **The `State<T>` class is persistent and mutable:**
   * The `State` object stays alive in memory while the screen is present in the tree.
   * It holds the mutable fields (for example `int _counter = 0;`).
   * It is not destroyed when the outer widget is recreated: it survives and keeps the data.

| | `StatelessWidget` | `StatefulWidget` |
| :--- | :--- | :--- |
| **Classes** | 1 (just the widget) | 2 (the `Widget` and its `State`) |
| **Memory between rebuilds** | None | The `State` object persists |
| **Where `build()` lives** | In the widget itself | In the `State` class |
| **Can it change by itself?** | No: only if its parent passes new data | Yes, with `setState()` |

---

## 3. What Does `setState()` Do?

`setState()` is how you **tell Flutter that the state changed** and that it must run `build()` again. Changing a variable and notifying the framework are two different things, and `setState` does both.

Tap the phone's buttons and follow the full journey. Pay special attention to two moments: the instant the inspector already says `1` while the screen still shows `0`, and the **Sumar sin avisar** ("add without notifying") case:

<iframe
  src="/interactive/seminario-de-i-d-i/semana-11/setstate-en-accion/index.html"
  title="Interactive setState simulation on a counter: from the tap to build"
  style={{ width: '100%', height: 860, border: 0 }}
  loading="lazy"
/>

When you call `setState(() { ... })`, the following happens, in order:

1. **It runs your function** immediately and synchronously: that is where you change the state variable (for example `_counter++`).
2. **It marks the `Element` as `dirty`:** internally it calls `markNeedsBuild()`. This is only a flag; nothing is rebuilt yet.
3. **It schedules the rebuild:** on the next screen refresh cycle (*frame*) Flutter looks for `dirty` elements and runs their `build()`.
4. **Rebuild scope:** only the subtree descending from the stateful widget is rebuilt. Ancestors and sibling widgets are not rebuilt, and widgets marked `const` are reused.

:::warning[Changing the variable is not the same as notifying]
If you do `_counter++` **outside `setState`**, the data changes but Flutter does not find out: the screen keeps showing the previous value. Worse, when another `setState` later triggers a `build()`, the screen "jumps" to the accumulated value and the bug seems intermittent.
:::

---

## 4. The Update Tree: Flutter's Three Trees

To understand what is recreated and what is kept when you call `setState`, you need to know the **three parallel trees** Flutter maintains. The following piece follows **a single `Text`** through all three:

<InteractiveFrame
  src="/interactive/seminario-de-i-d-i/semana-11/tres-arboles/index.html"
  title="Flutter's three trees: widgets, elements and render objects, and what is kept during a setState"
  height={780}
/>

1. **Widget Tree:** the declarative description you write in `build()`. It is immutable and cheap to create: it is created again on every rebuild.
2. **Element Tree:** the living nodes of the application. Each `Element` represents a widget at a specific position in the tree and **persists across rebuilds**; the `Element` of a `StatefulWidget` is the one holding the `State` object.
3. **RenderObject Tree:** the objects that compute sizes and positions (*box constraints*) and paint on screen. They also persist: when something changes they are updated and repainted.

The key to the whole mechanism is this: after a `setState`, `build()` creates **new** widgets, but Flutter compares each new widget with the previous one; if they have the same type and the same position it **reuses the `Element`** and the `RenderObject` and only hands them the new configuration. Creating widgets is cheap; the expensive parts (nodes, size computation, painting) are reused.

---

## 5. Didactic Experiment: Tracing with `debugPrint`

The clearest way to verify rebuilding behavior is to insert a console print statement inside the `build()` method. It is the same thing the **Consola** panel of the simulator above shows.

<Tabs>
<TabItem value="codigo" label="Counter with DebugPrint" default>

```dart title="lib/pages/counter_page.dart" showLineNumbers
import 'package:flutter/material.dart';

// 1. WIDGET CLASS (Immutable and bound to its State)
class CounterPage extends StatefulWidget {
  const CounterPage({super.key});

  @override
  State<CounterPage> createState() => _CounterPageState();
}

// 2. STATE CLASS (Persistent in memory and mutable)
class _CounterPageState extends State<CounterPage> {
  int _counter = 0;

  void _incrementCounter() {
    setState(() {
      _counter++;
    });
  }

  void _resetCounter() {
    setState(() {
      _counter = 0;
    });
  }

  @override
  Widget build(BuildContext context) {
    // EXPERIMENT: Executes whenever the node is flagged dirty
    debugPrint('--> [FRAME RENDER] build() executed. Current value: $_counter');

    return Padding(
      padding: const EdgeInsets.all(24.0),
      child: Column(
        mainAxisAlignment: MainAxisAlignment.center,
        crossAxisAlignment: CrossAxisAlignment.stretch,
        children: [
          // CONST Widget: Flutter reuses it without recomputing CPU cycles
          const Text(
            'Number of Clicks Registered:',
            textAlign: TextAlign.center,
            style: TextStyle(fontSize: 16, color: Colors.grey),
          ),
          const SizedBox(height: 12),
          Text(
            '$_counter',
            textAlign: TextAlign.center,
            style: const TextStyle(
              fontSize: 48,
              fontWeight: FontWeight.bold,
              color: Color(0xFF5454E9),
            ),
          ),
          const SizedBox(height: 32),
          FilledButton.icon(
            onPressed: _incrementCounter,
            icon: const Icon(Icons.add),
            label: const Text('Increment Counter'),
          ),
          const SizedBox(height: 12),
          OutlinedButton.icon(
            onPressed: _resetCounter,
            icon: const Icon(Icons.refresh),
            label: const Text('Reset to Zero'),
          ),
        ],
      ),
    );
  }
}
```

</TabItem>
<TabItem value="salida" label="Debug Console Output">

When running the application and clicking the increment button twice, the Dart terminal displays:

```text
flutter: --> [FRAME RENDER] build() executed. Current value: 0
flutter: --> [FRAME RENDER] build() executed. Current value: 1
flutter: --> [FRAME RENDER] build() executed. Current value: 2
```

Notice that every time `setState()` marks the element as `dirty`, the `build()` method runs from top to bottom to regenerate the new visual description with the updated number.

</TabItem>
</Tabs>

---

## 6. First User Interaction: Functions and Callbacks

In Flutter, buttons and interactive events receive **functions as parameters** through properties such as `onPressed` or `onTap`:

1. **Reference to an existing method:** `onPressed: _incrementCounter`. Pass the method name without parentheses so Flutter invokes it when the click occurs.
2. **Anonymous lambda function:** `onPressed: () { setState(() => _counter++); }`. Best for concise one-line operations.
3. **Disabled state (`null`):** passing `onPressed: null` causes the Material framework to render the button in an inactive grey style and ignore touch inputs.

:::caution[Antipattern with setState(): an asynchronous function]
The function that `setState()` receives must be **synchronous** and contain only the state assignments. If you declare it `async`, Flutter throws an assertion in debug mode (*"setState() callback argument returned a Future"*), because the change would happen after `setState` has already finished marking the element. Do the asynchronous work first and then call `setState` with the assignment:

```dart title="setState antipattern"
// INCORRECT: the setState function cannot be async
setState(() async {
  final data = await api.get();
  _list = data;
});

// CORRECT: asynchronous work first, then the synchronous change
final data = await api.get();
if (mounted) {
  setState(() {
    _list = data;
  });
}
```

The `mounted` check avoids calling `setState` if the user already left the screen while the request was in flight.
:::

---

## Self-Assessment Quiz

<Quiz id="seminario-s11-state-foundations-quiz">
  <Question title="Which formula defines the declarative paradigm in Flutter?">
    <Option>State = f(UI)</Option>
    <Option correct>UI = f(state)</Option>
    <Option>Widget = Element + RenderObject</Option>
    <Option>Scaffold = AppBar * Page</Option>
  </Question>

  <Question title="Why do mutable state variables in a StatefulWidget live in the State class rather than in the Widget?">
    <Option>Because Dart disallows declaring variables in any class named Widget.</Option>
    <Option correct>Because the Widget class is immutable (@immutable) and frequently discarded, while the State object persists in the Element Tree retaining data in memory.</Option>
    <Option>Because the Android operating system removes all public classes every 5 seconds.</Option>
    <Option>To force developers to write twice as many lines of code.</Option>
  </Question>

  <Question title="What occurs internally in the element tree when the setState() method is called?">
    <Option>The application restarts completely, returning to main.dart.</Option>
    <Option>The mobile device cache memory is erased.</Option>
    <Option correct>The corresponding Element is marked with the dirty flag, scheduling the execution of its build() method on the next refresh frame.</Option>
    <Option>A Flutter SDK update is downloaded from the Internet.</Option>
  </Question>

  <Question title="A method does _counter++ but never calls setState(). What happens?">
    <Option>Flutter detects the variable change and rebuilds the screen automatically.</Option>
    <Option>The application throws an exception and closes.</Option>
    <Option correct>The data changes in memory, but no Element becomes dirty and no build() runs: the screen keeps showing the previous value until another setState rebuilds it.</Option>
    <Option>The value reverts to the previous one when the method ends.</Option>
  </Question>

  <Question title="After a setState, build() creates new widgets. What does Flutter do with the existing Element and RenderObject?">
    <Option>It destroys them and creates new ones on every rebuild.</Option>
    <Option correct>It reuses them when the new widget has the same type and position as the previous one, and only hands them the updated configuration.</Option>
    <Option>It copies them into the Widget Tree so they become immutable.</Option>
    <Option>It freezes them until the user closes the application.</Option>
  </Question>

  <Question title="If we place the const keyword before a child widget inside the build() method, how does Flutter handle it during a rebuild?">
    <Option>It raises an immediate compilation error due to type conflicts.</Option>
    <Option correct>It reuses the identical existing memory instance without rebuilding it, optimizing CPU performance.</Option>
    <Option>It automatically converts the widget into a StatefulWidget.</Option>
    <Option>It doubles the size of the widget on the emulator screen.</Option>
  </Question>

  <Question title="What happens when you assign null to the onPressed property of a FilledButton?">
    <Option>The application throws a NullPointerException.</Option>
    <Option>The button disappears completely from the screen.</Option>
    <Option correct>The button is automatically disabled, adopting Material Design's inactive visual style and blocking touch events.</Option>
    <Option>The button turns into a flashing red color.</Option>
  </Question>
</Quiz>
