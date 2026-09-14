---
sidebar_position: 1
---

# Desarrollo frontend multiplataforma

El desarrollo frontend multiplataforma es un paradigma de ingeniería de software que permite construir aplicaciones para múltiples sistemas operativos (Android, iOS, Web, Windows, macOS y Linux) a partir de una **única base de código compartida**.

En lugar de requerir equipos de desarrollo independientes con lenguajes y herramientas separadas para cada plataforma, las tecnologías multiplataforma modernas unifican la lógica de negocio, el diseño de la interfaz y la gestión del estado, optimizando los tiempos de entrega y facilitando el mantenimiento a largo plazo.

---

## De Java y APO al Frontend Moderno

<div style={{ display: 'flex', alignItems: 'center', gap: '16px', marginBottom: '20px' }}>
  <img src="/img/seminario-de-i-d-i/java-logo.svg" alt="Java Logo" width="48" height="48" />
  <p style={{ margin: 0 }}>
    Hasta este punto de la carrera, en los cursos de <strong>Algoritmos y Programación Orientada a Objetos (APO 1 y APO 2)</strong>, has trabajado principalmente con <strong>Java</strong>, aprendiendo los fundamentos de tipado estricto, estructuras de datos, diseño de clases, herencia, interfaces y librerías de escritorio como <strong>JavaFX</strong> o <strong>Swing</strong>.
  </p>
</div>

La transición hacia el desarrollo frontend moderno implica tres cambios conceptuales clave:

### 1. Paradigma Imperativo vs. Paradigma Declarativo

En los cursos de programación con JavaFX o Swing, la construcción de interfaces sigue un modelo **imperativo**:

* **Enfoque Imperativo (JavaFX)**: Creas objetos de interfaz en memoria y programas manualmente los pasos exactos para modificarlos ante cada evento. Si un valor cambia, debes buscar la referencia del componente y mutar su estado directamente (`etiqueta.setText("Nuevo texto")`).
* **Enfoque Declarativo (Flutter / Frontend Moderno)**: La interfaz de usuario es el resultado matemático del estado actual de la aplicación:

$$UI = f(state)$$

Tú no manipulas directamente los componentes en pantalla para cambiar su contenido; simplemente describes cómo debe lucir la interfaz para un determinado estado. Cuando el estado cambia (mediante llamadas como `setState()`), el framework se encarga de re-evaluar la función y redibujar automáticamente los elementos que lo requieran.

<div style={{ textAlign: 'center', margin: '24px 0' }}>
  <img src="/img/seminario-de-i-d-i/imperativo-vs-declarativo.svg" alt="Diagrama Imperativo vs Declarativo" style={{ width: '100%', maxWidth: '780px', borderRadius: '12px' }} />
</div>

---

### 2. Herencia en POO vs. Composición Jerárquica de Widgets

En la Programación Orientada a Objetos tradicional en Java, es habitual extender clases base para crear nuevos comportamientos (`public class MiBotonCustom extends Button`).

En frameworks modernos como Flutter, se aplica el principio de **composición sobre herencia**:

* Los componentes de la interfaz no se crean mediante jerarquías de herencia complejas, sino combinando componentes pequeños, especializados y altamente reutilizables (*Widgets*).
* Un botón con icono y texto no es una subclase especial; es simplemente un widget `ElevatedButton` que contiene un widget `Row`, el cual a su vez anida un `Icon` y un `Text`.

<div style={{ textAlign: 'center', margin: '24px 0' }}>
  <img src="/img/seminario-de-i-d-i/herencia-vs-composicion.svg" alt="Diagrama Herencia vs Composición" style={{ width: '100%', maxWidth: '780px', borderRadius: '12px' }} />
</div>

---

### 3. Modelo de Ejecución: JVM vs. Compilación Nativa y Hot Reload

* **Java y la JVM**: El código Java se compila a *Bytecode* y se ejecuta dentro de la Máquina Virtual de Java (JVM), que interpreta o compila en tiempo de ejecución (JIT) las instrucciones para el sistema anfitrión.
* **Dart y Flutter**:
  * **En Producción (Release)**: El código se compila de forma anticipada (**Ahead-of-Time - AOT**) directamente a código máquina nativo (ARM o x86). Esto elimina capas intermedias de interpretación y garantiza un rendimiento fluido a 60 o 120 fotogramas por segundo (fps).
  * **En Desarrollo (Debug)**: Utiliza compilación **Just-in-Time (JIT)** para ofrecer **Stateful Hot Reload**, permitiendo inyectar cambios de código en la aplicación en ejecución en menos de un segundo sin perder el estado actual de la pantalla (como formularios llenos o navegación activa).

<div style={{ textAlign: 'center', margin: '24px 0' }}>
  <img src="/img/seminario-de-i-d-i/compilacion-aot-hot-reload.svg" alt="Diagrama Modelo de Ejecución JVM vs Flutter AOT y Hot Reload" style={{ width: '100%', maxWidth: '780px', borderRadius: '12px' }} />
</div>

---

## Comparativa Práctica: JavaFX vs. Flutter

A continuación se compara la implementación de un contador con botón interactivo:

<Tabs>
  <TabItem value="javafx" label="JavaFX (Imperativo en Java)" default>

```java title="ContadorApp.java" showLineNumbers

public class ContadorApp extends Application {
    // 1. Estado almacenado en la clase
    private int contador = 0;

    @Override
    public void start(Stage stage) {
        // 2. Creación explícita de nodos de la interfaz
        Label labelContador = new Label("Contador: 0");
        Button btnIncrementar = new Button("Incrementar");

        // 3. Mutación imperativa: buscar la referencia y cambiar el texto
        btnIncrementar.setOnAction(event -> {
            contador++;
            labelContador.setText("Contador: " + contador); // Mutación manual del nodo
        });

        VBox root = new VBox(10, labelContador, btnIncrementar);
        stage.setScene(new Scene(root, 300, 200));
        stage.setTitle("Contador en JavaFX");
        stage.show();
    }
}
```

  </TabItem>
  <TabItem value="flutter" label="Flutter (Declarativo en Dart)">

```dart title="contador_widget.dart" showLineNumbers
class ContadorWidget extends StatefulWidget {
  const ContadorWidget({super.key});

  @override
  State<ContadorWidget> createState() => _ContadorWidgetState();
}

class _ContadorWidgetState extends State<ContadorWidget> {
  // 1. Estado local de la pantalla
  int _contador = 0;

  void _incrementar() {
    // 2. Modificación declarativa del estado: setState notifica la reconstrucción
    setState(() {
      _contador++;
    });
  }

  @override
  Widget build(BuildContext context) {
    // 3. La interfaz se describe en función del valor de _contador
    return Scaffold(
      appBar: AppBar(title: const Text('Contador en Flutter')),
      body: Center(
        child: Column(
          mainAxisAlignment: MainAxisAlignment.center,
          children: [
            Text('Contador: $_contador', style: const TextStyle(fontSize: 20)),
            const SizedBox(height: 10),
            ElevatedButton(
              onPressed: _incrementar,
              child: const Text('Incrementar'),
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

## Los 4 Enfoques Arquitectónicos Multiplataforma

A lo largo de la evolución del desarrollo móvil y frontend, han surgido cuatro estrategias arquitecturales principales:

<div style={{ textAlign: 'center', margin: '24px 0' }}>
  <img src="/img/seminario-de-i-d-i/estrategias-multiplataforma.svg" alt="Evolución de Enfoques Frontend Multiplataforma" style={{ width: '100%', maxWidth: '800px', borderRadius: '12px' }} />
</div>

### 1. Desarrollo Nativo Tradicional (Código Separado)
* **Tecnologías**: Swift / Objective-C para iOS, Kotlin / Java para Android.
* **Cómo funciona**: Se escriben dos aplicaciones completamente independientes utilizando las APIs oficiales de cada plataforma.
* **Ventajas**: Máximo rendimiento y acceso inmediato a las últimas APIs de hardware.
* **Desventajas**: Costo de desarrollo duplicado, dos equipos de trabajo y mayor probabilidad de inconsistencias funcionales.

<div style={{ textAlign: 'center', margin: '16px 0' }}>
  <img src="/img/seminario-de-i-d-i/enfoque-nativo-separado.svg" alt="Esquema Enfoque Nativo Separado" style={{ width: '100%', maxWidth: '720px', borderRadius: '10px' }} />
</div>

### 2. Híbrido Basado en WebViews
* **Tecnologías**: Apache Cordova, Ionic, Capacitor.
* **Cómo funciona**: La aplicación es esencialmente una página web (HTML, CSS y JavaScript) empaquetada dentro de un contenedor web nativo (*WebView*).
* **Ventajas**: Reutilización total de habilidades de desarrollo web estándar.
* **Desventajas**: Rendimiento limitado en animaciones complejas, latencia al procesar eventos táctiles y apariencia no siempre idéntica a una aplicación nativa.

<div style={{ textAlign: 'center', margin: '16px 0' }}>
  <img src="/img/seminario-de-i-d-i/enfoque-hibrido-webview.svg" alt="Esquema Enfoque Híbrido WebView" style={{ width: '100%', maxWidth: '720px', borderRadius: '10px' }} />
</div>

### 3. Puente Interpretado / Reactivo
* **Tecnologías**: React Native.
* **Cómo funciona**: La lógica se escribe en JavaScript/TypeScript, pero en lugar de renderizar en un WebView, invoca los componentes visuales nativos del sistema operativo (`UIView` en iOS, `android.view.View` en Android) mediante un puente de comunicación asíncrono (*Bridge* o *JavaScript Interface - JSI*).
* **Ventajas**: Utiliza componentes nativos del sistema operativo y aprovecha el ecosistema masivo de React.
* **Desventajas**: Puede sufrir cuellos de botella en animaciones intensivas y requiere adaptaciones para mantener paridad visual exacta entre iOS y Android.

<div style={{ textAlign: 'center', margin: '16px 0' }}>
  <img src="/img/seminario-de-i-d-i/enfoque-puente-reactivo.svg" alt="Esquema Enfoque Puente Reactivo" style={{ width: '100%', maxWidth: '720px', borderRadius: '10px' }} />
</div>

### 4. Motor de Renderizado Propio (Canvas Directo)
* **Tecnologías**: Flutter.
* **Cómo funciona**: Flutter no utiliza WebViews ni delega el dibujo en los widgets del sistema operativo. En su lugar, incluye su propio motor gráfico 2D de alto rendimiento (**Impeller** / **Skia**) y dibuja directamente cada píxel en la pantalla mediante GPU (similar a cómo operan los motores de videojuegos como Unity).
* **Ventajas**: Paridad visual 100% idéntica en cualquier dispositivo, rendimiento determinista a 60/120 fps y control absoluto sobre cada píxel.
* **Desventajas**: Mayor tamaño inicial del binario instalable debido a la inclusión del motor de renderizado.

<div style={{ textAlign: 'center', margin: '16px 0' }}>
  <img src="/img/seminario-de-i-d-i/enfoque-motor-propio.svg" alt="Esquema Enfoque Motor Propio Flutter" style={{ width: '100%', maxWidth: '720px', borderRadius: '10px' }} />
</div>

---

## Ecosistemas Principales del Mercado

En el panorama actual de la industria, **Flutter** y **React Native** lideran la adopción empresarial para proyectos multiplataforma:

<div style={{ display: 'flex', gap: '24px', justifyContent: 'center', margin: '24px 0', flexWrap: 'wrap' }}>
  <div style={{ textAlign: 'center', padding: '20px', border: '1px solid #e2e8f0', borderRadius: '12px', width: '220px', background: 'rgba(66, 165, 245, 0.05)' }}>
    <img src="/img/seminario-de-i-d-i/flutter-logo.svg" alt="Flutter Logo" width="70" height="70" />
    <h4 style={{ marginTop: '12px', marginBottom: '4px' }}>Flutter</h4>
    <p style={{ margin: 0, fontSize: '0.85rem', color: '#64748b' }}>Motor Gráfico Propio</p>
  </div>
  <div style={{ textAlign: 'center', padding: '20px', border: '1px solid #e2e8f0', borderRadius: '12px', width: '220px', background: 'rgba(97, 218, 251, 0.05)' }}>
    <img src="/img/seminario-de-i-d-i/react-native-logo.svg" alt="React Native Logo" width="70" height="70" />
    <h4 style={{ marginTop: '12px', marginBottom: '4px' }}>React Native</h4>
    <p style={{ margin: 0, fontSize: '0.85rem', color: '#64748b' }}>Puente Nativo / JSI</p>
  </div>
</div>

<CardGrid cols={2}>
  <Card 
    title="Flutter (Google)" 
    description="Framework multiplataforma basado en Dart con motor de renderizado propio (Impeller). Compila a código máquina nativo AOT y soporta Móvil, Web y Desktop desde un solo codebase." 
    link="https://flutter.dev"
  />
  <Card 
    title="React Native (Meta)" 
    description="Framework basado en JavaScript y React que mapea componentes declarativos hacia widgets nativos del sistema operativo a través de una arquitectura de hilos desacoplados." 
    link="https://reactnative.dev"
  />
</CardGrid>

---

## Matriz Comparativa Técnica

| Criterio | Flutter | React Native |
| :--- | :--- | :--- |
| **Creador y Respaldo** | Google | Meta (Facebook) |
| **Lenguaje de Programación** | Dart (Tipado estricto, orientado a objetos) | JavaScript / TypeScript |
| **Arquitectura de Renderizado** | Motor gráfico propio (Impeller / Skia a nivel de píxel) | Mapeo a componentes nativos del SO (JSI / Fabric) |
| **Rendimiento de Animaciones** | Excelente (compilación nativa AOT directa a GPU) | Muy bueno (renderizado nativo con hilo JS separado) |
| **Consistencia Visual** | Idéntica en todas las plataformas | Varía según el estilo visual propio de cada SO |
| **Experiencia de Desarrollo** | Stateful Hot Reload ultrarrápido | Fast Refresh |
| **Soporte de Plataformas** | iOS, Android, Web, Windows, macOS, Linux | iOS, Android (Web y Desktop mediante extensiones comunitarias) |
