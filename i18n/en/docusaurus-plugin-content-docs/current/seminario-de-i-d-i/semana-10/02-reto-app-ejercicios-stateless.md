---
sidebar_position: 2
---

import Tabs from '@theme/Tabs';
import TabItem from '@theme/TabItem';

# Practical Challenge: Workout & Fitness Routine App (FitTrack)

In this challenge, you will put your Flutter layout and architecture skills into practice by building the mobile user interface for **FitTrack**, a workout tracking application designed under **Google Material Design 3** guidelines using the Deep Purple (`#6750A4`) seed color.

---

## 1. Reference Mockups

Below are the two high-fidelity mobile screens generated in Stitch that you must implement accurately:

<Tabs>
<TabItem value="screen1" label="Screen 1: Daily Routine" default>

<div style={{ textAlign: 'center', margin: '16px 0' }}>
  <img 
    src="/img/seminario-de-i-d-i/fittrack-rutina-diaria.png" 
    alt="FitTrack - Daily Routine Screen MD3" 
    style={{ maxWidth: '380px', width: '100%', borderRadius: '24px', boxShadow: '0 8px 24px rgba(0,0,0,0.12)' }} 
  />
</div>

</TabItem>
<TabItem value="screen2" label="Screen 2: Exercise Detail">

<div style={{ textAlign: 'center', margin: '16px 0' }}>
  <img 
    src="/img/seminario-de-i-d-i/fittrack-detalle-ejercicio.png" 
    alt="FitTrack - Exercise Detail & Active Sets Screen MD3" 
    style={{ maxWidth: '380px', width: '100%', borderRadius: '24px', boxShadow: '0 8px 24px rgba(0,0,0,0.12)' }} 
  />
</div>

</TabItem>
</Tabs>

---

## 2. Architectural Requirements

Your solution must strictly adhere to the following design constraints:

1. **`Screen` vs. `Page` Separation:**
   * **`Screens`** are the only components authorized to return a **`Scaffold`** (with its `AppBar`, `NavigationBar`, or persistent bottom action bar).
   * **`Pages`** represent the inner visual canvas rendered within the `body`. **They must never return a `Scaffold`**.
2. **100% `StatelessWidget`:**
   * The application must be purely declarative. Zero `StatefulWidget` and zero calls to `setState`.
   * All data must flow from immutable models passed as constructor arguments (`props`).
3. **Responsive Layout and Hardware Insets:**
   * Protect all views using **`SafeArea`** to accommodate the notch, dynamic island, and bottom system gesture insets.
   * Eliminate overflow errors (*RenderFlex overflow*) by wrapping scrollable viewports with **`SingleChildScrollView`**.
   * Use **`Expanded`** and **`flex`** to ensure rows and long text labels adapt gracefully to any screen width without manual dimension calculations.

---

## 3. Mission: UI Decomposition & Componentization

As a software engineer, your task is to visually analyze both screens and extract modular, reusable widgets into `lib/widgets/`:

```
lib/
├── models/       # Model your immutable data entities here (exercises, sets, summaries)
├── widgets/      # Modular components that you must identify, specify, and build
├── pages/        # WorkoutDashboardPage and ExerciseDetailPage (Canvases without Scaffold)
├── screens/      # WorkoutDashboardScreen and ExerciseDetailScreen (Scaffolds and bars)
└── main.dart
```

### Components you must specify and implement:
* **Atoms and Chips:** Identify statistical metric chips (duration, calories, counts) and tonal badges for target muscle groups or statuses.
* **Molecules and Cards:** Design the modular workout exercise card for the dashboard list and the tonal technique/posture notification banner.
* **State-Aware Components:** Design the set tracking card capable of rendering distinct visual states (completed with checkmark, in-progress with highlighted border and active rest timer, or pending).
* **Action Buttons:** Build reusable pill-shaped buttons (*stadium border*) for primary calls-to-action.

---

## 4. Evaluation Rubric

| Criterion | Description |
| :--- | :--- |
| **Clean Architecture** | Strict separation between `Screen` (Scaffold) and `Page` (Canvas). Zero nested Scaffolds. |
| **Custom Componentization** | Modular decomposition into reusable widgets in `lib/widgets/` with strongly typed, immutable parameters. |
| **Responsiveness & Hardware** | Proper use of `Expanded`, `SafeArea`, and total elimination of *RenderFlex overflow* using `SingleChildScrollView`. |
| **Fidelity & MD3 Styling** | High visual adherence to design mockups, rounded corners, and proper `BoxDecoration` usage without color conflicts. |
