# DocuKelo Platform Backlog

This checklist tracks future features and tools proposed to extend the visual, interactive, and authoring capabilities of the DocuKelo documentation platform.

## Authoring & Creator Tools
- [x] **1. Interactive Content Scaffolder CLI**: A command-line script (e.g., `npm run scaffold-week`) to automatically generate new week directories, `_category_.json` files, and `.mdx` templates. *(Hecho: `npm run scaffold-week`.)*
- [x] **2. MDX Syntax Linter Hook**: A Git pre-commit hook that checks modified `.mdx` files for unescaped characters or formatting issues. *(Hecho: `npm run lint:docs` y hook de pre-commit en `.githooks/`, ver la sección 10 de la guía.)*
- [ ] **3. Translation Automation Utility**: A local utility to translate memory and skill documents under `agents/` to English automatically.
- [ ] **4. Mermaid SVG Pre-compiler**: A build-time tool that renders Mermaid diagrams into static SVGs during compilation for optimized page loads.
- [ ] **5. Asset Dependency Tracker**: A script that scans static assets (`static/img/` and `static/files/`) and flags or cleans up unused files.

## Interactive Learning Components
- [ ] **6. In-page Live Code REPL**: A custom MDX component (`<InteractiveConsole />`) using WebAssembly (like Pyodide or Web-compiled Dart) to run code snippets in-page.
- [x] **7. Custom Self-Assessment Quizzes**: An MDX `<Quiz>` / `<Question>` component supporting inline assessments with explanations. *(Hecho: `<Quiz>`; se reemplaza la nota de "planning stage".)*
- [ ] **8. E2E Testing System**: An end-to-end testing suite (e.g., Playwright) that crawls all pages and documentation files to ensure no rendering errors, broken layouts, or broken links exist.
- [ ] **9. In-Browser SQLite Playground**: An interactive SQL console (using `sql.js`) for running database queries directly within MDX documents.
- [ ] **10. Interactive Git Simulator**: A visual widget simulating Git operations and rendering dynamic Git Trees in real time.
- [ ] **11. Mock API Explorer**: An embedded wrapper to test API requests against local targets (`http://localhost:8080`) or mock servers.
- [x] **12. Gamified Progress Tracker**: A LocalStorage-based checklist tracking student progress and showing completion states on category pages. *(Hecho: casilla por página en el menú y avance en tarjetas de curso, sección 11 de la guía.)*

## Visual Repertoire & Theme Extensions
- [ ] **13. Split-Screen Code Walkthrough**: A side-by-side split layout component displaying instructions on one side and a scroll-linked code snippet on the other.
- [ ] **14. Tech Stack Interactive Map**: An animated nodes diagram representing course architectures (frontend/backend/DB) with clickable configuration details.
- [ ] **15. Custom Icesi-branded Callouts**: Extended Docusaurus admonition styling for tags like `:::design-tip`, `:::grading-rubric`, etc.
- [x] **16. Theme-aware SVGs / Image Switcher**: A utility component swapping image assets or SVG styling depending on light/dark mode settings. *(Hecho con `ThemedImage` de Docusaurus y dos variantes `-light`/`-dark`; las piezas interactivas siguen el tema con `dk-theme.js`.)*
- [ ] **17. Simulated Terminal Session Player**: An aesthetic terminal shell animator simulating command line executions.

## System Integrations
- [ ] **18. Docusaurus AI Assistant Widget**: An AI assistant widget trained on the docs to help students troubleshoot issues.
- [ ] **19. GitHub Classroom Dashboard**: A dashboard widget displaying assignment deadlines and GitHub submission statuses.
- [ ] **20. LTI Integration for LMS**: Connecting the platform to Moodle/Canvas via LTI protocols to sync student course progression.

## Hecho fuera de esta lista
- [x] **Gráficos interactivos con kit `dk-*`** (`static/interactive/_shared/`) y skill `docusaurus_animated_diagrams`.
- [x] **Pantalla completa para gráficos complejos** (`<InteractiveFrame>`), probada en el círculo de Clean Architecture.
- [x] **Despliegue en Render y GitHub Pages**, Dependabot, `overrides` de seguridad y traducciones al inglés de computación 2 y 3, desarrollo y seminario.

## Pendientes del análisis de mejoras (2026-10-22)
Estado verificado contra el repositorio; el análisis completo vive en `temp/` del autor (ignorado por git).

**Inmediato**
- [ ] Decidir qué hacer con los 11 PR de Dependabot abiertos (#72 a #77, #79 a #83): reactivar el build en los PR o fusionar a mano los de bajo riesgo tras correr `npm run build`.
- [ ] Comprobar en Render y GitHub Pages el contador de lectura (`n/55` en computación 2), registrar el sitemap en Search Console y revisar "Última actualización" en Render.

**Menor**
- [x] `plugin-client-redirects` para las URLs que cambiaron de mayúsculas a minúsculas (hecho: `src/redirects.js`, 35 redirecciones reconstruidas desde el historial de Git; ver la guía, sección 9).
- [ ] `DaisyPreview`: fijar la versión de Tailwind/daisyUI o empaquetar el CSS (hoy usa CDN sin SRI).
- [ ] Carpetas vacías del menú: `seminario-de-i-d-i/semana-13` a `16`.
- [ ] Revisión humana de una muestra de las `description` y los `title=` generados por modelos.
- [ ] Contrastar `computacion-3/semana-12/03-configuracion-redux-nextjs` con la rama `week-12/next-redux` (ruta del slice y nombre del thunk).

**Mayor**
- [ ] Idiomas: `i18n/en/code.json` y navbar traducido; decidir qué cursos mantener en inglés (hoy 70 %; sin traducir: Diseñando con Algoritmos, IAG, Flutter).
- [ ] Accesibilidad y rendimiento: Lighthouse o `axe` sobre unas páginas, `plugin-ideal-image` o `sharp` para PNG/JPG, comprimir PDFs (49 MB, 7 de más de 2 MB).
- [ ] CI: build en PR, Lighthouse CI o `pa11y-ci`, `npm audit`; pruebas de `Quiz`, `PdfViewer` y `FocusModeButton`.
- [ ] Piezas interactivas: reglas `dk-fs` (pantalla completa) para `DK.layers`, `DK.sequence` y el resto; prueba E2E con Playwright de cada `index.html`.
- [ ] Skills: árbol de decisión único entre `docusaurus_mermaid_svg`, `resource_visualizer`, `pedagogical_svg_designer` y `docusaurus_animated_diagrams`; skills de crear semana, traducir es a en y slides con PDF.
