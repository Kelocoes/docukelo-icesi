// DOCS: references/kit-api.md de la skill docusaurus_animated_diagrams (API) y SKILL.md (proceso). Copia maestra: kit/ de la skill; la carpeta instalada en un proyecto es generada, no la edites.
/* dk-history.js: un navegador con una app de varias páginas + el HISTORIAL (history stack) dibujado al lado.
 * A la izquierda, el navegador (flechas Atrás/Adelante, barra de dirección y la página; en el modo libre se toca de verdad).
 * A la derecha, el historial como pila de tarjetas: la última entrada arriba, la ENTRADA ACTUAL resaltada, y las entradas
 * "de adelante" (a las que se puede volver con Adelante) atenuadas. Arriba, la llamada que se ejecuta: navigate('/x').
 * Es una escena para DK.player (con wide: true). Requiere dk-kit.js, dk-nav.css y dk-history.css (después de dk-base.css).
 * Diferencia con DK.nav (Flutter): aquí hay un PUNTERO. Atrás no destruye la entrada, solo mueve el puntero; un push desde
 * una entrada intermedia descarta las de adelante.
 *
 *   scene: function (svg, stage, api) {
 *     return DK.history({
 *       stage: stage, api: api, height: 300,            // alto de la página (por defecto 300)
 *       host: 'mi-tienda.com',                          // texto antes de la ruta en la barra de dirección
 *       view: function (path) { return '<p class="pf-h">Inicio</p><a data-to="/productos">Ver productos</a>'; },   // HTML de la página de una ruta
 *     });
 *   }
 *
 * En el HTML de las páginas, los elementos con atributos se comportan solos (guiados y modo libre):
 *   data-to="/x"        navigate('/x')                       (push: apila una entrada nueva)
 *   data-replace="/x"   navigate('/x', { replace: true })   (reemplaza la entrada actual)
 *   data-go="-1"        navigate(-1)                         (mueve el puntero; -1 = Atrás, 1 = Adelante)
 * Un campo con data-in="clave" guarda lo escrito (`c.data[clave]`) para que la vista lo muestre en el modo libre.
 *
 * Un paso (cada paso describe el historial completo):
 *   { phase, title, caption, msgs: [], dwell,
 *     entries: ['/', '/productos', '/productos/42'],   // el historial, de la más antigua a la más nueva ('ruta#etiqueta' repite una ruta)
 *     index: 2,                                        // posición del puntero (por defecto, la última)
 *     call: "navigate('/productos')",                  // la llamada que se muestra arriba
 *     tap: '[data-to="/productos"]',                   // elemento que toca un cursor antes del cambio ('__back' / '__fwd' = flechas del navegador)
 *     note: 'texto bajo la llamada', code: [3, 4],
 *     marks: { '/productos/42': { text: 'se descarta', tone: 'err' } },   // rótulo sobre una tarjeta (tone: err | ack | warn)
 *     data: { q: 'sillas' },                           // datos para las vistas en este paso
 *     free: true }                                     // modo libre: el estudiante usa el navegador y el historial cambia de verdad
 */
DK.history = function (o) {
  var el = DK.el;
  var t = DK.timers();
  var steps = [];
  var SLOT = 46, CARD = 38;
  var clone = function (x) { return JSON.parse(JSON.stringify(x)); };
  var parse = function (e) { var p = String(e).split('#'); return { id: String(e), route: p[0], tag: p[1] || '' }; };

  // ---------- navegador ----------
  var back = el('button', { class: 'bw-btn', 'data-act': '__back', 'aria-label': 'Atrás', title: 'Atrás' });
  var fwd = el('button', { class: 'bw-btn', 'data-act': '__fwd', 'aria-label': 'Adelante', title: 'Adelante' });
  back.innerHTML = '<svg class="pf-ic" viewBox="0 0 24 24"><path d="M15 5l-7 7 7 7"/></svg>';
  fwd.innerHTML = '<svg class="pf-ic" viewBox="0 0 24 24"><path d="M9 5l7 7-7 7"/></svg>';
  var urlHost = el('span', { class: 'bw-host', text: o.host || 'mi-app.com' });
  var urlPath = el('b', { class: 'bw-path' });
  var bar = el('div', { class: 'bw-bar' }, back, fwd, el('div', { class: 'bw-url' }, urlHost, urlPath));
  var body = el('div', { class: 'bw-body pf-body' });
  body.style.height = (o.height || 300) + 'px';
  var finger = el('div', { class: 'dk-finger' });
  var win = el('div', { class: 'bw', 'aria-label': 'Navegador (simulado)' }, bar, body, finger);
  var hint = el('p', { class: 'dk-ph-hint' });
  var resetBtn = el('button', { class: 'dk-ph-reset', text: 'Restablecer', onclick: function () { enterFree(); } });
  var left = el('div', { class: 'dk-ph-left' }, win, hint, resetBtn);

  // ---------- llamada y aviso ----------
  var call = el('code', { class: 'dk-ncall' });
  var note = el('p', { class: 'dk-pnote' });
  var top = el('div', { class: 'dk-ptop' }, call, note);

  // ---------- historial ----------
  var slots = 3;
  var stackBox = el('div', { class: 'dk-nstack' });
  var topTag = el('div', { class: 'dk-ntop' }, el('b', { text: 'ÚLTIMA ENTRADA' }), el('small', { text: 'la más nueva' }));
  var baseTag = el('div', { class: 'dk-nbase', text: 'LA MÁS ANTIGUA' });
  stackBox.append(topTag, baseTag);
  var info = el('div', { class: 'dk-ninfo' });
  var box = el('div', { class: 'dk-pbox dk-nbox' }, el('div', { class: 'hd' }, el('b', { text: 'Historial del navegador' }), el('small', { text: 'history stack · el puntero marca dónde estás' })), stackBox, info);
  var right = el('div', { class: 'dk-ph-right' }, box);
  o.stage.replaceChildren(el('div', { class: 'dk-ph dk-nav dk-hist', 'data-tab': 'state' }, top, left, right));

  // ---------- estado ----------
  var nodes = {}, order = [];
  var live = null, liveIdx = 0, freeOn = false, freeStep = null, data = clone(o.data || {}), serial = 0;

  function y(k) { return (slots - 1 - k) * SLOT; }
  function sizeBox() { stackBox.style.height = ((slots - 1) * SLOT + CARD + 6) + 'px'; }

  function makeCard(e) {
    var p = parse(e);
    var c = el('div', { class: 'dk-ncard dk-hcard' }, el('b', { class: 'rt', text: p.route }), el('em', { class: 'st' }), el('span', { class: 'mk' }));
    stackBox.appendChild(c);
    return c;
  }

  function applyStack(list, idx, how, animate) {
    how = how || {};
    var ids = list.map(function (e) { return parse(e).id; });
    slots = Math.max(slots, ids.length);
    sizeBox();
    order.forEach(function (id) {
      if (ids.indexOf(id) >= 0) return;
      var c = nodes[id];
      delete nodes[id];
      if (!animate || DK.reduced) { c.remove(); return; }
      c.classList.add('leaving');
      c.style.transform = 'translate(115%,' + c.__y + 'px)';
      c.style.opacity = 0;
      setTimeout(function () { c.remove(); }, 520);
    });
    ids.forEach(function (id, k) {
      var c = nodes[id], fresh = !c;
      if (fresh) { c = nodes[id] = makeCard(list[k]); }
      c.__y = y(k);
      if (fresh && animate && !DK.reduced) {
        c.style.transition = 'none'; c.style.opacity = 0; c.style.transform = 'translate(70%,' + c.__y + 'px)';
        void c.offsetWidth; c.style.transition = '';
      }
      c.style.opacity = 1;
      c.style.transform = 'translate(0,' + c.__y + 'px)';
      c.style.zIndex = k + 1;
      c.classList.toggle('cur', k === idx);
      c.classList.toggle('ahead', k > idx);
      c.classList.toggle('behind', k < idx);
      c.querySelector('.st').textContent = k === idx ? 'estás aquí' : (k > idx ? 'adelante' : 'atrás');
    });
    order = ids;
    if (ids.length) {
      topTag.style.transform = 'translateY(' + (y(ids.length - 1) + 1) + 'px)';
      baseTag.style.transform = 'translateY(' + (y(0) + 10) + 'px)';
    }
    topTag.hidden = !ids.length; baseTag.hidden = ids.length < 2;
    var cb = idx > 0, cf = idx < ids.length - 1;
    info.innerHTML = '<span>entradas: <b>' + ids.length + '</b></span><span>Atrás: <b class="' + (cb ? 'ok' : 'no') + '">' + (cb ? 'sí' : 'no') + '</b></span><span>Adelante: <b class="' + (cf ? 'ok' : 'no') + '">' + (cf ? 'sí' : 'no') + '</b></span>';
  }

  function paintMarks(marks) {
    Object.keys(nodes).forEach(function (id) {
      var c = nodes[id], m = marks && marks[id];
      c.querySelector('.mk').textContent = m ? m.text : '';
      c.classList.remove('m-err', 'm-ack', 'm-warn');
      if (m) c.classList.add('m-' + (m.tone || 'warn'));
    });
  }

  function paintPage(list, idx, step) {
    var e = list.length ? parse(list[idx]) : null;
    urlPath.textContent = e ? e.route : '';
    back.disabled = !(idx > 0); fwd.disabled = !(idx < list.length - 1);
    body.innerHTML = e ? o.view(e.route, { data: freeOn ? data : Object.assign({}, o.data, step && step.data), index: idx, tag: e.tag }) : '';
    body.toggleAttribute('inert', !freeOn);
    bar.toggleAttribute('inert', !freeOn);
  }

  function setCall(txt) { call.textContent = txt || ''; call.classList.toggle('idle', !txt); if (!txt) call.textContent = 'navigate(...)'; }
  function setNote(txt, isInfo) { note.textContent = txt || ''; note.hidden = !txt; note.classList.toggle('info', !!isInfo); }

  function tapAt(sel) {
    var target = sel === '__back' ? back : sel === '__fwd' ? fwd : body.querySelector(sel);
    if (!target) return;
    var r = target.getBoundingClientRect(), s = win.getBoundingClientRect();
    finger.style.left = (r.left - s.left + Math.min(r.width / 2, 90)) + 'px';
    finger.style.top = (r.top - s.top + r.height / 2) + 'px';
    finger.classList.remove('go'); void finger.offsetWidth; finger.classList.add('go');
    target.classList.add('pressed');
    t.later(function () { target.classList.remove('pressed'); }, 450);
  }

  // ---------- modo libre: la lógica real del historial ----------
  function enterFree() {
    t.clear();
    var s = freeStep || {};
    live = (s.entries || ['/']).slice();
    liveIdx = s.index != null ? s.index : live.length - 1;
    data = Object.assign(clone(o.data || {}), s.data);
    applyStack(live, liveIdx, {}, false); paintMarks({}); paintPage(live, liveIdx, s);
    setCall(''); setNote('');
  }

  function act(kind, arg) {
    var res = {};
    if (kind === 'go') {
      var to = liveIdx + Number(arg);
      if (to < 0 || to > live.length - 1) { setCall('navigate(' + arg + ')'); setNote(Number(arg) < 0 ? 'No hay entradas atrás: el puntero ya está en la más antigua.' : 'No hay entradas adelante: el puntero ya está en la última.'); return; }
      liveIdx = to;
      res = { call: 'navigate(' + arg + ')', note: 'Solo se mueve el puntero: ninguna entrada se destruye.' };
    } else if (kind === 'push') {
      var dropped = live.length - 1 - liveIdx;
      live = live.slice(0, liveIdx + 1);
      live.push(arg + '#' + (++serial)); liveIdx = live.length - 1;
      res = { call: "navigate('" + arg + "')", note: dropped ? 'Las ' + dropped + ' entrada(s) de adelante se descartan: ya no se puede volver a ellas con Adelante.' : 'Se apila una entrada nueva y el puntero se mueve a ella.' };
    } else if (kind === 'replace') {
      live[liveIdx] = arg + '#' + (++serial);
      res = { call: "navigate('" + arg + "', { replace: true })", note: 'La entrada actual se reemplaza: el historial no crece y Atrás no vuelve a la anterior.' };
    }
    applyStack(live, liveIdx, {}, true); paintMarks({});
    t.later(function () { paintPage(live, liveIdx, freeStep); }, DK.reduced ? 0 : 220);
    setCall(res.call); setNote(res.note);
    if (o.api && freeStep && freeStep.codeFor && freeStep.codeFor[kind]) o.api.code(freeStep.codeFor[kind]);
  }

  function onClick(e) {
    if (!freeOn) return;
    var n = e.target.closest ? e.target.closest('[data-to],[data-replace],[data-go],[data-act]') : null;
    if (!n) return;
    e.preventDefault();
    var act_ = n.getAttribute('data-act');
    if (act_ === '__back' || n.hasAttribute('data-go') && n.getAttribute('data-go') === '-1') return act('go', -1);
    if (act_ === '__fwd') return act('go', 1);
    if (n.hasAttribute('data-go')) return act('go', n.getAttribute('data-go'));
    if (n.hasAttribute('data-replace')) return act('replace', n.getAttribute('data-replace'));
    if (n.hasAttribute('data-to')) return act('push', n.getAttribute('data-to'));
  }
  body.addEventListener('click', onClick);
  bar.addEventListener('click', onClick);
  body.addEventListener('input', function (e) {
    var key = freeOn && e.target.getAttribute && e.target.getAttribute('data-in');
    if (key) data[key] = e.target.value;
  });

  // ---------- contrato con DK.player ----------
  function setSteps(list) {
    steps = list;
    var m = 3;
    list.forEach(function (s) { if (s.entries && s.entries.length > m) m = s.entries.length; });
    slots = m; sizeBox();
    Object.keys(nodes).forEach(function (id) { nodes[id].remove(); delete nodes[id]; });
    order = [];
  }

  function indexOf(s) { return s.index != null ? s.index : s.entries.length - 1; }

  function render(i, animate) {
    t.clear(); freeOn = false; freeStep = null;
    var step = steps[i];
    win.classList.remove('free');
    resetBtn.hidden = true;
    finger.classList.remove('go');
    if (step && step.free) {
      freeOn = true; freeStep = step;
      win.classList.add('free'); resetBtn.hidden = false;
      hint.textContent = o.hint || 'Usa los enlaces y las flechas del navegador y mira cómo cambia el historial.'; hint.classList.add('live');
      enterFree();
      return { animMs: 0 };
    }
    hint.textContent = 'Simulación: lo que ve el usuario'; hint.classList.remove('live');
    if (!step) {
      var first = steps[0] && steps[0].entries ? steps[0] : { entries: ['/'] };
      applyStack(first.entries, indexOf(first), {}, false); paintMarks({}); paintPage(first.entries, indexOf(first), first);
      setCall(''); setNote(o.introNote || 'Cada página que visitas queda anotada en el historial. Pulsa Siguiente.', true);
      return { animMs: 0 };
    }
    var apply = function () {
      applyStack(step.entries, indexOf(step), {}, animate);
      paintMarks(step.marks);
      paintPage(step.entries, indexOf(step), step);
      setCall(step.call); setNote(step.note);
    };
    var prev = steps[i - 1];
    var sig = function (s) { return s.entries.join('|') + '@' + indexOf(s); };
    var changes = !prev || !prev.entries || sig(prev) !== sig(step);
    if (animate && step.tap && changes && prev && prev.entries) {
      // causa y efecto: primero el toque (sobre la página anterior) y después el cambio del historial
      paintPage(prev.entries, indexOf(prev), prev); applyStack(prev.entries, indexOf(prev), {}, false); paintMarks(prev.marks);
      setCall(''); setNote('');
      t.later(function () { tapAt(step.tap); }, 150);
      t.later(apply, 750);
    } else {
      apply();
      if (animate && step.tap && !changes) t.later(function () { tapAt(step.tap); }, 150);
    }
    return { animMs: 0 };
  }

  return { setSteps: setSteps, render: render, msgDuration: 0 };
};
