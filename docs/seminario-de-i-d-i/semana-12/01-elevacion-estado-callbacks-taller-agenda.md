---
sidebar_position: 1
description: "Refactoriza la agenda de contactos con elevación de estado, callbacks desacoplados y modelos inmutables con copyWith."
---

import Tabs from '@theme/Tabs';
import TabItem from '@theme/TabItem';

# Elevación de Estado, Callbacks y Refactorización Modular

En este taller práctico desarrollarás la **Parte 2 (de 2)** de la aplicación de **Agenda de Contactos en Memoria**. 

En la [Semana 11 (Sesión 22)](/docs/seminario-de-i-d-i/semana-11/taller-agenda-contactos-monolitica) resolviste la primera versión funcional concentrando toda la memoria local, los controladores de texto, los métodos de mutación y la presentación visual en un solo archivo monolítico (`agenda_page.dart`). Aunque este enfoque permitió validar la interacción rápidamente, presentó problemas de acoplamiento y falta de modularidad.

En esta sesión realizaremos un proceso de **refactorización arquitectónica** sobre ese mismo código, aplicando los principios del diseño frontend declarativo en Flutter:
1. **Elevación de Estado (*State Lifting*):** El estado reside en la página anfitriona (`AgendaPage`) y los componentes hijos lo reciben por constructor (*props*).
2. **Funciones como Parámetro (*Callbacks*):** Los componentes hijos reportan eventos hacia arriba (`onAgregar`, `onEliminar`) sin conocer al padre ni a la persistencia.
3. **Modelos Inmutables con `copyWith`:** Actualización predecible del estado sin mutaciones destructivas en memoria.
4. **Análisis de *Prop Drilling*:** Comprender hasta qué nivel de profundidad es una técnica saludable y qué señales indican cuándo empieza a generar fricción arquitectónica.

---

## 1. El Diagnóstico del Monolito: ¿Por qué Refactorizar?

En la sesión anterior, el archivo `agenda_page.dart` contenía más de 150 líneas de código acumulando tres responsabilidades disímiles:
* **Custodia del Estado:** Declaración de `List<Contacto> _contactos`, instanciación de `_nombreCtrl` y `_telefonoCtrl`, y ejecución directa de `_contactos.add()` y `_contactos.removeWhere()`.
* **Presentación del Formulario:** Dibujado de tarjetas decoradas, campos `TextField`, validación de texto vacío y despliegue de mensajes `SnackBar`.
* **Presentación del Directorio:** Mapeo de listas (`.map()`), avatares circulares y botones de acción para borrado.

Esta concentración genera tres limitaciones directas:

1. **Violación del Principio de Responsabilidad Única (SRP):** Un cambio en la apariencia visual del botón de agregar obliga a modificar el mismo archivo donde reside la lista y la lógica de borrado.
2. **Imposibilidad de Reutilización:** Si en otra pantalla de la aplicación quisiéramos mostrar únicamente la lista de contactos, no podríamos extraerla sin arrastrar también el formulario y sus controladores.
3. **Dificultad de Mantenimiento:** El método `build()` se vuelve kilométrico y difícil de auditar visualmente.

---

## 2. Elevación de Estado (*State Lifting*)

En Flutter rige el principio de **Flujo Unidireccional de Datos (*Unidirectional Data Flow*)**:

:::info[Regla de Oro del Flujo Unidireccional]
**Los datos descienden (*Data Down*):** Un widget padre le suministra información a sus descendientes pasándola como argumentos en sus constructores.  
**Los eventos ascienden (*Events Up*):** Un widget hijo notifica que algo ocurrió en la interfaz ejecutando una función callback provista por su padre.
:::

Cuando dos widgets hermanos necesitan interactuar (el formulario que crea un contacto y la lista que debe mostrarlo de inmediato), **ninguno de los dos debe tener una referencia directa hacia el otro**. 

Para resolver esta necesidad, **elevamos el estado (*State Lifting*)** a su ancestro común más cercano (`AgendaPage`). Recorre el árbol de componentes de la agenda: primero verás por qué un componente no puede entregarle datos a su hermano y luego cómo la elevación lo resuelve, con los datos bajando y los eventos subiendo (las fases 3 y 4 las retomamos en la sección 5):

<InteractiveFrame
  src="/interactive/seminario-de-i-d-i/semana-12/elevacion-agenda/index.html"
  title="Árbol de componentes de la agenda: elevación de estado, datos hacia abajo y eventos hacia arriba"
  height={780}
/>

En este esquema:
* `AgendaPage` es el `StatefulWidget` que retiene la lista `_contactos` y centraliza las llamadas a `setState()`.
* `ContactoForm` es un componente especializado cuyo único trabajo es capturar texto, validar campos y emitir un objeto `Contacto` listo.
* `ContactoList` es un componente puramente visual (`StatelessWidget`) que recibe la lista y notifica cuando el usuario pulsa eliminar.

---

## 3. Funciones como Parámetro: Callbacks Desacoplados

En Dart, las funciones son **ciudadanos de primer orden (*first-class citizens*)**. Esto significa que una función puede asignarse a una variable, almacenarse en una lista o pasarse como argumento al constructor de una clase.

### Tipos de Callbacks en Flutter

| Tipo de Firma | Declaración en Dart | Cuándo Utilizarlo |
| :--- | :--- | :--- |
| **`VoidCallback`** | `void Function()` | Para eventos que no transmiten datos (ej. refrescar, cancelar, cerrar diálogo). |
| **`ValueChanged<T>`** | `void Function(T value)` | Para eventos que transmiten un único valor primitivo (ej. un `String`, un `int`, un `bool`). |
| **Firma Personalizada** | `void Function(Contacto contacto)` | Para eventos de dominio que emiten entidades completas o modelos específicos. |

### El Hijo Reporta sin Conocer al Padre

Observa cómo el widget hijo define su contrato:

```dart title="lib/components/contacto_form.dart (Firma del Callback)" showLineNumbers
class ContactoForm extends StatefulWidget {
  final void Function(Contacto nuevoContacto) onAgregar;

  const ContactoForm({
    super.key,
    required this.onAgregar,
  });
  
  // ...
}
```

Cuando el usuario presiona el botón, el formulario simplemente ejecuta:

```dart title="Formulario hijo con callback" showLineNumbers
// El hijo no sabe si el padre guarda en SQLite, en memoria o en Supabase:
// Solo cumple con su contrato de avisar que hay un nuevo contacto listo.
widget.onAgregar(nuevo);
```

---

## 4. Modelos Inmutables y el Método `copyWith`

En un `StatefulWidget`, `setState()` siempre marca el `Element` como `dirty`, sin importar si cambiaste la lista o creaste otra nueva. Aun así, **mutar objetos compartidos en memoria es una fuente frecuente de errores**, y por eso los modelos se diseñan inmutables:

* **Predecibilidad:** si un `Contacto` nunca cambia después de creado, ninguno de los componentes que lo recibe por constructor puede alterarlo sin que su dueño lo sepa. Todos los cambios pasan por un único lugar: `AgendaPage`.
* **Detección de cambios:** cuando un hijo recibe un objeto por constructor, compararlo (en `didUpdateWidget`, o en las herramientas de gestión de estado como Provider, Riverpod o BLoC que verás más adelante) se reduce a preguntar si **es otra referencia**. Si mutas el objeto original en vez de crear uno nuevo, esa comparación ya no detecta el cambio.
* **Menos errores sutiles:** compartir un mismo objeto mutable entre dos pantallas permite que una lo modifique "por debajo" de la otra.

Para trabajar con modelos inmutables aplicamos el patrón de **Inmutabilidad con `copyWith`**:

```dart title="lib/models/contacto.dart" showLineNumbers
class Contacto {
  final String id;
  final String nombre;
  final String telefono;

  const Contacto({
    required this.id,
    required this.nombre,
    required this.telefono,
  });

  Contacto copyWith({
    String? id,
    String? nombre,
    String? telefono,
  }) {
    return Contacto(
      id: id ?? this.id,
      nombre: nombre ?? this.nombre,
      telefono: telefono ?? this.telefono,
    );
  }
}
```

### ¿Por qué `copyWith` es Tan Valioso?

Si en una versión posterior permites al usuario editar el número telefónico de un contacto existente, en lugar de hacer una mutación destructiva (`contacto.telefono = '300...'`), creas un nuevo objeto clonado de manera inmutable:

```dart title="Uso de copyWith" showLineNumbers
final contactoActualizado = contactoOriginal.copyWith(
  telefono: '310 999 0011',
);
```

Y en la lista de la página, reemplazas el elemento produciendo una nueva colección:

```dart title="Actualizar la lista" showLineNumbers
// Nota: para reasignar la lista, _contactos se declara sin final (List<Contacto> _contactos = [...])
setState(() {
  _contactos = _contactos.map((c) {
    return c.id == idObjetivo ? c.copyWith(telefono: nuevoTelefono) : c;
  }).toList();
});
```

---

## 5. Prop Drilling: Qué es, Hasta Dónde es Aceptable y Cuándo Duele

:::note[Definición de Prop Drilling]
El **Prop Drilling** (perforación de propiedades) ocurre cuando pasamos datos o callbacks a través de múltiples niveles intermedios de widgets que **no los necesitan para sí mismos**, sino únicamente para reenviárselos a un widget descendiente más profundo.
:::

En el árbol de la agenda se ve la diferencia. Con `AgendaPage` → `ContactoList` → `ContactoCard` cada nivel usa lo que recibe. Pero si el equipo agrega un resumen con el total de contactos tres niveles más abajo (`PanelResumen` → `BarraResumen` → `ContadorChip`), el dato tiene que atravesar dos widgets que no lo usan. Avanza por las fases **Prop drilling** y **La salida**:

<iframe
  src="/interactive/seminario-de-i-d-i/semana-12/elevacion-agenda/index.html#fase=3"
  title="Prop drilling en el árbol de la agenda: widgets pasamanos y la salida con gestión de estado"
  style={{ width: '100%', height: 780, border: 0 }}
  loading="lazy"
/>

<Tabs>
  <TabItem value="saludable" label="Zona Saludable (1 a 2 niveles)" default>

En este escenario de 1 a 2 niveles (`AgendaPage` $\rightarrow$ `ContactoList`):
* **Cada nivel consume lo que recibe:** La lista necesita los contactos para hacer `.map()` y dibujarlos en pantalla.
* **Trazabilidad directa:** Cualquier desarrollador puede hacer *Ctrl + Clic* en el constructor y saber con certeza de dónde proviene cada dato.
* **Cero dependencias:** No requiere librerías externas ni configuración de contextos globales.

```dart title="lib/components/contacto_list.dart" showLineNumbers
class ContactoList extends StatelessWidget {
  final List<Contacto> contactos;
  final void Function(String id) onEliminar;

  const ContactoList({
    super.key,
    required this.contactos,
    required this.onEliminar,
  });

  @override
  Widget build(BuildContext context) {
    // ContactoList CONSUME directamente la propiedad contactos
    return Column(
      children: contactos.map((c) {
        return Card(
          child: ListTile(
            title: Text(c.nombre),
            subtitle: Text(c.telefono),
            trailing: IconButton(
              icon: const Icon(Icons.delete),
              onPressed: () => onEliminar(c.id),
            ),
          ),
        );
      }).toList(),
    );
  }
}
```

  </TabItem>
  <TabItem value="critica" label="Zona Crítica (Prop Drilling Doloroso)">

En este escenario de 3 o más niveles con widgets pasamanos:
* **Widgets pasamanos (*Pass-Through*):** Componentes intermedios como `DashboardShell` o `SectionTabBody` no usan `userRole` en su propio `build()`, pero están obligados a declararlo en su constructor solo para pasárselo al siguiente hijo.
* **Refactorizaciones frágiles:** Si el tipo de `userRole` cambia, debes editar 3 o 4 archivos intermedios que no tienen relación de negocio con ese dato.

```dart title="Anti-Patrón: Widget Pasamanos Intermediario" showLineNumbers
class DashboardShell extends StatelessWidget {
  // Widget pasamanos: recibe propiedades que NUNCA usa en su propio build
  final String userRole;
  final VoidCallback onLogout;

  const DashboardShell({
    super.key,
    required this.userRole,
    required this.onLogout,
  });

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      body: SectionTabBody(
        userRole: userRole, // Reenvío obligatorio sin beneficio local
        onLogout: onLogout,
      ),
    );
  }
}
```

:::warning[Señal de Alerta Arquitectónica]
Cuando encuentres constructores inflados con propiedades que el widget no utiliza en su propio `build()`, es el momento exacto para migrar a herramientas de **Gestión de Estado Global / Inyección de Dependencias** como `Riverpod`, `Provider` o `BLoC`.
:::

  </TabItem>
</Tabs>

---

## 6. Taller Práctico: Refactorización Paso a Paso

A continuación tomamos **literalmente el mismo código del taller anterior** y lo descomponemos en módulos independientes:

```
lib/
├── models/
│   └── contacto.dart
├── components/
│   ├── contacto_form.dart
│   └── contacto_list.dart
├── pages/
│   └── agenda_page.dart
├── screens/
│   └── main_screen.dart
└── main.dart
```

<StepByStep>
  <Step number="1" title="Actualizar el Modelo con copyWith">
    Conservamos la clase `Contacto` con sus campos `final`, eliminamos funciones auxiliares innecesarias y agregamos el método `copyWith`:

    ```dart title="lib/models/contacto.dart" showLineNumbers
    class Contacto {
      final String id;
      final String nombre;
      final String telefono;

      const Contacto({
        required this.id,
        required this.nombre,
        required this.telefono,
      });

      Contacto copyWith({
        String? id,
        String? nombre,
        String? telefono,
      }) {
        return Contacto(
          id: id ?? this.id,
          nombre: nombre ?? this.nombre,
          telefono: telefono ?? this.telefono,
        );
      }
    }
    ```
  </Step>

  <Step number="2" title="Extraer el Formulario en ContactoForm">
    Movemos el formulario a su propio archivo. Mantiene sus controladores de texto como **estado efímero local de la UI**, realiza la validación y notifica al padre ejecutando `widget.onAgregar`:

    ```dart title="lib/components/contacto_form.dart" showLineNumbers
    import 'package:flutter/material.dart';
    import '../models/contacto.dart';

    class ContactoForm extends StatefulWidget {
      final void Function(Contacto nuevoContacto) onAgregar;

      const ContactoForm({
        super.key,
        required this.onAgregar,
      });

      @override
      State<ContactoForm> createState() => _ContactoFormState();
    }

    class _ContactoFormState extends State<ContactoForm> {
      late final TextEditingController _nombreCtrl;
      late final TextEditingController _telefonoCtrl;

      @override
      void initState() {
        super.initState();
        _nombreCtrl = TextEditingController();
        _telefonoCtrl = TextEditingController();
      }

      @override
      void dispose() {
        _nombreCtrl.dispose();
        _telefonoCtrl.dispose();
        super.dispose();
      }

      void _enviarFormulario() {
        final nombre = _nombreCtrl.text.trim();
        final telefono = _telefonoCtrl.text.trim();

        if (nombre.isEmpty || telefono.isEmpty) {
          ScaffoldMessenger.of(context).showSnackBar(
            const SnackBar(
              content: Text('Ingresa tanto el nombre como el teléfono.'),
              backgroundColor: Colors.orange,
            ),
          );
          return;
        }

        final nuevoContacto = Contacto(
          id: DateTime.now().millisecondsSinceEpoch.toString(),
          nombre: nombre,
          telefono: telefono,
        );

        widget.onAgregar(nuevoContacto);

        _nombreCtrl.clear();
        _telefonoCtrl.clear();
        FocusScope.of(context).unfocus();
      }

      @override
      Widget build(BuildContext context) {
        return Card(
          elevation: 0,
          color: const Color(0xFFF5F3FF),
          shape: RoundedRectangleBorder(
            borderRadius: BorderRadius.circular(12),
            side: const BorderSide(color: Color(0xFFDDD6FE)),
          ),
          child: Padding(
            padding: const EdgeInsets.all(16.0),
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.stretch,
              children: [
                const Text(
                  'Registrar Nuevo Contacto',
                  style: TextStyle(
                    fontSize: 16,
                    fontWeight: FontWeight.bold,
                    color: Color(0xFF6B21A8),
                  ),
                ),
                const SizedBox(height: 12),
                TextField(
                  controller: _nombreCtrl,
                  decoration: const InputDecoration(
                    labelText: 'Nombre',
                    prefixIcon: Icon(Icons.person_outline),
                    filled: true,
                    fillColor: Colors.white,
                    border: OutlineInputBorder(),
                  ),
                ),
                const SizedBox(height: 12),
                TextField(
                  controller: _telefonoCtrl,
                  keyboardType: TextInputType.phone,
                  decoration: const InputDecoration(
                    labelText: 'Teléfono',
                    prefixIcon: Icon(Icons.phone_outlined),
                    filled: true,
                    fillColor: Colors.white,
                    border: OutlineInputBorder(),
                  ),
                ),
                const SizedBox(height: 16),
                FilledButton.icon(
                  onPressed: _enviarFormulario,
                  icon: const Icon(Icons.person_add),
                  label: const Text('Agregar Contacto'),
                  style: FilledButton.styleFrom(
                    backgroundColor: const Color(0xFF6750A4),
                  ),
                ),
              ],
            ),
          ),
        );
      }
    }
    ```
  </Step>

  <Step number="3" title="Extraer la Lista en ContactoList">
    Extraemos la lista de contactos como un `StatelessWidget`. Recibe la lista por parámetro, maneja la vista vacía y dibuja cada tarjeta con su botón de borrado:

    ```dart title="lib/components/contacto_list.dart" showLineNumbers
    import 'package:flutter/material.dart';
    import '../models/contacto.dart';

    class ContactoList extends StatelessWidget {
      final List<Contacto> contactos;
      final void Function(String id) onEliminar;

      const ContactoList({
        super.key,
        required this.contactos,
        required this.onEliminar,
      });

      @override
      Widget build(BuildContext context) {
        return Column(
          crossAxisAlignment: CrossAxisAlignment.stretch,
          children: [
            Row(
              mainAxisAlignment: MainAxisAlignment.spaceBetween,
              children: [
                const Text(
                  'Directorio Activo',
                  style: TextStyle(fontSize: 16, fontWeight: FontWeight.bold),
                ),
                Chip(
                  label: Text('${contactos.length} contactos'),
                  backgroundColor: const Color(0xFFE2E8F0),
                ),
              ],
            ),
            const SizedBox(height: 12),
            if (contactos.isEmpty)
              const Center(
                child: Padding(
                  padding: EdgeInsets.all(32.0),
                  child: Text(
                    'No hay contactos registrados en la agenda.',
                    style: TextStyle(color: Colors.grey),
                  ),
                ),
              )
            else
              ...contactos.map((contacto) {
                return Card(
                  margin: const EdgeInsets.only(bottom: 8.0),
                  elevation: 1,
                  shape: RoundedRectangleBorder(
                    borderRadius: BorderRadius.circular(10),
                  ),
                  child: ListTile(
                    leading: CircleAvatar(
                      backgroundColor: const Color(0xFFE0E7FF),
                      child: Text(
                        contacto.nombre.isNotEmpty ? contacto.nombre[0].toUpperCase() : '?',
                        style: const TextStyle(
                          color: Color(0xFF4338CA),
                          fontWeight: FontWeight.bold,
                        ),
                      ),
                    ),
                    title: Text(
                      contacto.nombre,
                      style: const TextStyle(fontWeight: FontWeight.w600),
                    ),
                    subtitle: Text(contacto.telefono),
                    trailing: IconButton(
                      icon: const Icon(Icons.delete_outline, color: Colors.redAccent),
                      tooltip: 'Eliminar contacto',
                      onPressed: () => onEliminar(contacto.id),
                    ),
                  ),
                );
              }),
          ],
        );
      }
    }
    ```
  </Step>

  <Step number="4" title="Simplificar AgendaPage como Anfitriona del Estado">
    `AgendaPage` conserva la lista de contactos en memoria (`_contactos`) y los métodos de mutación (`_agregarContacto`, `_eliminarContacto`). Su método `build()` ahora simplemente coordina los dos componentes hijos:

    ```dart title="lib/pages/agenda_page.dart" showLineNumbers
    import 'package:flutter/material.dart';
    import '../models/contacto.dart';
    import '../components/contacto_form.dart';
    import '../components/contacto_list.dart';

    class AgendaPage extends StatefulWidget {
      const AgendaPage({super.key});

      @override
      State<AgendaPage> createState() => _AgendaPageState();
    }

    class _AgendaPageState extends State<AgendaPage> {
      // 1. Estado en memoria de la agenda
      final List<Contacto> _contactos = [
        const Contacto(
          id: '1',
          nombre: 'María Camila Gómez',
          telefono: '312 456 7890',
        ),
        const Contacto(
          id: '2',
          nombre: 'Alejandro Soto',
          telefono: '300 123 9988',
        ),
        const Contacto(
          id: '3',
          nombre: 'Daniela Valderrama',
          telefono: '315 789 1122',
        ),
      ];

      // 2. Método para agregar contacto (ejecutado por callback de ContactoForm)
      void _agregarContacto(Contacto nuevo) {
        setState(() {
          _contactos.add(nuevo);
        });

        ScaffoldMessenger.of(context).showSnackBar(
          SnackBar(
            content: Text('Contacto "${nuevo.nombre}" agregado con éxito.'),
            backgroundColor: const Color(0xFF10B981),
          ),
        );
      }

      // 3. Método para eliminar contacto (ejecutado por callback de ContactoList)
      void _eliminarContacto(String id) {
        setState(() {
          _contactos.removeWhere((c) => c.id == id);
        });

        ScaffoldMessenger.of(context).showSnackBar(
          const SnackBar(
            content: Text('Contacto eliminado de la lista.'),
            duration: Duration(seconds: 2),
          ),
        );
      }

      @override
      Widget build(BuildContext context) {
        return SingleChildScrollView(
          padding: const EdgeInsets.all(16.0),
          child: Column(
            crossAxisAlignment: CrossAxisAlignment.stretch,
            children: [
              // Componente Formulario (reporta hacia arriba con callback)
              ContactoForm(onAgregar: _agregarContacto),

              const SizedBox(height: 24),

              // Componente Lista (recibe contactos por prop y callback de borrado)
              ContactoList(
                contactos: _contactos,
                onEliminar: _eliminarContacto,
              ),
            ],
          ),
        );
      }
    }
    ```
  </Step>

  <Step number="5" title="Definir MainScreen con Scaffold">
    Siguiendo la convención arquitectónica **Screen vs. Page**, `MainScreen` hospeda el `Scaffold` y la barra de navegación superior:

    ```dart title="lib/screens/main_screen.dart" showLineNumbers
    import 'package:flutter/material.dart';
    import '../pages/agenda_page.dart';

    class MainScreen extends StatelessWidget {
      const MainScreen({super.key});

      @override
      Widget build(BuildContext context) {
        return Scaffold(
          appBar: AppBar(
            title: const Text('Agenda de Contactos'),
            centerTitle: true,
            elevation: 2,
          ),
          body: const AgendaPage(),
        );
      }
    }
    ```
  </Step>

  <Step number="6" title="Punto de Entrada en main.dart">
    `main.dart` inicia la aplicación montando directamente `MainScreen`:

    ```dart title="lib/main.dart" showLineNumbers
    import 'package:flutter/material.dart';
    import 'screens/main_screen.dart';

    void main() {
      runApp(const AgendaApp());
    }

    class AgendaApp extends StatelessWidget {
      const AgendaApp({super.key});

      @override
      Widget build(BuildContext context) {
        return MaterialApp(
          title: 'Agenda de Contactos',
          debugShowCheckedModeBanner: false,
          theme: ThemeData(
            colorScheme: ColorScheme.fromSeed(seedColor: const Color(0xFF6750A4)),
            useMaterial3: true,
          ),
          home: const MainScreen(),
        );
      }
    }
    ```
  </Step>
</StepByStep>

---

## 7. Comparativa de Arquitectura: Antes vs. Después

| Criterio Técnico | Versión Monolítica (Semana 11) | Versión Refactorizada (Semana 12) |
| :--- | :--- | :--- |
| **Ubicación del Estado** | Cautivo y revuelto dentro de `agenda_page.dart`. | Elevado y custodiado en `AgendaPage`. |
| **Responsabilidad del Formulario** | Mezclada con el dibujado de listas y mutación directa. | Componente autónomo `ContactoForm` enfocado solo en captura. |
| **Responsabilidad de la Lista** | Código disperso dentro del mismo `build()`. | Componente modular `ContactoList` que solo dibuja. |
| **Comunicación entre Componentes** | Inexistente (todo accede a variables privadas `_`). | Contratos explícitos mediante constructores y callbacks tipados. |
| **Reutilización de Código** | 0% (imposible usar la lista o el formulario aislados). | Alta (puedes instanciar `ContactoForm` o `ContactoList` donde sea). |
| **Mantenibilidad** | Difícil (un solo archivo con múltiples responsabilidades). | Excelente (módulos pequeños de menos de 70 líneas cada uno). |

---

## Cuestionario de Autoevaluación

<Quiz id="s12-elevacion-estado-callbacks-quiz">
  <Question title="¿Cuál es la razón técnica primordial para aplicar 'Elevación de Estado' (State Lifting) en Flutter?">
    <Option>Permitir que un widget hijo acceda directamente a las variables privadas de su widget hermano sin pasar por el padre.</Option>
    <Option correct>Mover el estado al ancestro común más cercano para que dos o más widgets puedan compartirlo y coordinar cambios de forma predecible.</Option>
    <Option>Evitar el uso de StatefulWidget en toda la aplicación convirtiendo todos los widgets en Stateless.</Option>
    <Option>Acelerar el tiempo de compilación del framework eliminando la necesidad de constructores con parámetros.</Option>
  </Question>

  <Question title="En el patrón de flujo unidireccional de datos, ¿cómo se comunican los widgets hijos con su widget padre?">
    <Option>Llamando directamente al método setState() del widget padre mediante una referencia estática global.</Option>
    <Option>Invocando al ElementTree mediante context.findAncestorStateOfType para forzar la mutación.</Option>
    <Option correct>Ejecutando una función callback recibida por constructor cuando ocurre un evento de interacción.</Option>
    <Option>Escribiendo el nuevo valor directamente en el archivo de almacenamiento local antes de redibujar.</Option>
  </Question>

  <Question title="¿Cuál es la utilidad del método copyWith en un modelo inmutable como Contacto?">
    <Option>Copiar la referencia en memoria del objeto original para permitir mutaciones destructivas en sus campos final.</Option>
    <Option correct>Crear una nueva instancia independiente con valores actualizados en ciertos campos, preservando los originales en los demás.</Option>
    <Option>Serializar automáticamente la clase Contacto a un mapa JSON sin necesidad de paquetes externos.</Option>
    <Option>Destruir el objeto anterior de la memoria RAM para evitar fugas de memoria al usar controladores.</Option>
  </Question>

  <Question title="Respecto al fenómeno de Prop Drilling, ¿cuál de las siguientes afirmaciones es correcta?">
    <Option>Siempre es un error arquitectónico grave y debe evitarse incluso en jerarquías de 1 o 2 niveles.</Option>
    <Option>Es obligatorio que todos los componentes intermediarios usen los datos en su método build() antes de reenviarlos.</Option>
    <Option correct>Es una práctica limpia y saludable en 1 o 2 niveles; se vuelve problemática cuando widgets pasamanos solo reenvían datos sin utilizarlos.</Option>
    <Option>Solo se presenta en aplicaciones que utilizan State Management avanzado como Riverpod o BLoC.</Option>
  </Question>
</Quiz>
