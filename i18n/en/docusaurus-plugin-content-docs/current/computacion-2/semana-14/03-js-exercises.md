---
sidebar_position: 3
description: "Solve JavaScript programming challenges with input and output examples to reinforce what you learned."
---

# Programming Challenges

Activities to improve your JavaScript programming skills. Each challenge includes a problem, input and output examples, and a short description of the goal.

## The novice climber

#### Problem

A climber is starting to practice on a climbing wall. The wall has `n` holds and you are given an array `alturas` where `alturas[i]` represents the height of the hold. The climber starts at hold 0 and wants to reach hold `n-1`. Find the maximum height the climber has to jump to reach the next hold.

#### Example 1

- **Input:** `[2, 5, 4, 6, 8]`
- **Output:** `3`

#### Example 2

- **Input:** `[1, 3, 7, 10]`
- **Output:** `4`

<details>
<summary>See solution</summary>

```javascript title="Example 2"
function alturaMaxima(alturas) {
    let saltoMax = 0;
    for (let i = 0; i < alturas.length - 1; i++) {
        saltoMax = Math.max(saltoMax, Math.abs(alturas[i + 1] - alturas[i]));
    }
    return saltoMax;
}

console.log(alturaMaxima([2, 5, 4, 6, 8])); // 3
console.log(alturaMaxima([1, 3, 7, 10])); // 4
```

</details>

---

## The clever gardener

#### Problem

A gardener has a rectangular garden represented by an `m x n` matrix `jardin`. Each cell contains the number of flowers in that cell. The gardener wants to pick as many flowers as possible, starting from the top-left corner and moving only down or to the right. Return the maximum number of flowers that can be picked.

#### Example 1

- **Input:** `[[1, 2, 3], [4, 5, 6], [7, 8, 9]]`
- **Output:** `29`

#### Example 2

- **Input:** `[[2, 3, 1], [1, 5, 1], [4, 2, 2]]`
- **Output:** `14`

<details>
<summary>See solution</summary>

```javascript title="Example 2"
function recolectar(x, y, jardin) {
    if (x >= jardin.length || y >= jardin[0].length) {
        return 0;
    }

    let value = jardin[x][y];

    return (
        value +
        Math.max(
            recolectar(x + 1, y, jardin), // Down
            recolectar(x, y + 1, jardin), // Right
        )
    );
}

function maxFlores(jardin) {
    return recolectar(0, 0, jardin);
}
```

</details>

---

## The number detective

#### Problem

A detective is investigating a case. They have an array of numbers `pistas` where each number represents a clue. The detective believes the culprit is the person whose ID number appears most often in the clues. Find the culprit's ID number.

#### Example 1

- **Input:** `[1, 2, 3, 2, 1, 2, 4, 2]`
- **Output:** `2`

#### Example 2

- **Input:** `[5, 3, 3, 2, 5, 5, 3]`
- **Output:** `5`

<details>
<summary>See solution</summary>

```javascript title="Example 2"
function culpable(pistas) {
    let mapa = {};
    let maxCount = 0;
    let culpable = null;

    for (let num of pistas) {
        mapa[num] = (mapa[num] || 0) + 1;
        if (mapa[num] > maxCount) {
            maxCount = mapa[num];
            culpable = num;
        }
    }

    return culpable;
}

console.log(culpable([1, 2, 3, 2, 1, 2, 4, 2])); // 2
console.log(culpable([5, 3, 3, 2, 5, 5, 3])); // 5
```

</details>

---

## The language translator

#### Problem

A translator needs to create a program that translates words from one language to another. You are given two arrays of strings `idioma1` and `idioma2` where `idioma1[i]` is the word in the first language and `idioma2[i]` is its translation in the second language. You are given a word in the first language and must return its translation in the second language. If the word is not in the first language, return 'Not found'.

#### Example 1

- **Input:**
    ```json title="Example 1"
    {
        "idioma1": ["hola", "mundo", "javascript"],
        "idioma2": ["hello", "world", "javascript"],
        "palabra": "mundo"
    }
    ```
- **Output:** "world"

#### Example 2

- **Input:**
    ```json title="Example 2"
    {
        "idioma1": ["perro", "gato", "pájaro"],
        "idioma2": ["dog", "cat", "bird"],
        "palabra": "elefante"
    }
    ```
- **Output:** "Not found"

<details>
<summary>See solution</summary>

```javascript title="Example 2"
function traducir(idioma1, idioma2, palabra) {
    let index = idioma1.indexOf(palabra);
    return index !== -1 ? idioma2[index] : "Not found";
}

console.log(
    traducir(
        ["hola", "mundo", "javascript"],
        ["hello", "world", "javascript"],
        "mundo",
    ),
); // "world"
console.log(
    traducir(["perro", "gato", "pájaro"], ["dog", "cat", "bird"], "elefante"),
); // "Not found"
```

</details>

---

## The task organizer

#### Problem

A task organizer has a list of tasks represented by an array of numbers `tareas`. Each number represents the duration of a task. The organizer wants to complete all the tasks in the shortest possible time. They can only do one task at a time. Find the minimum time needed to complete all the tasks.

#### Example 1

- **Input:** `[2, 5, 1, 8, 3]`
- **Output:** `19`

#### Example 2

- **Input:** `[1, 2, 3]`
- **Output:** `6`

<details>
<summary>See solution</summary>

```javascript title="Example 2"
function tiempoTotal(tareas) {
    return tareas.reduce((total, tarea) => total + tarea, 0);
}

console.log(tiempoTotal([2, 5, 1, 8, 3])); // 19
console.log(tiempoTotal([1, 2, 3])); // 6
```

</details>

---

## The data analyst

#### Problem

A data analyst has an array of numbers `datos` that represent a company's sales over a year. The analyst wants to find the month with the highest sales. Return the index of the month with the highest sales (0 for January, 1 for February, etc.).

#### Example 1

- **Input:** `[100, 150, 200, 180, 250, 220, 300, 280, 350, 320, 400, 380]`
- **Output:** `10 (November)`

#### Example 2

- **Input:** `[50, 75, 90, 100, 85, 60, 95, 105, 110, 115, 80, 70]`
- **Output:** `9 (October)`

<details>
<summary>See solution</summary>

```javascript title="Example 2"
function mesMayorVentas(datos) {
    let maxVentas = Math.max(...datos);
    return datos.indexOf(maxVentas);
}

console.log(
    mesMayorVentas([
        100, 150, 200, 180, 250, 220, 300, 280, 350, 320, 400, 380,
    ]),
); // 10
console.log(
    mesMayorVentas([50, 75, 90, 100, 85, 60, 95, 105, 110, 115, 80, 70]),
); // 9
```

</details>

---

## The text proofreader

#### Problem

A proofreader needs a program that counts the number of words in a text. You are given a text as a string and must return the number of words in the text. Words are separated by spaces.

#### Example 1

- **Input:** `"This is an example of text"`
- **Output:** `6`

#### Example 2

- **Input:** `"Hi, what's up?"`
- **Output:** `3`

<details>
<summary>See solution</summary>

```javascript title="Example 2"
function contarPalabras(texto) {
    return texto.split(" ").length;
}

console.log(contarPalabras("This is an example of text")); // 6
console.log(contarPalabras("Hi, what's up?")); // 3
```

</details>

---

## The password generator

#### Problem

A password generator needs to create secure passwords. You are given a password length and must generate a random password that contains uppercase letters, lowercase letters, and numbers.

#### Example 1

- **Input:** `10`
- **Output:** `"aB3cD3EfGh"`

#### Example 2

- **Input:** `8`
- **Output:** `"Ab12Cd34"`

<details>
<summary>See solution</summary>

```javascript title="Example 2"
function generarContraseña(longitud) {
    const caracteres =
        "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
    let contraseña = "";
    for (let i = 0; i < longitud; i++) {
        contraseña += caracteres[Math.floor(Math.random() * caracteres.length)];
    }
    return contraseña;
}

console.log(generarContraseña(10)); // Example: "aB3cD3EfGh"
console.log(generarContraseña(8)); // Example: "Ab12Cd34"
```

</details>

---

## The card game

#### Problem

A card game has a deck of cards represented by an array of numbers `mazo`. Each number represents the value of a card. Players must draw cards from the deck and add up their values. The player with the highest sum wins. You are given a deck and asked to simulate the game for two players. Return the difference between the sum of the card values of the winner and the loser.

#### Example 1

- **Input:** `[5, 2, 8, 3, 9, 1, 7, 4, 6, 10]`
- **Output:** `15`

#### Example 2

- **Input:** `[10, 5, 4, 3, 8, 6, 2]`
- **Output:** `10`

<details>
<summary>See solution</summary>

```javascript title="Example 2"
function diferenciaJuegoCartas(mazo) {
    let jugador1 = 0;
    let jugador2 = 0;

    for (let i = 0; i < mazo.length; i++) {
        if (i % 2 === 0) {
            jugador1 += mazo[i];
        } else {
            jugador2 += mazo[i];
        }
    }

    return Math.abs(jugador1 - jugador2);
}

console.log(diferenciaJuegoCartas([5, 2, 8, 3, 9, 1, 7, 4, 6, 10])); // 15
console.log(diferenciaJuegoCartas([10, 5, 4, 3, 8, 6, 2])); // 10
```

</details>

---

## The letter counter

#### Problem

A writer wants to count how many times each letter appears in a text. You are given a string texto and must return an object where the keys are the letters and the values are the number of times each letter appears. Ignore spaces.

#### Example 1

- **Input:** `"hola mundo"`
- **Output:** `{ h: 1, o: 2, l: 1, a: 1, m: 1, u: 1, n: 1, d: 1 }`

#### Example 2

- **Input:** `"javascript"`
- **Output:** `{ j: 1, a: 2, v: 1, s: 1, c: 1, r: 1, i: 1, p: 1, t: 1 }`

<details>
<summary>See solution</summary>

```javascript title="Example 2"
function contarLetras(texto) {
    let contador = {};
    for (let letra of texto.replace(/\s+/g, "")) {
        contador[letra] = (contador[letra] || 0) + 1;
    }
    return contador;
}

console.log(contarLetras("hola mundo")); // { h: 1, o: 2, l: 1, a: 1, m: 1, u: 1, n: 1, d: 1 }
console.log(contarLetras("javascript")); // { j: 1, a: 2, v: 1, s: 1, c: 1, r: 1, i: 1, p: 1, t: 1 }
```

</details>

---

## The number squarer

#### Problem

A mathematician is working with a list of numbers and wants to square each number. You are given an array numeros and must return a new array where each number is squared.

#### Example 1

- **Input:** `[1, 2, 3, 4, 5]`
- **Output:** `[1, 4, 9, 16, 25]`

#### Example 2

- **Input:** `[6, 7, 8, 9, 10]`
- **Output:** `[36, 49, 64, 81, 100]`

<details>
<summary>See solution</summary>

```javascript title="Example 2"
function elevarCuadrado(numeros) {
    return numeros.map((num) => num ** 2);
}

console.log(elevarCuadrado([1, 2, 3, 4, 5])); // [1, 4, 9, 16, 25]
console.log(elevarCuadrado([6, 7, 8, 9, 10])); // [36, 49, 64, 81, 100]
```

</details>

## More JS exercises

- [LeetCode Problemset](https://leetcode.com/problemset)
- [HackerRank - 10 Days of JavaScript](https://www.hackerrank.com/domains/tutorials/10-days-of-javascript)
- [JS Challenger - Variables](https://www.jschallenger.com/javascript-basics/variables/introduction)
- [JS Hero - Koans](https://www.jshero.net/en/koans/var.html)
- [GitHub - JavaScript Coding Challenges](https://github.com/rradfar/javascript-coding-challenges)
