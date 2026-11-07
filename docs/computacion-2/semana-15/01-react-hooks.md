---
sidebar_position: 1
description: "Aprende a dar memoria y efectos a los componentes de React con useState, useEffect y custom hooks, y a ver cómo React actualiza el árbol de componentes."
---

# React Hooks: useState, useEffect y custom hooks

Hasta ahora tus componentes solo dibujan datos que reciben por props. Para que una interfaz responda al usuario necesitan dos cosas más: **recordar** algo entre un render y otro y **conectarse** con cosas que React no controla (el título de la página, un servidor, un temporizador). Los **hooks** son las funciones que les dan esas capacidades. Su nombre siempre empieza con `use`.

Este capítulo sigue la sección «Learn» de [react.dev](https://react.dev/learn): primero la memoria (`useState`), luego los efectos (`useEffect`) y al final cómo reutilizar ambos en tus propios hooks.

## Por qué un componente necesita memoria

Intenta hacer un contador con una variable normal:

```jsx title="Contador.jsx (no funciona)" showLineNumbers
function Contador() {
  let count = 0;

  return (
    <button onClick={() => { count = count + 1; }}>
      Clics: {count}
    </button>
  );
}
```

El botón nunca cambia, por dos razones:

- **Las variables locales no sobreviven al render:** cada vez que React ejecuta `Contador`, `count` vuelve a empezar en 0.
- **Cambiar una variable local no avisa a React:** no hay nada que le diga que debe dibujar la pantalla otra vez.

`useState` resuelve las dos a la vez: guarda el valor **fuera de la función**, y su función `set` le avisa a React que algo cambió.

## useState: la memoria del componente

```jsx title="Contador.jsx" showLineNumbers
import { useState } from "react";

function Contador() {
  const [count, setCount] = useState(0);

  return (
    <button onClick={() => setCount(count + 1)}>
      Clics: {count}
    </button>
  );
}
```

`useState(0)` devuelve un arreglo con dos elementos, que sacamos con desestructuración:

| Elemento | Qué es | Qué hace |
| --- | --- | --- |
| `count` | La **variable de estado** | El valor actual. React lo conserva entre renders; el `0` solo se usa la primera vez. |
| `setCount` | La función **setter** | Guarda un valor nuevo **y** le pide a React que vuelva a dibujar el componente. |

Mira qué ejecuta React cuando pulsas un botón y qué cambia en el DOM. Al final verás que dos copias del mismo componente tienen cada una su propio estado.

<InteractiveFrame
  src="/interactive/computacion-2/semana-15/usestate-actualiza/index.html"
  title="Qué ejecuta React cuando se pulsa un botón que cambia un estado con useState y qué cambia en el DOM"
  height={680}
/>

### Qué debes llevarte

- **El estado es privado de cada copia:** React lo asocia al lugar que ocupa el componente en el árbol. Dos `<Contador />` nunca comparten su `count`.
- **Cambiar el estado dispara un render:** React vuelve a ejecutar el componente que cambió (y sus hijos) y compara el resultado con el anterior (las fases del Virtual DOM que ya viste).
- **Solo se toca lo que cambió:** el resto del DOM se queda como estaba.

### El estado es una foto

Hay un detalle que confunde al principio. Pedir un valor nuevo **no cambia el `count` que ya tienes**: cada render recibe su propia «foto» del estado, y el manejador de eventos ve siempre la foto de su render.

```jsx title="Tres setCount seguidos" showLineNumbers
<button onClick={() => {
  setCount(count + 1);
  setCount(count + 1);
  setCount(count + 1);
}}>
  +3
</button>
```

¿Cuánto vale `count` después del clic? **1, no 3.** En esa foto `count` vale 0, así que las tres llamadas piden lo mismo: «poner 0 + 1». React las deja en una cola y las aplica en orden. Si el valor nuevo depende del anterior, pasa una **función actualizadora**: React la llama con el resultado de la anterior.

```jsx title="Función actualizadora" showLineNumbers
setCount((c) => c + 1); // 0 → 1
setCount((c) => c + 1); // 1 → 2
setCount((c) => c + 1); // 2 → 3
```

Recórrelo en la pieza y activa el interruptor para comparar las dos formas:

<InteractiveFrame
  src="/interactive/computacion-2/semana-15/usestate-instantanea/index.html"
  title="Cómo React procesa varias llamadas a setCount: con un valor basado en la foto del render y con una función actualizadora"
  height={720}
/>

:::warning[No mutes el estado: reemplázalo]
Si el estado es un objeto o un arreglo, no lo modifiques (`user.name = "Ana"`, `lista.push(x)`). React compara por referencia: solo se entera del cambio si le pasas un valor **nuevo**.

```jsx title="Reemplazar en vez de mutar" showLineNumbers
setUser({ ...user, name: "Ana" });       // objeto nuevo con un campo cambiado
setItems([...items, nuevoItem]);         // arreglo nuevo con un elemento más
setItems(items.filter((i) => i.id !== id)); // arreglo nuevo sin un elemento
```
:::

### Reglas de los hooks

React sabe qué estado pertenece a cada `useState` por **el orden** en que se llaman. Por eso tienen dos reglas:

- **Solo en el nivel superior:** no los llames dentro de `if`, bucles ni funciones anidadas. Así el orden es el mismo en cada render.
- **Solo en componentes o en otros hooks:** no en funciones normales de JavaScript.

## useEffect: sincronizar con el mundo exterior

Renderizar debe ser **puro**: el cuerpo del componente solo calcula qué dibujar, sin tocar nada fuera de él. Pero a veces necesitas hacer algo que sí toca el exterior: conectarte a un chat, cambiar el título de la pestaña, iniciar un temporizador. Eso es un **efecto**, y `useEffect` lo ejecuta **después** de que React actualizó el DOM.

```jsx title="Chat.jsx" showLineNumbers
import { useState, useEffect } from "react";

function Chat({ roomId }) {
  const [message, setMessage] = useState("");

  useEffect(() => {
    const conn = connect(roomId);      // setup: conectar
    return () => conn.disconnect();    // cleanup: desconectar
  }, [roomId]);                        // dependencias

  // ...
}
```

Un efecto tiene tres partes:

| Parte | Cuándo corre | Para qué |
| --- | --- | --- |
| **Setup** (el cuerpo) | Después de dibujar, la primera vez y cada vez que cambia una dependencia | Abrir la conexión, suscribirse, iniciar el temporizador |
| **Cleanup** (lo que devuelve) | Antes de repetir el efecto y al desmontar | Deshacer lo que hizo el setup |
| **Dependencias** (el arreglo) | Se comparan en cada render | Decidir si el efecto debe repetirse |

Las dependencias son los valores **reactivos** (props, estado) que el efecto lee. El arreglo decide cuándo corre:

| Arreglo | El efecto corre |
| --- | --- |
| `[roomId]` | Al montar y cada vez que `roomId` cambia. |
| `[]` | Solo al montar. |
| _(sin arreglo)_ | Después de **cada** render. |

Cambia las dependencias en la pieza y mira cuándo se conecta y cuándo se limpia el chat. Con `[]` aparece el error más común: el efecto usa `roomId`, pero no se entera de que cambió.

<InteractiveFrame
  src="/interactive/computacion-2/semana-15/useeffect-dependencias/index.html"
  title="Cuándo se ejecuta y cuándo se limpia un useEffect que se conecta a un chat según el arreglo de dependencias"
  height={780}
/>

:::note[¿Por qué mi efecto corre dos veces?]
En desarrollo, con `<StrictMode>` (la plantilla de Vite lo trae), React monta el componente, **ejecuta la limpieza** y lo monta otra vez. Lo hace a propósito para comprobar que tu limpieza deshace bien lo que hizo el setup. En producción corre una sola vez.
:::

### Un efecto para pedir datos

Pedir datos al servidor es un efecto clásico: no depende del render, sino de algo externo. Esta versión incluye la limpieza que evita que una respuesta lenta pise a una más nueva:

```jsx title="Usuario.jsx" showLineNumbers
function Usuario({ userId }) {
  const [user, setUser] = useState(null);

  useEffect(() => {
    let ignore = false;

    fetch(`https://jsonplaceholder.typicode.com/users/${userId}`)
      .then((res) => res.json())
      .then((data) => {
        if (!ignore) setUser(data);
      });

    return () => { ignore = true; };
  }, [userId]);

  if (!user) return <p>Cargando...</p>;
  return <h1>{user.name}</h1>;
}
```

Si `userId` cambia mientras la primera petición viaja, la limpieza marca `ignore = true` y esa respuesta se descarta. En la semana 16 verás cómo Axios simplifica este código.

:::tip[¿Siempre necesito un efecto?]
No. Un efecto es para **sincronizar con algo externo**. Si solo estás calculando un valor a partir de props o estado, calcúlalo durante el render. Si es la respuesta a un clic, ponlo en el manejador del evento. Revisa [You Might Not Need an Effect](https://react.dev/learn/you-might-not-need-an-effect).
:::

## Custom hooks: reutilizar lógica

Cuando varios componentes repiten el mismo estado y el mismo efecto, los extraes a una función cuyo nombre empieza con `use`. Es un **custom hook**: no es una API nueva de React, es una función tuya que llama a otros hooks.

Recorre el código de un hook que avisa si hay conexión a internet y mira cómo lo usan dos componentes:

<InteractiveFrame
  src="/interactive/computacion-2/semana-15/custom-hook-reuso/index.html"
  title="Anatomía de un custom hook, useOnlineStatus, con su estado, su efecto y su limpieza, y dos componentes que lo usan"
  height={940}
/>

Usarlo reemplaza todo ese estado y ese efecto por una línea:

```jsx title="StatusBar.jsx" showLineNumbers
function StatusBar() {
  const online = useOnlineStatus();
  return <h1>{online ? "Conectado" : "Sin conexión"}</h1>;
}

function SaveButton() {
  const online = useOnlineStatus();
  return <button disabled={!online}>Guardar</button>;
}
```

### Qué debes llevarte

- **Se comparte la lógica, no el estado:** cada llamada a `useOnlineStatus()` crea su propio `online`.
- **El nombre importa:** empieza con `use` para que React y el linter apliquen las reglas de los hooks.
- **Un hook, una tarea:** `useOnlineStatus`, `useWindowWidth`, `useFetch`. Si hace demasiado, divídelo.
- **Dónde vive:** en la carpeta `hooks/` que propusimos para la estructura del proyecto (`src/hooks/useOnlineStatus.js`).

## Further Reading

- [State: A Component's Memory](https://react.dev/learn/state-a-components-memory)
- [State as a Snapshot](https://react.dev/learn/state-as-a-snapshot)
- [Queueing a Series of State Updates](https://react.dev/learn/queueing-a-series-of-state-updates)
- [Synchronizing with Effects](https://react.dev/learn/synchronizing-with-effects)
- [Lifecycle of Reactive Effects](https://react.dev/learn/lifecycle-of-reactive-effects)
- [You Might Not Need an Effect](https://react.dev/learn/you-might-not-need-an-effect)
- [Reusing Logic with Custom Hooks](https://react.dev/learn/reusing-logic-with-custom-hooks)
- [Reglas de los Hooks](https://react.dev/reference/rules/rules-of-hooks)

---

## Cuestionario de Autoevaluación

<Quiz id="compunet2-s15-react-hooks-quiz">
  <Question title="¿Por qué un contador hecho con una variable normal (let count = 0) no funciona en un componente?">
    <Option>Porque React no permite declarar variables dentro de un componente.</Option>
    <Option correct>Porque la variable se reinicia en cada render y, además, cambiarla no le avisa a React que debe dibujar de nuevo.</Option>
    <Option>Porque las variables locales solo se pueden modificar con una función setter.</Option>
    <Option>Porque el navegador descarta las variables cuando el DOM cambia.</Option>
  </Question>
  <Question title="¿Qué devuelve useState(0)?">
    <Option>Solo el valor actual del estado.</Option>
    <Option>Una función que guarda el valor y lo muestra en pantalla.</Option>
    <Option correct>Un arreglo con el valor actual del estado y la función para cambiarlo y pedir un nuevo render.</Option>
    <Option>Un objeto con el estado y el DOM que lo representa.</Option>
  </Question>
  <Question title="Dos copias de un mismo componente Contador, ¿comparten su estado?">
    <Option>Sí, porque ejecutan la misma función.</Option>
    <Option>Sí, mientras estén dentro del mismo padre.</Option>
    <Option correct>No, React asocia el estado a cada copia según su lugar en el árbol de componentes.</Option>
    <Option>Solo si el estado es un número.</Option>
  </Question>
  <Question title="En un manejador con tres llamadas seguidas a setCount(count + 1) y count = 0, ¿cuánto vale count en el siguiente render?">
    <Option>3, porque cada llamada suma 1.</Option>
    <Option>0, porque setCount no cambia el valor.</Option>
    <Option correct>1, porque las tres llamadas usan la misma foto del estado (count = 0) y piden «poner 0 + 1».</Option>
    <Option>Depende del navegador.</Option>
  </Question>
  <Question title="¿Qué se debe hacer cuando el estado es un arreglo y quieres agregar un elemento?">
    <Option>Usar items.push(nuevo) y luego llamar a setItems(items).</Option>
    <Option correct>Pasar a setItems un arreglo nuevo, por ejemplo [...items, nuevo].</Option>
    <Option>Llamar a useState de nuevo con el arreglo modificado.</Option>
    <Option>Modificar el arreglo directamente: React detecta el cambio solo.</Option>
  </Question>
  <Question title="¿Cuándo se ejecuta un useEffect con el arreglo de dependencias vacío ([])?">
    <Option>Después de cada render.</Option>
    <Option>Cada vez que cambia cualquier estado del componente.</Option>
    <Option correct>Solo cuando el componente se monta (y su limpieza, al desmontarse).</Option>
    <Option>Nunca, porque un arreglo vacío desactiva el efecto.</Option>
  </Question>
  <Question title="¿Para qué sirve la función que devuelve un useEffect?">
    <Option>Para volver a ejecutar el efecto cuando cambie el estado.</Option>
    <Option>Para devolver el valor que el componente va a dibujar.</Option>
    <Option correct>Para deshacer lo que hizo el efecto (cerrar la conexión, quitar la suscripción) antes de repetirlo y al desmontar.</Option>
    <Option>Para evitar que React ejecute el efecto dos veces en desarrollo.</Option>
  </Question>
  <Question title="¿Qué comparten dos componentes que usan el mismo custom hook?">
    <Option>El mismo estado, porque el hook se ejecuta una sola vez.</Option>
    <Option correct>La misma lógica, pero cada uno tiene su propio estado.</Option>
    <Option>Nada: un hook solo puede usarse en un componente.</Option>
    <Option>El mismo efecto, que se ejecuta una sola vez para los dos.</Option>
  </Question>
</Quiz>
