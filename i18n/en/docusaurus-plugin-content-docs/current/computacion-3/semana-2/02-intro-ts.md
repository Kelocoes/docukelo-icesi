---
sidebar_position: 2
---

# TypeScript

TypeScript is a **superset of JavaScript** developed by Microsoft that adds **static typing** and modern features to enhance code quality, maintainability, and scalability. This means that **all valid JavaScript code is also valid TypeScript**, but TypeScript provides powerful developer tooling on top.

## 1. Why Use TypeScript?

JavaScript is a flexible and dynamic language, but that dynamism can lead to runtime errors that are difficult to track down. TypeScript catches these issues **before executing code** thanks to static analysis and compile-time type checking.

**Key Advantages:**

- Static typing (prevents common type-related bugs).
- Autocomplete and rich IDE support in editors like VS Code.
- Early error detection at compile time.
- Access to modern ECMAScript features before they reach full browser support.
- More maintainable and self-documenting codebases.

**JavaScript Pitfall Example:**

```javascript
function sumar(a, b) {
  return a + b;
}

console.log(sumar(5, "10")); // "510" instead of 15
```

**TypeScript Solution:**

```typescript
function sumar(a: number, b: number): number {
  return a + b;
}

// console.log(sumar(5, "10")); // Error: Argument of type 'string' is not assignable to parameter of type 'number'.
console.log(sumar(5, 10)); // 15
```

---

## 2. Installation and Basic Setup

### 2.1 Global Installation

Requires Node.js and npm installed.

```bash
npm install -g typescript
```

Verify installation:

```bash
tsc -v
```

### 2.2 Initialize a TypeScript Project

```bash
mkdir ts-project
cd ts-project
npm init -y
npm install typescript --save-dev
```

Generate the `tsconfig.json` configuration file:

```bash
npx tsc --init
```

Key starting compiler options:

```json
{
  "compilerOptions": {
    "target": "es6",               // JavaScript target version
    "module": "commonjs",          // Module resolution system
    "outDir": "./dist",            // Compiled output directory
    "rootDir": "./src",            // Source code directory
    "strict": true,                 // Enable all strict type-checking options
    "esModuleInterop": true         // Enhanced CommonJS/ES6 module interop
  }
}
```

Recommended project directory layout:

```
ts-project/
├── src/
│   └── index.ts
├── dist/
│   └── index.js
├── package.json
└── tsconfig.json
```

### 2.3 Compile and Execute

To compile:

```bash
npx tsc
```

This compiles TypeScript source files into `.js` files in `dist/`.

To run:

```bash
node dist/index.js
```

To compile and execute in a single development step using `ts-node`:

```bash
npm install -D ts-node
npx ts-node src/index.ts
```

---

## 3. Basic Types in TypeScript

TypeScript introduces static primitive and composite types:

```typescript
let name: string = "Kevin";
let age: number = 25;
let isActive: boolean = true;
let undefinedVal: undefined = undefined;
let nullVal: null = null;
let anyVal: any = "Hello"; // Avoid whenever possible
```

**Arrays:**

```typescript
let numbers: number[] = [1, 2, 3];
let letters: Array<string> = ["a", "b", "c"];
```

**Tuples:**

```typescript
let person: [string, number] = ["Kevin", 25];
```

**Enums:**

```typescript
enum Color {
  Red = "RED",
  Green = "GREEN",
  Blue = "BLUE"
}

let favColor: Color = Color.Green;
console.log(favColor); // "GREEN"
```

**Union Types:**

```typescript
let id: string | number;
id = "ABC123";
id = 42;
```

**Type Aliases:**

```typescript
type ID = string | number;
let userId: ID = 101;
```

---

## 4. Functions in TypeScript

Function signatures can explicitly annotate parameters and return types:

```typescript
function greet(name: string): string {
  return `Hello, ${name}`;
}

console.log(greet("Kevin"));
```

Optional and default parameters:

```typescript
function multiply(a: number, b: number = 2, message?: string): number {
  if (message) console.log(message);
  return a * b;
}

console.log(multiply(3));
console.log(multiply(3, 4, "Computing..."));
```

Arrow functions:

```typescript
const divide = (a: number, b: number): number => a / b;
```

---

## 5. Interfaces and Objects

Interfaces define the structural contract of an object:

```typescript
interface User {
  id: number;
  name: string;
  isActive?: boolean; // optional property
}

let user1: User = {
  id: 1,
  name: "Kevin"
};
```

Function signatures in interfaces:

```typescript
interface MathOperation {
  (a: number, b: number): number;
}

const add: MathOperation = (x, y) => x + y;
console.log(add(5, 3));
```

---

## 6. Classes in TypeScript

```typescript
class Person {
  private name: string;
  protected age: number;
  public isActive: boolean;

  constructor(name: string, age: number, isActive: boolean) {
    this.name = name;
    this.age = age;
    this.isActive = isActive;
  }

  greet(): string {
    return `Hello, I am ${this.name}`;
  }
}

const p1 = new Person("Kevin", 25, true);
console.log(p1.greet());
```

Inheritance:

```typescript
class Student extends Person {
  course: string;
  constructor(name: string, age: number, isActive: boolean, course: string) {
    super(name, age, isActive);
    this.course = course;
  }
}
```

---

## 7. Modules in TypeScript

**Exporting:**

```typescript
// file: utils.ts
export function sum(a: number, b: number): number {
  return a + b;
}
```

**Importing:**

```typescript
// file: index.ts
import { sum } from "./utils";
console.log(sum(3, 4));
```

---

## 8. Advanced Types

**Generics:**

Similar to Java, Generics enable functions and classes to operate over multiple data types while preserving full type safety. The type parameter is conventionally denoted by `<T>`:

```typescript
function identity<T>(value: T): T {
  return value;
}

console.log(identity<string>("Hello"));
console.log(identity<number>(123));
```

The function receives a value of generic type `T` and returns it without type coercion, making it reusable across data models.

**Intersection Types:**

Combine multiple type definitions into one cohesive contract:

```typescript
interface A { a: string; }
interface B { b: number; }

type AB = A & B;
let obj: AB = { a: "Hello", b: 42 };
```

---

## 9. Browser Execution

To use TypeScript in the browser:

1. Compile TypeScript to JavaScript via `tsc`.
2. Include the output `.js` bundle inside an HTML `<script>` tag.

Example:

```typescript
// src/app.ts
const message: string = "Hello from TS";
console.log(message);
```

```html
<!-- index.html -->
<script src="dist/app.js"></script>
```

---

## 10. Interface vs. Type Alias

In TypeScript, both interfaces and type aliases define shapes and types, but possess distinct characteristics:

- **Interfaces**: Primarily designed to define object shapes. They support declaration merging and extension via `extends`.

```typescript
interface User {
  id: number;
  name: string;
}
```

- **Type Aliases**: Used for more expressive type compositions, including unions, tuples, and primitives.

```typescript
type ID = string | number;
type User = {
  id: ID;
  name: string;
};
```

### Key Difference: Union Types

Type aliases can directly declare unions, which is not possible with interfaces:

```typescript
type Result = string | number;

let response: Result;
response = "Success";
response = 42;
```

---

## 11. Best Practices

- Enable `"strict": true` in `tsconfig.json`.
- Avoid using `any`; prefer `unknown` when types are undetermined.
- Define explicit contracts using interfaces and type aliases.
- Leverage editor autocomplete and static diagnostics.
- Compile frequently to catch type discrepancies early in development.
