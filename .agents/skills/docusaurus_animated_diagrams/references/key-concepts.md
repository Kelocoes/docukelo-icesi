# Conceptos clave para hacer gráficos que enseñan

Destilados del piloto "TCP en acción" y del análisis de las piezas de la sesión 6 del profesor Domi. Léelos antes de decidir qué dibujar. Cuando una pieza nueva enseñe algo que no esté aquí, agrégalo.

## 1. Primero la pregunta, después el dibujo

Antes de tocar código responde por escrito: ¿qué debe poder **explicar** el estudiante después de verlo?, ¿qué malentendido evita?, ¿qué NO hace falta mostrar? El brief del visor tiene esos campos. Un gráfico que se ve bien pero no responde la pregunta del capítulo es decoración (así era `TCP.webp`: bonito, pero no mostraba ACK, pérdida ni handshake, que es lo que el texto afirmaba).

## 2. Mostrar lo que el texto afirma

Lee el texto que rodea al gráfico (el visor muestra el antes y el después) y haz una lista de las afirmaciones. Cada una debería tener algo visible en el gráfico. Si el texto dice "confirma la entrega", debe verse la confirmación.

## 3. Elegir el nivel por lo que enseña

| Si lo que se enseña es... | Nivel |
|---|---|
| Estructura o comparación, sin tiempo | N0: SVG estático bien compuesto |
| Una historia o secuencia | N1: SVG que se anima solo, o N2: paso a paso |
| Algo que se entiende provocándolo (estado, fallos, parámetros) | N3: pieza interactiva |

El nivel más alto no es el mejor: un N3 innecesario cansa. Sube de nivel solo cuando el movimiento o la interacción **explican** algo.

## 4. El profesor define el alcance; no inventar profundidad

El piloto empezó como un simulador de pérdida y retransmisión de paquetes; el profesor aclaró que querían recordar **las fases** "sin entrar tanto en el detalle". Lección: el detalle técnico va como **opcional** (en el piloto, un interruptor), no en el recorrido principal. Ante la duda sobre el nivel de detalle, hacer el recorrido corto y dejar el detalle detrás de un control.

## 5. Principios de diseño pedagógico

- **Una idea por paso**, con leyenda corta que diga qué se ve y por qué importa.
- **El estudiante provoca el cambio** (clic, interruptor) y ve causa y efecto juntos. Es lo que hace buenas las piezas de Domi.
- **La historia queda dibujada**: los pasos anteriores permanecen, así el estudiante ve la secuencia completa al final.
- **Fases visibles**: bandas con nombre y pestañas para saltar entre ellas. Sirve para recordar el orden.
- **Estado visible**: chips que cambian ("Conectando" → "Conectado") enseñan el estado de cada lado sin texto largo.
- **Conservar la metáfora que el curso ya usa** (las piezas de rompecabezas del gráfico original) en vez de inventar otra.
- **Siempre se puede volver** (Anterior, Reiniciar) y **siempre hay un estado inicial** ("Antes de empezar").
- **Sin emojis**; textos en español con términos técnicos en inglés (SYN, ACK, handshake).
- Cada pieza va con el texto del capítulo alrededor: la pieza no reemplaza la explicación escrita, la acompaña.

## 5b. Comparar: lo que no pasa también enseña

Cuando el concepto es una diferencia entre dos cosas (TCP/UDP), mostrar las dos reaccionando al **mismo escenario** y hacer visible el costo o la garantía con un número concreto (un contador de mensajes) en vez de solo una frase. El profesor pidió "la diferencia en forma abstracta": un contador y una nota corta por lado funcionan mejor que un párrafo. Lo que un lado NO hace (UDP no abre conexión, no reenvía) debe verse como ausencia (sin flechas, nota explícita), no omitirse.

## 5c. Conectar el diagrama con el código

Cuando el concepto es sobre código (ciclo de vida, métodos), mostrar **el código real del capítulo** junto al diagrama y resaltar, en cada paso, la línea que se ejecuta. El estudiante deja de memorizar "init() se llama una vez" y ve *qué* hace esa línea y *cuándo*. Reglas: el código es el del capítulo (no uno nuevo), el resaltado sigue al paso (nunca más de unas pocas líneas), y el panel se desplaza solo para que la línea activa esté siempre a la vista.

## 5h. Verificar quién entrega qué antes de dibujar la flecha

Una flecha afirma algo técnico: "A le entrega esto a B". Antes de dibujarla, comprobar en el framework **quién realmente lo hace**. Ejemplo real: en la primera versión del flujo de Thymeleaf el HTML salía del motor directo al navegador; el profesor lo corrigió: el motor escribe el HTML en la respuesta y la entrega el **DispatcherServlet** (que además es quien invoca al controlador y recibe de vuelta el nombre de la vista). Preguntas de control: ¿quién invoca a quién?, ¿quién devuelve el resultado?, ¿qué componente toca la respuesta final? Si el capítulo no menciona un componente que interviene (el DispatcherServlet), **agregarlo y avisar al profesor**: el diagrama no puede contradecir al framework, aunque el texto original lo simplificara.

## 5i. Variedad visual: un icono distinto por rol

Si todos los componentes son rectángulos con texto, las piezas se parecen entre sí y el estudiante no distingue un servicio de una base de datos. Usar **un icono por rol** y reservarlo (servidor, clase `{ }`, base de datos, engranaje = proceso o motor, archivo `</>` = plantilla, bolsa = Model, tarjeta = cuenta), de modo que el mismo icono signifique lo mismo en todo el curso. Que los iconos vengan de `dk-icons.js` (nunca dibujados a mano en la pieza). Para piezas de dominio nuevo (por ejemplo cuentas bancarias), agregar el icono al kit en lugar de reutilizar uno que signifique otra cosa.

## 5j. Código: el color enseña el rol de cada palabra

En un panel de código, un solo color obliga al estudiante a adivinar qué es una clase, un método o un objeto. Colorear por **rol** (clase, método, objeto o variable, palabra clave, texto, comentario) y poner una **leyenda** en la cabecera. Es una ayuda de lectura, no decoración: el profesor lo pidió explícitamente.

## 5f. Un interruptor por cada decisión que cambia el resultado

Si el concepto depende de decisiones ("¿hay transacción?", "¿ocurre un fallo?"), da **un interruptor por decisión** y deja que el estudiante recorra todas las combinaciones. Las combinaciones cuentan historias distintas (commit, rollback, "salió bien por suerte", inconsistencia) y el caso donde algo sale mal sin protección es el que más enseña. Reglas: los valores por defecto son el camino feliz; el interruptor dice la acción ("Quitar @Transactional", "Simular un fallo"), no el estado; al cambiarlo, la pieza vuelve al paso donde esa decisión importa, no al principio.

## 5g. Magnitudes reales cuando el concepto es "a escala"

Para conceptos de escala (paginación, caché, índices), muestra un **medidor con números del orden real** (1.450.000 filas frente a 10) y no solo la tabla pequeña del ejemplo. La tabla de 23 filas enseña el mecanismo; el medidor enseña por qué importa.

## 5e. Enfocar una cosa a la vez

Cuando se explica una estructura con varias partes, mostrar **todo el objeto** y enfocar **una parte por paso**, atenuando el resto (no ocultándolo): el estudiante ve siempre dónde está la parte dentro del conjunto. Cada parte lleva un color propio y su explicación usa ese mismo color. Usar el objeto **real** (texto copiable), no una captura: una imagen etiquetada de baja resolución (como el diagrama original de MDN, 286×176 px) no se puede ampliar, traducir ni adaptar al tema.

## 5d. Presentar las piezas antes de moverlas

En una arquitectura, el primer paso no debe mover nada: resaltar y nombrar cada pieza ("Coyote: el conector HTTP"), y recién después hacer viajar la solicitud. Un recorrido que arranca con flechas sobre cajas desconocidas obliga al estudiante a adivinar.

## 5k. Un diagrama denso se rediseña repartiendo, no recortando

Cuando el profesor dice "es valioso pero es demasiado de golpe", **no se borra información**: se reparte en tres sitios. Lo **estructural** (qué contiene a qué) queda en el dibujo con rótulos cortos; lo **explicativo** pasa a la leyenda de un paso cada uno (una idea por paso); lo **temporal** (qué va primero) pasa a flechas animadas y a **títulos numerados** que coinciden con el diagrama de secuencia del capítulo. Presentar las piezas antes de moverlas (5d) y dejar el detalle opcional detrás de interruptores (punto 4).

## 5l. Los colores del original no se heredan

Un diagrama original con muchos colores (azul, morado, naranja, verde) "sin que se sepa si significan cosas nuevas" se rehace con el vocabulario del kit (control, confirmación, datos, fallo). Un color nuevo solo se justifica si es un **rol** nuevo. Un fallo siempre usa `--dk-err` (naranja), también en los nodos de error (`tone: 'err'`).

## 5m. Un ejemplo concreto de principio a fin

Una definición ("la autenticación verifica la identidad") se entiende más rápido con una persona haciendo algo concreto (ana intenta borrar al usuario 42). Elegir **un** ejemplo del capítulo, nombrarlo en el primer paso y no cambiarlo: todas las etiquetas, estados (`ana · ROLE_ADMIN`) y desenlaces hablan de él.

## 5n. Separar el dato de la pantalla

Cuando el concepto es "cambiar el estado", lo difícil para el estudiante es que **el dato y la pantalla no cambian a la vez**. Mostrar los dos por separado (inspector del `State` y teléfono) durante uno o dos pasos (`stale: true`): el dato ya vale 1 y la pantalla sigue en 0. Eso hace entendible `setState` mejor que cualquier definición, y hace visible el error clásico (cambiar la variable sin avisar).

## 5o. El estudiante toca, la pieza demuestra

Si el capítulo afirma algo que se puede comprobar ("escribir en un `TextField` no reconstruye la página", "sin `setState` la pantalla no cambia"), la pieza lo **demuestra** en el modo libre (la consola no cambia, el camino se corta en `setState`) y no solo lo cuenta. Un recorrido guiado primero, el modo libre al final: el estudiante ya sabe qué mirar.

## 5p. Lo importante a la vista, lo accesorio fuera

Un ejemplo de 120 líneas donde 60 son estilos esconde la lógica. Ofrecer el código en tres vistas (simulador, **lo esencial** sin decoraciones, completo con estilos) y dejar en la pieza solo lo esencial. Lo mismo para diagramas: lo que no enseña el concepto (un `InputDecoration`) sobra.

## 5q. Una metáfora física por concepto, no la misma caja

Si todo es una tarjeta con un icono pequeño y una flecha, el estudiante no distingue un contrato de una clase ni una dependencia de una llamada. Elegir una **metáfora física** para el concepto (toma y enchufe, cinta frente a cápsulas, maraña de hilos, carriles, anillo de cohesión, Venn) y **reutilizarla** en todo el capítulo para que signifique lo mismo cada vez. Escena libre: `DK.canvas`.

## 5r. Contar en vez de decir

El estado se ve (color, forma, contorno punteado, onda) y la diferencia se **cuenta** (`5 de 5 modificados` frente a `1 de 4`, `dependencias concretas: 2` frente a `0`, `clientes que se recompilan: 3 de 3` frente a `1 de 3`). Un subtítulo de 10 px que dice "modificado" no enseña.

## 5s. Un color por actor en todo el capítulo

Cuando hay actores (COO, CFO, CTO o auditor), darles un color fijo y usarlo en cada figura (`c: 'p1' | 'p3' | 'p5'`): el estudiante deja de leer etiquetas para saber quién pide qué. Los estados `err` y `ok` siguen ganando al color del actor.

## 5t. Un selector evita diez piezas

Si el concepto se aplica a muchos casos (diez situaciones de diseño, cuatro reglas rotas), **una pieza con un selector** enseña más que una pieza por caso: el estudiante elige, la pieza responde igual, y compara. Un **deslizador** hace tangible un parámetro continuo y su caso borde.

## 6. Color con rol, no con nombre

Control, confirmación, datos y fallo tienen un color fijo en todo el kit (`--dk-ctl`, `--dk-ack`, `--dk-data`, `--dk-err`). El estudiante aprende el vocabulario visual una vez y lo reconoce en todas las piezas. Nunca usar un hex suelto; así el tema oscuro funciona sin trabajo extra.

## 7. Tema claro y oscuro: obligatorio

El sitio cambia de tema con su propio botón (`data-theme` en `<html>`), no con el sistema. Las piezas en iframe leen ese atributo (`dk-theme.js`). Los SVG dentro de `<img>` no pueden, por eso se entregan en dos variantes. Verificar siempre ambos modos con una captura.

## 8. Cómo se integra en el sitio, sin tocar el sitio

HTML autocontenido en `static/interactive/<curso>/<semana>/<slug>/index.html`, invocado con un `<iframe>` normal dentro del `.md`. Se prefiere `<iframe>` y no `IframeWindow` (alto fijo de 300 px y marco de navegador). El alto lo ajusta la pieza sola (`DK.autoHeight`). Escribir el HTML en `candidates/` primero, compararlo en el visor y solo integrarlo con la aprobación del profesor.

## 9. Probar como lo vería un estudiante

Probar en el sitio real, no solo en el visor: recorrer todos los pasos, activar cada interruptor, cambiar de tema, mirar el espacio con el texto de arriba y de abajo. Los bugs reales del piloto aparecieron así (ver `lessons-learned.md`).
