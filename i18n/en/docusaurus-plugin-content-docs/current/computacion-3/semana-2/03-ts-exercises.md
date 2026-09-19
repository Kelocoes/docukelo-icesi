---
sidebar_position: 3
---

# TypeScript Exercises

This document contains 28 practical exercises designed to master TypeScript. Each exercise includes:
- Starting **JavaScript** code.
- A **hint** identifying the target TypeScript feature and its purpose.
- A **hidden solution** inside `<details>` allowing students to attempt the problem first.

Exercises progress with gradually increasing difficulty.

---

### Exercise 1: Simple Addition (Basic Types)

```javascript
// Convert to TypeScript
function sumar(a, b) {
  return a + b;
}
```

**Hint:** Use `number` types for both parameters and the return type. `number` represents numeric values and prevents passing strings by mistake.

<details>
<summary>💡 View Solution</summary>

```typescript
function sumar(a: number, b: number): number {
  return a + b;
}
```

</details>

---

### Exercise 2: Optional and Default Parameters

```javascript
// Convert to TypeScript
function saludar(nombre, saludo) {
  saludo = saludo || "Hola";
  return `${saludo}, ${nombre}`;
}
```

**Hint:** Use `?` for optional parameters and default assignment values. `param?: T` indicates optionality, while `= defaultValue` assigns a fallback value.

<details>
<summary>💡 View Solution</summary>

```typescript
function saludar(nombre: string, saludo: string = "Hola"): string {
  return `${saludo}, ${nombre}`;
}
```

</details>

---

### Exercise 3: Defining an Object with an Interface

```javascript
// Convert to TypeScript
const crearUsuario = (u) => {
  return `Usuario ${u.nombre} creado con id ${u.id}`;
};
```

**Hint:** Use `interface` to declare the shape of the `User` object. `interface` defines clear contracts across parts of your application.

<details>
<summary>💡 View Solution</summary>

```typescript
interface Usuario {
  id: number;
  nombre: string;
  email?: string; // opcional
}

const crearUsuario = (u: Usuario): string => {
  return `Usuario ${u.nombre} creado con id ${u.id}`;
};
```

</details>

---

### Exercise 4: Readonly and Literal Types

```javascript
// Convert to TypeScript
const config = {
  mode: "production",
  version: "1.0.0"
};
```

**Pista:** Usa `readonly` para propiedades inmutables y un *union type* literal (por ejemplo `"dev" | "prod"`). `readonly` evita reasignaciones accidentales.

<details>
<summary>💡 View Solution</summary>

```typescript
type Mode = "development" | "production" | "test";

interface Config {
  readonly mode: Mode;
  readonly version: string;
}

const config: Config = {
  mode: "production",
  version: "1.0.0"
};

// config.version = '1.0.1' // Error: no se puede asignar a 'version' porque es readonly
```

</details>

---

### Exercise 5: Tuples

```javascript
// Convert to TypeScript
function crearPar(nombre, edad) {
  return [nombre, edad];
}
```

**Pista:** Usa una tupla `[string, number]` para representar `(nombre, edad)`. Las tuplas permiten tipos fijos en posiciones concretas.

<details>
<summary>💡 View Solution</summary>

```typescript
function crearPar(nombre: string, edad: number): [string, number] {
  return [nombre, edad];
}

const p = crearPar("Ana", 30);
```

</details>

---

### Exercise 6: Enums for State Management

```javascript
// Convert to TypeScript
const estado = "Activo"; // puede ser 'Activo' o 'Inactivo'
```

**Pista:** Usa `enum` para representar un conjunto de valores nombrados. `enum` ayuda a mantener valores constantes legibles y seguros.

<details>
<summary>💡 View Solution</summary>

```typescript
enum Estado {
  Activo = "Activo",
  Inactivo = "Inactivo"
}

const estado: Estado = Estado.Activo;
```

</details>

---

### Exercise 7: Generics: Identity Function

```javascript
// Convert to TypeScript
function identidad(x) {
  return x;
}
```

**Pista:** Usa `generics` (`<T>`) para que la función preserve y acepte cualquier tipo. Los genéricos permiten escribir funciones y tipos reutilizables y tipados.

<details>
<summary>💡 View Solution</summary>

```typescript
function identidad<T>(x: T): T {
  return x;
}

const a = identidad<number>(123);
const b = identidad("hola");
```

</details>

---

### Exercise 8: Generics with Constraints (length)

```javascript
// Convert to TypeScript
function cuentaLongitud(x) {
  return x.length;
}
```

**Pista:** Usa `T extends { length: number }` para restringir a tipos que tengan `length`. Esto garantiza que `x.length` existe.

<details>
<summary>💡 View Solution</summary>

```typescript
function cuentaLongitud<T extends { length: number }>(x: T): number {
  return x.length;
}

console.log(cuentaLongitud('hola')); // 4
console.log(cuentaLongitud([1,2,3])); // 3
```

</details>

---

### Exercise 9: Union Types and Type Narrowing

```javascript
// Convert to TypeScript
function formatear(x) {
  if (typeof x === 'number') {
    return x.toFixed(2);
  }
  return x.trim();
}
```

**Pista:** Usa `string | number` y `typeof` para hacer *narrowing*. `typeof` permite distinguir tipos primitivos en tiempo de ejecución.

<details>
<summary>💡 View Solution</summary>

```typescript
function formatear(x: string | number): string {
  if (typeof x === 'number') {
    return x.toFixed(2);
  }
  return x.trim();
}
```

</details>

---

### Exercise 10: Type Guard with `in`

```javascript
// Convert to TypeScript
function descripcion(animal) {
  if (animal.nombre) {
    return `Animal: ${animal.nombre}`;
  }
  return 'Anónimo';
}
```

**Pista:** Usa `in` para comprobar presencia de una propiedad (p.ej. `if ('nombre' in animal)`). Esto sirve como *type guard* para objetos con distintas formas.

<details>
<summary>💡 View Solution</summary>

```typescript
type Gato = { nombre: string; ronronea: boolean };
type Pez = { tipo: string; nada: boolean };

function descripcion(animal: Gato | Pez): string {
  if ('nombre' in animal) {
    return `Animal: ${animal.nombre}`;
  }
  return 'Anónimo';
}
```

</details>

---

### Exercise 11: Narrowing with `instanceof`

```javascript
// Convert to TypeScript
class A { constructor() {} }
class B { constructor() {} }

function esA(x) {
  if (x instanceof A) return true;
  return false;
}
```

**Pista:** Usa clases y `instanceof` para distinguir instancias en tiempo de ejecución. `instanceof` es útil con clases y permite inferir el tipo dentro del bloque.

<details>
<summary>💡 View Solution</summary>

```typescript
class A { a = 1 }
class B { b = 2 }

function esA(x: A | B): boolean {
  if (x instanceof A) return true;
  return false;
}

const a = new A();
console.log(esA(a));
```

</details>

---

### Exercise 12: Discriminated Unions (Geometric Shapes)

```javascript
// Convert to TypeScript
function area(shape) {
  if (shape.kind === 'circle') {
    return Math.PI * shape.radius * shape.radius;
  }
  return shape.size * shape.size;
}
```

**Pista:** Usa `type` con una propiedad literal discriminante `kind`. Las uniones discriminadas facilitan el *narrowing* y la seguridad de tipos.

<details>
<summary>💡 View Solution</summary>

```typescript
type Circulo = { kind: 'circle'; radius: number };
type Cuadrado = { kind: 'square'; size: number };
type Shape = Circulo | Cuadrado;

function area(shape: Shape): number {
  if (shape.kind === 'circle') {
    return Math.PI * shape.radius * shape.radius;
  }
  return shape.size * shape.size;
}
```

</details>

---

### Exercise 13: keyof and Pluck Operator

```javascript
// Convert to TypeScript
function pluck(obj, keys) {
  return keys.map(k => obj[k]);
}
```

**Pista:** Usa `keyof` y genéricos `K extends keyof T` para asegurar que las claves existen en `obj`. `keyof` obtiene las claves de un tipo.

<details>
<summary>💡 View Solution</summary>

```typescript
function pluck<T, K extends keyof T>(obj: T, keys: K[]): T[K][] {
  return keys.map(k => obj[k]);
}

const persona = { nombre: 'Ana', edad: 28 };
const resultados = pluck(persona, ['nombre']); // tipo: string[]
```

</details>

---

### Exercise 14: Utility Type: Pick

```javascript
// Convert to TypeScript
const user = { id: 1, nombre: 'Ana', password: '123' };
// Queremos un objeto público sin password
```

**Pista:** Usa `Pick<T, K>` para construir un nuevo tipo con solo algunas propiedades. `Pick` sirve para exponer solo un subconjunto del tipo original.

<details>
<summary>💡 View Solution</summary>

```typescript
interface Usuario {
  id: number;
  nombre: string;
  password: string;
}

type UsuarioPublico = Pick<Usuario, 'id' | 'nombre'>;

const user: UsuarioPublico = { id: 1, nombre: 'Ana' };
```

</details>

---

### Exercise 15: Utility Type: Omit

```javascript
// Convert to TypeScript
const user = { id: 1, nombre: 'Ana', password: '123' };
// Queremos un usuario sin password
```

**Pista:** Usa `Omit<T, K>` para crear un tipo sin ciertas propiedades. `Omit` es útil para eliminar campos sensibles como contraseña.

<details>
<summary>💡 View Solution</summary>

```typescript
interface Usuario {
  id: number;
  nombre: string;
  password: string;
}

type UsuarioSinPassword = Omit<Usuario, 'password'>;

const safeUser: UsuarioSinPassword = { id: 1, nombre: 'Ana' };
```

</details>

---

### Exercise 16: Partial and Required

```javascript
// Convert to TypeScript
function actualizar(usuario, cambios) {
  return { ...usuario, ...cambios };
}
```

**Pista:** Usa `Partial<T>` para permitir objetos con propiedades opcionales en `cambios`. `Partial` convierte todas las propiedades en opcionales; `Required` hace lo contrario.

<details>
<summary>💡 View Solution</summary>

```typescript
interface Usuario {
  id: number;
  nombre: string;
  email?: string;
}

function actualizar(usuario: Usuario, cambios: Partial<Usuario>): Usuario {
  return { ...usuario, ...cambios };
}

const u: Usuario = { id: 1, nombre: 'Ana' };
const actualizado = actualizar(u, { email: 'a@b.com' });
```

</details>

---

### Exercise 17: ReadonlyArray and readonly

```javascript
// Convert to TypeScript
const nums = [1,2,3];
nums.push(4); // debería no permitirse si queremos inmutabilidad
```

**Pista:** Usa `readonly` o `ReadonlyArray<T>` para arrays inmutables. `readonly` evita métodos mutativos como `push` o `splice` en tiempo de compilación.

<details>
<summary>💡 View Solution</summary>

```typescript
const nums: ReadonlyArray<number> = [1, 2, 3];
// nums.push(4); // Error: Property 'push' does not exist on type 'readonly number[]'.
```

</details>

---

### Exercise 18: Function Overloading

```javascript
// Convert to TypeScript
function combinar(a, b) {
  if (typeof a === 'number' && typeof b === 'number') return a + b;
  return `${a}${b}`;
}
```

**Pista:** Usa *overloads* (declaraciones de firma) para expresar que la función puede aceptar y devolver distintos tipos. Esto mejora la inferencia para quien la use.

<details>
<summary>💡 View Solution</summary>

```typescript
function combinar(a: number, b: number): number;
function combinar(a: string, b: string): string;
function combinar(a: any, b: any): any {
  if (typeof a === 'number' && typeof b === 'number') return a + b;
  return `${a}${b}`;
}

const n = combinar(1, 2); // number
const s = combinar('a', 'b'); // string
```

</details>

---

### Exercise 19: Mapped Types: Creating Optionalize

```javascript
// Convert to TypeScript
// Queremos un tipo igual al original pero con todas las propiedades opcionales
```

**Pista:** Crea un mapped type `Optionalize<T>` con `[P in keyof T]?: T[P]`. Los mapped types transforman propiedades de un tipo a través de `keyof`.

<details>
<summary>💡 View Solution</summary>

```typescript
type Optionalize<T> = { [P in keyof T]?: T[P] };

interface Persona {
  id: number;
  nombre: string;
}

type PersonaOpcional = Optionalize<Persona>; // { id?: number; nombre?: string }
```

</details>

---

### Exercise 20: Simple Conditional Types

```javascript
// Convert to TypeScript
// Queremos un tipo que sea 'yes' si T es string, y 'no' en caso contrario
```

**Pista:** Usa `T extends U ? X : Y` para crear tipos condicionales. Sirven para calcular tipos basados en otros.

<details>
<summary>💡 View Solution</summary>

```typescript
type IsString<T> = T extends string ? 'yes' : 'no';

type A = IsString<string>; // 'yes'
type B = IsString<number>; // 'no'
```

</details>

---

### Exercise 21: unknown vs any

```javascript
// Convert to TypeScript
function parse(json) {
  return JSON.parse(json);
}
```

**Pista:** Usa `unknown` como tipo de retorno de parse y *narrowing* antes de usarlo. `unknown` obliga a comprobar el tipo antes de operar, a diferencia de `any`.

<details>
<summary>💡 View Solution</summary>

```typescript
function parse(json: string): unknown {
  return JSON.parse(json);
}

const data = parse('{"x":1}');
if (typeof data === 'object' && data !== null && 'x' in data) {
  // ahora TypeScript permite acceso seguro
  console.log((data as any).x);
}
```

</details>

---

### Exercise 22: never and Exhaustive Type Checking

```javascript
// Convert to TypeScript
function procesar(valor) {
  switch(valor) {
    case 'a': return 1;
    case 'b': return 2;
  }
}
```

**Pista:** Usa un `never` en la rama `default` para forzar exhaustividad (`assertNever`). `never` representa valores que nunca ocurren y ayuda a detectar casos no manejados.

<details>
<summary>💡 View Solution</summary>

```typescript
type T = 'a' | 'b';

function assertNever(x: never): never {
  throw new Error('Valor inesperado: ' + x);
}

function procesar(valor: T): number {
  switch (valor) {
    case 'a': return 1;
    case 'b': return 2;
    default: return assertNever(valor as never);
  }
}
```

</details>

---

### Exercise 23: Index Signatures / Record

```javascript
// Convert to TypeScript
const puntuaciones = {};
puntuaciones['ana'] = 10;
puntuaciones['juan'] = 8;
```

**Pista:** Usa `Record<string, number>` o `interface` con index signature `[k: string]: number` para tipar objetos con claves dinámicas.

<details>
<summary>💡 View Solution</summary>

```typescript
const puntuaciones: Record<string, number> = {};
puntuaciones['ana'] = 10;
puntuaciones['juan'] = 8;
```

</details>

---

### Exercise 24: Modules: export / import

```javascript
// Convert to TypeScript (dos archivos)
// utils.js
function doble(x) { return x * 2; }
module.exports = { doble };

// index.js
const { doble } = require('./utils');
console.log(doble(3));
```

**Pista:** Usa `export` y `import` con tipos. `export` declara lo que se comparte desde un módulo y `import` lo consume.

<details>
<summary>💡 View Solution</summary>

```typescript
// utils.ts
export function doble(x: number): number { return x * 2; }

// index.ts
import { doble } from './utils';
console.log(doble(3));
```

</details>

---

### Exercise 25: 'as const' for Literal Inference

```javascript
// Convert to TypeScript
const opciones = { modo: 'auto', retry: 3 };
```

**Pista:** Usa `as const` para fijar valores como literales (readonly). `as const` convierte propiedades en `readonly` y sus valores en tipos literales.

<details>
<summary>💡 View Solution</summary>

```typescript
const opciones = { modo: 'auto', retry: 3 } as const;
// tipo de opciones.modo es 'auto' (literal), no string
```

</details>

---

### Exercise 26: Tuples with Rest Elements

```javascript
// Convert to TypeScript
function makeTuple(first, ...rest) {
  return [first, ...rest];
}
```

**Pista:** Declara la tupla como `[string, ...number[]]` por ejemplo. Los rest elements en tuplas permiten mezclar longitud fija con repetición tipada.

<details>
<summary>💡 View Solution</summary>

```typescript
function makeTuple(first: string, ...rest: number[]): [string, ...number[]] {
  return [first, ...rest];
}

const t = makeTuple('x', 1, 2, 3); // tipo: [string, ...number[]]
```

</details>

---

### Exercise 27: Promises and async/await

```javascript
// Convert to TypeScript
async function fetchUser() {
  const r = await fetch('/user');
  return r.json();
}
```

**Pista:** Tipa la función con `Promise<Usuario>` y el método `json()` con el tipo correcto. Las promesas en TS se declaran como `Promise<T>`.

<details>
<summary>💡 View Solution</summary>

```typescript
interface Usuario { id: number; nombre: string; }

async function fetchUser(): Promise<Usuario> {
  const r = await fetch('/user');
  const data = await r.json() as Usuario;
  return data;
}
```

</details>

---

### Exercise 28: Type Assertion and Non-Null Assertion

```javascript
// Convert to TypeScript
const el = document.getElementById('app');
el.innerHTML = 'Hola';
```

**Pista:** Usa `as HTMLElement` o `!` para indicar a TypeScript que conoces el tipo o que no es null. `!` (non-null assertion) asume que el valor no es null/undefined.

<details>
<summary>💡 View Solution</summary>

```typescript
const el = document.getElementById('app') as HTMLElement | null;
if (el) {
  el.innerHTML = 'Hola';
}

// o usando non-null assertion (con precaución)
const el2 = document.getElementById('app')!;
el2.innerHTML = 'Hola';
```

</details>

---
