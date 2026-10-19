// DOCS: .agents/skills/docusaurus_animated_diagrams/references/kit-api.md (API) y SKILL.md (proceso). Copia maestra unica del kit.
/* dk-tree.js: arbol de componentes + estado. Dibuja una jerarquia real (nodos unidos por ramas, raiz arriba) y, paso a
 * paso, marca el rol de cada componente (dueño del estado, solo reenvia, consume, Provider) y hace viajar los datos por
 * las ramas: hacia abajo (props), hacia arriba (callbacks) o en un salto directo (Context, store global).
 * Es una escena para DK.player. Requiere dk-kit.js, dk-icons.js y dk-flow.js.
 *
 *   scene: function (svg) {
 *     return DK.tree({
 *       svg: svg, width: 1000,
 *       nodes: [                                         // el orden de los hijos es el orden en pantalla
 *         { id: 'page', label: 'RoutinesPage' },
 *         { id: 'layout', label: 'DashboardLayout', parent: 'page' },
 *         { id: 'form', label: 'RoutineForm', parent: 'page', sub: 'formulario' },
 *       ],
 *       legend: ['owner', 'pass', 'use'],               // opcional: leyenda de roles al pie
 *     });
 *   }
 *
 * La posicion se calcula sola (hojas repartidas a lo ancho, cada padre centrado sobre sus hijos). Un paso:
 *   { phase, title, caption,
 *     roles: { page: 'owner', layout: 'pass', counter: 'use' },   // owner | pass | use | provider | need | dim
 *     tags:  { page: 'useState(routines)' },                      // etiqueta sobre el nodo (del color de su rol)
 *     sub:   { counter: 'total: 3' },                              // cambia el texto secundario solo en este paso
 *     msgs: [
 *       { path: ['page', 'layout', 'counter'], label: 'total', kind: 'data' },   // viaja rama por rama (abajo o arriba)
 *       { from: 'page', to: 'counter', direct: true, label: 'useContext', kind: 'ack' },  // salto curvo sin intermediarios
 *       { from: 'form', to: 'counter', label: 'no llega', kind: 'err', lost: true },      // recta cortada con X
 *     ] }
 * Roles, etiquetas y sub valen solo para su paso (cada paso se describe completo). Solo se dibujan las flechas del paso
 * actual: un arbol con flechas viejas encima se vuelve ilegible.
 */
DK.tree = function (o) {
  var S = DK.svg;
  var DUR = o.dur || 700, STAG = DUR * 0.85;
  var W = o.width || 1000, NW = o.nodeW || 168, NH = o.nodeH || 52, GAP = o.levelGap || 118, TOP = o.top || 40, SIDE = 24;
  var ROLE_TXT = { owner: 'Dueño del estado', pass: 'Solo reenvía', use: 'Consume el dato', provider: 'Provider (Context)', need: 'Necesita el dato' };
  var byId = {}, kids = {}, root = null;
  var nodeEls = {}, subEls = {}, tagLayer, gMsgs, steps = [];
  var t = DK.timers();
  var H;

  o.nodes.forEach(function (n) { byId[n.id] = n; kids[n.id] = []; });
  o.nodes.forEach(function (n) { if (n.parent) kids[n.parent].push(n.id); else root = n.id; });

  // ---- distribucion: hojas en columnas parejas, padres centrados sobre sus hijos ----
  function layout() {
    var leaves = [], depth = 0;
    (function walk(id, d) {
      byId[id].depth = d; depth = Math.max(depth, d);
      if (!kids[id].length) leaves.push(id); else kids[id].forEach(function (k) { walk(k, d + 1); });
    })(root, 0);
    var slot = (W - 2 * SIDE) / leaves.length;
    leaves.forEach(function (id, i) { byId[id].cx = SIDE + slot * (i + 0.5); });
    (function place(id) {
      if (!kids[id].length) return byId[id].cx;
      var xs = kids[id].map(place);
      byId[id].cx = (Math.min.apply(null, xs) + Math.max.apply(null, xs)) / 2;
      return byId[id].cx;
    })(root);
    var nw = Math.min(NW, slot - 18);
    o.nodes.forEach(function (n) {
      n.w = n.w || nw; n.h = NH;
      n.x = n.cx - n.w / 2; n.y = TOP + n.depth * GAP;
    });
    H = TOP + depth * GAP + NH + (o.legend ? 62 : 24);
  }

  function build() {
    layout();
    var svg = o.svg;
    svg.replaceChildren();
    svg.setAttribute('viewBox', '0 0 ' + W + ' ' + H);
    var gEdges = S('g'), gNodes = S('g');
    tagLayer = S('g'); gMsgs = S('g');
    o.nodes.forEach(function (n) {
      if (n.parent) {
        var p = byId[n.parent];
        gEdges.appendChild(S('line', { x1: p.cx, y1: p.y + p.h, x2: n.cx, y2: n.y, class: 'dk-tedge' }));
      }
      var g = S('g', { class: 'dk-tnode', 'data-id': n.id });
      g.appendChild(S('rect', { x: n.x, y: n.y, width: n.w, height: n.h, rx: 12 }));
      g.appendChild(S('text', { x: n.cx, y: n.y + (n.sub ? n.h / 2 - 3 : n.h / 2 + 5), class: 'dk-nlabel mid', text: n.label }));
      subEls[n.id] = S('text', { x: n.cx, y: n.y + n.h / 2 + 14, class: 'dk-nsub mid', text: n.sub || '' });
      g.appendChild(subEls[n.id]);
      nodeEls[n.id] = g;
      gNodes.appendChild(g);
    });
    svg.append(gEdges, gNodes, tagLayer, gMsgs);
    if (o.legend) svg.appendChild(legend());
  }

  function legend() {
    var g = S('g'), x = SIDE, y = H - 26;
    o.legend.forEach(function (role) {
      var item = S('g', { class: 'dk-tnode role-' + role });
      item.appendChild(S('rect', { x: x, y: y - 10, width: 26, height: 18, rx: 6 }));
      item.appendChild(S('text', { x: x + 34, y: y + 4, class: 'dk-nsub', text: ROLE_TXT[role] || role }));
      g.appendChild(item);
      x += 34 + (ROLE_TXT[role] || role).length * 6.4 + 26;
    });
    return g;
  }

  // ---- flechas ----
  function hop(a, b) { // de un nodo a su padre o a su hijo, por la rama
    return b.depth > a.depth ? { x1: a.cx, y1: a.y + a.h + 3, x2: b.cx, y2: b.y - 3 } : { x1: a.cx, y1: a.y - 3, x2: b.cx, y2: b.y + b.h + 3 };
  }
  function side(a, b) { // recta entre dos nodos cualquiera: sale y entra por el borde, en la direccion centro a centro
    var pa = edge(a, b), pb = edge(b, a);
    return { x1: pa.x, y1: pa.y, x2: pb.x, y2: pb.y };
  }
  function edge(a, b) {
    var ca = { x: a.cx, y: a.y + a.h / 2 }, cb = { x: b.cx, y: b.y + b.h / 2 };
    var dx = cb.x - ca.x, dy = cb.y - ca.y, len = Math.sqrt(dx * dx + dy * dy) || 1;
    var k = Math.min(dx ? (a.w / 2) / Math.abs(dx) : Infinity, dy ? (a.h / 2) / Math.abs(dy) : Infinity);
    return { x: ca.x + dx * k + (dx / len) * 5, y: ca.y + dy * k + (dy / len) * 5 };
  }

  // salto directo: curva que sale de la raiz por fuera del arbol y entra al nodo por arriba (Context, store global)
  function direct(m, delay, live) {
    var a = byId[m.from], b = byId[m.to];
    var x1 = a.cx + (b.cx < a.cx ? -a.w / 2 : a.w / 2), y1 = a.y + a.h / 2;
    var x2 = b.cx, y2 = b.y - 4;
    var cx = x2 + (b.cx < a.cx ? -1 : 1) * Math.min(90, Math.abs(x2 - x1) * 0.3), cy = y1;
    var d = 'M' + x1 + ',' + y1 + ' Q' + cx + ',' + cy + ' ' + x2 + ',' + y2;
    var line = S('path', { d: d, class: 'dk-ln ' + m.kind + ' dk-tdirect', pathLength: 1 });
    var ang = Math.atan2(y2 - cy, x2 - cx) * 180 / Math.PI;
    var head = S('path', { d: 'M0,0 L-9,-4.5 L-9,4.5 Z', class: 'dk-head ' + m.kind, transform: 'translate(' + x2 + ',' + y2 + ') rotate(' + ang + ')' });
    var q = function (s) { var u = 1 - s; return { x: u * u * x1 + 2 * u * s * cx + s * s * x2, y: u * u * y1 + 2 * u * s * cy + s * s * y2 }; };
    var mid = q(0.45);
    var lbl = m.label ? S('text', { x: mid.x + (b.cx < a.cx ? -10 : 10), y: mid.y - 8, class: 'dk-lbl ' + (b.cx < a.cx ? 'end' : 'start'), text: m.label }) : null;
    [line, head, lbl].forEach(function (n) { if (n) gMsgs.append(n); });
    if (!live) return;
    var opts = { duration: DUR * 1.4, delay: delay, fill: 'both', easing: 'ease-in-out' };
    line.style.strokeDasharray = 1;
    line.animate([{ strokeDashoffset: 1 }, { strokeDashoffset: 0 }], opts);
    head.animate([{ opacity: 0 }, { opacity: 1 }], { duration: 160, delay: delay + DUR * 1.4 - 40, fill: 'both' });
    if (lbl) lbl.animate([{ opacity: 0 }, { opacity: 1 }], { duration: 250, delay: delay, fill: 'both' });
    var pk = S('circle', { r: 6, class: 'dk-pk-' + m.kind }), frames = [];
    for (var i = 0; i <= 12; i++) { var p = q(i / 12); frames.push({ transform: 'translate(' + p.x + 'px,' + p.y + 'px)', opacity: i === 12 ? 0 : 1 }); }
    pk.style.opacity = 0;
    gMsgs.append(pk);
    pk.animate(frames, opts);
  }

  function setSteps(list) { steps = list; build(); }

  function render(i, animate) {
    t.clear();
    gMsgs.replaceChildren();
    tagLayer.replaceChildren();
    var step = steps[i] || {};
    var roles = step.roles || {}, tags = step.tags || {}, subs = step.sub || {}, focus = step.focus || [];
    o.nodes.forEach(function (n) {
      var g = nodeEls[n.id];
      g.setAttribute('class', 'dk-tnode' + (roles[n.id] ? ' role-' + roles[n.id] : '') + (focus.indexOf(n.id) >= 0 ? ' on' : ''));
      subEls[n.id].textContent = subs[n.id] !== undefined ? subs[n.id] : (n.sub || '');
      if (tags[n.id]) {
        var txt = tags[n.id], tw = txt.length * 6.6 + 16;
        var tg = S('g', { class: 'dk-ttag dk-tnode' + (roles[n.id] ? ' role-' + roles[n.id] : '') });
        tg.appendChild(S('rect', { x: n.cx - tw / 2, y: n.y - 13, width: tw, height: 20, rx: 10 }));
        tg.appendChild(S('text', { x: n.cx, y: n.y + 1, class: 'mid', text: txt }));
        tagLayer.appendChild(tg);
        if (animate && !DK.reduced) tg.animate([{ opacity: 0, transform: 'translateY(4px)' }, { opacity: 1, transform: 'none' }], { duration: 300, fill: 'both' });
      }
    });
    var k = 0;
    (step.msgs || []).forEach(function (m) {
      if (m.direct) { direct(m, k * STAG, animate); k += 1.6; return; }
      var hops = m.path ? m.path.slice(1).map(function (id, j) { return hop(byId[m.path[j]], byId[id]); }) : [side(byId[m.from], byId[m.to])];
      hops.forEach(function (r) {
        var vertical = Math.abs(r.x2 - r.x1) < Math.abs(r.y2 - r.y1) * 2;
        DK.flow.arrow(gMsgs, {
          x1: r.x1, y1: r.y1, x2: r.x2, y2: r.y2, kind: m.kind, label: m.label, lost: m.lost,
          labelSide: vertical ? (r.x2 < r.x1 ? 'left' : 'right') : undefined, labelDy: vertical ? 4 : -8,
          animate: animate, delay: animate ? k * STAG : 0, dur: DUR,
        });
        k += 1;
      });
    });
    return { animMs: animate ? k * STAG + 120 : 0 };
  }

  return { setSteps: setSteps, render: render, msgDuration: STAG };
};
