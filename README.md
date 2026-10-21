# DocuKelo

Portal de documentación de asignaturas y proyectos de la Universidad Icesi: guías paso a paso, laboratorios, slides y diagramas interactivos. Está construido con [Docusaurus](https://docusaurus.io) 3 (React y MDX) y publicado en **https://kelocoes.github.io/docukelo-icesi/**.

## Requisitos

- Node.js 20 o superior (el proyecto usa la versión de `.nvmrc`: `nvm use`).
- npm.

## Comandos

```bash
npm install          # instalar dependencias (primera vez)
npm start            # servidor de desarrollo en http://localhost:3000 (idioma por defecto: es)
npm run build        # build de producción en build/ (es y en)
npm run serve        # sirve el build de producción en local
npm run clear        # limpia la caché de Docusaurus
npm run lint:docs    # revisa los documentos contra las reglas de la guía (ver .agents/memory/docusaurus-guidelines.md)
npm run scaffold-week -- --course computacion-2 --week 17 --topics "Tema uno, Tema dos"   # crea una semana nueva
```

Para ver la versión en inglés en desarrollo: `npm start -- --locale en`.

## Estructura

```
docs/               Contenido por curso (una carpeta por asignatura, y dentro una por semana)
i18n/en/            Traducciones al inglés de los documentos (misma ruta que en docs/)
src/components/     Componentes MDX globales (StepByStep, CardGrid, Quiz, PdfViewer, ...)
src/theme/          Overrides del tema de Docusaurus
src/plugins/        Plugins propios (ruta base de recursos estáticos)
static/img/         Imágenes y SVG, en una carpeta por curso
static/files/       PDFs y archivos descargables, en una carpeta por curso
static/interactive/ Piezas interactivas (HTML) con su kit compartido en _shared/
.agents/            Memoria y skills para agentes de IA (ver AGENTS.md)
```

## Escribir contenido

> Al instalar (`npm install`) se activa un hook de pre-commit que revisa los documentos que modificas con `npm run lint:docs`.

- Cada curso es una carpeta de `docs/` con su `_category_.json` y un `intro.md`; las semanas son subcarpetas con archivos `01-tema.md`, `02-otro.md` (prefijo de dos dígitos, minúsculas y guiones; el prefijo no aparece en la URL).
- Las reglas de estilo, los componentes disponibles y cómo incluir diagramas están en [`.agents/memory/docusaurus-guidelines.md`](.agents/memory/docusaurus-guidelines.md).
- Los documentos nuevos en `es` se traducen a `i18n/en/docusaurus-plugin-content-docs/current/` con la misma ruta.
- "Última actualización" toma la fecha de `git log` y muestra como autor a Kevin Rodriguez, salvo la guía de Spring Boot (Carol Mosquera). Para otro autor, usa `last_update.author` en el frontmatter.

## Despliegue

Se publica automáticamente en GitHub Pages cuando se hace push a `main` (por ejemplo, al fusionar un pull request). El workflow `.github/workflows/deploy.yml` construye el sitio con el `Dockerfile` multi-stage y lo sube con `actions/deploy-pages`.

Para revisar el build de producción con Docker en local:

```bash
docker build --build-arg BASE_URL=/ -t docukelo .
docker run --rm -p 8080:80 docukelo     # http://localhost:8080/
```

En producción el sitio vive bajo `/docukelo-icesi/`; en desarrollo, en `/`. Se puede forzar con las variables `BASE_URL` y `SITE_URL`.

## Para agentes de IA

Empieza por [`AGENTS.md`](AGENTS.md): índice de memoria, skills y del kit de piezas interactivas.
