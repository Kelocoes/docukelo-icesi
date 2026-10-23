---
sidebar_position: 4
description: "Practice TypeScript by converting JavaScript code with gradual exercises on types, interfaces, generics and modules, each with a solution."
---

# TypeScript Exercises

This file contains 28 exercises designed to practice TypeScript. Each exercise has:
- **JavaScript** code (the starting point).
- A **hint** that indicates the TypeScript feature to use and what it is for.
- A **hidden solution** using `<details>` so students can try first.

They are not split into levels; the difficulty increases gradually.

---

### Exercise 1: Simple sum (basic types)

```javascript title="Simple sum (basic types)"
// Convert to TypeScript
function sumar(a, b) {
  return a + b;
}
```

**Hint:** Use `number` types for the parameters and the return type. `number` represents numeric values and helps you avoid passing strings by mistake.

<details>
<summary>View solution</summary>

```typescript title="Simple sum (basic types) (solution)"
function sumar(a: number, b: number): number {
  return a + b;
}
```

</details>

---

### Exercise 2: Optional and default parameter

```javascript title="Optional and default parameter"
// Convert to TypeScript
function saludar(nombre, saludo) {
  saludo = saludo || "Hola";
  return `${saludo}, ${nombre}`;
}
```

**Hint:** Use `?` for optional parameters and default values. `param?: T` means it can be omitted, and `= value` gives it a default value.

<details>
<summary>View solution</summary>

```typescript title="Optional parameter (solution)"
function saludar(nombre: string, saludo: string = "Hola"): string {
  return `${saludo}, ${nombre}`;
}
```

</details>

---

### Exercise 3: Define an object with an interface

```javascript title="Define an object with an interface"
// Convert to TypeScript
const crearUsuario = (u) => {
  return `Usuario ${u.nombre} creado con id ${u.id}`;
};
```

**Hint:** Use `interface` to declare the shape of the `Usuario` object. `interface` defines clear contracts between parts of the code.

<details>
<summary>View solution</summary>

```typescript title="Define an object (solution)"
interface Usuario {
  id: number;
  nombre: string;
  email?: string; // optional
}

const crearUsuario = (u: Usuario): string => {
  return `Usuario ${u.nombre} creado con id ${u.id}`;
};
```

</details>

---

### Exercise 4: Readonly and literal types

```javascript title="Readonly and literal types"
// Convert to TypeScript
const config = {
  mode: "production",
  version: "1.0.0"
};
```

**Hint:** Use `readonly` for immutable properties and a literal *union type* (for example `"dev" | "prod"`). `readonly` prevents accidental reassignments.

<details>
<summary>View solution</summary>

```typescript title="Readonly and literal types (solution)"
type Mode = "development" | "production" | "test";

interface Config {
  readonly mode: Mode;
  readonly version: string;
}

const config: Config = {
  mode: "production",
  version: "1.0.0"
};

// config.version = '1.0.1' // Error: cannot assign to 'version' because it is a read-only property
```

</details>

---

### Exercise 5: Tuples

```javascript title="Tuples"
// Convert to TypeScript
function crearPar(nombre, edad) {
  return [nombre, edad];
}
```

**Hint:** Use a `[string, number]` tuple to represent `(nombre, edad)`. Tuples allow fixed types at specific positions.

<details>
<summary>View solution</summary>

```typescript title="Tuples (solution)"
function crearPar(nombre: string, edad: number): [string, number] {
  return [nombre, edad];
}

const p = crearPar("Ana", 30);
```

</details>

---

### Exercise 6: Enums for states

```javascript title="Enums for states"
// Convert to TypeScript
const estado = "Activo"; // can be 'Activo' or 'Inactivo'
```

**Hint:** Use `enum` to represent a set of named values. `enum` helps keep constant values readable and safe.

<details>
<summary>View solution</summary>

```typescript title="Enums for states (solution)"
enum Estado {
  Activo = "Activo",
  Inactivo = "Inactivo"
}

const estado: Estado = Estado.Activo;
```

</details>

---

### Exercise 7: Generics: identity

```javascript title="Generics: identity"
// Convert to TypeScript
function identidad(x) {
  return x;
}
```

**Hint:** Use `generics` (`<T>`) so the function accepts and preserves any type. Generics let you write reusable, typed functions and types.

<details>
<summary>View solution</summary>

```typescript title="Generics: identity (solution)"
function identidad<T>(x: T): T {
  return x;
}

const a = identidad<number>(123);
const b = identidad("hola");
```

</details>

---

### Exercise 8: Generics with a constraint (length)

```javascript title="Generics with a constraint (length)"
// Convert to TypeScript
function cuentaLongitud(x) {
  return x.length;
}
```

**Hint:** Use `T extends { length: number }` to restrict the function to types that have `length`. This guarantees that `x.length` exists.

<details>
<summary>View solution</summary>

```typescript title="Generics with a constraint (solution)"
function cuentaLongitud<T extends { length: number }>(x: T): number {
  return x.length;
}

console.log(cuentaLongitud('hola')); // 4
console.log(cuentaLongitud([1,2,3])); // 3
```

</details>

---

### Exercise 9: Union types and narrowing

```javascript title="Union types and narrowing"
// Convert to TypeScript
function formatear(x) {
  if (typeof x === 'number') {
    return x.toFixed(2);
  }
  return x.trim();
}
```

**Hint:** Use `string | number` and `typeof` to do *narrowing*. `typeof` lets you distinguish primitive types at runtime.

<details>
<summary>View solution</summary>

```typescript title="Union types and narrowing (solution)"
function formatear(x: string | number): string {
  if (typeof x === 'number') {
    return x.toFixed(2);
  }
  return x.trim();
}
```

</details>

---

### Exercise 10: Type guard with `in`

```javascript title="Type guard"
// Convert to TypeScript
function descripcion(animal) {
  if (animal.nombre) {
    return `Animal: ${animal.nombre}`;
  }
  return 'Anónimo';
}
```

**Hint:** Use `in` to check whether a property is present (e.g. `if ('nombre' in animal)`). This works as a *type guard* for objects with different shapes.

<details>
<summary>View solution</summary>

```typescript title="Type guard (solution)"
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

```javascript title="Narrowing with instanceof"
// Convert to TypeScript
class A { constructor() {} }
class B { constructor() {} }

function esA(x) {
  if (x instanceof A) return true;
  return false;
}
```

**Hint:** Use classes and `instanceof` to distinguish instances at runtime. `instanceof` is useful with classes and lets TypeScript infer the type inside the block.

<details>
<summary>View solution</summary>

```typescript title="Narrowing with instanceof (solution)"
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

### Exercise 12: Discriminated unions (geometric shapes)

```javascript title="Discriminated unions"
// Convert to TypeScript
function area(shape) {
  if (shape.kind === 'circle') {
    return Math.PI * shape.radius * shape.radius;
  }
  return shape.size * shape.size;
}
```

**Hint:** Use `type` with a literal discriminant property `kind`. Discriminated unions make *narrowing* and type safety easier.

<details>
<summary>View solution</summary>

```typescript title="Discriminated unions (solution)"
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

### Exercise 13: keyof and pluck

```javascript title="keyof and pluck"
// Convert to TypeScript
function pluck(obj, keys) {
  return keys.map(k => obj[k]);
}
```

**Hint:** Use `keyof` and generics `K extends keyof T` to ensure the keys exist in `obj`. `keyof` gets the keys of a type.

<details>
<summary>View solution</summary>

```typescript title="keyof and pluck (solution)"
function pluck<T, K extends keyof T>(obj: T, keys: K[]): T[K][] {
  return keys.map(k => obj[k]);
}

const persona = { nombre: 'Ana', edad: 28 };
const resultados = pluck(persona, ['nombre']); // type: string[]
```

</details>

---

### Exercise 14: Utility type: Pick

```javascript title="Utility type: Pick"
// Convert to TypeScript
const user = { id: 1, nombre: 'Ana', password: '123' };
// We want a public object without the password
```

**Hint:** Use `Pick<T, K>` to build a new type with only some of the properties. `Pick` exposes only a subset of the original type.

<details>
<summary>View solution</summary>

```typescript title="Utility type: Pick (solution)"
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

### Exercise 15: Utility type: Omit

```javascript title="Utility type: Omit"
// Convert to TypeScript
const user = { id: 1, nombre: 'Ana', password: '123' };
// We want a user without the password
```

**Hint:** Use `Omit<T, K>` to create a type without certain properties. `Omit` is useful for removing sensitive fields such as the password.

<details>
<summary>View solution</summary>

```typescript title="Utility type: Omit (solution)"
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

```javascript title="Partial and Required"
// Convert to TypeScript
function actualizar(usuario, cambios) {
  return { ...usuario, ...cambios };
}
```

**Hint:** Use `Partial<T>` to allow objects with optional properties in `cambios`. `Partial` makes all properties optional; `Required` does the opposite.

<details>
<summary>View solution</summary>

```typescript title="Partial and Required (solution)"
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

```javascript title="ReadonlyArray and readonly"
// Convert to TypeScript
const nums = [1,2,3];
nums.push(4); // should not be allowed if we want immutability
```

**Hint:** Use `readonly` or `ReadonlyArray<T>` for immutable arrays. `readonly` prevents mutating methods such as `push` or `splice` at compile time.

<details>
<summary>View solution</summary>

```typescript title="ReadonlyArray and readonly (solution)"
const nums: ReadonlyArray<number> = [1, 2, 3];
// nums.push(4); // Error: Property 'push' does not exist on type 'readonly number[]'.
```

</details>

---

### Exercise 18: Function overloads

```javascript title="Function overloads"
// Convert to TypeScript
function combinar(a, b) {
  if (typeof a === 'number' && typeof b === 'number') return a + b;
  return `${a}${b}`;
}
```

**Hint:** Use *overloads* (signature declarations) to express that the function can accept and return different types. This improves type inference for whoever uses it.

<details>
<summary>View solution</summary>

```typescript title="Function overloads (solution)"
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

### Exercise 19: Mapped types: create Optionalize

```javascript title="Mapped types: create Optionalize"
// Convert to TypeScript
// We want a type equal to the original but with all properties optional
```

**Hint:** Create a mapped type `Optionalize<T>` with `[P in keyof T]?: T[P]`. Mapped types transform the properties of a type through `keyof`.

<details>
<summary>View solution</summary>

```typescript title="Mapped types: create (solution)"
type Optionalize<T> = { [P in keyof T]?: T[P] };

interface Persona {
  id: number;
  nombre: string;
}

type PersonaOpcional = Optionalize<Persona>; // { id?: number; nombre?: string }
```

</details>

---

### Exercise 20: Simple conditional types

```javascript title="Simple conditional types"
// Convert to TypeScript
// We want a type that is 'yes' if T is string, and 'no' otherwise
```

**Hint:** Use `T extends U ? X : Y` to create conditional types. They let you compute types based on other types.

<details>
<summary>View solution</summary>

```typescript title="Simple conditional types (solution)"
type IsString<T> = T extends string ? 'yes' : 'no';

type A = IsString<string>; // 'yes'
type B = IsString<number>; // 'no'
```

</details>

---

### Exercise 21: unknown vs any

```javascript title="unknown vs any"
// Convert to TypeScript
function parse(json) {
  return JSON.parse(json);
}
```

**Hint:** Use `unknown` as the return type of parse and apply *narrowing* before using it. Unlike `any`, `unknown` forces you to check the type before operating on it.

<details>
<summary>View solution</summary>

```typescript title="unknown vs any (solution)"
function parse(json: string): unknown {
  return JSON.parse(json);
}

const data = parse('{"x":1}');
if (typeof data === 'object' && data !== null && 'x' in data) {
  // now TypeScript allows safe access
  console.log((data as any).x);
}
```

</details>

---

### Exercise 22: never and exhaustive checking

```javascript title="never and exhaustive checking"
// Convert to TypeScript
function procesar(valor) {
  switch(valor) {
    case 'a': return 1;
    case 'b': return 2;
  }
}
```

**Hint:** Use a `never` in the `default` branch to force exhaustiveness (`assertNever`). `never` represents values that never occur and helps you detect unhandled cases.

<details>
<summary>View solution</summary>

```typescript title="never and exhaustive checking (solution)"
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

### Exercise 23: Index signatures / Record

```javascript title="Index signatures / Record"
// Convert to TypeScript
const puntuaciones = {};
puntuaciones['ana'] = 10;
puntuaciones['juan'] = 8;
```

**Hint:** Use `Record<string, number>` or an `interface` with an index signature `[k: string]: number` to type objects with dynamic keys.

<details>
<summary>View solution</summary>

```typescript title="Index signatures / Record (solution)"
const puntuaciones: Record<string, number> = {};
puntuaciones['ana'] = 10;
puntuaciones['juan'] = 8;
```

</details>

---

### Exercise 24: Modules: export / import

```javascript title="Modules: export / import"
// Convert to TypeScript (two files)
// utils.js
function doble(x) { return x * 2; }
module.exports = { doble };

// index.js
const { doble } = require('./utils');
console.log(doble(3));
```

**Hint:** Use `export` and `import` with types. `export` declares what is shared from a module and `import` consumes it.

<details>
<summary>View solution</summary>

```typescript title="utils.ts"
// utils.ts
export function doble(x: number): number { return x * 2; }

// index.ts
import { doble } from './utils';
console.log(doble(3));
```

</details>

---

### Exercise 25: 'as const' for literal inference

```javascript title="'as const' for literal inference"
// Convert to TypeScript
const opciones = { modo: 'auto', retry: 3 };
```

**Hint:** Use `as const` to fix values as literals (readonly). `as const` turns properties into `readonly` and their values into literal types.

<details>
<summary>View solution</summary>

```typescript title="'as const' for inference (solution)"
const opciones = { modo: 'auto', retry: 3 } as const;
// the type of opciones.modo is 'auto' (literal), not string
```

</details>

---

### Exercise 26: Tuples with rest elements

```javascript title="Tuples with rest elements"
// Convert to TypeScript
function makeTuple(first, ...rest) {
  return [first, ...rest];
}
```

**Hint:** Declare the tuple as `[string, ...number[]]`, for example. Rest elements in tuples let you mix a fixed length with typed repetition.

<details>
<summary>View solution</summary>

```typescript title="Tuples with rest elements (solution)"
function makeTuple(first: string, ...rest: number[]): [string, ...number[]] {
  return [first, ...rest];
}

const t = makeTuple('x', 1, 2, 3); // type: [string, ...number[]]
```

</details>

---

### Exercise 27: Promises and async/await

```javascript title="Promises and async/await"
// Convert to TypeScript
async function fetchUser() {
  const r = await fetch('/user');
  return r.json();
}
```

**Hint:** Type the function with `Promise<Usuario>` and the `json()` result with the correct type. Promises in TS are declared as `Promise<T>`.

<details>
<summary>View solution</summary>

```typescript title="Promises and async/await (solution)"
interface Usuario { id: number; nombre: string; }

async function fetchUser(): Promise<Usuario> {
  const r = await fetch('/user');
  const data = await r.json() as Usuario;
  return data;
}
```

</details>

---

### Exercise 28: Type assertion and non-null assertion

```javascript title="Type assertion and non-null assertion"
// Convert to TypeScript
const el = document.getElementById('app');
el.innerHTML = 'Hola';
```

**Hint:** Use `as HTMLElement` or `!` to tell TypeScript that you know the type or that the value is not null. `!` (non-null assertion) assumes the value is not null/undefined.

<details>
<summary>View solution</summary>

```typescript title="Type assertion and non-null (solution)"
const el = document.getElementById('app') as HTMLElement | null;
if (el) {
  el.innerHTML = 'Hola';
}

// or using a non-null assertion (with caution)
const el2 = document.getElementById('app')!;
el2.innerHTML = 'Hola';
```

</details>

---
