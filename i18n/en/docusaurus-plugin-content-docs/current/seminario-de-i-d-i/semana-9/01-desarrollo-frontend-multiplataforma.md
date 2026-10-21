---
sidebar_position: 1
description: "Compare the imperative and declarative paradigms and the cross-platform development approaches, focusing on Flutter versus JavaFX."
---

# Cross-Platform Frontend

Cross-platform frontend development is a software engineering paradigm that lets you build applications for multiple operating systems (Android, iOS, Web, Windows, macOS and Linux) from a **single shared codebase**.

Instead of requiring independent development teams with separate languages and tools for each platform, modern cross-platform technologies unify business logic, interface design and state management, which speeds up delivery and makes long-term maintenance easier.

---

## From Java and OOP to Modern Frontend

<div style={{ display: 'flex', alignItems: 'center', gap: '16px', marginBottom: '20px' }}>
  <img src="/img/seminario-de-i-d-i/java-logo.svg" alt="Java Logo" width="48" height="48" />
  <div style={{ margin: 0 }}>
    So far in your degree, in the <strong>Algorithms and Object-Oriented Programming (APO 1 and APO 2)</strong> courses, you have worked mainly with <strong>Java</strong>, learning the fundamentals of strict typing, data structures, class design, inheritance, interfaces and desktop libraries such as <strong>JavaFX</strong> or <strong>Swing</strong>.
  </div>
</div>

The transition to modern frontend development involves three key conceptual changes:

### 1. Imperative Paradigm vs. Declarative Paradigm

In programming courses with JavaFX or Swing, building interfaces follows an **imperative** model:

* **Imperative Approach (JavaFX)**: You create interface objects in memory and manually program the exact steps to modify them on every event. If a value changes, you must look up the component's reference and mutate its state directly (`etiqueta.setText("New text")`).
* **Declarative Approach (Flutter / Modern Frontend)**: The user interface is the mathematical result of the application's current state:

$$UI = f(state)$$

You do not directly manipulate the on-screen components to change their content; you simply describe what the interface should look like for a given state. When the state changes (through calls such as `setState()`), the framework re-evaluates the function and automatically redraws the elements that need it.

<div style={{ textAlign: 'center', margin: '24px 0' }}>
  <img src="/img/seminario-de-i-d-i/imperativo-vs-declarativo.svg" alt="Imperative vs Declarative diagram" style={{ width: '100%', maxWidth: '780px', borderRadius: '12px' }} />
</div>

---

### 2. OOP Inheritance vs. Hierarchical Widget Composition

In traditional Object-Oriented Programming in Java, it is common to extend base classes to create new behaviors (`public class MiBotonCustom extends Button`).

In modern frameworks such as Flutter, the principle of **composition over inheritance** applies:

* UI components are not created through complex inheritance hierarchies, but by combining small, specialized and highly reusable components (*Widgets*).
* A button with an icon and text is not a special subclass; it is simply an `ElevatedButton` widget that contains a `Row` widget, which in turn nests an `Icon` and a `Text`.

<div style={{ textAlign: 'center', margin: '24px 0' }}>
  <img src="/img/seminario-de-i-d-i/herencia-vs-composicion.svg" alt="Inheritance vs Composition diagram" style={{ width: '100%', maxWidth: '780px', borderRadius: '12px' }} />
</div>

---

### 3. Execution Model: JVM vs. Native Compilation and Hot Reload

* **Java and the JVM**: Java code is compiled to *Bytecode* and runs inside the Java Virtual Machine (JVM), which interprets or compiles the instructions at runtime (JIT) for the host system.
* **Dart and Flutter**:
  * **In Production (Release)**: The code is compiled ahead of time (**Ahead-of-Time - AOT**) directly to native machine code (ARM or x86). This removes intermediate interpretation layers and ensures smooth performance at 60 or 120 frames per second (fps).
  * **In Development (Debug)**: It uses **Just-in-Time (JIT)** compilation to provide **Stateful Hot Reload**, which lets you inject code changes into the running application in under a second without losing the current screen state (such as filled-in forms or active navigation).

<div style={{ textAlign: 'center', margin: '24px 0' }}>
  <img src="/img/seminario-de-i-d-i/compilacion-aot-hot-reload.svg" alt="Execution model diagram: JVM vs Flutter AOT and Hot Reload" style={{ width: '100%', maxWidth: '780px', borderRadius: '12px' }} />
</div>

---

## Practical Comparison: JavaFX vs. Flutter

Below is a comparison of how a counter with an interactive button is implemented:

<Tabs>
  <TabItem value="javafx" label="JavaFX (Imperative in Java)" default>

```java title="ContadorApp.java" showLineNumbers

public class ContadorApp extends Application {
    // 1. State stored in the class
    private int contador = 0;

    @Override
    public void start(Stage stage) {
        // 2. Explicit creation of the interface nodes
        Label labelContador = new Label("Counter: 0");
        Button btnIncrementar = new Button("Increment");

        // 3. Imperative mutation: look up the reference and change the text
        btnIncrementar.setOnAction(event -> {
            contador++;
            labelContador.setText("Counter: " + contador); // Manual mutation of the node
        });

        VBox root = new VBox(10, labelContador, btnIncrementar);
        stage.setScene(new Scene(root, 300, 200));
        stage.setTitle("Counter in JavaFX");
        stage.show();
    }
}
```

  </TabItem>
  <TabItem value="flutter" label="Flutter (Declarative in Dart)">

```dart title="contador_widget.dart" showLineNumbers
class ContadorWidget extends StatefulWidget {
  const ContadorWidget({super.key});

  @override
  State<ContadorWidget> createState() => _ContadorWidgetState();
}

class _ContadorWidgetState extends State<ContadorWidget> {
  // 1. Local state of the screen
  int _contador = 0;

  void _incrementar() {
    // 2. Declarative state change: setState notifies the rebuild
    setState(() {
      _contador++;
    });
  }

  @override
  Widget build(BuildContext context) {
    // 3. The interface is described as a function of the value of _contador
    return Scaffold(
      appBar: AppBar(title: const Text('Counter in Flutter')),
      body: Center(
        child: Column(
          mainAxisAlignment: MainAxisAlignment.center,
          children: [
            Text('Counter: $_contador', style: const TextStyle(fontSize: 20)),
            const SizedBox(height: 10),
            ElevatedButton(
              onPressed: _incrementar,
              child: const Text('Increment'),
            ),
          ],
        ),
      ),
    );
  }
}
```

  </TabItem>
</Tabs>

---

## The 4 Cross-Platform Architectural Approaches

Throughout the evolution of mobile and frontend development, four main architectural strategies have emerged:

<div style={{ textAlign: 'center', margin: '24px 0' }}>
  <img src="/img/seminario-de-i-d-i/estrategias-multiplataforma.svg" alt="Evolution of cross-platform frontend approaches" style={{ width: '100%', maxWidth: '800px', borderRadius: '12px' }} />
</div>

### 1. Traditional Native Development (Separate Code)
* **Technologies**: Swift / Objective-C for iOS, Kotlin / Java for Android.
* **How it works**: Two completely independent applications are written using each platform's official APIs.
* **Advantages**: Maximum performance and immediate access to the latest hardware APIs.
* **Disadvantages**: Duplicated development cost, two work teams and a higher chance of functional inconsistencies.

<div style={{ textAlign: 'center', margin: '16px 0' }}>
  <img src="/img/seminario-de-i-d-i/enfoque-nativo-separado.svg" alt="Separate native approach diagram" style={{ width: '100%', maxWidth: '720px', borderRadius: '10px' }} />
</div>

### 2. Hybrid Based on WebViews
* **Technologies**: Apache Cordova, Ionic, Capacitor.
* **How it works**: The application is essentially a web page (HTML, CSS and JavaScript) packaged inside a native web container (*WebView*).
* **Advantages**: Full reuse of standard web development skills.
* **Disadvantages**: Limited performance in complex animations, latency when processing touch events and an appearance that is not always identical to a native application.

<div style={{ textAlign: 'center', margin: '16px 0' }}>
  <img src="/img/seminario-de-i-d-i/enfoque-hibrido-webview.svg" alt="Hybrid WebView approach diagram" style={{ width: '100%', maxWidth: '720px', borderRadius: '10px' }} />
</div>

### 3. Interpreted / Reactive Bridge
* **Technologies**: React Native.
* **How it works**: The logic is written in JavaScript/TypeScript, but instead of rendering in a WebView, it invokes the operating system's native visual components (`UIView` on iOS, `android.view.View` on Android) through an asynchronous communication bridge (*Bridge* or *JavaScript Interface - JSI*).
* **Advantages**: It uses the operating system's native components and takes advantage of the massive React ecosystem.
* **Disadvantages**: It can suffer bottlenecks in intensive animations and requires adaptations to keep exact visual parity between iOS and Android.

<div style={{ textAlign: 'center', margin: '16px 0' }}>
  <img src="/img/seminario-de-i-d-i/enfoque-puente-reactivo.svg" alt="Reactive bridge approach diagram" style={{ width: '100%', maxWidth: '720px', borderRadius: '10px' }} />
</div>

### 4. Own Rendering Engine (Direct Canvas)
* **Technologies**: Flutter.
* **How it works**: Flutter does not use WebViews or delegate drawing to the operating system's widgets. Instead, it ships its own high-performance 2D graphics engine (**Impeller** / **Skia**) and draws every pixel directly on the screen using the GPU (similar to how game engines such as Unity operate).
* **Advantages**: 100% identical visual parity on any device, deterministic performance at 60/120 fps and absolute control over every pixel.
* **Disadvantages**: Larger initial size of the installable binary because the rendering engine is included.

<div style={{ textAlign: 'center', margin: '16px 0' }}>
  <img src="/img/seminario-de-i-d-i/enfoque-motor-propio.svg" alt="Flutter own engine approach diagram" style={{ width: '100%', maxWidth: '720px', borderRadius: '10px' }} />
</div>

---

## Main Ecosystems in the Market

In today's industry landscape, **Flutter** and **React Native** lead enterprise adoption for cross-platform projects:

<div style={{ display: 'flex', gap: '24px', justifyContent: 'center', margin: '24px 0', flexWrap: 'wrap' }}>
  <div style={{ textAlign: 'center', padding: '20px', border: '1px solid #e2e8f0', borderRadius: '12px', width: '220px', background: 'rgba(66, 165, 245, 0.05)' }}>
    <img src="/img/seminario-de-i-d-i/flutter-logo.svg" alt="Flutter Logo" width="70" height="70" />
    <h4 style={{ marginTop: '12px', marginBottom: '4px' }}>Flutter</h4>
    <p style={{ margin: 0, fontSize: '0.85rem', color: '#64748b' }}>Own Graphics Engine</p>
  </div>
  <div style={{ textAlign: 'center', padding: '20px', border: '1px solid #e2e8f0', borderRadius: '12px', width: '220px', background: 'rgba(97, 218, 251, 0.05)' }}>
    <img src="/img/seminario-de-i-d-i/react-native-logo.svg" alt="React Native Logo" width="70" height="70" />
    <h4 style={{ marginTop: '12px', marginBottom: '4px' }}>React Native</h4>
    <p style={{ margin: 0, fontSize: '0.85rem', color: '#64748b' }}>Native Bridge / JSI</p>
  </div>
</div>

<CardGrid cols={2}>
  <Card 
    title="Flutter (Google)" 
    description="Dart-based cross-platform framework with its own rendering engine (Impeller). It compiles to native AOT machine code and supports Mobile, Web and Desktop from a single codebase." 
    link="https://flutter.dev"
  />
  <Card 
    title="React Native (Meta)" 
    description="JavaScript and React-based framework that maps declarative components to the operating system's native widgets through a decoupled-thread architecture." 
    link="https://reactnative.dev"
  />
</CardGrid>

---

## Technical Comparison Matrix

| Criterion | Flutter | React Native |
| :--- | :--- | :--- |
| **Creator and Backing** | Google | Meta (Facebook) |
| **Programming Language** | Dart (strictly typed, object-oriented) | JavaScript / TypeScript |
| **Rendering Architecture** | Own graphics engine (Impeller / Skia at pixel level) | Mapping to native OS components (JSI / Fabric) |
| **Animation Performance** | Excellent (native AOT compilation straight to GPU) | Very good (native rendering with a separate JS thread) |
| **Visual Consistency** | Identical across all platforms | Varies according to each OS's own visual style |
| **Development Experience** | Ultra-fast Stateful Hot Reload | Fast Refresh |
| **Platform Support** | iOS, Android, Web, Windows, macOS, Linux | iOS, Android (Web and Desktop through community extensions) |
