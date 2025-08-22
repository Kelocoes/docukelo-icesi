---
sidebar_position: 6
---

# Ejercicios de Programación Orientada a Objetos en JavaScript

En este documento encontrarás una serie de ejercicios prácticos diseñados para reforzar los conceptos de programación orientada a objetos (POO) en JavaScript.

## ¿Qué es la programación orientada a objetos (POO)?

La programación es la actividad de construir un conjunto de instrucciones que permiten interactuar con un computador. A lo largo del tiempo han surgido diferentes paradigmas de programación, es decir, distintas formas de organizar y pensar el código.  
La **programación orientada a objetos (POO)** es uno de esos paradigmas, y se basa en el concepto de **objetos**.

Un objeto es una estructura que agrupa datos (atributos) y comportamientos (métodos). La idea principal de la POO es modelar conceptos del mundo real dentro de un programa, lo que facilita la comprensión, modularidad y reutilización del código.

<img src="/img/programming-paradigms.png" alt="POO en JavaScript" />

---

## Ejercicios prácticos

A continuación, encontrarás ejercicios para aplicar los conceptos de clases, herencia y polimorfismo en JavaScript.  

---

### Ejercicio 1: Clase `Coche`
Crea una clase `Coche` con propiedades `marca`, `modelo` y `año`.  
Agrega métodos para:  
- Mostrar la información del coche.  
- Determinar si es antiguo (antes del año 2000).  
- Verificar si es de lujo (ejemplo: "Mercedes", "BMW", "Audi").  

<details>
<summary>Ver solución</summary>

```js
class Coche {
    constructor(marca, modelo, año) {
        this.marca = marca;
        this.modelo = modelo;
        this.año = año;
    }

    mostrarInfo() {
        console.log(`${this.marca} ${this.modelo} (${this.año})`);
    }

    esAntiguo() {
        return this.año < 2000;
    }

    esDeLujo() {
        const marcasLujo = ["Mercedes", "BMW", "Audi"];
        return marcasLujo.includes(this.marca);
    }
}

const coche1 = new Coche("BMW", "X5", 1998);
coche1.mostrarInfo();
console.log(coche1.esAntiguo());
console.log(coche1.esDeLujo());
```
</details>

---

### Ejercicio 2: Clase `Rectángulo`
Crea una clase `Rectángulo` con propiedades `ancho` y `alto`.  
Agrega métodos para:  
- Calcular el área.  
- Calcular el perímetro.  
- Verificar si es un cuadrado.  

<details>
<summary>Ver solución</summary>

```js
class Rectangulo {
    constructor(ancho, alto) {
        this.ancho = ancho;
        this.alto = alto;
    }

    area() {
        return this.ancho * this.alto;
    }

    perimetro() {
        return 2 * (this.ancho + this.alto);
    }

    esCuadrado() {
        return this.ancho === this.alto;
    }
}

const r1 = new Rectangulo(5, 5);
console.log(r1.area());
console.log(r1.perimetro());
console.log(r1.esCuadrado());
```
</details>

---

### Ejercicio 3: Clase `Persona` con métodos adicionales
Crea una clase `Persona` con propiedades `nombre`, `edad` y `profesión`.  
Incluye métodos para:  
- Presentarse mostrando todos sus datos.  
- Verificar si es mayor de edad.  

<details>
<summary>Ver solución</summary>

```js
class Persona {
    constructor(nombre, edad, profesion) {
        this.nombre = nombre;
        this.edad = edad;
        this.profesion = profesion;
    }

    presentarse() {
        console.log(`Soy ${this.nombre}, tengo ${this.edad} años y soy ${this.profesion}.`);
    }

    esMayorDeEdad() {
        return this.edad >= 18;
    }
}

const p1 = new Persona("Ana", 22, "Ingeniera");
p1.presentarse();
console.log(p1.esMayorDeEdad());
```
</details>

---

### Ejercicio 4: Herencia con `Animal`
Crea una clase base `Animal` con un método `hacerSonido()`.  
Luego, crea clases hijas `Perro` y `Gato` que sobrescriban ese método con sonidos distintos.  

<details>
<summary>Ver solución</summary>

```js
class Animal {
    hacerSonido() {
        console.log("Sonido genérico de animal");
    }
}

class Perro extends Animal {
    hacerSonido() {
        console.log("Guau Guau");
    }
}

class Gato extends Animal {
    hacerSonido() {
        console.log("Miau");
    }
}

const perro = new Perro();
const gato = new Gato();
perro.hacerSonido();
gato.hacerSonido();
```
</details>

---

### Ejercicio 5: Clase `CuentaBancaria`
Crea una clase `CuentaBancaria` con propiedades `titular` y `saldo`.  
Agrega métodos para:  
- Depositar dinero.  
- Retirar dinero (validando que haya fondos).  
- Mostrar el saldo actual.  

<details>
<summary>Ver solución</summary>

```js
class CuentaBancaria {
    constructor(titular, saldo = 0) {
        this.titular = titular;
        this.saldo = saldo;
    }

    depositar(monto) {
        this.saldo += monto;
    }

    retirar(monto) {
        if (monto <= this.saldo) {
            this.saldo -= monto;
        } else {
            console.log("Fondos insuficientes");
        }
    }

    mostrarSaldo() {
        console.log(`Saldo de ${this.titular}: $${this.saldo}`);
    }
}

const cuenta = new CuentaBancaria("Luis", 100);
cuenta.depositar(50);
cuenta.retirar(30);
cuenta.mostrarSaldo();
```
</details>

---

### Ejercicio 6: Clase `Triángulo`
Crea una clase `Triángulo` que reciba tres lados.  
Agrega métodos para:  
- Verificar si es equilátero, isósceles o escaleno.  
- Calcular su perímetro.  

<details>
<summary>Ver solución</summary>

```js
class Triangulo {
    constructor(lado1, lado2, lado3) {
        this.lado1 = lado1;
        this.lado2 = lado2;
        this.lado3 = lado3;
    }

    tipo() {
        if (this.lado1 === this.lado2 && this.lado2 === this.lado3) {
            return "Equilátero";
        } else if (this.lado1 === this.lado2 || this.lado2 === this.lado3 || this.lado1 === this.lado3) {
            return "Isósceles";
        } else {
            return "Escaleno";
        }
    }

    perimetro() {
        return this.lado1 + this.lado2 + this.lado3;
    }
}

const t1 = new Triangulo(3, 3, 3);
console.log(t1.tipo());
console.log(t1.perimetro());
```
</details>

---

### Ejercicio 7: Polimorfismo con `Vehículo`
Crea una clase base `Vehículo` con un método `mover()`.  
Crea clases hijas `Bicicleta`, `Coche` y `Avión` que sobrescriban el método `mover()` con mensajes diferentes.  

<details>
<summary>Ver solución</summary>

```js
class Vehiculo {
    mover() {
        console.log("El vehículo se está moviendo.");
    }
}

class Bicicleta extends Vehiculo {
    mover() {
        console.log("La bicicleta avanza con pedales.");
    }
}

class Coche extends Vehiculo {
    mover() {
        console.log("El coche rueda por la carretera.");
    }
}

class Avion extends Vehiculo {
    mover() {
        console.log("El avión vuela por los cielos.");
    }
}

const bici = new Bicicleta();
const coche = new Coche();
const avion = new Avion();

bici.mover();
coche.mover();
avion.mover();
```
</details>

---

### Ejercicio 8: Clase `Producto`
Crea una clase `Producto` con propiedades `nombre` y `precio`.  
Agrega un método para mostrar su información.  
Luego, crea una clase hija `ProductoElectronico` que además tenga una `garantía` y muestre todos los datos incluyendo la garantía.  

<details>
<summary>Ver solución</summary>

```js
class Producto {
    constructor(nombre, precio) {
        this.nombre = nombre;
        this.precio = precio;
    }

    mostrarInfo() {
        console.log(`${this.nombre} cuesta $${this.precio}`);
    }
}

class ProductoElectronico extends Producto {
    constructor(nombre, precio, garantia) {
        super(nombre, precio);
        this.garantia = garantia;
    }

    mostrarInfo() {
        console.log(`${this.nombre} cuesta $${this.precio} y tiene ${this.garantia} años de garantía.`);
    }
}

const laptop = new ProductoElectronico("Laptop", 1500, 2);
laptop.mostrarInfo();
```
</details>

---

### Ejercicio 9: Clase `Libro`
Crea una clase `Libro` con propiedades `título`, `autor` y `año`.  
Agrega métodos para:  
- Mostrar la información del libro.  
- Verificar si es un libro antiguo (antes de 1950).  

<details>
<summary>Ver solución</summary>

```js
class Libro {
    constructor(titulo, autor, año) {
        this.titulo = titulo;
        this.autor = autor;
        this.año = año;
    }

    mostrarInfo() {
        console.log(`${this.titulo} por ${this.autor}, publicado en ${this.año}`);
    }

    esAntiguo() {
        return this.año < 1950;
    }
}

const libro1 = new Libro("Cien años de soledad", "Gabriel García Márquez", 1967);
libro1.mostrarInfo();
console.log(libro1.esAntiguo());
```
</details>

---

### Ejercicio 10: Sistema de Figuras
Crea una clase base `Figura` con un método `calcularArea()`.  
Crea clases hijas `Círculo`, `Cuadrado` y `Rectángulo` que implementen el método de forma distinta según su fórmula matemática.  

<details>
<summary>Ver solución</summary>

```js
class Figura {
    calcularArea() {
        return 0;
    }
}

class Circulo extends Figura {
    constructor(radio) {
        super();
        this.radio = radio;
    }

    calcularArea() {
        return Math.PI * this.radio * this.radio;
    }
}

class Cuadrado extends Figura {
    constructor(lado) {
        super();
        this.lado = lado;
    }

    calcularArea() {
        return this.lado * this.lado;
    }
}

class Rectangulo extends Figura {
    constructor(ancho, alto) {
        super();
        this.ancho = ancho;
        this.alto = alto;
    }

    calcularArea() {
        return this.ancho * this.alto;
    }
}

const c = new Circulo(5);
const cu = new Cuadrado(4);
const r = new Rectangulo(3, 6);

console.log(c.calcularArea());
console.log(cu.calcularArea());
console.log(r.calcularArea());
```
</details>

---
