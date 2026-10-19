# Lecciones aprendidas (errores reales y su solución)

Cada entrada: **qué pasó → causa → qué hacer**. Agregar una entrada nueva cada vez que aparezca un error o una sorpresa. Es la parte más valiosa de la skill.

## Animación y SVG

- **El `transform` de CSS anula el atributo `transform` de SVG.** Al animar con CSS un grupo que ya tenía `transform="translate(...)"`, el grupo salta al origen. → `dk_animate.py` envuelve cada elemento animado en un `<g>` propio; en piezas escritas a mano, animar un envoltorio y no el elemento posicionado.
- **`marker-end` aparece antes de que se dibuje la línea.** Un `marker` se pinta aunque el trazo todavía esté oculto con `stroke-dashoffset`. → Dibujar la punta de flecha como `<path>` aparte y hacerle `fade` al final (así lo hacen `dk_animate.py` y `dk-sequence.js`).
- **Un SVG dentro de `<img>` no ejecuta JavaScript** y no puede leer el tema del sitio. → Animaciones solo con CSS/SMIL; para tema usar dos variantes con `ThemedImage`; para interacción usar iframe.
- **`classList.toggle(clase, undefined)` NO fuerza nada: alterna.** Resultado: las tres bandas de fase quedaron encendidas. → Siempre `toggle(clase, !!condicion)`.
- **Las etiquetas encima de la flecha chocan con la flecha vecina** cuando las filas están a menos de ~24 px. → Poner la etiqueta **sobre su propia flecha** con halo (`paint-order: stroke`) y filas a 24 px; en mensajes perdidos, correr la etiqueta al 30 % del recorrido para no tapar la X.
- **Las bandas de fase se solapan** si cada una suma el mismo margen arriba y abajo: la franja de unión se ve más oscura. → Margen superior 11 px, inferior `slant + 1`, de modo que no se toquen.
- **El texto de un SVG que se encoge se vuelve ilegible** en móvil. → `min-width` en el contenedor y `overflow-x: auto`, en vez de dejar que el SVG baje de ~520 px.

## Diseño de piezas

- **Un SVG de 640 de ancho a media columna es ilegible.** Al poner dos diagramas lado a lado cada uno mide ~360 px; el texto de 12 unidades baja a ~7 px. → El panel usa un `viewBox` de 384 de ancho (`width: 384, margin: 92`) para que 12 unidades sigan siendo ~12 px.
- **Una etiqueta de banda choca con la línea de vida** si el margen del actor es menor que el ancho del texto de la banda. → `margin: 92` en paneles angostos.
- **Lo que no ocurre se tiene que ver.** Si en un panel no hay mensajes en una fase, no se dibuja su banda (así UDP muestra que no hay "Abrir"); sin una nota explícita el estudiante puede creer que falta algo.
- **La escena no siempre es un solo SVG.** `DK.player` le pasa `(svg, stage)` a la escena; las escenas compuestas ignoran el `svg` y llenan `stage`.
- **Comandos largos de bash con heredocs que mezclan comillas, acentos y backticks fallan a medias.** → Para editar documentación o código con muchas comillas, usar la herramienta de edición de archivos, una edición por cambio.

- **Una pieza con mucho código quedaba de ~1.080 px.** → El panel de código tiene alto limitado (~196 px) y se desplaza solo hasta la línea resaltada (`scrollTo` con `offsetTop`; el contenedor necesita `position: relative`). Bajó a ~870 px.
- **Sin bandejas de piezas, las filas empezaban muy abajo.** El hueco estaba reservado para las bandejas. → `firstRowY` por defecto depende de si hay bandejas (160) o no (124).
- **Las barras de desplazamiento nativas salen blancas en tema oscuro.** → `color-scheme: dark` en la regla del tema oscuro de `dk-base.css`.
- **Una etiqueta sobre una flecha vertical queda cortada por la propia línea.** El halo de la etiqueta oculta el trazo, lo que se lee bien; no mover la etiqueta fuera de la línea porque en tramos cortos se confunde con la caja vecina.
- **Al extraer lógica común a un módulo (`dk-flow.js`) hay que volver a probar TODAS las piezas ya publicadas**, y agregar el `<script>` nuevo a cada `index.html` y a la plantilla (los scripts clásicos no se importan solos).

- **Probar iframes con `loading="lazy"` desde un script no funciona si no están a la vista:** el documento del iframe aún no cargó y la prueba "no encuentra" la pieza (falso negativo). → Desplazar cada iframe a la vista (`scrollIntoView`) y esperar ~1,5 s antes de inspeccionarlo.
- **`DK.player` calcula la duración de cada paso con `step.msgs.length`.** Una escena sin flechas (como `dk-anatomy` en los pasos que solo enfocan) debe igualmente entregar `msgs: []`, o el reproductor automático falla.
- **Un segmento vacío (`['']`) no se ve como línea en blanco en `innerText` aunque sí tenga altura visual** (se le da `min-height` a la línea). Para HTTP importa: la línea en blanco antes del cuerpo es parte del formato.
- **`color-mix(in srgb, var(--pc) 16%, transparent)` da un fondo teñido por parte sin definir 5 colores de fondo** (funciona en los navegadores actuales); la variable `--pc` se pone por elemento.

- **Flechas cortas entre recuadros (< 50 unidades) con rótulo largo se pisan con los bordes.** Rótulos de una palabra (`GET`, `doGet()`, `lee`, `new`) y dar 60 a 80 unidades de hueco entre los recuadros que se conectan; si no cabe, mover los recuadros, no alargar el rótulo.
- **Dos flechas que salen del mismo borde (solicitud y respuesta) necesitan ~18 a 25 unidades de separación vertical**, o las etiquetas se montan.
- **Un diagrama de varias fases con flechas acumuladas se llena de líneas:** con `trail: 'phase'` (solo las de la fase actual) quedó limpio; en la fase de 4 pasos conviene que cada flecha tenga su propia altura.
- **Probar los diagramas anidados en las dos temas:** los recuadros `outer` usan un fondo traslúcido (`--dk-band`); en oscuro la superposición de 3 a 4 niveles puede perder contraste entre niveles (revisar con una captura).

- **Con 2 interruptores hay 4 desenlaces, y solo se descubren bugs probándolos todos.** Escribir un script que fija los dos interruptores a cada combinación, reinicia, recorre todos los pasos y lee el estado final (saldos, estado, primera línea de código, líneas resaltadas). Así se verificó la transferencia en una sola pasada.
- **Cuando una pieza cambia el código con un interruptor, los números de línea de los pasos deben valer en todas las variantes.** Reemplazar una línea (`@Transactional` ↔ `// @Transactional (quitada)`), nunca insertar ni quitar.
- **El resaltado de código no conocía `throw`** (solo `throws`); las palabras clave nuevas se agregan a `KEYWORDS` en `dk-kit.js`. Revisar el código del capítulo contra esa lista antes de dar por buena una pieza con código.
- **Delegar la migración de piezas aprobadas a un subagente funciona, pero hay que verificar su reporte** (comparar con `cmp`, `grep` del `<iframe>`, `git status`): ver `integration-checklist.md`.
- **Un script de prueba que se ejecuta justo después de navegar puede ver la página a medio cargar** (resultado vacío). Esperar a que exista el elemento (`for (...; !document.querySelector('iframe'); ...) await wait(500)`).

- **ERROR DE CONTENIDO: el HTML "salía" del motor de plantillas directo al navegador.** Falso: lo entrega el DispatcherServlet. Detectado por el profesor al revisar. → Antes de dibujar una flecha, verificar en el framework quién entrega qué (ver `key-concepts.md`, 5h). Es el tipo de error que un agente no nota solo; **preguntar o contrastar con la documentación del framework** cuando el flujo involucra varios componentes del framework.
- **Código de un solo color:** el resaltado solo distinguía palabras clave y textos, así que no se veía qué era clase, método u objeto. → Tokenizador por rol y leyenda (ver `kit-api.md`).
- **Etiquetas que tapan toda la flecha:** con la etiqueta centrada **sobre** una flecha corta (< 100 unidades) no queda línea visible. Soluciones combinadas: `labels: 'smart'` (junto a la flecha), figura más ancha (`width: 800`) y 90 a 160 unidades de hueco entre recuadros.
- **Todas las piezas "se veían iguales":** recuadros de texto en cuadrícula. → Iconos por rol y cajas con el icono arriba (`icon`, `h >= 70`). Al reutilizar un patrón, cambiar también la **forma** de los elementos, no solo los textos.
- **Cambiar el comportamiento de un módulo compartido afecta a las piezas ya aprobadas.** Las mejoras visuales que cambian la apariencia (`labels: 'smart'`) son **opcionales** (`inline` por defecto) para no alterar piezas que el profesor ya aprobó; se aplican a piezas nuevas o cuando él lo pide. (El resaltado de código sí se aplicó a todas, porque es una mejora pedida explícitamente.)

## Integración en Docusaurus

- **`IframeWindow` no sirve para piezas interactivas:** alto fijo de 300 px y marco de navegador. → `<iframe>` JSX normal con `style={{ width: '100%', height: N, border: 0 }}`.
- **El alto fijo del iframe deja espacio en blanco** (se dimensiona para el caso más alto). → `DK.autoHeight()` ajusta el iframe desde dentro (mismo origen). Aplicarlo con `requestAnimationFrame` para evitar el aviso "ResizeObserver loop completed".
- **El tema del sitio no es el del sistema.** Docusaurus pone `data-theme` en `<html>` desde su botón. → `dk-theme.js` lee ese atributo del padre y lo observa; `prefers-color-scheme` queda solo como respaldo cuando la pieza se abre sola.
- **Las rutas del sitio no son las del archivo.** El prefijo numérico (`01-`) se quita: `docs/computacion-2/semana-1/01-protocolos-servidores.md` → `/docs/computacion-2/semana-1/protocolos-servidores`. Los títulos de las carpetas salen de `_category_.json`.
- **El sitio tiene dos idiomas** (`es` por defecto, `en`). `docusaurus start` sirve **uno**; el servidor del puerto 3000 del profesor sirve `en` (solo una página de bienvenida). Para ver los docs: `npx docusaurus start --port 3001 --locale es --no-open`. Si todo da "Page Not Found", es esto.
- **El servidor de desarrollo responde 200 a cualquier ruta** (fallback a `index.html`); un 200 no prueba que la página exista. Verificar con el navegador y leyendo el `<h1>`.
- **`static/` se sirve tal cual**, sin pasar por el build de React: una pieza ahí no puede importar paquetes npm. Por eso el kit es JavaScript plano.

## Visor y flujo de trabajo

- **Crash `Cannot read properties of undefined (reading 'split')` al cambiar de elemento (se arreglaba recargando).** El visor guardaba en un `useState` la versión elegida (por ejemplo `'interactive'`) y al pasar a un elemento que no la tenía, el render usaba el valor viejo antes de que el efecto lo reiniciara: `repoUrl(undefined)`. → **Un estado que depende del elemento actual no se resetea en un efecto: se DERIVA en el render** (`const ver = opciones.includes(sel) ? sel : 'original'`). Regla: nunca confiar en que un `useEffect` corra antes del render que usa el valor. Al probar un visor con selección persistente, probar el salto "elemento con propuesta → elemento sin propuesta" **sin recargar**.
- **En la franja cliente-servidor, las flechas no deben terminar donde están las etiquetas de los actores.** Flechas en `y: 26` (solicitud) y `y: 46` (respuesta) y etiquetas debajo (`y: 68`) en un `viewBox` de 78 de alto.
- **BUG GRAVE: un panel React reutilizado entre elementos mezcló datos de usuario.** El panel de revisión se reutilizaba al cambiar de gráfico y su auto-guardado "al salir" leía un ref actualizado durante el render del gráfico **nuevo**: guardaba el brief del gráfico anterior encima del nuevo (copió briefs entre gráficos y causó el aviso falso "hay cambios sin guardar"). Se detectó porque el profesor lo notó y al revisar `reviews.json` había briefs duplicados. → (1) Todo componente con estado propio por elemento se crea **con `key={item.id}`**, una instancia por elemento, y su limpieza al desmontar guarda en su propio id. (2) Antes de dar por bueno cualquier guardado automático: reproducir "editar A, guardar, ir a B, volver a A", y revisar el archivo de datos buscando valores duplicados entre elementos. (3) Tras un bug que escribe datos, **respaldar el archivo antes de reparar** y reconstruir lo perdido a partir de lo que se leyó en la conversación.

- **El kit tiene una sola copia maestra** (`static/interactive/_shared/`). Las piezas candidatas lo piden con la misma ruta relativa que usarán en el sitio (`../../../_shared/`) y el servidor del visor la redirige a la maestra. No duplicar el kit dentro de `candidates/`.

- **Navegar a la misma URL con otro `#` no recarga la app**, y el inventario viejo queda en memoria (no aparecían los botones Original/Propuesta). → Recargar la página tras re-escanear.
- **Tomar la captura en paralelo con la navegación** fotografía el instante 0 de la animación. → Esperar, o fijar el reloj con `document.getAnimations().forEach(a => { a.pause(); a.currentTime = ms; })` para capturar un instante exacto.
- **Scripts de edición con `\n` en Python dentro de un heredoc de bash** produjeron saltos de línea reales dentro de literales JS. → Para editar JS, usar la herramienta de edición de archivos y no reemplazos con escapes en heredocs.
- **Un servidor local que no declara `text/css` hace que el navegador ignore la hoja de estilos** (la pieza se ve como HTML sin estilo aunque el JS funcione). Pasó en el visor al sacar el CSS a `dk-base.css`; el sitio de Docusaurus sirve bien los tipos. → Si una pieza sale "desnuda" en el visor, revisar primero el `Content-Type` de la hoja de estilos (`vite.config.js`, tabla `MIME`).
- **`curl` en Git Bash corrompe caracteres no ASCII** (`ñ`) en el cuerpo JSON. → Mandar JSON desde un archivo (`--data-binary @archivo`) o usar identificadores sin acentos (`redisenar`).
- **`npm install` en segundo plano falla en Git Bash de Windows** (`ERR_INVALID_ARG_TYPE`). → Correrlo en primer plano, mejor desde PowerShell.
- **Decisión de alcance mal asumida:** se propuso un simulador de pérdida de paquetes y el profesor quería "las fases, sin entrar en detalle". → Preguntar el nivel de detalle y dejar lo avanzado detrás de un control opcional (ver `key-concepts.md`, punto 4).

## Piezas de seguridad (semana 9)

- **Dos mensajes de ida y vuelta por la misma línea vertical** se leen bien como una flecha de dos puntas si las etiquetas van del mismo lado (`labelSide: 'left'`) y a alturas distintas (`labelAt` 0.7 y 0.15). Dos líneas paralelas separadas 20 unidades en un tramo vertical pisan las etiquetas largas (`loadUserByUsername()`): el espacio libre está a la izquierda de la columna, no a la derecha, que se acaba en el borde del `viewBox`.
- **Un recuadro `outer` con el rótulo largo (`AuthenticationManager`) estorba a las flechas verticales que lo cruzan:** pasar las flechas por la derecha del texto del rótulo (aquí `x = 770` frente a un rótulo que termina en ~740).
- **Los nombres reales de clases suelen ser más largos que la caja** (`UsernamePasswordAuthenticationFilter`, 36 caracteres). En vez de ensanchar la caja o inventar un nombre, partir el nombre en rótulo y `sub` (`UsernamePassword` / `AuthenticationFilter`).
- **El `sub` de un nodo persiste entre fases** (gana el último desde el paso 0). Está bien para estados que siguen siendo verdad (`ana · ROLE_ADMIN`), pero un `sub` de un paso intermedio (`BCrypt compara`) queda visible después; cambiarlo en el paso siguiente si ya no aplica.
- **Los interruptores que cortan el recorrido** (contraseña incorrecta = 401) deben dejar la fase siguiente con **un paso que explique por qué no se llega**, no vacía: `build` tiene que devolver al menos un paso por fase.
- **Probar las piezas candidatas sin tocar `static/`:** servir una copia temporal con `python -m http.server` en una carpeta que tenga `interactive/_shared/` y las piezas con su misma profundidad de ruta (`interactive/<curso>/<semana>/<slug>/`), y capturar con Playwright. Así no se ensucia `static/` ni se depende del visor.
- **Un heredoc de bash con muchas comillas y acentos puede fallar entero con `unexpected EOF` y no ejecutar nada** (volvió a pasar al documentar esta misma sección). Para bloques largos de JS, HTML o documentación usar la herramienta Write y ejecutar el script desde archivo.

## Piezas de Redux (Computación 3, semana 12)

- **`DK.sequence` con 4 o 5 actores es ilegible:** los carriles quedan a ~90 px, la etiqueta del mensaje es más ancha que la flecha y la tapa, y el mensaje que sale del carril izquierdo pisa el título de la fase. → Máximo 3 actores a ancho completo (y en cada mitad de `DK.compare`, 3 actores con etiquetas de 12 caracteres o menos). Un flujo lineal por 4 o más componentes (dispatch → reducer → store → selector) va con `DK.layers`.
- **Los nombres de fase no llevan número:** el kit ya los numera y "1. Despacho" sale como "1 · 1. Despacho".
- **`DK.anatomy` sobre código se veía todo negro y angosto** (sin sintaxis, en dos columnas y con saltos de línea). → Opciones `code: true` y `layout: 'stack'` (ver `kit-api.md`).
- **Playwright bloquea `file://`:** las piezas se prueban sirviendo `static/` con `python -m http.server`.
