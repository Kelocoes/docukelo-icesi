---
sidebar_position: 4
title: TypeScript Exercises
---

# TypeScript Exercises

This document contains 30 practice exercises for TypeScript. Each exercise includes:
- Starting **JavaScript** code.
- A **Hint** pointing to the TypeScript feature to use and its purpose.
- A **hidden solution** inside `<details>` for self-paced learning.

Difficulty increases progressively.

---

### Exercise 1: Simple Addition (Basic Types)

```javascript
// Convert to TypeScript
function add(a, b) {
  return a + b;
}
```

**Hint:** Use `number` type for parameters and return value.

<details>
<summary>💡 View solution</summary>

```typescript
function add(a: number, b: number): number {
  return a + b;
}
```

</details>

---

### Exercise 2: Optional and Default Parameters

```javascript
// Convert to TypeScript
function greet(name, greeting) {
  greeting = greeting || "Hello";
  return `${greeting}, ${name}`;
}
```

**Hint:** Use default parameter syntax `greeting: string = "Hello"`.

<details>
<summary>💡 View solution</summary>

```typescript
function greet(name: string, greeting: string = "Hello"): string {
  return `${greeting}, ${name}`;
}
```

</details>

---

### Exercise 3: Defining an Object with an Interface

```javascript
// Convert to TypeScript
const createUser = (u) => {
  return `User ${u.name} created with id ${u.id}`;
};
```

**Hint:** Use an `interface` to define the shape of `User`.

<details>
<summary>💡 View solution</summary>

```typescript
interface User {
  id: number;
  name: string;
  email?: string; // optional
}

const createUser = (u: User): string => {
  return `User ${u.name} created with id ${u.id}`;
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

**Hint:** Use `readonly` properties and union literals `"development" | "production"`.

<details>
<summary>💡 View solution</summary>

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
```

</details>

---

### Exercise 5: Tuples

```javascript
// Convert to TypeScript
function createPair(name, age) {
  return [name, age];
}
```

**Hint:** Use a tuple type `[string, number]`.

<details>
<summary>💡 View solution</summary>

```typescript
function createPair(name: string, age: number): [string, number] {
  return [name, age];
}
```

</details>

---

### Exercise 6: Enums for Statuses

```javascript
// Convert to TypeScript
const status = "Active"; // can be 'Active' or 'Inactive'
```

**Hint:** Use `enum Status`.

<details>
<summary>💡 View solution</summary>

```typescript
enum Status {
  Active = "Active",
  Inactive = "Inactive"
}

const currentStatus: Status = Status.Active;
```

</details>

---

### Exercise 7: Generics Identity

```javascript
// Convert to TypeScript
function identity(x) {
  return x;
}
```

**Hint:** Use `<T>` generic parameter.

<details>
<summary>💡 View solution</summary>

```typescript
function identity<T>(x: T): T {
  return x;
}

const num = identity<number>(123);
const str = identity("hello");
```

</details>

---

### Exercise 8: Generic Constraints

```javascript
// Convert to TypeScript
function getLength(x) {
  return x.length;
}
```

**Hint:** Use `T extends { length: number }`.

<details>
<summary>💡 View solution</summary>

```typescript
function getLength<T extends { length: number }>(x: T): number {
  return x.length;
}

console.log(getLength('hello')); // 4
console.log(getLength([1,2,3])); // 3
```

</details>

---

### Exercise 9: Union Types and Type Narrowing

```javascript
// Convert to TypeScript
function format(x) {
  if (typeof x === 'number') {
    return x.toFixed(2);
  }
  return x.trim();
}
```

**Hint:** Use `x: string | number` and `typeof`.

<details>
<summary>💡 View solution</summary>

```typescript
function format(x: string | number): string {
  if (typeof x === 'number') {
    return x.toFixed(2);
  }
  return x.trim();
}
```

</details>

---

### Exercise 10: Discriminated Unions

```javascript
// Convert to TypeScript
function area(shape) {
  if (shape.kind === 'circle') {
    return Math.PI * shape.radius * shape.radius;
  }
  return shape.size * shape.size;
}
```

**Hint:** Define circle and square types with a `kind` discriminant property.

<details>
<summary>💡 View solution</summary>

```typescript
type Circle = { kind: 'circle'; radius: number };
type Square = { kind: 'square'; size: number };
type Shape = Circle | Square;

function area(shape: Shape): number {
  if (shape.kind === 'circle') {
    return Math.PI * shape.radius * shape.radius;
  }
  return shape.size * shape.size;
}
```

</details>

---

### Exercise 11: Utility Types: Pick and Omit

```javascript
// Convert to TypeScript
const user = { id: 1, name: 'Ana', password: '123' };
// We want a public user type without password
```

**Hint:** Use `Omit<User, 'password'>` or `Pick<User, 'id' | 'name'>`.

<details>
<summary>💡 View solution</summary>

```typescript
interface User {
  id: number;
  name: string;
  password: string;
}

type PublicUser = Omit<User, 'password'>;

const safeUser: PublicUser = { id: 1, name: 'Ana' };
```

</details>

---

### Exercise 12: Utility Types: Partial and Required

```javascript
// Convert to TypeScript
function update(user, changes) {
  return { ...user, ...changes };
}
```

**Hint:** Use `Partial<User>` for `changes`.

<details>
<summary>💡 View solution</summary>

```typescript
interface User {
  id: number;
  name: string;
  email?: string;
}

function update(user: User, changes: Partial<User>): User {
  return { ...user, ...changes };
}
```

</details>

---

### Exercise 13: Promises and Async/Await

```javascript
// Convert to TypeScript
async function fetchUser() {
  const r = await fetch('/user');
  return r.json();
}
```

**Hint:** Annotate return type as `Promise<User>`.

<details>
<summary>💡 View solution</summary>

```typescript
interface User { id: number; name: string; }

async function fetchUser(): Promise<User> {
  const r = await fetch('/user');
  const data = await r.json() as User;
  return data;
}
```

</details>
