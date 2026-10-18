// DOCS: .agents/skills/docusaurus_animated_diagrams/references/kit-api.md (API) y SKILL.md (proceso). Copia maestra unica del kit.
/* dk-sequence.js: motor de diagramas de secuencia animados (cliente/servidor, request/response, handshakes...).
 * Requiere dk-kit.js, dk-icons.js y dk-flow.js, y los estilos de dk-base.css. Dibuja; no tiene controles (los pone dk-player.js).
 *
 *   var scene = DK.sequence({
 *     svg: elementoSvg,
 *     actors: [ { id: 'client', label: 'Cliente', icon: 'laptop', tray: 'mensaje a enviar' },
 *               { id: 'server', label: 'Servidor', icon: 'server', tray: 'piezas recibidas' } ],
 *     phases: ['Conectar', 'Transferir', 'Cerrar'],   // bandas de fondo con su nombre
 *     idleState: 'Sin conexión',                       // texto del chip antes del primer paso
 *     trayCount: 4,                                    // casilleros por bandeja (0 = sin bandejas)
 *   });
 *   scene.setSteps(steps);       // los pasos son DATOS (ver abajo); se calcula el layout
 *   scene.render(i, animate);    // muestra hasta el paso i (-1 = vacío); anima solo el último paso
 *
 * Un paso:
 *   { phase: 0, title, caption,
 *     msgs:  [ { from: 'client', to: 'server', label: 'SYN', kind: 'ctl'|'ack'|'data', piece: 3, lost: true } ],
 *     state: { client: 'Conectando', server: 'Escuchando' },   // texto del chip de cada actor al terminar el paso
 *     tray:  { server: [1, 2, 4] } }                           // casilleros llenos de cada bandeja
 */
DK.sequence = function (o) {
  var S = DK.svg;
  var W = o.width || 640, GAP = o.gap || 24, SLANT = o.slant || 8, DUR = o.dur || 700, STAG = DUR * 0.85;
  var MARGIN = o.margin || 130, TRAY = o.trayCount || 0;
  var Y0 = o.firstRowY || (TRAY ? 160 : 124); // sin bandejas de piezas, las filas empiezan mas arriba
  var n = o.actors.length;
  var actors = o.actors.map(function (a, i) {
    return { id: a.id, label: a.label, icon: a.icon, tray: a.tray, x: n > 1 ? MARGIN + i * (W - 2 * MARGIN) / (n - 1) : W / 2 };
  });
  var A = {};
  actors.forEach(function (a) { A[a.id] = a; });

  var steps = [], totalRows = 0;
  var t = DK.timers();
  var layers = {}, chipTxt = {}, trayG = {};

  var rowY = function (r) { return Y0 + r * GAP; };

  function setSteps(list) {
    steps = list;
    var rows = 0;
    steps.forEach(function (s) { s.msgs.forEach(function (m) { m.row = rows++; }); });
    totalRows = rows;
    build();
  }

  // ---------- parte fija: bandas, lineas de vida, actores ----------
  function build() {
    var svg = o.svg;
    svg.replaceChildren();
    var H = Y0 + totalRows * GAP + 16;
    svg.setAttribute('viewBox', '0 0 ' + W + ' ' + H);
    layers = { bands: S('g'), life: S('g'), head: S('g'), msgs: S('g') };

    var first = {}, last = {};
    steps.forEach(function (s) { s.msgs.forEach(function (m) { if (first[s.phase] === undefined) first[s.phase] = m.row; last[s.phase] = m.row; }); });
    o.phases.forEach(function (name, p) {
      if (first[p] === undefined) return;
      var top = rowY(first[p]) - 11, bottom = rowY(last[p]) + SLANT + 1;
      layers.bands.appendChild(S('rect', { x: 4, y: top, width: W - 8, height: bottom - top, rx: 10, class: 'dk-band', 'data-p': p }));
      layers.bands.appendChild(S('text', { x: 12, y: top + 14, class: 'dk-bandlbl', 'data-p': p, text: (p + 1) + ' · ' + name.toUpperCase() }));
    });

    actors.forEach(function (a) {
      layers.life.appendChild(S('line', { x1: a.x, y1: Y0 - 14, x2: a.x, y2: H - 6, class: 'dk-life' }));
      if (a.icon && DK.icons[a.icon]) layers.head.appendChild(DK.icons[a.icon]({ x: a.x, y: 8 }));
      layers.head.appendChild(S('text', { x: a.x, y: 66, class: 'dk-who', text: a.label }));
      layers.head.appendChild(S('rect', { x: a.x - 50, y: 74, width: 100, height: 20, rx: 10, class: 'dk-chip' }));
      chipTxt[a.id] = S('text', { x: a.x, y: 88, class: 'dk-chiptxt' });
      layers.head.appendChild(chipTxt[a.id]);
      if (TRAY && a.tray) {
        trayG[a.id] = S('g');
        layers.head.append(trayG[a.id], S('text', { x: a.x, y: 140, class: 'dk-slotlbl', text: a.tray }));
      }
    });
    svg.append(layers.bands, layers.life, layers.head, layers.msgs);
  }

  function drawTray(id, filled) {
    var g = trayG[id];
    if (!g) return;
    g.replaceChildren();
    var x0 = A[id].x - (TRAY * 26 - 6) / 2;
    for (var i = 0; i < TRAY; i++) {
      var x = x0 + i * 26;
      if (filled.indexOf(i + 1) >= 0) {
        var p = DK.icons.piece(i + 1, 20);
        p.setAttribute('transform', 'translate(' + (x + 10) + ',119)');
        g.appendChild(p);
      } else g.appendChild(S('rect', { x: x, y: 109, width: 20, height: 20, rx: 4, class: 'dk-slot' }));
    }
  }

  // ---------- un mensaje (flecha + paquete): el dibujo vive en dk-flow.js ----------
  function drawMsg(m, animate, delay) {
    var from = A[m.from], to = A[m.to];
    var right = to.x > from.x;
    var y1 = rowY(m.row);
    DK.flow.arrow(layers.msgs, {
      x1: from.x + (right ? 6 : -6), y1: y1, x2: to.x + (right ? -6 : 6), y2: y1 + SLANT,
      kind: m.kind, label: m.label, lost: m.lost, piece: m.piece,
      animate: animate, delay: delay, dur: DUR,
    });
  }

  // ---------- mostrar hasta el paso i ----------
  function render(i, animate) {
    t.clear();
    layers.msgs.replaceChildren();
    var step = steps[i];
    for (var s = 0; s <= i; s++) {
      steps[s].msgs.forEach(function (m, k) {
        var live = s === i && animate;
        drawMsg(m, live, live ? k * STAG : 0);
      });
    }
    var animMs = step && animate ? step.msgs.length * STAG + 120 : 0;
    // chips y bandejas cambian cuando la flecha llega
    var apply = function () {
      actors.forEach(function (a) {
        chipTxt[a.id].textContent = (step && step.state && step.state[a.id]) || (step && step.state && step.state['*']) || (step ? chipTxt[a.id].textContent : o.idleState || '');
        if (trayG[a.id]) drawTray(a.id, (step && step.tray && step.tray[a.id]) || []);
      });
    };
    if (animMs) t.later(apply, animMs); else apply();
    o.svg.querySelectorAll('[data-p]').forEach(function (nd) {
      nd.classList.toggle('on', !!step && Number(nd.getAttribute('data-p')) === step.phase);
    });
    return { animMs: animMs };
  }

  return {
    setSteps: setSteps,
    render: render,
    steps: function () { return steps; },
    msgDuration: STAG,
  };
};
