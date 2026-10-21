---
sidebar_position: 3
description: "Understand why state lives in State, how setState rebuilds the widget tree, and how to handle the first user interaction."
---

import Tabs from '@theme/Tabs';
import TabItem from '@theme/TabItem';

# StatefulWidget and Tree Rebuild

Up to this point in the course, all screens and components you built have been **static and immutable** using `StatelessWidget`. However, real-world applications must respond to user events: pressing buttons, typing into text fields, toggling switches, and loading dynamic data.

In this session, you will master the mathematical and architectural foundations of state management in Flutter, why state lives in a separate class (`State<T>`), and how internal tree rebuilding operates via `setState()`.

---

## 1. The Fundamental Equation of Declarative Frontend

In modern frontend frameworks (Flutter, React, SwiftUI), the user interface is not modified by directly mutating visual elements in memory as in JavaFX or the JavaScript DOM. Instead, it adheres to a strict mathematical equation:

$$UI = f(state)$$

* **$state$ (State):** The information and data describing the current runtime state of the application at any given point in time (for example: a numeric counter at `0`, a boolean `isLoading: true`, or a list of contacts).
* **$f$ (Render Function):** The `build(BuildContext context)` method. It is a declarative function describing how the user interface should look given that data.
* **$UI$ (User Interface):** The visible pixels drawn on screen by Flutter's graphics engine (Impeller or Skia) at 60 or 120 frames per second.

When state changes, the framework re-evaluates function $f$ and efficiently updates the graphic elements on screen.

---

## 2. Why Does State Live in `State` and Not in the `Widget`?

One of the most frequent questions students ask when learning Flutter is: *Why does a `StatefulWidget` require two separate classes instead of just one?*.

![StatelessWidget vs StatefulWidget Structure](/img/seminario-de-i-d-i/stateless-vs-stateful-arquitectura.svg)

The answer lies in the framework's memory and performance optimizations:

1. **The `Widget` class is `@immutable` (Immutable and Ephemeral):**
   * In Flutter, widgets are lightweight UI configuration blueprints.
   * When changes occur, Flutter can destroy and instantiate thousands of widgets per second with virtually zero memory overhead.
   * If mutable variables lived directly inside the widget, they would be lost every time the parent widget rebuilt.

2. **The `State<T>` class is Persistent and Mutable:**
   * The `State` object remains alive in RAM for as long as the screen is presented to the user.
   * It holds mutable fields (for example: `int _counter = 0;`).
   * It is not destroyed when the outer widget is recreated; it persists and retains active runtime data.

---

## 3. Flutter's Three Trees and `dirty` Marking

To understand what actually happens when an application state changes, we must understand the **three parallel trees** Flutter manages internally:

![Flutter Three Trees and Dirty Marking after setState](/img/seminario-de-i-d-i/arbol-widgets-elements-reconstruccion.svg)

1. **Widget Tree:** The declarative blueprint. Immutable, recyclable, and extremely inexpensive to create.
2. **Element Tree:** The persistent structural tree. `Elements` represent actual runtime nodes in memory and hold references to `State` objects.
3. **RenderObject Tree:** Objects calculating layout geometries, box constraints, and issuing direct painting instructions to the GPU.

### What does `setState()` do under the hood?

When you invoke `setState(() { ... })`, the following exact steps take place:
1. It executes the synchronous function passed as an argument, mutating your internal state variable (e.g., `_counter++`).
2. It internally calls `markNeedsBuild()` on the corresponding `Element`.
3. The `Element` is flagged as **`dirty`**.
4. On the next screen refresh cycle (*frame*), Flutter walks through elements marked as `dirty` and invokes their `build()` method.
5. **Rebuild scope:** Only the subtree descending from that stateful widget is rebuilt. Sibling or ancestor widgets are not recomputed, and those marked with `const` are reused directly by the framework.

---

## 4. Didactic Experiment: Tracing with `debugPrint`

The clearest way to verify rebuilding behavior is to insert a console print statement inside the `build()` method.

<Tabs>
<TabItem value="codigo" label="Counter with DebugPrint" default>

```dart title="lib/pages/counter_page.dart" showLineNumbers
import 'package:flutter/material';

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

Notice that every time `setState()` mutates the variable, the `build()` method runs from top to bottom to regenerate the new visual description with the updated number.

</TabItem>
</Tabs>

---

## 5. First User Interaction: Functions and Callbacks

In Flutter, buttons and interactive events receive **functions as parameters** through properties such as `onPressed` or `onTap`:

1. **Reference to an existing method:** `onPressed: _incrementCounter`. Pass the method name without parentheses so Flutter invokes it when the click occurs.
2. **Anonymous lambda function:** `onPressed: () { setState(() => _counter++); }`. Best for concise one-line operations.
3. **Disabled state (`null`):** Passing `onPressed: null` causes the Material framework to automatically render the button in an inactive disabled grey style and ignore touch inputs.

:::caution[Critical Antipattern with setState()]
Never place heavy asynchronous calls (such as `await http.get()`) directly inside a `setState()` block. Only immediate, synchronous memory assignments belong inside the callback:

```dart title="setState antipattern"
// INCORRECT: Blocks the render pipeline!
setState(() async {
  final data = await api.get();
  _list = data;
});

// CORRECT:
final data = await api.get();
if (mounted) {
  setState(() {
    _list = data;
  });
}
```
:::

---

## Self-Assessment Quiz

<Quiz id="seminario-s11-state-foundations-quiz">
  <Question title="Which mathematical equation defines the declarative paradigm in Flutter?">
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
