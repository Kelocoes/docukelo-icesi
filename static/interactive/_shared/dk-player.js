// DOCS: .agents/skills/docusaurus_animated_diagrams/references/kit-api.md (API) y SKILL.md (proceso). Copia maestra unica del kit.
/* dk-player.js: el marco común de una pieza paso a paso: pestañas por fase, escena, barra de progreso,
 * leyenda, botones (Anterior, Siguiente, Reproducir, Reiniciar) e interruptores opcionales.
 * Requiere dk-kit.js y la escena que se le pase (por ahora DK.sequence).
 *
 *   DK.player({
 *     mount: document.getElementById('app'),           // contenedor vacío
 *     phases: ['Conectar', 'Transferir', 'Cerrar'],
 *     scene: function (svg, stage) { return DK.sequence({ svg: svg, ... }); },   // stage = contenedor, por si la escena arma su propio DOM
 *     build: function (opts) { return steps; },         // los pasos como datos; opts = { loss: true/false, ... }
 *     toggles: [ { key: 'loss', label: 'Simular que se pierde un paquete', affectsPhase: 1 } ],
 *     intro: { kicker: 'Comunicación TCP en 3 fases', title: 'Antes de empezar', text: '...' },
 *     code: { title: 'HelloServlet.java', text: '...codigo...' },   // opcional: panel de código (o una función (opts) => {title, text}
 *                                                                    // si el código cambia con los interruptores); cada paso resalta
 *                                                                    // sus líneas con step.code = [5, 6, 7] (desde 1)
 *     // URL con #fase=3: abre la pieza directamente en la fase 3
 *     wide: true,   // opcional: sin topes de 760/640 px; la pieza ocupa todo el ancho del iframe (dibujar con viewBox ~1000)
 *   });
 *
 * - affectsPhase: al cambiar el interruptor, los pasos se reconstruyen y la pieza vuelve al final de la fase
 *   anterior a esa (o se queda donde estaba si todavía no había llegado a ella).
 * - Al final llama DK.autoHeight() para que el iframe no deje espacio en blanco.
 */
DK.player = function (o) {
  var el = DK.el;
  var opts = {};
  (o.toggles || []).forEach(function (t) { opts[t.key] = false; });
  var steps = [];
  var scene, ctrl;

  var tabs = el('div', { class: 'dk-tabs' });
  var svgEl = DK.svg('svg', { role: 'img', 'aria-label': o.ariaLabel || 'Diagrama paso a paso' });
  var dots = el('div', { class: 'dk-dots', 'aria-hidden': 'true' });
  var ph = el('span', { class: 'ph' }), ttl = el('h3'), txt = el('p');
  var prev = el('button', { text: 'Anterior' });
  var next = el('button', { text: 'Siguiente', class: 'solid' });
  var play = el('button', { text: 'Reproducir' });
  var reset = el('button', { text: 'Reiniciar' });
  var bar = el('div', { class: 'dk-bar' }, el('div', { class: 'dk-btns' }, prev, next, play, reset));

  (o.toggles || []).forEach(function (t) {
    var input = el('input', { type: 'checkbox' });
    input.onchange = function () {
      opts[t.key] = input.checked;
      ctrl.stop();
      var keep = ctrl.current();
      var limit = firstStepOfPhase(t.affectsPhase === undefined ? 0 : t.affectsPhase) - 1;
      rebuild(Math.min(keep, limit));
    };
    bar.appendChild(el('label', { class: 'dk-toggle' }, input, t.label));
  });

  var stage = el('div', { class: 'dk-stage' }, svgEl);

  // Panel de codigo sincronizado: cada paso puede resaltar lineas (step.code = [numeros de linea, desde 1]).
  // `code` puede ser un objeto { title, text } o una funcion (opts) => { title, text } cuando el codigo cambia con los
  // interruptores (por ejemplo con y sin @Transactional). Se vuelve a dibujar en cada rebuild.
  var codeBox = null, codeLines = [];
  if (o.code) codeBox = el('div', { class: 'dk-code' });
  function fillCode() {
    if (!codeBox) return;
    var c = typeof o.code === 'function' ? o.code(opts) : o.code;
    codeBox.replaceChildren();
    codeLines = [];
    if (c.title) {
      // leyenda de colores: lo que el estudiante necesita para leer el codigo (clase, metodo, objeto, palabra clave)
      var legend = el('span', { class: 'lg' });
      [['ty', 'clase'], ['fn', 'método'], ['ob', 'objeto o variable'], ['kw', 'palabra clave']].forEach(function (x) { legend.appendChild(el('span', { class: x[0], text: x[1] })); });
      codeBox.appendChild(el('div', { class: 'ct' }, c.title, c.legend === false ? null : legend));
    }
    c.text.split('\n').forEach(function (line) {
      var n = el('span', { class: 'l' });
      n.innerHTML = DK.highlight(line) || ' ';
      codeBox.appendChild(n);
      codeLines.push(n);
    });
  }
  fillCode();

  o.mount.replaceChildren(el('div', { class: 'dk-card' + (o.wide ? ' dk-wide' : '') },
    tabs, stage, codeBox, dots,
    el('div', { class: 'dk-cap', 'aria-live': 'polite' }, ph, ttl, txt), bar));

  function firstStepOfPhase(p) {
    var i = steps.findIndex(function (s) { return s.phase === p; });
    return i < 0 ? steps.length : i;
  }

  // resalta lineas del panel de codigo (numeradas desde 1) y lo desplaza hasta la primera; tambien lo usan las escenas
  // interactivas (DK.phone en modo libre) a traves de api.code(lineas)
  function markCode(lines, animate) {
    if (!codeBox) return;
    lines = lines || [];
    codeLines.forEach(function (n, k) { n.classList.toggle('on', lines.indexOf(k + 1) >= 0); });
    // el panel de codigo tiene alto limitado: se desplaza solo para dejar a la vista las lineas resaltadas
    var firstOn = codeLines.filter(function (n) { return n.classList.contains('on'); })[0];
    if (firstOn) codeBox.scrollTo({ top: Math.max(0, firstOn.offsetTop - 40), behavior: animate && !DK.reduced ? 'smooth' : 'auto' });
  }

  function show(i, animate) {
    var step = steps[i];
    scene.render(i, animate);
    [].forEach.call(tabs.children, function (b, p) {
      var phase = step ? step.phase : -1;
      b.className = p === phase ? 'on' : (p < phase ? 'done' : '');
    });
    [].forEach.call(dots.children, function (d, k) { d.className = k === i ? 'cur' : (k < i ? 'past' : ''); });
    markCode(step ? step.code : [], animate);
    var intro = o.intro || {};
    ph.textContent = step ? (o.kicker ? o.kicker(step.phase) : 'Fase ' + (step.phase + 1) + ' · ' + o.phases[step.phase]) : (intro.kicker || '');
    ttl.textContent = step ? step.title : (intro.title || '');
    txt.textContent = step ? step.caption : (intro.text || '');
    prev.disabled = i < 0;
    next.disabled = i >= steps.length - 1;
  }

  function rebuild(keepAt) {
    steps = o.build(opts);
    fillCode();
    scene.setSteps(steps);
    tabs.replaceChildren();
    o.phases.forEach(function (name, p) {
      tabs.appendChild(el('button', { onclick: function () { ctrl.stop(); ctrl.go(firstStepOfPhase(p), true); } }, el('b', { text: String(p + 1) }), name));
    });
    dots.replaceChildren();
    steps.forEach(function () { dots.appendChild(el('i')); });
    if (ctrl) ctrl.go(keepAt, false);
  }

  // una escena puede ignorar el svg y llenar `stage` con su propio contenido (ver dk-compare.js); el tercer argumento
  // `api` le deja resaltar lineas del panel de codigo por su cuenta (api.code([5, 6]))
  scene = o.scene(svgEl, stage, { code: function (lines) { markCode(lines, true); } });
  ctrl = DK.stepper({
    count: function () { return steps.length; },
    show: show,
    dwell: function (i) { return steps[i].dwell || steps[i].msgs.length * scene.msgDuration + 1700; },   // step.dwell: tiempo propio de lectura (ms)
    onPlay: function (on) { play.textContent = on ? 'Pausar' : 'Reproducir'; },
  });
  rebuild(-1);
  // #fase=3 en la URL del iframe abre la pieza en esa fase (1 = primera): sirve para usar la misma pieza en dos secciones del capitulo
  var hashPhase = /[#&]fase=(\d+)/.exec(location.hash);
  if (hashPhase && o.phases[Number(hashPhase[1]) - 1] !== undefined) ctrl.go(firstStepOfPhase(Number(hashPhase[1]) - 1), false);

  prev.onclick = ctrl.prev;
  next.onclick = ctrl.next;
  play.onclick = ctrl.toggle;
  reset.onclick = ctrl.reset;
  DK.autoHeight();
  return ctrl;
};
