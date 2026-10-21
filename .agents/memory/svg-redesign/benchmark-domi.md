# Benchmark: figuras del profesor Domi

Fuente: `https://github.com/DomicianoRincon/SeminarioSoftware` (clonado en `temp/seminario-software/`). Es la referencia de calidad pedida por el profesor. Las 85 figuras de sus lecciones estan cargadas en el visor bajo el curso "Referencia: Prof. Domi".

## Estado de este analisis

Parcial. Hecho a partir de su `CLAUDE.md`, de metricas automaticas y de abrir en el visor los bloques interactivos de la sesion 6 (clon actualizado el 2026-10-17, commit f266770). Falta la revision visual figura por figura con el profesor.

## Hallazgo importante: lo "animado" es la sesion 6, y no son SVG

Las figuras SVG de sus lecciones son estaticas (0 de 85 con SMIL o CSS keyframes). Lo que el profesor señalo como referencia (**Sesion 6, Stateful widget**) son bloques ` ```interactive ` que montan **simuladores en JavaScript plano**:

- Codigo: `temp/seminario-software/classnotesapp/src/components/interactive/flutterStateSims.js` (1.545 lineas), con `InteractiveBlock.jsx` (35 lineas) como puente a React.
- Contrato: cada simulador es `mount(nodo, opciones) -> destroy`, sin React ni imports, para poder copiar el mismo archivo a la presentacion de la sesion. En la leccion se escribe `interactive` + id + opciones (ej. `state-tree forget`).
- Simuladores: `state-tree` (arbol de widgets o codigo alternables, bloque *Estado* unido por lineas a lo que lee cada variable, cada toque animado en 5 pasos con modo *Paso a paso*), `hot-reload`, `state-lifecycle` (initState, dispose, `setState() called after dispose()`), `playlist` y `playlist cards`.
- Las 6 instancias estan en `lessonS40` a `lessonS44` y se pueden ejecutar en vivo en el visor (curso "Referencia: Prof. Domi", tipo Interactivo).
- Reglas de convivencia con la app: todo selector CSS prefijado con `.fsim`, tarjeta clara fija `#FBFBFD` que no sigue el tema, textos en español y codigo en ingles.

Que lo hace efectivo pedagogicamente (a confirmar con el profesor): el estudiante **provoca** el cambio (toca +, escribe) y ve en el mismo cuadro **la causa y el efecto** (el estado, el arbol y la pantalla), y puede ir **paso a paso**. Es el patron a replicar: "lo que se entiende tocando va en un diagrama interactivo, no en una figura".

Implicacion para DocuKelo: hoy los graficos son archivos `.svg`/`.png`. Para esto hace falta un tipo nuevo de elemento (componente MDX global o HTML autocontenido en `static/`), tema por definir en `quality-criteria.md`.

## Que hace bien (extraido de su CLAUDE.md y de los datos)

- **Generadas por script, no a mano.** `tools/console_frame.py`, `tools/code_frame.py` y `tools/sesion2_figuras.py` fijan el estilo. Una figura se cambia editando el script y reinyectando; asi el estilo es consistente en todo el curso.
- **Tres tipos reconocibles:** piezas (componentes y conexiones), pasos con maqueta de la interfaz (con recuadro donde se hace clic), y frames de consola o de editor de codigo con flechas anotadas.
- **Rejilla de 8 px y composicion fija:** `viewBox="0 0 960 …"`, `width="100%"`, `max-width:960px`, tarjeta de fondo claro `#FBFBFD` con `rx=16`.
- **Anotacion con proposito:** maximo 3 recuadros numerados en consola y 4 flechas en codigo; cada flecha con su color, y recuadro, flecha y lo señalado comparten color. Las flechas no se cruzan. Cada numero tiene su tarjeta explicativa.
- **Texto legible:** minimo 12 px, textos en español, comandos y mensajes de pantalla tal como aparecen. `textLength` en cada linea de codigo para que el resaltado caiga bien con cualquier fuente.
- **Aislamiento:** `id` unico en la raiz, todos los selectores CSS prefijados con ese id, ids de `marker/filter/title/desc` con el mismo prefijo, para que dos figuras en la misma pagina no se pisen.
- **Siempre texto copiable al lado:** la figura de consola o codigo va con su bloque de codigo real debajo.
- **Fondo claro fijo, sin `prefers-color-scheme`:** decision propia de su visor (el tema lo cambia un boton, no el sistema). **DocuKelo no puede copiar esto tal cual**: ver `quality-criteria.md`.

## Que NO copiar / diferencias con DocuKelo

- Su visor inyecta el SVG en el DOM; DocuKelo carga SVG como archivos con `![](/img/...)`, que se aislan solos pero no heredan el CSS del sitio.
- Paleta distinta (azules suaves y verdes menta) a la de marca Icesi 2026 (`brand-guidelines-icesi-2026.md`).

## Pendiente

- Revisar sus presentaciones HTML (`presentaciones/sesion1` a `sesion5`; la 6 solo tiene `plan.md`) y ver si reutilizan los mismos simuladores.
- Revisar las 9 figuras SVG de `tools/sesion6_figuras.py` (lecciones S40 a S45).
- Elegir 5 a 8 figuras suyas como "estandar de oro" y marcarlas `aprobado` en el visor para citarlas desde las skills.
