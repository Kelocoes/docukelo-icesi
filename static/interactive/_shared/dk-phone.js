// DOCS: .agents/skills/docusaurus_animated_diagrams/references/kit-api.md (API) y SKILL.md (proceso). Copia maestra unica del kit.
/* dk-phone.js: un teléfono con la app que se está explicando + lo que pasa "por dentro".
 * A la izquierda, la pantalla de la app (HTML con estilo Material, que el estudiante puede TOCAR en el modo libre).
 * Arriba, el camino del evento (Toque > callback > setState > dirty > build() > Pantalla) con su aviso. A la derecha del
 * teléfono: el árbol de widgets dibujado como árbol (DK.tree: quién es dirty, quién se reconstruye, quién se reutiliza
 * por ser const) y, debajo, el objeto State con sus campos (lo que cambia se resalta) y la consola de debugPrint.
 * En pantallas de menos de 700 px el árbol y (inspector + consola) pasan a dos pestañas con un punto de aviso, para que
 * la pieza no se alargue. El código sincronizado lo pone DK.player (opción code).
 * Es una escena para DK.player. Requiere dk-kit.js, dk-tree.js y los estilos de dk-base.css.
 *
 *   scene: function (svg, stage, api) {
 *     return DK.phone({
 *       stage: stage, api: api,                       // api.code(lineas) resalta líneas del panel de código (modo libre)
 *       title: 'Contador',                            // título de la AppBar
 *       height: 380,                                  // alto de la pantalla del teléfono en px (por defecto 446)
 *       className: '_ContadorPageState',              // cabecera del inspector
 *       init: { _contador: 0 },                       // estado inicial (solo valores JSON)
 *       fields: [ { key: '_contador', type: 'int' } ],   // campos del State; show: (valor, estado) => texto  (opcional)
 *       view: function (s) { return '<p class="pf-big">' + s._contador + '</p>'; },   // HTML de la pantalla
 *       tree: [ { id: 'page', label: 'ContadorPage', d: 0, state: true }, { id: 't', label: 'Text', sub: "'Clics:'", d: 1, k: 'const' } ],
 *                                                     // filas en orden de recorrido; d = profundidad; label corto (~14 caracteres);
 *                                                     // sub = 2.ª línea (string o función (estado) => texto); when: (estado) => bool oculta la fila
 *       pipeline: ['Toque', 'Callback', 'setState', 'dirty', 'build()', 'Pantalla'],   // 6 chips (opcional)
 *       buildLog: function (s) { return 'build() ejecutado. Valor: ' + s._contador; },   // línea que imprime build() en la consola
 *       initLog: [...],                               // consola antes del primer paso
 *       introNote: '...',                             // aviso bajo el camino antes del primer paso (hay uno por defecto)
 *       treeWidth: 560,                               // ancho del dibujo del árbol (por defecto se calcula con el número de hojas)
 *       freeInit: {...},                              // estado con el que arranca el modo libre (por defecto, init)
 *       panels: ['state', 'tree', 'console'],         // cuáles mostrar (por defecto los tres)
 *       actions: { inc: function (s, arg) { s._contador++; return { set: true, code: [5, 6], log: [], snack: '', note: '' }; } },
 *       input: function (s, key, value) { s.nombre = value; return { note: '...', code: [3], self: 'tfNombre' }; },
 *     });
 *   }
 *
 * Elementos tocables de la pantalla: data-act="accion" [data-arg="x"]. Campos de texto: data-in="clave".
 * Un paso (modo guiado; cada paso hereda el state y la consola de los anteriores):
 *   { phase, title, caption, msgs: [], dwell: 3500,
 *     state: { _contador: 1 },        // campos que cambian (se acumulan)
 *     changed: ['_contador'],         // filas del inspector resaltadas
 *     stale: true,                    // la pantalla NO se ha reconstruido aún: sigue mostrando el estado anterior
 *     tap: 'inc' | 'del:2',           // un dedo toca ese elemento
 *     snack: 'texto',                 // aparece un SnackBar en la pantalla
 *     stage: 2, block: 2,             // chip activo del camino; block = chip donde el flujo se corta (no se llamó a setState)
 *     tree: 'dirty' | 'build' | { page: 'dirty', t: 'reuse' },   // marcas del árbol (dirty | build | reuse | self)
 *     log: ['línea de consola'],      // líneas que se AGREGAN a la consola en este paso
 *     note: 'texto bajo el camino',
 *     free: true }                    // modo libre: el estudiante toca la pantalla; las acciones corren de verdad
 * Resultado de una acción (modo libre): { set: true|false, code: [líneas], log: [líneas], snack: 'texto', note: 'texto' }.
 *   set: true recorre todo el camino (setState, dirty, build, pantalla); set: false lo corta en setState.
 */
DK.phone = function (o) {
  var el = DK.el;
  var t = DK.timers();
  var steps = [];
  var live = null, freeOn = false, pending = null;
  var PIPE = o.pipeline || ['Toque', 'Callback', 'setState', 'dirty', 'build()', 'Pantalla'];
  var panels = o.panels || ['state', 'tree', 'console'];
  var D = 430;
  var clone = function (x) { return JSON.parse(JSON.stringify(x)); };
  var esc = DK.phone.esc;

  // ---------- teléfono ----------
  var body = el('div', { class: 'pf-body' });
  var snack = el('div', { class: 'pf-snack' });
  var finger = el('div', { class: 'dk-finger' });
  var screen = el('div', { class: 'dk-phone-screen' }, el('div', { class: 'pf-appbar', text: o.title || 'App' }), body, snack, finger);
  var phone = el('div', { class: 'dk-phone', 'aria-label': 'Pantalla del teléfono (simulada)' }, el('i', { class: 'dk-phone-cam' }), screen);
  if (o.height) screen.style.setProperty('--ph-h', o.height + 'px');
  var hint = el('p', { class: 'dk-ph-hint' });
  var resetBtn = el('button', { class: 'dk-ph-reset', text: 'Restablecer', onclick: function () { enterFree(); } });
  var left = el('div', { class: 'dk-ph-left' }, phone, hint, resetBtn);

  // ---------- camino del evento ----------
  var chips = PIPE.map(function (name) { return el('span', { class: 'chip', text: name }); });
  var pipe = el('div', { class: 'dk-pipe' });
  chips.forEach(function (c, k) { if (k) pipe.appendChild(el('i', { class: 'arr', text: '›' })); pipe.appendChild(c); });
  var note = el('p', { class: 'dk-pnote' });

  // ---------- inspector del State ----------
  var rowsEl = {}, valEl = {};
  var inspect = el('div', { class: 'dk-pbox dk-inspect' }, el('div', { class: 'hd' }, el('b', { text: o.className || 'State' }), el('small', { text: 'vive en memoria' })));
  var inspBody = el('div', { class: 'bd' });
  (o.fields || []).forEach(function (f) {
    valEl[f.key] = el('span', { class: 'val' });
    rowsEl[f.key] = el('div', { class: 'row' }, el('span', { class: 'ty', text: f.type || '' }), el('span', { class: 'nm', text: f.key }), el('span', { class: 'eq', text: '=' }), valEl[f.key]);
    inspBody.appendChild(rowsEl[f.key]);
  });
  inspect.appendChild(inspBody);

  // ---------- árbol de widgets: un árbol de verdad (DK.tree: nodos y ramas), con las marcas como roles ----------
  var treeBody = el('div', { class: 'bd' });
  // la leyenda va en HTML en la cabecera (dentro del dibujo ocupaba alto)
  var legend = el('span', { class: 'dk-tleg' });
  [['dirty', 'Dirty'], ['build', 'build()'], ['reuse', 'const: reutilizado']].concat(o.input ? [['self', 'se repinta solo']] : []).forEach(function (x) {
    legend.appendChild(el('span', { class: 'lg-' + x[0] }, el('i'), x[1]));
  });
  var treeBox = el('div', { class: 'dk-pbox dk-wtree' }, el('div', { class: 'hd' }, el('b', { text: 'Árbol de widgets' }), legend), treeBody);
  var MARK = { dirty: 'dirty', build: 'build()', reuse: 'reutilizado', self: 'se repinta solo' };
  var treeScene = null, treeStep = null, treeCentered = false, flag = { changed: false, log: false };
  if (o.tree) {
    var last = [];   // el padre de una fila es la fila anterior con un nivel menos (las filas van en orden de recorrido)
    var tnodes = o.tree.map(function (r) {
      // un sub dinámico (función) también reserva su línea: si no, el rótulo se dibuja centrado y se monta con el sub
      var n = { id: r.id, label: r.label, sub: typeof r.sub === 'string' ? r.sub : (r.sub ? ' ' : ''), parent: r.d ? last[r.d - 1] : undefined };
      last[r.d] = r.id;
      return n;
    });
    var tsvg = DK.svg('svg', { class: 'dk-treesvg', role: 'img', 'aria-label': 'Árbol de widgets' });
    // ancho del dibujo según el número de hojas (así los nodos caben y no queda aire de sobra); en pantallas angostas el
    // dibujo conserva su tamaño y se desplaza horizontalmente (ver .dk-wtree en dk-base.css)
    var isParent = {};
    tnodes.forEach(function (n) { if (n.parent) isParent[n.parent] = true; });
    var leaves = tnodes.filter(function (n) { return !isParent[n.id]; }).length;
    var tw = o.treeWidth || Math.max(520, leaves * 132 + 48);
    // el contenedor fija el tamaño (la regla .dk-wide del player quita el max-width de cualquier svg, por eso no va en el svg)
    var twrap = el('div', { class: 'dk-treewrap' }, tsvg);
    twrap.style.minWidth = tw + 'px';
    twrap.style.maxWidth = Math.round(tw * 1.15) + 'px';
    treeBody.append(el('p', { class: 'dk-tree-hint', text: 'Desliza hacia los lados para ver todo el árbol' }), twrap);
    treeScene = DK.tree({ svg: tsvg, width: tw, nodeW: 116, nodeH: 50, levelGap: 62, top: 22, nodes: tnodes });
    treeStep = { phase: 0, title: '', caption: '', msgs: [], roles: {}, tags: {}, sub: {} };
    treeScene.setSteps([treeStep]);
  }

  // ---------- consola ----------
  var conBody = el('div', { class: 'bd' });
  var conBox = el('div', { class: 'dk-pbox dk-console' }, el('div', { class: 'hd' }, el('b', { text: 'Consola' }), el('small', { text: 'debugPrint' })), conBody);

  // distribución compacta (para que la pieza quepa en una pantalla): el camino y su aviso en una sola fila; a la derecha del
  // teléfono, el árbol arriba y el inspector y la consola lado a lado debajo. En celular (< 700 px) el árbol y
  // (inspector + consola) pasan a dos pestañas: se ve un panel a la vez y un punto avisa cuál cambió en el paso.
  var showTree = panels.indexOf('tree') >= 0 && !!o.tree;
  var panelRow = el('div', { class: 'dk-ppanels' }, panels.indexOf('state') >= 0 ? inspect : null, panels.indexOf('console') >= 0 ? conBox : null);
  var tabBtns = {};
  var tabs = el('div', { class: 'dk-ptabs' });
  [['state', 'Estado y consola'], ['tree', 'Árbol de widgets']].forEach(function (x) {
    tabBtns[x[0]] = el('button', { text: x[1], class: x[0] === 'state' ? 'on' : '', onclick: function () { setTab(x[0]); } });
    if (x[0] === 'tree' && !showTree) return;
    tabs.appendChild(tabBtns[x[0]]);
  });
  var right = el('div', { class: 'dk-ph-right' }, tabs, showTree ? treeBox : null, panelRow);
  var top = el('div', { class: 'dk-ptop' }, pipe, note);
  var wrap = el('div', { class: 'dk-ph', 'data-tab': 'state' }, top, left, right);
  function setTab(k) {
    wrap.setAttribute('data-tab', k);
    Object.keys(tabBtns).forEach(function (j) { tabBtns[j].classList.toggle('on', j === k); });
  }
  function dot(k, on) { if (tabBtns[k]) tabBtns[k].classList.toggle('dot', !!on); }
  o.stage.replaceChildren(wrap);

  // ---------- pintores ----------
  function fmt(v) {
    if (typeof v === 'string') return "'" + v + "'";
    if (Array.isArray(v)) return '[' + v.length + ' elementos]';
    if (v && typeof v === 'object') return JSON.stringify(v);
    return String(v);
  }
  function paintState(s, changed) {
    (o.fields || []).forEach(function (f) {
      var txt = f.show ? f.show(s[f.key], s) : fmt(s[f.key]);
      valEl[f.key].textContent = txt;
      valEl[f.key].classList.toggle('ml', txt.indexOf('\n') >= 0); // valor de varias líneas: va debajo del nombre
      rowsEl[f.key].classList.toggle('chg', !!changed && changed.indexOf(f.key) >= 0);
    });
    flag.changed = !!(changed && changed.length); dot('state', flag.changed || flag.log);   // punto en la pestaña (solo celular)
  }
  function paintScreen(s) {
    body.innerHTML = o.view(s);
    body.toggleAttribute('inert', !freeOn);
  }
  function paintTree(s, marks) {
    if (!treeScene) return;
    var roles = {}, tags = {}, subs = {}, hidden = {}, parent = [];
    o.tree.forEach(function (r) {
      var p = r.d ? parent[r.d - 1] : null;
      parent[r.d] = r.id;
      if ((r.when && !r.when(s)) || (p && hidden[p])) { hidden[r.id] = true; roles[r.id] = 'hide'; return; }
      if (typeof r.sub === 'function') subs[r.id] = r.sub(s);
      var m = marks && marks[r.id];
      if (m) {
        roles[r.id] = m;   // dirty | build | reuse | self: son roles de DK.tree
        tags[r.id] = (r.state ? 'State · ' : '') + MARK[m];
      } else if (r.state) { roles[r.id] = 'owner'; tags[r.id] = 'State'; }
      else if (r.k === 'const') tags[r.id] = 'const';
    });
    treeStep.roles = roles; treeStep.tags = tags; treeStep.sub = subs;
    treeScene.render(0, false);
    dot('tree', marks && Object.keys(marks).length);
    if (!treeCentered && treeBody.clientWidth) {   // en pantallas angostas, abrir el desplazamiento en el centro (la raíz)
      treeCentered = true;
      treeBody.scrollLeft = (treeBody.scrollWidth - treeBody.clientWidth) / 2;
    }
  }
  function computeMarks(kind) {
    var marks = {}, tr = o.tree || [];
    var oi = -1;
    tr.forEach(function (r, i) { if (oi < 0 && r.state) oi = i; });
    if (oi < 0) return marks;
    var owner = tr[oi];
    if (kind === 'dirty') { marks[owner.id] = 'dirty'; return marks; }
    marks[owner.id] = 'build';
    var skip = null;
    for (var j = oi + 1; j < tr.length && tr[j].d > owner.d; j++) {
      var r = tr[j];
      if (skip !== null && r.d > skip) continue;
      skip = null;
      if (r.k === 'const') { marks[r.id] = 'reuse'; skip = r.d; } else marks[r.id] = 'build';
    }
    return marks;
  }
  function paintConsole(lines, flashLast) {
    conBody.replaceChildren();
    lines.forEach(function (l, k) {
      conBody.appendChild(el('div', { class: 'ln' + (flashLast && k === lines.length - 1 ? ' new' : ''), text: l }));
    });
    conBody.scrollTop = conBody.scrollHeight;
    flag.log = !!flashLast; dot('state', flag.changed || flag.log);
  }
  function paintPipe(stage, block) {
    chips.forEach(function (c, k) {
      var cls = 'chip';
      if (block !== undefined && block !== null && block >= 0) {
        if (k === block) cls += ' blocked';
        else if (k > block) cls += ' muted';
        else if (k <= stage) cls += k === stage ? ' cur' : ' done';
      } else if (k === stage) cls += ' cur';
      else if (k < stage) cls += ' done';
      c.className = cls;
    });
  }
  function setNote(txt, info) { note.textContent = txt || ''; note.hidden = !txt; note.classList.toggle('info', !!info); }
  function hideSnack() { snack.classList.remove('on'); }
  function showSnack(txt) {
    snack.textContent = txt; snack.classList.add('on');
    t.later(hideSnack, 2600);
  }

  function tapAt(name) {
    var p = String(name).split(':');
    var sel = '[data-act="' + p[0] + '"]' + (p[1] !== undefined ? '[data-arg="' + p[1] + '"]' : '');
    var target = body.querySelector(sel);
    if (!target) return;
    var r = target.getBoundingClientRect(), s = screen.getBoundingClientRect();
    finger.style.left = (r.left - s.left + Math.min(r.width / 2, 90)) + 'px';
    finger.style.top = (r.top - s.top + r.height / 2) + 'px';
    finger.classList.remove('go'); void finger.offsetWidth; finger.classList.add('go');
    target.classList.add('pressed');
    t.later(function () { target.classList.remove('pressed'); }, 450);
  }

  // ---------- estado efectivo de un paso ----------
  function effective(i) {
    var s = clone(o.init);
    for (var q = 0; q <= i; q++) {
      var st = steps[q].state;
      if (st) Object.keys(st).forEach(function (k) { s[k] = clone(st[k]); });
    }
    return s;
  }
  function uiIndex(i) { var j = i; while (j >= 0 && steps[j].stale) j--; return j; }
  function logsUpTo(i) {
    var a = (o.initLog || []).slice();
    for (var q = 0; q <= i; q++) a = a.concat(steps[q].log || []);
    return a;
  }

  // ---------- modo libre: las acciones corren de verdad ----------
  var logs = [];
  function enterFree() {
    t.clear(); pending = null; hideSnack();
    live = clone(o.freeInit || o.init);
    logs = (o.initLog || []).slice();
    paintScreen(live); paintState(live, []); paintTree(live, {}); paintConsole(logs, false);
    paintPipe(-1); setNote('');
  }
  function codeLines(l) { if (l && o.api) o.api.code(l); }

  function run(name, arg) {
    var act = o.actions && o.actions[name];
    if (!act) return;
    if (pending) { t.clear(); pending(); }
    var before = {};
    (o.fields || []).forEach(function (f) { before[f.key] = JSON.stringify(live[f.key]); });
    var res = act(live, arg) || {};
    var changed = (o.fields || []).filter(function (f) { return JSON.stringify(live[f.key]) !== before[f.key]; }).map(function (f) { return f.key; });
    var seq = [];
    var uiNow = function () { paintScreen(live); };
    seq.push(function () { paintPipe(0); paintTree(live, {}); setNote(''); });
    seq.push(function () {
      paintPipe(1); codeLines(res.code);
      paintState(live, changed);
      if (res.log && res.log.length) { logs = logs.concat(res.log); paintConsole(logs, true); }
      if (res.snack) showSnack(res.snack);
    });
    if (res.set) {
      seq.push(function () { paintPipe(2); });
      seq.push(function () { paintPipe(3); paintTree(live, computeMarks('dirty')); });
      seq.push(function () {
        paintPipe(4); paintTree(live, computeMarks('build'));
        if (o.buildLog) { logs = logs.concat([o.buildLog(live)]); paintConsole(logs, true); }
      });
      seq.push(function () { paintPipe(5); uiNow(); paintTree(live, computeMarks('build')); setNote(res.note || 'La pantalla ya muestra el estado nuevo.'); });
    } else {
      seq.push(function () {
        paintPipe(1, 2);
        setNote(res.note || (changed.length ? 'La variable cambió, pero nadie le avisó al framework: no hay setState, no hay dirty, no hay build(). La pantalla sigue igual.' : 'Nada cambió en el estado.'));
      });
    }
    var done = 0;
    pending = function () { while (done < seq.length) seq[done++](); pending = null; };
    seq.forEach(function (fn, k) { t.later(function () { done = Math.max(done, k + 1); fn(); if (done >= seq.length) pending = null; }, k * D); });
    if (DK.reduced) { t.clear(); pending(); }
  }

  body.addEventListener('click', function (e) {
    if (!freeOn) return;
    var n = e.target.closest ? e.target.closest('[data-act]') : null;
    if (!n || !body.contains(n)) return;
    e.preventDefault();
    run(n.getAttribute('data-act'), n.getAttribute('data-arg'));
  });
  body.addEventListener('input', function (e) {
    if (!freeOn || !o.input) return;
    var key = e.target.getAttribute && e.target.getAttribute('data-in');
    if (!key) return;
    if (pending) { t.clear(); pending(); }
    var before = {};
    (o.fields || []).forEach(function (f) { before[f.key] = JSON.stringify(live[f.key]); });
    var res = o.input(live, key, e.target.value) || {};
    var changed = (o.fields || []).filter(function (f) { return JSON.stringify(live[f.key]) !== before[f.key]; }).map(function (f) { return f.key; });
    paintState(live, changed);
    paintPipe(-1);
    paintTree(live, res.self ? (function () { var m = {}; m[res.self] = 'self'; return m; })() : {});
    codeLines(res.code);
    setNote(res.note || '');
  });

  // ---------- contrato con DK.player ----------
  function setSteps(list) { steps = list; }

  function render(i, animate) {
    t.clear(); pending = null; hideSnack();
    var step = steps[i];
    freeOn = !!(step && step.free);
    phone.classList.toggle('free', freeOn);
    resetBtn.hidden = !freeOn;
    hint.textContent = freeOn ? (o.hint || 'Toca los botones del teléfono y mira el camino a la derecha.') : 'Simulación: lo que ve el usuario';
    hint.classList.toggle('live', freeOn);
    if (freeOn) { enterFree(); return { animMs: 0 }; }
    var st = effective(i), ui = effective(uiIndex(i));
    paintScreen(ui);
    paintState(st, step && step.changed);
    var marks = {};
    if (step && step.tree) marks = typeof step.tree === 'string' ? computeMarks(step.tree) : step.tree;
    paintTree(ui, marks);
    paintConsole(logsUpTo(i), !!(step && step.log && step.log.length && animate));
    paintPipe(step && step.stage !== undefined ? step.stage : -1, step ? step.block : undefined);
    // antes del primer paso, el camino vacío se explica: así la pieza no parece "apagada"
    if (step) setNote(step.note); else setNote(o.introNote || 'Cada toque en la app recorre este camino. Pulsa Siguiente y míralo paso a paso.', true);
    finger.classList.remove('go');
    if (step && step.tap && animate) t.later(function () { tapAt(step.tap); }, 120);
    if (step && step.snack && animate) t.later(function () { showSnack(step.snack); }, 700);
    return { animMs: 0 };
  }

  return { setSteps: setSteps, render: render, msgDuration: 0 };
};

/* Utilidades para escribir la pantalla del teléfono */
DK.phone.esc = function (s) { return String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;'); };
DK.phone.icon = function (name) {
  var P = {
    add: 'M12 5v14M5 12h14', check: 'M5 12.5l4.5 4.5L19 7.5', refresh: 'M20 12a8 8 0 1 1-2.6-5.9M20 4v5h-5',
    del: 'M5 7h14M10 7V5h4v2M7 7l1 12h8l1-12', person: 'M12 12a4 4 0 1 0 0-8 4 4 0 0 0 0 8zM4.5 20c.8-3.6 3.7-5.5 7.5-5.5s6.7 1.9 7.5 5.5',
    mail: 'M4 6h16v12H4zM4 7l8 6 8-6', phone: 'M7 4h3l1.5 4-2 1.3a10 10 0 0 0 5.2 5.2L16 12.5l4 1.5v3a2 2 0 0 1-2 2A14 14 0 0 1 5 6a2 2 0 0 1 2-2z',
  };
  return '<svg class="pf-ic" viewBox="0 0 24 24" aria-hidden="true"><path d="' + (P[name] || '') + '"/></svg>';
};
