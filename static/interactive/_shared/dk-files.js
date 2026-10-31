// DOCS: .agents/skills/docusaurus_animated_diagrams/references/kit-api.md (API) y SKILL.md (proceso). Copia maestra unica del kit.
/* dk-files.js: un EXPLORADOR DE ARCHIVOS con la salida de `tree -L`. Cada archivo o carpeta es una linea que se puede señalar con
 * el mouse (o tocar, o enfocar con el teclado): al lado aparece para que sirve, que contiene y un fragmento de codigo. Los pasos
 * pueden hacer aparecer carpetas nuevas (una convencion propuesta), enfocar una linea o mostrar solo un subarbol (`tree src`).
 * Es una escena para DK.player (usar wide: true). Requiere dk-kit.js (DK.highlight para el codigo).
 *
 *   scene: function (svg, stage) {
 *     return DK.files({
 *       stage: stage,
 *       items: [                                        // en el orden en que los imprimiria `tree --dirsfirst`
 *         { path: 'src/', purpose: 'Todo tu código.', points: ['...'], edit: 'always' },                    // termina en / = carpeta
 *         { path: 'src/main.jsx', purpose: 'El punto de entrada.', points: ['...'], code: '...', codeTitle: 'main.jsx', edit: 'sometimes' },
 *         { path: 'src/hooks/', purpose: '...', isNew: true, hidden: true },                                 // aparece con show
 *       ],
 *     });
 *   }
 * edit: 'always' | 'sometimes' | 'never' -> etiqueta "Lo editas siempre / a veces / casi nunca". isNew: etiqueta "Convención propuesta" y linea
 * resaltada (para lo que NO entrega Vite). id (opcional) por defecto es el path.
 *
 * Un paso:
 *   { phase, title, caption, msgs: [],
 *     focus: 'src/main.jsx',        // linea iluminada mientras el mouse no toque nada
 *     show: ['src/hooks/'],         // hace aparecer elementos ocultos (se acumulan)
 *     base: 'src/',                 // solo el subarbol de esa carpeta (como `tree -L 2 src`); sin base, todo desde la raiz (`.`)
 *     depth: 2 }                    // niveles que muestra (-L); por defecto 3 sin base y 2 con base
 * La linea de comando del encabezado y el resumen final ("3 directories, 14 files") se calculan solos.
 */
DK.files = function (o) {
  var el = DK.el;
  var items = o.items, byId = {}, steps = [], cur = -1, hover = null, pinned = null;
  var EDIT = { always: ['Lo editas siempre', 'ack'], sometimes: ['Lo editas a veces', 'ctl'], never: ['Casi nunca lo editas', 'muted'] };

  items.forEach(function (it) {
    it.id = it.id || it.path;
    it.isDir = /\/$/.test(it.path);
    var parts = it.path.replace(/\/$/, '').split('/');
    it.name = parts[parts.length - 1] + (it.isDir ? '/' : '');
    it.depth = parts.length;                                      // 1 = hijo de la raiz
    it.parentPath = parts.length > 1 ? parts.slice(0, -1).join('/') + '/' : '';
    byId[it.id] = it;
  });

  if (!document.getElementById('dk-files-css')) {
    var st = document.createElement('style');
    st.id = 'dk-files-css';
    st.textContent = [
      '.dkf { display: grid; grid-template-columns: minmax(0, 1.05fr) minmax(0, 1fr); gap: 14px; align-items: start; }',
      '.dkf-term { min-width: 0; border: 1px solid var(--dk-line); border-radius: 12px; background: var(--dk-card); overflow: hidden; }',
      '.dkf-cmd { display: flex; gap: 8px; padding: 8px 14px; border-bottom: 1px solid var(--dk-line); background: var(--dk-band); font: 600 12.5px ui-monospace, Consolas, monospace; color: var(--dk-ink); }',
      '.dkf-cmd .pr { color: var(--dk-ack); font-weight: 700; } .dkf-cmd .tx { color: var(--dk-muted); word-break: break-word; }',
      '.dkf-lines { padding: 6px 0; max-height: 540px; overflow-y: auto; font: 13.5px/1.55 ui-monospace, "JetBrains Mono", Consolas, monospace; }',
      '.dkf-ln { display: flex; align-items: baseline; padding: 1px 14px 1px 11px; border-left: 3px solid transparent; cursor: pointer; white-space: pre; outline: none; transition: background .15s; }',
      '.dkf-ln .art { color: var(--dk-muted); opacity: .8; }',
      '.dkf-ln .nm { color: var(--dk-ink); } .dkf-ln.dir .nm { color: var(--dk-ctl); font-weight: 700; }',
      '.dkf-ln .new { margin-left: 10px; padding: 0 7px; border-radius: 8px; background: var(--dk-data); color: var(--dk-card); font: 700 10.5px/17px system-ui, sans-serif; }',
      '.dkf-ln.isnew { background: color-mix(in srgb, var(--dk-data) 10%, transparent); }',
      '.dkf-ln:hover, .dkf-ln:focus-visible, .dkf-ln.on { background: var(--dk-band-on); border-left-color: var(--dk-ctl); }',
      '.dkf-ln.pop { animation: dkf-pop .5s ease-out; }',
      '@keyframes dkf-pop { from { opacity: 0; transform: translateX(-8px); } to { opacity: 1; transform: none; } }',
      '.dkf-sum { padding: 4px 14px 8px; font: 12.5px ui-monospace, Consolas, monospace; color: var(--dk-muted); }',
      '.dkf-detail { min-width: 0; min-height: 260px; border: 1px solid var(--dk-line); border-left: 5px solid var(--dk-line); border-radius: 12px; background: var(--dk-card); padding: 12px 16px; }',
      '.dkf-detail.on { border-left-color: var(--dk-ctl); }',
      '.dkf-detail.isnew.on { border-left-color: var(--dk-data); }',
      '.dkf-detail h4 { margin: 0 0 4px; font: 700 17px ui-monospace, Consolas, monospace; word-break: break-all; }',
      '.dkf-badges { display: flex; flex-wrap: wrap; gap: 6px; margin: 0 0 8px; }',
      '.dkf-badges span { padding: 1px 9px; border: 1.5px solid var(--bc); border-radius: 999px; background: color-mix(in srgb, var(--bc) 12%, var(--dk-card)); font: 700 11px system-ui, sans-serif; color: var(--dk-ink); }',
      '.dkf-detail p { margin: 0 0 8px; }',
      '.dkf-detail ul { margin: 0 0 8px; padding-left: 18px; display: grid; gap: 3px; }',
      '.dkf-detail code { font: 600 12.5px ui-monospace, Consolas, monospace; background: var(--dk-chip); border-radius: 5px; padding: 0 5px; }',
      '.dkf-detail .hint { color: var(--dk-muted); }',
      '.dkf-detail .cb { margin: 6px 0 0; border: 1px solid var(--dk-line); border-radius: 10px; background: var(--dk-card); overflow: auto; max-height: 270px; padding: 6px 0; font: 12.5px/1.55 ui-monospace, Consolas, monospace; }',
      '.dkf-detail .cb .ct { padding: 0 12px 4px; font: 600 11px system-ui, sans-serif; color: var(--dk-muted); letter-spacing: .04em; text-transform: uppercase; }',
      '.dkf-detail .cb .l { display: block; white-space: pre; padding: 0 12px; }',
      '.dkf-detail .cb .kw { color: var(--dk-s-kw); font-weight: 700; } .dkf-detail .cb .ty { color: var(--dk-s-ty); font-weight: 600; } .dkf-detail .cb .fn { color: var(--dk-s-fn); }',
      '.dkf-detail .cb .ob { color: var(--dk-s-ob); } .dkf-detail .cb .st { color: var(--dk-s-st); } .dkf-detail .cb .nu { color: var(--dk-s-nu); } .dkf-detail .cb .an { color: var(--dk-s-an); } .dkf-detail .cb .cm { color: var(--dk-muted); font-style: italic; }',
      /* pantalla completa (InteractiveFrame) */
      '@media (min-width: 821px) {',
      '  .dk-fs .dk-card:has(.dkf) { height: 100%; display: flex; flex-direction: column; }',
      '  .dk-fs .dk-card:has(.dkf) > .dk-stage { flex: 1; min-height: 0; overflow: auto; }',
      '  .dk-fs .dkf { height: 100%; align-items: stretch; }',
      '  .dk-fs .dkf-term { display: flex; flex-direction: column; min-height: 0; }',
      '  .dk-fs .dkf-lines { flex: 1; max-height: none; font-size: 14.5px; }',
      '  .dk-fs .dkf-detail { overflow: auto; font-size: 15px; } .dk-fs .dkf-detail .cb { max-height: none; }',
      '}',
      '@media (max-width: 700px) { .dkf { grid-template-columns: 1fr; } .dkf-lines { max-height: 420px; } }',
    ].join('\n');
    document.head.appendChild(st);
  }

  var cmdTx = el('span', { class: 'tx' }), cmd = el('div', { class: 'dkf-cmd' }, el('span', { class: 'pr', text: '$' }), cmdTx);
  var lines = el('div', { class: 'dkf-lines', role: 'tree', 'aria-label': 'Archivos y carpetas del proyecto' });
  var sum = el('div', { class: 'dkf-sum' });
  var term = el('div', { class: 'dkf-term' }, cmd, lines, sum);
  var detail = el('div', { class: 'dkf-detail', 'aria-live': 'polite' });
  o.stage.replaceChildren(el('div', { class: 'dkf' }, term, detail));

  var shownIds = {}, popped = {}, visibleIds = [];

  function resolveShown(i) {
    var s = {};
    for (var q = 0; q <= i; q++) ((steps[q] && steps[q].show) || []).forEach(function (id) { s[id] = true; });
    return s;
  }
  function visibleList(step, sh) {
    var base = step.base || '', baseDepth = base ? base.replace(/\/$/, '').split('/').length : 0;
    var L = step.depth || (base ? 2 : 3);
    return items.filter(function (it) {
      if (it.hidden && !sh[it.id]) return false;
      if (base && it.path.indexOf(base) !== 0) return false;
      if (base && it.path === base) return false;
      return it.depth - baseDepth <= L;
    });
  }

  function paintLines(step, sh) {
    var base = step.base || '', vis = visibleList(step, sh), animate = false;
    visibleIds = vis.map(function (it) { return it.id; });
    var kidsOf = {};
    vis.forEach(function (it) { (kidsOf[it.parentPath] = kidsOf[it.parentPath] || []).push(it); });
    var isLast = function (it) { var k = kidsOf[it.parentPath]; return k[k.length - 1] === it; };
    var parentOf = function (it) { return it.parentPath && it.parentPath !== base ? byId[it.parentPath] : null; };
    lines.replaceChildren();
    var dirs = 0, files = 0;
    var root = el('div', { class: 'dkf-ln', style: 'cursor:default' }, el('span', { class: 'nm', text: base ? base.replace(/\/$/, '') : '.' }));
    root.style.borderLeftColor = 'transparent';
    lines.appendChild(root);
    vis.forEach(function (it) {
      var anc = [], p = parentOf(it);
      while (p && vis.indexOf(p) >= 0) { anc.unshift(p); p = parentOf(p); }
      var art = anc.map(function (a) { return isLast(a) ? '    ' : '│   '; }).join('') + (isLast(it) ? '└── ' : '├── ');
      var ln = el('div', { class: 'dkf-ln' + (it.isDir ? ' dir' : '') + (it.isNew ? ' isnew' : ''), 'data-id': it.id, tabindex: 0, role: 'treeitem', 'aria-label': it.name },
        el('span', { class: 'art', text: art }), el('span', { class: 'nm', text: it.name }), it.isNew ? el('span', { class: 'new', text: 'nuevo' }) : null);
      if (!popped[it.id] && it.hidden) { ln.classList.add('pop'); }
      popped[it.id] = true;
      if (it.isDir) dirs++; else files++;
      lines.appendChild(ln);
    });
    var L = step.depth || (base ? 2 : 3);
    cmdTx.textContent = base ? 'tree -L ' + L + ' ' + base.replace(/\/$/, '') + ' --dirsfirst' : 'tree -a -L ' + L + ' --dirsfirst -I node_modules';
    sum.textContent = dirs + (dirs === 1 ? ' directory, ' : ' directories, ') + files + (files === 1 ? ' file' : ' files');
  }

  var HINT = matchMedia('(hover: none)').matches ? 'Toca un archivo o una carpeta para ver para qué sirve.' : 'Pasa el mouse por un archivo o una carpeta para ver para qué sirve.';
  function activeId() { return hover || pinned || (steps[cur] && steps[cur].focus) || null; }
  function paintDetail() {
    var id = activeId(), it = id && byId[id];
    [].forEach.call(lines.querySelectorAll('.dkf-ln'), function (n) { n.classList.toggle('on', n.getAttribute('data-id') === id); });
    detail.classList.toggle('on', !!it); detail.classList.toggle('isnew', !!(it && it.isNew));
    detail.replaceChildren();
    if (!it) { detail.appendChild(el('p', { class: 'hint', text: HINT })); return; }
    detail.appendChild(el('h4', { text: it.path }));
    var badges = el('div', { class: 'dkf-badges' });
    var add = function (txt, tone) { var b = el('span', { text: txt }); b.style.setProperty('--bc', 'var(--dk-' + tone + ')'); badges.appendChild(b); };
    add(it.isDir ? 'Carpeta' : 'Archivo', 'p2');
    if (it.edit && EDIT[it.edit]) add(EDIT[it.edit][0], EDIT[it.edit][1] === 'muted' ? 'muted' : EDIT[it.edit][1]);
    if (it.isNew) add('Convención propuesta', 'data');
    detail.appendChild(badges);
    if (it.purpose) detail.appendChild(el('p', { text: it.purpose }));
    if (it.points && it.points.length) detail.appendChild(el('ul', {}, it.points.map(function (t) { var li = el('li'); li.innerHTML = t; return li; })));
    if (it.code) {
      var cb = el('div', { class: 'cb' });
      if (it.codeTitle) cb.appendChild(el('div', { class: 'ct', text: it.codeTitle }));
      it.code.split(/\r?\n/).forEach(function (l) { var n = el('span', { class: 'l' }); n.innerHTML = DK.highlight(l) || ' '; cb.appendChild(n); });
      detail.appendChild(cb);
    }
  }

  function setHover(id) { if (id !== hover) { hover = id; paintDetail(); } }
  function idOf(t) { var n = t.closest && t.closest('.dkf-ln[data-id]'); return n ? n.getAttribute('data-id') : null; }
  lines.addEventListener('mouseover', function (e) { setHover(idOf(e.target)); });
  lines.addEventListener('mouseleave', function () { setHover(null); });
  lines.addEventListener('focusin', function (e) { setHover(idOf(e.target)); });
  lines.addEventListener('focusout', function () { setHover(null); });
  lines.addEventListener('click', function (e) { var id = idOf(e.target); pinned = (id && id !== pinned) ? id : null; paintDetail(); });

  function setSteps(list) {
    steps = list; steps.forEach(function (s) { s.msgs = s.msgs || []; });
    // el terminal mide lo que el paso con mas lineas: al avanzar (y aparecer carpetas) la pieza no salta de alto
    var maxN = 0;
    steps.forEach(function (s, i) { maxN = Math.max(maxN, visibleList(s, resolveShown(i)).length); });
    lines.style.minHeight = Math.min(540, (maxN + 1) * 23 + 12) + 'px';
  }
  function render(i) {
    cur = i;
    var step = steps[i] || {}, sh = resolveShown(i);
    // un elemento oculto que aparece se anima una vez; si se vuelve atras y adelante, no
    paintLines(step, sh);
    paintDetail();
    return { animMs: 0 };
  }
  return { setSteps: setSteps, render: render, msgDuration: 700 };
};
