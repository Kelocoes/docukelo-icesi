# API del kit de piezas interactivas

Ubicación (copia maestra única): `static/interactive/_shared/`. Una pieza nueva solo debería escribir **datos** y llamar al kit; si se encuentra copiando o escribiendo lógica de dibujo, animación o controles, esa lógica pertenece al kit (ver "Cuándo ampliar el kit").

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
<script src="../../../_shared/dk-compare.js"></script>   <!-- escena: comparación A/B (necesita dk-sequence) -->
<script src="../../../_shared/dk-anatomy.js"></script>   <!-- escena: anatomía explorable (enfoca partes de un mensaje) -->
<script src="../../../_shared/dk-table.js"></script>     <!-- escena: tabla de datos con estado (paginación, orden, SQL) -->
<script src="../../../_shared/dk-tree.js"></script>      <!-- escena: árbol de componentes + estado (props, callbacks, Context) -->
<script src="../../../_shared/dk-phone.js"></script>     <!-- escena: teléfono + State + árbol de widgets + consola (cargar dk-tree.js ANTES de dk-phone.js) -->
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
| `dk-table.js` | `DK.table`: tabla de datos reales con estado por paso (todas las filas o una página, orden, SQL generado, metadatos de `Page<T>`, medidores de costo) | Paginación, orden, filtros, `LIMIT/OFFSET`: "qué trae esta consulta" |
| `dk-anatomy.js` | `DK.anatomy`: un mensaje o documento real en una caja; cada paso enfoca una parte y a la derecha aparece su explicación | Explicar la estructura de algo (petición HTTP, JWT, JSON, URL) |
| `dk-tree.js` | `DK.tree`: un árbol de componentes de verdad (nodos y ramas, distribuido solo); cada paso marca roles y hace viajar datos por las ramas o en salto directo | Estado en React/Flutter: lifting state up, prop drilling, Context, store global, re-renders |
| `dk-phone.js` | `DK.phone`: un teléfono con la app real (que el estudiante puede tocar) y, al lado, el camino del evento, el objeto `State` con sus campos, el árbol de widgets (dirty, build, const reutilizado) y la consola | Estado en Flutter (`setState`, controladores, formularios, listas): causa y efecto provocados por el estudiante |
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
`laptop` (~72×40), `server` (~52×37), `database` (~48×40), `browser` (~60×42), `user` (~36×44). `piece(n, size)`, `cross(size)` y `check(size)` se dibujan centrados en (0,0). Los iconos usan solo clases `dk-*` y tokens, así que cambian solos con el tema.

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

Los chips y las bandejas cambian **cuando la flecha llega**, no al empezar el paso. Las flechas de pasos anteriores quedan dibujadas (el diagrama cuenta toda la historia). Con `msgs.length` flechas en un paso, se animan en cascada.

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

Piezas de referencia: `candidates/static/interactive/computacion-2/semana-1/servlet-en-tomcat/index.html` (3 niveles), `.../semana-2/contenedor-ioc-y-beans/` (usa `sub` y `trail`) y `.../semana-2/spring-en-tomcat/` (4 niveles de anidamiento, flujo completo de una petición).

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
- Ancho: en pantallas de menos de 700 px el teléfono se apila sobre los paneles.

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

Escena circular para `DK.player`. La cabecera de `static/interactive/_shared/dk-radial.js` documenta cada opción (anillos con `at` para rótulo recto o `arc` para rótulo curvo, `nodes` como función que se evalúa en cada `setSteps`, `groups` y `matrix` para la matriz de límites, pasos con `focus`, `rings`, `sub` y `msgs` con `bend`/`ctrl`/`lost`/`labelAt`/`labelSide`). Carga `dk-radial.css` después de `dk-base.css`: trae además los estilos de la barra de feature (`.dk-fbar`).

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
