---
sidebar_position: 3
---

# Ejercicios de Web Storage en JavaScript

Este documento te ayudará a practicar **Web Storage** en JavaScript con ejercicios progresivos.  
La idea es que tengas una **consigna clara** y una **base de código lista para copiar y pegar**, así no empiezas desde cero.

> **Nota**: Para repasar los conceptos teóricos de Web Storage, consulta la [explicación del profesor](https://docukelo-icesi.onrender.com/docs/disenando-con-algoritmos/semana-4/dom#3-web-storage).

---

## Conceptos importantes

- **JSON.stringify()**: Convierte objetos/arreglos a texto para poder guardarlos
- **JSON.parse()**: Convierte el texto guardado de vuelta a objetos/arreglos
- **Operador `||`**: Proporciona un valor por defecto si el dato no existe
- **setItem(clave, valor)**: Guardar datos
- **getItem(clave)**: Recuperar datos
- **removeItem(clave)**: Eliminar datos específicos
- **clear()**: Borrar todo el almacenamiento
- **push()**: Agregar elementos al final de un arreglo
- **splice(índice, cantidad)**: Eliminar elementos por posición del arreglo
- **length**: Verificar si el arreglo tiene elementos

---

# Ejercicios

## 1. Preferencias de tema (claro/oscuro)

**Consigna:**  
Crea un botón que permita alternar entre modo claro y modo oscuro. La preferencia debe guardarse en `localStorage` para que al recargar la página se mantenga.

_Extra_: Puedes cambiar los estilos del botón para que contrasten con el fondo.\_

```html
<!DOCTYPE html>
<html lang="es">
  <head>
    <meta charset="UTF-8" />
    <title>Preferencias de Tema</title>
    <style>
      body.dark {
        background-color: #222;
        color: white;
      }
      body.light {
        background-color: white;
        color: black;
      }
    </style>
  </head>
  <body class="light">
    <button id="btnTema">Cambiar tema</button>

    <script>
      // Paso 1: Selecciona el botón y el body
      // Paso 2: Agrega un listener para cambiar entre clases "dark" y "light"
      // Paso 3: Guarda la preferencia en localStorage
      // Paso 4: Al cargar la página, aplica el tema guardado
    </script>
  </body>
</html>
```

<details>
<summary>💡 Posible solución >:) </summary>

```javascript
<!DOCTYPE html>
<html lang="es">
  <head>
    <meta charset="UTF-8" />
    <title>Preferencias de Tema</title>
    <style>
      body.dark {
        background-color: #222;
        color: white;
      }
      body.light {
        background-color: white;
        color: black;
      }
      button {
        padding: 10px 15px;
        border: none;
        border-radius: 4px;
        cursor: pointer;
        margin: 10px;
      }
      .dark button {
        background-color: #444;
        color: white;
      }
      .light button {
        background-color: #eee;
        color: black;
      }
    </style>
  </head>
  <body class="light">
    <button id="btnTema">Cambiar a modo oscuro</button>

    <script>
      // Paso 1: Selecciona el botón y el body
      const btnTema = document.getElementById('btnTema');
      const body = document.body;

      // Paso 4: Al cargar la página, aplica el tema guardado
      const temaGuardado = localStorage.getItem('tema');
      if (temaGuardado) {
        body.className = temaGuardado;
        actualizarTextoBoton();
      }

      // Paso 2: Agrega un listener para cambiar entre clases "dark" y "light"
      btnTema.addEventListener('click', () => {
        if (body.classList.contains('light')) {
          body.classList.replace('light', 'dark');
          localStorage.setItem('tema', 'dark');
        } else {
          body.classList.replace('dark', 'light');
          localStorage.setItem('tema', 'light');
        }
        actualizarTextoBoton();
      });

      // Función auxiliar para actualizar el texto del botón
      function actualizarTextoBoton() {
        btnTema.textContent = body.classList.contains('light')
          ? 'Cambiar a modo oscuro'
          : 'Cambiar a modo claro';
      }
    </script>
  </body>
</html>
```

</details>

---

## 2. Formulario que cree cards de presentación

**Consigna:**  
Haz un formulario que pida nombre, profesión y descripción. Cada vez que el usuario lo envíe, se debe crear una card con esos datos. Guarda las cards en `localStorage` para que al recargar la página se mantengan.

_Extra: Añadir un botón que pueda eliminar cards_

```html
<!DOCTYPE html>
<html lang="es">
  <head>
    <meta charset="UTF-8" />
    <title>Cards de Presentación</title>
  </head>
  <body>
    <form id="formCard">
      <input type="text" id="nombre" placeholder="Nombre" />
      <input type="text" id="profesion" placeholder="Profesión" />
      <textarea id="descripcion" placeholder="Descripción"></textarea>
      <button type="submit">Crear Card</button>
    </form>

    <div id="cards"></div>

    <script>
      // Paso 1: Captura el formulario y los campos
      // Paso 2: Al enviar, crea un objeto con los datos
      // Paso 3: Agrega ese objeto a un array y guárdalo en localStorage
      // Paso 4: Pinta todas las cards en el div, cargando también desde localStorage
    </script>
  </body>
</html>
```

<details>
<summary>💡 Posible solución >:) </summary>

```javascript
<!DOCTYPE html>
<html lang="es">
  <head>
    <meta charset="UTF-8" />
    <title>Cards de Presentación</title>
    <style>
      .card {
        border: 1px solid #ccc;
        border-radius: 8px;
        padding: 15px;
        margin: 10px 0;
        box-shadow: 0 2px 4px rgba(0,0,0,0.1);
      }
      input, textarea {
        display: block;
        margin: 10px 0;
        padding: 8px;
        width: 300px;
      }
      button {
        padding: 10px 15px;
        background-color: #4CAF50;
        color: white;
        border: none;
        border-radius: 4px;
        cursor: pointer;
      }
    </style>
  </head>
  <body>
    <form id="formCard">
      <input type="text" id="nombre" placeholder="Nombre" required>
      <input type="text" id="profesion" placeholder="Profesión" required>
      <textarea id="descripcion" placeholder="Descripción" required></textarea>
      <button type="submit">Crear Card</button>
    </form>

    <div id="cards"></div>

    <script>
      // Paso 1: Captura el formulario y los campos
      const form = document.getElementById('formCard');
      const nombreInput = document.getElementById('nombre');
      const profesionInput = document.getElementById('profesion');
      const descripcionInput = document.getElementById('descripcion');
      const cardsContainer = document.getElementById('cards');

      // Array para almacenar las cards
      let cards = JSON.parse(localStorage.getItem('cards')) || [];

      // Paso 4: Pinta todas las cards en el div, cargando también desde localStorage
      function renderCards() {
        cardsContainer.innerHTML = '';
        cards.forEach((card, index) => {
          const cardElement = document.createElement('div');
          cardElement.className = 'card';
          cardElement.innerHTML = `
            <h3>${card.nombre}</h3>
            <p><strong>Profesión:</strong> ${card.profesion}</p>
            <p>${card.descripcion}</p>
            <button onclick="eliminarCard(${index})">Eliminar</button>
          `;
          cardsContainer.appendChild(cardElement);
        });
      }

      // Función para eliminar una card
      window.eliminarCard = function(index) {
        cards.splice(index, 1);
        localStorage.setItem('cards', JSON.stringify(cards));
        renderCards();
      };

      // Paso 2: Al enviar, crea un objeto con los datos
      form.addEventListener('submit', (e) => {
        e.preventDefault();

        const nuevaCard = {
          nombre: nombreInput.value,
          profesion: profesionInput.value,
          descripcion: descripcionInput.value
        };

        // Paso 3: Agrega ese objeto a un array y guárdalo en localStorage
        cards.push(nuevaCard);
        localStorage.setItem('cards', JSON.stringify(cards));

        // Limpiar formulario y renderizar cards
        form.reset();
        renderCards();
      });

      // Renderizar cards al cargar la página
      renderCards();
    </script>
  </body>
</html>
```

</details>

---

## 3. Calificar películas

**Consigna:**  
Muestra una lista de películas. Cada una debe tener estrellas para votar (del 1 al 5). El voto del usuario debe guardarse en `localStorage` para que al recargar la página las calificaciones sigan visibles.

_Pista: En este ejercicio puedes usar este caracter `★`, pues, solo le cambiaras el color a la estrella._

```html
<!DOCTYPE html>
<html lang="es">
  <head>
    <meta charset="UTF-8" />
    <title>Calificar Películas</title>
  </head>
  <body>
    <ul id="peliculas">
      <li data-id="1">Inception ★★★★★</li>
      <li data-id="2">Interstellar ★★★★★</li>
      <li data-id="3">Tenet ★★★★★</li>
    </ul>

    <script>
      // Paso 1: Selecciona la lista de películas
      // Paso 2: Detecta clicks en las estrellas y guarda la calificación en localStorage
      // Paso 3: Al cargar, muestra las calificaciones guardadas
    </script>
  </body>
</html>
```

<details>
<summary>💡 Posible solución >:) </summary>

```javascript
<!DOCTYPE html>
<html lang="es">
  <head>
    <meta charset="UTF-8" />
    <title>Calificar Películas</title>
    <style>
      .pelicula {
        margin: 15px 0;
        font-size: 18px;
      }
      .estrella {
        cursor: pointer;
        color: #ccc;
        font-size: 24px;
      }
      .estrella.seleccionada {
        color: gold;
      }
    </style>
  </head>
  <body>
    <h2>Califica estas películas:</h2>
    <ul id="peliculas">
      <li class="pelicula" data-id="1">Inception <span class="estrellas" data-id="1"></span></li>
      <li class="pelicula" data-id="2">Interstellar <span class="estrellas" data-id="2"></span></li>
      <li class="pelicula" data-id="3">Tenet <span class="estrellas" data-id="3"></span></li>
    </ul>

    <script>
      // Paso 1: Selecciona la lista de películas
      const contenedoresEstrellas = document.querySelectorAll('.estrellas');

      // Paso 3: Al cargar, muestra las calificaciones guardadas
      document.addEventListener('DOMContentLoaded', () => {
        contenedoresEstrellas.forEach(contenedor => {
          const idPelicula = contenedor.getAttribute('data-id');
          const calificacion = localStorage.getItem(`pelicula-${idPelicula}`) || 0;

          // Crear estrellas
          for (let i = 1; i <= 5; i++) {
            const estrella = document.createElement('span');
            estrella.className = 'estrella';
            estrella.textContent = '★';
            estrella.setAttribute('data-value', i);
            estrella.setAttribute('data-pelicula', idPelicula);

            if (i <= calificacion) {
              estrella.classList.add('seleccionada');
            }

            contenedor.appendChild(estrella);
          }
        });
      });

      // Paso 2: Detecta clicks en las estrellas y guarda la calificación en localStorage
      document.addEventListener('click', (e) => {
        if (e.target.classList.contains('estrella')) {
          const valor = e.target.getAttribute('data-value');
          const idPelicula = e.target.getAttribute('data-pelicula');

          // Guardar calificación
          localStorage.setItem(`pelicula-${idPelicula}`, valor);

          // Actualizar visualización de estrellas
          const estrellas = document.querySelectorAll(`.estrella[data-pelicula="${idPelicula}"]`);
          estrellas.forEach(estrella => {
            const valorEstrella = estrella.getAttribute('data-value');
            if (valorEstrella <= valor) {
              estrella.classList.add('seleccionada');
            } else {
              estrella.classList.remove('seleccionada');
            }
          });
        }
      });
    </script>
  </body>
</html>
```

</details>

---

## 4. Carrito de compras

**Consigna:**  
Crea un sistema de carrito donde se puedan agregar productos, mostrarlos en una lista con su precio, calcular el total y eliminarlos. Toda la información debe guardarse en `localStorage`.

```html
<!DOCTYPE html>
<html lang="es">
  <head>
    <meta charset="UTF-8" />
    <title>Carrito de Compras</title>
  </head>
  <body>
    <button data-id="1" data-nombre="Producto A" data-precio="10">
      Agregar Producto A
    </button>
    <button data-id="2" data-nombre="Producto B" data-precio="15">
      Agregar Producto B
    </button>

    <h3>Carrito</h3>
    <ul id="carrito"></ul>
    <p>Total: <span id="total">0</span></p>

    <script>
      // Paso 1: Selecciona los botones y el ul del carrito
      // Paso 2: Al hacer click en un botón, agrega el producto a un array y guárdalo en localStorage
      // Paso 3: Pinta los productos en el carrito con opción de eliminar
      // Paso 4: Calcula y muestra el total
    </script>
  </body>
</html>
```

<details>
<summary>💡 Posible solución >:) </summary>

```javascript
<!DOCTYPE html>
<html lang="es">
  <head>
    <meta charset="UTF-8" />
    <title>Carrito de Compras</title>
    <style>
      button {
        padding: 10px 15px;
        margin: 5px;
        cursor: pointer;
      }
      .producto-carrito {
        display: flex;
        justify-content: space-between;
        align-items: center;
        border-bottom: 1px solid #eee;
        padding: 8px 0;
      }
      .eliminar {
        background-color: #ff4444;
        color: white;
        border: none;
        border-radius: 4px;
        padding: 5px 10px;
        cursor: pointer;
      }
    </style>
  </head>
  <body>
    <h2>Productos disponibles:</h2>
    <button data-id="1" data-nombre="Producto A" data-precio="10">
      Agregar Producto A ($10)
    </button>
    <button data-id="2" data-nombre="Producto B" data-precio="15">
      Agregar Producto B ($15)
    </button>

    <h3>Carrito</h3>
    <ul id="carrito"></ul>
    <p>Total: $<span id="total">0</span></p>

    <script>
      // Paso 1: Selecciona los botones y el ul del carrito
      const botonesAgregar = document.querySelectorAll('button[data-id]');
      const carritoLista = document.getElementById('carrito');
      const totalElemento = document.getElementById('total');

      // Cargar carrito desde localStorage
      let carrito = JSON.parse(localStorage.getItem('carrito')) || [];

      // Paso 4: Calcula y muestra el total
      function actualizarTotal() {
        const total = carrito.reduce((sum, producto) => sum + producto.precio, 0);
        totalElemento.textContent = total;
      }

      // Paso 3: Pinta los productos en el carrito con opción de eliminar
      function renderCarrito() {
        carritoLista.innerHTML = '';
        carrito.forEach((producto, index) => {
          const li = document.createElement('li');
          li.className = 'producto-carrito';
          li.innerHTML = `
            ${producto.nombre} - $${producto.precio}
            <button class="eliminar" data-id="${producto.id}">Eliminar</button>
          `;
          carritoLista.appendChild(li);
        });

        // Agregar event listeners a los botones de eliminar
        document.querySelectorAll('.eliminar').forEach(btn => {
          btn.addEventListener('click', (e) => {
            const index = e.target.getAttribute('data-id');
            carrito.splice(index, 1);
            localStorage.setItem('carrito', JSON.stringify(carrito));
            renderCarrito();
            actualizarTotal();
          });
        });

        actualizarTotal();
      }

      // Paso 2: Al hacer click en un botón, agrega el producto a un array y guárdalo en localStorage
      botonesAgregar.forEach(boton => {
        boton.addEventListener('click', () => {
          const producto = {
            id: boton.getAttribute('data-id'),
            nombre: boton.getAttribute('data-nombre'),
            precio: parseInt(boton.getAttribute('data-precio'))
          };

          carrito.push(producto);
          localStorage.setItem('carrito', JSON.stringify(carrito));
          renderCarrito();
        });
      });

      // Renderizar carrito al cargar la página
      renderCarrito();
    </script>
  </body>
</html>
```

</details>

---

## 5. Register y Login

**Consigna:**  
Crea un sistema simple de registro y login usando `localStorage`. El usuario debe poder registrarse con nombre y contraseña. Luego, al iniciar sesión, el sistema debe validar los datos y mostrar un mensaje de bienvenida.

```html
<!DOCTYPE html>
<html lang="es">
  <head>
    <meta charset="UTF-8" />
    <title>Register y Login</title>
  </head>
  <body>
    <h3>Registro</h3>
    <form id="formRegistro">
      <input type="text" id="regUsuario" placeholder="Usuario" />
      <input type="password" id="regPass" placeholder="Contraseña" />
      <button type="submit">Registrar</button>
    </form>

    <h3>Login</h3>
    <form id="formLogin">
      <input type="text" id="loginUsuario" placeholder="Usuario" />
      <input type="password" id="loginPass" placeholder="Contraseña" />
      <button type="submit">Login</button>
    </form>

    <div id="mensaje"></div>

    <script>
      // Paso 1: Captura los formularios
      // Paso 2: En registro, guarda usuario y contraseña en localStorage
      // Paso 3: En login, valida contra los datos guardados
      // Paso 4: Si es correcto, muestra un mensaje de bienvenida
    </script>
  </body>
</html>
```

<details>
<summary>💡 Posible solución >:) </summary>

```javascript
<!DOCTYPE html>
<html lang="es">
  <head>
    <meta charset="UTF-8" />
    <title>Register y Login</title>
  </head>
  <body>
    <h3>Registro</h3>
    <form id="formRegistro">
      <input type="text" id="regUsuario" placeholder="Usuario" required />
      <input type="password" id="regPass" placeholder="Contraseña" required />
      <button type="submit">Registrar</button>
    </form>

    <h3>Login</h3>
    <form id="formLogin">
      <input type="text" id="loginUsuario" placeholder="Usuario" required />
      <input type="password" id="loginPass" placeholder="Contraseña" required />
      <button type="submit">Login</button>
    </form>

    <div id="mensaje"></div>

    <script>
      const formRegistro = document.getElementById("formRegistro");
      const formLogin = document.getElementById("formLogin");
      const mensaje = document.getElementById("mensaje");

      // Registro
      formRegistro.addEventListener("submit", (e) => {
        e.preventDefault();

        const usuario = document.getElementById("regUsuario").value;
        const pass = document.getElementById("regPass").value;

        if (usuario && pass) {
          // Guardar en localStorage (clave: usuario, valor: contraseña)
          localStorage.setItem(usuario, pass);
          mensaje.textContent = "Usuario registrado con éxito.";
        } else {
          mensaje.textContent = "Completa todos los campos.";
        }

        formRegistro.reset();
      });

      // Login
      formLogin.addEventListener("submit", (e) => {
        e.preventDefault();

        const usuario = document.getElementById("loginUsuario").value;
        const pass = document.getElementById("loginPass").value;

        const storedPass = localStorage.getItem(usuario);

        if (storedPass === pass) {
          mensaje.textContent = `¡Bienvenido, ${usuario}!`;
        } else {
          mensaje.textContent = "Usuario o contraseña incorrectos.";
        }

        formLogin.reset();
      });
    </script>
  </body>
</html>
```

</details>

---

> _Con estos ejercicios ya dominas las bases para manipular el DOM, manejar eventos y guardar información en el navegador usando Web Storage. Recuerda que lo más importante es experimentar: cambia los ejemplos, rompe el código, vuélvelo a armar, exitos. - Sary :D_
