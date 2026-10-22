// DOCS: .agents/skills/docusaurus_animated_diagrams/references/kit-api.md (API) y SKILL.md (proceso). Copia maestra unica del kit.
/* dk-anatomy.js: anatomía explorable. Muestra un mensaje o documento real (una petición HTTP, un JWT, un JSON...)
 * dentro de una caja, y en cada paso ENFOCA una de sus partes mientras a la derecha aparece su explicación con una
 * pequeña animación. Arriba, una franja opcional de "cable" muestra el mensaje viajando entre cliente y servidor.
 * Es una escena para DK.player. Requiere dk-kit.js, dk-icons.js y dk-flow.js, y los estilos de dk-base.css.
 *
 *   scene: function (svg, stage) {
 *     return DK.anatomy({
 *       stage: stage,
 *       parts: { method: { label: 'Método', color: 'p1' }, url: { label: 'URL', color: 'p2' } },   // color: p1..p5
 *       clientLabel: 'Cliente (navegador)', serverLabel: 'Servidor',                                 // franja de cable
 *       code: true,        // opcional: el doc es codigo; colorea la sintaxis con DK.highlight (sin saltos de linea)
 *       layout: 'stack',   // opcional: codigo a todo el ancho y explicacion debajo (para codigo con lineas largas)
 *     });
 *   }
 *
 * Un paso:
 *   { phase, title, caption,                       // caption: una frase corta (la lee el player)
 *     doc: [ [ ['GET','method'], [' '], ['/productos','url'] ], [ ['Host: x','headers'] ] ],   // el mensaje: lineas de
 *                                                    // segmentos [texto, parte?]; todos los pasos comparten el mismo doc
 *     focus: 'method',                               // parte que se enfoca (omitir = ninguna)
 *     callout: { text: 'Explicación más larga', examples: ['GET: pedir datos', 'POST: enviar datos'] },
 *     msgs: [ { path: [x1, y1, x2, y2], label: 'Solicitud HTTP', kind: 'data' } ] }   // franja de cable (viewBox 640 x 78)
 * La franja de cable solo se muestra si algún paso trae msgs.
 */
DK.anatomy = function (o) {
  var el = DK.el, S = DK.svg;
  var DUR = 700;
  var steps = [];
  var t = DK.timers();
  var parts = o.parts || {};

  // ---- franja de cable (cliente - servidor) ----
  var wire = S('svg', { viewBox: '0 0 640 78', role: 'img', 'aria-label': 'Cliente y servidor' });
  var wLayer = S('g');
  wire.append(
    DK.icons.laptop({ x: 70, y: 6 }), S('text', { x: 70, y: 68, class: 'dk-who', text: o.clientLabel || 'Cliente' }),
    DK.icons.server({ x: 570, y: 6 }), S('text', { x: 570, y: 68, class: 'dk-who', text: o.serverLabel || 'Servidor' }),
    wLayer);
  var wireBox = el('div', { class: 'dk-wire' }, wire);

  // ---- mensaje y explicacion ----
  var msgBox = el('pre', { class: 'dk-msg' + (o.code ? ' code' : ''), 'aria-label': o.code ? 'Código de ejemplo' : 'Mensaje de ejemplo' });
  var tag = el('span', { class: 'tag' }), title = el('h4'), text = el('p'), list = el('ul');
  var callout = el('div', { class: 'dk-callout' }, tag, title, text, list);
  var wrap = el('div', { class: 'dk-anatomy' + (o.layout === 'stack' ? ' stack' : '') }, wireBox, msgBox, callout);
  o.stage.replaceChildren(wrap);
  var spans = [];

  function colorVar(id) { return 'var(--dk-' + ((parts[id] && parts[id].color) || 'p1') + ')'; }

  function buildDoc(doc) {
    msgBox.replaceChildren();
    spans = [];
    doc.forEach(function (line) {
      var ln = el('span', { class: 'ln' });
      line.forEach(function (seg) {
        var s = el('span');
        if (o.code) s.innerHTML = DK.highlight(seg[0]);
        else s.textContent = seg[0];
        // en codigo se enfoca la linea completa (no cada segmento) para que el bloque se lea continuo
        var target = o.code ? ln : s;
        if (seg[1] && !target.hasAttribute('data-part')) {
          target.setAttribute('data-part', seg[1]);
          target.style.setProperty('--pc', colorVar(seg[1]));
          spans.push(target);
        }
        ln.appendChild(s);
      });
      msgBox.appendChild(ln);
    });
  }

  function setSteps(list) {
    steps = list;
    buildDoc(list[0].doc);
    wireBox.hidden = !list.some(function (s) { return s.msgs && s.msgs.length; });
  }

  function render(i, animate) {
    t.clear();
    var step = steps[i];
    // franja de cable: mensajes de pasos anteriores atenuados; solo se anima el del paso actual
    wLayer.replaceChildren();
    for (var s = 0; s <= i; s++) {
      (steps[s].msgs || []).forEach(function (m, k) {
        var live = s === i && animate;
        DK.flow.arrow(wLayer, { x1: m.path[0], y1: m.path[1], x2: m.path[2], y2: m.path[3], kind: m.kind, label: m.label,
          animate: live, delay: live ? k * DUR * 0.85 : 0, dur: DUR, dim: s !== i });
      });
    }
    // enfoque en el mensaje
    var focus = step && step.focus;
    msgBox.classList.toggle('has-focus', !!focus);
    msgBox.classList.toggle('show-all', !!(step && step.all)); // step.all: todas las partes coloreadas a la vez (resumen)
    spans.forEach(function (n) { n.classList.toggle('on', !!focus && n.getAttribute('data-part') === focus); });
    // explicacion a la derecha
    var c = (step && step.callout) || {};
    var pc = focus ? colorVar(focus) : 'var(--dk-line)';
    callout.style.setProperty('--pc', pc);
    tag.textContent = focus ? (parts[focus] && parts[focus].label) || focus : '';
    title.textContent = (step && step.title) || '';
    text.textContent = c.text || '';
    list.replaceChildren.apply(list, (c.examples || []).map(function (e) { return el('li', { text: e }); }));
    callout.classList.remove('swap');
    if (animate && !DK.reduced) { void callout.offsetWidth; callout.classList.add('swap'); }
    return { animMs: step && animate && step.msgs ? step.msgs.length * DUR * 0.85 + 120 : 0 };
  }

  return { setSteps: setSteps, render: render, msgDuration: DUR * 0.85 };
};
