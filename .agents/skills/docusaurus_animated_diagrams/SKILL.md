---
name: docusaurus-animated-diagrams
description: Convierte los gráficos de un sitio de documentación (Docusaurus u otro sitio estático) en animaciones o piezas interactivas que enseñan mejor. Guía el análisis pedagógico (qué debe entender el estudiante y cuál es la forma más clara de mostrarlo) y trae un kit portable (CSS con tema claro/oscuro, iconos, motores de diagramas, reproductor paso a paso), un instalador para otro proyecto, plantillas, una prueba de humo y una herramienta para animar un SVG existente.
---

# Gráficos animados e interactivos

Una carpeta autocontenida: el proceso (este archivo), el **kit** (`kit/`), lo que necesita el sitio anfitrión (`host/`), plantillas, herramientas y referencias. Se puede copiar a otro proyecto y funciona: ver `references/host-integration.md`. Lo propio de DocuKelo (el visor, los briefs del profesor, las decisiones) está aparte, en `references/docukelo-project.md`.

## Mapa de la skill (léelo primero)

Las rutas son relativas a la carpeta de la skill (`<skill>`), salvo que se diga otra cosa.

| Qué | Dónde |
|---|---|
| Proceso (este archivo) | `SKILL.md` |
| **El kit: copia maestra** (CSS y `dk-*.js`) | `kit/` |
| Instalar el kit y lo del anfitrión en un proyecto; sincronizar y comprobar | `host/install.mjs` |
| Crear una pieza desde una plantilla, con la ruta al kit calculada | `host/new-piece.mjs` |
| Prueba de humo con navegador real | `host/test-pieces.mjs` |
| Componente `InteractiveFrame` (Docusaurus): incrusta la pieza y agrega "Pantalla completa" | `host/InteractiveFrame/` |
| Plantillas: `piece` (secuencia por fases), `piece-canvas` (escena libre `DK.canvas`), `piece-phone` (simulador de app móvil) | `templates/` |
| Animar un SVG ya dibujado | `tools/dk_animate.py` |
| API de cada módulo del kit | `references/kit-api.md` |
| Qué patrón usar y cuáles están hechos | `references/patterns.md` |
| Principios pedagógicos para que el gráfico enseñe de verdad | `references/key-concepts.md` |
| Errores reales ya cometidos | `references/lessons-learned.md` |
| Requisitos del sitio anfitrión e instalación | `references/host-integration.md` |
| Flujo, rutas y decisiones de DocuKelo | `references/docukelo-project.md` |

**En un proyecto, el kit instalado** vive por defecto en `static/interactive/_shared/` y es una **copia generada**: se edita `kit/` en la skill y se vuelve a correr `node <skill>/host/install.mjs` (en DocuKelo, `npm run kit:sync`; `npm run kit:check` verifica que coincidan).

**Cómo se usa el kit en una frase:** cada pieza es un `index.html` que carga `../../../_shared/dk-*.js` (rutas relativas, para que funcione igual en el sitio y abierta como archivo) y solo define **datos** (actores, fases, pasos con leyenda); el motor dibuja, anima y trae los controles. Orden de carga y API: `references/kit-api.md`. Una pieza nueva sale de `node <skill>/host/new-piece.mjs <plantilla> <carpeta>`.

Los **ejemplos de piezas** que se citan en las tablas (`tcp-en-accion`, `semana-14/...`) son piezas del proyecto DocuKelo: en otro proyecto no existen; usa las plantillas.

## Qué leer y en qué orden

1. Este archivo (proceso).
2. `references/key-concepts.md`: los conceptos clave para que el gráfico enseñe de verdad. **Léelo antes de decidir qué dibujar.**
3. `references/patterns.md`: qué patrón usar y qué ya está construido.
4. `references/kit-api.md`: la API del kit, cuando vayas a construir.
5. `references/lessons-learned.md`: errores reales que ya cometimos (no repetirlos).
6. `references/host-integration.md` si es un proyecto nuevo; `references/docukelo-project.md` si trabajas en DocuKelo (incluye `integration-checklist.md`, la lista para delegar la integración).

## Principio

Una animación no es decoración: cada movimiento debe revelar un **orden** o una **causa**. Si un gráfico se entiende igual de bien quieto, déjalo quieto y mejora su composición. Lo que se entiende **tocando** (el estudiante provoca el cambio y ve causa y efecto juntos) va en una pieza interactiva.

## Proceso para un gráfico

### 1. Analizar (antes de escribir código)

- Ver dónde se usa el gráfico, el texto de alrededor y el **brief** de quien lo pidió (qué concepto, qué problema, qué interacción). El brief y los comentarios son la instrucción. Si falta información, **preguntar**; no inventar profundidad. (En DocuKelo hay un visor y un archivo de briefs: `references/docukelo-project.md`.)
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
| Dónde vive el estado en un árbol de componentes y cómo viaja (lifting, prop drilling, Context, store) | N3 | Kit: `DK.player` + `DK.tree` (ejemplo: `arbol-estado`) |
| Qué pasa por dentro cuando el usuario toca una app móvil (`setState`, controladores, formularios, listas) | N3 | Kit: `DK.player` + `DK.phone` con `code` (ejemplos: `seminario-de-i-d-i/semana-11/setstate-en-accion`, `formulario-registro`, `agenda-monolitica`) |
| Un archivo con varias responsabilidades y cómo se corta | N3 | Kit: `DK.anatomy` con `code`, `layout: 'stack'` y un paso final `all: true` (ejemplo: `responsabilidades-agenda`) |
| Qué se recrea y qué se conserva entre capas paralelas (Widget, Element, RenderObject) | N3 | Kit: `DK.layers` con `sub` por paso e identidades (`#a1`, `#b7`) (ejemplo: `tres-arboles`) |
| Un contrato y varias implementaciones intercambiables, o cuánto se propaga un cambio (SOLID, GRASP, puertos y adaptadores) | N3 | Kit: `DK.player` + `DK.canvas`: toma y enchufe, contadores, maraña, carriles (plantilla `templates/piece-canvas/`; ejemplos en Saman: `polimorfismo-enchufe`, `ocp-regleta`, `parnas-secretos`) |
| Un caso que se entiende cambiando un valor continuo o eligiendo entre muchos casos | N3 | Kit: `DK.canvas` con deslizador (`type: 'range'`) o selector (`type: 'select'`) en `toggles` (ejemplos: `simulador-pruebas`, `clasificador-heuristicas`) |
| Una página y su árbol DOM (qué nodo es qué), o cómo cambia el DOM real frente al Virtual DOM (render, diff, commit) | N3 | Kit: `DK.player` + `DK.dom` (ejemplos: `computacion-2/semana-14/dom-arbol-pagina`, `virtual-dom-diff`) |
| Qué es un componente, cómo se corta una página en componentes (árbol de componentes frente a árbol DOM), reutilización y composición | N3 | Kit: `DK.player` + `DK.dom` en modo componentes (ejemplo: `computacion-2/semana-14/componentes-composicion`) |
| Qué es cada parte de un archivo de código y qué produce (anatomía de un componente) | N3 | Kit: `DK.player` + `DK.codemap` (ejemplo: `computacion-2/semana-14/anatomia-componente`) |
| Cómo viajan las props por el árbol de componentes y qué cambia en el DOM cuando un dato cambia | N3 | Kit: `DK.dom` en modo componentes con `cmarks` y pestaña de código (ejemplo: `computacion-2/semana-14/props-arbol`) |
| Estructura de carpetas de un proyecto (tipo `tree -L`) y convenciones | N3 | Kit: `DK.player` + `DK.files` (ejemplo: `computacion-2/semana-14/estructura-proyecto`) |
| Para qué sirve una herramienta entre tu código y el navegador (Vite: transformar, resolver, HMR, build) | N3 | Kit: `DK.layers` (ejemplo: `computacion-2/semana-14/vite-por-que`) |
| Una analogía física con interruptor y deslizador (CSR frente a SSR como restaurante) | N3 | Kit: `DK.canvas` con iconos `waiter`/`tray`/`grill`/`dish` (ejemplo: `computacion-2/semana-14/csr-bbq`) |
| Dónde se guarda algo y qué cambia según la opción (cookie, localStorage, memoria), partiendo del ejemplo del trabajo en clase | N3 | Kit: `DK.canvas` con selector, el navegador dibujado con sus almacenes, el servidor y un script; el dato aparece en el almacén elegido (ejemplo: `computacion-3/semana-14/donde-vive-la-sesion`) |
| Un código real y lo que produce fuera de él (cookie, petición POST, navegador de una prueba E2E) | N3 | Kit: `DK.player` + `DK.codemap` con `view` HTML (ejemplos: `semana-14/anatomia-cookie-sesion`, `anatomia-server-action`, `anatomia-test-playwright`, `localizadores-playwright`) |
| Por cuántas puertas pasa una petición y en cuál se detiene según su tipo | N3 | Kit: `DK.layers` con selector de peticiones y nodos de salida `tone: 'err'` (ejemplo: `semana-14/capas-de-defensa`) |
| Dónde corre cada parte cuando algo cruza del navegador al servidor, y qué pasaría sin la directiva (`'use server'`) | N3 | Kit: `DK.canvas` con dos zonas, un recibo que viaja y `at` para mover nodos de una zona a otra (ejemplo: `computacion-3/semana-14/use-server-que-hace`) |
| Por dónde viaja una falla hasta la pantalla, según cuál falle | N3 | Kit: `DK.layers` con `outer` (navegador y servidor), flechas `err` hacia atrás y selector (ejemplo: `semana-14/viaje-del-error`) |
| Capas anidadas y cuál atrapa un error según dónde se lanza (`error.tsx`) | N3 | Kit: `DK.canvas` con zonas `round` anidadas (6 niveles), selector y `text` por zona (ejemplo: `semana-14/error-boundaries-segmentos`) |
| Qué mecanismo usar según qué falló (errores, excepciones) | N3 | Kit: `DK.canvas` con selector y `code` función (ejemplo: `semana-14/manejo-de-errores`) |
| Un cliente que espera y reintenta hasta que algo está listo (auto-espera, reintentos) | N3 | Kit: `DK.sequence` con un interruptor de «tarda en responder» (ejemplo: `semana-15/autoespera-playwright`) |
| Qué ve la interfaz mientras espera una operación de red (cargando, error, datos) y qué responde el servidor | N3 | Kit: `DK.player` + `DK.phone` con selector `type: 'select'` y `restart: 'first'`; `build(opts)` genera los pasos de cada caso (ejemplo: `seminario-de-i-d-i/semana-14/estados-asincronos`) |
| Qué petición HTTP produce cada consulta del SDK y qué SQL ejecuta la base de datos (CRUD, PostgREST) | N3 | Kit: `DK.player` + `DK.codemap`, la columna derecha lista las 5 peticiones (ejemplo: `semana-14/crud-postgrest`) |
| Arquitectura por capas con ida y vuelta de una petición (app, servicio, SDK, API, base de datos) | N3 | Kit: `DK.layers` en U con trayectos rectos paralelos (ejemplo: `semana-14/arquitectura-flutter-supabase`) |
| Cómo crece el historial de páginas de un navegador y qué mueven Atrás, Adelante y `replace` (pila con puntero, `navigate` de React Router) | N3 | Kit: `DK.player` + `DK.history` (ejemplo: `computacion-2/semana-15/historial-navegacion`) |
| Qué le pide al servidor un sitio clásico frente a una SPA con router | N3 | Kit: `DK.compare` con `DK.sequence` sin bandejas (ejemplo: `computacion-2/semana-15/spa-vs-multipagina`) |
| Una configuración (rutas anidadas, URL con path variables y query params) y lo que produce | N3 | Kit: `DK.player` + `DK.codemap` con `view()` propio (ejemplos: `computacion-2/semana-15/rutas-anidadas`, `params-url`) |
| Qué ejecuta React al cambiar un estado y por qué las copias no comparten estado; foto y cola de `setState`; cuándo corre un `useEffect`; qué es un custom hook | N3 | Kit: `DK.dom` modo componentes, `DK.canvas` con interruptor, `DK.sequence` con selector y `DK.codemap` (ejemplos en `computacion-2/semana-15/`: `usestate-actualiza`, `usestate-instantanea`, `useeffect-dependencias`, `custom-hook-reuso`) |
| Algo que se entiende provocándolo (estado, fallos, parámetros) | N3 | Kit; escena nueva si no existe el patrón (ver `patterns.md`) |

### 2. Construir en un lugar de revisión, no directo en el capítulo

- Pieza interactiva: `node <skill>/host/new-piece.mjs <plantilla> <carpeta-de-la-pieza>` (`piece`, `piece-canvas` o `piece-phone`; calcula la ruta al kit) y cambiar **solo los datos** (actores, fases, pasos, textos). Si hace falta algo que el kit no tiene, ampliar el kit (ver abajo), no parchar la pieza. En DocuKelo la carpeta de revisión es `candidates/` (`docukelo-project.md`).
- SVG existente a animar: `python <skill>/tools/dk_animate.py inspect|build` (ver más abajo).
- **Si todas las figuras del capítulo se ven como cajas iguales, usa `DK.canvas`** (metáfora física por concepto, iconos sin tarjeta; `key-concepts.md`, 5q a 5t).
- **Reglas visuales de toda pieza nueva con `DK.layers`:** `labels: 'smart'`, figura ancha (`width: 800`) con 90 a 160 unidades entre recuadros que se conectan, **un icono distinto por rol** (cajas con `h >= 70` llevan el icono arriba) y un panel de código con colores por rol si hay código. Verifica el flujo técnico real del framework antes de dibujar las flechas (`key-concepts.md`, 5h).

### 3. Probar como lo vería un estudiante

Recorrer todos los pasos, activar cada interruptor, **ambos temas** (claro y oscuro), 800 px y 360 px de ancho, y el espacio con el texto de arriba y de abajo. Capturas de pantalla, no solo comprobar el DOM. (Cómo levantar el sitio de DocuKelo: `docukelo-project.md`.)

**Prueba automática:** además de la revisión visual, corre la prueba de humo (`npm run test:pieces -- <parte-de-la-ruta>`, o `node <ruta>/test-pieces.mjs`; sin filtro prueba todas). Recorre los pasos, los interruptores, el tema oscuro y la pantalla completa y falla con errores de JavaScript, desbordes o parpadeos del layout (una barra de scroll horizontal que aparece y desaparece al pulsar «Siguiente»). **Es obligatorio correrla completa cuando cambies algo del kit**, porque todas las piezas lo usan.

### 4. Integrar solo con la aprobación de quien pidió el gráfico

La integración es mecánica y se puede **delegar a otro agente** (en DocuKelo: `references/integration-checklist.md`). Resumen:

- Dejar la carpeta de la pieza donde el sitio sirve los estáticos (`<estáticos>/interactive/<curso>/<semana>/<slug>/index.html`).
- En el documento, reemplazar la imagen por un `<iframe>` normal con el `title` accesible y `loading="lazy"`; el alto declarado es solo respaldo, la pieza lo ajusta sola con `DK.autoHeight()`.
- **Piezas complejas: `<InteractiveFrame>`** en vez del `<iframe>` (mismas propiedades: `src`, `title`, `height`): agrega arriba a la derecha el botón "Pantalla completa", que abre la misma pieza en un diálogo casi del tamaño de la ventana. Úsalo con varios paneles (figura + código + explicación), texto pequeño o más de ~700 px de alto. Requiere el componente de `host/InteractiveFrame/` registrado en el sitio (`host-integration.md`). Las piezas de `DK.layers`, `DK.tree`, `DK.sequence`, `DK.canvas`, `DK.codemap`, `DK.files` y `DK.dom` ya traen la disposición de pantalla completa (`kit-api.md`, "Pantalla completa"); las de escenario HTML (`anatomy`, `table`, `compare`, `phone`) todavía no: déjalas como `<iframe>`.
- Dejar el archivo original del gráfico (para poder volver atrás).

### 5. Cerrar: actualizar ESTA skill (obligatorio en cada gráfico)

Al terminar cada gráfico, **antes de pasar al siguiente**, actualizar la skill; no solo `_shared/`. Checklist:

- [ ] **Kit** (`kit/` en la skill; después `install.mjs` o `npm run kit:sync` para actualizar la copia instalada): ¿algo se copió o se escribió específico de la pieza que sirve para otras? Moverlo al kit. ¿Se dibujó un icono por segunda vez? A `dk-icons.js`. ¿Una escena nueva que se repetirá? Un módulo `dk-<escena>.js` con la misma forma que `dk-sequence.js`.
- [ ] **`references/kit-api.md`**: documentar cada función, opción o icono nuevo, en el mismo cambio.
- [ ] **`references/patterns.md`**: marcar el patrón como hecho y agregar su ficha (cuándo usarlo, estructura que funcionó, parámetros típicos, ejemplo real).
- [ ] **`references/key-concepts.md`**: agregar cualquier principio pedagógico nuevo que quien pidió el gráfico haya corregido o aprobado.
- [ ] **Pantalla completa**: si la pieza se integró con `<InteractiveFrame>`, ábrela en el diálogo y revisa que el contenido llene el espacio (ver `kit-api.md`, "Pantalla completa"); si es una escena nueva del kit, agrega sus reglas `.dk-fs`.
- [ ] **`references/lessons-learned.md`**: cada error o sorpresa, con causa y solución.
- [ ] **`templates/`**: si el patrón es nuevo, crear su plantilla y **probarla** (una plantilla sin probar es peor que ninguna).
- [ ] **Instalación:** si cambió algo de `host/` (el instalador, `InteractiveFrame`, la prueba de humo), corre `install.mjs --check` en un proyecto para comprobar que sigue funcionando, y actualiza `references/host-integration.md`.
- [ ] En DocuKelo: estado de la pieza y decisiones en `.agents/memory/svg-redesign/README.md` (`docukelo-project.md`).

## Herramientas

### El kit (`kit/`)

JavaScript plano y CSS, sin dependencias, con tema claro/oscuro automático. Módulos: `dk-base.css`, `dk-theme.js`, `dk-kit.js`, `dk-icons.js`, `dk-flow.js`, `dk-sequence.js`, `dk-layers.js`, `dk-canvas.js`, `dk-compare.js`, `dk-anatomy.js`, `dk-table.js`, `dk-tree.js`, `dk-dom.js` (página simulada + árbol DOM con resaltado en ambos sentidos), `dk-files.js` (explorador tipo `tree -L`), `dk-codemap.js` (código <-> resultado), `dk-phone.js` (teléfono + `State` + árbol de widgets + consola, con modo libre), `dk-nav.js` (teléfono + pila del Navigator, con `dk-nav.css`), `dk-history.js` (navegador + historial con puntero, con `dk-history.css`), `dk-tabs.js` (teléfono con pestañas, con `dk-tabs.css`), `dk-radial.js` (capas concéntricas, con `dk-radial.css`), `dk-player.js` (con panel de código sincronizado opcional, que puede cambiar con los interruptores). API completa y formato de los pasos en `references/kit-api.md`.

Una pieza nueva debería ser ~100 líneas de **datos** (actores, fases, pasos con leyenda). Si estás escribiendo lógica de dibujo, animación, controles o tema dentro de una pieza, para y llévala al kit.

### `tools/dk_animate.py` (N1/N2 sobre un SVG existente)

Anima un SVG **ya hecho**, sin redibujarlo, a partir de una línea de tiempo JSON; produce un `.animated.svg` (autoplay en bucle, solo CSS, funciona dentro de `![](...)`) y un `.player.html`. Solo biblioteca estándar de Python.

```bash
python <skill>/tools/dk_animate.py inspect static/img/<curso>/figura.svg
python <skill>/tools/dk_animate.py build static/img/<curso>/figura.svg spec.json -o <carpeta-de-salida>
```

Especificación (ver `examples/clean-arch-origins.spec.json`): `id`, `groups`, `steps[{title, caption, do[{target, only, fx, dur, stagger, delay}]}]`. Selectores: `@N` (número de `inspect`), `text:abc`, `after:abc` (hermanos tras el comentario `<!-- abc -->`), `#id`, `.clase`, `tag[attr=valor]`. Efectos: `fade`, `rise`, `pop`, `draw` (solo formas), `pulse`, `flow`. Limitaciones: un efecto de entrada por elemento; los `marker` no se dibujan con `draw` (animar la punta aparte con `fade`).

El player generado usa los tokens de `dk-base.css` y sigue el tema claro/oscuro con `dk-theme.js` (la ruta al kit se calcula sola subiendo desde `-o`, o se fija con `--kit ../../interactive/_shared`; si no encuentra el kit, cae a tema claro). El SVG original trae colores fijos de tema claro, por eso en el player se muestra sobre un panel claro también en tema oscuro; el `.animated.svg` dentro de `<img>` no puede cambiar de tema (para eso, dos variantes con `ThemedImage` o una pieza del kit).

## Decisiones y estado del proyecto

Las decisiones del profesor (tema, embebido, estructura de carpetas, alcance) y las abiertas son de DocuKelo: `references/docukelo-project.md`.
