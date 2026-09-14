---
sidebar_position: 4
---

# Estructura del Proyecto, main.dart y Widgets Básicos

Una vez instalado el SDK de Flutter y verificado tu entorno con `flutter doctor`, el siguiente paso es comprender cómo está estructurado un proyecto de Flutter, cuál es la secuencia de ejecución que inicia en `main.dart`, cómo utilizar los widgets visuales primitivos y cómo organizar el código en una arquitectura escalable de **páginas** y **componentes**.

---

## 1. Estructura de Carpetas del Proyecto

Al ejecutar el comando `flutter create mi_proyecto`, la herramienta de línea de comandos genera una plantilla con múltiples carpetas y archivos. Cada uno cumple una función específica dentro del ciclo de compilación y empaquetado.

<div style={{ textAlign: 'center', margin: '24px 0' }}>
  <img 
    src="/img/seminario-de-i-d-i/estructura-carpetas-flutter.svg" 
    alt="Estructura Canónica de un Proyecto Flutter" 
    style={{ width: '100%', maxWidth: '820px', borderRadius: '12px' }} 
  />
</div>

### Roles de los Directorios Principales

- **`lib/` (Librería Dart)**:
  Es el directorio fundamental donde escribes todo el código de tu aplicación. Todo archivo `.dart` que defina lógica, modelos, componentes o pantallas debe residir aquí.
- **`android/`, `ios/`, `web/`, `windows/`, `macos/`, `linux/`**:
  Son carpetas anfitrionas (_host_) que contienen los proyectos nativos de cada plataforma. Por ejemplo, `android/` contiene el proyecto Gradle con su `AndroidManifest.xml`, y `ios/` contiene la solución Xcode con su `Info.plist` y `Podfile`. En raras ocasiones necesitarás modificarlos directamente, excepto para solicitar permisos específicos (cámara, geolocalización) o cambiar el icono del lanzador.
- **`test/`**:
  Contiene las pruebas unitarias y de widgets para asegurar la calidad de la aplicación.
- **`pubspec.yaml`**:
  Es el archivo de configuración central del proyecto (equivalente a un `package.json` en Node.js o un `pom.xml` en Java Maven). En él se especifican:
  - Nombre, descripción y versión de la aplicación.
  - Restricciones del SDK de Dart y Flutter.
  - Dependencias de terceros provenientes del repositorio comunitario [pub.dev](https://pub.dev).
  - Declaración de activos estáticos (_assets_), tales como imágenes locales, vectores y fuentes tipográficas.

---

## 2. Anatomía y Recorrido por main.dart

El archivo `lib/main.dart` es el punto de partida absoluto de cualquier aplicación en Flutter. Su propósito es inicializar la plataforma, configurar el árbol de widgets raíz e indicar cuál será la primera pantalla que verá el usuario.

<div style={{ textAlign: 'center', margin: '24px 0' }}>
  <img 
    src="/img/seminario-de-i-d-i/flujo-main-dart.svg" 
    alt="Anatomía del Punto de Entrada main.dart" 
    style={{ width: '100%', maxWidth: '820px', borderRadius: '12px' }} 
  />
</div>

Analicemos un archivo `main.dart` limpio, estructurado según las buenas prácticas del curso:

```dart title="lib/main.dart" showLineNumbers
import 'package:flutter/material.dart';
import 'package:mi_proyecto/pages/home_page.dart';

// 1. Punto de entrada general del programa Dart
void main() {
  runApp(const MyApp());
}

// 2. Widget raíz de la aplicación (Configuración Global)
class MyApp extends StatelessWidget {
  const MyApp({super.key});

  @override
  Widget build(BuildContext context) {
    return MaterialApp(
      title: 'DocuKelo Flutter Demo',
      debugShowCheckedModeBanner: false,
      // Configuración del sistema de diseño Material 3
      theme: ThemeData(
        colorScheme: ColorScheme.fromSeed(
          seedColor: Colors.blueAccent,
          brightness: Brightness.light,
        ),
        useMaterial3: true,
      ),
      // Pantalla de inicio de la aplicación
      home: const HomePage(),
    );
  }
}
```

### ¿Qué hace cada bloque?

1. **`void main()`**: Función principal en Dart. Llama a la función `runApp()`, la cual conecta el widget raíz (`MyApp`) con los subsistemas de renderizado y el bucle de eventos del motor.
2. **`MaterialApp`**: Es el widget contenedor que suministra la infraestructura del sistema de diseño Material de Google:
   - Configura el tema visual global (`ThemeData`), colores primarios y tipografías.
   - Gestiona el sistema de rutas y la pila de navegación.
   - Suministra soporte de internacionalización y accesibilidad.
3. **`home: const HomePage()`**: Indica la pantalla principal que se montará inicialmente al cargar la app.

---

## 3. Entendiendo la Página como un Árbol de Componentes

En Flutter, el lema oficial de la arquitectura es: **«En Flutter, casi todo es un widget»**. Esto significa que una página no se concibe como un lienzo plano de píxeles, sino como una estructura jerárquica de árbol (_Widget Tree_), donde cada nodo padre define reglas de posición, restricciones espaciales (_constraints_) o estilo para sus nodos hijos (_children_).

### ¿Qué es el Árbol de Widgets?

El árbol de widgets es la representación en memoria de la estructura visual de la app:

- **La Raíz**: Inicia en `MaterialApp` (o `CupertinoApp` para estilo iOS).
- **El Tronco de la Pantalla**: El `Scaffold`, que actúa como armazón estructural con áreas designadas (`appBar`, `body`, `floatingActionButton`, `bottomNavigationBar`).
- **Las Ramas de Disposición (_Layout_)**: Widgets que no tienen apariencia visual propia pero organizan a sus hijos espacialmente, como `Column` (vertical), `Row` (horizontal), `Padding` (márgenes internos) o `Center`.
- **Las Hojas (_Leaf Widgets_)**: Widgets visuales concretos que muestran contenido o reciben interacción, como `Text`, `Image`, `Icon` o `ElevatedButton`.

### Caso Práctico: Descomposición de un Music Player (Diseño en Stitch con Material 3)

Para ilustrar cómo una interfaz de usuario realista se traduce a un árbol ordenado de componentes, consideremos una pantalla de **Reproductor de Música (Now Playing)** diseñada con el estándar moderno de **Google Material Design 3 (Material You)**:

<div style={{ display: 'flex', justifyContent: 'center', gap: '28px', flexWrap: 'wrap', margin: '24px 0', alignItems: 'center' }}>
  <div style={{ maxWidth: '320px', textAlign: 'center' }}>
    <p style={{ fontWeight: 'bold', fontSize: '0.9rem', color: '#64748b', marginBottom: '8px' }}>Diseño Generado en Stitch (MD3)</p>
    <img 
      src="/img/seminario-de-i-d-i/music-player-stitch-preview.png" 
      alt="Captura Diseño Music Player Stitch Material 3" 
      style={{ width: '100%', borderRadius: '24px', boxShadow: '0 8px 24px rgba(0,0,0,0.25)' }} 
    />
  </div>
  <div style={{ maxWidth: '440px' }}>
    <h4>Análisis Visual de la Interfaz:</h4>
    <p style={{ fontSize: '0.95rem', lineHeight: '1.6' }}>
      Observa los elementos que componen la pantalla:
    </p>
    <ul style={{ fontSize: '0.9rem', lineHeight: '1.6' }}>
      <li><strong>Barra superior (Top App Bar)</strong>: Botón de retorno, título centrado <em>Now Playing</em> e icono de opciones.</li>
      <li><strong>Carátula de Álbum</strong>: Imagen cuadrada con esquinas redondeadas generosas (<code>rounded-3xl</code>).</li>
      <li><strong>Metadatos del Tema</strong>: Título de la pista, artista e icono de corazón (favoritos).</li>
      <li><strong>Barra de Progreso (Scrubber)</strong>: Línea de deslizador con tiempos transcurrido y total.</li>
      <li><strong>Controles de Reproducción</strong>: Fila horizontal con botones de aleatorio, anterior, botón principal flotante elevado de Play/Pausa, siguiente y repetir.</li>
    </ul>
  </div>
</div>

#### El Árbol de Componentes de la Pantalla

Si descomponemos la pantalla visual anterior en la jerarquía que procesa el motor de Flutter, obtenemos la siguiente estructura de árbol:

<div style={{ textAlign: 'center', margin: '24px 0' }}>
  <img 
    src="/img/seminario-de-i-d-i/arbol-componentes-player.svg" 
    alt="Árbol de Widgets de la Pantalla Music Player" 
    style={{ width: '100%', maxWidth: '880px', borderRadius: '12px' }} 
  />
</div>

### ¿Qué archivos toca crear para implementar esta arquitectura?

Siguiendo las buenas prácticas y la convención de carpetas del curso, **no colocamos todo este código en un solo archivo gigante**. Dividimos la pantalla en una **Page** anfitriona y cuatro **Components** independientes:

```
lib/
├── main.dart
├── pages/
│   └── music_player_page.dart    # Scaffold, AppBar y anidación de la Column principal
└── components/
    ├── album_cover_art.dart      # Carátula con bordes redondeados (ClipRRect)
    ├── track_metadata.dart       # Título, artista y botón de favorito (Row + Text + IconButton)
    ├── player_progress_bar.dart  # Barra de avance con tiempos (Slider + Row)
    └── playback_controls.dart    # Controles de reproducción con botón principal elevado
```

#### 1. Componente de Carátula (`lib/components/album_cover_art.dart`)

Recibe la URL o recurso de la imagen y la encapsula con el estilo deseado:

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

#### 2. Componente de Metadatos de la Pista (`lib/components/track_metadata.dart`)

Muestra el título, subtítulo del artista y el botón de favorito:

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

#### 3. Componente de Barra de Progreso (`lib/components/player_progress_bar.dart`)

Encapsula el slider y los textos de tiempo:

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

#### 4. Componente de Controles de Reproducción (`lib/components/playback_controls.dart`)

Fila con botones secundarios y el botón primario de Play/Pausa:

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
        // Botón principal de reproducción estilo Material 3
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

#### 5. La Pantalla Ensambladora (`lib/pages/music_player_page.dart`)

Observa qué limpia y legible resulta la pantalla anfitriona cuando delega cada área a su respectivo componente del árbol:

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
            // Nodo hijo 1: Carátula
            const AlbumCoverArt(
              imageUrl: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=600',
            ),
            const SizedBox(height: 32),
            // Nodo hijo 2: Metadatos
            TrackMetadata(
              title: 'Echoes in the Sky',
              artist: 'Aura Echoes',
              isFavorite: true,
              onFavoriteToggle: () {},
            ),
            const SizedBox(height: 16),
            // Nodo hijo 3: Progreso
            PlayerProgressBar(
              currentSeconds: 102,
              totalSeconds: 225,
              onSeek: (value) {},
            ),
            const SizedBox(height: 24),
            // Nodo hijo 4: Controles
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

:::tip[Principio de Responsabilidad Única]
Si necesitas rediseñar el botón de play o la barra de avance temporal, no tienes que modificar `music_player_page.dart`. Solo editas el componente individual correspondiente, reduciendo el riesgo de introducir errores en el resto de la pantalla.
:::

---

## 4. Widgets Básicos: Text, Image y Botones

Flutter provee un extenso conjunto de widgets primitivos listos para usar en tus interfaces.

<div style={{ textAlign: 'center', margin: '24px 0' }}>
  <img 
    src="/img/seminario-de-i-d-i/widgets-basicos-flutter.svg" 
    alt="Widgets Básicos en Flutter: Text, Image y Botones" 
    style={{ width: '100%', maxWidth: '820px', borderRadius: '12px' }} 
  />
</div>

### A. Text y TextStyle

El widget `Text` muestra una cadena de caracteres en pantalla aplicando estilos mediante la clase `TextStyle`:

```dart title="Ejemplos de Text" showLineNumbers
Text(
  'Bienvenido a Seminario de I+D+i',
  style: TextStyle(
    fontSize: 20,
    fontWeight: FontWeight.bold,
    color: Colors.blueGrey.shade900,
    letterSpacing: 0.5,
  ),
  textAlign: TextAlign.center,
  maxLines: 2,
  overflow: TextOverflow.ellipsis, // Corta con '...' si excede el espacio
)
```

### B. Image: Asset vs. Network

Las imágenes en Flutter pueden originarse localmente en el paquete de la aplicación o descargarse de internet de manera remota:

- **`Image.asset()` (Recursos Locales)**:
  Se utiliza para recursos estáticos propios de la app (logos, iconos, ilustraciones offline). Para utilizarlas:
  1. Crea la carpeta `assets/images/` en la raíz del proyecto y copia tu archivo (por ejemplo, `logo.png`).
  2. Declara la ruta en `pubspec.yaml`:
     ```yaml title="pubspec.yaml" showLineNumbers
     flutter:
       uses-material-design: true
       assets:
         - assets/images/
     ```
  3. Carga el widget en tu código:
     ```dart showLineNumbers
     Image.asset(
       'assets/images/logo.png',
       width: 120,
       height: 120,
       fit: BoxFit.contain,
     )
     ```

- **`Image.network()` (Recursos Remotos)**:
  Se utiliza cuando la URL proviene de una base de datos o API externa (como perfiles de usuario o fotos de productos en Supabase):
  ```dart showLineNumbers
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

### C. Botones de Material 3

En Material 3 disponemos de tres variantes principales de botones, cada una diseñada para expresar una jerarquía de atención visual distinta:

| Widget               | Jerarquía Visual  | Caso de Uso                                                     |
| :------------------- | :---------------- | :-------------------------------------------------------------- |
| **`ElevatedButton`** | Alta / Prominente | Acciones principales (Guardar, Registrarse, Confirmar compra).  |
| **`OutlinedButton`** | Media             | Acciones secundarias (Cancelar, Volver, Filtros alternativos).  |
| **`TextButton`**     | Baja / Sutil      | Acciones terciarias en tarjetas o diálogos (Ver más, Términos). |

```dart title="Ejemplo de Botones Material 3" showLineNumbers
// Botón con acción definida
ElevatedButton.icon(
  onPressed: () {
    debugPrint('Guardar presionado');
  },
  icon: const Icon(Icons.save),
  label: const Text('Guardar'),
)

// Botón deshabilitado (onPressed es null)
ElevatedButton(
  onPressed: null,
  child: const Text('Deshabilitado'),
)
```

:::warning[El Evento onPressed es Obligatorio]
Si pasas `null` al parámetro `onPressed`, Flutter deshabilitará automáticamente el botón, cambiando su tonalidad a gris y bloqueando cualquier interacción táctil. Para dejarlo interactivo sin lógica aún, pasa una función anónima vacía: `onPressed: () {}`.
:::

---

## 5. Arquitectura Modular: Pages vs. Components

A medida que una aplicación crece, escribir todo el código en un único archivo produce desorden y dificultad para trabajar en equipo. En este curso adoptamos una convención limpia basada en dos carpetas dentro de `lib/`:

<div style={{ textAlign: 'center', margin: '24px 0' }}>
  <img 
    src="/img/seminario-de-i-d-i/pages-vs-components.svg" 
    alt="Patrón de Arquitectura: Pages vs Components" 
    style={{ width: '100%', maxWidth: '820px', borderRadius: '12px' }} 
  />
</div>

### Convención `lib/pages/` (o `lib/screens/`)

- Representa una **pantalla completa** del dispositivo.
- Debe retornar un widget contenedor **`Scaffold`** (con su `appBar`, `body`, y opcionalmente `floatingActionButton` o `bottomNavigationBar`).
- Conoce el contexto de navegación y coordina la carga de datos.
- Nomenclatura recomendada: `nombre_page.dart` (ejemplo: `home_page.dart`, `profile_page.dart`).

### Convención `lib/components/` (o `lib/widgets/`)

- Representa una **pieza visual modular y reutilizable**.
- **Nunca** contiene un `Scaffold`; utiliza widgets de composición como `Container`, `Card`, `Row`, `Column` o `Padding`.
- Es agnóstica de la pantalla: recibe sus datos mediante su constructor y delega las acciones mediante _callbacks_.
- Nomenclatura recomendada: `nombre_card.dart` o `custom_button.dart`.

---

## Cuestionario de Autoevaluación

<Quiz id="s9-estructura-main-widgets-quiz">
  <Question title="¿Cuál es el rol exclusivo de la carpeta 'lib/' dentro de un proyecto Flutter?">
    <Option>Almacenar los archivos binarios compilados de Gradle y los perfiles de aprovisionamiento de iOS.</Option>
    <Option correct>Contener el 100% del código fuente en Dart de la aplicación (páginas, componentes, modelos y lógica).</Option>
    <Option>Guardar únicamente los archivos de pruebas unitarias y de integración.</Option>
    <Option>Alojar los controladores nativos de C++ para el motor de videojuegos.</Option>
  </Question>
  <Question title="¿Qué propósito cumple la instrucción 'runApp(const MyApp())' dentro de la función main() en Dart?">
    <Option>Ejecutar un script de migración en la base de datos local de forma síncrona.</Option>
    <Option>Compilar el código fuente a bytecode de la Máquina Virtual de Java.</Option>
    <Option correct>Inicializar el motor de Flutter, arrancar los subsistemas de renderizado y montar el widget raíz en pantalla.</Option>
    <Option>Descargar automáticamente todas las dependencias declaradas en pubspec.yaml.</Option>
  </Question>
  <Question title="En la metáfora del árbol de componentes de Flutter, ¿qué función cumple el widget 'Scaffold'?">
    <Option>Funciona como un nodo hoja para mostrar textos con formato enriquecido.</Option>
    <Option correct>Actúa como el armazón estructural de una pantalla, proveyendo áreas estándar como AppBar, Body y FloatingActionButton.</Option>
    <Option>Es un servicio en segundo plano que escucha peticiones de red sin interfaz gráfica.</Option>
    <Option>Es el compilador interno encargado de optimizar el código Dart a lenguaje máquina ARM.</Option>
  </Question>
  <Question title="Al descomponer una pantalla como el reproductor de música, ¿cuál es la diferencia entre 'lib/pages/' y 'lib/components/'?">
    <Option>Las pages son escritas en lenguaje Java, mientras que los components se escriben en TypeScript.</Option>
    <Option correct>Las pages devuelven un Scaffold y representan vistas completas, mientras que los components son piezas modulares sin Scaffold que reciben datos por constructor.</Option>
    <Option>Los components no pueden recibir estilos ni detectar pulsaciones del usuario.</Option>
    <Option>Las pages no admiten widgets hijos y solo pueden renderizar texto plano.</Option>
  </Question>
  <Question title="Para utilizar una imagen local con 'Image.asset(&quot;assets/images/cover.png&quot;)', ¿qué configuración previa es obligatoria?">
    <Option>Convertir la imagen a un archivo de fuente tipográfica TTF.</Option>
    <Option>Subir la imagen a un bucket público de almacenamiento en la nube.</Option>
    <Option correct>Declarar explícitamente la carpeta o el archivo dentro de la sección 'flutter: assets:' en pubspec.yaml.</Option>
    <Option>Agregar el permiso de acceso a internet en el archivo AndroidManifest.xml.</Option>
  </Question>
  <Question title="¿Qué efecto produce asignar 'onPressed: null' en un widget de botón de Material 3 como ElevatedButton?">
    <Option>Genera un error de excepción fatal que detiene la ejecución de la app.</Option>
    <Option correct>Deshabilita visualmente el botón, tornándolo grisáceo y bloqueando cualquier interacción táctil.</Option>
    <Option>Ejecuta una acción de reintento en bucle infinito en segundo plano.</Option>
    <Option>Oculta por completo el botón haciéndolo invisible pero manteniendo su espacio.</Option>
  </Question>
</Quiz>

