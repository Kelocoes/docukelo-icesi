---
sidebar_position: 4
---

import ThemedImage from '@theme/ThemedImage';
import useBaseUrl from '@docusaurus/useBaseUrl';

# Navegación por eventos

Navegar en una aplicación web consiste en cambiar de ruta y actualizar la vista sin recargar la página completa en el navegador. En Next.js (App Router), la navegación puede iniciarse de forma declarativa desde el cliente o de forma programática tanto en componentes cliente como en el servidor. En la [Semana 9](../semana-9/04-arquitectura-estructura-proyecto.md) vimos la estructura básica de carpetas y rutas; ahora profundizaremos en cómo activar transiciones mediante eventos e interacciones del usuario.

---

## Formas de navegación

Next.js ofrece distintas herramientas para cambiar de ruta o modificar la URL según el contexto de ejecución:

| Mecanismo | Entorno | Cuándo usarlo | Ejemplo |
| :--- | :--- | :--- | :--- |
| **`<Link>`** | Cliente y Servidor | Enlaces estáticos y menús visibles en pantalla. | `<Link href="/productos">Catálogo</Link>` |
| **`router.push()`** | Cliente (`'use client'`) | Navegar tras una acción o evento del usuario. | `router.push('/productos')` |
| **`router.replace()`** | Cliente (`'use client'`) | Redirigir sin guardar la ruta actual en el historial. | `router.replace('/dashboard')` |
| **`router.back()`** | Cliente (`'use client'`) | Retroceder a la página anterior en el historial. | `router.back()` |
| **`router.forward()`** | Cliente (`'use client'`) | Avanzar a la página siguiente en el historial. | `router.forward()` |
| **`router.refresh()`** | Cliente (`'use client'`) | Refrescar datos del servidor sin perder estado local. | `router.refresh()` |
| **`redirect()`** | Servidor | Redireccionar antes de renderizar la página o en una acción. | `redirect('/login')` |
| **`permanentRedirect()`** | Servidor | Redireccionar de forma permanente (código HTTP 308). | `permanentRedirect('/nuevo-catalogo')` |
| **`notFound()`** | Servidor | Mostrar la vista 404 cuando un registro no existe. | `notFound()` |
| **`pushState / replaceState`** | Cliente (`'use client'`) | Cambiar la URL sin navegar ni pedir la página al servidor. | `window.history.pushState(null, '', '?orden=asc')` |

---

## El componente Link

El componente `<Link>` es la forma declarativa estándar de navegación en Next.js. Renderiza una etiqueta `<a>` accesible y optimiza la carga precargando rutas en segundo plano.

### Uso básico y rutas dinámicas

Para rutas fijas o dinámicas con cadenas de plantilla:

```tsx title="components/MenuNavegacion.tsx"
import Link from 'next/link';

export function MenuNavegacion({ productoId }: { productoId: string }) {
  return (
    <nav className="flex gap-4">
      <Link href="/productos">Todos los productos</Link>
      <Link href={`/productos/${productoId}`}>Detalle del producto</Link>
    </nav>
  );
}
```

### Propiedades principales de Link

- **`replace`**: si es `true`, reemplaza la URL actual en el historial en vez de añadir una nueva entrada (`replace={true}`).
- **`scroll`**: controla si la pantalla sube al inicio tras navegar. Su valor por defecto es `true`. Con `scroll={false}` la posición vertical se conserva.
- **`prefetch`**: controla la precarga en segundo plano al entrar en el viewport. En producción es `true` por defecto.

### Enlace activo con usePathname

Para resaltar el enlace de la página en la que se encuentra el usuario, se utiliza el hook `usePathname`:

```tsx title="components/NavLink.tsx"
'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';

export function NavLink({ href, children }: { href: string; children: React.ReactNode }) {
  const pathname = usePathname();
  const isActive = pathname === href;

  return (
    <Link href={href} className={isActive ? 'font-bold text-blue-600' : 'text-gray-600'}>
      {children}
    </Link>
  );
}
```

---

## El hook useRouter

El hook `useRouter` permite navegar de forma programática en respuesta a eventos de JavaScript.

Requiere la directiva `'use client'` porque usa el historial del navegador, que solo existe en el cliente.

### Métodos disponibles

- **`router.push(href, options?)`**: navega a la ruta indicada y añade una entrada a la pila del historial.
- **`router.replace(href, options?)`**: navega a la ruta indicada reemplazando la entrada actual del historial.
- **`router.back()`**: retrocede una posición en el historial de navegación.
- **`router.forward()`**: avanza una posición en el historial de navegación.
- **`router.refresh()`**: solicita de nuevo los Server Components al servidor sin reiniciar el estado local del cliente.
- **`router.prefetch(href)`**: precarga manualmente el código y los datos de una ruta en segundo plano.

### Navegación con onClick

El caso más directo ocurre al hacer clic sobre un botón o tarjeta:

```tsx title="components/BotonVerProducto.tsx"
'use client';

import { useRouter } from 'next/navigation';

export function BotonVerProducto({ id }: { id: string }) {
  const router = useRouter();

  return (
    <button type="button" onClick={() => router.push(`/productos/${id}`)}>
      Ver producto
    </button>
  );
}
```

### Navegación tras enviar un formulario

En un formulario, la navegación debe ejecutarse solo cuando la operación asíncrona concluye con éxito:

```tsx title="components/FormularioProducto.tsx" showLineNumbers
'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';

export function FormularioProducto() {
  const router = useRouter();
  const [nombre, setNombre] = useState('');
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    const ok = await guardar({ nombre });
    if (ok) {
      router.push('/productos');
    } else {
      setError('No se pudo guardar el producto.');
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {error && <p className="text-red-600">{error}</p>}
      <input
        type="text"
        value={nombre}
        onChange={(e) => setNombre(e.target.value)}
        placeholder="Nombre del producto"
      />
      <button type="submit">Guardar</button>
    </form>
  );
}

async function guardar(datos: { nombre: string }): Promise<boolean> {
  return datos.nombre.trim().length > 0;
}
```

Explora en la siguiente animación interactiva cómo viaja el guardado entre el Usuario, el Componente cliente y el Router de Next.js. Activa el interruptor inferior para simular un guardado fallido:

<iframe
  src="/interactive/computacion-3/semana-12/navegacion-por-eventos/index.html"
  title="Secuencia interactiva de navegación por eventos tras envío de formulario"
  style={{ width: '100%', height: 740, border: 0 }}
  loading="lazy"
/>

El flujo anterior demuestra dos caminos:
1. **Éxito**: la promesa resuelve favorablemente, el componente entra en el bloque `if` y ejecuta `router.push('/productos')`. Next.js monta la nueva vista.
2. **Fallo**: la promesa devuelve `false`, entra en el bloque `else`, activa el estado de error y no llama a `router.push()`. El usuario conserva los textos ingresados.

---

## push frente a replace

La diferencia entre `router.push` y `router.replace` radica en cómo gestionan la pila del historial del navegador:

- **`push`**: agrega una nueva URL encima de la pila. El botón "Atrás" regresa a la pantalla previa.
- **`replace`**: sustituye la URL actual por la nueva sin agrandar la pila. El botón "Atrás" salta a la ruta anterior a la sustituida.

<ThemedImage
  alt="Pila del Historial del Navegador: push frente a replace"
  sources={{
    light: useBaseUrl('/img/computacion-3/s12-push-vs-replace-light.svg'),
    dark: useBaseUrl('/img/computacion-3/s12-push-vs-replace-dark.svg'),
  }}
  style={{ width: '100%', maxWidth: 960, margin: '1.5rem auto', display: 'block' }}
/>

El caso típico de `replace` es el inicio de sesión. Una vez autenticado el usuario, redirigir con `replace` evita que al pulsar "Atrás" vuelva al formulario de login:

```tsx title="components/FormularioLogin.tsx" showLineNumbers
'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';

export function FormularioLogin() {
  const router = useRouter();
  const [email, setEmail] = useState('');

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    const ok = await loginSimulado(email);
    if (ok) {
      router.replace('/dashboard');
    }
  };

  return (
    <form onSubmit={handleLogin}>
      <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} />
      <button type="submit">Iniciar sesión</button>
    </form>
  );
}

async function loginSimulado(email: string): Promise<boolean> {
  return email.includes('@');
}
```

---

## Lectura de la URL

Para leer rutas y parámetros, Next.js cuenta con utilidades en el cliente y en el servidor.

### En el cliente

En Client Components se utilizan tres hooks de `next/navigation`:
- **`usePathname()`**: devuelve la ruta actual (por ejemplo, `"/productos"`).
- **`useParams()`**: devuelve un objeto con los segmentos dinámicos de la ruta (por ejemplo, `{ id: '42' }`).
- **`useSearchParams()`**: devuelve una instancia de solo lectura con los parámetros de consulta (por ejemplo, `?categoria=calzado`).

:::note[Suspense y useSearchParams]
Cualquier Client Component que utilice `useSearchParams()` debe estar envuelto dentro de un límite de `<Suspense>` para no desactivar el prerenderizado estático de la página.
:::

Ejemplo de filtro reactivo que actualiza `?categoria=` con `router.push`:

```tsx title="components/FiltroCategoria.tsx" showLineNumbers
'use client';

import { usePathname, useRouter, useSearchParams } from 'next/navigation';

export function FiltroCategoria() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const handleSelect = (categoria: string) => {
    const params = new URLSearchParams(searchParams.toString());
    if (categoria) {
      params.set('categoria', categoria);
    } else {
      params.delete('categoria');
    }
    const query = params.toString();
    router.push(query ? `${pathname}?${query}` : pathname, { scroll: false });
  };

  return (
    <select onChange={(e) => handleSelect(e.target.value)}>
      <option value="">Todas</option>
      <option value="ropa">Ropa</option>
      <option value="calzado">Calzado</option>
    </select>
  );
}
```

### En el servidor

En Next.js 16, las propiedades `params` y `searchParams` que reciben las páginas de servidor son promesas (`Promise`) y deben resolverse con `await`:

```tsx title="app/productos/[id]/page.tsx" showLineNumbers
interface Props {
  params: Promise<{ id: string }>;
  searchParams: Promise<{ categoria?: string }>;
}

export default async function ProductoPage({ params, searchParams }: Props) {
  const { id } = await params;
  const { categoria } = await searchParams;

  return (
    <main>
      <h1>Producto: {id}</h1>
      <p>Categoría activa: {categoria || 'general'}</p>
    </main>
  );
}
```

---

## Navegación en el servidor

En Server Components, Route Handlers y Server Actions no existe el hook `useRouter`. La navegación se gestiona mediante funciones de `next/navigation`:

- **`redirect(url)`**: interrumpe el render y redirige la respuesta HTTP a otra ruta.
- **`permanentRedirect(url)`**: emite una redirección permanente con código de estado HTTP 308.
- **`notFound()`**: cancela el render y muestra el archivo `not-found.tsx` más cercano.

### Ejemplo en Server Component y Server Action

```tsx title="app/dashboard/page.tsx"
import { redirect } from 'next/navigation';

export default async function DashboardPage() {
  const sesion = await verificarSesion();
  if (!sesion) {
    redirect('/login');
  }

  return <h1>Panel privado</h1>;
}

async function verificarSesion() {
  return null;
}
```

En una Server Action tras guardar un formulario:

```tsx title="app/acciones.ts"
'use server';

import { redirect } from 'next/navigation';

export async function crearProducto(formData: FormData) {
  const nombre = formData.get('nombre') as string;
  // Guardar en base de datos...
  redirect('/productos');
}
```

Para un recurso inexistente:

```tsx title="app/productos/[id]/page.tsx"
import { notFound } from 'next/navigation';

export default async function ProductoDetalle({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  if (id === '0' || id === 'inexistente') {
    notFound();
  }

  return <h1>Producto {id}</h1>;
}
```

:::caution[No captures redirecciones en try/catch]
Tanto `redirect()` como `notFound()` lanzan errores internos (`NEXT_REDIRECT` y `NEXT_NOT_FOUND`) para detener la ejecución y transferir el control a Next.js. Si las colocas dentro de un bloque `try/catch` genérico, el bloque atrapará el error e impedirá que la redirección funcione. Si requieres capturar otros errores, llama a `redirect` fuera del `try/catch`.
:::

---

## History API nativa

En Client Components es posible usar directamente los métodos del navegador `window.history.pushState` y `window.history.replaceState`.

Esto permite modificar la URL en la barra de direcciones (por ejemplo, al ordenar una lista o abrir una pestaña secundaria) sin navegar ni volver a pedir la página al servidor. Next.js sincroniza automáticamente estas llamadas con `usePathname` y `useSearchParams`.

```tsx title="components/OrdenLista.tsx" showLineNumbers
'use client';

import { useSearchParams } from 'next/navigation';

export function OrdenLista() {
  const searchParams = useSearchParams();

  const cambiarOrden = (orden: string) => {
    const params = new URLSearchParams(searchParams.toString());
    params.set('orden', orden);
    window.history.pushState(null, '', `?${params.toString()}`);
  };

  return (
    <div className="flex gap-2">
      <button type="button" onClick={() => cambiarOrden('asc')}>Ascendente</button>
      <button type="button" onClick={() => cambiarOrden('desc')}>Descendente</button>
    </div>
  );
}
```

---

## Guía de decisión

Aplica esta regla práctica para elegir el mecanismo adecuado:

- Si el usuario hace clic en un menú o botón visible: usa **`<Link>`**.
- Si la navegación depende de un evento o validación en el cliente: usa **`router.push`**.
- Si completaste un flujo que no debe reabrirse (login o pasarela): usa **`router.replace`**.
- Si rediriges desde el servidor por falta de sesión o permisos: usa **`redirect`**.
- Si el identificador solicitado no existe en la base de datos: usa **`notFound`**.
- Si solo actualizas parámetros en la URL sin recargar vistas: usa **`window.history.pushState`**.

---

## Errores comunes

| Error | Causa | Solución |
| :--- | :--- | :--- |
| **Importar de `next/router`** | Confundir el paquete del Pages Router con el de App Router. | Importar siempre `useRouter` desde `next/navigation`. |
| **Llamar `router.push` durante el render** | Ejecutar la navegación directamente en el cuerpo de la función. | Mover la llamada dentro de un evento (`onClick`, `onSubmit`) o un `useEffect`. |
| **Usar `<a>` para rutas internas** | Utilizar anclas HTML nativas en lugar del componente `<Link>`. | Usar `<Link>` para evitar recargas completas de página. |
| **Olvidar `'use client'` con `useRouter`** | Intentar ejecutar hooks interactivos en un Server Component. | Añadir `'use client';` en la primera línea del archivo. |

---

## Cuestionario de Autoevaluación

<Quiz id="compunet3-s12-navegacion-eventos-quiz">
  <Question title="¿De cuál paquete debe importarse useRouter al trabajar con el App Router de Next.js?">
    <Option>next/router</Option>
    <Option correct>next/navigation</Option>
    <Option>next/link</Option>
    <Option>react-router-dom</Option>
  </Question>

  <Question title="¿Por qué es obligatorio incluir la directiva 'use client' en componentes que utilizan useRouter?">
    <Option>Porque los Server Components solo admiten archivos de estilo CSS.</Option>
    <Option correct>Porque useRouter usa el historial del navegador, que solo existe en el cliente.</Option>
    <Option>Porque permite compilar el proyecto en modo estático sin JavaScript.</Option>
    <Option>Para forzar la renderización de encabezados HTTP especiales.</Option>
  </Question>

  <Question title="¿Cuál es la diferencia principal entre router.push y router.replace?">
    <Option>router.push reinicia el navegador y router.replace borra las cookies.</Option>
    <Option correct>router.push añade una entrada a la pila del historial, mientras que router.replace sustituye la entrada actual.</Option>
    <Option>router.push solo funciona en el servidor y router.replace en el cliente.</Option>
    <Option>router.replace solo admite rutas absolutas externas.</Option>
  </Question>

  <Question title="¿Por qué se recomienda router.replace('/dashboard') tras un inicio de sesión exitoso?">
    <Option>Para reducir el peso del paquete de JavaScript descargado.</Option>
    <Option correct>Para evitar que el usuario vuelva al formulario de login al pulsar el botón 'Atrás' del navegador.</Option>
    <Option>Porque router.push está desaconsejado en pantallas protegidas.</Option>
    <Option>Para obligar al navegador a vaciar la memoria caché de imágenes.</Option>
  </Question>

  <Question title="En Next.js 16, ¿cómo se consumen params y searchParams dentro de una página de servidor?">
    <Option>Leyendo directamente props.params.id de forma síncrona.</Option>
    <Option correct>Resolviendo las promesas con await (por ejemplo, const &#123; id &#125; = await params).</Option>
    <Option>Usando el hook useServerParams() en la cabecera.</Option>
    <Option>Mediante la variable global process.env.PARAMS.</Option>
  </Question>

  <Question title="¿Qué utilidad tiene la propiedad scroll=&#123;false&#125; en Link o useRouter?">
    <Option>Elimina la barra de desplazamiento de toda la ventana del navegador.</Option>
    <Option correct>Conserva la posición vertical de la página sin desplazarse automáticamente al inicio.</Option>
    <Option>Acelera la animación de transición de la vista.</Option>
    <Option>Impide que la página siguiente ejecute peticiones fetch.</Option>
  </Question>

  <Question title="¿Por qué no se debe envolver redirect('/login') dentro de un bloque try/catch genérico?">
    <Option>Porque provoca una fuga de memoria en el servidor Node.js.</Option>
    <Option correct>Porque redirect() lanza un error interno (NEXT_REDIRECT) que el catch atrapará, impidiendo la redirección.</Option>
    <Option>Porque Next.js deshabilita la conexión a la base de datos al detectar try/catch.</Option>
    <Option>Porque TypeScript genera un error de compilación insalvable.</Option>
  </Question>

  <Question title="¿Qué ocurre si se usa una etiqueta HTML nativa &lt;a href='/productos'&gt; en lugar de &lt;Link href='/productos'&gt; para rutas internas?">
    <Option>La aplicación cambia de tema visual automáticamente.</Option>
    <Option correct>El navegador realiza una recarga completa de la página, perdiendo el estado en memoria de React.</Option>
    <Option>Next.js convierte automáticamente la etiqueta &lt;a&gt; en una Server Action.</Option>
    <Option>Se bloquea la navegación por motivos de seguridad CORS.</Option>
  </Question>
</Quiz>
