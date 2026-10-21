---
sidebar_position: 5
description: "Desarrolla una actividad practica construyendo componentes con daisyUI y siguiendo la estructura por features, con criterios de entrega y rúbrica."
---

import Tabs from '@theme/Tabs';
import TabItem from '@theme/TabItem';
import DaisyPreview from '@site/src/components/DaisyPreview';

# Actividad: Componentes con daisyUI

En esta actividad práctica construirás e integrarás una biblioteca de componentes modulares, accesibles y responsivos para Next.js (App Router), combinando la velocidad de las clases de utilidad de **Tailwind CSS v4** con la semántica visual de **daisyUI 5** y los lineamientos de diseño institucional de la Universidad Icesi.

Como diseñadores y desarrolladores de entornos digitales, el objetivo no es solo maquetar interfaces atractivas, sino organizar el código de manera profesional: componentes reutilizables, contratos de *props* tipados con TypeScript, jerarquía visual coherente y separación estricta entre responsabilidades.

<CardGrid cols={3}>
  <Card
    title="03. Tailwind CSS"
    description="Tokens de diseño, utilidades de espaciado, flexbox, grid y enfoque mobile-first en Tailwind CSS v4."
    link="./03-tailwind-css.md"
  />
  <Card
    title="04. daisyUI"
    description="Componentes semánticos, modificadores visuales, estados de interacción y temas en daisyUI 5."
    link="./04-daisyui.md"
  />
  <Card
    title="Catálogo oficial daisyUI"
    description="Documentación oficial y ejemplos en vivo de botones, badges, modales, navegación y formularios."
    link="https://daisyui.com/components/"
  />
</CardGrid>

---

## 1. Consigna

### Objetivo

Diseñar, maquetar y modularizar componentes de interfaz web siguiendo las especificaciones técnicas de diseño atómico y los principios arquitectónicos del curso:

1. **Semántica y accesibilidad**: aprovechar las etiquetas nativas HTML y las clases semánticas de daisyUI en lugar de anidar elementos genéricos sin significado.
2. **Modularidad y tipado**: aislar cada elemento en su propio archivo con contratos de *props* explícitos en TypeScript (`interface Props`).
3. **Mobile-first**: garantizar que cada componente se adapte con naturalidad desde pantallas móviles (360 px) hasta monitores de escritorio.
4. **Organización por features**: ubicar cada archivo en la estructura de carpetas por *features* y *shared* explicada en [01. Estructura por Features](./01-estructura-por-features.md).

### Regla de estructura y colocación

Cada componente debe vivir en un **archivo propio e independiente**. Está estrictamente prohibido acumular múltiples componentes en un solo archivo o crear carpetas globales "por tipo" desordenadas:

* **Componentes genéricos reutilizables** (botones base, badges de estado, alertas, modales de confirmación, indicadores de métrica): deben ubicarse en `src/shared/components/ui/<nombre-componente>.tsx`.
* **Componentes ligados a una funcionalidad específica** (tarjetas de curso, panel de backlog, formulario de tutoría, tarjetas de perfil docente): deben ubicarse dentro de su feature correspondiente en `src/features/<feature>/components/<nombre-componente>.tsx`.

```text title="Estructura por features y shared"
src/
├── features/
│   ├── auth/
│   │   └── components/       # Componentes de login y register
│   ├── courses/
│   │   └── components/       # course-card.tsx
│   ├── tutoring/
│   │   └── components/       # tutoring-request-form.tsx
│   └── projects/
│       └── components/       # sprint-accordion-panel.tsx
└── shared/
    └── components/
        └── ui/               # action-button.tsx, status-badge.tsx, alert-banner.tsx, etc.
```

---

## 2. Qué se califica

El catálogo de esta guía contiene **20 ejercicios progresivos** organizados en tres niveles de complejidad. Para aprobar la actividad debes entregar una **selección mínima de 7 componentes**, distribuida con el siguiente criterio técnico:

### Selección requerida (7 componentes)

1. **Nivel 1 — Átomos Visuales (2 componentes a elección):**
   * *Recomendados:* **01. Botón de Acción** (`src/shared/components/ui/action-button.tsx`) y **03. Banner de Alerta** (`src/shared/components/ui/alert-banner.tsx`).
   * *Alternativas válidas:* 02 (Insignia de Estado), 04 (Avatar con Anillo), 05 (Píldora Kbd), 06 (Calificación Visual) o 07 (Métrica Bento Stat).
2. **Nivel 2 — Moléculas e Información (3 componentes a elección):**
   * *Recomendados:* **08. Tarjeta de Asignatura** (`src/features/courses/components/course-card.tsx`), **10. Notificación Flotante Toast** (`src/shared/components/ui/toast-notification.tsx`) y **13. Rastreador de Hitos por Pasos** (`src/shared/components/ui/step-progress-tracker.tsx`).
   * *Alternativas válidas:* 09 (Panel Bento Multi-Métrica), 11 (Globo de Conversación), 12 (Fila de Directorio) o 14 (Selector de Etiquetas).
3. **Nivel 3 — Organismos Complejos (2 componentes a elección):**
   * *Recomendados:* **16. Barra de Navegación con Menú** (`src/shared/components/ui/academic-app-navbar.tsx`) y **18. Diálogo Modal de Confirmación** (`src/shared/components/ui/submission-confirm-modal.tsx`).
   * *Alternativas válidas:* 15 (Tarjeta de Evento con Countdown), 17 (Formulario de Tutoría), 19 (Perfil Docente con Tabs) o 20 (Backlog en Acordeón).

:::tip[Opción de integración en el caso de estudio]
Si deseas un flujo de trabajo más integrado con el proyecto del curso, puedes conectar al menos **2 de tus componentes seleccionados** directamente en las pantallas de Login y Register desarrolladas en [02. Caso de Estudio: Login y Register](./02-caso-de-estudio-login-register.md):
* Utiliza el `ActionButton` (Ejercicio 01) como botón principal con estado de carga interactivo (`isLoading`).
* Utiliza el `AlertBanner` (Ejercicio 03) para desplegar mensajes de error o confirmación de credenciales.
* Utiliza el `SubmissionConfirmModal` (Ejercicio 18) para solicitar confirmación antes de restablecer o enviar el formulario.
:::

:::note[Bonificación técnica]
La implementación de componentes adicionales más allá de los 7 obligatorios, o la finalización de los 20 ejercicios, se considerará como bonificación práctica en la evaluación.
:::

---

## 3. Entrega y rúbrica

### Modalidad de entrega

1. Sube tu proyecto a un **repositorio privado dentro de la organización del curso** en GitHub.
2. Incluye en la raíz del proyecto un archivo `README.md` que indique claramente cuáles componentes implementaste y la ruta de cada uno dentro de la arquitectura de carpetas.
3. Entrega el enlace de tu repositorio en la plataforma del curso.
4. El tiempo de desarrollo y entrega lo indica el profesor en la sesión.

### Rúbrica de evaluación

| Criterio | Descripción | Peso |
| :--- | :--- | :---: |
| **Fidelidad visual** | Respeto riguroso de proporciones, jerarquía tipográfica, espaciados y paleta cromática institucional Icesi (Azul `#5454e9`, Morado `#865cf0`, Verde `#4cb979`, Naranja `#e9683b`, Amarillo `#e4eb60`). | **30%** |
| **Uso correcto de daisyUI y Tailwind** | Aplicación efectiva de clases semánticas de daisyUI combinadas con utilidades de Tailwind sin duplicación de CSS ni estilos inline manuales. | **25%** |
| **Responsive mobile-first** | Comportamiento fluido y sin desbordamientos en pantallas móviles (360 px), escalando ordenadamente hacia tablets y monitores de escritorio. | **15%** |
| **Reutilización de componentes y props tipadas** | Contratos de *props* en TypeScript bien tipados, valores por defecto limpios y uso adecuado de Server/Client Components (sin directivas `'use client'` innecesarias). | **15%** |
| **Organización de carpetas por features** | Estructura de archivos coherente con [01. Estructura por Features](./01-estructura-por-features.md), ubicando cada componente en `src/shared/components/ui/` o en su feature correspondiente. | **15%** |
| **Total** | Cumplimiento integral de los requerimientos y estándares de calidad de la actividad. | **100%** |

---

## 4. Nivel 1: Átomos

Elementos de interfaz de propósito único, altamente reutilizables y con dependencias mínimas.

### 01. Botón de Acción con Estado de Carga y Badge

<Tabs>
<TabItem value="vista" label="Componente & Vista" default>

<DaisyPreview id={1} height="135px" />

Botón de acción interactivo que combina un icono vectorial, etiqueta descriptiva, una insignia (*badge*) tonal informativa a la derecha (ej. formato de archivo "PDF") y soporte para alternar dinámicamente a un estado de carga (*loading spinner*).

</TabItem>
<TabItem value="consejos" label="Consejos & Guía">

* **Ubicación sugerida:** `src/shared/components/ui/action-button.tsx`
* **Propósito:** Proveer un botón base estandarizado para toda la aplicación con soporte para estados visuales (normal, cargando, deshabilitado) sin duplicar código CSS.
* **Estilo DaisyUI sugerido:** Tema institucional `icesi` con variante principal `btn-primary` (Azul Icesi `#5454e9`) y badge contextual en `badge-secondary` (Morado Icesi `#865cf0`).
* **Contrato de Props sugerido (TypeScript):**
  ```typescript title="src/shared/components/ui/action-button.tsx"
  interface ActionButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
    label: string;
    icon?: React.ReactNode;
    badgeText?: string;
    isLoading?: boolean;
    variant?: 'primary' | 'secondary' | 'outline' | 'ghost';
    size?: 'sm' | 'md' | 'lg';
  }
  ```
* **Clases base de DaisyUI sugeridas:** `btn`, `btn-primary`, `btn-outline`, `loading loading-spinner loading-xs`, `badge`, `badge-secondary`, `badge-sm`.
* **Qué usar:**
  * Mantén el componente como **Server Component** si solo se utiliza como enlace estilizado (`<Link>`), o conviértelo en componente cliente (`'use client'`) únicamente si maneja eventos interactivos `onClick` con hooks de estado local.
  * Extiende `React.ButtonHTMLAttributes<HTMLButtonElement>` para heredar nativamente propiedades como `type`, `disabled` y `aria-label`.
* **Qué EVITAR:**
  * **No** crees tu propio spinner SVG personalizado con animaciones manuales cuando DaisyUI ya incluye `loading loading-spinner`.
  * **No** agregues estilos inline con `style={{ backgroundColor: '#5454e9' }}`: utiliza la abstracción de temas semánticos de DaisyUI (`btn-primary`).

</TabItem>
</Tabs>

---

### 02. Insignia de Estado Tonal con Indicador Luminoso

<Tabs>
<TabItem value="vista" label="Componente & Vista" default>

<DaisyPreview id={2} height="135px" />

Micro-componente en forma de píldora que combina un punto luminoso parpadeante (*pulsing dot*) con una etiqueta textual para comunicar visualmente el estado académico o administrativo de un registro (activo con Verde Icesi `#4cb979`, en revisión con Morado `#865cf0`, pendiente con Naranja `#e9683b`).

</TabItem>
<TabItem value="consejos" label="Consejos & Guía">

* **Ubicación sugerida:** `src/shared/components/ui/status-badge.tsx`
* **Propósito:** Mostrar de manera inmediata el ciclo de vida o condición de una entidad sin sobrecargar la interfaz.
* **Estilo DaisyUI sugerido:** Modificadores de estado semánticos con la paleta complementaria Icesi: Verde Icesi (`#4cb979` / `badge-success`), Morado Icesi (`#865cf0` / `badge-secondary`) y Naranja Icesi (`#e9683b` / `badge-error`).
* **Contrato de Props sugerido (TypeScript):**
  ```typescript title="src/shared/components/ui/status-badge.tsx"
  type BadgeStatus = 'active' | 'pending' | 'danger' | 'neutral';

  interface StatusBadgeProps {
    status: BadgeStatus;
    label: string;
    hasPulse?: boolean;
    className?: string;
  }
  ```
* **Clases base de DaisyUI & Tailwind sugeridas:** `badge`, `badge-outline`, utilidades de Tailwind `inline-flex items-center gap-2`, `w-2 h-2 rounded-full animate-pulse`.
* **Qué usar:**
  * **Server Component 100% puro**: este componente es estrictamente visual y jamás requiere `'use client'`.
  * Utiliza un diccionario interno (mapa de objetos o `switch`) para asociar cada valor de `status` con sus clases semánticas de color.
* **Qué EVITAR:**
  * **No** uses nombres de colores arbitrarios en las props (ej. `color="green"` o `color="red"`). Utiliza nombres de estado semánticos (`status="active"`).
  * **No** anides contenedores innecesarios: un único elemento semántico `<span>` es suficiente.

</TabItem>
</Tabs>

---

### 03. Banner de Alerta Informativa Institucional

<Tabs>
<TabItem value="vista" label="Componente & Vista" default>

<DaisyPreview id={3} height="135px" />

Bloque de notificación destacado que presenta un icono vectorial informativo en Azul Icesi (`#5454e9`), un título en negrita, cuerpo explicativo y un botón de acción secundaria para dirigir al usuario a la acción correspondiente.

</TabItem>
<TabItem value="consejos" label="Consejos & Guía">

* **Ubicación sugerida:** `src/shared/components/ui/alert-banner.tsx`
* **Propósito:** Desplegar anuncios institucionales importantes (aperturas de matrícula, avisos de sistema, mantenimiento programado) en la cabecera de las vistas.
* **Estilo DaisyUI sugerido:** Componente `alert` combinado con `alert-info` en tonos de Azul Icesi (`#5454e9` / `bg-[#f0f0fd]`).
* **Contrato de Props sugerido (TypeScript):**
  ```typescript title="src/shared/components/ui/alert-banner.tsx"
  interface AlertBannerProps {
    title: string;
    description: string;
    type?: 'info' | 'success' | 'warning' | 'error';
    actionLabel?: string;
    onActionClick?: () => void;
  }
  ```
* **Clases base de DaisyUI sugeridas:** `alert`, `alert-info`, `alert-warning`, `alert-success`, `btn btn-xs btn-outline`.
* **Qué usar:**
  * Si la acción es una navegación hacia otra ruta (ej. un link a `/calendario`), renderiza un componente `<Link href="...">` de Next.js en lugar de un botón con manejador imperativo.
  * Añade el atributo accesible `role="alert"` o `aria-live="polite"` para lectores de pantalla.
* **Qué EVITAR:**
  * **No** fuerces `'use client'` si el banner solo renderiza texto y un enlace hacia otra página.
  * **No** coloques textos de alerta con contrastes deficientes que no cumplan con el estándar WCAG AA.

</TabItem>
</Tabs>

---

### 04. Avatar de Usuario con Anillo de Presencia y Rol

<Tabs>
<TabItem value="vista" label="Componente & Vista" default>

<DaisyPreview id={4} height="135px" />

Conjunto atómico que incluye fotografía circular del usuario con anillo exterior (*ring*) en color Azul Icesi (`#5454e9`), indicador verde de conexión en vivo con Verde Icesi (`#4cb979`), nombre, badge de rol académico y ubicación actual.

</TabItem>
<TabItem value="consejos" label="Consejos & Guía">

* **Ubicación sugerida:** `src/shared/components/ui/user-avatar.tsx`
* **Propósito:** Identificar visualmente a profesores, monitores de laboratorio o compañeros de equipo en paneles de contacto y listas de tutoría.
* **Estilo DaisyUI sugerido:** Clases `avatar online` (u `offline`) combinadas con `ring ring-primary ring-offset-2`.
* **Contrato de Props sugerido (TypeScript):**
  ```typescript title="src/shared/components/ui/user-avatar.tsx"
  interface UserAvatarProps {
    name: string;
    role: string;
    program?: string;
    avatarUrl: string;
    isOnline?: boolean;
    locationText?: string;
    size?: 'sm' | 'md' | 'lg';
  }
  ```
* **Clases base de DaisyUI sugeridas:** `avatar`, `avatar online`, `avatar offline`, `rounded-full ring ring-primary ring-offset-base-100`, `badge badge-primary badge-xs`.
* **Qué usar:**
  * En proyectos Next.js productivos, utiliza `next/image` (`<Image />`) con dimensiones `width={56}` y `height={56}` para optimización automática de imágenes en el servidor.
  * Añade texto alternativo semántico descriptivo con el nombre del usuario (`alt="Fotografía de perfil de..."`).
* **Qué EVITAR:**
  * **No** calcules manualmente la posición absoluta del punto verde con coordenadas fijas: la clase `avatar online` de DaisyUI posiciona automáticamente el indicador.
  * **No** olvides incluir un *fallback* tipográfico con las iniciales del nombre si la URL de la imagen falla o es nula.

</TabItem>
</Tabs>

---

### 05. Píldora de Atajo de Teclado con Kbd

<Tabs>
<TabItem value="vista" label="Componente & Vista" default>

<DaisyPreview id={5} height="120px" />

Fila compacta con etiqueta descriptiva a la izquierda y teclas físicas simuladas mediante elementos semánticos `<kbd>` a la derecha, ideal para paletas de comandos o menús de navegación rápida.

</TabItem>
<TabItem value="consejos" label="Consejos & Guía">

* **Ubicación sugerida:** `src/shared/components/ui/shortcut-pill.tsx`
* **Propósito:** Informar al usuario de atajos rápidos de teclado para potenciar la productividad y accesibilidad.
* **Estilo DaisyUI sugerido:** Clases `kbd kbd-sm` con fondo blanco y sombra sutil sobre un contenedor neutro `bg-base-200` y borde en Gris 2 (`#cecfd4`).
* **Contrato de Props sugerido (TypeScript):**
  ```typescript title="src/shared/components/ui/shortcut-pill.tsx"
  interface ShortcutPillProps {
    label: string;
    keys: string[]; // Ej: ['⌘ Cmd', 'K'] o ['Ctrl', 'Shift', 'P']
  }
  ```
* **Clases base de DaisyUI sugeridas:** `kbd`, `kbd-sm`, `kbd-xs`, combinadas con flexbox `flex items-center justify-between`.
* **Qué usar:**
  * Renderiza los elementos con la etiqueta semántica HTML `<kbd>`.
  * Utiliza un `.map()` sobre el arreglo `keys` intercalando un separador sutil `+` entre teclas.
* **Qué EVITAR:**
  * **No** hagas este componente cliente: el mapeo de teclas es estático y se renderiza eficientemente en el servidor.
  * **No** uses tamaños desproporcionados: los elementos `kbd` deben ser discretos y armonizar con la tipografía del cuerpo.

</TabItem>
</Tabs>

---

### 06. Indicador de Calificación por Estrellas

<Tabs>
<TabItem value="vista" label="Componente & Vista" default>

<DaisyPreview id={6} height="120px" />

Componente visual de valoración que despliega estrellas con soporte para medias calificaciones (*half stars*), puntuación numérica destacada y cantidad total de evaluaciones registradas.

</TabItem>
<TabItem value="consejos" label="Consejos & Guía">

* **Ubicación sugerida:** `src/shared/components/ui/rating-display.tsx`
* **Propósito:** Mostrar calificaciones de asignaturas, talleres o valoraciones docentes en catálogos y fichas de curso.
* **Estilo DaisyUI sugerido:** Componente `rating rating-sm rating-half` con máscaras `mask mask-star-2 bg-[#e9683b]` (Naranja Icesi) o amarillo institucional.
* **Contrato de Props sugerido (TypeScript):**
  ```typescript title="src/shared/components/ui/rating-display.tsx"
  interface RatingDisplayProps {
    score: number; // Ej: 4.8 sobre 5.0
    totalReviews?: number;
    showScoreText?: boolean;
    maxScore?: number;
  }
  ```
* **Clases base de DaisyUI sugeridas:** `rating`, `rating-sm`, `rating-half`, `mask mask-star-2`.
* **Qué usar:**
  * Si el componente solo muestra una puntuación existente (modo solo lectura), desmarca los inputs con `disabled` o renderiza estrellas vectoriales SVG estáticas.
  * Asegura el atributo de accesibilidad para lectores de pantalla (`aria-label="Calificación de..."`).
* **Qué EVITAR:**
  * **No** instales librerías externas pesadas cuando DaisyUI resuelve el sistema de máscaras de estrellas con CSS puro.
  * **No** redondees números bruscamente en el renderizado sin permitir un decimal claro (`score.toFixed(1)`).

</TabItem>
</Tabs>

---

### 07. Caja Bento de Métrica Académica

<Tabs>
<TabItem value="vista" label="Componente & Vista" default>

<DaisyPreview id={7} height="185px" />

Tarjeta informativa estilo bento que presenta un indicador cuantitativo principal (ej. Promedio Acumulado GPA), icono institucional en contenedor tonal Azul Icesi (`#5454e9`), y tendencia porcentual con comparativa semestral en Verde Icesi (`#4cb979`).

</TabItem>
<TabItem value="consejos" label="Consejos & Guía">

* **Ubicación sugerida:** `src/shared/components/ui/metric-bento-stat.tsx`
* **Propósito:** Presentar KPIs académicos en paneles de control y dashboards de estudiante o profesor.
* **Estilo DaisyUI sugerido:** Componente `stat` con fondo blanco, bordes en Gris 2 (`#cecfd4`) y textos en Azul Icesi `text-primary` (`#5454e9`).
* **Contrato de Props sugerido (TypeScript):**
  ```typescript title="src/shared/components/ui/metric-bento-stat.tsx"
  interface MetricBentoStatProps {
    title: string;
    value: string | number;
    maxValue?: string | number;
    trendText?: string;
    trendType?: 'positive' | 'negative' | 'neutral';
    icon: React.ReactNode;
  }
  ```
* **Clases base de DaisyUI sugeridas:** `stat`, `stat-figure`, `stat-title`, `stat-value`, `stat-desc`.
* **Qué usar:**
  * Excelente candidato para un **React Server Component asíncrono** (`async function MetricBentoStat(...)`) que consulte directamente la métrica en la base de datos o servicio antes de renderizar el HTML.
  * Aplica `text-primary` (`#5454e9`) para el valor numérico principal y `text-[#4cb979]` para tendencias positivas.
* **Qué EVITAR:**
  * **No** uses fuentes de texto desordenadas: mantén coherencia tipográfica utilizando la jerarquía estandarizada de DaisyUI (`stat-title`, `stat-value`).
  * **No** uses hooks de estado (`useState`) para datos numéricos estáticos provenientes del servidor.

</TabItem>
</Tabs>

---

## 5. Nivel 2: Moléculas

Componentes compuestos que agrupan múltiples átomos y gestionan estructuras de datos complejas.

### 08. Tarjeta de Asignatura con Barra de Progreso

<Tabs>
<TabItem value="vista" label="Componente & Vista" default>

<DaisyPreview id={8} height="260px" />

Tarjeta modular que resume la información de un curso universitario: cabecera con gradiente institucional (Azul Icesi `#5454e9` a Morado Icesi `#865cf0`), código de asignatura, badge de créditos académicos, docente a cargo, salón, barra de progreso del semestre y acciones de acceso.

</TabItem>
<TabItem value="consejos" label="Consejos & Guía">

* **Ubicación sugerida:** `src/features/courses/components/course-card.tsx`
* **Propósito:** Tarjeta principal para la grilla del catálogo de asignaturas matriculadas del estudiante.
* **Estilo DaisyUI sugerido:** `card bg-base-100 shadow-sm border border-[#cecfd4]`, barra `progress progress-primary` y botones de acción en `card-actions`.
* **Contrato de Props sugerido (TypeScript):**
  ```typescript title="src/features/courses/components/course-card.tsx"
  interface CourseCardProps {
    courseCode: string;
    title: string;
    instructor: string;
    room: string;
    credits: number;
    progressPercentage: number;
    courseUrl: string;
    syllabusUrl?: string;
  }
  ```
* **Clases base de DaisyUI sugeridas:** `card`, `card-body`, `card-title`, `card-actions`, `progress progress-primary`, `badge badge-outline`, `btn btn-sm btn-primary`.
* **Qué usar:**
  * Enlaza el botón "Entrar al Aula" con el componente `<Link href="...">` de Next.js para habilitar navegación instantánea (*client-side routing*) y precarga (*prefetching*).
  * Maneja un borde superior o cabecera decorativa con el degradado oficial `bg-gradient-to-r from-[#5454e9] to-[#865cf0]`.
* **Qué EVITAR:**
  * **No** satures la tarjeta con más de dos botones primarios; respeta la jerarquía visual destinando un botón transparente/fantasma (`btn-ghost`) para el sílabo y uno relleno (`btn-primary`) para la acción principal.
  * **No** olvides acotar valores del progreso: el valor de `progressPercentage` debe estar normalizado entre 0 y 100.

</TabItem>
</Tabs>

---

### 09. Panel de Analítica Bento Multi-Métrica

<Tabs>
<TabItem value="vista" label="Componente & Vista" default>

<DaisyPreview id={9} height="175px" />

Panel horizontal que acopla múltiples indicadores de rendimiento académico en una sola unidad cohesiva con divisores internos, iconos vectoriales y subtítulos porcentuales en Verde Icesi (`#4cb979`) y Morado Icesi (`#865cf0`).

</TabItem>
<TabItem value="consejos" label="Consejos & Guía">

* **Ubicación sugerida:** `src/shared/components/ui/analytics-bento-grid.tsx`
* **Propósito:** Mostrar una vista sinóptica del progreso curricular del estudiante en la cabecera del portal académico.
* **Estilo DaisyUI sugerido:** Agrupador `stats stats-horizontal shadow-sm border border-[#cecfd4] bg-base-100`.
* **Contrato de Props sugerido (TypeScript):**
  ```typescript title="src/shared/components/ui/analytics-bento-grid.tsx"
  interface StatItem {
    label: string;
    value: string | number;
    total?: string | number;
    description: string;
    icon: React.ReactNode;
    colorVariant?: 'primary' | 'secondary';
  }

  interface AnalyticsBentoGridProps {
    stats: StatItem[];
  }
  ```
* **Clases base de DaisyUI sugeridas:** `stats`, `stats-vertical lg:stats-horizontal`, `stat`, `stat-figure`, `stat-title`, `stat-value`, `stat-desc`.
* **Qué usar:**
  * Utiliza la clase adaptativa `stats-vertical lg:stats-horizontal` para que en pantallas móviles los bloques se apilen verticalmente y en monitores de escritorio se alineen en fila.
  * Utiliza un `.map()` tipado sobre el arreglo `stats` para asegurar que el componente pueda renderizar 2, 3 o 4 métricas dinámicamente.
* **Qué EVITAR:**
  * **No** construyas el contenedor con divs manuales y bordes independientes cuando DaisyUI ya gestiona los divisores internos del grupo `stats`.
  * **No** repitas iconos idénticos para métricas distintas.

</TabItem>
</Tabs>

---

### 10. Notificación Flotante Estilo Toast Institucional

<Tabs>
<TabItem value="vista" label="Componente & Vista" default>

<DaisyPreview id={10} height="135px" />

Tarjeta flotante de confirmación de eventos con icono circular de éxito en Verde Icesi (`#4cb979`), mensaje descriptivo, identificador de transacción o commit y botón de descarte rápido.

</TabItem>
<TabItem value="consejos" label="Consejos & Guía">

* **Ubicación sugerida:** `src/shared/components/ui/toast-notification.tsx`
* **Propósito:** Notificar al estudiante cuando una entrega de laboratorio ha sido recibida y confirmada exitosamente.
* **Estilo DaisyUI sugerido:** `alert alert-success shadow-md rounded-2xl` con fondo blanco y acentos en Verde Icesi (`#4cb979`).
* **Contrato de Props sugerido (TypeScript):**
  ```typescript title="src/shared/components/ui/toast-notification.tsx"
  interface ToastNotificationProps {
    title: string;
    message: string;
    variant?: 'success' | 'info' | 'warning' | 'error';
    onClose?: () => void;
  }
  ```
* **Clases base de DaisyUI sugeridas:** `toast`, `toast-top toast-end`, `alert`, `alert-success`, `btn btn-xs btn-ghost`.
* **Qué usar:**
  * Si vas a posicionarlo de forma flotante fija en la ventana del navegador, envuelve la alerta en el contenedor `toast toast-top toast-end`.
  * Diseña el componente con estado controlado para permitir que el usuario lo cierre manualmente o que desaparezca tras un temporizador en componentes cliente.
* **Qué EVITAR:**
  * **No** uses colores de alerta demasiado oscuros que tapen la información; el estilo contemporáneo prefiere fondos blancos con bordes y acentos semánticos tenues.
  * **No** olvides incluir el botón de cierre con accesibilidad (`aria-label="Cerrar notificación"`).

</TabItem>
</Tabs>

---

### 11. Globo de Conversación de Asesoría Académica

<Tabs>
<TabItem value="vista" label="Componente & Vista" default>

<DaisyPreview id={11} height="240px" />

Hilo de mensajería asincrónica que posiciona los mensajes del estudiante a la izquierda y las respuestas del docente o monitor a la derecha con Azul Icesi (`#5454e9`), marcas de tiempo y avatar de usuario.

</TabItem>
<TabItem value="consejos" label="Consejos & Guía">

* **Ubicación sugerida:** `src/features/advising/components/advisor-chat-bubble.tsx`
* **Propósito:** Estructurar canales de consulta y retroalimentación académica uno a uno entre estudiantes y docentes.
* **Estilo DaisyUI sugerido:** Componentes `chat chat-start` y `chat chat-end` con burbuja docente en `chat-bubble chat-bubble-primary` (`#5454e9`).
* **Contrato de Props sugerido (TypeScript):**
  ```typescript title="src/features/advising/components/advisor-chat-bubble.tsx"
  interface ChatMessageProps {
    senderName: string;
    senderRole?: string;
    message: string;
    timestamp: string;
    avatarUrl: string;
    isSenderTeacher?: boolean;
    deliveryStatus?: string;
  }
  ```
* **Clases base de DaisyUI sugeridas:** `chat`, `chat-start`, `chat-end`, `chat-image`, `chat-header`, `chat-bubble`, `chat-bubble-primary`, `chat-footer`.
* **Qué usar:**
  * Aprovecha la estructura semántica de DaisyUI: `chat-header` para el nombre y la hora, `chat-bubble` para el texto y `chat-footer` para el acuse de recibo.
  * Permite que el booleano `isSenderTeacher` alterne limpiamente entre la alineación `chat-start` y `chat-end`.
* **Qué EVITAR:**
  * **No** maquetes las colas de las burbujas de diálogo con trucos complejos de CSS cuando DaisyUI ya las calcula con precisión de diseño nativo.
  * **No** mezcles lógica de sockets o streaming directamente dentro de este componente de presentación.

</TabItem>
</Tabs>

---

### 12. Fila de Directorio Estudiantil con Menú de Acciones

<Tabs>
<TabItem value="vista" label="Componente & Vista" default>

<DaisyPreview id={12} height="130px" />

Fila de tabla de datos administrativos que organiza avatar con máscara de esquinas redondeadas (*squircle*), nombre y código del estudiante, programa académico, badge de estado en Verde Icesi (`#4cb979`) y botón de acción en Azul Icesi (`#5454e9`).

</TabItem>
<TabItem value="consejos" label="Consejos & Guía">

* **Ubicación sugerida:** `src/features/students/components/student-table-row.tsx`
* **Propósito:** Renderizar cada elemento de una lista tabular de inscritos o participantes de un laboratorio.
* **Estilo DaisyUI sugerido:** `table table-sm` con efecto `hover:bg-slate-50`, máscara `mask mask-squircle` en el avatar y botón `btn-ghost btn-xs text-primary`.
* **Contrato de Props sugerido (TypeScript):**
  ```typescript title="src/features/students/components/student-table-row.tsx"
  interface StudentTableRowProps {
    studentId: string;
    studentCode: string;
    fullName: string;
    program: string;
    avatarUrl: string;
    status: 'active' | 'inactive' | 'graduated';
    onViewGradesClick?: () => void;
  }
  ```
* **Clases base de DaisyUI sugeridas:** `table`, `mask mask-squircle`, `avatar`, `badge`, `btn btn-ghost btn-xs`.
* **Qué usar:**
  * Renderiza el componente como un elemento `<tr>` puro para respetar la jerarquía HTML nativa de tablas dentro de un `<tbody>`.
  * Es ideal para ser renderizado dentro de un Server Component que itere sobre un arreglo de estudiantes traído de una consulta de base de datos.
* **Qué EVITAR:**
  * **No** envuelvas el `<tr>` en un `<div>`: romperás la validez del DOM de la tabla HTML.
  * **No** dejes los avatares sin máscara cuando DaisyUI ofrece la elegante clase `mask mask-squircle`.

</TabItem>
</Tabs>

---

### 13. Rastreador de Hitos de Entrega por Pasos

<Tabs>
<TabItem value="vista" label="Componente & Vista" default>

<DaisyPreview id={13} height="130px" />

Línea de tiempo secuencial que ilustra los hitos o sprints de un proyecto de desarrollo, indicando qué etapas han sido completadas con Azul Icesi (`#5454e9`), cuál se encuentra activa hoy y cuáles están pendientes.

</TabItem>
<TabItem value="consejos" label="Consejos & Guía">

* **Ubicación sugerida:** `src/shared/components/ui/step-progress-tracker.tsx`
* **Propósito:** Ofrecer retroalimentación visual clara sobre el flujo de entregables de un proyecto integrador o taller.
* **Estilo DaisyUI sugerido:** Lista no ordenada `<ul className="steps steps-horizontal">` con pasos activos en `step-primary` (`#5454e9`).
* **Contrato de Props sugerido (TypeScript):**
  ```typescript title="src/shared/components/ui/step-progress-tracker.tsx"
  interface StepItem {
    label: string;
    isCompleted: boolean;
    isCurrent?: boolean;
    stepNumber?: number | string;
  }

  interface StepProgressTrackerProps {
    steps: StepItem[];
  }
  ```
* **Clases base de DaisyUI sugeridas:** `steps`, `steps-horizontal`, `step`, `step-primary`, atributo `data-content="✓"`.
* **Qué usar:**
  * Utiliza el atributo HTML `data-content` de DaisyUI para personalizar el contenido del círculo del paso (ej. `data-content="✓"` para pasos completados).
  * Soporta diseño responsive con `steps-vertical md:steps-horizontal` si la lista tiene más de 4 hitos.
* **Qué EVITAR:**
  * **No** calcules líneas horizontales con bordes absolutos: DaisyUI calcula los conectores entre nodos automáticamente mediante CSS.
  * **No** omitas etiquetas de texto accesibles para lectores de pantalla.

</TabItem>
</Tabs>

---

### 14. Selector de Etiquetas Temáticas con Checkboxes

<Tabs>
<TabItem value="vista" label="Componente & Vista" default>

<DaisyPreview id={14} height="145px" />

Grupo interactivo de filtros temáticos presentados como píldoras de insignia (*badges*) activables, donde las etiquetas seleccionadas adoptan el Azul Icesi (`#5454e9`) y las disponibles permanecen neutras en Gris 2 (`#cecfd4`).

</TabItem>
<TabItem value="consejos" label="Consejos & Guía">

* **Ubicación sugerida:** `src/shared/components/ui/tag-filter-group.tsx`
* **Propósito:** Permitir al estudiante o docente filtrar recursos, módulos o temas de estudio por categorías tecnológicas.
* **Estilo DaisyUI sugerido:** `badge badge-lg` estilizados como controles de formulario mediante el truco CSS `peer-checked`.
* **Contrato de Props sugerido (TypeScript):**
  ```typescript title="src/shared/components/ui/tag-filter-group.tsx"
  interface TagOption {
    id: string;
    name: string;
    isSelected: boolean;
  }

  interface TagFilterGroupProps {
    title: string;
    tags: TagOption[];
    onTagToggle?: (tagId: string) => void;
  }
  ```
* **Clases base de DaisyUI & Tailwind sugeridas:** `badge`, `badge-lg`, `cursor-pointer`, `hidden peer`, `peer-checked:bg-primary peer-checked:text-white`.
* **Qué usar:**
  * Oculta el `<input type="checkbox" className="hidden peer" />` dentro del `<label>` y estiliza el `<span>` adyacente con modificadores `peer-checked:` de Tailwind.
  * Si la selección altera los parámetros de búsqueda en la URL, enlaza cada tag con un `<Link href="...">` que manipule los `searchParams` en un Server Component.
* **Qué EVITAR:**
  * **No** fuerces estados imperativos si los filtros pueden persistirse de forma canónica en la URL (`?tech=tailwind&tech=daisyui`).
  * **No** olvides proporcionar foco por teclado (`focus-visible:ring-2`) para usuarios que navegan con `Tab`.

</TabItem>
</Tabs>

---

## 6. Nivel 3: Organismos

Estructuras completas de interfaz que orquestan múltiples moléculas, layouts y flujos de acción.

### 15. Tarjeta de Evento o Hackathon con Cuenta Regresiva

<Tabs>
<TabItem value="vista" label="Componente & Vista" default>

<DaisyPreview id={15} height="280px" />

Tarjeta de convocatoria institucional que incluye distintivo de evento, indicador de cupos restantes en Naranja Icesi (`#e9683b`), título, horario y auditorio, un reloj modular de cuenta regresiva en tipografía monoespaciada con dígitos en Azul Icesi (`#5454e9`) y botón de registro de equipo.

</TabItem>
<TabItem value="consejos" label="Consejos & Guía">

* **Ubicación sugerida:** `src/features/events/components/event-countdown-card.tsx`
* **Propósito:** Promover talleres extracurriculares, retos de desarrollo y eventos de la facultad de ingeniería.
* **Estilo DaisyUI sugerido:** `card bg-base-100 border border-[#cecfd4]`, componente `countdown font-mono` y botón prominente `btn-primary` (`#5454e9`).
* **Contrato de Props sugerido (TypeScript):**
  ```typescript title="src/features/events/components/event-countdown-card.tsx"
  interface EventCountdownCardProps {
    eventTitle: string;
    categoryTag: string;
    spotsLeft: number;
    location: string;
    dateText: string;
    countdown: {
      days: number;
      hours: number;
      minutes: number;
    };
    onRegisterClick?: () => void;
  }
  ```
* **Clases base de DaisyUI sugeridas:** `card`, `countdown font-mono text-2xl font-bold text-primary`, `badge badge-primary`, `btn btn-primary w-full`.
* **Qué usar:**
  * DaisyUI provee la clase `countdown` que sincroniza estilos de dígitos tabulares.
  * Si la cuenta regresiva disminuye en tiempo real cada segundo, encapsula únicamente el reloj en una frontera `'use client'`, permitiendo que el resto de la tarjeta se renderice como Server Component.
* **Qué EVITAR:**
  * **No** coloques todo el evento bajo `'use client'` solo porque el reloj se actualiza; aprovecha el patrón de composición pasando el cliente como hijo de un Server Component.
  * **No** omitas el indicador de urgencia cuando queden pocos cupos.

</TabItem>
</Tabs>

---

### 16. Barra de Navegación de Aplicación con Menú de Usuario

<Tabs>
<TabItem value="vista" label="Componente & Vista" default>

<DaisyPreview id={16} height="130px" />

Barra de cabecera que unifica el logo institucional en Azul Icesi (`#5454e9`), nombre del portal y período académico a la izquierda, junto a un botón de notificaciones con badge contador en Morado Icesi (`#865cf0`) y avatar con menú desplegable a la derecha.

</TabItem>
<TabItem value="consejos" label="Consejos & Guía">

* **Ubicación sugerida:** `src/shared/components/ui/academic-app-navbar.tsx`
* **Propósito:** Cabecera principal persistente para la navegación del portal dentro de los layouts (`layout.tsx`) de Next.js.
* **Estilo DaisyUI sugerido:** `navbar bg-base-100 border-b border-[#cecfd4]`, indicador de notificaciones `indicator` con `badge-secondary` (`#865cf0`).
* **Contrato de Props sugerido (TypeScript):**
  ```typescript title="layout.tsx"
  interface UserSessionData {
    name: string;
    avatarUrl: string;
    notificationsCount: number;
    currentTerm: string;
  }

  interface AcademicAppNavbarProps {
    brandName: string;
    user: UserSessionData;
  }
  ```
* **Clases base de DaisyUI sugeridas:** `navbar`, `navbar-start`, `navbar-end`, `indicator`, `indicator-item`, `badge badge-xs badge-secondary`, `avatar online`.
* **Qué usar:**
  * Es el candidato ideal para vivir en `app/layout.tsx` como un Server Component que reciba la sesión autenticada del servidor sin revelar credenciales en el cliente.
  * Utiliza un componente `<Link href="/">` para el logotipo para retornar siempre a la raíz del portal.
* **Qué EVITAR:**
  * **No** agregues `'use client'` a toda la barra de navegación; si el dropdown requiere interacción, aísla solo el menú desplegable en un componente cliente independiente.
  * **No** fijes alturas rígidas en píxeles que colapsen el diseño en dispositivos móviles.

</TabItem>
</Tabs>

---

### 17. Formulario Modular de Solicitud de Tutoría

<Tabs>
<TabItem value="vista" label="Componente & Vista" default>

<DaisyPreview id={17} height="300px" />

Formulario en tarjeta modular que incluye selector desplegable de tema de asesoría, área de texto multilínea para describir la inquietud técnica y botón primario de envío de solicitud en Azul Icesi (`#5454e9`).

</TabItem>
<TabItem value="consejos" label="Consejos & Guía">

* **Ubicación sugerida:** `src/features/tutoring/components/tutoring-request-form.tsx`
* **Propósito:** Permitir a los estudiantes agendar asesorías de apoyo técnico con monitores o profesores de la asignatura.
* **Estilo DaisyUI sugerido:** `card bg-base-100 border border-[#cecfd4]`, campos `select select-bordered select-sm` y `textarea textarea-bordered textarea-sm`.
* **Contrato de Props sugerido (TypeScript):**
  ```typescript title="src/features/tutoring/components/tutoring-request-form.tsx"
  interface TutoringTopicOption {
    id: string;
    label: string;
  }

  interface TutoringRequestFormProps {
    availableTopics: TutoringTopicOption[];
    actionHandler?: (formData: FormData) => Promise<void>; // Server Action
  }
  ```
* **Clases base de DaisyUI sugeridas:** `form-control`, `label`, `label-text`, `select select-bordered`, `textarea textarea-bordered`, `btn btn-primary btn-sm`.
* **Qué usar:**
  * En Next.js 16, puedes conectar este formulario directamente con una **Server Action** mediante `<form action={...}>` utilizando el atributo de acción sin requerir `'use client'` ni `preventDefault()`.
  * Utiliza los atributos semánticos `required`, `placeholder` y `name` en cada campo para que el objeto `FormData` se procese de forma nativa en el servidor.
* **Qué EVITAR:**
  * **No** utilices `onChange` con un `useState` para cada campo de texto a menos que requieras validación en vivo carácter por carácter.
  * **No** olvides especificar el atributo `name` en los elementos `<select>` y `<textarea>`.

</TabItem>
</Tabs>

---

### 18. Diálogo Modal de Confirmación de Entrega

<Tabs>
<TabItem value="vista" label="Componente & Vista" default>

<DaisyPreview id={18} height="225px" />

Cuadro de diálogo de confirmación que advierte sobre una acción irreversible, con icono de advertencia en Naranja Icesi (`#e9683b`), título en negrita, texto descriptivo del archivo a enviar y barra de acciones con opciones de cancelar o enviar definitivamente en Azul Icesi (`#5454e9`).

</TabItem>
<TabItem value="consejos" label="Consejos & Guía">

* **Ubicación sugerida:** `src/shared/components/ui/submission-confirm-modal.tsx`
* **Propósito:** Prevenir envíos accidentales o sustituciones de archivo en entregables calificados.
* **Estilo DaisyUI sugerido:** Componente modal `modal-box bg-base-100 border border-[#cecfd4] shadow-xl` y barra `modal-action`.
* **Contrato de Props sugerido (TypeScript):**
  ```typescript title="src/shared/components/ui/submission-confirm-modal.tsx"
  interface SubmissionConfirmModalProps {
    isOpen: boolean;
    assignmentName: string;
    warningMessage?: string;
    onConfirm: () => void;
    onCancel: () => void;
  }
  ```
* **Clases base de DaisyUI sugeridas:** `modal`, `modal-open`, `modal-box`, `modal-action`, `btn btn-sm btn-ghost`, `btn btn-sm btn-primary`.
* **Qué usar:**
  * Puedes implementarlo utilizando la etiqueta nativa HTML `<dialog>` combinada con la clase `modal` de DaisyUI, invocando `.showModal()` o controlando la clase `modal-open`.
  * Asegura que el usuario pueda presionar la tecla `Escape` para cerrar el modal de manera natural.
* **Qué EVITAR:**
  * **No** utilices portales manuales de React con manipulación directa de `document.body` cuando la etiqueta `<dialog>` nativa y DaisyUI manejan el backdrop automáticamente.
  * **No** omitas el foco accesible: el botón de acción principal debe ser fácilmente identificable por el usuario.

</TabItem>
</Tabs>

---

### 19. Tarjeta de Perfil Docente con Pestañas y Horarios

<Tabs>
<TabItem value="vista" label="Componente & Vista" default>

<DaisyPreview id={19} height="280px" />

Tarjeta de presentación de profesor que integra avatar con anillo en Azul Icesi (`#5454e9`), información departamental, sistema de pestañas (*boxed tabs*) para alternar entre asignaturas, horarios de asesoría y publicaciones, y botón de contacto.

</TabItem>
<TabItem value="consejos" label="Consejos & Guía">

* **Ubicación sugerida:** `src/features/faculty/components/faculty-profile-card.tsx`
* **Propósito:** Mostrar la ficha completa de profesores del departamento de TI en el portal de la carrera.
* **Estilo DaisyUI sugerido:** `card bg-base-100 border border-[#cecfd4]`, `tabs tabs-boxed bg-slate-100` y pestaña activa `tab-active text-primary` (`#5454e9`).
* **Contrato de Props sugerido (TypeScript):**
  ```typescript title="src/features/faculty/components/faculty-profile-card.tsx"
  interface FacultyTabContent {
    id: string;
    label: string;
    content: React.ReactNode;
  }

  interface FacultyProfileCardProps {
    fullName: string;
    academicRole: string;
    department: string;
    avatarUrl: string;
    tabs: FacultyTabContent[];
    onContactClick?: () => void;
  }
  ```
* **Clases base de DaisyUI sugeridas:** `card`, `avatar`, `tabs tabs-boxed`, `tab`, `tab-active`, `btn btn-xs btn-outline btn-primary`.
* **Qué usar:**
  * Si alternar entre pestañas cambia la vista sin recargar la página, este sub-panel de pestañas sí requiere `'use client'` para gestionar el índice de la pestaña activa con `useState`.
  * La tarjeta contenedora exterior puede mantenerse como Server Component pasando los datos del docente.
* **Qué EVITAR:**
  * **No** descargues todas las publicaciones pesadas en el bundle del cliente; renderiza el contenido inicial desde el servidor.
  * **No** rompas la armonía de radios: si la tarjeta exterior tiene `rounded-2xl`, el contenedor de tabs boxed debe tener `rounded-xl`.

</TabItem>
</Tabs>

---

### 20. Tablero de Entregables de Sprint en Acordeón Colapsable

<Tabs>
<TabItem value="vista" label="Componente & Vista" default>

<DaisyPreview id={20} height="235px" />

Acordeón colapsable compuesto mediante el componente `join` de DaisyUI, que agrupa los sprints de la materia con distintivos de estado en Verde Icesi (`#4cb979` para completado) y Amarillo Icesi (`#e4eb60` para en progreso), flechas animadas e ítems de verificación técnica en el interior.

</TabItem>
<TabItem value="consejos" label="Consejos & Guía">

* **Ubicación sugerida:** `src/features/projects/components/sprint-accordion-panel.tsx`
* **Propósito:** Organizar el backlog de sprints del proyecto semestral permitiendo expandir y contraer fases de entrega.
* **Estilo DaisyUI sugerido:** Contenedor unificado `join join-vertical w-full` con bloques `collapse collapse-arrow join-item border border-[#cecfd4]`.
* **Contrato de Props sugerido (TypeScript):**
  ```typescript title="src/features/projects/components/sprint-accordion-panel.tsx"
  interface SprintTask {
    description: string;
    isDone: boolean;
  }

  interface SprintPhase {
    sprintNumber: number;
    title: string;
    status: 'completed' | 'in_progress' | 'pending';
    tasks: SprintTask[];
    isDefaultOpen?: boolean;
  }

  interface SprintAccordionPanelProps {
    sprints: SprintPhase[];
  }
  ```
* **Clases base de DaisyUI sugeridas:** `join join-vertical`, `collapse collapse-arrow join-item`, `collapse-title`, `collapse-content`, `badge`.
* **Qué usar:**
  * DaisyUI permite hacer acordeones colapsables **100% en CSS puro sin necesidad de `'use client'` ni JavaScript**, simplemente colocando un elemento `<input type="radio" name="sprint-accordion" defaultChecked />` dentro del bloque `collapse`.
  * La clase `collapse-arrow` agrega automáticamente la animación de giro de la flecha cuando el input cambia de estado.
* **Qué EVITAR:**
  * **¡Gran anti-patrón!** No escribas manejadores de evento `onClick` manuales con booleanos de estado para abrir y cerrar acordeones cuando la solución nativa con `<input type="radio">` o `<details>` de DaisyUI es más rápida, accesible y funciona como Server Component sin Javascript en el cliente.
  * **No** olvides incluir la clase `join-item` en cada elemento `collapse` para que las esquinas redondeadas y bordes compartidos encajen a la perfección.

</TabItem>
</Tabs>

---

## 7. Buenas prácticas

Aplica esta matriz de decisión antes de programar cada uno de tus componentes en Next.js:

| Dimensión | Enfoque Recomendado | Anti-patrón a Evitar |
| :--- | :--- | :--- |
| **Directiva `'use client'`** | Solo en componentes con eventos interactivos (`onClick`, `onChange`), hooks (`useState`, `useEffect`) o APIs del navegador. | Poner `'use client'` en todos los archivos por defecto "por si acaso". |
| **Estilos & Paleta** | Clases semánticas de DaisyUI (`btn-primary`, `badge-secondary`, `bg-base-100`) configuradas en el tema institucional `icesi` (Azul `#5454e9`, Morado `#865cf0`, Verde `#4cb979`, Naranja `#e9683b`, Amarillo `#e4eb60`). | Estilos en línea (`style={{...}}`) o clases de color hexadecimal arbitrarias (`bg-[#0033a0]`). |
| **Contrato de Props** | Interfaces TypeScript claras y explícitas con tipos unión (`'sm' \| 'md' \| 'lg'`). | Props con tipo `any` o sin valores por defecto. |
| **Estructura HTML** | Etiquetas semánticas nativas (`<button>`, `<dialog>`, `<nav>`, `<kbd>`, `<progress>`). | Anidar múltiples `<div>` vacíos sin significado semántico ni accesibilidad. |
| **Navegación** | Componente `<Link href="...">` de Next.js para rutas internas del portal. | Etiquetas `<a>` convencionales que fuerzan una recarga completa de la página. |
