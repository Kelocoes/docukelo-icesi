---
title: Variables and Types
sidebar_label: Variables and Types
---

# Variables, Types and Null Safety in Dart

Welcome to your first step in learning **Dart**! In this chapter, we will cover the core basics of syntax, variable declarations, type inference, mutability controls, and the modern sound **Null Safety** system.

---

## 1. Declarations and Type Inference

In Dart, everything you assign to a variable is an **object**. This includes numbers, functions, and even `null`. Dart is a strongly-typed language, but it offers powerful type inference through the `var` keyword.

### Explicit Typing vs. Type Inference

```dart title="variables.dart"
void main() {
  // 1. Explicit typing
  String courseName = "Flutter for Mobile Entornos";
  int studentCount = 35;
  double passingGrade = 3.0;
  bool isLabDay = true;

  // 2. Type inference (Dart infers the types automatically)
  var topic = "Introduction to Dart"; // inferred as String
  var weeks = 16;                     // inferred as int
  
  // topic = 100; // Error! Dart does not allow changing the variable type after inference.
  
  print("Course: $courseName | Topic: $topic");
}
```

### The `dynamic` Escape Hatch

If you explicitly need a variable to store values of different types dynamically at runtime, you can declare it using `dynamic`. Use this sparingly as it turns off compile-time type checking.

```dart title="dynamic_example.dart"
void main() {
  dynamic variable = "Hello Icesi";
  print(variable); // Prints: Hello Icesi

  variable = 42; // Allowed!
  print(variable); // Prints: 42
}
```

---

## 2. Mutability Controls: `final` and `const`

To enforce read-only variables, Dart provides two keywords: `final` and `const`. While they look similar, they have a key difference regarding *when* they are evaluated.

| Keyword | Evaluation Time | Common Use Case |
| :--- | :--- | :--- |
| **`final`** | Run-time | API responses, system times, databases. |
| **`const`** | Compile-time | Fixed mathematical constants, UI paddings, styling configurations. |

```dart title="final_vs_const.dart"
void main() {
  // final: can only be set once, but the value is evaluated at runtime
  final DateTime accessTime = DateTime.now(); 

  // const: must be known and constant during compile time
  const double gravity = 9.80665;
  // const DateTime compileTime = DateTime.now(); // Error! DateTime.now() is evaluated at runtime.

  print("Access time: $accessTime | Gravity: $gravity");
}
```

---

## 3. Sound Null Safety

Dart uses **sound null safety**. This means variables cannot contain `null` unless you explicitly declare them as nullable. This prevents the classic "Null Pointer Exception" crashes before code runs.

* **Non-nullable (default)**: `String name = "Luis";` (cannot be assigned `null`).
* **Nullable**: `String? nickname;` (can be assigned `null`, default is `null` if not initialized).

### Null Safety Operators

* **Conditional access (`?.`):** Returns null if the object is null, instead of crashing.
* **Null-assertion (`!`):** Forces a nullable variable to be treated as non-nullable. Throws an exception at runtime if it is indeed null.
* **Null-coalescing (`??`):** Provides a fallback value if the left expression evaluates to null.

```dart title="null_operators.dart"
void main() {
  String? courseDescription;

  // 1. Conditional access (?.): avoids crashes if the variable is null
  print(courseDescription?.length); // Prints: null

  // 2. Null-coalescing (??): assigns default value if null
  String finalDescription = courseDescription ?? 'No description available';
  print(finalDescription); // Prints: No description available

  // 3. Null-assertion (!): only use when you are 100% sure it is not null
  courseDescription = 'Flutter class';
  print(courseDescription.length); // Works
}
```

---

## Practical Exercises

Test your understanding by resolving the following challenges on variables, mutability, and Null Safety.

### Exercise 1: Identify Compilation Errors
Analyze the following code snippet and determine which lines will cause compilation errors and why.

```dart title="exercise1.dart"
void main() {
  var counter = 10;
  counter = '15';
  
  final piValue = 3.14;
  piValue = 3.1416;
  
  const double gravity = 9.8;
  const currentHour = DateTime.now().hour;
  
  String? username;
  print(username!.length);
}
```

<details>
<summary>View detailed solution</summary>

The code contains four compilation errors and one potential runtime exception:

1. **Line 3 (`counter = '15';`):** Compilation error. Dart inferred `counter` as `int`. You cannot assign a `String` to it.
2. **Line 6 (`piValue = 3.1416;`):** Compilation error. `piValue` is `final` and can only be assigned once.
3. **Line 9 (`const currentHour = DateTime.now().hour;`):** Compilation error. `const` variables must be compile-time constants. `DateTime.now()` is resolved at runtime. Change to `final`.
4. **Line 12 (`print(username!.length);`):** Runtime error. Although it compiles because the developer forces it with `!`, it will throw a `NullThrownError` at runtime because `username` is null.

</details>

---

## Self-Assessment

Test your knowledge of Dart variables, types, and Null Safety with this interactive quiz.

<Quiz id="dart-variables-tipos-quiz">
  <Question title="What is the default behavior for uninitialized variables in Dart when Null Safety is enabled?">
    <Option>They automatically default to null.</Option>
    <Option>They assign default values like 0 or an empty string.</Option>
    <Option>They compile normally, but throw runtime crashes when accessed.</Option>
    <Option correct>It is not allowed; Dart requires you to either initialize them or declare them as nullable with '?' to compile.</Option>
  </Question>
  <Question title="What is the difference between 'final' and 'const' in Dart?">
    <Option>final is evaluated at compile-time, whereas const is evaluated at runtime.</Option>
    <Option correct>const is evaluated at compile-time, whereas final is evaluated at runtime.</Option>
    <Option>final allows modifying internal properties, whereas const does not.</Option>
    <Option>They are completely identical synonyms.</Option>
  </Question>
  <Question title="What is the purpose of the 'late' keyword in Dart?">
    <Option>To declare a variable that allows nullable values.</Option>
    <Option correct>To declare a non-nullable variable that will be initialized later, delaying its evaluation.</Option>
    <Option>To force compile-time constant evaluation on variables.</Option>
    <Option>To denote dynamic variable typing.</Option>
  </Question>
  <Question title="Given 'String? name = null;', how do you safely assign a fallback value in case the variable is null?">
    <Option>String greeting = name!;</Option>
    <Option correct>String greeting = name ?? 'Guest';</Option>
    <Option>String greeting = name ?. 'Guest';</Option>
    <Option>String greeting = name == 'Guest';</Option>
  </Question>
  <Question title="What happens if you use the null-assertion operator '!' on a variable that is actually null?">
    <Option>It returns an empty string at runtime.</Option>
    <Option>The compiler throws a syntax error and prevents the build.</Option>
    <Option correct>The compiler accepts it, but a Null Pointer exception is thrown at runtime.</Option>
    <Option>It automatically sets a default value.</Option>
  </Question>
</Quiz>
