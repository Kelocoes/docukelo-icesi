# Integrar una pieza aprobada en un capítulo (checklist, delegable)

Úsalo cuando el profesor marcó un gráfico como `hecho` en el visor y la pieza todavía vive en `candidates/`. Es una tarea **mecánica y acotada**: se puede delegar a otro agente (subagente, Gemini, Kimi...) dándole este archivo y la lista de piezas. Ya se hizo así con un subagente (piezas de semana 2) y funcionó.

## Cómo saber qué falta integrar

Cruza `reviews.json` (estado `hecho`) con los manifiestos `candidates/static/img/<curso>/<nombre>.candidate.json`: una pieza está **pendiente** si su estado es `hecho` y la carpeta `finalPath` del manifiesto **no existe** en `static/`. El manifiesto trae `interactive` (origen), `finalPath` (destino) y `embed` (el `<iframe>`). El `.md` donde reemplazar está en `inventory.json` (`refs[0].doc` y `.line`) o en el visor, panel "Dónde se usa".

## Pasos por pieza

1. Copiar **solo** el `index.html` de la carpeta del candidato a `finalPath` (el kit NO se copia: es la copia maestra `static/interactive/_shared/`).
2. En el `.md`, reemplazar el bloque de la imagen (a veces envuelto en un `<div>`) por: una frase corta de introducción que invite a recorrer el diagrama (español natural, sin emojis) y el `<iframe>` con este formato exacto:
   ```mdx
   <iframe
     src="/interactive/<curso>/<semana>/<slug>/index.html"
     title="<título accesible descriptivo>"
     style={{ width: '100%', height: 700, border: 0 }}
     loading="lazy"
   />
   ```
   El alto es solo un valor de respaldo (la pieza ajusta el suyo con `DK.autoHeight`). No uses `IframeWindow`. **Si la pieza es compleja** (varios paneles, código al lado de la figura, más de ~700 px), usa `<InteractiveFrame src="..." title="..." height={780} />` en lugar del `<iframe>`: es el mismo bloque, pero con el botón "Pantalla completa" (ver `kit-api.md`). No borres la imagen original de `static/img/` (queda de respaldo). No toques el resto del documento.
3. Verificar en el sitio real (ver abajo) y revisar una captura.
4. Actualizar el estado del gráfico en el visor si corresponde y anotarlo en `.agents/memory/svg-redesign/README.md`.

## Verificación (lo que hay que probar de verdad)

- Servidor de los docs en español: `npx docusaurus start --port 3001 --locale es --no-open` (el del puerto 3000 sirve `en`). Ruta del capítulo: se quita el prefijo numérico del archivo (`03-contenedor-ioc-y-beans-xml.md` → `/docs/computacion-2/semana-2/contenedor-ioc-y-beans-xml`).
- Los iframes son `loading="lazy"`: **haz `scrollIntoView` del iframe y espera ~1,5 s antes de inspeccionarlo**, o tu prueba "no lo encuentra" en falso.
- Desde la página: `const d = iframe.contentDocument; const next = d.querySelectorAll('.dk-btns button')[1];` y pulsa Siguiente hasta que quede deshabilitado (~1,8 s de espera en pasos con flechas). Comprueba pasos recorridos, título final (`.dk-cap h3`), alto del iframe y ausencia de errores de JavaScript. Si la pieza tiene interruptores (`.dk-toggle input`), actívalos y recorre otra vez.
- Si usaste `<InteractiveFrame>`: pulsa "Pantalla completa" (arriba a la derecha de la pieza), comprueba que el diálogo abre y que cierra con Esc y con "Cerrar", y que el contenido llena el espacio sin barras de desplazamiento sobrantes. El iframe del diálogo se crea al abrir: búscalo con `document.querySelector('dialog iframe')`.
- Probar también el tema oscuro (botón de tema del sitio): la pieza debe seguirlo.
- Un script que registra errores solo ve los que ocurren **después** de instalarse; no captura la carga inicial.

## Restricciones al delegar

Dile al agente que **solo** puede crear/editar el `.md` y las carpetas nuevas bajo `static/interactive/`; que NO toque `_shared/`, `.agents/`, `temp/` ni `reviews.json`; que NO haga commit ni `npm run build`; y que reporte archivos cambiados, la frase de introducción, y el resultado de la verificación. **Verifica tú el reporte** (comparar con `cmp` la copia contra el candidato, `grep` del iframe en el `.md`, y `git status` para confirmar que solo cambió lo esperado) antes de darlo por bueno.
