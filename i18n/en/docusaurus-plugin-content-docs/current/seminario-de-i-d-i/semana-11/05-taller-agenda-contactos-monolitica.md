---
sidebar_position: 5
---

import Tabs from '@theme/Tabs';
import TabItem from '@theme/TabItem';

# Workshop: Monolithic Contact Book

In this practical workshop, you will develop **Part 1 (of 2)** of the **In-Memory Contact Book** application.

The goal of this session is to build a fully interactive application where **all state, data collection, and visual interface reside inside a single monolithic screen** with `StatefulWidget`. In Week 12 (Session 23), we will take this exact codebase and refactor it using **State Lifting** and decoupled communication via callbacks.

![Monolithic Architecture of the In-Memory Contact Book](/img/seminario-de-i-d-i/taller-agenda-contactos-flujo.svg)

---

## 1. Application Requirements

Your solution must meet the following technical specifications:

1. **Immutable `Contacto` Model:** Create a Dart class with unique identifier (`id`), `nombre`, and `telefono`.
2. **Initial Mock Data List:** Load an in-memory list with at least 3 initial contacts.
3. **Declarative Mapping (`.map()`):** Transform each contact element in the list into a visual widget (`ListTile` or custom card with avatar).
4. **Reactive Form:** Capture name and phone number using `TextEditingController`.
5. **Reactive Operations with `setState()`:**
   * **Add:** Validate that fields are not empty, append the new contact to the in-memory list, clear the controllers, and refresh the screen.
   * **Delete:** Remove the selected contact by its `id` and immediately redraw the list.
6. **Safe Disposal:** Dispose of all controllers in the `dispose()` method.

---

## 2. Step-by-Step Implementation

<StepByStep>
  <Step number="1" title="Define the Immutable Data Model">
    Create the `Contacto` class. As a best practice in Flutter, we declare all fields as `final` to ensure immutability:

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

      // Helper method to generate avatar initials
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

  <Step number="2" title="Build the Host Screen with Scaffold">
    Following the **Screen vs. Page** architectural convention, we create the `Screen` responsible for hosting the `Scaffold`:

    ```dart title="lib/screens/agenda_screen.dart" showLineNumbers
    import 'package:flutter/material.dart';
    import '../pages/agenda_page.dart';

    class AgendaScreen extends StatelessWidget {
      const AgendaScreen({super.key});

      @override
      Widget build(BuildContext context) {
        return Scaffold(
          appBar: AppBar(
            title: const Text('Contact Book'),
            centerTitle: true,
            elevation: 2,
          ),
          body: const AgendaPage(),
        );
      }
    }
    ```
  </Step>

  <Step number="3" title="Implement AgendaPage with All State Encapsulated">
    In this file, we concentrate all local memory: the list of contacts, text controllers, mutation methods, and visual layout:

    ```dart title="lib/pages/agenda_page.dart" showLineNumbers
    import 'package:flutter/material.dart';
    import '../models/contacto.dart';

    class AgendaPage extends StatefulWidget {
      const AgendaPage({super.key});

      @override
      State<AgendaPage> createState() => _AgendaPageState();
    }

    class _AgendaPageState extends State<AgendaPage> {
      // 1. Text controllers for the form
      late final TextEditingController _nombreCtrl;
      late final TextEditingController _telefonoCtrl;

      // 2. Local state: In-memory contact list (Initial mock data)
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
        // Mandatory cleanup to prevent memory leaks
        _nombreCtrl.dispose();
        _telefonoCtrl.dispose();
        super.dispose();
      }

      // 3. Method to add a contact
      void _agregarContacto() {
        final nombre = _nombreCtrl.text.trim();
        final telefono = _telefonoCtrl.text.trim();

        if (nombre.isEmpty || telefono.isEmpty) {
          ScaffoldMessenger.of(context).showSnackBar(
            const SnackBar(
              content: Text('Please enter both name and phone number.'),
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

        // Clear form and dismiss keyboard
        _nombreCtrl.clear();
        _telefonoCtrl.clear();
        FocusScope.of(context).unfocus();

        ScaffoldMessenger.of(context).showSnackBar(
          SnackBar(
            content: Text('Contact &quot;$nombre&quot; successfully added.'),
            backgroundColor: const Color(0xFF10B981),
          ),
        );
      }

      // 4. Method to delete a contact
      void _eliminarContacto(String id) {
        setState(() {
          _contactos.removeWhere((c) => c.id == id);
        });

        ScaffoldMessenger.of(context).showSnackBar(
          const SnackBar(
            content: Text('Contact removed from list.'),
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
              // SECTION A: TOP FORM
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
                        'Register New Contact',
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
                          labelText: 'Name',
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
                          labelText: 'Phone',
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
                        label: const Text('Add Contact'),
                        style: FilledButton.styleFrom(
                          backgroundColor: const Color(0xFF6750A4),
                        ),
                      ),
                    ],
                  ),
                ),
              ),

              const SizedBox(height: 24),

              // SECTION B: CONTACT LIST RENDERED WITH .map()
              Row(
                mainAxisAlignment: MainAxisAlignment.spaceBetween,
                children: [
                  const Text(
                    'Active Directory',
                    style: TextStyle(fontSize: 16, fontWeight: FontWeight.bold),
                  ),
                  Chip(
                    label: Text('${_contactos.length} contacts'),
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
                      'No contacts registered in the book.',
                      style: TextStyle(color: Colors.grey),
                    ),
                  ),
                )
              else
                // Declarative mapping of each Contacto object to a ListTile
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
                        tooltip: 'Delete contact',
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

## 3. Architectural Reflection

Take a moment to inspect the `agenda_page.dart` file you just built:
* The `_AgendaPageState` class exceeds 150 lines of code.
* It mixes three distinct responsibilities simultaneously:
  1. Managing in-memory state (`_contactos`, `_nombreCtrl`, `_telefonoCtrl`).
  2. Laying out and validating the visual input form.
  3. Laying out individual list cards and their avatars.

What would happen if we wanted to reuse the form on another screen or replace the list with a two-column grid? **We cannot**, because everything is tightly coupled inside a single monolithic file.
