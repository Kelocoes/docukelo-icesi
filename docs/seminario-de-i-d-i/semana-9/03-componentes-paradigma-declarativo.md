---
sidebar_position: 3
---

# Concepto de Componente y Paradigma Declarativo

En el desarrollo de aplicaciones frontend modernas, la interfaz de usuario no se construye como una serie de pantallas monolíticas ni mediante la manipulación manual de píxeles o etiquetas. En su lugar, el diseño y la arquitectura se fundamentan en dos pilares esenciales: el **paradigma declarativo** y el **concepto de componente reutilizable**.

---

## El Paradigma Declarativo: La Interfaz como Función del Estado

Para comprender cómo funciona Flutter y los frameworks de frontend contemporáneos (como React, SwiftUI o Jetpack Compose), es necesario contrastar el enfoque declarativo con el modelo tradicional imperativo que utilizaste en cursos previos como APO 1 y APO 2 con Java, Swing o JavaFX.

### Modelo Imperativo vs. Modelo Declarativo

* **Enfoque Imperativo (JavaFX / Swing / DOM clásico)**: 
  Tú como programador eres responsable de dar las órdenes paso a paso para alterar la pantalla cada vez que sucede un evento. Si un usuario hace clic en un botón, tu manejador de eventos debe localizar el componente en la memoria y mutar su valor explícitamente:
  ```java title="ControladorImperativo.java" showLineNumbers
  // El programador muta manualmente la propiedad del widget en memoria
  int contador = 0;
  void onClickBoton() {
      contador++;
      etiquetaContador.setText("Contador: " + contador);
      if (contador >= 10) {
          etiquetaContador.setStyle("-fx-text-fill: red;");
      }
  }
  ```
  *Problema*: A medida que la pantalla crece, mantener sincronizados todos los elementos visuales con la lógica interna genera código frágil y propenso a estados inconsistentes (*bugs* visuales).

* **Enfoque Declarativo (Flutter)**:
  Tú no le dices al framework *cómo mutar* cada elemento de la pantalla; describes *cómo debe lucir la interfaz para un determinado estado de datos*:

$$UI = f(state)$$

Donde:
* **$state$** representa la verdad de los datos en ese instante (números, listas, booleanos, objetos de negocio).
* **$f$** es la función constructora (en Flutter, el método `build(BuildContext context)` de tus widgets).
* **$UI$** es la interfaz gráfica que el usuario ve y con la que interactúa.

<div style={{ textAlign: 'center', margin: '24px 0' }}>
  <img 
    src="/img/seminario-de-i-d-i/imperativo-vs-declarativo.svg" 
    alt="Diagrama Imperativo vs Declarativo" 
    style={{ width: '100%', maxWidth: '780px', borderRadius: '12px' }} 
  />
</div>

Cuando ocurre un evento (por ejemplo, el usuario toca un botón), el código simplemente modifica la variable del estado y notifica al motor. El framework ejecuta de nuevo la función $f(state)$ y redibuja de manera eficiente únicamente los nodos que requieran actualización.

:::note[Inmutabilidad y Redibujado Eficiente]
En Flutter, los widgets son configuraciones inmutables y livianas. Destruir y reconstruir instancias de widgets no degrada el rendimiento de la aplicación porque el motor gráfico subyacente mantiene un árbol de elementos y un árbol de renderizado persistente en la GPU, aplicando un algoritmo de reconciliación (*diffing*) de alta velocidad.
:::

---

## ¿Qué es un Componente de Interfaz?

Un **componente** (denominado *Widget* en el ecosistema de Flutter) es una pieza de software autocontenida, modular y reutilizable que encapsula tanto la estructura visual como el comportamiento visual de un fragmento de la pantalla.

<div style={{ textAlign: 'center', margin: '24px 0' }}>
  <img 
    src="/img/seminario-de-i-d-i/concepto-componentes.svg" 
    alt="Arquitectura Basada en Componentes Reutilizables" 
    style={{ width: '100%', maxWidth: '780px', borderRadius: '12px' }} 
  />
</div>

### Características Fundamentales de un Componente

1. **Encapsulamiento**: Un componente define sus propias reglas de distribución interna (márgenes, tipografías, colores, alineación) sin depender de quién sea su padre en el árbol de widgets.
2. **Parametrización (Props / Argumentos de Constructor)**: Para que un componente sea genuinamente reutilizable, no debe codificar información rígida (*hardcoded*). Recibe datos desde el exterior a través de los argumentos de su constructor:
   - Títulos, precios, descripciones (`String`, `double`).
   - URLs de imágenes o rutas locales de recursos (`String`).
   - Funciones o acciones que se ejecutarán ante eventos (`VoidCallback`, `Function(String)`).
3. **Composición sobre Herencia**: En lugar de heredar de una clase base compleja para alterar su comportamiento, los componentes se configuran agrupando y anidando componentes más simples.

---

## Anatomía de un Componente Básico en Flutter: StatelessWidget

Cuando un componente presenta información estática o depende únicamente de los parámetros que le suministra su widget padre, se implementa mediante la clase `StatelessWidget`:

```dart title="lib/components/product_card.dart" showLineNumbers
import 'package:flutter/material.dart';

// Definición de un componente reutilizable y parametrizable
class ProductCard extends StatelessWidget {
  // 1. Declaración de propiedades inmutables (props)
  final String title;
  final double price;
  final String imageUrl;
  final VoidCallback onAddToCart;

  // 2. Constructor con parámetros nombrados y requeridos
  const ProductCard({
    super.key,
    required this.title,
    required this.price,
    required this.imageUrl,
    required this.onAddToCart,
  });

  // 3. Método build: describe la UI en función de las propiedades
  @override
  Widget build(BuildContext context) {
    return Card(
      elevation: 2,
      shape: RoundedRectangleBorder(
        borderRadius: BorderRadius.circular(12),
      ),
      child: Padding(
        padding: const EdgeInsets.all(12.0),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            // Imagen del producto
            ClipRRect(
              borderRadius: BorderRadius.circular(8),
              child: Image.network(
                imageUrl,
                height: 120,
                width: double.infinity,
                fit: BoxFit.cover,
              ),
            ),
            const SizedBox(height: 8),
            // Título
            Text(
              title,
              style: const TextStyle(
                fontSize: 16,
                fontWeight: FontWeight.bold,
              ),
            ),
            // Precio
            Text(
              '\$${price.toStringAsFixed(2)}',
              style: const TextStyle(
                fontSize: 14,
                color: Colors.green,
                fontWeight: FontWeight.w600,
              ),
            ),
            const SizedBox(height: 8),
            // Botón de acción con callback
            SizedBox(
              width: double.infinity,
              child: ElevatedButton(
                onPressed: onAddToCart,
                child: const Text('Agregar'),
              ),
            ),
          ],
        ),
      ),
    );
  }
}
```

### Ventajas de Adoptar una Arquitectura de Componentes

* **Mantenibilidad**: Si el diseño de la tarjeta de producto cambia (por ejemplo, agregar una insignia de descuento o cambiar el radio del borde), se edita un solo archivo (`product_card.dart`) y el cambio se refleja en toda la aplicación.
* **Separación de Responsabilidades**: La pantalla principal se encarga de coordinar la lista de productos y la navegación, mientras que la tarjeta solo se enfoca en presentar un único ítem con fidelidad visual.
* **Testabilidad**: Puedes probar cada widget de manera aislada mediante pruebas unitarias y de widgets (*Widget Testing*).

---

## Cuestionario de Autoevaluación

<Quiz id="s9-componentes-declarativo-quiz">
  <Question title="¿Cuál es el significado fundamental de la expresión UI = f(state) en el desarrollo con Flutter?">
    <Option>Que la interfaz de usuario se genera de forma estática una sola vez al compilar la aplicación y permanece inalterable.</Option>
    <Option correct>Que la interfaz visual es el reflejo directo y determinista del estado actual de los datos, reconstruyéndose cuando el estado cambia.</Option>
    <Option>Que el desarrollador debe invocar manualmente un método de mutación sobre cada etiqueta gráfica para cambiar su contenido.</Option>
    <Option>Que la interfaz es una función matemática ejecutada exclusivamente en el servidor backend.</Option>
  </Question>
  <Question title="En contraste con el modelo imperativo de JavaFX, ¿qué ocurre en Flutter cuando el usuario pulsa un botón para alterar un contador?">
    <Option>El código busca la referencia del nodo Text en memoria mediante su ID y muta directamente su propiedad interna de texto.</Option>
    <Option>El sistema operativo redibuja toda la ventana destruyendo la instancia de la máquina virtual de Dart.</Option>
    <Option correct>Se actualiza la variable del estado y el framework reevalúa la función constructora build() para redibujar de forma eficiente los widgets afectados.</Option>
    <Option>Se dispara una petición HTTP automática hacia un servidor en la nube para regenerar el HTML de la vista.</Option>
  </Question>
  <Question title="¿Cuál es la principal ventaja de aplicar el principio de 'composición sobre herencia' al diseñar componentes en Flutter?">
    <Option>Permite crear subclases gigantescas con cientos de métodos sobreescritos para cada variación visual.</Option>
    <Option correct>Permite ensamblar interfaces combinando componentes pequeños, modulares y especializados en lugar de extender jerarquías de clases complejas.</Option>
    <Option>Obliga a que todos los widgets de la aplicación compartan el mismo estado mutable global.</Option>
    <Option>Elimina la necesidad de definir constructores o tipado en el lenguaje Dart.</Option>
  </Question>
  <Question title="¿Por qué los componentes basados en StatelessWidget son idóneos para presentar datos inmutables recibidos por constructor?">
    <Option correct>Porque son ligeros, eficientess y sus propiedades son constantes (final), delegando la reconstrucción al widget padre cuando cambian los datos.</Option>
    <Option>Porque permiten mutar sus variables internas en cualquier momento sin avisar al motor de renderizado.</Option>
    <Option>Porque disponen de métodos de ciclo de vida como initState() y dispose() para suscribirse a streams.</Option>
    <Option>Porque se ejecutan directamente en un hilo secundario de Java sin pasar por el motor gráfico de Flutter.</Option>
  </Question>
  <Question title="¿Por qué el redibujado frecuente del método build() en Flutter no ocasiona problemas críticos de rendimiento?">
    <Option>Porque Flutter convierte todo el código a JavaScript para aprovechar el motor V8 del navegador.</Option>
    <Option>Porque los widgets se guardan en una base de datos SQLite antes de mostrarse en la pantalla.</Option>
    <Option correct>Porque las instancias de widgets son configuraciones inmutables y livianas, mientras que el árbol de elementos y el renderizado en GPU se reconcilian eficientemente.</Option>
    <Option>Porque el método build() solo se invoca una única vez durante todo el ciclo de vida del dispositivo móvil.</Option>
  </Question>
</Quiz>
