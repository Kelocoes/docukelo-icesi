---
sidebar_position: 5
description: "Construye paso a paso una agenda de contactos monolítica en Flutter y reflexiona sobre las limitaciones de esa arquitectura."
---

import Tabs from '@theme/Tabs';
import TabItem from '@theme/TabItem';

# Taller: Agenda de Contactos Monolítica

En este taller práctico desarrollarás la **Parte 1 (de 2)** de la aplicación de **Agenda de Contactos en Memoria**. 

El objetivo de esta sesión es resolver una aplicación completamente interactiva donde **todo el estado, la lista de datos y la interfaz visual residen en una sola pantalla monolítica** con `StatefulWidget`. En la Semana 12 (Sesión 23), tomaremos este mismo código para transformarlo mediante **Elevación de Estado (*State Lifting*)** y comunicación desacoplada por *callbacks*.

![Arquitectura Monolítica de la Agenda de Contactos en Memoria](/img/seminario-de-i-d-i/taller-agenda-contactos-flujo.svg)

---

## 1. Requerimientos de la Aplicación

Tu solución debe cumplir con las siguientes especificaciones técnicas:

1. **Modelo Inmutable `Contacto`:** Crear una clase en Dart con identificador único (`id`), `nombre` y `telefono`.
2. **Lista Inicial de Datos Simulados (*Mock Data*):** Cargar una lista en memoria con al menos 3 contactos iniciales.
3. **Mapeo Declarativo (`.map()`):** Transformar cada elemento de la lista de contactos en un widget visual (`ListTile` o tarjeta personalizada con avatar).
4. **Formulario Reactivo:** Capturar nombre y teléfono mediante `TextEditingController`.
5. **Operaciones Reactivas con `setState()`:**
   * **Agregar:** Validar que los campos no estén vacíos, agregar el nuevo contacto a la lista en memoria, limpiar los controladores y refrescar la pantalla.
   * **Eliminar:** Remover el contacto seleccionado mediante su `id` y redibujar la lista al instante.
6. **Destrucción Segura:** Liberar todos los controladores en el método `dispose()`.

---

## 2. Paso a Paso de Implementación

<StepByStep>
  <Step number="1" title="Definir el Modelo de Datos Inmutable">
    Crea la clase `Contacto`. Como buena práctica en Flutter, declaramos todos sus campos como `final` para garantizar inmutabilidad:

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

      // Método auxiliar para generar las iniciales del avatar
      String get iniciales {
        final partes = nombre.trim().split(' ');
        if (partes.length >= 2) {
          return '${partes[0][0]}${partes[1][0]}'.toUpperCase();
        }
        return partes.isNotEmpty && partes[0].isNotEmpty 
            ? partes[0][0].toUpperCase() 
            : '?';
      }
    }
    ```
  </Step>

  <Step number="2" title="Construir la Screen Anfitriona con Scaffold">
    Siguiendo la convención arquitectónica **Screen vs. Page**, creamos la `Screen` responsable de hospedar el `Scaffold`:

    ```dart title="lib/screens/agenda_screen.dart" showLineNumbers
    import 'package:flutter/material.dart';
    import '../pages/agenda_page.dart';

    class AgendaScreen extends StatelessWidget {
      const AgendaScreen({super.key});

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

  <Step number="3" title="Implementar la AgendaPage con Todo el Estado Adentro">
    En este archivo concentramos toda la memoria local: la lista de contactos, los controladores de texto, los métodos de mutación y la presentación visual:

    ```dart title="lib/pages/agenda_page.dart" showLineNumbers
    import 'package:flutter/material.dart';
    import '../models/contacto.dart';

    class AgendaPage extends StatefulWidget {
      const AgendaPage({super.key});

      @override
      State<AgendaPage> createState() => _AgendaPageState();
    }

    class _AgendaPageState extends State<AgendaPage> {
      // 1. Controladores de texto para el formulario
      late final TextEditingController _nombreCtrl;
      late final TextEditingController _telefonoCtrl;

      // 2. Estado local: Lista de contactos en memoria (Mock inicial)
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

      @override
      void initState() {
        super.initState();
        _nombreCtrl = TextEditingController();
        _telefonoCtrl = TextEditingController();
      }

      @override
      void dispose() {
        // Limpieza obligatoria para evitar memory leaks
        _nombreCtrl.dispose();
        _telefonoCtrl.dispose();
        super.dispose();
      }

      // 3. Método para agregar contacto
      void _agregarContacto() {
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

        final nuevo = Contacto(
          id: DateTime.now().millisecondsSinceEpoch.toString(),
          nombre: nombre,
          telefono: telefono,
        );

        setState(() {
          _contactos.add(nuevo);
        });

        // Limpiar formulario y ocultar teclado
        _nombreCtrl.clear();
        _telefonoCtrl.clear();
        FocusScope.of(context).unfocus();

        ScaffoldMessenger.of(context).showSnackBar(
          SnackBar(
            content: Text('Contacto &quot;$nombre&quot; agregado con éxito.'),
            backgroundColor: const Color(0xFF10B981),
          ),
        );
      }

      // 4. Método para eliminar contacto
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
              // SECCIÓN A: FORMULARIO SUPERIOR
              Card(
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
                        onPressed: _agregarContacto,
                        icon: const Icon(Icons.person_add),
                        label: const Text('Agregar Contacto'),
                        style: FilledButton.styleFrom(
                          backgroundColor: const Color(0xFF6750A4),
                        ),
                      ),
                    ],
                  ),
                ),
              ),

              const SizedBox(height: 24),

              // SECCIÓN B: LISTA DE CONTACTOS RENDERIZADA CON .map()
              Row(
                mainAxisAlignment: MainAxisAlignment.spaceBetween,
                children: [
                  const Text(
                    'Directorio Activo',
                    style: TextStyle(fontSize: 16, fontWeight: FontWeight.bold),
                  ),
                  Chip(
                    label: Text('${_contactos.length} contactos'),
                    backgroundColor: const Color(0xFFE2E8F0),
                  ),
                ],
              ),
              const SizedBox(height: 12),

              if (_contactos.isEmpty)
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
                // Mapeo declarativo de cada objeto Contacto a un ListTile
                ..._contactos.map((contacto) {
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
                          contacto.iniciales,
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
                        onPressed: () => _eliminarContacto(contacto.id),
                      ),
                    ),
                  );
                }),
            ],
          ),
        );
      }
    }
    ```
  </Step>
</StepByStep>

---

## 3. Reflexión de Arquitectura

Tómate un momento para inspeccionar el archivo `agenda_page.dart` que acabas de construir:
* La clase `_AgendaPageState` supera las 150 líneas de código.
* Tiene tres responsabilidades mezcladas al mismo tiempo:
  1. Gestionar el estado en memoria (`_contactos`, `_nombreCtrl`, `_telefonoCtrl`).
  2. Dibujar y validar el formulario visual de captura.
  3. Dibujar las tarjetas individuales de la lista y sus avatares.

¿Qué sucedería si ahora quisiéramos reutilizar el formulario en otra pantalla o cambiar la lista por una cuadrícula de dos columnas? **No podemos**, porque todo está rígidamente acoplado dentro de un solo archivo monolítico.

