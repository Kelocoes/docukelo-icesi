---
sidebar_position: 3
---

# Ejercicios de Typescript

Este archivo contiene 30 ejercicios pensados para practicar TypeScript. Cada ejercicio tiene:
- Código en **JavaScript** (punto de partida).
- Una **pista** que indica la característica de TypeScript a utilizar y para qué sirve.
- La **solución oculta** usando `<details>` para que los estudiantes puedan intentar primero.

No están separados por niveles; la dificultad aumenta de forma gradual.

---

### Ejercicio 1: Suma simple (tipos básicos)

```javascript
// Convierte a TypeScript
function sumar(a, b) {
  return a + b;
}
```

**Pista:** Usa tipos `number` en los parámetros y en el tipo de retorno. `number` sirve para representar valores numéricos y ayuda a evitar pasar strings por error.

<details>
<summary>💡 Ver solución</summary>

```typescript
function sumar(a: number, b: number): number {
  return a + b;
}
```

</details>

---

### Ejercicio 2: Parámetro opcional y por defecto

```javascript
// Convierte a TypeScript
function saludar(nombre, saludo) {
  saludo = saludo || "Hola";
  return `${saludo}, ${nombre}`;
}
```

**Pista:** Usa `?` para parámetros opcionales y valores por defecto. `param?: T` indica que puede omitirse y `= valor` da un valor por defecto.

<details>
<summary>💡 Ver solución</summary>

```typescript
function saludar(nombre: string, saludo: string = "Hola"): string {
  return `${saludo}, ${nombre}`;
}
```

</details>

---

### Ejercicio 3: Definir un objeto con interfaz

```javascript
// Convierte a TypeScript
const crearUsuario = (u) => {
  return `Usuario ${u.nombre} creado con id ${u.id}`;
};
```

**Pista:** Usa `interface` para declarar la forma del objeto `Usuario`. `interface` sirve para definir contratos de forma clara entre partes del código.

<details>
<summary>💡 Ver solución</summary>

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

### Ejercicio 4: Readonly y tipos literales

```javascript
// Convierte a TypeScript
const config = {
  mode: "production",
  version: "1.0.0"
};
```

**Pista:** Usa `readonly` para propiedades inmutables y un *union type* literal (por ejemplo `"dev" | "prod"`). `readonly` evita reasignaciones accidentales.

<details>
<summary>💡 Ver solución</summary>

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

### Ejercicio 5: Tuplas

```javascript
// Convierte a TypeScript
function crearPar(nombre, edad) {
  return [nombre, edad];
}
```

**Pista:** Usa una tupla `[string, number]` para representar `(nombre, edad)`. Las tuplas permiten tipos fijos en posiciones concretas.

<details>
<summary>💡 Ver solución</summary>

```typescript
function crearPar(nombre: string, edad: number): [string, number] {
  return [nombre, edad];
}

const p = crearPar("Ana", 30);
```

</details>

---

### Ejercicio 6: Enums para estados

```javascript
// Convierte a TypeScript
const estado = "Activo"; // puede ser 'Activo' o 'Inactivo'
```

**Pista:** Usa `enum` para representar un conjunto de valores nombrados. `enum` ayuda a mantener valores constantes legibles y seguros.

<details>
<summary>💡 Ver solución</summary>

```typescript
enum Estado {
  Activo = "Activo",
  Inactivo = "Inactivo"
}

const estado: Estado = Estado.Activo;
```

</details>

---

### Ejercicio 7: Genéricos: identidad

```javascript
// Convierte a TypeScript
function identidad(x) {
  return x;
}
```

**Pista:** Usa `generics` (`<T>`) para que la función preserve y acepte cualquier tipo. Los genéricos permiten escribir funciones y tipos reutilizables y tipados.

<details>
<summary>💡 Ver solución</summary>

```typescript
function identidad<T>(x: T): T {
  return x;
}

const a = identidad<number>(123);
const b = identidad("hola");
```

</details>

---

### Ejercicio 8: Genéricos con restricción (length)

```javascript
// Convierte a TypeScript
function cuentaLongitud(x) {
  return x.length;
}
```

**Pista:** Usa `T extends { length: number }` para restringir a tipos que tengan `length`. Esto garantiza que `x.length` existe.

<details>
<summary>💡 Ver solución</summary>

```typescript
function cuentaLongitud<T extends { length: number }>(x: T): number {
  return x.length;
}

console.log(cuentaLongitud('hola')); // 4
console.log(cuentaLongitud([1,2,3])); // 3
```

</details>

---

### Ejercicio 9: Unión de tipos y narrowing

```javascript
// Convierte a TypeScript
function formatear(x) {
  if (typeof x === 'number') {
    return x.toFixed(2);
  }
  return x.trim();
}
```

**Pista:** Usa `string | number` y `typeof` para hacer *narrowing*. `typeof` permite distinguir tipos primitivos en tiempo de ejecución.

<details>
<summary>💡 Ver solución</summary>

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

### Ejercicio 10: Type guard con `in`

```javascript
// Convierte a TypeScript
function descripcion(animal) {
  if (animal.nombre) {
    return `Animal: ${animal.nombre}`;
  }
  return 'Anónimo';
}
```

**Pista:** Usa `in` para comprobar presencia de una propiedad (p.ej. `if ('nombre' in animal)`). Esto sirve como *type guard* para objetos con distintas formas.

<details>
<summary>💡 Ver solución</summary>

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

### Ejercicio 11: Narrowing con `instanceof`

```javascript
// Convierte a TypeScript
class A { constructor() {} }
class B { constructor() {} }

function esA(x) {
  if (x instanceof A) return true;
  return false;
}
```

**Pista:** Usa clases y `instanceof` para distinguir instancias en tiempo de ejecución. `instanceof` es útil con clases y permite inferir el tipo dentro del bloque.

<details>
<summary>💡 Ver solución</summary>

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

### Ejercicio 12: Uniones discriminadas (formas geométricas)

```javascript
// Convierte a TypeScript
function area(shape) {
  if (shape.kind === 'circle') {
    return Math.PI * shape.radius * shape.radius;
  }
  return shape.size * shape.size;
}
```

**Pista:** Usa `type` con una propiedad literal discriminante `kind`. Las uniones discriminadas facilitan el *narrowing* y la seguridad de tipos.

<details>
<summary>💡 Ver solución</summary>

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

### Ejercicio 13: keyof y pluck

```javascript
// Convierte a TypeScript
function pluck(obj, keys) {
  return keys.map(k => obj[k]);
}
```

**Pista:** Usa `keyof` y genéricos `K extends keyof T` para asegurar que las claves existen en `obj`. `keyof` obtiene las claves de un tipo.

<details>
<summary>💡 Ver solución</summary>

```typescript
function pluck<T, K extends keyof T>(obj: T, keys: K[]): T[K][] {
  return keys.map(k => obj[k]);
}

const persona = { nombre: 'Ana', edad: 28 };
const resultados = pluck(persona, ['nombre']); // tipo: string[]
```

</details>

---

### Ejercicio 14: Utility type: Pick

```javascript
// Convierte a TypeScript
const user = { id: 1, nombre: 'Ana', password: '123' };
// Queremos un objeto público sin password
```

**Pista:** Usa `Pick<T, K>` para construir un nuevo tipo con solo algunas propiedades. `Pick` sirve para exponer solo un subconjunto del tipo original.

<details>
<summary>💡 Ver solución</summary>

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

### Ejercicio 15: Utility type: Omit

```javascript
// Convierte a TypeScript
const user = { id: 1, nombre: 'Ana', password: '123' };
// Queremos un usuario sin password
```

**Pista:** Usa `Omit<T, K>` para crear un tipo sin ciertas propiedades. `Omit` es útil para eliminar campos sensibles como contraseña.

<details>
<summary>💡 Ver solución</summary>

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

### Ejercicio 16: Partial y Required

```javascript
// Convierte a TypeScript
function actualizar(usuario, cambios) {
  return { ...usuario, ...cambios };
}
```

**Pista:** Usa `Partial<T>` para permitir objetos con propiedades opcionales en `cambios`. `Partial` convierte todas las propiedades en opcionales; `Required` hace lo contrario.

<details>
<summary>💡 Ver solución</summary>

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

### Ejercicio 17: ReadonlyArray y readonly

```javascript
// Convierte a TypeScript
const nums = [1,2,3];
nums.push(4); // debería no permitirse si queremos inmutabilidad
```

**Pista:** Usa `readonly` o `ReadonlyArray<T>` para arrays inmutables. `readonly` evita métodos mutativos como `push` o `splice` en tiempo de compilación.

<details>
<summary>💡 Ver solución</summary>

```typescript
const nums: ReadonlyArray<number> = [1, 2, 3];
// nums.push(4); // Error: Property 'push' does not exist on type 'readonly number[]'.
```

</details>

---

### Ejercicio 18: Sobrecarga de funciones

```javascript
// Convierte a TypeScript
function combinar(a, b) {
  if (typeof a === 'number' && typeof b === 'number') return a + b;
  return `${a}${b}`;
}
```

**Pista:** Usa *overloads* (declaraciones de firma) para expresar que la función puede aceptar y devolver distintos tipos. Esto mejora la inferencia para quien la use.

<details>
<summary>💡 Ver solución</summary>

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

### Ejercicio 19: Mapped types: crear Optionalize

```javascript
// Convierte a TypeScript
// Queremos un tipo igual al original pero con todas las propiedades opcionales
```

**Pista:** Crea un mapped type `Optionalize<T>` con `[P in keyof T]?: T[P]`. Los mapped types transforman propiedades de un tipo a través de `keyof`.

<details>
<summary>💡 Ver solución</summary>

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

### Ejercicio 20: Tipos condicionales simples

```javascript
// Convierte a TypeScript
// Queremos un tipo que sea 'yes' si T es string, y 'no' en caso contrario
```

**Pista:** Usa `T extends U ? X : Y` para crear tipos condicionales. Sirven para calcular tipos basados en otros.

<details>
<summary>💡 Ver solución</summary>

```typescript
type IsString<T> = T extends string ? 'yes' : 'no';

type A = IsString<string>; // 'yes'
type B = IsString<number>; // 'no'
```

</details>

---

### Ejercicio 21: unknown vs any

```javascript
// Convierte a TypeScript
function parse(json) {
  return JSON.parse(json);
}
```

**Pista:** Usa `unknown` como tipo de retorno de parse y *narrowing* antes de usarlo. `unknown` obliga a comprobar el tipo antes de operar, a diferencia de `any`.

<details>
<summary>💡 Ver solución</summary>

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

### Ejercicio 22: never y chequeo exhaustivo

```javascript
// Convierte a TypeScript
function procesar(valor) {
  switch(valor) {
    case 'a': return 1;
    case 'b': return 2;
  }
}
```

**Pista:** Usa un `never` en la rama `default` para forzar exhaustividad (`assertNever`). `never` representa valores que nunca ocurren y ayuda a detectar casos no manejados.

<details>
<summary>💡 Ver solución</summary>

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

### Ejercicio 23: Index signatures / Record

```javascript
// Convierte a TypeScript
const puntuaciones = {};
puntuaciones['ana'] = 10;
puntuaciones['juan'] = 8;
```

**Pista:** Usa `Record<string, number>` o `interface` con index signature `[k: string]: number` para tipar objetos con claves dinámicas.

<details>
<summary>💡 Ver solución</summary>

```typescript
const puntuaciones: Record<string, number> = {};
puntuaciones['ana'] = 10;
puntuaciones['juan'] = 8;
```

</details>

---

### Ejercicio 24: Módulos: export / import

```javascript
// Convierte a TypeScript (dos archivos)
// utils.js
function doble(x) { return x * 2; }
module.exports = { doble };

// index.js
const { doble } = require('./utils');
console.log(doble(3));
```

**Pista:** Usa `export` y `import` con tipos. `export` declara lo que se comparte desde un módulo y `import` lo consume.

<details>
<summary>💡 Ver solución</summary>

```typescript
// utils.ts
export function doble(x: number): number { return x * 2; }

// index.ts
import { doble } from './utils';
console.log(doble(3));
```

</details>

---

### Ejercicio 25: 'as const' para inferencia literal

```javascript
// Convierte a TypeScript
const opciones = { modo: 'auto', retry: 3 };
```

**Pista:** Usa `as const` para fijar valores como literales (readonly). `as const` convierte propiedades en `readonly` y sus valores en tipos literales.

<details>
<summary>💡 Ver solución</summary>

```typescript
const opciones = { modo: 'auto', retry: 3 } as const;
// tipo de opciones.modo es 'auto' (literal), no string
```

</details>

---

### Ejercicio 26: Tuplas con elementos rest

```javascript
// Convierte a TypeScript
function makeTuple(first, ...rest) {
  return [first, ...rest];
}
```

**Pista:** Declara la tupla como `[string, ...number[]]` por ejemplo. Los rest elements en tuplas permiten mezclar longitud fija con repetición tipada.

<details>
<summary>💡 Ver solución</summary>

```typescript
function makeTuple(first: string, ...rest: number[]): [string, ...number[]] {
  return [first, ...rest];
}

const t = makeTuple('x', 1, 2, 3); // tipo: [string, ...number[]]
```

</details>

---

### Ejercicio 27: Promises y async/await

```javascript
// Convierte a TypeScript
async function fetchUser() {
  const r = await fetch('/user');
  return r.json();
}
```

**Pista:** Tipa la función con `Promise<Usuario>` y el método `json()` con el tipo correcto. Las promesas en TS se declaran como `Promise<T>`.

<details>
<summary>💡 Ver solución</summary>

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

### Ejercicio 28: Type assertion y non-null assertion

```javascript
// Convierte a TypeScript
const el = document.getElementById('app');
el.innerHTML = 'Hola';
```

**Pista:** Usa `as HTMLElement` o `!` para indicar a TypeScript que conoces el tipo o que no es null. `!` (non-null assertion) asume que el valor no es null/undefined.

<details>
<summary>💡 Ver solución</summary>

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
