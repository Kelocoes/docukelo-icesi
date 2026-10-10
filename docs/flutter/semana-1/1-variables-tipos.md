---
sidebar_position: 1
title: Variables y Tipos de Datos
---

# Variables y Tipos de Datos

En Dart, las variables son contenedores para almacenar valores. Como Dart es un lenguaje con **strong typing** (tipado fuerte), cada variable tiene un tipo asociado que determina qué clase de valores puede contener. Sin embargo, gracias a la **type inference** (inferencia de tipos), no siempre es necesario declarar el tipo de forma explícita.

---

## Declaración de Variables

En Dart existen dos formas principales de declarar una variable:

1. **Tipado implícito (Inferencia de tipos):** Utilizando la palabra clave `var`. El compilador infiere el tipo de dato según el valor inicial asignado.
2. **Tipado explícito:** Declarando directamente el tipo de dato (`int`, `String`, `double`, `bool`, etc.).

```dart title="variables_decl.dart"
void main() {
  // Tipado implícito (var)
  var nombre = 'Icesi'; // Inferred as String
  var fundacion = 1979; // Inferred as int
  
  // Tipado explícito
  String estudiante = 'Juan';
  double promedio = 4.5;
  bool estaMatriculado = true;
  
  print('Universidad: $nombre ($fundacion)');
  print('Estudiante: $estudiante con promedio $promedio');
}
```

:::warning
Una vez que Dart infiere el tipo de una variable declarada con `var`, no puedes asignarle un valor de otro tipo más adelante. Por ejemplo, si haces `var edad = 20;`, intentar hacer `edad = 'veinte';` lanzará un error de compilación.
:::

---

## Dynamic

Si necesitas que una variable cambie de tipo dinámicamente durante el tiempo de ejecución (runtime), puedes usar el tipo `dynamic`.

```dart title="dynamic_example.dart"
void main() {
  dynamic variableFlexible = 'Hola estudiantes';
  print(variableFlexible); // Imprime un String
  
  variableFlexible = 42;
  print(variableFlexible); // Imprime un int (permitido con dynamic)
  
  variableFlexible = [1, 2, 3];
  print(variableFlexible); // Imprime una List (permitido con dynamic)
}
```

:::danger
Evita abusar de `dynamic`. Al usarlo, desactivas el análisis estático del compilador (static type checking), lo que incrementa el riesgo de errores en tiempo de ejecución (runtime errors). Utilízalo únicamente cuando sea estrictamente necesario.
:::

---

## Final vs Const

Tanto `final` como `const` se utilizan para definir variables cuyos valores **no pueden cambiar** una vez asignados (inmutabilidad). Sin embargo, hay una diferencia crucial en el momento en que se evalúan sus valores:

### Final

Una variable `final` se define en **tiempo de ejecución (runtime)**. Esto significa que puedes asignarle un valor que se calcula o se obtiene dinámicamente al ejecutar la aplicación (por ejemplo, el resultado de una petición HTTP, la hora actual o un valor ingresado por el usuario).

```dart title="final_example.dart"
void main() {
  final DateTime fechaActual = DateTime.now(); // Se calcula al ejecutar
  print(fechaActual);
  
  // fechaActual = DateTime.now(); // ERROR: No se puede reasignar
}
```

### Const

Una variable `const` se define en **tiempo de compilación (compile-time)**. Su valor debe conocerse antes de que la aplicación se ejecute. Todo valor `const` es implícitamente `final`.

```dart title="const_example.dart"
void main() {
  const double pi = 3.14159; // Valor conocido en compilación
  const double areaCirculo = pi * 10 * 10; // Operación computable en compilación
  
  print('Área: $areaCirculo');
  
  // const DateTime ahora = DateTime.now(); // ERROR: DateTime.now() requiere ejecutarse
}
```

:::tip
En Flutter, usar widgets marcados como `const` es una excelente práctica de optimización de rendimiento. Le indica al framework que ese widget no cambiará y evita reconstrucciones (re-renders) innecesarias en la interfaz.
:::

---

## Late

La palabra clave `late` le promete al compilador de Dart que inicializarás una variable no-nula antes de que sea leída por primera vez. Es útil cuando:
- El valor de la variable se inicializa después de su declaración (por ejemplo, en un método de ciclo de vida como `initState` en Flutter).
- La inicialización es costosa y quieres realizarla de manera perezosa (**lazy initialization**), es decir, solo cuando la variable se acceda por primera vez.

```dart title="late_example.dart"
class Profesor {
  late String materia;

  void asignarMateria(String nombreMateria) {
    materia = nombreMateria;
  }
}

void main() {
  var profe = Profesor();
  // print(profe.materia); // ERROR en runtime: LateInitializationError (no ha sido asignada)
  
  profe.asignarMateria('Desarrollo Móvil');
  print(profe.materia); // Funciona correctamente
}
```

---

## Null Safety

Dart implementa **Sound Null Safety** (seguridad contra nulos garantizada). Esto significa que, por defecto, los tipos de datos no pueden contener valores nulos (`null`). Esto previene el clásico error del millón de dólares: el `NullPointerException`.

### Tipos Nullable y Non-nullable

Para permitir que una variable acepte `null`, debes agregar un signo de interrogación `?` al final del tipo de dato:

```dart title="null_safety_decl.dart"
void main() {
  String nombreObligatorio = 'Ana'; // Non-nullable por defecto
  // nombreObligatorio = null; // ERROR de compilación
  
  String? nombreOpcional = null; // Nullable
  nombreOpcional = 'Carlos'; // Permitido
  nombreOpcional = null; // Permitido
}
```

### Operadores de Null Safety

Dart proporciona operadores convenientes para trabajar con variables que pueden ser nulas:

* **Operador de acceso condicional (`?.`):** Si el objeto es nulo, la expresión devuelve nulo en lugar de lanzar una excepción.
* **Operador de aserción nula (`!`):** Fuerza a tratar una variable nullable como si fuera non-nullable. Lanza una excepción si el valor resulta ser nulo en runtime.
* **Operador null-coalescing (`??`):** Proporciona un valor por defecto en caso de que la expresión a la izquierda sea nula.

```dart title="null_operators.dart"
void main() {
  String? descripcionCurso;

  // 1. Acceso condicional (?.): evita caídas si la variable es nula
  print(descripcionCurso?.length); // Imprime: null

  // 2. Operador null-coalescing (??): asigna valor por defecto si es nulo
  String descripcionFinal = descripcionCurso ?? 'Sin descripción disponible';
  print(descripcionFinal); // Imprime: Sin descripción disponible

  // 3. Operador de aserción nula (!): úsalo solo si estás 100% seguro de que no es nulo
  descripcionCurso = 'Clase de Flutter';
  print(descripcionCurso.length); // Funciona
}
```

---

## Ejercicios Prácticos

Pon a prueba tus conocimientos resolviendo los siguientes retos sobre variables, inmutabilidad y Null Safety.

### Ejercicio 1: Identificación de Errores
Analiza el siguiente fragmento de código y determina cuáles líneas causarán un error de compilación y por qué.

```dart title="ejercicio1.dart"
void main() {
  var counter = 10;
  counter = '15';
  
  final piValue = 3.14;
  piValue = 3.1416;
  
  const double gravity = 9.8;
  const currentHour = DateTime.now().hour;
  
  String? username;
  print(username!.length);
}
```

<details>
<summary>Ver solución detallada</summary>

El código tiene cuatro errores de compilación y un posible error en tiempo de ejecución (runtime error):

1. **Línea 3 (`counter = '15';`):** Error de compilación. Dart infirió `counter` como tipo `int` en su declaración. No se le puede asignar un `String`.
2. **Línea 6 (`piValue = 3.1416;`):** Error de compilación. `piValue` is una variable `final`, por lo que solo se puede asignar una vez.
3. **Línea 9 (`const currentHour = DateTime.now().hour;`):** Error de compilación. Las variables `const` deben conocerse en tiempo de compilación. `DateTime.now()` se evalúa en tiempo de ejecución. Debería ser declarada con `final`.
4. **Línea 12 (`print(username!.length);`):** Error en tiempo de ejecución (Runtime Exception). Aunque compila porque usas el operador de aserción `!`, al ejecutar lanzará un `TypeError` / `NullThrownError` porque `username` efectivamente es `null` en ese punto.

</details>

### Ejercicio 2: Diseñando un Sistema de Inventario Seguro
Escribe una pequeña clase en Dart que simule un producto en un inventario. Debe cumplir con las siguientes especificaciones:
- El `id` del producto debe ser inmutable y asignarse al crearlo.
- El `nombre` del producto debe ser obligatorio.
- La `descripcion` debe ser opcional (nullable).
- El `precio` debe poder cambiar, pero queremos inicializarlo de manera perezosa (late) o asegurar que empiece con un valor predeterminado usando null safety.
- Debe tener un método que imprima la información resumida del producto. Si no hay descripción, debe mostrar "No disponible".

<details>
<summary>Ver solución detallada</summary>

```dart title="ejercicio2.dart"
class Product {
  final String id; // Inmutable
  final String name; // Obligatorio
  String? description; // Opcional (nullable)
  late double price; // Inicialización late

  Product({required this.id, required this.name, this.description});

  void displayInfo() {
    // Uso del operador null-coalescing (??) para la descripción
    String descText = description ?? 'No disponible';
    print('ID: $id | Producto: $name | Descripción: $descText | Precio: \$$price');
  }
}

void main() {
  var prod = Product(
    id: 'PROD-100', 
    name: 'MacBook Air',
    description: 'Chip M3, 16GB RAM'
  );
  
  // Inicializamos el precio antes de llamar a displayInfo
  prod.price = 1099.99;
  
  prod.displayInfo();
}
```

</details>

---

<Quiz id="dart-variables-tipos-quiz">
  <Question title="¿Cuál es el comportamiento ante una variable no inicializada en Dart cuando Null Safety está activo?">
    <Option>Toma el valor de null de forma automática.</Option>
    <Option>Toma un valor por defecto como 0 o cadena vacía.</Option>
    <Option>Compila normalmente, pero explota en ejecución al usarla.</Option>
    <Option correct>No se permite; Dart exige inicializarla o declararla como nullable con '?' para poder compilar.</Option>
  </Question>
  <Question title="¿Qué diferencia hay entre usar 'final' y 'const' en Dart?">
    <Option>Final se evalúa en tiempo de compilación y const en ejecución.</Option>
    <Option correct>Const se evalúa en tiempo de compilación y final en ejecución.</Option>
    <Option>Final solo permite mutar propiedades internas, const no.</Option>
    <Option>Son términos sinónimos y completamente equivalentes.</Option>
  </Question>
  <Question title="¿Para qué sirve la palabra clave 'late' en Dart?">
    <Option>Para declarar una variable que puede admitir nulos.</Option>
    <Option correct>Para declarar una variable no nula que se inicializará después, retrasando su evaluación.</Option>
    <Option>Para forzar a que la variable sea constante en compilación.</Option>
    <Option>Para indicar que la variable es de tipo dynamic.</Option>
  </Question>
  <Question title="Si tienes 'String? nombre = null;', ¿cómo asignamos un valor por defecto de forma segura en caso de que sea nulo?">
    <Option>String saludo = nombre!;</Option>
    <Option correct>String saludo = nombre ?? 'Invitado';</Option>
    <Option>String saludo = nombre ?. 'Invitado';</Option>
    <Option>String saludo = nombre == 'Invitado';</Option>
  </Question>
  <Question title="¿Qué sucede si aplicas el operador de aserción nula '!' a una variable que es efectivamente null?">
    <Option>Devuelve una cadena vacía en ejecución.</Option>
    <Option>El compilador da un error de sintaxis y no compila el proyecto.</Option>
    <Option correct>El compilador lo acepta, pero lanzará un error (excepción) en tiempo de ejecución.</Option>
    <Option>Asigna un valor predeterminado automáticamente.</Option>
  </Question>
</Quiz>

