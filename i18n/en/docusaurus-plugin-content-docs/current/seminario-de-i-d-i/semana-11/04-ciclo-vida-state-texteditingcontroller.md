---
sidebar_position: 4
description: "Learn the State lifecycle and how to use TextEditingController without memory leaks in forms with validation."
---

import Tabs from '@theme/Tabs';
import TabItem from '@theme/TabItem';

# State Lifecycle and TextEditingController

In professional mobile development, stateful components are not eternal: they are born when a user enters a screen, react dynamically to events while the screen is active, and die when the user navigates away.

Understanding the **`State` Lifecycle** is essential for initializing resources correctly and, above all, avoiding **memory leaks** when handling text inputs with **`TextEditingController`**.

---

## 1. The `State` Lifecycle Timeline

Unlike a `StatelessWidget` (which only contains the `build` method), the `State<T>` class moves through several clearly defined stages throughout its lifetime in the *Element Tree*. Follow each method in the next piece and turn on the **Olvidar controller.dispose()** ("forget controller.dispose()") switch to see what happens to memory when cleanup is omitted:

<InteractiveFrame
  src="/interactive/seminario-de-i-d-i/semana-11/ciclo-vida-state/index.html"
  title="State lifecycle in Flutter: createState, initState, didChangeDependencies, build, dispose and a controller leak"
  height={900}
/>

### The Essential Stages

1. **`createState()`:** a method of the **Widget** (not of the `State`). Flutter calls it once when the widget is inserted into the tree to create its `State` object.
2. **`initState()` (one-time initialization):**
   * The **first method** executed on the `State` object after it is created.
   * Runs **exactly once** in its entire lifetime.
   * The place to instantiate controllers (`TextEditingController`), subscribe to data streams (`Streams`), or start timers.
   * **Strict rule:** must always begin by calling `super.initState()`.
3. **`didChangeDependencies()`:** executes immediately after `initState()` and whenever an inherited context object changes (such as the theme or the language).
4. **`build()` (active phase):** returns the widget structure to render. Runs initially and repeats every time `setState()` marks the element as `dirty`. `setState()` is not a lifecycle stage: it is what **causes** `build()` to run again.
5. **`dispose()` (terminal cleanup):**
   * Executes when the `State` object is permanently removed from the tree (for example, when the user navigates back with `Navigator.pop`).
   * The place where **you must release** the resources opened in `initState()`.
   * **Strict rule:** must always terminate by calling `super.dispose()`.

:::note[Other methods that exist]
Two more methods will show up later: `didUpdateWidget()` (the parent hands a new configuration to the same `State`) and `deactivate()` (the `State` temporarily leaves the tree). For this chapter, the five stages above are enough.
:::

---

## 2. What is a `TextEditingController`?

The `TextField` widget allows users to enter text using the device keyboard. To read what the user entered, programmatically modify the text, or clear the field after submitting a form, Flutter uses a **`TextEditingController`**.

A controller acts as a two-way bridge between the field and your code:
* **Reading:** query the current text via the `controller.text` property.
* **Writing:** update the text via `controller.text = 'New value'` or `controller.clear()`.
* **Reactive listening:** get notified whenever the text changes via `controller.addListener(...)`.

:::info[Typing is not a setState]
While the user types, the `TextField` updates `controller.text` and repaints **by itself**: your page is not rebuilt and its `build()` does not run. You only need `setState()` when something **on your screen** depends on that text. Check it in the simulator of section 4.
:::

---

## 3. The Critical Danger of Memory Leaks

A `TextEditingController` is an object that **keeps listeners** (the `TextField`s and any `addListener` you register) and reserves resources for as long as it exists. That is why Flutter requires whoever creates it to release it.

:::danger[The Unbreakable Rule of dispose()]
If you create a `TextEditingController` in your screen and do not call `.dispose()` inside your `State` class's `dispose()` method, the controller **does not release its listeners or its resources** and stays around as an orphaned object of a screen that no longer exists.

If the user opens and closes the screen many times, those orphaned controllers pile up: more memory in use, more work for the garbage collector and an application that gets slower and slower. In debug mode, Flutter's tooling also reports the controller as a **memory leak**.

It is a simple rule with no exceptions: **whatever you create in `initState()`, you release in `dispose()`**.
:::

---

## 4. Implementation: Form with Cleanup and Basic Validation

The following example brings together initialization in `initState()`, the use of the controllers in the form, and the mandatory release in `dispose()`. The validation is basic: it only checks that the fields are not empty.

What matters here is the **logic**, not the styles. That is why the example comes in three views: a **simulator** to see its behavior, the **essential** code (no decorations) and the **complete** code with all the styles.

<Tabs>
<TabItem value="simulador" label="Simulator" default>

Type into the fields and watch the console: **typing does not run `build()`**. Press **Registrar** ("Register") and follow the full journey; also try it with an empty field:

<iframe
  src="/interactive/seminario-de-i-d-i/semana-11/formulario-registro/index.html"
  title="Registration form simulation with TextEditingController: typing does not rebuild, registering does"
  style={{ width: '100%', height: 930, border: 0 }}
  loading="lazy"
/>

</TabItem>
<TabItem value="esencial" label="The Essentials">

It is the same code without decorations: three blocks (declare, create/release and use the controllers), the method that processes the form and a minimal `build()`.

```dart title="lib/pages/registration_page.dart (the essentials)" showLineNumbers
class _RegistrationPageState extends State<RegistrationPage> {
  // 1. Controller declarations and page state
  late final TextEditingController _nameController;
  late final TextEditingController _emailController;
  String _resultMessage = '';

  @override
  void initState() {
    super.initState();
    // 2. Created only ONCE
    _nameController = TextEditingController();
    _emailController = TextEditingController();
  }

  @override
  void dispose() {
    // 3. Released when leaving the screen
    _nameController.dispose();
    _emailController.dispose();
    super.dispose();
  }

  void _submitForm() {
    final name = _nameController.text.trim();
    final email = _emailController.text.trim();

    // Validation: mandatory fields
    if (name.isEmpty || email.isEmpty) {
      ScaffoldMessenger.of(context).showSnackBar(
        const SnackBar(content: Text('Complete all fields')),
      );
      return; // no setState: the page is not rebuilt
    }

    setState(() {
      _resultMessage = 'User registered: $name ($email)';
    });

    // 4. Clear fields after successful submission
    _nameController.clear();
    _emailController.clear();
  }

  @override
  Widget build(BuildContext context) {
    return Column(
      children: [
        TextField(controller: _nameController),
        TextField(controller: _emailController),
        FilledButton(
          onPressed: _submitForm,
          child: const Text('Register'),
        ),
        if (_resultMessage.isNotEmpty) Text(_resultMessage),
      ],
    );
  }
}
```

</TabItem>
<TabItem value="codigo" label="Complete Code (with styles)">

```dart title="lib/pages/registration_page.dart" showLineNumbers
import 'package:flutter/material';

class RegistrationPage extends StatefulWidget {
  const RegistrationPage({super.key});

  @override
  State<RegistrationPage> createState() => _RegistrationPageState();
}

class _RegistrationPageState extends State<RegistrationPage> {
  // 1. Controller declarations
  late final TextEditingController _nameController;
  late final TextEditingController _emailController;

  // Local state for confirmation messages
  String _resultMessage = '';

  @override
  void initState() {
    super.initState();
    // 2. Mandatory initialization in initState (happens only once)
    _nameController = TextEditingController();
    _emailController = TextEditingController();
  }

  @override
  void dispose() {
    // 3. MANDATORY CLEANUP: Prevents memory leaks
    _nameController.dispose();
    _emailController.dispose();
    super.dispose();
  }

  void _submitForm() {
    final name = _nameController.text.trim();
    final email = _emailController.text.trim();

    // Simple mandatory fields validation
    if (name.isEmpty || email.isEmpty) {
      ScaffoldMessenger.of(context).showSnackBar(
        const SnackBar(
          content: Text('Please complete all form fields'),
          backgroundColor: Colors.redAccent,
        ),
      );
      return;
    }

    setState(() {
      _resultMessage = 'User registered: $name ($email)';
    });

    // 4. Clear fields after successful submission
    _nameController.clear();
    _emailController.clear();
  }

  @override
  Widget build(BuildContext context) {
    return SingleChildScrollView(
      padding: const EdgeInsets.all(24.0),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.stretch,
        children: [
          const Text(
            'User Registration Form',
            style: TextStyle(fontSize: 20, fontWeight: FontWeight.bold),
          ),
          const SizedBox(height: 16),
          // Name Field
          TextField(
            controller: _nameController,
            decoration: const InputDecoration(
              labelText: 'Full Name',
              hintText: 'e.g., Jane Doe',
              prefixIcon: Icon(Icons.person),
              border: OutlineInputBorder(),
            ),
          ),
          const SizedBox(height: 16),
          // Email Field
          TextField(
            controller: _emailController,
            keyboardType: TextInputType.emailAddress,
            decoration: const InputDecoration(
              labelText: 'Email Address',
              hintText: 'user@icesi.edu.co',
              prefixIcon: Icon(Icons.email),
              border: OutlineInputBorder(),
            ),
          ),
          const SizedBox(height: 24),
          // Submit Button
          FilledButton.icon(
            onPressed: _submitForm,
            icon: const Icon(Icons.check),
            label: const Text('Register User'),
          ),
          if (_resultMessage.isNotEmpty) ...[
            const SizedBox(height: 24),
            Container(
              padding: const EdgeInsets.all(16),
              decoration: BoxDecoration(
                color: const Color(0xFFF0FDF4),
                borderRadius: BorderRadius.circular(8),
                border: Border.all(color: const Color(0xFF86EFAC)),
              ),
              child: Text(
                _resultMessage,
                style: const TextStyle(color: Color(0xFF15803D), fontWeight: FontWeight.w600),
              ),
            ),
          ],
        ],
      ),
    );
  }
}
```

</TabItem>
<TabItem value="inspeccion" label="Key Code Highlights">

1. **`late final`:** Tells the Dart analyzer that the variable cannot be null, will be initialized in `initState()`, and its reference will never change.
2. **`controller.text.trim()`:** Strips extraneous leading and trailing whitespace accidentally typed by the user.
3. **`controller.clear()`:** A clean shorthand equivalent to `controller.text = ''`, clearing the visual input ready for the next entry.
4. **`OutlineInputBorder()`:** Standard Google Material Design 3 component drawing a rounded rectangular border around the input field.

</TabItem>
</Tabs>

---

## Self-Assessment Quiz

<Quiz id="seminario-s11-lifecycle-controllers-quiz">
  <Question title="In which State lifecycle method must a TextEditingController be instantiated?">
    <Option>In the build() method, every time the widget redraws.</Option>
    <Option correct>In the initState() method, exactly once when the State object is created.</Option>
    <Option>In the web browser index.html file.</Option>
    <Option>In the Android Studio compiler destructor.</Option>
  </Question>

  <Question title="What is the direct consequence of forgetting to call controller.dispose() in the dispose() method?">
    <Option>The phone immediately shuts down due to overheating.</Option>
    <Option correct>A memory leak occurs, as the controller listeners and resources remain accumulated in RAM without being released.</Option>
    <Option>The text entered by the user is automatically committed to GitHub.</Option>
    <Option>Flutter prohibits compiling any file with a .dart extension.</Option>
  </Question>

  <Question title="Which statement must be called at the beginning of initState() and at the end of dispose()?">
    <Option>setState() and markNeedsBuild() respectively.</Option>
    <Option correct>super.initState() and super.dispose() to preserve the framework initialization and destruction chain.</Option>
    <Option>Navigator.pushNamed() and SystemChannels.platform.invokeMethod().</Option>
    <Option>print(&quot;Hello World&quot;) and exit(0).</Option>
  </Question>

  <Question title="How do you retrieve the text entered by the user in a field connected to a TextEditingController?">
    <Option>Through the controller.getInputValue() method.</Option>
    <Option correct>Through the controller.text property.</Option>
    <Option>By directly reading the text file on local disk.</Option>
    <Option>By invoking the dispose() method with text parameters.</Option>
  </Question>

  <Question title="While the user types into a TextField connected to a controller (with no setState), what happens to the page's build()?">
    <Option>It runs on every keystroke.</Option>
    <Option correct>It does not run: the field updates controller.text and repaints by itself; the page is only rebuilt if something calls setState.</Option>
    <Option>It runs once when the user finishes typing.</Option>
    <Option>initState() runs again to recreate the controller.</Option>
  </Question>

  <Question title="What does the controller.clear() method do?">
    <Option>It irreversibly deletes the widget from the screen.</Option>
    <Option correct>It empties the contents of the text field, leaving it blank (equivalent to controller.text = '').</Option>
    <Option>It closes the active user session in the database.</Option>
    <Option>It uninstalls the application from the emulator.</Option>
  </Question>
</Quiz>
