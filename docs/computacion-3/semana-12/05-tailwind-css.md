---
sidebar_position: 5
description: "Aprende a estilizar interfaces con Tailwind CSS y daisyUI usando clases utilitarias de espaciado, dimensiones y más en Next.js."
---

import ThemedImage from '@theme/ThemedImage';
import useBaseUrl from '@docusaurus/useBaseUrl';

# Tailwind CSS y daisyUI

En las lecciones anteriores consolidamos la arquitectura frontend de nuestra aplicación de rutinas de entrenamiento: estructuramos las capas de Dominio, Infraestructura y Aplicación mediante Clean Architecture, y conectamos la Capa de Presentación con Redux Toolkit para gestionar el estado reactivo global. Sin embargo, una arquitectura robusta también requiere una estrategia de diseño visual escalable, mantenible y predecible.

En esta lección exploraremos los fundamentos de **Tailwind CSS v4** (el motor utilitario más rápido y moderno para la web) y **daisyUI 5** (la librería de componentes semánticos que acelera la construcción de interfaces). Aprenderás a dominar la escala de diseño, construir componentes limpios y accesibles, y diseñar interfaces responsivas aplicando la filosofía *mobile-first*.

---

## 1. Utility-first

El paradigma de Tailwind CSS se denomina **Utility-First** (*utilidades primero*). En lugar de escribir selectores CSS personalizados para cada clase de componente (como en BEM tradicional) o de inyectar estilos imperativos directamente en el DOM, Tailwind proporciona clases atómicas altamente especializadas (por ejemplo, `p-4`, `flex`, `bg-blue-600`, `rounded-xl`) que componen el diseño directamente en el marcado JSX.

Es común que los desarrolladores que recién conocen Tailwind pregunten: *¿acaso usar clases utilitarias no es lo mismo que volver a los estilos en línea (`style={{ ... }}`)?* La respuesta técnica es un rotundo **no**. Existen diferencias arquitectónicas fundamentales entre ambos enfoques:

| Característica | Estilos en Línea (`style={{ ... }}`) | CSS Tradicional / BEM (`.css`) | Utility-First (Tailwind CSS v4) |
| :--- | :--- | :--- | :--- |
| **Escala de Diseño** | Valores arbitrarios dispersos (`padding: 15px`, `18px`). Inconsistencia visual. | Definida manualmente mediante variables CSS (`--spacing-4`). | Escala numérica estandarizada basada en múltiplos de 4px (`p-1`, `p-2`, `p-4`). |
| **Pseudo-clases** | Imposible usar `:hover`, `:focus`, `:active` o `:disabled` sin JavaScript. | Soporte nativo escribiendo reglas para cada selector. | Prefijos declarativos directos (`hover:bg-blue-700`, `focus:ring-2`, `active:scale-95`). |
| **Diseño Responsivo** | Imposible usar Media Queries en el atributo `style`. | Requiere bloques `@media` dispersos en múltiples archivos. | Modificadores de pantalla integrados (`sm:`, `md:`, `lg:`, `xl:`) con enfoque mobile-first. |
| **Peso en Producción** | Duplicación masiva en el DOM HTML por cada nodo. | El CSS crece continuamente a medida que el proyecto añade pantallas. | **Zero-runtime y Purga Automática**: el compilador genera únicamente las clases usadas (~15-20 KB). |
| **Caché del Navegador** | Cada elemento envía sus propios bytes; sin caché. | Cacheado como archivo `.css` estático independiente. | Archivo CSS estático global altamente comprimible y cacheable en CDN. |

### Componente de Referencia: Tarjeta de Rutina

Para ilustrar el enfoque en el dominio del curso, observemos cómo se compone una tarjeta de rutina de entrenamiento (`RoutineCard`) combinando clases utilitarias para espaciado, tipografía, bordes, estados y transiciones suaves:

```tsx title="Ejemplo: tarjeta de rutina con utilidades de Tailwind" showLineNumbers
// Tarjeta de rutina estilizada íntegramente con clases utilitarias de Tailwind CSS v4
interface RoutineCardProps {
  id: string;
  title: string;
  category: string;
  exerciseCount: number;
  durationMinutes: number;
  isCompleted: boolean;
  onToggle: (id: string) => void;
}

export function RoutineCard({
  id,
  title,
  category,
  exerciseCount,
  durationMinutes,
  isCompleted,
  onToggle,
}: RoutineCardProps) {
  return (
    <article className="flex flex-col justify-between p-6 bg-white dark:bg-gray-800 rounded-2xl border border-gray-100 dark:border-gray-700 shadow-sm hover:shadow-md transition-all duration-200">
      <div>
        {/* Encabezado: Categoría y Duración */}
        <div className="flex items-center justify-between mb-3">
          <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-300">
            {category}
          </span>
          <span className="text-xs text-gray-500 dark:text-gray-400 font-medium">
            {durationMinutes} min
          </span>
        </div>

        {/* Título de la Rutina */}
        <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-1">
          {title}
        </h3>
        <p className="text-sm text-gray-600 dark:text-gray-400">
          {exerciseCount} ejercicios estructurados
        </p>
      </div>

      {/* Pie de tarjeta: Estado y Acción */}
      <div className="mt-6 pt-4 border-t border-gray-100 dark:border-gray-700 flex items-center justify-between">
        <span
          className={`text-xs font-semibold ${
            isCompleted
              ? 'text-emerald-600 dark:text-emerald-400'
              : 'text-amber-600 dark:text-amber-400'
          }`}
        >
          {isCompleted ? 'Completada' : 'Pendiente'}
        </span>
        <button
          onClick={() => onToggle(id)}
          className="px-4 py-2 text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 active:scale-95 rounded-lg transition-transform cursor-pointer"
        >
          {isCompleted ? 'Reiniciar' : 'Completar'}
        </button>
      </div>
    </article>
  );
}
```

:::tip[Claridad de Declaración]
Nota cómo no fue necesario crear un archivo `RoutineCard.module.css` con nombres de clases inventados (`.card-footer-action-button-active`). La tarjeta describe con precisión matemática su geometría, sus colores en modo claro y oscuro, y sus estados interactivos directamente en el elemento JSX.
:::

---

## 2. Configuración en Next.js

El proyecto del curso (`compunet3-202602`, rama `week-12/next-redux`) utiliza **Tailwind CSS v4** junto con **Next.js 16 (App Router)**. En versiones previas (Tailwind v3), la configuración requería mantener un archivo `tailwind.config.js` con rutas `content` para que el escáner detectara las clases, además de configurar plugins en arreglos de JavaScript.

En **Tailwind CSS v4**, la arquitectura se simplificó radicalmente con el motor **Oxide** (reescrito en Rust y Lightning CSS):

1. **Configuración CSS-First**: Ya no existe `tailwind.config.js`. Todo se configura directamente en la hoja de estilos principal (`app/globals.css`).
2. **Detección Automática de Fuentes**: Tailwind v4 detecta automáticamente todos los archivos de plantilla y componentes (`.tsx`, `.jsx`, `.ts`, `.html`) sin necesidad de especificar un array `content`.
3. **Integración con PostCSS**: Se conecta mediante el paquete oficial `@tailwindcss/postcss`.

Observemos la configuración real del proyecto en la rama `week-12/next-redux`:

```css title="app/globals.css" showLineNumbers
@import "tailwindcss";
@plugin "daisyui" {
    themes: light --default;
}
```

Y su respectivo archivo de configuración de PostCSS:

```javascript title="postcss.config.mjs" showLineNumbers
const config = {
  plugins: {
    "@tailwindcss/postcss": {},
  },
};

export default config;
```

:::note[Tailwind v4: El cambio a @import "tailwindcss"]
En Tailwind v3 se utilizaban tres directivas separadas: `@tailwind base;`, `@tailwind components;` y `@tailwind utilities;`. En Tailwind v4, estas directivas fueron reemplazadas por una única sentencia estándar de CSS: `@import "tailwindcss";`.
:::

---

## 3. Espaciado

El espaciado en Tailwind se controla mediante clases de margin y padding. Tailwind usa una escala numérica donde cada número representa un múltiplo de 0.25rem (4px).

### Margin

El margin controla el espacio **exterior** alrededor de un elemento. Se puede aplicar en todas las direcciones:

-   `m-{tamaño}`: margin en todas direcciones
-   `mx-{tamaño}`: margin horizontal (izquierda y derecha)
-   `my-{tamaño}`: margin vertical (arriba y abajo)
-   `mt-{tamaño}`, `mr-{tamaño}`, `mb-{tamaño}`, `ml-{tamaño}`: margin específico por lado

**Ejemplo:**

<BrowserWindow minHeight={240}>
    <div style={{ backgroundColor: "#f3f4f6", padding: "20px" }}>
        <div
            style={{
                margin: "16px",
                backgroundColor: "#3b82f6",
                color: "white",
                padding: "16px",
            }}
        >
            m-4: margin de 1rem (16px) en todos lados
        </div>
        <div
            style={{
                marginLeft: "32px",
                marginRight: "32px",
                marginTop: "8px",
                marginBottom: "8px",
                backgroundColor: "#22c55e",
                color: "white",
                padding: "16px",
            }}
        >
            mx-8 my-2: margin horizontal de 2rem, vertical de 0.5rem
        </div>
        <div
            style={{
                marginTop: "24px",
                backgroundColor: "#a855f7",
                color: "white",
                padding: "16px",
            }}
        >
            mt-6: margin-top de 1.5rem (24px)
        </div>
    </div>
</BrowserWindow>

### Padding

El padding controla el espacio **interior** de un elemento (entre el contenido y el borde). Usa la misma nomenclatura que margin:

-   `p-{tamaño}`: padding en todas direcciones
-   `px-{tamaño}`: padding horizontal
-   `py-{tamaño}`: padding vertical
-   `pt-{tamaño}`, `pr-{tamaño}`, `pb-{tamaño}`, `pl-{tamaño}`: padding específico por lado

**Ejemplo:**

<BrowserWindow minHeight={240}>
    <div style={{ backgroundColor: "#f3f4f6", padding: "20px" }}>
        <div
            style={{
                backgroundColor: "#ef4444",
                color: "white",
                marginBottom: "16px",
                padding: "8px",
            }}
        >
            p-2: padding de 0.5rem (8px) en todos lados
        </div>
        <div
            style={{
                backgroundColor: "#f59e0b",
                color: "black",
                marginBottom: "16px",
                paddingLeft: "32px",
                paddingRight: "32px",
                paddingTop: "16px",
            }}
        >
            px-8 py-4: padding horizontal de 2rem, vertical de 1rem
        </div>
        <div
            style={{
                paddingTop: "24px",
                paddingBottom: "8px",
                backgroundColor: "#4338ca",
                color: "white",
            }}
        >
            pt-6 pb-2: padding-top de 1.5rem, padding-bottom de 0.5rem
        </div>
    </div>
</BrowserWindow>

## 4. Dimensiones

Las dimensiones en Tailwind te permiten controlar el ancho y alto de los elementos. Tailwind ofrece clases utilitarias para tamaños fijos, porcentajes, y tamaños especiales como viewport.

### Width (Ancho)

El width controla el **ancho** de un elemento. Tailwind ofrece diferentes opciones:

-   `w-{número}`: ancho en escala de Tailwind (w-4 = 1rem, w-64 = 16rem)
-   `w-{fracción}`: ancho en porcentajes (w-1/2 = 50%, w-1/3 = 33.33%, w-full = 100%)
-   `w-screen`: ancho del viewport (100vw)
-   `w-auto`: ancho automático según el contenido

**Ejemplo:**

<BrowserWindow minHeight={300}>
    <div style={{ backgroundColor: "#f3f4f6", padding: "20px" }}>
        <div
            style={{
                width: "100%",
                backgroundColor: "#3b82f6",
                color: "white",
                padding: "16px",
                marginBottom: "12px",
            }}
        >
            w-full: ancho del 100% del contenedor
        </div>
        <div
            style={{
                width: "50%",
                backgroundColor: "#22c55e",
                color: "white",
                padding: "16px",
                marginBottom: "12px",
            }}
        >
            w-1/2: ancho del 50% del contenedor
        </div>
        <div
            style={{
                width: "256px",
                backgroundColor: "#a855f7",
                color: "white",
                padding: "16px",
                marginBottom: "12px",
            }}
        >
            w-64: ancho fijo de 16rem (256px)
        </div>
        <div
            style={{
                width: "auto",
                backgroundColor: "#f59e0b",
                color: "black",
                padding: "16px",
                display: "inline-block",
            }}
        >
            w-auto: ancho según contenido
        </div>
    </div>
</BrowserWindow>

### Height (Altura)

El height controla la **altura** de un elemento. Similar al width, ofrece múltiples opciones:

-   `h-{número}`: altura en escala de Tailwind (h-4 = 1rem, h-64 = 16rem)
-   `h-full`: altura del 100% del contenedor
-   `h-screen`: altura del viewport (100vh)
-   `h-auto`: altura automática según el contenido

**Ejemplo:**

<BrowserWindow minHeight={400}>
    <div
        style={{
            backgroundColor: "#f3f4f6",
            padding: "20px",
            height: "350px",
            display: "flex",
            gap: "12px",
        }}
    >
        <div
            style={{
                height: "100%",
                width: "80px",
                backgroundColor: "#3b82f6",
                color: "white",
                padding: "16px",
            }}
        >
            h-full: 100% de altura
        </div>
        <div
            style={{
                height: "128px",
                width: "80px",
                backgroundColor: "#22c55e",
                color: "white",
                padding: "16px",
            }}
        >
            h-32: altura de 8rem (128px)
        </div>
        <div
            style={{
                height: "64px",
                width: "80px",
                backgroundColor: "#a855f7",
                color: "white",
                padding: "16px",
            }}
        >
            h-16: altura de 4rem (64px)
        </div>
        <div
            style={{
                height: "auto",
                width: "80px",
                backgroundColor: "#f59e0b",
                color: "black",
                padding: "16px",
            }}
        >
            h-auto
        </div>
    </div>
</BrowserWindow>

### Size (Ancho y Altura simultáneos)

La clase `size-{tamaño}` establece el **mismo valor** para width y height, útil para elementos cuadrados:

-   `size-16`: width y height de 4rem (64px)
-   `size-32`: width y height de 8rem (128px)

**Ejemplo:**

<BrowserWindow minHeight={280}>
    <div
        style={{
            backgroundColor: "#f3f4f6",
            padding: "20px",
            display: "flex",
            gap: "12px",
            alignItems: "center",
        }}
    >
        <div
            style={{
                width: "64px",
                height: "64px",
                backgroundColor: "#3b82f6",
                color: "white",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
            }}
        >
            size-16
        </div>
        <div
            style={{
                width: "96px",
                height: "96px",
                backgroundColor: "#22c55e",
                color: "white",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
            }}
        >
            size-24
        </div>
        <div
            style={{
                width: "128px",
                height: "128px",
                backgroundColor: "#a855f7",
                color: "white",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
            }}
        >
            size-32
        </div>
    </div>
</BrowserWindow>

### Min/Max Width y Height

Tailwind permite establecer límites mínimos y máximos para las dimensiones:

-   `min-w-{tamaño}`: ancho mínimo
-   `max-w-{tamaño}`: ancho máximo (max-w-md = 28rem, max-w-lg = 32rem, max-w-xl = 36rem)
-   `min-h-{tamaño}`: altura mínima
-   `max-h-{tamaño}`: altura máxima

**Ejemplo:**

<BrowserWindow minHeight={300}>
    <div style={{ backgroundColor: "#f3f4f6", padding: "20px" }}>
        <div
            style={{
                maxWidth: "448px",
                backgroundColor: "#3b82f6",
                color: "white",
                padding: "16px",
                marginBottom: "12px",
            }}
        >
            max-w-md: ancho máximo de 28rem (448px). Este texto tiene un límite
            de ancho sin importar el tamaño del contenedor.
        </div>
        <div
            style={{
                minHeight: "128px",
                backgroundColor: "#22c55e",
                color: "white",
                padding: "16px",
                marginBottom: "12px",
            }}
        >
            min-h-32: altura mínima de 8rem (128px)
        </div>
        <div
            style={{
                maxHeight: "80px",
                overflow: "auto",
                backgroundColor: "#a855f7",
                color: "white",
                padding: "16px",
            }}
        >
            max-h-20: altura máxima de 5rem (80px). Si el contenido es muy
            largo, aparecerá scroll. Este es un ejemplo de texto largo que
            excede la altura máxima establecida para demostrar el
            comportamiento.
        </div>
    </div>
</BrowserWindow>

## 5. Tipografía

La tipografía en Tailwind te permite controlar el aspecto visual del texto mediante clases utilitarias. Puedes modificar el tamaño, peso, alineación, color, y más propiedades de tus textos.

### Font Size (Tamaño de fuente)

El tamaño de fuente controla qué tan grande o pequeño es el texto. Tailwind ofrece una escala predefinida:

-   `text-xs`: extra pequeño (0.75rem / 12px)
-   `text-sm`: pequeño (0.875rem / 14px)
-   `text-base`: base (1rem / 16px)
-   `text-lg`: grande (1.125rem / 18px)
-   `text-xl`: extra grande (1.25rem / 20px)
-   `text-2xl` a `text-9xl`: tamaños progresivamente más grandes

**Ejemplo:**

<BrowserWindow minHeight={350}>
    <div
        style={{ backgroundColor: "#f3f4f6", padding: "20px", color: "black" }}
    >
        <p style={{ fontSize: "12px", marginBottom: "8px" }}>text-xs: Texto extra pequeño (12px)</p>
        <p style={{ fontSize: "14px", marginBottom: "8px" }}>text-sm: Texto pequeño (14px)</p>
        <p style={{ fontSize: "16px", marginBottom: "8px" }}>text-base: Texto base (16px)</p>
        <p style={{ fontSize: "18px", marginBottom: "8px" }}>text-lg: Texto grande (18px)</p>
        <p style={{ fontSize: "20px", marginBottom: "8px" }}>text-xl: Texto extra grande (20px)</p>
        <p style={{ fontSize: "24px", marginBottom: "8px" }}>text-2xl: Texto 2XL (24px)</p>
        <p style={{ fontSize: "30px" }}>text-3xl: Texto 3XL (30px)</p>
    </div>
</BrowserWindow>

### Font Weight (Peso de fuente)

El peso de fuente controla qué tan gruesa o delgada se ve la tipografía:

-   `font-thin`: peso 100
-   `font-light`: peso 300
-   `font-normal`: peso 400
-   `font-medium`: peso 500
-   `font-semibold`: peso 600
-   `font-bold`: peso 700
-   `font-extrabold`: peso 800
-   `font-black`: peso 900

**Ejemplo:**

<BrowserWindow minHeight={350}>
    <div
        style={{ backgroundColor: "#f3f4f6", padding: "20px", color: "black" }}
    >
        <p style={{ fontWeight: "100", marginBottom: "8px" }}>font-thin: Texto muy delgado (100)</p>
        <p style={{ fontWeight: "300", marginBottom: "8px" }}>font-light: Texto ligero (300)</p>
        <p style={{ fontWeight: "400", marginBottom: "8px" }}>font-normal: Texto normal (400)</p>
        <p style={{ fontWeight: "500", marginBottom: "8px" }}>font-medium: Texto medio (500)</p>
        <p style={{ fontWeight: "600", marginBottom: "8px" }}>font-semibold: Texto semi-negrita (600)</p>
        <p style={{ fontWeight: "700", marginBottom: "8px" }}>font-bold: Texto en negrita (700)</p>
        <p style={{ fontWeight: "800", marginBottom: "8px" }}>font-extrabold: Texto extra negrita (800)</p>
        <p style={{ fontWeight: "900" }}>font-black: Texto negro (900)</p>
    </div>
</BrowserWindow>

### Text Align (Alineación de texto)

La alineación de texto controla cómo se distribuye el texto horizontalmente:

-   `text-left`: alineado a la izquierda
-   `text-center`: centrado
-   `text-right`: alineado a la derecha
-   `text-justify`: justificado

**Ejemplo:**

<BrowserWindow minHeight={280}>
    <div
        style={{ backgroundColor: "#f3f4f6", padding: "20px", color: "black" }}
    >
        <p
            style={{
                textAlign: "left",
                backgroundColor: "#dbeafe",
                padding: "12px",
                marginBottom: "8px",
            }}
        >text-left: Este texto está alineado a la izquierda</p>
        <p
            style={{
                textAlign: "center",
                backgroundColor: "#dcfce7",
                padding: "12px",
                marginBottom: "8px",
            }}
        >text-center: Este texto está centrado</p>
        <p
            style={{
                textAlign: "right",
                backgroundColor: "#fce7f3",
                padding: "12px",
                marginBottom: "8px",
            }}
        >text-right: Este texto está alineado a la derecha</p>
        <p
            style={{
                textAlign: "justify",
                backgroundColor: "#fef3c7",
                padding: "12px",
            }}
        >text-justify: Este texto está justificado, lo que significa que se distribuye uniformemente entre los márgenes izquierdo y derecho.</p>
    </div>
</BrowserWindow>

### Text Color (Color de texto)

Tailwind ofrece una amplia paleta de colores para el texto:

-   `text-{color}-{intensidad}`: ejemplo `text-blue-500`, `text-red-600`
-   Colores disponibles: gray, red, yellow, green, blue, indigo, purple, pink, etc.
-   Intensidades: de 50 (más claro) a 950 (más oscuro)

**Ejemplo:**

<BrowserWindow minHeight={300}>
    <div style={{ backgroundColor: "#f3f4f6", padding: "20px" }}>
        <p style={{ color: "#ef4444", fontSize: "18px", marginBottom: "8px" }}>text-red-500: Texto en rojo</p>
        <p style={{ color: "#3b82f6", fontSize: "18px", marginBottom: "8px" }}>text-blue-500: Texto en azul</p>
        <p style={{ color: "#22c55e", fontSize: "18px", marginBottom: "8px" }}>text-green-500: Texto en verde</p>
        <p style={{ color: "#a855f7", fontSize: "18px", marginBottom: "8px" }}>text-purple-500: Texto en púrpura</p>
        <p style={{ color: "#f59e0b", fontSize: "18px", marginBottom: "8px" }}>text-amber-500: Texto en ámbar</p>
        <p style={{ color: "#6b7280", fontSize: "18px" }}>text-gray-500: Texto en gris</p>
    </div>
</BrowserWindow>

### Text Decoration y Transform

Tailwind también ofrece clases para decoración y transformación de texto:

-   `underline`: subrayado
-   `line-through`: tachado
-   `uppercase`: mayúsculas
-   `lowercase`: minúsculas
-   `capitalize`: primera letra en mayúscula

**Ejemplo:**

<BrowserWindow minHeight={280}>
    <div
        style={{ backgroundColor: "#f3f4f6", padding: "20px", color: "black" }}
    >
        <p
            style={{
                textDecoration: "underline",
                marginBottom: "8px",
                fontSize: "16px",
            }}
        >underline: Este texto está subrayado</p>
        <p
            style={{
                textDecoration: "line-through",
                marginBottom: "8px",
                fontSize: "16px",
            }}
        >line-through: Este texto está tachado</p>
        <p
            style={{
                textTransform: "uppercase",
                marginBottom: "8px",
                fontSize: "16px",
            }}
        >uppercase: este texto está en mayúsculas</p>
        <p
            style={{
                textTransform: "lowercase",
                marginBottom: "8px",
                fontSize: "16px",
            }}
        >lowercase: ESTE TEXTO ESTÁ EN MINÚSCULAS</p>
        <p style={{ textTransform: "capitalize", fontSize: "16px" }}>capitalize: cada palabra inicia con mayúscula</p>
    </div>
</BrowserWindow>

### Line Height (Altura de línea)

La altura de línea controla el espaciado vertical entre líneas de texto:

-   `leading-none`: sin espacio adicional
-   `leading-tight`: espaciado reducido
-   `leading-normal`: espaciado normal
-   `leading-relaxed`: espaciado relajado
-   `leading-loose`: espaciado amplio

**Ejemplo:**

<BrowserWindow minHeight={350}>
    <div
        style={{ backgroundColor: "#f3f4f6", padding: "20px", color: "black" }}
    >
        <div style={{ marginBottom: "16px" }}>
            <p
                style={{
                    lineHeight: "1",
                    backgroundColor: "#dbeafe",
                    padding: "8px",
                }}
            >leading-none: Esta es una línea de texto con altura de línea sin espacio adicional. Nota cómo las líneas están muy juntas.</p>
        </div>
        <div style={{ marginBottom: "16px" }}>
            <p
                style={{
                    lineHeight: "1.5",
                    backgroundColor: "#dcfce7",
                    padding: "8px",
                }}
            >leading-normal: Esta es una línea de texto con altura de línea normal. Es el espaciado estándar y cómodo para leer.</p>
        </div>
        <div>
            <p
                style={{
                    lineHeight: "2",
                    backgroundColor: "#fef3c7",
                    padding: "8px",
                }}
            >leading-loose: Esta es una línea de texto con altura de línea amplia. Hay mucho espacio entre las líneas.</p>
        </div>
    </div>
</BrowserWindow>

## 6. Colores

Los colores en Tailwind son fundamentales para dar vida a tus diseños. Tailwind ofrece una paleta extensa de colores con diferentes intensidades que puedes aplicar a fondos, textos, bordes y más.

### Background Color (Color de fondo)

El color de fondo se aplica con la clase `bg-{color}-{intensidad}`:

-   Colores disponibles: slate, gray, red, orange, yellow, green, blue, indigo, purple, pink, etc.
-   Intensidades: 50 (muy claro) hasta 950 (muy oscuro)
-   Ejemplos: `bg-blue-500`, `bg-red-600`, `bg-green-400`

**Ejemplo:**

<BrowserWindow minHeight={400}>
    <div style={{ backgroundColor: "#f3f4f6", padding: "20px" }}>
        <div
            style={{
                backgroundColor: "#ef4444",
                color: "white",
                padding: "16px",
                marginBottom: "12px",
                borderRadius: "8px",
            }}
        >
            bg-red-500: Fondo rojo
        </div>
        <div
            style={{
                backgroundColor: "#3b82f6",
                color: "white",
                padding: "16px",
                marginBottom: "12px",
                borderRadius: "8px",
            }}
        >
            bg-blue-500: Fondo azul
        </div>
        <div
            style={{
                backgroundColor: "#22c55e",
                color: "white",
                padding: "16px",
                marginBottom: "12px",
                borderRadius: "8px",
            }}
        >
            bg-green-500: Fondo verde
        </div>
        <div
            style={{
                backgroundColor: "#a855f7",
                color: "white",
                padding: "16px",
                marginBottom: "12px",
                borderRadius: "8px",
            }}
        >
            bg-purple-500: Fondo púrpura
        </div>
        <div
            style={{
                backgroundColor: "#f59e0b",
                color: "white",
                padding: "16px",
                marginBottom: "12px",
                borderRadius: "8px",
            }}
        >
            bg-amber-500: Fondo ámbar
        </div>
        <div
            style={{
                backgroundColor: "#ec4899",
                color: "white",
                padding: "16px",
                borderRadius: "8px",
            }}
        >
            bg-pink-500: Fondo rosa
        </div>
    </div>
</BrowserWindow>

### Intensidades de color

Cada color tiene diferentes intensidades que van del 50 al 950. Mientras mayor sea el número, más oscuro es el color:

**Ejemplo:**

<BrowserWindow minHeight={450}>
    <div style={{ backgroundColor: "#f3f4f6", padding: "20px" }}>
        <div
            style={{
                backgroundColor: "#eff6ff",
                color: "#1e40af",
                padding: "12px",
                marginBottom: "8px",
                borderRadius: "4px",
            }}
        >
            bg-blue-50: Azul muy claro
        </div>
        <div
            style={{
                backgroundColor: "#dbeafe",
                color: "#1e40af",
                padding: "12px",
                marginBottom: "8px",
                borderRadius: "4px",
            }}
        >
            bg-blue-100: Azul claro
        </div>
        <div
            style={{
                backgroundColor: "#93c5fd",
                color: "#1e3a8a",
                padding: "12px",
                marginBottom: "8px",
                borderRadius: "4px",
            }}
        >
            bg-blue-300: Azul medio claro
        </div>
        <div
            style={{
                backgroundColor: "#3b82f6",
                color: "white",
                padding: "12px",
                marginBottom: "8px",
                borderRadius: "4px",
            }}
        >
            bg-blue-500: Azul base
        </div>
        <div
            style={{
                backgroundColor: "#2563eb",
                color: "white",
                padding: "12px",
                marginBottom: "8px",
                borderRadius: "4px",
            }}
        >
            bg-blue-600: Azul medio oscuro
        </div>
        <div
            style={{
                backgroundColor: "#1e40af",
                color: "white",
                padding: "12px",
                marginBottom: "8px",
                borderRadius: "4px",
            }}
        >
            bg-blue-800: Azul oscuro
        </div>
        <div
            style={{
                backgroundColor: "#1e3a8a",
                color: "white",
                padding: "12px",
                borderRadius: "4px",
            }}
        >
            bg-blue-900: Azul muy oscuro
        </div>
    </div>
</BrowserWindow>

### Border Color (Color de borde)

Los bordes también pueden tener color usando `border-{color}-{intensidad}`. Recuerda que necesitas definir el ancho del borde primero:

-   `border`: borde de 1px
-   `border-2`: borde de 2px
-   `border-4`: borde de 4px
-   `border-8`: borde de 8px

**Ejemplo:**

<BrowserWindow minHeight={350}>
    <div
        style={{ backgroundColor: "#f3f4f6", padding: "20px", color: "black" }}
    >
        <div
            style={{
                border: "2px solid #ef4444",
                padding: "16px",
                marginBottom: "12px",
                borderRadius: "4px",
            }}
        >
            border-2 border-red-500: Borde rojo
        </div>
        <div
            style={{
                border: "4px solid #3b82f6",
                padding: "16px",
                marginBottom: "12px",
                borderRadius: "4px",
            }}
        >
            border-4 border-blue-500: Borde azul de 4px
        </div>
        <div
            style={{
                border: "8px solid #22c55e",
                padding: "16px",
                marginBottom: "12px",
                borderRadius: "4px",
            }}
        >
            border-8 border-green-500: Borde verde grueso de 8px
        </div>
        <div
            style={{
                border: "2px dashed #a855f7",
                padding: "16px",
                borderRadius: "4px",
            }}
        >
            border-2 border-purple-500 border-dashed: Borde púrpura punteado
        </div>
    </div>
</BrowserWindow>

### Opacity (Opacidad)

Puedes controlar la opacidad de colores de fondo, texto y bordes usando el modificador de opacidad:

-   `bg-{color}-{intensidad}/{opacidad}`: ejemplo `bg-blue-500/50` (50% de opacidad)
-   Opacidades comunes: 25, 50, 75, 100

**Ejemplo:**

<BrowserWindow minHeight={350}>
    <div style={{ backgroundColor: "#f3f4f6", padding: "20px" }}>
        <div
            style={{
                backgroundColor: "rgba(59, 130, 246, 1)",
                color: "white",
                padding: "16px",
                marginBottom: "12px",
                borderRadius: "4px",
            }}
        >
            bg-blue-500/100: Opacidad 100% (completamente opaco)
        </div>
        <div
            style={{
                backgroundColor: "rgba(59, 130, 246, 0.75)",
                color: "white",
                padding: "16px",
                marginBottom: "12px",
                borderRadius: "4px",
            }}
        >
            bg-blue-500/75: Opacidad 75%
        </div>
        <div
            style={{
                backgroundColor: "rgba(59, 130, 246, 0.5)",
                color: "white",
                padding: "16px",
                marginBottom: "12px",
                borderRadius: "4px",
            }}
        >
            bg-blue-500/50: Opacidad 50%
        </div>
        <div
            style={{
                backgroundColor: "rgba(59, 130, 246, 0.25)",
                color: "#1e3a8a",
                padding: "16px",
                borderRadius: "4px",
            }}
        >
            bg-blue-500/25: Opacidad 25% (muy transparente)
        </div>
    </div>
</BrowserWindow>

### Gradientes

:::note[Tailwind v4: Nueva Nomenclatura bg-linear-*]
En **Tailwind CSS v4**, las utilidades de gradientes lineales se renombraron de `bg-gradient-to-*` a **`bg-linear-to-*`** (`bg-linear-to-r`, `bg-linear-to-b`, `bg-linear-to-br`, etc.) para converger con la especificación estándar de CSS (`linear-gradient`). La sintaxis previa de v3 sigue siendo común en proyectos existentes, pero en proyectos modernos como el del curso se utiliza `bg-linear-to-*`.
:::

Tailwind permite crear gradientes lineales de forma intuitiva combinando la dirección con los puntos de parada de color:

-   `bg-linear-to-r`: gradiente lineal de izquierda a derecha
-   `bg-linear-to-b`: gradiente lineal de arriba hacia abajo
-   `bg-linear-to-br`: gradiente lineal hacia la esquina inferior derecha
-   `from-{color}`: color inicial
-   `to-{color}`: color final
-   `via-{color}`: color intermedio (opcional)

**Ejemplo:**

<BrowserWindow minHeight={400}>
    <div style={{ backgroundColor: "#f3f4f6", padding: "20px" }}>
        <div
            style={{
                background: "linear-gradient(to right, #3b82f6, #8b5cf6)",
                color: "white",
                padding: "20px",
                marginBottom: "12px",
                borderRadius: "8px",
                textAlign: "center",
            }}
        >
            bg-linear-to-r from-blue-500 to-purple-500 (v3: bg-gradient-to-r)
        </div>
        <div
            style={{
                background: "linear-gradient(to bottom, #ef4444, #f59e0b)",
                color: "white",
                padding: "20px",
                marginBottom: "12px",
                borderRadius: "8px",
                textAlign: "center",
            }}
        >
            bg-linear-to-b from-red-500 to-amber-500 (v3: bg-gradient-to-b)
        </div>
        <div
            style={{
                background:
                    "linear-gradient(to right, #10b981, #3b82f6, #8b5cf6)",
                color: "white",
                padding: "20px",
                marginBottom: "12px",
                borderRadius: "8px",
                textAlign: "center",
            }}
        >
            bg-linear-to-r from-green-500 via-blue-500 to-purple-500
        </div>
        <div
            style={{
                background: "linear-gradient(135deg, #ec4899, #8b5cf6)",
                color: "white",
                padding: "20px",
                borderRadius: "8px",
                textAlign: "center",
            }}
        >
            bg-linear-to-br from-pink-500 to-purple-500
        </div>
    </div>
</BrowserWindow>

## 7. Flexbox

Flexbox y Grid son sistemas de diseño fundamentales en CSS que Tailwind hace muy fáciles de usar. Te permiten crear layouts complejos y responsivos de manera eficiente. Flexbox es ideal para organizar elementos en una dirección (horizontal o vertical) y controlar cómo se distribuyen y alinean.

### Flex Direction (Dirección del flex)

La dirección del flex controla si los elementos se alinean horizontal o verticalmente:

-   `flex-row`: elementos en fila (horizontal, por defecto)
-   `flex-col`: elementos en columna (vertical)
-   `flex-row-reverse`: fila inversa
-   `flex-col-reverse`: columna inversa

**Ejemplo:**

<BrowserWindow minHeight={400}>
    <div
        style={{ backgroundColor: "#f3f4f6", padding: "20px", color: "black" }}
    >
        <div style={{ marginBottom: "20px" }}>
            <p style={{ marginBottom: "8px", fontWeight: "600" }}>flex-row:</p>
            <div style={{ display: "flex", flexDirection: "row", gap: "8px" }}>
                <div
                    style={{
                        backgroundColor: "#3b82f6",
                        color: "white",
                        padding: "16px",
                        borderRadius: "4px",
                    }}
                >
                    1
                </div>
                <div
                    style={{
                        backgroundColor: "#22c55e",
                        color: "white",
                        padding: "16px",
                        borderRadius: "4px",
                    }}
                >
                    2
                </div>
                <div
                    style={{
                        backgroundColor: "#a855f7",
                        color: "white",
                        padding: "16px",
                        borderRadius: "4px",
                    }}
                >
                    3
                </div>
            </div>
        </div>
        <div>
            <p style={{ marginBottom: "8px", fontWeight: "600" }}>flex-col:</p>
            <div
                style={{ display: "flex", flexDirection: "column", gap: "8px" }}
            >
                <div
                    style={{
                        backgroundColor: "#3b82f6",
                        color: "white",
                        padding: "16px",
                        borderRadius: "4px",
                    }}
                >
                    1
                </div>
                <div
                    style={{
                        backgroundColor: "#22c55e",
                        color: "white",
                        padding: "16px",
                        borderRadius: "4px",
                    }}
                >
                    2
                </div>
                <div
                    style={{
                        backgroundColor: "#a855f7",
                        color: "white",
                        padding: "16px",
                        borderRadius: "4px",
                    }}
                >
                    3
                </div>
            </div>
        </div>
    </div>
</BrowserWindow>

### Justify Content (Justificación horizontal)

Controla cómo se distribuyen los elementos en el eje principal:

-   `justify-start`: al inicio
-   `justify-center`: centrado
-   `justify-end`: al final
-   `justify-between`: espacio entre elementos
-   `justify-around`: espacio alrededor de elementos

**Ejemplo:**

<BrowserWindow minHeight={450}>
    <div
        style={{ backgroundColor: "#f3f4f6", padding: "20px", color: "black" }}
    >
        <div style={{ marginBottom: "16px" }}>
            <p style={{ marginBottom: "8px", fontWeight: "600" }}>justify-start:</p>
            <div
                style={{
                    display: "flex",
                    justifyContent: "flex-start",
                    gap: "8px",
                    backgroundColor: "#e5e7eb",
                    padding: "12px",
                    borderRadius: "4px",
                }}
            >
                <div
                    style={{
                        backgroundColor: "#3b82f6",
                        color: "white",
                        padding: "12px",
                        borderRadius: "4px",
                    }}
                >
                    A
                </div>
                <div
                    style={{
                        backgroundColor: "#22c55e",
                        color: "white",
                        padding: "12px",
                        borderRadius: "4px",
                    }}
                >
                    B
                </div>
                <div
                    style={{
                        backgroundColor: "#a855f7",
                        color: "white",
                        padding: "12px",
                        borderRadius: "4px",
                    }}
                >
                    C
                </div>
            </div>
        </div>
        <div style={{ marginBottom: "16px" }}>
            <p style={{ marginBottom: "8px", fontWeight: "600" }}>justify-center:</p>
            <div
                style={{
                    display: "flex",
                    justifyContent: "center",
                    gap: "8px",
                    backgroundColor: "#e5e7eb",
                    padding: "12px",
                    borderRadius: "4px",
                }}
            >
                <div
                    style={{
                        backgroundColor: "#3b82f6",
                        color: "white",
                        padding: "12px",
                        borderRadius: "4px",
                    }}
                >
                    A
                </div>
                <div
                    style={{
                        backgroundColor: "#22c55e",
                        color: "white",
                        padding: "12px",
                        borderRadius: "4px",
                    }}
                >
                    B
                </div>
                <div
                    style={{
                        backgroundColor: "#a855f7",
                        color: "white",
                        padding: "12px",
                        borderRadius: "4px",
                    }}
                >
                    C
                </div>
            </div>
        </div>
        <div>
            <p style={{ marginBottom: "8px", fontWeight: "600" }}>justify-between:</p>
            <div
                style={{
                    display: "flex",
                    justifyContent: "space-between",
                    backgroundColor: "#e5e7eb",
                    padding: "12px",
                    borderRadius: "4px",
                }}
            >
                <div
                    style={{
                        backgroundColor: "#3b82f6",
                        color: "white",
                        padding: "12px",
                        borderRadius: "4px",
                    }}
                >
                    A
                </div>
                <div
                    style={{
                        backgroundColor: "#22c55e",
                        color: "white",
                        padding: "12px",
                        borderRadius: "4px",
                    }}
                >
                    B
                </div>
                <div
                    style={{
                        backgroundColor: "#a855f7",
                        color: "white",
                        padding: "12px",
                        borderRadius: "4px",
                    }}
                >
                    C
                </div>
            </div>
        </div>
    </div>
</BrowserWindow>

### Align Items (Alineación vertical)

Controla cómo se alinean los elementos en el eje cruzado:

-   `items-start`: al inicio
-   `items-center`: centrado
-   `items-end`: al final
-   `items-stretch`: estirado (por defecto)

**Ejemplo:**

<BrowserWindow minHeight={400}>
    <div
        style={{ backgroundColor: "#f3f4f6", padding: "20px", color: "black" }}
    >
        <div style={{ marginBottom: "16px" }}>
            <p style={{ marginBottom: "8px", fontWeight: "600" }}>items-start:</p>
            <div
                style={{
                    display: "flex",
                    alignItems: "flex-start",
                    height: "100px",
                    backgroundColor: "#e5e7eb",
                    padding: "12px",
                    borderRadius: "4px",
                    gap: "8px",
                }}
            >
                <div
                    style={{
                        backgroundColor: "#3b82f6",
                        color: "white",
                        padding: "12px",
                        borderRadius: "4px",
                    }}
                >
                    A
                </div>
                <div
                    style={{
                        backgroundColor: "#22c55e",
                        color: "white",
                        padding: "12px",
                        borderRadius: "4px",
                        height: "60px",
                    }}
                >
                    B
                </div>
                <div
                    style={{
                        backgroundColor: "#a855f7",
                        color: "white",
                        padding: "12px",
                        borderRadius: "4px",
                    }}
                >
                    C
                </div>
            </div>
        </div>
        <div>
            <p style={{ marginBottom: "8px", fontWeight: "600" }}>items-center:</p>
            <div
                style={{
                    display: "flex",
                    alignItems: "center",
                    height: "100px",
                    backgroundColor: "#e5e7eb",
                    padding: "12px",
                    borderRadius: "4px",
                    gap: "8px",
                }}
            >
                <div
                    style={{
                        backgroundColor: "#3b82f6",
                        color: "white",
                        padding: "12px",
                        borderRadius: "4px",
                    }}
                >
                    A
                </div>
                <div
                    style={{
                        backgroundColor: "#22c55e",
                        color: "white",
                        padding: "12px",
                        borderRadius: "4px",
                        height: "60px",
                    }}
                >
                    B
                </div>
                <div
                    style={{
                        backgroundColor: "#a855f7",
                        color: "white",
                        padding: "12px",
                        borderRadius: "4px",
                    }}
                >
                    C
                </div>
            </div>
        </div>
    </div>
</BrowserWindow>

### Gap (Espacio entre elementos)

El gap crea espacio entre elementos flex sin necesidad de margins:

-   `gap-{tamaño}`: espacio en todas direcciones
-   `gap-x-{tamaño}`: espacio horizontal
-   `gap-y-{tamaño}`: espacio vertical

**Ejemplo:**

<BrowserWindow minHeight={350}>
    <div
        style={{ backgroundColor: "#f3f4f6", padding: "20px", color: "black" }}
    >
        <div style={{ marginBottom: "16px" }}>
            <p style={{ marginBottom: "8px", fontWeight: "600" }}>gap-2 (8px):</p>
            <div style={{ display: "flex", gap: "8px" }}>
                <div
                    style={{
                        backgroundColor: "#3b82f6",
                        color: "white",
                        padding: "16px",
                        borderRadius: "4px",
                        flex: "1",
                    }}
                >
                    1
                </div>
                <div
                    style={{
                        backgroundColor: "#22c55e",
                        color: "white",
                        padding: "16px",
                        borderRadius: "4px",
                        flex: "1",
                    }}
                >
                    2
                </div>
                <div
                    style={{
                        backgroundColor: "#a855f7",
                        color: "white",
                        padding: "16px",
                        borderRadius: "4px",
                        flex: "1",
                    }}
                >
                    3
                </div>
            </div>
        </div>
        <div>
            <p style={{ marginBottom: "8px", fontWeight: "600" }}>gap-8 (32px):</p>
            <div style={{ display: "flex", gap: "32px" }}>
                <div
                    style={{
                        backgroundColor: "#3b82f6",
                        color: "white",
                        padding: "16px",
                        borderRadius: "4px",
                        flex: "1",
                    }}
                >
                    1
                </div>
                <div
                    style={{
                        backgroundColor: "#22c55e",
                        color: "white",
                        padding: "16px",
                        borderRadius: "4px",
                        flex: "1",
                    }}
                >
                    2
                </div>
                <div
                    style={{
                        backgroundColor: "#a855f7",
                        color: "white",
                        padding: "16px",
                        borderRadius: "4px",
                        flex: "1",
                    }}
                >
                    3
                </div>
            </div>
        </div>
    </div>
</BrowserWindow>

## 8. Grid

Grid es perfecto para crear layouts bidimensionales complejos con filas y columnas.

### Grid Columns (Columnas)

Define cuántas columnas tendrá tu grid:

-   `grid-cols-{número}`: número de columnas (grid-cols-2, grid-cols-3, grid-cols-4, etc.)
-   `grid-cols-12`: sistema de 12 columnas (como Bootstrap)

**Ejemplo:**

<BrowserWindow minHeight={450}>
    <div
        style={{ backgroundColor: "#f3f4f6", padding: "20px", color: "black" }}
    >
        <div style={{ marginBottom: "20px" }}>
            <p style={{ marginBottom: "8px", fontWeight: "600" }}>grid-cols-2:</p>
            <div
                style={{
                    display: "grid",
                    gridTemplateColumns: "repeat(2, 1fr)",
                    gap: "12px",
                }}
            >
                <div
                    style={{
                        backgroundColor: "#3b82f6",
                        color: "white",
                        padding: "16px",
                        borderRadius: "4px",
                        textAlign: "center",
                    }}
                >
                    1
                </div>
                <div
                    style={{
                        backgroundColor: "#22c55e",
                        color: "white",
                        padding: "16px",
                        borderRadius: "4px",
                        textAlign: "center",
                    }}
                >
                    2
                </div>
                <div
                    style={{
                        backgroundColor: "#a855f7",
                        color: "white",
                        padding: "16px",
                        borderRadius: "4px",
                        textAlign: "center",
                    }}
                >
                    3
                </div>
                <div
                    style={{
                        backgroundColor: "#f59e0b",
                        color: "white",
                        padding: "16px",
                        borderRadius: "4px",
                        textAlign: "center",
                    }}
                >
                    4
                </div>
            </div>
        </div>
        <div>
            <p style={{ marginBottom: "8px", fontWeight: "600" }}>grid-cols-3:</p>
            <div
                style={{
                    display: "grid",
                    gridTemplateColumns: "repeat(3, 1fr)",
                    gap: "12px",
                }}
            >
                <div
                    style={{
                        backgroundColor: "#3b82f6",
                        color: "white",
                        padding: "16px",
                        borderRadius: "4px",
                        textAlign: "center",
                    }}
                >
                    1
                </div>
                <div
                    style={{
                        backgroundColor: "#22c55e",
                        color: "white",
                        padding: "16px",
                        borderRadius: "4px",
                        textAlign: "center",
                    }}
                >
                    2
                </div>
                <div
                    style={{
                        backgroundColor: "#a855f7",
                        color: "white",
                        padding: "16px",
                        borderRadius: "4px",
                        textAlign: "center",
                    }}
                >
                    3
                </div>
                <div
                    style={{
                        backgroundColor: "#f59e0b",
                        color: "white",
                        padding: "16px",
                        borderRadius: "4px",
                        textAlign: "center",
                    }}
                >
                    4
                </div>
                <div
                    style={{
                        backgroundColor: "#ec4899",
                        color: "white",
                        padding: "16px",
                        borderRadius: "4px",
                        textAlign: "center",
                    }}
                >
                    5
                </div>
                <div
                    style={{
                        backgroundColor: "#06b6d4",
                        color: "white",
                        padding: "16px",
                        borderRadius: "4px",
                        textAlign: "center",
                    }}
                >
                    6
                </div>
            </div>
        </div>
    </div>
</BrowserWindow>

### Grid Rows (Filas)

Define cuántas filas tendrá tu grid:

-   `grid-rows-{número}`: número de filas (grid-rows-2, grid-rows-3, etc.)

**Ejemplo:**

<BrowserWindow minHeight={400}>
    <div
        style={{ backgroundColor: "#f3f4f6", padding: "20px", color: "black" }}
    >
        <p style={{ marginBottom: "8px", fontWeight: "600" }}>grid-rows-3:</p>
        <div
            style={{
                display: "grid",
                gridTemplateRows: "repeat(3, 1fr)",
                gridTemplateColumns: "repeat(2, 1fr)",
                gap: "12px",
                height: "300px",
            }}
        >
            <div
                style={{
                    backgroundColor: "#3b82f6",
                    color: "white",
                    padding: "16px",
                    borderRadius: "4px",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                }}
            >
                1
            </div>
            <div
                style={{
                    backgroundColor: "#22c55e",
                    color: "white",
                    padding: "16px",
                    borderRadius: "4px",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                }}
            >
                2
            </div>
            <div
                style={{
                    backgroundColor: "#a855f7",
                    color: "white",
                    padding: "16px",
                    borderRadius: "4px",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                }}
            >
                3
            </div>
            <div
                style={{
                    backgroundColor: "#f59e0b",
                    color: "white",
                    padding: "16px",
                    borderRadius: "4px",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                }}
            >
                4
            </div>
            <div
                style={{
                    backgroundColor: "#ec4899",
                    color: "white",
                    padding: "16px",
                    borderRadius: "4px",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                }}
            >
                5
            </div>
            <div
                style={{
                    backgroundColor: "#06b6d4",
                    color: "white",
                    padding: "16px",
                    borderRadius: "4px",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                }}
            >
                6
            </div>
        </div>
    </div>
</BrowserWindow>

### Col Span (Expansión de columnas)

Permite que un elemento ocupe múltiples columnas:

-   `col-span-{número}`: expande el elemento a través de N columnas
-   `col-span-full`: ocupa todas las columnas disponibles

**Ejemplo:**

<BrowserWindow minHeight={400}>
    <div
        style={{ backgroundColor: "#f3f4f6", padding: "20px", color: "black" }}
    >
        <p style={{ marginBottom: "8px", fontWeight: "600" }}>grid-cols-3 con col-span:</p>
        <div
            style={{
                display: "grid",
                gridTemplateColumns: "repeat(3, 1fr)",
                gap: "12px",
            }}
        >
            <div
                style={{
                    gridColumn: "span 3",
                    backgroundColor: "#3b82f6",
                    color: "white",
                    padding: "16px",
                    borderRadius: "4px",
                    textAlign: "center",
                }}
            >
                col-span-3 (ocupa 3 columnas)
            </div>
            <div
                style={{
                    gridColumn: "span 2",
                    backgroundColor: "#22c55e",
                    color: "white",
                    padding: "16px",
                    borderRadius: "4px",
                    textAlign: "center",
                }}
            >
                col-span-2
            </div>
            <div
                style={{
                    backgroundColor: "#a855f7",
                    color: "white",
                    padding: "16px",
                    borderRadius: "4px",
                    textAlign: "center",
                }}
            >
                1
            </div>
            <div
                style={{
                    backgroundColor: "#f59e0b",
                    color: "white",
                    padding: "16px",
                    borderRadius: "4px",
                    textAlign: "center",
                }}
            >
                1
            </div>
            <div
                style={{
                    gridColumn: "span 2",
                    backgroundColor: "#ec4899",
                    color: "white",
                    padding: "16px",
                    borderRadius: "4px",
                    textAlign: "center",
                }}
            >
                col-span-2
            </div>
        </div>
    </div>
</BrowserWindow>

### Grid Gap

Similar a Flexbox, Grid también usa gap para espaciar elementos:

-   `gap-{tamaño}`: espacio entre filas y columnas

**Ejemplo:**

<BrowserWindow minHeight={400}>
    <div
        style={{ backgroundColor: "#f3f4f6", padding: "20px", color: "black" }}
    >
        <div style={{ marginBottom: "20px" }}>
            <p style={{ marginBottom: "8px", fontWeight: "600" }}>gap-2 (8px):</p>
            <div
                style={{
                    display: "grid",
                    gridTemplateColumns: "repeat(3, 1fr)",
                    gap: "8px",
                }}
            >
                <div
                    style={{
                        backgroundColor: "#3b82f6",
                        color: "white",
                        padding: "16px",
                        borderRadius: "4px",
                        textAlign: "center",
                    }}
                >
                    1
                </div>
                <div
                    style={{
                        backgroundColor: "#22c55e",
                        color: "white",
                        padding: "16px",
                        borderRadius: "4px",
                        textAlign: "center",
                    }}
                >
                    2
                </div>
                <div
                    style={{
                        backgroundColor: "#a855f7",
                        color: "white",
                        padding: "16px",
                        borderRadius: "4px",
                        textAlign: "center",
                    }}
                >
                    3
                </div>
            </div>
        </div>
        <div>
            <p style={{ marginBottom: "8px", fontWeight: "600" }}>gap-6 (24px):</p>
            <div
                style={{
                    display: "grid",
                    gridTemplateColumns: "repeat(3, 1fr)",
                    gap: "24px",
                }}
            >
                <div
                    style={{
                        backgroundColor: "#3b82f6",
                        color: "white",
                        padding: "16px",
                        borderRadius: "4px",
                        textAlign: "center",
                    }}
                >
                    1
                </div>
                <div
                    style={{
                        backgroundColor: "#22c55e",
                        color: "white",
                        padding: "16px",
                        borderRadius: "4px",
                        textAlign: "center",
                    }}
                >
                    2
                </div>
                <div
                    style={{
                        backgroundColor: "#a855f7",
                        color: "white",
                        padding: "16px",
                        borderRadius: "4px",
                        textAlign: "center",
                    }}
                >
                    3
                </div>
            </div>
        </div>
    </div>
</BrowserWindow>

## 9. Posicionamiento

El posicionamiento en Tailwind controla cómo se ubica un elemento en la página. Esto es fundamental para crear layouts complejos, modales, menús flotantes, y más.

### Position Types (Tipos de posición)

Tailwind ofrece diferentes tipos de posicionamiento:

-   `static`: posición normal (por defecto)
-   `relative`: posición relativa a su posición original
-   `absolute`: posición absoluta respecto al contenedor padre posicionado
-   `fixed`: posición fija respecto al viewport
-   `sticky`: mezcla entre relative y fixed

**Ejemplo:**

<BrowserWindow minHeight={450}>
    <div
        style={{ backgroundColor: "#f3f4f6", padding: "20px", color: "black" }}
    >
        <div style={{ marginBottom: "20px" }}>
            <p style={{ marginBottom: "8px", fontWeight: "600" }}>relative:</p>
            <div
                style={{
                    position: "relative",
                    backgroundColor: "#e5e7eb",
                    padding: "40px",
                    borderRadius: "4px",
                }}
            >
                <div
                    style={{
                        position: "relative",
                        top: "10px",
                        left: "10px",
                        backgroundColor: "#3b82f6",
                        color: "white",
                        padding: "16px",
                        borderRadius: "4px",
                        width: "fit-content",
                    }}
                >
                    relative top-10 left-10: Desplazado 10px desde su posición
                    original
                </div>
            </div>
        </div>
        <div>
            <p style={{ marginBottom: "8px", fontWeight: "600" }}>absolute:</p>
            <div
                style={{
                    position: "relative",
                    backgroundColor: "#e5e7eb",
                    padding: "40px",
                    borderRadius: "4px",
                    height: "150px",
                }}
            >
                <div
                    style={{
                        position: "absolute",
                        top: "10px",
                        right: "10px",
                        backgroundColor: "#22c55e",
                        color: "white",
                        padding: "12px",
                        borderRadius: "4px",
                    }}
                >
                    absolute top-10 right-10
                </div>
                <div
                    style={{
                        position: "absolute",
                        bottom: "10px",
                        left: "10px",
                        backgroundColor: "#a855f7",
                        color: "white",
                        padding: "12px",
                        borderRadius: "4px",
                    }}
                >
                    absolute bottom-10 left-10
                </div>
            </div>
        </div>
    </div>
</BrowserWindow>

### Positioning Values (Valores de posición)

Puedes controlar exactamente dónde se posiciona un elemento:

-   `top-{tamaño}`, `right-{tamaño}`, `bottom-{tamaño}`, `left-{tamaño}`
-   `inset-{tamaño}`: aplica el mismo valor a todos los lados
-   Valores comunes: 0, 1, 2, 4, 8, 16, etc. (en múltiplos de 0.25rem)

**Ejemplo:**

<BrowserWindow minHeight={350}>
    <div style={{ backgroundColor: "#f3f4f6", padding: "20px" }}>
        <div
            style={{
                position: "relative",
                backgroundColor: "#e5e7eb",
                height: "250px",
                borderRadius: "4px",
            }}
        >
            <div
                style={{
                    position: "absolute",
                    top: "0",
                    left: "0",
                    backgroundColor: "#3b82f6",
                    color: "white",
                    padding: "12px",
                    borderRadius: "4px",
                }}
            >
                top-0 left-0
            </div>
            <div
                style={{
                    position: "absolute",
                    top: "0",
                    right: "0",
                    backgroundColor: "#22c55e",
                    color: "white",
                    padding: "12px",
                    borderRadius: "4px",
                }}
            >
                top-0 right-0
            </div>
            <div
                style={{
                    position: "absolute",
                    top: "50%",
                    left: "50%",
                    transform: "translate(-50%, -50%)",
                    backgroundColor: "#f59e0b",
                    color: "white",
                    padding: "12px",
                    borderRadius: "4px",
                }}
            >
                Centrado
            </div>
            <div
                style={{
                    position: "absolute",
                    bottom: "0",
                    left: "0",
                    backgroundColor: "#a855f7",
                    color: "white",
                    padding: "12px",
                    borderRadius: "4px",
                }}
            >
                bottom-0 left-0
            </div>
            <div
                style={{
                    position: "absolute",
                    bottom: "0",
                    right: "0",
                    backgroundColor: "#ec4899",
                    color: "white",
                    padding: "12px",
                    borderRadius: "4px",
                }}
            >
                bottom-0 right-0
            </div>
        </div>
    </div>
</BrowserWindow>

### Z-Index (Índice de apilamiento)

El z-index controla qué elementos aparecen encima de otros:

-   `z-0`: índice 0
-   `z-10`, `z-20`, `z-30`, `z-40`, `z-50`: índices predefinidos
-   Mayor número = más arriba en el apilamiento

**Ejemplo:**

<BrowserWindow minHeight={350}>
    <div style={{ backgroundColor: "#f3f4f6", padding: "20px" }}>
        <div style={{ position: "relative", height: "200px" }}>
            <div
                style={{
                    position: "absolute",
                    top: "20px",
                    left: "20px",
                    width: "150px",
                    height: "150px",
                    backgroundColor: "#3b82f6",
                    color: "white",
                    padding: "16px",
                    borderRadius: "4px",
                    zIndex: 10,
                }}
            >
                z-10 (arriba)
            </div>
            <div
                style={{
                    position: "absolute",
                    top: "60px",
                    left: "60px",
                    width: "150px",
                    height: "150px",
                    backgroundColor: "#22c55e",
                    color: "white",
                    padding: "16px",
                    borderRadius: "4px",
                    zIndex: 20,
                }}
            >
                z-20 (más arriba)
            </div>
            <div
                style={{
                    position: "absolute",
                    top: "100px",
                    left: "100px",
                    width: "150px",
                    height: "150px",
                    backgroundColor: "#a855f7",
                    color: "white",
                    padding: "16px",
                    borderRadius: "4px",
                    zIndex: 30,
                }}
            >
                z-30 (encima)
            </div>
        </div>
    </div>
</BrowserWindow>

## 10. Estados y pseudo-clases

Los estados y pseudo-clases en Tailwind permiten aplicar estilos cuando el usuario interactúa con elementos o cuando se cumplen ciertas condiciones.

### Hover (Pasar el mouse)

El estado hover aplica estilos cuando el cursor está sobre un elemento:

-   Sintaxis: `hover:{clase}`
-   Ejemplo: `hover:bg-blue-500`, `hover:text-white`

**Ejemplo:**

<BrowserWindow minHeight={300}>
    <div style={{ backgroundColor: "#f3f4f6", padding: "20px" }}>
        <p style={{ marginBottom: "12px", color: "#6b7280" }}>Pasa el mouse sobre los botones:</p>
        <div style={{ display: "flex", gap: "12px", flexWrap: "wrap" }}>
            <button
                style={{
                    backgroundColor: "#3b82f6",
                    color: "white",
                    padding: "12px 24px",
                    borderRadius: "6px",
                    border: "none",
                    cursor: "pointer",
                    transition: "all 0.3s",
                }}
                onMouseEnter={(e) =>
                    (e.currentTarget.style.backgroundColor = "#2563eb")
                }
                onMouseLeave={(e) =>
                    (e.currentTarget.style.backgroundColor = "#3b82f6")
                }
            >
                hover:bg-blue-600
            </button>
            <button
                style={{
                    backgroundColor: "#22c55e",
                    color: "white",
                    padding: "12px 24px",
                    borderRadius: "6px",
                    border: "none",
                    cursor: "pointer",
                    transition: "all 0.3s",
                }}
                onMouseEnter={(e) => {
                    e.currentTarget.style.transform = "scale(1.1)";
                }}
                onMouseLeave={(e) => {
                    e.currentTarget.style.transform = "scale(1)";
                }}
            >
                hover:scale-110
            </button>
            <button
                style={{
                    backgroundColor: "transparent",
                    color: "#a855f7",
                    padding: "12px 24px",
                    borderRadius: "6px",
                    border: "2px solid #a855f7",
                    cursor: "pointer",
                    transition: "all 0.3s",
                }}
                onMouseEnter={(e) => {
                    e.currentTarget.style.backgroundColor = "#a855f7";
                    e.currentTarget.style.color = "white";
                }}
                onMouseLeave={(e) => {
                    e.currentTarget.style.backgroundColor = "transparent";
                    e.currentTarget.style.color = "#a855f7";
                }}
            >
                hover:bg-purple-500
            </button>
        </div>
    </div>
</BrowserWindow>

### Focus (Enfoque en inputs)

El estado focus se aplica cuando un input o elemento interactivo está enfocado:

-   Sintaxis: `focus:{clase}`
-   Ejemplo: `focus:border-blue-500`, `focus:ring-2`

**Ejemplo:**

<BrowserWindow minHeight={280}>
    <div style={{ backgroundColor: "#f3f4f6", padding: "20px" }}>
        <p style={{ marginBottom: "12px", color: "#6b7280" }}>Haz clic en los inputs para ver el efecto:</p>
        <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
            <input
                type="text"
                placeholder="focus:border-blue-500"
                style={{
                    padding: "12px",
                    border: "2px solid #d1d5db",
                    borderRadius: "6px",
                    outline: "none",
                    transition: "all 0.3s",
                }}
                onFocus={(e) => (e.currentTarget.style.borderColor = "#3b82f6")}
                onBlur={(e) => (e.currentTarget.style.borderColor = "#d1d5db")}
            />
            <input
                type="text"
                placeholder="focus:ring-2 focus:ring-purple-500"
                style={{
                    padding: "12px",
                    border: "2px solid #d1d5db",
                    borderRadius: "6px",
                    outline: "none",
                    transition: "all 0.3s",
                }}
                onFocus={(e) =>
                    (e.currentTarget.style.boxShadow =
                        "0 0 0 3px rgba(168, 85, 247, 0.5)")
                }
                onBlur={(e) => (e.currentTarget.style.boxShadow = "none")}
            />
        </div>
    </div>
</BrowserWindow>

### Active (Al hacer clic)

El estado active se aplica cuando estás haciendo clic en un elemento:

-   Sintaxis: `active:{clase}`
-   Ejemplo: `active:bg-blue-700`, `active:scale-95`

**Ejemplo:**

<BrowserWindow minHeight={250}>
    <div style={{ backgroundColor: "#f3f4f6", padding: "20px" }}>
        <p style={{ marginBottom: "12px", color: "#6b7280" }}>Haz clic y mantén presionado:</p>
        <div style={{ display: "flex", gap: "12px" }}>
            <button
                style={{
                    backgroundColor: "#3b82f6",
                    color: "white",
                    padding: "12px 24px",
                    borderRadius: "6px",
                    border: "none",
                    cursor: "pointer",
                    transition: "all 0.15s",
                }}
                onMouseDown={(e) => {
                    e.currentTarget.style.backgroundColor = "#1e40af";
                    e.currentTarget.style.transform = "scale(0.95)";
                }}
                onMouseUp={(e) => {
                    e.currentTarget.style.backgroundColor = "#3b82f6";
                    e.currentTarget.style.transform = "scale(1)";
                }}
            >
                active:bg-blue-800 active:scale-95
            </button>
            <button
                style={{
                    backgroundColor: "#22c55e",
                    color: "white",
                    padding: "12px 24px",
                    borderRadius: "6px",
                    border: "none",
                    cursor: "pointer",
                    transition: "all 0.15s",
                }}
                onMouseDown={(e) =>
                    (e.currentTarget.style.transform = "translateY(4px)")
                }
                onMouseUp={(e) =>
                    (e.currentTarget.style.transform = "translateY(0)")
                }
                onMouseLeave={(e) =>
                    (e.currentTarget.style.transform = "translateY(0)")
                }
            >
                active:translate-y-1
            </button>
        </div>
    </div>
</BrowserWindow>

### Disabled (Deshabilitado)

El estado disabled aplica estilos a elementos deshabilitados:

-   Sintaxis: `disabled:{clase}`
-   Ejemplo: `disabled:opacity-50`, `disabled:cursor-not-allowed`

**Ejemplo:**

<BrowserWindow minHeight={280}>
    <div style={{ backgroundColor: "#f3f4f6", padding: "20px" }}>
        <p style={{ marginBottom: "12px", color: "#6b7280" }}>Botones con estado disabled:</p>
        <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
            <button
                style={{
                    backgroundColor: "#3b82f6",
                    color: "white",
                    padding: "12px 24px",
                    borderRadius: "6px",
                    border: "none",
                    cursor: "pointer",
                }}
            >
                Botón habilitado
            </button>
            <button
                disabled
                style={{
                    backgroundColor: "#3b82f6",
                    color: "white",
                    padding: "12px 24px",
                    borderRadius: "6px",
                    border: "none",
                    opacity: 0.5,
                    cursor: "not-allowed",
                }}
            >
                disabled:opacity-50 disabled:cursor-not-allowed
            </button>
        </div>
    </div>
</BrowserWindow>

### Group Hover (Hover en grupo)

Group hover aplica estilos a un elemento cuando se hace hover sobre su contenedor padre:

-   Sintaxis: Aplicar `group` al padre y `group-hover:{clase}` al hijo
-   Útil para cards y componentes complejos

**Ejemplo:**

<BrowserWindow minHeight={350}>
    <div style={{ backgroundColor: "#f3f4f6", padding: "20px" }}>
        <p style={{ marginBottom: "12px", color: "#6b7280" }}>Pasa el mouse sobre las cards:</p>
        <div
            style={{
                display: "grid",
                gridTemplateColumns: "repeat(2, 1fr)",
                gap: "16px",
            }}
        >
            <div
                className="group"
                style={{
                    backgroundColor: "white",
                    padding: "20px",
                    borderRadius: "8px",
                    boxShadow: "0 1px 3px rgba(0,0,0,0.1)",
                    cursor: "pointer",
                    transition: "all 0.3s",
                }}
                onMouseEnter={(e) => {
                    e.currentTarget.style.boxShadow =
                        "0 10px 25px rgba(0,0,0,0.15)";
                    const title = e.currentTarget.querySelector(".title");
                    if (title) title.style.color = "#3b82f6";
                }}
                onMouseLeave={(e) => {
                    e.currentTarget.style.boxShadow =
                        "0 1px 3px rgba(0,0,0,0.1)";
                    const title = e.currentTarget.querySelector(".title");
                    if (title) title.style.color = "#111827";
                }}
            >
                <h3
                    className="title"
                    style={{
                        fontSize: "18px",
                        fontWeight: "600",
                        marginBottom: "8px",
                        color: "#111827",
                        transition: "color 0.3s",
                    }}
                >
                    Card 1
                </h3>
                <p style={{ color: "#6b7280" }}>group-hover en el título</p>
            </div>
            <div
                className="group"
                style={{
                    backgroundColor: "white",
                    padding: "20px",
                    borderRadius: "8px",
                    boxShadow: "0 1px 3px rgba(0,0,0,0.1)",
                    cursor: "pointer",
                    transition: "all 0.3s",
                }}
                onMouseEnter={(e) => {
                    e.currentTarget.style.transform = "translateY(-4px)";
                    const title = e.currentTarget.querySelector(".title");
                    if (title) title.style.color = "#22c55e";
                }}
                onMouseLeave={(e) => {
                    e.currentTarget.style.transform = "translateY(0)";
                    const title = e.currentTarget.querySelector(".title");
                    if (title) title.style.color = "#111827";
                }}
            >
                <h3
                    className="title"
                    style={{
                        fontSize: "18px",
                        fontWeight: "600",
                        marginBottom: "8px",
                        color: "#111827",
                        transition: "color 0.3s",
                    }}
                >
                    Card 2
                </h3>
                <p style={{ color: "#6b7280" }}>group-hover con transform</p>
            </div>
        </div>
    </div>
</BrowserWindow>

## 11. Personalización

Tailwind CSS permite personalizar valores más allá de su escala predefinida usando **valores arbitrarios**. Esto te da la flexibilidad de usar valores exactos cuando los necesites, sin salir del sistema de utilidades de Tailwind.

### Valores Arbitrarios

Los valores arbitrarios te permiten especificar valores personalizados para cualquier clase de Tailwind usando corchetes `[]`.

#### 6. Colores, Bordes, Opacidad y Gradientes Personalizados

Puedes usar cualquier color en formato hexadecimal, RGB, HSL, o incluso nombres de color CSS:

-   `bg-[#1da1f2]`: color de fondo personalizado
-   `text-[rgb(255,0,0)]`: color de texto en RGB
-   `border-[#ff6347]`: color de borde personalizado

**Ejemplo:**

<BrowserWindow minHeight={350}>
    <div style={{ backgroundColor: "#f3f4f6", padding: "20px" }}>
        <div
            style={{
                backgroundColor: "#1da1f2",
                color: "white",
                padding: "16px",
                borderRadius: "8px",
                marginBottom: "12px",
            }}
        >
            bg-[#1da1f2]: Color azul Twitter personalizado
        </div>
        <div
            style={{
                backgroundColor: "#ff6b6b",
                color: "white",
                padding: "16px",
                borderRadius: "8px",
                marginBottom: "12px",
            }}
        >
            bg-[#ff6b6b]: Color rojo coral personalizado
        </div>
        <div
            style={{
                backgroundColor: "white",
                color: "#2d3436",
                padding: "16px",
                borderRadius: "8px",
                border: "3px solid #fdcb6e",
            }}
        >
            border-[#fdcb6e] border-[3px]: Borde amarillo personalizado
        </div>
        <p
            style={{
                color: "rgb(255, 107, 107)",
                fontSize: "18px",
                fontWeight: "600",
                marginTop: "12px",
            }}
        >text-[rgb(255,107,107)]: Texto en formato RGB</p>
    </div>
</BrowserWindow>

#### Tamaños Personalizados

Puedes especificar dimensiones exactas en px, rem, em, %, vw, vh, etc.:

-   `w-[347px]`: ancho de 347 píxeles
-   `h-[32rem]`: altura de 32rem
-   `text-[22px]`: tamaño de fuente de 22px
-   `p-[18px]`: padding de 18px

**Ejemplo:**

<BrowserWindow minHeight={400}>
    <div style={{ backgroundColor: "#f3f4f6", padding: "20px" }}>
        <div
            style={{
                width: "347px",
                height: "100px",
                backgroundColor: "#3b82f6",
                color: "white",
                padding: "16px",
                borderRadius: "8px",
                marginBottom: "12px",
            }}
        >
            w-[347px] h-[100px]: Ancho de 347px exacto
        </div>
        <div
            style={{
                width: "75%",
                backgroundColor: "#22c55e",
                color: "white",
                padding: "18px",
                borderRadius: "8px",
                marginBottom: "12px",
            }}
        >
            w-[75%] p-[18px]: Ancho del 75% con padding personalizado
        </div>
        <div
            style={{
                backgroundColor: "#a855f7",
                color: "white",
                padding: "16px",
                borderRadius: "8px",
                fontSize: "22px",
            }}
        >
            text-[22px]: Tamaño de fuente exacto de 22 píxeles
        </div>
    </div>
</BrowserWindow>

#### 3. Espaciado: Margin y Padding Personalizado

Crea espaciados exactos para margin y padding:

-   `m-[13px]`: margin de 13px
-   `p-[2.5rem]`: padding de 2.5rem
-   `gap-[25px]`: gap de 25px entre elementos

**Ejemplo:**

<BrowserWindow minHeight={350}>
    <div style={{ backgroundColor: "#f3f4f6", padding: "20px" }}>
        <div
            style={{
                backgroundColor: "white",
                padding: "13px",
                borderRadius: "8px",
                marginBottom: "25px",
                border: "2px solid #e5e7eb",
            }}
        >
            <p style={{ color: "#374151", fontWeight: "600" }}>p-[13px] mb-[25px]: Padding personalizado de 13px</p>
        </div>
        <div style={{ display: "flex", gap: "25px" }}>
            <div
                style={{
                    backgroundColor: "#3b82f6",
                    color: "white",
                    padding: "16px",
                    borderRadius: "8px",
                    flex: "1",
                }}
            >
                gap-[25px]
            </div>
            <div
                style={{
                    backgroundColor: "#22c55e",
                    color: "white",
                    padding: "16px",
                    borderRadius: "8px",
                    flex: "1",
                }}
            >
                gap-[25px]
            </div>
            <div
                style={{
                    backgroundColor: "#a855f7",
                    color: "white",
                    padding: "16px",
                    borderRadius: "8px",
                    flex: "1",
                }}
            >
                gap-[25px]
            </div>
        </div>
    </div>
</BrowserWindow>

#### Border Radius Personalizado

Define radios de borde exactos:

-   `rounded-[12px]`: border radius de 12px
-   `rounded-[50%]`: círculo perfecto

**Ejemplo:**

<BrowserWindow minHeight={300}>
    <div style={{ backgroundColor: "#f3f4f6", padding: "20px" }}>
        <div style={{ display: "flex", gap: "16px", alignItems: "center" }}>
            <div
                style={{
                    width: "120px",
                    height: "120px",
                    backgroundColor: "#3b82f6",
                    color: "white",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    borderRadius: "12px",
                    fontWeight: "600",
                }}
            >
                rounded-[12px]
            </div>
            <div
                style={{
                    width: "120px",
                    height: "120px",
                    backgroundColor: "#22c55e",
                    color: "white",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    borderRadius: "25px",
                    fontWeight: "600",
                }}
            >
                rounded-[25px]
            </div>
            <div
                style={{
                    width: "120px",
                    height: "120px",
                    backgroundColor: "#a855f7",
                    color: "white",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    borderRadius: "50%",
                    fontWeight: "600",
                }}
            >
                rounded-[50%]
            </div>
        </div>
    </div>
</BrowserWindow>

#### Sombras Personalizadas

:::note[Tailwind v4: Reorganización de las Escalas de Bordes y Sombras]
En Tailwind CSS v4, la escala de sombras y bordes fue reajustada para mayor consistencia:
- La clase base `shadow` de v3 ahora se llama `shadow-sm`, mientras que el antiguo `shadow-sm` se convirtió en `shadow-xs`.
- La escala moderna incluye `shadow-2xs`, `shadow-xs`, `shadow-sm`, `shadow-md`, `shadow-lg`, `shadow-xl` y `shadow-2xl`.
- Para radios de borde ocurre lo mismo: el antiguo `rounded-sm` es ahora `rounded-xs`, y `rounded` equivale a `rounded-sm`.
:::

Crea efectos de sombra personalizados:

-   `shadow-[0_4px_6px_rgba(0,0,0,0.1)]`: sombra personalizada

**Ejemplo:**

<BrowserWindow minHeight={350}>
    <div
        style={{ backgroundColor: "#f3f4f6", padding: "20px", color: "black" }}
    >
        <div
            style={{
                backgroundColor: "white",
                padding: "20px",
                borderRadius: "8px",
                marginBottom: "16px",
                boxShadow: "0 4px 6px rgba(0,0,0,0.1)",
            }}
        >
            shadow-[0_4px_6px_rgba(0,0,0,0.1)]: Sombra suave
        </div>
        <div
            style={{
                backgroundColor: "white",
                padding: "20px",
                borderRadius: "8px",
                marginBottom: "16px",
                boxShadow: "0 10px 30px rgba(59,130,246,0.3)",
            }}
        >
            shadow-[0_10px_30px_rgba(59,130,246,0.3)]: Sombra azul
        </div>
        <div
            style={{
                backgroundColor: "white",
                padding: "20px",
                borderRadius: "8px",
                boxShadow: "0 20px 50px rgba(0,0,0,0.2)",
            }}
        >
            shadow-[0_20px_50px_rgba(0,0,0,0.2)]: Sombra pronunciada
        </div>
    </div>
</BrowserWindow>

#### Font Weight y Line Height Personalizados

Especifica pesos de fuente y alturas de línea exactos:

-   `font-[450]`: peso de fuente personalizado
-   `leading-[1.75]`: altura de línea específica

**Ejemplo:**

<BrowserWindow minHeight={300}>
    <div
        style={{ backgroundColor: "#f3f4f6", padding: "20px", color: "black" }}
    >
        <p
            style={{
                fontWeight: "350",
                marginBottom: "12px",
                fontSize: "18px",
            }}
        >font-[350]: Peso de fuente 350 (entre light y normal)</p>
        <p
            style={{
                fontWeight: "550",
                marginBottom: "12px",
                fontSize: "18px",
            }}
        >font-[550]: Peso de fuente 550 (entre medium y semibold)</p>
        <p
            style={{
                fontWeight: "650",
                marginBottom: "16px",
                fontSize: "18px",
            }}
        >font-[650]: Peso de fuente 650 personalizado</p>
        <p style={{ lineHeight: "1.75", fontSize: "16px" }}>leading-[1.75]: Esta línea tiene una altura de línea de 1.75, lo que proporciona un espaciado cómodo para lectura. Puedes notar cómo el texto respira mejor con este espaciado personalizado.</p>
    </div>
</BrowserWindow>

### Grid Template Columns/Rows Personalizado

Define estructuras de grid completamente personalizadas:

-   `grid-cols-[200px_1fr_2fr]`: columnas con tamaños específicos
-   `grid-rows-[100px_auto_100px]`: filas personalizadas

**Ejemplo:**

<BrowserWindow minHeight={350}>
    <div style={{ backgroundColor: "#f3f4f6", padding: "20px" }}>
        <p
            style={{
                marginBottom: "12px",
                fontWeight: "600",
                color: "#374151",
            }}
        >grid-cols-[200px_1fr_2fr]:</p>
        <div
            style={{
                display: "grid",
                gridTemplateColumns: "200px 1fr 2fr",
                gap: "12px",
                marginBottom: "20px",
            }}
        >
            <div
                style={{
                    backgroundColor: "#3b82f6",
                    color: "white",
                    padding: "16px",
                    borderRadius: "4px",
                    textAlign: "center",
                }}
            >
                200px
            </div>
            <div
                style={{
                    backgroundColor: "#22c55e",
                    color: "white",
                    padding: "16px",
                    borderRadius: "4px",
                    textAlign: "center",
                }}
            >
                1fr
            </div>
            <div
                style={{
                    backgroundColor: "#a855f7",
                    color: "white",
                    padding: "16px",
                    borderRadius: "4px",
                    textAlign: "center",
                }}
            >
                2fr
            </div>
        </div>
        <p
            style={{
                marginBottom: "12px",
                fontWeight: "600",
                color: "#374151",
            }}
        >grid-cols-[100px_auto_100px]:</p>
        <div
            style={{
                display: "grid",
                gridTemplateColumns: "100px auto 100px",
                gap: "12px",
            }}
        >
            <div
                style={{
                    backgroundColor: "#f59e0b",
                    color: "white",
                    padding: "16px",
                    borderRadius: "4px",
                    textAlign: "center",
                }}
            >
                100px
            </div>
            <div
                style={{
                    backgroundColor: "#ec4899",
                    color: "white",
                    padding: "16px",
                    borderRadius: "4px",
                    textAlign: "center",
                }}
            >
                auto (se expande)
            </div>
            <div
                style={{
                    backgroundColor: "#06b6d4",
                    color: "white",
                    padding: "16px",
                    borderRadius: "4px",
                    textAlign: "center",
                }}
            >
                100px
            </div>
        </div>
    </div>
</BrowserWindow>

### Transformaciones Personalizadas

Aplica transformaciones CSS personalizadas:

-   `rotate-[17deg]`: rotación personalizada
-   `scale-[1.15]`: escala específica
-   `translate-x-[13px]`: traslación exacta

**Ejemplo:**

<BrowserWindow minHeight={350}>
    <div style={{ backgroundColor: "#f3f4f6", padding: "20px" }}>
        <div
            style={{
                display: "flex",
                gap: "24px",
                alignItems: "center",
                justifyContent: "center",
            }}
        >
            <div
                style={{
                    width: "100px",
                    height: "100px",
                    backgroundColor: "#3b82f6",
                    color: "white",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    borderRadius: "8px",
                    fontWeight: "600",
                    transform: "rotate(17deg)",
                }}
            >
                rotate-[17deg]
            </div>
            <div
                style={{
                    width: "100px",
                    height: "100px",
                    backgroundColor: "#22c55e",
                    color: "white",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    borderRadius: "8px",
                    fontWeight: "600",
                    transform: "scale(1.25)",
                }}
            >
                scale-[1.25]
            </div>
            <div
                style={{
                    width: "100px",
                    height: "100px",
                    backgroundColor: "#a855f7",
                    color: "white",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    borderRadius: "8px",
                    fontWeight: "600",
                    transform: "translateY(-15px)",
                }}
            >
                -translate-y-[15px]
            </div>
        </div>
    </div>
</BrowserWindow>

### Combinando Valores Arbitrarios

Puedes combinar múltiples valores arbitrarios para crear diseños únicos:

**Ejemplo:**

<BrowserWindow minHeight={400}>
    <div style={{ backgroundColor: "#f3f4f6", padding: "20px" }}>
        <div
            style={{
                backgroundColor: "#1da1f2",
                color: "white",
                padding: "24px",
                borderRadius: "15px",
                marginBottom: "16px",
                boxShadow: "0 8px 20px rgba(29, 161, 242, 0.3)",
                fontSize: "19px",
                fontWeight: "550",
            }}
        >
            <p style={{ marginBottom: "8px" }}>Card personalizada con:</p>
            <ul style={{ paddingLeft: "20px", fontSize: "15px" }}>
                <li>bg-[#1da1f2]</li>
                <li>p-[24px]</li>
                <li>rounded-[15px]</li>
                <li>text-[19px]</li>
                <li>font-[550]</li>
                <li>shadow-[0_8px_20px_rgba(29,161,242,0.3)]</li>
            </ul>
        </div>
        <div
            style={{
                background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
                color: "white",
                padding: "28px",
                borderRadius: "20px",
                boxShadow: "0 15px 35px rgba(102, 126, 234, 0.4)",
                fontSize: "18px",
                fontWeight: "600",
            }}
        >
            <p>Gradiente personalizado con sombra y bordes redondeados</p>
            <p style={{ fontSize: "14px", marginTop: "8px", opacity: 0.9 }}>bg-[linear-gradient(135deg,#667eea_0%,#764ba2_100%)]</p>
        </div>
    </div>
</BrowserWindow>

### Propiedades CSS Arbitrarias

Tailwind también permite usar propiedades CSS completamente personalizadas con la sintaxis de corchetes:

-   `[clip-path:circle(50%)]`: aplica cualquier propiedad CSS
-   `[backdrop-filter:blur(10px)]`: efectos de fondo

**Ejemplo:**

<BrowserWindow minHeight={350}>
    <div
        style={{
            backgroundColor: "#f3f4f6",
            padding: "20px",
            position: "relative",
        }}
    >
        <div
            style={{
                width: "150px",
                height: "150px",
                backgroundColor: "#3b82f6",
                marginBottom: "20px",
                clipPath: "circle(50%)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                color: "white",
                fontWeight: "600",
            }}
        >
            clip-path: circle
        </div>
        <div
            style={{
                width: "200px",
                height: "100px",
                backgroundColor: "#22c55e",
                clipPath: "polygon(0 0, 100% 0, 100% 70%, 0 100%)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                color: "white",
                fontWeight: "600",
            }}
        >
            clip-path: polygon
        </div>
    </div>
</BrowserWindow>

### Configuración de Tokens con la Directiva @theme (Tailwind v4)

:::note[Tailwind v4: Adiós a tailwind.config.js]
En versiones anteriores de Tailwind (v3), la personalización de temas requería un archivo JavaScript `tailwind.config.js` con un objeto `theme.extend`. En **Tailwind CSS v4**, la configuración es **100% nativa en CSS** mediante la directiva `@theme`. Esto elimina la necesidad de archivos de configuración externos, mejora los tiempos de compilación gracias al motor Oxide y expone automáticamente los tokens como variables CSS nativas.
:::

Puedes definir colores de marca, fuentes y nuevos breakpoints directamente en `app/globals.css`:

```css title="app/globals.css" showLineNumbers
@import "tailwindcss";

/* Definición de tokens de diseño del proyecto de rutinas */
@theme {
  /* Nuevos colores semánticos accesibles como bg-brand-primary, text-brand-primary */
  --color-brand-primary: #2563eb;
  --color-brand-secondary: #0d9488;
  --color-brand-accent: #f59e0b;
  --color-routine-card: #f8fafc;

  /* Tipografías personalizadas */
  --font-display: "Inter", system-ui, sans-serif;

  /* Breakpoint personalizado para monitores ultra-anchos */
  --breakpoint-3xl: 1920px;
}
```

Al declarar `--color-brand-primary`, Tailwind genera automáticamente toda la familia de utilidades correspondientes: `bg-brand-primary`, `text-brand-primary`, `border-brand-primary`, `ring-brand-primary` y variantes de opacidad como `bg-brand-primary/80`.



---

## 12. Breakpoints y responsive

El diseño responsivo en Tailwind CSS está fundamentado en la filosofía **Mobile-First** (*móvil primero*). Esto significa que **cualquier clase aplicada sin prefijo de breakpoint se aplica a todos los dispositivos, comenzando desde la pantalla más pequeña (0px en adelante)**. Los prefijos (`sm:`, `md:`, `lg:`, `xl:`, `2xl:`) representan puntos de quiebre donde se aplican mejoras progresivas mediante reglas `@media (min-width: ...)`.

### Breakpoints Predefinidos del Sistema

Tailwind CSS v4 incluye cinco breakpoints predefinidos estándar:

| Prefijo | Tamaño Mínimo (`min-width`) | Tipo de Dispositivo Típico | Consulta CSS Generada |
| :--- | :--- | :--- | :--- |
| *(sin prefijo)* | `0px` | Teléfonos móviles en vertical | Regla base general |
| `sm:` | `640px` | Teléfonos grandes / Tablets en vertical | `@media (min-width: 640px)` |
| `md:` | `768px` | Tablets en horizontal / Laptops compactas | `@media (min-width: 768px)` |
| `lg:` | `1024px` | Laptops estándar y pantallas de escritorio | `@media (min-width: 1024px)` |
| `xl:` | `1280px` | Monitores de escritorio amplios | `@media (min-width: 1280px)` |
| `2xl:` | `1536px` | Monitores de alta resolución y gran formato | `@media (min-width: 1536px)` |

### Cómo se aplican los breakpoints

Toma `grid-cols-1 md:grid-cols-2 lg:grid-cols-3`. Cada clase aplica **desde su ancho en adelante**, y cuando dos chocan gana la de prefijo mayor. Arriba ves desde dónde aplica cada una; abajo, qué columnas ve cada pantalla:

<ThemedImage
  alt="Cascada de Breakpoints Mobile-First en Tailwind CSS"
  sources={{
    light: useBaseUrl('/img/computacion-3/s12-tailwind-mobile-first-light.svg'),
    dark: useBaseUrl('/img/computacion-3/s12-tailwind-mobile-first-dark.svg'),
  }}
/>

#### Desglose Técnico del Diagrama

1. **Base Móvil (`0px+`)**: Establece la estructura mínima indispensable. Por ejemplo, una sola columna (`grid-cols-1`), ancho completo (`w-full`) y tamaños de fuente compactos (`text-sm`).
2. **Activación Progresiva (`min-width`)**: A diferencia de los enfoques *desktop-first* antiguos que usaban `max-width` para ocultar o encoger elementos, el enfoque *mobile-first* añade complejidad gradualmente.
3. **Sobreescritura Específica**: Si declaras `text-sm md:text-base lg:text-lg`, un móvil de 390px leerá `text-sm`; una tablet de 800px aplicará `text-base`; y un monitor de 1440px aplicará `text-lg`.

:::important[Error Frecuente: Pensar en Desktop-First]
Un error muy común al comenzar con Tailwind es escribir `sm:grid-cols-1 md:grid-cols-2`. El prefijo `sm:` para una columna es redundante y dañino: en pantallas móviles menores a 640px el elemento quedaría sin regla de columna definida. Lo correcto es escribir **`grid-cols-1 md:grid-cols-2`**, dejando la regla base sin prefijo.
:::

### Ejemplo de Implementación: Cuadrícula Responsiva de Rutinas

Veamos cómo construir una cuadrícula completa de rutinas de gimnasio que se adapta fluidamente desde un teléfono móvil hasta un monitor de escritorio:

```tsx title="Ejemplo: cuadrícula responsiva de rutinas" showLineNumbers
// Cuadrícula responsiva que escala de 1 columna (móvil) a 4 columnas (pantalla grande)
import { RoutineCard } from './RoutineCard';

interface RoutineItem {
  id: string;
  title: string;
  category: string;
  exerciseCount: number;
  durationMinutes: number;
  isCompleted: boolean;
}

interface RoutineGridProps {
  routines: RoutineItem[];
  onToggleRoutine: (id: string) => void;
}

export function RoutineGrid({ routines, onToggleRoutine }: RoutineGridProps) {
  return (
    <section className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Encabezado con disposición responsiva: columna en móvil, fila en tablet/desktop */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-8">
        <div>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-gray-900 dark:text-white tracking-tight">
            Mis Rutinas de Entrenamiento
          </h2>
          <p className="text-sm sm:text-base text-gray-500 dark:text-gray-400 mt-1">
            Gestiona tu plan de ejercicios semanal y registra tu progreso
          </p>
        </div>

        {/* Acciones: ancho completo en móvil, auto en escritorio */}
        <div className="flex items-center gap-3 w-full md:w-auto">
          <button className="w-full md:w-auto px-4 py-2.5 bg-blue-600 hover:bg-blue-700 text-white text-sm font-semibold rounded-xl shadow-sm transition-colors">
            Nueva Rutina
          </button>
        </div>
      </div>

      {/* Cuadrícula responsiva adaptativa:
          - Móvil (< 768px): 1 columna (grid-cols-1)
          - Tablet (≥ 768px): 2 columnas (md:grid-cols-2)
          - Laptop (≥ 1024px): 3 columnas (lg:grid-cols-3)
          - Escritorio Amplio (≥ 1280px): 4 columnas (xl:grid-cols-4)
      */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {routines.map((routine) => (
          <RoutineCard
            key={routine.id}
            id={routine.id}
            title={routine.title}
            category={routine.category}
            exerciseCount={routine.exerciseCount}
            durationMinutes={routine.durationMinutes}
            isCompleted={routine.isCompleted}
            onToggle={onToggleRoutine}
          />
        ))}
      </div>
    </section>
  );
}
```

---

## 13. daisyUI

A medida que una aplicación crece, construir cada botón, campo de formulario, modal y barra de navegación combinando docenas de clases utilitarias de Tailwind puede generar código JSX verboso y repetitivo. Aquí es donde entra **daisyUI 5**.

### ¿Qué es daisyUI?

**daisyUI** es el plugin de componentes más popular para Tailwind CSS. A diferencia de librerías de componentes basadas en React como Material UI, Chakra UI o Mantine (que imponen envoltorios JavaScript pesados, props propietarias y aumentan el tamaño del bundle de cliente), daisyUI es **100% CSS puro**.

Proporciona **nombres de clase semánticos** (como `btn`, `card`, `navbar`, `input`, `badge`, `alert`) que encapsulan estilos profesionales y accesibles construidos sobre variables CSS y utilidades de Tailwind:

```html title="¿Qué es daisyUI"
<!-- En lugar de escribir 12 utilidades para un botón primario accesible: -->
<button class="inline-flex items-center justify-center px-4 py-2 text-sm font-medium rounded-lg text-white bg-blue-600 hover:bg-blue-700 active:bg-blue-800 transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500">
  Guardar
</button>

<!-- Con daisyUI escribes únicamente: -->
<button class="btn btn-primary">
  Guardar
</button>
```

### Ventajas Arquitectónicas de daisyUI 5

1. **Cero Sobrecarga de Runtime**: No hay componentes React adicionales, `forwardRef` complejos ni listeners de JavaScript en el bundle. Todo el comportamiento interactivo nativo (HTML5) se preserva.
2. **Control Total del Estado**: Tus componentes siguen siendo elementos nativos `<button>`, `<input>`, `<dialog>` gestionados directamente por React, Redux o React Hook Form.
3. **Compatibilidad Total con Tailwind**: Cualquier clase de daisyUI puede combinarse, sobreescribirse o extenderse con utilidades estándar de Tailwind (`btn btn-primary w-full md:w-auto shadow-lg`).

### Instalación y Configuración en Tailwind v4

En el proyecto del curso (`compunet3-202602`), daisyUI versión 5 se encuentra instalado como dependencia de desarrollo (`daisyui: "^5.7.47"`) y se integra en Tailwind v4 mediante la directiva `@plugin` en `app/globals.css`:

```css title="app/globals.css" showLineNumbers
@import "tailwindcss";

/* Integración oficial de daisyUI 5 con configuración de tema por defecto */
@plugin "daisyui" {
    themes: light --default;
}
```

Si deseas habilitar todos los temas integrados de daisyUI (por ejemplo, para permitir que el usuario seleccione su tema favorito en un menú), puedes declarar `themes: all;`:

```css title="Ejemplo: Habilitar todos los temas en app/globals.css" showLineNumbers
@import "tailwindcss";

@plugin "daisyui" {
    themes: all;
}
```

### Sistema de Temas y el Atributo data-theme

daisyUI incluye más de 35 temas integrados de diseño (`light`, `dark`, `cupcake`, `cyberpunk`, `synthwave`, `corporate`, `emerald`, `dracula`, entre otros). Cada tema define automáticamente una paleta coherente de variables de color:

- `bg-base-100`: Color de fondo de la superficie principal (por ejemplo, blanco en `light`, gris oscuro en `dark`).
- `bg-base-200`: Fondo secundario para tarjetas y paneles.
- `bg-base-300`: Fondo terciario para bordes o encabezados.
- `text-base-content`: Color de texto legible calibrado para contrastar con `base-100`.
- `btn-primary`, `btn-secondary`, `btn-accent`, `btn-neutral`: Variantes cromáticas del tema.

Para aplicar un tema, se utiliza el atributo estándar HTML `data-theme` en la etiqueta `<html>` de tu aplicación o en cualquier contenedor secundario:

```html title="Aplicación de tema global o por secciones" showLineNumbers
<!-- Tema global aplicado a toda la aplicación en el layout principal -->
<html data-theme="dark">
  <body>
    <!-- Esta sección utilizará siempre el tema corporate, sin importar el tema global -->
    <div data-theme="corporate" class="p-6 bg-base-100 text-base-content rounded-box">
      <h2 class="text-xl font-bold">Panel Institucional</h2>
      <button class="btn btn-primary mt-4">Acción Corporativa</button>
    </div>
  </body>
</html>
```

### Catálogo de Componentes Esenciales de daisyUI 5

A continuación revisaremos las familias de componentes semánticos más utilizadas en aplicaciones de gestión como nuestro sistema de rutinas:

#### 1. Botones (`btn`)

La clase base `btn` define la estructura, padding, bordes redondeados y estados `:hover` y `:active`. Se combina con clases de variante cromática y tamaño:

```tsx title="Ejemplos de botones con daisyUI 5" showLineNumbers
// Botones por rol y variante
<button className="btn btn-primary">Iniciar Rutina</button>
<button className="btn btn-secondary">Editar Ejercicios</button>
<button className="btn btn-outline btn-accent">Historial</button>
<button className="btn btn-ghost">Cancelar</button>

// Modificadores de tamaño: btn-xs, btn-sm, btn-md (defecto), btn-lg, btn-xl
<button className="btn btn-primary btn-sm">Acción Pequeña</button>
```

#### 2. Tarjetas (`card`)

El componente `card` organiza contenidos jerárquicos mediante sus submódulos semánticos `card-body`, `card-title` y `card-actions`:

```tsx title="components/routines/DaisyRoutineCard.tsx" showLineNumbers
// Tarjeta de rutina construida con clases semánticas de daisyUI 5
export function DaisyRoutineCard() {
  return (
    <div className="card bg-base-100 shadow-sm border border-base-200">
      <div className="card-body">
        <div className="flex items-center justify-between">
          <h2 className="card-title text-base-content">Hipertrofia de Torso</h2>
          <span className="badge badge-primary">Fuerza</span>
        </div>
        <p className="text-sm text-base-content/70 mt-2">
          Enfoque en press de banca, dominadas lastradas y fondos en paralelas.
        </p>
        <div className="card-actions justify-end mt-4">
          <button className="btn btn-sm btn-outline">Ver Detalles</button>
          <button className="btn btn-sm btn-primary">Comenzar</button>
        </div>
      </div>
    </div>
  );
}
```

#### 3. Barra de Navegación (`navbar`)

El componente `navbar` gestiona la barra superior con soporte para títulos, búsqueda y menús desplegables:

```tsx title="components/navigation/RoutineNavbar.tsx" showLineNumbers
// Barra superior con título, buscador y perfil de usuario
export function RoutineNavbar() {
  return (
    <header className="navbar bg-base-100 shadow-sm px-4">
      <div className="flex-1">
        <a className="btn btn-ghost text-xl font-black text-primary">
          GymTrack Pro
        </a>
      </div>
      <div className="flex items-center gap-3">
        <input
          type="text"
          placeholder="Buscar rutina..."
          className="input input-sm w-32 sm:w-64"
        />
        <div className="dropdown dropdown-end">
          <div tabIndex={0} role="button" className="btn btn-ghost btn-circle avatar">
            <div className="w-9 rounded-full bg-primary text-primary-content flex items-center justify-center font-bold">
              IC
            </div>
          </div>
          <ul
            tabIndex={0}
            className="menu menu-sm dropdown-content bg-base-100 rounded-box z-10 mt-3 w-48 p-2 shadow border border-base-200"
          >
            <li><a>Mi Perfil</a></li>
            <li><a>Configuración</a></li>
            <li><a className="text-error">Cerrar Sesión</a></li>
          </ul>
        </div>
      </div>
    </header>
  );
}
```

#### 4. Campos de Entrada (`input`) y Controles de Formulario

En daisyUI 5 los campos ya traen borde (desaparecieron `input-bordered` y `select-bordered`) y los formularios se agrupan con `fieldset`, `fieldset-legend` y `label` (reemplazan a `form-control` y `label-text` de la versión 4):

```tsx title="Campos de Entrada" showLineNumbers
<fieldset className="fieldset w-full max-w-sm">
  <legend className="fieldset-legend">Nombre de la rutina</legend>
  <input
    type="text"
    placeholder="Ej: Pierna pesada (sentadilla + peso muerto)"
    className="input input-primary w-full"
  />
  <p className="label">Mínimo 3 caracteres</p>
</fieldset>
```

#### 5. Badges (`badge`) y Alertas (`alert`)

```tsx title="Ejemplos de Badges y Alertas contextuales" showLineNumbers
// Badges para categorización de ejercicios
<span className="badge badge-info">Intermedio</span>
<span className="badge badge-success">45 Minutos</span>
<span className="badge badge-warning badge-outline">Alta Intensidad</span>

// Alerta informativa del estado de entrenamiento
<div role="alert" className="alert alert-info shadow-sm mt-4">
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" className="stroke-current shrink-0 w-6 h-6">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
  </svg>
  <span>¡Completaste 4 rutinas consecutivas esta semana! Continúa con el plan de descanso.</span>
</div>
```

### ¿Cuándo usar daisyUI y cuándo usar Utilidades de Tailwind?

La regla de oro para un equipo de ingeniería frontend es la **complementariedad**:

| Necesidad de la Interfaz | Herramienta Recomendada | Ejemplo Práctico |
| :--- | :--- | :--- |
| **Componentes estándar reutilizables** | **daisyUI** | Botones (`btn`), tarjetas (`card`), alertas (`alert`), modales, barras (`navbar`), avatares. |
| **Tokens de color dependientes del tema** | **daisyUI** | `bg-base-100`, `text-base-content`, `btn-primary` (cambian automáticamente con `data-theme`). |
| **Estructura y distribución espacial** | **Tailwind** | `grid`, `flex`, `gap-6`, `col-span-2`, `justify-between`, `items-center`. |
| **Dimensionamiento y espaciado granular** | **Tailwind** | `p-4`, `m-auto`, `w-full`, `max-w-4xl`, `min-h-screen`. |
| **Adaptabilidad responsiva** | **Tailwind** | `sm:flex-row`, `md:grid-cols-3`, `hidden lg:block`. |
| **Ajustes visuales específicos de un caso de uso** | **Tailwind** | `rounded-full`, `opacity-75`, `shadow-xl`, `border-dashed`. |

---

## Cuestionario de Autoevaluación

<Quiz id="compunet3-s12-tailwind-quiz">
  <Question title="¿Cuál es la principal diferencia técnica entre las clases utilitarias de Tailwind CSS y los estilos en línea (style={{ ... }}) en React?">
    <Option>Los estilos en línea solo funcionan en Server Components mientras que Tailwind es exclusivo de Client Components.</Option>
    <Option correct>Tailwind soporta pseudo-clases, media queries responsivas, escala de diseño y purga en compilación; los estilos en línea no admiten media queries ni pseudo-clases y saturan el DOM.</Option>
    <Option>Los estilos en línea generan archivos CSS externos en tiempo de ejecución mientras que Tailwind inyecta estilos directamente en los atributos HTML.</Option>
    <Option>Tailwind no permite definir colores hexadecimales personalizados mientras que los estilos en línea sí lo permiten.</Option>
  </Question>
  <Question title="¿Cómo se configura Tailwind CSS v4 en un proyecto Next.js moderno como compunet3-202602?">
    <Option>Creando un archivo tailwind.config.js con un arreglo content que apunte a las rutas de las páginas.</Option>
    <Option>Importando el archivo tailwind.min.css desde una red de distribución de contenidos (CDN) en el archivo layout.tsx.</Option>
    <Option correct>Declarando @import &#34;tailwindcss&#34;; en app/globals.css y conectando @tailwindcss/postcss en postcss.config.mjs, sin necesidad de tailwind.config.js.</Option>
    <Option>Instalando un componente especial llamado TailwindProvider y envolviendo el árbol de React en el layout.</Option>
  </Question>
  <Question title="¿Cuál es la nueva nomenclatura introducida en Tailwind CSS v4 para definir gradientes lineales de izquierda a derecha?">
    <Option>gradient-horizontal from-blue-500 to-purple-500</Option>
    <Option correct>bg-linear-to-r from-blue-500 to-purple-500</Option>
    <Option>background-gradient-right from-blue-500 to-purple-500</Option>
    <Option>linear-gradient-to-r from-blue-500 to-purple-500</Option>
  </Question>
  <Question title="En la directiva de diseño mobile-first de Tailwind, ¿qué pantalla afecta una clase declarada como md:grid-cols-2?">
    <Option>Únicamente a pantallas con un ancho exacto de 768 píxeles.</Option>
    <Option>A todas las pantallas con un ancho inferior a 768 píxeles (pantallas móviles).</Option>
    <Option correct>A todas las pantallas con un ancho mínimo de 768 píxeles en adelante (tablets y pantallas superiores).</Option>
    <Option>A pantallas que se encuentren en orientación vertical independientemente de su resolución.</Option>
  </Question>
  <Question title="En la escala numérica de espaciado y dimensiones de Tailwind (por ejemplo, p-4, w-16), ¿a cuántos píxeles equivale cada unidad numérica?">
    <Option>1 unidad equivale exactamente a 1 píxel (p-4 equivale a 4px).</Option>
    <Option correct>1 unidad equivale a 0.25rem (4 píxeles en la configuración base de 16px), por lo que p-4 equivale a 16px.</Option>
    <Option>1 unidad equivale a 1 porcentaje relativo al ancho de la ventana gráfica (viewport width).</Option>
    <Option>1 unidad equivale a 8 píxeles (p-4 equivale a 32px).</Option>
  </Question>
  <Question title="¿Cómo se deben declarar nuevos tokens de diseño (como colores corporativos o fuentes) en Tailwind CSS v4?">
    <Option>En la sección theme.extend del archivo tailwind.config.js usando código JavaScript.</Option>
    <Option correct>Directamente en el archivo CSS principal utilizando la directiva @theme y declarando variables CSS como --color-brand-primary.</Option>
    <Option>Creando un archivo theme.json en la raíz del repositorio de Next.js.</Option>
    <Option>Modificando directamente el código fuente dentro del paquete node_modules/tailwindcss.</Option>
  </Question>
  <Question title="¿Cuál es la ventaja principal de daisyUI frente a librerías de componentes tradicionales como Material UI o Chakra UI?">
    <Option>Que daisyUI incluye su propio gestor de estado global para sincronizar datos con el servidor.</Option>
    <Option correct>Que es 100% CSS puro basado en clases semánticas, sin sobrecosto de componentes JavaScript en el bundle de cliente ni abstracciones propietarias.</Option>
    <Option>Que daisyUI no permite utilizar clases utilitarias de Tailwind para evitar inconsistencias en el diseño.</Option>
    <Option>Que solo funciona en componentes de servidor (React Server Components).</Option>
  </Question>
  <Question title="¿Cuál es la mejor práctica al combinar daisyUI con Tailwind CSS en una interfaz de usuario?">
    <Option>Usar daisyUI para todas las etiquetas y prohibir el uso de utilidades de Tailwind en el mismo componente.</Option>
    <Option>Sobreescribir los temas de daisyUI aplicando estilos en línea mediante el atributo style de React.</Option>
    <Option correct>Usar daisyUI para la identidad semántica y colores temáticos (btn, card, bg-base-100) y utilidades de Tailwind para el layout, espaciado y responsividad (grid, flex, gap-4, md:flex-row).</Option>
    <Option>Reemplazar todas las clases de daisyUI por valores arbitrarios entre corchetes.</Option>
  </Question>
</Quiz>
