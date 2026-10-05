---
sidebar_position: 2
---

# Ejercicios de DOM y Eventos

¡Hola! Aquí tienes una serie de ejercicios progresivos para practicar **DOM**, **eventos**, **manejo de estado** y **consumo de APIs.**

Puedes tomar como punto de partida el código que está debajo de las instrucciones. Te recomiendo usar `<script src="script.js">` en vez de la etiqueta `<script>` tradicional, así mantendrás tus archivos mejor organizados.

_Estos ejercicios no tienen CSS, pero puedes añadirlos si gustas._

## 1. Botón cambio color → _Event listeners básicos_

**Consigna:**  
Crear un botón que cambie el color de fondo de la página al hacer click.

```html
<!DOCTYPE html>
<html lang="es">
  <head>
    <meta charset="UTF-8" />
    <title>Botón cambio color</title>
  </head>
  <body>
    <button id="btnColor">Cambiar color</button>

    <script>
      // Paso 1: Selecciona el botón con document.getElementById
      // Paso 2: Agrega un event listener al botón para detectar el click
      // Paso 3: Cambia el color de fondo de body dinámicamente
    </script>
  </body>
</html>
```

---

## 2. Contador +/- → _Manejo de estado simple_

**Consigna:**  
Crear un contador con botones `+` y `-` que muestre el valor en un `<span>` (evitar números negativos).

```html
<!DOCTYPE html>
<html lang="es">
  <head>
    <meta charset="UTF-8" />
    <title>Contador</title>
  </head>
  <body>
    <button id="decrementar">-</button>
    <span id="valor">0</span>
    <button id="incrementar">+</button>

    <script>
      // Paso 1: Inicializa una variable para el valor del contador
      // Paso 2: Selecciona los botones y el span
      // Paso 3: Agrega listeners a los botones para modificar el valor
      // Paso 4: Asegúrate de que el valor no sea negativo
    </script>
  </body>
</html>
```

---

## 3. Input + lista → _Forms y creación de elementos_

**Consigna:**  
Crear un input que, al escribir algo y presionar **Enter**, agregue un `<li>` a una lista `<ul>` (y vacíe el input después).

```html
<!DOCTYPE html>
<html lang="es">
  <head>
    <meta charset="UTF-8" />
    <title>Input y Lista</title>
  </head>
  <body>
    <input
      type="text"
      id="entrada"
      placeholder="Escribe algo y presiona Enter"
    />
    <ul id="lista"></ul>

    <script>
      // Paso 1: Selecciona el input y la lista
      // Paso 2: Agrega un listener al input para detectar Enter (keyup o keydown)
      // Paso 3: Crea un nuevo <li> con el valor del input y agrégalo al ul
      // Paso 4: Limpia el input después de agregar
    </script>
  </body>
</html>
```

---

## 4. Buscador tiempo real → _Filtrado y eventos input_

**Consigna:**  
Crear un buscador que filtre una lista de nombres en tiempo real mientras escribes en un input.

```html
<!DOCTYPE html>
<html lang="es">
  <head>
    <meta charset="UTF-8" />
    <title>Buscador</title>
  </head>
  <body>
    <input type="text" id="buscador" placeholder="Buscar nombre" />
    <ul id="nombres">
      <li>María</li>
      <li>Carlos</li>
      <li>Lucía</li>
      <li>Juan</li>
      <li>Fernanda</li>
    </ul>

    <script>
      // Paso 1: Selecciona el input y los <li>
      // Paso 2: Escucha el evento input
      // Paso 3: Filtra los nombres mostrando solo los que coincidan con lo escrito
    </script>
  </body>
</html>
```

---

## 5. To-do list → _Delegación de eventos y estado complejo_

**Consigna:**  
Hacer una to-do list donde los ítems se puedan marcar como completados al hacer click y borrarlos con un botón de eliminar (usando **delegación de eventos**).

```html
<!DOCTYPE html>
<html lang="es">
  <head>
    <meta charset="UTF-8" />
    <title>To-do list</title>
  </head>
  <body>
    <input
      type="text"
      id="tarea"
      placeholder="Escribe una tarea y presiona Enter"
    />
    <ul id="listaTareas"></ul>

    <script>
      // Paso 1: Selecciona el input y la lista
      // Paso 2: Escucha Enter en el input y agrega <li> con el texto + un botón "Eliminar"
      // Paso 3: Usa delegación de eventos en el ul para detectar clicks en tareas o botones
      // Paso 4: Si es tarea → alternar completado; si es botón → eliminar la tarea
    </script>
  </body>
</html>
```

---

## 6. Tu primera API → _Rick y Morty personajes_

**¿Qué es una API?**  
Una API es como un "camarero digital" que te permite pedir información a otros sitios web. En este caso, vamos a pedirle a la [Rick and Morty API](https://rickandmortyapi.com/api/character) que nos traiga información de los personajes del multiverso.

**Consigna:**  
Cuando hagas clic en "Cargar Personajes", tu página irá a buscar personajes de Rick y Morty y los mostrará con sus fotos y datos.

**Pasos a seguir:**

1. Conecta el botón para que "escuche" cuando le hagas clic
2. Usa `fetch()` para pedirle datos a la API (como hacer un pedido por teléfono)
3. Convierte la respuesta en algo que JavaScript entienda con `.json()`
4. Accede al array de personajes con `data.results` y toma los primeros 6
5. Por cada personaje, crea una tarjeta con su foto, nombre y estado
6. Agrega un mensaje de "Cargando..." y maneja si algo sale mal

**💡 Pista:** `fetch()` siempre necesita `await` porque toma tiempo traer datos de internet.

```html
<!DOCTYPE html>
<html lang="es">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>Rick y Morty API - Ejercicio</title>
  </head>
  <body>
    <h1>Personajes de Rick y Morty</h1>
    <button id="btnCargar">Cargar Personajes</button>
    <div id="contenedor"></div>

    <script>
      // INSTRUCCIONES:
      // Paso 1: Selecciona el botón (#btnCargar) y el contenedor (#contenedor)
      // Paso 2: Crea una función async que:
      //   - Muestre "Cargando personajes..." en el contenedor
      //   - Use fetch() con await para traer: https://rickandmortyapi.com/api/character
      //   - Convierta la respuesta a JSON con .json()
      // Paso 3: Accede a los personajes con data.results y toma los primeros 6 (usa .slice(0, 6))
      //   - Por cada personaje, crea un div con clase 'character-card'
      //   - Dentro del div incluye:
      //     * Una imagen: <img src="${personaje.image}" alt="${personaje.name}">
      //     * El nombre: <div class="character-name">${personaje.name}</div>
      //     * El estado: <div class="character-status">Estado: ${personaje.status}</div>
      //   - Agrega cada tarjeta a un contenedor con clase 'characters-grid'
      // Paso 4: Conecta la función al evento click del botón
    </script>
  </body>
</html>
```

<details>
<summary>💡 Ver solución</summary>

```javascript
<!DOCTYPE html>
<html lang="es">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>Rick y Morty API - Ejercicio</title>
  </head>
  <body>
    <h1>Personajes de Rick y Morty</h1>
    <button id="btnCargar">Cargar Personajes</button>
    <div id="contenedor"></div>

    <script>
      // Paso 1: Selecciona el botón (#btnCargar) y el contenedor (#contenedor)
      const btnCargar = document.getElementById('btnCargar');
      const contenedor = document.getElementById('contenedor');

      // Paso 2: Crea una función async
      async function cargarPersonajes() {
        // Muestre "Cargando personajes..." en el contenedor
        contenedor.innerHTML = 'Cargando personajes...';

        try {
          // Use fetch() con await para traer: https://rickandmortyapi.com/api/character
          const respuesta = await fetch('https://rickandmortyapi.com/api/character');

          // Convierta la respuesta a JSON con .json()
          const data = await respuesta.json();

          // Paso 3: Accede a los personajes con data.results y toma los primeros 6 (usa .slice(0, 6))
          const personajes = data.results.slice(0, 6);

          // Crea el contenedor con clase 'characters-grid'
          let gridHTML = '<div class="characters-grid">';

          // Por cada personaje, crea un div con clase 'character-card'
          personajes.forEach(personaje => {
            gridHTML += `
              <div class="character-card">
                <img src="${personaje.image}" alt="${personaje.name}">
                <div class="character-name">${personaje.name}</div>
                <div class="character-status">Estado: ${personaje.status}</div>
              </div>
            `;
          });

          gridHTML += '</div>';

          // Agrega cada tarjeta al contenedor
          contenedor.innerHTML = gridHTML;

        } catch (error) {
          console.error('Error:', error);
          contenedor.innerHTML = 'Error al cargar los personajes';
        }
      }

      // Paso 4: Conecta la función al evento click del botón
      btnCargar.addEventListener('click', cargarPersonajes);
    </script>
  </body>
</html>
```

</details>

<details>
<summary>💡 Ver solución compleja</summary>

```javascript
<!DOCTYPE html>
<html lang="es">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Rick y Morty API - Ejercicio</title>
</head>
<body>
   <h1>Personajes de Rick y Morty</h1>
    <button id="btnCargar">Cargar Personajes</button>
    <div id="contenedor"></div>

    <script>
        // Paso 1: Seleccionar el botón y el contenedor
        const btnCargar = document.getElementById('btnCargar');
        const contenedor = document.getElementById('contenedor');

        // Función para determinar la clase del estado del personaje
        function getStatusClass(status) {
            if (status.toLowerCase() === 'alive') return 'status-alive';
            if (status.toLowerCase() === 'dead') return 'status-dead';
            return 'status-unknown';
        }

        // Paso 2: Crear función async para cargar personajes
        async function cargarPersonajes() {
            // Deshabilitar el botón mientras se carga
            btnCargar.disabled = true;
            btnCargar.textContent = 'Cargando...';

            // Mostrar mensaje de carga
            contenedor.innerHTML = '<div class="loading">Cargando personajes...</div>';

            try {
                // Hacer la petición a la API
                const respuesta = await fetch('https://rickandmortyapi.com/api/character');
                const data = await respuesta.json();

                // Paso 3: Obtener los primeros 6 personajes
                const personajes = data.results.slice(0, 6);

                // Crear el grid de personajes
                let gridHTML = '<div class="characters-grid">';

                // Generar HTML para cada personaje
                personajes.forEach(personaje => {
                    gridHTML += `
                        <div class="character-card">
                            <img class="character-image" src="${personaje.image}" alt="${personaje.name}">
                            <div class="character-info">
                                <div class="character-name">${personaje.name}</div>
                                <div class="character-status">
                                    <span class="status-icon ${getStatusClass(personaje.status)}"></span>
                                    Estado: ${personaje.status}
                                </div>
                                <div class="character-species">Especie: ${personaje.species}</div>
                            </div>
                        </div>
                    `;
                });

                gridHTML += '</div>';

                // Mostrar los personajes en el contenedor
                contenedor.innerHTML = gridHTML;

            } catch (error) {
                // Manejar errores
                console.error('Error al cargar los personajes:', error);
                contenedor.innerHTML = `
                    <div class="loading">
                        Error al cargar los personajes. Intenta de nuevo.
                    </div>
                `;
            } finally {
                // Restaurar el botón
                btnCargar.disabled = false;
                btnCargar.textContent = 'Cargar Personajes';
            }
        }

        // Paso 4: Conectar la función al evento click del botón
        btnCargar.addEventListener('click', cargarPersonajes);
    </script>
</body>
</html>
```

</details>

---

> ¿Dudas? Escribenos a cualquiera de nosotros (a la monitora Sary o al profe Kevin) por WhatsApp, Discord, el grupo o por DM, sin pena. ¡Estamos para ayudarte!
