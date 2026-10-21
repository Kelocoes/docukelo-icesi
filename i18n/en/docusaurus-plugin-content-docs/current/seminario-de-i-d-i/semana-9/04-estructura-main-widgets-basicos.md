---
sidebar_position: 4
description: "Walk through the structure of a Flutter project and main.dart, and learn to read a screen as a widget tree."
---

# Structure, main.dart and Widgets

Once the Flutter SDK is installed and your environment is verified with `flutter doctor`, the next step is to understand how a Flutter project is structured, what the execution sequence that starts in `main.dart` looks like, how to use the primitive visual widgets and how to organize the code into a scalable architecture of **pages** and **components**.

---

## 1. Project Folder Structure

When you run the `flutter create mi_proyecto` command, the command-line tool generates a template with multiple folders and files. Each one has a specific role in the build and packaging cycle.

<div style={{ textAlign: 'center', margin: '24px 0' }}>
  <img 
    src="/img/seminario-de-i-d-i/estructura-carpetas-flutter.svg" 
    alt="Canonical structure of a Flutter project" 
    style={{ width: '100%', maxWidth: '820px', borderRadius: '12px' }} 
  />
</div>

### Roles of the Main Directories

- **`lib/` (Dart Library)**:
  This is the core directory where you write all of your application's code. Every `.dart` file that defines logic, models, components or screens must live here.
- **`android/`, `ios/`, `web/`, `windows/`, `macos/`, `linux/`**:
  These are _host_ folders that contain each platform's native projects. For example, `android/` contains the Gradle project with its `AndroidManifest.xml`, and `ios/` contains the Xcode solution with its `Info.plist` and `Podfile`. You will rarely need to modify them directly, except to request specific permissions (camera, geolocation) or to change the launcher icon.
- **`test/`**:
  Contains the unit and widget tests that ensure the quality of the application.
- **`pubspec.yaml`**:
  This is the project's central configuration file (equivalent to a `package.json` in Node.js or a `pom.xml` in Java Maven). It specifies:
  - The application's name, description and version.
  - Dart and Flutter SDK constraints.
  - Third-party dependencies from the community repository [pub.dev](https://pub.dev).
  - The declaration of static _assets_, such as local images, vectors and fonts.

---

## 2. Anatomy and Walkthrough of main.dart

The `lib/main.dart` file is the absolute starting point of any Flutter application. Its purpose is to initialize the platform, set up the root widget tree and indicate which will be the first screen the user sees.

<div style={{ textAlign: 'center', margin: '24px 0' }}>
  <img 
    src="/img/seminario-de-i-d-i/flujo-main-dart.svg" 
    alt="Anatomy of the main.dart entry point" 
    style={{ width: '100%', maxWidth: '820px', borderRadius: '12px' }} 
  />
</div>

Let us analyze a clean `main.dart` file, structured according to the course's best practices:

```dart title="lib/main.dart" showLineNumbers
import 'package:flutter/material.dart';
import 'package:mi_proyecto/pages/home_page.dart';

// 1. General entry point of the Dart program
void main() {
  runApp(const MyApp());
}

// 2. Root widget of the application (Global Configuration)
class MyApp extends StatelessWidget {
  const MyApp({super.key});

  @override
  Widget build(BuildContext context) {
    return MaterialApp(
      title: 'DocuKelo Flutter Demo',
      debugShowCheckedModeBanner: false,
      // Material 3 design system configuration
      theme: ThemeData(
        colorScheme: ColorScheme.fromSeed(
          seedColor: Colors.blueAccent,
          brightness: Brightness.light,
        ),
        useMaterial3: true,
      ),
      // Home screen of the application
      home: const HomePage(),
    );
  }
}
```

### What Does Each Block Do?

1. **`void main()`**: The main function in Dart. It calls the `runApp()` function, which connects the root widget (`MyApp`) to the rendering subsystems and the engine's event loop.
2. **`MaterialApp`**: The container widget that provides the infrastructure of Google's Material design system:
   - It configures the global visual theme (`ThemeData`), primary colors and typography.
   - It manages the routing system and the navigation stack.
   - It provides internationalization and accessibility support.
3. **`home: const HomePage()`**: Indicates the main screen that will be mounted initially when the app loads.

---

## 3. Understanding the Page as a Component Tree

In Flutter, the official architecture motto is: **"In Flutter, almost everything is a widget"**. This means a page is not conceived as a flat canvas of pixels, but as a hierarchical tree structure (_Widget Tree_), where each parent node defines positioning rules, spatial constraints (_constraints_) or style for its child nodes (_children_).

### What Is the Widget Tree?

The widget tree is the in-memory representation of the app's visual structure:

- **The Root**: It starts at `MaterialApp` (or `CupertinoApp` for iOS style).
- **The Screen Trunk**: The `Scaffold`, which acts as the structural frame with designated areas (`appBar`, `body`, `floatingActionButton`, `bottomNavigationBar`).
- **The Layout Branches (_Layout_)**: Widgets that have no visual appearance of their own but arrange their children spatially, such as `Column` (vertical), `Row` (horizontal), `Padding` (inner margins) or `Center`.
- **The Leaves (_Leaf Widgets_)**: Concrete visual widgets that display content or receive interaction, such as `Text`, `Image`, `Icon` or `ElevatedButton`.

### Case Study: Breaking Down a Music Player (Stitch Design with Material 3)

To illustrate how a realistic user interface translates into an ordered tree of components, consider a **Music Player (Now Playing)** screen designed with the modern **Google Material Design 3 (Material You)** standard:

<div style={{ display: 'flex', justifyContent: 'center', gap: '28px', flexWrap: 'wrap', margin: '24px 0', alignItems: 'center' }}>
  <div style={{ maxWidth: '320px', textAlign: 'center' }}>
    <p style={{ fontWeight: 'bold', fontSize: '0.9rem', color: '#64748b', marginBottom: '8px' }}>Design Generated in Stitch (MD3)</p>
    <img 
      src="/img/seminario-de-i-d-i/music-player-stitch-preview.png" 
      alt="Screenshot of the Music Player design in Stitch with Material 3" 
      style={{ width: '100%', borderRadius: '24px', boxShadow: '0 8px 24px rgba(0,0,0,0.25)' }} 
    />
  </div>
  <div style={{ maxWidth: '440px' }}>
    <h4>Visual Analysis of the Interface:</h4>
    <div style={{ fontSize: '0.95rem', lineHeight: '1.6', marginBottom: '8px' }}>
      Look at the elements that make up the screen:
    </div>
    <ul style={{ fontSize: '0.9rem', lineHeight: '1.6' }}>
      <li><strong>Top App Bar</strong>: Back button, centered <em>Now Playing</em> title and options icon.</li>
      <li><strong>Album Cover Art</strong>: Square image with generously rounded corners (<code>rounded-3xl</code>).</li>
      <li><strong>Track Metadata</strong>: Track title, artist and heart (favorites) icon.</li>
      <li><strong>Progress Bar (Scrubber)</strong>: Slider line with elapsed and total times.</li>
      <li><strong>Playback Controls</strong>: Horizontal row with shuffle, previous, the main elevated floating Play/Pause button, next and repeat.</li>
    </ul>
  </div>
</div>

#### The Screen's Component Tree

If we break the visual screen above down into the hierarchy that the Flutter engine processes, we get the following tree structure:

<div style={{ textAlign: 'center', margin: '24px 0' }}>
  <img 
    src="/img/seminario-de-i-d-i/arbol-componentes-player.svg" 
    alt="Widget tree of the Music Player screen" 
    style={{ width: '100%', maxWidth: '880px', borderRadius: '12px' }} 
  />
</div>

### Which Files Do You Need to Create to Implement This Architecture?

Following the course's best practices and folder convention, **we do not put all of this code in one giant file**. We split the screen into a host **Page** and four independent **Components**:

```
lib/
├── main.dart
├── pages/
│   └── music_player_page.dart    # Scaffold, AppBar and nesting of the main Column
└── components/
    ├── album_cover_art.dart      # Cover art with rounded corners (ClipRRect)
    ├── track_metadata.dart       # Title, artist and favorite button (Row + Text + IconButton)
    ├── player_progress_bar.dart  # Progress bar with times (Slider + Row)
    └── playback_controls.dart    # Playback controls with elevated main button
```

#### 1. Cover Art Component (`lib/components/album_cover_art.dart`)

It receives the image URL or resource and wraps it with the desired style:

```dart title="lib/components/album_cover_art.dart" showLineNumbers
import 'package:flutter/material.dart';

class AlbumCoverArt extends StatelessWidget {
  final String imageUrl;

  const AlbumCoverArt({super.key, required this.imageUrl});

  @override
  Widget build(BuildContext context) {
    return Center(
      child: ClipRRect(
        borderRadius: BorderRadius.circular(28),
        child: Image.network(
          imageUrl,
          width: 300,
          height: 300,
          fit: BoxFit.cover,
        ),
      ),
    );
  }
}
```

#### 2. Track Metadata Component (`lib/components/track_metadata.dart`)

It shows the title, the artist subtitle and the favorite button:

```dart title="lib/components/track_metadata.dart" showLineNumbers
import 'package:flutter/material.dart';

class TrackMetadata extends StatelessWidget {
  final String title;
  final String artist;
  final bool isFavorite;
  final VoidCallback onFavoriteToggle;

  const TrackMetadata({
    super.key,
    required this.title,
    required this.artist,
    required this.isFavorite,
    required this.onFavoriteToggle,
  });

  @override
  Widget build(BuildContext context) {
    return Padding(
      padding: const EdgeInsets.symmetric(horizontal: 24.0),
      child: Row(
        mainAxisAlignment: MainAxisAlignment.spaceBetween,
        children: [
          Column(
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              Text(
                title,
                style: const TextStyle(fontSize: 22, fontWeight: FontWeight.bold),
              ),
              const SizedBox(height: 4),
              Text(
                artist,
                style: const TextStyle(fontSize: 15, color: Colors.grey),
              ),
            ],
          ),
          IconButton(
            icon: Icon(isFavorite ? Icons.favorite : Icons.favorite_border),
            color: isFavorite ? Colors.redAccent : Colors.grey,
            iconSize: 28,
            onPressed: onFavoriteToggle,
          ),
        ],
      ),
    );
  }
}
```

#### 3. Progress Bar Component (`lib/components/player_progress_bar.dart`)

It encapsulates the slider and the time labels:

```dart title="lib/components/player_progress_bar.dart" showLineNumbers
import 'package:flutter/material.dart';

class PlayerProgressBar extends StatelessWidget {
  final double currentSeconds;
  final double totalSeconds;
  final ValueChanged<double> onSeek;

  const PlayerProgressBar({
    super.key,
    required this.currentSeconds,
    required this.totalSeconds,
    required this.onSeek,
  });

  @override
  Widget build(BuildContext context) {
    return Padding(
      padding: const EdgeInsets.symmetric(horizontal: 16.0),
      child: Column(
        children: [
          Slider(
            value: currentSeconds,
            max: totalSeconds,
            onChanged: onSeek,
          ),
          const Padding(
            padding: EdgeInsets.symmetric(horizontal: 16.0),
            child: Row(
              mainAxisAlignment: MainAxisAlignment.spaceBetween,
              children: [
                Text('01:42', style: TextStyle(fontSize: 12, color: Colors.grey)),
                Text('03:45', style: TextStyle(fontSize: 12, color: Colors.grey)),
              ],
            ),
          ),
        ],
      ),
    );
  }
}
```

#### 4. Playback Controls Component (`lib/components/playback_controls.dart`)

A row with secondary buttons and the primary Play/Pause button:

```dart title="lib/components/playback_controls.dart" showLineNumbers
import 'package:flutter/material.dart';

class PlaybackControls extends StatelessWidget {
  final bool isPlaying;
  final VoidCallback onPlayPauseToggle;

  const PlaybackControls({
    super.key,
    required this.isPlaying,
    required this.onPlayPauseToggle,
  });

  @override
  Widget build(BuildContext context) {
    return Row(
      mainAxisAlignment: MainAxisAlignment.spaceEvenly,
      children: [
        IconButton(icon: const Icon(Icons.shuffle), onPressed: () {}),
        IconButton(icon: const Icon(Icons.skip_previous), iconSize: 36, onPressed: () {}),
        // Main Material 3 style play button
        FloatingActionButton.large(
          onPressed: onPlayPauseToggle,
          shape: const CircleBorder(),
          child: Icon(isPlaying ? Icons.pause : Icons.play_arrow, size: 40),
        ),
        IconButton(icon: const Icon(Icons.skip_next), iconSize: 36, onPressed: () {}),
        IconButton(icon: const Icon(Icons.repeat), onPressed: () {}),
      ],
    );
  }
}
```

#### 5. The Assembling Screen (`lib/pages/music_player_page.dart`)

Notice how clean and readable the host screen becomes when it delegates each area to its respective component in the tree:

```dart title="lib/pages/music_player_page.dart" showLineNumbers
import 'package:flutter/material.dart';
import 'package:mi_proyecto/components/album_cover_art.dart';
import 'package:mi_proyecto/components/track_metadata.dart';
import 'package:mi_proyecto/components/player_progress_bar.dart';
import 'package:mi_proyecto/components/playback_controls.dart';

class MusicPlayerPage extends StatelessWidget {
  const MusicPlayerPage({super.key});

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        leading: const Icon(Icons.arrow_back),
        title: const Text('Now Playing'),
        centerTitle: true,
        actions: [
          IconButton(icon: const Icon(Icons.more_vert), onPressed: () {}),
        ],
      ),
      body: SingleChildScrollView(
        child: Column(
          children: [
            const SizedBox(height: 20),
            // Child node 1: Cover art
            const AlbumCoverArt(
              imageUrl: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=600',
            ),
            const SizedBox(height: 32),
            // Child node 2: Metadata
            TrackMetadata(
              title: 'Echoes in the Sky',
              artist: 'Aura Echoes',
              isFavorite: true,
              onFavoriteToggle: () {},
            ),
            const SizedBox(height: 16),
            // Child node 3: Progress
            PlayerProgressBar(
              currentSeconds: 102,
              totalSeconds: 225,
              onSeek: (value) {},
            ),
            const SizedBox(height: 24),
            // Child node 4: Controls
            PlaybackControls(
              isPlaying: true,
              onPlayPauseToggle: () {},
            ),
          ],
        ),
      ),
    );
  }
}
```

:::tip[Single Responsibility Principle]
If you need to redesign the play button or the time progress bar, you do not have to modify `music_player_page.dart`. You only edit the corresponding individual component, which reduces the risk of introducing errors in the rest of the screen.
:::

---

## 4. Basic Widgets: Text, Image and Buttons

Flutter provides an extensive set of ready-to-use primitive widgets for your interfaces.

<div style={{ textAlign: 'center', margin: '24px 0' }}>
  <img 
    src="/img/seminario-de-i-d-i/widgets-basicos-flutter.svg" 
    alt="Basic widgets in Flutter: Text, Image and Buttons" 
    style={{ width: '100%', maxWidth: '820px', borderRadius: '12px' }} 
  />
</div>

### A. Text and TextStyle

The `Text` widget displays a string of characters on screen, applying styles through the `TextStyle` class:

```dart title="Text examples" showLineNumbers
Text(
  'Welcome to the R&D&I Seminar',
  style: TextStyle(
    fontSize: 20,
    fontWeight: FontWeight.bold,
    color: Colors.blueGrey.shade900,
    letterSpacing: 0.5,
  ),
  textAlign: TextAlign.center,
  maxLines: 2,
  overflow: TextOverflow.ellipsis, // Cuts with '...' if it exceeds the available space
)
```

### B. Image: Asset vs. Network

Images in Flutter can come locally from the application package or be downloaded remotely from the internet:

- **`Image.asset()` (Local Resources)**:
  Use it for the app's own static resources (logos, icons, offline illustrations). To use them:
  1. Create the `assets/images/` folder at the project root and copy your file into it (for example, `logo.png`).
  2. Declare the path in `pubspec.yaml`:
     ```yaml title="pubspec.yaml" showLineNumbers
     flutter:
       uses-material-design: true
       assets:
         - assets/images/
     ```
  3. Load the widget in your code:
     ```dart title="Image.asset" showLineNumbers
     Image.asset(
       'assets/images/logo.png',
       width: 120,
       height: 120,
       fit: BoxFit.contain,
     )
     ```

- **`Image.network()` (Remote Resources)**:
  Use it when the URL comes from a database or an external API (such as user profiles or product photos in Supabase):
  ```dart title="Image.network" showLineNumbers
  Image.network(
    'https://images.unsplash.com/photo-1579546929518-9e396f3cc809?w=600',
    height: 180,
    width: double.infinity,
    fit: BoxFit.cover,
    loadingBuilder: (context, child, progress) {
      if (progress == null) return child;
      return const Center(child: CircularProgressIndicator());
    },
    errorBuilder: (context, error, stackTrace) {
      return const Icon(Icons.broken_image, size: 48, color: Colors.grey);
    },
  )
  ```

### C. Material 3 Buttons

In Material 3 we have three main button variants, each designed to express a different level of visual attention hierarchy:

| Widget               | Visual Hierarchy  | Use Case                                                        |
| :------------------- | :---------------- | :-------------------------------------------------------------- |
| **`ElevatedButton`** | High / Prominent  | Primary actions (Save, Sign up, Confirm purchase).              |
| **`OutlinedButton`** | Medium            | Secondary actions (Cancel, Back, Alternative filters).          |
| **`TextButton`**     | Low / Subtle      | Tertiary actions in cards or dialogs (See more, Terms).         |

```dart title="Material 3 buttons example" showLineNumbers
// Button with a defined action
ElevatedButton.icon(
  onPressed: () {
    debugPrint('Save pressed');
  },
  icon: const Icon(Icons.save),
  label: const Text('Save'),
)

// Disabled button (onPressed is null)
ElevatedButton(
  onPressed: null,
  child: const Text('Disabled'),
)
```

:::warning[The onPressed Event Is Required]
If you pass `null` to the `onPressed` parameter, Flutter automatically disables the button, turning it gray and blocking any touch interaction. To keep it interactive without any logic yet, pass an empty anonymous function: `onPressed: () {}`.
:::

---

## 5. Modular Architecture: Pages vs. Components

As an application grows, writing all the code in a single file leads to disorder and makes teamwork difficult. In this course we adopt a clean convention based on two folders inside `lib/`:

<div style={{ textAlign: 'center', margin: '24px 0' }}>
  <img 
    src="/img/seminario-de-i-d-i/pages-vs-components.svg" 
    alt="Architecture pattern: Pages vs Components" 
    style={{ width: '100%', maxWidth: '820px', borderRadius: '12px' }} 
  />
</div>

### The `lib/pages/` Convention (or `lib/screens/`)

- It represents a **full screen** of the device.
- It must return a **`Scaffold`** container widget (with its `appBar`, `body`, and optionally `floatingActionButton` or `bottomNavigationBar`).
- It knows the navigation context and coordinates data loading.
- Recommended naming: `name_page.dart` (example: `home_page.dart`, `profile_page.dart`).

### The `lib/components/` Convention (or `lib/widgets/`)

- It represents a **modular, reusable visual piece**.
- It **never** contains a `Scaffold`; it uses composition widgets such as `Container`, `Card`, `Row`, `Column` or `Padding`.
- It is agnostic of the screen: it receives its data through its constructor and delegates actions through _callbacks_.
- Recommended naming: `name_card.dart` or `custom_button.dart`.

---

## Self-Assessment Quiz

<Quiz id="s9-estructura-main-widgets-quiz">
  <Question title="What is the exclusive role of the 'lib/' folder in a Flutter project?">
    <Option>To store the compiled Gradle binary files and iOS provisioning profiles.</Option>
    <Option correct>To hold 100% of the application's Dart source code (pages, components, models and logic).</Option>
    <Option>To store only the unit and integration test files.</Option>
    <Option>To host the native C++ drivers for the game engine.</Option>
  </Question>
  <Question title="What is the purpose of the 'runApp(const MyApp())' statement inside the main() function in Dart?">
    <Option>To synchronously run a migration script on the local database.</Option>
    <Option>To compile the source code to Java Virtual Machine bytecode.</Option>
    <Option correct>To initialize the Flutter engine, start the rendering subsystems and mount the root widget on screen.</Option>
    <Option>To automatically download all the dependencies declared in pubspec.yaml.</Option>
  </Question>
  <Question title="In the Flutter component tree metaphor, what role does the 'Scaffold' widget play?">
    <Option>It works as a leaf node to display rich-formatted text.</Option>
    <Option correct>It acts as the structural frame of a screen, providing standard areas such as AppBar, Body and FloatingActionButton.</Option>
    <Option>It is a background service that listens for network requests with no graphical interface.</Option>
    <Option>It is the internal compiler in charge of optimizing Dart code into ARM machine language.</Option>
  </Question>
  <Question title="When breaking down a screen like the music player, what is the difference between 'lib/pages/' and 'lib/components/'?">
    <Option>Pages are written in Java, while components are written in TypeScript.</Option>
    <Option correct>Pages return a Scaffold and represent full views, while components are modular pieces without a Scaffold that receive data through the constructor.</Option>
    <Option>Components cannot receive styles or detect user taps.</Option>
    <Option>Pages do not support child widgets and can only render plain text.</Option>
  </Question>
  <Question title="To use a local image with 'Image.asset(&quot;assets/images/cover.png&quot;)', which prior configuration is required?">
    <Option>Converting the image to a TTF font file.</Option>
    <Option>Uploading the image to a public cloud storage bucket.</Option>
    <Option correct>Explicitly declaring the folder or the file in the 'flutter: assets:' section of pubspec.yaml.</Option>
    <Option>Adding the internet access permission to the AndroidManifest.xml file.</Option>
  </Question>
  <Question title="What effect does assigning 'onPressed: null' have on a Material 3 button widget such as ElevatedButton?">
    <Option>It throws a fatal exception error that stops the app's execution.</Option>
    <Option correct>It visually disables the button, turning it grayish and blocking any touch interaction.</Option>
    <Option>It runs a retry action in an infinite background loop.</Option>
    <Option>It hides the button completely, making it invisible but keeping its space.</Option>
  </Question>
</Quiz>

