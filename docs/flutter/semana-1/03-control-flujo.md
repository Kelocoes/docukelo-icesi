---
sidebar_position: 3
title: Control de Flujo y Estructuras Modernas
---

# Control de Flujo y Estructuras Modernas

El control de flujo define la secuencia en la que se ejecutan las instrucciones de un programa. Dart incluye las estructuras condicionales y de repetición clásicas, pero además incorpora características de lenguajes modernos de tipado estático como **Records**, **Pattern Matching** y **Switch Expressions**.

---

## Estructuras Condicionales

### If-Else

El bloque `if` evalúa una condición booleana. Si es verdadera, ejecuta su respectivo bloque de código; de lo contrario, puede saltar a un bloque `else if` o un bloque por defecto `else`.

```dart title="if_else.dart"
void main() {
  double promedio = 3.8;

  if (promedio >= 4.5) {
    print('Felicidades, estás en el cuadro de honor de Icesi.');
  } else if (promedio >= 3.0) {
    print('Aprobaste la materia satisfactoriamente.');
  } else {
    print('Reprobaste la materia. Debes presentar examen remedial.');
  }
}
```

### Switch clásico

Se utiliza para comparar una sola variable contra múltiples valores posibles.

```dart title="switch_class.dart"
void main() {
  String estadoMatricula = 'pendiente';

  switch (estadoMatricula) {
    case 'activo':
      print('El estudiante puede ingresar a clases.');
      break;
    case 'pendiente':
      print('El estudiante debe legalizar su matrícula.');
      break;
    case 'inactivo':
      print('El estudiante ha sido retirado del sistema.');
      break;
    default:
      print('Estado no reconocido.');
  }
}
```

---

## Bucles y Ciclos de Repetición

Los bucles permiten ejecutar un bloque de código repetidas veces mientras se cumpla una condición dada.

### For y For-In

El bucle `for` tradicional se usa cuando conoces la cantidad exacta de iteraciones. El bucle `for-in` es excelente para iterar directamente sobre los elementos de una colección (como listas o sets).

```dart title="for_loops.dart"
void main() {
  // For clásico
  for (int i = 1; i <= 3; i++) {
    print('Iteración número: $i');
  }

  // For-in para colecciones
  List<String> lenguajes = ['Dart', 'Kotlin', 'Swift'];
  for (var lenguaje in lenguajes) {
    print('Lenguaje móvil: $lenguaje');
  }
}
```

### While y Do-While

* **`while`**: Evalúa la condición antes de ejecutar el bloque. Si la condición inicial es falsa, el cuerpo nunca se ejecuta.
* **`do-while`**: Ejecuta el bloque al menos una vez antes de verificar la condición.

```dart title="while_loops.dart"
void main() {
  int contador = 0;

  // While
  while (contador < 3) {
    print('Contador While: $contador');
    contador++;
  }

  // Do-While
  int intentos = 0;
  do {
    print('Intento número: ${intentos + 1}');
    intentos++;
  } while (intentos < 1);
}
```

---

## Records

Introducidos en Dart 3, los **Records** (registros) son colecciones anónimas y heterogéneas de campos agregados en un solo valor. A diferencia de las listas o mapas, los registros tienen un tamaño fijo en tiempo de compilación y pueden mezclar tipos de datos de forma segura.

Pueden definirse con campos posicionales o con nombres:

```dart title="records.dart"
void main() {
  // Registro con campos posicionales
  var estudiante = ('Santiago', 21, 4.2);
  print(estudiante.$1); // Imprime: Santiago (primer elemento posicional)
  print(estudiante.$3); // Imprime: 4.2

  // Registro con campos nombrados
  var curso = (nombre: 'Desarrollo Móvil', cupo: 25, activo: true);
  print(curso.nombre); // Acceso directo por su nombre
  print(curso.cupo);   // Imprime: 25
}
```

---

## Pattern Matching y Desestructuración

El **Pattern Matching** (coincidencia de patrones) permite verificar si un valor coincide con una estructura determinada y, si es así, extraer (desestructurar) sus partes internas directamente en variables locales.

```dart title="pattern_matching.dart"
void main() {
  // Desestructurar un Record
  var (nombre, edad) = ('Carlos', 23);
  print('Nombre: $nombre | Edad: $edad');

  // Desestructuración en listas
  var lista = [1, 2, 3];
  var [primero, segundo, _] = lista; // El guion bajo (_) ignora el elemento
  print('Primero: $primero, Segundo: $segundo');
}
```

---

## Switch Expressions (Expresiones Switch)

A partir de Dart 3, `switch` puede utilizarse como una **expresión** que retorna un valor directamente. Esto reduce la verbosidad de los switches clásicos al eliminar las palabras clave `case`, `break` y `default`, sustituyéndolas por funciones de flecha (`=>`) y el comodín `_` (wildcard) como caso por defecto.

```dart title="switch_expressions.dart"
enum Nivel { pregrado, posgrado, doctorado }

void main() {
  Nivel nivelEstudio = Nivel.posgrado;

  // Switch Expression asignado a una variable
  String costoMatricula = switch (nivelEstudio) {
    Nivel.pregrado => 'Valor base estándar',
    Nivel.posgrado => 'Valor base + 20%',
    Nivel.doctorado => 'Valor base + 50%',
  };

  print('Costo asignado: $costoMatricula');
}
```

### Combinación con Pattern Matching

Podemos usar expresiones switch complejas para validar la forma y el contenido de Records u otros objetos:

```dart title="switch_patterns.dart"
void main() {
  // Intentamos procesar la respuesta de una petición
  var respuestaServidor = (codigo: 200, mensaje: 'OK');

  String estado = switch (respuestaServidor) {
    (codigo: 200, mensaje: String msg) => 'Éxito: $msg',
    (codigo: 404, mensaje: _) => 'Recurso no encontrado',
    (codigo: int c, mensaje: _) when c >= 500 => 'Error crítico del servidor',
    _ => 'Código de estado desconocido',
  };

  print(estado); // Imprime: Éxito: OK
}
```

---

## Ejercicios Prácticos

Pon a prueba tu lógica y tu habilidad para estructurar código moderno en Dart.

### Ejercicio 1: Desestructurando Resultados de Funciones
Crea una función llamada `obtenerUbicacionIcesi` que devuelva un Record con la latitud (double), longitud (double) y el nombre del bloque (String). Luego, en la función `main`, llama a esta función y utiliza **Pattern Matching** para extraer las variables individualmente e imprimirlas.

<details>
<summary>Ver solución detallada</summary>

```dart title="ejercicio1.dart"
(double, double, String) obtenerUbicacionIcesi() {
  // Retorna un registro posicional
  return (3.3426, -76.5304, 'Bloque C');
}

void main() {
  // Desestructuración del retorno de la función en variables individuales
  var (lat, lng, bloque) = obtenerUbicacionIcesi();

  print('Latitud: $lat');
  print('Longitud: $lng');
  print('Lugar: $bloque');
}
```

</details>

### Ejercicio 2: Clasificador de Calificaciones Moderno
Crea una expresión switch que reciba un Record con la estructura `(double nota, int asistencia)` y retorne el estado final del estudiante en formato String. Las reglas son:
- Si la asistencia es menor a 80, no importa la nota, devuelve "Reprobado por inasistencia".
- Si la nota es mayor o igual a 4.5 y la asistencia es mayor o igual a 90, devuelve "Aprobado con honores".
- Si la nota es mayor o igual a 3.0, devuelve "Aprobado".
- Para cualquier otro caso, devuelve "Reprobado".

<details>
<summary>Ver solución detallada</summary>

```dart title="ejercicio2.dart"
void main() {
  // Cambia estos valores para probar diferentes escenarios
  var recordEstudiante = (nota: 4.6, asistencia: 95);

  String resultado = switch (recordEstudiante) {
    (nota: _, asistencia: int a) when a < 80 => 'Reprobado por inasistencia',
    (nota: double n, asistencia: int a) when n >= 4.5 && a >= 90 => 'Aprobado con honores',
    (nota: double n, asistencia: _) when n >= 3.0 => 'Aprobado',
    _ => 'Reprobado',
  };

  print('Resultado académico: $resultado');
}
```

</details>
