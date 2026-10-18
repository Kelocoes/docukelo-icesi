---
name: docusaurus-animated-diagrams
description: BORRADOR EN USO (piloto TCP validado). Convierte los gráficos de un capítulo de DocuKelo en animaciones o piezas interactivas que enseñan mejor. Guía el análisis pedagógico (qué debe entender el estudiante y cuál es la forma más clara de mostrarlo) y trae un kit reutilizable (CSS con tema claro/oscuro, iconos, motor de diagramas de secuencia, reproductor paso a paso) más herramientas para animar un SVG existente.
---

# Gráficos animados e interactivos para DocuKelo (borrador en uso)

Estado: validada con un piloto en producción local, `static/interactive/computacion-2/semana-1/tcp-en-accion/` (aprobado por el profesor). Aún no está enlazada en `AGENTS.md`; se enlaza cuando el profesor la dé por estable. Contexto del proyecto, decisiones y avance: `.agents/memory/svg-redesign/README.md`.

## Mapa: dónde está cada cosa (léelo primero)

Todas las rutas son relativas a la raíz del repo (`docukelo-icesi/`). Si no estás seguro de dónde está algo, está aquí.

| Qué | Dónde | ¿En git? |
|---|---|---|
| Esta skill (proceso, referencias, plantilla, herramienta) | `.agents/skills/docusaurus_animated_diagrams/` | Sí |
| **El kit compartido** (CSS, `dk-*.js`) | `static/interactive/_shared/` | Sí |
| Documentación del kit (API de cada módulo) | `references/kit-api.md` (en esta skill) | Sí |
| Piezas interactivas ya integradas | `static/interactive/<curso>/<semana>/<slug>/index.html` | Sí |
| Plantilla para una pieza nueva | `templates/piece/index.html` (en esta skill) | Sí |
| Guía general de contenido (sección 8: gráficos interactivos) | `.agents/memory/docusaurus-guidelines.md` | Sí |
| Contexto, decisiones y estado del proyecto de rediseño | `.agents/memory/svg-redesign/README.md` | **No** (en `.gitignore`, solo en el disco del profesor) |
| Comentarios y briefs del profesor por gráfico | `.agents/memory/svg-redesign/reviews.json` | **No** |
| Propuestas en revisión (antes de integrar) | `.agents/memory/svg-redesign/candidates/` | **No** |
| El visor donde el profesor revisa (React + Vite) | `temp/svg-diagrams-sandbox/` (`npm run dev`, http://localhost:5199) | **No** (`temp/` ignorado) |
| Referencia del profesor Domi (clonada) | `temp/seminario-software/` | **No** |

**Cómo se usa el kit en una frase:** cada pieza es un `index.html` que carga `../../../_shared/dk-*.js` (rutas relativas, para que funcione igual en el sitio y en el visor) y solo define **datos** (actores, fases, pasos con leyenda); el motor dibuja, anima y trae los controles. Orden de carga y API: `references/kit-api.md`. Ejemplos reales que funcionan: `static/interactive/computacion-2/semana-1/tcp-en-accion/` y `tcp-vs-udp/`.

**Si no existe la parte "No" (otro equipo, otra máquina):** la skill y el kit siguen funcionando completos; solo faltan los briefs y el visor. Sin brief, **pregunta** al profesor qué debe entender el estudiante antes de dibujar.

## Qué leer y en qué orden

1. Este archivo (proceso).
2. `references/key-concepts.md`: los conceptos clave para que el gráfico enseñe de verdad. **Léelo antes de decidir qué dibujar.**
3. `references/patterns.md`: qué patrón usar y qué ya está construido.
4. `references/kit-api.md`: la API del kit, cuando vayas a construir.
5. `references/lessons-learned.md`: errores reales que ya cometimos (no repetirlos).
5b. `references/integration-checklist.md`: cómo integrar una pieza aprobada en un capítulo (delegable a otro agente).
6. Pieza de referencia (el estándar a igualar): `static/interactive/computacion-2/semana-1/tcp-en-accion/index.html`. Son ~80 líneas de datos; el motor vive en el kit.

## Principio

Una animación no es decoración: cada movimiento debe revelar un **orden** o una **causa**. Si un gráfico se entiende igual de bien quieto, déjalo quieto y mejora su composición. Lo que se entiende **tocando** (el estudiante provoca el cambio y ve causa y efecto juntos) va en una pieza interactiva.

## Proceso para un gráfico

### 1. Analizar (antes de escribir código)

- Abrir el gráfico en el visor (`temp/svg-diagrams-sandbox`, `npm run dev`, puerto 5199): ver dónde se usa, el texto de alrededor y el **brief** que dejó el profesor en `.agents/memory/svg-redesign/reviews.json` (campos `concepto`, `problema`, `interaccion`, `formato`, más comentarios). El brief y los comentarios son la instrucción. Si falta información, **preguntar**; no inventar profundidad.
- Leer el capítulo completo (y el anterior). Listar las afirmaciones del texto: cada una debería tener algo visible en el gráfico.
- Responder por escrito: concepto que debe entender el estudiante, error común que evita, qué NO mostrar.
- Elegir el **nivel** (tabla abajo) y el **patrón** (`references/patterns.md`). Anotar la elección y por qué.

| Lo que se enseña | Nivel | Herramienta |
|---|---|---|
| Estructura o comparación, sin tiempo | N0 | SVG estático (editar el SVG) |
| Historia o secuencia sobre un SVG ya dibujado | N1 / N2 | `tools/dk_animate.py` (SVG que se anima solo / player) |
| Flujo entre actores por fases, paso a paso | N2 / N3 | Kit: `DK.player` + `DK.sequence` (`templates/piece/`) |
| Diferencia entre dos alternativas frente al mismo escenario | N3 | Kit: `DK.player` + `DK.compare` (ejemplo: `tcp-vs-udp`) |
| Dónde vive algo y por dónde pasa una solicitud (componentes anidados) | N3 | Kit: `DK.player` + `DK.layers` (ejemplos: `servlet-en-tomcat`, `spring-en-tomcat`) |
| Un concepto que es un cambio dentro de un componente (inyección de dependencias) | N3 | Kit: `DK.layers` con `sub` por paso y `trail: 'phase'` (ejemplo: `contenedor-ioc-y-beans`) |
| La estructura de algo y qué hace cada parte (petición HTTP, token, documento) | N3 | Kit: `DK.player` + `DK.anatomy` (ejemplo: `peticion-http`) |
| Qué trae una consulta (paginación, orden, filtros) con SQL y costo | N3 | Kit: `DK.player` + `DK.table` (ejemplo: `paginacion-spring`) |
| Qué cambia el resultado según decisiones (con/sin anotación, con/sin fallo) | N3 | Kit: `DK.layers` con `sub`, `code` función y varios interruptores (ejemplo: `transaccion-transferencia`) |
| Qué método/línea se ejecuta cuándo (ciclo de vida) | N3 | Kit: `DK.player` + `DK.sequence` con la opción `code` (ejemplo: `ciclo-vida-servlet`) |
| Algo que se entiende provocándolo (estado, fallos, parámetros) | N3 | Kit; escena nueva si no existe el patrón (ver `patterns.md`) |

### 2. Construir en `candidates/`, nunca directo en `docs/` ni `static/img`

- Pieza interactiva: copiar `templates/piece/index.html` a `.agents/memory/svg-redesign/candidates/static/interactive/<curso>/<semana>/<slug>/index.html` y cambiar **solo los datos** (actores, fases, pasos, textos). Si hace falta algo que el kit no tiene, ampliar el kit (ver abajo), no parchar la pieza.
- SVG existente a animar: `python .agents/skills/docusaurus_animated_diagrams/tools/dk_animate.py inspect|build` (ver más abajo). Salida en `candidates/static/img/<curso>/`.
- **Reglas visuales de toda pieza nueva con `DK.layers`:** `labels: 'smart'`, figura ancha (`width: 800`) con 90 a 160 unidades entre recuadros que se conectan, **un icono distinto por rol** (cajas con `h >= 70` llevan el icono arriba) y un panel de código con colores por rol si hay código. Verifica el flujo técnico real del framework antes de dibujar las flechas (`key-concepts.md`, 5h).
- Para que el visor muestre "Original / Propuesta interactiva" junto al original, agregar `candidates/static/img/<curso>/<nombre>.candidate.json` (ejemplo: `TCP.candidate.json`, con `interactive`, `height`, `finalPath`, `embed`).
- Re-escanear (`npm run scan` o botón "Re-escanear") y recargar el visor.

### 3. Probar como lo vería un estudiante

Recorrer todos los pasos, activar cada interruptor, **ambos temas** (claro y oscuro), 800 px y 360 px de ancho, y el espacio con el texto de arriba y de abajo. Para integrar en el sitio ver los docs en español: `npx docusaurus start --port 3001 --locale es --no-open` (el del 3000 del profesor sirve `en`). Capturas de pantalla, no solo comprobar el DOM.

### 4. Integrar solo con la aprobación del profesor

La integración es mecánica y se puede **delegar a otro agente**: ver `references/integration-checklist.md` (pasos, verificación, restricciones y cómo comprobar su reporte). Resumen:

- Copiar la carpeta de la pieza a `static/interactive/<curso>/<semana>/<slug>/`.
- En el `.md`, reemplazar la imagen por un `<iframe>` normal (no `IframeWindow`: alto fijo de 300 px y marco de navegador):
  ```mdx
  <iframe src="/interactive/<curso>/<semana>/<slug>/index.html" title="Título accesible"
    style={{ width: '100%', height: 740, border: 0 }} loading="lazy" />
  ```
  El alto declarado es solo respaldo: la pieza lo ajusta sola con `DK.autoHeight()`.
- Dejar el archivo original en `static/img/` (para poder volver atrás) y marcar el gráfico como `hecho` en el visor.

### 5. Cerrar: actualizar ESTA skill (obligatorio en cada gráfico)

Al terminar cada gráfico, **antes de pasar al siguiente**, actualizar la skill; no solo `_shared/`. Checklist:

- [ ] **Kit** (`static/interactive/_shared/`): ¿algo se copió o se escribió específico de la pieza que sirve para otras? Moverlo al kit. ¿Se dibujó un icono por segunda vez? A `dk-icons.js`. ¿Una escena nueva que se repetirá? Un módulo `dk-<escena>.js` con la misma forma que `dk-sequence.js`.
- [ ] **`references/kit-api.md`**: documentar cada función, opción o icono nuevo, en el mismo cambio.
- [ ] **`references/patterns.md`**: marcar el patrón como hecho y agregar su ficha (cuándo usarlo, estructura que funcionó, parámetros típicos, ejemplo real).
- [ ] **`references/key-concepts.md`**: agregar cualquier principio pedagógico nuevo que el profesor haya corregido o aprobado.
- [ ] **`references/lessons-learned.md`**: cada error o sorpresa, con causa y solución.
- [ ] **`templates/`**: si el patrón es nuevo, crear su plantilla y **probarla** (una plantilla sin probar es peor que ninguna).
- [ ] **`.agents/memory/svg-redesign/README.md`**: estado de la pieza y decisiones.
- [ ] Si cambió algo del flujo del visor (formatos, manifiestos), actualizar este archivo.

## Herramientas

### El kit (`static/interactive/_shared/`)

JavaScript plano y CSS, sin dependencias, con tema claro/oscuro automático. Módulos: `dk-base.css`, `dk-theme.js`, `dk-kit.js`, `dk-icons.js`, `dk-flow.js`, `dk-sequence.js`, `dk-layers.js`, `dk-compare.js`, `dk-anatomy.js`, `dk-table.js`, `dk-player.js` (con panel de código sincronizado opcional, que puede cambiar con los interruptores). API completa y formato de los pasos en `references/kit-api.md`.

Una pieza nueva debería ser ~100 líneas de **datos** (actores, fases, pasos con leyenda). Si estás escribiendo lógica de dibujo, animación, controles o tema dentro de una pieza, para y llévala al kit.

### `tools/dk_animate.py` (N1/N2 sobre un SVG existente)

Anima un SVG **ya hecho**, sin redibujarlo, a partir de una línea de tiempo JSON; produce un `.animated.svg` (autoplay en bucle, solo CSS, funciona dentro de `![](...)`) y un `.player.html`. Solo biblioteca estándar de Python.

```bash
python .agents/skills/docusaurus_animated_diagrams/tools/dk_animate.py inspect static/img/<curso>/figura.svg
python .agents/skills/docusaurus_animated_diagrams/tools/dk_animate.py build static/img/<curso>/figura.svg spec.json \
  -o .agents/memory/svg-redesign/candidates/static/img/<curso>
```

Especificación (ver `examples/clean-arch-origins.spec.json`): `id`, `groups`, `steps[{title, caption, do[{target, only, fx, dur, stagger, delay}]}]`. Selectores: `@N` (número de `inspect`), `text:abc`, `after:abc` (hermanos tras el comentario `<!-- abc -->`), `#id`, `.clase`, `tag[attr=valor]`. Efectos: `fade`, `rise`, `pop`, `draw` (solo formas), `pulse`, `flow`. Limitaciones: un efecto de entrada por elemento; los `marker` no se dibujan con `draw` (animar la punta aparte con `fade`).

El player generado usa los tokens de `dk-base.css` y sigue el tema claro/oscuro con `dk-theme.js` (la ruta al kit se calcula sola subiendo desde `-o`, o se fija con `--kit ../../interactive/_shared`; si no encuentra el kit, cae a tema claro). El SVG original trae colores fijos de tema claro, por eso en el player se muestra sobre un panel claro también en tema oscuro; el `.animated.svg` dentro de `<img>` no puede cambiar de tema (para eso, dos variantes con `ThemedImage` o una pieza del kit).

## Decisiones tomadas por el profesor (2026-10-17)

1. **Tema:** los gráficos se adaptan al modo claro y oscuro, sin tarjeta de fondo fijo. Piezas en iframe: `dk-theme.js` lee el `data-theme` del sitio. SVG estáticos en `<img>`: dos variantes y `ThemedImage` (`import ThemedImage from '@theme/ThemedImage';` en el propio `.md`).
2. **Embebido sin tocar el sitio:** HTML autocontenido con `<iframe>` normal.
3. **Estructura de carpetas:**
   ```
   static/interactive/
     _shared/                     el kit (copia maestra única)
     <curso>/<semana>/<slug>/     index.html de cada pieza
   ```
   Los SVG estáticos y animados siguen en `static/img/<curso>/`.
4. **Alcance:** el recorrido principal es corto y sin exceso de detalle técnico; el detalle avanzado va detrás de un control opcional (interruptor).

## Decisiones abiertas

1. **Mermaid:** mantenerlos o reemplazarlos por SVG animados en los capítulos clave.
2. **Escenas por construir** (ver `patterns.md`): máquina de estados, árbol + estado. Ya existen: secuencia, comparación A/B, arquitectura recorrida, código sincronizado, anatomía explorable y tabla de datos con estado.
