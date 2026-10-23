// DOCS: .agents/skills/docusaurus_animated_diagrams/references/kit-api.md (API) y SKILL.md (proceso). Copia maestra unica del kit.
/* dk-kit.js: helpers comunes para piezas interactivas de DocuKelo. JavaScript plano, sin dependencias.
 * Se carga como script clasico y expone window.DK. Inspirado en el patron de los simuladores del profesor Domi:
 * escenario como datos + motor generico + limpieza de timers.
 *
 *   DK.el(tag, attrs, ...hijos)     crea un nodo HTML   (attrs: class, text, on<evento>, cualquier atributo)
 *   DK.svg(tag, attrs, ...hijos)    crea un nodo SVG
 *   DK.reduced                      true si el usuario pidio menos movimiento
 *   DK.timers()                     { later(fn, ms), clear() }  para animar sin dejar timers colgados
 *   DK.stepper(opciones)            controlador de pasos (siguiente, anterior, reproducir, reiniciar)
 *   DK.autoHeight()                 ajusta el alto del <iframe> que contiene la pieza a su contenido
 *                                   (solo funciona si la pagina que la embebe es del mismo origen, como en DocuKelo)
 */
window.DK = (function () {
  var SVG_NS = 'http://www.w3.org/2000/svg';
  var reduced = !!(window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches);

  function build(node, attrs, kids) {
    Object.keys(attrs || {}).forEach(function (k) {
      var v = attrs[k];
      if (v === undefined || v === null || v === false) return;
      if (k === 'text') node.textContent = v;
      else if (k.indexOf('on') === 0) node.addEventListener(k.slice(2), v);
      else node.setAttribute(k, v === true ? '' : v);
    });
    [].concat.apply([], kids).forEach(function (c) {
      if (c === null || c === undefined || c === false) return;
      node.appendChild(typeof c === 'string' ? document.createTextNode(c) : c);
    });
    return node;
  }
  function el(tag, attrs) { return build(document.createElement(tag), attrs, [].slice.call(arguments, 2)); }
  function svg(tag, attrs) { return build(document.createElementNS(SVG_NS, tag), attrs, [].slice.call(arguments, 2)); }

  function timers() {
    var ids = [];
    return {
      later: function (fn, ms) { ids.push(setTimeout(fn, ms)); },
      clear: function () { ids.forEach(clearTimeout); ids = []; },
    };
  }

  /* stepper({ count: () => n, show: (i, animate) => void, dwell: (i) => ms, onChange?, onPlay?(bool) })
   * i = -1 significa "antes del primer paso". */
  function stepper(o) {
    var cur = -1;
    var timer = null;
    var self = {};
    function clamp(n) { return Math.max(-1, Math.min(o.count() - 1, n)); }
    function stopTimer() { if (timer) { clearTimeout(timer); timer = null; } }
    self.stop = function () { stopTimer(); if (o.onPlay) o.onPlay(false); };
    self.go = function (n, animate) {
      cur = clamp(n);
      o.show(cur, animate !== false && !reduced);
      if (o.onChange) o.onChange(cur);
    };
    self.next = function () { self.stop(); self.go(cur + 1, true); };
    self.prev = function () { self.stop(); self.go(cur - 1, false); };
    self.reset = function () { self.stop(); self.go(-1, false); };
    self.play = function () {
      if (cur >= o.count() - 1) self.go(-1, false);
      if (o.onPlay) o.onPlay(true);
      (function tick() {
        if (cur >= o.count() - 1) { self.stop(); return; }
        self.go(cur + 1, true);
        timer = setTimeout(tick, o.dwell(cur));
      })();
    };
    self.toggle = function () { if (timer) self.stop(); else self.play(); };
    self.playing = function () { return !!timer; };
    self.current = function () { return cur; };
    document.addEventListener('keydown', function (e) {
      var t = e.target;   // las flechas de un deslizador o un selector no deben cambiar de paso
      if (t && ((t.tagName === 'INPUT' && t.type === 'range') || t.tagName === 'SELECT')) return;
      if (e.key === 'ArrowRight') self.next();
      if (e.key === 'ArrowLeft') self.prev();
    });
    return self;
  }

  /* Resaltado de sintaxis para mostrar codigo tipo Java/JS. Distingue el ROL de cada palabra, que es lo que el
   * estudiante necesita para leer el codigo:
   *   kw  palabra clave (public, class, new, throw...)     ty  clase o tipo (Product, Pageable, List)
   *   fn  metodo (findAll, debitar: lo que va seguido de "(")  ob  objeto o variable (productRepository, page, monto)
   *   st  texto entre comillas   nu  numero   an  anotacion (@Transactional)   cm  comentario
   * Heuristica: MAYUSCULA inicial = clase; palabra + "(" = metodo (si va tras "new", es la clase del constructor);
   * el resto en minuscula = objeto/variable. Devuelve HTML seguro para innerHTML. */
  var KW = {};
  ('public private protected class interface extends implements void return new throws throw import static final abstract if else for while do switch case ' +
   'try catch finally this super const let var function package instanceof null true false export async await late required').split(' ').forEach(function (k) { KW[k] = 1; });
  var TY = {}; // tipos primitivos en minuscula (Dart): se pintan como clase/tipo y no como variable
  'int double bool num dynamic'.split(' ').forEach(function (k) { TY[k] = 1; });
  function esc(s) { return s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;'); }
  function highlight(line) {
    var out = '', last = 0, prev = '', m;
    var re = /("(?:[^"\\]|\\.)*")|(\/\/.*$)|(@[A-Za-z_]\w*)|(\b\d+(?:\.\d+)?\b)|([A-Za-z_]\w*)/g;
    while ((m = re.exec(line))) {
      out += esc(line.slice(last, m.index));
      var t = m[0], cls;
      if (m[1]) cls = 'st';
      else if (m[2]) cls = 'cm';
      else if (m[3]) cls = 'an';
      else if (m[4]) cls = 'nu';
      else {
        var nextCh = (line.slice(re.lastIndex).match(/^\s*(.)/) || [])[1] || '';
        if (KW[t]) cls = 'kw';
        else if (TY[t] && nextCh !== '(') cls = 'ty';
        else if (/^[A-Z]/.test(t)) cls = (nextCh === '(' && prev !== 'new') ? 'fn' : 'ty';
        else cls = nextCh === '(' ? 'fn' : 'ob';
      }
      out += '<span class="' + cls + '">' + esc(t) + '</span>';
      prev = t;
      last = re.lastIndex;
    }
    return out + esc(line.slice(last));
  }

  /* El <iframe> del .md declara un alto de respaldo; la pieza lo reemplaza por el alto real de su contenido,
   * asi no queda espacio en blanco debajo ni se corta si el contenido crece. */
  function autoHeight() {
    var frame = null;
    try { frame = window.frameElement; } catch (e) { /* otro origen */ }
    if (!frame || !window.ResizeObserver) return;
    // pieza en un dialogo de pantalla completa (InteractiveFrame): el alto lo fija el dialogo; la pieza se adapta a el
    if (frame.hasAttribute('data-dk-fixed')) { document.documentElement.classList.add('dk-fs'); return; }
    var last = 0;
    new ResizeObserver(function () {
      // se aplica en el siguiente frame: asi no se dispara el aviso "ResizeObserver loop completed"
      requestAnimationFrame(function () {
        var h = Math.ceil(document.body.scrollHeight) + 2;
        if (h !== last) { last = h; frame.style.height = h + 'px'; }
      });
    }).observe(document.body);
  }

  return { el: el, svg: svg, reduced: reduced, timers: timers, stepper: stepper, autoHeight: autoHeight, highlight: highlight };
})();
