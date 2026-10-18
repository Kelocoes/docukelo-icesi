/* dk-icons.js: iconos SVG reutilizables, de trazo uniforme, que usan los tokens de dk-base.css.
 * Requiere dk-kit.js. Cada función devuelve un <g> listo para agregar a un <svg>.
 *
 *   DK.icons.laptop({ x, y })     x = centro horizontal, y = borde superior.  Tamaño ~72 x 40
 *   DK.icons.server({ x, y })     rack de 3 bandejas                          ~52 x 37
 *   DK.icons.database({ x, y })   cilindro                                    ~48 x 40
 *   DK.icons.browser({ x, y })    ventana de navegador                        ~60 x 42
 *   DK.icons.user({ x, y })       persona                                     ~36 x 44
 *   DK.icons.classbox({ x, y })   clase u objeto de código ({ })              ~56 x 38
 *   DK.icons.card({ x, y })       tarjeta / cuenta bancaria                   ~52 x 34
 *   DK.icons.coins({ x, y })      pila de monedas                             ~40 x 36
 *   DK.icons.file({ x, y })       documento                                   ~34 x 40
 *   DK.icons.filecode({ x, y })   plantilla o archivo de código (</>)         ~34 x 40
 *   DK.icons.gear({ x, y })       engranaje: proceso, motor, servicio         ~36 x 36
 *   DK.icons.bag({ x, y })        bolsa / mochila de datos (Model)            ~36 x 38
 *   DK.icons.lock({ x, y })       candado: autorización, permisos             ~30 x 40
 *   DK.icons.filter({ x, y })     embudo: un filtro de una cadena             ~38 x 38
 *   Todos aceptan scale: DK.icons.gear({ x, y, scale: 0.8 }). Altos aproximados en DK.icons.h.
 *   DK.icons.piece(n, size)       pieza de rompecabezas centrada en (0,0), con número opcional
 *   DK.icons.cross(size)          X de error, centrada en (0,0)
 *   DK.icons.check(size)          visto bueno, centrado en (0,0)
 *
 * Agregar un icono nuevo aquí (y documentarlo en references/kit-api.md) en cuanto se dibuje por segunda vez.
 */
(function () {
  var S = DK.svg;
  function at(o, children) {
    var sc = o.scale ? ' scale(' + o.scale + ')' : '';
    return S.apply(null, ['g', { transform: 'translate(' + (o.x || 0) + ',' + (o.y || 0) + ')' + sc }].concat(children));
  }
  // engranaje: 8 dientes, centrado en (0, ro)
  function gearPath(ro, ri, teeth) {
    var pts = [], n = teeth * 4;
    for (var i = 0; i < n; i++) {
      var a = (i / n) * Math.PI * 2 - Math.PI / 2, r = (i % 4 === 0 || i % 4 === 1) ? ro : ri;
      pts.push((r * Math.cos(a)).toFixed(1) + ',' + (ro + r * Math.sin(a)).toFixed(1));
    }
    return 'M' + pts.join(' L') + ' Z';
  }

  DK.icons = {
    laptop: function (o) {
      return at(o, [
        S('rect', { x: -26, y: 0, width: 52, height: 32, rx: 4, class: 'dk-dev' }),
        S('rect', { x: -36, y: 33, width: 72, height: 6, rx: 3, class: 'dk-devfill' }),
      ]);
    },
    server: function (o) {
      var kids = [];
      [0, 13, 26].forEach(function (y) {
        kids.push(S('rect', { x: -26, y: y, width: 52, height: 11, rx: 3, class: 'dk-dev' }));
        kids.push(S('circle', { cx: 18, cy: y + 5.5, r: 2, class: 'dk-devfill' }));
      });
      return at(o, kids);
    },
    database: function (o) {
      return at(o, [
        S('path', { d: 'M-24,7 V31 A24,7 0 0 0 24,31 V7', class: 'dk-dev' }),
        S('ellipse', { cx: 0, cy: 7, rx: 24, ry: 7, class: 'dk-dev' }),
        S('path', { d: 'M-24,19 A24,7 0 0 0 24,19', class: 'dk-dev', fill: 'none' }),
      ]);
    },
    browser: function (o) {
      return at(o, [
        S('rect', { x: -30, y: 0, width: 60, height: 42, rx: 5, class: 'dk-dev' }),
        S('line', { x1: -30, y1: 11, x2: 30, y2: 11, class: 'dk-dev' }),
        S('circle', { cx: -23, cy: 5.5, r: 1.8, class: 'dk-devfill' }),
        S('circle', { cx: -17, cy: 5.5, r: 1.8, class: 'dk-devfill' }),
        S('circle', { cx: -11, cy: 5.5, r: 1.8, class: 'dk-devfill' }),
      ]);
    },
    user: function (o) {
      return at(o, [
        S('circle', { cx: 0, cy: 11, r: 9, class: 'dk-dev' }),
        S('path', { d: 'M-18,44 A18,18 0 0 1 18,44 Z', class: 'dk-dev' }),
      ]);
    },
    classbox: function (o) { // una clase / objeto de código: caja con { }
      return at(o, [
        S('rect', { x: -28, y: 0, width: 56, height: 38, rx: 8, class: 'dk-dev' }),
        S('text', { x: 0, y: 25, class: 'dk-who', text: '{ }' }),
      ]);
    },
    card: function (o) { // tarjeta bancaria / cuenta
      return at(o, [
        S('rect', { x: -26, y: 0, width: 52, height: 34, rx: 6, class: 'dk-dev' }),
        S('rect', { x: -26, y: 7, width: 52, height: 7, class: 'dk-devfill' }),
        S('rect', { x: -19, y: 20, width: 14, height: 9, rx: 2, class: 'dk-devfill' }),
        S('line', { x1: 2, y1: 25, x2: 20, y2: 25, class: 'dk-dev' }),
      ]);
    },
    coins: function (o) { // pila de monedas
      return at(o, [30, 21, 12].map(function (cy) { return S('ellipse', { cx: 0, cy: cy, rx: 20, ry: 6, class: 'dk-dev' }); }).concat([
        S('path', { d: 'M-20,12 V30 M20,12 V30', class: 'dk-dev', fill: 'none' }),
      ]));
    },
    file: function (o) { // documento
      return at(o, [
        S('path', { d: 'M-17,0 H7 L17,10 V40 H-17 Z', class: 'dk-dev' }),
        S('path', { d: 'M7,0 V10 H17', class: 'dk-dev', fill: 'none' }),
        S('line', { x1: -9, y1: 20, x2: 9, y2: 20, class: 'dk-dev' }),
        S('line', { x1: -9, y1: 27, x2: 9, y2: 27, class: 'dk-dev' }),
        S('line', { x1: -9, y1: 34, x2: 3, y2: 34, class: 'dk-dev' }),
      ]);
    },
    filecode: function (o) { // plantilla o archivo de codigo
      return at(o, [
        S('path', { d: 'M-17,0 H7 L17,10 V40 H-17 Z', class: 'dk-dev' }),
        S('path', { d: 'M7,0 V10 H17', class: 'dk-dev', fill: 'none' }),
        S('text', { x: 0, y: 31, class: 'dk-who', text: '</>' }),
      ]);
    },
    gear: function (o) { // proceso, motor, servicio
      return at(o, [
        S('path', { d: gearPath(18, 13, 8), class: 'dk-dev' }),
        S('circle', { cx: 0, cy: 18, r: 5.5, class: 'dk-dev' }),
      ]);
    },
    bag: function (o) { // contenedor de datos (mochila / Model)
      return at(o, [
        S('path', { d: 'M-8,12 V8 A8,8 0 0 1 8,8 V12', class: 'dk-dev', fill: 'none' }),
        S('rect', { x: -18, y: 12, width: 36, height: 26, rx: 7, class: 'dk-dev' }),
        S('line', { x1: -18, y1: 22, x2: 18, y2: 22, class: 'dk-dev' }),
      ]);
    },
    lock: function (o) { // candado: autorizacion, permisos, cifrado
      return at(o, [
        S('path', { d: 'M-9,16 V10 A9,9 0 0 1 9,10 V16', class: 'dk-dev', fill: 'none' }),
        S('rect', { x: -15, y: 16, width: 30, height: 22, rx: 6, class: 'dk-dev' }),
        S('circle', { cx: 0, cy: 26, r: 3, class: 'dk-devfill' }),
        S('line', { x1: 0, y1: 28, x2: 0, y2: 33, class: 'dk-dev' }),
      ]);
    },
    filter: function (o) { // embudo: un filtro de una cadena
      return at(o, [S('path', { d: 'M-19,3 H19 L6,21 V37 L-6,32 V21 Z', class: 'dk-dev' })]);
    },
    piece: function (n, size) {
      var h = size / 2, k = size * 0.16;
      return S('g', {},
        S('path', { class: 'dk-piece', d: 'M' + -h + ',' + -h + ' H' + -k + ' A' + k + ',' + k + ' 0 0 1 ' + k + ',' + -h + ' H' + h + ' V' + h + ' H' + -h + ' Z' }),
        n ? S('text', { class: 'dk-piecenum', x: 0, y: size * 0.22, text: String(n) }) : null);
    },
    cross: function (size) {
      var h = (size || 12) / 2;
      return S('g', {}, S('line', { x1: -h, y1: -h, x2: h, y2: h, class: 'dk-x' }), S('line', { x1: -h, y1: h, x2: h, y2: -h, class: 'dk-x' }));
    },
    check: function (size) {
      var h = (size || 12) / 2;
      return S('path', { d: 'M' + -h + ',0 L' + -h / 3 + ',' + h * 0.7 + ' L' + h + ',' + -h * 0.7, fill: 'none', stroke: 'var(--dk-ack)', 'stroke-width': 3, 'stroke-linecap': 'round', 'stroke-linejoin': 'round' });
    },
  };
  // alto aproximado de cada icono de dispositivo (para centrarlo; usa DK.icons.h[nombre])
  DK.icons.h = { laptop: 40, server: 37, database: 42, browser: 42, user: 44, classbox: 38, card: 34, coins: 36, file: 40, filecode: 40, gear: 36, bag: 38, lock: 40, filter: 38 };
})();
