---
sidebar_position: 4
---

import Tabs from '@theme/Tabs';
import TabItem from '@theme/TabItem';

# State Lifecycle and TextEditingController

In professional mobile development, stateful components are not eternal: they are born when a user enters a screen, react dynamically to events while the screen is active, and die when the user navigates away.

Understanding the **`State` Lifecycle** is essential for initializing resources correctly and, above all, avoiding **memory leaks** when handling text inputs with **`TextEditingController`**.

---

## 1. The `State` Lifecycle Timeline

Unlike a `StatelessWidget` (which only contains the `build` method), the `State<T>` class moves through several clearly defined stages throughout its lifetime in the *Element Tree*:

![State Lifecycle and TextEditingController Management](/img/seminario-de-i-d-i/ciclo-vida-stateful-controller.svg)

### The 5 Essential Stages

1. **`createState()`:** Automatically called by the framework to pair the immutable widget with its new state instance.
2. **`initState()` (One-Time Initialization):**
   * The **first method** executed after the `State` object is created.
   * Runs **exactly once** in the entire lifecycle of the widget.
   * The mandatory place to instantiate controllers (`TextEditingController`), subscribe to data streams (`Streams`), or start timers.
   * **Strict rule:** Must always begin by calling `super.initState()`.
3. **`didChangeDependencies()`:** Executes immediately after `initState()` and whenever an inherited context object changes (such as the color scheme or screen orientation).
4. **`build()` (Active Phase):** Returns the widget structure to render. Runs initially and repeats every time `setState()` is invoked.
5. **`dispose()` (Terminal Destruction and Cleanup):**
   * Executes when the `State` object is permanently removed from the tree (for example, when the user closes the screen or navigates back with `Navigator.pop`).
   * The mandatory place where **you must release and dispose of** all heavy resources opened in `initState()`.
   * **Strict rule:** Must always terminate by calling `super.dispose()`.

---

## 2. What is a `TextEditingController`?

The `TextField` widget allows users to enter text using the device keyboard. To read what the user entered, programmatically modify the text, or clear the field after submitting a form, Flutter uses a **`TextEditingController`**.

A controller acts as a two-way bridge:
* **Reading:** Query the current text via the `controller.text` property.
* **Writing:** Update the text via `controller.text = 'New value'` or `controller.clear()`.
* **Reactive Listening:** Emit events whenever the user presses a key via `controller.addListener(...)`.

---

## 3. The Critical Danger of Memory Leaks

A `TextEditingController` communicates with native operating system text input services (Android or iOS) and retains listener pointers in RAM.

:::danger[The Unbreakable Rule of dispose()]
If you create a `TextEditingController` in your screen and fail to destroy it by calling `.dispose()` inside your `State` class's `dispose()` method, Dart's Garbage Collector **cannot free that memory**.

If the user opens and closes the screen 20 times in a day, 20 orphaned controllers will pile up in device RAM, causing sluggish performance, excessive battery consumption, and eventually an application crash due to out-of-memory errors.
:::

---

## 4. Complete Implementation: Form with Validation and Cleanup

Below is a complete example demonstrating initialization in `initState()`, usage inside a form, and mandatory release in `dispose()`:

<Tabs>
<TabItem value="codigo" label="Reactive Form" default>

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

  <Question title="What does the controller.clear() method do?">
    <Option>It irreversibly deletes the widget from the screen.</Option>
    <Option correct>It empties the contents of the text field, leaving it blank (equivalent to controller.text = '').</Option>
    <Option>It closes the active user session in the database.</Option>
    <Option>It uninstalls the application from the emulator.</Option>
  </Question>
</Quiz>
