---
sidebar_position: 1
description: "Learn the JavaScript paradigm, what it means to be an interpreted language, and how it differs from ECMAScript."
---

# Introduction to JavaScript

General aspects of the language and its purpose in Web development.

## Slides

<iframe 
    src="https://www.canva.com/design/DAG22fmkvRU/wqK3aS3aWdjjJwAbUa1TQQ/view?embed"
    width="100%"
    height="600px"
    allowfullscreen="true"
    frameborder="0"
></iframe>

## Javascript

JavaScript is a programming language widely used for web development, especially to create interactive experiences in the browser. It is versatile, since it can be used both on the client side and on the server side (thanks to environments such as Node.js).

---

### Language paradigm

JavaScript is **multi-paradigm**, which means it supports several programming styles:

- **Imperative**: based on step-by-step instructions. This paradigm is useful to understand how operations are executed in sequence.
  ```javascript title="Language paradigm"
  let numbers = [1, 2, 3];
  for (let i = 0; i < numbers.length; i++) {
    console.log(numbers[i]); // Prints each number to the console
  }
  ```

- **Object-oriented**: based on prototypes and, more recently, on classes. This paradigm lets you model real-world entities as objects.
  ```javascript title="Language paradigm (2)"
  class Person {
    constructor(name) {
      this.name = name;
    }
    greet() {
      console.log(`Hi, I'm ${this.name}`);
    }
  }
  ```

- **Functional**: treats functions as first-class citizens. This paradigm is ideal for working with data in a declarative way.
  ```javascript title="Language paradigm (3)"
  let numbers = [1, 2, 3];
  numbers.forEach(num => console.log(num)); // Prints each number using a function
  ```

---

### What does it mean to be an interpreted language?

An interpreted language is executed line by line by an interpreter, instead of being compiled to machine code before it runs. This makes development faster, but it can be less efficient in performance than compiled languages.

In JavaScript, the interpreter is usually the browser engine (such as V8 in Chrome or SpiderMonkey in Firefox).

Example:
```javascript title="What it means to be an interpreted language"
console.log("Hello world"); // Runs immediately
console.log("This line runs afterwards"); // Runs in order
```

---

### Javascript vs ECMAScript

- **ECMAScript (ES)**: The specification that defines how the language must work. It is the standard that guides the implementations.
- **JavaScript**: The practical implementation of that specification, used in browsers and other environments.

For example:
- ES5: Introduced `strict mode`, which helps avoid common mistakes.
- ES6 (2015): Introduced modern features such as `let`, `const`, arrow functions, classes, etc.

ES6 example:
```javascript title="Javascript vs ECMAScript"
const greet = (name) => `Hello, ${name}`;
console.log(greet("Ana")); // "Hello, Ana"
```

Strict Mode example:
```javascript title="Javascript vs ECMAScript (2)"
"use strict"; // Enables strict mode
let x = 3.14;
console.log(x); // 3.14
```

---

### Installing Node (Mac, Windows, Linux)

Node.js is a runtime environment for JavaScript on the server side. Here is how to install it:

**Windows**
1. Go to [https://nodejs.org](https://nodejs.org).
2. Download the LTS installer (the version recommended for most users).
3. Run the installer and follow the steps.

**MacOS (Homebrew)**
```bash
brew install node
```

**Linux (Ubuntu/Debian)**
```bash
sudo apt update
sudo apt install nodejs npm
```

Verify the installation:
```bash
node -v // Shows the installed Node.js version
npm -v  // Shows the installed npm version
```

---

### Variables and data types

JavaScript has several data types: `string`, `number`, `boolean`, `null`, `undefined`, `symbol`, `bigint`, and objects.

#### Immutable
Primitive values cannot be changed. This means you cannot directly modify the content of a primitive value.
```javascript title="Immutable"
let text = "Hello";
text[0] = "J"; // Does not change
console.log(text); // "Hello"
```

#### Mutable
Objects and arrays can be modified. This allows you to work with more complex data structures.
```javascript title="Mutable"
let arr = [1, 2, 3];
arr[0] = 99; // Changes the first element
console.log(arr); // [99, 2, 3]
```

#### Dynamic typing
The type of a variable can change at runtime. This makes JavaScript flexible, but it can cause errors if you are not careful.
```javascript title="Dynamic typing"
let x = 5; // number
x = "Hello"; // string
```

---

### Hoisting

Hoisting is the behavior by which declarations are "moved" to the top of their context. This can be confusing if it is not well understood.

#### Variables
Variables declared with `var` are "hoisted", but their value is not.
```javascript title="Variables"
console.log(a); // undefined
var a = 5;
```

#### Functions
Declared functions are fully "hoisted", which means you can call them before declaring them.
```javascript title="Functions"
greet(); // Works
function greet() {
  console.log("Hello");
}
```

---

### Data manipulation

#### Operators
Operators let you perform calculations and operations with data.
```javascript title="Operators"
let sum = 5 + 3; // 8
let subtraction = 10 - 4; // 6
let multiplication = 2 * 6; // 12
let division = 10 / 2; // 5
```

#### Popular methods
String and array methods are useful to manipulate data.
```javascript title="Popular methods"
let text = "JavaScript";
console.log(text.toUpperCase()); // "JAVASCRIPT"
console.log(text.includes("Script")); // true
```

#### Type coercion
JavaScript automatically converts data types in certain operations.
```javascript title="Type coercion"
console.log("5" + 2); // "52" (concatenation)
console.log("5" - 2); // 3 (conversion to number)
```

#### Loose vs Strict equality
Strict comparison (`===`) checks type and value, while loose comparison (`==`) only checks value.
```javascript title="Loose vs Strict equality"
console.log(5 == "5");  // true
console.log(5 === "5"); // false
```

---

### Control structures

#### Conditionals
They let you run code based on conditions.
```javascript title="Conditionals"
if (true) console.log("Condition met");
```

#### Loops
They let you repeat blocks of code.
```javascript title="Loops"
for (let i = 0; i < 3; i++) console.log(i);
```

#### Exceptions
They let you handle errors in a controlled way.
```javascript title="Exceptions"
try {
  throw new Error("Example error");
} catch (e) {
  console.log(e.message);
}
```

---

### Functions

#### Declaration
Declared functions are "hoisted" and can be called before their definition.
```javascript title="Declaration"
function greet() {
  console.log("Hello");
}
```

#### Expressions
Function expressions are not "hoisted".
```javascript title="Expressions"
const greet = function() { console.log("Hello"); }
```

#### Arrow
Arrow functions are a concise way to write functions.
```javascript title="Arrow"
const greet = () => console.log("Hello");
```

#### Higher-order
Higher-order functions accept other functions as arguments.
```javascript title="Higher-order"
function operate(fn, a, b) {
  return fn(a, b);
}
console.log(operate((x, y) => x + y, 3, 4)); // 7
```

#### Callbacks
Callbacks are functions that run after another function finishes.
```javascript title="Callbacks"
function process(callback) {
  console.log("Running...");
  callback();
}
process(() => console.log("Done"));
```

---

### Objects

#### Literals
Object literals are a simple way to create data structures.
```javascript title="Literals"
let person = { name: "Ana", age: 25 };
```

#### Classes
Classes are a modern way to work with objects and inheritance.
```javascript title="Classes"
class Person {
  constructor(name) { this.name = name; }
  greet() { console.log("Hi, I'm " + this.name); }
}
```

#### Prototypes
Prototypes are the basis of inheritance in JavaScript. 
```javascript title="Prototypes"
function Animal(name) { this.name = name; }
Animal.prototype.greet = function() { console.log("Hi, I'm " + this.name); }
```
Prototypes in JavaScript are objects that act as templates for other objects. Every object has a prototype that can provide shared properties and methods. This allows you to reuse code and establish relationships between objects.

Basic example:
```javascript title="Prototypes (2)"
function Animal(name) {
    this.name = name;
}
Animal.prototype.greet = function() {
    console.log(`Hi, I'm ${this.name}`);
};

let dog = new Animal("Fluffy");
dog.greet(); // "Hi, I'm Fluffy"
```

Prototypes are fundamental to inheritance in JavaScript, letting objects share behavior without duplicating code.

#### Object methods
Object methods let you work with their properties.
```javascript title="Object methods"
let obj = { a: 1, b: 2 };
console.log(Object.keys(obj)); // ["a", "b"]
console.log(Object.values(obj)); // [1, 2]
console.log(Object.entries(obj)); // [["a", 1], ["b", 2]]
```
