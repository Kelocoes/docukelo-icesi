---
sidebar_position: 3
description: "Entiende qué es el estado, cómo se estructura un StatefulWidget, qué hace setState y cómo Flutter actualiza el árbol de widgets."
---

import Tabs from '@theme/Tabs';
import TabItem from '@theme/TabItem';

# StatefulWidget y Reconstrucción del Árbol

Hasta este momento del curso, todas las pantallas y componentes que has construido han sido **estáticos e inmutables** mediante `StatelessWidget`. Sin embargo, las aplicaciones del mundo real necesitan responder a eventos del usuario: presionar botones, escribir en campos de texto, alternar interruptores y cargar datos dinámicos.

En esta sesión vas a entender **qué es el estado**, cómo se organiza un `StatefulWidget` (por qué son dos clases), qué hace exactamente `setState()` y cómo Flutter decide qué parte de la pantalla actualizar.

---

## 1. ¿Qué es el Estado?

El **estado** es cualquier dato que **cambia con el tiempo** y que decide **cómo se ve la interfaz** en un momento dado.

| Ejemplo | ¿Es estado? | Por qué |
| :--- | :---: | :--- |
| Un contador de clics (`int _contador`) | Sí | Cambia con cada toque y la pantalla debe mostrarlo. |
| El texto que el usuario escribe en un campo | Sí | Cambia mientras escribe. |
| Una lista de contactos | Sí | Crece y se reduce al agregar o eliminar. |
| Un indicador `isLoading` | Sí | Alterna entre cargando y cargado. |
| El título fijo `const Text('Agenda')` | No | Nunca cambia: es configuración, no estado. |

En los frameworks frontend modernos (Flutter, React, SwiftUI), la interfaz no se modifica tocando directamente elementos visuales, como en JavaFX o en el DOM de JavaScript. En su lugar, la interfaz es **el resultado de una función** que recibe el estado:

$$UI = f(state)$$

* **$state$ (Estado):** los datos que describen la aplicación en un instante (un contador en `0`, un booleano `isLoading: true`, una lista de contactos).
* **$f$ (Función de renderizado):** el método `build(BuildContext context)`. Describe cómo debe verse la interfaz dados esos datos.
* **$UI$ (Interfaz de Usuario):** los píxeles que el motor gráfico de Flutter (Impeller o Skia) dibuja en pantalla a 60 o 120 cuadros por segundo.

Cuando el estado cambia, Flutter vuelve a evaluar la función $f$ y actualiza lo que se ve. Tu trabajo es **cambiar el estado**; el framework se encarga de redibujar.

:::tip[Idea clave]
Un `StatelessWidget` solo puede mostrar lo que su padre le entrega: no tiene dónde guardar datos que cambien. Para que un widget **recuerde y cambie** algo por sí mismo necesitas un `StatefulWidget`.
:::

---

## 2. Anatomía de un StatefulWidget

Una de las preguntas más frecuentes al aprender Flutter es: *¿por qué un `StatefulWidget` requiere dos clases en lugar de una sola?* Recorre las partes del contador de este capítulo para verlo:

<iframe
  src="/interactive/seminario-de-i-d-i/semana-11/anatomia-stateful/index.html"
  title="Anatomía interactiva de un StatefulWidget: clase Widget, clase State, el estado, build y setState"
  style={{ width: '100%', height: 1030, border: 0 }}
  loading="lazy"
/>

La respuesta está en cómo Flutter administra la memoria y el rendimiento:

1. **La clase `Widget` es `@immutable` (inmutable y efímera):**
   * Los widgets son configuraciones ligeras de la interfaz (planos de construcción).
   * Cuando algo cambia, Flutter puede destruir y volver a crear miles de widgets por segundo sin impacto apreciable.
   * Si las variables mutables vivieran dentro del widget, se perderían cada vez que el widget padre se reconstruyera.

2. **La clase `State<T>` es persistente y mutable:**
   * El objeto `State` permanece vivo en memoria mientras la pantalla esté presente en el árbol.
   * Contiene los campos mutables (por ejemplo `int _contador = 0;`).
   * No se destruye cuando el widget exterior se recrea: sobrevive y conserva los datos.

| | `StatelessWidget` | `StatefulWidget` |
| :--- | :--- | :--- |
| **Clases** | 1 (solo el widget) | 2 (el `Widget` y su `State`) |
| **Memoria entre reconstrucciones** | Ninguna | El objeto `State` persiste |
| **Dónde está `build()`** | En el propio widget | En la clase `State` |
| **¿Puede cambiar por sí mismo?** | No: solo si su padre le pasa datos nuevos | Sí, con `setState()` |

---

## 3. ¿Qué hace `setState()`?

`setState()` es la forma de **avisarle a Flutter que el estado cambió** y que debe volver a ejecutar `build()`. Cambiar una variable y avisar son dos cosas distintas, y `setState` hace las dos.

Toca los botones del teléfono y sigue el recorrido completo. Fíjate especialmente en dos momentos: el instante en que el inspector ya dice `1` pero la pantalla sigue en `0`, y el caso de **Sumar sin avisar**:

<iframe
  src="/interactive/seminario-de-i-d-i/semana-11/setstate-en-accion/index.html"
  title="Simulación interactiva de setState en un contador: del toque al build"
  style={{ width: '100%', height: 860, border: 0 }}
  loading="lazy"
/>

Cuando llamas a `setState(() { ... })` ocurre, en orden:

1. **Ejecuta tu función** de inmediato y de forma sincrónica: ahí cambias la variable de estado (por ejemplo `_contador++`).
2. **Marca el `Element` como `dirty`:** internamente llama a `markNeedsBuild()`. Es solo una bandera; todavía no se reconstruye nada.
3. **Programa la reconstrucción:** en el siguiente ciclo de refresco de pantalla (*frame*) Flutter busca los elementos `dirty` y ejecuta su `build()`.
4. **Alcance de la reconstrucción:** solo se reconstruye el subárbol que desciende del widget con estado. Los ancestros y los widgets hermanos no se reconstruyen, y los widgets marcados con `const` se reutilizan.

:::warning[Cambiar la variable no es lo mismo que avisar]
Si haces `_contador++` **fuera de `setState`**, el dato cambia pero Flutter no se entera: la pantalla sigue mostrando el valor anterior. Peor aún, cuando más tarde otro `setState` dispare un `build()`, la pantalla "salta" al valor acumulado y el error parece intermitente.
:::

---

## 4. El Árbol de Actualización: los Tres Árboles de Flutter

Para entender qué se recrea y qué se conserva cuando llamas a `setState`, hay que conocer los **tres árboles paralelos** que Flutter mantiene. La siguiente pieza sigue **un solo `Text`** a través de los tres:

<iframe
  src="/interactive/seminario-de-i-d-i/semana-11/tres-arboles/index.html"
  title="Los tres árboles de Flutter: widgets, elements y render objects, y qué se conserva en un setState"
  style={{ width: '100%', height: 780, border: 0 }}
  loading="lazy"
/>

1. **Árbol de Widgets (*Widget Tree*):** la descripción declarativa que escribes en `build()`. Es inmutable y barata de crear: se vuelve a crear en cada reconstrucción.
2. **Árbol de Elementos (*Element Tree*):** los nodos vivos de la aplicación. Cada `Element` representa a un widget en una posición concreta del árbol y **persiste entre reconstrucciones**; el `Element` de un `StatefulWidget` es quien retiene el objeto `State`.
3. **Árbol de Renderizado (*RenderObject Tree*):** los objetos que calculan tamaños y posiciones (*box constraints*) y pintan en pantalla. También persisten: cuando algo cambia, se actualizan y se repintan.

La clave de todo el mecanismo es esta: tras un `setState`, `build()` crea widgets **nuevos**, pero Flutter compara cada widget nuevo con el anterior; si tienen el mismo tipo y la misma posición, **reutiliza el `Element`** y el `RenderObject` y solo les entrega la nueva configuración. Crear widgets es barato; lo costoso (nodos, cálculo de tamaños, pintura) se reutiliza.

---

## 5. Experimento Didáctico: El Rastreo con `debugPrint`

La mejor manera de comprobar la reconstrucción es colocar una impresión en consola dentro del método `build()`. Es lo mismo que muestra el panel **Consola** del simulador de arriba.

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

Observa que cada vez que `setState()` marca el elemento como `dirty`, el método `build()` vuelve a ejecutarse de principio a fin para generar la nueva descripción visual con el número actualizado.

</TabItem>
</Tabs>

---

## 6. Primera Interacción de Usuario: Funciones y Callbacks

En Flutter, los botones y eventos interactivos reciben **funciones como parámetro** a través de propiedades como `onPressed` o `onTap`:

1. **Referencia a un método existente:** `onPressed: _incrementarContador`. Se pasa el nombre del método sin paréntesis para que Flutter lo invoque en el momento del clic.
2. **Función anónima lambda:** `onPressed: () { setState(() => _contador++); }`. Ideal para acciones cortas de una sola línea.
3. **Estado deshabilitado (`null`):** si pasas `onPressed: null`, el framework de Material pinta el botón en tono gris deshabilitado y bloquea los toques.

:::caution[Antipatrón con setState(): función asíncrona]
La función que recibe `setState()` debe ser **sincrónica** y contener solo las asignaciones de estado. Si la declaras `async`, Flutter lanza una aserción en modo debug (*"setState() callback argument returned a Future"*), porque el cambio ocurriría después de que `setState` ya terminó de marcar el elemento. Haz primero el trabajo asíncrono y luego llama a `setState` con la asignación:

```dart title="Antipatrón con setState"
// ❌ INCORRECTO: la función de setState no puede ser async
setState(() async {
  final datos = await api.get();
  _lista = datos;
});

// ✅ CORRECTO: primero el trabajo asíncrono, luego el cambio sincrónico
final datos = await api.get();
if (mounted) {
  setState(() {
    _lista = datos;
  });
}
```

La comprobación `mounted` evita llamar a `setState` si el usuario ya salió de la pantalla mientras la petición estaba en curso.
:::

---

## Cuestionario de Autoevaluación

<Quiz id="seminario-s11-state-foundations-quiz">
  <Question title="¿Cuál es la fórmula que define el paradigma declarativo en Flutter?">
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

  <Question title="Un método hace _contador++ pero nunca llama a setState(). ¿Qué ocurre?">
    <Option>Flutter detecta el cambio de la variable y reconstruye la pantalla automáticamente.</Option>
    <Option>La aplicación lanza una excepción y se cierra.</Option>
    <Option correct>El dato cambia en memoria, pero ningún Element queda dirty ni se ejecuta build(): la pantalla sigue mostrando el valor anterior hasta que otro setState la reconstruya.</Option>
    <Option>El valor se revierte al anterior al terminar el método.</Option>
  </Question>

  <Question title="Tras un setState, build() crea widgets nuevos. ¿Qué hace Flutter con los Element y RenderObject existentes?">
    <Option>Los destruye y crea otros nuevos en cada reconstrucción.</Option>
    <Option correct>Los reutiliza cuando el widget nuevo tiene el mismo tipo y posición que el anterior, y solo les entrega la configuración actualizada.</Option>
    <Option>Los copia al Widget Tree para que sean inmutables.</Option>
    <Option>Los congela hasta que el usuario cierre la aplicación.</Option>
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
