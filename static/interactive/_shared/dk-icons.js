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
 *   De dominio y conexion (los usa DK.canvas): antenna ~44x44, speed ~48x34, chat ~40x36, bell ~34x38, terminal ~48x36, flask ~34x40,
 *   chip ~44x44, pin ~30x40, globe ~40x40, memory ~52x31, chain ~44x28, wrench ~42x42, bandaid ~48x38, bus ~56x38,
 *   socket (toma que se abre a la derecha) ~57x36 y plug (enchufe con clavijas a la izquierda) ~78x36; ambos aceptan glyph.
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
  // ---- iconos de dominio y de conexion (antenna, speed, chat, bell, terminal, flask, chip, pin, globe, memory, chain, wrench,
  //      bandaid, bus, socket, plug): los usa DK.canvas. socket abre a la DERECHA y plug apunta a la IZQUIERDA (clavijas), para
  //      acoplarse en horizontal; los dos aceptan glyph: '<icono>' dibujado sobre el cuerpo; rot en DK.canvas los gira. ----
  var line = function (d) { return S('path', { d: d, class: 'dk-dev', fill: 'none' }); };
  var glyphOn = function (name, cx, cy, size) {   // un icono pequeno centrado en (cx, cy) dentro de un cuerpo
    if (!name || !DK.icons[name]) return null;
    var h = DK.icons.h[name] || 38, sc = size / h;
    return DK.icons[name]({ x: cx, y: cy - size / 2, scale: sc });
  };

  var X = {
    antenna: function (o) {
      return at(o, [
        S('circle', { cx: 0, cy: 14, r: 4, class: 'dk-dev' }),
        line('M7,8 A8,8 0 0 1 7,20'), line('M13,3 A15,15 0 0 1 13,25'),
        line('M-7,8 A8,8 0 0 0 -7,20'), line('M-13,3 A15,15 0 0 0 -13,25'),
        line('M0,18 V42'), line('M-9,42 H9'),
      ]);
    },
    speed: function (o) {
      return at(o, [
        line('M-22,30 A22,22 0 0 1 22,30'), line('M-22,30 H22'), line('M0,30 L11,13'),
        S('circle', { cx: 0, cy: 30, r: 3.5, class: 'dk-devfill' }),
        line('M-16,19 l3,3'), line('M0,9 v4'), line('M16,19 l-3,3'),
      ]);
    },
    chat: function (o) {
      return at(o, [
        S('rect', { x: -20, y: 0, width: 40, height: 26, rx: 8, class: 'dk-dev' }),
        S('path', { d: 'M-8,25 L-11,35 L3,25', class: 'dk-dev' }),
        S('circle', { cx: -8, cy: 13, r: 2.4, class: 'dk-devfill' }), S('circle', { cx: 0, cy: 13, r: 2.4, class: 'dk-devfill' }), S('circle', { cx: 8, cy: 13, r: 2.4, class: 'dk-devfill' }),
      ]);
    },
    bell: function (o) {
      return at(o, [
        S('circle', { cx: 0, cy: 3, r: 2.5, class: 'dk-devfill' }),
        S('path', { d: 'M-13,28 C-12,24 -11,21 -11,15 A11,11 0 0 1 11,15 C11,21 12,24 13,28 Z', class: 'dk-dev' }),
        line('M-15,28 H15'), line('M-4,32 A4,4 0 0 0 4,32'),
      ]);
    },
    terminal: function (o) {
      return at(o, [
        S('rect', { x: -24, y: 0, width: 48, height: 36, rx: 5, class: 'dk-dev' }),
        line('M-15,11 L-8,18 L-15,25'), line('M-3,26 H9'),
      ]);
    },
    flask: function (o) {
      return at(o, [
        S('path', { d: 'M-6,0 H6 M-5,0 V14 L-16,35 A3,3 0 0 0 -13,40 H13 A3,3 0 0 0 16,35 L5,14 V0', class: 'dk-dev' }),
        S('path', { d: 'M-11,29 H11 L14.5,35 A2,2 0 0 1 13,38 H-13 A2,2 0 0 1 -14.5,35 Z', class: 'dk-devfill' }),
        S('circle', { cx: -3, cy: 22, r: 1.8, class: 'dk-devfill' }),
      ]);
    },
    chip: function (o) {
      var k = [];
      [14, 22, 30].forEach(function (y) { k.push(line('M-22,' + y + ' H-15')); k.push(line('M15,' + y + ' H22')); });
      [-8, 0, 8].forEach(function (x) { k.push(line('M' + x + ',0 V7')); k.push(line('M' + x + ',37 V44')); });
      return at(o, [S('rect', { x: -15, y: 7, width: 30, height: 30, rx: 4, class: 'dk-dev' }), S('rect', { x: -7, y: 15, width: 14, height: 14, rx: 2, class: 'dk-devfill' })].concat(k));
    },
    pin: function (o) {
      return at(o, [
        S('path', { d: 'M0,40 C-13,26 -15,19 -15,14 A15,15 0 0 1 15,14 C15,19 13,26 0,40 Z', class: 'dk-dev' }),
        S('circle', { cx: 0, cy: 14, r: 5, class: 'dk-devfill' }),
      ]);
    },
    globe: function (o) {
      return at(o, [
        S('circle', { cx: 0, cy: 20, r: 19, class: 'dk-dev' }),
        S('ellipse', { cx: 0, cy: 20, rx: 8, ry: 19, class: 'dk-dev', fill: 'none' }),
        line('M-19,20 H19'), line('M-16,10 H16'), line('M-16,30 H16'),
      ]);
    },
    memory: function (o) {
      var k = [S('rect', { x: -26, y: 0, width: 52, height: 26, rx: 3, class: 'dk-dev' })];
      [-18, -5, 8].forEach(function (x) { k.push(S('rect', { x: x, y: 6, width: 10, height: 12, rx: 1.5, class: 'dk-devfill' })); });
      [-21, -14, -7, 0, 7, 14, 21].forEach(function (x) { k.push(line('M' + x + ',26 V31')); });
      return at(o, k);
    },
    chain: function (o) {
      return at(o, [
        S('rect', { x: -22, y: 4, width: 28, height: 20, rx: 10, class: 'dk-dev', fill: 'none' }),
        S('rect', { x: -6, y: 4, width: 28, height: 20, rx: 10, class: 'dk-dev', fill: 'none' }),
      ]);
    },
    wrench: function (o) {   // llave inglesa (adaptada del trazo "tool" de Feather, MIT)
      return at({ x: o.x, y: o.y, scale: (o.scale || 1) * 1.75 }, [
        S('g', { transform: 'translate(-12,0)' },
          S('path', { d: 'M14.7 6.3a1 1 0 0 0 0 1.4l1.6 1.6a1 1 0 0 0 1.4 0l3.77-3.77a6 6 0 0 1-7.94 7.94l-6.91 6.91a2.12 2.12 0 0 1-3-3l6.91-6.91a6 6 0 0 1 7.94-7.94l-3.76 3.76z', class: 'dk-dev', transform: 'scale(1)' })),
      ]);
    },
    bandaid: function (o) {
      return at(o, [S('g', { transform: 'translate(0,19) rotate(-32)' },
        S('rect', { x: -23, y: -8, width: 46, height: 16, rx: 8, class: 'dk-dev' }),
        S('rect', { x: -8, y: -8, width: 16, height: 16, class: 'dk-devfill' }),
        S('circle', { cx: -3, cy: -2, r: 1.2, class: 'dk-dev' }), S('circle', { cx: 3, cy: 3, r: 1.2, class: 'dk-dev' }),
        S('circle', { cx: -15, cy: 0, r: 1.1, class: 'dk-dev' }), S('circle', { cx: 15, cy: 0, r: 1.1, class: 'dk-dev' }))]);
    },
    bus: function (o) {   // autobus (el paquete de telemetria de un bus)
      var k = [S('rect', { x: -28, y: 0, width: 56, height: 29, rx: 7, class: 'dk-dev' }), line('M-28,20 H28')];
      [-19, -5, 9].forEach(function (x) { k.push(S('rect', { x: x, y: 5, width: 11, height: 9, rx: 2, class: 'dk-devfill' })); });
      k.push(S('circle', { cx: -16, cy: 33, r: 5, class: 'dk-dev' })); k.push(S('circle', { cx: 16, cy: 33, r: 5, class: 'dk-dev' }));
      return at(o, k);
    },
    socket: function (o) {   // la toma (el contrato): cuerpo con dos ranuras en la cara derecha
      return at(o, [
        S('rect', { x: -32, y: 0, width: 46, height: 36, rx: 10, class: 'dk-dev' }),
        S('rect', { x: 14, y: 4, width: 7, height: 28, rx: 3, class: 'dk-dev' }),
        S('rect', { x: 14, y: 9, width: 11, height: 6, rx: 2, fill: 'var(--dk-muted)' }),
        S('rect', { x: 14, y: 21, width: 11, height: 6, rx: 2, fill: 'var(--dk-muted)' }),
        glyphOn(o.glyph, -10, 18, 20),
      ].filter(Boolean));
    },
    plug: function (o) {     // el enchufe (el detalle): clavijas hacia la izquierda, cuerpo a la derecha
      return at(o, [
        S('rect', { x: -40, y: 8, width: 24, height: 6, rx: 2, fill: 'var(--dk-muted)' }),
        S('rect', { x: -40, y: 22, width: 24, height: 6, rx: 2, fill: 'var(--dk-muted)' }),
        S('rect', { x: -18, y: 0, width: 46, height: 36, rx: 10, class: 'dk-dev' }),
        S('path', { d: 'M28,18 H38', class: 'dk-dev', fill: 'none' }),
        glyphOn(o.glyph, 5, 18, 22),
      ].filter(Boolean));
    },
  };
  Object.keys(X).forEach(function (k) { DK.icons[k] = X[k]; });
  // alto aproximado de cada icono de dispositivo (para centrarlo; usa DK.icons.h[nombre])
  DK.icons.h = { laptop: 40, server: 37, database: 42, browser: 42, user: 44, classbox: 38, card: 34, coins: 36, file: 40, filecode: 40, gear: 36, bag: 38, lock: 40, filter: 38 };
  var HX = { antenna: 44, speed: 34, chat: 36, bell: 38, terminal: 36, flask: 40, chip: 44, pin: 40, globe: 40, memory: 31, chain: 28, wrench: 42, bandaid: 38, socket: 36, plug: 36, bus: 38 };
  Object.keys(HX).forEach(function (k) { DK.icons.h[k] = HX[k]; });
})();
