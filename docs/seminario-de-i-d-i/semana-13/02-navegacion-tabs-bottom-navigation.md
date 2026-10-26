---
sidebar_position: 2
description: "Domina la navegación horizontal con NavigationBar en Flutter: la Screen anfitriona con estado, IndexedStack y la diferencia clave entre setState y Navigator.push."
---

# Navegación Horizontal con BottomNavigationBar

En el capítulo anterior viste que `Navigator` maneja una **pila**: cada pantalla nueva se apila encima y *Atrás* la desapila (navegación jerárquica, *drilling down*). Pero una app también tiene **secciones principales** (Cursos, Guardados, Perfil) entre las que el usuario salta con un toque, sin ir "más adentro". Eso es la **navegación horizontal por pestañas**, y **no usa la pila**.

En este capítulo aprenderás:
* Por qué cambiar de pestaña y abrir un detalle son **dos movimientos distintos** y cuál usar en cada caso.
* El patrón de la **`Screen` anfitriona**: un único widget con estado que guarda un índice y decide qué página mostrar.
* Cómo **`IndexedStack`** conserva lo que el usuario escribió en cada pestaña.
* En qué archivos vive cada parte del código.

---

## 1. Dos movimientos: horizontal y jerárquico

La regla de oro de Flutter cabe en una frase:

> **Cambiar de pestaña es `setState`. Abrir un detalle es `push`.**

Un error muy común al empezar es usar `Navigator.pushNamed` para cambiar entre las pestañas del menú inferior, o al revés, usar `setState` para mostrar el detalle de un producto. Prueba ambos movimientos en el teléfono y mira qué pasa con la **pila de rutas** de la derecha:

<InteractiveFrame
  src="/interactive/seminario-de-i-d-i/semana-13/tabs-vs-push/index.html"
  title="Cambiar de pestaña frente a abrir un detalle: qué pasa con la pila de rutas"
  height={640}
/>

| Criterio | Cambiar de pestaña (`setState`) | Abrir un detalle (`Navigator.push`) |
| :--- | :--- | :--- |
| **Dirección** | **Horizontal**: entre secciones hermanas. | **Jerárquica**: de un resumen a un elemento concreto. |
| **Pila de rutas** | **No cambia**: sigue con una ruta (`MainScreen`). | **Crece**: se apila una ruta nueva. |
| **Barra inferior** | **Siempre visible.** | **Cubierta** por la nueva pantalla. |
| **Botón Atrás** | **No existe**: no hay relación padre-hijo. | **Automático**: el `AppBar` dibuja la flecha (`pop`). |

Para decidir en un caso nuevo, hazte estas preguntas en orden:

```
¿Es una sección principal a la que el usuario volverá a menudo?
   ├── SÍ  ──> Pestaña (NavigationBar + setState).
   └── NO  ──> ¿Nace de tocar un elemento para verlo o editarlo?
                 ├── SÍ  ──> Navigator.push / pushNamed (cubre la pantalla).
                 └── NO  ──> ¿Es una acción rápida o una confirmación?
                               └── showModalBottomSheet o showDialog.
```

---

## 2. La Screen anfitriona: un índice que decide qué se ve

Para que las pestañas funcionen hacen falta dos roles distintos:

* **`Screen` anfitriona (`MainScreen`):** un `StatefulWidget` con el `Scaffold` raíz, la barra inferior y **una sola variable de estado: `int _selectedIndex`**.
* **`Page` de contenido (`CursosPage`, `GuardadosPage`, `PerfilPage`):** widgets que dibujan solo el **cuerpo** de cada sección. **No declaran su propio `Scaffold`** ni otra barra: devuelven columnas, listas o contenedores.

Al tocar una pestaña, el callback de la barra (`onDestinationSelected`) llama a `setState` con el índice nuevo; `build()` se ejecuta otra vez y el `body` muestra la página que corresponde.

:::tip[Material 3: NavigationBar]
En Flutter moderno se recomienda **`NavigationBar`** con hijos **`NavigationDestination`**. Es el sucesor de `BottomNavigationBar` (indicador en forma de píldora, mejor contraste), y ambos comparten el mismo modelo mental: un índice y `setState`.
:::

### Conservar el estado: `IndexedStack` frente a la lista directa

Hay dos formas de escribir el `body`, y se comportan distinto:

* `_paginas[_selectedIndex]`: solo existe la página elegida. Al cambiar de pestaña la anterior **se destruye** y, al volver, nace de nuevo: se pierde lo que el usuario había escrito o su posición de scroll.
* `IndexedStack(index: _selectedIndex, children: _paginas)`: **todas las páginas permanecen montadas** y solo se muestra una. Lo escrito y el scroll se conservan.

Escribe algo en «Buscar», cambia de pestaña y vuelve; luego alterna entre las dos formas y repite:

<InteractiveFrame
  src="/interactive/seminario-de-i-d-i/semana-13/bottom-nav-anfitriona/index.html"
  title="Screen anfitriona: el índice del State y las páginas que se conservan con IndexedStack"
  height={600}
/>

---

## 3. El código, archivo por archivo

El proyecto separa cada rol en su carpeta:

```
lib/
├── main.dart                        # arranca la app: MaterialApp(home: MainScreen())
├── screens/                         # pantallas completas (tienen Scaffold)
│   ├── main_screen.dart             #   la anfitriona: _selectedIndex + NavigationBar
│   └── detalle_curso_screen.dart    #   el detalle, que se abre con push
└── pages/                           # cuerpos de las pestañas (sin Scaffold)
    ├── cursos_page.dart
    ├── guardados_page.dart
    └── perfil_page.dart
```

La diferencia entre las dos carpetas es la misma de la sección anterior: una **screen** es una pantalla completa con su `Scaffold`; una **page** es solo el contenido que la anfitriona coloca en su `body`.

Toca una pestaña o un curso en el teléfono y mira qué archivo se abre y qué línea corre; o pulsa **▶** en el código y observa cómo cambian el teléfono y la pila. Con el botón **cambiar a lista directa** (en `main_screen.dart`) puedes comprobar qué se pierde sin `IndexedStack`.

<InteractiveFrame
  src="/interactive/seminario-de-i-d-i/semana-13/tabs-codigo/index.html"
  title="Código Dart por archivos enlazado con el teléfono y la pila de rutas de la navegación por pestañas"
  height={680}
/>

---

## 4. Buenas prácticas y errores habituales

1. **No anides `Scaffold` innecesariamente:** si la anfitriona ya tiene el `Scaffold` con su barra inferior, las `Page` no necesitan otro, salvo que una pestaña requiera su propio `FloatingActionButton` o fondo.
2. **Usa `IndexedStack` cuando una pestaña tenga estado que importe:** formularios a medias, listas con scroll o paginación. Cuesta más memoria, pero evita que el usuario pierda su lugar.
3. **El detalle siempre tapa la barra inferior:** si el usuario abre un producto, la barra no debe competir por atención; la cubre el `Scaffold` del detalle gracias a `Navigator.push`.
4. **Una pestaña no se abre con `pushNamed`:** apilaría una copia de la anfitriona en cada toque y *Atrás* tendría que deshacerlas una por una.

---

## 5. Preguntas de Autoevaluación

<Quiz id="quiz-bottom-nav-horizontal">
  <Question title="¿Por qué cambiar de pestaña en un NavigationBar no aumenta la profundidad de la pila del Navigator?">
    <Option correct>Porque no se apila ninguna ruta: solo se ejecuta setState en la anfitriona y su body muestra otra página.</Option>
    <Option>Porque Flutter guarda las pestañas en disco en lugar de en memoria.</Option>
    <Option>Porque la barra ejecuta pop() automáticamente antes de mostrar la pestaña nueva.</Option>
    <Option>Porque cada pestaña es una app distinta con su propio Navigator.</Option>
  </Question>

  <Question title="¿Cuál es la ventaja de IndexedStack frente a _paginas[_selectedIndex] en el body?">
    <Option>Reduce a la mitad el consumo de memoria al descartar las páginas invisibles.</Option>
    <Option correct>Mantiene montadas todas las páginas, así que se conservan lo escrito y el scroll de cada pestaña.</Option>
    <Option>Añade animaciones de giro entre pestañas sin código adicional.</Option>
    <Option>Evita tener que llamar a setState al cambiar de pestaña.</Option>
  </Question>

  <Question title="¿Qué guarda el State de la Screen anfitriona para saber qué página mostrar?">
    <Option>Una referencia al Navigator y la ruta actual.</Option>
    <Option>La lista de páginas ya visitadas, para poder volver a ellas.</Option>
    <Option correct>Un entero (_selectedIndex) con la posición de la pestaña elegida.</Option>
    <Option>Nada: la barra inferior recuerda la pestaña por su cuenta.</Option>
  </Question>

  <Question title="El usuario toca un contacto de la lista para ver su perfil completo con botón de edición. ¿Qué debes usar?">
    <Option>Cambiar el índice de la barra con setState para mostrar el contacto en una pestaña oculta.</Option>
    <Option correct>Navigator.push (o pushNamed): el detalle es jerárquico, cubre la barra inferior y ofrece la flecha de volver.</Option>
    <Option>pushNamedAndRemoveUntil con (route) => false.</Option>
    <Option>showDialog, porque un detalle siempre es una ventana emergente.</Option>
  </Question>

  <Question title="¿Qué carpeta corresponde a CursosPage y qué la distingue de una screen?">
    <Option>screens/: porque toda clase que extiende StatelessWidget es una screen.</Option>
    <Option>models/: porque contiene los datos de los cursos.</Option>
    <Option correct>pages/: es solo el cuerpo de una pestaña y no declara su propio Scaffold.</Option>
    <Option>routes/: porque cada pestaña necesita su nombre de ruta.</Option>
  </Question>
</Quiz>
