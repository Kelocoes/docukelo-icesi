---
title: Funciones en Dart
sidebar_position: 5
---

Las funciones son los bloques de construcción fundamentales en cualquier lenguaje de programación. En Dart, y particularmente dentro del desarrollo con Flutter, las funciones no son simples agrupadores de código; son tratadas como **ciudadanos de primera clase** (first-class citizens). Esto significa que las funciones se pueden asignar a variables, pasarse como argumentos y retornarse desde otras funciones.

En este capítulo aprenderás a estructurar funciones en Dart, manejar sus parámetros con flexibilidad y comprender conceptos avanzados como Closures y funciones flecha.

---

## Anatomía de Parámetros: Positional, Named y Optional

Dart ofrece múltiples maneras de definir los parámetros que recibe una función, brindando una legibilidad y robustez excepcionales.

### Parámetros Posicionales (Positional Parameters)
Son los parámetros tradicionales. El orden en el que se declaran determina el orden en el que se deben pasar los valores al invocar la función.

```dart title="parametros_posicionales.dart"
// Parámetros posicionales obligatorios
void describirCurso(String nombre, int creditos) {
  print('El curso $nombre tiene $creditos créditos.');
}

void main() {
  describirCurso('Computación 3', 4); // Correcto
  // describirCurso(4, 'Computación 3'); // Error de compilación: tipos incompatibles
}
```

### Parámetros Nombrados (Named Parameters)
Se definen envolviendo los parámetros dentro de llaves `{}`. Al llamar a la función, debes especificar explícitamente el nombre de la variable antes de su valor.
- Por defecto, los parámetros nombrados son **opcionales** y pueden ser nulos (`null`).
- Para forzar a que un parámetro nombrado sea obligatorio, se antepone la palabra clave `required`.

```dart title="parametros_nombrados.dart"
// Parámetros nombrados: uno obligatorio y uno opcional con valor por defecto
void crearUsuario({
  required String email, 
  String rol = 'Estudiante', // Valor por defecto
}) {
  print('Usuario creado con correo $email y rol $rol');
}

void main() {
  // El orden no importa al usar parámetros nombrados
  crearUsuario(email: 'juan.perez@correo.icesi.edu.co'); 
  crearUsuario(rol: 'Monitor', email: 'maria.gomez@correo.icesi.edu.co');
}
```

:::tip
En Flutter, la inmensa mayoría de los constructores de Widgets (como `Container`, `Text`, `Row`, etc.) utilizan **parámetros nombrados**, lo que permite construir layouts altamente descriptivos y fáciles de leer.
:::

### Parámetros Posicionales Opcionales (Optional Positional Parameters)
Se definen envolviendo los parámetros dentro de corchetes `[]` al final de la firma de la función. No se pueden mezclar parámetros nombrados y posicionales opcionales en la misma función.

```dart title="parametros_opcionales.dart"
// El parámetro 'apodo' es opcional y puede ser nulo
void saludarEstudiante(String nombre, [String? apodo]) {
  if (apodo != null) {
    print('Hola $nombre, alias "$apodo"');
  } else {
    print('Hola $nombre');
  }
}

void main() {
  saludarEstudiante('Carlos'); // Output: Hola Carlos
  saludarEstudiante('Carlos', 'Carlitos'); // Output: Hola Carlos, alias "Carlitos"
}
```

---

## Funciones Flecha (Arrow Functions)
Las funciones flecha (o **arrow syntax**) proporcionan una sintaxis ultra compacta para definir funciones que ejecutan y retornan una **única expresión**. Reemplaza las llaves `{}` y la palabra clave `return` por el operador `=>`.

```dart title="funciones_flecha.dart"
// Función tradicional de una línea
int duplicarTradicional(int x) {
  return x * 2;
}

// Función Flecha equivalente
int duplicarFlecha(int x) => x * 2;

void main() {
  print(duplicarFlecha(5)); // Output: 10
}
```

---

## Ciudadanos de Primera Clase (First-Class Functions)
Como las funciones en Dart son objetos, podemos realizar operaciones avanzadas con ellas:

### Asignar funciones a variables
```dart title="funcion_variable.dart"
void gritar(String mensaje) => print('${mensaje.toUpperCase()}!!!');

void main() {
  // Asignamos la función a una variable del tipo genérico 'Function'
  Function accion = gritar;
  accion('cuidado'); // Output: CUIDADO!!!
}
```

### Pasar funciones como argumentos (Callbacks)
Es común pasar una función como parámetro a otra. El receptor de la función puede invocarla posteriormente.

```dart title="funcion_argumento.dart"
// La función operar recibe dos enteros y una función (callback) para procesarlos
int operar(int a, int b, int Function(int, int) operacion) {
  return operacion(a, b);
}

void main() {
  int suma = operar(10, 5, (x, y) => x + y);
  int multiplicacion = operar(10, 5, (x, y) => x * y);
  
  print('Suma: $suma'); // Output: 15
  print('Multiplicación: $multiplicacion'); // Output: 50
}
```

---

## Closures (Clausuras)
Un **Closure** es un objeto de función que tiene acceso a variables en su alcance léxico (lexical scope), incluso si la función original se está ejecutando fuera de su alcance inicial. En términos sencillos, la función interna "recuerda" el entorno donde fue creada.

```dart title="closures_ejemplo.dart"
// Esta función retorna otra función
Function crearSumador(int valorInicial) {
  // La función retornada "captura" la variable 'valorInicial'
  return (int numero) => valorInicial + numero;
}

void main() {
  // sumadorDiez recuerda que valorInicial = 10
  var sumadorDiez = crearSumador(10);
  
  // sumadorCien recuerda que valorInicial = 100
  var sumadorCien = crearSumador(100);
  
  print(sumadorDiez(5));  // Output: 15 (10 + 5)
  print(sumadorCien(5));  // Output: 105 (100 + 5)
}
```

---

## Ejercicios Prácticos

Pon a prueba tu lógica resolviendo los siguientes ejercicios estructurados.

### Ejercicio 1: Formateador de Reportes Académicos
Crea una función llamada `generarFichaEstudiante` que reciba los datos de un estudiante y retorne una ficha formateada en String.
La función debe cumplir con:
- Un parámetro posicional obligatorio: `nombre` (String).
- Parámetros nombrados opcionales dentro de `{}`:
  - `codigo` (String, por defecto: "SIN_CODIGO").
  - `promedio` (double, obligatorio, usa `required`).
  - `activo` (bool, por defecto: `true`).

```dart title="ejercicio1_base.dart"
// Define la función aquí e invócala en el main.
```

<details>
<summary>Ver solución sugerida</summary>

```dart title="ejercicio1_solucion.dart"
String generarFichaEstudiante(
  String nombre, {
  String codigo = 'SIN_CODIGO',
  required double promedio,
  bool activo = true,
}) {
  String estado = activo ? 'Activo' : 'Inactivo';
  return 'Estudiante: $nombre | Código: $codigo | Promedio: $promedio | Estado: $estado';
}

void main() {
  // Invocación válida
  String ficha = generarFichaEstudiante(
    'Ana Lucía', 
    promedio: 4.8, 
    codigo: 'A0029302'
  );
  
  print(ficha);
  // Output: Estudiante: Ana Lucía | Código: A0029302 | Promedio: 4.8 | Estado: Activo
}
```
</details>

### Ejercicio 2: Callback para Cifrado de Mensajes
Escribe una función llamada `procesarMensaje` que reciba un String (`mensaje`) y una función callback transformadora (`String Function(String)`).
Usa `procesarMensaje` para:
1. Imprimir el mensaje en mayúsculas.
2. Imprimir el mensaje reemplazando los espacios por guiones medios `-`.

```dart title="ejercicio2_base.dart"
// Implementa procesarMensaje y llámala en el main.
```

<details>
<summary>Ver solución sugerida</summary>

```dart title="ejercicio2_solucion.dart"
void procesarMensaje(String mensaje, String Function(String) callback) {
  String resultado = callback(mensaje);
  print('Resultado procesado: $resultado');
}

void main() {
  String textoOriginal = "Dart es genial para Flutter";

  // 1. Convertir a mayúsculas usando una función anónima
  procesarMensaje(textoOriginal, (texto) => texto.toUpperCase());
  // Output: Resultado procesado: DART ES GENIAL PARA FLUTTER

  // 2. Reemplazar espacios por guiones usando métodos de String
  procesarMensaje(textoOriginal, (texto) => texto.replaceAll(' ', '-'));
  // Output: Resultado procesado: Dart-es-genial-para-Flutter
}
```
</details>

### Ejercicio 3: Closure para Contador Académico
Implementa una función llamada `crearContadorNotas` que inicialice un contador en `0` y retorne una función closure.
Cada vez que se llame a la función closure pasándole una nota (double), esta debe:
1. Sumar la nota al acumulador interno.
2. Retornar el promedio actual acumulado.

```dart title="ejercicio3_base.dart"
// Escribe la función creadora del closure y pruébala ingresando notas.
```

<details>
<summary>Ver solución sugerida</summary>

```dart title="ejercicio3_solucion.dart"
Function crearContadorNotas() {
  double sumaTotal = 0.0;
  int cantidadNotas = 0;

  // El closure captura las variables 'sumaTotal' y 'cantidadNotas'
  return (double nota) {
    sumaTotal += nota;
    cantidadNotas++;
    return sumaTotal / cantidadNotas;
  };
}

void main() {
  var agregarNota = crearContadorNotas();

  print('Promedio tras nota 1 (4.0): ${agregarNota(4.0)}'); // Output: 4.0
  print('Promedio tras nota 2 (5.0): ${agregarNota(5.0)}'); // Output: 4.5
  print('Promedio tras nota 3 (3.0): ${agregarNota(3.0)}'); // Output: 4.0
}
```
</details>
