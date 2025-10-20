---
sidebar_position: 1
---


# Next.js intro

## 1. Introducción

### ¿Qué es Next.js?
Next.js es un **framework de React** que permite crear aplicaciones web modernas con **renderizado del lado del servidor (SSR)**, **generación estática (SSG)** y características avanzadas como **rutas automáticas**, **API Routes**, **optimización de imágenes**, y más.  
Fue creado por Vercel y está diseñado para mejorar el rendimiento, SEO y experiencia de desarrollo de aplicaciones React.

### Diferencias con React
| Aspecto | React | Next.js |
|----------|--------|---------|
| Renderizado | Solo del lado del cliente (CSR) | CSR, SSR, SSG, ISR |
| Ruteo | Manual con `react-router` | Automático mediante el sistema de archivos |
| SEO | Limitado, depende del CSR | Excelente, gracias al SSR y SSG |
| Configuración | Requiere herramientas externas (Vite, Webpack) | Configuración mínima integrada |
| API | No tiene backend integrado | Incluye API Routes internas |

### Ventajas principales
- **SSR (Server-Side Rendering):** renderiza la página en el servidor antes de enviarla al cliente.
- **SSG (Static Site Generation):** genera las páginas de forma estática en tiempo de build.
- **ISR (Incremental Static Regeneration):** combina lo mejor de SSR y SSG actualizando contenido de forma incremental.
- **App Router:** nuevo sistema de ruteo basado en la carpeta `app/`.
- **Optimización automática:** de imágenes, fuentes, código y SEO.

### Arquitectura general
Un proyecto de Next.js combina:
- Componentes React (client o server)
- Rutas basadas en el sistema de archivos (`app/` o `pages/`)
- API Routes para lógica del lado del servidor
- Configuración centralizada (`next.config.js`)
- Despliegue optimizado con Vercel o servicios compatibles

---

## 2. Instalación y estructura de un proyecto

### Crear un proyecto
```bash
npx create-next-app@latest mi-proyecto
# Si estas dentro de la carpeta donde quieres crear el proyecto:
npx create-next-app@latest ./
```
Opcionalmente, puedes habilitar TypeScript, ESLint o Tailwind durante la configuración.

### Estructura de carpetas
```plaintext
mi-proyecto/
├── app/                # App Router (rutas, layouts, páginas)
│   ├── page.js         # Página principal
│   ├── layout.js       # Layout raíz
│   └── about/
│       └── page.js     # Ruta /about
├── components/         # Componentes reutilizables
├── public/             # Archivos estáticos (imágenes, íconos, etc.)
├── styles/             # Estilos globales
├── next.config.js      # Configuración de Next.js
└── package.json        # Dependencias y scripts
```

### Configuración base
El archivo `next.config.js` permite ajustar el comportamiento del framework:
```js
/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true, // Habilita el modo estricto de React
  images: {
    domains: ['example.com'], // Por ejemplo para permitir imágenes externas
  },
};

export default nextConfig;
```

### Uso de TypeScript
Si deseas usar TypeScript:
```bash
touch tsconfig.json
npm install --save-dev typescript @types/react @types/node
```
Next detectará automáticamente el archivo `tsconfig.json` y configurará el entorno.

---

## 3. Conceptos esenciales

### Routing con App Router (desde Next 13)
Next.js usa un sistema de **ruteo basado en el sistema de archivos** dentro de la carpeta `app/`.  
Cada subcarpeta representa una ruta y debe incluir un archivo `page.js` o `page.tsx`.

```plaintext
app/
├── page.js        →  Ruta "/"
├── about/
│   └── page.js    →  Ruta "/about"
└── blog/
    └── [id]/
        └── page.js → Ruta dinámica "/blog/:id"
```

### Rutas estáticas y dinámicas
Las rutas con `[param]` definen segmentos dinámicos.  
Por ejemplo, `app/blog/[id]/page.js` permite acceder a `/blog/123` o `/blog/abc`.

### Layouts y nested layouts
`layout.js` define la estructura visual compartida entre páginas (como encabezados o menús).
Puedes tener layouts anidados en diferentes niveles del árbol.

```jsx
// app/layout.js
export default function RootLayout({ children }) {
  return (
    <html lang="es">
      <body>{children}</body>
    </html>
  );
}
```
---

## 4. Renderizado y obtención de datos

### CSR (Client-Side Rendering)
El contenido se genera en el navegador del usuario. Es el modo estándar de React.

### SSR (Server-Side Rendering)
La página se renderiza en el servidor en cada petición.
```jsx
export default async function Page() {
  const res = await fetch('https://api.example.com/data', { cache: 'no-store' });
  const data = await res.json();
  return <div>{data.title}</div>;
}
```

### SSG (Static Site Generation)
El contenido se genera en tiempo de build y se sirve como HTML estático.
```jsx
export const revalidate = false;
```

### ISR (Incremental Static Regeneration)
Permite regenerar páginas estáticas en intervalos definidos.
```jsx
export const revalidate = 60; // cada 60 segundos
```

### Cuándo usar cada uno
| Modo | Cuándo usarlo |
|------|----------------|
| **CSR** | Interacciones dinámicas del cliente |
| **SSR** | Datos cambiantes o dependientes del usuario |
| **SSG** | Contenido estático o blogs |
| **ISR** | Contenido semi-estático con actualizaciones periódicas |

### Control de caché
- `cache: 'force-cache'` → usa datos almacenados en caché
- `cache: 'no-store'` → obtiene siempre datos frescos
- `revalidate` → controla regeneración de contenido

---

## 5. Componentes del App Router

### Server Components vs Client Components
- **Server Components:** se renderizan en el servidor (por defecto).
- **Client Components:** se renderizan en el navegador y pueden usar hooks.

### Uso del `'use client'`
Coloca `'use client'` al inicio de un archivo para indicar que debe ejecutarse en el cliente.

```jsx
'use client';

import { useState } from 'react';

export default function Counter() {
  const [count, setCount] = useState(0);
  return <button onClick={() => setCount(count + 1)}>{count}</button>;
}
```

### Pasar datos entre componentes de servidor y cliente
Puedes pasar props desde un **Server Component** a un **Client Component**, pero no al revés.

```jsx
// app/page.js
import Counter from './Counter';

export default async function Page() {
  const data = await fetchData();
  return <Counter initialValue={data.value} />;
}
```

### Hooks de navegación
- `useRouter()` → navegar entre rutas
- `usePathname()` → obtener la ruta actual
- `useSearchParams()` → leer parámetros de la URL

---
