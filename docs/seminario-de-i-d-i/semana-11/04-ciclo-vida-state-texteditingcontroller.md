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

A diferencia de un `StatelessWidget` (que solo posee el método `build`), la clase `State<T>` atraviesa varias etapas bien delimitadas durante su existencia en el *Element Tree*:

![Ciclo de Vida de State y Gestión de TextEditingController](/img/seminario-de-i-d-i/ciclo-vida-stateful-controller.svg)

### Las 5 Etapas Esenciales

1. **`createState()`:** Invocado automáticamente por el framework para vincular el widget inmutable con su nueva instancia de estado.
2. **`initState()` (Inicialización Única):**
   * Es el **primer método** que se ejecuta tras la creación del objeto `State`.
   * Se ejecuta **exactamente una sola vez** en toda la vida del widget.
   * Es el lugar obligatorio para instanciar controladores (`TextEditingController`), suscribirse a flujos de datos (*Streams*) o iniciar temporizadores.
   * **Regla estricta:** Siempre debe iniciar llamando a `super.initState()`.
3. **`didChangeDependencies()`:** Se ejecuta inmediatamente después de `initState()` y cada vez que cambia un objeto heredado del contexto (como el tema de color o la orientación de la pantalla).
4. **`build()` (Fase Activa):** Devuelve la estructura de widgets a renderizar. Se ejecuta al inicio y se repite cada vez que se llama a `setState()`.
5. **`dispose()` (Destrucción y Limpieza Terminal):**
   * Se ejecuta cuando el objeto `State` se retira permanentemente del árbol (por ejemplo, cuando el usuario cierra la pantalla o navega hacia atrás con `Navigator.pop`).
   * Es el lugar donde **debes liberar y destruir obligatoriamente** todos los recursos pesados que abriste en `initState()`.
   * **Regla estricta:** Siempre debe finalizar llamando a `super.dispose()`.

---

## 2. ¿Qué es un `TextEditingController`?

El widget `TextField` permite a los usuarios ingresar texto desde el teclado del dispositivo. Para poder leer lo que el usuario escribió, modificar el texto mediante programación o vaciar el campo tras enviar un formulario, Flutter utiliza un **`TextEditingController`**.

Un controlador actúa como un puente bidireccional:
* **Lectura:** Permite consultar el texto actual mediante la propiedad `controller.text`.
* **Escritura:** Permite cambiar el texto mediante `controller.text = 'Nuevo valor'` o `controller.clear()`.
* **Escucha reactiva:** Puede emitir eventos cada vez que el usuario presiona una tecla mediante `controller.addListener(...)`.

---

## 3. El Peligro Crítico de Fugas de Memoria (*Memory Leaks*)

Un `TextEditingController` se comunica con los servicios nativos de entrada de texto del sistema operativo (Android o iOS) y retiene punteros a listeners en la memoria RAM.

:::danger[La Regla Inquebrantable de dispose()]
Si creas un `TextEditingController` en tu pantalla y no lo destruyes llamando a `.dispose()` dentro del método `dispose()` de tu clase `State`, el recolector de basura (*Garbage Collector*) de Dart **no podrá liberar esa memoria**.

Si el usuario abre y cierra la pantalla 20 veces al día, habrá 20 controladores huérfanos acumulándose en la memoria RAM del teléfono, provocando ralentizaciones, consumo excesivo de batería y, finalmente, el cierre forzado de la aplicación (*App Crash* por falta de memoria).
:::

---

## 4. Implementación Completa: Formulario con Validación y Limpieza

A continuación se presenta un ejemplo completo que muestra la inicialización en `initState()`, el uso dentro del formulario y la liberación obligatoria en `dispose()`:

<Tabs>
<TabItem value="codigo" label="Formulario Reactivo" default>

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

  <Question title="¿Qué hace el método controller.clear()?">
    <Option>Elimina el widget de la pantalla de forma irreversible.</Option>
    <Option correct>Vacía el contenido del campo de texto, dejándolo en blanco (equivalente a controller.text = '').</Option>
    <Option>Cierra la sesión de usuario activa en la base de datos.</Option>
    <Option>Desinstala la aplicación del emulador.</Option>
  </Question>
</Quiz>
