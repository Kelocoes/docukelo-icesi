# API del kit de piezas interactivas

Ubicación: la copia maestra es `kit/` en esta skill; en cada proyecto se instala (por defecto en `static/interactive/_shared/`) con `host/install.mjs` y esa copia es generada: no se edita (`host-integration.md`). Las líneas «Pieza de referencia» o «Ejemplo» de este archivo apuntan a piezas del proyecto DocuKelo: en otro proyecto no existen, usa las plantillas (`templates/`). Una pieza nueva solo debería escribir **datos** y llamar al kit; si se encuentra copiando o escribiendo lógica de dibujo, animación o controles, esa lógica pertenece al kit (ver "Cuándo ampliar el kit").

Orden de carga en el `index.html` de una pieza (rutas relativas, para que funcionen igual en el sitio y en el visor):

```html
<link rel="stylesheet" href="../../../_shared/dk-base.css">
<script>if (window.parent === window) document.documentElement.classList.add('solo');</script>
<script src="../../../_shared/dk-theme.js"></script>
<script src="../../../_shared/dk-kit.js"></script>
<script src="../../../_shared/dk-icons.js"></script>
<script src="../../../_shared/dk-flow.js"></script>      <!-- siempre que se use sequence o layers -->
<script src="../../../_shared/dk-sequence.js"></script>  <!-- escena: secuencia entre actores -->
<script src="../../../_shared/dk-layers.js"></script>    <!-- escena: arquitectura recorrida (alternativa a sequence) -->
<script src="../../../_shared/dk-canvas.js"></script>    <!-- escena: escena libre (iconos sin tarjeta, tomas y enchufes, contadores); alternativa a layers, no necesita dk-flow -->
<script src="../../../_shared/dk-compare.js"></script>   <!-- escena: comparación A/B (necesita dk-sequence) -->
<script src="../../../_shared/dk-anatomy.js"></script>   <!-- escena: anatomía explorable (enfoca partes de un mensaje) -->
<script src="../../../_shared/dk-table.js"></script>     <!-- escena: tabla de datos con estado (paginación, orden, SQL) -->
<script src="../../../_shared/dk-tree.js"></script>      <!-- escena: árbol de componentes + estado (props, callbacks, Context) -->
<script src="../../../_shared/dk-dom.js"></script>       <!-- escena: página simulada + árbol DOM (solo necesita dk-kit.js) -->
<script src="../../../_shared/dk-files.js"></script>     <!-- escena: explorador de archivos tipo `tree` (solo necesita dk-kit.js) -->
<script src="../../../_shared/dk-codemap.js"></script>   <!-- escena: código <-> lo que produce (solo necesita dk-kit.js) -->
<script src="../../../_shared/dk-radial.js"></script>    <!-- escena: capas concéntricas (con <link> a dk-radial.css; necesita dk-flow.js) -->
<script src="../../../_shared/dk-phone.js"></script>     <!-- escena: teléfono + State + árbol de widgets + consola (cargar dk-tree.js ANTES de dk-phone.js) -->
<script src="../../../_shared/dk-nav.js"></script>       <!-- escena: teléfono + pila de rutas del Navigator (cargar dk-phone.js ANTES; con <link> a dk-nav.css) -->
<script src="../../../_shared/dk-tabs.js"></script>      <!-- teléfono con NavigationBar y detalle que la cubre (con <link> a dk-tabs.css; solo necesita dk-kit.js) -->
<script src="../../../_shared/dk-player.js"></script>
```

Todo es JavaScript plano (scripts clásicos, sin módulos ni dependencias) y expone el espacio de nombres `window.DK`.

## Módulos

| Archivo | Qué da | Cuándo usarlo |
|---|---|---|
| `dk-base.css` | Tokens de color con rol, tema claro/oscuro, marco (`.dk-card`), pestañas, leyenda, botones, interruptor, estilos del diagrama de secuencia | Siempre |
| `dk-theme.js` | Pone `data-dkt="light|dark"` en `<html>` siguiendo el tema del sitio | Siempre |
| `dk-kit.js` | `DK.el`, `DK.svg`, `DK.reduced`, `DK.timers`, `DK.stepper`, `DK.autoHeight` | Siempre |
| `dk-icons.js` | `DK.icons.*` (laptop, server, database, browser, user, classbox, piece, cross, check) | Cuando la pieza dibuja actores o símbolos |
| `dk-flow.js` | `DK.flow.arrow`: una flecha animada con su paquete que viaja (la usan sequence y layers) | Si una escena nueva necesita "algo que viaja de A a B" |
| `dk-sequence.js` | `DK.sequence`: diagrama de secuencia animado | Flujos entre 2 o más actores en el tiempo |
| `dk-layers.js` | `DK.layers`: arquitectura recorrida (componentes anidados, mensajes que viajan, resaltado por paso) | Explicar dónde vive algo y por dónde pasa una solicitud (Tomcat/Catalina/servlets) |
| `dk-canvas.js` | `DK.canvas`: escena libre para `DK.player`: iconos sueltos sin tarjeta, zonas suaves, tomas y enchufes, pastillas contadoras, flechas curvas con paquete, ondas de propagación | Cuando el concepto no es "cajas conectadas": contratos e implementaciones intercambiables, acoplamiento, propagación de un cambio, carriles, Venn, simuladores (Clean Architecture, SOLID, GRASP) |
| `dk-dom.js` | `DK.dom`: una **página simulada** (HTML real) junto al **árbol del DOM** (de izquierda a derecha); el mouse sobre un lado ilumina el nodo en el otro y marca padre, hijos y hermanos; los pasos cambian texto, hacen aparecer nodos, marcan roles (dirty/build/reuse/need), parpadean lo que el DOM real tocó y muestran un medidor. Solo necesita `dk-kit.js` | Explicar el DOM, el Virtual DOM y el diff, o cualquier "página <-> árbol" (ver sección abajo) |
| `dk-files.js` | `DK.files`: explorador de archivos con la salida de `tree -L` (lineas que se señalan con el mouse; al lado, para que sirve cada archivo, sus puntos y un fragmento de codigo; los pasos hacen aparecer carpetas nuevas o muestran un subarbol) | Estructura de un proyecto, convenciones de carpetas |
| `dk-codemap.js` | `DK.codemap`: codigo a la izquierda y lo que produce (la pantalla, los datos) a la derecha; mouse sobre una parte del codigo ilumina su resultado y al reves, con explicacion debajo | Anatomia de un componente, de un archivo de configuracion, de una consulta |
| `dk-table.js` | `DK.table`: tabla de datos reales con estado por paso (todas las filas o una página, orden, SQL generado, metadatos de `Page<T>`, medidores de costo) | Paginación, orden, filtros, `LIMIT/OFFSET`: "qué trae esta consulta" |
| `dk-anatomy.js` | `DK.anatomy`: un mensaje o documento real en una caja; cada paso enfoca una parte y a la derecha aparece su explicación | Explicar la estructura de algo (petición HTTP, JWT, JSON, URL) |
| `dk-tree.js` | `DK.tree`: un árbol de componentes de verdad (nodos y ramas, distribuido solo); cada paso marca roles y hace viajar datos por las ramas o en salto directo | Estado en React/Flutter: lifting state up, prop drilling, Context, store global, re-renders |
| `dk-phone.js` | `DK.phone`: un teléfono con la app real (que el estudiante puede tocar) y, al lado, el camino del evento, el objeto `State` con sus campos, el árbol de widgets (dirty, build, const reutilizado) y la consola | Estado en Flutter (`setState`, controladores, formularios, listas): causa y efecto provocados por el estudiante |
| `dk-nav.js` + `dk-nav.css` | `DK.nav`: teléfono con navegación real (AppBar con flecha, botón «Atrás del sistema») en una mitad y, en la otra, la **pila de rutas** como tarjetas (TOPE DE LA PILA / BASE, `canPop`) que se apila y desapila; pill con la llamada `Navigator.*` del paso | Navigator de Flutter: `push`, `pop`, `pushNamedAndRemoveUntil`, `popUntil`, qué queda en la pila |
| `dk-tabs.js` + `dk-tabs.css` | `DK.tabs.phone`: teléfono con `NavigationBar` de 3 pestañas (Cursos, Guardados, Perfil), un detalle que la cubre y la flecha de volver; no guarda estado, la pieza decide qué dibujar | Navegación por pestañas de Flutter: `setState` + `IndexedStack` frente a `push` |
| `dk-radial.js` + `dk-radial.css` | `DK.radial`: anillos concéntricos (arquitectura de cebolla), piezas en sus anillos, flechas rectas o curvas que viajan entre ellas y un panel que al tocar una pieza marca en verde lo que puede importar y en rojo lo prohibido (matriz de límites). Carga también `dk-flow.js` | Capas concéntricas y regla de dependencia (Clean Architecture, hexagonal) |
| `dk-compare.js` | `DK.compare`: dos o más diagramas de secuencia lado a lado, sincronizados paso a paso, con contador y nota por panel | Contrastar alternativas (TCP/UDP, con/sin caché, stateful/stateless) |
| `dk-player.js` | `DK.player`: pestañas por fase, leyenda, controles, interruptores | Cualquier pieza paso a paso |

## dk-kit.js

- `DK.el(tag, attrs, ...hijos)` crea un nodo HTML. `attrs`: `class`, `text`, `on<evento>` (ej. `onclick`), o cualquier atributo (`false`/`null` se omiten). Los hijos pueden ser nodos, strings o arreglos.
- `DK.svg(tag, attrs, ...hijos)` igual, pero para SVG.
- `DK.reduced` es `true` si el usuario pidió menos movimiento. Las animaciones deben saltarse (el kit ya lo hace en `DK.stepper`).
- `DK.timers()` devuelve `{ later(fn, ms), clear() }`. Usar siempre esto en vez de `setTimeout` suelto: `clear()` evita que un timer viejo pinte sobre un paso nuevo.
- `DK.stepper({ count, show, dwell, onChange?, onPlay? })` controla una secuencia de pasos. `show(i, animate)` pinta el paso `i` (`-1` = antes del primero). Devuelve `{ go(n, animate), next, prev, reset, play, toggle, stop, current, playing }`. Maneja también las flechas del teclado.
- `DK.autoHeight()` hace que la pieza ajuste el alto de su propio `<iframe>` al contenido (solo funciona si la página que la embebe es del mismo origen, como en DocuKelo). Si el `<iframe>` lleva `data-dk-fixed` (lo pone `InteractiveFrame` en el diálogo de pantalla completa), **no** ajusta el alto: marca `<html class="dk-fs">` y sale, porque el alto lo fija el diálogo. **Llamarlo siempre al final del script**; `DK.player` ya lo hace.

## dk-icons.js

Cada función devuelve un `<g>`. Los dispositivos reciben `{ x, y }` (x = centro, y = borde superior):
`laptop` (~72×40), `server` (~52×37), `database` (~48×40), `browser` (~60×42), `user` (~36×44), `classbox` (clase u objeto, ~56×38), `card` (tarjeta o cuenta, ~52×34), `coins` (monedas, ~40×36), `file` (documento, ~34×40), `filecode` (archivo de código `</>`, ~34×40), `gear` (proceso o servicio, ~36×36), `bag` (bolsa de datos, ~36×38), `lock` (candado, ~30×40) y `filter` (embudo, ~38×38). `piece(n, size)`, `cross(size)` y `check(size)` se dibujan centrados en (0,0). Los iconos usan solo clases `dk-*` y tokens, así que cambian solos con el tema.

**Iconos de dominio y de conexión** (los usa `DK.canvas`; mismo formato `{ x, y, scale }`): `antenna` (receptor GPS), `speed` (velocímetro), `chat` (mensaje), `bell` (alerta), `terminal` (consola), `flask` (prueba), `chip` (computadora de abordo), `pin` (ubicación), `globe` (geodesia), `memory` (RAM), `chain` (pool de conexiones), `wrench` (ensamblaje), `bandaid` (parche), `bus`, `socket` (la toma: abre hacia la **derecha**) y `plug` (el enchufe: clavijas hacia la **izquierda**, para acoplarse en horizontal). `socket` y `plug` aceptan `glyph: '<icono>'`, dibujado pequeño sobre el cuerpo. Altos en `DK.icons.h`.

## dk-sequence.js: `DK.sequence(opciones)`

```js
var scene = DK.sequence({
  svg,                       // <svg> donde dibujar
  actors: [{ id, label, icon, tray }],   // 2 o más; se reparten a lo ancho. tray = rótulo de la bandeja de piezas (opcional)
  phases: ['Conectar', ...], // bandas de fondo con nombre
  idleState: 'Sin conexión', // texto del chip antes del primer paso
  trayCount: 4,              // casilleros por bandeja (0 = sin bandejas)
  // opcionales: width (640), gap (24), slant (8), dur (700 ms), margin (130),
  // firstRowY (160 con bandejas; 124 sin bandejas, trayCount: 0)
});
scene.setSteps(steps);       // calcula el layout; llamar de nuevo si los pasos cambian
scene.render(i, animate);    // muestra hasta el paso i; solo anima el último paso
```

**Un paso es un objeto de datos:**

```js
{ phase: 0, title: 'Paso 1 · SYN', caption: 'Texto explicativo del paso',
  msgs: [{ from: 'client', to: 'server', label: 'SYN', kind: 'ctl' }],   // kind: ctl | ack | data
  state: { client: 'Conectando', server: 'Escuchando' },                 // texto de los chips al terminar el paso
  tray:  { server: [1, 2, 4] } }                                         // casilleros llenos
```

Campos de un mensaje: `from`/`to` (ids de actor), `label`, `kind` (decide el color), `piece` (número, para `kind: 'data'`), `lost: true` (la flecha se corta a mitad de camino con una X roja; el rótulo se corre para no taparla).

**Nombre de fase corto (máx. ~14 caracteres):** la banda de cada fase lleva su título arriba a la izquierda y la primera flecha de la fase pasa justo debajo; con «Pedir una página protegida» o «expect() reintenta» el título se pisa con la etiqueta de la flecha. Usa `Ruta protegida`, `expect()`. Los chips y las bandejas cambian **cuando la flecha llega**, no al empezar el paso. Las flechas de pasos anteriores quedan dibujadas (el diagrama cuenta toda la historia). Con `msgs.length` flechas en un paso, se animan en cascada.

## dk-flow.js: `DK.flow.arrow(capaSvg, opciones)`

Dibuja una flecha con etiqueta, punta y un paquete que viaja. `opciones`: `x1, y1, x2, y2`, `kind` (`ctl` | `ack` | `data`), `label`, `lost` (se corta al 55 % con una X), `piece` (número, con `kind: 'data'`), `labelAt` (0..1) y `labelDy`, `animate`, `delay`, `dur`, `dim` (atenuada, para mensajes de pasos anteriores). Úsala directamente en una escena nueva en vez de dibujar flechas a mano.

## dk-layers.js: `DK.layers(opciones)`

Escena para `DK.player`: arquitectura con componentes anidados.

```js
scene: function (svg) {
  return DK.layers({ svg, width: 640, height: 344, nodes: [
    { id: 'tomcat',   kind: 'outer', label: 'Apache Tomcat', sub: 'servidor web', x: 160, y: 14, w: 470, h: 316 },
    { id: 'catalina', kind: 'outer', label: 'Catalina', sub: 'contenedor de servlets', x: 332, y: 50, w: 286, h: 264 },
    { id: 'servlet1', kind: 'box',   label: 'HelloServlet', sub: '/hello-servlet', x: 348, y: 140, w: 254, h: 44 },
    { id: 'browser',  kind: 'actor', icon: 'browser', label: 'Navegador', x: 6, y: 150, w: 96, h: 80 },
  ]});
}
```

- Los nodos se dibujan **en el orden del arreglo**: primero los contenedores y después lo que va dentro. `kind`: `outer` (contenedor punteado), `box` (componente), `actor` (con icono, fuera del sistema). Las coordenadas se escriben a mano en un `viewBox` de 640 de ancho (para que el texto de 12 unidades siga legible).
- Un paso: `{ phase, title, caption, focus: ['catalina'], msgs: [{ path: [x1,y1,x2,y2], label, kind }] }`. `focus` resalta los nodos que se están explicando; `msgs` son flechas que viajan. Si el mensaje no trae `path`, va de borde a borde entre `from` y `to`; **para flujos que cruzan varios recuadros conviene `path` explícito** (dos líneas paralelas, solicitud y respuesta, separadas ~25 px).
- Los mensajes de pasos anteriores quedan dibujados y atenuados; solo se anima el del paso actual. Un paso sin `msgs` sirve para "presentar una pieza" (se resalta y se explica).
- Etiquetas de flecha cortas ("GET", "req / resp", "doGet()"): los tramos entre recuadros miden 60 a 100 unidades; el detalle va en la leyenda.

- **`labels: 'smart'`** (opción de `DK.layers`): las etiquetas van **junto** a la flecha y no encima: sobre las horizontales, a la derecha en las verticales y diagonales (en un mensaje se puede forzar con `labelSide: 'left' | 'right'` o `labelDy`). La flecha se ve completa. Por defecto (`'inline'`) la etiqueta va sobre la línea, como en las piezas antiguas (ya modernizadas); **usa `'smart'` en toda pieza nueva**.
- **`width: 800`** (figura ancha): `DK.layers` acepta anchos mayores a 640 y los muestra hasta ~732 px (todo el ancho útil de la tarjeta). Úsalo cuando las flechas necesiten espacio: **deja 90 a 160 unidades de hueco entre los recuadros que se conectan**.
- **Iconos en los recuadros** (`icon: 'card'`): variedad visual en vez de rectángulos con texto. Si el recuadro mide `h >= 70`, el icono va **arriba** y el texto centrado debajo (ahorra ancho); si es más bajo, a la izquierda (o fuerza `iconPos: 'left'`). **Un icono distinto por rol** (servidor, clase, base de datos, engranaje, archivo, bolsa, tarjeta...): ver la lista en `dk-icons.js`.
- **`trail: 'phase'`** (opción de `DK.layers`): solo se dibujan las flechas de la **fase actual**; al cambiar de fase las anteriores desaparecen. Úsalo cuando haya más de ~6 flechas en total, para que el diagrama no se llene de líneas.
- **`sub` por paso** (`paso.sub = { svc: 'repositorio = ? (falta)' }`): cambia el texto secundario de un nodo desde ese paso (gana el último). Sirve para **mostrar un cambio de estado dentro de un componente** (el servicio pasa de `repositorio = ?` a `repositorio = inyectado`: eso ES la inyección de dependencias). Pon un `sub` base en el nodo para poder cambiarlo.
- **Que el texto quepa:** a 13 px negrita un rótulo mide ~7,5 unidades por carácter y un `sub` de 11 px ~6; la cuenta rápida es `caracteres ≤ ancho_de_la_caja / 7,5` (rótulo) y `/ 6` (sub). El defecto del gráfico original de beans era justo texto que se salía de la caja.
- **Anidamiento:** hasta 4 niveles de recuadros funcionan (Tomcat > Catalina > war > Spring). Cada `outer` reserva ~44 unidades arriba para su rótulo y sub: no pongas nada dentro en esa franja.
- **`tone: 'err'`** (campo de un nodo): recuadro con borde del color de fallo (`--dk-err`), para **salidas de error** (`HTTP 401`, `HTTP 403`, rechazo). Al enfocarlo se tiñe suavemente. Va con flechas `kind: 'err'`.
- **Flechas `kind: 'err'`** (en `DK.layers`, `DK.flow.arrow`): un fallo que SÍ llega a su destino (la petición rechazada llega a la caja 401), a diferencia de `lost: true` (se pierde a mitad de camino con una X). Etiqueta del color de fallo.
- **Ida y vuelta por la misma línea vertical:** dos mensajes en pasos distintos con las mismas coordenadas pero sentido contrario se leen como una flecha de dos puntas con dos etiquetas. Usa `labelSide: 'left'` y valores distintos de `labelAt` (por ejemplo 0.7 para la ida y 0.15 para la vuelta, medidos desde el origen de cada flecha) para que los rótulos no se pisen. Evita dos líneas paralelas a menos de ~25 unidades con etiquetas largas. Ejemplo: `spring-security-filterchain` (loadUserByUsername / UserDetails).
- **Iconos nuevos:** `lock` (candado: autorización, permisos, cifrado) y `filter` (embudo: un filtro de una cadena).
- **No hay nodos ocultos ni `text` por paso:** todos los nodos se dibujan siempre. Si algo debe aparecer, desaparecer o cambiar de rótulo (una lista que crece, un contador, un mensaje de error), usa `DK.canvas` (`hidden` + `show`/`hide`, `text`, `sub`, `state`). Con `DK.layers` solo cambia el `sub`. Ejemplo con selector de peticiones y salidas de error fijas: `computacion-3/semana-14/capas-de-defensa/`.

Piezas de referencia: `candidates/static/interactive/computacion-2/semana-1/servlet-en-tomcat/index.html` (3 niveles), `.../semana-2/contenedor-ioc-y-beans/` (usa `sub` y `trail`) y `.../semana-2/spring-en-tomcat/` (4 niveles de anidamiento, flujo completo de una petición).

## dk-canvas.js: `DK.canvas(opciones)`

Escena libre para `DK.player`, la alternativa a `DK.layers` cuando las cajas no enseñan: el concepto se ve mejor con **iconos sueltos** (sin tarjeta), zonas suaves (manchas, círculos, anillos, carriles), **toma y enchufe**, contadores y flechas curvas. La referencia completa de opciones está en la cabecera de `dk-canvas.js`; aquí lo esencial.

```js
scene: function (svg) {
  return DK.canvas({ svg: svg, width: 720, height: 340, trail: 'step', items: [
    { id: 'svc',  type: 'node', icon: 'gear',   x: 100, y: 190, size: 60, label: 'Servicio', sub: 'el invocador' },
    { id: 'toma', type: 'node', icon: 'socket', x: 330, y: 190, size: 70, lp: 'above', label: 'Contrato' },
    { id: 'pg',   type: 'node', icon: 'plug', glyph: 'database', x: 620, y: 85, size: 70, label: 'PostgreSql' },
    { id: 'cnt',  type: 'tag',  x: 560, y: 52, text: 'archivos modificados: 0', hidden: true },
  ]});
}
```

- **Elementos:** `node` (icono libre con rótulo: `lp` `below` | `above` | `right` | `left`, `ldx`/`ldy`, `rot`, `glyph`), `zone` (`shape`: `blob` | `circle` | `ring` | `round` | `none`; `anchor: 'middle'`), `tag` (pastilla que se ensancha con el texto: contadores y mensajes cortos) y `draw` (una forma propia con `DK.svg`: regletas, paneles de interruptores, agujas). `hidden: true` se revela con `show` y se oculta con `hide`.
- **Un paso** (`focus`, `solo`, `state`, `badge`, `text`, `sub`, `at`, `rot`, `show`, `hide`, `links`, `pulse`): `state` admite `err`, `ok`, `warn`, `dim` y `ghost` (contorno punteado: "todavía no existe"); `at: { id: [x, y] }` **mueve** un elemento con transición (un enchufe que se acopla a su toma, una pieza que arrastra a otras); `rot` gira una aguja; `pulse` expande ondas (la propagación de un cambio); `text`, `sub`, `at`, `rot` y `show` se **acumulan** (gana el último) y el resto se describe completo en cada paso.
- **Flechas:** `kind` `ctl` | `ack` | `data` | `err` | `dep` (punteada: dependencia); `curve` o `path` + `c` para no cruzar iconos ni rótulos; `lx`/`ly` colocan la etiqueta; `color: 'p1'..'p5'` la tiñe; `group` hace que varias salgan a la vez. `trail: 'step'` dibuja solo las del paso actual (por defecto quedan atenuadas las de la fase).
- **Color por actor:** `c: 'p1' | 'p3' | 'p5'` en `node`, `zone` o `tag` colorea el elemento; los estados `err` y `ok` ganan al color.
- **Ancho 720:** la tarjeta admite hasta 732 px, así el rótulo de 14 px se lee a 14 px. En pantalla completa (`html.dk-fs`) la figura llena el alto sin deformarse (reglas genéricas de `dk-base.css`).
- **Acoplamiento de un enchufe:** con `size` 50 y la toma en `x`, el enchufe acoplado queda en `x + 82` (en general `x + 65 * (size / 36) - 8`); poner el rótulo de la toma arriba (`lp: 'above'`) y el del enchufe a la derecha (`lp: 'right'`, `ldx`) para que no se pisen. `rot: 180` en ambos los orienta de derecha a izquierda; `rot: 90` en vertical.
- **Selector con un icono por opción:** el `icon` de un nodo no cambia por paso. Para que cada opción del selector tenga su icono, crea un nodo `hidden: true` por opción y muestra solo el elegido con `show` (y `hide` de los demás). Variante que funcionó mejor en `computacion-3/semana-14/donde-vive-la-sesion/`: un solo escenario (el navegador con sus tres almacenes, el servidor y un script) y una pastilla `hidden` por opción dentro del almacén que le corresponde; las flechas llevan `path` explícito para no cruzar rótulos. Un `code` función `(opts) => ({ title, text })` cambia el listado con el selector (`manejo-de-errores`, 8 líneas por caso).
- Pieza de partida: `templates/piece-canvas/index.html`.

## dk-dom.js: `DK.dom(opciones)`

Escena para `DK.player` (con `wide: true`, escenario HTML). La página se arma con los **mismos nodos** que el árbol (`{ id, tag, parent, text, cls, sub, hidden }`; la cabecera del archivo documenta todo), así lo que se ilumina siempre coincide. Opciones: `stage`, `url`, `treeTitle`, `legend: [['reuse', 'Igual'], ...]`, `nodes`. Un paso: `focus`, `marks` (roles de `dk-base.css`), `sub`, `mirror` (la pagina tambien muestra `need`/`dirty`), `text` y `show` (acumulan, para pagina y arbol), `treeText` y `treeShow` (solo el arbol: el Virtual DOM nuevo va un paso adelante del DOM real), `touch` (parpadeo naranja), `state` (pastilla) y `meter`. Mouse, toque (fija el nodo) y teclado (los nodos del arbol son enfocables) iluminan; en celular el arbol se desliza horizontalmente. La pagina simulada siempre es clara (como la pantalla de `DK.phone`). Ejemplos: `static/interactive/computacion-2/semana-14/dom-arbol-pagina/` y `virtual-dom-diff/`.

**Pestaña «Código»** (`code: true` en `DK.dom`; en vez del panel de `DK.player`, que se dejaria debajo y alargaria la pieza ~200 px): cada paso trae `codeText` (el codigo completo), `codeTitle` y `code: [lineas]` a resaltar; `view: 'code'` abre la pestaña sola y el estudiante puede volver al árbol. Las pestañas (Árbol DOM, Árbol de componentes, Código) miden lo mismo (el alto del árbol DOM; `syncHeights`) para que la pieza no salte. El medidor solo reserva espacio si algún paso lo usa. **Pantalla completa:** `DK.dom` trae sus reglas `dk-fs` (la página crece con `zoom`, el árbol llena el alto con el svg en posición absoluta y el código ocupa el lugar del árbol), por eso estas piezas se integran con `<InteractiveFrame>`. Lección: un `svg` con `height: 100%` dentro de un contenedor sin alto definido se agranda con el ancho; en flex, el svg va `position: absolute; inset: 0` dentro del contenedor que se estira.

**Franja de fases** (`pipeline: [{ label: '2 · Render', sub: 'nuevo Virtual DOM' }, ...]` en `DK.dom`): bajo la pagina y el arbol; cada paso enciende la suya con `stage` (0..n-1; `n` = todas hechas) y `stageBlock: true` la marca como bloqueada. Ejemplo: `virtual-dom-diff`. **`cmarks`** (roles de color del arbol de componentes: `owner`, `use`, `build`, `dirty`, `reuse`) y `compNodeW`; ejemplo `props-arbol` (el padre pasa props, cambia un dato y solo cambia el DOM de la tarjeta cuyas props cambiaron). **Anchos reales:** la columna normal del sitio mide ~690 px aunque el monitor sea de 1868 px, asi que estas piezas se disenan para ~690 px (pagina y arbol en dos columnas desde 561 px) y para pantalla completa (~1790 x 860, el arbol llena el alto con un tope de 2 veces su tamaño natural).

**Modo componentes** (opcional, ejemplo `componentes-composicion`): `components: { Header: 'p2', CartItem: 'p3' }` (nombre a color categorico; maximo 5 colores distintos) y en los nodos `comp: 'Header'`, que marca la **raiz** de una instancia (los descendientes sin `comp` pertenecen a ella). `ctree: [{ id, comp, parent, dom, sub }]` es el arbol de componentes; `dom` es el nodo DOM raiz que produce. Aparecen dos pestañas (Arbol DOM / Arbol de componentes), chips de leyenda por componente y rotulos `<Nombre />` sobre la pagina. Pasos: `comps: true | ['Header']` (que componentes se pintan), `cfocus: ['CartItem']` (que componente se ilumina), `view: 'dom' | 'comp'` y `csub: { ci1: 'nombre="Teclado"' }`. Mouse sobre un elemento, un nodo de cualquiera de los dos arboles o un chip ilumina lo mismo en todos lados (en un chip, todas las copias del componente). Leccion: dos rotulos de una lista y de su primer item se encimaban por el colapso de margenes; el contenedor de la lista usa `display: flow-root`.

**Iconos de la metafora del restaurante** (`chef` = el servidor, `waiter` = el medio por el que viaja la informacion) (CSR frente a SSR, usados por `DK.canvas`): `waiter` (el servidor), `tray` (ingredientes crudos), `grill` (el navegador que cocina) y `dish` (HTML ya cocinado). Ejemplo: `computacion-2/semana-14/csr-bbq/` (interruptor SSR y deslizador "Tu equipo" que cambia los tiempos).

## dk-files.js: `DK.files(opciones)`

Escena para `DK.player` (con `wide: true`; escenario HTML). `items` va en el orden en que lo imprimiria `tree --dirsfirst`: `{ path: 'src/', ... }` (una `/` al final = carpeta), `purpose`, `points` (HTML), `code`/`codeTitle`, `edit: 'always' | 'sometimes' | 'never'`, `isNew` (convencion propuesta: linea resaltada y etiqueta «nuevo») y `hidden` (aparece con `show`). Un paso: `focus` (id), `show: [ids]` (se acumulan), `base: 'src/'` (solo ese subarbol, como `tree -L 2 src`) y `depth`. El comando del encabezado y el resumen («7 directories, 13 files») se calculan solos; el terminal mide lo que el paso con mas lineas, para que no salte. Ejemplo: `computacion-2/semana-14/estructura-proyecto/`. Leccion: un `</script>` dentro de una cadena de JS en un `index.html` cierra el bloque; escribirlo `<\/script>`. **Arboles largos:** al cambiar de paso, el terminal se desplaza solo hasta la linea de `focus` (antes quedaba cortada abajo; ver `lessons-learned.md`). Ejemplos con ~35 lineas: `computacion-3/semana-14/estructura-auth/`, `computacion-3/semana-15/estructura-playwright/`.

## dk-codemap.js: `DK.codemap(opciones)`

Escena para `DK.player` (con `wide: true`). `file` es el nombre del archivo que se muestra en la pestaña del editor y `filePart` (opcional) el id de la parte que ese nombre señala, para que también se pueda iluminar. `code` es un arreglo de lineas y cada linea un arreglo de segmentos `[texto, parte?]`; `parts: { id: { label, color: 'p1'..'p5', title, text, bullets, where } }`; `view()` devuelve el HTML del resultado con `data-part="id"` (clases utiles: `cm-lbl`, `cm-chip`, `cm-code-sm`, `cm-arrow`, `cm-card`, `cm-out`). Un paso solo lleva `focus: 'id'`. Mouse, toque y teclado iluminan en los dos lados; la explicacion ocupa todo el ancho debajo (en pantalla completa pasa a una tercera columna con letra mas grande y la pantalla simulada con `zoom: 1.5`). Ejemplo: `computacion-2/semana-14/anatomia-componente/`. Leccion: el resaltador de `DK.highlight` usa la clase `cm` para los comentarios, asi que la raiz de la escena NO puede llamarse `.cm`. **Sombreado suave:** cada parte del codigo lleva un subrayado de 1 px y un fondo al 4 % de su color; al enfocarla sube al 15 % (en el resultado, aro al 60 % y fondo al 9 %). Los colores `p1` a `p5` son vivos: no subas esos porcentajes (el profesor pidio bajar la intensidad porque dificultaba leer el codigo; en `dk-anatomy` con `code: true` aplica lo mismo). **Codigo largo:** en pantalla completa el codigo se desplaza dentro del editor y, al cambiar de paso, el codigo **y** el panel de resultado se desplazan hasta la parte enfocada (`focus`). A 690 px la columna del codigo admite ~36 caracteres por linea sin scroll horizontal y 25 lineas dan una pieza de ~1100 px: recorta imports y parte las firmas largas. Ejemplos de codigo real enlazado con su salida (cookie, peticion POST, navegador): `computacion-3/semana-14/anatomia-cookie-sesion/`, `anatomia-server-action/`, `computacion-3/semana-15/anatomia-test-playwright/`, `computacion-3/semana-15/localizadores-playwright/`.

## dk-table.js: `DK.table(opciones)`

Escena para `DK.player`: una **tabla con filas reales** que cambia con los pasos. Muestra qué parte de los datos llega al cliente, el SQL que se genera, los metadatos de `Page<T>` y medidores de costo.

```js
scene: function (svg, stage) {
  return DK.table({ stage, table: 'products', entity: 'Product',
    columns: [{ key: 'id', label: 'id' }, { key: 'name', label: 'name' }, { key: 'price', label: 'price', align: 'right' }],
    rows: [ { id: 1, name: 'Teclado', price: 120 }, /* ... 20 a 30 filas reales */ ] });
}
```

Un paso (con `msgs: []`, que el player usa para la duración):

```js
{ phase: 1, title, caption, msgs: [],
  view:  { mode: 'page', page: 1, size: 5, sort: { key: 'price', dir: 'desc' } },   // o { mode: 'all' }
  focusMeta: true,                                                                   // resalta la tarjeta de Page<T>
  meters: [ { label: 'Filas que viajan', value: 5, max: 23, text: '5 de 23', tone: 'ack' } ],   // tone: err | ack | ctl
  code: [5, 6] }                                                                     // líneas del panel de código
```

- Se calculan solos: las filas visibles (con el orden aplicado **antes** de cortar la página), el paginador, el SQL (`SELECT ... ORDER BY ... LIMIT n OFFSET m` más el `COUNT(*)`) y los metadatos (`getTotalElements`, `getTotalPages`, `getNumber`, `getSize`, `hasNext`). Con `mode: 'all'` la tabla muestra todas las filas con scroll.
- Usa **datos con sentido** (la entidad del capítulo: `Product(id, name, price)`) y entre 20 y 30 filas: lo bastante para que "todo de golpe" se sienta largo y para que haya varias páginas.
- Los medidores sirven para volver tangible un costo con números del capítulo (p. ej. `1.450.000 filas` frente a `10 filas`).
- Pieza de referencia: `candidates/static/interactive/computacion-2/semana-6/paginacion-spring/index.html`.

## dk-anatomy.js: `DK.anatomy(opciones)`

Escena para `DK.player`: muestra un mensaje real dentro de una caja y, en cada paso, **enfoca una parte** (las demás se atenúan) mientras a la derecha aparece su explicación con una pequeña animación. Arriba hay una franja "cable" opcional (cliente → servidor) donde el mensaje viaja.

```js
scene: function (svg, stage) {
  return DK.anatomy({ stage,
    parts: { method: { label: 'Método', color: 'p1' }, url: { label: 'URL (ruta)', color: 'p2' } },   // color: p1..p5
    clientLabel: 'Cliente (navegador)', serverLabel: 'Servidor' });
}
```

Un paso (todos comparten el mismo `doc`):

```js
{ phase: 1, title: 'Método', caption: 'Frase corta que lee el player',
  doc: [ [ ['GET', 'method'], [' '], ['/productos', 'url'], [' '], ['HTTP/1.1', 'version'] ],   // el mensaje: lineas de
         [ ['Host: localhost:8080', 'headers'] ] ],                                             // segmentos [texto, parte?]
  focus: 'method',                                           // parte enfocada (omitir = ninguna)
  callout: { text: 'Explicación más larga', examples: ['GET: pedir datos', 'POST: enviar datos'] },
  msgs: [ { path: [118, 26, 522, 26], label: 'Solicitud HTTP', kind: 'data' } ] }   // franja de cable, viewBox 640 x 78
```

- Los pasos sin `msgs` llevan `msgs: []` (el player lo necesita para calcular la duración). La franja de cable solo aparece si algún paso trae `msgs`. Solicitud en `y: 26` y respuesta en `y: 46` evita que se pisen.
- Un segmento con varias líneas de la misma parte (los encabezados) se enfoca completo a la vez: usa el mismo id de parte en cada línea.
- Los colores `p1`..`p5` son **categóricos** (distinguen partes; no significan control/éxito/error). Están definidos en `dk-base.css` con variante oscura.
- La estructura que cambia con un interruptor (por ejemplo "con cuerpo (POST)") se resuelve en `build(opts)` devolviendo otro `doc` y otros pasos.
- **Para código** (un `createSlice`, una clase): `code: true` colorea la sintaxis con `DK.highlight` (mismos roles que el panel de código), no parte las líneas y enfoca la **línea completa** con un borde del color de la parte. `layout: 'stack'` pone el código a todo el ancho y la explicación debajo; úsalo cuando las líneas pasan de ~45 caracteres. Las dos opciones son opcionales y no cambian las piezas existentes. Ejemplo: `static/interactive/computacion-3/semana-12/anatomia-slice/`.

- **`all: true` en un paso:** colorea **todas** las partes a la vez (sin atenuar), para un resumen o para "cortar por colores". Ejemplo: `static/interactive/seminario-de-i-d-i/semana-11/responsabilidades-agenda/` (un archivo de 40 líneas pintado por responsabilidad: datos, controladores, acciones, formulario, lista).

Pieza de referencia: `candidates/static/interactive/computacion-2/semana-1/peticion-http/index.html`.

## dk-tree.js: `DK.tree(opciones)`

Escena para `DK.player` que dibuja una **jerarquía real** (raíz arriba, ramas que unen padre e hijo) en lugar de cajas anidadas. Se pasan solo los nodos con su `parent`; la posición se calcula sola: las hojas se reparten a lo ancho y cada padre queda centrado sobre sus hijos.

```js
scene: function (svg) {
  return DK.tree({ svg, width: 1000,                     // con DK.player({ wide: true })
    nodes: [ { id: 'page', label: 'RoutinesPage', sub: 'página' },
             { id: 'layout', label: 'DashboardLayout', parent: 'page' },
             { id: 'counter', label: 'RoutineCounter', parent: 'layout' } ],
    legend: ['owner', 'pass', 'use', 'provider', 'need'] });   // opcional
}
```

Un paso (cada paso se describe completo; roles, etiquetas y `sub` no se heredan):

```js
{ phase: 2, title: '...', caption: '...',
  roles: { page: 'owner', layout: 'pass', counter: 'use' },   // owner | pass | use | provider | need | dim
  tags:  { page: 'useState(routines)', layout: 'no lo usa' },  // pastilla sobre el nodo, del color del rol
  sub:   { counter: 'total: 3' },
  msgs: [ { path: ['page', 'layout', 'counter'], label: 'total', kind: 'data' },          // rama por rama (abajo o arriba)
          { from: 'page', to: 'counter', direct: true, label: 'total', kind: 'ack' },     // salto curvo (Context, store)
          { from: 'form', to: 'counter', label: 'no hay camino', kind: 'err', lost: true } ] }   // recta cortada
```

- Colores de rol: `owner` = control (dueño del estado), `pass` = `p5` punteado (solo reenvía), `use` = éxito (consume), `provider` = datos (Provider de Context), `need` = fallo punteado (necesita el dato y no le llega), `dim` = atenuado.
- Un `path` con varios saltos etiqueta cada rama con el mismo `label`: es justo lo que enseña el prop drilling (la misma prop pasando nivel por nivel).
- Solo se dibujan las flechas del paso actual.
- Opciones de tamaño: `nodeW` (168), `nodeH` (52), `levelGap` (118), `top` (40). Con 5 hojas a `width: 1000` caben nombres de ~18 caracteres.
- **Roles `dirty`, `build`, `reuse`, `self`** (los usa `dk-phone.js` para el árbol de widgets): `dirty` = fallo (naranja, relleno fuerte), `build` = control (azul, relleno fuerte), `reuse` = éxito (verde), `self` = datos (violeta). Sus textos de leyenda están en `ROLE_TXT` (`legend: ['dirty', 'build', 'reuse']`).
- **Rol `hide`** (`roles: { panel: 'hide' }`): el nodo y la rama que llega a él **todavía no existen** en ese paso (opacidad 0). Sirve para que aparezca una rama nueva cuando llega un requisito nuevo (el `PanelResumen` del prop drilling). El hueco queda reservado: el árbol no se re-distribuye. Ejemplo: `static/interactive/seminario-de-i-d-i/semana-12/elevacion-agenda/`.

## dk-phone.js: `DK.phone(opciones)`

Escena para `DK.player` (con `wide: true`; **requiere también `dk-tree.js`**): **a la izquierda un teléfono** con la pantalla de la app (HTML con estilo Material, siempre en tema claro como una pantalla real). **A la derecha**: el **árbol de widgets dibujado como árbol** (`DK.tree`: nodos y ramas; cada nodo se marca `dirty`, `build()`, `reutilizado` si es `const` o `se repinta solo`, con una leyenda en la cabecera) y, debajo y lado a lado, el inspector del objeto `State` (campos con tipo y valor; lo que cambia se resalta) y la **consola** de `debugPrint`. Arriba, el camino del evento (`Toque > Callback > setState > dirty > build() > Pantalla`) con su aviso en la misma fila. El panel de código lo pone `DK.player` (`code`; en estas piezas se reduce a 150 px de alto).

**Que quepa en pantalla:** en escritorio la pieza mide ~820 a 960 px (todo a la vista en una laptop); en celular (< 700 px) el árbol y (inspector + consola) pasan a **dos pestañas** con un punto que avisa cuál cambió en el paso, y la pieza baja de ~1700 a ~1100 px. Un árbol de 4 niveles y 4 hojas ya es el máximo cómodo: quita raíces que no enseñan nada (se omitió `MaterialApp`; `Scaffold` basta como ancestro que no se reconstruye).

```js
scene: function (svg, stage, api) {          // el player pasa un tercer argumento: api.code([líneas]) resalta código
  return DK.phone({
    stage: stage, api: api,
    title: 'Contador', height: 360,          // AppBar y alto de la pantalla en px (por defecto 446)
    className: '_ContadorPageState',         // cabecera del inspector
    init: { _contador: 0 },                  // estado inicial (solo JSON); freeInit: estado con el que arranca el modo libre
    fields: [{ key: '_contador', type: 'int', show: function (v, s) { return String(v); } }],   // show es opcional
    initLog: ['--> build() ejecutado. Valor actual: 0'],
    buildLog: function (s) { return '--> build() ejecutado. Valor actual: ' + s._contador; },
    tree: [ { id: 'page', label: 'ContadorPage', d: 2, state: true }, { id: 't1', label: "Text('...')", d: 4, k: 'const' } ],
    view: function (s) { return '<p class="pf-big">' + s._contador + '</p><button class="pf-btn" data-act="inc">Incrementar</button>'; },
    actions: { inc: function (s, arg) { s._contador++; return { set: true, code: [4, 5, 6, 7] }; } },   // modo libre
    input: function (s, key, value) { s.nombre = value; return { self: 'tfNombre', note: '...', code: [3] }; },
  });
}
```

- **`tree`:** filas **en orden de recorrido** con `d` (profundidad; el padre de una fila es la anterior con un nivel menos), `label` (corto: cabe en ~14 caracteres), `sub` (detalle en una segunda línea; string, o función `(estado) => texto` para detalles dinámicos), `state: true` (el widget dueño del `State`: es el que se marca `dirty` y cuyo subárbol se reconstruye), `k: 'const'` (se reutiliza) y `when: (estado) => bool` (fila condicional: oculta también a sus descendientes). Opciones del árbol: `treeWidth` (por defecto se calcula con el número de hojas). Antes del primer paso, `introNote` (o un texto por defecto) explica el camino vacío. Las marcas se calculan solas: `tree: 'dirty'` marca al dueño; `tree: 'build'` marca al dueño y a sus descendientes (los `const` salen `reutilizado` y sus hijos no se marcan); también acepta un objeto `{ id: 'dirty' | 'build' | 'reuse' | 'self' }`.
- **Pantalla (`view`)**: usa las clases `pf-*` de `dk-base.css`: `pf-label`, `pf-big`, `pf-h`, `pf-btn` (+ `out`, `warn`), `pf-field` (campo con etiqueta flotante; `<label class="pf-field"><span>Nombre</span><input data-in="nombre"></label>`), `pf-card`, `pf-result`, `pf-row`, `pf-chip`, `pf-tile` (con `.av`, `.tx` y un `button.x` para eliminar), `pf-empty`. Iconos: `DK.phone.icon('add' | 'check' | 'refresh' | 'del' | 'person' | 'mail' | 'phone')`; `DK.phone.esc(texto)` escapa HTML. **Tocable** = `data-act="accion"` (más `data-arg="id"`); **campo de texto** = `data-in="clave"`.
- **Pasos guiados** (cada paso hereda `state` y `log` de los anteriores; el resto se describe completo): `state` (campos que cambian), `changed` (filas resaltadas), `stale: true` (la pantalla **aún no se reconstruyó**: sigue mostrando el estado anterior; es lo que enseña que "dato" y "pantalla" no cambian a la vez), `tap: 'inc' | 'del:2'` (un dedo toca ese elemento), `stage` (chip activo del camino, 0 a 5), `block` (chip donde el flujo se corta: `setState` que no se llamó), `tree`, `log`, `snack` (un SnackBar), `note` (aviso bajo el camino), `dwell` (ms de lectura en reproducción automática) y `msgs: []` (el player lo necesita).
- **Modo libre** (`free: true` en un paso): el estudiante toca la pantalla y las `actions` corren de verdad, animando el camino chip a chip. Una acción muta el estado y devuelve `{ set, code, log, snack, note }`: `set: true` recorre todo el camino (setState, dirty, build, pantalla); `set: false` lo corta en `setState` (la variable cambia, la pantalla no). `input` atiende `data-in`: escribir **no** llama a `setState` y marca la fila del `TextField` (`self`). El botón **Restablecer** reinicia el estado.
- **Qué enseña bien:** que `setState` es avisar y no solo cambiar; que escribir en un `TextField` no reconstruye la página; qué subárbol se reconstruye y qué `const` se reutiliza. Piezas de referencia: `static/interactive/seminario-de-i-d-i/semana-11/` (`setstate-en-accion`, `formulario-registro`, `agenda-monolitica`).
- **`hint`:** texto bajo el teléfono en el modo libre (por defecto «Toca los botones del teléfono y mira el camino a la derecha.»). **`panels`:** qué paneles se muestran a la derecha, entre `'state'`, `'tree'` y `'console'` (por defecto los tres); quita los que el paso no necesita.
- Ancho: en pantallas de menos de 700 px el teléfono se apila sobre los paneles.

## dk-nav.js: `DK.nav(opciones)`

Escena para `DK.player` (con `wide: true`; **requiere `dk-phone.js` y `dk-nav.css`**). **Mitad izquierda: teléfono** (AppBar con flecha cuando `canPop`, botón «Atrás del sistema»; en la base de la pila, Atrás cierra la app y sale un aviso). **Mitad derecha: la pila** como tarjetas apiladas (ruta, widget, estado `visible` o `suspendida`, marcas), con las etiquetas TOPE DE LA PILA y BASE y la fila `canPop`. Encima, una pastilla con la llamada `Navigator.*` del paso. En menos de 700 px el teléfono y la pila se apilan.

```js
scene: function (svg, stage, api) {
  return DK.nav({
    stage: stage, api: api, height: 330, sysBack: true,
    data: { q: 'sillas' },                       // datos de las pantallas (los campos con data-in los modifican)
    screens: { '/': { title: 'Catálogo', widget: 'CatalogoScreen', noBack: true, view: function (c) { return '<button class="pf-btn" data-act="detalle">Ver detalle</button>'; } },
               '/detalle': { title: 'Detalle', widget: 'DetalleScreen', view: function (c) { return '...'; } } },
    actions: { detalle: function (nav) { nav.push('/detalle'); return { call: "Navigator.pushNamed(context, '/detalle')", note: '...' }; } },
  });
}
```

- **`screens`:** por ruta, `title` (AppBar), `widget` (nombre en la tarjeta), `noBack` (sin flecha aunque haya ruta debajo), `view(c)` (HTML con las clases `pf-*`; `c.data` son los datos). Tocable = `data-act`; campo = `data-in`.
- **Pasos guiados:** `stack` (arreglo de rutas, base primero; una entrada puede ser `'ruta#etiqueta'` para repetir la misma ruta), `call` (texto de la pastilla), `tap` (`'__back'` flecha de la AppBar, `'sys'` Atrás del sistema, o un `data-act`), `out: 'left' | 'right'` (de qué lado sale la tarjeta que se va), `marks` (marcas por tarjeta: `err`, `ack`, `warn`), `data`, `exit: true` (la app se cierra), `note`, `code`, `free: true` (modo libre) y `msgs: []`.
- **`actions` (modo libre):** `function (nav, arg, step)` con `nav.push(ruta)`, `nav.pop()`, `nav.canPop()`, `nav.removeUntil(predicado)` y `nav.stack()`; devuelve `{ call, code, note, out }`. `sysBack: true` activa el botón de Atrás del sistema en el modo libre.
- **`hint`:** texto de ayuda del modo libre (por defecto «Toca los botones del teléfono y mira cómo cambia la pila.»).
- **Qué enseña bien:** que `push` apila y no reemplaza, que la ruta de abajo sigue viva, cuándo aparece la flecha y qué queda en la pila tras `pushNamedAndRemoveUntil`. Piezas de referencia: `static/interactive/seminario-de-i-d-i/semana-13/` (`navegacion-pila`, `push-remove-until`).

## dk-tabs.js: `DK.tabs.phone(opciones)`

Un teléfono (solo `dk-kit.js` y `dk-tabs.css`; no es escena de `DK.player`: se usa dentro de una pieza propia, como en `tabs-vs-push`, `bottom-nav-anfitriona` y `tabs-codigo`). Devuelve `{ el, render }`. **No guarda estado:** la pieza decide qué dibujar y vuelve a llamar a `render`.

```js
var ph = DK.tabs.phone({
  height: 330,
  on: function (act, arg) { /* act: 'tab' (arg = índice), 'open' (arg = título del curso), 'back' */ },
  onType: function (texto) { /* el campo «Buscar» de la pestaña Cursos */ }
});
contenedor.appendChild(ph.el);
ph.render({ tab: 0, detail: null, q: 'sillas' });   // detail: título del detalle abierto, o null
```

- Con `detail` distinto de `null` la barra inferior se oculta (el detalle la cubre), la AppBar muestra la flecha y el cuerpo entra deslizándose.
- Atributos `data-pe` para enlazar con código al pasar el ratón: `tab`, `curso`, `back`, `volver`, `q`; la clase `.hov` marca el elemento (estilo en `dk-tabs.css`).
- Lo que enseña bien: que cambiar de pestaña es `setState` y no toca la pila, y que `IndexedStack` conserva el estado de las páginas (el campo «Buscar» se pierde con la lista directa). Piezas de referencia: `static/interactive/seminario-de-i-d-i/semana-13/` (`tabs-vs-push`, `bottom-nav-anfitriona`, `tabs-codigo`).

## dk-compare.js: `DK.compare(opciones)`

Escena para `DK.player` que muestra N diagramas de secuencia en paralelo (uno por alternativa) y los avanza con el mismo paso.

```js
scene: function (svg, stage) {            // el player pasa el contenedor `stage`; la escena arma su propio DOM
  return DK.compare({
    stage,
    statLabel: 'mensajes',                // contador acumulado por panel ("8 mensajes"); omitir para no mostrarlo
    panes: [
      { id: 'tcp', title: 'TCP', subtitle: 'confirma cada entrega', sequence: { actors, phases, trayCount, idleState } },
      { id: 'udp', title: 'UDP', subtitle: 'envía y sigue',         sequence: { ... } },
    ],
  });
}
```

Cada panel usa un `DK.sequence` de 384 de ancho (para que el texto siga legible en media columna; en pantallas angostas los paneles se apilan). Un **paso compartido** tiene lo común y lo propio de cada panel:

```js
{ phase: 1, title, caption,                       // lo común: el contraste, en una o dos frases
  panes: { tcp: { msgs: [...], state: {...}, tray: {...}, note: 'Cada entrega se confirma' },
           udp: { msgs: [],    state: {...}, tray: {...}, note: 'Envía y sigue' } } }
```

- `note` es el texto corto bajo cada panel (lo que enseña ese lado en ese paso).
- Un panel sin actividad lleva `msgs: []`: **lo que no pasa también enseña** ("UDP no abre conexión"). Si una fase no tiene mensajes en un panel, ese panel no dibuja su banda, y se nota que ahí no ocurre nada.
- El adaptador completa `step.msgs` con la lista del panel más largo para que el player calcule la duración del paso.

Pieza de referencia: `candidates/static/interactive/computacion-2/semana-1/tcp-vs-udp/index.html`.

## dk-radial.js: `DK.radial(opciones)`

Escena circular para `DK.player`. La cabecera de `kit/dk-radial.js` documenta cada opción (anillos con `at` para rótulo recto o `arc` para rótulo curvo, `nodes` como función que se evalúa en cada `setSteps`, `groups` y `matrix` para la matriz de límites, pasos con `focus`, `rings`, `sub` y `msgs` con `bend`/`ctrl`/`lost`/`labelAt`/`labelSide`). Carga `dk-radial.css` después de `dk-base.css`: trae además los estilos de la barra de feature (`.dk-fbar`).

Con `ctrl.rebuild()` (en el objeto que devuelve `DK.player`) la pieza vuelve a ejecutar `build()` sin mover el paso actual; sirve para piezas genéricas que reescriben todos sus textos (por ejemplo, cambiar el nombre de la feature). Pieza de referencia: `static/interactive/computacion-3/semana-12/clean-architecture-circular/index.html`.

## dk-player.js: `DK.player(opciones)`

```js
DK.player({
  mount,                     // contenedor vacío
  phases: [...],             // pestañas (una por fase)
  scene: function (svg) { return DK.sequence({ svg, ... }); },
  build: function (opts) { return steps; },   // opts = valores de los interruptores, ej. { loss: false }
  toggles: [{ key: 'loss', label: 'Simular que se pierde un paquete', affectsPhase: 1 }],
  kicker: function (p) { return 'Fase ' + (p + 1) + ' · ...'; },   // opcional
  intro: { kicker, title, text },                                   // pantalla inicial (paso -1)
  ariaLabel: '...',
});
```

**Pieza ancha** (opción `wide: true`): quita los topes de la tarjeta (760 px) y del dibujo (640 px, o 732 px en `DK.layers`), así la pieza ocupa todo el ancho del iframe y crece con la columna del sitio (en modo enfoque llega a ~1100 px). Para que eso se traduzca en **más espacio** y no solo en todo más grande, dibuja con un `viewBox` de ~1000 de ancho y separa más los recuadros (140 a 200 unidades entre recuadros conectados). Opcional: las piezas sin `wide` no cambian. Ejemplos: piezas de `static/interactive/computacion-3/semana-12/`.

`affectsPhase`: al cambiar el interruptor, `build` se vuelve a ejecutar y la pieza regresa al final de la fase anterior a esa (o se queda si aún no la había alcanzado). **Panel de código sincronizado** (opción `code`): muestra el código real que se explica y resalta, en cada paso, las líneas que se ejecutan.

```js
code: { title: 'HelloServlet.java', text: CODIGO_COMO_TEXTO },   // en el player
// y en cada paso:  { ..., code: [9, 10] }                          // líneas a resaltar, numeradas desde 1
```

`code` también puede ser una **función** `(opts) => ({ title, text })` cuando el código cambia con los interruptores (por ejemplo, con y sin `@Transactional`): el panel se redibuja en cada cambio y las líneas se numeran igual en todas las variantes (reemplaza una línea, no agregues ni quites líneas, para que los números de los pasos sigan valiendo). Pieza de referencia: `candidates/static/interactive/computacion-2/semana-6/transaccion-transferencia/index.html`.

**Colores del código por rol** (`DK.highlight`, con leyenda automática en la cabecera del panel; se apaga con `legend: false`): **clase o tipo** (verde azulado, negrita: `Product`, `Pageable`), **método** (marrón: lo que va seguido de `(`), **objeto o variable** (morado: `productRepository`, `page`), **palabra clave** (azul, negrita: `public`, `new`, `throw`), texto, número, anotación y comentario (gris cursiva). Reglas del tokenizador: mayúscula inicial = clase; palabra + `(` = método (tras `new`, es la clase del constructor); el resto en minúscula = objeto o variable. Los tokens `--dk-s-kw/ty/fn/ob/st/nu/an` están en `dk-base.css` con variante oscura. Si el código de un capítulo usa otro lenguaje (XML, SQL), ampliar `DK.highlight` o agregar un resaltador por lenguaje. **Dart:** `late` y `required` son palabras clave, y `int double bool num dynamic` se pintan como tipo (no como variable); `String`, `List`, `Widget` ya salen como clase por la mayúscula inicial. Para números de línea que no se desfasen al editar el código, no los escribas a mano: define las líneas en un arreglo y busca por texto (`at('initState')`, `rng('setState(() {', "_mensaje = 'Usuario")`), lanzando un error si el rango queda vacío.

El panel tiene alto limitado (~196 px) y se **desplaza solo** hasta la primera línea resaltada; trae resaltado de sintaxis mínimo (`DK.highlight`: palabras clave, textos, anotaciones, comentarios). Cuidado al numerar: cuenta las líneas en blanco. Pieza de referencia: `candidates/static/interactive/computacion-2/semana-1/ciclo-vida-servlet/index.html`.

**Controles de otros tipos** (además del interruptor `checkbox`): `toggles` acepta un **deslizador** `{ key, type: 'range', label, min, max, step, value, format }` y un **selector** `{ key, type: 'select', label, options: ['A', 'B'], value: 0, affectsPhase | restart: 'first' }`. `build(opts)` recibe el número elegido (`opts[key]`). El deslizador reconstruye los pasos **sin mover** el paso actual (la velocidad cambia y la aguja gira); el selector, como un interruptor, vuelve al inicio de la fase afectada (`affectsPhase`) o, con `restart: 'first'`, al primer paso. Las flechas del teclado dentro de un deslizador o selector **no** cambian de paso. Un selector evita construir una pieza por caso (diez situaciones, cuatro reglas rotas).

**Opciones y campos extra del player:**
- `scene(svg, stage, api)`: el **tercer argumento** `api` trae `api.code([líneas])`, para que una escena interactiva (`DK.phone` en modo libre) resalte líneas del panel de código por su cuenta.
- `paso.dwell` (ms): tiempo de lectura de un paso en la reproducción automática, cuando el paso no tiene mensajes que animar (por defecto 1700 ms, pensado para flechas).
- **URL con `#fase=N`** (`index.html#fase=3`): la pieza se abre en la fase N (1 = primera). Sirve para usar **la misma pieza en dos secciones** de un capítulo (elevación de estado en una y prop drilling en otra) sin duplicarla. Ojo al probar: navegar a la misma URL con otro `#` no recarga la página.

Contrato de una escena para `DK.player`: `scene(svg, stage)` devuelve un objeto con `setSteps(steps)`, `render(i, animate)` (que devuelve `{ animMs }`) y `msgDuration`; cada paso trae `phase`, `title`, `caption` y `msgs` (para calcular la duración). `DK.sequence` usa el `svg`; `DK.compare` ignora el `svg` y llena `stage`.

## Pantalla completa (`InteractiveFrame` + `html.dk-fs`)

Para ver una pieza compleja con mucho más espacio, el sitio tiene el componente global `<InteractiveFrame>` (`src/components/InteractiveFrame/`, registrado en `src/theme/MDXComponents.js`, sin import en el `.md`):

```mdx
<InteractiveFrame src="/interactive/<curso>/<semana>/<slug>/index.html" title="Título accesible" height={780} />
```

- Propiedades: `src`, `title`, `height` (alto en la página; por defecto 700). Pinta el mismo `<iframe>` de siempre y, arriba a la derecha, el botón "Pantalla completa".
- Al pulsarlo abre un `<dialog>` modal (96 vw por 94 vh, fondo oscurecido; Esc, "Cerrar" o un clic fuera lo cierran; bloquea el desplazamiento de la página). La pieza del diálogo **se crea solo al abrir** y se elimina al cerrar, y su `<iframe>` lleva `data-dk-fixed`.
- Contrato con la pieza: `DK.autoHeight()` detecta `data-dk-fixed`, no ajusta el alto y pone la clase **`dk-fs`** en `<html>`. El alto del iframe es ahora el de la ventana, así que `100vh` dentro de la pieza vale ese alto.
- **Reglas genéricas (`dk-base.css`):** toda pieza de `DK.player` cuya figura es un `<svg>` directo en el escenario (`DK.layers`, `DK.tree`, `DK.sequence`) ya aprovecha el diálogo sin tocar su `index.html`: la figura a la izquierda llenando el alto de la ventana y, a la derecha, el texto del paso, los controles y el código. La pieza circular (`DK.radial`) trae sus propias reglas en `dk-radial.css`.
- **Piezas con escenario HTML** (`DK.anatomy`, `DK.table`, `DK.compare`, `DK.phone`): usan el ancho completo del diálogo (la tarjeta pierde su tope de 760 px) pero no reorganizan su contenido. No las conviertas a `<InteractiveFrame>` salvo que se les agreguen reglas `dk-fs` propias y se pruebe en una captura.
- **Cómo adaptar una pieza** (el ejemplo real está en `dk-radial.css`): haz que el cuerpo ocupe el alto de la ventana y que la fila de la figura y la del código se estiren, en vez de restar alturas a mano:

```css
@media (min-width: 821px) {
  .dk-fs body { height: 100vh; display: flex; flex-direction: column; }
  .dk-fs #app { flex: 1; min-height: 0; }
  .dk-fs .dk-card { height: 100%; grid-template-rows: auto auto auto auto auto minmax(0, 1fr); }   /* la última fila se estira */
  .dk-fs .dk-stage { align-self: stretch; min-height: 0; overflow: hidden; }
  .dk-fs .dk-stage svg { width: 100%; height: 100%; max-width: none; }   /* meet: la figura llena el alto sin deformarse */
  .dk-fs .dk-code { align-self: stretch; max-height: none; min-height: 0; }
}
```

Restringe esas reglas al diseño ancho (`min-width: 821px`): en una pantalla angosta la pieza se apila y no debe forzarse a 100 vh. Si una escena nueva (o una de las de escenario HTML) necesita reglas `dk-fs`, agrégalas a `dk-base.css` (o a su propio `dk-<escena>.css`) con el mismo patrón y pruébalas en una captura con la ventana grande (por ejemplo 1824x873).

## Tokens y clases de `dk-base.css`

Colores **categóricos** `--dk-p1` a `--dk-p5` para distinguir partes de algo (no tienen rol; úsalos en `dk-anatomy` o cuando haya varias categorías sin significado de éxito/error).

Roles de color (siempre usar el rol, nunca un hex): `--dk-ctl` (control/acción), `--dk-ack` (confirmación), `--dk-data` (carga útil), `--dk-err` (fallo), más `--dk-card`, `--dk-ink`, `--dk-muted`, `--dk-line`, `--dk-chip`, `--dk-band`, `--dk-band-on`. Para una pieza nueva con otro vocabulario (por ejemplo "estado" y "evento"), **mapear sus conceptos a estos roles** antes de inventar colores; si hace falta un rol nuevo, agregarlo a `dk-base.css` con su variante oscura.

## Cuándo ampliar el kit

- Si algo se copió de una pieza a otra, o se va a copiar: moverlo al kit.
- Si un icono o forma se dibujó por segunda vez: agregarlo a `dk-icons.js`.
- Si una escena nueva (árbol de widgets, máquina de estados, capas de arquitectura, antes/después) se repite en más de una pieza: hacerla un módulo `dk-<escena>.js` con la misma forma que `dk-sequence.js` (datos de entrada, `setSteps`, `render`).
- Cada ampliación se documenta en este archivo en el mismo cambio.
