# Cómo se usa esta skill en DocuKelo (específico del proyecto)

Todo lo que está aquí es **del proyecto DocuKelo** (el sitio de cursos de la Universidad Icesi). En otro proyecto no aplica: usa `SKILL.md` y `host-integration.md`. Las rutas son relativas a la raíz del repo (`docukelo-icesi/`).

## Dónde está cada cosa

| Qué | Dónde | ¿En git? |
|---|---|---|
| Esta skill (proceso, kit, referencias, plantillas, herramientas) | `.agents/skills/docusaurus_animated_diagrams/` | Sí |
| **Copia maestra del kit** | `.agents/skills/docusaurus_animated_diagrams/kit/` | Sí |
| Copia instalada del kit (la que sirve el sitio; **generada**, no se edita) | `static/interactive/_shared/` | Sí (el sitio la necesita al construir) |
| Componente `InteractiveFrame` (instalado) | `src/components/InteractiveFrame/` | Sí |
| Prueba de humo de las piezas (instalada) | `scripts/test-pieces.mjs` (`npm run test:pieces`) | Sí |
| Piezas interactivas ya integradas | `static/interactive/<curso>/<semana>/<slug>/index.html` | Sí |
| Guía general de contenido (sección 8: gráficos interactivos) | `.agents/memory/docusaurus-guidelines.md` | Sí |
| Contexto, decisiones y estado del proyecto de rediseño | `.agents/memory/svg-redesign/README.md` | **No** (`.gitignore`, solo en el disco del profesor) |
| Comentarios y briefs del profesor por gráfico | `.agents/memory/svg-redesign/reviews.json` | **No** |
| Propuestas en revisión (antes de integrar) | `.agents/memory/svg-redesign/candidates/` | **No** |
| El visor donde el profesor revisa (React + Vite) | `temp/svg-diagrams-sandbox/` (`npm run dev`, http://localhost:5199) | **No** (`temp/` ignorado) |
| Referencia del profesor Domi (clonada) | `temp/seminario-software/` | **No** |

**Si no existe la parte "No" (otro equipo, otra máquina):** la skill y el kit funcionan completos; solo faltan los briefs y el visor. Sin brief, **pregunta** al profesor qué debe entender el estudiante antes de dibujar.

**Editar el kit:** se edita `kit/` en la skill y luego se corre `npm run kit:sync`. `npm run kit:check` (y el hook de pre-commit) avisan si `static/interactive/_shared/` no coincide. Nunca edites la copia de `static/`.

## Flujo con el visor (candidatos)

1. **Analizar** en el visor (`temp/svg-diagrams-sandbox`, `npm run dev`, puerto 5199): dónde se usa el gráfico, el texto de alrededor y el **brief** del profesor en `.agents/memory/svg-redesign/reviews.json` (campos `concepto`, `problema`, `interaccion`, `formato`, más comentarios). El brief y los comentarios son la instrucción; si falta información, **preguntar**.
2. **Construir en `candidates/`**, nunca directo en `docs/` ni `static/img`: `node .agents/skills/docusaurus_animated_diagrams/host/new-piece.mjs <plantilla> .agents/memory/svg-redesign/candidates/static/interactive/<curso>/<semana>/<slug>` (la ruta al kit se calcula sola; el visor sirve el kit de `static/`). Un SVG existente a animar sale a `candidates/static/img/<curso>/`.
3. Para que el visor muestre "Original / Propuesta interactiva", agregar `candidates/static/img/<curso>/<nombre>.candidate.json` (ejemplo: `TCP.candidate.json`, con `interactive`, `height`, `finalPath`, `embed`). Re-escanear (`npm run scan` o botón "Re-escanear") y recargar el visor.
4. **Integrar solo con la aprobación del profesor**: `references/integration-checklist.md` (delegable a otro agente). Después, marcar el gráfico como `hecho` en el visor y dejar el original en `static/img/`.
5. Al cerrar, además de la lista de `SKILL.md`: actualizar `.agents/memory/svg-redesign/README.md` (estado de la pieza y decisiones).

## Probar en el sitio

- Docs en español: `npx docusaurus start --port 3001 --locale es --no-open` (el del puerto 3000 del profesor sirve `en`).
- La pantalla del profesor es de ~1868x914 y la columna del documento mide ~690 px: diseña las piezas para eso (código en una pestaña, pantalla completa para lo ancho).
- `npm run test:pieces -- <parte-de-la-ruta>` es **obligatorio, completo, cuando cambie el kit**.

## Integrar en un capítulo

Piezas simples: un `<iframe>` normal (no `IframeWindow`: alto fijo de 300 px y marco de navegador):

```mdx
<iframe src="/interactive/<curso>/<semana>/<slug>/index.html" title="Título accesible"
  style={{ width: '100%', height: 740, border: 0 }} loading="lazy" />
```

Piezas complejas (varios paneles, figura + código, texto pequeño o más de ~700 px de alto): `<InteractiveFrame>` (componente global del sitio), que agrega el botón "Pantalla completa":

```mdx
<InteractiveFrame
  src="/interactive/<curso>/<semana>/<slug>/index.html"
  title="Título accesible"
  height={780}
/>
```

Las piezas de `DK.layers`, `DK.tree`, `DK.sequence`, `DK.canvas`, `DK.codemap`, `DK.files` y `DK.dom` ya traen la disposición de pantalla completa. Las de escenario HTML (`anatomy`, `table`, `compare`, `phone`) todavía no se reorganizan: déjalas como `<iframe>`.

## Decisiones del profesor (2026-10-17)

1. **Tema:** los gráficos se adaptan al modo claro y oscuro, sin tarjeta de fondo fijo. Piezas en iframe: `dk-theme.js` lee el `data-theme` del sitio. SVG estáticos en `<img>`: dos variantes y `ThemedImage` (`import ThemedImage from '@theme/ThemedImage';` en el propio `.md`).
2. **Embebido sin tocar el sitio:** HTML autocontenido con `<iframe>` normal.
3. **Estructura de carpetas:** `static/interactive/_shared/` (kit instalado) y `static/interactive/<curso>/<semana>/<slug>/index.html`. Los SVG estáticos y animados siguen en `static/img/<curso>/`.
4. **Alcance:** el recorrido principal es corto y sin exceso de detalle técnico; el detalle avanzado va detrás de un control opcional (interruptor).

## Decisiones abiertas

1. **Mermaid:** mantenerlos o reemplazarlos por SVG animados en los capítulos clave.
2. **Escenas por construir** (ver `patterns.md`): máquina de estados. Ya existen: secuencia, comparación A/B, arquitectura recorrida, código sincronizado, anatomía explorable, tabla de datos con estado y árbol de componentes + estado.

## Piezas de referencia (solo existen en este repo)

Los ejemplos citados en `SKILL.md`, `patterns.md` y `kit-api.md` (`computacion-2/semana-1/tcp-en-accion`, `computacion-3/semana-14/...`, etc.) son piezas de DocuKelo. En otro proyecto no existen: parte de las plantillas (`templates/`) y de `kit-api.md`.
