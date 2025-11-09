---
sidebar_position: 1
---

# Guía Completa de Axios en React

## Introducción

Axios es una librería basada en **promesas** que facilita la realización de peticiones HTTP desde el navegador o desde Node.js. En proyectos con **React**, Axios es ampliamente utilizado por su **sintaxis limpia**, **manejo de errores mejorado** y **compatibilidad con interceptores**, lo cual lo convierte en una alternativa robusta frente al uso nativo de `fetch()`.

---

## ¿Por qué usar Axios y no Fetch?

Aunque `fetch()` es nativo en JavaScript, Axios ofrece una serie de ventajas que lo hacen más conveniente para aplicaciones medianas y grandes:

| Característica | Axios | Fetch |
|----------------|--------|--------|
| Manejo automático de JSON | Sí | No (debes usar `.json()`) |
| Manejo de errores HTTP | Sí (lanza error automáticamente) | No (no lanza error si status !== 200) |
| Interceptores | Sí | No |
| Cancelación de peticiones | Sí | Parcial (AbortController) |
| Timeouts configurables | Sí | Con configuración manual |
| Compatibilidad con navegadores antiguos | Alta | Media |

En resumen, **Axios simplifica** las tareas repetitivas y mejora la legibilidad del código.

---

## Instalación

Instala Axios en tu proyecto con:

```bash
npm install axios
```

---

## Configuración básica

### Ejemplo simple de uso con React

```jsx
import React, { useEffect, useState } from 'react';
import axios from 'axios';

const UserList = () => {
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        axios.get('https://jsonplaceholder.typicode.com/users')
            .then(response => setUsers(response.data))
            .catch(err => setError(err.message))
            .finally(() => setLoading(false));
    }, []);

    if (loading) return <p>Cargando...</p>;
    if (error) return <p>Error: {error}</p>;

    return (
        <ul>
            {users.map(user => <li key={user.id}>{user.name}</li>)}
        </ul>
    );
};

export default UserList;
```

**Puntos clave:**
- Manejamos estados de carga y error.
- `axios.get()` retorna automáticamente los datos en formato JSON.

---

## Configuración global de Axios

Puedes crear una instancia personalizada con una **base URL**, **headers** y otras configuraciones comunes:

```js
import axios from 'axios';

const api = axios.create({
    baseURL: 'https://api.example.com',
    timeout: 10000,
    headers: {
        'Content-Type': 'application/json',
    },
});

export default api;
```

Uso:

```jsx
import api from './api';

api.get('/users').then(res => console.log(res.data));
```

Esto te evita repetir la URL base en cada solicitud y facilita el manejo de headers (por ejemplo, tokens JWT).

---

## Interceptores (Autenticación y Errores)

Los interceptores te permiten **intervenir las solicitudes y respuestas** antes de que lleguen al código principal.

### Ejemplo: agregar token JWT automáticamente

```js
import axios from 'axios';

const api = axios.create({ baseURL: 'https://api.example.com' });

api.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem('token');
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    (error) => Promise.reject(error)
);

export default api;
```

### Ejemplo: manejo global de errores

```js
api.interceptors.response.use(
    (response) => response,
    (error) => {
        if (error.response?.status === 401) {
            console.warn('Token expirado. Redirigiendo al login...');
            window.location.href = '/login';
        }
        return Promise.reject(error);
    }
);
```

---

## Métodos HTTP con Axios

### GET
```js
axios.get('/users');
```

### POST
```js
axios.post('/users', { name: 'Kevin', email: 'kevin@example.com' });
```

### PUT
```js
axios.put('/users/1', { name: 'Kevin Updated' });
```

### DELETE
```js
axios.delete('/users/1');
```

### PATCH
```js
axios.patch('/users/1', { active: false });
```

---

## Manejo de errores con try/catch

```js
try {
    const res = await axios.get('/invalid-url');
    console.log(res.data);
} catch (error) {
    if (axios.isAxiosError(error)) {
        console.error('Axios error:', error.message);
        console.error('Status:', error.response?.status);
    } else {
        console.error('Error desconocido:', error);
    }
}
```

---

## Cancelación de peticiones

Axios permite cancelar solicitudes en curso usando `AbortController` o `CancelToken`.

```js
const controller = new AbortController();

axios.get('/slow-endpoint', { signal: controller.signal });

// Cancelar después de 3 segundos
setTimeout(() => controller.abort(), 3000);
```

---

## Ejemplo completo: CRUD con Axios + React

```jsx
import React, { useEffect, useState } from 'react';
import axios from 'axios';

const TodoApp = () => {
    const [todos, setTodos] = useState([]);
    const [newTodo, setNewTodo] = useState('');

    const fetchTodos = async () => {
        const res = await axios.get('https://jsonplaceholder.typicode.com/todos?_limit=5');
        setTodos(res.data);
    };

    const addTodo = async () => {
        const res = await axios.post('https://jsonplaceholder.typicode.com/todos', {
            title: newTodo,
            completed: false,
        });
        setTodos([res.data, ...todos]);
        setNewTodo('');
    };

    const deleteTodo = async (id) => {
        await axios.delete(`https://jsonplaceholder.typicode.com/todos/${id}`);
        setTodos(todos.filter(t => t.id !== id));
    };

    useEffect(() => {
        fetchTodos();
    }, []);

    return (
        <div>
            <h2>Lista de Tareas</h2>
            <input value={newTodo} onChange={(e) => setNewTodo(e.target.value)} />
            <button onClick={addTodo}>Agregar</button>
            <ul>
                {todos.map(todo => (
                    <li key={todo.id}>
                        {todo.title}
                        <button onClick={() => deleteTodo(todo.id)}>Eliminar</button>
                    </li>
                ))}
            </ul>
        </div>
    );
};

export default TodoApp;
```

---

## Buenas prácticas

1. Crear una instancia `axiosInstance` centralizada.
2. Usar interceptores para manejar tokens y errores globales.
3. Separar la lógica de peticiones en servicios (`/services/api.js`).
4. Manejar estados de carga y error en los componentes.
5. Evitar hacer peticiones dentro del renderizado directo.

---

## Alternativas modernas

Si bien Axios es potente, hay librerías más recientes como:
- React Query (TanStack Query): Maneja cache, sincronización y reintentos.
- SWR: Ideal para interfaces reactivas y cache de datos.
- Ky: Una alternativa ligera a Axios basada en `fetch`.

---

## Recursos recomendados

- [Documentación oficial de Axios](https://axios-http.com/docs/intro)
- [GitHub de Axios](https://github.com/axios/axios)
- [React Query](https://tanstack.com/query/latest)
- [MDN Fetch API](https://developer.mozilla.org/en-US/docs/Web/API/Fetch_API)


