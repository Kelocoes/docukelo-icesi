// DOCS: .agents/skills/docusaurus_animated_diagrams/references/kit-api.md (API) y SKILL.md (proceso). Copia maestra unica del kit.
/* dk-flow.js: dibuja una flecha animada entre dos puntos, con su paquete que viaja. Es la pieza común de
 * dk-sequence.js (diagramas de secuencia) y dk-layers.js (arquitecturas recorridas); úsala directamente si una
 * escena nueva necesita mostrar "algo que viaja de A a B".  Requiere dk-kit.js y dk-icons.js.
 *
 *   DK.flow.arrow(capaSvg, {
 *     x1, y1, x2, y2,
 *     kind: 'ctl' | 'ack' | 'data' | 'err',   // color por rol (ver dk-base.css); 'err' = fallo que SÍ llega (401, 403)
 *     label: 'SYN',
 *     lost: true,                     // la flecha se corta al 55 % con una X roja
 *     piece: 3,                       // numero de la pieza que viaja (kind 'data')
 *     labelAt: 0.5, labelDy: 4,       // posicion de la etiqueta sobre la flecha (0..1) y desplazamiento vertical
 *                                     (labelDy negativo = encima de la flecha)
 *     labelSide: 'right',             // etiqueta a la derecha de la flecha (flechas verticales o diagonales)
 *     animate: true, delay: 0, dur: 700,
 *     dim: true,                      // dibujada pero atenuada (mensajes de pasos anteriores)
 *   });
 */
DK.flow = (function () {
  var S = DK.svg;

  function arrow(layer, o) {
    var f = o.lost ? 0.55 : 1;
    var xe = o.x1 + (o.x2 - o.x1) * f, ye = o.y1 + (o.y2 - o.y1) * f;
    var ang = Math.atan2(o.y2 - o.y1, o.x2 - o.x1) * 180 / Math.PI;
    var lt = o.labelAt != null ? o.labelAt : (o.lost ? 0.3 : 0.5);
    var dy = o.labelDy != null ? o.labelDy : 4;
    var dur = o.dur || 700, delay = o.delay || 0;

    var line = S('line', { x1: o.x1, y1: o.y1, x2: xe, y2: ye, class: 'dk-ln ' + o.kind + (o.lost ? ' lost' : ''), pathLength: 1 });
    var head = o.lost ? null : S('path', { d: 'M0,0 L-9,-4.5 L-9,4.5 Z', class: 'dk-head ' + o.kind, transform: 'translate(' + xe + ',' + ye + ') rotate(' + ang + ')' });
    var side = o.labelSide; // 'right' | 'left': etiqueta al lado de la flecha (flechas verticales o diagonales)
    var shift = side === 'right' ? 8 : side === 'left' ? -8 : 0;
    var lbl = o.label ? S('text', { x: o.x1 + (o.x2 - o.x1) * lt + shift, y: o.y1 + (o.y2 - o.y1) * lt + dy, class: 'dk-lbl' + (o.lost || o.kind === 'err' ? ' lost' : '') + (side === 'right' ? ' start' : side === 'left' ? ' end' : ''), text: o.label }) : null;
    var xmark = o.lost ? S('g', { transform: 'translate(' + xe + ',' + ye + ')' }, DK.icons.cross(12)) : null;
    [line, head, lbl, xmark].forEach(function (n) { if (n) { layer.append(n); if (o.dim) n.style.opacity = 0.4; } });
    if (!o.animate) return;

    var opts = function () { return { duration: dur, delay: delay, fill: 'both', easing: 'ease-in-out' }; };
    line.style.strokeDasharray = 1;
    line.animate([{ strokeDashoffset: 1 }, { strokeDashoffset: 0 }], opts());
    if (lbl) lbl.animate([{ opacity: 0 }, { opacity: 1 }], { duration: 250, delay: delay, fill: 'both' });
    var after = { duration: 160, delay: delay + dur - 40, fill: 'both' };
    if (head) head.animate([{ opacity: 0 }, { opacity: 1 }], after);
    if (xmark) xmark.animate([{ opacity: 0, transform: 'translate(' + xe + 'px,' + ye + 'px) scale(.3)' }, { opacity: 1, transform: 'translate(' + xe + 'px,' + ye + 'px) scale(1)' }], after);

    var pk = o.kind === 'data' && o.piece ? DK.icons.piece(o.piece, 18) : S('circle', { r: 6, class: 'dk-pk-' + o.kind });
    pk.style.opacity = 0;
    layer.append(pk);
    pk.animate([
      { transform: 'translate(' + o.x1 + 'px,' + o.y1 + 'px)', opacity: 1, offset: 0 },
      { transform: 'translate(' + xe + 'px,' + ye + 'px)', opacity: 1, offset: 0.92 },
      { transform: 'translate(' + xe + 'px,' + ye + 'px)', opacity: 0, offset: 1 },
    ], opts());
  }

  return { arrow: arrow };
})();
