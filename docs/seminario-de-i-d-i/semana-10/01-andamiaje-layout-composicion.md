---
sidebar_position: 1
---

import Tabs from '@theme/Tabs';
import TabItem from '@theme/TabItem';

# Andamiaje, Layout y Composición en Flutter

En esta sesión aprenderás a maquetar vistas móviles en Flutter: estructurar el andamiaje (`Scaffold` y `SafeArea`), distribuir elementos en pantalla (`Column`, `Row`, `Expanded`), aplicar estilos visuales (`Container` y `Padding`), y solucionar desbordes (*RenderFlex overflow*) con `SingleChildScrollView`.

---

## 1. Convención Arquitectural: Screen frente a Page

En Flutter, una pantalla bien estructurada separa el marco exterior del contenido interno:
* **`Screen` (Pantalla de Ruta):** Unidad a la que se navega. Es la **única responsable de devolver el `Scaffold`** (con su `AppBar`, `BottomNavigationBar` o `FloatingActionButton`).
* **`Page` (Lienzo Interno):** Contenido visual que vive dentro del `body` de la `Screen`. **Nunca debe devolver un `Scaffold`**, solo widgets de layout (`SafeArea`, `Column`, `ListView`, etc.).

<Tabs>
<TabItem value="diagrama" label="Diagrama Visual" default>

![Arquitectura Screen vs Page](/img/seminario-de-i-d-i/screen-vs-page-arquitectura.svg)

</TabItem>
<TabItem value="codigo" label="Código en Dart">

```dart title="lib/screens/home_screen.dart" showLineNumbers
import 'package:flutter/material.dart';
import '../pages/home_page.dart';

// SCREEN: Marco global con Scaffold
class HomeScreen extends StatelessWidget {
  const HomeScreen({super.key});

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: const Text('Mi Aplicación'),
        centerTitle: true,
      ),
      // Hospeda la Page en su body. Cero Scaffolds anidados.
      body: const HomePage(),
    );
  }
}
```

```dart title="lib/pages/home_page.dart" showLineNumbers
import 'package:flutter/material.dart';

// PAGE: Lienzo de contenido (NUNCA devuelve Scaffold)
class HomePage extends StatelessWidget {
  const HomePage({super.key});

  @override
  Widget build(BuildContext context) {
    return SafeArea(
      child: Padding(
        padding: const EdgeInsets.all(16.0),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: const [
            Text('Bienvenido a la vista interna'),
            SizedBox(height: 12),
            Text('Aquí vive el contenido modular de la pantalla.'),
          ],
        ),
      ),
    );
  }
}
```

</TabItem>
</Tabs>

:::caution[¿Por qué nunca anidar Scaffolds?]
Tener un `Scaffold` dentro de otro genera conflictos graves: las notificaciones (`SnackBar`) se tapan o no se muestran, aparecen barras superiores dobles (`AppBar`) y el teclado virtual tapa los campos de texto porque ambos `Scaffold` intentan redimensionarse al mismo tiempo (`resizeToAvoidBottomInset`).
:::

---

## 2. Andamiaje y Hardware: Scaffold y SafeArea

Los dispositivos móviles tienen notch, esquinas redondeadas, cámaras frontales y barras de navegación por gestos. `Scaffold` y `SafeArea` garantizan que tu interfaz no quede tapada por estos elementos físicos:
* **`Scaffold`:** Provee los espacios estándar de *Material Design* (`appBar`, `body`, `floatingActionButton`, `bottomNavigationBar`).
* **`SafeArea`:** Agrega automáticamente el margen interno necesario para proteger el contenido frente a la barra de estado superior y la barra de inicio o gestos inferior.

<Tabs>
<TabItem value="diagrama" label="Diagrama Visual" default>

![Protección con SafeArea](/img/seminario-de-i-d-i/safearea-hardware-insets.svg)

</TabItem>
<TabItem value="codigo" label="Código en Dart">

```dart title="lib/screens/safe_demo_screen.dart" showLineNumbers
import 'package:flutter/material.dart';

class SafeDemoScreen extends StatelessWidget {
  const SafeDemoScreen({super.key});

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: const Text('Protección de Hardware'),
      ),
      // SafeArea protege el contenido contra el notch y la barra de gestos
      body: SafeArea(
        child: Padding(
          padding: const EdgeInsets.all(16.0),
          child: Center(
            child: Text(
              'Este contenido nunca será tapado por el notch ni por la barra inferior.',
              textAlign: TextAlign.center,
              style: Theme.of(context).textTheme.bodyLarge,
            ),
          ),
        ),
      ),
      bottomNavigationBar: NavigationBar(
        destinations: const [
          NavigationDestination(icon: Icon(Icons.home), label: 'Inicio'),
          NavigationDestination(icon: Icon(Icons.person), label: 'Perfil'),
        ],
      ),
    );
  }
}
```

</TabItem>
</Tabs>

---

## 3. Layout Lineal: Row y Column

Para organizar elementos en una sola dirección utilizamos `Row` (horizontal) y `Column` (vertical). Cada uno opera sobre dos ejes coordenados:

<Tabs>
<TabItem value="diagrama" label="Diagrama Visual" default>

![Ejes de Row y Column](/img/seminario-de-i-d-i/layout-ejes-row-column.svg)

<div style={{ margin: '16px 0' }}>
  <p style={{ fontWeight: 'bold', marginBottom: '8px' }}>Alineaciones en Eje Principal y Transversal:</p>
  <img 
    src="/img/seminario-de-i-d-i/layout-alineaciones-visuales.svg" 
    alt="Alineaciones Visuales en Row y Column" 
    style={{ width: '100%', borderRadius: '12px' }} 
  />
</div>

</TabItem>
<TabItem value="codigo" label="Código en Dart">

```dart title="lib/ejemplos/layout_row_column.dart" showLineNumbers
import 'package:flutter/material.dart';

class LayoutRowColumnExample extends StatelessWidget {
  const LayoutRowColumnExample({super.key});

  @override
  Widget build(BuildContext context) {
    return Column(
      // Eje principal de Column: Vertical
      mainAxisAlignment: MainAxisAlignment.center,
      // Eje transversal de Column: Horizontal
      crossAxisAlignment: CrossAxisAlignment.stretch,
      children: [
        // Fila horizontal con distribución spaceBetween
        Row(
          mainAxisAlignment: MainAxisAlignment.spaceBetween,
          crossAxisAlignment: CrossAxisAlignment.center,
          children: const [
            Icon(Icons.star, color: Colors.amber),
            Text('Elemento Central'),
            Icon(Icons.favorite, color: Colors.red),
          ],
        ),
        const SizedBox(height: 16),
        ElevatedButton(
          onPressed: () {},
          child: const Text('Botón Expandido Transversalmente (stretch)'),
        ),
      ],
    );
  }
}
```

</TabItem>
</Tabs>

---

## 4. Distribución Responsiva: Expanded y flex

En lugar de calcular anchos fijos o usar porcentajes manuales con `MediaQuery`, usamos **`Expanded`** para que un hijo absorba el espacio disponible restante:
* **Espacio flexible:** Si combinas cajas fijas (ej. 70px) con `Expanded`, el widget flexible se adapta automáticamente a cualquier ancho de pantalla.
* **Proporciones con `flex`:** Al colocar varios `Expanded`, el factor `flex` reparte el espacio proporcionalmente (por ejemplo, `flex: 1` y `flex: 2` reparten 33.3% y 66.6% del espacio sobrante).

<Tabs>
<TabItem value="diagrama" label="Diagrama Visual" default>

![Expanded y Proporciones flex](/img/seminario-de-i-d-i/expanded-flex-proporciones.svg)

</TabItem>
<TabItem value="codigo" label="Código en Dart">

```dart title="lib/ejemplos/expanded_flex_demo.dart" showLineNumbers
import 'package:flutter/material.dart';

class ExpandedFlexDemo extends StatelessWidget {
  const ExpandedFlexDemo({super.key});

  @override
  Widget build(BuildContext context) {
    return Column(
      children: [
        // 1. Cajas fijas en extremos y Expanded en el centro
        Row(
          children: [
            Container(width: 70, height: 48, color: Colors.blue.shade100, child: const Center(child: Text('70px'))),
            const SizedBox(width: 8),
            Expanded(
              child: Container(
                height: 48,
                color: Colors.purple.shade100,
                child: const Center(child: Text('Expanded (Absorbe espacio)')),
              ),
            ),
            const SizedBox(width: 8),
            Container(width: 70, height: 48, color: Colors.blue.shade100, child: const Center(child: Text('70px'))),
          ],
        ),
        const SizedBox(height: 16),

        // 2. Reparto proporcional con flex: 1 (33.3%) y flex: 2 (66.6%)
        Row(
          children: [
            Expanded(
              flex: 1,
              child: Container(
                height: 48,
                color: Colors.teal.shade100,
                child: const Center(child: Text('flex: 1 (33.3%)')),
              ),
            ),
            const SizedBox(width: 8),
            Expanded(
              flex: 2,
              child: Container(
                height: 48,
                color: Colors.indigo.shade100,
                child: const Center(child: Text('flex: 2 (66.6%)')),
              ),
            ),
          ],
        ),
      ],
    );
  }
}
```

</TabItem>
</Tabs>

---

## 5. Cajas y Estilos: Container frente a Padding

`Padding` es un widget liviano de responsabilidad única para espaciado. `Container` es la navaja suiza que combina dimensiones, márgenes y decoraciones complejas:

<Tabs>
<TabItem value="diagrama" label="Diagrama Visual" default>

![Modelo de Caja y Regla BoxDecoration](/img/seminario-de-i-d-i/container-box-model-decorations.svg)

</TabItem>
<TabItem value="codigo" label="Código en Dart">

```dart title="lib/ejemplos/container_box_decoration.dart" showLineNumbers
import 'package:flutter/material.dart';

class ContainerDecorationExample extends StatelessWidget {
  const ContainerDecorationExample({super.key});

  @override
  Widget build(BuildContext context) {
    return Container(
      margin: const EdgeInsets.all(16.0), // Margen exterior
      padding: const EdgeInsets.all(20.0), // Relleno interior
      decoration: BoxDecoration(
        // REGLA CRÍTICA: El color DEBE ir dentro de BoxDecoration
        color: const Color(0xFFF9F1FD),
        borderRadius: BorderRadius.circular(16.0),
        border: Border.all(color: const Color(0xFFCBC4D2), width: 1.5),
        boxShadow: [
          BoxShadow(
            color: Colors.black.withOpacity(0.06),
            blurRadius: 10,
            offset: const Offset(0, 4),
          ),
        ],
      ),
      child: const Text(
        'Tarjeta decorada con esquinas redondeadas y sombra sutil.',
        style: TextStyle(fontWeight: FontWeight.w500),
      ),
    );
  }
}
```

</TabItem>
</Tabs>

:::danger[Regla de Oro de BoxDecoration]
Si usas `decoration: BoxDecoration(...)`, el color de fondo **debe ir dentro de `BoxDecoration`**. Si colocas `color` en el `Container` al mismo tiempo que `decoration`, Flutter lanzará un error fatal en tiempo de ejecución (`'color == null || decoration == null'`).
:::

---

## 6. Prevención de Desbordes: SingleChildScrollView

Cuando el contenido de una `Column` supera la altura física de la pantalla, Flutter muestra las temidas **rayas diagonales amarillas y negras** (*RenderFlex overflowed*).

<Tabs>
<TabItem value="diagrama" label="Diagrama Visual" default>

![RenderFlex Overflow y Solución con Scroll](/img/seminario-de-i-d-i/renderflex-overflow-solucion.svg)

</TabItem>
<TabItem value="codigo" label="Código en Dart">

```dart title="lib/ejemplos/scroll_solution.dart" showLineNumbers
import 'package:flutter/material.dart';

class ScrollSolutionExample extends StatelessWidget {
  const ScrollSolutionExample({super.key});

  @override
  Widget build(BuildContext context) {
    // SingleChildScrollView previene el error de desborde (rayas amarillas y negras)
    return SingleChildScrollView(
      padding: const EdgeInsets.all(16.0),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.stretch,
        children: [
          for (int i = 1; i <= 6; i++) ...[
            Container(
              height: 100,
              decoration: BoxDecoration(
                color: Colors.purple.shade50,
                borderRadius: BorderRadius.circular(12),
                border: Border.all(color: Colors.purple.shade200),
              ),
              child: Center(child: Text('Tarjeta de contenido #$i')),
            ),
            const SizedBox(height: 12),
          ],
          FilledButton.icon(
            onPressed: () {},
            icon: const Icon(Icons.check),
            label: const Text('Completar Formulario'),
          ),
        ],
      ),
    );
  }
}
```

</TabItem>
</Tabs>

---

## Cuestionario de Autoevaluación

<Quiz id="flutter-s10-layout-visual-quiz">
  <Question title="¿Cuál es la responsabilidad exclusiva de una Screen frente a una Page?">
    <Option>La Screen gestiona las animaciones con setState y la Page es estática.</Option>
    <Option correct>La Screen define el único Scaffold de la pantalla; la Page es el lienzo de contenido interno dentro del body.</Option>
    <Option>La Screen solo se usa en Android y la Page en iOS.</Option>
    <Option>La Page contiene la AppBar y la Screen contiene los botones.</Option>
  </Question>

  <Question title="¿Qué problema ocurre si anidas un Scaffold dentro del body de otro Scaffold?">
    <Option>La aplicación no compila por un error de sintaxis en Dart.</Option>
    <Option correct>Conflictos con notificaciones SnackBar, barras AppBar dobles y bugs con el teclado virtual al redimensionar.</Option>
    <Option>El teléfono entra en modo de ahorro de batería forzado.</Option>
    <Option>Se borra la memoria caché del proyecto automáticamente.</Option>
  </Question>

  <Question title="¿Cuál es la función del widget SafeArea?">
    <Option>Proteger la aplicación contra ataques de inyección SQL.</Option>
    <Option correct>Añadir insets automáticos para que la interfaz no quede tapada por el notch, cámaras o barras de gestos del celular.</Option>
    <Option>Validar que el usuario haya iniciado sesión con huella dactilar.</Option>
    <Option>Cambiar el color de la barra de navegación cada 10 segundos.</Option>
  </Question>

  <Question title="En un Row, ¿cuál es su Eje Principal (Main Axis)?">
    <Option>Vertical (Y ↓).</Option>
    <Option correct>Horizontal (X →).</Option>
    <Option>Diagonal en 45 grados.</Option>
    <Option>Profundidad en Z.</Option>
  </Question>

  <Question title="¿Qué valor de MainAxisAlignment reparte el espacio sobrante equitativamente entre los hijos, pegando el primero y el último a los extremos?">
    <Option>MainAxisAlignment.center</Option>
    <Option>MainAxisAlignment.start</Option>
    <Option correct>MainAxisAlignment.spaceBetween</Option>
    <Option>MainAxisAlignment.spaceEvenly</Option>
  </Question>

  <Question title="Si colocas dos widgets Expanded en un Row con flex: 1 y flex: 2, ¿qué porcentaje de espacio residual recibe el segundo?">
    <Option>El 50%.</Option>
    <Option correct>El 66.6% (dos tercios del total).</Option>
    <Option>El 100%.</Option>
    <Option>El 25%.</Option>
  </Question>

  <Question title="¿Dónde debe definirse el color de fondo de un Container si este cuenta con la propiedad decoration?">
    <Option>Directamente como propiedad del Container.</Option>
    <Option correct>Obligatoriamente dentro de la instancia de BoxDecoration.</Option>
    <Option>En el widget Scaffold principal únicamente.</Option>
    <Option>Es indistinto, Flutter acepta ambas opciones a la vez.</Option>
  </Question>

  <Question title="¿Cómo se soluciona de forma inmediata el error de franjas amarillas y negras (RenderFlex overflow) en una columna vertical?">
    <Option>Disminuyendo el tamaño de la fuente de todos los textos.</Option>
    <Option correct>Envolviendo la Column dentro de un SingleChildScrollView.</Option>
    <Option>Reemplazando StatelessWidget por StatefulWidget.</Option>
    <Option>Eliminando el widget SafeArea.</Option>
  </Question>
</Quiz>
