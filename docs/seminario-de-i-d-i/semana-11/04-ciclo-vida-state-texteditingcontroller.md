---
sidebar_position: 4
description: "Aprende el ciclo de vida de State y a usar TextEditingController evitando fugas de memoria en formularios con validación."
---

import Tabs from '@theme/Tabs';
import TabItem from '@theme/TabItem';

# Ciclo de Vida y TextEditingController

En el desarrollo de aplicaciones móviles profesionales, los componentes con estado no son eternos: nacen cuando el usuario entra en una pantalla, reaccionan dinámicamente ante los eventos mientras la pantalla está activa y mueren cuando el usuario navega hacia atrás.

Comprender el **Ciclo de Vida de `State`** es indispensable para inicializar recursos correctamente y, sobre todo, para evitar **fugas de memoria (*Memory Leaks*)** al gestionar entradas de texto con **`TextEditingController`**.

---

## 1. La Línea de Tiempo del Ciclo de Vida en `State`

A diferencia de un `StatelessWidget` (que solo posee el método `build`), la clase `State<T>` atraviesa varias etapas bien delimitadas durante su existencia en el *Element Tree*. Sigue cada método en la siguiente pieza y activa el interruptor **Olvidar controller.dispose()** para ver qué pasa con la memoria cuando se omite la limpieza:

<InteractiveFrame
  src="/interactive/seminario-de-i-d-i/semana-11/ciclo-vida-state/index.html"
  title="Ciclo de vida de State en Flutter: createState, initState, didChangeDependencies, build, dispose y fuga de un controlador"
  height={900}
/>

### Las Etapas Esenciales

1. **`createState()`:** es un método del **Widget** (no del `State`). Flutter lo invoca una vez al insertar el widget en el árbol para crear su objeto `State`.
2. **`initState()` (inicialización única):**
   * Es el **primer método** que se ejecuta en el objeto `State` tras su creación.
   * Se ejecuta **exactamente una sola vez** en toda su vida.
   * Es el lugar donde se instancian controladores (`TextEditingController`), se suscriben flujos de datos (*Streams*) o se inician temporizadores.
   * **Regla estricta:** siempre debe iniciar llamando a `super.initState()`.
3. **`didChangeDependencies()`:** se ejecuta inmediatamente después de `initState()` y cada vez que cambia un objeto heredado del contexto (como el tema o el idioma).
4. **`build()` (fase activa):** devuelve la estructura de widgets a renderizar. Se ejecuta al inicio y se repite cada vez que `setState()` marca el elemento como `dirty`. `setState()` no es una etapa del ciclo de vida: es lo que **provoca** que `build()` corra otra vez.
5. **`dispose()` (limpieza terminal):**
   * Se ejecuta cuando el objeto `State` se retira permanentemente del árbol (por ejemplo, cuando el usuario navega hacia atrás con `Navigator.pop`).
   * Es el lugar donde **debes liberar** los recursos que abriste en `initState()`.
   * **Regla estricta:** siempre debe finalizar llamando a `super.dispose()`.

:::note[Otros métodos que existen]
Hay dos métodos más que verás más adelante: `didUpdateWidget()` (el padre entrega una configuración nueva al mismo `State`) y `deactivate()` (el `State` sale temporalmente del árbol). Para este capítulo, con las cinco etapas anteriores es suficiente.
:::

---

## 2. ¿Qué es un `TextEditingController`?

El widget `TextField` permite a los usuarios ingresar texto desde el teclado del dispositivo. Para poder leer lo que el usuario escribió, modificar el texto mediante programación o vaciar el campo tras enviar un formulario, Flutter utiliza un **`TextEditingController`**.

Un controlador actúa como un puente bidireccional entre el campo y tu código:
* **Lectura:** permite consultar el texto actual mediante la propiedad `controller.text`.
* **Escritura:** permite cambiar el texto mediante `controller.text = 'Nuevo valor'` o `controller.clear()`.
* **Escucha reactiva:** puede avisar cada vez que el texto cambia mediante `controller.addListener(...)`.

:::info[Escribir no es un setState]
Mientras el usuario escribe, el `TextField` actualiza `controller.text` y se repinta **por su cuenta**: tu página no se reconstruye ni se ejecuta su `build()`. Solo necesitas `setState()` cuando algo **de tu pantalla** dependa de ese texto. Compruébalo en el simulador de la sección 4.
:::

---

## 3. El Peligro Crítico de Fugas de Memoria (*Memory Leaks*)

Un `TextEditingController` es un objeto que **mantiene listeners** (los `TextField` y cualquier `addListener` que registres) y reserva recursos mientras exista. Por eso Flutter le exige a quien lo crea que lo libere.

:::danger[La Regla Inquebrantable de dispose()]
Si creas un `TextEditingController` en tu pantalla y no llamas a `.dispose()` dentro del método `dispose()` de tu clase `State`, el controlador **no libera sus listeners ni sus recursos** y queda como un objeto huérfano de una pantalla que ya no existe.

Si el usuario abre y cierra la pantalla muchas veces, esos controladores huérfanos se acumulan: más memoria ocupada, más trabajo para el recolector de basura y una aplicación cada vez más lenta. Además, en modo debug las herramientas de Flutter reportan el controlador como una **fuga de memoria** (*memory leak*).

Es una regla simple y sin excepciones: **todo lo que creas en `initState()`, lo liberas en `dispose()`**.
:::

---

## 4. Implementación: Formulario con Limpieza y Validación Básica

El siguiente ejemplo reúne la inicialización en `initState()`, el uso de los controladores en el formulario y la liberación obligatoria en `dispose()`. La validación es básica: solo comprueba que los campos no estén vacíos.

Lo importante aquí es la **lógica**, no los estilos. Por eso el ejemplo se ofrece en tres vistas: un **simulador** para ver su comportamiento, el código **esencial** (sin decoraciones) y el código **completo** con todos los estilos.

<Tabs>
<TabItem value="simulador" label="Simulador" default>

Escribe en los campos y fíjate en la consola: **escribir no ejecuta `build()`**. Pulsa **Registrar** y mira el camino completo; prueba también con un campo vacío:

<iframe
  src="/interactive/seminario-de-i-d-i/semana-11/formulario-registro/index.html"
  title="Simulación del formulario de registro con TextEditingController: escribir no reconstruye, registrar sí"
  style={{ width: '100%', height: 930, border: 0 }}
  loading="lazy"
/>

</TabItem>
<TabItem value="esencial" label="Lo Esencial">

Es el mismo código sin decoraciones: tres bloques (declarar, crear/liberar y usar los controladores), el método que procesa el formulario y un `build()` mínimo.

```dart title="lib/pages/registro_page.dart (lo esencial)" showLineNumbers
class _RegistroPageState extends State<RegistroPage> {
  // 1. Declaración de controladores y estado de la página
  late final TextEditingController _nombreController;
  late final TextEditingController _emailController;
  String _mensajeResultado = '';

  @override
  void initState() {
    super.initState();
    // 2. Se crean UNA sola vez
    _nombreController = TextEditingController();
    _emailController = TextEditingController();
  }

  @override
  void dispose() {
    // 3. Se liberan al salir de la pantalla
    _nombreController.dispose();
    _emailController.dispose();
    super.dispose();
  }

  void _procesarFormulario() {
    final nombre = _nombreController.text.trim();
    final email = _emailController.text.trim();

    // Validación: campos obligatorios
    if (nombre.isEmpty || email.isEmpty) {
      ScaffoldMessenger.of(context).showSnackBar(
        const SnackBar(content: Text('Completa todos los campos')),
      );
      return; // sin setState: la página no se reconstruye
    }

    setState(() {
      _mensajeResultado = 'Usuario registrado: $nombre ($email)';
    });

    // 4. Se vacían los campos tras el envío exitoso
    _nombreController.clear();
    _emailController.clear();
  }

  @override
  Widget build(BuildContext context) {
    return Column(
      children: [
        TextField(controller: _nombreController),
        TextField(controller: _emailController),
        FilledButton(
          onPressed: _procesarFormulario,
          child: const Text('Registrar'),
        ),
        if (_mensajeResultado.isNotEmpty) Text(_mensajeResultado),
      ],
    );
  }
}
```

</TabItem>
<TabItem value="codigo" label="Código Completo (con estilos)">

```dart title="lib/pages/registro_page.dart" showLineNumbers
import 'package:flutter/material.dart';

class RegistroPage extends StatefulWidget {
  const RegistroPage({super.key});

  @override
  State<RegistroPage> createState() => _RegistroPageState();
}

class _RegistroPageState extends State<RegistroPage> {
  // 1. Declaración de controladores
  late final TextEditingController _nombreController;
  late final TextEditingController _emailController;

  // Estado local para mensajes de confirmación
  String _mensajeResultado = '';

  @override
  void initState() {
    super.initState();
    // 2. Inicialización obligatoria en initState (solo ocurre 1 vez)
    _nombreController = TextEditingController();
    _emailController = TextEditingController();
  }

  @override
  void dispose() {
    // 3. LIMPIEZA OBLIGATORIA: Previene fugas de memoria
    _nombreController.dispose();
    _emailController.dispose();
    super.dispose();
  }

  void _procesarFormulario() {
    final nombre = _nombreController.text.trim();
    final email = _emailController.text.trim();

    // Validación sencilla de campos obligatorios
    if (nombre.isEmpty || email.isEmpty) {
      ScaffoldMessenger.of(context).showSnackBar(
        const SnackBar(
          content: Text('Por favor completa todos los campos del formulario'),
          backgroundColor: Colors.redAccent,
        ),
      );
      return;
    }

    setState(() {
      _mensajeResultado = 'Usuario registrado: $nombre ($email)';
    });

    // 4. Limpieza de los campos tras el envío exitoso
    _nombreController.clear();
    _emailController.clear();
  }

  @override
  Widget build(BuildContext context) {
    return SingleChildScrollView(
      padding: const EdgeInsets.all(24.0),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.stretch,
        children: [
          const Text(
            'Formulario de Registro',
            style: TextStyle(fontSize: 20, fontWeight: FontWeight.bold),
          ),
          const SizedBox(height: 16),
          // Campo Nombre
          TextField(
            controller: _nombreController,
            decoration: const InputDecoration(
              labelText: 'Nombre Completo',
              hintText: 'Ej. Juanita Pérez',
              prefixIcon: Icon(Icons.person),
              border: OutlineInputBorder(),
            ),
          ),
          const SizedBox(height: 16),
          // Campo Correo
          TextField(
            controller: _emailController,
            keyboardType: TextInputType.emailAddress,
            decoration: const InputDecoration(
              labelText: 'Correo Electrónico',
              hintText: 'usuario@icesi.edu.co',
              prefixIcon: Icon(Icons.email),
              border: OutlineInputBorder(),
            ),
          ),
          const SizedBox(height: 24),
          // Botón de Enviar
          FilledButton.icon(
            onPressed: _procesarFormulario,
            icon: const Icon(Icons.check),
            label: const Text('Registrar Usuario'),
          ),
          if (_mensajeResultado.isNotEmpty) ...[
            const SizedBox(height: 24),
            Container(
              padding: const EdgeInsets.all(16),
              decoration: BoxDecoration(
                color: const Color(0xFFF0FDF4),
                borderRadius: BorderRadius.circular(8),
                border: Border.all(color: const Color(0xFF86EFAC)),
              ),
              child: Text(
                _mensajeResultado,
                style: const TextStyle(color: Color(0xFF15803D), fontWeight: FontWeight.w600),
              ),
            ),
          ],
        ],
      ),
    );
  }
}
```

</TabItem>
<TabItem value="inspeccion" label="Puntos Clave del Código">

1. **`late final`:** Se utiliza para indicar al analizador de Dart que la variable no puede ser nula, que se inicializará en `initState()` y que su referencia no cambiará jamás.
2. **`controller.text.trim()`:** La función `.trim()` remueve espacios en blanco innecesarios al inicio o al final introducidos accidentalmente por el usuario.
3. **`controller.clear()`:** Es un atajo equivalente a escribir `controller.text = ''`, dejando el campo visual vacío y listo para una nueva entrada.
4. **`OutlineInputBorder()`:** Componente estándar de Google Material Design 3 que dibuja el recuadro con esquinas redondeadas alrededor del campo de entrada.

</TabItem>
</Tabs>

---

## Cuestionario de Autoevaluación

<Quiz id="seminario-s11-lifecycle-controllers-quiz">
  <Question title="¿En qué método del ciclo de vida de State se debe instanciar un TextEditingController?">
    <Option>En el método build(), cada vez que el widget se redibuja.</Option>
    <Option correct>En el método initState(), exactamente una sola vez al nacer el objeto State.</Option>
    <Option>En el archivo index.html del navegador web.</Option>
    <Option>En el destructor del compilador de Android Studio.</Option>
  </Question>

  <Question title="¿Cuál es la consecuencia directa de olvidar invocar controller.dispose() en el método dispose()?">
    <Option>El teléfono se apaga inmediatamente por sobrecalentamiento.</Option>
    <Option correct>Se produce una fuga de memoria (Memory Leak), pues los listeners y recursos del controlador permanecen acumulados en RAM sin liberarse.</Option>
    <Option>El texto ingresado por el usuario se guarda automáticamente en GitHub.</Option>
    <Option>Flutter prohíbe compilar cualquier archivo que tenga la extensión .dart.</Option>
  </Question>

  <Question title="¿Qué instrucción se debe llamar obligatoriamente al inicio del método initState() y al final de dispose()?">
    <Option>setState() y markNeedsBuild() respectivamente.</Option>
    <Option correct>super.initState() y super.dispose() para preservar la cadena de inicialización y destrucción del framework.</Option>
    <Option>Navigator.pushNamed() y SystemChannels.platform.invokeMethod().</Option>
    <Option>print(&quot;Hola Mundo&quot;) y exit(0).</Option>
  </Question>

  <Question title="¿Cómo se obtiene el texto ingresado por el usuario en un campo conectado a un TextEditingController?">
    <Option>Mediante el método controller.getInputValue()</Option>
    <Option correct>Mediante la propiedad controller.text</Option>
    <Option>Leyendo directamente el archivo de texto en disco local.</Option>
    <Option>Invocando al método dispose() con parámetros de texto.</Option>
  </Question>

  <Question title="Mientras el usuario escribe en un TextField conectado a un controlador (sin ningún setState), ¿qué ocurre con el build() de la página?">
    <Option>Se ejecuta en cada tecla pulsada.</Option>
    <Option correct>No se ejecuta: el campo actualiza controller.text y se repinta por su cuenta; la página solo se reconstruye si algo llama a setState.</Option>
    <Option>Se ejecuta una sola vez al terminar de escribir.</Option>
    <Option>Se ejecuta initState() otra vez para recrear el controlador.</Option>
  </Question>

  <Question title="¿Qué hace el método controller.clear()?">
    <Option>Elimina el widget de la pantalla de forma irreversible.</Option>
    <Option correct>Vacía el contenido del campo de texto, dejándolo en blanco (equivalente a controller.text = '').</Option>
    <Option>Cierra la sesión de usuario activa en la base de datos.</Option>
    <Option>Desinstala la aplicación del emulador.</Option>
  </Question>
</Quiz>
