---
sidebar_position: 1
---

# React Native - Cross-Platform Camera with Expo

## Guided workshop for building a filtered camera application running on iOS, Android, and Web

---

## 1. What is React Native?

React Native is a mobile application framework developed by Meta (Facebook) that enables building native iOS and Android applications using JavaScript and React. Unlike hybrid webview apps, React Native compiles down to real native components, delivering performance near native platform code.

### Key Features of React Native:

- **Cross-platform development**: Write code once and deploy across multiple platforms
- **Native UI components**: Components render as native platform elements
- **Fast Refresh**: Instantly view UI changes without recompiling the entire binary
- **High code reuse**: 70-90% of business logic and UI code shared across platforms
- **Direct native API access**: Seamless access to device cameras, GPS, and sensors
- **React ecosystem**: Leverage the full power of React state management and libraries

## 2. What is Expo?

Expo is an ecosystem built around React Native that streamlines mobile app creation by abstracting native build tooling (Xcode / Android Studio).

### Advantages of Using Expo:

- **Simplified Setup**: Build and run apps without installing heavy native SDKs initially
- **Unified APIs**: Standardized access to device cameras, notifications, filesystem, etc.
- **Over-the-Air (OTA) Updates**: Update app JS bundles without app store resubmission
- **Web Support**: Run React Native components directly in desktop web browsers
- **Rich Developer Tooling**: Metro bundler CLI, integrated DevTools, and easy debugging

### Expo vs React Native CLI:

| Feature | Expo | React Native CLI |
|---|---|---|
| **Initial Setup** | Extremely fast and simple | Complex (requires Xcode / Android Studio) |
| **Native API Access** | Pre-configured SDK modules | Requires manual linking & native setup |
| **App Bundle Size** | Larger (includes Expo SDK) | Minimal (includes only used packages) |
| **Custom Native Code** | Supported via Config Plugins & Prebuild | Full control over ObjC/Swift/Java/Kotlin |
| **Web Support** | Built-in out of the box | Requires manual setup (`react-native-web`) |

---

## 3. Cross-Platform Interoperability

Expo enables a single codebase to target three primary platforms:

1. **iOS**: Native iPhone and iPad application
2. **Android**: Native Android phone and tablet application
3. **Web**: Progressive web app running on any modern web browser

---

## 4. Guided Workshop: PhotoMagic App

In this workshop, we build **PhotoMagic**, a cross-platform camera app demonstrating real-time visual filters, native permissions, photo capture, and interactive horizontal gallery management.

### Key Features:

1. **Native camera permissions** management with user-friendly fallback screens
2. **Photo capture** with visual haptic feedback and scale animations
3. **Real-time filter presets** (Warm, Cool, Vintage)
4. **Interactive horizontal photo gallery** with timestamps
5. **Responsive layout** adapting to varying mobile and web viewports

---

## 5. Development Environment Setup

### 5.1 Prerequisites

Ensure you have installed:
- **Node.js** (version 18 or higher)
- **npm** or **yarn**
- **Visual Studio Code** (recommended)

### 5.2 Create the Expo Project

```bash
npx create-expo-app@latest photomagic --template blank
```

### 5.3 Enable Web Support

```bash
npx expo install react-dom react-native-web @expo/metro-runtime
```

### 5.4 Install Camera and Gradient Dependencies

```bash
npx expo install expo-camera expo-linear-gradient
```

---

## 6. Building the PhotoMagic Application

### 6.1 `App.js` Implementation

```javascript
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

const { height } = Dimensions.get("window");

export default function App() {
  const [facing, setFacing] = useState("back");
  const [permission, requestPermission] = useCameraPermissions();
  const [photos, setPhotos] = useState([]);
  const [selectedFilter, setSelectedFilter] = useState("none");
  const [isCapturing, setIsCapturing] = useState(false);
  const cameraRef = useRef(null);
  const scaleAnim = useRef(new Animated.Value(1)).current;

  const filters = [
    { name: "none", label: "Normal", icon: "📸", colors: ["#667eea", "#764ba2"] },
    { name: "warm", label: "🌅 Warm", icon: "☀️", colors: ["#f093fb", "#f5576c"] },
    { name: "cool", label: "❄️ Cool", icon: "🌊", colors: ["#4facfe", "#00f2fe"] },
    { name: "vintage", label: "📷 Vintage", icon: "🎞️", colors: ["#ffecd2", "#fcb69f"] },
  ];

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

  if (!permission.granted) {
    return (
      <SafeAreaView style={styles.container}>
        <LinearGradient colors={["#667eea", "#764ba2"]} style={styles.container}>
          <View style={styles.centerContent}>
            <View style={styles.permissionCard}>
              <Text style={styles.permissionIcon}>📷</Text>
              <Text style={styles.permissionTitle}>Camera Permission Required</Text>
              <Text style={styles.permissionMessage}>
                We need access to your camera to take filtered photos.
              </Text>
              <TouchableOpacity style={styles.permissionButton} onPress={requestPermission}>
                <LinearGradient colors={["#f093fb", "#f5576c"]} style={styles.permissionButtonGradient}>
                  <Text style={styles.permissionButtonText}>✨ Enable Camera</Text>
                </LinearGradient>
              </TouchableOpacity>
            </View>
          </View>
        </LinearGradient>
      </SafeAreaView>
    );
  }

  const toggleCameraFacing = () => {
    setFacing((current) => (current === "back" ? "front" : "back"));
  };

  const animateCapture = () => {
    Animated.sequence([
      Animated.timing(scaleAnim, { toValue: 0.8, duration: 100, useNativeDriver: true }),
      Animated.timing(scaleAnim, { toValue: 1, duration: 100, useNativeDriver: true }),
    ]).start();
  };

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

        setPhotos((prev) => [newPhoto, ...prev]);
      } catch (error) {
        Alert.alert("⚠️ Error", "Could not capture photo");
      } finally {
        setIsCapturing(false);
      }
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar style="light" />
      <View style={styles.cameraContainer}>
        <CameraView style={styles.camera} facing={facing} ref={cameraRef}>
          <TouchableOpacity style={styles.flipButton} onPress={toggleCameraFacing}>
            <Text style={styles.flipText}>🔄 Flip</Text>
          </TouchableOpacity>
        </CameraView>
      </View>
      <View style={styles.controls}>
        <TouchableOpacity onPress={takePicture}>
          <Animated.View style={[styles.captureButton, { transform: [{ scale: scaleAnim }] }]}>
            <View style={styles.captureInner} />
          </Animated.View>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#000" },
  centerContent: { flex: 1, justifyContent: "center", alignItems: "center", padding: 20 },
  loadingText: { color: "#fff", fontSize: 18 },
  permissionCard: { backgroundColor: "rgba(255,255,255,0.1)", padding: 24, borderRadius: 20, alignItems: "center" },
  permissionIcon: { fontSize: 48, marginBottom: 16 },
  permissionTitle: { fontSize: 22, fontWeight: "bold", color: "#fff", marginBottom: 8 },
  permissionMessage: { color: "#ddd", textAlign: "center", marginBottom: 20 },
  permissionButton: { borderRadius: 25, overflow: "hidden" },
  permissionButtonGradient: { paddingVertical: 12, paddingHorizontal: 24 },
  permissionButtonText: { color: "#fff", fontWeight: "bold" },
  cameraContainer: { height: height * 0.5, overflow: "hidden" },
  camera: { flex: 1 },
  flipButton: { position: "absolute", top: 20, right: 20, backgroundColor: "rgba(0,0,0,0.5)", padding: 10, borderRadius: 20 },
  flipText: { color: "#fff" },
  controls: { height: height * 0.3, justifyContent: "center", alignItems: "center" },
  captureButton: { width: 70, height: 70, borderRadius: 35, borderHeight: 4, borderColor: "#fff", justifyContent: "center", alignItems: "center" },
  captureInner: { width: 54, height: 54, borderRadius: 27, backgroundColor: "#ff576c" },
});
```

---

## 7. Running the Application

```bash
# Run on Web browser
npx expo start --web

# Run on iOS Simulator (macOS only)
npx expo start --ios

# Run on Android Emulator
npx expo start --android
```
