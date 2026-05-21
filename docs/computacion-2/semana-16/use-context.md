---
sidebar_position: 1
---

# Guía de Autenticación con Context API y Rutas Protegidas en React

Esta guía explica cómo gestionar el estado global de autenticación en una aplicación React utilizando el **Context API** y cómo restringir el acceso a ciertas partes de la aplicación mediante **Rutas Protegidas**.

---

## 1. El Concepto de Context API

En React, la forma estándar de pasar datos es de padres a hijos a través de `props`. Sin embargo, esto se vuelve ineficiente cuando muchos componentes en diferentes niveles necesitan acceder a la misma información (como el usuario autenticado). Este problema se conoce como **Prop Drilling**.

**Context API** es la solución integrada de React para manejar "estados globales". Permite que un componente "provea" datos a todo el árbol de componentes que tiene por debajo, sin tener que pasarlos manualmente por cada nivel.

### ¿Cómo funciona técnicamente?

Para usar Context, necesitamos tres piezas clave:

1.  **`createContext(defaultValue)`**: Crea el objeto de contexto. El `defaultValue` solo se usa si un componente intenta consumir el contexto pero no está envuelto en un `Provider`.
2.  **`Context.Provider`**: Es un componente que envuelve a nuestra aplicación (o una parte de ella). Recibe una prop llamada `value`, que es la información que queremos compartir.
3.  **`useContext(Context)`**: Es el hook que utilizamos dentro de cualquier componente hijo para "extraer" la información del contexto.

---

## 2. Implementación: El `AuthContext`

En nuestro proyecto, hemos centralizado la lógica de autenticación en `src/context/AuthContext.jsx`.

### El Proveedor de Autenticación (`AuthProvider`)

Este componente se encarga de:

- **Persistencia:** Recuperar el token del `localStorage` cuando se recarga la página.
- **Validación:** Decodificar el JWT (JSON Web Token) para saber quién es el usuario y si el token ha expirado (usando `jwt-decode`).
- **Estado:** Mantener el `user` y el `token` en el estado de React para que la interfaz reaccione a cambios (login/logout).

#### Fragmento de lógica clave:

```javascript
export function AuthProvider({ children }) {
    const [user, setUser] = useState(() => {
        const storedToken = localStorage.getItem("token");
        return storedToken ? decodeToken(storedToken) : null;
    });

    const login = (newToken) => {
        const decoded = decodeToken(newToken);
        setUser(decoded);
        localStorage.setItem("token", newToken);
    };

    const logout = () => {
        setUser(null);
        localStorage.removeItem("token");
    };

    return (
        <AuthContext.Provider
            value={{ user, login, logout, isAuthenticated: !!user }}
        >
            {children}
        </AuthContext.Provider>
    );
}
```

---

## 3. Rutas Públicas y Privadas

Una vez que tenemos el estado de autenticación en el Contexto, podemos decidir qué componentes mostrar según si el usuario ha iniciado sesión o no.

### El Componente `ProtectedRoute`

Este componente actúa como un "guardián". No renderiza contenido propio directamente, sino que decide si permite el paso a sus rutas hijas.

- **`Navigate`**: Un componente de `react-router` que redirige al usuario programáticamente.
- **`Outlet`**: Es un marcador de posición. Indica dónde se deben renderizar las rutas hijas si la condición de protección se cumple.

```javascript
export default function ProtectedRoute() {
    const { isAuthenticated } = useContext(AuthContext);

    if (!isAuthenticated) {
        // Si no está autenticado, lo mandamos al login
        return <Navigate to="/auth/login" replace />;
    }

    // Si está autenticado, permitimos que vea las rutas hijas
    return <Outlet />;
}
```

### Configuración en el Router

En `src/router/Router.jsx`, agrupamos las rutas que requieren protección dentro de un objeto que utiliza el `ProtectedRoute` como elemento base:

```javascript
const router = createBrowserRouter([
    {
        path: "/auth", // Rutas Públicas
        children: [...]
    },
    {
        element: <ProtectedRoute />, // Guardián de seguridad
        children: [
            {
                path: "dashboard", // Esta ruta ahora es privada
                element: <Dashboard />,
            }
        ]
    }
]);
```

---

## 4. ¿Cuándo usar cada cosa?

| Herramienta        | Cuándo usarla                                                                           |
| :----------------- | :-------------------------------------------------------------------------------------- |
| **Context API**    | Para datos que necesita "toda la app" (Tema oscuro/claro, Idioma, Usuario Autenticado). |
| **Props**          | Para datos específicos de una relación Padre-Hijo. Es más simple y fácil de rastrear.   |
| **ProtectedRoute** | Siempre que una URL no deba ser accesible por usuarios anónimos.                        |

## 5. Resumen de Flujo de Trabajo

1.  **En el Login:** El componente llama a `login(token)` del contexto. Esto actualiza el estado global y guarda en `localStorage`.
2.  **En el Router:** El `ProtectedRoute` detecta que `isAuthenticated` ahora es `true` y permite el acceso al Dashboard.
3.  **En el Dashboard:** Usamos `useContext(AuthContext)` para obtener los datos del usuario (nombre, email, roles) y mostrarlos en pantalla.
4.  **Al Recargar:** El `AuthProvider` inicializa su estado leyendo el `localStorage`, manteniendo la sesión activa.

---

> **Nota para estudiantes:** No abusen del Context API. Cada vez que el valor del contexto cambia, **todos** los componentes que lo consumen se vuelven a renderizar. Para estados pequeños y localizados, sigan usando `useState` y `props`.
