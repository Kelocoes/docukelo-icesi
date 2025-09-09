---
sidebar_position: 1
---

# Typescript

¡Hola! Si has llegado hasta aquí, probablemente ya conoces la libertad (y a veces el caos) que puede ofrecer JavaScript. Aquí es cuando entra TypeScript para dale un poco de orden a esa libertad.

En esencia, TypeScript es un **superset de JavaScript** desarrollado por Microsoft que añade **tipado estático** y otras características modernas para mejorar la calidad, mantenibilidad y escalabilidad del código. Esto significa que **todo código JavaScript válido es también válido en TypeScript**, pero además TypeScript ofrece herramientas adicionales.

## 1. ¿Por qué usar TypeScript?

JavaScript es un lenguaje flexible y dinámico, pero esa flexibilidad puede llevar a errores difíciles de detectar. TypeScript ayuda a prevenirlos **antes de ejecutar el código** gracias al tipado estático y a herramientas de desarrollo más potentes.

**Ventajas principales:**

- **Tipado estático**: Evita errores comunes de tipo en tiempo de desarrollo
- **Mejor experiencia de desarrollo**: Autocompletado inteligente, refactoring seguro y navegación de código
- **Detección temprana de errores**: Los errores se detectan durante la compilación, no en producción
- **Compatibilidad moderna**: Uso de características modernas de JavaScript con transpilación automática
- **Escalabilidad**: Ideal para proyectos grandes y equipos de desarrollo
- **Documentación viviente**: Los tipos sirven como documentación del código

**Ejemplo de problema en JavaScript:**

```javascript
function sumar(a, b) {
  return a + b;
}

console.log(sumar(5, "10")); // Resultado: "510"
```

**Mismo ejemplo en TypeScript:**

```typescript
function sumar(a: number, b: number): number {
  return a + b;
}

// console.log(sumar(5, "10")); // Error: Argument of type 'string' is not assignable to parameter of type 'number'.
console.log(sumar(5, 10)); // 15
```

---

## 2. Instalación y configuración básica

### 2.1 Instalación global

Inicialmente necesitas tener **Node.js y npm** instalados. Luego de eso, escribe en la terminal:

```bash
npm install -g typescript
```

Verifica que está instalado con:

```bash
tsc -v
```

### 2.2 Inicializar un proyecto con TypeScript

Antes de escribir código, necesitamos preparar el proyecto. Con estos comandos crearás la carpeta, instalarás TypeScript:

```bash
mkdir proyecto-ts
cd proyecto-ts
npm init -y
npm install typescript --save-dev
```

Con esta linea de código crearás el archivo de configuración `tsconfig.json`:

```bash
  npx tsc --init
  ```

  Esto genera el archivo tsconfig.json con muchas opciones comentadas. Las opciones más útiles para empezar:

```json
{
  "compilerOptions": {
    "target": "es6", // Versión de JS a generar
    "module": "commonjs", // Sistema de módulos
    "outDir": "./dist", // Carpeta de salida
    "rootDir": "./src", // Carpeta de código fuente
    "strict": true, // Habilitar todas las comprobaciones estrictas
    "esModuleInterop": true // Mejor compatibilidad con módulos
  }
}
```

Estructura recomendada del proyecto:

```
proyecto-ts/
├── src/
│   └── index.ts
├── dist/
├── package.json
└── tsconfig.json
```

### 2.3 Compilar y ejecutar

Una vez tengas tu código en TypeScript, necesitas transformarlo a JavaScript para que pueda correr en Node. Para compilar debes escribir esto:

```bash
npx tsc
```

Esto convierte tus archivos `.ts` en archivos `.js` dentro de la carpeta `dist/`.

Para ejecutar:

```bash
node dist/index.js
```

Si prefieres evitar la compilación previa y correr TypeScript directamente, podemos usar `ts-node`:

```bash
npm install -D ts-node
npx ts-node src/index.ts
```

De esta forma podrás probar tu código en un solo paso, ideal mientras aprendes o desarrollas rápido.

---

## 3. Tipos básicos en TypeScript

TypeScript añade tipos estáticos que permiten definir qué tipo de dato esperamos.

```typescript
let nombre: string = "Kevin";
let edad: number = 25;
let activo: boolean = true;
let indefinido: undefined = undefined;
let nulo: null = null;
let cualquiera: any = "Hola"; // Evitar en lo posible
```

**Arreglos:**

En TypeScript también podemos indicar qué tipo de datos contendrá un arreglo.

```typescript
let numeros: number[] = [1, 2, 3];
let letras: Array<string> = ["a", "b", "c"];
```

**Tuplas:**

Una tupla es como un arreglo con un número fijo de posiciones y tipos ya definidos. Aquí TypeScript sabe que el primer valor debe ser texto y el segundo un número.

```typescript
let persona: [string, number] = ["Kevin", 25];
```

**Enums:**

Los enums permiten dar nombres más claros a un conjunto de valores. Son útiles para evitar usar valores “mágicos” en el código y mantener todo más legible.

```typescript
enum Color {
  Rojo = "ROJO",
  Verde = "VERDE",
  Azul = "AZUL",
}

let colorFav: Color = Color.Verde;
console.log(colorFav); // "VERDE"
```

**Union types:**

A veces una variable puede ser de más de un tipo. Con `|` le decimos a TypeScript que acepte varias opciones.

```typescript
let id: string | number;
id = "ABC123";
id = 42;
```

**Type aliases:**

Para no repetirnos, podemos crear un nombre que represente esa unión de tipos y reutilizarlo en cualquier parte.

```typescript
type ID = string | number;
let usuarioID: ID = 101;
```

---

## 4. Funciones en TypeScript

En TypeScript también podemos especificar los tipos de los parámetros y del valor que devuelve una función. Esto evita errores y hace el código más fácil de entender.

```typescript
function saludar(nombre: string): string {
  return `Hola, ${nombre}`;
}

console.log(saludar("Kevin")); // "Hola, Kevin"
```

**Parámetros opcionales y valores por defecto**

- Un parámetro por defecto tiene un valor asignado si no se pasa nada.
- Un parámetro opcional (con `?`) puede omitirse.

```typescript
function multiplicar(a: number, b: number = 2, mensaje?: string): number {
  if (mensaje) console.log(mensaje);
  return a * b;
}

console.log(multiplicar(3)); // usa b = 2 → 6
console.log(multiplicar(3, 4, "Calculando...")); // muestra mensaje → 12
```

**Funciones flecha**

Las funciones flecha son una forma más corta de escribir funciones y también se pueden tipar.

```typescript
const dividir = (a: number, b: number): number => a / b;

console.log(dividir(10, 2)); // 5
```

La clave es que, al tipar funciones, siempre sabes qué esperas recibir y qué vas a devolver, lo que da seguridad y orden al código.

---

## 5. Interfaces y Objetos

En TypeScript, una interface sirve para describir la forma que debe tener un objeto: qué propiedades tiene, de qué tipo son y si alguna es opcional. Esto ayuda a mantener el código consistente y fácil de entender.

```typescript
interface Usuario {
  id: number;
  nombre: string;
  activo?: boolean; // dato opcional
}

let user1: Usuario = {
  id: 1,
  nombre: "Kevin",
};
```

Aquí `user1` debe cumplir con la estructura definida en Usuario. Si intentamos agregar un dato que no existe en la interfaz, TypeScript nos avisará.

**Interfaces con funciones:**

Las interfaces no solo sirven para objetos, también pueden usarse para definir la firma de una función, es decir, los parámetros que recibe y lo que devuelve.

```typescript
interface Operacion {
  (a: number, b: number): number;
}

const sumar: Operacion = (x, y) => x + y;
console.log(sumar(5, 3));
```

De esta manera, nos aseguramos de que cualquier función que usemos como Operacion reciba dos números y devuelva un número.

---

## 6. Clases en TypeScript

En TypeScript, las clases funcionan de forma similar a otros lenguajes orientados a objetos: son plantillas para crear objetos con propiedades y métodos.

```typescript
class Persona {
  private nombre: string; // solo accesible dentro de la clase
  protected edad: number; // accesible en esta clase y en clases hijas
  public activo: boolean; // accesible desde cualquier parte

  constructor(nombre: string, edad: number, activo: boolean) {
    this.nombre = nombre;
    this.edad = edad;
    this.activo = activo;
  }

  saludar(): string {
    return `Hola, soy ${this.nombre}`;
  }
}

const p1 = new Persona("Kevin", 25, true);
console.log(p1.saludar()); // "Hola, soy Kevin"
```

Aquí vemos tres modificadores de acceso:

- _private_ → solo dentro de la misma clase.
- _protected_ → dentro de la clase y sus herederas.
- _public_ → disponible en todas partes (valor por defecto).

**Herencia:**

Las clases pueden extenderse para crear nuevas con propiedades o comportamientos adicionales.

```typescript
class Estudiante extends Persona {
  curso: string;

  constructor(nombre: string, edad: number, activo: boolean, curso: string) {
    super(nombre, edad, activo); // llama al constructor de Persona
    this.curso = curso;
  }
}

const e1 = new Estudiante("Sofía", 22, true, "TypeScript básico");
console.log(e1.saludar()); // Hereda método de Persona
console.log(e1.curso); // Propiedad propia de Estudiante
```

Así, `Estudiante` hereda lo de `Persona`, pero también puede tener sus propios datos y método

---

## 7. Módulos en TypeScript

Cuando tu proyecto crece, no es buena idea meter todo el código en un solo archivo. Los módulos te permiten separar tu código en partes más pequeñas y reutilizables.

**Exportar:**

Si quieres que algo esté disponible fuera de un archivo, debes exportarlo:

```typescript
// archivo: utils.ts
export function sumar(a: number, b: number): number {
  return a + b;
}
```

Aquí la función `sumar` queda lista para ser usada en otros archivos.

**Importar:**

Para usar lo que exportaste, necesitas importarlo:

```typescript
// archivo: index.ts
import { sumar } from "./utils";
console.log(sumar(3, 4));
```

Piensa en los módulos como “cajitas” de código que puedes reutilizar luego. Esto mantiene tu proyecto organizado, fácil de mantener y escalable.

---

## 8. Tipos avanzados

**Generics:**

Los genéricos así como en Java nos permiten crear funciones y clases que pueden trabajar con diferentes tipos de datos sin perder la seguridad de tipos.
En ellos especificaremos un tipo genérico denotado por `<T>` el cual podemos usar en lugar de un tipo específico.

```typescript
function identidad<T>(valor: T): T {
  return valor;
}

console.log(identidad<string>("Hola"));
console.log(identidad<number>(123));
```

El ejemplo anterior muestra una función que recibe un valor de tipo genérico `T` y lo retorna sin modificarlo. Esto permite que la función sea flexible y reutilizable con diferentes tipos de datos.

**Intersection types:**

Estos tipos permiten combinar múltiples tipos en uno solo, creando un nuevo tipo que tiene todas las propiedades de los tipos combinados.

```typescript
interface A {
  a: string;
}
interface B {
  b: number;
}
// Lo mismo que interface C { a: string; b: number; }

type AB = A & B;
let obj: AB = { a: "Hola", b: 42 };
```

---

## 9. Ejecución en el navegador

TypeScript no se entiende directamente con el navegador, porque este solo sabe leer JavaScript.
Por eso, primero necesitamos compilar nuestros archivos `.ts` a `.js`, y luego incluirlos en el HTML.

El flujo es simple:

1. Escribes en TypeScript
2. Lo compilas con `tsc`
3. Cargas el archivo compilado .js en tu HTML.

**Ejemplo:**

```typescript
// src/app.ts
const mensaje: string = "Hola desde TS";
console.log(mensaje);
```

```html
<!-- index.html -->
<script src="dist/app.js"></script>
```

---

## 10. Interface vs Type Alias

En TypeScript, tanto **interfaces** como **type aliases** se usan para definir tipos, pero cada uno brilla en escenarios distintos.

**Interfaces**:

- Ideales para describir la forma de un objeto.
- Se pueden extender (herencia de interfaces).
- Muy útiles cuando quieres definir contratos claros entre distintas partes del código.

```typescript
interface Usuario {
  id: number;
  nombre: string;
}
```

_Piensa en una interface como un molde que describe cómo debe verse un objeto._

**Type Aliases**:

- Más flexibles: permiten definir uniones, tuplas y hasta tipos primitivos.
- No pueden extenderse igual que las interfaces.
- Perfectos cuando necesitas tipos que no son solo objetos.

```typescript
type ID = string | number;
type Usuario = {
  id: ID;
  nombre: string;
};
```

_Un type alias es como un atajo: le das un nombre a un tipo (simple o complejo) para reutilizarlo._

### Ejemplo: Algo que se puede hacer con `type` pero no con `interface`

Los `type aliases` permiten definir uniones de tipos, algo que no es posible directamente con `interface`.

```typescript
type Resultado = string | number;

let respuesta: Resultado;
respuesta = "Éxito";
respuesta = 42;

// Esto no se puede hacer con `interface`.
```

En este caso, `Resultado` puede ser un `string` o un `number`, lo que lo hace más flexible para ciertos escenarios. Las interfaces, por otro lado, están diseñadas para describir la forma de objetos y no soportan uniones de tipos.

---

## 11. Recomendaciones

Para sacarle el máximo provecho a TypeScript, ten en cuenta estas buenas prácticas:

- **Activa `"strict": true` en tu `tsconfig.json`** → así aprovechas todas las comprobaciones de seguridad.
- **Evita usar `any`** → es como apagar el radar de TypeScript; úsalo solo en casos extremos.
- **Prefiere interfaces y tipos** → definen contratos claros y mantienen tu código ordenado.
- **Deja que el editor trabaje por ti** → usa el autocompletado y las sugerencias de errores, son tus mejores aliados.
- **Compila seguido** → así detectas problemas cuanto antes, sin sorpresas al final.

_La idea no es escribir más código, sino escribir mejor código._

---
