# DocuKelo Docusaurus Project Guidelines and System Memory

This document serves as the primary system memory and development reference for any AI Agent or content creator contributing to the **DocuKelo** repository. 

---

## 1. Project Overview & Mission

**DocuKelo** is an academic documentation portal built using **Docusaurus** for the engineering and design departments at **Universidad Icesi**. Its goal is to provide students with structured, modern, and interactive learning guides, tutorials, and laboratory instructions.

The portal covers several courses, including:
- **Computación en Internet 2 & 3**: Focuses on backend engineering (Spring Boot, Node.js), frontend (React), containerization (Docker), testing, and software architectures.
- **Seminario de Ingeniería de Software (`seminario-de-i-d-i`)**: Flutter y desarrollo móvil (estado, formularios, arquitectura de capas) con piezas interactivas propias.
- **Computación en Internet 3** incluye, además de backend, la parte de frontend con Next.js, Clean Architecture, Redux Toolkit y Tailwind CSS/daisyUI (semanas 9 a 12).
- **Diseñando con Algoritmos / Desarrollo de Entornos Digitales Web**: Focuses on UI/UX, responsive layouts, web styling (CSS/Tailwind CSS), and frontend interaction.
- **IAG al Entorno**: Artificial Intelligence and Generative AI fundamentals.
- **Flutter**: Mobile application development.

---

## 2. Technical Stack & How It Works

DocuKelo is powered by **Docusaurus v3** (React & MDX) and uses a set of global customizations:
- **Automatic Sidebar Generation**: The sidebar is configured dynamically in `sidebars.js` to mirror the physical file structure under the `docs/` directory (`dirName: '.'`). Folder naming and alphabetical/explicit sorting govern order.
- **MDX (Markdown + React)**: Enables embedding interactive React components directly in Markdown files without manual imports (components are globally registered in `src/theme/MDXComponents.js`).
- **Styling**: Leverages Infima CSS (Docusaurus default) alongside custom React components styled for clean, readable layout presentations.

---

## 3. Directory Structure

Understanding the layout of the repository is critical for adding content correctly:

```
docukelo-icesi/
├── .agents/                      # AI Agent Configurations & Custom Skills
│   ├── memory/                   # System memory docs (e.g., this file)
│   └── skills/                   # Specialized agent workflow instructions
├── docs/                         # Documentation root (separated by courses)
│   ├── computacion-2/            # Folder structure per course
│   │   ├── _category_.json       # Category metadata for sidebar
│   │   ├── intro.mdx             # Course landing page
│   │   └── semana-1/             # Sub-modules / weekly folders
│   │       ├── _category_.json   
│   │       └── topic.md          # Individual markdown guides
│   ├── iag-al-entorno/
│   └── ...
├── src/                          # Custom theme and pages
│   ├── components/               # Custom React components (BrowserWindow, PdfViewer, etc.)
│   └── theme/                    # Theme overrides and global MDX setup
├── static/                       # Static assets (images, PDFs, syllabus)
├── docusaurus.config.js          # Main Docusaurus configuration
└── sidebars.js                   # Sidebar structure config
```

---

## 4. Creating Course and Folder Structures

To define a new course, topic, or sub-module, follow these folder-creation rules:

### Step 4.1: Course Root Directory
Create a folder under `docs/` using kebab-case (e.g., `docs/iag-al-entorno`).

### Step 4.2: Course Category Metadata (`_category_.json`)
Every new directory must contain a `_category_.json` file. This tells Docusaurus how to label and index the category in the sidebar.
```json
{
  "label": "IAG al Entorno",
  "position": 7,
  "link": {
    "type": "generated-index",
    "description": "Guides and resources regarding Generative AI and its ecosystem."
  }
}
```
* **label**: The human-readable title shown on the sidebar.
* **position**: Determines the display order relative to sibling folders.
* **link**: Configures a generated index page summary listing all sub-pages.

### Step 4.3: Course Introduction (`intro.mdx` or `intro.md`)
Always create an entry document inside the folder explaining the purpose of the course/module:
* The main heading must be `# Contenido del curso` (or "Contenido del curso").
* The frontmatter must explicitly set `sidebar_position: 1`.

```markdown
---
sidebar_position: 1
---

# Contenido del curso

Welcome text and syllabus description goes here...
```

### Step 4.4: Sub-folders (Weeks/Topics)
Under the course directory, organize content inside sub-folders:
- Use clear names matching the subject classification (e.g., `ia-generativa/` or `semana-1/`).
- Inside each sub-folder, include its own `_category_.json`.
- **Ordering Rule**: The `position` key inside the `_category_.json` of any sub-folder must start at `2` (or above) to ensure that the introductory page (`intro.md` with `sidebar_position: 1`) is displayed first in the navigation.
- Order individual markdown files within sub-folders using their own frontmatter `sidebar_position`.
- **File Naming Pattern (Numeric Prefixes)**: All lesson markdown/MDX files within a week or topic folder must use a two-digit numeric prefix followed by kebab-case in lowercase ASCII, without spaces, accents or underscores (e.g., `01-topic-name.md`, `02-subtopic.md`, `03-practice.md`). The only exception is `intro.md`/`intro.mdx` (`sidebar_position: 1`). The prefix is stripped from the URL, so `01-topic-name.md` is published as `/topic-name`. Translations in `i18n/en/...` use exactly the same path and file name as the Spanish original. This guarantees deterministic sorting in the autogenerated sidebar (`dirName: '.'`), ensures consistency across all course modules, and aligns with filesystem sorting.


---

## 5. Globally Available MDX Components

You do not need to import these components inside `.md` or `.mdx` files; they are loaded globally.

### Step-by-Step Timelines (`<StepByStep>`)
For laboratories and guides requiring sequential actions:
```mdx
<StepByStep>
  <Step number="1" title="Initialize the project">
    Run the command to set up the boilerplate.
  </Step>
  <Step number="2" title="Configure variables">
    Edit the configurations inside your `.env` file.
  </Step>
</StepByStep>
```

### Resource Card Grids (`<CardGrid>`)
To present external links, tools, repositories, or resources visually:
```mdx
<CardGrid cols={2}>
  <Card 
    title="Official Docs" 
    description="Docusaurus official guides and API reference." 
    link="https://docusaurus.io" 
  />
</CardGrid>
```

### Simulated Browser Containers (`<BrowserWindow>` and `<IframeWindow>`)
To display UI mockups or showcase how applications run locally:
```mdx
<BrowserWindow url="http://localhost:3000">
  <h3>Interactive UI Preview</h3>
</BrowserWindow>
```
For external live pages:
```mdx
<IframeWindow url="https://react.dev" />
```

### OS/Environment Selection Tabs (`<Tabs>`)
To structure multi-environment commands (e.g., Windows vs. macOS/Linux):
```mdx
<Tabs>
  <TabItem value="win" label="Windows" default>
    `dir`
  </TabItem>
  <TabItem value="unix" label="macOS & Linux">
    `ls -la`
  </TabItem>
</Tabs>
```

### PDF Viewer (`<PdfViewer>`)
Para slides, guías y syllabus en PDF guardados en `static/files/<curso>/...`. Incluye botón de pantalla completa y título derivado del nombre del archivo:
```mdx
<PdfViewer src="/files/computacion-3/semana-12/semana-12-estado-navegacion-estilos.pdf" height="600px" title="Semana 12" />
```
Propiedades: `src` (obligatoria), `height` (por defecto `600px`), `width` (por defecto `100%`), `title` (opcional). El nombre del PDF va en minúsculas, sin espacios ni acentos.

### Quizzes (`<Quiz>`, `<Question>`, `<Option>`)
Evaluaciones de opción múltiple con progreso guardado en `localStorage`. Cada `<Quiz>` **debe** llevar un `id` único en kebab-case. El formato completo y las reglas de contenido están en la skill `.agents/skills/docusaurus_quiz/SKILL.md`; léela antes de escribir uno.

### Mermaid ampliable (`<ZoomableMermaid>`)
Envuelve un diagrama Mermaid y agrega un modal con zoom y arrastre para diagramas grandes. Recibe el código como texto en la propiedad `value`:
```mdx
<ZoomableMermaid value={`flowchart LR
    A[Cliente] --> B[Servidor]`} />
```
Para diagramas pequeños basta un bloque ```` ```mermaid ```` normal.

### Vista previa con daisyUI (`<DaisyPreview>`)
Renderiza en un iframe el ejemplo número `id` de la actividad de componentes daisyUI (`desarrollo-entornos-digitales-web/semana-12`): `<DaisyPreview id={1} height="135px" />`. Carga Tailwind y daisyUI desde un CDN en el navegador, así que necesita internet. Es específico de esa actividad; para mostrar otra interfaz usa `<BrowserWindow>` o una pieza interactiva.

### Gráficos interactivos (`<InteractiveFrame>`)
Para piezas de `static/interactive/` con botón de pantalla completa. Ver la sección 8.

### Traducciones al crear o mover un documento
Todo documento nuevo de `docs/` debe tener, cuando se traduzca, su par en `i18n/en/docusaurus-plugin-content-docs/current/` con la **misma ruta y nombre**, mismo `sidebar_position` y categorías con la misma `position`. Quien crea o renombra un documento (incluido un agente) mueve también su traducción si existe; si no existe, se deja pendiente (no es error del linter). Ver la sección 10.

---

## 6. Diagram Style Guide (Mermaid)

DocuKelo natively renders Mermaid diagrams. Keep diagram layouts clean and style nodes using specific borders/colors for highlights:
* Use `graph TD` (top-down) or `graph LR` (left-to-right).
* Highlight state flows using CSS styles matching light/dark modes:
  - **Info/Blue**: `style NodeID fill:#dbeafe,stroke:#2563eb,stroke-width:2px`
  - **Success/Green**: `style NodeID fill:#dcfce7,stroke:#16a34a,stroke-width:2px`
  - **Warning/Yellow**: `style NodeID fill:#fef3c7,stroke:#d97706,stroke-width:2px`

---

## 7. Writing Style & UX Guardrails

* **Student-Centric Tone**: Maintain a supportive, pedagogically sound, and empathetic voice. Explain "why" before explaining "how".
* **Professional Spanglish**: Keep common development terminology in English (e.g., *endpoint*, *props*, *deployment*, *payload*) rather than translating them awkwardly into Spanish, but write the narrative in natural Spanish.
* **Prohibition of Icons and Emojis**: Do not use emojis in headers, titles, cards, or buttons to keep the user interface clean, professional, and visually uniform.
* **Code Headers**: Always label code blocks with titles (`title="filename.ext"`) and enable line numbering (`showLineNumbers`) for guides.
* **SVG Storage and Reference**: All SVG schemas must be saved as standalone `.svg` files in the directory `static/img/<course-name>/` (e.g., `static/img/iag-al-entorno/`). They should be called in Markdown files using: `![Alt Text](/img/<course-name>/filename.svg)`. Do not embed raw inline SVG XML markup directly inside Markdown/MDX files.
* **Admonition Syntax**: Use `:::type[Title]` syntax when specifying an admonition title (e.g., `:::note[Optional Title]`). Do not place the title string on the line immediately below `:::type`. Admonitions without custom titles can simply use `:::type`.



---

## 8. Interactive and Animated Graphics

Some explanations are understood better by **moving and touching** than by looking at a still image (protocol flows, request lifecycles, architectures, comparisons). For those, use an **interactive piece** instead of a static `.svg`/`.png`.

* **Always start from the skill**: [`.agents/skills/docusaurus_animated_diagrams/SKILL.md`](../skills/docusaurus_animated_diagrams/SKILL.md). It defines the analysis you must do first (what the student must understand, which level of interactivity is justified), the build process, the quality checklist and the lessons learned. Do not write a piece from scratch.
* **Where things live**
  * Shared kit (single master copy, plain JS/CSS, theme-aware): `static/interactive/_shared/` (`dk-base.css`, `dk-theme.js`, `dk-kit.js`, `dk-icons.js`, `dk-flow.js`, `dk-sequence.js`, `dk-compare.js`, `dk-layers.js`, `dk-anatomy.js`, `dk-table.js`, `dk-player.js`). API: `.agents/skills/docusaurus_animated_diagrams/references/kit-api.md`.
  * Each piece: `static/interactive/<course>/<week>/<slug>/index.html`, written mostly as **data** (steps, captions, actors) on top of the kit. Copy `.agents/skills/docusaurus_animated_diagrams/templates/piece/index.html`.
  * Plain `.svg` diagrams still go in `static/img/<course>/` as described above.
* **How to embed (do not use `IframeWindow`, it fixes the height to 300 px and draws a browser frame)**:
  ```mdx
  <iframe
    src="/interactive/<course>/<week>/<slug>/index.html"
    title="Accessible title"
    style={{ width: '100%', height: 700, border: 0 }}
    loading="lazy"
  />
  ```
  The declared height is only a fallback: the piece resizes its own iframe to its content (`DK.autoHeight`).
* **Pantalla completa (prueba en `clean-architecture-circular`; detalle y cómo adaptar una pieza en `references/kit-api.md` de la skill, sección "Pantalla completa")**: para piezas complejas usa `<InteractiveFrame src="/interactive/..." title="..." height={780} />` en lugar del `<iframe>`. Agrega arriba a la derecha el boton "Pantalla completa", que abre la misma pieza en un dialogo (`<dialog>`) casi del tamano de la ventana (Esc o "Cerrar" lo cierran). La pieza del dialogo se marca con `data-dk-fixed`: `DK.autoHeight` no la ajusta al contenido y pone `html.dk-fs`, que las piezas usan para adaptarse al alto disponible (ver `dk-radial.css`). Las demas piezas funcionan igual en el dialogo, solo que sin ajustes especiales.
* **Rules that always apply**: it must work in light and dark theme (use the kit tokens, never raw hex colors), no emojis, texts in Spanish with technical terms in English, and the written explanation of the chapter stays around the piece (the piece accompanies the text, it does not replace it).
* **Review workflow**: new pieces are first built as candidates and reviewed by the teacher before they replace anything in `docs/` (see the skill, step 2 and 4).


---

## 9. Despliegue, rutas y "Ultima actualizacion"

* **Despliegue**: la rama `main` se publica en dos sitios. **Render** (Static Site, `https://docukelo-icesi.onrender.com`) es el sitio principal: se reconstruye solo con cada push a `main`, y el `docusaurus.config.js` detecta la variable `RENDER` para usar `baseUrl: /` y su URL (no requiere variables en el panel de Render). **GitHub Pages** (`https://kelocoes.github.io/docukelo-icesi/`) es el espejo: lo publica `.github/workflows/deploy.yml`, que construye con el `Dockerfile` multi-stage (`deps` -> `build` -> `export`) y sube el resultado con `actions/deploy-pages`. El workflow solo corre con push a `main` (no en pull requests). Algolia, `robots.txt` y el sitemap apuntan al sitio de Render.
* **baseUrl**: en produccion es `/docukelo-icesi/`; en desarrollo (`npm start`) es `/`. Se puede forzar con las variables `BASE_URL` y `SITE_URL` (ver `docusaurus.config.js`).
* **Rutas en los `.md`/`.mdx`**: sigue escribiendo rutas absolutas simples (`/img/...`, `/files/...`, `/interactive/...`) tambien en `<iframe src>`, `<PdfViewer src>` y similares; el plugin `src/plugins/remark-static-base-url.js` les antepone el baseUrl al compilar. En componentes React (`src/`) usa `useBaseUrl('/img/...')`. Nunca escribas una URL completa del sitio dentro de los documentos: usa enlaces relativos (`./otro-doc.md#ancla`).
* **Probar el build de produccion en local con Docker**:
  ```bash
  docker build --build-arg BASE_URL=/ -t docukelo .
  docker run --rm -p 8080:80 docukelo     # http://localhost:8080/
  ```
* **"Ultima actualizacion"** (`showLastUpdateTime` y `showLastUpdateAuthor`): la fecha sale de `git log`, por eso el workflow hace checkout con historial completo y el `Dockerfile` instala `git`. El autor se asigna en `docusaurus.config.js` (`parseFrontMatter`): por defecto *Kevin Rodriguez*; los documentos de `computacion-2/documentacion-guia-springboot/` figuran a nombre de *Carol Mosquera*. Para otro autor en un documento concreto, usa el frontmatter:
  ```yaml
  last_update:
    author: Nombre Apellido
  ```
* **Editar esta pagina**: apunta a `https://github.com/Kelocoes/docukelo-icesi/tree/main/` + ruta del archivo; en `/en/` apunta a la traduccion dentro de `i18n/en/` (`editLocalizedFiles`).
* **Build estricto**: `onBrokenLinks`, `onBrokenAnchors` y `onBrokenMarkdownLinks` estan en `throw`: un enlace o ancla rota hace fallar el build (y el despliegue). Valida siempre con `npm run build`. Node 20 o superior (`.nvmrc`), y `future.faster` (Rspack) activo; si algun dia un build falla solo por eso, desactivalo en `docusaurus.config.js`.

---

## 10. Linter de documentos (`npm run lint:docs`)

`scripts/lint-docs.mjs` revisa los `.md`/`.mdx` de `docs/` y de `i18n/en/` contra las reglas de esta guia. No tiene dependencias.

| Regla | Que exige | Nivel |
|---|---|---|
| `file-name` | Nombre `NN-kebab-case.md` (salvo `intro`) | error |
| `missing-h1` | Un titulo `# ...` por documento | error |
| `image-alt` | `alt` en `<img>` y en `![](...)` | error |
| `emoji` | Sin emojis en el contenido (fuera de bloques de codigo) | error |
| `inline-svg` | Sin `<svg>` dentro del documento (van en `static/img/<curso>/`) | error |
| `admonition-title` | `:::tipo[Titulo]`, no `:::tipo Titulo` | error |
| `i18n-orphan` | Todo documento o categoria en `i18n/en/` debe tener original en `docs/` con la misma ruta y nombre | error |
| `i18n-position` | `sidebar_position` y `_category_.json` (`position`, `key`) iguales en original y traduccion; toda carpeta con traducciones lleva su `_category_.json` | error |
| `missing-description` | `description:` en el frontmatter | aviso |
| `code-title` | `title="..."` en cada bloque de codigo (los bloques de shell de 3 lineas o menos y `mermaid`/`text`/`output`/`diff` estan exentos) | aviso |

Comandos: `npm run lint:docs` (resumen), `-- --verbose` (archivo:linea), `-- --rule=emoji`, `-- --changed` (solo lo modificado segun git), `-- --check` (falla si algun archivo empeora frente a la linea base) y `-- --update-baseline`.

* **Linea base**: `scripts/lint-docs.baseline.json` guarda cuantos incumplimientos tiene hoy cada archivo. Lo antiguo se tolera; lo nuevo debe nacer limpio. Cuando arregles contenido o renombres/muevas archivos, vuelve a correr `npm run lint:docs -- --update-baseline` para actualizarla.
* **Traducciones**: si mueves o renombras un documento en `docs/`, mueve tambien su traduccion en `i18n/en/` (si no, `i18n-orphan` lo detecta). Las traducciones pendientes no son error: solo faltan por hacer. El estado por curso se puede regenerar con un analisis de paridad (ver `temp/` del autor).
* Antes de dar por terminado un documento nuevo o editado, corre `npm run lint:docs -- --changed --verbose` y corrige lo que reporte.

* **Hook de pre-commit**: `.githooks/pre-commit` corre `npm run lint:docs -- --check --changed` y bloquea el commit si un documento modificado incumple las reglas. Se activa solo con `npm install` (script `prepare`, que ejecuta `scripts/install-hooks.mjs` y fija `core.hooksPath`); si no se activo, corre `node scripts/install-hooks.mjs`. Para saltarlo en un commit puntual: `git commit --no-verify`.

---

## 11. Portada, bienvenida y avance de lectura

* **Tarjetas de cursos**: la portada (`src/pages/index.js`) y `docs/intro.md` usan `<CourseCards />`. La lista sale sola de `docs/*/_category_.json` mediante el plugin `src/plugins/courses-data` (nombre = `label`, texto = `link.description`, orden = `position`, semanas y documentos contados del disco; las categorias con `className: "hidden"` no aparecen). **Para un curso nuevo basta con su `_category_.json` y un `intro.md`**; escribe un `link.description` claro (una frase con los temas).
* **Avance de lectura**: la casilla junto a cada pagina del menu lateral (`src/theme/DocSidebarItem/Link`) guarda `docukelo-page-completed-<ruta>` en `localStorage`. Las tarjetas de curso y las categorias del menu muestran el avance (`n de m leidos`) leyendo esas claves (`src/utils/readingProgress.js`). Todo vive en el navegador del estudiante; no hay servidor.
* **Crear una semana nueva**: `npm run scaffold-week -- --course <curso> --week <n> --topics "Tema uno, Tema dos" [--slides] [--label "Nombre"] [--dry-run]` crea la carpeta, el `_category_.json` (posicion automatica) y un documento por tema con la estructura base de la guia. No sobrescribe semanas existentes. La traduccion a `i18n/en` se hace despues, con la misma ruta y nombre.
* **Revisar en celular**: Edge/Chrome headless no baja de ~500 px de ventana; para ver el diseno movil real, incrusta la pagina en un `<iframe>` de 390 px y captura eso. Titulos grandes deben usar tamanos fluidos (`clamp(...)`), no tamanos fijos, y las filas de botones llevan `flex-wrap`.

---

## 12. Dependencias y vulnerabilidades

* `package.json` tiene `overrides` que fuerzan versiones corregidas de paquetes transitivos con avisos de seguridad que Docusaurus 3.10 aun no actualiza: `serialize-javascript`, `proxy-addr`, `shell-quote`, `launch-editor`, `dompurify`, `mermaid` (11.17.x) y `tinypool` (2.x). Cuando Docusaurus publique una version nueva, revisa con `npm ls <paquete>` si el override sigue haciendo falta y quitalo si no.
* Despues de tocar `overrides` o de aceptar un PR de Dependabot: `npm install`, `npm run build` (estricto) y revisa en el navegador una pagina con diagrama Mermaid.
* **No uses `npm audit fix --force`**: baja Docusaurus a 3.7.0 y rehype-katex a 1.2.0 y rompe el sitio.
* Dependabot (`.github/dependabot.yml`) abre PR semanales de npm (agrupados: `@docusaurus/*` juntos y el resto de menores/parches), y mensuales de GitHub Actions y de las imagenes del Dockerfile. Las versiones mayores de React y Docusaurus se actualizan a mano.
* La auditoria del 2026-10-20 dejo 68 avisos (0 criticos, 41 altos, 22 moderados, 5 bajos), todos en herramientas de build/desarrollo salvo `katex` (bajo).

