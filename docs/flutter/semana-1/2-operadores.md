---
sidebar_position: 2
title: Operadores en Dart
---

# Operadores en Dart

Los operadores son símbolos especiales que permiten realizar cálculos, comparaciones, evaluar condiciones lógicas, validar tipos y simplificar la manipulación de objetos en Dart.

---

## Operadores Aritméticos

Dart soporta los operadores matemáticos estándar para realizar cálculos numéricos:

| Operador | Descripción | Ejemplo |
| :--- | :--- | :--- |
| `+` | Suma | `5 + 2 // 7` |
| `-` | Resta | `5 - 2 // 3` |
| `*` | Multiplicación | `5 * 2 // 10` |
| `/` | División (retorna `double`) | `5 / 2 // 2.5` |
| `~/` | División entera (retorna `int`) | `5 ~/ 2 // 2` |
| `%` | Módulo (residuo de división) | `5 % 2 // 1` |

```dart title="aritmeticos.dart"
void main() {
  int a = 10;
  int b = 3;

  print('División exacta: ${a / b}');   // Imprime 3.3333333333333335
  print('División entera: ${a ~/ b}');  // Imprime 3
  print('Residuo (módulo): ${a % b}');  // Imprime 1
}
```

---

## Operadores de Comparación

Se utilizan para evaluar la relación entre dos operandos. El resultado siempre es un valor booleano (`true` o `false`).

| Operador | Significado |
| :--- | :--- |
| `==` | Igual a |
| `!=` | Diferente de |
| `>` | Mayor que |
| `<` | Menor que |
| `>=` | Mayor o igual que |
| `<=` | Menor o igual que |

```dart title="comparacion.dart"
void main() {
  double notaParcial = 2.9;
  double notaAprobacion = 3.0;

  bool aprobo = notaParcial >= notaAprobacion;
  print('¿Aprobó la materia?: $aprobo'); // Imprime: false
}
```

---

## Operadores Lógicos

Los operadores lógicos se usan para combinar o invertir expresiones booleanas.

* **AND Lógico (`&&`):** Devuelve `true` solo si ambas condiciones son verdaderas.
* **OR Lógico (`||`):** Devuelve `true` si al menos una de las condiciones es verdadera.
* **NOT Lógico (`!`):** Invierte el valor booleano de la expresión.

```dart title="logicos.dart"
void main() {
  bool tieneAsistencia = true;
  bool entregoProyecto = false;

  // Para pasar, debe cumplir ambas
  bool apruebaConExcelente = tieneAsistencia && entregoProyecto;
  print('¿Excelente?: $apruebaConExcelente'); // Imprime: false

  // Para habilitar examen de recuperación, le sirve cualquiera
  bool puedeHabilitar = tieneAsistencia || entregoProyecto;
  print('¿Puede habilitar?: $puedeHabilitar'); // Imprime: true
}
```

---

## Operadores de Testeo de Tipos (Type Test Operators)

Dart permite verificar y convertir tipos de datos en tiempo de ejecución (runtime) usando los siguientes operadores:

* **`is`**: Devuelve `true` si el objeto es del tipo especificado.
* **`is!`**: Devuelve `true` si el objeto **no** es del tipo especificado.
* **`as`**: Se utiliza para realizar un casteo de tipos (**type casting**). Obliga al compilador a tratar un objeto como de un subtipo específico.

```dart title="type_test.dart"
void main() {
  dynamic valor = 'Hola Icesi';

  // Validación segura de tipo antes de operar
  if (valor is String) {
    print('El valor tiene ${valor.length} caracteres.');
  }

  if (valor is! int) {
    print('El valor no es un entero.');
  }

  // Type Casting con "as"
  // Solo debes usarlo si estás seguro de que el objeto es de ese tipo,
  // de lo contrario lanzará una excepción en runtime.
  String textoCasteado = valor as String;
  print(textoCasteado.toUpperCase());
}
```

---

## Operador de Cascada (Cascade Notation)

Los operadores de cascada (`..` y `?..`) te permiten encadenar una secuencia de operaciones sobre el mismo objeto, evitando tener que repetir el nombre de la variable o crear variables temporales adicionales. Esto es muy común al configurar objetos con múltiples propiedades o al invocar métodos en cadena.

```dart title="cascade.dart"
class Estudiante {
  String? nombre;
  String? codigo;
  List<String> materias = [];

  void presentarse() {
    print('Estudiante: $nombre | Código: $codigo | Materias: $materias');
  }
}

void main() {
  // Sin cascada (código repetitivo):
  var est1 = Estudiante();
  est1.nombre = 'Laura';
  est1.codigo = 'A0012345';
  est1.materias.add('Flutter');
  est1.presentarse();

  // Con cascada (..):
  var est2 = Estudiante()
    ..nombre = 'Andrés'
    ..codigo = 'A0098765'
    ..materias.add('Estructuras de Datos')
    ..presentarse(); // Imprime la información directamente
}
```

:::tip
Si el objeto sobre el que vas a realizar la cascada puede ser nulo, utiliza el operador de cascada condicional null-safe `?..` en la primera llamada de la cadena.
:::

---

## Ejercicios Prácticos

Aplica los operadores estudiados para resolver los siguientes retos prácticos.

### Ejercicio 1: Conversión de Tipos con Operador Entero
Supón que estás desarrollando una app de delivery que calcula la cantidad de cajas necesarias para despachar un pedido. Si cada caja transporta exactamente 6 artículos y un cliente ordena 20 artículos:
- Escribe una expresión utilizando operadores aritméticos que calcule cuántas cajas completas se llenarán.
- Escribe otra expresión que calcule cuántos artículos sobrantes quedarán sin una caja completa.

<details>
<summary>Ver solución detallada</summary>

```dart title="ejercicio1.dart"
void main() {
  int totalArticulos = 20;
  int capacidadCaja = 6;

  // Usamos el operador de división entera (~/)
  int cajasCompletas = totalArticulos ~/ capacidadCaja;

  // Usamos el operador de residuo o módulo (%)
  int articulosSobrantes = totalArticulos % capacidadCaja;

  print('Cajas completas requeridas: $cajasCompletas'); // Imprime: 3
  print('Artículos sueltos (sobrantes): $articulosSobrantes'); // Imprime: 2
}
```

</details>

### Ejercicio 2: Refactorización usando Cascadas y Null-Safe Cascades
Dado el siguiente código desordenado y repetitivo, refactorízalo usando el operador de cascada de Dart (`..` y `?..`).

```dart title="ejercicio2_sucio.dart"
class Car {
  String? brand;
  int? year;
  
  void startEngine() {
    print('Engine started for $brand');
  }
}

void main() {
  Car? myCar = Car();
  
  // Refactoriza esto para evitar repetir 'myCar'
  if (myCar != null) {
    myCar.brand = 'Toyota';
    myCar.year = 2024;
    myCar.startEngine();
  }
}
```

<details>
<summary>Ver solución detallada</summary>

Podemos utilizar la cascada condicional `?..` para realizar la configuración de forma directa y elegante, asegurándonos de que si `myCar` es nulo, no se rompa la ejecución.

```dart title="ejercicio2_limpio.dart"
class Car {
  String? brand;
  int? year;
  
  void startEngine() {
    print('Engine started for $brand');
  }
}

void main() {
  Car? myCar = Car();
  
  // Refactorización con operador de cascada null-safe (?..)
  myCar
    ?..brand = 'Toyota'
    ..year = 2024
    ..startEngine();
}
```

</details>
