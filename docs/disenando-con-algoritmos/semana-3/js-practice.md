---
sidebar_position: 5
---

# 50 Ejercicios de Practica de JavaScript

¡Hola! Estos son algunos ejercicios fundamentales para comprender los conceptos básicos de JavaScript, incluyendo variables, hoisting, operadores y salidas por consola. Si tienes dudas no dudes en preguntar.

---

## 1. El saludo amistoso

#### Problema

Crea una variable llamada `nombre` que almacene tu nombre y muestra en consola el mensaje `"Hola, [nombre]!"`. Usa concatenaciones.

#### Ejemplo

- **Entrada:** `"Ana"`
- **Salida:** `"Hola, Ana!"`

<details>
<summary>💡 Ver solución</summary>

```javascript
let nombre = "Ana";
console.log("Hola, " + nombre + "!");
```

</details>

---

## 2. El intercambio de valores

#### Problema

Tienes dos variables con valores diferentes. Debes intercambiar sus valores sin usar una variable temporal.

#### Ejemplo

- **Entrada:** `x = 5, y = 10`
- **Salida:** `x = 10, y = 5`

<details>
<summary>💡 Ver solución</summary>

```javascript
let x = 5;
let y = 10;

[x, y] = [y, x];
console.log("x:", x); // 10
console.log("y:", y); // 5
```

</details>

---

## 3. El área del rectángulo

#### Problema

Declara dos constantes `base` y `altura` y calcula el área de un rectángulo (`base * altura`), sin usar funciones.

#### Ejemplo

- **Entrada:** `base = 4, altura = 3`
- **Salida:** `12`

<details>
<summary>💡 Ver solución</summary>

```javascript
const base = 4;
const altura = 3;
console.log(base * altura);
```

</details>

---

## 4. El precio con descuento

#### Problema

Declara dos variables: `precio` y `descuento`. Calcula el precio final aplicando el descuento (en porcentaje). No uses funciones.

#### Ejemplo

- **Entrada:** `precio = 100, descuento = 20`
- **Salida:** `80`

<details>
<summary>💡 Ver solución</summary>

```javascript
let precio = 100;
let descuento = 20; // en porcentaje
let precioFinal = precio - (precio * descuento) / 100;
console.log(precioFinal);
```

</details>

---

## 5. Comparación simple

#### Problema

Declara dos variables `x` y `y` y muestra `true` si `x` es mayor que `y`, de lo contrario `false`.

#### Ejemplo

- **Entrada:** `x = 10, y = 7`
- **Salida:** `true`

<details>
<summary>💡 Ver solución</summary>

```javascript
let x = 10;
let y = 7;
console.log(x > y);
```

</details>

---

## 6. El operador lógico AND

#### Problema

Crea dos variables booleanas `llueve` y `tengoParaguas`. Muestra `true` solo si ambas son verdaderas.

#### Ejemplo

- **Entrada:** `llueve = true, tengoParaguas = true`
- **Salida:** `true`

<details>
<summary>💡 Ver solución</summary>

```javascript
let llueve = true;
let tengoParaguas = true;
console.log(llueve && tengoParaguas);
```

</details>

---

## 7. El operador lógico OR

#### Problema

Crea dos variables booleanas `tengoDinero` y `tengoTiempo`. Muestra `true` si al menos una es verdadera.

#### Ejemplo

- **Entrada:** `tengoDinero = false, tengoTiempo = true`
- **Salida:** `true`

<details>
<summary>💡 Ver solución</summary>

```javascript
let tengoDinero = false;
let tengoTiempo = true;
console.log(tengoDinero || tengoTiempo);
```

</details>

---

## 8. Hoisting en acción

#### Problema

Demuestra el concepto de **hoisting** usando `var` para declarar una variable después de usarla.  
Nota: Esto **no funciona igual** con `let` o `const`.

#### Ejemplo

- **Salida esperada:** `undefined` y luego el valor asignado.

<details>
<summary>💡 Ver solución</summary>

```javascript
console.log(miVariable); // undefined
var miVariable = "Hola mundo";
console.log(miVariable); // "Hola mundo"
```

</details>

---

## 9. La calculadora básica

#### Problema

Crea una calculadora que realice las cuatro operaciones básicas (suma, resta, multiplicación y división) con dos números.

#### Ejemplo

- **Entrada:** `num1 = 10, num2 = 5`
- **Salida:**
  ```
  Suma: 15
  Resta: 5
  Multiplicación: 50
  División: 2
  ```

<details>
<summary>💡 Ver solución</summary>

```javascript
const num1 = 10;
const num2 = 5;

console.log("Suma:", num1 + num2);
console.log("Resta:", num1 - num2);
console.log("Multiplicación:", num1 * num2);
console.log("División:", num1 / num2);
```

</details>

---

## 10. Incremento y decremento (prefijo vs postfijo)

#### Problema

Demuestra la diferencia entre los operadores de incremento (`++`) y decremento (`--`) cuando se usan como **prefijo** (antes de la variable) y **postfijo** (después de la variable).

#### Ejemplo

```javascript
let num = 5;
// ¿Qué valores se imprimirán en cada caso?
```

<details>
<summary>💡 Ver solución</summary>

```javascript
let num = 5;

console.log(num++); // 5 (postfijo: primero imprime, luego incrementa)
console.log(num); // 6 (ahora el valor está actualizado)

console.log(++num); // 7 (prefijo: primero incrementa, luego imprime)
console.log(num--); // 7 (postfijo: primero imprime, luego decrementa)
console.log(num); // 6 (valor actualizado)
console.log(--num); // 5 (prefijo: primero decrementa, luego imprime)
```

</details>

---

## Recursos adicionales (Ejercicos Fáciles)

- [MDN - Variables](https://developer.mozilla.org/es/docs/Web/JavaScript/Guide/Grammar_and_types#declaraciones)
- [MDN - Hoisting](https://developer.mozilla.org/es/docs/Glossary/Hoisting)
- [MDN - Operadores](https://developer.mozilla.org/es/docs/Web/JavaScript/Guide/Expressions_and_Operators)
- [JavaScript.info - Variables](https://javascript.info/variables)
- [JavaScript.info - Operadores básicos](https://javascript.info/operators)

---

## 11. ¿Es mayor de edad?

#### Problema

Usa una estructura `if/else` para mostrar `"Mayor de edad"` si la edad es mayor o igual a 18, o `"Menor de edad"` en caso contrario.

#### Ejemplo

- **Entrada:** `edad = 20`
- **Salida:** `"Mayor de edad"`

<details>
<summary>💡 Ver solución</summary>

```javascript
let edad = 20;
if (edad >= 18) {
  console.log("Mayor de edad");
} else {
  console.log("Menor de edad");
}
```

</details>

---

## 12. Clasificación de notas

#### Problema

Usa `if/else if/else` para clasificar una nota:

- `>= 90`: "Excelente"
- `>= 70`: "Aprobado"
- `< 70`: "Reprobado"

#### Ejemplo

- **Entrada:** `nota = 85`
- **Salida:** `"Aprobado"`

<details>
<summary>💡 Ver solución</summary>

```javascript
let nota = 85;
if (nota >= 90) {
  console.log("Excelente");
} else if (nota >= 70) {
  console.log("Aprobado");
} else {
  console.log("Reprobado");
}
```

</details>

---

## 13. Día de la semana

#### Problema

Usa un `switch` para mostrar el nombre del día de la semana según un número del 1 al 7.

#### Ejemplo

- **Entrada:** `dia = 3`
- **Salida:** `"Miércoles"`

<details>
<summary>💡 Ver solución</summary>

```javascript
let dia = 3;
switch (dia) {
  case 1:
    console.log("Lunes");
    break;
  case 2:
    console.log("Martes");
    break;
  case 3:
    console.log("Miércoles");
    break;
  case 4:
    console.log("Jueves");
    break;
  case 5:
    console.log("Viernes");
    break;
  case 6:
    console.log("Sábado");
    break;
  case 7:
    console.log("Domingo");
    break;
  default:
    console.log("Número inválido");
}
```

</details>

---

## 14. Aprobación con operador ternario

#### Problema

Usa el operador ternario para mostrar `"Aprobado"` si la nota es mayor o igual a 70, o `"Reprobado"` si es menor.

#### Ejemplo

- **Entrada:** `nota = 65`
- **Salida:** `"Reprobado"`

**P.D.:** El operador ternario es una forma corta de escribir un `if/else`. Su sintaxis es:

```
condición ? valorSiVerdadero : valorSiFalso;
```

<details>
<summary>💡 Ver solución</summary>

```javascript
let nota = 65;
console.log(nota >= 70 ? "Aprobado" : "Reprobado");
```

</details>

---

## 15. Contar hasta 5 con for

#### Problema

Usa un bucle `for` para mostrar los números del 1 al 5.

#### Ejemplo

- **Salida:** `1 2 3 4 5`

<details>
<summary>💡 Ver solución</summary>

```javascript
for (let i = 1; i <= 5; i++) {
  console.log(i);
}
```

</details>

---

## 16. Cuenta regresiva con while

#### Problema

Usa un bucle `while` para contar desde 5 hasta 1.

#### Ejemplo

- **Salida:** `5 4 3 2 1`

<details>
<summary>💡 Ver solución</summary>

```javascript
let i = 5;
while (i >= 1) {
  console.log(i);
  i--;
}
```

</details>

---

## 17. Suma de números con for

#### Problema

Usa un `for` para sumar los números del 1 al 10 y muestra el resultado.

#### Ejemplo

- **Salida:** `55`

<details>
<summary>💡 Ver solución</summary>

```javascript
let suma = 0;
for (let i = 1; i <= 10; i++) {
  suma += i;
}
console.log(suma);
```

</details>

---

## 18. Función para saludar

#### Problema

Crea una función `saludar` que reciba un nombre como parámetro y muestre `"Hola, [nombre]!"`.

#### Ejemplo

- **Entrada:** `"Carlos"`
- **Salida:** `"Hola, Carlos!"`

<details>
<summary>💡 Ver solución</summary>

```javascript
function saludar(nombre) {
  console.log("Hola, " + nombre + "!");
}
saludar("Carlos");
```

</details>

---

## 19. Función para calcular el cuadrado

#### Problema

Crea una función `cuadrado` que reciba un número y devuelva su cuadrado, es decir, que se multiplique por si mismo.

#### Ejemplo

- **Entrada:** `4`
- **Salida:** `16`

<details>
<summary>💡 Ver solución</summary>

```javascript
function cuadrado(num) {
  return num * num;
}
console.log(cuadrado(4));
```

</details>

---

## 20. Función para verificar par/impar

#### Problema

Crea una función `esPar` que reciba un número y devuelva `true` si es par y `false` si es impar.

#### Ejemplo

- **Entrada:** `5`
- **Salida:** `false`

<details>
<summary>💡 Ver solución</summary>

```javascript
function esPar(num) {
  return num % 2 === 0;
}
console.log(esPar(5));
```

</details>

---

## Recursos adicionales (Ejercicos Básicos)

- [MDN - Estructuras de control](https://developer.mozilla.org/es/docs/Web/JavaScript/Guide/Control_flow_and_error_handling)
- [JavaScript.info - Condicionales](https://javascript.info/ifelse)
- [JavaScript.info - Bucles](https://javascript.info/while-for)
- [MDN - Funciones](https://developer.mozilla.org/es/docs/Web/JavaScript/Guide/Functions)

---

## 21. Agregar elemento a un array

#### Problema

Crea una función `agregarElemento` que reciba un array y un elemento, y lo agregue al final usando `push`.

#### Ejemplo

- **Entrada:** `[1, 2, 3]`, `4`
- **Salida:** `[1, 2, 3, 4]`

<details>
<summary>💡 Ver solución</summary>

```javascript
function agregarElemento(arr, elem) {
  arr.push(elem);
  return arr;
}
console.log(agregarElemento([1, 2, 3], 4));
```

</details>

---

## 22. Eliminar último elemento de un array

#### Problema

Crea una función `eliminarUltimo` que reciba un array y elimine su último elemento usando `pop`.

#### Ejemplo

- **Entrada:** `[1, 2, 3]`
- **Salida:** `[1, 2]`

<details>
<summary>💡 Ver solución</summary>

```javascript
function eliminarUltimo(arr) {
  arr.pop();
  return arr;
}
console.log(eliminarUltimo([1, 2, 3]));
```

</details>

---

## 23. Acceder a una propiedad de un objeto

#### Problema

Crea una función `obtenerNombre` que reciba un objeto con la propiedad `nombre` y devuelva su valor.

#### Ejemplo

- **Entrada:** `{ nombre: "Ana", edad: 20 }`
- **Salida:** `"Ana"`

<details>
<summary>💡 Ver solución</summary>

```javascript
function obtenerNombre(obj) {
  return obj.nombre;
}
console.log(obtenerNombre({ nombre: "Ana", edad: 20 }));
```

</details>

---

## 24. Modificar una propiedad de un objeto

#### Problema

Crea una función `cambiarEdad` que reciba un objeto con la propiedad `edad` y le sume 1.

#### Ejemplo

- **Entrada:** `{ nombre: "Ana", edad: 20 }`
- **Salida:** `{ nombre: "Ana", edad: 21 }`

<details>
<summary>💡 Ver solución</summary>

```javascript
function cambiarEdad(obj) {
  obj.edad += 1;
  return obj;
}
console.log(cambiarEdad({ nombre: "Ana", edad: 20 }));
```

</details>

---

## 25. Copia superficial con spread operator

#### Problema

Crea una función `copiarObjeto` que reciba un objeto y devuelva una copia usando el operador `...`.

#### Ejemplo

- **Entrada:** `{ a: 1, b: 2 }`
- **Salida:** `{ a: 1, b: 2 }`

<details>
<summary>💡 Ver solución</summary>

```javascript
function copiarObjeto(obj) {
  return { ...obj };
}
console.log(copiarObjeto({ a: 1, b: 2 }));
```

</details>

---

## 26. Copia superficial con Object.assign

#### Problema

Crea una función `copiarConAssign` que reciba un objeto y devuelva una copia usando `Object.assign`.

#### Ejemplo

- **Entrada:** `{ x: 10, y: 20 }`
- **Salida:** `{ x: 10, y: 20 }`

<details>
<summary>💡 Ver solución</summary>

```javascript
function copiarConAssign(obj) {
  return Object.assign({}, obj);
}
console.log(copiarConAssign({ x: 10, y: 20 }));
```

</details>

---

## 27. Agregar varias propiedades a un objeto

#### Problema

Crea una función `agregarDatos` que reciba un objeto y le agregue propiedades nuevas: `pais` y `ciudad`.

#### Ejemplo

- **Entrada:** `{ nombre: "Ana" }`
- **Salida:** `{ nombre: "Ana", pais: "Colombia", ciudad: "Bogotá" }`

<details>
<summary>💡 Ver solución</summary>

```javascript
function agregarDatos(obj) {
  obj.pais = "Colombia";
  obj.ciudad = "Bogotá";
  return obj;
}
console.log(agregarDatos({ nombre: "Ana" }));
```

</details>

---

## 28. Crear un nuevo array a partir de otro (spread)

#### Problema

Crea una función `duplicarArray` que reciba un array y devuelva una copia con los mismos elementos usando `...`.

#### Ejemplo

- **Entrada:** `[1, 2, 3]`
- **Salida:** `[1, 2, 3]`

<details>
<summary>💡 Ver solución</summary>

```javascript
function duplicarArray(arr) {
  return [...arr];
}
console.log(duplicarArray([1, 2, 3]));
```

</details>

---

## 29. Eliminar propiedad de un objeto

#### Problema

Crea una función `eliminarPropiedad` que reciba un objeto y una propiedad, y elimine esa propiedad.

#### Ejemplo

- **Entrada:** `{ a: 1, b: 2 }`, `"b"`
- **Salida:** `{ a: 1 }`

<details>
<summary>💡 Ver solución</summary>

```javascript
function eliminarPropiedad(obj, prop) {
  delete obj[prop];
  return obj;
}
console.log(eliminarPropiedad({ a: 1, b: 2 }, "b"));
```

</details>

---

## 30. Combinar dos objetos

#### Problema

Crea una función `combinarObjetos` que reciba dos objetos y devuelva uno nuevo que los combine usando spread.

#### Ejemplo

- **Entrada:** `{ a: 1 }`, `{ b: 2 }`
- **Salida:** `{ a: 1, b: 2 }`

<details>
<summary>💡 Ver solución</summary>

```javascript
function combinarObjetos(obj1, obj2) {
  return { ...obj1, ...obj2 };
}
console.log(combinarObjetos({ a: 1 }, { b: 2 }));
```

</details>

---

## Recursos adicionales (Ejercicios Intermedios)

- [MDN - Arrays](https://developer.mozilla.org/es/docs/Web/JavaScript/Reference/Global_Objects/Array)
- [MDN - Array.prototype.push()](https://developer.mozilla.org/es/docs/Web/JavaScript/Reference/Global_Objects/Array/push)
- [MDN - Array.prototype.pop()](https://developer.mozilla.org/es/docs/Web/JavaScript/Reference/Global_Objects/Array/pop)
- [MDN - Objetos](https://developer.mozilla.org/es/docs/Learn/JavaScript/Objects/Basics)
- [MDN - Propiedades de objetos](https://developer.mozilla.org/es/docs/Web/JavaScript/Guide/Working_with_Objects#objetos_y_propiedades)
- [MDN - Spread operator (`...`)](https://developer.mozilla.org/es/docs/Web/JavaScript/Reference/Operators/Spread_syntax)
- [MDN - Object.assign()](https://developer.mozilla.org/es/docs/Web/JavaScript/Reference/Global_Objects/Object/assign)
- [JavaScript.info - Arrays](https://javascript.info/array)
- [JavaScript.info - Objetos](https://javascript.info/object)
- [JavaScript.info - Copia por referencia y copia de objetos](https://javascript.info/object-copy)

---

## 31. Copia profunda con JSON.parse

#### Problema

Crea una función `deepCopyJSON` que reciba un objeto y devuelva una copia profunda usando `JSON.stringify` y `JSON.parse`.

#### Ejemplo

- **Entrada:** `{ a: 1, b: { c: 2 } }`
- **Salida:** `{ a: 1, b: { c: 2 } }` (copia independiente)

<details>
<summary>💡 Ver solución</summary>

```javascript
function deepCopyJSON(obj) {
  return JSON.parse(JSON.stringify(obj));
}
console.log(deepCopyJSON({ a: 1, b: { c: 2 } }));
```

</details>

---

## 32. Copia profunda con recursividad

#### Problema

Crea una función `deepCopyRecursive` que reciba un objeto y devuelva una copia profunda usando recursividad.

#### Ejemplo

- **Entrada:** `{ x: 10, y: { z: 20 } }`
- **Salida:** `{ x: 10, y: { z: 20 } }` (copia independiente)

<details>
<summary>💡 Ver solución</summary>

```javascript
function deepCopyRecursive(obj) {
  if (typeof obj !== "object" || obj === null) return obj;
  let copy = Array.isArray(obj) ? [] : {};
  for (let key in obj) {
    copy[key] = deepCopyRecursive(obj[key]);
  }
  return copy;
}
console.log(deepCopyRecursive({ x: 10, y: { z: 20 } }));
```

</details>

---

## 33. Desestructuración de objetos

#### Problema

Crea una función `extraerUsuario` que reciba un objeto con propiedades `nombre` y `edad` y use desestructuración para devolver una cadena `"Nombre: X, Edad: Y"`.

#### Ejemplo

- **Entrada:** `{ nombre: "Ana", edad: 25 }`
- **Salida:** `"Nombre: Ana, Edad: 25"`

<details>
<summary>💡 Ver solución</summary>

```javascript
function extraerUsuario({ nombre, edad }) {
  return `Nombre: ${nombre}, Edad: ${edad}`;
}
console.log(extraerUsuario({ nombre: "Ana", edad: 25 }));
```

</details>

---

## 34. Desestructuración de arrays

#### Problema

Crea una función `primerosDos` que reciba un array y use desestructuración para devolver sus dos primeros elementos.

#### Ejemplo

- **Entrada:** `[10, 20, 30]`
- **Salida:** `10, 20`

<details>
<summary>💡 Ver solución</summary>

```javascript
function primerosDos(arr) {
  const [a, b] = arr;
  return [a, b];
}
console.log(primerosDos([10, 20, 30]));
```

</details>

---

## 35. Valores por defecto en desestructuración

#### Problema

Crea una función `infoPersona` que reciba un objeto con propiedades opcionales `nombre` y `edad`, y asigne valores por defecto `"Desconocido"` y `0` si no existen.

#### Ejemplo

- **Entrada:** `{ nombre: "Ana" }`
- **Salida:** `"Ana, 0"`

<details>
<summary>💡 Ver solución</summary>

```javascript
function infoPersona({ nombre = "Desconocido", edad = 0 }) {
  return `${nombre}, ${edad}`;
}
console.log(infoPersona({ nombre: "Ana" }));
```

</details>

---

## 36. Desestructuración anidada

#### Problema

Crea una función `extraerCiudad` que reciba un objeto con estructura `{ direccion: { ciudad: "X" } }` y devuelva el nombre de la ciudad.

#### Ejemplo

- **Entrada:** `{ direccion: { ciudad: "Bogotá" } }`
- **Salida:** `"Bogotá"`

<details>
<summary>💡 Ver solución</summary>

```javascript
function extraerCiudad({ direccion: { ciudad } }) {
  return ciudad;
}
console.log(extraerCiudad({ direccion: { ciudad: "Bogotá" } }));
```

</details>

---

## 37. Convertir objeto a JSON

#### Problema

Crea una función `aJSON` que reciba un objeto y lo convierta en un string JSON usando `JSON.stringify`.

#### Ejemplo

- **Entrada:** `{ a: 1, b: 2 }`
- **Salida:** `"{"a":1,"b":2}"`

<details>
<summary>💡 Ver solución</summary>

```javascript
function aJSON(obj) {
  return JSON.stringify(obj);
}
console.log(aJSON({ a: 1, b: 2 }));
```

</details>

---

## 38. Convertir JSON a objeto

#### Problema

Crea una función `desdeJSON` que reciba un string JSON y lo convierta en un objeto usando `JSON.parse`.

#### Ejemplo

- **Entrada:** `"{"a":1,"b":2}"`
- **Salida:** `{ a: 1, b: 2 }`

<details>
<summary>💡 Ver solución</summary>

```javascript
function desdeJSON(str) {
  return JSON.parse(str);
}
console.log(desdeJSON('{"a":1,"b":2}'));
```

</details>

---

## 39. Combinar desestructuración y JSON

#### Problema

Crea una función `parsearYExtraer` que reciba un string JSON con propiedades `nombre` y `edad`, lo convierta en objeto y use desestructuración para devolver `"X tiene Y años"`.

#### Ejemplo

- **Entrada:** `'{"nombre":"Ana","edad":25}'`
- **Salida:** `"Ana tiene 25 años"`

<details>
<summary>💡 Ver solución</summary>

```javascript
function parsearYExtraer(str) {
  const { nombre, edad } = JSON.parse(str);
  return `${nombre} tiene ${edad} años`;
}
console.log(parsearYExtraer('{"nombre":"Ana","edad":25}'));
```

</details>

---

## 40. Copia profunda y modificación independiente

#### Problema

Crea una función `copiaIndependiente` que haga una copia profunda de un objeto y modifique la copia sin afectar el original.

#### Ejemplo

- **Entrada:** `obj = { datos: { edad: 20 } }`, cambiar edad en copia a 21.
- **Salida:** original `{ datos: { edad: 20 } }`, copia `{ datos: { edad: 21 } }`

<details>
<summary>💡 Ver solución</summary>

```javascript
function copiaIndependiente(obj) {
  const copia = JSON.parse(JSON.stringify(obj));
  copia.datos.edad = 21;
  return { original: obj, copia: copia };
}
console.log(copiaIndependiente({ datos: { edad: 20 } }));
```

</details>

---

## Recursos adicionales (Ejercicios Avanzados)

- [MDN - JSON](https://developer.mozilla.org/es/docs/Web/JavaScript/Reference/Global_Objects/JSON)
- [MDN - JSON.stringify()](https://developer.mozilla.org/es/docs/Web/JavaScript/Reference/Global_Objects/JSON/stringify)
- [MDN - JSON.parse()](https://developer.mozilla.org/es/docs/Web/JavaScript/Reference/Global_Objects/JSON/parse)
- [MDN - Destructuring assignment](https://developer.mozilla.org/es/docs/Web/JavaScript/Reference/Operators/Destructuring_assignment)
- [MDN - Recursion](https://developer.mozilla.org/en-US/docs/Glossary/Recursion)
- [JavaScript.info - JSON](https://javascript.info/json)
- [JavaScript.info - Destructuring assignment](https://javascript.info/destructuring-assignment)
- [JavaScript.info - Recursion](https://javascript.info/recursion)

---

## 41. Procesar JSON y hacer copia profunda

#### Problema

Crea una función que reciba un objeto JSON, lo procese convirtiendo todas sus claves a mayúsculas y devuelva una **copia profunda** del mismo.

#### Ejemplo

- **Entrada:** `{ "nombre": "Ana", "edad": 25 }`
- **Salida:** `{ "NOMBRE": "Ana", "EDAD": 25 }`

<details>
<summary>💡 Ver solución</summary>

```javascript
function procesarJSON(obj) {
  const copia = JSON.parse(JSON.stringify(obj));
  const resultado = {};
  for (let clave in copia) {
    resultado[clave.toUpperCase()] = copia[clave];
  }
  return resultado;
}
console.log(procesarJSON({ nombre: "Ana", edad: 25 }));
```

</details>

---

## 42. Contar elementos en un array de forma recursiva

#### Problema

Crea una función recursiva que cuente el número de elementos en un arreglo.

#### Ejemplo

- **Entrada:** `[1,2,3,4]`
- **Salida:** `4`

<details>
<summary>💡 Ver solución</summary>

```javascript
function contarRecursivo(arr) {
  if (arr.length === 0) return 0;
  return 1 + contarRecursivo(arr.slice(1));
}
console.log(contarRecursivo([1, 2, 3, 4]));
```

</details>

---

## 43. Filtrar usuarios por edad (JSON)

#### Problema

Crea una función que reciba un arreglo de objetos con `nombre` y `edad`, y devuelva solo los usuarios mayores de 18 años.

#### Ejemplo

- **Entrada:** `[ {nombre: "Ana", edad: 17}, {nombre: "Luis", edad: 20} ]`
- **Salida:** `[ {nombre: "Luis", edad: 20} ]`

<details>
<summary>💡 Ver solución</summary>

```javascript
function filtrarMayores(usuarios) {
  return usuarios.filter((u) => u.edad > 18);
}
console.log(
  filtrarMayores([
    { nombre: "Ana", edad: 17 },
    { nombre: "Luis", edad: 20 },
  ])
);
```

</details>

---

## 44. Sumar todos los números de un arreglo (recursivo)

#### Problema

Crea una función recursiva que sume todos los números de un arreglo.

#### Ejemplo

- **Entrada:** `[1,2,3]`
- **Salida:** `6`

<details>
<summary>💡 Ver solución</summary>

```javascript
function sumaRecursiva(arr) {
  if (arr.length === 0) return 0;
  return arr[0] + sumaRecursiva(arr.slice(1));
}
console.log(sumaRecursiva([1, 2, 3]));
```

</details>

---

## 45. Mini-proyecto: Contador de palabras

#### Problema

Crea una función que reciba un texto y devuelva un objeto con cada palabra y el número de veces que aparece.

#### Ejemplo

- **Entrada:** `"hola mundo hola"`
- **Salida:** `{ hola: 2, mundo: 1 }`

<details>
<summary>💡 Ver solución</summary>

```javascript
function contarPalabras(texto) {
  const palabras = texto.split(" ");
  const contador = {};
  for (let p of palabras) {
    contador[p] = (contador[p] || 0) + 1;
  }
  return contador;
}
console.log(contarPalabras("hola mundo hola"));
```

</details>

---

## 46. Invertir una cadena de forma recursiva

#### Problema

Crea una función recursiva que invierta un string.

#### Ejemplo

- **Entrada:** `"hola"`
- **Salida:** `"aloh"`

<details>
<summary>💡 Ver solución</summary>

```javascript
function invertirCadena(str) {
  if (str === "") return "";
  return invertirCadena(str.slice(1)) + str[0];
}
console.log(invertirCadena("hola"));
```

</details>

---

## 47. Validar contraseña segura

#### Problema

Crea una función que valide si una contraseña es segura (mínimo 8 caracteres, al menos una mayúscula, una minúscula y un número).

#### Ejemplo

- **Entrada:** `"Hola1234"`
- **Salida:** `true`

<details>
<summary>💡 Ver solución</summary>

```javascript
function validarContrasena(pass) {
  return (
    /[A-Z]/.test(pass) &&
    /[a-z]/.test(pass) &&
    /[0-9]/.test(pass) &&
    pass.length >= 8
  );
}
console.log(validarContrasena("Hola1234"));
```

</details>

---

## 48. Mini-proyecto: Generar lista numerada

#### Problema

Crea una función que reciba un arreglo de strings y devuelva un arreglo con los elementos numerados.

#### Ejemplo

- **Entrada:** `["manzana", "pera"]`
- **Salida:** `["1. manzana", "2. pera"]`

<details>
<summary>💡 Ver solución</summary>

```javascript
function listaNumerada(arr) {
  return arr.map((item, i) => `${i + 1}. ${item}`);
}
console.log(listaNumerada(["manzana", "pera"]));
```

</details>

---

## 49. Aplanar un arreglo anidado (recursivo)

#### Problema

Crea una función recursiva que aplane un arreglo de cualquier profundidad.

#### Ejemplo

- **Entrada:** `[1, [2, [3, 4]], 5]`
- **Salida:** `[1, 2, 3, 4, 5]`

<details>
<summary>💡 Ver solución</summary>

```javascript
function aplanar(arr) {
  return arr.reduce(
    (acc, val) =>
      Array.isArray(val) ? acc.concat(aplanar(val)) : acc.concat(val),
    []
  );
}
console.log(aplanar([1, [2, [3, 4]], 5]));
```

</details>

---

## 50. Mini-proyecto: Conversor de temperatura

#### Problema

Crea una función que convierta de grados Celsius a Fahrenheit y viceversa según un parámetro adicional.

#### Ejemplo

- **Entrada:** `(0, "CtoF")`
- **Salida:** `32`

<details>
<summary>💡 Ver solución</summary>

```javascript
function convertirTemp(valor, tipo) {
  if (tipo === "CtoF") return (valor * 9) / 5 + 32;
  if (tipo === "FtoC") return ((valor - 32) * 5) / 9;
  return null;
}
console.log(convertirTemp(0, "CtoF"));
```

</details>

---

## Recursos adicionales (Ejercicios Experto)

- [MDN - JSON](https://developer.mozilla.org/es/docs/Web/JavaScript/Reference/Global_Objects/JSON)
- [MDN - Funciones recursivas](https://developer.mozilla.org/es/docs/Glossary/Recursion)
- [MDN - Expresiones regulares](https://developer.mozilla.org/es/docs/Web/JavaScript/Guide/Regular_Expressions)
- [MDN - Array.prototype.reduce()](https://developer.mozilla.org/es/docs/Web/JavaScript/Reference/Global_Objects/Array/Reduce)
- [JavaScript.info - Deep copy](https://javascript.info/object-copy)
- [JavaScript.info - Recursion](https://javascript.info/recursion)
- [JavaScript.info - Arrays](https://javascript.info/array)
- [JavaScript.info - Map y filter](https://javascript.info/array-methods#map-y-filter)

---

> 💡 _"Hola estudiante de DMI, ¡no te desanimes si no lograste alguno! lo intentaste y eso es muy importante. Cada línea de código que escribes es un paso más para mejorar tu manejo en JS ¡Sigue adelante, éxitos! - Att: El profesor Kevin y la monitora Sary."_
