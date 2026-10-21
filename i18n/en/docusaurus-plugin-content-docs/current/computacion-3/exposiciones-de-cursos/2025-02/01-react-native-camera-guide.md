---
sidebar_position: 1
description: "Build, step by step, a camera app with filters in React Native and Expo that runs on iOS, Android and the web."
---

# React Native - Cross-Platform Camera with Expo

## Guided workshop for building a filtered camera application running on iOS, Android, and Web

---

## 1. What is React Native?

React Native is a mobile development framework created by Facebook (Meta) that lets you build native applications for iOS and Android using JavaScript and React. Unlike hybrid web applications, React Native compiles to real native components, providing performance close to that of traditional native applications.

### Key Features of React Native:

- **Cross-platform development**: Write once and deploy to multiple platforms
- **Native components**: Components are rendered as native elements of each platform
- **Hot Reload**: See changes instantly without rebuilding the whole application
- **Code reuse**: Roughly 70-90% of the code can be reused across platforms
- **Native performance**: Direct access to the device's native APIs
- **React ecosystem**: Takes advantage of the whole React ecosystem and knowledge

## 2. What is Expo?

Expo is a platform and set of tools built around React Native that significantly simplifies mobile application development. It provides an abstraction layer that makes it easier to access the device's native features.

### Advantages of Using Expo:

- **Simplified setup**: You do not need to configure Xcode or Android Studio to get started
- **Unified APIs**: Consistent access to features such as camera, location, notifications, etc.
- **Over-the-Air Updates**: Update your app without going through the app stores
- **Web development**: Run your React Native application directly in the browser
- **Development tools**: Powerful CLI, built-in DevTools, and simplified debugging

### Expo vs React Native CLI:

| Feature                   | Expo                         | React Native CLI                         |
| ------------------------- | ---------------------------- | ---------------------------------------- |
| **Initial setup**         | Very simple                  | Complex (requires native setup)          |
| **Native API access**     | Pre-configured               | Requires manual setup                    |
| **App size**              | Larger (includes full SDK)   | Smaller (only what you use)              |
| **Flexibility**           | Limited to the Expo SDK      | Full control of the native code          |
| **Web development**       | Included                     | Requires additional setup                |

## 3. Cross-Platform Interoperability

One of the main advantages of React Native with Expo is the ability to run the same application on multiple platforms without significant code changes.

### Supported Platforms:

1. **iOS**: Native application for iPhone and iPad
2. **Android**: Native application for Android devices
3. **Web**: Web application that works in any modern browser

### Components That Demonstrate Interoperability:

- **Camera**: Unified access to the device camera on all platforms
- **User interface**: Components that automatically adapt to each platform
- **Gestures and animations**: They work consistently on all platforms
- **Storage**: Local data handling that adapts to each environment

## 4. Guided Workshop Context

In this workshop we will build **PhotoMagic**, a camera application with filters that demonstrates React Native's interoperability. The application will include:

- **Camera access**: Permission handling and photo capture
- **Filter system**: Real-time visual effects
- **Interactive gallery**: Viewing and managing captured photos
- **Modern interface**: Use of gradients and animations
- **Complete functionality**: Camera switching, photo deletion, and more

### Main Features:

1. **Camera permission handling** with a friendly interface
2. **Photo capture** with visual feedback and animations
3. **Filter system** (Warm, Cool, Vintage)
4. **Horizontal gallery** with timestamp information
5. **Responsive interface** that adapts to different screen sizes
6. **Cross-platform execution** with no code changes

## 5. Development Environment Setup

### 5.1. Prerequisites

Before you start, make sure you have installed:

- **Node.js** (version 18 or higher)
- **npm** or **yarn**
- **Visual Studio Code** (recommended)
- **Expo CLI** (it will be installed automatically)

### 5.2. Visual Studio Code Extensions

It is essential to install the following extensions in VS Code for an optimal development experience:

1. **ES7+ React/Redux/React-Native snippets** - Useful snippets for React Native
2. **Prettier - Code formatter** - Automatic code formatting
3. **ESLint** - Linting and error detection
4. **Expo Tools** - Tools specific to Expo development
5. **React Native Tools** - Debugging and React Native support

To install these extensions:

1. Open VS Code
2. Go to the extensions section (Ctrl+Shift+X)
3. Search for each extension by name and install it

### 5.3. Creating the Project

Run the following command to create a new project with Expo:

```bash
npx create-expo-app@latest photomagic --template blank
```

This command:

- Creates a new project called "photomagic"
- Uses the "blank" template, which provides a minimal base
- Installs all the necessary dependencies automatically

### 5.4. Web Development Setup

To enable web development, install the additional dependencies:

```bash
npx expo install react-dom react-native-web @expo/metro-runtime
```

These dependencies allow:

- **react-dom**: Rendering React components in the DOM
- **react-native-web**: Adapter that translates React Native components into web elements
- **@expo/metro-runtime**: Runtime required by the Metro bundler

### 5.5. ESLint and Prettier Setup

#### 5.5.1. Initializing ESLint

First, initialize ESLint in your project:

```bash
npx expo lint
```

This command generates the basic ESLint configuration optimized for Expo.

#### 5.5.2. Installing Prettier

Install Prettier and the required configurations:

```bash
npx expo install -- --save-dev prettier eslint-config-prettier eslint-plugin-prettier
```

#### 5.5.3. ESLint Configuration

Create or update the `eslint.config.js` file in the project root:

```javascript title="eslint.config.js"
const { defineConfig } = require("eslint/config");
const expoConfig = require("eslint-config-expo/flat");

module.exports = defineConfig([
  expoConfig,
  {
    ignores: ["dist/*"],
  },
  // Prettier integration
  {
    plugins: {
      prettier: require("eslint-plugin-prettier"),
    },
    extends: [require("eslint-config-prettier")],
    rules: {
      "prettier/prettier": "error",
    },
  },
]);
```

#### 5.5.4. Prettier Configuration

Create a `.prettierrc` file in the project root:

```json title="Prettier configuration"
{
  "semi": true,
  "trailingComma": "all",
  "singleQuote": false,
  "printWidth": 80,
  "tabWidth": 2,
  "useTabs": false
}
```

### 5.6. Installing Specific Dependencies

Install the dependencies required for the camera and gradient features:

```bash
npx expo install expo-camera
```

```bash
npm install expo-linear-gradient
```

### 5.7. Project Structure

After the setup, your project should have this structure:

```
metacritic-app/
├── .prettierrc
├── eslint.config.js
├── package.json
├── App.js
├── app.json
├── babel.config.js
└── assets/
    ├── icon.png
    └── splash.png
```

## 6. Building the PhotoMagic Application

### 6.1. Initial `App.js` Setup

We start by importing all the necessary dependencies. Replace the contents of `App.js` with:

```javascript title="App.js"
import { StatusBar } from "expo-status-bar";
import { useState, useRef } from "react";
import {
  StyleSheet,
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  Image,
  Alert,
  Dimensions,
  SafeAreaView,
  Animated,
} from "react-native";
import { CameraView, useCameraPermissions } from "expo-camera";
import { LinearGradient } from "expo-linear-gradient";
```

### 6.2. State and Constants Setup

Add the following setup after the imports:

```javascript title="State and constants setup"
const { height } = Dimensions.get("window");

export default function App() {
  const [facing, setFacing] = useState("back");
  const [permission, requestPermission] = useCameraPermissions();
  const [photos, setPhotos] = useState([]);
  const [selectedFilter, setSelectedFilter] = useState("none");
  const [isCapturing, setIsCapturing] = useState(false);
  const cameraRef = useRef(null);
  const scaleAnim = useRef(new Animated.Value(1)).current;

  // Filter configuration
  const filters = [
    {
      name: "none",
      label: "Photos",
      icon: "📸",
      colors: ["#667eea", "#764ba2"],
    },
    {
      name: "warm",
      label: "🌅 Warm",
      icon: "☀️",
      colors: ["#f093fb", "#f5576c"],
    },
    {
      name: "cool",
      label: "❄️ Cool",
      icon: "🌊",
      colors: ["#4facfe", "#00f2fe"],
    },
    {
      name: "vintage",
      label: "📷 Vintage",
      icon: "🎞️",
      colors: ["#ffecd2", "#fcb69f"],
    },
  ];
```

### 6.3. Camera Permission Handling

Proper permission handling is crucial for a smooth user experience:

```javascript title="Camera permission handling"
// Loading screen
if (!permission) {
  return (
    <SafeAreaView style={styles.container}>
      <LinearGradient colors={["#667eea", "#764ba2"]} style={styles.container}>
        <View style={styles.centerContent}>
          <Text style={styles.loadingText}>📱 Loading camera...</Text>
        </View>
      </LinearGradient>
    </SafeAreaView>
  );
}

// Permission request screen
if (!permission.granted) {
  return (
    <SafeAreaView style={styles.container}>
      <LinearGradient colors={["#667eea", "#764ba2"]} style={styles.container}>
        <View style={styles.centerContent}>
          <View style={styles.permissionCard}>
            <Text style={styles.permissionIcon}>📷</Text>
            <Text style={styles.permissionTitle}>We need the camera!</Text>
            <Text style={styles.permissionMessage}>
              To take amazing photos with cool filters
            </Text>
            <TouchableOpacity
              style={styles.permissionButton}
              onPress={requestPermission}
            >
              <LinearGradient
                colors={["#f093fb", "#f5576c"]}
                style={styles.permissionButtonGradient}
              >
                <Text style={styles.permissionButtonText}>
                  ✨ Enable Camera
                </Text>
              </LinearGradient>
            </TouchableOpacity>
          </View>
        </View>
      </LinearGradient>
    </SafeAreaView>
  );
}
```

### 6.4. Main Functions

#### 6.4.1. Switching Cameras

```javascript title="Switching cameras"
const toggleCameraFacing = () => {
  setFacing((current) => (current === "back" ? "front" : "back"));
};
```

#### 6.4.2. Capture Animation

```javascript title="Capture animation"
const animateCapture = () => {
  Animated.sequence([
    Animated.timing(scaleAnim, {
      toValue: 0.8,
      duration: 100,
      useNativeDriver: true,
    }),
    Animated.timing(scaleAnim, {
      toValue: 1,
      duration: 100,
      useNativeDriver: true,
    }),
  ]).start();
};
```

#### 6.4.3. Capturing Photos

```javascript title="Capturing photos"
const takePicture = async () => {
  if (cameraRef.current && !isCapturing) {
    try {
      setIsCapturing(true);
      animateCapture();

      const photo = await cameraRef.current.takePictureAsync({
        quality: 0.8,
        base64: false,
      });

      const newPhoto = {
        ...photo,
        filter: selectedFilter,
        id: Date.now().toString(),
        timestamp: new Date().toLocaleTimeString(),
      };

      setPhotos((prevPhotos) => [newPhoto, ...prevPhotos]);

      setTimeout(() => {
        Alert.alert(
          "📸 Photo captured!",
          "Your photo was saved with the selected filter"
        );
      }, 300);
    } catch (error) {
      Alert.alert("⚠️ Error", "The photo could not be taken");
    } finally {
      setIsCapturing(false);
    }
  }
};
```

#### 6.4.4. Gallery Management

```javascript title="Gallery management"
const deletePhoto = (photoId) => {
  Alert.alert(
    "🗑️ Delete photo",
    "Are you sure you want to delete this photo?",
    [
      { text: "Cancel", style: "cancel" },
      {
        text: "Delete",
        style: "destructive",
        onPress: () =>
          setPhotos((prevPhotos) =>
            prevPhotos.filter((photo) => photo.id !== photoId)
          ),
      },
    ]
  );
};

const clearAllPhotos = () => {
  Alert.alert("🗑️ Clear gallery", "Do you want to delete all the photos?", [
    { text: "Cancel", style: "cancel" },
    {
      text: "Delete all",
      style: "destructive",
      onPress: () => setPhotos([]),
    },
  ]);
};
```

### 6.5. Main Interface

The main interface uses a ScrollView to hold all the content:

```javascript title="Main interface"
const selectedFilterData = filters.find((f) => f.name === selectedFilter);

return (
  <ScrollView
    style={styles.container}
    contentContainerStyle={styles.scrollContainer}
  >
    <StatusBar style="light" />

    {/* Header with title */}
    <View style={styles.header}>
      <LinearGradient
        colors={selectedFilterData?.colors || ["#667eea", "#764ba2"]}
        style={styles.headerGradient}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 0 }}
      >
        <Text style={styles.headerTitle}>📷 PhotoMagic</Text>
        <Text style={styles.headerSubtitle}>
          {selectedFilterData?.icon} {selectedFilterData?.label}
        </Text>
      </LinearGradient>
    </View>

    {/* The rest of the interface continues... */}
  </ScrollView>
);
```

### 6.6. Camera Container

```javascript title="Camera container"
{
  /* Camera container */
}
<View style={styles.cameraContainer}>
  <CameraView style={styles.camera} facing={facing} ref={cameraRef} />

  {/* Overlay with color filter */}
  {selectedFilter !== "none" && (
    <View style={[styles.filterOverlay, getFilterStyle(selectedFilter)]} />
  )}

  {/* Decorative frame */}
  <View style={styles.cameraFrame} />

  {/* Top controls */}
  <View style={styles.topControls}>
    <TouchableOpacity style={styles.topButton} onPress={toggleCameraFacing}>
      <Text style={styles.topButtonIcon}>🔄</Text>
      <Text style={styles.topButtonText}>Switch</Text>
    </TouchableOpacity>

    <View style={styles.photoCounter}>
      <Text style={styles.photoCounterText}>📷 {photos.length}</Text>
    </View>
  </View>

  {/* Bottom controls */}
  <View style={styles.bottomControls}>
    <Animated.View
      style={[
        styles.captureButtonContainer,
        { transform: [{ scale: scaleAnim }] },
      ]}
    >
      <TouchableOpacity
        style={[
          styles.captureButton,
          isCapturing && styles.captureButtonDisabled,
        ]}
        onPress={takePicture}
        disabled={isCapturing}
      >
        <LinearGradient
          colors={isCapturing ? ["#999", "#666"] : ["#fff", "#f0f0f0"]}
          style={styles.captureButtonGradient}
        >
          <Text style={styles.captureButtonIcon}>
            {isCapturing ? "⏳" : "📸"}
          </Text>
        </LinearGradient>
      </TouchableOpacity>
    </Animated.View>
  </View>
</View>;
```

### 6.7. Filter System

```javascript title="Filter system"
{
  /* Filters */
}
<View style={styles.filtersSection}>
  <LinearGradient
    colors={["#1a1a2e", "#16213e"]}
    style={styles.filtersBackground}
  >
    <Text style={styles.filtersTitle}>✨ Filters</Text>
    <ScrollView
      horizontal
      showsHorizontalScrollIndicator={false}
      contentContainerStyle={styles.filtersContainer}
    >
      {filters.map((filter) => (
        <TouchableOpacity
          key={filter.name}
          style={styles.filterButton}
          onPress={() => setSelectedFilter(filter.name)}
        >
          <LinearGradient
            colors={
              selectedFilter === filter.name ? filter.colors : ["#333", "#444"]
            }
            style={[
              styles.filterButtonGradient,
              selectedFilter === filter.name && styles.filterButtonActive,
            ]}
          >
            <Text style={styles.filterIcon}>{filter.icon}</Text>
            <Text
              style={[
                styles.filterText,
                selectedFilter === filter.name && styles.filterTextActive,
              ]}
            >
              {filter.label.split(" ")[1]}
            </Text>
          </LinearGradient>
        </TouchableOpacity>
      ))}
    </ScrollView>
  </LinearGradient>
</View>;
```

### 6.8. Photo Gallery

```javascript title="Photo gallery"
{
  /* Photo gallery */
}
{
  photos.length > 0 && (
    <View style={styles.gallery}>
      <LinearGradient
        colors={["#0f0f23", "#1a1a2e"]}
        style={styles.galleryBackground}
      >
        <View style={styles.galleryHeader}>
          <Text style={styles.galleryTitle}>
            🖼️ Your Gallery ({photos.length})
          </Text>
          <TouchableOpacity onPress={clearAllPhotos} style={styles.clearButton}>
            <LinearGradient
              colors={["#ff6b6b", "#ee5a52"]}
              style={styles.clearButtonGradient}
            >
              <Text style={styles.clearButtonText}>🗑️ Clear</Text>
            </LinearGradient>
          </TouchableOpacity>
        </View>

        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.galleryScrollContent}
          style={styles.galleryScroll}
        >
          {photos.map((photo, index) => (
            <TouchableOpacity
              key={photo.id}
              style={[
                styles.photoContainer,
                { marginLeft: index === 0 ? 20 : 10 },
                { marginRight: index === photos.length - 1 ? 20 : 0 },
              ]}
              onPress={() => deletePhoto(photo.id)}
              activeOpacity={0.8}
            >
              <View style={styles.photoCard}>
                <Image
                  source={{ uri: photo.uri }}
                  style={styles.photo}
                  resizeMode="cover"
                />
                <View
                  style={[
                    styles.photoFilterOverlay,
                    getFilterStyle(photo.filter),
                  ]}
                />
                <LinearGradient
                  colors={["transparent", "rgba(0,0,0,0.8)"]}
                  style={styles.photoInfo}
                >
                  <Text style={styles.photoTime}>{photo.timestamp}</Text>
                  <Text style={styles.photoFilter}>
                    {filters.find((f) => f.name === photo.filter)?.icon}
                  </Text>
                </LinearGradient>
              </View>
            </TouchableOpacity>
          ))}
        </ScrollView>
      </LinearGradient>
    </View>
  );
}
```

### 6.9. Filter Function

Add this function outside the main component:

```javascript title="Filter function"
// Function to get filter styles
function getFilterStyle(filterName) {
  switch (filterName) {
    case "warm":
      return { backgroundColor: "rgba(255, 165, 0, 0.15)" };
    case "cool":
      return { backgroundColor: "rgba(0, 191, 255, 0.15)" };
    case "vintage":
      return { backgroundColor: "rgba(139, 69, 19, 0.2)" };
    default:
      return {};
  }
}
```

### 6.10. Complete Styles

Add all the styles at the end of the file:

```javascript title="Complete styles"
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#000",
  },
  scrollContainer: {
    flexGrow: 1,
  },
  centerContent: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 20,
  },
  loadingText: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "bold",
  },
  permissionCard: {
    backgroundColor: "rgba(255,255,255,0.1)",
    borderRadius: 20,
    padding: 30,
    alignItems: "center",
    backdropFilter: "blur(10px)",
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.2)",
  },
  permissionIcon: {
    fontSize: 60,
    marginBottom: 20,
  },
  permissionTitle: {
    color: "#fff",
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 10,
    textAlign: "center",
  },
  permissionMessage: {
    color: "#ddd",
    fontSize: 16,
    textAlign: "center",
    marginBottom: 30,
    lineHeight: 22,
  },
  permissionButton: {
    borderRadius: 25,
    overflow: "hidden",
  },
  permissionButtonGradient: {
    paddingHorizontal: 30,
    paddingVertical: 15,
  },
  permissionButtonText: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "bold",
  },
  header: {
    height: 80,
    overflow: "hidden",
  },
  headerGradient: {
    flex: 1,
    paddingHorizontal: 20,
    paddingTop: 10,
    justifyContent: "center",
  },
  headerTitle: {
    color: "#fff",
    fontSize: 24,
    fontWeight: "bold",
  },
  headerSubtitle: {
    color: "rgba(255,255,255,0.8)",
    fontSize: 14,
    marginTop: 2,
  },
  cameraContainer: {
    height: height * 0.5,
    margin: 10,
    borderRadius: 20,
    overflow: "hidden",
    elevation: 10,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 5 },
    shadowOpacity: 0.3,
    shadowRadius: 10,
    position: "relative",
  },
  camera: {
    flex: 1,
  },
  filterOverlay: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    pointerEvents: "none",
  },
  cameraFrame: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    borderWidth: 3,
    borderColor: "rgba(255,255,255,0.3)",
    borderRadius: 20,
    pointerEvents: "none",
  },
  topControls: {
    position: "absolute",
    top: 20,
    left: 20,
    right: 20,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  topButton: {
    backgroundColor: "rgba(0,0,0,0.6)",
    borderRadius: 20,
    paddingHorizontal: 15,
    paddingVertical: 8,
    flexDirection: "row",
    alignItems: "center",
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.3)",
  },
  topButtonIcon: {
    fontSize: 16,
    marginRight: 5,
  },
  topButtonText: {
    color: "#fff",
    fontSize: 12,
    fontWeight: "bold",
  },
  photoCounter: {
    backgroundColor: "rgba(0,0,0,0.6)",
    borderRadius: 15,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.3)",
  },
  photoCounterText: {
    color: "#fff",
    fontSize: 12,
    fontWeight: "bold",
  },
  bottomControls: {
    position: "absolute",
    bottom: 30,
    left: 0,
    right: 0,
    alignItems: "center",
  },
  captureButtonContainer: {
    alignItems: "center",
  },
  captureButton: {
    width: 80,
    height: 80,
    borderRadius: 40,
    elevation: 10,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 5 },
    shadowOpacity: 0.3,
    shadowRadius: 10,
  },
  captureButtonGradient: {
    width: 80,
    height: 80,
    borderRadius: 40,
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 3,
    borderColor: "#333",
  },
  captureButtonIcon: {
    fontSize: 28,
  },
  captureButtonDisabled: {
    opacity: 0.7,
  },
  filtersSection: {
    height: 120,
  },
  filtersBackground: {
    flex: 1,
    paddingTop: 15,
  },
  filtersTitle: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
    paddingHorizontal: 20,
    marginBottom: 10,
  },
  filtersContainer: {
    paddingHorizontal: 15,
  },
  filterButton: {
    marginHorizontal: 5,
    borderRadius: 15,
    overflow: "hidden",
  },
  filterButtonGradient: {
    paddingHorizontal: 20,
    paddingVertical: 12,
    alignItems: "center",
    borderWidth: 2,
    borderColor: "transparent",
  },
  filterButtonActive: {
    borderColor: "#fff",
  },
  filterIcon: {
    fontSize: 20,
    marginBottom: 4,
  },
  filterText: {
    color: "#ccc",
    fontSize: 12,
    fontWeight: "bold",
  },
  filterTextActive: {
    color: "#fff",
  },
  gallery: {
    height: 140,
    marginBottom: 20,
  },
  galleryBackground: {
    flex: 1,
    paddingTop: 10,
  },
  galleryHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 20,
    marginBottom: 10,
    height: 40,
  },
  galleryTitle: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
  },
  clearButton: {
    borderRadius: 20,
    overflow: "hidden",
  },
  clearButtonGradient: {
    paddingHorizontal: 15,
    paddingVertical: 8,
    flexDirection: "row",
    alignItems: "center",
  },
  clearButtonText: {
    color: "#fff",
    fontSize: 14,
    fontWeight: "bold",
  },
  galleryScroll: {
    flex: 1,
  },
  galleryScrollContent: {
    alignItems: "center",
    paddingVertical: 5,
  },
  photoContainer: {
    alignItems: "center",
  },
  photoCard: {
    borderRadius: 12,
    overflow: "hidden",
    elevation: 5,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 5,
    backgroundColor: "#333",
  },
  photo: {
    width: 80,
    height: 80,
  },
  photoFilterOverlay: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
  },
  photoInfo: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    height: 25,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 8,
  },
  photoTime: {
    color: "#fff",
    fontSize: 8,
    fontWeight: "bold",
  },
  photoFilter: {
    fontSize: 12,
  },
});
```

## 7. Running the Application

### 7.1. Local Development

To run the application in development mode:

```bash title="Local development"
# Go to the project directory
cd metacritic-app

# Start the development server
npx expo start
```

This command starts the Metro development server and shows a QR code along with several run options.

### 7.2. Running on Different Platforms

#### 7.2.1. iOS (simulator)

```bash
npx expo start --ios
```

**Requirements:**

- macOS with Xcode installed
- iOS Simulator configured
- Xcode command line tools

#### 7.2.2. Android (emulator)

```bash
npx expo start --android
```

**Requirements:**

- Android Studio installed
- Android SDK configured
- Android emulator running

#### 7.2.3. Web (browser)

```bash
npx expo start --web
```

**Advantages:**

- Requires no additional tools
- Fast development and debugging
- Works in any modern browser

### 7.3. Running on Physical Devices

#### 7.3.1. Using Expo Go (recommended for development)

1. Install **Expo Go** from:
   - App Store (iOS)
   - Google Play Store (Android)

2. Run the development command:

```bash
npx expo start
```

3. Scan the QR code with:
   - The device camera (iOS)
   - The Expo Go app (Android)

#### 7.3.2. Development Build

To create a custom development build:

```bash title="Development build"
# Build for iOS
npx expo run:ios

# Build for Android
npx expo run:android
```

## 8. Key Implementation Features

### 8.1. State Management with Hooks

The application uses several React hooks to manage state:

```javascript title="State management with Hooks"
// Main application state
const [facing, setFacing] = useState("back"); // Front/back camera
const [photos, setPhotos] = useState([]); // Array of captured photos
const [selectedFilter, setSelectedFilter] = useState("none"); // Active filter
const [isCapturing, setIsCapturing] = useState(false); // Capture state

// References and animations
const cameraRef = useRef(null); // Camera reference
const scaleAnim = useRef(new Animated.Value(1)).current; // Button animation
```

### 8.2. Native Components Used

The application makes use of several native React Native components:

- **SafeAreaView**: Safe area handling on different devices
- **ScrollView**: Vertical navigation with scrolling
- **TouchableOpacity**: Touch buttons with feedback
- **Animated**: Smooth native animations
- **Alert**: Native system dialogs
- **Dimensions**: Adaptation to different screen sizes

### 8.3. Native API Integration

#### 8.3.1. Camera (expo-camera)

```javascript title="Camera (expo-camera)"
// Hook for permission handling
const [permission, requestPermission] = useCameraPermissions();

// Camera component
<CameraView style={styles.camera} facing={facing} ref={cameraRef} />;

// Photo capture
const photo = await cameraRef.current.takePictureAsync({
  quality: 0.8,
  base64: false,
});
```

#### 8.3.2. Gradients (expo-linear-gradient)

```javascript title="Gradients (expo-linear-gradient)"
<LinearGradient
  colors={["#667eea", "#764ba2"]}
  style={styles.container}
  start={{ x: 0, y: 0 }}
  end={{ x: 1, y: 0 }}
>
  {/* Content */}
</LinearGradient>
```

### 8.4. Responsive Design

The application adapts to different screen sizes:

```javascript title="Responsive Design"
const { height } = Dimensions.get("window");

// Adaptive height for the camera
cameraContainer: {
  height: height * 0.5, // 50% of the screen height
  // ...
}
```

## 9. Cross-Platform Interoperability

### 9.1. Components That Work on All Platforms

| Component            | iOS | Android | Web | Notes                                     |
| -------------------- | --- | ------- | --- | ----------------------------------------- |
| **CameraView**       | Yes | Yes     | Yes | Access to the device/web camera           |
| **LinearGradient**   | Yes | Yes     | Yes | Native rendering on mobile, CSS on web    |
| **Animated**         | Yes | Yes     | Yes | Optimized native animations               |
| **ScrollView**       | Yes | Yes     | Yes | Native scroll on mobile, overflow on web  |
| **TouchableOpacity** | Yes | Yes     | Yes | Touch gestures on mobile, click on web    |

### 9.2. Automatic Platform Adaptations

#### 9.2.1. Camera Permissions

- **iOS**: Automatic request with a customizable message
- **Android**: Runtime permission handling
- **Web**: Browser permission request

#### 9.2.2. User Interface

- **iOS**: Elements with native iOS styling
- **Android**: Automatic Material Design
- **Web**: Adaptation to HTML/CSS elements

#### 9.2.3. Gestures and Navigation

- **Mobile**: Native touch gestures (tap, swipe, etc.)
- **Web**: Mouse and keyboard events

## 10. Debugging and Development Tools

### 10.1. React Native Debugger

For advanced debugging, install React Native Debugger:

```bash title="React Native Debugger"
# macOS
brew install --cask react-native-debugger

# Windows/Linux
# Download from the GitHub releases
```

### 10.2. Expo Dev Tools

The Expo development server includes built-in tools:

- **Metro Bundler**: Real-time code bundling
- **Network Inspector**: Network call inspection
- **Performance Monitor**: Performance monitoring
- **Element Inspector**: Element inspection like in DevTools

### 10.3. Debugging in VS Code

Set up direct debugging in VS Code by creating `.vscode/launch.json`:

```json title=".vscode/launch.json"
{
  "version": "0.2.0",
  "configurations": [
    {
      "name": "Debug iOS",
      "type": "reactnative",
      "request": "launch",
      "platform": "ios"
    },
    {
      "name": "Debug Android",
      "type": "reactnative",
      "request": "launch",
      "platform": "android"
    }
  ]
}
```

## 11. Optimization and Best Practices

### 11.1. Performance

#### 11.1.1. Using memo for Components

```javascript title="Using memo for components"
import { memo } from 'react';

const PhotoCard = memo(({ photo, onDelete }) => {
  return (
    // Optimized component
  );
});
```

#### 11.1.2. Image Optimization

```javascript title="Image optimization"
<Image
  source={{ uri: photo.uri }}
  style={styles.photo}
  resizeMode="cover"
  // Additional optimizations
  loadingIndicatorSource={{ uri: "placeholder" }}
  onLoad={() => setImageLoaded(true)}
/>
```

### 11.2. Memory Management

```javascript title="Memory management"
// Cleaning up timers and listeners
useEffect(() => {
  return () => {
    // Clean up resources
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }
  };
}, []);
```

### 11.3. Accessibility

```javascript title="Accessibility"
<TouchableOpacity
  style={styles.captureButton}
  onPress={takePicture}
  // Accessibility improvements
  accessible={true}
  accessibilityLabel="Capture photo"
  accessibilityHint="Tap to take a photo"
  accessibilityRole="button"
>
```

## 12. Testing the Application

### 12.1. Feature Verification

Test the following features on each platform:

1. **Camera permissions**
   - Initial permission request
   - Handling denied permissions
   - Re-requesting permissions

2. **Photo capture**
   - Capture with the back camera
   - Capture with the front camera
   - Applying filters
   - Capture animations

3. **Gallery management**
   - Viewing captured photos
   - Deleting individual photos
   - Deleting all photos at once
   - Timestamp and filter information

4. **Responsive interface**
   - Adaptation to different sizes
   - Device orientation
   - Vertical and horizontal scrolling

### 12.2. Testing on Different Devices

#### 12.2.1. iOS

```bash title="iOS"
# iPhone Simulator
npx expo start --ios

# Physical iPhone device
# Use Expo Go from the App Store
```

#### 12.2.2. Android

```bash title="Android"
# Android Emulator
npx expo start --android

# Physical Android device
# Use Expo Go from the Play Store
```

#### 12.2.3. Web

```bash
# Recommended browsers for testing
npx expo start --web

# Chrome, Firefox, Safari, Edge
```

## 13. Build and Distribution

### 13.1. Build for Distribution

#### 13.1.1. `app.json` Configuration

Update the configuration in `app.json`:

```json title="app.json"
{
  "expo": {
    "name": "PhotoMagic",
    "slug": "photo-magic-camera",
    "version": "1.0.0",
    "platforms": ["ios", "android", "web"],
    "permissions": ["CAMERA"],
    "ios": {
      "supportsTablet": true,
      "infoPlist": {
        "NSCameraUsageDescription": "This application needs access to the camera to take photos."
      }
    },
    "android": {
      "permissions": ["CAMERA"],
      "package": "com.yourname.photomagic"
    },
    "web": {
      "favicon": "./assets/favicon.png"
    }
  }
}
```

#### 13.1.2. Build with EAS (Expo Application Services)

```bash title="Build with EAS"
# Install EAS CLI
npm install -g @expo/eas-cli

# Configure the project
eas build:configure

# Build for iOS
eas build --platform ios

# Build for Android
eas build --platform android

# Build for all platforms
eas build --platform all
```

### 13.2. Web Deployment

```bash
# Build for web
npx expo export:web

# Deploy to services such as Netlify, Vercel, etc.
```

## 14. Conclusions

### 14.1. Demonstrated Benefits

The PhotoMagic implementation successfully demonstrates:

1. **Real interoperability**: A single codebase working on iOS, Android and the web
2. **Native API access**: Camera, permissions, and platform-specific features
3. **Native performance**: Animations and gestures that feel natural on each platform
4. **Efficient development**: Tools and workflows that speed up development

### 14.2. Ideal Use Cases for React Native

React Native with Expo is especially effective for:

- **Quick prototypes** that need validation on multiple platforms
- **Content applications** (social networks, news, e-commerce)
- **Productivity tools** that require cross-platform synchronization
- **Multimedia applications** with camera, video and audio features

### 14.3. Limitations to Consider

- **High-performance applications**: Games or applications with intensive graphics
- **Access to very specific APIs**: Highly particular features of each platform
- **Application size**: Expo apps tend to be larger
- **Ecosystem dependence**: Limited to the available APIs and modules

### 14.4. Suggested Next Steps

To continue developing your React Native skills:

1. **Explore navigation**: Implement React Navigation for multiple screens
2. **Global state management**: Integrate Redux or Zustand
3. **Data persistence**: Implement SQLite or AsyncStorage
4. **Push notifications**: Use Expo Notifications
5. **API integration**: Connect to backend services
6. **Advanced animations**: Explore Reanimated 3
7. **Testing**: Implement Jest and React Native Testing Library

## 15. Additional Resources

### 15.1. Official Documentation

- **React Native**: [https://reactnative.dev/](https://reactnative.dev/)
- **Expo**: [https://docs.expo.dev/](https://docs.expo.dev/)
- **Expo Camera**: [https://docs.expo.dev/versions/latest/sdk/camera/](https://docs.expo.dev/versions/latest/sdk/camera/)

### 15.2. Tools and Extensions

- **Expo CLI**: Main command-line tool
- **Expo Dev Client**: For development with custom native features
- **EAS Build**: Cloud build service
- **EAS Submit**: Automatic distribution to app stores

### 15.3. Community and Support

- **React Native Directory**: [https://reactnative.directory/](https://reactnative.directory/)
- **Expo Discord**: Active developer community
- **Stack Overflow**: "react-native" and "expo" tags
- **GitHub**: Official repositories and examples

---

**Congratulations!** You have successfully completed the implementation of a React Native application that demonstrates true cross-platform interoperability. PhotoMagic now runs natively on iOS, Android, and the web, using the same codebase and taking advantage of each platform's specific capabilities.
