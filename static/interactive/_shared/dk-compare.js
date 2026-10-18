// DOCS: .agents/skills/docusaurus_animated_diagrams/references/kit-api.md (API) y SKILL.md (proceso). Copia maestra unica del kit.
/* dk-compare.js: comparación A/B en paralelo. Dos (o más) diagramas de secuencia lado a lado que avanzan
 * sincronizados con el mismo paso, para contrastar "qué hace A" frente a "qué hace B" en cada momento.
 * Es una escena para DK.player (expone setSteps, render y msgDuration). Requiere dk-sequence.js.
 *
 *   DK.player({
 *     ...,
 *     scene: function (svg, stage) {
 *       return DK.compare({
 *         stage: stage,
 *         panes: [
 *           { id: 'tcp', title: 'TCP', subtitle: 'confirma cada entrega', sequence: { ...opciones de DK.sequence sin svg } },
 *           { id: 'udp', title: 'UDP', subtitle: 'envía y sigue',         sequence: { ... } },
 *         ],
 *         statLabel: 'mensajes',      // contador acumulado por panel ("8 mensajes")
 *       });
 *     },
 *   });
 *
 * Un paso compartido tiene lo común (phase, title, caption) y lo propio de cada panel:
 *   { phase: 1, title, caption,
 *     panes: { tcp: { msgs: [...], state: {...}, tray: {...}, note: 'Cada entrega se confirma' },
 *              udp: { msgs: [],    state: {...}, tray: {...}, note: 'Envía y sigue' } } }
 * Un panel sin actividad en un paso lleva msgs: [] (lo que NO pasa también enseña: "UDP no abre conexión").
 * Las fases sin mensajes en un panel no dibujan banda en ese panel: se nota visualmente que ahí no ocurre nada.
 */
DK.compare = function (o) {
  var el = DK.el;
  var wrap = el('div', { class: 'dk-compare' });
  o.stage.replaceChildren(wrap);
  var steps = [];

  var panes = o.panes.map(function (p) {
    var svg = DK.svg('svg', { role: 'img', 'aria-label': p.title + ': ' + (p.subtitle || '') });
    var stat = el('span', { class: 'dk-stat' });
    var note = el('p', { class: 'dk-note' });
    wrap.appendChild(el('div', { class: 'dk-pane' },
      el('div', { class: 'dk-panehead' }, el('h4', { text: p.title }), el('small', { text: p.subtitle || '' }), stat),
      svg, note));
    var cfg = { svg: svg, width: 384, margin: 92 };
    for (var k in p.sequence) cfg[k] = p.sequence[k];
    return { id: p.id, seq: DK.sequence(cfg), stat: stat, note: note };
  });

  function setSteps(list) {
    steps = list;
    list.forEach(function (s) { // el player usa msgs.length para calcular cuanto dura el paso: el del panel mas largo
      s.msgs = o.panes.map(function (p) { return s.panes[p.id].msgs || []; }).sort(function (a, b) { return b.length - a.length; })[0];
    });
    panes.forEach(function (p) {
      p.seq.setSteps(list.map(function (s) {
        var d = s.panes[p.id];
        return { phase: s.phase, title: s.title, caption: s.caption, msgs: d.msgs || [], state: d.state, tray: d.tray };
      }));
    });
  }

  function render(i, animate) {
    var ms = 0;
    panes.forEach(function (p) {
      ms = Math.max(ms, p.seq.render(i, animate).animMs);
      var count = 0;
      for (var s = 0; s <= i; s++) count += (steps[s].panes[p.id].msgs || []).length;
      p.stat.textContent = i < 0 || !o.statLabel ? '' : count + ' ' + o.statLabel;
      p.note.textContent = i < 0 ? '' : (steps[i].panes[p.id].note || '');
    });
    return { animMs: ms };
  }

  return { setSteps: setSteps, render: render, msgDuration: panes[0].seq.msgDuration };
};
