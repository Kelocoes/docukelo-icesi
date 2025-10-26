---
sidebar_position: 1
---

# Preámbulo e introducción de Javascript

Aspectos generales del lenguaje y su propósito en el desarrollo Web.

## Slides

<iframe 
    src="https://www.canva.com/design/DAG22fmkvRU/wqK3aS3aWdjjJwAbUa1TQQ/view?embed"
    width="100%"
    height="600px"
    allowfullscreen="true"
    frameborder="0"
></iframe>

## Javascript

JavaScript es un lenguaje de programación ampliamente utilizado para el desarrollo web, especialmente para crear experiencias interactivas en el navegador. Es versátil, ya que se puede utilizar tanto en el lado del cliente como en el lado del servidor (gracias a entornos como Node.js).

---

### Paradigma del lenguaje

JavaScript es **multiparadigma**, lo que significa que soporta varios estilos de programación:

- **Imperativo**: se basa en instrucciones paso a paso. Este paradigma es útil para entender cómo se ejecutan las operaciones en secuencia.
  ```javascript
  let numeros = [1, 2, 3];
  for (let i = 0; i < numeros.length; i++) {
    console.log(numeros[i]); // Imprime cada número en la consola
  }
  ```

- **Orientado a objetos**: basado en prototipos y, más recientemente, en clases. Este paradigma permite modelar entidades del mundo real como objetos.
  ```javascript
  class Persona {
    constructor(nombre) {
      this.nombre = nombre;
    }
    saludar() {
      console.log(`Hola, soy ${this.nombre}`);
    }
  }
  ```

- **Funcional**: permite tratar funciones como ciudadanos de primera clase. Este paradigma es ideal para trabajar con datos de manera declarativa.
  ```javascript
  let numeros = [1, 2, 3];
  numeros.forEach(num => console.log(num)); // Imprime cada número usando una función
  ```

---

### ¿Qué significa ser un lenguaje interpretado?

Un lenguaje interpretado se ejecuta línea por línea mediante un intérprete, en lugar de ser compilado a código máquina antes de su ejecución. Esto hace que el desarrollo sea más rápido, pero puede ser menos eficiente en rendimiento que los lenguajes compilados.

En JavaScript, el intérprete generalmente es el motor del navegador (como V8 en Chrome o SpiderMonkey en Firefox).

Ejemplo:
```javascript
console.log("Hola mundo"); // Se ejecuta inmediatamente
console.log("Esta línea se ejecuta después"); // Se ejecuta en orden
```

---

### Javascript vs ECMAScript

- **ECMAScript (ES)**: Especificación que define cómo debe funcionar el lenguaje. Es el estándar que guía las implementaciones.
- **JavaScript**: Implementación práctica de esa especificación, utilizada en navegadores y otros entornos.

Por ejemplo:
- ES5: Introdujo `strict mode`, que ayuda a evitar errores comunes.
- ES6 (2015): Introdujo características modernas como `let`, `const`, arrow functions, clases, etc.

Ejemplo ES6:
```javascript
const saludar = (nombre) => `Hola, ${nombre}`;
console.log(saludar("Ana")); // "Hola, Ana"
```

Ejemplo de Strict Mode:
```javascript
"use strict"; // Activa el modo estricto
let x = 3.14;
console.log(x); // 3.14
```

---

### Pasos de instalación en Node (Mac, Windows, Linux)

Node.js es un entorno de ejecución para JavaScript en el lado del servidor. Aquí se explica cómo instalarlo:

**Windows**
1. Ir a [https://nodejs.org](https://nodejs.org).
2. Descargar el instalador LTS (versión recomendada para la mayoría de usuarios).
3. Ejecutar el instalador y seguir los pasos.

**MacOS (Homebrew)**
```bash
brew install node
```

**Linux (Ubuntu/Debian)**
```bash
sudo apt update
sudo apt install nodejs npm
```

Verificar instalación:
```bash
node -v // Muestra la versión de Node.js instalada
npm -v  // Muestra la versión de npm instalada
```

---

### Variables y tipos de dato

JavaScript tiene varios tipos de datos: `string`, `number`, `boolean`, `null`, `undefined`, `symbol`, `bigint`, y objetos.

#### Inmutables
Los valores primitivos no se pueden cambiar. Esto significa que no puedes modificar directamente el contenido de un valor primitivo.
```javascript
let texto = "Hola";
texto[0] = "J"; // No cambia
console.log(texto); // "Hola"
```

#### Mutables
Los objetos y arrays pueden modificarse. Esto permite trabajar con estructuras de datos más complejas.
```javascript
let arr = [1, 2, 3];
arr[0] = 99; // Cambia el primer elemento
console.log(arr); // [99, 2, 3]
```

#### Tipado dinámico
El tipo de una variable puede cambiar en tiempo de ejecución. Esto hace que JavaScript sea flexible pero puede causar errores si no se maneja con cuidado.
```javascript
let x = 5; // number
x = "Hola"; // string
```

---

### Hoisting

El hoisting es el comportamiento por el cual las declaraciones se "mueven" al inicio de su contexto. Esto puede causar confusión si no se entiende bien.

#### Variables
Las variables declaradas con `var` son "hoisted", pero su valor no lo es.
```javascript
console.log(a); // undefined
var a = 5;
```

#### Funciones
Las funciones declaradas son completamente "hoisted", lo que significa que puedes llamarlas antes de declararlas.
```javascript
saludar(); // Funciona
function saludar() {
  console.log("Hola");
}
```

---

### Manipulación de datos

#### Operadores
Los operadores permiten realizar cálculos y operaciones con datos.
```javascript
let suma = 5 + 3; // 8
let resta = 10 - 4; // 6
let multiplicacion = 2 * 6; // 12
let division = 10 / 2; // 5
```

#### Métodos populares
Los métodos de cadenas y arrays son útiles para manipular datos.
```javascript
let texto = "JavaScript";
console.log(texto.toUpperCase()); // "JAVASCRIPT"
console.log(texto.includes("Script")); // true
```

#### Type coercion
JavaScript convierte automáticamente tipos de datos en ciertas operaciones.
```javascript
console.log("5" + 2); // "52" (concatenación)
console.log("5" - 2); // 3 (conversión a número)
```

#### Loose vs Strict equality
La comparación estricta (`===`) verifica tipo y valor, mientras que la comparación laxa (`==`) solo verifica valor.
```javascript
console.log(5 == "5");  // true
console.log(5 === "5"); // false
```

---

### Estructuras de control

#### Condicionales
Permiten ejecutar código basado en condiciones.
```javascript
if (true) console.log("Se cumple");
```

#### Iterativas
Permiten repetir bloques de código.
```javascript
for (let i = 0; i < 3; i++) console.log(i);
```

#### Excepciones
Permiten manejar errores de manera controlada.
```javascript
try {
  throw new Error("Error ejemplo");
} catch (e) {
  console.log(e.message);
}
```

---

### Funciones

#### Declaración
Las funciones declaradas son "hoisted" y pueden ser llamadas antes de su definición.
```javascript
function saludar() {
  console.log("Hola");
}
```

#### Expresiones
Las funciones expresadas no son "hoisted".
```javascript
const saludar = function() { console.log("Hola"); }
```

#### Arrow
Las funciones flecha son una forma concisa de escribir funciones.
```javascript
const saludar = () => console.log("Hola");
```

#### Orden superior
Las funciones de orden superior aceptan otras funciones como argumentos.
```javascript
function operar(fn, a, b) {
  return fn(a, b);
}
console.log(operar((x, y) => x + y, 3, 4)); // 7
```

#### Callbacks
Los callbacks son funciones que se ejecutan después de que otra función termina.
```javascript
function proceso(callback) {
  console.log("Ejecutando...");
  callback();
}
proceso(() => console.log("Finalizado"));
```

---

### Objetos

#### Literales
Los objetos literales son una forma sencilla de crear estructuras de datos.
```javascript
let persona = { nombre: "Ana", edad: 25 };
```

#### Clases
Las clases son una forma moderna de trabajar con objetos y herencia.
```javascript
class Persona {
  constructor(nombre) { this.nombre = nombre; }
  saludar() { console.log("Hola, soy " + this.nombre); }
}
```

#### Prototipos
Los prototipos son la base de la herencia en JavaScript. 
```javascript
function Animal(nombre) { this.nombre = nombre; }
Animal.prototype.saludar = function() { console.log("Hola, soy " + this.nombre); }
```
Los prototipos en JavaScript son objetos que actúan como plantillas para otros objetos. Cada objeto tiene un prototipo que puede proporcionar propiedades y métodos compartidos. Esto permite reutilizar código y establecer relaciones entre objetos.

Ejemplo básico:
```javascript
function Animal(nombre) {
    this.nombre = nombre;
}
Animal.prototype.saludar = function() {
    console.log(`Hola, soy ${this.nombre}`);
};

let perro = new Animal("Firulais");
perro.saludar(); // "Hola, soy Firulais"
```

Los prototipos son fundamentales para la herencia en JavaScript, permitiendo que los objetos compartan comportamientos sin duplicar código.

#### Métodos de objetos
Los métodos de objetos permiten trabajar con las propiedades de los mismos.
```javascript
let obj = { a: 1, b: 2 };
console.log(Object.keys(obj)); // ["a", "b"]
console.log(Object.values(obj)); // [1, 2]
console.log(Object.entries(obj)); // [["a", 1], ["b", 2]]
```
