---
sidebar_position: 3
---

# Typescript

TypeScript es un **superset de JavaScript** desarrollado por Microsoft que añade **tipado estático** y otras características modernas para mejorar la calidad, mantenibilidad y escalabilidad del código. Esto significa que **todo código JavaScript válido es también válido en TypeScript**, pero además TypeScript ofrece herramientas adicionales.

## 1. ¿Por qué usar TypeScript?

JavaScript es un lenguaje flexible y dinámico, pero esa flexibilidad puede llevar a errores difíciles de detectar. TypeScript ayuda a prevenirlos **antes de ejecutar el código** gracias al tipado estático y a herramientas de desarrollo más potentes.

**Ventajas principales:**

- Tipado estático (evita errores comunes de tipo).
- Autocompletado y mejor soporte en editores como VS Code.
- Detección de errores en tiempo de compilación.
- Uso de características modernas de JavaScript incluso antes de que estén soportadas por todos los navegadores.
- Código más fácil de mantener.

**Ejemplo de problema en JavaScript:**

```javascript
function sumar(a, b) {
  return a + b;
}

console.log(sumar(5, "10")); // "510" en vez de 15
```

**Solución en TypeScript:**

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

Necesitamos Node.js y npm instalados.

```bash
npm install -g typescript
```

Verificar instalación:

```bash
tsc -v
```

### 2.2 Inicializar un proyecto con TypeScript

```bash
mkdir proyecto-ts
cd proyecto-ts
npm init -y
npm install typescript --save-dev
```

Generar el archivo de configuración `tsconfig.json`:

```bash
npx tsc --init
```

Esto creará un archivo con muchas opciones comentadas. Las más importantes para empezar:

```json
{
  "compilerOptions": {
    "target": "es6",               // Versión de JS a generar
    "module": "commonjs",          // Sistema de módulos
    "outDir": "./dist",            // Carpeta de salida
    "rootDir": "./src",            // Carpeta de código fuente
    "strict": true,                 // Habilitar todas las comprobaciones estrictas
    "esModuleInterop": true         // Mejor compatibilidad con módulos
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

Para compilar:

```bash
npx tsc
```

Esto generará archivos `.js` en `dist/`.

Para ejecutar:

```bash
node dist/index.js
```

Si queremos compilar y ejecutar en un solo paso, podemos usar `ts-node`:

```bash
npm install -D ts-node
npx ts-node src/index.ts
```

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

```typescript
let numeros: number[] = [1, 2, 3];
let letras: Array<string> = ["a", "b", "c"];
```

**Tuplas:**

```typescript
let persona: [string, number] = ["Kevin", 25];
```

**Enums:**

```typescript
enum Color {
  Rojo = "ROJO",
  Verde = "VERDE",
  Azul = "AZUL"
}

let colorFav: Color = Color.Verde;
console.log(colorFav); // "VERDE"
```

**Union types:**

```typescript
let id: string | number;
id = "ABC123";
id = 42;
```

**Type aliases:**

```typescript
type ID = string | number;
let usuarioID: ID = 101;
```

---

## 4. Funciones en TypeScript

Podemos tipar parámetros y valores de retorno.

```typescript
function saludar(nombre: string): string {
  return `Hola, ${nombre}`;
}

console.log(saludar("Kevin"));
```

Parámetros opcionales y por defecto:

```typescript
function multiplicar(a: number, b: number = 2, mensaje?: string): number {
  if (mensaje) console.log(mensaje);
  return a * b;
}

console.log(multiplicar(3));
console.log(multiplicar(3, 4, "Calculando..."));
```

Funciones flecha:

```typescript
const dividir = (a: number, b: number): number => a / b;
```

---

## 5. Interfaces y Objetos

Las interfaces definen la forma de un objeto.

```typescript
interface Usuario {
  id: number;
  nombre: string;
  activo?: boolean; // opcional
}

let user1: Usuario = {
  id: 1,
  nombre: "Kevin"
};
```

Interfaces con funciones:

```typescript
interface Operacion {
  (a: number, b: number): number;
}

const sumar: Operacion = (x, y) => x + y;
console.log(sumar(5, 3));
```

---

## 6. Clases en TypeScript

```typescript
class Persona {
  private nombre: string;
  protected edad: number;
  public activo: boolean;

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
console.log(p1.saludar());
```

Herencia:

```typescript
class Estudiante extends Persona {
  curso: string;
  constructor(nombre: string, edad: number, activo: boolean, curso: string) {
    super(nombre, edad, activo);
    this.curso = curso;
  }
}
```

---

## 7. Módulos en TypeScript

**Exportar:**

```typescript
// archivo: utils.ts
export function sumar(a: number, b: number): number {
  return a + b;
}
```

**Importar:**

```typescript
// archivo: index.ts
import { sumar } from "./utils";
console.log(sumar(3, 4));
```

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

El ejeemplo anterior muestra una función que recibe un valor de tipo genérico `T` y lo retorna sin modificarlo. Esto permite que la función sea flexible y reutilizable con diferentes tipos de datos.

**Intersection types:**

Estos tipos permiten combinar múltiples tipos en uno solo, creando un nuevo tipo que tiene todas las propiedades de los tipos combinados.

```typescript
interface A { a: string; }
interface B { b: number; }
// Lo mismo que interface C { a: string; b: number; }

type AB = A & B;
let obj: AB = { a: "Hola", b: 42 };
```

---

## 9. Ejecución en el navegador

Para usar TypeScript en el navegador:

1. Compilar a JavaScript.
2. Incluir el archivo `.js` en el HTML.

Ejemplo:

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

En TypeScript, tanto las interfaces como los type aliases se utilizan para definir tipos, pero tienen algunas diferencias clave:

- **Interfaces**: Se utilizan principalmente para definir la forma de un objeto. Pueden ser extendidas y son ideales para definir contratos claros entre diferentes partes del código.

```typescript
interface Usuario {
  id: number;
  nombre: string;
}
```

- **Type Aliases**: Se utilizan para definir tipos más complejos, incluyendo uniones, tuplas y tipos primitivos. No pueden ser extendidos como las interfaces, pero son más flexibles.

```typescript
type ID = string | number;
type Usuario = {
  id: ID;
  nombre: string;
};
```

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

- Activar `strict` en `tsconfig.json`.
- Evitar el uso de `any`.
- Usar interfaces y tipos para definir contratos claros.
- Aprovechar autocompletado y análisis estático del editor.
- Compilar frecuentemente para detectar errores temprano.

---

## Cuestionario de Autoevaluación

<Quiz id="web-env-intro-ts-quiz">
  <Question title="¿Qué significa que TypeScript sea un 'superset' de JavaScript?">
    <Option>Que reemplaza por completo a JavaScript y no se ejecuta sobre Node.js.</Option>
    <Option correct>Que incluye toda la sintaxis y características de JavaScript, agregándole características adicionales como tipado estático.</Option>
    <Option>Que solo funciona en el backend y no puede compilarse para navegadores web.</Option>
    <Option>Que es un framework de CSS basado en clases utilitarias.</Option>
  </Question>
  <Question title="¿En qué momento detecta TypeScript los errores de tipo en el código?">
    <Option>Únicamente al desplegar en producción.</Option>
    <Option correct>En tiempo de compilación (o análisis estático en el editor) antes de ejecutar el código.</Option>
    <Option>En tiempo de ejecución (runtime) cuando el usuario hace clic.</Option>
    <Option>Solamente al reiniciar el servidor web.</Option>
  </Question>
  <Question title="¿Qué sucede con el código 'let nombre = &quot;Kevin&quot;' en TypeScript al intentar hacer 'nombre = 42' posteriormente?">
    <Option>Cambia el tipo dinámicamente a number sin advertencias.</Option>
    <Option correct>Lanza un error de compilación debido a la inferencia de tipos (Type Inference).</Option>
    <Option>Convierte automáticamente 42 al string &quot;42&quot;.</Option>
    <Option>Elimina la variable de la memoria.</Option>
  </Question>
  <Question title="¿Cuál es el comando oficial del compilador de TypeScript para transpilar archivos .ts a .js?">
    <Option>npm run build-ts</Option>
    <Option>node compile</Option>
    <Option correct>tsc</Option>
    <Option>ts-run</Option>
  </Question>
  <Question title="¿Para qué sirve el archivo tsconfig.json en un proyecto de TypeScript?">
    <Option>Para instalar dependencias de terceros desde npm.</Option>
    <Option correct>Para especificar la configuración del compilador y las opciones de transpilación del proyecto.</Option>
    <Option>Para definir los estilos CSS globales de la aplicación.</Option>
    <Option>Para almacenar las claves secretas de la base de datos.</Option>
  </Question>
  <Question title="En tsconfig.json, ¿qué realiza la opción '&quot;strict&quot;: true'?">
    <Option>Prohíbe el uso de funciones flecha en todo el código.</Option>
    <Option correct>Habilita un rango amplio de comprobaciones de tipo estrictas para garantizar mayor seguridad de código.</Option>
    <Option>Fuerza a que todos los archivos se guarden en formato minificado.</Option>
    <Option>Impide la importación de librerías externas.</Option>
  </Question>
  <Question title="¿Cómo se declara una tupla en TypeScript que contenga una cadena en la primera posición y un número en la segunda?">
    <Option>let tuple: (string | number)[] = [&quot;Kevin&quot;, 25];</Option>
    <Option correct>let tuple: [string, number] = [&quot;Kevin&quot;, 25];</Option>
    <Option>let tuple: Array&lt;string, number&gt; = [&quot;Kevin&quot;, 25];</Option>
    <Option>let tuple: &#123; string, number &#125; = [&quot;Kevin&quot;, 25];</Option>
  </Question>
  <Question title="¿Cuál es la principal ventaja de utilizar un 'enum' en TypeScript?">
    <Option>Permite ejecutar código de forma asíncrona sin usar Promesas.</Option>
    <Option correct>Permite definir un conjunto de constantes nombradas, haciendo el código más legible y seguro.</Option>
    <Option>Transforma objetos de JavaScript en tablas SQL.</Option>
    <Option>Reduce el tamaño final del archivo HTML.</Option>
  </Question>
  <Question title="¿Qué sintaxis se utiliza para indicar que una propiedad dentro de una 'interface' es opcional?">
    <Option>Agregar la palabra clave 'optional' antes del nombre de la propiedad.</Option>
    <Option>Encerrar el nombre de la propiedad entre corchetes '[propiedad]'.</Option>
    <Option correct>Agregar un signo de interrogación '?' al final del nombre de la propiedad.</Option>
    <Option>Asignar el valor por defecto 'null' explícitamente.</Option>
  </Question>
  <Question title="¿Qué es un Union Type (A | B) en TypeScript?">
    <Option>Un tipo que exige que una variable cumpla simultáneamente con todas las propiedades de A y de B.</Option>
    <Option correct>Un tipo que permite que una variable adopte un valor de tipo A o de tipo B.</Option>
    <Option>Una función que une dos arreglos en uno solo.</Option>
    <Option>Un método de compilación cruzada para navegadores antiguos.</Option>
  </Question>
  <Question title="¿Cuál es la forma correcta de tipar el valor de retorno de una función que no retorna ningún valor en TypeScript?">
    <Option>function test(): null</Option>
    <Option>function test(): undefined</Option>
    <Option correct>function test(): void</Option>
    <Option>function test(): never</Option>
  </Question>
  <Question title="¿Qué diferencia existe entre un modificador de acceso 'private' y 'protected' en una clase de TypeScript?">
    <Option correct>Private solo permite acceso dentro de la misma clase; protected permite acceso en la misma clase y en sus subclases heredadas.</Option>
    <Option>Private se evalúa en tiempo de compilación y protected en runtime.</Option>
    <Option>Protected prohíbe la modificación del valor, mientras que private lo permite.</Option>
    <Option>No hay diferencia; ambos modificadores son exactamente idénticos.</Option>
  </Question>
  <Question title="¿Qué herramienta permite compilar y ejecutar directamente archivos de TypeScript en desarrollo sin generar manualmente los archivos de salida?">
    <Option>nodemon-js</Option>
    <Option correct>ts-node</Option>
    <Option>tsc-build</Option>
    <Option>babel-preset</Option>
  </Question>
  <Question title="¿Para qué se utilizan los Genéricos (&lt;T&gt;) en TypeScript?">
    <Option>Para convertir tipos estáticos en el tipo 'any' sin advertencias.</Option>
    <Option correct>Para crear componentes, funciones o clases reutilizables que trabajen con diversos tipos de datos manteniendo la seguridad de tipos.</Option>
    <Option>Para importar módulos de Node.js mediante sintaxis CommonJS.</Option>
    <Option>Para declarar variables cuyo valor cambia automáticamente cada segundo.</Option>
  </Question>
  <Question title="¿Qué resulta del uso del operador de intersección ('&amp;') entre dos tipos o interfaces?">
    <Option>Un tipo que solo acepta valores presentes en ambos tipos a la vez como una selección exclusiva.</Option>
    <Option correct>Un nuevo tipo que combina todas las propiedades y miembros de ambos tipos en uno solo.</Option>
    <Option>Un arreglo con los nombres de las claves de ambos tipos.</Option>
    <Option>Un error de sintaxis si se utiliza fuera de una clase.</Option>
  </Question>
  <Question title="¿Cuál es una diferencia clave entre 'interface' y 'type' alias?">
    <Option correct>Las interfaces se enfocan en definir la forma de objetos y pueden ser extendidas/fusionadas, mientras que los type aliases permiten definir uniones, tuplas y tipos primitivos complejos.</Option>
    <Option>Las interfaces solo funcionan con cadenas de texto y los types con números.</Option>
    <Option>Los type aliases desaparecen al compilar pero las interfaces se envían al navegador.</Option>
    <Option>No existe ninguna diferencia; son exactamente lo mismo en cualquier escenario.</Option>
  </Question>
  <Question title="Si declaras una función con parámetros opcionales y por defecto como 'function calc(a: number, b: number = 5, c?: string)', ¿cuál es el tipo inferido para el retorno si devuelve 'a + b'?">
    <Option>string</Option>
    <Option correct>number</Option>
    <Option>void</Option>
    <Option>any</Option>
  </Question>
  <Question title="¿Por qué la buena práctica en TypeScript recomienda evitar el uso del tipo 'any'?">
    <Option>Porque reduce la velocidad de carga de la página web.</Option>
    <Option correct>Porque desactiva la comprobación estática de tipos, anulando los beneficios de seguridad que proporciona TypeScript.</Option>
    <Option>Porque el navegador lanzará un error fatal al encontrar la palabra 'any'.</Option>
    <Option>Porque solo está permitido dentro de archivos JSON.</Option>
  </Question>
  <Question title="¿Cómo se exporta e importa una función 'sumar' entre módulos usando la sintaxis estándar de ES Modules en TypeScript?">
    <Option>export = &#123; sumar &#125;; / const sumar = require('./utils');</Option>
    <Option correct>export function sumar(...) &#123; ... &#125; / import &#123; sumar &#125; from './utils';</Option>
    <Option>module.exports = sumar; / include './utils';</Option>
    <Option>public sumar() / fetch('./utils');</Option>
  </Question>

  <Question title="¿Qué sucede cuando transpilas un archivo .ts a JavaScript y lo ejecutas en un navegador web?">
    <Option>El navegador ejecuta directamente las anotaciones de tipo de TypeScript.</Option>
    <Option correct>El compilador 'tsc' elimina todas las anotaciones de tipo y produce código JavaScript válido compatible con los navegadores.</Option>
    <Option>Se requiere instalar un plugin especial de TypeScript en el navegador del usuario final.</Option>
    <Option>El archivo generado solo puede ser interpretado por servidores Windows.</Option>
  </Question>
</Quiz>


