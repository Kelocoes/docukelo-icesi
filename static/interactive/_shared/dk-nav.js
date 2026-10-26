// DOCS: .agents/skills/docusaurus_animated_diagrams/references/kit-api.md (API) y SKILL.md (proceso). Copia maestra unica del kit.
/* dk-nav.js: un teléfono con una app de varias pantallas + la PILA DE RUTAS del Navigator dibujada al lado.
 * A la izquierda, el teléfono (HTML con estilo Material; en el modo libre se toca de verdad). A la derecha, la pila como
 * tarjetas: la de arriba es el tope (la que se ve en el teléfono), las de abajo siguen vivas pero suspendidas. Una tarjeta
 * nueva entra por la derecha (push); la que sale se va hacia la derecha (pop) o hacia la izquierda (purga de la pila).
 * Arriba: la llamada a Navigator que se está ejecutando y un aviso. Es una escena para DK.player (con wide: true).
 * Requiere dk-kit.js, dk-nav.css (después de dk-base.css) y los estilos pf-* de dk-base.css.
 *
 *   scene: function (svg, stage, api) {
 *     return DK.nav({
 *       stage: stage, api: api,
 *       height: 330,                                   // alto de la pantalla del teléfono (por defecto 360)
 *       data: { q: 'sillas' },                         // datos compartidos de las pantallas (el modo libre trabaja sobre una copia)
 *       screens: {                                     // una entrada por ruta
 *         '/': { title: 'Catálogo', widget: 'HomeScreen', noBack: true,
 *                view: function (c) { return '<button class="pf-btn" data-act="detalle">Ver detalle</button>'; } },
 *       },                                             // c = { data, index (posición en la pila), tag }; noBack = sin flecha (automaticallyImplyLeading: false)
 *       sysBack: true,                                 // botón "Atrás del sistema" bajo el teléfono (Android/iOS)
 *       actions: {                                     // modo libre: fn(nav, arg, step) -> { call, code, note }
 *         detalle: function (nav) { nav.push('/detalle'); return { call: "Navigator.pushNamed(context, '/detalle')", code: [3] }; },
 *       },
 *     });
 *   }
 *
 * Una entrada de la pila es 'ruta' o 'ruta#etiqueta' (la etiqueta distingue dos instancias de la misma ruta: '/login#2').
 * La API `nav` que reciben las acciones: push(entry), pop() -> true|false (false = no hay a dónde volver), canPop(),
 *   removeUntil(entry, predicado) (apila entry y quita desde el tope hacia abajo mientras predicado(r) sea false;
 *   r = { route, tag, isFirst }), stack() (copia de la pila).
 * Un paso (cada paso describe la pila completa):
 *   { phase, title, caption, msgs: [], dwell,
 *     stack: ['/', '/detalle'],            // la pila en este paso
 *     out: 'left',                         // hacia dónde salen las tarjetas que se van: 'right' (pop, por defecto) | 'left' (purga)
 *     call: "Navigator.pushNamed(...)",    // la llamada que se muestra arriba
 *     tap: 'detalle',                      // data-act que toca un dedo antes del cambio ('__back' = flecha de la AppBar, 'sys' = botón del sistema)
 *     data: { mode: 'B' },                 // datos extra para las pantallas en este paso (se mezclan con `data` de la escena)
 *     marks: { '/checkout': { text: 'false → se elimina', tone: 'err' } },   // rótulo sobre una tarjeta (tone: err | ack | warn)
 *     exit: true,                          // el sistema cierra la app (pop sin ruta a la que volver)
 *     note: 'texto bajo la llamada', code: [3, 4],
 *     free: true }                         // modo libre: el estudiante toca el teléfono y la pila cambia de verdad
 */
DK.nav = function (o) {
  var el = DK.el;
  var t = DK.timers();
  var steps = [];
  var SLOT = 54, CARD = 46;
  var clone = function (x) { return JSON.parse(JSON.stringify(x)); };
  var esc = DK.phone && DK.phone.esc ? DK.phone.esc : function (s) { return String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;'); };
  var parse = function (e) { var p = String(e).split('#'); return { id: String(e), route: p[0], tag: p[1] || '' }; };

  // ---------- teléfono ----------
  var appbar = el('div', { class: 'pf-appbar nav' });
  var body = el('div', { class: 'pf-body' });
  var exitBox = el('div', { class: 'pf-exit' }, el('b', { text: 'La app se cierra' }), el('small', { text: 'Navigator no tiene a dónde volver: el sistema se encarga' }));
  var finger = el('div', { class: 'dk-finger' });
  var screen = el('div', { class: 'dk-phone-screen' }, appbar, body, exitBox, finger);
  screen.style.setProperty('--ph-h', (o.height || 360) + 'px');
  var phone = el('div', { class: 'dk-phone', 'aria-label': 'Pantalla del teléfono (simulada)' }, el('i', { class: 'dk-phone-cam' }), screen);
  var hint = el('p', { class: 'dk-ph-hint' });
  var sysBtn = o.sysBack ? el('button', { class: 'dk-ph-sys', 'data-sys': '1', text: 'Atrás del sistema', title: 'Botón o gesto Atrás de Android/iOS' }) : null;
  var resetBtn = el('button', { class: 'dk-ph-reset', text: 'Restablecer', onclick: function () { enterFree(); } });
  var left = el('div', { class: 'dk-ph-left' }, phone, hint, sysBtn, resetBtn);

  // ---------- llamada y aviso ----------
  var call = el('code', { class: 'dk-ncall' });
  var note = el('p', { class: 'dk-pnote' });
  var top = el('div', { class: 'dk-ptop' }, call, note);

  // ---------- pila ----------
  var slots = 4;
  var stackBox = el('div', { class: 'dk-nstack' });
  var topTag = el('div', { class: 'dk-ntop' }, el('i'), el('b', { text: 'TOPE DE LA PILA' }), el('small', { text: 'top of stack' }));
  var baseTag = el('div', { class: 'dk-nbase', text: 'BASE' });
  stackBox.append(topTag, baseTag);
  var info = el('div', { class: 'dk-ninfo' });
  var box = el('div', { class: 'dk-pbox dk-nbox' }, el('div', { class: 'hd' }, el('b', { text: 'Navigator · pila de rutas' }), el('small', { text: 'LIFO: el último en entrar es el primero en salir' })), stackBox, info);
  var right = el('div', { class: 'dk-ph-right' }, box);
  o.stage.replaceChildren(el('div', { class: 'dk-ph dk-nav', 'data-tab': 'state' }, top, left, right));

  // ---------- estado ----------
  var nodes = {};          // id -> elemento de la tarjeta
  var order = [];          // ids actuales, de la base al tope
  var live = null, freeOn = false, freeStep = null, data = clone(o.data || {});

  function y(k) { return (slots - 1 - k) * SLOT; }
  function sizeBox() { stackBox.style.height = ((slots - 1) * SLOT + CARD + 6) + 'px'; }

  function makeCard(e) {
    var p = parse(e), sc = (o.screens || {})[p.route] || {};
    var c = el('div', { class: 'dk-ncard' }, el('b', { class: 'rt', text: p.route }), el('span', { class: 'wd', text: sc.widget || '' }), el('em', { class: 'st' }), el('span', { class: 'mk' }));
    stackBox.appendChild(c);
    return c;
  }

  function applyStack(list, how, animate) {
    how = how || {};
    var ids = list.map(function (e) { return parse(e).id; });
    slots = Math.max(slots, ids.length);
    sizeBox();
    // las que ya no están, salen
    order.forEach(function (id) {
      if (ids.indexOf(id) >= 0) return;
      var c = nodes[id];
      delete nodes[id];
      if (!animate || DK.reduced) { c.remove(); return; }
      c.classList.add('leaving');
      c.style.transform = 'translate(' + (how.out === 'left' ? '-115%' : '115%') + ',' + c.__y + 'px)';
      c.style.opacity = 0;
      setTimeout(function () { c.remove(); }, 520);
    });
    // las nuevas entran por la derecha; las que quedan se acomodan
    ids.forEach(function (id, k) {
      var c = nodes[id], fresh = !c;
      if (fresh) { c = nodes[id] = makeCard(list[k]); }
      c.__y = y(k);
      if (fresh) {
        if (animate && !DK.reduced) {
          c.style.transition = 'none'; c.style.opacity = 0; c.style.transform = 'translate(70%,' + c.__y + 'px)';
          void c.offsetWidth; c.style.transition = '';
        }
      }
      c.style.opacity = 1;
      c.style.transform = 'translate(0,' + c.__y + 'px)';
      c.style.zIndex = k + 1;
      var isTop = k === ids.length - 1, isBase = k === 0;
      c.classList.toggle('top', isTop);
      c.classList.toggle('sleep', !isTop);
      c.querySelector('.st').textContent = isTop ? 'visible' : (isBase && ids.length > 1 ? 'base · suspendida' : 'suspendida');
    });
    order = ids;
    if (ids.length) {
      topTag.style.transform = 'translateY(' + (y(ids.length - 1) + 4) + 'px)';
      baseTag.style.transform = 'translateY(' + (y(0) + 14) + 'px)';
    }
    topTag.hidden = !ids.length; baseTag.hidden = ids.length < 2;   // con una sola ruta es base y tope a la vez
    info.innerHTML = '<span><code>canPop()</code> = <b class="' + (ids.length > 1 ? 'ok' : 'no') + '">' + (ids.length > 1 ? 'true' : 'false') + '</b></span><span>rutas en la pila: <b>' + ids.length + '</b></span>';
  }

  function paintMarks(marks) {
    Object.keys(nodes).forEach(function (id) {
      var c = nodes[id], m = marks && marks[id];
      var mk = c.querySelector('.mk');
      mk.textContent = m ? m.text : '';
      c.classList.remove('m-err', 'm-ack', 'm-warn');
      if (m) c.classList.add('m-' + (m.tone || 'warn'));
    });
  }

  function paintPhone(list, step) {
    var e = list.length ? parse(list[list.length - 1]) : null;
    var sc = e ? (o.screens || {})[e.route] : null;
    appbar.replaceChildren();
    if (sc) {
      if (list.length > 1 && !sc.noBack) {
        var bk = el('button', { class: 'bk', 'data-act': '__back', 'aria-label': 'Atrás' });
        bk.innerHTML = '<svg class="pf-ic" viewBox="0 0 24 24"><path d="M15 5l-7 7 7 7"/></svg>';
        appbar.appendChild(bk);
      }
      appbar.appendChild(el('span', { text: sc.title || e.route }));
      body.innerHTML = sc.view({ data: freeOn ? data : Object.assign({}, o.data, step && step.data), index: list.length - 1, tag: e.tag });
    } else body.innerHTML = '';
    body.toggleAttribute('inert', !freeOn);
    appbar.toggleAttribute('inert', !freeOn);
  }

  function setCall(txt) { call.textContent = txt || ''; call.classList.toggle('idle', !txt); if (!txt) call.textContent = 'Navigator'; }
  function setNote(txt, info) { note.textContent = txt || ''; note.hidden = !txt; note.classList.toggle('info', !!info); }
  function showExit(on) { exitBox.classList.toggle('on', !!on); }

  function tapAt(name) {
    var target = name === 'sys' ? sysBtn : (body.querySelector('[data-act="' + name + '"]') || appbar.querySelector('[data-act="' + name + '"]'));
    if (!target) return;
    var r = target.getBoundingClientRect(), s = screen.getBoundingClientRect();
    if (name === 'sys') { target.classList.add('pressed'); t.later(function () { target.classList.remove('pressed'); }, 450); return; }
    finger.style.left = (r.left - s.left + Math.min(r.width / 2, 90)) + 'px';
    finger.style.top = (r.top - s.top + r.height / 2) + 'px';
    finger.classList.remove('go'); void finger.offsetWidth; finger.classList.add('go');
    target.classList.add('pressed');
    t.later(function () { target.classList.remove('pressed'); }, 450);
  }

  // ---------- modo libre ----------
  var nav = {
    stack: function () { return live.slice(); },
    canPop: function () { return live.length > 1; },
    push: function (e) { live.push(e); },
    pop: function () { if (live.length < 2) return false; live.pop(); return true; },
    removeUntil: function (e, pred) {
      live.push(e);
      var rest = live.slice(0, -1);
      while (rest.length) {
        var last = parse(rest[rest.length - 1]);
        if (pred({ route: last.route, tag: last.tag, isFirst: rest.length === 1 })) break;
        rest.pop();
      }
      live = rest.concat([e]);
    },
  };

  function enterFree() {
    t.clear(); showExit(false);
    live = (freeStep && freeStep.stack ? freeStep.stack : ['/']).slice();
    data = Object.assign(clone(o.data || {}), freeStep && freeStep.data);
    applyStack(live, {}, false); paintMarks({}); paintPhone(live, freeStep);
    setCall(''); setNote('');
  }

  function runAction(name, arg) {
    var before = live.slice();
    var res;
    if (name === '__back') {
      var ok = nav.pop();
      res = { call: 'Navigator.pop(context)', note: ok ? 'La flecha de la AppBar llama a Navigator.pop: desapila la ruta del tope.' : '' };
    } else {
      var act = o.actions && o.actions[name];
      if (!act) return;
      res = act(nav, arg, freeStep) || {};
    }
    showExit(false);
    var out = (res.out) || 'right';
    applyStack(live, { out: out }, true); paintMarks({});
    // el teléfono cambia cuando la tarjeta ya se movió
    t.later(function () { paintPhone(live, freeStep); }, DK.reduced ? 0 : 220);
    setCall(res.call || ''); setNote(res.note || '');
    if (res.code && o.api) o.api.code(res.code);
    if (before.join('|') === live.join('|') && !res.note && !res.call) setNote('La pila no cambió.');
  }

  function sysBack() {
    if (!freeOn) return;
    var ok = nav.pop();
    if (ok) {
      applyStack(live, { out: 'right' }, true); paintMarks({});
      t.later(function () { paintPhone(live, freeStep); }, DK.reduced ? 0 : 220);
      setCall('Navigator.pop(context)'); setNote('El botón Atrás del sistema hace pop de la ruta del tope: vuelve a la pantalla que estaba debajo.');
    } else {
      showExit(true);
      setCall('canPop() == false'); setNote('Con una sola ruta en la pila no hay a dónde volver: Atrás cierra (minimiza) la app. Eso es lo que quieres tras un cierre de sesión.');
    }
  }

  body.addEventListener('click', function (e) {
    if (!freeOn) return;
    var n = e.target.closest ? e.target.closest('[data-act]') : null;
    if (!n || !body.contains(n)) return;
    e.preventDefault();
    runAction(n.getAttribute('data-act'), n.getAttribute('data-arg'));
  });
  appbar.addEventListener('click', function (e) {
    if (!freeOn) return;
    var n = e.target.closest ? e.target.closest('[data-act]') : null;
    if (n) { e.preventDefault(); runAction(n.getAttribute('data-act')); }
  });
  body.addEventListener('input', function (e) {
    var key = freeOn && e.target.getAttribute && e.target.getAttribute('data-in');
    if (key) data[key] = e.target.value;
  });
  if (sysBtn) sysBtn.addEventListener('click', sysBack);

  // ---------- contrato con DK.player ----------
  function setSteps(list) {
    steps = list;
    var m = 4;
    list.forEach(function (s) { if (s.stack && s.stack.length > m) m = s.stack.length; });
    slots = m; sizeBox();
    // al reconstruir los pasos (otro selector) se limpia la pila dibujada
    Object.keys(nodes).forEach(function (id) { nodes[id].remove(); delete nodes[id]; });
    order = [];
  }

  function render(i, animate) {
    t.clear(); freeOn = false; freeStep = null; showExit(false);
    var step = steps[i];
    phone.classList.remove('free');
    resetBtn.hidden = true;
    if (sysBtn) sysBtn.disabled = !(step && step.free);
    finger.classList.remove('go');
    if (step && step.free) {
      freeOn = true; freeStep = step;
      phone.classList.add('free'); resetBtn.hidden = false;
      hint.textContent = o.hint || 'Toca los botones del teléfono y mira cómo cambia la pila.'; hint.classList.add('live');
      enterFree();
      return { animMs: 0 };
    }
    hint.textContent = 'Simulación: lo que ve el usuario'; hint.classList.remove('live');
    if (!step) {
      var first = steps[0] && steps[0].stack ? steps[0].stack : ['/'];
      applyStack(first, {}, false); paintMarks({}); paintPhone(first);
      setCall(''); setNote(o.introNote || 'Cada pantalla de la app es una ruta en esta pila. Pulsa Siguiente.', true);
      return { animMs: 0 };
    }
    var apply = function () {
      applyStack(step.stack, { out: step.out }, animate);
      paintMarks(step.marks);
      paintPhone(step.stack, step);
      showExit(step.exit);
      setCall(step.call); setNote(step.note);
    };
    var prev = steps[i - 1];
    var changes = !prev || !prev.stack || prev.stack.join('|') !== step.stack.join('|');
    if (animate && step.tap && changes && prev && prev.stack) {
      // causa y efecto: primero el toque (sobre la pantalla anterior) y después el cambio de la pila
      paintPhone(prev.stack, prev); applyStack(prev.stack, {}, false); paintMarks(prev.marks);
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
