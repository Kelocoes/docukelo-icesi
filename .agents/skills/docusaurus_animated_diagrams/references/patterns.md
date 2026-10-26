# Catálogo de patrones

Cada patrón dice cuándo usarlo, qué módulo del kit lo resuelve y qué pieza real es el ejemplo. Un patrón sin módulo es una **oportunidad**: al construirlo por primera vez, extraer su motor al kit (ver `kit-api.md`, "Cuándo ampliar el kit") y marcar aquí el estado.

| Patrón | Para enseñar | Módulo | Estado | Ejemplo |
|---|---|---|---|---|
| Diagrama de secuencia por fases | Protocolos y flujos entre actores en el tiempo (handshakes, request/response, autenticación) | `dk-sequence.js` + `dk-player.js` | Hecho | `static/interactive/computacion-2/semana-1/tcp-en-accion/` |
| Línea de tiempo / revelado | Historia o evolución (años, versiones) sobre un SVG ya dibujado | `tools/dk_animate.py` (N1/N2) | Hecho | `static/img/computacion-3/clean-arch-origins-timeline.svg` (propuesta en el visor) |
| Árbol + estado | Dónde vive el estado en una jerarquía de componentes y cómo viaja (props hacia abajo, callbacks hacia arriba, salto directo de Context o store), quién solo reenvía y quién se re-renderiza | `dk-tree.js` + `dk-flow.js` + `dk-player.js` | Hecho | `static/interactive/computacion-3/semana-12/arbol-estado/` |
| Árbol + selectores | Qué componentes se re-renderizan al cambiar un store global según el selector (sin selector, un selector por dato, objeto nuevo frente a `useShallow`) | `dk-tree.js` (roles `use`, `need`, `dim` + `tags`, sin leyenda) + `dk-player.js` | Hecho | `static/interactive/desarrollo-entornos-digitales-web/semana-13/selectores-y-rerender/` |
| Comparación A/B en paralelo | Dos opciones con consecuencias distintas (TCP vs UDP, stateful vs stateless, con/sin caché) | `dk-compare.js` + `dk-sequence.js` + `dk-player.js` | Hecho (propuesta en revisión) | `candidates/static/interactive/computacion-2/semana-1/tcp-vs-udp/` |
| Capas concéntricas | Una arquitectura por anillos (Clean Architecture) con regla de dependencia y viaje de una solicitud con su respuesta; el nombre de la feature es intercambiable | `dk-radial.js` + `dk-flow.js` + `dk-player.js` | Hecho (integrada en computacion-3, semana 12) | `static/interactive/computacion-3/semana-12/clean-architecture-circular/` |
| Arquitectura recorrida | Dónde vive cada pieza y por dónde pasa una solicitud (Tomcat → Coyote → Catalina → servlet; capas controller/service/repository; filtros de seguridad) | `dk-layers.js` + `dk-flow.js` + `dk-player.js` | Hecho (propuesta en revisión) | `candidates/static/interactive/computacion-2/semana-1/servlet-en-tomcat/` |
| Ciclo de vida con código sincronizado | Qué método se ejecuta cuándo y qué línea de código lo hace (servlet, bean, componente) | `dk-sequence.js` + `dk-player.js` con la opción `code` | Hecho (propuesta en revisión) | `candidates/static/interactive/computacion-2/semana-1/ciclo-vida-servlet/` |
| Anatomía explorable | Las partes de algo con estructura (una petición HTTP: método, URL, versión, encabezados, cuerpo) y qué hace cada una | `dk-anatomy.js` + `dk-flow.js` + `dk-player.js` | Hecho (propuesta en revisión) | `candidates/static/interactive/computacion-2/semana-1/peticion-http/` |
| Tabla de datos con estado | Qué trae una consulta: todas las filas o una página, con orden, SQL y costo (paginación, filtros, LIMIT/OFFSET) | `dk-table.js` + `dk-player.js` con `code` | Hecho (propuesta en revisión) | `candidates/static/interactive/computacion-2/semana-6/paginacion-spring/` |
| Simulador con desenlaces contrastantes | Qué cambia el resultado de una operación según una decisión (con/sin `@Transactional`, con/sin fallo): commit, rollback, inconsistencia | `dk-layers.js` (`sub` por paso) + `dk-player.js` con `code` función y 2 interruptores | Hecho (propuesta en revisión) | `candidates/static/interactive/computacion-2/semana-6/transaccion-transferencia/` |
| Simulador de app móvil | Qué pasa por dentro cuando el usuario toca una app: dato que cambia, `setState`, widgets dirty, `build()`, consola; el estudiante lo provoca en un teléfono | `dk-phone.js` + `dk-player.js` con `code` | Hecho | `static/interactive/seminario-de-i-d-i/semana-11/setstate-en-accion/` |
| Pila de navegación | Cómo cambia la pila de rutas del Navigator al navegar (push, pop, `pushNamedAndRemoveUntil`) con un teléfono en una mitad y la pila en la otra | `dk-nav.js` + `dk-player.js` (sin código; el código va en otra pieza) | Hecho | `static/interactive/seminario-de-i-d-i/semana-13/navegacion-pila/`, `push-remove-until/` |
| Código por archivos enlazado con el teléfono | Un proyecto de varios archivos (`main.dart`, `routes/`, `screens/`): teléfono a 1/3, editor con pestañas a 2/3; tocar el teléfono resalta la línea y ▶ Ejecutar mueve el teléfono | Pieza propia con editor y colores de sintaxis (`DK.highlight`) | Hecho | `static/interactive/seminario-de-i-d-i/semana-13/pila-codigo/` |
| Pila frente a cola | Concepto de estructura de datos sin código: LIFO frente a FIFO con los mismos elementos | Pieza propia (DOM), sin player | Hecho | `static/interactive/seminario-de-i-d-i/semana-13/pila-vs-cola/` |
| Pestañas frente a detalle | Navegación horizontal (`setState` + `NavigationBar`) frente a jerárquica (`push`): qué pasa con la pila, la barra y el estado de las páginas (`IndexedStack`) | `dk-tabs.js` (teléfono) + pieza propia | Hecho | `static/interactive/seminario-de-i-d-i/semana-13/tabs-vs-push/`, `bottom-nav-anfitriona/`, `tabs-codigo/` |
| Código coloreado por responsabilidad | Un archivo largo con varias responsabilidades mezcladas y cómo se corta (monolito a componentes) | `dk-anatomy.js` (`code`, `layout: 'stack'`, `all: true`) | Hecho | `static/interactive/seminario-de-i-d-i/semana-11/responsabilidades-agenda/` |
| Capas de identidad (qué se recrea y qué se conserva) | Tres árboles paralelos (Widget, Element, RenderObject): qué objeto cambia de identidad y cuál se reutiliza | `dk-layers.js` (`sub` por paso con ids `#a1`, `#b7`, `trail: 'phase'`) | Hecho | `static/interactive/seminario-de-i-d-i/semana-11/tres-arboles/` |
| Contrato como toma y enchufe | Un contrato (interfaz) y sus implementaciones intercambiables: polimorfismo, OCP, LSP, DIP, Pure Fabrication, puertos y adaptadores | `dk-canvas.js` + `dk-player.js` (`socket`, `plug`, `at`) | Hecho | piezas de Saman (repo Diseño de Software 1, `body_of_knowledge/saman/build/pieces`): `polimorfismo-enchufe`, `ocp-regleta`, `lsp-contrato`, `mapa-puertos-adaptadores` |
| Contraste con contador | Un antes y un después con un número que se vuelve tangible (5 de 5 módulos modificados frente a 1 de 4; 3 clientes recompilan frente a 1) | `dk-canvas.js` (`tag` con `text` por paso, `state`, `pulse`) | Hecho | `parnas-secretos`, `isp-herramientas` |
| Acoplamiento como maraña | Un diseño acoplado como hilos entre piezas que se mueven juntas; propagar un cambio, romper algo lejano, arrastrar piezas | `dk-canvas.js` (`web`, `pulse`, `at`, `webTone`) | Hecho | `sintomas-enredo` |
| Dos vistas de las mismas piezas | Dos direcciones que no coinciden (flujo de control frente a dependencias de código) en carriles paralelos | `dk-canvas.js` (zonas `round`, flechas `dep` y `ctl`) | Hecho | `dip-carriles` |
| Matriz de criterios | Candidatos evaluados contra criterios con ✓/✗ que aparecen por columna y un puntaje | `dk-canvas.js` (`draw` para las marcas, `tag`) | Hecho | `creator-matriz` |
| Clasificador con selector | "Tengo este problema, ¿qué uso?": Venn con el catálogo completo, una regla micro/macro y un selector de situaciones | `dk-canvas.js` + selector de `dk-player.js` | Hecho | `clasificador-heuristicas` |
| Simulador con deslizador | Un parámetro continuo (velocidad) cuyo valor cambia el desenlace; caso borde visible; aguja que gira | `dk-canvas.js` (`rot`) + deslizador de `dk-player.js` | Hecho | `simulador-pruebas` |
| Máquina de estados | Estados que cambian por eventos (transacción, sesión, token) | por construir (`dk-states.js`) | Por hacer | — |
| Antes / después | Efecto de una técnica (refactor, normalización, índice) | por construir | Por hacer | — |

| Dos puertas en orden con salidas de error | Dos controles encadenados (autenticación y autorización) donde el segundo depende del primero y cada uno falla con su código (401, 403) | `dk-layers.js` (`tone: 'err'`, flechas `err`) + `dk-player.js` con 2 interruptores | Hecho (propuesta en revisión) | `candidates/static/interactive/computacion-2/semana-9/authn-vs-authz/` |
| Arquitectura densa recorrida por fases numeradas | Un diagrama con 10 o más piezas (Spring Security) y un flujo largo: se presentan las piezas una a una y luego el flujo, con pasos numerados como el diagrama de secuencia del capítulo | `dk-layers.js` (`trail: 'phase'`, ida y vuelta por la misma línea) | Hecho (propuesta en revisión) | `candidates/static/interactive/computacion-2/semana-9/spring-security-filterchain/` |

## Cómo elegir

1. ¿Hay **tiempo y actores** (quién le dice qué a quién)? → secuencia.
2. ¿Hay **una cosa que atraviesa capas**? → capas.
3. ¿Hay **dos alternativas** que el estudiante debe contrastar? → comparación A/B.
4. ¿Hay **estados que cambian por eventos**? → máquina de estados o árbol + estado.
5. ¿Es **historia o evolución** de algo que ya está dibujado? → revelado con `dk_animate.py`.

## Ficha del patrón "Tabla de datos con estado" (paginación)

- **Cuándo:** el concepto es **qué parte de los datos llega** y **qué consulta se genera** (paginación, orden, filtros). El contraste "todo de golpe frente a un trozo" se entiende mejor con filas reales que con una frase.
- **Estructura que funcionó, en tres fases:** (1) *Sin paginar*: la tabla completa y un medidor rojo `23 de 23`; (2) *Paginar*: una página, otra página, y la tarjeta de metadatos de `Page<T>` resaltada; (3) *Configurar*: `size`, `Sort`, y un último paso "cuándo usarla" con medidores de **magnitud real** (`1.450.000 filas` frente a `10 filas`).
- **Qué lo hace entendible:** (a) el código del capítulo al lado, con líneas activas por paso (la parte "con y sin" va en un solo panel con comentarios `// Sin paginación` / `// Con paginación`); (b) el **SQL generado** cambia a la vista (`OFFSET 0` → `OFFSET 5`, aparece `ORDER BY`), que es lo que de verdad ejecuta Spring; (c) la etiqueta `Pageable: page=1, size=5` muestra los parámetros concretos mientras el código muestra la forma general; (d) el orden se aplica **antes** de cortar la página, y la pieza lo hace visible.
- **Parámetros típicos:** 20 a 30 filas, 8 pasos, 3 fases. Con datos que tengan sentido (la entidad del capítulo).
- **Extensión natural:** el mismo `DK.table` sirve para filtros (`WHERE`), `Slice` (sin `COUNT(*)`) o proyecciones; basta con ampliar `view` y el cálculo del SQL.

## Ficha del patrón "Simulador con desenlaces contrastantes" (transacciones)

- **Cuándo:** el concepto es **qué cambia el resultado según una decisión**: con o sin una anotación, con o sin un fallo. Cada combinación cuenta una historia distinta y el estudiante entiende el valor de la herramienta al ver el caso sin ella.
- **Estructura que funcionó:** un escenario cotidiano (transferir 50 entre dos cuentas, como pidió el profesor), componentes anidados (base de datos > transacción > cuentas) con **saldos que cambian** (`saldo: 50 (provisional)` → `(definitivo)` o `(revertido)`), un nodo `Estado` que dice `COMMIT`, `ROLLBACK` o `INCONSISTENTE`, y el código real debajo. **Dos interruptores** (`Quitar @Transactional`, `Simular un fallo`) producen **cuatro desenlaces**.
- **Qué lo hace entendible:** el caso malo (`sin transacción + fallo`) es el más didáctico: A pierde 50 y B nunca los recibe. La palabra clave es **provisional frente a definitivo**: con transacción los cambios no son definitivos hasta el COMMIT, por eso un ROLLBACK puede deshacerlos.
- **Cuidado técnico:** usa una excepción que sí dispare rollback por defecto (`RuntimeException`); si el ejemplo usara una verificada habría que explicar `rollbackFor`, que es otro tema. **Prueba los cuatro desenlaces por script** (ver `lessons-learned.md`).
- **Convención de interruptores:** que los valores por defecto (apagados) sean el **camino feliz** (con `@Transactional`, sin fallo); los interruptores son para explorar lo que sale mal. Un interruptor del tipo "Quitar X" es más claro que "Usar X" cuando el caso normal es tener X.

## Ficha del patrón "Anatomía explorable" (petición HTTP)

- **Cuándo:** el concepto es **la estructura de algo** (un mensaje, un token, un documento) y cada parte tiene un nombre y una función. Es lo que hace una imagen etiquetada con flechas, pero el estudiante recorre las partes a su ritmo y ve el texto real.
- **Estructura que funcionó, en tres fases:** (1) *El mensaje*: el documento completo viaja de cliente a servidor, para dejar claro que "es solo texto" que se envía; (2) *Sus partes*: una parte enfocada por paso, el resto atenuado, con su explicación y ejemplos a la derecha; (3) *La respuesta*: el servidor lee las partes y responde, para conectar la estructura con el flujo.
- **Qué lo hace entendible:** (a) el mensaje es **real y copiable** (no una captura): `GET /productos HTTP/1.1`; (b) cada parte tiene su color categórico y su explicación usa ese mismo color; (c) una frase corta en la leyenda y el detalle (con ejemplos) en la explicación, sin repetirse; (d) el interruptor "con cuerpo (POST)" demuestra que una parte es **opcional** en vez de afirmarlo.
- **Parámetros típicos:** 3 a 6 partes, un documento de 3 a 6 líneas. Con más partes, agruparlas (por ejemplo "primera línea" = método + URL + versión) o dividir en dos piezas.
- **Cuidado de contenido:** respetar el orden y los nombres que el capítulo ya usa (aquí: método, URL, versión del protocolo, encabezados, cuerpo) y el detalle técnico (la línea en blanco antes del cuerpo es parte del formato).

## Ficha del patrón "Arquitectura recorrida" (servlet dentro de Tomcat)

- **Cuándo:** el concepto es **dónde vive algo** y **por dónde pasa** una solicitud (contención + flujo). Un diagrama de secuencia muestra el orden pero no la contención; este patrón muestra ambas.
- **Estructura que funcionó, en tres fases:** (1) *Las piezas*: pasos sin mensajes que resaltan y explican cada recuadro (Tomcat, Coyote, Catalina); (2) *La solicitud*: la solicitud entra y se mueve de recuadro en recuadro; (3) *La respuesta*: el resultado vuelve. Presentar las piezas antes de moverlas evita que el estudiante vea flechas sobre cosas que no conoce.
- **Qué lo hace entendible:** los componentes anidados se leen como "cajas dentro de cajas" (contenedor punteado → conector → contenedor → servlets); solicitud y respuesta van por líneas paralelas separadas; lo que viaja entre recuadros lleva etiquetas cortas y la explicación va en la leyenda; los mensajes viejos quedan atenuados.
- **Parámetros típicos:** 5 a 8 nodos, 3 fases, 6 a 9 pasos, `viewBox` 640 de ancho. Con más de ~8 nodos o flechas que se cruzan, dividir en dos piezas.
- **Cuidado de contenido:** alinear los nombres con lo que el curso ya explicó (aquí: Tomcat = servidor web, Catalina = contenedor de servlets), y agregar solo lo necesario (Coyote se incluyó porque responde "cómo llega la solicitud a Catalina"; dejarlo es una decisión del profesor).
- **Variante "concepto con estado" (beans e inyección):** cuando lo que se enseña es un cambio dentro de un componente, usar `sub` por paso para mostrarlo (`repositorio = ?` → `repositorio = inyectado`) y una flecha rotulada con el verbo del concepto (`inyecta`). El estudiante ve el instante exacto en que algo "se conecta". Usar los **ids reales del capítulo** (`estudianteServiceBean`, `estudianteRepositoryBean`) para que el diagrama coincida con el XML y el código.
- **Variante "dónde vive y por dónde pasa" (Spring dentro de Tomcat):** cuatro fases de pensamiento en tres pestañas: *El mapa* (quién contiene a quién), *El arranque* (lo que ocurre una sola vez), *La petición* (lo que ocurre muchas veces). Separar "una sola vez" de "cada petición" es el corazón del concepto de singleton y de por qué existe `ContextLoaderListener`.
- **Rediseñar un diagrama denso:** el original tenía todo a la vez (fuentes de 8 px, texto en cada caja). Reparto que funcionó: lo **estructural** (qué contiene a qué) queda en el dibujo con rótulos de 1 a 3 palabras; lo **explicativo** pasa a la leyenda de cada paso; lo **temporal** (orden, flujo) pasa a las flechas animadas.

## Ficha del patrón "Ciclo de vida con código sincronizado" (servlet)

- **Cuándo:** el concepto es **qué se ejecuta y cuándo** (métodos de ciclo de vida, callbacks), y el estudiante ya tiene el código del ejemplo en el capítulo.
- **Estructura que funcionó:** un diagrama de secuencia con 3 actores (cliente, contenedor, objeto) en 3 fases (cargar una vez / atender muchas veces / destruir una vez) y, debajo, **el código real** con las líneas del paso resaltadas. Los chips de estado del objeto (`Creado` → `Listo` → `Atendiendo` → `Listo` → `Destruido`) enseñan su ciclo sin texto largo.
- **Qué lo hace entendible:** (1) conectar cada mensaje con la línea de código que lo causa; (2) un paso que **repite** una solicitud para mostrar que no se vuelve a crear ni a llamar a `init()` (la idea de "una instancia, muchas solicitudes"); (3) las fases se rotulan con su frecuencia ("una vez", "muchas veces").
- **Cuidado:** usar exactamente el código del capítulo (se simplificó a lo mínimo) y verificar la numeración de líneas; el panel de código tiene alto limitado y se desplaza solo.

## Ficha del patrón "Comparación A/B en paralelo" (TCP frente a UDP)

- **Cuándo:** el concepto es una **diferencia** entre dos alternativas que se entiende viéndolas reaccionar al mismo escenario.
- **Estructura que funcionó:** el mismo escenario en dos paneles lado a lado (abrir, enviar, qué pasa si algo falla, resultado); título y subtítulo por panel; un **contador acumulado** (`8 mensajes` frente a `4 mensajes`) que vuelve tangible el costo de la garantía; una **nota corta** bajo cada panel y una leyenda común que dice el contraste.
- **Qué lo hace entendible:** (1) los dos paneles empiezan iguales y se separan en un paso concreto; (2) el panel que "no hace nada" en un paso lo muestra (sin banda, `msgs: []`, nota "No hay conexión: envía directo"); (3) el último paso resume cuándo conviene cada alternativa.
- **Parámetros típicos:** 2 paneles, 3 fases (abrir / enviar / resultado), 4 a 10 filas por panel, 1 interruptor (simular fallo). Más de 2 paneles se aprieta: usar otra estrategia (pestañas).
- **Cuidado:** los paneles tienen alturas distintas (cada uno según sus mensajes); es normal. El texto del SVG a media columna depende de que `width` sea ~384; no subirlo.

## Ficha del patrón "Diagrama de secuencia por fases" (el piloto)

- **Estructura que funcionó:** tres fases con pestañas (conectar, transferir, cerrar), una flecha por mensaje, chips de estado por actor, bandejas de piezas que se llenan al llegar el mensaje, interruptor para el caso de fallo.
- **Qué lo hace entendible:** las fases son pocas y se nombran con verbos; cada paso tiene una leyenda de una o dos frases; el caso de fallo es opcional y no estorba el recorrido principal.
- **Parámetros típicos:** 2 actores, 3 fases, 8 a 14 filas de mensajes. Más de ~14 filas pide dividir en dos piezas.
- **Extensiones que pidió el diseño y ya están en el kit:** `lost: true` (X roja), bandejas con `trayCount`, `affectsPhase` en los interruptores.
- **Para un protocolo nuevo** (por ejemplo login con JWT, OAuth): copiar `templates/piece/index.html`, cambiar actores, fases y `build()`. Si hacen falta más de 2 actores el motor ya los reparte a lo ancho; revisar que las etiquetas no se solapen.

## Ficha del patrón "Dos puertas en orden con salidas de error" (autenticación y autorización)

- **Cuándo:** el concepto son **dos controles encadenados** y el error común es confundirlos o no ver que el segundo depende del primero. El original mostraba toda la información a la vez (tarjetas densas, muchos colores sin significado, sin ejemplo).
- **Estructura que funcionó:** una fila `cliente → puerta 1 → puerta 2 → recurso`, **una salida de error por puerta** encima de ella (`HTTP 401`, `HTTP 403`, nodos `tone: 'err'`) y, debajo y en el centro, **el objeto que une las dos puertas** (`Authentication`): la puerta 1 lo **crea** y la puerta 2 lo **lee**. Eso hace visible que "primero va la autenticación y eso permite la autorización". Tres fases: *Dos preguntas* (sin movimiento), *Autenticación*, *Autorización*.
- **Qué lo hace entendible:** (a) **un solo ejemplo concreto** de principio a fin (ana intenta borrar al usuario 42, el mismo `DELETE` del capítulo); (b) los detalles que estaban amontonados (mecanismos: Basic, Form, JWT; roles frente a authorities; filtros HTTP frente a `@PreAuthorize`) pasan a un paso cada uno, **mostrados en el `sub` de la puerta** que cambia por paso; (c) **dos interruptores = tres desenlaces** (todo bien 200, contraseña incorrecta 401, sin rol ADMIN 403): el caso de fallo enseña por qué el orden importa (con 401 "la autorización ni se intenta"); (d) un solo color de fallo (naranja) y el vocabulario de color del kit: ningún color nuevo sin significado.
- **Cuidado:** si el interruptor de la primera puerta está activo, la fase 3 pasa a un solo paso que explica por qué no se llega. Probar las tres combinaciones.

## Ficha del patrón "Arquitectura densa recorrida por fases numeradas" (Spring Security)

- **Cuándo:** el diagrama original tiene muchas piezas y un flujo largo y el estudiante "no sabe qué paso va primero". Ya existe un diagrama de secuencia numerado en el capítulo: la pieza debe **coincidir con su numeración**.
- **Estructura que funcionó:** fase 1 *Las piezas* (6 pasos sin flechas: cada uno enfoca una pieza o un par y dice qué hace); fase 2 *Iniciar sesión* (pasos numerados 1 a 12); fase 3 *Petición autenticada* (13 a 17). Los títulos llevan el número (`8 · Compara la contraseña`) y `trail: 'phase'` deja solo las flechas de la fase.
- **Layout que funcionó (800 de ancho, 530 de alto):** tres columnas. Izquierda: cliente, almacén del resultado (`SecurityContextHolder`) y destino final (`DispatcherServlet`). Centro: el recuadro `outer` de la cadena de filtros con los filtros en vertical (el flujo baja). Derecha: el `AuthenticationManager` (`outer`) con su provider dentro, y arriba y abajo sus dos ayudantes (`UserDetailsService`, `PasswordEncoder`) con flechas verticales de ida y vuelta. Rótulos de dos líneas para nombres largos (`UsernamePassword` / `AuthenticationFilter`) y así las cajas caben en 172 unidades.
- **Verificación técnica antes de dibujar (5h):** el filtro de login responde la redirección (no el `AuthorizationFilter`); en la petición posterior el filtro de login "deja pasar" porque no es un POST a `/login`; el contexto se recupera de la sesión por la cookie. El diagrama original los mezclaba en una sola flecha "petición autorizada".

## Ficha del patrón "Simulador de app móvil" (setState en Flutter)

- **Cuándo:** el concepto es **qué pasa por dentro cuando el usuario toca una app** (estado, `setState`, controladores, formularios, listas) y el estudiante ya tiene el código del ejemplo. Un diagrama estático no puede mostrar que el dato y la pantalla **cambian en momentos distintos**; un teléfono que el estudiante toca, sí.
- **Estructura que funcionó (4 fases):** (1) *Estado y pantalla*: el dato y su reflejo; (2) *El camino*: un toque recorrido chip a chip (`Toque > Callback > setState > dirty > build() > Pantalla`) con el inspector y el árbol marcándose; (3) *El error clásico*: cambiar la variable **sin** `setState` (`block` en el chip de `setState`, la pantalla se queda atrás) y el "salto" cuando otro `setState` la despierta; (4) *Pruébalo tú*: el modo libre, donde el estudiante toca y ve el camino real.
- **Qué lo hace entendible:** (a) `stale: true` separa el **dato** (inspector) de la **pantalla** (teléfono): durante dos pasos el inspector dice 1 y el teléfono 0; (b) el árbol marca **qué se reconstruye** (subárbol del `State`), **qué se salta** (ancestros) y **qué se reutiliza** (`const`); (c) la consola de `debugPrint` coincide con la del experimento del capítulo; (d) escribir en un `TextField` **no** llama a `build()` y la pieza lo demuestra (la consola no cambia) en lugar de afirmarlo; (e) el panel de código resalta las líneas del paso y, en modo libre, las de la acción que corre.
- **Parámetros típicos:** 8 a 11 pasos, 4 fases, un teléfono de 360 a 440 px, 3 campos de `State` (más de 4 apilan el inspector), 6 a 9 filas de árbol. Fallback de alto del `<iframe>`: ~1000 px en pantalla ancha (en 360 px se apila y llega a ~1700 px).
- **Cuidado de contenido:** el código del panel es el del capítulo **sin estilos** (`InputDecoration`, `Container`...: lo importante es la lógica) y el mismo se ofrece en el capítulo como pestaña "Lo esencial"; las acciones del modo libre deben hacer **exactamente** lo que hace el código mostrado.

## Ficha del patrón "Código coloreado por responsabilidad" (agenda monolítica)

- **Cuándo:** un archivo con varias responsabilidades mezcladas ("más de 150 líneas") que el estudiante debe aprender a **separar**. El SVG original (un teléfono diminuto y una caja con cuatro filas) decía "alto acoplamiento" pero no mostraba **qué líneas** eran cuál responsabilidad.
- **Estructura:** `DK.anatomy` con `code: true` y `layout: 'stack'`; un color categórico por responsabilidad (datos, controladores, acciones, formulario, lista), una por paso, y un **último paso con `all: true`** que pinta todo a la vez y dice cómo se corta (cada color pasa a ser un archivo en el capítulo siguiente). El código va **resumido** (los estilos se reducen a `decoration: ...`) para que quepa en pantalla.
- **Cuidado:** los colores categóricos `p1` a `p5` deben ser distintos entre sí a simple vista (azul y violeta se confunden: no darlos a partes que se ven juntas).

## Ficha del patrón "Capas de identidad" (los tres árboles de Flutter)

- **Cuándo:** el concepto es **qué se reemplaza y qué se conserva** entre capas paralelas (Widget, Element, RenderObject). El original dibujaba tres columnas con una `W`, una `E` y una `R`: no decía qué es cada árbol ni qué cambia con `setState`.
- **Estructura que funcionó:** `DK.layers` con **un solo widget seguido por las tres capas** (el `Text` del contador), filas = árboles y columnas = `ContadorPage` (que no tiene RenderObject: se muestra como "Sin RenderObject") y el `Text`. Fase 1: qué es cada árbol (un paso por fila, foco en la cabecera de la fila). Fase 2: un `setState` con **identidades visibles** en el `sub` (`#a1` pasa a `#b7` en el Widget; `#e2` y `#r1` **siguen siendo los mismos**).
- **Qué lo hace entendible:** los números de identidad hacen visible lo que un texto solo afirma ("el Element se reutiliza"). El último paso resume qué cambió (el Widget, barato) y qué no (Element, State, RenderObject).

## Ficha del patrón "Contrato como toma y enchufe" (escena libre)

- **Cuándo:** el concepto es un **contrato** y varias cosas que lo cumplen (o no): polimorfismo, OCP, LSP, DIP, puertos y adaptadores, Pure Fabrication. Las cajas con una flecha "implementa" no muestran que **encajan**; una toma y un enchufe sí.
- **Estructura que funcionó:** la toma (`socket`) con el nombre del contrato y las operaciones en el `sub`; los enchufes (`plug` con `glyph`) esperando a un lado; el enchufe elegido **se acopla** con `at`, brilla en verde y los demás se atenúan. Para una interfaz con varios implementadores, una **regleta** (`draw`) con una toma libre: el canal nuevo es otro enchufe y el contador `archivos existentes que se modifican` queda en 0. Para LSP, cuatro **indicadores** (pastillas) del contrato que se encienden en rojo según la regla que rompe el subtipo (con un selector).
- **Qué lo hace entendible:** el estudiante **ve** que lo que cambia (el enchufe) no toca al cliente; el caso que rompe el contrato se ve como una pastilla roja y el cliente obligado a preguntar por el tipo.
- **Cuidado:** rótulo de la toma arriba y de los enchufes a la derecha; el sentido de los iconos importa (`socket` abre a la derecha, `plug` apunta a la izquierda; `rot: 180` los invierte).

## Ficha del patrón "Contraste con contador"

- **Cuándo:** la diferencia entre dos diseños es **cuántas cosas hay que tocar**. Un subtítulo diminuto que dice "modificado" no se lee; un contador y el color sí.
- **Estructura que funcionó:** las dos alternativas a la vez (cinta compartida frente a cápsulas con candado), una **onda** (`pulse`) que recorre la primera y se queda confinada en la segunda, una pastilla `5 de 5 modificados` en rojo y otra `1 de 4 modificado` en verde.
- **Parámetros típicos:** 2 fases, 4 a 9 pasos; dos o tres contadores como máximo; `state` por elemento (`err`, `ok`, `dim`).

## Ficha del patrón "Simulador con deslizador"

- **Cuándo:** un valor continuo decide el resultado y el **caso borde** es lo que se debe aprender (en 60,0 km/h exactos no hay alerta porque la regla es estrictamente mayor).
- **Estructura que funcionó:** tres fases (Arrange, Act, Assert), un velocímetro (`draw`) cuya aguja gira con `rot`, dobles en memoria con contadores (`repository.count() = 1`), y la leyenda del último paso que **cambia según el valor** (alerta, sin alerta, caso borde). El deslizador reconstruye los pasos sin mover el actual.
- **Cuidado:** `build(opts)` debe leer el valor numérico (`opts.speed`); probar los extremos y el valor exacto del umbral.

## Ficha del patrón "Árbol + selectores" (Zustand)

- **Cuándo:** el concepto es **quién se vuelve a renderizar** cuando cambia un estado que vive fuera del árbol (store global). El store no se dibuja como nodo (no es hijo de nadie); su efecto se cuenta con roles y pastillas.
- **Estructura que funcionó:** 8 nodos (5 hojas, ancho 1000), tres fases (sin selector, con selectores, varios valores). `use` (verde) = se renderiza con razón, `need` (naranja punteado) = render innecesario, `dim` = no se entera; cada hoja lleva una pastilla con su selector (`s.notifications.length`) o su resultado (`re-render`, `igual: sin render`).
- **Cuidado:** no usar `legend` con los roles `dirty`, `build` ni `reuse` fuera de Flutter: sus textos de leyenda dicen `build()` y `const: reutilizado`. Sin leyenda, las leyendas de cada paso nombran el color ("en naranja").

## Ficha del patrón "Pila de navegación" (Navigator de Flutter)

- **Cuándo:** el concepto es **qué le pasa a la pila de rutas** cuando se navega. Un teléfono solo no muestra lo que está debajo; la pila sola no muestra qué ve el usuario. Mitad y mitad (teléfono | pila) muestran causa y efecto a la vez.
- **Orden pedagógico que funcionó (capítulo de 3 piezas):** (1) concepto de pila sin navegación y sin código (`pila-vs-cola`: LIFO frente a FIFO); (2) navegación = apilar pantallas (`navegacion-pila`, DK.nav, sin código); (3) el código **al final**, por archivos (`pila-codigo`), con la estructura de carpetas. No mostrar un solo archivo con todo: confunde dónde vive cada cosa.
- **Variantes con `DK.player` + `DK.nav`:** un `select` de «Alternativa» (`push-remove-until`: A anti-patrón `pushNamed`, B `(route) => false`, C `route.isFirst`) con 8 líneas de código del mismo largo por variante para que el resaltado coincida.
- **Cuidado de contenido:** `isFirst` conserva la **primera** ruta de la pila; en `[Login, Home, ...]` conservaría Login, no Home. El estado inicial de cada variante debe ser el que la explicación necesita.

## Ficha del patrón "Pestañas frente a detalle" (NavigationBar de Flutter)

- **Cuándo:** el concepto es **qué mecanismo usar para moverse**: un índice con `setState` (horizontal) o una ruta nueva con `push` (jerárquico). La pila de rutas al lado del teléfono muestra que las pestañas no la tocan.
- **Orden (mismo que en pila de navegación):** (1) concepto de los dos movimientos con `tabs-vs-push` (teléfono mitad | pila mitad, y tres casos prácticos que reaccionan); (2) la anfitriona y `IndexedStack` con `bottom-nav-anfitriona` (State, páginas en memoria y el `body` en las dos variantes); (3) el código por archivos al final con `tabs-codigo` (`main.dart`, `screens/`, `pages/`).
- **Qué lo hace entendible:** el campo «Buscar» es la prueba visible de qué se conserva: con `IndexedStack` el texto sigue al volver; con la lista directa desaparece y la tarjeta de la página pasa a «destruida».
- **Cuidado de contenido:** las `Page` no llevan `Scaffold`; la anfitriona sí. No abrir pestañas con `pushNamed`.
