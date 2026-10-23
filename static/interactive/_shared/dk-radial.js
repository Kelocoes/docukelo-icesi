/* dk-radial.js: escena circular para DK.player. Anillos concéntricos (capas de una arquitectura de cebolla),
 * piezas colocadas en sus anillos, flechas (rectas o curvas) que viajan entre ellas y un panel que, al tocar una pieza,
 * muestra qué puede importar y qué no (matriz de límites). Requiere dk-kit.js, dk-icons.js y dk-flow.js.
 *
 *   scene: function (svg, stage) {
 *     return DK.radial({
 *       svg: svg, stage: stage, size: 900, cx: 450, cy: 450, outer: 412,
 *       rings: [ { id: 'domain', r0: 0, r1: 140, color: 'var(--dk-p3)', label: 'DOMINIO', at: [450, 515] },     // at: rótulo recto
 *                { id: 'pres', r0: 290, r1: 392, color: 'var(--dk-p1)', label: 'PRESENTACIÓN', arc: [84, 138] } ],  // arc: rótulo curvo (grados desde arriba, sentido horario)
 *       nodes: function () { return [ { id, ring, group, kind: 'box' | 'actor', icon, label, sub, info, x, y, w, h } ]; },   // se evalúa en cada setSteps
 *       groups: { domain: { label: 'Dominio' } },          // grupos para la matriz de límites
 *       matrix: { domain: ['domain'], comp: ['vm', 'hook', 'comp'] },   // qué grupos puede importar cada grupo
 *       hint: 'Toca una pieza...', trail: 'phase', dur: 600,
 *     });
 *   }
 *
 * Un paso: { phase, title, caption, focus: ['hook'], rings: ['pres'] (por defecto, los anillos de las piezas enfocadas),
 *   sub: { slice: 'isLoading: true' }, msgs: [ { from, to, label, kind: 'ctl' | 'ack' | 'data' | 'err',
 *     bend: 60 (curva: px de desvío del punto de control) | ctrl: [x, y], lost: true, labelAt, labelDx, labelDy, labelSide } ] }
 * Tocar una pieza (o Enter/Espacio sobre ella) marca en verde lo que puede importar y en rojo punteado lo que no.
 */
DK.radial = function (o) {
  var S = DK.svg, el = DK.el;
  var DUR = o.dur || 600, STAG = DUR * 0.85;
  var cx = o.cx, cy = o.cy;
  var IW = { laptop: 72, server: 52, database: 48, browser: 60, user: 36, classbox: 56, card: 52, coins: 40, file: 34, filecode: 34, gear: 36, bag: 36, lock: 30, filter: 38 };
  var steps = [], nodes = [], byId = {}, ringById = {};
  var nodeEls = {}, ringEls = {}, subEls = {};
  var gMsgs, selected = null;
  var t = DK.timers();
  var uid = 'rd' + Math.random().toString(36).slice(2, 7);

  var card = o.stage.parentNode;
  card.classList.add('dk-rlayout');
  var panel = el('div', { class: 'dk-rinfo', 'aria-live': 'polite' });
  card.insertBefore(panel, o.stage.nextSibling);

  o.rings.forEach(function (r) { ringById[r.id] = r; });

  function pt(r, deg) { var a = deg * Math.PI / 180; return { x: cx + r * Math.sin(a), y: cy - r * Math.cos(a) }; }
  function annulus(r0, r1) {
    var d = 'M' + (cx + r1) + ',' + cy + ' A' + r1 + ',' + r1 + ' 0 1 0 ' + (cx - r1) + ',' + cy + ' A' + r1 + ',' + r1 + ' 0 1 0 ' + (cx + r1) + ',' + cy + ' Z';
    if (r0 > 0) d += ' M' + (cx + r0) + ',' + cy + ' A' + r0 + ',' + r0 + ' 0 1 1 ' + (cx - r0) + ',' + cy + ' A' + r0 + ',' + r0 + ' 0 1 1 ' + (cx + r0) + ',' + cy + ' Z';
    return d;
  }

  function build() {
    var svg = o.svg;
    svg.replaceChildren();
    svg.setAttribute('viewBox', '0 0 ' + o.size + ' ' + o.size);
    nodes = typeof o.nodes === 'function' ? o.nodes() : o.nodes;
    byId = {}; nodeEls = {}; ringEls = {}; subEls = {};
    nodes.forEach(function (n) { byId[n.id] = n; });

    var gRings = S('g');
    if (o.outer) gRings.appendChild(S('circle', { cx: cx, cy: cy, r: o.outer, class: 'dk-rext' }));
    o.rings.forEach(function (r) {
      var g = S('g', { class: 'dk-ring', style: '--rc:' + r.color });
      g.appendChild(S('path', { d: annulus(r.r0, r.r1), class: 'fill', 'fill-rule': 'evenodd' }));
      if (r.arc) {
        var rm = (r.r0 + r.r1) / 2, a = pt(rm, r.arc[0]), b = pt(rm, r.arc[1]), pid = uid + '-' + r.id;
        g.appendChild(S('path', { id: pid, d: 'M' + a.x + ',' + a.y + ' A' + rm + ',' + rm + ' 0 0 1 ' + b.x + ',' + b.y, class: 'arc' }));
        g.appendChild(S('text', { class: 'rl' }, S('textPath', { href: '#' + pid, startOffset: '50%', 'text-anchor': 'middle', text: r.label })));
      } else if (r.at) {
        g.appendChild(S('text', { x: r.at[0], y: r.at[1], class: 'rl mid', text: r.label }));
      }
      ringEls[r.id] = g;
      gRings.appendChild(g);
    });

    var gNodes = S('g');
    nodes.forEach(function (n) {
      var w = n.w || 124, h = n.h || 46, ring = ringById[n.ring];
      var g = S('g', {
        class: 'dk-rnode ' + (n.kind || 'box'), 'data-id': n.id, tabindex: 0, role: 'button',
        'aria-label': n.label + (n.sub ? ', ' + n.sub : ''), style: '--rc:' + (ring ? ring.color : 'var(--dk-muted)'),
      });
      g.appendChild(S('rect', { x: n.x - w / 2, y: n.y - h / 2, width: w, height: h, rx: 10 }));
      var lbl = S('text', { x: n.x, y: n.y + (n.sub ? -2 : 5), class: 'nl', text: n.label });
      if (n.label.length * 7.7 > w - 12) { lbl.setAttribute('textLength', w - 12); lbl.setAttribute('lengthAdjust', 'spacingAndGlyphs'); }
      g.appendChild(lbl);
      if (n.sub) {
        subEls[n.id] = S('text', { x: n.x, y: n.y + 14, class: 'ns', text: n.sub });
        g.appendChild(subEls[n.id]);
      }
      if (n.icon && DK.icons[n.icon]) {   // insignia con el icono del rol, montada sobre la esquina superior izquierda
        var bx = n.x - w / 2 + 4, by = n.y - h / 2 + 2, H = DK.icons.h[n.icon] || 38, sc = Math.min(15 / H, 17 / (IW[n.icon] || 40));
        g.appendChild(S('circle', { cx: bx, cy: by, r: 13, class: 'badge' }));
        g.appendChild(DK.icons[n.icon]({ x: bx, y: by - (H * sc) / 2, scale: sc }));
      }
      g.addEventListener('click', function () { select(selected === n.id ? null : n.id); });
      g.addEventListener('keydown', function (e) {
        if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); select(selected === n.id ? null : n.id); }
      });
      nodeEls[n.id] = g;
      gNodes.appendChild(g);
    });
    gMsgs = S('g');
    svg.append(gRings, gNodes, gMsgs);
    paintPanel(null);
  }

  // ---- panel "qué puede importar" ----
  function paintPanel(n) {
    panel.replaceChildren();
    if (!n) { panel.appendChild(el('p', { class: 'hint', text: o.hint })); return; }
    var ring = ringById[n.ring];
    panel.style.setProperty('--rc', ring ? ring.color : 'var(--dk-muted)');
    var g = n.group && o.groups[n.group];
    panel.appendChild(el('span', { class: 'tag', text: g ? g.label : 'Exterior (fuera del círculo)' }));
    panel.appendChild(el('h4', { text: n.label }));
    panel.appendChild(el('p', { text: n.info || '' }));
    if (!g) return;
    var can = o.matrix[n.group], cant = Object.keys(o.groups).filter(function (k) { return can.indexOf(k) < 0; });
    [['Puede importar', can, 'ok'], ['No puede importar', cant, 'no']].forEach(function (row) {
      panel.appendChild(el('div', { class: 'row ' + row[2] }, el('b', { text: row[0] }),
        row[1].length ? row[1].map(function (k) { return el('span', { class: 'chip', text: o.groups[k].label }); }) : el('span', { class: 'chip', text: 'ninguna' })));
    });
  }

  function select(id) {
    selected = id;
    var n = id ? byId[id] : null, allow = n && n.group ? o.matrix[n.group] : null;
    nodes.forEach(function (m) {
      var ok = false, no = false;
      if (allow && m.id !== id && m.group) { ok = allow.indexOf(m.group) >= 0; no = !ok; }
      var g = nodeEls[m.id];
      g.classList.toggle('sel', m.id === id);
      g.classList.toggle('ok', ok);
      g.classList.toggle('no', no);
    });
    paintPanel(n);
  }

  // ---- geometría de las flechas ----
  function edge(n, tx, ty) {
    var w = n.w || 124, h = n.h || 46, dx = tx - n.x, dy = ty - n.y, len = Math.sqrt(dx * dx + dy * dy) || 1;
    var k = Math.min(dx ? (w / 2) / Math.abs(dx) : Infinity, dy ? (h / 2) / Math.abs(dy) : Infinity);
    return { x: n.x + dx * k + (dx / len) * 4, y: n.y + dy * k + (dy / len) * 4 };
  }
  function route(m) {
    var a = byId[m.from], b = byId[m.to], p1, p2, c;
    if (m.ctrl || m.bend) {
      if (m.ctrl) c = { x: m.ctrl[0], y: m.ctrl[1] };
      else {
        var dx = b.x - a.x, dy = b.y - a.y, L = Math.sqrt(dx * dx + dy * dy) || 1;
        c = { x: (a.x + b.x) / 2 - (dy / L) * m.bend, y: (a.y + b.y) / 2 + (dx / L) * m.bend };
      }
      p1 = edge(a, c.x, c.y); p2 = edge(b, c.x, c.y);
      return { x1: p1.x, y1: p1.y, x2: p2.x, y2: p2.y, cx: c.x, cy: c.y, curved: true };
    }
    p1 = edge(a, b.x, b.y); p2 = edge(b, a.x, a.y);
    return { x1: p1.x, y1: p1.y, x2: p2.x, y2: p2.y };
  }
  var horizontal = function (r) { return Math.abs(r.x2 - r.x1) >= Math.abs(r.y2 - r.y1) * 2; };

  // flecha curva (Bézier cuadrática): misma apariencia y animación que DK.flow.arrow
  function curve(r, m, live, delay, dim) {
    var f = m.lost ? 0.55 : 1;
    var q = function (a, b, c, u) { var v = 1 - u; return v * v * a + 2 * v * u * b + u * u * c; };
    var at = function (u) { return { x: q(r.x1, r.cx, r.x2, u), y: q(r.y1, r.cy, r.y2, u) }; };
    var E = at(f), C = { x: r.x1 + f * (r.cx - r.x1), y: r.y1 + f * (r.cy - r.y1) };
    var ang = Math.atan2(E.y - C.y, E.x - C.x) * 180 / Math.PI;
    var line = S('path', { d: 'M' + r.x1 + ',' + r.y1 + ' Q' + C.x + ',' + C.y + ' ' + E.x + ',' + E.y, class: 'dk-ln ' + m.kind + (m.lost ? ' lost' : ''), pathLength: 1 });
    var head = m.lost ? null : S('path', { d: 'M0,0 L-9,-4.5 L-9,4.5 Z', class: 'dk-head ' + m.kind, transform: 'translate(' + E.x + ',' + E.y + ') rotate(' + ang + ')' });
    var L = at((m.labelAt != null ? m.labelAt : (m.lost ? 0.3 : 0.5)) * f);
    var lbl = m.label ? S('text', { x: L.x + (m.labelDx || 0), y: L.y + (m.labelDy != null ? m.labelDy : -9), class: 'dk-lbl' + (m.lost || m.kind === 'err' ? ' lost' : ''), text: m.label }) : null;
    var xmark = m.lost ? S('g', { transform: 'translate(' + E.x + ',' + E.y + ')' }, DK.icons.cross(12)) : null;
    [line, head, lbl, xmark].forEach(function (n) { if (n) { gMsgs.append(n); if (dim) n.style.opacity = 0.4; } });
    if (!live) return;
    var opts = { duration: DUR, delay: delay, fill: 'both', easing: 'ease-in-out' };
    line.style.strokeDasharray = 1;
    line.animate([{ strokeDashoffset: 1 }, { strokeDashoffset: 0 }], opts);
    if (lbl) lbl.animate([{ opacity: 0 }, { opacity: 1 }], { duration: 250, delay: delay, fill: 'both' });
    var after = { duration: 160, delay: delay + DUR - 40, fill: 'both' };
    if (head) head.animate([{ opacity: 0 }, { opacity: 1 }], after);
    if (xmark) xmark.animate([{ opacity: 0 }, { opacity: 1 }], after);
    var pk = S('circle', { r: 6, class: 'dk-pk-' + m.kind });
    pk.style.opacity = 0;
    gMsgs.append(pk);
    var frames = [], N = 24, k, p;
    for (k = 0; k <= N; k++) {
      p = at((k / N) * f);
      frames.push({ transform: 'translate(' + p.x + 'px,' + p.y + 'px)', opacity: k === N ? 0 : 1, offset: k === N ? 1 : (k / N) * 0.92 });
    }
    pk.animate(frames, opts);
  }

  function drawMsg(m, current, animate, k) {
    var r = route(m), live = current && animate, delay = live ? k * STAG : 0;
    if (r.curved) { curve(r, m, live, delay, !current); return; }
    DK.flow.arrow(gMsgs, {
      x1: r.x1, y1: r.y1, x2: r.x2, y2: r.y2, kind: m.kind, label: m.label, lost: m.lost, labelAt: m.labelAt,
      labelDy: m.labelDy !== undefined ? m.labelDy : (horizontal(r) ? -8 : undefined),
      labelSide: m.labelSide || (horizontal(r) ? undefined : 'right'),
      animate: live, delay: delay, dur: DUR, dim: !current,
    });
  }

  function setSteps(list) { steps = list; build(); }

  function render(i, animate) {
    t.clear();
    gMsgs.replaceChildren();
    var step = steps[i];
    for (var s = 0; step && s <= i; s++) {
      if (o.trail === 'phase' && steps[s].phase !== step.phase) continue;
      steps[s].msgs.forEach(function (m, k) { drawMsg(m, steps[s] === step, animate, k); });
    }
    var texts = {};
    for (var q = 0; q <= i; q++) { var sb = steps[q].sub || {}; for (var id in sb) texts[id] = sb[id]; }
    Object.keys(subEls).forEach(function (id) { subEls[id].textContent = texts[id] !== undefined ? texts[id] : byId[id].sub; });
    var focus = (step && step.focus) || [];
    var ringsOn = step ? (step.rings || focus.map(function (id) { return byId[id] && byId[id].ring; })) : [];
    Object.keys(nodeEls).forEach(function (id) { nodeEls[id].classList.toggle('on', focus.indexOf(id) >= 0); });
    Object.keys(ringEls).forEach(function (id) { ringEls[id].classList.toggle('on', ringsOn.indexOf(id) >= 0); });
    select(null);
    return { animMs: step && animate ? step.msgs.length * STAG + 120 : 0 };
  }

  return { setSteps: setSteps, render: render, msgDuration: STAG };
};
