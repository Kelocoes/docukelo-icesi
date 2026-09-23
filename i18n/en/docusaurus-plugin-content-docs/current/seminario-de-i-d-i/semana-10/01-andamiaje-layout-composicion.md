---
sidebar_position: 1
---

import Tabs from '@theme/Tabs';
import TabItem from '@theme/TabItem';

# Scaffolding, Layout, and Composition in Flutter

In this session, you will learn how to build mobile layouts in Flutter: structuring screen scaffolding (`Scaffold` and `SafeArea`), distributing elements on screen (`Column`, `Row`, `Expanded`), applying visual styling (`Container` and `Padding`), and resolving layout overflows (*RenderFlex overflow*) using `SingleChildScrollView`.

---

## 1. Architectural Convention: Screen vs. Page

In Flutter, a well-structured screen clearly separates the outer frame from the inner content:
* **`Screen` (Route Screen):** The navigation destination. It is the **sole entity responsible for returning the `Scaffold`** (with its `AppBar`, `BottomNavigationBar`, or `FloatingActionButton`).
* **`Page` (Inner Canvas):** The visual content that lives inside the `body` of the `Screen`. **It must never return a `Scaffold`**, only layout widgets (`SafeArea`, `Column`, `ListView`, etc.).

<Tabs>
<TabItem value="diagram" label="Visual Diagram" default>

![Screen vs Page Architecture](/img/seminario-de-i-d-i/screen-vs-page-arquitectura.svg)

</TabItem>
<TabItem value="code" label="Dart Code">

```dart title="lib/screens/home_screen.dart" showLineNumbers
import 'package:flutter/material.dart';
import '../pages/home_page.dart';

// SCREEN: Global frame with Scaffold
class HomeScreen extends StatelessWidget {
  const HomeScreen({super.key});

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: const Text('My Application'),
        centerTitle: true,
      ),
      // Hosts the Page inside its body. Zero nested Scaffolds.
      body: const HomePage(),
    );
  }
}
```

```dart title="lib/pages/home_page.dart" showLineNumbers
import 'package:flutter/material.dart';

// PAGE: Content canvas (NEVER returns a Scaffold)
class HomePage extends StatelessWidget {
  const HomePage({super.key});

  @override
  Widget build(BuildContext context) {
    return SafeArea(
      child: Padding(
        padding: const EdgeInsets.all(16.0),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: const [
            Text('Welcome to the inner view'),
            SizedBox(height: 12),
            Text('Here lives the modular content of the screen.'),
          ],
        ),
      ),
    );
  }
}
```

</TabItem>
</Tabs>

:::caution[Why avoid nested Scaffolds?]
Nesting a `Scaffold` inside another triggers serious UI conflicts: notifications (`SnackBar`) are hidden or misplaced, duplicate app bars (`AppBar`) consume valuable screen real estate, and the virtual keyboard covers input fields because both `Scaffold` instances attempt to resize simultaneously (`resizeToAvoidBottomInset`).
:::

---

## 2. Scaffolding and Hardware: Scaffold and SafeArea

Modern mobile devices feature notches, rounded corners, punch-hole front cameras, and system gesture bars. `Scaffold` and `SafeArea` guarantee that your user interface is never obstructed by these hardware obstacles:
* **`Scaffold`:** Provides the canonical *Material Design* slots (`appBar`, `body`, `floatingActionButton`, `bottomNavigationBar`).
* **`SafeArea`:** Automatically injects the necessary inner insets to protect content from the top status bar and the bottom gesture/home bar.

<Tabs>
<TabItem value="diagram" label="Visual Diagram" default>

![SafeArea Protection](/img/seminario-de-i-d-i/safearea-hardware-insets.svg)

</TabItem>
<TabItem value="code" label="Dart Code">

```dart title="lib/screens/safe_demo_screen.dart" showLineNumbers
import 'package:flutter/material.dart';

class SafeDemoScreen extends StatelessWidget {
  const SafeDemoScreen({super.key});

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: const Text('Hardware Insets Protection'),
      ),
      // SafeArea protects content against the notch and bottom gesture bar
      body: SafeArea(
        child: Padding(
          padding: const EdgeInsets.all(16.0),
          child: Center(
            child: Text(
              'This content will never be clipped by the notch or the bottom gesture bar.',
              textAlign: TextAlign.center,
              style: Theme.of(context).textTheme.bodyLarge,
            ),
          ),
        ),
      ),
      bottomNavigationBar: NavigationBar(
        destinations: const [
          NavigationDestination(icon: Icon(Icons.home), label: 'Home'),
          NavigationDestination(icon: Icon(Icons.person), label: 'Profile'),
        ],
      ),
    );
  }
}
```

</TabItem>
</Tabs>

---

## 3. Linear Layout: Row and Column

To position elements in a single direction, Flutter provides `Row` (horizontal) and `Column` (vertical). Each operates across two coordinate axes:

<Tabs>
<TabItem value="diagram" label="Visual Diagram" default>

![Row and Column Axes](/img/seminario-de-i-d-i/layout-ejes-row-column.svg)

<div style={{ margin: '16px 0' }}>
  <p style={{ fontWeight: 'bold', marginBottom: '8px' }}>Main and Cross Axis Visual Alignments:</p>
  <img 
    src="/img/seminario-de-i-d-i/layout-alineaciones-visuales.svg" 
    alt="Visual Alignments in Row and Column" 
    style={{ width: '100%', borderRadius: '12px' }} 
  />
</div>

</TabItem>
<TabItem value="code" label="Dart Code">

```dart title="lib/examples/layout_row_column.dart" showLineNumbers
import 'package:flutter/material.dart';

class LayoutRowColumnExample extends StatelessWidget {
  const LayoutRowColumnExample({super.key});

  @override
  Widget build(BuildContext context) {
    return Column(
      // Column's main axis: Vertical
      mainAxisAlignment: MainAxisAlignment.center,
      // Column's cross axis: Horizontal
      crossAxisAlignment: CrossAxisAlignment.stretch,
      children: [
        // Horizontal row with spaceBetween distribution
        Row(
          mainAxisAlignment: MainAxisAlignment.spaceBetween,
          crossAxisAlignment: CrossAxisAlignment.center,
          children: const [
            Icon(Icons.star, color: Colors.amber),
            Text('Center Element'),
            Icon(Icons.favorite, color: Colors.red),
          ],
        ),
        const SizedBox(height: 16),
        ElevatedButton(
          onPressed: () {},
          child: const Text('Cross-Axis Stretched Button (stretch)'),
        ),
      ],
    );
  }
}
```

</TabItem>
</Tabs>

---

## 4. Responsive Layout: Expanded and flex

Instead of hardcoding fixed widths or calculating manual percentages using `MediaQuery`, we use **`Expanded`** so that a child absorbs the remaining available space:
* **Flexible space:** Combining fixed-width boxes (e.g. 70px) with `Expanded` allows the flexible widget to adapt automatically to any screen width.
* **Proportions with `flex`:** When placing multiple `Expanded` widgets, the integer factor `flex` divides the space proportionally (e.g., `flex: 1` and `flex: 2` allocate 33.3% and 66.6% of the remaining space).

<Tabs>
<TabItem value="diagram" label="Visual Diagram" default>

![Expanded and flex Proportions](/img/seminario-de-i-d-i/expanded-flex-proporciones.svg)

</TabItem>
<TabItem value="code" label="Dart Code">

```dart title="lib/examples/expanded_flex_demo.dart" showLineNumbers
import 'package:flutter/material.dart';

class ExpandedFlexDemo extends StatelessWidget {
  const ExpandedFlexDemo({super.key});

  @override
  Widget build(BuildContext context) {
    return Column(
      children: [
        // 1. Fixed-width items at ends and Expanded in the center
        Row(
          children: [
            Container(width: 70, height: 48, color: Colors.blue.shade100, child: const Center(child: Text('70px'))),
            const SizedBox(width: 8),
            Expanded(
              child: Container(
                height: 48,
                color: Colors.purple.shade100,
                child: const Center(child: Text('Expanded (Absorbs space)')),
              ),
            ),
            const SizedBox(width: 8),
            Container(width: 70, height: 48, color: Colors.blue.shade100, child: const Center(child: Text('70px'))),
          ],
        ),
        const SizedBox(height: 16),

        // 2. Proportional distribution with flex: 1 (33.3%) and flex: 2 (66.6%)
        Row(
          children: [
            Expanded(
              flex: 1,
              child: Container(
                height: 48,
                color: Colors.teal.shade100,
                child: const Center(child: Text('flex: 1 (33.3%)')),
              ),
            ),
            const SizedBox(width: 8),
            Expanded(
              flex: 2,
              child: Container(
                height: 48,
                color: Colors.indigo.shade100,
                child: const Center(child: Text('flex: 2 (66.6%)')),
              ),
            ),
          ],
        ),
      ],
    );
  }
}
```

</TabItem>
</Tabs>

---

## 5. Boxes and Styling: Container vs. Padding

`Padding` is a lightweight, single-responsibility widget designed purely for inner spacing. `Container` is the swiss-army knife combining dimensions, margins, borders, and complex decorations:

<Tabs>
<TabItem value="diagram" label="Visual Diagram" default>

![Box Model and BoxDecoration Rule](/img/seminario-de-i-d-i/container-box-model-decorations.svg)

</TabItem>
<TabItem value="code" label="Dart Code">

```dart title="lib/examples/container_box_decoration.dart" showLineNumbers
import 'package:flutter/material.dart';

class ContainerDecorationExample extends StatelessWidget {
  const ContainerDecorationExample({super.key});

  @override
  Widget build(BuildContext context) {
    return Container(
      margin: const EdgeInsets.all(16.0), // Outer spacing
      padding: const EdgeInsets.all(20.0), // Inner spacing
      decoration: BoxDecoration(
        // CRITICAL RULE: Background color MUST reside inside BoxDecoration
        color: const Color(0xFFF9F1FD),
        borderRadius: BorderRadius.circular(16.0),
        border: Border.all(color: const Color(0xFFCBC4D2), width: 1.5),
        boxShadow: [
          BoxShadow(
            color: Colors.black.withOpacity(0.06),
            blurRadius: 10,
            offset: const Offset(0, 4),
          ),
        ],
      ),
      child: const Text(
        'Card styled with rounded corners and subtle shadow.',
        style: TextStyle(fontWeight: FontWeight.w500),
      ),
    );
  }
}
```

</TabItem>
</Tabs>

:::danger[The Golden Rule of BoxDecoration]
When using `decoration: BoxDecoration(...)`, the background color **must be defined inside `BoxDecoration`**. Supplying `color` directly to the `Container` while simultaneously specifying `decoration` causes a fatal runtime assertion error (`'color == null || decoration == null'`).
:::

---

## 6. Overflow Prevention: SingleChildScrollView

When the children of a `Column` demand more height than the physical screen can offer, Flutter displays the infamous **yellow and black hazard stripes** (*RenderFlex overflowed*).

<Tabs>
<TabItem value="diagram" label="Visual Diagram" default>

![RenderFlex Overflow and Scroll Solution](/img/seminario-de-i-d-i/renderflex-overflow-solucion.svg)

</TabItem>
<TabItem value="code" label="Dart Code">

```dart title="lib/examples/scroll_solution.dart" showLineNumbers
import 'package:flutter/material.dart';

class ScrollSolutionExample extends StatelessWidget {
  const ScrollSolutionExample({super.key});

  @override
  Widget build(BuildContext context) {
    // SingleChildScrollView eliminates the RenderFlex overflow hazard
    return SingleChildScrollView(
      padding: const EdgeInsets.all(16.0),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.stretch,
        children: [
          for (int i = 1; i <= 6; i++) ...[
            Container(
              height: 100,
              decoration: BoxDecoration(
                color: Colors.purple.shade50,
                borderRadius: BorderRadius.circular(12),
                border: Border.all(color: Colors.purple.shade200),
              ),
              child: Center(child: Text('Content Card #$i')),
            ),
            const SizedBox(height: 12),
          ],
          FilledButton.icon(
            onPressed: () {},
            icon: const Icon(Icons.check),
            label: const Text('Submit Form'),
          ),
        ],
      ),
    );
  }
}
```

</TabItem>
</Tabs>

---

## Self-Assessment Quiz

<Quiz id="flutter-s10-layout-visual-quiz-en">
  <Question title="What is the exclusive responsibility of a Screen compared to a Page?">
    <Option>The Screen manages animations with setState and the Page is static.</Option>
    <Option correct>The Screen defines the sole Scaffold of the route; the Page is the inner content canvas rendered inside the body.</Option>
    <Option>The Screen is only used on Android and the Page on iOS.</Option>
    <Option>The Page contains the AppBar and the Screen contains the buttons.</Option>
  </Question>

  <Question title="What issue arises if you nest a Scaffold inside the body of another Scaffold?">
    <Option>The application will not compile due to a syntax error in Dart.</Option>
    <Option correct>SnackBar conflicts, duplicate AppBars, and keyboard resize glitches where inputs are covered.</Option>
    <Option>The device enters low battery mode automatically.</Option>
    <Option>The project build cache is erased upon hot reload.</Option>
  </Question>

  <Question title="What is the primary function of the SafeArea widget?">
    <Option>To protect the app against SQL injection attacks.</Option>
    <Option correct>To inject automatic insets preventing the interface from being obscured by hardware notches, cameras, or system gesture bars.</Option>
    <Option>To validate user fingerprint authentication.</Option>
    <Option>To dynamically change the navigation bar color every 10 seconds.</Option>
  </Question>

  <Question title="In a Row widget, which axis is the Main Axis?">
    <Option>Vertical (Y ↓).</Option>
    <Option correct>Horizontal (X →).</Option>
    <Option>Diagonal at 45 degrees.</Option>
    <Option>Depth (Z axis).</Option>
  </Question>

  <Question title="Which MainAxisAlignment value distributes space evenly between children, pinning the first and last child to the edges?">
    <Option>MainAxisAlignment.center</Option>
    <Option>MainAxisAlignment.start</Option>
    <Option correct>MainAxisAlignment.spaceBetween</Option>
    <Option>MainAxisAlignment.spaceEvenly</Option>
  </Question>

  <Question title="If you place two Expanded widgets in a Row with flex: 1 and flex: 2, what percentage of remaining space does the second receive?">
    <Option>50%.</Option>
    <Option correct>66.6% (two-thirds of the total).</Option>
    <Option>100%.</Option>
    <Option>25%.</Option>
  </Question>

  <Question title="Where must the background color be placed if a Container defines the decoration property?">
    <Option>Directly as a property of the Container.</Option>
    <Option correct>Exclusively inside the BoxDecoration instance.</Option>
    <Option>Only in the root Scaffold widget.</Option>
    <Option>Either location is valid, Flutter accepts both simultaneously.</Option>
  </Question>

  <Question title="How do you immediately resolve the yellow and black striped RenderFlex overflow error in a vertical Column?">
    <Option>By decreasing the font size of all text widgets.</Option>
    <Option correct>By wrapping the Column inside a SingleChildScrollView.</Option>
    <Option>By converting StatelessWidget to StatefulWidget.</Option>
    <Option>By removing the SafeArea widget.</Option>
  </Question>
</Quiz>
