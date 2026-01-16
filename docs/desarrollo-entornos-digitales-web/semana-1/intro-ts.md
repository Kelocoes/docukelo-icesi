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

