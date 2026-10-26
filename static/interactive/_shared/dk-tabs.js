/* DOCS: .agents/skills/docusaurus_animated_diagrams/references/kit-api.md. DK.tabs.phone: teléfono con NavigationBar y un detalle que la cubre. Cargar dk-kit.js antes y dk-tabs.css. */
(function () {
  var DK = window.DK = window.DK || {};
  var ICON = {
    school: 'M5 13.18v4L12 21l7-3.82v-4L12 17l-7-3.82zM12 3L1 9l11 6 9-4.91V17h2V9L12 3z',
    bookmark: 'M17 3H7c-1.1 0-2 .9-2 2v16l7-3 7 3V5c0-1.1-.9-2-2-2z',
    person: 'M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z'
  };
  var TABS = [{ label: 'Cursos', icon: 'school' }, { label: 'Guardados', icon: 'bookmark' }, { label: 'Perfil', icon: 'person' }];
  var COURSES = ['Flutter Declarativo', 'Arquitectura con Spring', 'Cloud con Supabase'];
  var esc = function (s) { return String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/"/g, '&quot;'); };
  var svg = function (k) { return '<svg class="pf-ic" viewBox="0 0 24 24"><path d="' + ICON[k] + '"/></svg>'; };

  /* opts: height (px), on(act, arg) con act = 'tab' | 'open' | 'back', onType(texto). El teléfono no guarda estado: render(v) dibuja { tab, detail, q, bar } */
  DK.tabs = {
    phone: function (opts) {
      var el = DK.el, o = opts || {};
      var appbar = el('div', { class: 'pf-appbar nav' }), body = el('div', { class: 'pf-body' }), bar = el('div', { class: 'pf-bnav' });
      var screen = el('div', { class: 'dk-phone-screen' }, appbar, body, bar);
      screen.style.setProperty('--ph-h', (o.height || 360) + 'px');
      var root = el('div', { class: 'dk-phone free dk-tabsph', 'aria-label': 'Teléfono simulado' }, el('i', { class: 'dk-phone-cam' }), screen);
      var last = {};
      function on(act, arg) { if (o.on) o.on(act, arg); }
      root.addEventListener('click', function (e) {
        var n = e.target.closest('[data-act]'); if (!n) return;
        on(n.getAttribute('data-act'), n.getAttribute('data-arg'));
      });
      root.addEventListener('input', function (e) { if (e.target.getAttribute('data-in') === 'q' && o.onType) o.onType(e.target.value); });
      return {
        el: root,
        render: function (v) {
          var detailChanged = last.detail !== v.detail;
          last = { detail: v.detail };
          appbar.replaceChildren();
          if (v.detail) {
            var bk = el('button', { class: 'bk', 'data-act': 'back', 'data-pe': 'back', 'aria-label': 'Atrás' });
            bk.innerHTML = '<svg class="pf-ic" viewBox="0 0 24 24"><path d="M15 5l-7 7 7 7"/></svg>';
            appbar.append(bk, el('span', { text: v.detail }));
          } else appbar.appendChild(el('span', { text: 'DocuKelo' }));
          if (v.detail) {
            body.innerHTML = '<p class="pf-h">' + esc(v.detail) + '</p><div class="pf-kv"><span>Instructor</span><b>Equipo Icesi</b></div><div class="pf-kv"><span>Duración</span><b>16 semanas</b></div>' +
              '<button class="pf-btn out" data-act="back" data-pe="volver">Volver al catálogo</button>';
          } else if (v.tab === 0) {
            body.innerHTML = '<label class="pf-field" data-pe="q"><span>Buscar</span><input data-in="q" value="' + esc(v.q || '') + '"></label><div style="height:10px"></div>' +
              COURSES.map(function (c) { return '<div class="pf-tile go" data-act="open" data-arg="' + esc(c) + '" data-pe="curso"><span class="av">' + c.charAt(0) + '</span><span class="tx"><b>' + c + '</b><small>Toca para abrir</small></span></div>'; }).join('');
          } else if (v.tab === 1) {
            body.innerHTML = '<p class="pf-empty">No tienes cursos guardados aún</p>';
          } else {
            body.innerHTML = '<div class="tp-av">' + svg('person') + '</div><p class="pf-h" style="text-align:center">Estudiante de Software</p><p class="pf-label" style="text-align:center">Universidad Icesi · 2026</p>';
          }
          bar.hidden = !!v.detail;
          bar.replaceChildren();
          TABS.forEach(function (t, i) {
            var b = el('button', { class: 'tb' + (i === v.tab ? ' on' : ''), 'data-act': 'tab', 'data-arg': String(i), 'data-pe': 'tab', 'aria-label': t.label });
            b.innerHTML = '<span class="pill">' + svg(t.icon) + '</span><span class="lb">' + t.label + '</span>';
            bar.appendChild(b);
          });
          if (detailChanged && v.detail && !DK.reduced) { body.classList.remove('slide'); void body.offsetWidth; body.classList.add('slide'); }
        }
      };
    }
  };
})();
