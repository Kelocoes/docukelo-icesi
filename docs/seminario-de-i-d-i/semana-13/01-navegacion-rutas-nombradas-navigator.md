---
sidebar_position: 1
description: "Aprende el modelo de navegación con Navigator y rutas nombradas en Flutter: pushNamed, pop con retorno de datos y pushNamedAndRemoveUntil."
---

# Navegación con Navigator y Rutas Nombradas

En aplicaciones móviles, navegar entre pantallas no consiste en cambiar de página web: consiste en gestionar una **pila en memoria (*Route Stack*)**. Cada nueva pantalla se superpone sobre la anterior, conservando el estado de las vistas previas hasta que el usuario decide regresar o la aplicación decide reestructurar el historial.

En esta sesión abordaremos la navegación imperativa clásica de Flutter (`Navigator` 1.0) mediante **rutas nombradas** (`routes`) configuradas en el widget `MaterialApp`, cubriendo:
* Qué es una pila y en qué se diferencia de una cola.
* El ciclo de apilamiento (`pushNamed`) y desapilamiento (`pop`).
* Cómo organizar las pantallas y las rutas en carpetas.
* La transferencia bidireccional de datos: envío síncrono de argumentos y captura asíncrona de resultados con `await`.
* La purga radical de la pila en flujos de autenticación o cierre de sesión con `pushNamedAndRemoveUntil`.

---

## 1. ¿Qué es una pila?

Antes de hablar de pantallas, el concepto: una **pila** es una colección donde solo se agrega y se quita por **un extremo**, el **tope**. El último elemento que entra es el primero que sale: **LIFO** (*Last-In, First-Out*), como una pila de platos.

Una **cola** funciona al revés: se agrega por el final y se quita por el frente, así que el primero que entra es el primero que sale: **FIFO** (*First-In, First-Out*), como la fila de un banco.

Agrega varios elementos y sácalos de cada estructura. Compara el orden de salida.

<InteractiveFrame
  src="/interactive/seminario-de-i-d-i/semana-13/pila-vs-cola/index.html"
  title="Pila (LIFO) frente a cola (FIFO): el orden de salida de los mismos elementos"
  height={560}
/>

---

## 2. Navegar es apilar pantallas

Flutter usa una pila para las pantallas. El widget `Navigator` guarda una pila de **rutas** (`Route`): cada una es una pantalla con su nombre y sus argumentos. Solo la ruta del **tope** se ve; las de abajo siguen vivas, tapadas.

* **`pushNamed`** apila una ruta nueva. Las de abajo conservan su `State` (texto escrito, scroll).
* **`pop`** desapila la del tope y libera su `State`. La de abajo reaparece como estaba.

A la izquierda, el teléfono; a la derecha, la pila de rutas. Observa cómo cambia con cada toque.

<InteractiveFrame
  src="/interactive/seminario-de-i-d-i/semana-13/navegacion-pila/index.html"
  title="Teléfono y pila de rutas: cómo cambia la pila al navegar con pushNamed y pop"
  height={700}
/>

:::info[Con una sola ruta no hay a dónde volver]
`canPop()` es `false` en la base de la pila: Atrás cierra la app. Si hay más de una ruta, el `AppBar` de un `Scaffold` dibuja solo la flecha de retroceso y la enlaza a `Navigator.pop`.
:::

---

## 3. Configuración de Rutas Nombradas en `MaterialApp`

Para habilitar rutas nombradas, se define un diccionario de tipo `Map<String, WidgetBuilder>` en la propiedad `routes` de `MaterialApp`. La clave representa la ruta textual (por convención iniciando con `/`) y el valor es una función que recibe el `BuildContext` y retorna el widget de la pantalla.

```dart title="lib/main.dart" showLineNumbers
MaterialApp(
  title: 'Catálogo de Contactos',
  initialRoute: '/',
  routes: {
    '/': (context) => const HomeScreen(),
    '/detalle': (context) => const DetalleScreen(),
    '/seleccion': (context) => const SeleccionScreen(),
    '/login': (context) => const LoginScreen(),
  },
)
```

:::warning[Incompatibilidad entre home e initialRoute: '/']
Si declaras la ruta `'/'` dentro del mapa `routes`, **no debes declarar la propiedad `home`** en `MaterialApp`. Hacerlo generará una excepción por colisión de rutas redundantes en el arranque del framework.
:::

### Organización del proyecto

Una app con navegación se reparte en pocos archivos, cada uno con una responsabilidad:

```text
lib/
├── main.dart                  # punto de entrada: runApp y MaterialApp
├── routes/
│   └── app_routes.dart        # nombres de las rutas y la tabla routes
├── screens/                   # una pantalla completa por archivo
│   ├── catalogo_screen.dart
│   ├── detalle_screen.dart
│   └── editar_screen.dart
└── models/                    # datos que viajan entre pantallas
    └── contacto.dart
```

* **`main.dart`:** solo arranca la app y configura `MaterialApp`. No contiene pantallas.
* **`screens/`:** cada pantalla en su archivo, con nombre terminado en `Screen`. Algunos proyectos usan `pages/`: es lo mismo. Elige una carpeta y úsala en todo el proyecto.
* **`routes/app_routes.dart`:** archivo aparte para los nombres (`'/detalle'`) y la tabla `routes`. En una app de 2 o 3 pantallas el mapa puede quedarse en `main.dart`; pásalo a su archivo cuando haya más rutas o cuando varios archivos escriban los mismos nombres, porque una constante evita errores de tipeo.
* **`models/`:** las clases de datos (`Contacto`) que se envían como `arguments`.

El código completo, archivo por archivo, está en la sección 6.

---

## 4. Transferencia Bidireccional de Información

La comunicación entre pantallas en Flutter sigue dos direcciones: datos hacia adelante (*Forward*) al abrir la pantalla, y datos hacia atrás (*Backward*) al cerrarla.

### 4.1 Envío de Argumentos hacia la Pantalla Nueva

Al invocar `Navigator.pushNamed`, se utiliza el parámetro opcional `arguments`. Puede enviarse cualquier objeto Dart (un `String`, un `Map`, o una instancia de un modelo de datos):

```dart title="Emisor: HomeScreen.dart" showLineNumbers
Navigator.pushNamed(
  context,
  '/detalle',
  arguments: Contacto(id: 'c1', nombre: 'Camila Rivera', rol: 'Tech Lead'),
);
```

En la pantalla receptora, los argumentos se extraen dentro del método `build` mediante `ModalRoute`:

```dart title="Receptor: DetalleScreen.dart" showLineNumbers
@override
Widget build(BuildContext context) {
  // Extracción y casteo seguro de los argumentos
  final contacto = ModalRoute.of(context)!.settings.arguments as Contacto;

  return Scaffold(
    appBar: AppBar(title: Text(contacto.nombre)),
    body: Center(child: Text('Rol: ${contacto.rol}')),
  );
}
```

---

### 4.2 Retorno de un Resultado al Cerrar la Pantalla

Para devolver información a la pantalla de origen:
1. La pantalla receptora pasa el valor como segundo argumento en `Navigator.pop(context, resultado)`.
2. La pantalla emisora espera el resultado asíncronamente anteponiendo `await` a `Navigator.pushNamed`.

```dart title="Emisor con captura asíncrona" showLineNumbers
Future<void> _abrirSelector(BuildContext context) async {
  // 1. pushNamed retorna un Future que se completa cuando se ejecuta pop en la otra pantalla
  final String? categoriaSeleccionada = await Navigator.pushNamed<String>(
    context,
    '/seleccion',
  );

  // 2. Validación de seguridad contra fugas de contexto asíncrono
  if (!context.mounted) return;

  // 3. Procesar el resultado si el usuario no canceló
  if (categoriaSeleccionada != null) {
    ScaffoldMessenger.of(context)
      ..removeCurrentSnackBar()
      ..showSnackBar(SnackBar(content: Text('Seleccionaste: $categoriaSeleccionada')));
  }
}
```

```dart title="Receptor devolviendo el resultado" showLineNumbers
ElevatedButton(
  onPressed: () {
    // Cierra la pantalla y envía 'Diseño UI' a la pantalla que invocó el push
    Navigator.pop(context, 'Diseño UI');
  },
  child: const Text('Elegir Diseño UI'),
)
```

:::note[¿Y si el usuario no elige nada?]
Si la persona sale con el botón Atrás del sistema o con la flecha de la AppBar, `pop` se ejecuta **sin valor**: el `Future` de `pushNamed` se completa con `null`. Por eso el tipo del resultado es `String?` y el código comprueba `if (categoriaSeleccionada != null)` antes de usarlo.
:::

:::danger[La Regla de Oro: if (!context.mounted) return;]
Siempre que ejecutes una instrucción que dependa de `BuildContext` (`ScaffoldMessenger`, `Theme.of`, o nuevo `Navigator`) después de un `await`, debes comprobar `if (!context.mounted) return;`. Si el usuario cerró la pantalla mientras la operación asíncrona estaba en curso, usar el `context` desvinculado causará un error en tiempo de ejecución.
:::

### Tubería de Datos Bidireccional

El siguiente diagrama interactivo ilustra el flujo de datos entre pantallas: observa el viaje del paquete de argumentos al realizar `pushNamed`, la pausa de ejecución en el `await`, y el retorno del resultado al invocar `pop(context, resultado)`.

<InteractiveFrame
  src="/interactive/seminario-de-i-d-i/semana-13/paso-retorno-datos/index.html"
  title="Flujo bidireccional de datos entre pantallas con Navigator en Flutter"
  height={720}
/>

## 5. Reestructuración de la Pila con `pushNamedAndRemoveUntil`

Existen flujos donde apilar pantallas consecutivamente es incorrecto:
* **Autenticación (Login):** Tras iniciar sesión exitosamente, el usuario no debe poder presionar "Atrás" para volver a la pantalla de credenciales.
* **Cierre de Sesión (Logout):** Todo el historial privado debe eliminarse de la memoria para que el usuario no regrese a datos de sesión anteriores.
* **Finalización de Pago:** Tras confirmar una orden, la pasarela y el carrito deben ser descartados de la pila.

Para estos casos, Flutter provee `Navigator.pushNamedAndRemoveUntil`:

```dart title="Login: limpiar la pila"
Navigator.pushNamedAndRemoveUntil(
  context,
  '/home',
  (Route<dynamic> route) => false, // Predicado de eliminación
);
```

### El Rol del Predicado (*Predicate*)

El tercer argumento es una función `RoutePredicate` que evalúa cada ruta existente en la pila de arriba a abajo:
* Si la función retorna `false`, esa ruta es destruida y descartada de la memoria.
* En el momento en que retorna `true`, la purga se detiene: esa ruta y todas las de abajo se conservan.

Ojo con el orden: primero se **apila la ruta nueva** (igual que `pushNamed`) y después se revisan las anteriores con el predicado. La ruta nueva nunca se elimina: siempre queda en el tope.

| Predicado | Comportamiento | Caso de Uso Común |
| :--- | :--- | :--- |
| `(route) => false` | Elimina **todas** las pantallas previas. La nueva pantalla queda como la única raíz absoluta de la pila. | Login completado, Logout, expiración de token de sesión. |
| `(route) => route.isFirst` | Elimina todas las pantallas intermedias, preservando la raíz de la pila. Queda `[raíz, nueva]`. | Finalizar un flujo de compra: la pila queda `[Home, Gracias]` y Atrás lleva a Home. |
| `ModalRoute.withName('/home')` | Elimina las rutas hasta encontrar una con ese nombre, que se conserva. | Volver a una pantalla concreta de la pila, aunque no sea la primera. |

:::warning[isFirst conserva la raíz, no "Home" por nombre]
`route.isFirst` es `true` solo para la **primera** ruta de la pila. Si el Login se apiló con `pushNamed`, la raíz es el Login, no Home, y `isFirst` conservaría el Login. En el comparador de abajo, la alternativa C parte de una pila cuya raíz es Home precisamente por eso. Para conservar una ruta por su nombre, usa `ModalRoute.withName`.
:::

### Comparador de Estrategias de Pila

Con el selector «Alternativa» compara qué le pasa a la pila al cerrar sesión con `pushNamed` (anti-patrón), con `pushNamedAndRemoveUntil` y `(route) => false`, y al finalizar una compra con `(route) => route.isFirst`. En cada caso prueba también el botón Atrás del sistema.

<InteractiveFrame
  src="/interactive/seminario-de-i-d-i/semana-13/push-remove-until/index.html"
  title="Efecto de pushNamedAndRemoveUntil en la memoria de la pila de rutas"
  height={750}
/>

## 6. El código, archivo por archivo

Ahora que conoces la pila, el código que la maneja. A la izquierda, el teléfono; a la derecha, los archivos del proyecto. Toca un botón del teléfono y verás qué línea se ejecuta; o pulsa **▶ Ejecutar** en el código y mira cómo cambian el teléfono y la pila. Cambia `automaticallyImplyLeading` para ver cuándo aparece la flecha.

<InteractiveFrame
  src="/interactive/seminario-de-i-d-i/semana-13/pila-codigo/index.html"
  title="Código Dart por archivos enlazado con el teléfono y la pila de rutas"
  height={680}
/>

---

## 7. Cuadro Resumen de Métodos de Navegación

| Método | Sintaxis en Dart | Acción en la Pila | ¿Cuándo Utilizarlo? |
| :--- | :--- | :--- | :--- |
| **`pushNamed`** | `Navigator.pushNamed(context, '/ruta')` | Agrega una pantalla al tope. | Navegación estándar entre pantallas jerárquicas. |
| **`pop`** | `Navigator.pop(context, [resultado])` | Destruye la pantalla del tope y devuelve un valor opcional. | Botón "Atrás", botones de "Cancelar" o "Guardar". |
| **`canPop`** | `Navigator.canPop(context)` | Consulta si hay más de 1 pantalla en la pila. | Decidir si mostrar un botón de salida o confirmar antes de salir. |
| **`popUntil`** | `Navigator.popUntil(context, (r) => r.isFirst)` | Desapila rutas hasta que el predicado sea `true`, sin apilar nada. | Volver a la raíz sin abrir otra pantalla. |
| **`pushReplacementNamed`** | `Navigator.pushReplacementNamed(context, '/ruta')` | Reemplaza la pantalla superior actual sin alterar las inferiores. | Transiciones tipo Splash Screen a Home. |
| **`pushNamedAndRemoveUntil`** | `Navigator.pushNamedAndRemoveUntil(context, '/ruta', (r) => false)` | Vacía total o selectivamente la pila antes de apilar la nueva ruta. | Login, Logout, post-compra o reinicio de flujo de aplicación. |

## 8. Preguntas de Autoevaluación

<Quiz id="quiz-navigator-rutas-nombradas">
  <Question title="En una pila (stack), ¿qué elemento sale primero?">
    <Option>El primero que entró, como en la fila de un banco.</Option>
    <Option correct>El último que entró, porque solo se puede tocar el elemento del tope.</Option>
    <Option>El de en medio, porque la pila se parte por la mitad.</Option>
    <Option>El que el programador elija, ya que la pila permite sacar cualquier posición.</Option>
  </Question>

  <Question title="¿Qué sucede con la pantalla anterior cuando ejecutas Navigator.pushNamed(context, '/detalle')?">
    <Option>Se destruye de inmediato para liberar memoria.</Option>
    <Option correct>Queda suspendida debajo en la pila, conservando su estado, sus controladores y su scroll.</Option>
    <Option>Se convierte en un widget fantasma y pierde sus controladores de texto.</Option>
    <Option>Se mueve al final de una cola para reconstruirse más tarde.</Option>
  </Question>

  <Question title="La AppBar de la pantalla Detalle muestra una flecha de volver, pero la de Catálogo (la ruta inicial) no. ¿Por qué?">
    <Option>Porque Catálogo usa un tipo de Scaffold distinto.</Option>
    <Option>Porque la flecha solo aparece en pantallas que reciben argumentos.</Option>
    <Option correct>Porque Flutter dibuja la flecha solo cuando hay una ruta debajo a la que volver (canPop es true).</Option>
    <Option>Porque en Catálogo se llamó a pushReplacementNamed al arrancar.</Option>
  </Question>

  <Question title="¿Por qué es necesario verificar if (!context.mounted) return; después de un await Navigator.pushNamed?">
    <Option correct>Porque mientras se esperaba, la pantalla pudo cerrarse y su context ya no está activo en el árbol.</Option>
    <Option>Porque el compilador de Dart marca un error de sintaxis si falta la condición.</Option>
    <Option>Porque asegura que la animación de la flecha termine de reproducirse.</Option>
    <Option>Porque pushNamed devuelve siempre null si no se valida el context.</Option>
  </Question>

  <Question title="En un Logout, ¿qué predicado de pushNamedAndRemoveUntil deja la pila solo con la pantalla de login?">
    <Option>(route) => route.isFirst</Option>
    <Option correct>(route) => false</Option>
    <Option>(route) => true</Option>
    <Option>(route) => route.settings.name == '/home'</Option>
  </Question>

  <Question title="¿Dónde conviene declarar el mapa de rutas cuando la app ya tiene muchas pantallas y varios archivos las usan?">
    <Option>Repetido en cada pantalla, para que cada una conozca a sus vecinas.</Option>
    <Option>Dentro de cada botón, como texto suelto.</Option>
    <Option correct>En un archivo aparte (por ejemplo routes/app_routes.dart) con constantes de nombre, y main.dart solo lo usa.</Option>
    <Option>En la carpeta screens, mezclado con el código de las pantallas.</Option>
  </Question>
</Quiz>
