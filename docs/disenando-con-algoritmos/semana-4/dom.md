---
sidebar_position: 1
---

# Manipulación del DOM, Eventos y Web Storage en JavaScript

## 1. Manipulación del DOM

### ¿Qué es el DOM?

El **DOM (Document Object Model)** es una representación en forma de árbol de un documento HTML.  
Cada etiqueta de HTML se convierte en un **nodo** que puede ser manipulado con JavaScript.

Ejemplo de HTML:
```html
<!DOCTYPE html>
<html>
  <head><title>Ejemplo DOM</title></head>
  <body>
    <h1>Hola Mundo</h1>
    <p>Este es un párrafo</p>
  </body>
</html>
```

Su representación en DOM sería un árbol con `html` como nodo raíz, que contiene `head` y `body`, y dentro de estos más elementos.

### ¿Qué puedo hacer con el DOM?

Con JavaScript puedes:

- **Crear** elementos (ej: añadir párrafos o botones).  
- **Leer** elementos (ej: obtener texto de un `h1`).  
- **Actualizar** elementos (ej: cambiar el color de un texto).  
- **Eliminar** elementos (ej: borrar un párrafo).  

Esto se conoce como operaciones **CRUD**: Create, Read, Update, Delete.

---

### 1.1 CRUD de objetos en el DOM

#### Crear elementos
```html
<div id="contenedor"></div>

<script>
  const contenedor = document.getElementById("contenedor");

  // Crear un nuevo párrafo
  const parrafo = document.createElement("p");
  parrafo.textContent = "Hola, soy un nuevo párrafo creado con JS";

  // Insertar en el DOM
  contenedor.appendChild(parrafo);
</script>
```

#### Leer elementos
```html
<h1 id="titulo">Título original</h1>

<script>
  const titulo = document.getElementById("titulo");
  console.log("Texto del título:", titulo.textContent);
</script>
```

#### Actualizar elementos
```html
<h1 id="titulo">Título original</h1>

<script>
  const titulo = document.getElementById("titulo");
  titulo.textContent = "Nuevo título dinámico";
  titulo.style.color = "blue";
</script>
```

#### Eliminar elementos
```html
<div id="contenedor">
  <p id="p1">Párrafo a eliminar</p>
</div>

<script>
  const contenedor = document.getElementById("contenedor");
  const parrafo = document.getElementById("p1");
  contenedor.removeChild(parrafo);
</script>
```

---

### 1.2 Inserción de estilos

#### Modificar estilos inline
```html
<p id="p1">Texto con estilo</p>

<script>
  const p1 = document.getElementById("p1");
  p1.style.backgroundColor = "yellow";
  p1.style.fontSize = "20px";
</script>
```

#### Cambiar clases
```html
<style>
  .resaltado { color: red; font-weight: bold; }
</style>

<p id="p2">Texto normal</p>

<script>
  const p2 = document.getElementById("p2");
  p2.classList.add("resaltado"); // Añadir clase
</script>
```

#### Insertar CSS desde JS
```html
<p id="p3">Texto dinámico</p>

<script>
  const estilo = document.createElement("style");
  estilo.textContent = `
    .dinamico {
      color: green;
      font-size: 18px;
    }
  `;
  document.head.appendChild(estilo);

  document.getElementById("p3").classList.add("dinamico");
</script>
```

---

### 1.3 Lógica con DOM

```html
<ul id="lista"></ul>

<script>
  const lista = document.getElementById("lista");
  const frutas = ["Manzana", "Banana", "Pera"];

  // Crear un <li> por cada fruta
  frutas.forEach(fruta => {
    const li = document.createElement("li");
    li.textContent = fruta;
    lista.appendChild(li);
  });

  // Lógica condicional
  if(frutas.includes("Pera")) {
    alert("¡La lista contiene Pera!");
  }
</script>
```

---

### 1.4 querySelector

`querySelector` y `querySelectorAll` permiten seleccionar elementos usando **sintaxis de CSS**.

- `querySelector("selector")` → devuelve el primer elemento que coincida.
- `querySelectorAll("selector")` → devuelve una lista de todos los que coincidan.

Ejemplos:

```html
<h1 id="titulo">Título</h1>
<p class="texto">Párrafo 1</p>
<p class="texto">Párrafo 2</p>
<div><span>Un span</span></div>

<script>
  // Por ID
  const h1 = document.querySelector("#titulo");

  // Por clase
  const parrafo = document.querySelector(".texto");

  // Todos los párrafos con clase texto
  const parrafos = document.querySelectorAll(".texto");

  // Por etiqueta
  const span = document.querySelector("span");

  // Selectores combinados (CSS)
  const parrafoDentroDiv = document.querySelector("div span");

  console.log(h1.textContent, parrafo.textContent, span.textContent);
</script>
```

---

## 2. Eventos

Los **eventos** son acciones que ocurren en la página y a las que podemos reaccionar con JavaScript.

Ejemplos de eventos: clic, escribir texto, mover el mouse, cargar la página.

### 2.1 Manejo básico de eventos

```html
<button id="boton">Haz clic</button>

<script>
  const boton = document.getElementById("boton");
  boton.onclick = () => {
    alert("¡Hiciste clic en el botón!");
  };
</script>
```

### 2.2 addEventListener

`addEventListener` es más flexible porque permite escuchar múltiples eventos sobre un mismo elemento.

```html
<button id="btn">Pasa el mouse</button>

<script>
  const btn = document.getElementById("btn");

  btn.addEventListener("mouseover", () => {
    btn.style.backgroundColor = "lightblue";
  });

  btn.addEventListener("mouseout", () => {
    btn.style.backgroundColor = "";
  });
</script>
```

#### Eventos más comunes

| Evento          | Descripción                                |
|-----------------|--------------------------------------------|
| `click`         | Cuando el usuario hace clic                |
| `dblclick`      | Doble clic                                 |
| `mouseover`     | Cuando el mouse pasa por encima            |
| `mouseout`      | Cuando el mouse sale del elemento          |
| `keydown`       | Cuando se presiona una tecla               |
| `keyup`         | Cuando se suelta una tecla                 |
| `input`         | Cuando se escribe en un campo de texto     |
| `change`        | Cuando cambia el valor de un input/select  |
| `submit`        | Cuando se envía un formulario              |
| `load`          | Cuando la página o imagen termina de cargar|

Ejemplo con teclado:

```html
<input type="text" id="entrada" placeholder="Escribe algo">

<script>
  const entrada = document.getElementById("entrada");

  entrada.addEventListener("keydown", (evento) => {
    console.log("Tecla presionada:", evento.key);
  });
</script>
```

---

## 3. Web Storage

El **Web Storage** nos permite guardar datos en el navegador:

- **localStorage** → persiste incluso si cierras el navegador.  
- **sessionStorage** → se borra al cerrar la pestaña.  

### Guardar y leer datos

```js
localStorage.setItem("usuario", "Kevin");
console.log(localStorage.getItem("usuario")); // Kevin

sessionStorage.setItem("token", "12345");
console.log(sessionStorage.getItem("token")); // 12345
```

### Eliminar datos

```js
localStorage.removeItem("usuario"); // Borra una clave
sessionStorage.clear(); // Borra todo
```

### Guardar objetos

```js
const persona = { nombre: "Ana", edad: 25 };
localStorage.setItem("persona", JSON.stringify(persona));

const personaGuardada = JSON.parse(localStorage.getItem("persona"));
console.log(personaGuardada.nombre); // Ana
```

---

## 4. Ejercicios

### Ejercicio 1: Crear elementos dinámicamente
```html
<ul id="lista"></ul>
<button id="agregar">Agregar número</button>

<script>
  let contador = 1;
  const lista = document.getElementById("lista");
  const boton = document.getElementById("agregar");

  boton.addEventListener("click", () => {
    const li = document.createElement("li");
    li.textContent = `Número ${contador++}`;
    lista.appendChild(li);
  });
</script>
```

### Ejercicio 2: Cambiar estilos con eventos
```html
<p id="texto">Pasa el mouse sobre mí</p>

<script>
  const texto = document.getElementById("texto");

  texto.addEventListener("mouseover", () => {
    texto.style.color = "red";
  });

  texto.addEventListener("mouseout", () => {
    texto.style.color = "black";
  });
</script>
```

### Ejercicio 3: Guardar y recuperar datos con localStorage
```html
<input type="text" id="nombre" placeholder="Escribe tu nombre">
<button id="guardar">Guardar</button>
<p id="resultado"></p>

<script>
  const input = document.getElementById("nombre");
  const boton = document.getElementById("guardar");
  const resultado = document.getElementById("resultado");

  // Recuperar al cargar
  const nombreGuardado = localStorage.getItem("nombre");
  if(nombreGuardado) {
    resultado.textContent = "Nombre guardado: " + nombreGuardado;
  }

  boton.addEventListener("click", () => {
    const nombre = input.value;
    localStorage.setItem("nombre", nombre);
    resultado.textContent = "Nombre guardado: " + nombre;
  });
</script>
```

---
