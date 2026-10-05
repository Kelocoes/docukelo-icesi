---
sidebar_position: 2
---

# App Router vs. Pages Router

El sistema de enrutamiento es el corazón de cualquier aplicación web moderna. A lo largo de su historia, Next.js ha evolucionado significativamente en su enfoque para mapear archivos a rutas accesibles en el navegador. La transición desde el tradicional **Pages Router** (introducido en las primeras versiones de Next.js) hacia el moderno **App Router** (introducido a partir de Next.js 13 y consolidado como el estándar predeterminado de la industria) representa uno de los cambios de paradigma más importantes en el ecosistema de React.

En este documento examinaremos las diferencias conceptuales y arquitectónicas entre ambos modelos, analizaremos cómo se organizan los archivos y comprenderemos la transición en los patrones de obtención de datos (*data fetching*).

---

## 1. Evolución Histórica de los Enrutadores

Durante más de seis años, Next.js operó bajo la convención de la carpeta `pages/`. Este modelo democratizó el enrutamiento declarativo en React: bastaba con crear un archivo como `pages/about.tsx` para que el framework generara automáticamente la ruta `/about`.

A pesar de su sencillez inicial, a medida que los proyectos de gran escala crecían, el Pages Router evidenció limitaciones estructurales:
- **Acoplamiento Rígido entre Archivos y Rutas Públicas**: Cualquier archivo colocado dentro de `pages/` (incluso componentes auxiliares o utilitarios) era tratado como una ruta pública, lo que obligaba a aislar los componentes en directorios externos como `src/components/`.
- **Dificultad para Layouts Anidados Complejos**: Mantener barras de navegación, menús laterales o estados persistentes requería sobrecargar el archivo `pages/_app.tsx` o implementar patrones poco intuitivos mediante funciones personalizadas `getLayout`.
- **Data Fetching Fragmentado**: La obtención de datos dependía de funciones especiales a nivel de página (`getServerSideProps`, `getStaticProps`), las cuales no podían ejecutarse dentro de componentes hijos individuales.

Para solucionar estas limitaciones y adoptar la arquitectura de **React Server Components (RSC)**, el equipo de Next.js diseñó el **App Router**, alojado en el directorio `app/`.

---

## 2. Comparación Estructural: De Archivos a URLs

La diferencia más visible entre ambos enrutadores radica en cómo se resuelven las rutas a partir de la estructura del árbol de archivos:

<img src="/img/computacion-3/nextjs-app-vs-pages-router.svg" alt="Comparación de estructura de directorios entre Pages Router y App Router" width="100%" />

### Desglose Arquitectónico del Diagrama

#### Panel Izquierdo: Pages Router (`pages/`)
- **Regla Fundamental**: *Cada archivo JavaScript o TypeScript colocado en el directorio se convierte en una ruta accesible.*
- `pages/index.tsx` responde a la ruta `/`.
- `pages/about.tsx` responde directamente a `/about`.
- `pages/blog/index.tsx` atiende `/blog`.
- `pages/blog/[slug].tsx` captura parámetros dinámicos en la URL (`/blog/:slug`).
- `pages/_app.tsx` envuelve a toda la aplicación para inyectar estilos globales y proveedores de estado, pero se reevalúa en cada transición de página.

#### Panel Derecho: App Router (`app/`)
- **Regla Fundamental**: *Las carpetas definen los segmentos de la ruta URL, y únicamente el archivo especial `page.tsx` expone dicha ruta al público.*
- `app/layout.tsx` define la carcasa visual raíz (`<html>` y `<body>`) compartida por todas las rutas.
- `app/page.tsx` define la interfaz de la ruta raíz `/`.
- `app/about/page.tsx` define la ruta `/about`.
- `app/blog/page.tsx` define la ruta `/blog`.
- `app/blog/[slug]/page.tsx` atiende los segmentos dinámicos de blog.
- **Colocación Segura (*Colocation*)**: A diferencia de `pages/`, en el App Router puedes almacenar componentes auxiliares (`button.tsx`), estilos (`styles.module.css`), pruebas unitarias (`page.test.tsx`) o funciones (`utils.ts`) dentro de la misma carpeta `about/` sin temor a exponerlos accidentalmente como endpoints públicos.

---

## 3. Comparación de Data Fetching

El salto hacia el App Router no solo modificó la ubicación de los archivos, sino que transformó radicalmente el modelo mental sobre cómo viajan los datos desde el servidor hasta los componentes:

<img src="/img/computacion-3/nextjs-data-fetching-evolution.svg" alt="Evolución de Data Fetching: Monolítico en Pages Router vs Concurrente en App Router" width="100%" />

### Análisis de la Evolución de Obtención de Datos

1. **El Enfoque Monolítico de Pages Router (Panel Izquierdo)**:
   - Toda la responsabilidad de consultar bases de datos o APIs recaía exclusivamente en la función de nivel superior `getServerSideProps` de la página.
   - Si una página requería datos de usuario, listado de cursos y métricas estadísticas, debía agrupar todas las consultas en un solo bloque bloqueante. Si una de las consultas tardaba 2 segundos, **la página entera se quedaba congelada** sin mostrar nada al usuario.
   - Para que un componente ubicado en el fondo del árbol (como `UserCard`) recibiera sus datos, era obligatorio transportarlos manualmente a través de componentes intermedios (`MainSection`), un problema de acoplamiento conocido como **Prop Drilling**.
2. **El Enfoque Co-ubicado y Concurrente de App Router (Panel Derecho)**:
   - La página (`page.tsx`) ya no actúa como un intermediario monolítico de datos, sino como un **orquestador visual ligero**.
   - Cada Server Component (`UserHeader`, `CourseGrid`, `StatsWidget`) es libre de ejecutar su propio `async/await` o consultar la base de datos de manera autónoma en el servidor (*co-location*).
   - Gracias al soporte de **React Suspense y Streaming**, si un widget de analíticas tarda más tiempo en responder, se envuelve en `<Suspense fallback={<Skeleton />}>`: la página y los demás componentes se envían inmediatamente al navegador y el widget pesado se transmite de forma progresiva sin bloquear la vista.

---

### Código Comparativo de Data Fetching

#### En Pages Router (Enfoque Clásico)

```tsx title="pages/cursos/[slug].tsx" showLineNumbers
import { GetServerSideProps } from 'next';

interface CursoProps {
  curso: { id: string; titulo: string; descripcion: string };
}

// 1. La función de servidor debe exportarse por separado
export const getServerSideProps: GetServerSideProps = async (context) => {
  const { slug } = context.params!;
  const res = await fetch(`https://api.icesi.edu.co/cursos/${slug}`);
  const curso = await res.json();

  // 2. Se inyecta al componente a través de props obligatorias
  return { props: { curso } };
};

// 3. El componente de React recibe las props ya resueltas
export default function CursoDetalle({ curso }: CursoProps) {
  return (
    <article>
      <h1>{curso.titulo}</h1>
      <p>{curso.descripcion}</p>
    </article>
  );
}
```

### En App Router (Enfoque Moderno con Server Components)

En el App Router, el componente de la página es por defecto un **Server Component**. Puede ser declarado como una función asíncrona (`async`), permitiendo ejecutar `await` de forma directa dentro de su propio cuerpo:

```tsx title="app/cursos/[slug]/page.tsx" showLineNumbers
interface PageProps {
  params: Promise<{ slug: string }>;
}

// 1. El componente es una función asíncrona directa en el servidor
export default async function CursoDetalle({ params }: PageProps) {
  // En Next.js 15+, los parámetros de ruta dinámicos se resuelven como una Promesa
  const { slug } = await params;
  
  // 2. Data fetching directo en el cuerpo del componente
  const res = await fetch(`https://api.icesi.edu.co/cursos/${slug}`);
  const curso = await res.json();

  return (
    <article>
      <h1>{curso.titulo}</h1>
      <p>{curso.descripcion}</p>
    </article>
  );
}
```

:::info[Simplificación Mental]
Ya no es necesario memorizar las diferencias entre `getServerSideProps`, `getStaticProps` y `getInitialProps`. En el App Router, simplemente se utiliza la función estándar `fetch()` de JavaScript con opciones de configuración de caché (`cache: 'force-cache'`, `cache: 'no-store'` o `{ next: { revalidate: 60 } }`).
:::

---

## 4. Matriz Comparativa Completa

| Característica | Pages Router (`pages/`) | App Router (`app/`) |
| :--- | :--- | :--- |
| **Directorio Raíz** | `pages/` | `app/` (o `src/app/`) |
| **Paradigma de Componentes** | Client Components por defecto con hidratación completa. | **React Server Components (RSC)** por defecto, Client Components explícitos. |
| **Definición de Rutas** | Basada en nombres de archivos (`perfil.tsx` &rarr; `/perfil`). | Basada en carpetas con convención `page.tsx` (`perfil/page.tsx`). |
| **Colocación de Archivos** | Difícil (cualquier archivo en `pages/` genera ruta pública). | Nativa (puedes guardar componentes y utilidades dentro de cada carpeta). |
| **Layouts Anidados** | Complejos; requieren `getLayout` o un `_app.tsx` monolítico. | Nativos y componibles mediante archivos `layout.tsx` por segmento. |
| **Preservación de Estado** | Las transiciones de página suelen re-montar el árbol completo. | Los layouts compartidos preservan su estado intacto entre navegaciones. |
| **Manejo de Errores y Carga** | Manual mediante hooks de estado (`isLoading`, `error`). | Declarativo mediante los archivos especiales `loading.tsx` y `error.tsx`. |
| **Definición de Metadatos (SEO)** | Etiqueta `<Head>` importada desde `next/head`. | Objeto estático `metadata` o función asíncrona `generateMetadata`. |
| **Rutas de API** | Archivos en `pages/api/*.ts` con manejadores `(req, res)`. | Archivos `route.ts` basados en estándares Web Fetch API (`GET`, `POST`). |

---

## 5. ¿Cuál Enrutador Elegir en Nuevos Proyectos?

El equipo de desarrollo de Vercel y la comunidad de React consideran al **App Router** como la opción recomendada y preferente para cualquier desarrollo nuevo. Todas las innovaciones recientes de React —tales como Server Components, Suspense por streaming, Server Actions y la compilación optimizada con Turbopack— están diseñadas y optimizadas de manera prioritaria para la arquitectura del App Router.

El Pages Router continúa recibiendo mantenimiento por razones de retrocompatibilidad en aplicaciones heredadas (*legacy*), pero no recibe nuevas características arquitectónicas.

---

## Cuestionario de Autoevaluación

<Quiz id="compu3-s9-02-routers-quiz">
  <Question title="¿Cuál es la regla fundamental que define una ruta pública en el App Router?">
    <Option>Cualquier archivo .tsx ubicado dentro de la carpeta app/ genera automáticamente una ruta accesible.</Option>
    <Option correct>Las carpetas determinan los segmentos de la URL y únicamente la presencia del archivo especial page.tsx expone la ruta al público.</Option>
    <Option>Es obligatorio declarar cada ruta en un archivo de configuración routes.json en la raíz del proyecto.</Option>
    <Option>Las rutas solo se generan si el componente se exporta con la directiva 'use route'.</Option>
  </Question>

  <Question title="¿Qué ventaja ofrece la colocación de archivos (colocation) en el App Router frente al Pages Router?">
    <Option>Reduce el uso de memoria RAM en el servidor de base de datos PostgreSQL.</Option>
    <Option correct>Permite almacenar componentes auxiliares, estilos y pruebas en la misma carpeta del segmento sin que se expongan como URLs públicas.</Option>
    <Option>Inhabilita automáticamente la necesidad de compilar TypeScript en entornos locales.</Option>
    <Option>Permite crear rutas públicas que no requieran nombres de archivo.</Option>
  </Question>

  <Question title="¿Qué sucede con los componentes de un layout.tsx en el App Router cuando el usuario navega entre rutas hijas que lo comparten?">
    <Option>El layout se destruye y se vuelve a montar completamente desde cero perdiendo su estado.</Option>
    <Option correct>El layout persiste su montaje y mantiene su estado intacto, actualizando únicamente el contenido del segmento hijo (page.tsx).</Option>
    <Option>El navegador ejecuta una recarga forzada equivalente a presionar F5.</Option>
    <Option>Next.js redirige automáticamente al usuario hacia el archivo error.tsx.</Option>
  </Question>

  <Question title="¿Cómo se obtiene información en el servidor dentro de un Server Component en el App Router?">
    <Option>Exportando obligatoriamente la función getServerSideProps en el mismo archivo.</Option>
    <Option correct>Declarando el componente como una función asíncrona (async) y ejecutando consultas o peticiones fetch directamente en su cuerpo.</Option>
    <Option>Inyectando un hook useServerData() exclusivo para navegadores Chromium.</Option>
    <Option>Enviando un mensaje sincrónico a través del protocolo WebSockets.</Option>
  </Question>

  <Question title="En Next.js 15+, ¿cómo se accede a los parámetros de una ruta dinámica (por ejemplo [slug]) en el App Router?">
    <Option>A través de la variable global process.env.SLUG.</Option>
    <Option>Leyendo directamente la propiedad estática context.query.slug como un string sincrónico.</Option>
    <Option correct>Los parámetros dinámicos se reciben en las props como una Promesa (Promise) y deben resolverse mediante await params.</Option>
    <Option>Mediante el decorador @Param() importado desde el paquete @nestjs/common.</Option>
  </Question>

  <Question title="¿Cuál era una de las limitaciones más notorias del archivo pages/_app.tsx en el Pages Router?">
    <Option>No permitía el uso de hojas de estilo globales ni fuentes web.</Option>
    <Option correct>Funcionaba como un contenedor monolítico que se reevaluaba con cada cambio de ruta, dificultando layouts anidados independientes.</Option>
    <Option>Impedía que la aplicación pudiera ejecutarse en servidores Linux.</Option>
    <Option>Solo permitía un máximo de tres rutas hijas en toda la aplicación.</Option>
  </Question>

  <Question title="¿Qué archivo especial sustituye a las APIs tradicionales de pages/api/*.ts en el App Router?">
    <Option>controller.ts</Option>
    <Option>service.ts</Option>
    <Option correct>route.ts</Option>
    <Option>handler.ts</Option>
  </Question>

  <Question title="¿Qué mecanismo declarativo ofrece el App Router para desplegar una pantalla de carga mientras se resuelven los datos de una página?">
    <Option>Exportar una variable const fallback = true dentro del archivo page.tsx.</Option>
    <Option correct>Crear un archivo loading.tsx en el segmento, el cual Next.js envuelve automáticamente en un límite de React Suspense.</Option>
    <Option>Instalar la librería redux-thunk para capturar los estados pendientes de red.</Option>
    <Option>Configurar un retardo artificial mediante la función setTimeout en el cliente.</Option>
  </Question>

  <Question title="¿Cómo se define la metadata para motores de búsqueda (SEO) en una página del App Router?">
    <Option>Utilizando exclusivamente la etiqueta &lt;Head&gt; importada desde 'next/head'.</Option>
    <Option correct>Exportando un objeto estático 'metadata' de tipo Metadata o una función asíncrona 'generateMetadata'.</Option>
    <Option>Modificando directamente el archivo index.html ubicado en la carpeta public/.</Option>
    <Option>Inyectando etiquetas meta mediante document.createElement('meta') en un useEffect.</Option>
  </Question>

  <Question title="¿Es posible mantener componentes de Pages Router y App Router conviviendo en el mismo repositorio durante una migración gradual?">
    <Option>No, Next.js arroja un error fatal de compilación si detecta simultáneamente las carpetas app/ y pages/.</Option>
    <Option correct>Sí, Next.js soporta la coexistencia incremental de ambas carpetas; en caso de conflicto sobre la misma ruta, el App Router tiene prioridad.</Option>
    <Option>Solo es posible si se utilizan dos puertos HTTP distintos en el servidor local.</Option>
    <Option>Únicamente si se deshabilita TypeScript en el archivo next.config.ts.</Option>
  </Question>
</Quiz>
