---
sidebar_position: 1
---

# Guía Completa de Axios en React con TypeScript

## Introducción

Axios es una librería basada en **promesas** que facilita la realización de peticiones HTTP desde el navegador o desde Node.js. En proyectos con **React + TypeScript**, Axios es ampliamente utilizado por su **sintaxis limpia**, **manejo de errores mejorado** y **compatibilidad con interceptores**, lo cual lo convierte en una alternativa robusta frente al uso nativo de `fetch()`.

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

Y sus tipos para TypeScript:

```bash
npm install --save-dev @types/axios
```

---

## Configuración básica

### Ejemplo simple de uso con React y TypeScript

```tsx
import React, { useEffect, useState } from 'react';
import axios from 'axios';

interface User {
    id: number;
    name: string;
    email: string;
}

const UserList: React.FC = () => {
    const [users, setUsers] = useState<User[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        axios.get<User[]>('https://jsonplaceholder.typicode.com/users')
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
- Usamos genéricos (`<User[]>`) para tipar la respuesta.
- Manejamos estados de carga y error.
- `axios.get()` retorna automáticamente los datos en formato JSON.

---

## Configuración global de Axios

Puedes crear una instancia personalizada con una **base URL**, **headers** y otras configuraciones comunes:

```ts
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

```tsx
import api from './api';

api.get('/users').then(res => console.log(res.data));
```

Esto te evita repetir la URL base en cada solicitud y facilita el manejo de headers (por ejemplo, tokens JWT).

---

## Interceptores (Autenticación y Errores)

Los interceptores te permiten **intervenir las solicitudes y respuestas** antes de que lleguen al código principal.

### Ejemplo: agregar token JWT automáticamente

```ts
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

```ts
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

## Tipado avanzado con Axios

Axios soporta **tipos genéricos**, lo que te permite definir el tipo de dato que esperas en la respuesta:

```ts
interface Post {
    id: number;
    title: string;
    body: string;
}

async function fetchPosts(): Promise<Post[]> {
    const response = await axios.get<Post[]>('https://jsonplaceholder.typicode.com/posts');
    return response.data;
}
```

Esto ofrece **autocompletado** y **seguridad de tipos** en todo tu código.

---

## Métodos HTTP con Axios

### GET
```ts
axios.get('/users');
```

### POST
```ts
axios.post('/users', { name: 'Kevin', email: 'kevin@example.com' });
```

### PUT
```ts
axios.put('/users/1', { name: 'Kevin Updated' });
```

### DELETE
```ts
axios.delete('/users/1');
```

### PATCH
```ts
axios.patch('/users/1', { active: false });
```

---

## Manejo de errores con try/catch

```ts
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

```ts
const controller = new AbortController();

axios.get('/slow-endpoint', { signal: controller.signal });

// Cancelar después de 3 segundos
setTimeout(() => controller.abort(), 3000);
```

---

## Ejemplo completo: CRUD con Axios + React + TypeScript

```tsx
import React, { useEffect, useState } from 'react';
import axios from 'axios';

interface Todo {
    id: number;
    title: string;
    completed: boolean;
}

const TodoApp: React.FC = () => {
    const [todos, setTodos] = useState<Todo[]>([]);
    const [newTodo, setNewTodo] = useState('');

    const fetchTodos = async () => {
        const res = await axios.get<Todo[]>('https://jsonplaceholder.typicode.com/todos?_limit=5');
        setTodos(res.data);
    };

    const addTodo = async () => {
        const res = await axios.post<Todo>('https://jsonplaceholder.typicode.com/todos', {
            title: newTodo,
            completed: false,
        });
        setTodos([res.data, ...todos]);
        setNewTodo('');
    };

    const deleteTodo = async (id: number) => {
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
3. Tipar las respuestas con interfaces de TypeScript.
4. Separar la lógica de peticiones en servicios (`/services/api.ts`).
5. Manejar estados de carga y error en los componentes.
6. Evitar hacer peticiones dentro del renderizado directo.

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

