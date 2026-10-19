---
sidebar_position: 4
---

import ThemedImage from '@theme/ThemedImage';
import useBaseUrl from '@docusaurus/useBaseUrl';

# daisyUI

En la lección anterior aprendimos a utilizar **Tailwind CSS v4** para construir estilos visuales mediante utilidades atómicas. Sin embargo, al diseñar interfaces completas para entornos digitales, maquetar cada botón, tarjeta, barra de navegación o ventana modal combinando docenas de clases atómicas puede volverse repetitivo y sobrecargar el marcado JSX.

Para resolver este desafío entra en juego **daisyUI 5**, una librería de componentes semánticos basada en CSS puro que se integra como plugin oficial sobre Tailwind CSS. Con daisyUI puedes componer elementos visualmente atractivos, consistentes y totalmente tematizables escribiendo una sola clase semántica, manteniendo intacta la flexibilidad de Tailwind para cualquier ajuste fino.

---

## 1. ¿Qué es daisyUI y por qué usarlo?

**daisyUI** es la librería de componentes más popular del ecosistema Tailwind CSS. A diferencia de bibliotecas tradicionales basadas en componentes de React (como Material UI, Chakra UI o Ant Design), daisyUI es **100% CSS puro**.

### La analogía culinaria: Ingredientes vs. Platos Preparados

Para comprender la relación entre ambas herramientas, imagina que estás en una cocina profesional:

- **Tailwind CSS son los ingredientes frescos**: Te proporciona harina, sal, especias, aceite y vegetales (clases atómicas como `flex`, `p-4`, `rounded-xl`, `bg-blue-600`). Tienes control total sobre cada gramo, pero preparar un plato completo desde cero toma tiempo y esfuerzo constante.
- **daisyUI son los platos preparados por el chef**: Reúne los ingredientes en recetas equilibradas y listas para servir (clases semánticas como `btn`, `card`, `navbar`, `alert`, `input`). Ahorras tiempo y garantizas coherencia visual inmediata.
- **La combinación perfecta**: Si pides un plato preparado (`btn btn-primary`) y deseas agregarle un toque especial de sal o cambiar la presentación, puedes añadir cualquier ingrediente atómico de Tailwind directamente (`rounded-full shadow-lg hover:scale-105`).

<ThemedImage
  alt="Arquitectura de Capas de daisyUI y Tailwind CSS"
  sources={{
    light: useBaseUrl('/img/desarrollo-entornos-digitales-web/s12-daisyui-layers-light.svg'),
    dark: useBaseUrl('/img/desarrollo-entornos-digitales-web/s12-daisyui-layers-dark.svg'),
  }}
/>

### Comparación Arquitectónica

| Característica | CSS Tradicional / BEM | Componentes React (MUI, Chakra) | daisyUI 5 + Tailwind v4 |
| :--- | :--- | :--- | :--- |
| **Sobrecarga de JavaScript** | Cero (solo hojas `.css`). | Alta (envoltorios JS pesados, listeners, incremento del bundle). | **Cero**: 100% clases CSS puras compiladas. |
| **Control del marcado DOM** | Alto, pero manual. | Bajo (abstracciones cerradas con props propietarias). | **Total**: etiquetas nativas HTML5 (`<button>`, `<dialog>`, `<input>`). |
| **Soporte de Temas** | Manual mediante selectores CSS. | Requiere Providers y Contextos de React en runtime. | **Nativo y dinámico** vía atributo `data-theme` y variables CSS. |
| **Personalización visual** | Escribir nuevas reglas CSS. | Sobreescribir temas con objetos JavaScript engorrosos. | **Instantánea** usando cualquier clase utilitaria de Tailwind. |

---

## 2. Instalación en Next.js con Tailwind v4

En proyectos modernos configurados con **Next.js 16 (App Router)** y **Tailwind CSS v4**, daisyUI versión 5 se instala como dependencia de desarrollo y se registra directamente en la hoja de estilos principal mediante la directiva `@plugin`:

```bash title="Terminal"
npm i -D daisyui@latest
```

Una vez instalada la dependencia, abre el archivo `src/app/globals.css` (o `app/globals.css`) y añade la directiva de registro inmediatamente después de la importación de Tailwind:

```css title="src/app/globals.css" showLineNumbers
@import "tailwindcss";
@plugin "daisyui";
```

Si deseas definir los temas activos y configurar el tema claro y oscuro automáticos, puedes pasar un bloque de configuración al plugin:

```css title="src/app/globals.css con temas predeterminados" showLineNumbers
@import "tailwindcss";

@plugin "daisyui" {
  themes: light --default, dark --prefersdark, cupcake;
}
```

:::note[Tailwind v4: Adiós a plugins en JavaScript]
En versiones previas (Tailwind v3) los plugins debían importarse en la propiedad `plugins: []` de `tailwind.config.js`. En Tailwind v4, gracias a la arquitectura CSS-First del motor Oxide, todos los plugins se conectan mediante la sentencia estándar `@plugin "daisyui";`.
:::

---

## 3. Catálogo de Componentes Esenciales

daisyUI ofrece un catálogo amplio de componentes semánticos. A continuación examinaremos los componentes más utilizados en aplicaciones web interactivas.

### 1. Botones (`btn`)

La clase base `.btn` otorga altura táctil estandarizada, relleno proporcional, tipografía seminegrilla y transiciones interactivas para estados `:hover` y `:active`.

- **Clase base**: `btn`
- **Variantes de color semántico**: `btn-primary`, `btn-secondary`, `btn-accent`, `btn-neutral`, `btn-info`, `btn-success`, `btn-warning`, `btn-error`
- **Variantes de estilo visual**: `btn-outline` (fondo transparente con borde coloreado), `btn-ghost` (sin fondo ni borde hasta el hover), `btn-soft` (fondo atenuado), `btn-link` (aspecto de hipervínculo)
- **Modificadores de tamaño**: `btn-xs`, `btn-sm`, `btn-md` (tamaño predeterminado), `btn-lg`, `btn-xl`
- **Formas y distribución**: `btn-circle` (botón circular para iconos), `btn-square` (botón cuadrado), `btn-block` (ancho completo)

```tsx title="src/components/ui/ButtonVariants.tsx" showLineNumbers
export function ButtonVariants() {
  return (
    <div className="flex flex-wrap items-center gap-3">
      {/* Botones por color de intención */}
      <button className="btn btn-primary">Guardar Cambios</button>
      <button className="btn btn-secondary">Editar Perfil</button>
      <button className="btn btn-accent">Destacado</button>

      {/* Variantes de estilo */}
      <button className="btn btn-outline btn-primary">Contorno</button>
      <button className="btn btn-ghost">Cancelar</button>

      {/* Variantes de tamaño */}
      <button className="btn btn-primary btn-sm">Pequeño</button>
      <button className="btn btn-primary btn-lg">Grande</button>
    </div>
  );
}
```

### 2. Tarjetas (`card`)

El componente `card` organiza bloques jerárquicos de información (como fichas de productos, publicaciones o perfiles de usuario). Su estructura interna se compone de sub-elementos semánticos:

- **Contenedor base**: `card` (se acompaña habitualmente de `bg-base-100 shadow-sm`)
- **Cuerpo interno**: `card-body` (aplica el relleno interno estándar)
- **Título**: `card-title` (tipografía destacada con espaciado calibrado)
- **Zona de acciones**: `card-actions` (alinea botones al final con `justify-end`)
- **Contenedor multimedia**: `<figure>` (para imágenes que respetan los bordes redondeados de la tarjeta)
- **Variantes visuales**: `card-border` (añade borde sutil), `card-dash` (borde punteado), `card-side` (distribuye imagen y contenido en horizontal)

```tsx title="src/components/users/UserCardPreview.tsx" showLineNumbers
export function UserCardPreview() {
  return (
    <div className="card bg-base-100 w-full max-w-sm shadow-md card-border">
      <figure className="px-6 pt-6">
        <img
          src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=300"
          alt="Avatar de usuario"
          className="rounded-full w-24 h-24 object-cover border-2 border-primary"
        />
      </figure>
      <div className="card-body items-center text-center">
        <h2 className="card-title text-base-content">Valentina Rivas</h2>
        <span className="badge badge-primary">Diseñadora UI/UX</span>
        <p className="text-sm text-base-content/70 mt-1">
          Especialista en sistemas de diseño e interacción accesible para plataformas web.
        </p>
        <div className="card-actions justify-end mt-4">
          <button className="btn btn-sm btn-outline">Mensaje</button>
          <button className="btn btn-sm btn-primary">Ver Perfil</button>
        </div>
      </div>
    </div>
  );
}
```

### 3. Badges (`badge`)

Los badges o insignias sirven para resaltar etiquetas numéricas, estados de actividad o categorías breves.

- **Clase base**: `badge`
- **Colores**: `badge-primary`, `badge-secondary`, `badge-accent`, `badge-neutral`, `badge-info`, `badge-success`, `badge-warning`, `badge-error`
- **Estilos**: `badge-outline`, `badge-soft`, `badge-dash`
- **Tamaños**: `badge-xs`, `badge-sm`, `badge-md`, `badge-lg`, `badge-xl`

```tsx title="src/components/ui/BadgeExamples.tsx" showLineNumbers
export function BadgeExamples() {
  return (
    <div className="flex items-center gap-2">
      <span className="badge badge-success">Activo</span>
      <span className="badge badge-warning badge-outline">En Revisión</span>
      <span className="badge badge-error badge-soft">Suspendido</span>
      <span className="badge badge-info badge-sm">Nuevo</span>
    </div>
  );
}
```

### 4. Alertas (`alert`)

Las alertas comunican notificaciones contextuales relevantes. Incluyen espaciado uniforme y se recomienda estructurarlas con el atributo de accesibilidad `role="alert"`.

- **Clase base**: `alert`
- **Variantes de intención**: `alert-info`, `alert-success`, `alert-warning`, `alert-error`
- **Estilos**: `alert-soft` (fondo claro con contraste suave), `alert-outline`, `alert-dash`
- **Orientación**: `alert-vertical` (en pantallas estrechas) o `alert-horizontal`

```tsx title="src/components/ui/AlertNotification.tsx" showLineNumbers
export function AlertNotification() {
  return (
    <div role="alert" className="alert alert-success shadow-sm">
      <svg
        xmlns="http://www.w3.org/2000/svg"
        className="h-6 w-6 shrink-0 stroke-current"
        fill="none"
        viewBox="0 0 24 24"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth="2"
          d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
        />
      </svg>
      <div>
        <h3 className="font-bold">¡Operación exitosa!</h3>
        <p className="text-xs">Los datos del usuario se sincronizaron con el servidor.</p>
      </div>
      <button className="btn btn-sm btn-ghost">Aceptar</button>
    </div>
  );
}
```

### 5. Formularios y Entradas (`input` y `fieldset`)

:::important[Cambio Crítico en daisyUI 5]
En daisyUI 5 **no existen** las clases `input-bordered`, `form-control` ni `label-text`.
Los inputs ya vienen con borde nativo por defecto. Para agrupar etiquetas, campos y textos de ayuda, daisyUI 5 adopta la semántica estándar de HTML5 utilizando las clases:
- **`fieldset`**: Contenedor principal del grupo de formulario.
- **`fieldset-legend`**: Leyenda que actúa como título descriptivo del campo.
- **`input`**: Campo de entrada con estilos base de foco y contraste.
- **`label`**: Párrafo o etiqueta descriptiva para texto de ayuda o mensajes de error.
:::

- **Clase base de campo**: `input`
- **Colores de estado**: `input-primary`, `input-secondary`, `input-accent`, `input-info`, `input-success`, `input-warning`, `input-error`
- **Tamaños**: `input-xs`, `input-sm`, `input-md`, `input-lg`, `input-xl`

```tsx title="src/components/forms/InputFieldset.tsx" showLineNumbers
export function InputFieldset() {
  return (
    <fieldset className="fieldset w-full max-w-sm">
      <legend className="fieldset-legend">Correo institucional</legend>
      <input
        type="email"
        placeholder="usuario@icesi.edu.co"
        className="input input-primary w-full"
      />
      <p className="label text-base-content/70">
        Utiliza el correo registrado ante el sistema académico.
      </p>
    </fieldset>
  );
}
```

### 6. Barra de Navegación (`navbar`)

El componente `navbar` gestiona el encabezado superior de la aplicación. Puede estructurarse mediante las subdivisiones `navbar-start`, `navbar-center` y `navbar-end`, o mediante clases utilitarias de flexbox como `flex-1` y `flex-none`.

```tsx title="src/components/navigation/AppNavbar.tsx" showLineNumbers
export function AppNavbar() {
  return (
    <header className="navbar bg-base-100 shadow-sm px-4">
      <div className="flex-1">
        <a className="btn btn-ghost text-xl font-bold text-primary">
          DocuKelo App
        </a>
      </div>
      <div className="flex-none gap-2">
        <input
          type="text"
          placeholder="Buscar cursos..."
          className="input input-sm w-36 sm:w-64"
        />
        <button className="btn btn-sm btn-primary">Nuevo Proyecto</button>
      </div>
    </header>
  );
}
```

### 7. Menús (`menu`)

El componente `menu` organiza listas verticales u horizontales de navegación. Es ideal para barras laterales (*sidebars*) o menús desplegables.

- **Clase base**: `menu`
- **Orientación**: `menu-vertical` (predeterminada) o `menu-horizontal`
- **Tamaños**: `menu-xs`, `menu-sm`, `menu-md`, `menu-lg`
- **Títulos de sección**: `menu-title`

```tsx title="src/components/navigation/SidebarMenu.tsx" showLineNumbers
export function SidebarMenu() {
  return (
    <ul className="menu bg-base-200 rounded-box w-56 p-2">
      <li className="menu-title">Panel Principal</li>
      <li><a>Resumen</a></li>
      <li>
        <a className="active">Usuarios</a>
      </li>
      <li><a>Configuración</a></li>
      <li className="menu-title">Seguridad</li>
      <li><a className="text-error">Cerrar Sesión</a></li>
    </ul>
  );
}
```

### 8. Desplegables (`dropdown`)

El componente `dropdown` muestra paneles emergentes o listas flotantes ancladas a un elemento activador.

- **Contenedor**: `dropdown`
- **Contenido emergente**: `dropdown-content` (requiere `z-10` o `z-50` para posicionarse sobre otros elementos)
- **Posición**: `dropdown-end` (alineado a la derecha), `dropdown-top`, `dropdown-bottom`, `dropdown-left`, `dropdown-right`
- **Apertura**: por foco (`tabIndex="0"`) o por cursor flotante (`dropdown-hover`)

```tsx title="src/components/navigation/UserDropdown.tsx" showLineNumbers
export function UserDropdown() {
  return (
    <div className="dropdown dropdown-end">
      <div tabIndex={0} role="button" className="btn btn-ghost btn-circle avatar">
        <div className="w-10 rounded-full bg-primary text-primary-content flex items-center justify-center font-bold">
          VR
        </div>
      </div>
      <ul
        tabIndex={0}
        className="menu menu-sm dropdown-content bg-base-100 rounded-box z-50 mt-3 w-52 p-2 shadow-lg border border-base-200"
      >
        <li className="menu-title">Valentina Rivas</li>
        <li><a>Mi Cuenta</a></li>
        <li><a>Preferencias</a></li>
        <div className="divider my-1"></div>
        <li><a className="text-error">Cerrar Sesión</a></li>
      </ul>
    </div>
  );
}
```

### 9. Ventanas Modales (`modal`)

daisyUI 5 implementa modales aprovechando el elemento nativo HTML5 `<dialog>`. Esto ofrece accesibilidad superior (gestión nativa de foco, tecla `Escape` y lectores de pantalla) sin librerías externas de JavaScript.

- **Contenedor**: `<dialog id="id_modal" className="modal">`
- **Caja de contenido**: `modal-box`
- **Botones de acción**: `modal-action`
- **Cierre al hacer clic afuera**: `modal-backdrop`
- **Activación**: Se invoca con el método nativo del navegador `showModal()`

```tsx title="src/components/ui/DeleteConfirmModal.tsx" showLineNumbers
'use client';

export function DeleteConfirmModal() {
  const openModal = () => {
    const modal = document.getElementById('confirm_modal') as HTMLDialogElement | null;
    modal?.showModal();
  };

  return (
    <div>
      <button onClick={openModal} className="btn btn-error btn-sm">
        Eliminar Elemento
      </button>

      <dialog id="confirm_modal" className="modal">
        <div className="modal-box">
          <h3 className="font-bold text-lg text-base-content">¿Estás seguro?</h3>
          <p className="py-4 text-sm text-base-content/70">
            Esta acción eliminará permanentemente al usuario y no se podrá deshacer.
          </p>
          <div className="modal-action">
            <form method="dialog" className="flex gap-2">
              <button className="btn btn-ghost">Cancelar</button>
              <button className="btn btn-error">Confirmar Eliminación</button>
            </form>
          </div>
        </div>
        {/* Fondo interactivo para cerrar al hacer clic afuera */}
        <form method="dialog" className="modal-backdrop">
          <button>cerrar</button>
        </form>
      </dialog>
    </div>
  );
}
```

### 10. Tablas de Datos (`table`)

El componente `table` estiliza tablas estructuradas con cabeceras estilizadas, bordes sutiles y estados de fila.

- **Clase base**: `table`
- **Variantes visuales**: `table-zebra` (filas alternadas con fondo sutil), `table-pin-rows` (fija las cabeceras al hacer scroll), `table-pin-cols` (fija columnas)
- **Tamaños**: `table-xs`, `table-sm`, `table-md`, `table-lg`

```tsx title="src/components/users/UserTable.tsx" showLineNumbers
export function UserTable() {
  return (
    <div className="overflow-x-auto w-full">
      <table className="table table-zebra">
        <thead>
          <tr>
            <th>Usuario</th>
            <th>Rol</th>
            <th>Estado</th>
            <th className="text-right">Acciones</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td className="font-semibold">Ana Pérez</td>
            <td>Docente</td>
            <td><span className="badge badge-success badge-sm">Activo</span></td>
            <td className="text-right">
              <button className="btn btn-ghost btn-xs">Editar</button>
            </td>
          </tr>
          <tr>
            <td className="font-semibold">Carlos Gómez</td>
            <td>Estudiante</td>
            <td><span className="badge badge-warning badge-sm">Pendiente</span></td>
            <td className="text-right">
              <button className="btn btn-ghost btn-xs">Editar</button>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  );
}
```

### 11. Pestañas (`tabs`)

El componente `tabs` organiza secciones de contenido conmutables.

- **Contenedor**: `tabs`
- **Variantes de estilo**: `tabs-box` (estilo pastilla en caja contenedora), `tabs-lift` (estilo pestaña de carpeta con relieve), `tabs-border` (borde inferior sutil)
- **Pestaña individual**: `tab`
- **Pestaña activa**: `tab-active`

```tsx title="src/components/navigation/NavigationTabs.tsx" showLineNumbers
export function NavigationTabs() {
  return (
    <div role="tablist" className="tabs tabs-box w-full max-w-md">
      <button role="tab" className="tab tab-active">Iniciar Sesión</button>
      <button role="tab" className="tab">Registrarse</button>
      <button role="tab" className="tab">Recuperar Acceso</button>
    </div>
  );
}
```

---

## 4. Sistema de Temas y Personalización

Uno de los mayores atractivos de daisyUI para diseñadores de entornos digitales es su **sistema de temas declarativo**. Todo el aspecto visual de una aplicación puede transformarse en milisegundos sin reescribir un solo selector CSS.

### El Atributo `data-theme`

daisyUI utiliza el atributo estándar HTML `data-theme`. Cuando este atributo se aplica en la etiqueta `<html>`, afecta a toda la aplicación. Si se aplica en un contenedor secundario (por ejemplo, una tarjeta o un panel lateral), modifica los estilos exclusivamente para ese fragmento del DOM:

```html title="Aplicación global o regional del tema" showLineNumbers
<!-- Tema global para toda la aplicación en app/layout.tsx -->
<html lang="es" data-theme="cupcake">
  <body>
    <main>
      <h1>Contenido con tema Cupcake</h1>

      <!-- Esta sección particular fuerza el tema oscuro independiente del resto -->
      <section data-theme="dark" class="p-6 rounded-box bg-base-100 text-base-content">
        <h2>Panel Nocturno de Análisis</h2>
        <button class="btn btn-primary">Acción en Modo Oscuro</button>
      </section>
    </main>
  </body>
</html>
```

### Temas Incluidos

daisyUI incluye más de 30 temas de diseño listos para producción:

- **Clásicos**: `light`, `dark`, `corporate`, `business`
- **Coloridos y lúdicos**: `cupcake`, `retro`, `cyberpunk`, `valentine`, `aqua`, `synthwave`
- **Elegantes y sobrios**: `emerald`, `nord`, `dracula`, `luxury`, `night`, `dim`

### Configuración Automática de Tema Claro y Oscuro

En `src/app/globals.css`, puedes asociar temas a los modos predeterminados del sistema operativo mediante las banderas `--default` y `--prefersdark`:

```css title="src/app/globals.css" showLineNumbers
@import "tailwindcss";

@plugin "daisyui" {
  themes: light --default, dark --prefersdark, cupcake, corporate;
}
```

Con esta configuración:
1. El tema `light` se aplica por defecto.
2. Si el sistema operativo del usuario tiene activado el modo oscuro (`prefers-color-scheme: dark`), daisyUI cambia automáticamente al tema `dark`.

### Creación de un Tema Personalizado: La Paleta Institucional Icesi

Para reflejar la identidad visual de una marca o institución, daisyUI 5 permite definir temas propios mediante la directiva `@plugin "daisyui/theme"`.

A continuación crearemos el tema personalizado **`icesi`**, integrando la paleta de colores institucional:
- **Azul Icesi**: `#5454e9` (Color primario de acción)
- **Morado**: `#865cf0` (Color secundario de acento)
- **Verde**: `#4cb979` (Color de éxito y confirmación)
- **Naranja**: `#e9683b` (Color de resalte e interactividad)
- **Amarillo**: `#e4eb60` (Color de advertencia y atención)

```css title="src/app/globals.css con tema institucional Icesi" showLineNumbers
@import "tailwindcss";

@plugin "daisyui" {
  themes: light --default, dark --prefersdark, icesi;
}

@plugin "daisyui/theme" {
  name: "icesi";
  default: false;
  prefersdark: false;
  color-scheme: light;

  /* Colores de marca y rol semántico */
  --color-primary: #5454e9;
  --color-primary-content: #ffffff;
  --color-secondary: #865cf0;
  --color-secondary-content: #ffffff;
  --color-accent: #e9683b;
  --color-accent-content: #ffffff;
  --color-success: #4cb979;
  --color-success-content: #ffffff;
  --color-warning: #e4eb60;
  --color-warning-content: #1e293b;
  --color-error: #ef4444;
  --color-error-content: #ffffff;
  --color-neutral: #1e293b;
  --color-neutral-content: #ffffff;
  --color-info: #5454e9;
  --color-info-content: #ffffff;

  /* Superficies de fondo y texto base */
  --color-base-100: #ffffff;
  --color-base-200: #f8fafc;
  --color-base-300: #e2e8f0;
  --color-base-content: #0f172a;

  /* Radio de bordes redondeados */
  --radius-selector: 0.5rem;
  --radius-field: 0.5rem;
  --radius-box: 0.75rem;
}
```

Para activar este tema institucional en tu aplicación, basta con declarar `data-theme="icesi"` en el elemento raíz `<html>` o en cualquier contenedor.

---

## 5. Cuándo Usar daisyUI y Cuándo Utilidades de Tailwind

La clave para diseñar interfaces mantenibles radica en comprender la **complementariedad**:

| Responsabilidad de Diseño | Herramienta Recomendada | Clases de Ejemplo |
| :--- | :--- | :--- |
| **Identidad de componente y estilo base** | **daisyUI** | `btn`, `card`, `alert`, `input`, `fieldset`, `modal` |
| **Colores adaptables al tema activo** | **daisyUI** | `bg-base-100`, `text-base-content`, `btn-primary`, `badge-secondary` |
| **Estructura y distribución del layout** | **Tailwind** | `grid`, `flex`, `gap-6`, `col-span-2`, `justify-between` |
| **Dimensionamiento y espaciado métrico** | **Tailwind** | `p-4`, `m-auto`, `w-full`, `max-w-md`, `min-h-screen` |
| **Comportamiento responsivo** | **Tailwind** | `sm:flex-row`, `md:grid-cols-2`, `hidden lg:block` |
| **Micro-interacciones y ajustes finos** | **Tailwind** | `shadow-xl`, `hover:scale-105`, `transition-all`, `rounded-full` |

### Cómo sobreescribir un componente de daisyUI con utilidades

Las clases utilitarias de Tailwind se compilan con la especificidad necesaria para sobreescribir los valores por defecto de daisyUI. Observa cómo transformamos un botón estándar en un botón de acción flotante personalizado:

```tsx title="Sobreescritura de estilos con utilidades de Tailwind" showLineNumbers
// Componente daisyUI con ajustes atómicos de Tailwind
<button className="btn btn-primary w-full md:w-auto px-8 rounded-full shadow-lg hover:shadow-2xl hover:scale-105 transition-all">
  Explorar Plataforma
</button>
```

En este ejemplo:
- `btn btn-primary` aporta el relleno base, los colores temáticos del tema activo y los estados interactivos.
- `w-full md:w-auto` gestiona la adaptabilidad responsiva (ancho completo en móvil, automático en escritorio).
- `rounded-full` sobreescribe el radio de esquina por defecto de la tarjeta.
- `shadow-lg hover:shadow-2xl hover:scale-105` añade elevación y animación de escala al pasar el cursor.

---

## 6. Caso Práctico: Formulario de Autenticación

Para consolidar lo aprendido, examinemos la construcción del formulario de inicio de sesión (`LoginForm`) correspondiente al caso de estudio de la semana.

El formulario implementa:
1. Una tarjeta centrada (`card bg-base-100 shadow-md card-border`).
2. Agrupación accesible con `fieldset`, `fieldset-legend` e `input`.
3. Notificaciones de error o éxito con `alert`.
4. Botón de envío temático `btn btn-primary w-full`.
5. Enlaces de navegación al formulario de registro.

```tsx title="src/features/auth/components/LoginForm.tsx" showLineNumbers
'use client';

import { useState } from 'react';

export function LoginForm() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) {
      setErrorMessage('Por favor ingresa tu correo y contraseña.');
      return;
    }
    setErrorMessage(null);
    // Continuar con el envío a la API (POST /auth/login)
  };

  return (
    <section className="min-h-screen bg-base-200 grid place-items-center px-4 py-12">
      <div className="card bg-base-100 w-full max-w-sm shadow-md card-border">
        <form onSubmit={handleSubmit} className="card-body" noValidate>
          {/* Encabezado del Formulario */}
          <h2 className="card-title text-2xl justify-center font-extrabold text-base-content">
            DocuKelo
          </h2>
          <p className="text-center text-sm text-base-content/70">
            Ingresa tus credenciales para acceder a la plataforma
          </p>

          {/* Alerta de Error Condicional */}
          {errorMessage && (
            <div role="alert" className="alert alert-error alert-soft text-xs py-2 mt-2">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-4 w-4 shrink-0 stroke-current"
                fill="none"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
              <span>{errorMessage}</span>
            </div>
          )}

          {/* Grupo de Correo Electrónico */}
          <fieldset className="fieldset mt-2">
            <legend className="fieldset-legend">Correo electrónico</legend>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="tu@correo.com"
              className="input w-full"
              required
            />
          </fieldset>

          {/* Grupo de Contraseña */}
          <fieldset className="fieldset mt-2">
            <legend className="fieldset-legend">Contraseña</legend>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              className="input w-full"
              required
            />
          </fieldset>

          {/* Botón de Envío */}
          <button type="submit" className="btn btn-primary w-full mt-4">
            Iniciar Sesión
          </button>

          {/* Enlace a Registro */}
          <p className="text-center text-xs text-base-content/70 mt-3">
            ¿No tienes cuenta?{' '}
            <a href="/register" className="link link-primary font-semibold">
              Regístrate aquí
            </a>
          </p>
        </form>
      </div>
    </section>
  );
}
```

### Vista Previa Interactiva

A continuación puedes interactuar en vivo con el prototipo de autenticación estilizado íntegramente con daisyUI 5 y Tailwind CSS. Puedes alternar entre las vistas de Login, Registro y Aplicación, así como simular la vista móvil:

<iframe
  src="/interactive/computacion-3/semana-12/mockup-auth/index.html"
  title="Demostración interactiva de autenticación con daisyUI y Tailwind CSS"
  style={{ width: '100%', height: 640, border: 0, borderRadius: '12px' }}
  loading="lazy"
/>

---

## Cuestionario de Autoevaluación

<Quiz id="dedw-s12-daisyui-quiz">
  <Question title="¿Cuál es la principal diferencia técnica entre daisyUI y una biblioteca como Material UI o Chakra UI?">
    <Option>daisyUI requiere instalar gestores de estado como Redux para controlar el comportamiento de los componentes.</Option>
    <Option correct>daisyUI es 100% CSS puro basado en clases semánticas, por lo que no añade sobrecosto de componentes JavaScript en el bundle de cliente ni impone abstracciones propietarias.</Option>
    <Option>daisyUI solo puede utilizarse en proyectos creados con Vue o Angular, no en Next.js.</Option>
    <Option>daisyUI reemplaza el motor de renderizado de React en tiempo de ejecución.</Option>
  </Question>
  <Question title="En un proyecto Next.js con Tailwind CSS v4, ¿cómo se integra daisyUI 5 de manera oficial?">
    <Option>Importando el archivo daisyui.css en el archivo layout.tsx y creando un archivo tailwind.config.js.</Option>
    <Option>Instalando un componente DaisyProvider y envolviendo todo el árbol de React en app/page.tsx.</Option>
    <Option correct>Instalando daisyui como dependencia de desarrollo e incluyendo la directiva @plugin &#34;daisyui&#34;; directamente en src/app/globals.css.</Option>
    <Option>Descargando el código fuente de daisyUI y copiándolo manualmente en la carpeta public/.</Option>
  </Question>
  <Question title="En daisyUI versión 5, ¿cuál es la estructura recomendada para agrupar campos de formulario accesibles con etiquetas y textos de ayuda?">
    <Option>Utilizar las clases form-control, label-text e input-bordered.</Option>
    <Option correct>Utilizar un elemento fieldset con clase fieldset, una leyenda con fieldset-legend, el campo input y párrafos o etiquetas con la clase label.</Option>
    <Option>Utilizar únicamente etiquetas div con clases de espaciado manual de Tailwind sin clases de daisyUI.</Option>
    <Option>Utilizar la clase input-group envolviendo etiquetas span y button.</Option>
  </Question>
  <Question title="¿Cómo se aplica un tema visual de daisyUI (por ejemplo, cupcake o dark) en la interfaz de usuario?">
    <Option>Pasando la propiedad theme=&#34;cupcake&#34; a cada botón y campo de texto de forma individual.</Option>
    <Option correct>Estableciendo el atributo HTML data-theme=&#34;cupcake&#34; en la etiqueta html de la aplicación o en cualquier contenedor secundario.</Option>
    <Option>Creando un archivo CSS independiente por cada tema y cargándolos condicionalmente con JavaScript.</Option>
    <Option>Modificando la variable de entorno NEXT_PUBLIC_THEME en el archivo .env.local.</Option>
  </Question>
  <Question title="Al configurar daisyUI en globals.css, ¿qué función cumple el modificador --prefersdark en la declaración themes: light --default, dark --prefersdark;?">
    <Option>Fuerza a que todos los dispositivos móviles utilicen el tema oscuro permanentemente.</Option>
    <Option>Deshabilita todos los estilos de color de texto para reducir el consumo de batería.</Option>
    <Option correct>Activa automáticamente el tema dark cuando el sistema operativo o navegador del usuario tiene habilitada la preferencia prefers-color-scheme: dark.</Option>
    <Option>Convierte los botones primarios en botones transparentes de contorno.</Option>
  </Question>
  <Question title="¿Cómo se define un nuevo tema institucional personalizado (como icesi) en daisyUI 5 con Tailwind CSS v4?">
    <Option>Creando un archivo icesi-theme.json en la raíz del proyecto y registrándolo en tsconfig.json.</Option>
    <Option correct>Declarando la directiva @plugin &#34;daisyui/theme&#34; en globals.css y definiendo las variables CSS correspondientes como --color-primary y --color-base-100.</Option>
    <Option>Escribiendo funciones de JavaScript dentro de layout.tsx que muten los estilos en línea del elemento body.</Option>
    <Option>Editando directamente los archivos internos dentro de node_modules/daisyui/.</Option>
  </Question>
  <Question title="¿Cuál es la regla recomendada al combinar daisyUI con utilidades de Tailwind CSS?">
    <Option>Utilizar daisyUI para maquetar la cuadrícula y dimensiones, y utilidades de Tailwind para definir los colores del tema.</Option>
    <Option correct>Utilizar daisyUI para la identidad semántica y colores temáticos (btn, card, bg-base-100) y utilidades de Tailwind para el layout, espaciado responsivo y micro-ajustes (flex, grid, gap-4, md:w-auto).</Option>
    <Option>Prohibir el uso simultáneo de clases de daisyUI y clases de Tailwind en el mismo elemento JSX.</Option>
    <Option>Reemplazar todas las clases semánticas por estilos en línea mediante el atributo style.</Option>
  </Question>
  <Question title="¿Cuál es la ventaja de utilizar el componente modal de daisyUI con el elemento nativo dialog de HTML5?">
    <Option>Que permite descargar imágenes en segundo plano mientras el usuario completa un formulario.</Option>
    <Option>Que no requiere que el navegador tenga soporte para CSS.</Option>
    <Option correct>Que aprovecha la API nativa del navegador (showModal()), gestionando el foco accesible, el cierre con la tecla Escape y la interacción sin dependencias pesadas de JavaScript.</Option>
    <Option>Que solo funciona en páginas estáticas generadas en tiempo de compilación.</Option>
  </Question>
</Quiz>
