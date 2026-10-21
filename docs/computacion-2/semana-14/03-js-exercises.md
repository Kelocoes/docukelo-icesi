---
sidebar_position: 3
---

# Desafíos de Programación

Actividades para mejorar tus habilidades de programación en JavaScript. Cada desafío incluye un problema, ejemplos de entrada y salida, y una breve descripción del objetivo.

## El escalador novato

#### Problema

Un escalador está comenzando a practicar en un muro de escalada. El muro tiene `n` agarres y Se le da un array `alturas` donde `alturas[i]` representa la altura del agarre. El escalador comienza en el agarre 0 y quiere llegar al agarre `n-1`. Encuentra la altura máxima que debe saltar para llegar al siguiente agarre.

#### Ejemplo 1

- **Entrada:** `[2, 5, 4, 6, 8]`
- **Salida:** `3`

#### Ejemplo 2

- **Entrada:** `[1, 3, 7, 10]`
- **Salida:** `4`

<details>
<summary>💡 Ver solución</summary>

```javascript
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

## El jardinero astuto

#### Problema

Un jardinero tiene un jardín rectangular representado por una matriz `jardin` de `m x n`. Cada celda contiene la cantidad de flores en esa celda. El jardinero quiere recoger la mayor cantidad de flores posible, comenzando desde la esquina superior izquierda y moviéndose solo hacia abajo o hacia la derecha. Devuelve la cantidad máxima de flores que puede recoger.

#### Ejemplo 1

- **Entrada:** `[[1, 2, 3], [4, 5, 6], [7, 8, 9]]`
- **Salida:** `29`

#### Ejemplo 2

- **Entrada:** `[[2, 3, 1], [1, 5, 1], [4, 2, 2]]`
- **Salida:** `14`

<details>
<summary>💡 Ver solución</summary>

```javascript
function recolectar(x, y, jardin) {
    if (x >= jardin.length || y >= jardin[0].length) {
        return 0;
    }

    let value = jardin[x][y];

    return (
        value +
        Math.max(
            recolectar(x + 1, y, jardin), // Abajo
            recolectar(x, y + 1, jardin), // Derecha
        )
    );
}

function maxFlores(jardin) {
    return recolectar(0, 0, jardin);
}
```

</details>

---

## El detective de números

#### Problema

Un detective está investigando un caso. Tiene un array de números `pistas` donde cada número representa una pista. El detective cree que el culpable es la persona cuyo número de identificación aparece más veces en las pistas. Encuentra el número de identificación del culpable.

#### Ejemplo 1

- **Entrada:** `[1, 2, 3, 2, 1, 2, 4, 2]`
- **Salida:** `2`

#### Ejemplo 2

- **Entrada:** `[5, 3, 3, 2, 5, 5, 3]`
- **Salida:** `5`

<details>
<summary>💡 Ver solución</summary>

```javascript
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

## El traductor de idiomas

#### Problema

Un traductor necesita crear un programa que traduzca palabras de un idioma a otro. Se le dan dos arrays de cadenas `idioma1` e `idioma2` donde `idioma1[i]` es la palabra en el primer idioma e `idioma2[i]` es su traducción en el segundo idioma. Se le da una palabra en el primer idioma y debe devolver su traducción en el segundo idioma. Si la palabra no está en el primer idioma, devuelve 'No encontrado'.

#### Ejemplo 1

- **Entrada:**
    ```json
    {
        "idioma1": ["hola", "mundo", "javascript"],
        "idioma2": ["hello", "world", "javascript"],
        "palabra": "mundo"
    }
    ```
- **Salida:** "world"

#### Ejemplo 2

- **Entrada:**
    ```json
    {
        "idioma1": ["perro", "gato", "pájaro"],
        "idioma2": ["dog", "cat", "bird"],
        "palabra": "elefante"
    }
    ```
- **Salida:** "No encontrado"

<details>
<summary>💡 Ver solución</summary>

```javascript
function traducir(idioma1, idioma2, palabra) {
    let index = idioma1.indexOf(palabra);
    return index !== -1 ? idioma2[index] : "No encontrado";
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
); // "No encontrado"
```

</details>

---

## El organizador de tareas

#### Problema

Un organizador de tareas tiene una lista de tareas representadas por un array de números `tareas`. Cada número representa la duración de una tarea. El organizador quiere realizar todas las tareas en el menor tiempo posible. Solo puede realizar una tarea a la vez. Encuentra el tiempo mínimo necesario para completar todas las tareas.

#### Ejemplo 1

- **Entrada:** `[2, 5, 1, 8, 3]`
- **Salida:** `19`

#### Ejemplo 2

- **Entrada:** `[1, 2, 3]`
- **Salida:** `6`

<details>
<summary>💡 Ver solución</summary>

```javascript
function tiempoTotal(tareas) {
    return tareas.reduce((total, tarea) => total + tarea, 0);
}

console.log(tiempoTotal([2, 5, 1, 8, 3])); // 19
console.log(tiempoTotal([1, 2, 3])); // 6
```

</details>

---

## El analista de datos

#### Problema

Un analista de datos tiene un array de números `datos` que representan las ventas de una empresa durante un año. El analista quiere encontrar el mes con las mayores ventas. Devuelve el índice del mes con las mayores ventas (0 para enero, 1 para febrero, etc.).

#### Ejemplo 1

- **Entrada:** `[100, 150, 200, 180, 250, 220, 300, 280, 350, 320, 400, 380]`
- **Salida:** `10 (Noviembre)`

#### Ejemplo 2

- **Entrada:** `[50, 75, 90, 100, 85, 60, 95, 105, 110, 115, 80, 70]`
- **Salida:** `9 (Octubre)`

<details>
<summary>💡 Ver solución</summary>

```javascript
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

## El corrector de textos

#### Problema

Un corrector de textos necesita un programa que cuente el número de palabras en un texto. Se le da un texto como una cadena y debe devolver el número de palabras en el texto. Las palabras están separadas por espacios.

#### Ejemplo 1

- **Entrada:** `"Este es un texto de ejemplo"`
- **Salida:** `6`

#### Ejemplo 2

- **Entrada:** `"Hola, ¿cómo estás?"`
- **Salida:** `3`

<details>
<summary>💡 Ver solución</summary>

```javascript
function contarPalabras(texto) {
    return texto.split(" ").length;
}

console.log(contarPalabras("Este es un texto de ejemplo")); // 6
console.log(contarPalabras("Hola, ¿cómo estás?")); // 3
```

</details>

---

## El generador de contraseñas

#### Problema

Un generador de contraseñas necesita crear contraseñas seguras. Se le da una longitud de contraseña y debe generar una contraseña aleatoria que contenga letras mayúsculas, letras minúsculas y números.

#### Ejemplo 1

- **Entrada:** `10`
- **Salida:** `"aB3cD3EfGh"`

#### Ejemplo 2

- **Entrada:** `8`
- **Salida:** `"Ab12Cd34"`

<details>
<summary>💡 Ver solución</summary>

```javascript
function generarContraseña(longitud) {
    const caracteres =
        "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
    let contraseña = "";
    for (let i = 0; i < longitud; i++) {
        contraseña += caracteres[Math.floor(Math.random() * caracteres.length)];
    }
    return contraseña;
}

console.log(generarContraseña(10)); // Ejemplo: "aB3cD3EfGh"
console.log(generarContraseña(8)); // Ejemplo: "Ab12Cd34"
```

</details>

---

## El juego de cartas

#### Problema

Un juego de cartas tiene un mazo de cartas representadas por un array de números `mazo`. Cada número representa el valor de una carta. Los jugadores deben robar cartas del mazo y sumar sus valores. El jugador con la mayor suma gana. Se le da un mazo y se le pide que simule el juego para dos jugadores. Devuelve la diferencia entre la suma de los valores de las cartas del ganador y el perdedor.

#### Ejemplo 1

- **Entrada:** `[5, 2, 8, 3, 9, 1, 7, 4, 6, 10]`
- **Salida:** `15`

#### Ejemplo 2

- **Entrada:** `[10, 5, 4, 3, 8, 6, 2]`
- **Salida:** `10`

<details>
<summary>💡 Ver solución</summary>

```javascript
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

## El contador de palabras

#### Problema

Un escritor quiere contar cuántas veces aparece cada letra en un texto. Se te da una cadena texto y debes devolver un objeto donde las claves son las letras y los valores son la cantidad de veces que aparece cada letra. Ignora los espacios.

#### Ejemplo 1

- **Entrada:** `"hola mundo"`
- **Salida:** `{ h: 1, o: 2, l: 1, a: 1, m: 1, u: 1, n: 1, d: 1 }`

#### Ejemplo 2

- **Entrada:** `"javascript"`
- **Salida:** `{ j: 1, a: 2, v: 1, s: 1, c: 1, r: 1, i: 1, p: 1, t: 1 }`

<details>
<summary>💡 Ver solución</summary>

```javascript
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

## El elevador de números

#### Problema

Un matemático está trabajando con una lista de números y quiere elevar cada número al cuadrado. Se te da un array numeros y debes devolver un nuevo array donde cada número esté elevado al cuadrado.

#### Ejemplo 1

- **Entrada:** `[1, 2, 3, 4, 5]`
- **Salida:** `[1, 4, 9, 16, 25]`

#### Ejemplo 2

- **Entrada:** `[6, 7, 8, 9, 10]`
- **Salida:** `[36, 49, 64, 81, 100]`

<details>
<summary>💡 Ver solución</summary>

```javascript
function elevarCuadrado(numeros) {
    return numeros.map((num) => num ** 2);
}

console.log(elevarCuadrado([1, 2, 3, 4, 5])); // [1, 4, 9, 16, 25]
console.log(elevarCuadrado([6, 7, 8, 9, 10])); // [36, 49, 64, 81, 100]
```

</details>

## Más ejercicios de JS

- [LeetCode Problemset](https://leetcode.com/problemset)
- [HackerRank - 10 Days of JavaScript](https://www.hackerrank.com/domains/tutorials/10-days-of-javascript)
- [JS Challenger - Variables](https://www.jschallenger.com/javascript-basics/variables/introduction)
- [JS Hero - Koans](https://www.jshero.net/en/koans/var.html)
- [GitHub - JavaScript Coding Challenges](https://github.com/rradfar/javascript-coding-challenges)
