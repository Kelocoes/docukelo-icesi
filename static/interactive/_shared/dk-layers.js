// DOCS: .agents/skills/docusaurus_animated_diagrams/references/kit-api.md (API) y SKILL.md (proceso). Copia maestra unica del kit.
/* dk-layers.js: arquitectura recorrida. Muestra componentes anidados (un servidor que contiene un conector y un
 * contenedor, que a su vez contiene servlets...) y hace viajar mensajes entre ellos, paso a paso, resaltando la
 * pieza que se está explicando. Es una escena para DK.player. Requiere dk-kit.js, dk-icons.js y dk-flow.js.
 *
 *   scene: function (svg) {
 *     return DK.layers({
 *       svg: svg, width: 720, height: 400,
 *       nodes: [
 *         { id: 'tomcat',  kind: 'outer', label: 'Apache Tomcat', sub: 'servidor web', x: 200, y: 20,  w: 500, h: 360 },
 *         { id: 'catalina', kind: 'outer', label: 'Catalina', sub: 'contenedor de servlets', x: 390, y: 60, w: 300, h: 300 },
 *         { id: 'servlet', kind: 'box', label: 'HelloServlet', sub: '/hello-servlet', x: 410, y: 150, w: 260, h: 44 },
 *         { id: 'browser', kind: 'actor', icon: 'browser', label: 'Navegador', x: 10, y: 150, w: 110, h: 80 },
 *       ],
 *     });
 *   }
 *
 * Los nodos se dibujan en el orden del arreglo (primero los contenedores, después lo que va dentro).
 * kind: 'outer' (contenedor punteado), 'box' (componente), 'actor' (con icono, fuera del sistema).
 * Un paso:
 *   { phase, title, caption,
 *     focus: ['catalina'],                       // nodos que se resaltan en este paso
 *     msgs: [ { from: 'browser', to: 'coyote', label: 'GET', kind: 'data',
 *               path: [x1, y1, x2, y2] } ] }      // path explicito; si se omite, va de borde a borde entre los nodos
 * Los mensajes de pasos anteriores quedan dibujados y atenuados; solo se anima el del paso actual.
 * Opciones y campos extra:
 *   DK.layers({ ..., trail: 'phase' })     solo se dibujan las flechas de la fase actual (para pasos con muchas flechas)
 *   paso.sub = { servicio: 'repo = ?' }    cambia el texto secundario (sub) de un nodo desde ese paso; gana el ultimo
 *   DK.layers({ ..., labels: 'smart' })    etiquetas junto a la flecha (encima si es horizontal, a la derecha si no), no tapandola
 *   DK.layers({ ..., width: 800 })         figura mas ancha (hasta 732 px en pantalla): mas espacio para las flechas
 *   nodo.tone = 'err'                      nodo de error (borde del color de fallo): salida 401/403, rechazo
 *   nodo.icon = 'card'                     icono en la caja (ver dk-icons.js). Si h >= 70 va ARRIBA y el texto centrado debajo;
 *                                          si no, a la izquierda (iconPos: 'left' lo fuerza)
 */
DK.layers = function (o) {
  var S = DK.svg;
  var DUR = o.dur || 700, STAG = DUR * 0.85;
  var steps = [];
  var nodeEls = {}, byId = {}, subEls = {};
  var gNodes, gMsgs;
  var t = DK.timers();

  o.nodes.forEach(function (n) { byId[n.id] = n; });

  function build() {
    var svg = o.svg;
    svg.replaceChildren();
    svg.setAttribute('viewBox', '0 0 ' + o.width + ' ' + o.height);
    if (o.width > 640) svg.style.maxWidth = Math.min(o.width, 732) + 'px'; // figura ancha: aprovecha todo el ancho de la tarjeta
    gNodes = S('g'); gMsgs = S('g');
    o.nodes.forEach(function (n) {
      var g = S('g', { class: 'dk-node ' + (n.kind || 'box') + (n.tone ? ' tone-' + n.tone : ''), 'data-id': n.id });
      g.appendChild(S('rect', { x: n.x, y: n.y, width: n.w, height: n.h, rx: n.kind === 'outer' ? 14 : 10 }));
      if (n.kind === 'actor' && n.icon && DK.icons[n.icon]) {
        g.appendChild(DK.icons[n.icon]({ x: n.x + n.w / 2, y: n.y + 8 }));
        g.appendChild(S('text', { x: n.x + n.w / 2, y: n.y + n.h - 8, class: 'dk-nlabel mid', text: n.label }));
      } else if (n.kind === 'outer') {
        g.appendChild(S('text', { x: n.x + 14, y: n.y + 22, class: 'dk-nlabel', text: n.label }));
        if (n.sub) { subEls[n.id] = S('text', { x: n.x + 14, y: n.y + 38, class: 'dk-nsub', text: n.sub }); g.appendChild(subEls[n.id]); }
      } else if (n.icon && DK.icons[n.icon] && n.h >= 70 && n.iconPos !== 'left') {
        // caja con icono ARRIBA: ahorra ancho y da variedad visual (el rotulo y el sub quedan centrados debajo)
        var H = DK.icons.h[n.icon] || 38, sc = 26 / H;
        g.appendChild(DK.icons[n.icon]({ x: n.x + n.w / 2, y: n.y + 9, scale: sc }));
        g.appendChild(S('text', { x: n.x + n.w / 2, y: n.y + 52, class: 'dk-nlabel mid', text: n.label }));
        if (n.sub) { subEls[n.id] = S('text', { x: n.x + n.w / 2, y: n.y + 68, class: 'dk-nsub mid', text: n.sub }); g.appendChild(subEls[n.id]); }
      } else if (n.icon && DK.icons[n.icon]) {
        // caja con icono A LA IZQUIERDA (para cajas bajas)
        var H2 = DK.icons.h[n.icon] || 38, sc2 = 30 / H2;
        g.appendChild(DK.icons[n.icon]({ x: n.x + 32, y: n.y + n.h / 2 - 15, scale: sc2 }));
        g.appendChild(S('text', { x: n.x + 66, y: n.y + (n.sub ? n.h / 2 - 2 : n.h / 2 + 4), class: 'dk-nlabel', text: n.label }));
        if (n.sub) { subEls[n.id] = S('text', { x: n.x + 66, y: n.y + n.h / 2 + 14, class: 'dk-nsub', text: n.sub }); g.appendChild(subEls[n.id]); }
      } else {
        g.appendChild(S('text', { x: n.x + n.w / 2, y: n.y + (n.sub ? n.h / 2 - 2 : n.h / 2 + 4), class: 'dk-nlabel mid', text: n.label }));
        if (n.sub) { subEls[n.id] = S('text', { x: n.x + n.w / 2, y: n.y + n.h / 2 + 14, class: 'dk-nsub mid', text: n.sub }); g.appendChild(subEls[n.id]); }
      }
      nodeEls[n.id] = g;
      gNodes.appendChild(g);
    });
    svg.append(gNodes, gMsgs);
  }

  // punto donde el segmento centro-centro sale del rectangulo a (con un margen)
  function edge(a, b) {
    var ca = { x: a.x + a.w / 2, y: a.y + a.h / 2 }, cb = { x: b.x + b.w / 2, y: b.y + b.h / 2 };
    var dx = cb.x - ca.x, dy = cb.y - ca.y, len = Math.sqrt(dx * dx + dy * dy) || 1;
    var tx = dx ? (a.w / 2) / Math.abs(dx) : Infinity, ty = dy ? (a.h / 2) / Math.abs(dy) : Infinity;
    var k = Math.min(tx, ty);
    return { x: ca.x + dx * k + (dx / len) * 4, y: ca.y + dy * k + (dy / len) * 4 };
  }
  function route(m) {
    if (m.path) return { x1: m.path[0], y1: m.path[1], x2: m.path[2], y2: m.path[3] };
    var a = byId[m.from], b = byId[m.to], p1 = edge(a, b), p2 = edge(b, a);
    return { x1: p1.x, y1: p1.y, x2: p2.x, y2: p2.y };
  }

  // labels: 'smart' coloca la etiqueta junto a la flecha y no encima: sobre las horizontales, a la derecha en las verticales
  // y diagonales. Asi la flecha se ve completa. Por defecto ('inline') la etiqueta va sobre la linea (comportamiento antiguo).
  var horizontal = function (r) { return Math.abs(r.x2 - r.x1) >= Math.abs(r.y2 - r.y1) * 2; };
  var smartDy = function (r) { return o.labels === 'smart' && horizontal(r) ? -8 : undefined; };
  var smartSide = function (r) { return o.labels === 'smart' && !horizontal(r) ? 'right' : undefined; };

  function setSteps(list) { steps = list; build(); }

  function render(i, animate) {
    t.clear();
    gMsgs.replaceChildren();
    var step = steps[i];
    for (var s = 0; s <= i; s++) {
      // trail: 'phase' = solo se dibujan las flechas de la fase actual (los pasos viejos no ensucian el diagrama)
      if (o.trail === 'phase' && steps[s].phase !== step.phase) continue;
      steps[s].msgs.forEach(function (m, k) {
        var r = route(m), live = s === i && animate, current = s === i;
        DK.flow.arrow(gMsgs, {
          x1: r.x1, y1: r.y1, x2: r.x2, y2: r.y2, kind: m.kind, label: m.label, lost: m.lost, piece: m.piece,
          labelAt: m.labelAt, labelDy: m.labelDy !== undefined ? m.labelDy : smartDy(r), labelSide: m.labelSide || smartSide(r),
          animate: live, delay: live ? k * STAG : 0, dur: DUR, dim: !current,
        });
      });
    }
    // sub: el texto secundario de un nodo puede cambiar con los pasos (ej. 'repo = ?' -> 'repo = repoBean'); gana el ultimo
    var texts = {};
    for (var q = 0; q <= i; q++) { var sb = steps[q].sub || {}; for (var id in sb) texts[id] = sb[id]; }
    Object.keys(subEls).forEach(function (id) { subEls[id].textContent = texts[id] !== undefined ? texts[id] : byId[id].sub; });
    var focus = (step && step.focus) || [];
    Object.keys(nodeEls).forEach(function (id) { nodeEls[id].classList.toggle('on', focus.indexOf(id) >= 0); });
    return { animMs: step && animate ? step.msgs.length * STAG + 120 : 0 };
  }

  return { setSteps: setSteps, render: render, msgDuration: STAG };
};
