---
sidebar_position: 1
---

# Guía de React Hooks

Esta guía descargable cubre los conceptos fundamentales de los React Hooks, centrándose en `useState`, `useEffect` y la creación de Custom Hooks. Incluye explicaciones detalladas y ejemplos prácticos resueltos para facilitar el aprendizaje y la aplicación en proyectos reales.


## ¿Qué son los React Hooks?

Los React Hooks son funciones que permiten "enganchar" el estado y el ciclo de vida de React en componentes funcionales. Antes de los hooks, estas capacidades solo estaban disponibles en componentes de clase. Los hooks simplifican la lógica y promueven la reutilización de código.


## useState

`useState` es un hook que permite agregar estado local a los componentes funcionales. El estado es una forma de almacenar valores que pueden cambiar con el tiempo y que afectan la renderización del componente.

### ¿Cómo funciona?

Al llamar a `useState`, se recibe un arreglo con dos elementos: el valor actual del estado y una función para actualizarlo.

```jsx
const [count, setCount] = useState(0);
```

- `count`: valor actual del estado.
- `setCount`: función para actualizar el estado.

### Ejemplos de uso

#### 1. Contador simple

```jsx
import React, { useState } from 'react';

function Contador() {
    const [count, setCount] = useState(0);

    return (
        <div>
            <p>Contador: {count}</p>
            <button onClick={() => setCount(count + 1)}>Incrementar</button>
            <button onClick={() => setCount(count - 1)}>Decrementar</button>
        </div>
    );
}
```

#### 2. Manejo de texto de entrada

```jsx
import React, { useState } from 'react';

function InputTexto() {
    const [texto, setTexto] = useState('');

    return (
        <div>
            <input
                type="text"
                value={texto}
                onChange={e => setTexto(e.target.value)}
                placeholder="Escribe algo..."
            />
            <p>Texto ingresado: {texto}</p>
        </div>
    );
}
```

#### 3. Alternar visibilidad

```jsx
import React, { useState } from 'react';

function MostrarOcultar() {
    const [visible, setVisible] = useState(true);

    return (
        <div>
            <button onClick={() => setVisible(!visible)}>
                {visible ? 'Ocultar' : 'Mostrar'}
            </button>
            {visible && <p>Este texto se puede ocultar.</p>}
        </div>
    );
}
```

#### 4. Lista dinámica

```jsx
import React, { useState } from 'react';

function ListaDinamica() {
    const [items, setItems] = useState([]);
    const [input, setInput] = useState('');

    const agregarItem = () => {
        if (input.trim() !== '') {
            setItems([...items, input]);
            setInput('');
        }
    };

    return (
        <div>
            <input
                value={input}
                onChange={e => setInput(e.target.value)}
                placeholder="Nuevo ítem"
            />
            <button onClick={agregarItem}>Agregar</button>
            <ul>
                {items.map((item, idx) => <li key={idx}>{item}</li>)}
            </ul>
        </div>
    );
}
```

#### 5. Selección de opción

```jsx
import React, { useState } from 'react';

function SeleccionOpcion() {
    const [opcion, setOpcion] = useState('A');

    return (
        <div>
            <select value={opcion} onChange={e => setOpcion(e.target.value)}>
                <option value="A">Opción A</option>
                <option value="B">Opción B</option>
                <option value="C">Opción C</option>
            </select>
            <p>Opción seleccionada: {opcion}</p>
        </div>
    );
}
```


## useEffect

`useEffect` es un hook que permite ejecutar efectos secundarios en componentes funcionales. Los efectos secundarios incluyen tareas como la obtención de datos, la suscripción a eventos, la manipulación del DOM, entre otros.

### ¿Cómo funciona?

`useEffect` recibe una función que se ejecuta después de que el componente se renderiza. Puede recibir un segundo argumento, un arreglo de dependencias, que determina cuándo se ejecuta el efecto.

```jsx
useEffect(() => {
    // Código del efecto
}, [dependencias]);
```

### Ejemplos de uso

#### 1. Actualizar el título del documento

```jsx
import React, { useState, useEffect } from 'react';

function TituloDinamico() {
    const [count, setCount] = useState(0);

    useEffect(() => {
        document.title = `Contador: ${count}`;
    }, [count]);

    return (
        <button onClick={() => setCount(count + 1)}>
            Incrementar ({count})
        </button>
    );
}
```

> *Nota*: Manipular el DOM directamente no es una práctica recomendada en React, pero este ejemplo ilustra cómo usar `useEffect` para efectos secundarios.

#### 2. Obtener datos de una API

```jsx
import React, { useState, useEffect } from 'react';

function Usuarios() {
    const [usuarios, setUsuarios] = useState([]);

    useEffect(() => {
        fetch('https://jsonplaceholder.typicode.com/users')
            .then(res => res.json())
            .then(data => setUsuarios(data));
    }, []);

    return (
        <ul>
            {usuarios.map(u => <li key={u.id}>{u.name}</li>)}
        </ul>
    );
}
```

#### 3. Temporizador

```jsx
import React, { useState, useEffect } from 'react';

function Temporizador() {
    const [segundos, setSegundos] = useState(0);

    useEffect(() => {
        const intervalo = setInterval(() => {
            setSegundos(s => s + 1);
        }, 1000);

        return () => clearInterval(intervalo);
    }, []);

    return <p>Segundos: {segundos}</p>;
}
```

#### 4. Detectar cambios en una variable

```jsx
import React, { useState, useEffect } from 'react';

function CambiosTexto() {
    const [texto, setTexto] = useState('');

    useEffect(() => {
        if (texto) {
            console.log(`Texto cambiado: ${texto}`);
        }
    }, [texto]);

    return (
        <input
            value={texto}
            onChange={e => setTexto(e.target.value)}
            placeholder="Escribe algo"
        />
    );
}
```

#### 5. Suscripción a eventos del navegador

```jsx
import React, { useState, useEffect } from 'react';

function TamañoVentana() {
    const [ancho, setAncho] = useState(window.innerWidth);

    useEffect(() => {
        const actualizarAncho = () => setAncho(window.innerWidth);
        window.addEventListener('resize', actualizarAncho);

        return () => window.removeEventListener('resize', actualizarAncho);
    }, []);

    return <p>Ancho de la ventana: {ancho}px</p>;
}
```


## Custom Hooks

Los Custom Hooks permiten encapsular y reutilizar lógica de estado y efectos en múltiples componentes. Son funciones que pueden usar otros hooks y devuelven valores o funciones útiles.

### ¿Cómo se crean?

Un custom hook es una función que comienza con `use` y puede utilizar cualquier hook de React en su interior.

### Ejemplo useContador

Este custom hook combina `useState` y `useEffect` para crear un contador automático.

```jsx
import { useState, useEffect } from 'react';

function useContador(inicial = 0, intervalo = 1000) {
    const [valor, setValor] = useState(inicial);

    useEffect(() => {
        const id = setInterval(() => {
            setValor(v => v + 1);
        }, intervalo);

        return () => clearInterval(id);
    }, [intervalo]);

    return [valor, setValor];
}

// Uso en un componente
import React from 'react';

function ContadorAuto() {
    const [contador, setContador] = useContador(0, 500);

    return (
        <div>
            <p>Contador automático: {contador}</p>
            <button onClick={() => setContador(0)}>Reiniciar</button>
        </div>
    );
}
```

