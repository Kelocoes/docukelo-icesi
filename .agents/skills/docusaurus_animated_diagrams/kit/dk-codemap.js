// DOCS: references/kit-api.md de la skill docusaurus_animated_diagrams (API) y SKILL.md (proceso). Copia maestra: kit/ de la skill; la carpeta instalada en un proyecto es generada, no la edites.
/* dk-codemap.js: CODIGO <-> RESULTADO. A la izquierda un archivo de codigo cuyas partes se pueden señalar (el nombre del archivo,
 * la funcion, los parametros, las llaves...); a la derecha, lo que esas partes producen (la interfaz, los datos que llegan, el import).
 * Pasar el mouse (o tocar, o enfocar con el teclado) por una parte del codigo ilumina lo que produce, y al reves; debajo aparece su
 * explicacion. Cada parte tiene su color (p1..p5). Es una escena para DK.player (usar wide: true). Requiere dk-kit.js (DK.highlight).
 *
 *   scene: function (svg, stage) {
 *     return DK.codemap({
 *       stage: stage, file: 'ProductCard.jsx', filePart: 'file',
 *       code: [                                          // un arreglo de lineas; cada linea, un arreglo de segmentos [texto, parte?]
 *         [['function ', ''], ['ProductCard', 'fn'], ['(', ''], ['{ name, price }', 'props'], [') {', '']],
 *         [['  return <h3>', ''], ['{name}', 'name'], ['</h3>', '']],
 *       ],
 *       parts: { fn: { label: 'Nombre', color: 'p1', title: 'Un componente es una función', text: '...', bullets: ['...'], where: 'En pantalla: ...' } },
 *       view: function () { return '<div data-part="name">Teclado</div>'; },     // HTML del resultado; data-part enlaza con el codigo
 *     });
 *   }
 * Un paso: { phase, title, caption, msgs: [], focus: 'fn' }   (la parte que se ilumina mientras el mouse no toque nada)
 * Dentro de `view` se pueden usar las clases cm-ui (pantalla clara simulada), cm-card, cm-chip, cm-code, cm-arrow y cm-lbl (rotulo).
 */
DK.codemap = function (o) {
  var el = DK.el;
  var parts = o.parts || {}, steps = [], cur = -1, hover = null, pinned = null;
  var PAGE_C = { p1: '#5454e9', p2: '#865cf0', p3: '#2f9e5f', p4: '#e9683b', p5: '#b58a00' };   // la "pantalla" es clara: colores fijos

  if (!document.getElementById('dk-codemap-css')) {
    var st = document.createElement('style');
    st.id = 'dk-codemap-css';
    st.textContent = [
      '.cmx { display: grid; grid-template-columns: minmax(0, 1.12fr) minmax(0, 1fr); gap: 12px 16px; align-items: stretch; }',
      '.cm-left, .cm-right { min-width: 0; } .cm-left .cm-ed { height: 100%; }',
      '.cm-ed { border: 1px solid var(--dk-line); border-radius: 12px; background: var(--dk-card); overflow: hidden; }',
      '.cm-tab { display: flex; padding: 0 8px; background: var(--dk-band); border-bottom: 1px solid var(--dk-line); }',
      '.cm-tab span { margin: 6px 0 -1px; padding: 3px 12px; border: 1px solid var(--dk-line); border-bottom-color: var(--dk-card); border-radius: 8px 8px 0 0; background: var(--dk-card); font: 700 12.5px ui-monospace, Consolas, monospace; cursor: pointer; }',
      '.cm-lines { padding: 8px 0; font: 13.5px/1.75 ui-monospace, "JetBrains Mono", Consolas, monospace; overflow-x: auto; }',
      '.cm-ln { display: flex; white-space: pre; min-height: 1.75em; }',
      '.cm-no { flex: none; width: 34px; padding-right: 10px; text-align: right; color: var(--dk-muted); opacity: .6; user-select: none; }',
      '.cm-code { padding-right: 14px; }',
      '.cm-seg[data-part] { --pc: var(--dk-p1); border-radius: 4px; border-bottom: 1px solid color-mix(in srgb, var(--pc) 38%, transparent); background: color-mix(in srgb, var(--pc) 4%, transparent); cursor: pointer; transition: background .15s, opacity .15s; outline: none; }',
      '.cm-lines .kw { color: var(--dk-s-kw); font-weight: 700; } .cm-lines .ty { color: var(--dk-s-ty); font-weight: 600; } .cm-lines .fn { color: var(--dk-s-fn); }',
      '.cm-lines .ob { color: var(--dk-s-ob); } .cm-lines .st { color: var(--dk-s-st); } .cm-lines .nu { color: var(--dk-s-nu); } .cm-lines .an { color: var(--dk-s-an); } .cm-lines .cm { color: var(--dk-muted); font-style: italic; }',
      '.cmx.has-on .cm-seg[data-part]:not(.on) { opacity: .5; }',
      '.cmx .cm-seg.on { background: color-mix(in srgb, var(--pc) 15%, transparent); border-bottom-color: color-mix(in srgb, var(--pc) 70%, transparent); }',
      /* el resultado: una pantalla clara simulada, siempre en tema claro */
      '.cm-ui { padding: 12px; border: 1px solid var(--dk-line); border-radius: 12px; background: #fff; color: #1c1e21; display: grid; gap: 8px; font: 13px/1.4 system-ui, "Segoe UI", Roboto, sans-serif; }',
      '.cm-ui [data-part] { --pc: #5454e9; border-radius: 8px; outline: 2px solid transparent; outline-offset: 2px; transition: outline-color .15s, background-color .15s, opacity .15s; cursor: pointer; }',
      '.cm-ui .on { outline-color: color-mix(in srgb, var(--pc) 60%, transparent); background-color: color-mix(in srgb, var(--pc) 9%, #fff); }',
      '.cmx.has-on .cm-ui [data-part]:not(.on):not(:has(.on)) { opacity: .55; }',
      '.cm-lbl { font: 700 10.5px system-ui, sans-serif; letter-spacing: .05em; text-transform: uppercase; color: #79747e; margin: 0; }',
      '.cm-chip { display: inline-block; padding: 2px 10px; border: 1.5px solid #dfe2e8; border-radius: 999px; font: 700 12px ui-monospace, Consolas, monospace; background: #f7f7fb; }',
      '.cm-code-sm { padding: 5px 10px; border: 1px solid #dfe2e8; border-radius: 8px; background: #f7f7fb; font: 12px/1.5 ui-monospace, Consolas, monospace; white-space: pre-wrap; word-break: break-word; }',
      '.cm-arrow { text-align: center; color: #79747e; font-weight: 700; line-height: 1; margin: -2px 0; }',
      '.cm-card { padding: 9px 12px; border: 1.5px solid #c7c9d3; border-radius: 10px; background: #fff; }',
      '.cm-card h3 { margin: 0 0 2px; font-size: 15px; } .cm-card p { margin: 0; color: #5a5f66; }',
      '.cm-out { padding: 6px; border: 2px dashed #c7c9d3; border-radius: 12px; }',
      /* explicacion */
      '.cm-call { grid-column: 1 / -1; min-height: 196px; padding: 10px 14px; border: 1px solid var(--dk-line); border-left: 5px solid var(--pc, var(--dk-line)); border-radius: 12px; background: var(--dk-card); }',
      '.cm-call .tag { display: inline-block; font: 700 11px system-ui, sans-serif; letter-spacing: .05em; text-transform: uppercase; color: var(--pc, var(--dk-muted)); }',
      '.cm-call h4 { margin: 2px 0 6px; font-size: 16px; } .cm-call p { margin: 0 0 6px; }',
      '.cm-call ul { margin: 0 0 6px; padding-left: 18px; display: grid; gap: 3px; }',
      '.cm-call code { font: 600 12.5px ui-monospace, Consolas, monospace; background: var(--dk-chip); border-radius: 5px; padding: 0 5px; }',
      '.cm-call .where { margin: 0; color: var(--dk-muted); font-size: 12.5px; }',
      '.cm-call.hint { color: var(--dk-muted); }',
      '.cm-call.swap { animation: dk-in .3s ease-out; }',
      /* pantalla completa */
      '@media (min-width: 821px) {',
      '  .dk-fs .dk-card:has(.cmx) { height: 100%; display: flex; flex-direction: column; }',
      '  .dk-fs .dk-card:has(.cmx) > .dk-stage { flex: 1; min-height: 0; overflow: auto; }',
      /* en pantalla completa sobra ancho y falta alto: tres columnas (codigo, pantalla, explicacion) con letra mas grande */
      '  .dk-fs .cmx { height: 100%; grid-template-columns: minmax(0, 1.2fr) minmax(0, 1fr) minmax(0, 1fr); grid-template-rows: minmax(0, 1fr); align-items: stretch; }',
      '  .dk-fs .cm-left, .dk-fs .cm-right { min-height: 0; overflow: auto; }',
      /* el codigo largo se desplaza dentro del editor (antes se recortaba) */
      '  .dk-fs .cm-ed { height: 100%; display: flex; flex-direction: column; } .dk-fs .cm-tab { flex: none; } .dk-fs .cm-lines { flex: 1; min-height: 0; overflow: auto; font-size: 20px; } .dk-fs .cm-tab span { font-size: 15px; }',
      '  .dk-fs .cm-ui { zoom: 1.5; }',
      '  .dk-fs .cm-call { grid-column: 3; grid-row: 1; min-height: 0; overflow: auto; font-size: 18px; } .dk-fs .cm-call h4 { font-size: 22px; } .dk-fs .cm-call code { font-size: 16px; }',
      '}',
      '@media (max-width: 560px) { .cmx { grid-template-columns: 1fr; } }',
    ].join('\n');
    document.head.appendChild(st);
  }

  // ---------- codigo ----------
  var lines = el('div', { class: 'cm-lines', role: 'group', 'aria-label': 'Código del archivo' });
  o.code.forEach(function (segs, i) {
    var code = el('span', { class: 'cm-code' });
    segs.forEach(function (sg) {
      var html = DK.highlight(sg[0]);
      var s = el('span', { class: 'cm-seg' + (sg[1] ? '' : '') });
      s.innerHTML = html;
      if (sg[1]) {
        s.setAttribute('data-part', sg[1]); s.setAttribute('tabindex', '0');
        var pc = parts[sg[1]] && parts[sg[1]].color; if (pc) s.style.setProperty('--pc', 'var(--dk-' + pc + ')');
      } else s.className = '';
      code.appendChild(s);
    });
    lines.appendChild(el('div', { class: 'cm-ln' }, el('span', { class: 'cm-no', text: String(i + 1) }), code));
  });
  var tab = el('div', { class: 'cm-tab' });
  var fileSpan = el('span', { text: o.file || 'archivo' });
  if (o.filePart) { fileSpan.setAttribute('data-part', o.filePart); fileSpan.setAttribute('tabindex', '0'); fileSpan.className = 'cm-seg'; fileSpan.style.cssText = ''; var fc = parts[o.filePart] && parts[o.filePart].color; if (fc) fileSpan.style.setProperty('--pc', 'var(--dk-' + fc + ')'); }
  tab.appendChild(fileSpan);
  var call = el('div', { class: 'cm-call hint', 'aria-live': 'polite' });
  var ui = el('div', { class: 'cm-ui' });
  ui.innerHTML = o.view();
  // los elementos del resultado toman el color de su parte
  [].forEach.call(ui.querySelectorAll('[data-part]'), function (n) {
    var p = parts[n.getAttribute('data-part')]; if (p && p.color) n.style.setProperty('--pc', PAGE_C[p.color]);
    n.setAttribute('tabindex', '0');
  });
  var root = el('div', { class: 'cmx' }, el('div', { class: 'cm-left' }, el('div', { class: 'cm-ed' }, tab, lines)), el('div', { class: 'cm-right' }, ui), call);   // la explicacion ocupa todo el ancho, debajo
  o.stage.replaceChildren(root);

  // ---------- resaltado ----------
  var HINT = matchMedia('(hover: none)').matches ? 'Toca una parte del código o de la pantalla: se ilumina lo que le corresponde.' : 'Pasa el mouse por una parte del código o de la pantalla: se ilumina lo que le corresponde.';
  function activePart() { return hover || pinned || (steps[cur] && steps[cur].focus) || null; }
  function paint() {
    var id = activePart(), p = id && parts[id];
    [].forEach.call(root.querySelectorAll('[data-part]'), function (n) { n.classList.toggle('on', n.getAttribute('data-part') === id); });
    root.classList.toggle('has-on', !!p);
    call.classList.toggle('hint', !p);
    call.style.setProperty('--pc', p && p.color ? 'var(--dk-' + p.color + ')' : 'var(--dk-line)');
    call.replaceChildren();
    if (!p) { call.textContent = HINT; return; }
    call.appendChild(el('span', { class: 'tag', text: p.label || id }));
    call.appendChild(el('h4', { text: p.title || '' }));
    if (p.text) { var tp = el('p'); tp.innerHTML = p.text; call.appendChild(tp); }
    if (p.bullets && p.bullets.length) call.appendChild(el('ul', {}, p.bullets.map(function (t) { var li = el('li'); li.innerHTML = t; return li; })));
    if (p.where) { var wp = el('p', { class: 'where' }); wp.innerHTML = p.where; call.appendChild(wp); }
    if (!DK.reduced) { call.classList.remove('swap'); void call.offsetWidth; call.classList.add('swap'); }
  }
  function partOf(t) { var n = t.closest && t.closest('[data-part]'); return n ? n.getAttribute('data-part') : null; }
  function setHover(id) { if (id !== hover) { hover = id; paint(); } }
  root.addEventListener('mouseover', function (e) { setHover(partOf(e.target)); });
  root.addEventListener('mouseleave', function () { setHover(null); });
  root.addEventListener('focusin', function (e) { setHover(partOf(e.target)); });
  root.addEventListener('focusout', function () { setHover(null); });
  root.addEventListener('click', function (e) { var id = partOf(e.target); pinned = (id && id !== pinned) ? id : null; paint(); });

  function setSteps(list) { steps = list; steps.forEach(function (s) { s.msgs = s.msgs || []; }); }
  // si el codigo no cabe (pantalla completa, o un archivo largo), la parte enfocada por el paso debe quedar a la vista
  function bring(n, sc) {
    if (!n || !sc || sc.scrollHeight <= sc.clientHeight + 2) return;
    var sr = sc.getBoundingClientRect(), nr = n.getBoundingClientRect();
    if (nr.bottom > sr.bottom - 12 || nr.top < sr.top + 8) sc.scrollTop += (nr.top + nr.height / 2) - (sr.top + sr.height / 2);
  }
  function reveal() {
    var f = steps[cur] && steps[cur].focus; if (!f) return;
    bring(lines.querySelector('[data-part="' + f + '"]'), lines);                           // el codigo
    bring(ui.querySelector('[data-part="' + f + '"]'), root.querySelector('.cm-right'));   // el resultado (en pantalla completa puede no caber)
  }
  function render(i) { cur = i; paint(); reveal(); return { animMs: 0 }; }
  return { setSteps: setSteps, render: render, msgDuration: 700 };
};
