---
sidebar_position: 4
---

# Arquitectura y Estructura en Next.js

Para construir aplicaciones escalables y mantenibles en Next.js, es fundamental comprender la anatomía de su sistema de archivos. A diferencia de otros entornos de desarrollo donde la estructura interna es completamente arbitraria, Next.js se basa en **convenciones de nomenclatura estrictas** que determinan el enrutamiento, la jerarquía de componentes y el manejo declarativo de estados de carga y error.

En este documento analizaremos la estructura inicial generada por las herramientas oficiales, el propósito de cada archivo de configuración en la raíz del proyecto y la jerarquía de renderizado que Next.js aplica al componer una ruta.

---

## 1. Anatomía de un Proyecto Creado con `create-next-app`

Al inicializar un proyecto moderno de Next.js con el comando oficial `npx create-next-app@latest`, el andamiaje genera una estructura limpia y optimizada para producción:

<img src="/img/computacion-3/nextjs-project-anatomy.svg" alt="Anatomía detallada de un proyecto Next.js generado por create-next-app" width="100%" />

### Desglose de los Componentes del Sistema de Archivos

#### 1. El Directorio `app/` (o `src/app/`)
Es el núcleo de la aplicación en el App Router. Contiene todas las rutas, layouts, páginas y hojas de estilo globales:
- **`layout.tsx`**: El layout raíz obligatorio. Define las etiquetas indispensables `<html>` y `<body>`, configurando el diseño compartido por toda la aplicación.
- **`page.tsx`**: El componente que renderiza el contenido de la ruta principal (`/`).
- **`globals.css`**: Hoja de estilos compartida en la que se configuran las directivas de **Tailwind CSS** y las variables de diseño base.
- **`favicon.ico`**: Icono que se muestra en la pestaña del navegador, gestionado automáticamente por la API de metadata de archivos de Next.js.

#### 2. El Directorio `public/`
Almacena recursos estáticos que se sirven directamente en la raíz del dominio:
- Los archivos dentro de `public/` (por ejemplo, `public/logo.svg`) son accesibles desde la URL base sin prefijos (como `https://midominio.com/logo.svg`).
- Se recomienda ubicar aquí logotipos institucionales, robots.txt, sitemaps estáticos o imágenes que no dependan del pipeline de construcción.

#### 3. Archivos de Configuración en la Raíz
- **`next.config.ts`**: Archivo de configuración principal del framework. Permite habilitar características experimentales, configurar dominios seguros para imágenes remotas (`images.remotePatterns`) y definir redirecciones HTTP.
- **`tsconfig.json`**: Configuración del compilador de TypeScript. Incluye de forma nativa la resolución de alias de importación (`paths: { "@/*": ["./*"] }`), lo que permite importar componentes desde la raíz sin utilizar rutas relativas engorrosas como `../../../components/Boton`.
- **`package.json`**: Declara las dependencias (`next`, `react`, `react-dom`) y los scripts estándar de ciclo de vida:
  - `npm run dev`: Inicia el servidor de desarrollo local con compilación incremental ultrarrápida impulsada por Turbopack.
  - `npm run build`: Genera la versión compilada y optimizada para producción.
  - `npm run start`: Arranca el servidor de producción con la versión previamente compilada.
  - `npm run lint`: Ejecuta las reglas de verificación de código con ESLint.

---

## 2. Los Archivos Especiales de Convención en `app/`

Dentro de cualquier carpeta del directorio `app/`, Next.js reserva un conjunto específico de nombres de archivo para resolver diferentes responsabilidades de la interfaz de usuario:

| Nombre de Archivo | Extensión | Rol Arquitectónico |
| :--- | :--- | :--- |
| **`page`** | `.tsx`, `.jsx` | **Obligatorio para exponer una ruta pública.** Contiene el contenido visual propio de la URL. |
| **`layout`** | `.tsx`, `.jsx` | **UI compartida.** Envuelve a las páginas y layouts hijos; no se re-monta al navegar. |
| **`loading`** | `.tsx`, `.jsx` | **Estado de carga.** Despliega una UI de espera instantánea basada en React Suspense. |
| **`error`** | `.tsx`, `.jsx` | **Manejo de excepciones.** Boundary de React que captura errores en tiempo de ejecución. **Debe ser Client Component (`'use client'`).** |
| **`not-found`** | `.tsx`, `.jsx` | **Pantalla 404.** Se despliega cuando una ruta no existe o se invoca la función `notFound()`. |
| **`route`** | `.ts`, `.js` | **Endpoint de API HTTP.** Permite implementar verbos REST (`GET`, `POST`, `PUT`, `DELETE`). |
| **`template`** | `.tsx`, `.jsx` | **Layout re-montable.** Similar a `layout`, pero crea una instancia nueva en cada transición. |

---

## 3. Jerarquía de Renderizado: El Modelo de Anidamiento

Uno de los aspectos más elegantes de la arquitectura del App Router es cómo Next.js combina los archivos especiales de una misma carpeta. El framework los compone recursivamente siguiendo un orden estricto de **límites anidados (*nested boundaries*)**:

<img src="/img/computacion-3/nextjs-special-files-hierarchy.svg" alt="Jerarquía de composición y anidamiento de archivos especiales en el App Router" width="100%" />

### Explicación de la Composición Visual

Imagina una muñeca rusa (*matrioshka*): cada archivo especial envuelve de manera protectora al siguiente:

1. **`<Layout>` (`layout.tsx`)**: Constituye el contenedor exterior. Almacena la barra de navegación, el menú lateral y el pie de página. Persiste durante la navegación.
2. **`<Template>` (`template.tsx`)**: Opcional. Si existe, se ubica inmediatamente dentro del Layout y se reinicializa en cada navegación (ideal para animaciones de entrada o registro de analíticas por página).
3. **`<ErrorBoundary>` (`error.tsx`)**: Si ocurre una excepción no controlada en la página o en la obtención de datos, este límite la intercepta y muestra una interfaz de recuperación con un botón de reintento (`reset()`), impidiendo que toda la aplicación se caiga.
4. **`<Suspense>` (`loading.tsx`)**: Envuelve la página mientras los Server Components asíncronos completan sus operaciones de `await`. Mientras los datos llegan del servidor, el usuario visualiza de forma inmediata un *skeleton* o indicador de carga.
5. **`<NotFoundBoundary>` (`not-found.tsx`)**: Captura las invocaciones a la función `notFound()` dentro del segmento.
6. **`<Page />` (`page.tsx`)**: En el centro de toda la jerarquía se ubica el componente de la página, el cual provee el contenido único que cambia al navegar.

---

## 4. Convenciones Avanzadas de Organización de Carpetas

Para mantener una base de código limpia en proyectos de gran tamaño, Next.js ofrece dos patrones de organización basados en prefijos de carpetas:

### A. Carpetas Privadas (Prefijo con Guion Bajo: `_folder`)

Si deseas crear una carpeta para almacenar componentes internos, librerías auxiliares o estilos sin que Next.js la considere parte del árbol de rutas de la URL, puedes anteponer un guion bajo a su nombre:

```plaintext
app/
├── cursos/
│   ├── _components/       <-- Carpeta privada: no genera ruta /cursos/_components
│   │   ├── CourseCard.tsx
│   │   └── FilterBar.tsx
│   ├── page.tsx           <-- Responde a /cursos
│   └── layout.tsx
```

### B. Grupos de Rutas (Paréntesis: `(nombre)`)

Los **Route Groups** permiten organizar rutas en módulos lógicos o aplicar layouts completamente distintos a diferentes secciones de la aplicación **sin alterar la estructura de la URL pública**:

```plaintext
app/
├── (marketing)/
│   ├── layout.tsx         <-- Layout con navbar público comercial
│   ├── about/
│   │   └── page.tsx       <-- Responde a /about (ignora el prefijo marketing)
│   └── contact/
│       └── page.tsx       <-- Responde a /contact
└── (dashboard)/
    ├── layout.tsx         <-- Layout con sidebar de administración y barra de usuario
    └── admin/
        └── page.tsx       <-- Responde a /admin (ignora el prefijo dashboard)
```

:::tip[Utilidad de los Route Groups]
Los grupos de rutas son especialmente útiles para separar la experiencia pública (landing page, registro, términos de servicio) de la experiencia autenticada (panel de control, configuración, analíticas), permitiendo que cada entorno tenga su propio layout independiente sin duplicar código.
:::

---

## 5. Layouts Anidados y Páginas en Acción

Para comprender cómo los layouts y las páginas se integran en una aplicación real, consideremos un catálogo formativo donde coexisten un layout global y un layout de sección:

<img src="/img/computacion-3/nextjs-nested-layouts.svg" alt="Composición de Layouts Anidados y Páginas en el App Router" width="100%" />

### Principios Fundamentales de los Layouts

1. **Persistencia de Estado**: Al navegar entre `/cursos/react` y `/cursos/nextjs`, el layout raíz y el layout de cursos **permanecen montados**. Si el usuario tiene un campo de búsqueda o un menú colapsable en el layout, su estado no se pierde.
2. **Recepción de `children`**: Todo layout recibe una propiedad obligatoria `children: React.ReactNode`, que actúa como el punto de inserción para las páginas o sub-layouts descendientes.
3. **Parámetros de Ruta Asíncronos (Next.js 15+)**: En páginas dinámicas (`[slug]/page.tsx`), la propiedad `params` se entrega como una Promesa:

```tsx title="app/cursos/[slug]/page.tsx" showLineNumbers
interface PageProps {
  params: Promise<{ slug: string }>;
}

export default async function CursoDetalle({ params }: PageProps) {
  // En Next.js 15+, los parámetros de ruta dinámicos se resuelven con await
  const { slug } = await params;

  return (
    <article className="p-6">
      <h1 className="text-3xl font-bold">Módulo: {slug}</h1>
      <p className="mt-2 text-slate-600">Detalle del curso renderizado en el servidor.</p>
    </article>
  );
}
```

---

## 6. Configuración de Metadata para SEO

El App Router simplifica la gestión de metadatos de optimización en motores de búsqueda (SEO) y tarjetas de redes sociales (Open Graph) mediante una API unificada.

### A. Metadata Estática y Plantillas de Título

En layouts o páginas estáticas, puedes exportar una constante `metadata` de tipo `Metadata`:

```tsx title="app/layout.tsx" showLineNumbers
import type { Metadata } from 'next';

export const metadata: Metadata = {
  // title.template permite que las páginas hijas definan solo su nombre
  title: {
    template: '%s | CompuNet Academy',
    default: 'CompuNet Academy',
  },
  description: 'Plataforma de desarrollo web moderno de la Universidad Icesi',
};
```

Si una página hija define `title: 'Next.js'`, el título final desplegado en la pestaña del navegador será automáticamente:
```
Next.js | CompuNet Academy
```

### B. Metadata Dinámica con `generateMetadata`

Cuando los títulos o descripciones dependen de parámetros de ruta o consultas a bases de datos, se exporta la función asíncrona `generateMetadata`:

```tsx title="app/cursos/[slug]/page.tsx" showLineNumbers
import type { Metadata } from 'next';

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const curso = await obtenerCurso(slug);

  return {
    title: curso.titulo,
    description: curso.resumen,
  };
}
```

---

## 7. Navegación del Lado del Cliente: `<Link>`, `usePathname` y `useRouter`

En aplicaciones creadas con Next.js, la navegación entre rutas se gestiona mediante componentes optimizados para evitar la recarga física del navegador:

<img src="/img/computacion-3/nextjs-link-navigation.svg" alt="Comparación entre etiqueta de ancla tradicional y componente Link de Next.js" width="100%" />

### 1. El Componente `<Link>`
- Reemplaza la etiqueta HTML estándar `<a>`.
- Realiza una transición suave del lado del cliente (SPA) preservando el estado de la aplicación.
- **Prefetching Automático**: En producción, precarga silenciosamente en segundo plano el código y los datos de cualquier enlace visible en la pantalla (*in viewport*).

```tsx title="app/components/Navbar.tsx" showLineNumbers
import Link from 'next/link';

export function Navbar() {
  return (
    <nav className="flex space-x-4">
      <Link href="/" className="hover:underline">Inicio</Link>
      <Link href="/cursos" className="hover:underline">Cursos</Link>
    </nav>
  );
}
```

### 2. Detección de Rutas Activas con `usePathname()`
Para aplicar estilos visuales al enlace que coincide con la URL actual, se utiliza el hook `usePathname()` en un **Client Component**:

```tsx title="app/components/NavLink.tsx" showLineNumbers
'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';

export function NavLink({ href, label }: { href: string; label: string }) {
  const pathname = usePathname();
  const isActive = pathname === href;

  return (
    <Link
      href={href}
      className={`px-3 py-2 rounded-lg text-sm font-medium ${
        isActive ? 'bg-sky-600 text-white' : 'text-slate-600 hover:bg-slate-100'
      }`}
    >
      {label}
    </Link>
  );
}
```

### 3. Navegación Programática con `useRouter()`
Cuando la redirección debe ejecutarse como consecuencia de una acción del usuario (como hacer clic en un botón tras completar una validación):

```tsx title="app/components/LoginButton.tsx" showLineNumbers
'use client';

import { useRouter } from 'next/navigation';

export function LoginButton() {
  const router = useRouter();

  const handleLogin = () => {
    // Redirección imperativa del lado del cliente
    router.push('/dashboard');
  };

  return (
    <button onClick={handleLogin} className="btn-primary">
      Iniciar Sesión
    </button>
  );
}
```

---

## Cuestionario de Autoevaluación

<Quiz id="compu3-s9-04-architecture-quiz">
  <Question title="¿Cuál es el único archivo especial obligatorio dentro de una carpeta del App Router para que dicha carpeta sea accesible como una ruta pública?">
    <Option>layout.tsx</Option>
    <Option correct>page.tsx</Option>
    <Option>loading.tsx</Option>
    <Option>route.ts</Option>
  </Question>

  <Question title="¿Por qué el archivo especial 'error.tsx' debe incluir obligatoriamente la directiva 'use client' en su cabecera?">
    <Option>Porque de lo contrario no puede conectarse con la base de datos de PostgreSQL.</Option>
    <Option correct>Porque los Error Boundaries de React requieren capturar excepciones en el navegador y utilizar métodos del ciclo de vida interactivo para recuperarse.</Option>
    <Option>Porque Next.js exige que todos los archivos con nombres que empiecen por vocal sean Client Components.</Option>
    <Option>Para permitir que el compilador Turbopack envíe el reporte de error a la consola de Linux.</Option>
  </Question>

  <Question title="¿Qué utilidad tiene la configuración de alias de importación '@/*' en el archivo tsconfig.json?">
    <Option>Oculta los nombres reales de los archivos en el código compilado para evitar ingeniería inversa.</Option>
    <Option correct>Permite importar módulos y componentes referenciando la raíz del proyecto (por ejemplo '@/components/Boton') evitando rutas relativas complejas como '../../components/Boton'.</Option>
    <Option>Indica a Node.js que ejecute el código utilizando subprocesos paralelos en la CPU.</Option>
    <Option>Habilita la compresión gzip para todos los archivos dentro del directorio public/.</Option>
  </Question>

  <Question title="Si se guarda una imagen en la ruta 'public/images/logo.png', ¿cuál es la URL pública mediante la cual el navegador puede consumirla?">
    <Option>http://localhost:3000/public/images/logo.png</Option>
    <Option correct>http://localhost:3000/images/logo.png (el contenido de public/ se sirve directamente en la raíz del dominio).</Option>
    <Option>http://localhost:3000/static/assets/logo.png</Option>
    <Option>http://localhost:3000/app/public/logo.png</Option>
  </Question>

  <Question title="En la jerarquía de renderizado de Next.js, ¿qué componente envuelve directamente al archivo page.tsx para manejar estados de carga asíncronos?">
    <Option>Un componente custom hook llamado usePageLoader.</Option>
    <Option correct>Un límite de React Suspense configurado automáticamente con el componente provisto en loading.tsx como fallback.</Option>
    <Option>Una etiqueta &lt;progress&gt; nativa inyectada en el DOM de HTML5.</Option>
    <Option>El archivo next.config.ts mediante una propiedad de retardo de red.</Option>
  </Question>

  <Question title="¿Cuál es la diferencia fundamental entre 'layout.tsx' y 'template.tsx'?">
    <Option>layout.tsx solo funciona con código JavaScript puro, mientras que template.tsx requiere TypeScript.</Option>
    <Option correct>layout.tsx persiste su montaje y estado al navegar entre rutas hijas, mientras que template.tsx crea una instancia nueva y se re-monta en cada cambio de ruta.</Option>
    <Option>template.tsx no puede contener código JSX ni estilos CSS.</Option>
    <Option>layout.tsx se ejecuta exclusivamente en el navegador y template.tsx en el servidor.</Option>
  </Question>

  <Question title="¿Para qué se utiliza el prefijo de guion bajo en el nombre de una carpeta (por ejemplo app/cursos/_components/)?">
    <Option>Para indicar que la carpeta contiene código confidencial protegido por contraseñas de administrador.</Option>
    <Option correct>Para declarar una carpeta privada que es excluida explícitamente del sistema de enrutamiento y no genera URLs públicas.</Option>
    <Option>Para forzar a Next.js a compilar los componentes de esa carpeta en modo WebAssembly.</Option>
    <Option>Para ordenar alfabéticamente las carpetas en el explorador de archivos del sistema operativo.</Option>
  </Question>

  <Question title="Si defines la estructura 'app/(marketing)/about/page.tsx', ¿cuál será la URL final resultante en el navegador?">
    <Option>/marketing/about</Option>
    <Option correct>/about (los nombres de carpetas entre paréntesis son Route Groups y se omiten de la URL final).</Option>
    <Option>/(marketing)/about</Option>
    <Option>/app/marketing/about</Option>
  </Question>

  <Question title="¿Qué sucede si dentro de la misma carpeta se definen simultáneamente un archivo 'page.tsx' y un archivo 'route.ts'?">
    <Option>Next.js combina automáticamente ambos archivos en una sola función controladora.</Option>
    <Option correct>Se produce un conflicto de rutas y Next.js arroja un error de compilación, ya que ambos compiten por responder a la misma URL.</Option>
    <Option>El archivo page.tsx se ejecuta en peticiones GET y route.ts en peticiones POST.</Option>
    <Option>El servidor redirige de forma permanente hacia el archivo not-found.tsx.</Option>
  </Question>

  <Question title="¿Cuál es la función del archivo 'next.config.ts' en la raíz de una aplicación Next.js?">
    <Option>Almacenar las contraseñas de las cuentas de usuario de la base de datos.</Option>
    <Option correct>Proveer la configuración personalizada del framework, tales como dominios permitidos para optimización de imágenes, redirecciones y flags del compilador.</Option>
    <Option>Definir las rutas de las tablas en el motor de base de datos relacional.</Option>
    <Option>Sincronizar el repositorio de Git con la cuenta de Vercel en la nube.</Option>
  </Question>
</Quiz>
