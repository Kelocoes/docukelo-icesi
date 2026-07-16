---
title: Colecciones y Métodos
sidebar_position: 4
---

En el desarrollo de aplicaciones móviles con Flutter, la gestión de datos es fundamental. Constantemente estarás recibiendo información de APIs REST, bases de datos locales (como SQLite o Isar) o del estado de la aplicación. Para estructurar y manipular esta información de forma óptima, Dart nos ofrece herramientas muy potentes: **Lists**, **Sets** y **Maps**, junto con operadores avanzados y métodos funcionales.

En este capítulo aprenderás a dominar las colecciones y a transformarlas usando programación funcional.

---

## Estructuras de Datos: Lists, Sets y Maps

### Lists (Listas)
Una **List** es una colección ordenada de elementos donde se permiten duplicados. Cada elemento tiene un índice base cero (`0`).

```dart title="listas_ejemplo.dart"
void main() {
  // Lista explícita de strings
  List<String> materias = ['Computación 3', 'Desarrollo Web', 'Moviles'];
  
  // Agregar y eliminar elementos
  materias.add('Algoritmos');
  materias.remove('Desarrollo Web');
  
  print(materias); // Output: [Computación 3, Moviles, Algoritmos]
  print(materias[0]); // Acceso por índice. Output: Computación 3
}
```

### Sets (Conjuntos)
Un **Set** es una colección desordenada de elementos únicos. No admite elementos duplicados, lo cual es ideal para asegurar que no haya redundancia de datos (por ejemplo, IDs de usuarios o tokens únicos).

```dart title="sets_ejemplo.dart"
void main() {
  // Declaración de un Set usando llaves {}
  Set<String> codigosIcesi = {'A001', 'A002', 'A003', 'A001'};
  
  // El elemento duplicado 'A001' se ignora automáticamente
  print(codigosIcesi); // Output: {A001, A002, A003}
  
  // Comprobar existencia en tiempo O(1)
  bool existe = codigosIcesi.contains('A002');
  print(existe); // Output: true
}
```

### Maps (Mapas)
Un **Map** es un diccionario o colección de parejas clave-valor (**key-value pairs**). Las claves deben ser únicas, pero los valores se pueden repetir. Es la representación directa de un objeto JSON.

```dart title="maps_ejemplo.dart"
void main() {
  // Declaración de un Map
  Map<String, dynamic> estudiante = {
    'nombre': 'Laura Gómez',
    'codigo': 'A003829',
    'semestre': 6,
    'activo': true
  };
  
  // Acceso y modificación
  print(estudiante['nombre']); // Output: Laura Gómez
  estudiante['semestre'] = 7; // Actualización
  estudiante['promedio'] = 4.3; // Nueva clave-valor
  
  print(estudiante);
}
```

:::info
El uso de `<String, dynamic>` es extremadamente común en Flutter cuando parseamos respuestas JSON, ya que las claves siempre son cadenas de texto (`String`), pero los valores pueden ser números, booleanos, listas u otros mapas (`dynamic`).
:::

---

## Operadores y Estructuras Especiales

Dart introduce azúcar sintáctico (**syntactic sugar**) que facilita la manipulación y combinación de colecciones de forma declarativa directamente dentro de sus inicializadores literales.

### Spread Operator (`...` y `...?`)
El **spread operator** (`...`) nos permite desempaquetar o expandir los elementos de una colección dentro de otra. El operador null-aware spread (`...?`) evita que la aplicación falle (lanzando una excepción) si la lista origen es nula.

```dart title="spread_operator.dart"
void main() {
  List<int> notasPrimerCorte = [4, 5, 3];
  List<int> notasSegundoCorte = [2, 5];
  
  // Combinando listas
  List<int> todasLasNotas = [...notasPrimerCorte, ...notasSegundoCorte];
  print(todasLasNotas); // Output: [4, 5, 3, 2, 5]
  
  // Ejemplo con null-aware spread
  List<int>? notasOpcionales;
  List<int> recordFinal = [5, 4, ...?notasOpcionales];
  print(recordFinal); // Output: [5, 4] sin lanzar NullPointerException
}
```

### Collection-if
Permite agregar condicionalmente un elemento a una colección utilizando un `if` de una sola línea en su declaración.

```dart title="collection_if.dart"
void main() {
  bool incluirElectiva = true;
  
  List<String> miHorario = [
    'Moviles',
    'Proyecto de Grado',
    if (incluirElectiva) 'UI/UX Design'
  ];
  
  print(miHorario); // Output: [Moviles, Proyecto de Grado, UI/UX Design]
}
```

### Collection-for
Permite iterar sobre una colección y generar elementos dinámicos directamente dentro de otra colección.

```dart title="collection_for.dart"
void main() {
  List<int> codigosSimples = [1, 2, 3];
  
  // Transformar y generar nuevos elementos dinámicamente
  List<String> codigosFormateados = [
    'ICESI-0',
    for (var codigo in codigosSimples) 'ICESI-$codigo'
  ];
  
  print(codigosFormateados); // Output: [ICESI-0, ICESI-1, ICESI-2, ICESI-3]
}
```

---

## Métodos de Iteración y Programación Funcional

Dart trata a las funciones como ciudadanos de primera clase (first-class citizens), permitiéndonos utilizar métodos funcionales para transformar colecciones de manera limpia, evitando los bucles `for` imperativos tradicionales.

### map
Transforma cada elemento de la colección aplicando una función y retorna un nuevo objeto de tipo `Iterable`. Si necesitas una lista de vuelta, debes llamar a `.toList()`.

```dart title="metodo_map.dart"
void main() {
  List<double> calificaciones = [3.5, 4.0, 2.8, 5.0];
  
  // Sumar 0.5 puntos de bonificación a cada nota
  List<double> notasBonificadas = calificaciones.map((nota) => nota + 0.5).toList();
  
  print(notasBonificadas); // Output: [4.0, 4.5, 3.3, 5.5]
}
```

### where (Filter)
Filtra la colección buscando elementos que cumplan con una condición (predicado booleano). Devuelve un `Iterable` filtrado.

```dart title="metodo_where.dart"
void main() {
  List<int> edades = [17, 21, 19, 15, 23];
  
  // Filtrar solo mayores de edad
  List<int> mayoresDeEdad = edades.where((edad) => edad >= 18).toList();
  
  print(mayoresDeEdad); // Output: [21, 19, 23]
}
```

### reduce
Combina recursivamente todos los elementos de una colección utilizando una función acumuladora para retornar un **único valor** del mismo tipo que los elementos de la colección.

```dart title="metodo_reduce.dart"
void main() {
  List<int> gastos = [100, 250, 80, 120];
  
  // Sumar todos los elementos. 
  // El acumulador (value) y el elemento actual (element) deben ser del mismo tipo.
  int totalGastos = gastos.reduce((acumulado, actual) => acumulado + actual);
  
  print(totalGastos); // Output: 550
}
```

:::warning
El método `.reduce()` fallará con un error si la lista está vacía. Además, no permite cambiar el tipo de retorno (si la lista es de `int`, el resultado debe ser `int`).
:::

### fold
Similar a `reduce`, pero recibe un **valor inicial** explícito de cualquier tipo. Esto permite que el resultado de la acumulación sea de un tipo de dato diferente al de los elementos de la colección y evita fallos si la colección está vacía.

```dart title="metodo_fold.dart"
void main() {
  List<String> palabras = ['Dart', 'es', 'genial'];
  
  // Queremos contar el total de caracteres de todas las palabras sumadas.
  // El valor inicial es 0 (un int), aunque la lista sea de Strings.
  int totalLetras = palabras.fold(0, (acumulado, palabra) => acumulado + palabra.length);
  
  print(totalLetras); // Output: 13
}
```

### any
Retorna `true` si **al menos un** elemento de la colección cumple con la condición especificada.

```dart title="metodo_any.dart"
void main() {
  List<double> notas = [3.2, 2.9, 4.5, 1.2];
  
  // ¿Perdió la materia al menos un estudiante? (nota < 3.0)
  bool hayReprobados = notas.any((nota) => nota < 3.0);
  
  print(hayReprobados); // Output: true
}
```

### every
Retorna `true` si **absolutamente todos** los elementos de la colección cumplen con la condición especificada.

```dart title="metodo_every.dart"
void main() {
  List<double> notas = [4.5, 4.8, 5.0, 4.2];
  
  // ¿Todos los estudiantes pasaron con excelente promedio? (nota >= 4.0)
  bool todosExcelentes = notas.every((nota) => nota >= 4.0);
  
  print(todosExcelentes); // Output: true
}
```

---

## Ejercicios Prácticos

Aplica lo aprendido resolviendo los siguientes retos de programación en Dart.

### Ejercicio 1: Filtrado y Transformación de Estudiantes
Dado un listado de estudiantes representados como mapas (`Map<String, dynamic>`), realiza las siguientes tareas:
1. Filtra la lista para obtener únicamente los estudiantes matriculados en la carrera de "Sistemas".
2. Transforma la lista resultante para obtener solo los nombres de estos estudiantes en mayúsculas.

```dart title="ejercicio1_base.dart"
List<Map<String, dynamic>> estudiantes = [
  {'nombre': 'camilo', 'carrera': 'Sistemas'},
  {'nombre': 'valeria', 'carrera': 'Diseño'},
  {'nombre': 'andres', 'carrera': 'Sistemas'},
  {'nombre': 'gabriela', 'carrera': 'Medicina'},
];
```

<details>
<summary>Ver solución sugerida</summary>

```dart title="ejercicio1_solucion.dart"
void main() {
  List<Map<String, dynamic>> estudiantes = [
    {'nombre': 'camilo', 'carrera': 'Sistemas'},
    {'nombre': 'valeria', 'carrera': 'Diseño'},
    {'nombre': 'andres', 'carrera': 'Sistemas'},
    {'nombre': 'gabriela', 'carrera': 'Medicina'},
  ];

  // 1. Filtrar con where y 2. Transformar con map
  List<String> nombresSistemas = estudiantes
      .where((est) => est['carrera'] == 'Sistemas')
      .map((est) => (est['nombre'] as String).toUpperCase())
      .toList();

  print(nombresSistemas); // Output: [CAMILO, ANDRES]
}
```
</details>

### Ejercicio 2: Procesador de Facturas con Fold
Tienes un listado de productos comprados en un carrito de compras. Cada elemento es un mapa con el nombre del producto, el precio unitario y la cantidad adquirida.
Calcula el costo total del carrito usando el método `.fold()`.

```dart title="ejercicio2_base.dart"
List<Map<String, dynamic>> carrito = [
  {'producto': 'Portátil', 'precio': 1200.0, 'cantidad': 1},
  {'producto': 'Mouse', 'precio': 25.0, 'cantidad': 2},
  {'producto': 'Teclado', 'precio': 45.0, 'cantidad': 1},
];
```

<details>
<summary>Ver solución sugerida</summary>

```dart title="ejercicio2_solucion.dart"
void main() {
  List<Map<String, dynamic>> carrito = [
    {'producto': 'Portátil', 'precio': 1200.0, 'cantidad': 1},
    {'producto': 'Mouse', 'precio': 25.0, 'cantidad': 2},
    {'producto': 'Teclado', 'precio': 45.0, 'cantidad': 1},
  ];

  // Usamos fold con un valor inicial de 0.0 (double)
  double total = carrito.fold(0.0, (acumulado, item) {
    double subtotal = (item['precio'] as double) * (item['cantidad'] as int);
    return acumulado + subtotal;
  });

  print('Total de la compra: \$$total'); // Output: Total de la compra: $1295.0
}
```
</details>

### Ejercicio 3: Generación Dinámica de Menú de Navegación
Construye una lista final de items para el menú lateral (Sidebar) de una app de Flutter usando spread operator, collection-if y collection-for.
Debes integrar:
- Un header fijo `['Home', 'Profile']`.
- Elementos del panel de administración (`['Dashboard', 'Audit']`) **solo si** el usuario tiene rol de admin (`isAdmin = true`).
- Elementos personalizados de una lista de notificaciones configurables dinámica.

```dart title="ejercicio3_base.dart"
bool isAdmin = true;
List<String> configNotificaciones = ['Email Alerts', 'SMS Alerts'];
```

<details>
<summary>Ver solución sugerida</summary>

```dart title="ejercicio3_solucion.dart"
void main() {
  bool isAdmin = true;
  List<String> configNotificaciones = ['Email Alerts', 'SMS Alerts'];

  List<String> menuItems = [
    'Home',
    'Profile',
    if (isAdmin) ...['Dashboard', 'Audit'],
    for (var notif in configNotificaciones) 'Config: $notif'
  ];

  print(menuItems); 
  // Output: [Home, Profile, Dashboard, Audit, Config: Email Alerts, Config: SMS Alerts]
}
```
</details>
