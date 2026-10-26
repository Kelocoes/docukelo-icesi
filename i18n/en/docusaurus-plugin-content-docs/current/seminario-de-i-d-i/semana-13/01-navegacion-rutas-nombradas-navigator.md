---
sidebar_position: 1
description: "Learn the Navigator navigation model and named routes in Flutter: pushNamed, pop with data return and pushNamedAndRemoveUntil."
---

# Navigation with Navigator and Named Routes

In mobile apps, moving between screens is not like changing a web page: it means managing a **stack in memory (*Route Stack*)**. Each new screen is placed on top of the previous one, keeping the state of the earlier views until the user decides to go back or the app decides to restructure the history.

In this session we cover the classic imperative navigation of Flutter (`Navigator` 1.0) using **named routes** (`routes`) configured in the `MaterialApp` widget, including:
* What a stack is and how it differs from a queue.
* The push cycle (`pushNamed`) and the pop cycle (`pop`).
* How to organize screens and routes into folders.
* Two-way data transfer: passing arguments forward and capturing results asynchronously with `await`.
* Wiping the stack in authentication or logout flows with `pushNamedAndRemoveUntil`.

---

## 1. What is a stack?

Before talking about screens, the concept: a **stack** is a collection where items are added and removed from **one end only**, the **top**. The last item in is the first item out: **LIFO** (*Last-In, First-Out*), like a stack of plates.

A **queue** works the opposite way: items are added at the back and removed from the front, so the first item in is the first item out: **FIFO** (*First-In, First-Out*), like a line at a bank.

Add several items and remove them from each structure. Compare the order in which they come out.

<InteractiveFrame
  src="/interactive/seminario-de-i-d-i/semana-13/pila-vs-cola/index.html"
  title="Stack (LIFO) versus queue (FIFO): the exit order of the same items"
  height={560}
/>

---

## 2. Navigating means stacking screens

Flutter uses a stack for screens. The `Navigator` widget keeps a stack of **routes** (`Route`): each one is a screen with its name and its arguments. Only the **top** route is visible; the ones below stay alive, covered.

* **`pushNamed`** pushes a new route. The ones below keep their `State` (typed text, scroll).
* **`pop`** removes the top one and releases its `State`. The one below reappears just as it was.

The phone is on the left and the route stack on the right. Watch how it changes with every tap.

<InteractiveFrame
  src="/interactive/seminario-de-i-d-i/semana-13/navegacion-pila/index.html"
  title="Phone and route stack: how the stack changes when navigating with pushNamed and pop"
  height={700}
/>

:::info[With a single route there is nowhere to go back to]
`canPop()` is `false` at the base of the stack: Back closes the app. If there is more than one route, the `AppBar` of a `Scaffold` draws the back arrow by itself and wires it to `Navigator.pop`.
:::

---

## 3. Named Routes Configuration in `MaterialApp`

To enable named routes, you define a `Map<String, WidgetBuilder>` in the `routes` property of `MaterialApp`. The key is the route text (by convention starting with `/`) and the value is a function that receives the `BuildContext` and returns the screen widget.

```dart title="lib/main.dart" showLineNumbers
MaterialApp(
  title: 'Contact Catalog',
  initialRoute: '/',
  routes: {
    '/': (context) => const HomeScreen(),
    '/detalle': (context) => const DetalleScreen(),
    '/seleccion': (context) => const SeleccionScreen(),
    '/login': (context) => const LoginScreen(),
  },
)
```

:::warning[home and initialRoute: '/' are incompatible]
If you declare the `'/'` route inside the `routes` map, you **must not declare the `home` property** in `MaterialApp`. Doing so throws an exception because of redundant route collision when the framework starts.
:::

### Project organization

An app with navigation is split into a few files, each with one responsibility:

```text
lib/
├── main.dart                  # entry point: runApp and MaterialApp
├── routes/
│   └── app_routes.dart        # route names and the routes table
├── screens/                   # one full screen per file
│   ├── catalogo_screen.dart
│   ├── detalle_screen.dart
│   └── editar_screen.dart
└── models/                    # data that travels between screens
    └── contacto.dart
```

* **`main.dart`:** it only starts the app and configures `MaterialApp`. It contains no screens.
* **`screens/`:** each screen in its own file, with a name ending in `Screen`. Some projects use `pages/`: it is the same thing. Pick one folder and use it throughout the project.
* **`routes/app_routes.dart`:** a separate file for the names (`'/detalle'`) and the `routes` table. In an app with 2 or 3 screens the map can stay in `main.dart`; move it to its own file when there are more routes or when several files write the same names, because a constant prevents typos.
* **`models/`:** the data classes (`Contacto`) that are sent as `arguments`.

The complete code, file by file, is in section 6.

---

## 4. Two-Way Information Transfer

Communication between screens in Flutter goes in two directions: data forward (*Forward*) when opening the screen, and data backward (*Backward*) when closing it.

### 4.1 Sending Arguments to the New Screen

When calling `Navigator.pushNamed`, you use the optional `arguments` parameter. Any Dart object can be sent (a `String`, a `Map`, or an instance of a data model):

```dart title="Sender: HomeScreen.dart" showLineNumbers
Navigator.pushNamed(
  context,
  '/detalle',
  arguments: Contacto(id: 'c1', nombre: 'Camila Rivera', rol: 'Tech Lead'),
);
```

In the receiving screen, the arguments are extracted inside the `build` method using `ModalRoute`:

```dart title="Receiver: DetalleScreen.dart" showLineNumbers
@override
Widget build(BuildContext context) {
  // Safe extraction and cast of the arguments
  final contacto = ModalRoute.of(context)!.settings.arguments as Contacto;

  return Scaffold(
    appBar: AppBar(title: Text(contacto.nombre)),
    body: Center(child: Text('Rol: ${contacto.rol}')),
  );
}
```

---

### 4.2 Returning a Result When Closing the Screen

To send information back to the originating screen:
1. The receiving screen passes the value as the second argument of `Navigator.pop(context, resultado)`.
2. The sending screen waits for the result asynchronously by putting `await` before `Navigator.pushNamed`.

```dart title="Sender with asynchronous capture" showLineNumbers
Future<void> _abrirSelector(BuildContext context) async {
  // 1. pushNamed returns a Future that completes when pop runs on the other screen
  final String? categoriaSeleccionada = await Navigator.pushNamed<String>(
    context,
    '/seleccion',
  );

  // 2. Safety check against asynchronous context leaks
  if (!context.mounted) return;

  // 3. Process the result if the user did not cancel
  if (categoriaSeleccionada != null) {
    ScaffoldMessenger.of(context)
      ..removeCurrentSnackBar()
      ..showSnackBar(SnackBar(content: Text('You selected: $categoriaSeleccionada')));
  }
}
```

```dart title="Receiver returning the result" showLineNumbers
ElevatedButton(
  onPressed: () {
    // Closes the screen and sends 'Diseño UI' to the screen that called push
    Navigator.pop(context, 'Diseño UI');
  },
  child: const Text('Choose UI Design'),
)
```

:::note[What if the user picks nothing?]
If the person leaves with the system Back button or the AppBar arrow, `pop` runs **without a value**: the `Future` of `pushNamed` completes with `null`. That is why the result type is `String?` and the code checks `if (categoriaSeleccionada != null)` before using it.
:::

:::danger[The Golden Rule: if (!context.mounted) return;]
Whenever you run an instruction that depends on `BuildContext` (`ScaffoldMessenger`, `Theme.of`, or a new `Navigator`) after an `await`, you must check `if (!context.mounted) return;`. If the user closed the screen while the asynchronous operation was running, using the detached `context` causes a runtime error.
:::

### Two-Way Data Pipeline

The following interactive diagram illustrates the flow of data between screens: watch the argument packet travel on `pushNamed`, the execution pause at the `await`, and the result coming back when `pop(context, resultado)` is called.

<InteractiveFrame
  src="/interactive/seminario-de-i-d-i/semana-13/paso-retorno-datos/index.html"
  title="Two-way data flow between screens with Navigator in Flutter"
  height={720}
/>

## 5. Restructuring the Stack with `pushNamedAndRemoveUntil`

There are flows where pushing screens one after another is wrong:
* **Authentication (Login):** After a successful login, the user must not be able to press "Back" and return to the credentials screen.
* **Logout:** All the private history must be removed from memory so the user cannot go back to data from the previous session.
* **Payment completion:** After confirming an order, the payment gateway and the cart must be discarded from the stack.

For these cases, Flutter provides `Navigator.pushNamedAndRemoveUntil`:

```dart title="Login: clear the stack"
Navigator.pushNamedAndRemoveUntil(
  context,
  '/home',
  (Route<dynamic> route) => false, // Removal predicate
);
```

### The Role of the Predicate

The third argument is a `RoutePredicate` function that evaluates each route in the stack from top to bottom:
* If the function returns `false`, that route is destroyed and discarded from memory.
* As soon as it returns `true`, the purge stops: that route and all the ones below it are kept.

Mind the order: first the **new route is pushed** (just like `pushNamed`) and then the previous ones are checked with the predicate. The new route is never removed: it always stays on top.

| Predicate | Behavior | Common Use Case |
| :--- | :--- | :--- |
| `(route) => false` | Removes **all** previous screens. The new screen becomes the only absolute root of the stack. | Completed login, logout, session token expiration. |
| `(route) => route.isFirst` | Removes all intermediate screens, keeping the root of the stack. It ends up as `[root, new]`. | Finishing a purchase flow: the stack becomes `[Home, Gracias]` and Back leads to Home. |
| `ModalRoute.withName('/home')` | Removes routes until it finds one with that name, which is kept. | Going back to a specific screen in the stack, even if it is not the first one. |

:::warning[isFirst keeps the root, not "Home" by name]
`route.isFirst` is `true` only for the **first** route in the stack. If Login was pushed with `pushNamed`, the root is Login, not Home, and `isFirst` would keep Login. In the comparator below, alternative C starts from a stack whose root is Home for exactly that reason. To keep a route by its name, use `ModalRoute.withName`.
:::

### Stack Strategy Comparator

With the "Alternativa" selector, compare what happens to the stack when logging out with `pushNamed` (anti-pattern), with `pushNamedAndRemoveUntil` and `(route) => false`, and when finishing a purchase with `(route) => route.isFirst`. In each case also try the system Back button.

<InteractiveFrame
  src="/interactive/seminario-de-i-d-i/semana-13/push-remove-until/index.html"
  title="Effect of pushNamedAndRemoveUntil on the route stack memory"
  height={750}
/>

## 6. The Code, File by File

Now that you know the stack, here is the code that handles it. The phone is on the left and the project files on the right. Tap a button on the phone to see which line runs; or press **▶ Ejecutar** in the code and watch the phone and the stack change. Change `automaticallyImplyLeading` to see when the arrow appears.

<InteractiveFrame
  src="/interactive/seminario-de-i-d-i/semana-13/pila-codigo/index.html"
  title="Dart code by file linked to the phone and the route stack"
  height={680}
/>

---

## 7. Navigation Methods Summary Table

| Method | Dart Syntax | Action on the Stack | When to Use It |
| :--- | :--- | :--- | :--- |
| **`pushNamed`** | `Navigator.pushNamed(context, '/ruta')` | Adds a screen on top. | Standard navigation between hierarchical screens. |
| **`pop`** | `Navigator.pop(context, [resultado])` | Destroys the top screen and returns an optional value. | "Back" button, "Cancel" or "Save" buttons. |
| **`canPop`** | `Navigator.canPop(context)` | Checks whether there is more than 1 screen in the stack. | Deciding whether to show an exit button or confirm before leaving. |
| **`popUntil`** | `Navigator.popUntil(context, (r) => r.isFirst)` | Pops routes until the predicate is `true`, pushing nothing. | Returning to the root without opening another screen. |
| **`pushReplacementNamed`** | `Navigator.pushReplacementNamed(context, '/ruta')` | Replaces the current top screen without altering the lower ones. | Splash Screen to Home transitions. |
| **`pushNamedAndRemoveUntil`** | `Navigator.pushNamedAndRemoveUntil(context, '/ruta', (r) => false)` | Empties the stack fully or selectively before pushing the new route. | Login, logout, post-purchase or restarting an app flow. |

## 8. Self-Assessment Questions

<Quiz id="quiz-navigator-rutas-nombradas">
  <Question title="In a stack, which item comes out first?">
    <Option>The first one that went in, like a line at a bank.</Option>
    <Option correct>The last one that went in, because only the top item can be touched.</Option>
    <Option>The one in the middle, because the stack splits in half.</Option>
    <Option>Whichever one the programmer chooses, since a stack allows removing from any position.</Option>
  </Question>

  <Question title="What happens to the previous screen when you run Navigator.pushNamed(context, '/detalle')?">
    <Option>It is destroyed immediately to free memory.</Option>
    <Option correct>It stays suspended below in the stack, keeping its state, its controllers and its scroll.</Option>
    <Option>It becomes a ghost widget and loses its text controllers.</Option>
    <Option>It is moved to the end of a queue to be rebuilt later.</Option>
  </Question>

  <Question title="The AppBar of the Detail screen shows a back arrow, but the one on Catalog (the initial route) does not. Why?">
    <Option>Because Catalog uses a different type of Scaffold.</Option>
    <Option>Because the arrow only appears on screens that receive arguments.</Option>
    <Option correct>Because Flutter draws the arrow only when there is a route below to go back to (canPop is true).</Option>
    <Option>Because pushReplacementNamed was called on Catalog at startup.</Option>
  </Question>

  <Question title="Why is it necessary to check if (!context.mounted) return; after an await Navigator.pushNamed?">
    <Option correct>Because while waiting, the screen may have been closed and its context is no longer active in the tree.</Option>
    <Option>Because the Dart compiler reports a syntax error if the condition is missing.</Option>
    <Option>Because it ensures the back arrow animation finishes playing.</Option>
    <Option>Because pushNamed always returns null if the context is not validated.</Option>
  </Question>

  <Question title="In a Logout, which pushNamedAndRemoveUntil predicate leaves the stack with only the login screen?">
    <Option>(route) => route.isFirst</Option>
    <Option correct>(route) => false</Option>
    <Option>(route) => true</Option>
    <Option>(route) => route.settings.name == '/home'</Option>
  </Question>

  <Question title="Where should you declare the route map when the app already has many screens and several files use them?">
    <Option>Repeated in every screen, so each one knows its neighbors.</Option>
    <Option>Inside every button, as loose text.</Option>
    <Option correct>In a separate file (for example routes/app_routes.dart) with name constants, and main.dart just uses it.</Option>
    <Option>In the screens folder, mixed with the screens' code.</Option>
  </Question>
</Quiz>
