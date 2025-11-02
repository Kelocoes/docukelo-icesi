---
sidebar_position: 2
---

# Guía de Implementación: Sistema de Autenticación con React Router

Esta guía documenta los cambios realizados para trabajar con React Router. Puedes partir usando este repositorio: https://github.com/Kelocoes/dmi-20252/tree/week-10/react-router

## Implementación Paso a Paso

### Paso 1: Crear el Context de Autenticación

Crear el archivo `src/layout/Auth/Auth.tsx`:

```tsx
import {
    createContext,
    useContext,
    useEffect,
    useState,
    type ReactNode,
} from "react";
import { Outlet } from "react-router";

type User = {
    id: string;
    username?: string;
    email: string;
    password?: string;
};

type AuthContextType = {
    user: User | null;
    isAuthenticated: boolean;
    login: (_email: string, _password: string) => void;
    register: (_username: string, _email: string, _password: string) => void;
    isLoading: boolean;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const AuthProvider = ({ children }: { children: ReactNode }) => {
    const [user, setUser] = useState<User | null>(null);
    const [isLoading, setIsLoading] = useState(true);

    const login = (email: string, password: string) => {
        // Simulación de login
        const userData = { id: "1", email, password };
        setUser(userData);
        localStorage.setItem("user", JSON.stringify(userData));
    };

    const register = (username: string, email: string, password: string) => {
        // Simulación de registro
        const userData = { id: "1", username, email, password };
        setUser(userData);
        localStorage.setItem("user", JSON.stringify(userData));
    };

    useEffect(() => {
        const storedUser = localStorage.getItem("user");
        if (storedUser) {
            try {
                setUser(JSON.parse(storedUser));
            } catch (error) {
                console.error("Error parsing stored user:", error);
                localStorage.removeItem("user");
                setUser(null);
            }
        } else {
            setUser(null);
        }
        setIsLoading(false);
    }, []);

    const isAuthenticated = user !== null;

    return (
        <AuthContext.Provider
            value={{ user, isAuthenticated, login, register, isLoading }}
        >
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (!context) throw new Error("useAuth must be used within AuthProvider");
    return context;
};

export default function Auth() {
    return (
        <AuthProvider>
            <div id="auth-layout">
                <h1>Auth Layout</h1>
                <Outlet />
            </div>
        </AuthProvider>
    );
}
```

**Características clave:**

-   **Context API**: Para compartir estado entre componentes
-   **LocalStorage**: Persistencia de sesión del usuario
-   **Estado de carga**: Evita redirecciones prematuras
-   **Provider Pattern**: Envuelve los componentes hijos

### Paso 2: Configurar el Router

Crear el archivo `src/router/Router.tsx`:

```tsx
import { createBrowserRouter, Navigate } from "react-router";

import Landing from "../pages/landing/Landing";
import Register from "../pages/register/Register";
import AuthLayout from "../layout/Auth/Auth";
import Login from "../pages/login/Login";
import Feed from "../pages/feed/Feed";

const router = createBrowserRouter(
    [
        {
            path: "/",
            Component: AuthLayout,
            children: [
                {
                    index: true,
                    element: <Navigate to="login" replace />,
                },
                { path: "login", Component: Login },
                { path: "register", Component: Register },
                { path: "feed", Component: Feed },
                { path: "*", Component: Landing },
            ],
        },
    ],
    { basename: "/dmi" }
);

export default router;
```

**Configuración importante:**

-   **Rutas anidadas**: Todas bajo el `AuthLayout`
-   **Basename**: Configurado para `/dmi`
-   **Redirección por defecto**: Redirige a login desde la raíz

### Paso 3: Crear las Páginas

#### Página de Login (`src/pages/login/Login.tsx`)

```tsx
import { useState } from "react";
import { useNavigate, Link } from "react-router";
import { useAuth } from "../../layout/Auth/Auth";

export default function Login() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const { login } = useAuth();
    const navigate = useNavigate();

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        login(email, password);
        navigate("/feed");
    };

    return (
        <div id="login-page">
            <h2>Login</h2>
            <form onSubmit={handleSubmit}>
                <div>
                    <label>Email:</label>
                    <input
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                    />
                </div>
                <div>
                    <label>Password:</label>
                    <input
                        type="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                    />
                </div>
                <button type="submit">Login</button>
            </form>
            <p>
                Don't have an account? <Link to="/register">Register</Link>
            </p>
        </div>
    );
}
```

#### Página de Registro (`src/pages/register/Register.tsx`)

```tsx
import { useState } from "react";
import { useNavigate, Link } from "react-router";
import { useAuth } from "../../layout/Auth/Auth";

export default function Register() {
    const [username, setUsername] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const { register } = useAuth();
    const navigate = useNavigate();

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        register(username, email, password);
        navigate("/feed");
    };

    return (
        <div id="register-page">
            <h2>Register</h2>
            <form onSubmit={handleSubmit}>
                <div>
                    <label>Username:</label>
                    <input
                        type="text"
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                        required
                    />
                </div>
                <div>
                    <label>Email:</label>
                    <input
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                    />
                </div>
                <div>
                    <label>Password:</label>
                    <input
                        type="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                    />
                </div>
                <button type="submit">Register</button>
            </form>
            <p>
                Already have an account? <Link to="/login">Login</Link>
            </p>
        </div>
    );
}
```

#### Página Protegida - Feed (`src/pages/feed/Feed.tsx`)

```tsx
import { Navigate } from "react-router";
import { useAuth } from "../../layout/Auth/Auth";

export default function Feed() {
    const { user, isAuthenticated, isLoading } = useAuth();

    if (isLoading) {
        return <div>Loading...</div>;
    }

    if (!isAuthenticated) {
        return <Navigate to="/login" replace />;
    }

    return (
        <div id="feed-page">
            <h1>Feed Page</h1>
            <p>Welcome, {user?.username || user?.email}!</p>
        </div>
    );
}
```

**Protección de ruta:**

-   **Estado de carga**: Espera verificación de autenticación
-   **Redirección condicional**: Solo redirige si no está autenticado
-   **Información del usuario**: Muestra datos del usuario logueado

### Paso 4: Integrar el Router en la Aplicación

Modificar `src/main.tsx`:

```tsx
import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { RouterProvider } from "react-router";

import "./index.css";
import router from "./router/Router.tsx";

createRoot(document.getElementById("root")!).render(
    <StrictMode>
        <RouterProvider router={router} />
    </StrictMode>
);
```



## Características del Sistema de Autenticación

### 1. **Persistencia de Sesión**

-   Los datos del usuario se guardan en `localStorage`
-   Se restaura automáticamente al recargar la página
-   Manejo de errores al parsear datos corruptos

### 2. **Estados de Carga**

-   Previene redirecciones prematuras
-   Muestra indicador de carga mientras verifica autenticación
-   Mejora la experiencia del usuario

### 3. **Navegación Protegida**

-   Redirige a login si no está autenticado
-   Mantiene la información del usuario entre páginas
-   Uso de `replace` para evitar loops de navegación

### 4. **Context Pattern**

-   Estado global accesible desde cualquier componente
-   Funciones de login/register centralizadas
-   Verificación de autenticación consistente


### Manejo de Redirecciones

```tsx
// ✅ Uso correcto de Navigate con replace
if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
}

// ✅ Esperar estado de carga antes de decidir
if (isLoading) {
    return <div>Loading...</div>;
}
```



## Estructura Final del Proyecto

```
src/
├── layout/
│   └── Auth/
│       └── Auth.tsx          # Context y Provider de autenticación
├── pages/
│   ├── feed/
│   │   └── Feed.tsx          # Página protegida
│   ├── landing/
│   │   └── Landing.tsx       # Página pública
│   ├── login/
│   │   └── Login.tsx         # Formulario de login
│   └── register/
│       └── Register.tsx      # Formulario de registro
├── router/
│   └── Router.tsx            # Configuración de rutas
└── main.tsx                  # Punto de entrada con RouterProvider
```



## Cómo Usar

1. **Acceder a la aplicación**: Va automáticamente a `/login`
2. **Registrarse**: Crear cuenta nueva y se redirige a `/feed`
3. **Iniciar sesión**: Usar credenciales y acceder al feed
4. **Persistencia**: Los datos se mantienen al recargar la página
5. **Protección**: Intentar acceder a `/feed` sin login redirige a `/login`

Esta implementación proporciona una base sólida para un sistema de autenticación escalable y mantenible.
