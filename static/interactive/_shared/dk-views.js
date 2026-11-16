// DOCS: references/kit-api.md de la skill docusaurus_animated_diagrams (API) y SKILL.md (proceso). Copia maestra: kit/ de la skill; la carpeta instalada en un proyecto es generada, no la edites.
/* dk-views.js: una escena para DK.player que reúne VARIAS vistas de los mismos pasos en pestañas
 * (por ejemplo «Flujo» con DK.sequence y «Pantalla» con DK.browser). El panel de código, la leyenda y los
 * botones del player siguen visibles debajo, sea cual sea la pestaña. Cargar dk-browser.css si se usa DK.browser.
 *
 *   scene: function (svg, stage) {
 *     return DK.views({ stage: stage, initial: 0, views: [
 *       { label: 'Flujo',    scene: function (svg, box) { return DK.sequence({ svg: svg, ... }); } },
 *       { label: 'Pantalla', html: true, scene: function (svg, box) { return DK.browser({ stage: box }); } },
 *     ] });
 *   }
 *
 * - Cada vista recibe (svg, box). Con `html: true` no se crea svg (svg = null) y la escena llena `box`.
 * - Todas las vistas comparten el mismo arreglo de pasos: cada paso lleva los datos de cada vista
 *   (msgs/state para DK.sequence, screen para DK.browser, ...). Cambiar de pestaña no cambia de paso.
 * - Devuelve { setSteps, render, msgDuration, pick(k) } como cualquier escena del player.
 */
DK.views = function (o) {
  var el = DK.el;
  var wrap = el('div', { class: 'dk-views' });
  var bar = el('div', { class: 'dk-vtabs', role: 'tablist' });
  wrap.appendChild(bar);
  var cur = -1, active = o.initial || 0, steps = [];

  var views = o.views.map(function (v, k) {
    var box = el('div', { class: 'dk-view', role: 'tabpanel' });
    var svg = null;
    if (!v.html) { svg = DK.svg('svg', { role: 'img', 'aria-label': v.aria || v.label }); box.appendChild(svg); }
    var btn = el('button', { class: 'dk-vt', role: 'tab', text: v.label, onclick: function () { pick(k); } });
    bar.appendChild(btn);
    wrap.appendChild(box);
    return { box: box, btn: btn, scene: v.scene(svg, box) };
  });
  o.stage.replaceChildren(wrap);

  function pick(k) {
    active = k;
    views.forEach(function (v, j) {
      v.box.hidden = j !== k;
      v.btn.classList.toggle('on', j === k);
      v.btn.setAttribute('aria-selected', j === k ? 'true' : 'false');
    });
    // la vista que se acaba de mostrar se redibuja en el paso actual, sin animar
    if (steps.length) views[k].scene.render(cur, false);
  }
  pick(active);

  var dur = 0;
  views.forEach(function (v) { if (!dur && v.scene.msgDuration) dur = v.scene.msgDuration; });

  return {
    msgDuration: dur || 700,
    pick: pick,
    setSteps: function (s) { steps = s; views.forEach(function (v) { v.scene.setSteps(s); }); },
    render: function (i, animate) {
      cur = i;
      var out;
      views.forEach(function (v, j) {
        var r = v.scene.render(i, animate && j === active);
        if (j === active) out = r;
      });
      return out || { animMs: 0 };
    },
  };
};
