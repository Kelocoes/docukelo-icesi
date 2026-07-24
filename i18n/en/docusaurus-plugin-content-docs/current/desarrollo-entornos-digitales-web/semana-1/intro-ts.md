---
sidebar_position: 3
title: Introduction to TypeScript
---

# TypeScript

TypeScript is a **superset of JavaScript** developed by Microsoft that adds **static typing** and modern language features to improve code quality, maintainability, and scalability. This means **all valid JavaScript code is also valid TypeScript code**, while TypeScript provides additional development tooling.

## 1. Why Use TypeScript?

JavaScript is flexible and dynamic, but that flexibility can lead to errors that are difficult to catch. TypeScript helps prevent them **before executing code** through static typing and editor tooling.

**Key Advantages:**

- Static typing (prevents common type errors).
- Autocompletion and editor support in VS Code.
- Compile-time error detection.
- Modern JavaScript features enabled across browser environments.
- Maintainable and readable codebase.

**Example Issue in JavaScript:**

```javascript
function add(a, b) {
  return a + b;
}

console.log(add(5, "10")); // "510" instead of 15
```

**TypeScript Solution:**

```typescript
function add(a: number, b: number): number {
  return a + b;
}

// console.log(add(5, "10")); // Error: Argument of type 'string' is not assignable to parameter of type 'number'.
console.log(add(5, 10)); // 15
```

---

## 2. Basic Setup and Installation

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

Key compiler settings in `tsconfig.json`:

```json
{
  "compilerOptions": {
    "target": "es6",               // Target JS version
    "module": "commonjs",          // Module resolution system
    "outDir": "./dist",            // Output folder
    "rootDir": "./src",            // Source code folder
    "strict": true,                 // Enable strict type checks
    "esModuleInterop": true         // Module compatibility
  }
}
```

Recommended folder structure:

```
ts-project/
├── src/
│   └── index.ts
├── dist/
├── package.json
└── tsconfig.json
```

### 2.3 Compile and Run

To compile:

```bash
npx tsc
```

To run:

```bash
node dist/index.js
```

Or using `ts-node` directly:

```bash
npm install -D ts-node
npx ts-node src/index.ts
```

---

## 3. Basic Types in TypeScript

TypeScript adds explicit types:

```typescript
let name: string = "Kevin";
let age: number = 25;
let active: boolean = true;
let unassigned: undefined = undefined;
let empty: null = null;
let flexible: any = "Hello"; // Avoid when possible
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
let userID: ID = 101;
```

---

## 4. Functions in TypeScript

Typing parameters and return values:

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
console.log(multiply(3, 4, "Calculating..."));
```

---

## 5. Interfaces and Objects

Interfaces define the shape of an object:

```typescript
interface User {
  id: number;
  name: string;
  active?: boolean; // optional
}

let user1: User = {
  id: 1,
  name: "Kevin"
};
```

---

## 6. Classes in TypeScript

```typescript
class Person {
  private name: string;
  protected age: number;
  public active: boolean;

  constructor(name: string, age: number, active: boolean) {
    this.name = name;
    this.age = age;
    this.active = active;
  }

  greet(): string {
    return `Hello, I am ${this.name}`;
  }
}

const p1 = new Person("Kevin", 25, true);
console.log(p1.greet());
```

---

## 7. Advanced Types: Generics and Intersections

**Generics:**

```typescript
function identity<T>(value: T): T {
  return value;
}

console.log(identity<string>("Hello"));
console.log(identity<number>(123));
```

**Intersection Types:**

```typescript
interface A { a: string; }
interface B { b: number; }

type AB = A & B;
let obj: AB = { a: "Hello", b: 42 };
```

---

## 8. Interface vs. Type Alias

- **Interfaces**: Designed primarily to describe object shapes and contracts. Can be extended or merged.
- **Type Aliases**: Flexible declarations that support union types, primitive aliases, and tuples.

---

## Self-Assessment Quiz

<Quiz id="web-env-intro-ts-quiz">
  <Question title="What does it mean that TypeScript is a 'superset' of JavaScript?">
    <Option>It completely replaces JavaScript and does not run on Node.js.</Option>
    <Option correct>It includes all JavaScript syntax and features while adding extra capabilities like static typing.</Option>
    <Option>It only runs on backend servers and cannot compile for web browsers.</Option>
    <Option>It is a CSS framework based on utility classes.</Option>
  </Question>
  <Question title="At what point does TypeScript detect type errors in your code?">
    <Option>Exclusively upon deployment to production.</Option>
    <Option correct>At compile-time (or static code analysis in the editor) before code execution.</Option>
    <Option>At runtime when a user clicks an element.</Option>
    <Option>Only when restarting the web server.</Option>
  </Question>
  <Question title="What happens in TypeScript if you declare 'let name = &quot;Kevin&quot;' and later attempt 'name = 42'?">
    <Option>It dynamically updates the variable type to number without warnings.</Option>
    <Option correct>It throws a compilation error due to static Type Inference.</Option>
    <Option>It automatically converts 42 to the string &quot;42&quot;.</Option>
    <Option>It deletes the variable from memory.</Option>
  </Question>
  <Question title="What is the official command for the TypeScript compiler to transpile .ts files into .js?">
    <Option>npm run build-ts</Option>
    <Option>node compile</Option>
    <Option correct>tsc</Option>
    <Option>ts-run</Option>
  </Question>
  <Question title="What is the purpose of the tsconfig.json file in a TypeScript project?">
    <Option>To install third-party packages from npm.</Option>
    <Option correct>To specify compiler settings and transpilation options for the project.</Option>
    <Option>To define global CSS styles for the application.</Option>
    <Option>To store secret database credentials.</Option>
  </Question>
  <Question title="In tsconfig.json, what does the setting '&quot;strict&quot;: true' accomplish?">
    <Option>It forbids arrow functions across the codebase.</Option>
    <Option correct>It enables a broad range of strict type checking rules for maximum code safety.</Option>
    <Option>It forces output files to be minified.</Option>
    <Option>It blocks imports from external libraries.</Option>
  </Question>
  <Question title="How do you declare a tuple in TypeScript containing a string first and a number second?">
    <Option>let tuple: (string | number)[] = [&quot;Kevin&quot;, 25];</Option>
    <Option correct>let tuple: [string, number] = [&quot;Kevin&quot;, 25];</Option>
    <Option>let tuple: Array&lt;string, number&gt; = [&quot;Kevin&quot;, 25];</Option>
    <Option>let tuple: &#123; string, number &#125; = [&quot;Kevin&quot;, 25];</Option>
  </Question>
  <Question title="What is the main benefit of using an 'enum' in TypeScript?">
    <Option>It allows asynchronous code execution without Promises.</Option>
    <Option correct>It allows defining a set of named constants, making code more readable and type-safe.</Option>
    <Option>It converts JavaScript objects into SQL tables.</Option>
    <Option>It reduces final HTML bundle size.</Option>
  </Question>
  <Question title="Which syntax indicates that a property inside an 'interface' is optional?">
    <Option>Adding the keyword 'optional' before the property name.</Option>
    <Option>Wrapping the property name in brackets '[property]'.</Option>
    <Option correct>Appending a question mark '?' to the property name.</Option>
    <Option>Explicitly setting the default value to 'null'.</Option>
  </Question>
  <Question title="What is a Union Type (A | B) in TypeScript?">
    <Option>A type requiring a variable to satisfy all properties of A and B simultaneously.</Option>
    <Option correct>A type allowing a variable to accept a value of type A or type B.</Option>
    <Option>A helper function merging two arrays together.</Option>
    <Option>A cross-compilation technique for legacy browsers.</Option>
  </Question>
  <Question title="What is the correct return type annotation for a function that returns no value in TypeScript?">
    <Option>function test(): null</Option>
    <Option>function test(): undefined</Option>
    <Option correct>function test(): void</Option>
    <Option>function test(): never</Option>
  </Question>
  <Question title="What is the difference between 'private' and 'protected' access modifiers in TypeScript classes?">
    <Option correct>Private restricts access strictly to the declaring class; protected allows access in the declaring class and its subclasses.</Option>
    <Option>Private is evaluated at compile-time, while protected is evaluated at runtime.</Option>
    <Option>Protected forbids property mutation, while private permits it.</Option>
    <Option>There is no difference; both modifiers are identical.</Option>
  </Question>
  <Question title="Which utility tool allows executing TypeScript files directly in development without manually transpiling JS files first?">
    <Option>nodemon-js</Option>
    <Option correct>ts-node</Option>
    <Option>tsc-build</Option>
    <Option>babel-preset</Option>
  </Question>
  <Question title="What is the purpose of Generics (&lt;T&gt;) in TypeScript?">
    <Option>To convert static types into 'any' without warnings.</Option>
    <Option correct>To create reusable components, functions, or classes that work across multiple data types while maintaining strict type safety.</Option>
    <Option>To import Node.js modules using CommonJS syntax.</Option>
    <Option>To declare variables whose value changes every second.</Option>
  </Question>
  <Question title="What is produced by using an intersection operator ('&amp;') between two types or interfaces?">
    <Option>A type accepting only values present in both types simultaneously as an exclusive selection.</Option>
    <Option correct>A new type combining all properties and members of both types into one.</Option>
    <Option>An array containing key names from both types.</Option>
    <Option>A syntax error if used outside a class.</Option>
  </Question>
  <Question title="What is a key distinction between 'interface' and 'type' aliases?">
    <Option correct>Interfaces focus on defining object shapes and can be extended/merged, whereas type aliases support union types, tuples, and primitive aliases.</Option>
    <Option>Interfaces only work with strings and types only work with numbers.</Option>
    <Option>Type aliases disappear at compile-time but interfaces are shipped to the browser.</Option>
    <Option>There is no difference; they are completely interchangeable in all scenarios.</Option>
  </Question>
  <Question title="If you declare 'function calc(a: number, b: number = 5, c?: string)' and return 'a + b', what return type is inferred?">
    <Option>string</Option>
    <Option correct>number</Option>
    <Option>void</Option>
    <Option>any</Option>
  </Question>
  <Question title="Why do TypeScript best practices strongly discourage using the 'any' type?">
    <Option>Because it reduces page rendering speed.</Option>
    <Option correct>Because it disables static type checking, voiding the safety benefits provided by TypeScript.</Option>
    <Option>Because web browsers throw fatal exceptions when encountering the word 'any'.</Option>
    <Option>Because it is only allowed inside JSON files.</Option>
  </Question>
  <Question title="How do you export and import a 'add' function between modules using standard ES Modules syntax?">
    <Option>export = &#123; add &#125;; / const add = require('./utils');</Option>
    <Option correct>export function add(...) &#123; ... &#125; / import &#123; add &#125; from './utils';</Option>
    <Option>module.exports = add; / include './utils';</Option>
    <Option>public add() / fetch('./utils');</Option>
  </Question>
  <Question title="What happens when you transpile a .ts file to JavaScript and run it in a web browser?">
    <Option>The browser directly executes TypeScript type annotations.</Option>
    <Option correct>The 'tsc' compiler strips away all type annotations, producing standard JavaScript compatible with browsers.</Option>
    <Option>End users must install a specialized browser extension to run TypeScript.</Option>
    <Option>The generated file can only run on Windows servers.</Option>
  </Question>
</Quiz>
