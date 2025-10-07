---
sidebar_position: 1
---

# Asincronía en JavaScript

La asincronía es un concepto fundamental en la programación moderna, especialmente en JavaScript, donde muchas operaciones, como solicitudes de red o temporizadores, no se completan de inmediato. En lugar de bloquear la ejecución del programa mientras se espera a que estas operaciones terminen, JavaScript utiliza un modelo de ejecución basado en eventos y callbacks para manejar tareas asincrónicas.

## Callbacks

Un callback es una función que se pasa como argumento a otra función y se ejecuta después de que se completa una operación asincrónica. Este enfoque permite que el programa continúe ejecutándose mientras se espera la finalización de la operación.

```javascript
console.log("Inicio");

setTimeout(() => {
  console.log("Operación asincrónica completada");
}, 2000);

console.log("Fin");
```

## Promesas

Las promesas son una forma más moderna y poderosa de manejar la asincronía en JavaScript. Una promesa representa un valor que puede estar disponible ahora, en el futuro o nunca. Las promesas tienen tres estados: pendiente, cumplida y rechazada.

```javascript
const miPromesa = new Promise((resolve, reject) => {
  setTimeout(() => {
    resolve("Operación completada");
  }, 2000);
});

miPromesa.then((resultado) => {
  console.log(resultado);
});
```

## Async/Await

`async` y `await` son una forma sintáctica de trabajar con promesas que hace que el código asincrónico sea más fácil de leer y escribir. Al declarar una función como `async`, se puede utilizar `await` dentro de ella para esperar la resolución de una promesa.

```javascript
const funcionAsincrona = async () => {
  const resultado = await miPromesa;
  console.log(resultado);
};

funcionAsincrona();
```

## Event Loop

El event loop es un mecanismo que permite a JavaScript manejar operaciones asincrónicas. Funciona en conjunto con la pila de llamadas (call stack) y la cola de tareas (task queue). Cuando una operación asincrónica se completa, su callback se coloca en la cola de tareas, y el event loop se encarga de moverlo a la pila de llamadas cuando esta está vacía.

## Event Loop

El Event Loop es el mecanismo que permite a Node.js ejecutar operaciones no bloqueantes, a pesar de ser single-threaded.

### Fases del Event Loop (simplificadas):

1. **Timers:** Ejecuta callbacks de `setTimeout` y `setInterval`.
2. **Pending callbacks:** Callbacks postergados por ciertas operaciones del sistema.
3. **Idle/prepare:** Interno de Node.
4. **Poll:** Recupera nuevos eventos, ejecuta I/O.
5. **Check:** Ejecuta `setImmediate()`.
6. **Close callbacks:** Ej. `socket.on('close')`.

<img src="/img/event-loop.png" alt="Event Loop" />

<img src="/img/event-loop-1.png" alt="Event Loop 1" />

### Microtasks vs Macrotasks

- **Microtasks:** Promesas (`Promise.then`), `queueMicrotask`.
- **Macrotasks:** `setTimeout`, `setInterval`, `setImmediate`.

Ejemplo:

```js
console.log('Inicio');

setTimeout(() => console.log('Timeout'), 0);

Promise.resolve().then(() => console.log('Promesa'));

console.log('Fin');
```

**Salida esperada:**

```
Inicio
Fin
Promesa
Timeout
```

