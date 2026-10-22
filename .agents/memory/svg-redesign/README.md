# Rediseno de graficos de DocuKelo: contexto del proyecto

Memoria compartida para cualquier agente (Claude, Gemini, Kimi, etc.) que retome este trabajo. Es un proyecto de varias semanas; lea este archivo primero.

## Objetivo

1. Rediseñar todos los elementos visuales de `docs/` (SVG, PNG/JPG, Mermaid y HTML interactivo): ampliarlos, crear los que falten y volverlos mas animados, ilustrativos y consistentes en espaciado.
2. Reescribir las skills de `.agents/skills/` (hoy genericas y ambiguas) para que un agente, al recibir "usa la skill X para los graficos de este capitulo", haga el proceso completo: analizar el capitulo, entender el problema pedagogico, decidir la forma mas ilustrativa o interactiva, y producir un resultado de la calidad de la referencia.

El profesor escribe las explicaciones y el codigo; los graficos son lo que se quiere elevar.

## Orden de trabajo (decidido por el profesor)

Cursos prioritarios: `computacion-2`, `computacion-3`, `desarrollo-entornos-digitales-web`, `seminario-de-i-d-i`. Despues el resto.

Fases:

1. **Revision (fase actual).** El profesor recorre cada grafico en el visor, marca estado y deja comentarios y un brief. No se rediseña nada en bloque.
2. **Criterios.** De la revision y del benchmark (`benchmark-domi.md`) se destila `quality-criteria.md`.
3. **Skills.** Se reescriben las skills a partir de esos criterios, probandolas en un par de capitulos piloto.
4. **Rediseño por lotes**, con agentes mas potentes, siguiendo los briefs y marcando cada grafico como `hecho`.

## Herramienta: el visor

Ubicacion: `temp/svg-diagrams-sandbox/` (React + Vite). `temp/` esta en `.gitignore`, asi que el codigo del visor NO se versiona. Esta carpeta (`svg-redesign/`) tambien esta en `.gitignore` (decision del profesor, 2026-10-17): vive solo en este disco, sin copia en git. Hacer respaldo manual de `reviews.json` y `candidates/` de vez en cuando.

```bash
cd temp/svg-diagrams-sandbox
npm install        # solo la primera vez (en Windows, correrlo desde PowerShell)
npm run dev        # re-escanea docs/ y abre http://localhost:5199
npm run scan       # solo regenera public/inventory.json
npm run report     # regenera PROGRESS.md desde reviews.json
```

El visor inventaria: archivos `.svg/.png/.jpg/.gif/.webp/.html` de `static/` que `docs/` referencia, bloques ` ```mermaid ` y ` ```svg ` de los `.md/.mdx`, huerfanos (archivos en `static/` que nadie usa) y, como referencia, las figuras del repo del profesor Domi (curso `ref-domi`, desde `temp/seminario-software/`), incluyendo sus bloques ` ```interactive ` que el visor ejecuta en vivo.

Por cada elemento muestra: vista previa en fondo claro/oscuro y a ancho Docusaurus/movil, archivo y linea donde se usa, encabezados, texto antes y despues, fuente alrededor, datos tecnicos y alertas (sin animacion, sin modo oscuro, texto pequeno, etc.).

## Archivos de esta carpeta

| Archivo | Contenido | Quien lo escribe |
|---|---|---|
| `README.md` | Este contexto | A mano |
| `reviews.json` | Estado, prioridad, comentarios y brief de cada grafico, con clave = ruta del archivo o `mermaid:<doc>#<n>` | El visor (no editar a mano salvo para corregir) |
| `PROGRESS.md` | Resumen por curso y lista de pendientes con sus comentarios | `npm run report` |
| `candidates/` | Propuestas de rediseno, con la misma ruta del original (`candidates/static/img/<curso>/<nombre>.animated.svg`, `.player.html`, `.new.svg`). El visor las empareja con su original | Agentes, con `dk_animate.py` |
| `candidates/**/<nombre>.candidate.json` | Manifiesto opcional de una propuesta: `interactive` (ruta del `index.html`), `height`, `finalPath` (donde ira en `static/`), `embed` (el `<iframe>` listo para pegar en el `.md`) | Agentes |
| `benchmark-domi.md` | Que hace bien la referencia y que no | A mano |
| `quality-criteria.md` | Criterios de calidad (borrador) | A mano, se refina con la revision |

## Como retomar (para un agente)

1. Lea este README, `benchmark-domi.md` y `quality-criteria.md`.
2. Lea `PROGRESS.md`; si esta viejo, corra `npm run report`.
3. Trabaje solo los elementos en estado `redisenar` o `en-curso`, de menor a mayor numero de prioridad. El brief y los comentarios de `reviews.json` son la instruccion; si falta el brief, pregunte antes de inventar.
4. Al integrar un grafico nuevo en `docs/`, cambie su estado a `hecho` (o pida al profesor que lo haga en el visor) y anote la decision relevante abajo.

## Skill en borrador

`.agents/skills/docusaurus_animated_diagrams/` (SKILL.md + `tools/dk_animate.py` + `examples/`). Probada el 2026-10-17 con `static/img/computacion-3/clean-arch-origins-timeline.svg`. No esta enlazada en `AGENTS.md` hasta que el profesor la apruebe. Define los niveles N0 a N3 (estatico, animado solo, paso a paso, simulador interactivo); N0 a N2 tienen herramienta, N3 esta por construir a partir del motor de Domi.

## Reglas de proyecto que NO cambian

Las de `.agents/memory/docusaurus-guidelines.md`: sin emojis, textos en espanol con terminos tecnicos en ingles, SVG como archivos en `static/img/<curso>/`, cada grafico acompañado por su explicacion en texto, y verificar con `npm run build`. Tema claro y oscuro deben verse bien (el sitio Docusaurus cambia de tema con su propio selector).

## Linea base (2026-10-17, primer escaneo)

- 470 elementos en total (tras actualizar el clon de Domi con la sesion 6); 298 sin contar la referencia de Domi. 39 huerfanos.
- 169 SVG en `docs/`: **0 animados**, 161 sin ninguna adaptacion a modo oscuro, 28 diagramas Mermaid sin estilo propio.
- Raster (PNG/JPG/WEBP) por curso: computacion-2 18, computacion-3 13, desarrollo 17, seminario 14. Son candidatos a ser reemplazados por SVG o HTML.
- Alertas como "texto-pequeno" son heuristicas (miran `font-size` en unidades del viewBox, no el tamaño renderizado); confirmar visualmente.

## Decisiones tomadas

- 2026-10-17: el visor es una app React y no una pagina estatica, porque servira tambien para crear y refactorizar graficos nuevos, no solo para revisar.
- 2026-10-17: comentarios y estados se guardan en un archivo del proyecto (`reviews.json`), no en el navegador, para que sobrevivan semanas y los lean otros agentes. Ojo: la carpeta esta ignorada por git.
- 2026-10-17: el listado del visor sigue el orden del curso (posicion de cada semana en `_category_.json`, luego `sidebar_position` o prefijo del archivo, luego linea), con encabezados por semana; los huerfanos van al final de cada curso.
- 2026-10-17: una propuesta de rediseno nunca se escribe directo en `static/` ni `docs/`: va a `candidates/`, el profesor la compara en el visor y solo entonces se integra.
- 2026-10-17: **los graficos deben adaptarse al tema claro/oscuro** (decision del profesor). Los interactivos lo hacen leyendo el `data-theme` de `<html>` del sitio desde el iframe del mismo origen (con `?theme=` y `postMessage` para el visor). Los SVG estaticos dentro de `<img>` no pueden saber el tema, por eso se entregan en dos variantes (claro y oscuro) y se muestran con `ThemedImage` de Docusaurus importado en el propio `.md` (sin tocar el sitio).
- 2026-10-17: **los elementos interactivos son HTML embebido, sin modificar el sitio**: se invocan con un `<iframe>` normal dentro del `.md` (no con `IframeWindow`, que fija 300 px de alto y dibuja marco de navegador). Viven en `static/interactive/<curso>/<semana>/<slug>/index.html`, con codigo comun en `static/interactive/_shared/` (kit y tema).
- 2026-10-17: piloto del nivel N3 = `static/img/computacion-2/TCP.webp` (TCP en accion: handshake + perdida y reenvio de piezas + contraste con UDP). Brief borrador ya cargado en el visor para que el profesor lo corrija.
- 2026-10-17: ningun grafico se rediseña hasta terminar la revision del curso correspondiente.

## Estado del piloto TCP (2026-10-17)

- Pieza: `candidates/static/interactive/computacion-2/semana-1/tcp-en-accion/index.html`, con el kit en `static/interactive/_shared/` (copia maestra unica). Primera version, lista para revision del profesor.
- Alcance acordado con el profesor: 3 fases de TCP (conectar, transferir, cerrar), sin entrar en detalle, y perdida de paquete como interruptor opcional. Metafora de piezas de rompecabezas conservada.
- Se ve en el visor entrando por `TCP.webp` (computacion-2): botones Original / Propuesta interactiva, y el fondo claro/oscuro del visor se le pasa a la pieza.
- INTEGRADA en el sitio (2026-10-17, a pedido del profesor, estado `en-curso` para probarla): archivos en `static/interactive/_shared/` y `static/interactive/computacion-2/semana-1/tcp-en-accion/index.html`; en `docs/computacion-2/semana-1/01-protocolos-servidores.md` el `<img src="/img/computacion-2/TCP.webp">` se reemplazo por un `<iframe>` (el WEBP original sigue en `static/img/` por si hay que volver atras). Las copias en `candidates/` son la fuente de trabajo; si se cambia una, copiar de nuevo a `static/`. Como se integro (guia para otras piezas): copiar la carpeta de la pieza y `_shared/` a `static/interactive/`, reemplazar la linea 16 de `docs/computacion-2/semana-1/01-protocolos-servidores.md` por el `embed` del manifiesto, y marcar `hecho`.
- Pendiente de la revision: ajustes de texto de las leyendas, decidir si `TCP_UDP.jpg` tambien se rehace, y probar en el sitio real (alto 740 px, ancho minimo 520 px con scroll horizontal en movil).

## Nota sobre el servidor del sitio

El `docusaurus start` que el profesor tiene en el puerto 3000 sirve el idioma `en` (solo tiene una pagina de bienvenida), no los docs en español. Para ver los docs: `npx docusaurus start --port 3001 --locale es --no-open` y abrir `http://localhost:3001/docs/computacion-2/semana-1/protocolos-servidores`.

## Piloto TCP: cerrado (2026-10-17)

`TCP.webp` marcado `hecho` por el profesor. Ajuste final: el `<iframe>` ya no depende de un alto fijo; `DK.autoHeight()` (en `dk-kit.js`) hace que la pieza ajuste el alto de su propio iframe a su contenido (funciona por ser del mismo origen, sin tocar el sitio). El alto del `<iframe>` en el `.md` queda solo como valor de respaldo. Aprendizaje para las siguientes piezas: llamar siempre a `DK.autoHeight()` al final del script de la pieza.

## Kit y skill (estado al 2026-10-17)

- Kit (copia maestra unica, `static/interactive/_shared/`): `dk-base.css`, `dk-theme.js`, `dk-kit.js`, `dk-icons.js`, `dk-sequence.js`, `dk-player.js`. El piloto TCP se refactorizo para usarlo: su `index.html` quedo en ~80 lineas de datos. Las piezas candidatas piden el kit con rutas relativas y el servidor del visor lo redirige a la copia maestra.
- Skill `docusaurus_animated_diagrams/`: `SKILL.md` (proceso + checklist de cierre obligatorio por grafico), `references/` (`key-concepts`, `patterns`, `kit-api`, `lessons-learned`), `templates/piece/index.html` (probada), `tools/dk_animate.py`, `examples/`.
- Regla del profesor: al cerrar cada grafico se actualiza la skill completa (kit, referencias, plantillas), no solo `_shared`. Esta en el checklist del paso 5 de `SKILL.md`.

## Piloto 2: TCP frente a UDP (2026-10-17)

`TCP_UDP.jpg` (computacion-2, semana 1). Brief del profesor: la diferencia abstracta entre TCP y UDP, con flujos animados, textos breves, colores de la plataforma, player paso a paso. Propuesta en `candidates/static/interactive/computacion-2/semana-1/tcp-vs-udp/` (manifiesto `TCP_UDP.candidate.json`), estado `en-curso`, NO integrada en `docs/`. Primer uso real de la skill: salio el modulo nuevo `dk-compare.js` (comparacion A/B en paralelo) y `DK.player` ahora pasa `(svg, stage)` a la escena. Skill actualizada (kit-api, patterns, key-concepts, lessons-learned, SKILL.md). Para integrarla: copiar la carpeta a `static/interactive/...` y reemplazar la imagen de `TCP_UDP.jpg` (linea ~41 de `01-protocolos-servidores.md`) por el `embed` del manifiesto.

## Piloto 3 y 4: servlet (2026-10-17)

`servlet.png` y `ciclo-vida-servlet.png` (computacion-2, semana 1, `06-tomcat-config.md`; ambas imagenes eran de una fuente externa con su logo). Propuestas en `candidates/static/interactive/computacion-2/semana-1/servlet-en-tomcat/` (patron nuevo: arquitectura recorrida, `dk-layers.js`) y `.../ciclo-vida-servlet/` (secuencia + panel de codigo sincronizado). Manifiestos `servlet.candidate.json` y `ciclo-vida-servlet.candidate.json`. Estado `en-curso`, NO integradas en `docs/`. Se incluyo Coyote (conector HTTP) en la arquitectura; el curso solo explica Tomcat y Catalina, decision pendiente del profesor. Siguiente en la fila: `HTTP_protocol.png` (el profesor ya dejo su brief; patron "anatomia explorable", por construir).

## Incidente del visor (2026-10-17): panel de revision mezclaba datos

El auto-guardado del panel de revision copiaba el brief de un grafico encima de otro (instancia de React reutilizada). Afecto a `servlet.png` (restaurado desde lo leido en la conversacion) y `tomcat-jakarta-vscode-2.png` (vaciado). Corregido con `key={item.id}`. Copia de seguridad previa a la reparacion en el scratchpad de la sesion. Leccion registrada en `lessons-learned.md`.

## Descubribilidad para otros agentes (2026-10-17)

`AGENTS.md` ahora indexa la skill y el kit; `docusaurus-guidelines.md` tiene la seccion 8 (graficos interactivos); `SKILL.md` abre con un mapa de donde esta cada cosa (que va en git y que no); cada archivo del kit apunta a su documentacion en la primera linea.

## Piloto 5: HTTP_protocol.png y migracion del servlet (2026-10-17)

- Migradas a `docs/computacion-2/semana-1/06-tomcat-config.md` (el profesor las marco `hecho`): `servlet-en-tomcat` y `ciclo-vida-servlet`, en `static/interactive/computacion-2/semana-1/`. Las imagenes originales siguen en `static/img/computacion-2/`. Coyote quedo incluido en la arquitectura (el profesor no objeto).
- `HTTP_protocol.png` (era la imagen de MDN, 286x176 px): propuesta `peticion-http` en candidates, patron nuevo "anatomia explorable" (`dk-anatomy.js`) con interruptor GET/POST. Estado `en-curso`, NO integrada en `01-protocolos-servidores.md` (linea ~70).
- Las capturas reales `tomcat-jakarta-*.png` marcadas `hecho` se dejan como estan: son capturas de pantalla, no graficos a rediseñar.

## HTTP_protocol.png integrado y bug del visor (2026-10-17)

- `peticion-http` migrada a `static/interactive/computacion-2/semana-1/peticion-http/` y a `01-protocolos-servidores.md` (reemplaza la imagen de MDN); estado `hecho`. Con esto el capitulo `01-protocolos-servidores` ya tiene 3 piezas interactivas (tcp-en-accion, tcp-vs-udp, peticion-http) y `06-tomcat-config` tiene 2 (servlet-en-tomcat, ciclo-vida-servlet).
- Bug del visor (crash `reading 'split'` al saltar de un grafico con propuesta a uno sin ella): la version elegida en `Preview.jsx` ahora se deriva en el render. Registrado en `lessons-learned.md`.

## Semana 2 de Computacion 2 (Introduccion a Spring) (2026-10-17)

- Revisados los graficos de `S2 - Introduccion Spring`: `spring-ecosystem.png` ya estaba `hecho` (se deja); `ioc-beans-container.svg` y `spring-tomcat-catalina-ioc.svg` tenian brief del profesor y estado `redisenar`.
- Propuestas en candidates (estado `en-curso`, NO integradas en `docs/`): `semana-2/contenedor-ioc-y-beans` (reemplaza el SVG de `03-contenedor-ioc-y-beans-xml.md`, linea ~83) y `semana-2/spring-en-tomcat` (reemplaza el SVG de `05-integracion-spring-servlets.md`, linea ~80). Manifiestos `ioc-beans-container.candidate.json` y `spring-tomcat-catalina-ioc.candidate.json`.
- Kit ampliado: `DK.layers` ahora soporta `sub` por paso (texto de un nodo que cambia) y `trail: 'phase'`. Documentado en `kit-api.md`, `patterns.md`, `lessons-learned.md`.
- Los huerfanos de Computacion 2 incluyen ahora los originales ya reemplazados (TCP.webp, TCP_UDP.jpg, servlet.png, ciclo-vida-servlet.png, HTTP_protocol.png): se pueden borrar de `static/img/` cuando el profesor lo decida (siguen ahi como respaldo).

## Semana 2 integrada y semanas 6 y 8 propuestas (2026-10-17)

- **Integradas (por un subagente, verificadas por mi con `cmp`, `grep` y `git status`)**: `contenedor-ioc-y-beans` en `03-contenedor-ioc-y-beans-xml.md` y `spring-en-tomcat` en `05-integracion-spring-servlets.md` (el profesor las marco `hecho`). Procedimiento documentado en `references/integration-checklist.md`.
- **Propuestas nuevas en candidates (estado `en-curso`, NO integradas)**: `semana-6/paginacion-spring` (reemplaza el SVG de `01-paginacion-spring.md`, linea ~15; escena nueva `dk-table.js`), `semana-6/transaccion-transferencia` (reemplaza `spring-transactions-rollback.svg` en `02-transacciones-rollback.md`, linea ~15; 2 interruptores = 4 desenlaces) y `semana-8/flujo-ssr-thymeleaf` (reemplaza el SVG de `01-thymeleaf-intro.md`, linea ~21). `spring-proxy-transactional.svg` queda como esta (el profesor lo marco `hecho`).
- Kit: `DK.table` (nuevo), `code` del player admite funcion `(opts) => {title, text}`, `throw` en el resaltado. Skill actualizada (kit-api, patterns, key-concepts, lessons-learned, integration-checklist, SKILL.md).

## Correcciones de revision del profesor a las piezas de semanas 6 y 8 (2026-10-17)

- **Codigo de un solo color** (paginacion, transacciones): `DK.highlight` reescrito para distinguir clase, metodo, objeto/variable, palabra clave, texto, numero, anotacion y comentario, con leyenda en el panel. Afecta tambien a `ciclo-vida-servlet` (ya integrada); verificado en el sitio.
- **Figuras repetidas y flechas tapadas**: `DK.layers` ahora acepta `icon` por nodo (cajas con icono arriba), `labels: 'smart'` (etiqueta junto a la flecha) y `width: 800`; iconos nuevos en `dk-icons.js` (card, coins, file, filecode, gear, bag). Es opt-in: las piezas ya integradas (servlet-en-tomcat, contenedor-ioc-y-beans, spring-en-tomcat, ciclo-vida-servlet) NO se tocaron; se pueden modernizar si el profesor lo pide.
- **Error de contenido en Thymeleaf (detectado por el profesor)**: el HTML no sale del motor directo al navegador; lo entrega el DispatcherServlet. La pieza `flujo-ssr-thymeleaf` se rehizo con ese nodo. OJO: el texto de `docs/computacion-2/semana-8/01-thymeleaf-intro.md` ("Explicacion Detallada de los Componentes del Flujo") no menciona el DispatcherServlet; sugerir al profesor ajustarlo al integrar.
- `transaccion-transferencia` rehecha con tarjetas de cuenta, engranaje y mas espacio entre bloques (flechas de ~160 unidades).

## Semanas 6 y 8 integradas (2026-10-17)

`paginacion-spring` (en `semana-6/01-paginacion-spring.md`), `transaccion-transferencia` (en `semana-6/02-transacciones-rollback.md`; la imagen `spring-proxy-transactional.svg` se conserva) y `flujo-ssr-thymeleaf` (en `semana-8/01-thymeleaf-intro.md`) estan integradas y marcadas `hecho`. En el capitulo de Thymeleaf se agrego al texto la mencion del DispatcherServlet (la lista de componentes del flujo y el cierre de la respuesta) para que coincida con el diagrama corregido. Verificadas en el sitio real. Los originales (`spring-pagination-overview.svg`, `spring-transactions-rollback.svg`, `spring-thymeleaf-ssr-flow.svg`) siguen en `static/img/computacion-2/` como respaldo.

## Modernizacion de piezas ya integradas (2026-10-17)

- `servlet-en-tomcat`, `contenedor-ioc-y-beans` y `spring-en-tomcat` se rehicieron con el `DK.layers` nuevo: `width: 800`, `labels: 'smart'`, iconos arriba en las cajas (gear, classbox, filecode, database, bag), huecos de 90 a 130 unidades entre cajas conectadas. Mismos textos y pasos; solo cambio la geometria. Verificadas en claro y oscuro con el servidor del sitio (puerto 3001). Copias actualizadas en `static/interactive/` y en `candidates/`.
- `ciclo-vida-servlet` NO se modifico: usa `DK.sequence` + panel de codigo, que no tiene iconos de caja ni etiquetas inline; el resaltado de codigo nuevo ya le aplica.
- Los originales `.png/.jpg/.webp` reemplazados se quedan en `static/img/` como huerfanos (decision del profesor).

## Seguridad, semana 9 (2026-10-17)

- Revisados y rehechos `authn-vs-authz-conceptual.svg` y `spring-security-architecture-filterchain.svg` (brief y comentarios del profesor en `reviews.json`). Propuestas en candidates, estado `en-curso`, NO integradas en `docs/`: `semana-9/authn-vs-authz` (reemplaza el SVG de `01-autenticacion-vs-autorizacion.md`, linea ~32) y `semana-9/spring-security-filterchain` (reemplaza el SVG de `03-arquitectura-spring-security.md`, linea ~12). Manifiestos `authn-vs-authz-conceptual.candidate.json` y `spring-security-architecture-filterchain.candidate.json`.
- `authn-vs-authz`: dos puertas en orden (Autenticacion crea el `Authentication`, Autorizacion lo lee), salidas 401 y 403, un ejemplo (ana borra al usuario 42) y 2 interruptores (contraseña incorrecta, quitar rol ADMIN) = 3 desenlaces.
- `spring-security-filterchain`: 23 pasos numerados que coinciden con el diagrama de secuencia del capitulo (1 a 12 login, 13 a 17 peticion posterior); la fase 1 presenta las piezas una por una.
- Kit ampliado: flechas `kind: 'err'`, nodos `tone: 'err'`, iconos `lock` y `filter`. Opt-in: las piezas integradas no cambian. Documentado en `kit-api.md`, `patterns.md`, `key-concepts.md` (5k a 5m) y `lessons-learned.md`.
- Pendiente del profesor: revisar ambas en el visor; al integrar, el diagrama Mermaid de secuencia de `03-arquitectura-spring-security.md` queda en parte redundante con la fase 2 de la pieza (puede conservarse como referencia o quitarse).

## Seminario de I+D+i, semanas 11 y 12 (2026-10-21)

Rediseño completo de los gráficos de `semana-11/03`, `04`, `05` y `semana-12/01` (Flutter: `setState`, ciclo de vida, agenda monolítica, elevación de estado y prop drilling). Ocho piezas nuevas en `static/interactive/seminario-de-i-d-i/` (ya integradas en `docs/` y `i18n/en/`): `semana-11/{anatomia-stateful, setstate-en-accion, tres-arboles, ciclo-vida-state, formulario-registro, agenda-monolitica, responsabilidades-agenda}` y `semana-12/elevacion-agenda` (se usa dos veces, con `#fase=3` en la sección de prop drilling). Escena nueva en el kit: `dk-phone.js` (teléfono + `State` + árbol de widgets + consola, con modo libre). Los SVG originales siguen en `static/img/seminario-de-i-d-i/` por si hay que volver atrás (`stateless-vs-stateful-arquitectura`, `arbol-widgets-elements-reconstruccion`, `ciclo-vida-stateful-controller`, `taller-agenda-contactos-flujo`, `prop-drilling-zona-*`). También se corrigieron errores de contenido (ver `lessons-learned.md`, sección Flutter). Pendiente: revisión del profesor en el sitio.
