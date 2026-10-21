---
sidebar_position: 3
description: "Entiende por qué el estado vive en State, cómo setState reconstruye el árbol de widgets y cómo manejar la primera interacción."
---

import Tabs from '@theme/Tabs';
import TabItem from '@theme/TabItem';

# StatefulWidget y Reconstrucción del Árbol

Hasta este momento del curso, todas las pantallas y componentes que has construido han sido **estáticos e inmutables** mediante `StatelessWidget`. Sin embargo, las aplicaciones del mundo real necesitan responder a eventos del usuario: presionar botones, escribir en campos de texto, alternar interruptores y cargar datos dinámicos.

En esta sesión comprenderás los fundamentos matemáticos y arquitectónicos del manejo de estado en Flutter, por qué el estado vive en una clase separada (`State<T>`) y cómo funciona internamente la reconstrucción del árbol mediante `setState()`.

---

## 1. La Ecuación Fundamental del Frontend Declarativo

En los frameworks frontend modernos (Flutter, React, SwiftUI), la interfaz de usuario no se modifica manipulando directamente elementos visuales en la memoria como en JavaFX o el DOM de JavaScript. En su lugar, responde a una fórmula matemática estricta:

$$UI = f(state)$$

* **$state$ (Estado):** La información y datos que describen el estado actual de la aplicación en memoria en un instante de tiempo (ejemplo: un contador numérico en `0`, un booleano `isLoading: true`, o una lista de contactos).
* **$f$ (Función de renderizado):** El método `build(BuildContext context)`. Es una función declarativa que describe cómo debe lucir la interfaz dada esa información.
* **$UI$ (Interfaz de Usuario):** Los píxeles visibles que el motor gráfico de Flutter (Impeller o Skia) dibuja en la pantalla a 60 o 120 cuadros por segundo.

Cuando el estado cambia, el framework vuelve a evaluar la función $f$ y actualiza de manera eficiente los elementos gráficos en pantalla.

---

## 2. ¿Por qué el Estado Vive en `State` y no en el `Widget`?

Una de las preguntas más frecuentes de los estudiantes al aprender Flutter es: *¿Por qué un `StatefulWidget` requiere dos clases separadas en lugar de una sola?*.

![Estructura de StatelessWidget frente a StatefulWidget](/img/seminario-de-i-d-i/stateless-vs-stateful-arquitectura.svg)

La respuesta radica en la optimización de memoria y rendimiento del framework:

1. **La clase `Widget` es `@immutable` (Inmutable y Efímera):**
   * En Flutter, los widgets son simples configuraciones ligeras de la interfaz (planos de construcción).
   * Cuando algo cambia, Flutter puede destruir y volver a instanciar miles de widgets por segundo sin impacto apreciable en la memoria.
   * Si las variables mutables vivieran dentro del widget, se perderían cada vez que el widget padre se reconstruyera.

2. **La clase `State<T>` es Persistente y Mutable:**
   * El objeto `State` permanece vivo en la memoria RAM mientras la pantalla esté presente ante el usuario.
   * Contiene los campos mutables (ejemplo: `int _contador = 0;`).
   * No se destruye cuando el widget exterior se recrea; sobrevive y retiene los datos activos.

---

## 3. Los Tres Árboles de Flutter y el Marcado `dirty`

Para entender qué ocurre realmente cuando la aplicación cambia de estado, debemos conocer los **tres árboles paralelos** que gestiona Flutter internamente:

![Los Tres Árboles de Flutter y el Marcado Dirty tras setState](/img/seminario-de-i-d-i/arbol-widgets-elements-reconstruccion.svg)

1. **Árbol de Widgets (Widget Tree):** El plano declarativo. Inmutable, reciclable y extremadamente económico de crear.
2. **Árbol de Elementos (Element Tree):** El árbol estructural persistente. Los `Elements` representan los nodos reales en memoria y son quienes retienen la referencia al objeto `State`.
3. **Árbol de Renderizado (RenderObject Tree):** Los objetos que calculan geometrías, restricciones de tamaño (*box constraints*) y ordenan las instrucciones directas de dibujado a la GPU.

### ¿Qué hace exactamente `setState()`?

Cuando llamas a `setState(() { ... })`, ocurren los siguientes pasos exactos:
1. Ejecuta la función sincrónica que pasaste como argumento, mutando tu variable de estado interna (ej. `_contador++`).
2. Invoca internamente al método `markNeedsBuild()` sobre el `Element` correspondiente.
3. El `Element` se marca con una bandera de **`dirty` (sucio)**.
4. En el siguiente ciclo de refresco de pantalla (*frame*), Flutter busca los elementos marcados como `dirty` y llama a su método `build()`.
5. **Alcance de la reconstrucción:** Solo se reconstruye el subárbol que desciende de ese widget con estado. Los widgets hermanos o antecesores no se reconstruyen, y aquellos marcados con `const` son reutilizados directamente por el framework.

---

## 4. Experimento Didáctico: El Rastreo con `debugPrint`

La mejor manera de comprobar visualmente la reconstrucción es colocar una impresión en consola dentro del método `build()`.

<Tabs>
<TabItem value="codigo" label="Contador con DebugPrint" default>

```dart title="lib/pages/contador_page.dart" showLineNumbers
import 'package:flutter/material.dart';

// 1. CLASE WIDGET (Inmutable y ligada a su State)
class ContadorPage extends StatefulWidget {
  const ContadorPage({super.key});

  @override
  State<ContadorPage> createState() => _ContadorPageState();
}

// 2. CLASE STATE (Persistente en memoria y mutable)
class _ContadorPageState extends State<ContadorPage> {
  int _contador = 0;

  void _incrementarContador() {
    setState(() {
      _contador++;
    });
  }

  void _reiniciarContador() {
    setState(() {
      _contador = 0;
    });
  }

  @override
  Widget build(BuildContext context) {
    // EXPERIMENTO: Se ejecuta cada vez que el nodo se marca como dirty
    debugPrint('--> [FRAME RENDER] build() ejecutado. Valor actual: $_contador');

    return Padding(
      padding: const EdgeInsets.all(24.0),
      child: Column(
        mainAxisAlignment: MainAxisAlignment.center,
        crossAxisAlignment: CrossAxisAlignment.stretch,
        children: [
          // Widget CONST: Flutter lo reutiliza y no gasta CPU recalculándolo
          const Text(
            'Número de Clics Realizados:',
            textAlign: TextAlign.center,
            style: TextStyle(fontSize: 16, color: Colors.grey),
          ),
          const SizedBox(height: 12),
          Text(
            '$_contador',
            textAlign: TextAlign.center,
            style: const TextStyle(
              fontSize: 48,
              fontWeight: FontWeight.bold,
              color: Color(0xFF5454E9),
            ),
          ),
          const SizedBox(height: 32),
          FilledButton.icon(
            onPressed: _incrementarContador,
            icon: const Icon(Icons.add),
            label: const Text('Incrementar Contador'),
          ),
          const SizedBox(height: 12),
          OutlinedButton.icon(
            onPressed: _reiniciarContador,
            icon: const Icon(Icons.refresh),
            label: const Text('Reiniciar a Cero'),
          ),
        ],
      ),
    );
  }
}
```

</TabItem>
<TabItem value="salida" label="Salida en Consola de Debug">

Al iniciar la aplicación y pulsar dos veces el botón de incremento, la terminal de Dart reflejará:

```text
flutter: --> [FRAME RENDER] build() ejecutado. Valor actual: 0
flutter: --> [FRAME RENDER] build() ejecutado. Valor actual: 1
flutter: --> [FRAME RENDER] build() ejecutado. Valor actual: 2
```

Observa que cada vez que `setState()` muta la variable, el método `build()` vuelve a ejecutarse de principio a fin para generar la nueva descripción visual con el número actualizado.

</TabItem>
</Tabs>

---

## 5. Primera Interacción de Usuario: Funciones y Callbacks

En Flutter, los botones y eventos interactivos reciben **funciones como parámetro** a través de propiedades como `onPressed` o `onTap`:

1. **Referencia a un método existente:** `onPressed: _incrementarContador`. Se pasa el nombre del método sin paréntesis para que Flutter lo invoque en el momento del clic.
2. **Función anónima lambda:** `onPressed: () { setState(() => _contador++); }`. Ideal para acciones cortas de una sola línea.
3. **Estado deshabilitado (`null`):** Si pasas `onPressed: null`, el framework de Material automáticamente pinta el botón en tono gris deshabilitado y bloquea los toques.

:::caution[Antipatrón Crítico con setState()]
Nunca coloques llamadas asincrónicas pesadas (como `await http.get()`) adentro del bloque de `setState()`. Solo las asignaciones sincrónicas inmediatas de memoria deben vivir dentro del callback:

```dart title="Antipatrón con setState"
// ❌ INCORRECTO:
setState(() async {
  final datos = await api.get(); // ¡Bloquea el pipeline de renderizado!
  _lista = datos;
});

// ✅ CORRECTO:
final datos = await api.get();
if (mounted) {
  setState(() {
    _lista = datos;
  });
}
```
:::

---

## Cuestionario de Autoevaluación

<Quiz id="seminario-s11-state-foundations-quiz">
  <Question title="¿Cuál es la fórmula matemática que define el paradigma declarativo en Flutter?">
    <Option>State = f(UI)</Option>
    <Option correct>UI = f(state)</Option>
    <Option>Widget = Element + RenderObject</Option>
    <Option>Scaffold = AppBar * Page</Option>
  </Question>

  <Question title="¿Por qué en un StatefulWidget las variables de estado mutables viven en la clase State y no en el Widget?">
    <Option>Porque Dart no permite declarar variables en ninguna clase que se llame Widget.</Option>
    <Option correct>Porque la clase Widget es inmutable (@immutable) y se desecha con frecuencia, mientras que el objeto State persiste en el Element Tree conservando los datos en memoria.</Option>
    <Option>Porque el sistema operativo Android elimina todas las clases públicas cada 5 segundos.</Option>
    <Option>Para obligar a los desarrolladores a escribir el doble de líneas de código.</Option>
  </Question>

  <Question title="¿Qué sucede internamente en el árbol de elementos cuando se invoca el método setState()?">
    <Option>La aplicación se reinicia por completo regresando al main.dart.</Option>
    <Option>Se borra la memoria caché del dispositivo móvil.</Option>
    <Option correct>El Element correspondiente se marca con la bandera dirty, programando la ejecución de su método build() en el siguiente ciclo de refresco.</Option>
    <Option>Se descarga una actualización del SDK de Flutter desde Internet.</Option>
  </Question>

  <Question title="Si colocamos la palabra clave const delante de un widget hijo dentro del método build(), ¿cómo se comporta Flutter durante la reconstrucción?">
    <Option>Genera un error de compilación inmediato por conflicto de tipos.</Option>
    <Option correct>Reutiliza la instancia idéntica existente en memoria sin necesidad de reconstruirla, optimizando el rendimiento de CPU.</Option>
    <Option>Convierte automáticamente el widget en un StatefulWidget.</Option>
    <Option>Duplica el tamaño del widget en la pantalla del emulador.</Option>
  </Question>

  <Question title="¿Qué ocurre si asignas el valor null a la propiedad onPressed de un FilledButton?">
    <Option>La aplicación lanza una excepción de puntero nulo (NullPointerException).</Option>
    <Option>El botón desaparece por completo de la pantalla.</Option>
    <Option correct>El botón se deshabilita automáticamente, adoptando el estilo visual inactivo de Material Design y bloqueando los toques.</Option>
    <Option>El botón cambia de color a rojo parpadeante.</Option>
  </Question>
</Quiz>
