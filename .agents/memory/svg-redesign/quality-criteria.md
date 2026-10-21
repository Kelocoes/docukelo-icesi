# Criterios de calidad de graficos (BORRADOR)

Borrador inicial; se refina con los comentarios de `reviews.json` y con el benchmark. Cuando este estable, pasa a ser la base de las skills reescritas.

## Proceso que debe seguir un agente antes de dibujar

1. **Leer el capitulo completo** (y el anterior), no solo el parrafo junto al grafico.
2. **Nombrar el concepto** que el estudiante debe entender y el error comun que se quiere evitar.
3. **Elegir el formato por lo que enseña**, no por habito:
   - Estructura o componentes: SVG estatico limpio.
   - Flujo en el tiempo (request/response, ciclo de vida): SVG animado o HTML paso a paso.
   - Comparacion antes/despues: dos paneles o interruptor.
   - Procedimiento con interfaz o consola: maqueta o frame con recuadros numerados (estilo Domi).
   - Algo que el estudiante deberia probar: HTML interactivo.
4. **Justificar la eleccion en una frase** y proponer el brief al profesor antes de producir lotes.

## Reglas tecnicas (proyecto)

- Tema claro y oscuro: el sitio cambia de tema con su selector, no con el sistema. Verificar la figura en ambos (el visor lo permite). Preferir fondo propio de tarjeta o colores que funcionen en los dos.
- Espaciado en rejilla de 8 px; margenes internos constantes; `viewBox` siempre presente.
- Texto minimo 12 px efectivo al ancho de Docusaurus (~800 px); probar a 360 px.
- Paleta de marca: `brand-guidelines-icesi-2026.md`.
- Sin emojis. Textos en espanol; terminos tecnicos en ingles.
- Animacion con proposito: cada movimiento revela un orden o una causa. Respetar `prefers-reduced-motion`. Debe poder reiniciarse y tener un estado final legible si no se anima.
- Cada grafico va seguido de su explicacion por componente (regla de `docusaurus_content_researcher`).
- Archivos en `static/img/<curso>/`, nombre en kebab-case que describa el concepto.

## Por definir con el profesor (resolver durante la revision)

- Formato de animacion preferido: SVG con SMIL/CSS (funciona en `<img>`) frente a HTML/React embebido (mas potente, mas pesado).
- Nivel de interactividad aceptable en una pagina de documentacion.
- Que hacer con los PNG/JPG: capturas reales de pantalla se quedan; esquemas dibujados se rehacen como SVG.
- Si los Mermaid se mantienen (editables y ligeros) o se reemplazan por SVG propios en los capitulos clave.
