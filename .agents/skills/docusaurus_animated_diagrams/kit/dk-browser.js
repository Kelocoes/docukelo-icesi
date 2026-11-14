// DOCS: references/kit-api.md de la skill docusaurus_animated_diagrams (API) y SKILL.md (proceso). Copia maestra: kit/ de la skill; la carpeta instalada en un proyecto es generada, no la edites.
/* dk-browser.js: escena de un NAVEGADOR simulado con su página y un panel de herramientas de desarrollo
 * (Network y Application > Local Storage). Sirve para ver lo que el estudiante vería en la pantalla mientras
 * el código hace su trabajo: el formulario, el mensaje de error, la lista que llega, el token que aparece
 * en el almacenamiento, las peticiones con su estado. Cargar dk-browser.css. Se usa sola en DK.player
 * (scene: function (svg, stage) { return DK.browser({ stage: stage }); }) o como una pestaña de DK.views.
 *
 *   DK.browser({ stage, pageHeight: 130 })
 *
 * Cada paso lleva `screen` (el estado COMPLETO de la pantalla en ese paso, no un cambio):
 *   screen: {
 *     url: 'localhost:5173/login',            // barra de direcciones
 *     page: '<h2 class="bw-h">Entrar</h2>…',   // HTML de la página (clases bw-*, ver dk-browser.css)
 *     dev: 'net' | 'app',                      // pestaña de las herramientas que se abre en este paso
 *     net: [{ m: 'POST', url: '/auth/login', st: '200', auth: false }],   // st: '200', '401', '…' (pendiente), 'ERR'
 *     storage: [['token', 'eyJhbGci…']],       // Application > Local Storage
 *   }
 * Las filas y claves nuevas respecto del paso anterior se resaltan al llegar. Con i = -1 (antes del primer paso) se
 * muestra la pantalla del primer paso.
 */
DK.browser = function (o) {
  var el = DK.el;
  var steps = [];
  var last = { page: null, net: 0, keys: [] };
  var tab = 'net';

  var url = el('span', { class: 'bw-urltxt' });
  var page = el('div', { class: 'bw-page' });
  if (o.pageHeight) page.style.setProperty('--bw-ph', o.pageHeight + 'px');
  var btnNet = el('button', { class: 'bw-dt on', text: 'Network', onclick: function () { setTab('net'); } });
  var btnApp = el('button', { class: 'bw-dt', text: 'Application · Local Storage', onclick: function () { setTab('app'); } });
  var body = el('div', { class: 'bw-dbody' });
  var root = el('div', { class: 'bw', 'aria-label': 'Navegador simulado' },
    el('div', { class: 'bw-chrome' },
      el('span', { class: 'bw-dots' }, el('i'), el('i'), el('i')),
      el('span', { class: 'bw-url' }, el('span', { class: 'bw-lock', 'aria-hidden': 'true', text: '●' }), url)),
    page,
    el('div', { class: 'bw-dev' }, el('div', { class: 'bw-dtabs', role: 'tablist' }, btnNet, btnApp), body));
  o.stage.appendChild(root);

  var cur = null;   // la pantalla que se está mostrando (para repintar al cambiar de pestaña a mano)

  function setTab(t) {
    tab = t;
    btnNet.classList.toggle('on', t === 'net');
    btnApp.classList.toggle('on', t === 'app');
    if (cur) drawDev(cur, false);
  }

  function stClass(st) {
    st = String(st);
    if (st === '…') return 'pend';
    return /^[23]/.test(st) ? 'ok' : 'bad';
  }

  function drawDev(sc, markNew) {
    var rows = sc.net || [], store = sc.storage || [];
    body.replaceChildren();
    if (tab === 'net') {
      var table = el('table', { class: 'bw-tbl' },
        el('thead', {}, el('tr', {}, el('th', { text: 'Método' }), el('th', { text: 'URL' }), el('th', { text: 'Estado' }), el('th', { text: 'Authorization' }))));
      var tb = el('tbody');
      if (!rows.length) tb.appendChild(el('tr', {}, el('td', { class: 'bw-empty', colspan: '4', text: 'Sin peticiones todavía' })));
      rows.forEach(function (r, k) {
        tb.appendChild(el('tr', { class: markNew && k >= last.net ? 'new' : '' },
          el('td', { text: r.m }), el('td', { text: r.url }),
          el('td', { class: 'st ' + stClass(r.st), text: r.st }),
          el('td', { class: r.auth ? 'au' : 'no', text: r.auth ? 'Bearer eyJhbGci…' : '—' })));
      });
      table.appendChild(tb);
      body.appendChild(table);
    } else {
      var t2 = el('table', { class: 'bw-tbl' }, el('thead', {}, el('tr', {}, el('th', { text: 'Clave' }), el('th', { text: 'Valor' }))));
      var b2 = el('tbody');
      if (!store.length) b2.appendChild(el('tr', {}, el('td', { class: 'bw-empty', colspan: '2', text: 'localStorage vacío' })));
      store.forEach(function (kv) {
        b2.appendChild(el('tr', { class: markNew && last.keys.indexOf(kv[0]) < 0 ? 'new' : '' }, el('td', { text: kv[0] }), el('td', { text: kv[1] })));
      });
      t2.appendChild(b2);
      body.appendChild(t2);
    }
  }

  function render(i, animate) {
    var step = steps[Math.max(i, 0)];
    var sc = step && step.screen;
    if (!sc) return { animMs: 0 };
    cur = sc;
    if (sc.dev) { tab = sc.dev; btnNet.classList.toggle('on', tab === 'net'); btnApp.classList.toggle('on', tab === 'app'); }
    url.textContent = sc.url || '';
    if (last.page !== sc.page) {
      page.innerHTML = sc.page || '';
      if (animate && last.page !== null) { page.classList.remove('swap'); void page.offsetWidth; page.classList.add('swap'); }
    }
    // lo "nuevo" se resalta solo si el estudiante avanza hacia delante un paso
    drawDev(sc, animate && i >= 0);
    last = { page: sc.page, net: (sc.net || []).length, keys: (sc.storage || []).map(function (kv) { return kv[0]; }) };
    return { animMs: 400 };
  }

  return {
    msgDuration: 700,
    setSteps: function (s) { steps = s; last = { page: null, net: 0, keys: [] }; },
    render: render,
  };
};
