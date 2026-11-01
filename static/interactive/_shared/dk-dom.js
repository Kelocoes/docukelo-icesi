// DOCS: references/kit-api.md de la skill docusaurus_animated_diagrams (API) y SKILL.md (proceso). Copia maestra: kit/ de la skill; la carpeta instalada en un proyecto es generada, no la edites.
/* dk-dom.js: una PAGINA SIMULADA (HTML real, siempre en tema claro como una pagina de verdad) junto al ARBOL DEL DOM que la
 * describe. Pasar el mouse (o tocar) por un elemento de la pagina ilumina su nodo en el arbol, y al reves; el padre y los hijos
 * se marcan con otro trazo para enseñar "padre", "hijo" y "hermano". Cada paso puede cambiar el texto, hacer aparecer nodos,
 * marcar nodos con un rol de color (dirty, build, reuse, need...), parpadear los elementos que el DOM real "toco" y mostrar un
 * medidor. Sirve para explicar el DOM, el Virtual DOM y el diff, y cualquier "pagina <-> arbol".
 * MODO COMPONENTES (opcional): la pagina se corta en componentes de colores (cada uno con su rotulo <Nombre />) y aparece una
 * segunda pestaña con el ARBOL DE COMPONENTES. Pasar el mouse por un componente ilumina todos los nodos DOM que produce.
 * Es una escena para DK.player (usar wide: true). Requiere dk-kit.js; el color de los roles viene de dk-base.css.
 *
 *   scene: function (svg, stage) {
 *     return DK.dom({
 *       stage: stage, url: 'mi-tienda.com', treeTitle: 'Árbol DOM',
 *       legend: [['build', 'Virtual DOM nuevo'], ['dirty', 'Cambió'], ['reuse', 'Igual']],     // opcional
 *       nodes: [                                       // el orden de los hijos es el orden en pantalla
 *         { id: 'body', tag: 'body' },
 *         { id: 'header', tag: 'header', parent: 'body' },
 *         { id: 'h1', tag: 'h1', parent: 'header', text: 'Mi tienda' },
 *         { id: 'badge', tag: 'span', cls: 'badge', parent: 'header', text: '2' },
 *         { id: 'li3', tag: 'li', parent: 'ul', text: 'Monitor', hidden: true },        // todavia no existe
 *       ],
 *       // ---- modo componentes (opcional) ----
 *       components: { Header: 'p1', CartItem: 'p3' },  // nombre -> color categorico (p1..p5)
 *       // en un nodo, comp: 'Header' marca la RAIZ de una instancia del componente; sus descendientes sin comp pertenecen a ella
 *       ctree: [ { id: 'app', comp: 'App' }, { id: 'hd', comp: 'Header', parent: 'app', dom: 'header', sub: '...' } ],   // arbol de componentes
 *     });
 *   }
 *
 * tag: header, h1, span, main, ul, li, button, p, footer, div... (cls: 'badge' | 'total' | cualquier clase; la pagina trae estilos
 * para las de arriba). text: el contenido; sub: segunda linea del nodo en el arbol (por defecto, el texto recortado).
 * ctree: cada nodo es una instancia (id, comp, parent, dom = id del nodo DOM raiz que produce, sub = texto secundario; por
 * defecto "produce N nodos DOM" o "usa N componentes").
 *
 * Un paso (todo vale solo para su paso, salvo text y show, que se ACUMULAN y gana el ultimo):
 *   { phase, title, caption, msgs: [],
 *     focus: ['ul'],                    // nodo DOM que se ilumina mientras el mouse no toque nada
 *     marks: { badge: 'dirty', ul: 'reuse' },    // roles de color del arbol: dirty | build | reuse | need | owner | use | dim
 *     sub:   { badge: '2 → 3' },        // segunda linea del nodo solo en este paso
 *     mirror: true,                     // la pagina tambien muestra las marcas need / dirty (contorno punteado)
 *     text: { badge: '3' },             // cambia el texto del elemento (pagina y arbol)
 *     show: ['li3'],                    // hace aparecer un nodo oculto, en la pagina y en el arbol (se queda)
 *     treeShow: ['li3'], treeText: {…}, // lo mismo pero solo en el ARBOL (se acumulan): el Virtual DOM nuevo existe antes que la pagina
 *     touch: ['badge', 'li3'],          // la pagina parpadea ahi: "el DOM real se toco en estos elementos"
 *     state: 'productos = 3',           // pastilla junto al titulo del arbol
 *     meter: { label: 'Nodos tocados', value: 3, max: 12, text: '3 de 12', tone: 'ack' },   // tone: err | ack | ctl
 *     // franja de fases (opcion pipeline: [{ label: '2 · Render', sub: 'nuevo Virtual DOM' }, ...] en DK.dom):
 *     stage: 1,                         // fase encendida (0..n-1); n = todas hechas; sin stage, ninguna
 *     stageBlock: true,                 // la fase encendida se marca como bloqueada (borde punteado del color de fallo)
 *     // modo componentes:
 *     comps: true | ['Header'],         // pinta esos componentes en la pagina y en el arbol DOM (true = todos)
 *     cfocus: ['CartItem'],             // componente que se ilumina (todas sus copias) mientras el mouse no toque nada
 *     view: 'dom' | 'comp',             // pestaña visible del arbol
 *     csub: { ci1: 'nombre="Teclado"' },  // sub de los nodos del arbol de componentes solo en este paso
 *     cmarks: { pl: 'build', pc2: 'dirty' } }  // roles de color del arbol de componentes (los mismos que marks); con rol, gana al color del componente
 */
DK.dom = function (o) {
  var el = DK.el, S = DK.svg;
  var nodes = o.nodes, byId = {}, kids = {}, root = null;
  var steps = [], cur = -1, hover = null, pinned = null, view = 'dom';
  var pageEls = {}, textNodes = {}, curShown = {};
  var COMPS = o.components || {}, ctree = o.ctree || [], cById = {}, cByDom = {}, hasC = ctree.length > 0;
  var ROLE_COLOR = { dirty: 'err', need: 'err', build: 'ctl', owner: 'ctl', reuse: 'ack', use: 'ack', self: 'data' };
  // la pagina es clara aunque el sitio este en oscuro: sus colores de componente son fijos (iguales a --dk-p1..p5 en tema claro)
  var PAGE_C = { p1: '#5454e9', p2: '#865cf0', p3: '#2f9e5f', p4: '#e9683b', p5: '#b58a00' };

  nodes.forEach(function (n) { byId[n.id] = n; kids[n.id] = []; });
  nodes.forEach(function (n) { if (n.parent) kids[n.parent].push(n.id); else root = n.id; });
  // componente de cada nodo: comp explicito = raiz de una instancia; los demas heredan la del padre
  (function walk(id, pc, pi) {
    var n = byId[id];
    n.cn = n.comp || pc || null; n.inst = n.comp ? n.id : pi;
    kids[id].forEach(function (k) { walk(k, n.cn, n.inst); });
  })(root, null, null);
  ctree.forEach(function (c) { cById[c.id] = c; if (c.dom) cByDom[c.dom] = c.id; });
  var cKids = {};
  ctree.forEach(function (c) { cKids[c.id] = []; });
  ctree.forEach(function (c) { if (c.parent) cKids[c.parent].push(c.id); });
  function ownNodes(rootId) { return nodes.filter(function (n) { return n.inst === rootId; }); }
  function colorOf(name) { return COMPS[name] || 'p1'; }

  if (!document.getElementById('dk-dom-css')) {
    var st = document.createElement('style');
    st.id = 'dk-dom-css';
    st.textContent = [
      '.dkd { display: grid; grid-template-columns: 296px minmax(0, 1fr); gap: 10px 18px; align-items: start; }',
      '.dkd-right { min-width: 0; display: grid; gap: 8px; align-content: start; }',
      /* la ventana de la pagina: siempre clara, como una pagina real (por eso aqui si hay colores fijos) */
      '.dkd-win { border: 1px solid var(--dk-line); border-radius: 12px; overflow: hidden; background: #fff; color: #1c1e21; box-shadow: 0 4px 14px rgba(0, 0, 0, .14); }',
      '.dkd-bar { display: flex; align-items: center; gap: 5px; padding: 7px 10px; background: #eceef2; border-bottom: 1px solid #dcdfe5; }',
      '.dkd-bar i { width: 9px; height: 9px; border-radius: 50%; background: #c6cad2; }',
      '.dkd-url { flex: 1; margin-left: 6px; padding: 2px 10px; border-radius: 10px; background: #fff; color: #5a5f66; font: 11.5px ui-monospace, Consolas, monospace; }',
      '.dkd-page { padding: 10px; min-height: 300px; font: 13px/1.4 system-ui, "Segoe UI", Roboto, sans-serif; }',
      '.dkd-page [data-n] { outline: 3px solid transparent; outline-offset: 2px; border-radius: 6px; transition: outline-color .15s, box-shadow .15s, background-color .15s; cursor: pointer; }',
      '.dkd-page .dkd-gone { display: none; }',
      '.dkd-page .dkd-pop { animation: dkd-pop .45s ease-out; }',
      '.dkd-page header { display: flex; align-items: center; justify-content: space-between; gap: 8px; padding: 7px 9px; background: #f1f2f8; }',
      '.dkd-page h1 { margin: 0; font-size: 15px; }',
      '.dkd-page .badge { min-width: 24px; padding: 1px 9px; border-radius: 999px; background: #5454e9; color: #fff; font-weight: 700; text-align: center; }',
      '.dkd-page main { display: block; padding: 8px 0 2px; }',
      '.dkd-page ul { list-style: none; margin: 0 0 8px; padding: 0; }',
      '.dkd-page li { margin: 5px 0; padding: 6px 10px; border: 1px solid #dfe2e8; border-radius: 8px; background: #fff; }',
      '.dkd-page button { margin: 2px 0 0; padding: 6px 14px; border: 1px solid #5454e9; border-radius: 16px; background: #5454e9; color: #fff; font: 600 12px system-ui, sans-serif; }',
      '.dkd-page p { margin: 8px 0 0; padding: 2px 0; font-weight: 700; }',
      '.dkd-page article { margin: 6px 0; padding: 8px 12px; border: 1px solid #dfe2e8; border-radius: 10px; background: #fff; }',
      '.dkd-page h3 { margin: 0 0 2px; font-size: 14px; }',
      '.dkd-page article p { margin: 0; padding: 0; font-weight: 400; color: #5a5f66; }',
      '.dkd-cmode div[data-comp] { display: flow-root; }',
      '.dkd-page footer { margin-top: 10px; padding: 6px; border-top: 1px solid #e5e7ec; border-radius: 0; color: #79747e; font-size: 11.5px; text-align: center; }',
      /* modo componentes: cada raiz de instancia lleva contorno, tinte y rotulo <Nombre /> del color de su componente */
      '.dkd-cmode [data-comp] { margin-top: 15px; }',
      '.dkd-cmode > .dkd-page > [data-comp] { margin-top: 12px; padding-top: 4px; }',
      '.dkd-cmode ul[data-comp] { display: flow-root; }',   /* sin colapso de margenes: el rotulo de la lista no se encima con el del primer item */
      '.dkd-page [data-n].dkd-c { position: relative; outline: 2px solid var(--pc); background-color: color-mix(in srgb, var(--pc) 9%, #fff); }',
      '.dkd-page [data-n].dkd-c::before { content: attr(data-comp); position: absolute; top: -10px; left: 8px; z-index: 2; padding: 0 7px; border-radius: 8px; background: var(--pc); color: #fff; font: 700 10px/16px ui-monospace, Consolas, monospace; white-space: nowrap; }',
      '.dkd-page [data-n].dkd-c.dkd-nochip::before { display: none; }',
      /* resaltado: el nodo (azul), su padre (punteado) y sus hijos (azul suave) */
      '.dkd-page [data-n].dkd-hv { outline: 3px solid #5454e9; box-shadow: 0 0 0 6px rgba(84, 84, 233, .2); }',
      '.dkd-page [data-n].dkd-par { outline: 2px dashed #5454e9; }',
      '.dkd-page [data-n].dkd-chi { outline-color: rgba(84, 84, 233, .55); }',
      '.dkd-page [data-n].dkd-chi:not(.dkd-c) { outline-style: solid; outline-width: 2px; }',
      '.dkd-page .dkd-m-need { outline: 2px dashed #e9683b; background-color: rgba(233, 104, 59, .1); }',
      '.dkd-page .dkd-m-dirty { outline-color: #e9683b; }',
      '.dkd-page .dkd-flash { animation: dkd-flash 1.7s ease-out; }',
      '@keyframes dkd-flash { 0%, 35% { outline-color: #e9683b; box-shadow: 0 0 0 7px rgba(233, 104, 59, .4); } 100% { outline-color: transparent; box-shadow: 0 0 0 0 transparent; } }',
      '@keyframes dkd-pop { from { opacity: 0; transform: translateY(-6px); } to { opacity: 1; transform: none; } }',
      '.dkd-th { display: flex; flex-wrap: wrap; align-items: center; justify-content: space-between; gap: 4px 10px; min-height: 26px; }',
      '.dkd-th b { font: 700 13px system-ui, sans-serif; }',
      '.dkd-tabs { display: flex; gap: 6px; }',
      '.dkd-tabs button { font: 700 12.5px system-ui, sans-serif; padding: 3px 12px; border: 1px solid var(--dk-line); border-radius: 999px; background: transparent; color: var(--dk-muted); cursor: pointer; }',
      '.dkd-tabs button.on { border-color: var(--dk-ctl); color: var(--dk-ink); background: var(--dk-band-on); }',
      '.dkd-state { padding: 2px 11px; border-radius: 999px; background: var(--dk-chip); color: var(--dk-ctl); font: 700 12px ui-monospace, Consolas, monospace; }',
      '.dkd-state:empty { display: none; }',
      '.dkd-leg { display: flex; flex-wrap: wrap; gap: 2px 14px; font: 600 11.5px system-ui, sans-serif; color: var(--dk-muted); }',
      '.dkd-leg span { display: inline-flex; align-items: center; gap: 5px; }',
      '.dkd-leg i { width: 16px; height: 11px; border-radius: 3px; border: 2px solid var(--c); background: color-mix(in srgb, var(--c) 22%, var(--dk-card)); }',
      '.dkd-leg i.dash { border-style: dashed; }',
      /* leyenda de componentes: chips que se pueden señalar con el mouse */
      '.dkd-cleg { display: flex; flex-wrap: wrap; gap: 6px; min-height: 26px; transition: opacity .25s; }',
      '.dkd-cleg.off { opacity: 0; pointer-events: none; }',
      '.dkd-cleg span { padding: 2px 10px; border: 2px solid var(--pc); border-radius: 999px; background: color-mix(in srgb, var(--pc) 14%, var(--dk-card)); font: 700 12px ui-monospace, Consolas, monospace; cursor: pointer; }',
      '.dkd-cleg span:hover { background: color-mix(in srgb, var(--pc) 32%, var(--dk-card)); }',
      /* franja de fases bajo la pagina y el arbol */
      '.dkd-pipe { grid-column: 1 / -1; display: flex; flex-wrap: wrap; align-items: stretch; gap: 6px; }',
      '.dkd-pipe .arr { align-self: center; color: var(--dk-muted); font-style: normal; font-weight: 700; }',
      '.dkd-pipe .stg { flex: 1 1 130px; display: grid; gap: 1px; padding: 6px 12px; border: 1.5px solid var(--dk-line); border-radius: 12px; color: var(--dk-muted); background: var(--dk-card); transition: background .3s, border-color .3s, color .3s, box-shadow .3s; }',
      '.dkd-pipe .stg b { font: 700 13.5px system-ui, sans-serif; } .dkd-pipe .stg small { font-size: 11.5px; }',
      '.dkd-pipe .stg.done { border-color: var(--dk-ack); color: var(--dk-ink); background: color-mix(in srgb, var(--dk-ack) 12%, var(--dk-card)); }',
      '.dkd-pipe .stg.cur { border-color: var(--dk-ctl); color: var(--dk-ctl); background: var(--dk-band-on); box-shadow: 0 0 0 3px var(--dk-band); }',
      '.dkd-pipe .stg.blocked { border: 1.5px dashed var(--dk-err); color: var(--dk-err); background: color-mix(in srgb, var(--dk-err) 10%, var(--dk-card)); }',
      '.dkd-info { min-height: 42px; padding: 6px 12px; border: 1px solid var(--dk-line); border-left: 4px solid var(--dk-line); border-radius: 10px; font-size: 12.5px; line-height: 1.45; color: var(--dk-muted); }',
      '.dkd-info.on { border-left-color: var(--dk-ctl); color: var(--dk-ink); background: var(--dk-band); }',
      '.dkd-info code { font: 700 12.5px ui-monospace, Consolas, monospace; color: var(--dk-ctl); }',
      '.dkd-hint { display: none; margin: 0; font-size: 11.5px; font-weight: 600; color: var(--dk-ctl); text-align: center; }',
      '.dkd-treewrap { overflow-x: auto; }',
      '.dkd-treewrap[hidden], .dkd-codepane[hidden] { display: none; }',
      '.dkd-codepane { max-height: none; margin: 0; min-height: 200px; height: 380px; }',
      '.dk-stage svg.dkd-svg { display: block; width: 100%; height: auto; min-width: 0; max-width: none; margin: 0; font-family: system-ui, "Segoe UI", Roboto, sans-serif; }',
      '.dkd-edge { fill: none; stroke: var(--dk-line); stroke-width: 2; transition: stroke .2s, opacity .3s; }',
      '.dkd-edge.on { stroke: var(--dk-ctl); stroke-width: 3; }',
      '.dkd-edge.ghost { opacity: .35; stroke-dasharray: 4 3; }',
      '.dkd-tn { cursor: pointer; outline: none; }',
      '.dkd-tn .dk-nlabel { font: 700 12.5px ui-monospace, Consolas, monospace; }',
      '.dkd-tn.ghost { opacity: .5; } .dkd-tn.ghost rect { stroke-dasharray: 4 3; }',
      '.dkd-tn.comp rect { stroke: var(--pc); stroke-width: 2.5; fill: color-mix(in srgb, var(--pc) 13%, var(--dk-card)); }',
      '.dkd-tn[data-rel] rect { stroke: var(--dk-ctl); }',
      'g.dk-tnode.dkd-tn[data-rel="self"] rect { stroke: var(--dk-ctl); stroke-width: 4; fill: var(--dk-band-on); }',
      'g.dk-tnode.dkd-tn[data-rel="parent"] rect { stroke: var(--dk-ctl); stroke-width: 2.5; stroke-dasharray: 6 4; }',
      'g.dk-tnode.dkd-tn[data-rel="child"] rect { stroke: var(--dk-ctl); stroke-width: 2.5; }',
      '.dkd-tn:focus-visible rect { stroke: var(--dk-ctl); stroke-width: 4; }',
      '.dkd .dk-meters { min-height: 22px; } .dkd .dk-meters[hidden] { display: none; }',
      '.dkd .dk-meter { grid-template-columns: minmax(110px, 170px) minmax(60px, 1fr) auto; }',
      /* pantalla completa (InteractiveFrame): la pagina crece, el arbol llena el alto disponible y el codigo ocupa el lugar del arbol */
      '@media (min-width: 821px) {',
      '  .dk-fs .dk-card:has(.dkd) { height: 100%; display: flex; flex-direction: column; }',
      '  .dk-fs .dk-card:has(.dkd) > .dk-stage { flex: 1; min-height: 0; overflow: auto; }',
      '  .dk-fs .dkd { height: 100%; grid-template-columns: minmax(320px, 400px) minmax(0, 1fr); align-items: stretch; }',
      '  .dk-fs .dkd:has(.dkd-pipe) { grid-template-rows: minmax(0, 1fr) auto; }',
      '  .dk-fs .dkd-win { align-self: start; }',
      '  .dk-fs .dkd-page { zoom: 1.3; }',
      '  .dk-fs .dkd-right { display: flex; flex-direction: column; min-height: 0; }',
      '  .dk-fs .dkd-treewrap:not([hidden]) { flex: 1; min-height: 0; overflow: hidden; position: relative; max-width: calc(var(--vw) * 2px) !important; }',
      '  .dk-fs .dk-stage svg.dkd-svg { position: absolute; inset: 0; width: 100%; height: 100%; }',   /* el svg se ajusta (meet) al espacio que deja el resto, sin depender de porcentajes */
      '  .dk-fs .dkd-codepane { flex: 1; height: auto; min-height: 0; font-size: 14px; }',
      '}',
      /* la columna normal del sitio mide ~690 px: ahi la pagina va a la izquierda (mas angosta) y el arbol a la derecha */
      '@media (max-width: 860px) and (min-width: 561px) {',
      '  .dkd { grid-template-columns: 236px minmax(0, 1fr); gap: 10px 12px; }',
      '  .dkd-page { padding: 8px; }',
      '}',
      '@media (max-width: 560px) {',
      '  .dkd { grid-template-columns: 1fr; }',
      '  .dkd-win { max-width: 360px; margin: 0 auto; width: 100%; }',
      '  .dk-stage svg.dkd-svg { min-width: 440px; }',
      '  .dkd-hint { display: block; }',
      '}',
    ].join('\n');
    document.head.appendChild(st);
  }

  // ---------- la pagina: se arma desde los mismos nodos que el arbol ----------
  function buildPage(id) {
    var n = byId[id];
    var e = document.createElement(n.tag === 'body' ? 'div' : n.tag);
    if (n.cls) e.className = n.cls;
    e.setAttribute('data-n', id);
    if (n.comp) { e.setAttribute('data-comp', '<' + n.comp + ' />'); e.style.setProperty('--pc', PAGE_C[colorOf(n.comp)]); }
    if (n.tag === 'button') e.setAttribute('tabindex', '-1');
    if (n.text !== undefined) { var tn = document.createTextNode(n.text); e.appendChild(tn); textNodes[id] = tn; }
    kids[id].forEach(function (k) { e.appendChild(buildPage(k)); });
    pageEls[id] = e;
    return e;
  }
  var page = el('div', { class: 'dkd-page' });
  page.appendChild(buildPage(root));
  var win = el('div', { class: 'dkd-win' + (hasC || Object.keys(COMPS).length ? ' dkd-cmode' : '') },
    el('div', { class: 'dkd-bar' }, el('i'), el('i'), el('i'), el('span', { class: 'dkd-url', text: o.url || 'mi-sitio.com' })), page);

  // ---------- arboles: de izquierda a derecha (la raiz a la izquierda, las hojas en columna) ----------
  var NH = 36, GX = 18, ROW = 42, PAD = 6;
  function makeTree(list, cfg) {   // list: [{ id, parent }]; cfg: { nw, attr, label(n), cls }
    var by = {}, kd = {}, rt = null, pos = {}, T = { els: {}, edges: {}, subs: {}, pos: pos, by: by, kids: kd, root: null };
    list.forEach(function (n) { by[n.id] = n; kd[n.id] = []; });
    list.forEach(function (n) { if (n.parent) kd[n.parent].push(n.id); else rt = n.id; });
    T.root = rt;
    var leaves = 0, maxD = 0;
    (function walk(id, d) {
      var p = pos[id] = { depth: d }; maxD = Math.max(maxD, d);
      if (!kd[id].length) { p.cy = PAD + NH / 2 + leaves * ROW; leaves++; return; }
      kd[id].forEach(function (k) { walk(k, d + 1); });
      var ys = kd[id].map(function (k) { return pos[k].cy; });
      p.cy = (Math.min.apply(null, ys) + Math.max.apply(null, ys)) / 2;
    })(rt, 0);
    var NW = cfg.nw, VW = PAD * 2 + (maxD + 1) * NW + maxD * GX, VH = PAD * 2 + (leaves - 1) * ROW + NH;
    list.forEach(function (n) { pos[n.id].x = PAD + pos[n.id].depth * (NW + GX); });
    var svg = S('svg', { class: 'dkd-svg', viewBox: '0 0 ' + VW + ' ' + VH, role: 'group', 'aria-label': cfg.aria });
    var gE = S('g'), gN = S('g');
    list.forEach(function (n) {
      var q = pos[n.id];
      if (n.parent) {
        var pp = pos[n.parent], x1 = pp.x + NW, x2 = q.x, xm = (x1 + x2) / 2;
        T.edges[n.id] = S('path', { d: 'M' + x1 + ',' + pp.cy + ' C' + xm + ',' + pp.cy + ' ' + xm + ',' + q.cy + ' ' + x2 + ',' + q.cy, class: 'dkd-edge' });
        gE.appendChild(T.edges[n.id]);
      }
      var g = S('g', { class: 'dk-tnode dkd-tn', tabindex: 0, role: 'button', 'aria-label': cfg.aria + ': ' + cfg.label(n) });
      g.setAttribute(cfg.attr, n.id);
      g.appendChild(S('rect', { x: q.x, y: q.cy - NH / 2, width: NW, height: NH, rx: 10 }));
      g.appendChild(S('text', { x: q.x + 11, y: q.cy - 2, class: 'dk-nlabel', text: cfg.label(n) }));
      T.subs[n.id] = S('text', { x: q.x + 11, y: q.cy + 12, class: 'dk-nsub', text: '' });
      g.appendChild(T.subs[n.id]);
      T.els[n.id] = g; gN.appendChild(g);
    });
    svg.append(gE, gN);
    T.svg = svg; T.vw = VW;
    return T;
  }
  var DT = makeTree(nodes, { nw: o.nodeW || 108, attr: 'data-id', aria: o.treeTitle || 'Árbol del DOM', label: function (n) { return '<' + n.tag + '>'; } });
  var CT = hasC ? makeTree(ctree, { nw: o.compNodeW || 126, attr: 'data-cid', aria: 'Árbol de componentes', label: function (n) { return '<' + n.comp + ' />'; } }) : null;
  if (CT) ctree.forEach(function (c) {
    CT.els[c.id].classList.add('comp'); CT.els[c.id].style.setProperty('--pc', 'var(--dk-' + colorOf(c.comp) + ')');
  });

  var stateEl = el('span', { class: 'dkd-state' });
  var tabBtns = {};
  var head = el('div', { class: 'dkd-th' });
  // pestañas del panel derecho: el arbol DOM, (modo componentes) el arbol de componentes y (code: true) el codigo del paso
  var hasCode = !!o.code;
  var VIEWS = [['dom', hasC || hasCode ? 'Árbol DOM' : (o.treeTitle || 'Árbol del DOM')]];
  if (hasC) VIEWS.push(['comp', 'Árbol de componentes']);
  if (hasCode) VIEWS.push(['code', 'Código']);
  if (VIEWS.length > 1) {
    var tabs = el('div', { class: 'dkd-tabs', role: 'tablist' });
    VIEWS.forEach(function (x) {
      tabBtns[x[0]] = el('button', { text: x[1], role: 'tab', onclick: function () { setView(x[0]); } });
      tabs.appendChild(tabBtns[x[0]]);
    });
    head.append(tabs, stateEl);
  } else head.append(el('b', { text: o.treeTitle || 'Árbol del DOM' }), stateEl);
  var legend = o.legend ? el('div', { class: 'dkd-leg' }, o.legend.map(function (x) {
    var i = el('i', { class: x[0] === 'need' ? 'dash' : '' });
    i.style.setProperty('--c', 'var(--dk-' + (ROLE_COLOR[x[0]] || 'muted') + ')');
    return el('span', {}, i, x[1]);
  })) : null;
  // leyenda de componentes: pasar el mouse por un chip ilumina todas las copias de ese componente
  var cleg = null;
  if (hasC) {
    cleg = el('div', { class: 'dkd-cleg off' });
    var seen = {};
    ctree.forEach(function (c) {
      if (seen[c.comp]) return; seen[c.comp] = true;
      var chip = el('span', { text: '<' + c.comp + ' />', tabindex: 0 });
      chip.style.setProperty('--pc', 'var(--dk-' + colorOf(c.comp) + ')');
      chip.addEventListener('mouseenter', function () { setHover({ k: 'name', name: c.comp }); });
      chip.addEventListener('mouseleave', function () { setHover(null); });
      chip.addEventListener('focus', function () { setHover({ k: 'name', name: c.comp }); });
      chip.addEventListener('blur', function () { setHover(null); });
      chip.addEventListener('click', function () { pin({ k: 'name', name: c.comp }); });
      cleg.appendChild(chip);
    });
  }
  var info = el('div', { class: 'dkd-info', 'aria-live': 'polite' });
  var meterFill = el('div', { class: 'fill' }), meterLbl = el('span'), meterTxt = el('span');
  var meter = el('div', { class: 'dk-meters' }, el('div', { class: 'dk-meter', style: 'visibility:hidden' }, meterLbl, el('div', { class: 'bar' }, meterFill), meterTxt));
  var domWrap = el('div', { class: 'dkd-treewrap' }, DT.svg);
  var compWrap = CT ? el('div', { class: 'dkd-treewrap', hidden: '' }, CT.svg) : null;
  // un arbol chico no se agranda hasta llenar la columna: tope de 1,3 veces su tamaño natural (en pantalla completa no hay tope)
  domWrap.style.maxWidth = Math.round(DT.vw * 1.3) + 'px'; domWrap.style.setProperty('--vw', DT.vw);
  if (compWrap) { compWrap.style.maxWidth = Math.round(CT.vw * 1.3) + 'px'; compWrap.style.setProperty('--vw', CT.vw); }
  // panel de codigo (pestaña «Código»): el texto viene en step.codeText y las lineas resaltadas en step.code (desde 1)
  var codeWrap = hasCode ? el('div', { class: 'dk-code dkd-codepane', hidden: '' }) : null;
  var codeKey = null, codeLines = [];
  var right = el('div', { class: 'dkd-right' }, head, legend, cleg, info,
    el('p', { class: 'dkd-hint', text: 'Desliza hacia los lados para ver todo el árbol' }), domWrap, compWrap, codeWrap, meter);
  // franja de fases (pipeline: [{ label, sub }]): bajo la pagina y el arbol; cada paso enciende la suya con stage (0..n-1; n = todas hechas)
  var pipe = null, pipeEls = [];
  if (o.pipeline) {
    pipe = el('div', { class: 'dkd-pipe', role: 'list', 'aria-label': 'Fases' });
    o.pipeline.forEach(function (p, i) {
      if (i) pipe.appendChild(el('i', { class: 'arr', text: '›' }));
      var c = el('div', { class: 'stg', role: 'listitem' }, el('b', { text: p.label }), el('small', { text: p.sub || '' }));
      pipeEls.push(c); pipe.appendChild(c);
    });
  }
  o.stage.replaceChildren(el('div', { class: 'dkd' }, win, right, pipe));

  function setView(v) {
    view = v;
    domWrap.hidden = v !== 'dom';
    if (compWrap) compWrap.hidden = v !== 'comp';
    if (codeWrap) codeWrap.hidden = v !== 'code';
    Object.keys(tabBtns).forEach(function (k) { tabBtns[k].classList.toggle('on', k === v); tabBtns[k].setAttribute('aria-selected', k === v ? 'true' : 'false'); });
    if (v === 'code') markCode(false);
  }
  // las tres pestañas miden lo mismo (el alto del arbol DOM, el mas alto): al cambiar de pestaña o de paso la pieza no salta
  function syncHeights() {
    if (document.documentElement.classList.contains('dk-fs')) { domWrap.style.minHeight = ''; if (compWrap) compWrap.style.minHeight = ''; return; }   // en pantalla completa lo reparte el CSS
    var was = domWrap.hidden; domWrap.hidden = false;
    var h = domWrap.offsetHeight; domWrap.hidden = was;
    if (h < 60) return;
    if (compWrap) compWrap.style.minHeight = h + 'px';
    if (codeWrap) codeWrap.style.height = h + 'px';
  }
  window.addEventListener('resize', syncHeights);
  function fillCode(step) {
    if (!codeWrap) return;
    var src = step.codeText !== undefined ? step : (steps[0] || {});
    var key = (src.codeTitle || o.codeTitle || '') + '|' + (src.codeText || '');
    if (key === codeKey) return;
    codeKey = key; codeLines = [];
    codeWrap.replaceChildren();
    var legendEl = el('span', { class: 'lg' });
    [['ty', 'clase'], ['fn', 'método'], ['ob', 'objeto o variable'], ['kw', 'palabra clave']].forEach(function (x) { legendEl.appendChild(el('span', { class: x[0], text: x[1] })); });
    codeWrap.appendChild(el('div', { class: 'ct' }, src.codeTitle || o.codeTitle || 'Código', legendEl));
    (src.codeText || '').split(/\r?\n/).forEach(function (line) {
      var n = el('span', { class: 'l' });
      n.innerHTML = DK.highlight(line) || ' ';
      codeWrap.appendChild(n); codeLines.push(n);
    });
  }
  function markCode(animate) {
    if (!codeWrap) return;
    var lines = (steps[cur] && steps[cur].code) || [];
    codeLines.forEach(function (n, k) { n.classList.toggle('on', lines.indexOf(k + 1) >= 0); });
    var first = codeLines.filter(function (n) { return n.classList.contains('on'); })[0];
    if (first && !codeWrap.hidden) codeWrap.scrollTo({ top: Math.max(0, first.offsetTop - 40), behavior: animate && !DK.reduced ? 'smooth' : 'auto' });
  }
  setView('dom');
  syncHeights();

  // ---------- resaltado por mouse / toque / teclado ----------
  // activo: { k: 'node', id } (nodo DOM) | { k: 'inst', id } (instancia de componente, por su id en ctree) | { k: 'name', name } (todas las copias)
  var FIRST_HINT = hasC ? 'Pasa el mouse por la página, por un árbol o por un chip: se ilumina lo mismo en todos lados.' : 'Pasa el mouse por la página o por el árbol: se ilumina el mismo nodo en los dos lados.';
  var TOUCH_HINT = hasC ? 'Toca la página, un árbol o un chip: se ilumina lo mismo en todos lados.' : 'Toca un elemento de la página o un nodo del árbol: se ilumina el mismo nodo en los dos lados.';
  var same = function (a, b) { return !!a && !!b && a.k === b.k && a.id === b.id && a.name === b.name; };
  function stepActive() {
    var s = steps[cur] || {};
    if (s.cfocus && s.cfocus.length) return { k: 'name', name: s.cfocus[0] };
    if (s.focus && s.focus.length) return { k: 'node', id: s.focus[0] };
    return null;
  }
  function activeObj() { return hover || pinned || stepActive(); }
  var tag = function (x) { return '<' + byId[x].tag + '>'; };
  function paintActive() {
    var a = activeObj(), dom = {}, cmp = {}, domEdges = {}, cmpEdges = {};
    if (a && a.k === 'node') {
      var n = byId[a.id];
      dom[a.id] = 'self';
      if (n.parent) dom[n.parent] = 'parent';
      kids[a.id].forEach(function (k) { dom[k] = 'child'; });
      domEdges[a.id] = true; kids[a.id].forEach(function (k) { domEdges[k] = true; });
      if (CT && n.inst && cByDom[n.inst]) cmp[cByDom[n.inst]] = 'self';
    } else if (a && (a.k === 'inst' || a.k === 'name')) {
      var roots = a.k === 'inst' ? [cById[a.id].dom] : ctree.filter(function (c) { return c.comp === a.name; }).map(function (c) { return c.dom; });
      roots.forEach(function (r) {
        nodes.forEach(function (m) { if (m.inst === r) { dom[m.id] = m.id === r ? 'self' : 'child'; if (m.parent && dom[m.parent]) domEdges[m.id] = true; } });
        if (cByDom[r]) cmp[cByDom[r]] = 'self';
      });
      if (a.k === 'inst') {
        var c0 = cById[a.id];
        if (c0.parent) { cmp[c0.parent] = 'parent'; cmpEdges[a.id] = true; }
        cKids[a.id].forEach(function (k) { cmp[k] = 'child'; cmpEdges[k] = true; });
      }
    }
    nodes.forEach(function (m) {
      var p = pageEls[m.id], t = DT.els[m.id], r = dom[m.id];
      p.classList.toggle('dkd-hv', r === 'self'); p.classList.toggle('dkd-par', r === 'parent'); p.classList.toggle('dkd-chi', r === 'child');
      if (r) t.setAttribute('data-rel', r); else t.removeAttribute('data-rel');
      if (DT.edges[m.id]) DT.edges[m.id].classList.toggle('on', !!a && !!(a.k === 'node' ? (m.id === a.id || m.parent === a.id) : domEdges[m.id]));
    });
    if (CT) ctree.forEach(function (c) {
      var t = CT.els[c.id], r = cmp[c.id];
      if (r) t.setAttribute('data-rel', r); else t.removeAttribute('data-rel');
      if (CT.edges[c.id]) CT.edges[c.id].classList.toggle('on', !!cmpEdges[c.id]);
    });
    info.classList.toggle('on', !!a);
    if (!a) { info.textContent = matchMedia('(hover: none)').matches ? TOUCH_HINT : FIRST_HINT; return; }
    if (a.k === 'node') {
      var n0 = byId[a.id], sib = n0.parent ? kids[n0.parent].length - 1 : 0;
      var more = CT && n0.cn ? ' · pertenece a <' + n0.cn + ' />' : '';
      info.replaceChildren(el('code', { text: tag(a.id) }), document.createTextNode(' · padre: ' + (n0.parent ? tag(n0.parent) : 'ninguno (es la raíz)') + ' · hijos: ' + kids[a.id].length + ' · hermanos: ' + sib + more +
        (n0.hidden && !curShown[a.id] ? ' · todavía no existe en la página' : '')));
    } else if (a.k === 'inst') {
      var c = cById[a.id], own = ownNodes(c.dom).length, par = c.parent ? cById[c.parent] : null;
      info.replaceChildren(el('code', { text: '<' + c.comp + ' />' }), document.createTextNode(' · produce ' + own + (own === 1 ? ' nodo DOM' : ' nodos DOM') + ' (raíz ' + tag(c.dom) + ') · padre: ' + (par ? '<' + par.comp + ' />' : 'ninguno (es la raíz)') + ' · usa ' + cKids[a.id].length + (cKids[a.id].length === 1 ? ' componente' : ' componentes')));
    } else {
      var copies = ctree.filter(function (c1) { return c1.comp === a.name; }), total = 0;
      copies.forEach(function (c1) { total += ownNodes(c1.dom).length; });
      info.replaceChildren(el('code', { text: '<' + a.name + ' />' }), document.createTextNode(' · ' + copies.length + (copies.length === 1 ? ' copia' : ' copias') + ' en la pantalla · ' + total + (total === 1 ? ' nodo DOM en total' : ' nodos DOM en total')));
    }
  }
  function setHover(a) { if (!same(a, hover) && !(a === null && hover === null)) { hover = a; paintActive(); } }
  function pin(a) { pinned = (a && !same(a, pinned)) ? a : null; paintActive(); }
  function idOf(target, attr) { var t = target.closest && target.closest('[' + attr + ']'); return t ? t.getAttribute(attr) : null; }
  function nodeObj(id) { return id ? { k: 'node', id: id } : null; }
  function instObj(id) { return id ? { k: 'inst', id: id } : null; }
  page.addEventListener('mouseover', function (e) { setHover(nodeObj(idOf(e.target, 'data-n'))); });
  page.addEventListener('mouseleave', function () { setHover(null); });
  page.addEventListener('click', function (e) { pin(nodeObj(idOf(e.target, 'data-n'))); });
  DT.svg.addEventListener('mouseover', function (e) { setHover(nodeObj(idOf(e.target, 'data-id'))); });
  DT.svg.addEventListener('mouseleave', function () { setHover(null); });
  DT.svg.addEventListener('click', function (e) { pin(nodeObj(idOf(e.target, 'data-id'))); });
  DT.svg.addEventListener('focusin', function (e) { setHover(nodeObj(idOf(e.target, 'data-id'))); });
  DT.svg.addEventListener('focusout', function () { setHover(null); });
  if (CT) {
    CT.svg.addEventListener('mouseover', function (e) { setHover(instObj(idOf(e.target, 'data-cid'))); });
    CT.svg.addEventListener('mouseleave', function () { setHover(null); });
    CT.svg.addEventListener('click', function (e) { pin(instObj(idOf(e.target, 'data-cid'))); });
    CT.svg.addEventListener('focusin', function (e) { setHover(instObj(idOf(e.target, 'data-cid'))); });
    CT.svg.addEventListener('focusout', function () { setHover(null); });
  }

  // ---------- pasos ----------
  function resolve(i) {   // text y show se acumulan hasta el paso i
    var text = {}, ttext = {}, shown = {}, tshown = {};
    for (var q = 0; q <= i; q++) {
      var s = steps[q] || {}, id;
      for (id in (s.text || {})) { text[id] = s.text[id]; ttext[id] = s.text[id]; }
      for (id in (s.treeText || {})) ttext[id] = s.treeText[id];   // solo el arbol (el Virtual DOM va un paso adelante de la pagina)
      (s.show || []).forEach(function (id) { shown[id] = true; tshown[id] = true; });
      (s.treeShow || []).forEach(function (id) { tshown[id] = true; });
    }
    return { text: text, ttext: ttext, shown: shown, tshown: tshown };
  }
  function excerpt(s) { return s && s.length > 15 ? s.slice(0, 14) + '…' : (s || ''); }

  function setSteps(list) {
    steps = list;
    steps.forEach(function (s) { s.msgs = s.msgs || []; });
    meter.hidden = !steps.some(function (s) { return s.meter; });   // sin medidor en ningun paso, no se reserva su espacio
  }

  function render(i, animate) {
    cur = i;
    var step = steps[i] || {}, r = resolve(i), marks = step.marks || {}, subs = step.sub || {};
    var showComp = function (name) { return !!name && (step.comps === true || (Array.isArray(step.comps) && step.comps.indexOf(name) >= 0)); };
    nodes.forEach(function (n) {
      var id = n.id, p = pageEls[id], t = DT.els[id];
      var shown = !n.hidden || !!r.shown[id];
      // texto (pagina y arbol)
      var tx = r.text[id] !== undefined ? r.text[id] : n.text;
      if (textNodes[id] && textNodes[id].nodeValue !== tx) textNodes[id].nodeValue = tx;
      var ttx = r.ttext[id] !== undefined ? r.ttext[id] : n.text;
      DT.subs[id].textContent = subs[id] !== undefined ? subs[id] : (n.sub !== undefined ? n.sub : excerpt(ttx));
      var tshown = !n.hidden || !!r.tshown[id];
      // existencia: un nodo oculto es un fantasma en el arbol y no se ve en la pagina
      p.classList.toggle('dkd-gone', !shown);
      if (shown && curShown[id] === false && animate && !DK.reduced) { p.classList.remove('dkd-pop'); void p.offsetWidth; p.classList.add('dkd-pop'); }
      curShown[id] = shown;
      var role = tshown ? marks[id] : null;
      var cc = showComp(n.cn);
      t.setAttribute('class', 'dk-tnode dkd-tn' + (role ? ' role-' + role : '') + (cc && !role ? ' comp' : '') + (tshown ? '' : ' ghost'));
      if (cc && !role) t.style.setProperty('--pc', 'var(--dk-' + colorOf(n.cn) + ')');
      if (DT.edges[id]) DT.edges[id].classList.toggle('ghost', !tshown);
      // modo componentes: la raiz de cada instancia se pinta en la pagina
      if (n.comp) p.classList.toggle('dkd-c', showComp(n.comp));
      // marcas tambien en la pagina (solo si el paso lo pide)
      ['need', 'dirty'].forEach(function (m) { p.classList.toggle('dkd-m-' + m, !!step.mirror && role === m); });
      p.classList.remove('dkd-flash');
    });
    if (CT) {
      var csub = step.csub || {}, cm = step.cmarks || {};
      ctree.forEach(function (c) {
        var own = ownNodes(c.dom).length, kc = cKids[c.id].length, crole = cm[c.id];
        CT.els[c.id].setAttribute('class', 'dk-tnode dkd-tn' + (crole ? ' role-' + crole : ' comp'));   // con rol, gana el color del rol
        CT.subs[c.id].textContent = csub[c.id] !== undefined ? csub[c.id] : (c.sub !== undefined ? c.sub : (kc ? 'usa ' + kc + ' componentes' : 'produce ' + own + (own === 1 ? ' nodo DOM' : ' nodos DOM')));
      });
    }
    if (cleg) cleg.classList.toggle('off', !step.comps);
    fillCode(step);
    if (step.view && tabBtns[step.view]) setView(step.view);
    markCode(animate);
    // parpadeo: el DOM real se toco en estos elementos
    (step.touch || []).forEach(function (id) {
      var p = pageEls[id];
      if (!p || DK.reduced || !animate) return;
      void p.offsetWidth; p.classList.add('dkd-flash');
    });
    if (pipe) {
      var sg = step.stage === undefined ? -1 : step.stage;
      pipeEls.forEach(function (c, k) {
        c.className = 'stg' + (k < sg ? ' done' : (k === sg ? (step.stageBlock ? ' blocked' : ' cur') : ''));
      });
    }
    stateEl.textContent = step.state || '';
    var m = step.meter, row = meter.firstChild;
    row.style.visibility = m ? 'visible' : 'hidden';
    if (m) {
      meterLbl.textContent = m.label; meterTxt.textContent = m.text || (m.value + ' de ' + m.max);
      meterFill.className = 'fill ' + (m.tone || 'ctl');
      meterFill.style.width = Math.max(2, Math.round(100 * m.value / m.max)) + '%';
    }
    paintActive();
    return { animMs: (step.touch || []).length ? 600 : 0 };
  }

  return { setSteps: setSteps, render: render, msgDuration: 700 };
};
