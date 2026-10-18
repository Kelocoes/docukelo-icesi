// DOCS: .agents/skills/docusaurus_animated_diagrams/references/kit-api.md (API) y SKILL.md (proceso). Copia maestra unica del kit.
/* dk-table.js: tabla de datos con estado. Muestra filas reales y, en cada paso, qué parte de ellas llega al cliente:
 * todas, o una página, ordenada o no, con el SQL que se genera, los metadatos de Page<T> y medidores de costo.
 * Sirve para paginación, orden, filtros, LIMIT/OFFSET y, en general, "qué trae esta consulta". Es una escena para DK.player.
 * Requiere dk-kit.js y los estilos de dk-base.css.
 *
 *   scene: function (svg, stage) {
 *     return DK.table({ stage, table: 'products', entity: 'Product',
 *       columns: [{ key: 'id', label: 'id' }, { key: 'name', label: 'name' }, { key: 'price', label: 'price', align: 'right' }],
 *       rows: [ { id: 1, name: 'Teclado', price: 120 }, ... ] });
 *   }
 *
 * Un paso (sin msgs; pon msgs: [] porque el player los usa para calcular la duración):
 *   { phase, title, caption, msgs: [],
 *     view:   { mode: 'all' }                                        // todas las filas
 *          o  { mode: 'page', page: 1, size: 5, sort: { key: 'price', dir: 'desc' } },   // una página (sort opcional)
 *     focusMeta: true,                                               // resalta la tarjeta de metadatos de Page<T>
 *     meters: [ { label: 'Filas que viajan', value: 23, max: 23, text: '23 de 23', tone: 'err' } ],   // tone: err | ack | ctl
 *     code: [5, 6] }                                                 // líneas del panel de código (opción code del player)
 * El SQL (SELECT ... ORDER BY ... LIMIT ... OFFSET ...) y los metadatos (totalElements, totalPages, number, size, hasNext)
 * se calculan solos a partir de view y de las filas.
 */
DK.table = function (o) {
  var el = DK.el;
  var steps = [];
  var TOTAL = o.rows.length;
  var tname = o.table || 'tabla';
  var entity = o.entity || 'Entity';

  var chips = el('div', { class: 'dk-chiprow' });
  var tHead = el('div', { class: 'hd' });
  var tbody = el('tbody');
  var thead = el('thead', {}, el('tr', {}, o.columns.map(function (c) { return el('th', { text: c.label, class: c.align === 'right' ? 'r' : '' }); })));
  var scroller = el('div', { class: 'body' }, el('table', {}, thead, tbody));
  var pager = el('div', { class: 'dk-pager' });
  var tableBox = el('div', { class: 'dk-tbl' }, tHead, scroller, pager);
  var metaBox = el('div', { class: 'dk-meta' });
  var sql = el('pre', { class: 'dk-sql' });
  var meters = el('div', { class: 'dk-meters' });
  o.stage.replaceChildren(el('div', { class: 'dk-tblwrap' }, chips, tableBox, metaBox, sql, meters));

  function sorted(view) {
    var rows = o.rows.slice();
    if (view.sort) {
      var k = view.sort.key, d = view.sort.dir === 'desc' ? -1 : 1;
      rows.sort(function (a, b) { return (a[k] > b[k] ? 1 : a[k] < b[k] ? -1 : 0) * d; });
    }
    return rows;
  }

  function setSteps(list) { steps = list; }

  function render(i, animate) {
    var step = steps[i];
    var view = (step && step.view) || { mode: 'all' };
    var all = view.mode !== 'page';
    var size = view.size || TOTAL, page = view.page || 0;
    var totalPages = all ? 1 : Math.ceil(TOTAL / size);
    var rows = sorted(view);
    var shown = all ? rows : rows.slice(page * size, page * size + size);
    var order = view.sort ? ' ORDER BY ' + view.sort.key + ' ' + view.sort.dir.toUpperCase() : '';

    // etiqueta de la peticion
    chips.replaceChildren(el('span', { class: 'dk-pill' }, all ? 'Sin Pageable: findAll()'
      : 'Pageable: page=' + page + ', size=' + size + (view.sort ? ', sort=' + view.sort.key + ',' + view.sort.dir.toUpperCase() : '')));

    // tabla
    tHead.replaceChildren(el('span', { text: tname }), el('span', { text: all ? shown.length + ' filas' : 'filas ' + (page * size + 1) + ' a ' + (page * size + shown.length) + ' de ' + TOTAL }));
    tbody.replaceChildren.apply(tbody, shown.map(function (r) {
      return el('tr', {}, o.columns.map(function (c) { return el('td', { text: String(r[c.key]), class: c.align === 'right' ? 'r' : '' }); }));
    }));
    scroller.classList.toggle('scroll', all);
    scroller.scrollTop = 0;
    tbody.classList.remove('swap');
    if (animate && !DK.reduced) { void tbody.offsetWidth; tbody.classList.add('swap'); }

    // paginador
    pager.hidden = all;
    pager.replaceChildren.apply(pager, all ? [] : [el('span', { text: '‹' })].concat(
      Array.apply(null, Array(totalPages)).map(function (_, p) { return el('span', { text: String(p + 1), class: p === page ? 'on' : '' }); }),
      [el('span', { text: '›' })]));

    // metadatos de Page<T>
    metaBox.hidden = all;
    metaBox.classList.toggle('on', !!(step && step.focusMeta));
    if (!all) {
      var hasNext = page + 1 < totalPages;
      metaBox.replaceChildren(el('h4', { text: 'Page<' + entity + '>' }), ...[
        ['getContent().size()', shown.length], ['getTotalElements()', TOTAL], ['getTotalPages()', totalPages],
        ['getNumber()', page], ['getSize()', size], ['hasNext()', String(hasNext)],
      ].map(function (kv) { return el('div', {}, el('span', { text: kv[0] }), el('b', { text: String(kv[1]) })); }));
    }

    // SQL generado
    sql.textContent = all ? 'SELECT * FROM ' + tname + order + ';'
      : 'SELECT * FROM ' + tname + order + ' LIMIT ' + size + ' OFFSET ' + page * size + ';\nSELECT COUNT(*) FROM ' + tname + ';   -- para totalElements y totalPages';

    // medidores de costo
    meters.hidden = !(step && step.meters && step.meters.length);
    meters.replaceChildren.apply(meters, ((step && step.meters) || []).map(function (m) {
      var fill = el('div', { class: 'fill ' + (m.tone || 'ctl') });
      fill.style.width = Math.max(1.5, (m.value / m.max) * 100) + '%';
      return el('div', { class: 'dk-meter' }, el('span', { text: m.label }), el('div', { class: 'bar' }, fill), el('b', { text: m.text || String(m.value) }));
    }));
    return { animMs: 0 };
  }

  return { setSteps: setSteps, render: render, msgDuration: 700 };
};
