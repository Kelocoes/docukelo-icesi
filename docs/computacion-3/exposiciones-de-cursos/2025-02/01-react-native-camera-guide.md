---
sidebar_position: 1
description: "Construye paso a paso una aplicación de cámara con filtros en React Native y Expo que funciona en iOS, Android y Web."
---

# React Native - Cámara Multiplataforma con Expo

## Taller guiado para la creación de una aplicación de cámara con filtros que funciona en iOS, Android y Web

---

## 1. ¿Qué es React Native?

React Native es un framework de desarrollo móvil creado por Facebook (Meta) que permite construir aplicaciones nativas para iOS y Android utilizando JavaScript y React. A diferencia de las aplicaciones web híbridas, React Native compila a componentes nativos reales, proporcionando un rendimiento cercano al de las aplicaciones nativas tradicionales.

### Características clave de React Native:

- **Desarrollo multiplataforma**: Escribes una vez y despliegas en múltiples plataformas
- **Componentes nativos**: Los componentes se renderizan como elementos nativos de cada plataforma
- **Hot Reload**: Permite ver cambios instantáneamente sin recompilar toda la aplicación
- **Reutilización de código**: Aproximadamente 70-90% del código puede reutilizarse entre plataformas
- **Performance nativo**: Acceso directo a APIs nativas del dispositivo
- **Ecosistema React**: Aprovecha todo el ecosistema y conocimientos de React

## 2. ¿Qué es Expo?

Expo es una plataforma y conjunto de herramientas construidas alrededor de React Native que simplifica significativamente el desarrollo de aplicaciones móviles. Proporciona una capa de abstracción que facilita el acceso a funcionalidades nativas del dispositivo.

### Ventajas de usar Expo:

- **Configuración simplificada**: No necesitas configurar Xcode o Android Studio para comenzar
- **APIs unificadas**: Acceso consistente a funcionalidades como cámara, ubicación, notificaciones, etc.
- **Over-the-Air Updates**: Actualiza tu app sin pasar por las tiendas de aplicaciones
- **Desarrollo web**: Ejecuta tu aplicación React Native directamente en el navegador
- **Herramientas de desarrollo**: CLI potente, DevTools integradas, y debugging simplificado

### Expo vs React Native CLI:

| Característica            | Expo                         | React Native CLI                         |
| ------------------------- | ---------------------------- | ---------------------------------------- |
| **Configuración inicial** | Muy simple                   | Compleja (requiere configuración nativa) |
| **Acceso a APIs nativas** | Pre-configuradas             | Requiere configuración manual            |
| **Tamaño de la app**      | Mayor (incluye SDK completo) | Menor (solo lo que uses)                 |
| **Flexibilidad**          | Limitada al SDK de Expo      | Total control del código nativo          |
| **Desarrollo web**        | Incluido                     | Requiere configuración adicional         |

## 3. Interoperabilidad multiplataforma

Una de las principales ventajas de React Native con Expo es la capacidad de ejecutar la misma aplicación en múltiples plataformas sin cambios significativos en el código.

### Plataformas soportadas:

1. **iOS**: Aplicación nativa para iPhone y iPad
2. **Android**: Aplicación nativa para dispositivos Android
3. **Web**: Aplicación web que funciona en cualquier navegador moderno

### Componentes que demuestran interoperabilidad:

- **Cámara**: Acceso unificado a la cámara del dispositivo en todas las plataformas
- **Interfaz de usuario**: Componentes que se adaptan automáticamente a cada plataforma
- **Gestos y animaciones**: Funcionan consistentemente en todas las plataformas
- **Almacenamiento**: Manejo de datos local que se adapta a cada entorno

## 4. Contexto del taller guiado

En este taller desarrollaremos **PhotoMagic**, una aplicación de cámara con filtros que demuestra la interoperabilidad de React Native. La aplicación incluirá:

- **Acceso a la cámara**: Manejo de permisos y captura de fotos
- **Sistema de filtros**: Aplicación de efectos visuales en tiempo real
- **Galería interactiva**: Visualización y gestión de fotos capturadas
- **Interfaz moderna**: Uso de gradientes y animaciones
- **Funcionalidad completa**: Cambio de cámara, eliminación de fotos, y más

### Funcionalidades principales:

1. **Manejo de permisos de cámara** con interfaz amigable
2. **Captura de fotos** con feedback visual y animaciones
3. **Sistema de filtros** (Cálido, Frío, Vintage)
4. **Galería horizontal** con información de timestamp
5. **Interfaz responsive** que se adapta a diferentes tamaños de pantalla
6. **Ejecución multiplataforma** sin cambios en el código

## 5. Configuración del entorno de desarrollo

### 5.1. Requisitos previos

Antes de comenzar, asegúrate de tener instalado:

- **Node.js** (versión 18 o superior)
- **npm** o **yarn**
- **Visual Studio Code** (recomendado)
- **Expo CLI** (se instalará automáticamente)

### 5.2. Extensiones de Visual Studio Code

Es fundamental instalar las siguientes extensiones en VS Code para una experiencia de desarrollo óptima:

1. **ES7+ React/Redux/React-Native snippets** - Snippets útiles para React Native
2. **Prettier - Code formatter** - Formateo automático de código
3. **ESLint** - Linting y detección de errores
4. **Expo Tools** - Herramientas específicas para desarrollo con Expo
5. **React Native Tools** - Debugging y soporte para React Native

Para instalar estas extensiones:

1. Abre VS Code
2. Ve a la sección de extensiones (Ctrl+Shift+X)
3. Busca cada extensión por nombre e instálala

### 5.3. Creación del proyecto

Ejecuta el siguiente comando para crear un nuevo proyecto con Expo:

```bash
npx create-expo-app@latest photomagic --template blank
```

Este comando:

- Crea un nuevo proyecto llamado "photomagic"
- Utiliza el template "blank" que proporciona una base mínima
- Instala todas las dependencias necesarias automáticamente

### 5.4. Configuración para desarrollo web

Para habilitar el desarrollo web, instala las dependencias adicionales:

```bash
npx expo install react-dom react-native-web @expo/metro-runtime
```

Estas dependencias permiten:

- **react-dom**: Renderizado de componentes React en el DOM
- **react-native-web**: Adaptador que traduce componentes React Native a elementos web
- **@expo/metro-runtime**: Runtime necesario para el bundler Metro

### 5.5. Configuración de ESLint y Prettier

#### 5.5.1. Inicialización de ESLint

Primero, inicializa ESLint en tu proyecto:

```bash
npx expo lint
```

Este comando genera la configuración básica de ESLint optimizada para Expo.

#### 5.5.2. Instalación de Prettier

Instala Prettier y las configuraciones necesarias:

```bash
npx expo install -- --save-dev prettier eslint-config-prettier eslint-plugin-prettier
```

#### 5.5.3. Configuración de ESLint

Crea o actualiza el archivo `eslint.config.js` en la raíz del proyecto:

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

#### 5.5.4. Configuración de Prettier

Crea un archivo `.prettierrc` en la raíz del proyecto:

```json title="Configuración de Prettier"
{
  "semi": true,
  "trailingComma": "all",
  "singleQuote": false,
  "printWidth": 80,
  "tabWidth": 2,
  "useTabs": false
}
```

### 5.6. Instalación de dependencias específicas

Instala las dependencias necesarias para la funcionalidad de cámara y gradientes:

```bash
npx expo install expo-camera
```

```bash
npm install expo-linear-gradient
```

### 5.7. Estructura del proyecto

Después de la configuración, tu proyecto debería tener esta estructura:

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

## 6. Desarrollo de la aplicación PhotoMagic

### 6.1. Configuración inicial de App.js

Comenzamos importando todas las dependencias necesarias. Reemplaza el contenido de `App.js` con:

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

### 6.2. Configuración de estado y constantes

Agrega las siguientes configuraciones después de los imports:

```javascript title="Configuración de estado y constantes"
const { height } = Dimensions.get("window");

export default function App() {
  const [facing, setFacing] = useState("back");
  const [permission, requestPermission] = useCameraPermissions();
  const [photos, setPhotos] = useState([]);
  const [selectedFilter, setSelectedFilter] = useState("none");
  const [isCapturing, setIsCapturing] = useState(false);
  const cameraRef = useRef(null);
  const scaleAnim = useRef(new Animated.Value(1)).current;

  // Configuración de filtros
  const filters = [
    {
      name: "none",
      label: "Fotos",
      icon: "📸",
      colors: ["#667eea", "#764ba2"],
    },
    {
      name: "warm",
      label: "🌅 Cálido",
      icon: "☀️",
      colors: ["#f093fb", "#f5576c"],
    },
    {
      name: "cool",
      label: "❄️ Frío",
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

### 6.3. Manejo de permisos de cámara

El manejo adecuado de permisos es crucial para una experiencia de usuario fluida:

```javascript title="Manejo de permisos de cámara"
// Pantalla de carga
if (!permission) {
  return (
    <SafeAreaView style={styles.container}>
      <LinearGradient colors={["#667eea", "#764ba2"]} style={styles.container}>
        <View style={styles.centerContent}>
          <Text style={styles.loadingText}>📱 Cargando cámara...</Text>
        </View>
      </LinearGradient>
    </SafeAreaView>
  );
}

// Pantalla de solicitud de permisos
if (!permission.granted) {
  return (
    <SafeAreaView style={styles.container}>
      <LinearGradient colors={["#667eea", "#764ba2"]} style={styles.container}>
        <View style={styles.centerContent}>
          <View style={styles.permissionCard}>
            <Text style={styles.permissionIcon}>📷</Text>
            <Text style={styles.permissionTitle}>¡Necesitamos la cámara!</Text>
            <Text style={styles.permissionMessage}>
              Para tomar fotos increíbles con filtros geniales
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
                  ✨ Activar Cámara
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

### 6.4. Funciones principales

#### 6.4.1. Cambio de cámara

```javascript title="Cambio de cámara"
const toggleCameraFacing = () => {
  setFacing((current) => (current === "back" ? "front" : "back"));
};
```

#### 6.4.2. Animación de captura

```javascript title="Animación de captura"
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

#### 6.4.3. Captura de fotografías

```javascript title="Captura de fotografías"
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
          "📸 ¡Foto capturada!",
          "Tu foto se guardó con el filtro seleccionado"
        );
      }, 300);
    } catch (error) {
      Alert.alert("⚠️ Error", "No se pudo tomar la foto");
    } finally {
      setIsCapturing(false);
    }
  }
};
```

#### 6.4.4. Gestión de la galería

```javascript title="Gestión de la galería"
const deletePhoto = (photoId) => {
  Alert.alert(
    "🗑️ Eliminar foto",
    "¿Estás seguro de que quieres eliminar esta foto?",
    [
      { text: "Cancelar", style: "cancel" },
      {
        text: "Eliminar",
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
  Alert.alert("🗑️ Limpiar galería", "¿Quieres eliminar todas las fotos?", [
    { text: "Cancelar", style: "cancel" },
    {
      text: "Eliminar todas",
      style: "destructive",
      onPress: () => setPhotos([]),
    },
  ]);
};
```

### 6.5. Interfaz principal

La interfaz principal utiliza un ScrollView para acomodar todo el contenido:

```javascript title="Interfaz principal"
const selectedFilterData = filters.find((f) => f.name === selectedFilter);

return (
  <ScrollView
    style={styles.container}
    contentContainerStyle={styles.scrollContainer}
  >
    <StatusBar style="light" />

    {/* Header con título */}
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

    {/* El resto de la interfaz continúa... */}
  </ScrollView>
);
```

### 6.6. Contenedor de la cámara

```javascript title="Contenedor de la cámara"
{
  /* Contenedor de la cámara */
}
<View style={styles.cameraContainer}>
  <CameraView style={styles.camera} facing={facing} ref={cameraRef} />

  {/* Overlay con filtro de color */}
  {selectedFilter !== "none" && (
    <View style={[styles.filterOverlay, getFilterStyle(selectedFilter)]} />
  )}

  {/* Marco decorativo */}
  <View style={styles.cameraFrame} />

  {/* Controles superiores */}
  <View style={styles.topControls}>
    <TouchableOpacity style={styles.topButton} onPress={toggleCameraFacing}>
      <Text style={styles.topButtonIcon}>🔄</Text>
      <Text style={styles.topButtonText}>Cambiar</Text>
    </TouchableOpacity>

    <View style={styles.photoCounter}>
      <Text style={styles.photoCounterText}>📷 {photos.length}</Text>
    </View>
  </View>

  {/* Controles inferiores */}
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

### 6.7. Sistema de filtros

```javascript title="Sistema de filtros"
{
  /* Filtros */
}
<View style={styles.filtersSection}>
  <LinearGradient
    colors={["#1a1a2e", "#16213e"]}
    style={styles.filtersBackground}
  >
    <Text style={styles.filtersTitle}>✨ Filtros</Text>
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

### 6.8. Galería de fotos

```javascript title="Galería de fotos"
{
  /* Galería de fotos */
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
            🖼️ Tu Galería ({photos.length})
          </Text>
          <TouchableOpacity onPress={clearAllPhotos} style={styles.clearButton}>
            <LinearGradient
              colors={["#ff6b6b", "#ee5a52"]}
              style={styles.clearButtonGradient}
            >
              <Text style={styles.clearButtonText}>🗑️ Limpiar</Text>
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

### 6.9. Función de filtros

Agrega esta función fuera del componente principal:

```javascript title="Función de filtros"
// Función para obtener estilos de filtro
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

### 6.10. Estilos completos

Agrega todos los estilos al final del archivo:

```javascript title="Estilos completos"
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

## 7. Ejecución de la aplicación

### 7.1. Desarrollo local

Para ejecutar la aplicación en modo desarrollo:

```bash title="Desarrollo local"
# Navegar al directorio del proyecto
cd metacritic-app

# Iniciar el servidor de desarrollo
npx expo start
```

Este comando iniciará el servidor de desarrollo de Metro y mostrará un código QR junto con varias opciones de ejecución.

### 7.2. Ejecución en diferentes plataformas

#### 7.2.1. iOS (simulador)

```bash
npx expo start --ios
```

**Requisitos:**

- macOS con Xcode instalado
- iOS Simulator configurado
- Herramientas de línea de comandos de Xcode

#### 7.2.2. Android (emulador)

```bash
npx expo start --android
```

**Requisitos:**

- Android Studio instalado
- Android SDK configurado
- Emulador Android en ejecución

#### 7.2.3. Web (navegador)

```bash
npx expo start --web
```

**Ventajas:**

- No requiere herramientas adicionales
- Desarrollo rápido y debugging
- Funciona en cualquier navegador moderno

### 7.3. Ejecución en dispositivos físicos

#### 7.3.1. Usando Expo Go (recomendado para desarrollo)

1. Instala **Expo Go** desde:
   - App Store (iOS)
   - Google Play Store (Android)

2. Ejecuta el comando de desarrollo:

```bash
npx expo start
```

3. Escanea el código QR con:
   - Cámara del dispositivo (iOS)
   - Aplicación Expo Go (Android)

#### 7.3.2. Build de desarrollo

Para crear una build de desarrollo personalizada:

```bash title="Build de desarrollo"
# Build para iOS
npx expo run:ios

# Build para Android
npx expo run:android
```

## 8. Características clave de la implementación

### 8.1. Manejo de estado con Hooks

La aplicación utiliza varios hooks de React para el manejo de estado:

```javascript title="Manejo de estado con Hooks"
// Estado principal de la aplicación
const [facing, setFacing] = useState("back"); // Cámara frontal/trasera
const [photos, setPhotos] = useState([]); // Array de fotos capturadas
const [selectedFilter, setSelectedFilter] = useState("none"); // Filtro activo
const [isCapturing, setIsCapturing] = useState(false); // Estado de captura

// Referencias y animaciones
const cameraRef = useRef(null); // Referencia a la cámara
const scaleAnim = useRef(new Animated.Value(1)).current; // Animación del botón
```

### 8.2. Componentes nativos utilizados

La aplicación hace uso de múltiples componentes nativos de React Native:

- **SafeAreaView**: Manejo de áreas seguras en diferentes dispositivos
- **ScrollView**: Navegación vertical con scroll
- **TouchableOpacity**: Botones táctiles con feedback
- **Animated**: Animaciones nativas suaves
- **Alert**: Diálogos nativos del sistema
- **Dimensions**: Adaptación a diferentes tamaños de pantalla

### 8.3. Integración con APIs nativas

#### 8.3.1. Cámara (expo-camera)

```javascript title="Cámara (expo-camera)"
// Hook para manejo de permisos
const [permission, requestPermission] = useCameraPermissions();

// Componente de cámara
<CameraView style={styles.camera} facing={facing} ref={cameraRef} />;

// Captura de fotos
const photo = await cameraRef.current.takePictureAsync({
  quality: 0.8,
  base64: false,
});
```

#### 8.3.2. Gradientes (expo-linear-gradient)

```javascript title="Gradientes (expo-linear-gradient)"
<LinearGradient
  colors={["#667eea", "#764ba2"]}
  style={styles.container}
  start={{ x: 0, y: 0 }}
  end={{ x: 1, y: 0 }}
>
  {/* Contenido */}
</LinearGradient>
```

### 8.4. Responsive Design

La aplicación se adapta a diferentes tamaños de pantalla:

```javascript title="Responsive Design"
const { height } = Dimensions.get("window");

// Altura adaptativa para la cámara
cameraContainer: {
  height: height * 0.5, // 50% de la altura de pantalla
  // ...
}
```

## 9. Interoperabilidad multiplataforma

### 9.1. Componentes que funcionan en todas las plataformas

| Componente           | iOS | Android | Web | Notas                                     |
| -------------------- | --- | ------- | --- | ----------------------------------------- |
| **CameraView**       | Sí  | Sí      | Sí  | Acceso a cámara del dispositivo/web       |
| **LinearGradient**   | Sí  | Sí      | Sí  | Renderizado nativo en móviles, CSS en web |
| **Animated**         | Sí  | Sí      | Sí  | Animaciones nativas optimizadas           |
| **ScrollView**       | Sí  | Sí      | Sí  | Scroll nativo en móviles, overflow en web |
| **TouchableOpacity** | Sí  | Sí      | Sí  | Gestos táctiles en móviles, click en web  |

### 9.2. Adaptaciones automáticas por plataforma

#### 9.2.1. Permisos de cámara

- **iOS**: Solicitud automática con mensaje personalizable
- **Android**: Manejo de permisos runtime
- **Web**: Solicitud de permisos del navegador

#### 9.2.2. Interfaz de usuario

- **iOS**: Elementos con estilo iOS nativo
- **Android**: Material Design automático
- **Web**: Adaptación a elementos HTML/CSS

#### 9.2.3. Gestos y navegación

- **Móviles**: Gestos táctiles nativos (tap, swipe, etc.)
- **Web**: Eventos de mouse y teclado

## 10. Debugging y herramientas de desarrollo

### 10.1. React Native Debugger

Para debugging avanzado, instala React Native Debugger:

```bash title="React Native Debugger"
# macOS
brew install --cask react-native-debugger

# Windows/Linux
# Descargar desde GitHub releases
```

### 10.2. Expo Dev Tools

El servidor de desarrollo de Expo incluye herramientas integradas:

- **Metro Bundler**: Empaquetado de código en tiempo real
- **Network Inspector**: Inspección de llamadas de red
- **Performance Monitor**: Monitoreo de rendimiento
- **Element Inspector**: Inspección de elementos como en DevTools

### 10.3. Debugging en VS Code

Configura debugging directo en VS Code creando `.vscode/launch.json`:

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

## 11. Optimización y mejores prácticas

### 11.1. Performance

#### 11.1.1. Uso de memo para componentes

```javascript title="Uso de memo para componentes"
import { memo } from 'react';

const PhotoCard = memo(({ photo, onDelete }) => {
  return (
    // Componente optimizado
  );
});
```

#### 11.1.2. Optimización de imágenes

```javascript title="Optimización de imágenes"
<Image
  source={{ uri: photo.uri }}
  style={styles.photo}
  resizeMode="cover"
  // Optimizaciones adicionales
  loadingIndicatorSource={{ uri: "placeholder" }}
  onLoad={() => setImageLoaded(true)}
/>
```

### 11.2. Manejo de memoria

```javascript title="Manejo de memoria"
// Limpieza de timers y listeners
useEffect(() => {
  return () => {
    // Limpiar recursos
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }
  };
}, []);
```

### 11.3. Accesibilidad

```javascript title="Accesibilidad"
<TouchableOpacity
  style={styles.captureButton}
  onPress={takePicture}
  // Mejoras de accesibilidad
  accessible={true}
  accessibilityLabel="Capturar foto"
  accessibilityHint="Toca para tomar una fotografía"
  accessibilityRole="button"
>
```

## 12. Pruebas de la aplicación

### 12.1. Verificación de funcionalidades

Prueba las siguientes funcionalidades en cada plataforma:

1. **Permisos de cámara**
   - Solicitud inicial de permisos
   - Manejo de permisos denegados
   - Re-solicitud de permisos

2. **Captura de fotos**
   - Captura con cámara trasera
   - Captura con cámara frontal
   - Aplicación de filtros
   - Animaciones de captura

3. **Gestión de galería**
   - Visualización de fotos capturadas
   - Eliminación individual de fotos
   - Eliminación masiva de fotos
   - Información de timestamp y filtros

4. **Interfaz responsive**
   - Adaptación a diferentes tamaños
   - Orientación de dispositivo
   - Scroll vertical y horizontal

### 12.2. Testing en diferentes dispositivos

#### 12.2.1. iOS

```bash title="iOS"
# iPhone Simulator
npx expo start --ios

# Dispositivo físico iPhone
# Usar Expo Go desde App Store
```

#### 12.2.2. Android

```bash title="Android"
# Android Emulator
npx expo start --android

# Dispositivo físico Android
# Usar Expo Go desde Play Store
```

#### 12.2.3. Web

```bash
# Navegadores recomendados para testing
npx expo start --web

# Chrome, Firefox, Safari, Edge
```

## 13. Build y distribución

### 13.1. Build para distribución

#### 13.1.1. Configuración de app.json

Actualiza la configuración en `app.json`:

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
        "NSCameraUsageDescription": "Esta aplicación necesita acceso a la cámara para tomar fotografías."
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

#### 13.1.2. Build con EAS (Expo Application Services)

```bash title="Build con EAS"
# Instalar EAS CLI
npm install -g @expo/eas-cli

# Configurar proyecto
eas build:configure

# Build para iOS
eas build --platform ios

# Build para Android
eas build --platform android

# Build para todas las plataformas
eas build --platform all
```

### 13.2. Deploy web

```bash
# Build para web
npx expo export:web

# Deploy a servicios como Netlify, Vercel, etc.
```

## 14. Conclusiones

### 14.1. Beneficios demostrados

La implementación de PhotoMagic demuestra exitosamente:

1. **Interoperabilidad real**: Una sola base de código funcionando en iOS, Android y web
2. **Acceso a APIs nativas**: Cámara, permisos, y funcionalidades específicas de cada plataforma
3. **Performance nativo**: Animaciones y gestos que se sienten naturales en cada plataforma
4. **Desarrollo eficiente**: Herramientas y workflows que aceleran el desarrollo

### 14.2. Casos de uso ideales para React Native

React Native con Expo es especialmente efectivo para:

- **Prototipos rápidos** que necesitan validación en múltiples plataformas
- **Aplicaciones de contenido** (redes sociales, noticias, e-commerce)
- **Herramientas de productividad** que requieren sincronización multiplataforma
- **Aplicaciones multimedia** con funcionalidades de cámara, video, audio

### 14.3. Limitaciones a considerar

- **Aplicaciones de alta performance**: Juegos o aplicaciones con gráficos intensivos
- **Acceso a APIs muy específicas**: Funcionalidades muy particulares de cada plataforma
- **Tamaño de aplicación**: Las apps de Expo tienden a ser más grandes
- **Dependencia del ecosistema**: Limitado a las APIs y módulos disponibles

### 14.4. Próximos pasos sugeridos

Para continuar el desarrollo de habilidades en React Native:

1. **Explorar navegación**: Implementar React Navigation para múltiples pantallas
2. **Manejo de estado global**: Integrar Redux o Zustand
3. **Persistencia de datos**: Implementar SQLite o AsyncStorage
4. **Notificaciones push**: Usar Expo Notifications
5. **Integración con APIs**: Conectar con servicios backend
6. **Animaciones avanzadas**: Explorar Reanimated 3
7. **Testing**: Implementar Jest y React Native Testing Library

## 15. Recursos adicionales

### 15.1. Documentación oficial

- **React Native**: [https://reactnative.dev/](https://reactnative.dev/)
- **Expo**: [https://docs.expo.dev/](https://docs.expo.dev/)
- **Expo Camera**: [https://docs.expo.dev/versions/latest/sdk/camera/](https://docs.expo.dev/versions/latest/sdk/camera/)

### 15.2. Herramientas y extensiones

- **Expo CLI**: Herramienta de línea de comandos principal
- **Expo Dev Client**: Para desarrollo con funcionalidades nativas personalizadas
- **EAS Build**: Servicio de builds en la nube
- **EAS Submit**: Distribución automática a tiendas de aplicaciones

### 15.3. Comunidad y soporte

- **React Native Directory**: [https://reactnative.directory/](https://reactnative.directory/)
- **Expo Discord**: Comunidad activa de desarrolladores
- **Stack Overflow**: Tag "react-native" y "expo"
- **GitHub**: Repositorios oficiales y ejemplos

---

**¡Felicidades!** Has completado exitosamente la implementación de una aplicación React Native que demuestra la verdadera interoperabilidad multiplataforma. PhotoMagic ahora funciona nativamente en iOS, Android, y web, utilizando la misma base de código y aprovechando las capacidades específicas de cada plataforma.
