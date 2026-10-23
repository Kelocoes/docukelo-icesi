// DOCS: .agents/skills/docusaurus_animated_diagrams/references/kit-api.md (API) y SKILL.md (proceso). Copia maestra unica del kit.
/* dk-canvas.js: escena LIBRE para DK.player. Sustituye a DK.layers cuando el concepto no es "cajas conectadas": iconos sueltos sin
 * tarjeta, zonas suaves (manchas, circulos, anillos), tomas y enchufes, contadores y flechas curvas. Requiere dk-kit.js y
 * dk-icons.js (usa DK.icons.<nombre> y DK.icons.h). Escribe su propio <style> (tokens de dk-base.css: claro y oscuro).
 *
 *   scene: function (svg) { return DK.canvas({ svg, width: 720, height: 420, items: [...], web: [['a', 'b', 14]], trail: 'step' }); }
 *
 * Usar width 720: la tarjeta admite hasta 732 px, asi el rotulo de 14 px se lee a 14 px. 'web' dibuja hilos finos entre elementos
 * (las "soldaduras" de un diseno acoplado; el tercer valor es la curvatura) y un paso puede poner webTone: 'err'. 'trail' = 'phase'
 * (por defecto: las flechas de pasos anteriores de la fase quedan atenuadas) o 'step' (solo las del paso actual).
 *
 * ELEMENTOS (se dibujan en orden: primero los fondos; las coordenadas son del centro):
 *   { id, type: 'node', icon, x, y, size: 52, label, sub, glyph, lp, ldx, ldy, rot, c, hidden }
 *        icono libre con rotulo. lp: 'below' (defecto) | 'above' | 'right' | 'left'; ldx y ldy desplazan el rotulo; rot gira el icono
 *        (grados); glyph dibuja un icono pequeno sobre el cuerpo de 'plug' y 'socket'; c: 'p1'..'p5' colorea el elemento.
 *   { id, type: 'zone', shape, cx, cy, rx, ry, r | x, y, w, h, rx, label, sub, lx, ly, anchor, seed, strong, c, hidden }
 *        fondo suave. shape: 'blob' (mancha organica) | 'circle' | 'ring' (circulo punteado) | 'round' (rectangulo redondeado, util
 *        para carriles y cintas; strong: true lo hace mas visible) | 'none' (solo rotulos: pasar cx, cy). anchor: 'middle' centra el rotulo.
 *   { id, type: 'tag', x, y, text, w, c, hidden }
 *        pastilla con texto (contadores, mensajes cortos). Su ancho sale del texto; las flechas llegan a su borde.
 *   { id, type: 'draw', x, y, r, lbly, label, sub, draw: function (S, g) { ... }, hidden }
 *        forma propia dibujada alrededor de (0, 0) con DK.svg (S). r es el radio de anclaje de las flechas; lbly mueve el rotulo.
 *
 * PASOS (cada paso se describe completo; text, sub, at, rot y show se ACUMULAN y gana el ultimo):
 *   { phase, title, caption,
 *     focus: ['id'],                 // aro suave detras del elemento (y borde azul)
 *     solo: true,                    // atenua todo lo que no este en focus ni en state
 *     state: { id: 'err' | 'ok' | 'warn' | 'dim' | 'ghost' },   // ghost = contorno punteado ("todavia no existe")
 *     badge: { id: { text, tone: 'err' | 'ok' | 'warn' | 'ctl', pos: 'top' | 'right' | 'bottom', dx, dy } },
 *     text: { id: 'nuevo rotulo' }, sub: { id: 'nuevo sub' },
 *     at: { id: [x, y] },            // mueve el elemento (con transicion): enchufes que se acoplan, piezas que se arrastran
 *     rot: { id: grados },           // gira un elemento 'draw' (agujas de un velocimetro)
 *     show: ['id'], hide: ['id'],    // hidden:true se revela con show (se queda); hide oculta solo en este paso
 *     links: [ { from, to, kind, label, curve, path: [x1,y1,x2,y2], c: [cx,cy], lx, ly, labelAt, thick, color, group } ],
 *     pulse: ['id'] }                // ondas que se expanden desde el elemento (propagacion de un cambio)
 *   kind de una flecha: 'ctl' (control) | 'ack' | 'data' | 'err' (fallo que llega) | 'dep' (dependencia: punteada). curve curva la flecha
 *   para no cruzar iconos; path + c fijan la ruta a mano; color: 'p1'..'p5' la tiñe; group: las flechas con el mismo numero salen a la vez.
 *
 * CONVENCIONES QUE FUNCIONARON: un icono distinto por rol; contrato = toma ('socket') y detalle = enchufe ('plug', que se acopla con
 * 'at'); un contador (tag) que contraste el antes y el despues; un color por actor en todo el capitulo (c: 'p1' | 'p3' | 'p5').
 */
DK.canvas = function (o) {
  var S = DK.svg;
  var W = o.width || 720, H = o.height || 400;
  var DUR = o.dur || 800, STAG = DUR * 0.8;
  var steps = [], items = {}, order = [], els = {}, pos = {};
  var gBack, gWeb, gItems, gLinks, gFx, gTop, t = DK.timers();

  if (!document.getElementById('dk-canvas-css')) {
    var st = document.createElement('style');
    st.id = 'dk-canvas-css';
    st.textContent = [
      '.cv-item { transition: transform .7s cubic-bezier(.45,.05,.25,1), opacity .4s; }',
      '.cv-halo { fill: var(--dk-band-on); opacity: 0; transition: opacity .35s, fill .35s; }',
      '.cv-item.on .cv-halo { opacity: 1; }',
      '.cv-item.st-err .cv-halo { fill: color-mix(in srgb, var(--dk-err) 22%, transparent); opacity: 1; }',
      '.cv-item.st-ok .cv-halo { fill: color-mix(in srgb, var(--dk-ack) 20%, transparent); opacity: 1; }',
      '.cv-item.st-warn .cv-halo { fill: color-mix(in srgb, var(--dk-p5) 24%, transparent); opacity: 1; }',
      '.cv-item.st-err .dk-dev, .cv-item.st-err .cv-stroke { stroke: var(--dk-err); }',
      '.cv-item.st-ok .dk-dev, .cv-item.st-ok .cv-stroke { stroke: var(--dk-ack); }',
      '.cv-item.st-warn .dk-dev, .cv-item.st-warn .cv-stroke { stroke: var(--dk-p5); }',
      '.cv-item.on .dk-dev, .cv-item.on .cv-stroke { stroke: var(--dk-ctl); }',
      '.cv-item.st-err.on .dk-dev, .cv-item.st-err.on .cv-stroke { stroke: var(--dk-err); }',
      '.cv-item.st-ok.on .dk-dev, .cv-item.st-ok.on .cv-stroke { stroke: var(--dk-ack); }',
      '.cv-item.tinted:not(.st-err):not(.st-ok):not(.st-warn) .dk-dev, .cv-item.tinted:not(.st-err):not(.st-ok):not(.st-warn) .cv-stroke { stroke: var(--cv-c); }',
      '.cv-item.tinted:not(.st-err):not(.st-ok):not(.st-warn) .cv-halo { fill: color-mix(in srgb, var(--cv-c) 16%, transparent); opacity: 1; }',
      '.cv-item.tinted .cv-fillc { fill: var(--cv-c); }',
      '.cv-zone.tinted:not(.st-err):not(.st-ok) { fill: color-mix(in srgb, var(--cv-c) 13%, transparent); }',
      '.cv-t-tag.tinted:not(.st-err):not(.st-ok) .cv-pill { stroke: var(--cv-c); fill: color-mix(in srgb, var(--cv-c) 12%, var(--dk-card)); }',
      '.cv-item.st-dim, .cv-item.solo-off { opacity: .28; }',
      '.cv-item.st-ghost { opacity: .5; } .cv-item.st-ghost .dk-dev { stroke-dasharray: 4 3; fill: none; }',
      '.cv-lbl { font-size: 14px; font-weight: 700; text-anchor: middle; fill: var(--dk-ink); }',
      '.cv-lbl.start { text-anchor: start; } .cv-lbl.end { text-anchor: end; }',
      '.cv-sub { font-size: 12px; text-anchor: middle; fill: var(--dk-muted); } .cv-sub.start { text-anchor: start; } .cv-sub.end { text-anchor: end; }',
      '.cv-zone { fill: var(--dk-band); stroke: none; transition: fill .4s, stroke .4s; }',
      '.cv-zone.ring { fill: none; stroke: var(--dk-line); stroke-width: 2; stroke-dasharray: 6 6; }',
      '.cv-zone.st-err { fill: color-mix(in srgb, var(--dk-err) 14%, transparent); }',
      '.cv-zone.st-ok { fill: color-mix(in srgb, var(--dk-ack) 13%, transparent); }',
      '.cv-zone.on { fill: var(--dk-band-on); }',
      '.cv-zone.strong { fill: color-mix(in srgb, var(--dk-ctl) 22%, transparent); } .cv-zone.strong.st-err { fill: color-mix(in srgb, var(--dk-err) 38%, transparent); } .cv-zone.strong.st-ok { fill: color-mix(in srgb, var(--dk-ack) 30%, transparent); }',
      '.cv-zlbl { font-size: 14px; font-weight: 700; fill: var(--dk-ink); } .cv-zsub { font-size: 12px; fill: var(--dk-muted); } .cv-zlbl.mid, .cv-zsub.mid { text-anchor: middle; }',
      '.cv-pill { fill: var(--dk-card); stroke: var(--dk-line); stroke-width: 1.6; transition: stroke .3s, fill .3s; }',
      '.cv-pt { font-size: 12px; font-weight: 700; text-anchor: middle; fill: var(--dk-ink); }',
      '.cv-b-err .cv-pill, .cv-t-tag.st-err .cv-pill { stroke: var(--dk-err); fill: color-mix(in srgb, var(--dk-err) 12%, var(--dk-card)); } .cv-b-err .cv-pt, .cv-t-tag.st-err .cv-pt { fill: var(--dk-err); }',
      '.cv-b-ok .cv-pill, .cv-t-tag.st-ok .cv-pill { stroke: var(--dk-ack); fill: color-mix(in srgb, var(--dk-ack) 12%, var(--dk-card)); } .cv-b-ok .cv-pt, .cv-t-tag.st-ok .cv-pt { fill: var(--dk-ack); }',
      '.cv-b-warn .cv-pill { stroke: var(--dk-p5); fill: color-mix(in srgb, var(--dk-p5) 14%, var(--dk-card)); } .cv-b-warn .cv-pt { fill: var(--dk-ink); }',
      '.cv-b-ctl .cv-pill, .cv-t-tag.on .cv-pill { stroke: var(--dk-ctl); fill: var(--dk-chip); } .cv-b-ctl .cv-pt { fill: var(--dk-ctl); }',
      '.cv-web { fill: none; stroke: var(--dk-muted); stroke-width: 1.6; opacity: .5; stroke-linecap: round; transition: stroke .4s; } .cv-web.err { stroke: var(--dk-err); opacity: .75; }',
      '.dk-ln.dep { stroke: var(--dk-data); stroke-dasharray: 7 5; } .dk-head.dep { fill: var(--dk-data); }',
      '.dk-ln.cv-thick { stroke-width: 3; }',
      '.cv-item.hidden { opacity: 0 !important; pointer-events: none; }',
      '.cv-pulse { fill: none; stroke: var(--dk-err); stroke-width: 3; transform-box: fill-box; transform-origin: center; }',
    ].join('\n');
    document.head.appendChild(st);
  }

  o.items.forEach(function (n) { items[n.id] = n; order.push(n.id); });

  function blob(cx, cy, rx, ry, seed) {
    var n = 12, p = [], k;
    for (k = 0; k < n; k++) {
      var a = k / n * 2 * Math.PI, w = 1 + 0.055 * Math.sin(a * 3 + seed) + 0.04 * Math.cos(a * 2 + seed * 1.7);
      p.push([cx + Math.cos(a) * rx * w, cy + Math.sin(a) * ry * w]);
    }
    var d = 'M' + p[0][0].toFixed(1) + ',' + p[0][1].toFixed(1);
    for (k = 0; k < n; k++) {
      var p0 = p[(k - 1 + n) % n], p1 = p[k], p2 = p[(k + 1) % n], p3 = p[(k + 2) % n];
      d += ' C' + (p1[0] + (p2[0] - p0[0]) / 6).toFixed(1) + ',' + (p1[1] + (p2[1] - p0[1]) / 6).toFixed(1) + ' ' +
        (p2[0] - (p3[0] - p1[0]) / 6).toFixed(1) + ',' + (p2[1] - (p3[1] - p1[1]) / 6).toFixed(1) + ' ' + p2[0].toFixed(1) + ',' + p2[1].toFixed(1);
    }
    return d + ' Z';
  }

  function build() {
    var svg = o.svg;
    svg.replaceChildren();
    svg.setAttribute('viewBox', '0 0 ' + W + ' ' + H);
    svg.style.maxWidth = Math.min(W, 732) + 'px';
    gBack = S('g'); gWeb = S('g'); gItems = S('g'); gLinks = S('g'); gFx = S('g'); gTop = S('g');
    els = {}; pos = {};
    order.forEach(function (id) {
      var n = items[id], g = S('g', { class: 'cv-item cv-t-' + n.type, 'data-id': id });
      var bx = n.type === 'zone' ? (n.cx !== undefined ? n.cx : n.x + n.w / 2) : n.x;
      var by = n.type === 'zone' ? (n.cy !== undefined ? n.cy : n.y + n.h / 2) : n.y;
      pos[id] = [bx, by];
      n._bx = bx; n._by = by; n.subEl = null; n.lblEl = null;
      if (n.type === 'zone') {
        var shape;
        if (n.shape === 'none') shape = S('rect', { x: n.lx, y: n.ly, width: 0, height: 0, class: 'cv-zone' });   // solo rotulos
        else if (n.shape === 'blob') shape = S('path', { d: blob(n.cx, n.cy, n.rx, n.ry, n.seed || 0), class: 'cv-zone' });
        else if (n.shape === 'circle' || n.shape === 'ring') shape = S('circle', { cx: n.cx, cy: n.cy, r: n.r, class: 'cv-zone' + (n.shape === 'ring' ? ' ring' : '') });
        else shape = S('rect', { x: n.x, y: n.y, width: n.w, height: n.h, rx: n.rx !== undefined ? n.rx : n.h / 2, class: 'cv-zone' });
        g.appendChild(shape); n.shapeEl = shape;
        if (n.label) { n.lblEl = S('text', { x: n.lx, y: n.ly, class: 'cv-zlbl' + (n.anchor === 'middle' ? ' mid' : ''), text: n.label }); g.appendChild(n.lblEl); }
        if (n.sub) { n.subEl = S('text', { x: n.lx, y: n.ly + 17, class: 'cv-zsub' + (n.anchor === 'middle' ? ' mid' : ''), text: n.sub }); g.appendChild(n.subEl); }
        gBack.appendChild(g);
      } else if (n.type === 'tag') {
        g.setAttribute('class', 'cv-item cv-t-tag');
        n.pillEl = S('rect', { class: 'cv-pill', rx: 13, height: 26, y: -13 });
        n.textEl = S('text', { class: 'cv-pt', y: 4, text: n.text });
        g.append(n.pillEl, n.textEl);
        n.r = 0;
        gItems.appendChild(g);
      } else if (n.type === 'draw') {
        var inner = S('g'); n.draw(S, inner); g.appendChild(inner);
        n.r = n.r || 30;
        var dly = n.lbly !== undefined ? n.lbly : (n.r || 30) + 20;   // lbly: posicion del rotulo cuando difiere del radio de anclaje
        if (n.label) { n.lblEl = S('text', { x: 0, y: dly, class: 'cv-lbl', text: n.label }); g.appendChild(n.lblEl); }
        if (n.sub) { n.subEl = S('text', { x: 0, y: dly + 16, class: 'cv-sub', text: n.sub }); g.appendChild(n.subEl); }
        gItems.appendChild(g);
      } else {   // node: icono libre con rotulo
        var size = n.size || 52; n.size = size; n.r = size / 2 + 10;
        g.appendChild(S('circle', { cx: 0, cy: 0, r: size * 0.8, class: 'cv-halo' }));
        if (n.icon && DK.icons[n.icon]) {
          var h = DK.icons.h[n.icon] || 40;
          var ic = DK.icons[n.icon]({ x: 0, y: -size / 2, scale: size / h, glyph: n.glyph });
          g.appendChild(n.rot ? S('g', { transform: 'rotate(' + n.rot + ')' }, ic) : ic);
        }
        var right = n.lp === 'right', left = n.lp === 'left', above = n.lp === 'above', side = right || left;
        var lx = (right ? size / 2 + 12 : left ? -size / 2 - 12 : 0) + (n.ldx || 0), cls = right ? ' start' : left ? ' end' : '';
        var ly = (side ? (n.sub ? -2 : 5) : above ? -size / 2 - (n.sub ? 28 : 12) : size / 2 + 20) + (n.ldy || 0);
        var sy = (side ? 15 : above ? -size / 2 - 11 : size / 2 + 37) + (n.ldy || 0);
        if (n.label) { n.lblEl = S('text', { x: lx, y: ly, class: 'cv-lbl' + cls, text: n.label }); g.appendChild(n.lblEl); }
        if (n.sub) { n.subEl = S('text', { x: lx, y: sy, class: 'cv-sub' + cls, text: n.sub }); g.appendChild(n.subEl); }
        gItems.appendChild(g);
      }
      if (n.c) g.style.setProperty('--cv-c', 'var(--dk-' + n.c + ')');
      g.style.transform = n.type === 'zone' ? 'translate(0px,0px)' : 'translate(' + bx + 'px,' + by + 'px)';
      els[id] = g;
    });
    svg.append(gBack, gWeb, gItems, gLinks, gFx, gTop);
  }

  // ---- geometria ----
  function center(id) { return pos[id] || [0, 0]; }
  function anchor(a, b, extra) {   // punto del borde de `a` mirando hacia `b`
    var ca = center(a), cb = center(b), r = ((items[a] && items[a].r) || 0) + (extra || 0);
    var dx = cb[0] - ca[0], dy = cb[1] - ca[1], len = Math.sqrt(dx * dx + dy * dy) || 1;
    return [ca[0] + dx / len * r, ca[1] + dy / len * r];
  }
  function bez(p, t) {
    var u = 1 - t;
    return [u * u * p.x1 + 2 * u * t * p.cx + t * t * p.x2, u * u * p.y1 + 2 * u * t * p.cy + t * t * p.y2];
  }
  function route(m) {
    var p = {};
    if (m.path) { p.x1 = m.path[0]; p.y1 = m.path[1]; p.x2 = m.path[2]; p.y2 = m.path[3]; }
    else {
      var a = anchor(m.from, m.to, 4), b = anchor(m.to, m.from, 8);
      // con curva, la salida y la llegada se desvian un poco para que la flecha no nazca en la linea recta
      p.x1 = a[0]; p.y1 = a[1]; p.x2 = b[0]; p.y2 = b[1];
    }
    var mx = (p.x1 + p.x2) / 2, my = (p.y1 + p.y2) / 2;
    if (m.c) { p.cx = m.c[0]; p.cy = m.c[1]; }
    else {
      var dx = p.x2 - p.x1, dy = p.y2 - p.y1, len = Math.sqrt(dx * dx + dy * dy) || 1, k = m.curve || 0;
      p.cx = mx + (-dy / len) * k; p.cy = my + (dx / len) * k;
    }
    return p;
  }

  // ---- estado acumulado hasta el paso i ----
  function resolve(i) {
    var r = { text: {}, sub: {}, at: {}, rot: {}, shown: {} };
    for (var q = 0; q <= i; q++) {
      var s = steps[q];
      ['text', 'sub', 'at', 'rot'].forEach(function (k) { var m = s[k] || {}; for (var id in m) r[k][id] = m[id]; });
      (s.show || []).forEach(function (id) { r.shown[id] = true; });
    }
    return r;
  }

  function arrow(m, animate, delay, dim) {
    var p = route(m), kind = m.kind || 'ctl';
    var d = 'M' + p.x1 + ',' + p.y1 + ' Q' + p.cx + ',' + p.cy + ' ' + p.x2 + ',' + p.y2;
    var attrs = { d: d, class: 'dk-ln ' + kind + (m.thick ? ' cv-thick' : '') };
    if (kind !== 'dep') attrs.pathLength = 1;   // pathLength normaliza los guiones: las flechas punteadas no lo llevan
    var path = S('path', attrs);
    var col = m.color ? 'var(--dk-' + m.color + ')' : null;
    if (col) path.style.stroke = col;
    var ang = Math.atan2(p.y2 - p.cy, p.x2 - p.cx) * 180 / Math.PI;
    var head = S('path', { d: 'M0,0 L-10,-5 L-10,5 Z', class: 'dk-head ' + kind, transform: 'translate(' + p.x2 + ',' + p.y2 + ') rotate(' + ang + ')' });
    var lp = bez(p, m.labelAt !== undefined ? m.labelAt : 0.5);
    var horiz = Math.abs(p.x2 - p.x1) >= Math.abs(p.y2 - p.y1) * 1.6;
    var lx = m.lx !== undefined ? m.lx : lp[0] + (horiz ? 0 : 10), ly = m.ly !== undefined ? m.ly : lp[1] + (horiz ? (p.cy < (p.y1 + p.y2) / 2 ? -9 : 17) : 4);
    var lbl = m.label ? S('text', { x: lx, y: ly, class: 'dk-lbl' + (kind === 'err' ? ' lost' : '') + (horiz ? '' : ' start'), text: m.label }) : null;
    if (col) head.style.fill = col;
    var nodes = [path, head, lbl].filter(Boolean);
    nodes.forEach(function (n) { gLinks.appendChild(n); if (dim) n.style.opacity = 0.4; });
    if (!animate || DK.reduced) return;
    var dashed = kind === 'dep';
    var opt = { duration: DUR, delay: delay, fill: 'both', easing: 'ease-in-out' };
    if (dashed) path.animate([{ opacity: 0 }, { opacity: 1 }], opt);
    else { path.style.strokeDasharray = 1; path.animate([{ strokeDashoffset: 1 }, { strokeDashoffset: 0 }], opt); }
    head.animate([{ opacity: 0 }, { opacity: 1 }], { duration: 160, delay: delay + DUR - 40, fill: 'both' });
    if (lbl) lbl.animate([{ opacity: 0 }, { opacity: 1 }], { duration: 250, delay: delay, fill: 'both' });
    var pk = S('circle', { r: 6, class: 'dk-pk-' + (kind === 'dep' ? 'data' : kind) });
    if (col) pk.style.fill = col;
    pk.style.opacity = 0; gLinks.appendChild(pk);
    var total = path.getTotalLength();
    t.later(function frame() {
      // el paquete recorre la curva (parametro uniforme sobre la longitud)
      var t0 = performance.now();
      (function tick(now) {
        var k = Math.min(1, (now - t0) / (DUR * 0.92));
        var e = k < .5 ? 2 * k * k : 1 - Math.pow(-2 * k + 2, 2) / 2;
        var pt = path.getPointAtLength(total * e);
        pk.setAttribute('cx', pt.x); pk.setAttribute('cy', pt.y);
        pk.style.opacity = k >= 1 ? 0 : 1;
        if (k < 1 && pk.isConnected) requestAnimationFrame(tick);
      })(t0);
    }, delay);
  }

  function badge(id, b) {
    var n = items[id], c = center(id), txt = b.text, w = Math.max(40, txt.length * 6.9 + 20);
    var side = b.pos || 'top';
    var half = (n.type === 'node' ? n.size / 2 : (n.r || 0));
    var bx = c[0], by = c[1] - half - 16 - (n.lp === 'above' ? (n.sub ? 44 : 28) : 0);
    if (side === 'right') { bx = c[0] + half + 14 + w / 2; by = c[1]; }
    if (side === 'bottom') by = c[1] + half + (n.lp === 'above' ? 18 : (n.sub ? 56 : 40));
    if (b.dx) bx += b.dx; if (b.dy) by += b.dy;
    var g = S('g', { class: 'cv-badge cv-b-' + (b.tone || 'ctl'), transform: 'translate(' + bx + ',' + by + ')' },
      S('rect', { class: 'cv-pill', x: -w / 2, y: -12, width: w, height: 24, rx: 12 }), S('text', { class: 'cv-pt', y: 4.2, text: txt }));
    gTop.appendChild(g);
    if (!DK.reduced) g.animate([{ opacity: 0, transform: 'translate(' + bx + 'px,' + (by + 6) + 'px)' }, { opacity: 1, transform: 'translate(' + bx + 'px,' + by + 'px)' }], { duration: 300, fill: 'both' });
  }

  function setSteps(list) {
    steps = list;
    steps.forEach(function (s) { s.msgs = s.links || s.msgs || []; });
    build();
  }

  function render(i, animate) {
    t.clear();
    var step = steps[i] || {}, r = resolve(i);
    [gWeb, gLinks, gFx, gTop].forEach(function (g) { g.replaceChildren(); });
    var focus = step.focus || [], state = step.state || {}, hide = step.hide || [];
    // posiciones vigentes
    order.forEach(function (id) {
      var n = items[id], p = r.at[id] || [n._bx, n._by];
      pos[id] = p;
      var g = els[id];
      g.style.transform = n.type === 'zone' ? 'translate(' + (p[0] - n._bx) + 'px,' + (p[1] - n._by) + 'px)'
        : 'translate(' + p[0] + 'px,' + p[1] + 'px)' + (r.rot[id] !== undefined ? ' rotate(' + r.rot[id] + 'deg)' : (n.rot0 ? ' rotate(' + n.rot0 + 'deg)' : ''));
      var vis = (!n.hidden || r.shown[id]) && hide.indexOf(id) < 0;
      var cls = 'cv-item cv-t-' + n.type + (vis ? '' : ' hidden') + (n.c ? ' tinted' : '');
      if (n.type === 'zone') {
        cls += state[id] ? ' st-' + state[id] : '';
        g.setAttribute('class', cls);
        if (n.shapeEl) n.shapeEl.setAttribute('class', 'cv-zone' + (n.c ? ' tinted' : '') + (n.shape === 'ring' ? ' ring' : '') + (n.strong ? ' strong' : '') + (state[id] ? ' st-' + state[id] : '') + (focus.indexOf(id) >= 0 ? ' on' : ''));
      } else {
        if (focus.indexOf(id) >= 0) cls += ' on';
        if (state[id]) cls += ' st-' + state[id];
        else if (step.solo && focus.indexOf(id) < 0 && n.type !== 'tag') cls += ' solo-off';
        g.setAttribute('class', cls);
      }
      if (n.lblEl && r.text[id] !== undefined) n.lblEl.textContent = r.text[id]; else if (n.lblEl) n.lblEl.textContent = n.label;
      if (n.subEl) n.subEl.textContent = r.sub[id] !== undefined ? r.sub[id] : n.sub;
      if (n.type === 'tag') {
        var tx = r.text[id] !== undefined ? r.text[id] : n.text, w = n.w || Math.max(60, tx.length * 7 + 26);
        n.textEl.textContent = tx; n.pillEl.setAttribute('x', -w / 2); n.pillEl.setAttribute('width', w);
        n.r = w / 2 - 6;   // las flechas llegan al borde de la pastilla, no a su centro
      }
    });
    // hilos finos
    (o.web || []).forEach(function (pr) {
      var a = pr[0], b = pr[1];
      if (!els[a] || !els[b] || els[a].classList.contains('hidden') || els[b].classList.contains('hidden')) return;
      var p = route({ from: a, to: b, curve: pr[2] || 14 });
      gWeb.appendChild(S('path', { d: 'M' + p.x1 + ',' + p.y1 + ' Q' + p.cx + ',' + p.cy + ' ' + p.x2 + ',' + p.y2, class: 'cv-web' + (step.webTone === 'err' ? ' err' : '') }));
    });
    // flechas: las de pasos anteriores de la misma fase quedan atenuadas
    for (var s = 0; s <= i; s++) {
      if (steps[s].phase !== step.phase || (o.trail === 'step' && s !== i)) continue;
      (steps[s].links || []).forEach(function (m, k) {
        var live = s === i && animate;
        arrow(m, live, live ? (m.group !== undefined ? m.group : k) * STAG : 0, s !== i);   // group: las flechas del mismo grupo salen a la vez
      });
    }
    // ondas de propagacion
    (step.pulse || []).forEach(function (id, k) {
      var c = center(id), n = items[id], base = (n.size || 50) / 2;
      for (var w = 0; w < 2; w++) {
        var ring = S('circle', { cx: c[0], cy: c[1], r: base, class: 'cv-pulse' });
        gFx.appendChild(ring);
        if (animate && !DK.reduced) ring.animate([{ transform: 'scale(.6)', opacity: .9 }, { transform: 'scale(2.3)', opacity: 0 }], { duration: 1100, delay: k * 220 + w * 380, fill: 'both', easing: 'ease-out' });
        else ring.style.opacity = 0;
      }
    });
    Object.keys(step.badge || {}).forEach(function (id) { if (!els[id].classList.contains('hidden')) badge(id, step.badge[id]); });
    var n = 0;
    (step.links || []).forEach(function (m, k) { n = Math.max(n, (m.group !== undefined ? m.group : k) + 1); });
    return { animMs: animate ? n * STAG + ((step.pulse || []).length ? 900 : 0) + 120 : 0 };
  }

  return { setSteps: setSteps, render: render, msgDuration: STAG };
};
