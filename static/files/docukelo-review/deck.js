/* Los profes cuentan: componentes y slides. Depende de dist/main.js (icesi.*) y data/feedback.js. */
(function () {
  const C = { blue: '#5454E9', yellow: '#E4EB60', purple: '#865CF0', green: '#4CB979', orange: '#E9683B',
    ink: '#393939', muted: '#6b6c73', light: '#a9a9f4', grey: '#b5b6bd' };
  const F = window.FEEDBACK;
  const esc = (s) => String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');

  // ---------- Íconos (trazos en una caja de 40x40) ----------
  const P = {
    clock: 'M20 12v8l6 4M20 8a12 12 0 1 0 0.01 0',
    brand: 'M11 11h18v18H11zM15 17h10M15 21h10M15 25h6',
    still: 'M10 12h20v16H10zM10 24l6-5l5 4l4-3l5 4',
    cube: 'M20 9l10 5v12l-10 5l-10-5V14zM10 14l10 5l10-5M20 19v12',
    doc: 'M13 9h10l6 6v16H13zM23 9v6h6M16 21h10M16 25h7',
    screen: 'M9 11h22v15H9zM16 31h8M20 26v5',
    cap: 'M8 17l12-6l12 6l-12 6zM13 20v6c4 3 10 3 14 0v-6',
    book: 'M20 13c-3-2-7-2-10-1v16c3-1 7-1 10 1c3-2 7-2 10-1V12c-3-1-7-1-10 1zM20 13v16',
    user: 'M20 11a5 5 0 1 0 0.01 0M11 31a9 8 0 0 1 18 0',
    shield: 'M20 9l9 3v7c0 6-4 9-9 11c-5-2-9-5-9-11v-7z',
    check: 'M12 20l6 6l10-12',
    eye: 'M8 20s5-8 12-8s12 8 12 8s-5 8-12 8s-12-8-12-8zM20 17a3 3 0 1 0 0.01 0',
    chat: 'M10 11h20v13H18l-6 5v-5h-2z',
    folder: 'M9 14h8l3 3h11v12H9z',
    bolt: 'M22 8l-10 14h8l-2 10l10-14h-8z',
    search: 'M18 10a7 7 0 1 0 0.01 0M23 23l7 7',
    play: 'M15 11l14 9l-14 9z',
    gear: 'M20 15a5 5 0 1 0 0.01 0M20 8v3M20 29v3M8 20h3M29 20h3M11.5 11.5l2 2M26.5 26.5l2 2M11.5 28.5l2-2M26.5 13.5l2-2',
    upload: 'M20 27V13M14 19l6-6l6 6M11 30h18',
    git: 'M14 11v18M14 15a3 3 0 1 0 0.01 0M26 13a3 3 0 1 0 0.01 0M26 16c0 6-12 4-12 9',
    spark: 'M20 9v6M20 25v6M9 20h6M25 20h6M13 13l3 3M24 24l3 3M13 27l3-3M24 16l3-3',
    puzzle: 'M12 12h6a2 2 0 1 1 4 0h6v6a2 2 0 1 1 0 4v6h-6a2 2 0 1 0-4 0h-6z',
  };
  const ic = (name, color = C.blue, size = 44) =>
    `<svg class="ico" width="${size}" height="${size}" viewBox="0 0 40 40" fill="none"><circle cx="20" cy="20" r="19" fill="${color}"/><g stroke="#fff" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round" fill="none"><path d="${P[name]}"/></g></svg>`;
  const icAt = (name, cx, cy, color, s = 1.5) =>
    `<g transform="translate(${cx - 20 * s},${cy - 20 * s}) scale(${s})" stroke="${color}" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round" fill="none"><path d="${P[name]}"/></g>`;

  // ---------- Utilidades de slide ----------
  const attr = (html, a) => html.replace('<section ', `<section ${a} `);
  const aa = (html, id) => attr(html, `data-auto-animate data-auto-animate-id="${id}" data-transition="none"`);
  const card = (icon, color, t, d, cls = '', i = 0) =>
    `<div class="card ${cls}" style="--c:${color};--i:${i}">${ic(icon, color)}<div><div class="ct">${t}</div><div class="cl">${d}</div></div></div>`;
  const rowCard = (icon, color, t, d, cls = '', i = 0) => card(icon, color, t, d, 'row ' + cls, i);

  // ---------- Chat simulado (estilo asistente de IA) ----------
  // items: {user} burbuja del profe · {think: s} "Pensando…" con tres puntos que desaparece · {skill} pastilla
  // · {ai, wait} respuesta. Todo entra con CSS cuando la slide está .present; chat.end = segundo en que termina.
  const SPARK = `<svg class="spark" viewBox="0 0 24 24" width="20" height="20"><path fill="#D97757" d="M12 2l1.6 6.1L19 5l-3.1 5.4L22 12l-6.1 1.6L19 19l-5.4-3.1L12 22l-1.6-6.1L5 19l3.1-5.4L2 12l6.1-1.6L5 5l5.4 3.1z"/></svg>`;
  function chat(items, { h = 300, w = 0, fs = 0 } = {}) {
    let d = 0.4;
    const row = (cls, html, extra = '') => `<div class="msg ${cls}" style="--d:${d.toFixed(2)}s${extra}"><div>${html}</div></div>`;
    const rows = items.map((it) => {
      let r;
      if (it.user) { r = row('user', it.user); d += 1.0; }
      else if (it.think) { r = row('think', `${SPARK}<span>${it.label || 'Pensando'}</span><i></i><i></i><i></i>`, `;--th:${it.think}s`); d += it.think; }
      else if (it.skill) { r = row('skill', `${SPARK}Usando la skill <b>${it.skill}</b>`); d += 0.6; }
      else { r = row('ai', it.ai); d += it.wait ?? 0.7; }
      return r;
    }).join('');
    chat.end = d;
    return `<div class="chat" style="${w ? `width:${w}px;` : ''}${fs ? `font-size:${fs}px;` : ''}"><div class="bar">${SPARK}<span>Claude</span></div>` +
      `<div class="body" style="height:${h}px">${rows}</div><div class="input">Responder…</div></div>`;
  }
  // Algo que aparece cuando el chat termina (la pieza, el video, el PDF).
  const after = (html, extra = 0) => `<div class="after" style="--d:${(chat.end + extra).toFixed(2)}s">${html}</div>`;

  // ---------- Flujo horizontal ----------
  function flow(nodes, w = 1216, h = 250) {
    const gap = w / nodes.length, cy = 80;
    let s = '';
    nodes.forEach((nd, i) => {
      const cx = gap * i + gap / 2;
      if (i > 0) {
        const x1 = gap * (i - 1) + gap / 2 + 62, x2 = cx - 66;
        s += `<line class="edge" style="--i:${i}" x1="${x1}" y1="${cy}" x2="${x2}" y2="${cy}" stroke="${nd.c}" stroke-width="4" stroke-linecap="round"/>`;
        s += `<g class="node" style="--i:${i}"><path d="M${x2 + 8},${cy} l-14,-8 l0,16 z" fill="${nd.c}"/></g>`;
      }
      s += `<g class="node" style="--i:${i}"><circle class="pulse" style="--i:${i}" cx="${cx}" cy="${cy}" r="64" fill="${nd.c}"/>` +
        `<circle cx="${cx}" cy="${cy}" r="54" fill="#fff" stroke="${nd.c}" stroke-width="4"/>${icAt(nd.icon, cx, cy, nd.c)}` +
        `<text x="${cx}" y="${cy + 92}" text-anchor="middle" font-size="24" font-weight="800" fill="${C.ink}">${nd.t}</text>` +
        `<text x="${cx}" y="${cy + 120}" text-anchor="middle" font-size="18" font-weight="500" fill="${C.muted}">${nd.s || ''}</text></g>`;
    });
    return `<svg class="flow" width="${w}" height="${h}" viewBox="0 0 ${w} ${h}" style="display:block;overflow:visible">${s}</svg>`;
  }
  const wcard = (inner, pad = '28px 0 10px') => `<div style="background:#fff;border-radius:18px;padding:${pad};box-shadow:0 14px 40px rgba(0,0,0,.18)">${inner}</div>`;

  // ---------- Video con placeholder ----------
  function vid(name, w, h, start = 0) {  // start: segundo inicial (salta la carga en blanco de la grabación)
    const t = start ? `#t=${start}` : '';
    return `<div class="vid" style="width:${w}px;height:${h}px" data-media="${name}">` +
      `<video data-autoplay muted loop playsinline preload="auto"><source src="media/${name}.webm${t}" type="video/webm"><source src="media/${name}.mp4${t}" type="video/mp4"></video>` +
      `<div class="ph">${ic('play', C.blue, 64)}<div>Grabación pendiente</div><code>media/${name}.webm | .mp4</code></div></div>`;
  }

  // ---------- Iframe vivo escalado ----------
  // piece=true: pieza del kit en tema claro y con alto fijo (data-dk-fixed). Así no crece al avanzar
  // y adopta la disposición horizontal del kit (html.dk-fs): figura a la izquierda, texto y botones a la derecha.
  function live(src, w, h, scale = 0.75, tag = 'EN VIVO', piece = true) {
    const url = piece ? `${src}?theme=light` : src;
    return `<div class="live" style="width:${w}px;height:${h}px"><span class="tag">${tag}</span>` +
      `<iframe data-src="${url}"${piece ? ' data-dk-fixed="true"' : ''} width="${Math.round(w / scale)}" height="${Math.round(h / scale)}" style="transform:scale(${scale})" loading="lazy" title="Pieza interactiva"></iframe></div>`;
  }

  // ---------- Barras ----------
  function bars(rows, max, lw = 300) {
    return `<div class="bars" style="--lw:${lw}px">` + rows.map((r, i) =>
      `<div class="b ${r.hot ? 'hot' : ''}"><div class="lbl">${r.l}</div><div class="track">` +
      r.segs.map((s) => `<div class="seg" style="--i:${i};--w:${(100 * s.v / max).toFixed(1)}%;background:${s.c}"></div>`).join('') +
      `</div><div class="val" style="--i:${i}">${r.val}</div></div>`).join('') + '</div>';
  }

  // ---------- Dona ----------
  function donut(parts, total, center, sub, size = 300) {
    const r = 110, L = 2 * Math.PI * r;
    let acc = 0, s = '';
    parts.forEach((p) => {
      const len = (p.v / total) * L;
      s += `<circle class="arc" cx="150" cy="150" r="${r}" fill="none" stroke="${p.c}" stroke-width="44" style="--len:${len.toFixed(1)}" stroke-dasharray="0 ${L.toFixed(1)}" stroke-dashoffset="${(-acc).toFixed(1)}" transform="rotate(-90 150 150)"/>`;
      acc += len;
    });
    return `<svg class="donut" width="${size}" height="${size}" viewBox="0 0 300 300">${s}` +
      `<text x="150" y="150" text-anchor="middle" font-size="46" font-weight="800" fill="${C.blue}">${center}</text>` +
      `<text x="150" y="186" text-anchor="middle" font-size="20" font-weight="600" fill="${C.muted}">${sub}</text></svg>`;
  }

  // =================== SLIDES ===================
  const S = [];
  const svgIcon = (name) => `<svg width="30" height="30" viewBox="0 0 40 40" fill="none"><g stroke="#fff" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round"><path d="${P[name]}"/></g></svg>`;
  const section = (n, t, sub) => icesi.sectionSlideA(`<span class="sec-n">${n}</span>${t}<small class="sec-sub">${sub}</small>`);
  const PIECE = {
    restaurante: 'pieces/general/demo/pedido-restaurante/index.html',
    organigrama: 'pieces/general/demo/quien-aprueba/index.html',
  };

  // ---- Apertura: quién soy y el contexto ----
  S.push(icesi.titleSlideA('Los profes cuentan', 'Prof. Kevin David Rodríguez B.<br>Departamento de Computación y Sistemas Inteligentes<br><span class="slide-footer-tag">18 de noviembre de 2026 · Universidad Icesi</span>'));

  // Cursos con nombre completo (los de la encuesta) y cuántos estudiantes respondieron en cada uno.
  const CURSOS = [
    { k: 'Computación en Internet 2', icon: 'screen', c: C.blue, p: 'Ingeniería de Sistemas' },
    { k: 'Computación en Internet 3', icon: 'cube', c: C.purple, p: 'Ingeniería de Sistemas' },
    { k: 'Desarrollo de entornos digitales web', t: 'Desarrollo de Entornos Digitales Web', icon: 'doc', c: C.green, p: 'Diseño de Medios Interactivos' },
    { k: 'Seminario de software', t: 'Seminario de Software', icon: 'bolt', c: C.orange, p: 'Ingeniería de Sistemas' },
  ];
  S.push(icesi.slideStandard('Mis cursos este semestre', `<div class="stage"><div class="grid c4">` +
    CURSOS.map((c, i) => `<div class="card rise" style="--c:${c.c};--i:${i}">${ic(c.icon, c.c, 48)}
      <div class="ct">${c.t || c.k}</div><div class="cl">Programa: <b>${c.p}</b></div></div>`).join('') +
    `</div><div class="cap rise" style="--i:5">Cuatro cursos de programación web y móvil, con <b>la misma forma de preparar el material</b>.</div></div>`));

  const agenda = [
    { icon: 'spark', c: C.blue, t: 'La idea', d: 'Qué cambia al enseñar procesos con IA y no con dibujos' },
    { icon: 'cube', c: C.purple, t: 'Las herramientas', d: 'Piezas interactivas, talleres, slides, DocuKelo y Saman' },
    { icon: 'chat', c: C.green, t: 'Los estudiantes', d: `Qué opinan ${F.n} estudiantes de este material` },
    { icon: 'git', c: C.orange, t: 'Llévatelo', d: 'Lo que aprendí y las skills listas para tu curso' },
  ];
  S.push(icesi.slideStandard('Lo que vamos a ver', `<div class="stage"><div class="grid c4">` +
    agenda.map((a, i) => `<div class="card rise" style="--c:${a.c};--i:${i};padding:20px 18px;min-height:200px">
      <div style="display:flex;align-items:center;justify-content:space-between">${ic(a.icon, a.c, 48)}<span style="font-size:40px;font-weight:800;color:${a.c};opacity:.35">${i + 1}</span></div>
      <div class="ct" style="margin-top:16px">${a.t}</div><div class="cl">${a.d}</div></div>`).join('') +
    `</div></div>`));

  // ==== 1. La idea ====
  S.push(section('01', 'La idea', 'Enseñar procesos, no dibujos'));

  S.push(icesi.slideSidebarLeftOrange('¡Preparar material cuesta!', `<div style="display:flex;flex-direction:column;gap:18px;width:700px">
    ${rowCard('clock', C.orange, 'Horas por cada recurso', 'Un diagrama, una guía o un taller se rehacen semestre a semestre.', 'fragment fade-up')}
    ${rowCard('brand', C.blue, 'Formato que no se repite', 'Cada documento sale con una tipografía, un encabezado y una rúbrica distintos.', 'fragment fade-up')}
    ${rowCard('still', C.purple, 'Gráficos inanimados', 'Un proceso se entiende por su orden y sus causas; una imagen fija no lo muestra.', 'fragment fade-up')}
  </div>`, { type: 'graphic', html: `<svg width="200" height="200" viewBox="0 0 40 40" fill="none"><g stroke="#fff" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"><path d="${P.clock}"/></g></svg>` }));

  S.push(icesi.slideStandard('¿Qué esperaba que aprendieran?', `<div class="stage"><div class="grid c3">
    ${card('eye', C.blue, 'Entender el proceso', 'Ver el orden y la causa de cada paso, no memorizar un dibujo.', 'rise', 0)}
    ${card('book', C.green, 'Avanzar a su ritmo', 'Seguir una guía paso a paso sin depender del profe en cada duda.', 'rise', 1)}
    ${card('check', C.orange, 'Comprobar lo que saben', 'Autoevaluarse al final de cada tema antes del taller o el parcial.', 'rise', 2)}
  </div></div>`));

  S.push(icesi.slideStandard('La IA por defecto frente a la IA con skills', `<div class="stage">
    ${chat([{ user: 'Hazme un diagrama de cómo se atiende un pedido en un restaurante' }], { h: 80 })}
    <div class="grid c2" style="margin-top:14px;align-items:stretch">
      <div class="fragment fade-up" style="text-align:left">
        <div style="font-size:20px;font-weight:800;color:${C.muted};margin-bottom:8px">IA por defecto</div>
        <div style="background:#f3f3f3;border:1px dashed #bbb;border-radius:12px;height:230px;padding:16px 22px;box-sizing:border-box;font:18px/1.6 Consolas,monospace;color:#555">Cliente → Mesero → Cocina<br>1. El cliente hace el pedido.<br>2. La cocina lo prepara.<br>3. El mesero lo sirve.<br><br><span style="color:#999">Colores al azar, otro estilo cada vez,<br>nada se puede explorar.</span></div>
      </div>
      <div class="fragment fade-up" style="text-align:left">
        <div style="font-size:20px;font-weight:800;color:${C.blue};margin-bottom:8px">IA con la skill de piezas interactivas</div>
        <div class="live" style="height:230px;display:flex;align-items:center;padding:0 10px"><img src="media/pieza-restaurante.png" alt="Pieza interactiva de un pedido en un restaurante" style="width:100%;display:block;margin:0"></div>
      </div>
    </div>
  </div>`));

  S.push(icesi.slideStandard('¿Cómo se usa?', `<div class="stage" style="display:flex;gap:24px;align-items:flex-start">
    ${chat([
      { user: 'Crea una pieza interactiva de cómo se aprueba un pedido grande en una empresa' },
      { think: 1.6 },
      { skill: 'piezas interactivas' },
      { ai: '<b>1.</b> Analizo: ¿qué confusión debe evitar el estudiante? <span class="hl">Que cada nivel decide.</span>' },
      { ai: '<b>2.</b> Construyo con el kit: organigrama + avance por pasos.' },
      { ai: '<b>3.</b> La pruebo en un navegador real: 0 errores.' },
      { ai: '<b>Listo.</b> Aquí está la pieza →', wait: 0.4 },
    ], { w: 470, h: 300, fs: 17 })}
    ${after(live(PIECE.organigrama, 720, 400, 0.65, 'RESULTADO'))}
  </div><div class="cap rise" style="--i:16">Se pide en español. <b>La skill aporta el método</b>; el profe revisa y decide.</div>`));

  S.push(icesi.slideStandard('La IA en los tres momentos', `<div class="stage"><div class="grid c3">
    ${card('chat', C.blue, 'Planear', 'Una entrevista previa y un plan slide por slide que apruebo antes de construir.', 'rise', 0)}
    ${card('cube', C.purple, 'Crear material', 'Piezas interactivas, guías, talleres y presentaciones con la marca Icesi.', 'rise', 1)}
    ${card('check', C.green, 'Evaluar', 'Talleres con rúbrica y nivel de IA declarado; apoyo para revisar respuestas abiertas, que yo valido.', 'rise', 2)}
  </div></div>`));

  // ==== 2. Las herramientas ====
  S.push(section('02', 'Las herramientas', 'Piezas, talleres, slides, DocuKelo y Saman'));

  S.push(icesi.sectionSlideEBlue('Piezas interactivas<br><small style="font-size:0.5em;">Explicar procesos con orden y causa</small>', wcard(flow([
    { icon: 'bolt', t: 'Concepto', s: 'lo que cuesta entender', c: C.blue },
    { icon: 'cube', t: 'Pieza', s: 'paso a paso, con clics', c: C.purple },
    { icon: 'eye', t: 'Exploración', s: 'el estudiante avanza', c: C.green },
    { icon: 'check', t: 'Comprensión', s: 've la causa', c: C.orange },
  ], 1000, 230))));

  S.push(icesi.slideStandard('Una pieza en vivo', `<div class="stage" style="display:flex;justify-content:center">${live(PIECE.restaurante, 900, 410, 0.7, 'EN VIVO', false)}</div>`));

  S.push(icesi.slideStandard('Así se genera una pieza', `<div class="stage" style="display:flex;gap:24px;align-items:flex-start">
    ${chat([
      { user: 'Convierte esta imagen del organigrama en una pieza que se pueda recorrer' },
      { think: 1.4, label: 'Leyendo la imagen' },
      { skill: 'piezas interactivas' },
      { ai: 'Concepto: <span class="hl">la decisión sube y baja por niveles</span>' },
      { ai: 'Patrón del catálogo: <b>árbol + reproductor por pasos</b>' },
      { ai: 'Escribo datos, no código: nodos y pasos.' },
      { ai: 'Prueba en claro y oscuro: <span class="ok">OK</span>', wait: 0.5 },
    ], { w: 560, h: 320, fs: 17 })}
    <div style="display:flex;flex-direction:column;gap:10px;width:630px">
      ${rowCard('search', C.blue, 'Proceso pedagógico', 'Antes de dibujar decide qué confusión evita y qué no mostrar.', 'sm fragment fade-up')}
      ${rowCard('puzzle', C.purple, 'Kit probado', 'Más de 40 patrones con ejemplos reales de los cursos.', 'sm fragment fade-up')}
      ${rowCard('check', C.green, 'Se prueba sola', 'Un navegador real recorre cada paso antes de publicar.', 'sm fragment fade-up')}
      ${rowCard('book', C.orange, 'Aprende de sus errores', 'Cada pieza nueva deja lecciones escritas en la skill.', 'sm fragment fade-up')}
    </div></div>`));

  // Markdown -> taller (auto-animate)
  const mdDoc = `<div class="doc md" data-id="doc"><div data-id="t" class="h"># Taller 3: Patrones creacionales</div><div data-id="m" style="color:#6c7086">curso: Patrones · NRC 12345</div><div data-id="o" class="h" style="margin-top:12px">## Objetivo</div><div data-id="ot">Aplicar Factory y Builder a un caso.</div><div data-id="r" class="h" style="margin-top:12px">## Rúbrica</div><div data-id="r1" class="li">- Diseño (40%)</div><div data-id="r2" class="li">- Implementación (40%)</div><div data-id="r3" class="li">- Uso de IA: nivel 2</div></div>`;
  const wsDoc = `<div class="doc ws" data-id="doc"><div class="bandbar"></div><div style="display:flex;justify-content:space-between;align-items:center;margin-top:6px"><img src="resources/logos/ICESI_logo_prin_descriptor_RGB_POSITIVO_0924.svg" style="height:34px;margin:0" alt="Icesi"><span style="font-size:12px;color:${C.muted}">Pág. 1 de 3</span></div><div data-id="t" style="font-size:26px;font-weight:800;color:${C.blue};margin-top:10px">Taller 3: Patrones creacionales</div><div class="meta" data-id="m"><div><b>Curso</b> Patrones de Diseño</div><div><b>NRC</b> 12345</div><div><b>Periodo</b> 2026-2</div><div><b>Valor</b> 15%</div></div><div data-id="o" class="badge">Objetivo</div><div data-id="ot">Aplicar Factory y Builder a un caso.</div><div data-id="r" class="badge" style="background:${C.orange}">Rúbrica (sobre 5.0)</div><table><tr><th>Criterio</th><th>Peso</th></tr><tr data-id="r1"><td>Diseño</td><td>40%</td></tr><tr data-id="r2"><td>Implementación</td><td>40%</td></tr><tr data-id="r3"><td>Uso de IA permitido</td><td>Nivel 2</td></tr></table></div>`;
  const wsStage = (doc, right) => `<div class="stage" style="display:flex;gap:40px;align-items:center;justify-content:center">${doc}<div style="width:520px;text-align:left">${right}</div></div>`;
  S.push(icesi.sectionSlideEGreen('Talleres y exámenes<br><small style="font-size:0.5em;">Con la marca Icesi, sin maquetar a mano</small>'));
  S.push(aa(icesi.slideStandard('Del texto al taller', wsStage(mdDoc, `<div data-id="lab" style="font-size:26px;font-weight:800;color:${C.ink}">El profe escribe en Markdown o en Word.</div><div data-id="lab2" style="font-size:21px;color:${C.muted};margin-top:10px">Solo el contenido: títulos, objetivo, rúbrica.</div>`)), 'ws'));
  S.push(aa(icesi.slideStandard('Del texto al taller', wsStage(wsDoc, `<div data-id="lab" style="font-size:26px;font-weight:800;color:${C.blue}">La skill entrega HTML y PDF institucionales.</div><div data-id="lab2" style="font-size:21px;color:${C.muted};margin-top:10px">Encabezado con logo en cada página, metadatos, rúbrica sobre 5.0 y el nivel de uso de IA declarado. Sin tablas cortadas entre páginas.</div>`)), 'ws'));

  S.push(icesi.slideStandard('Un taller en un minuto', `<div class="stage" style="display:flex;gap:24px;align-items:flex-start">
    ${chat([
      { user: 'Genera el taller 3 a partir de este documento' },
      { think: 1.4 },
      { skill: 'talleres Icesi' },
      { ai: 'Leo el contenido y la rúbrica.' },
      { ai: 'Aplico plantilla, encabezado y logo.' },
      { ai: 'Reviso que ninguna tabla quede cortada.' },
      { ai: '<span class="ok">Listo:</span> taller-3.html y taller-3.pdf', wait: 0.4 },
    ], { w: 520, h: 320, fs: 17 })}
    ${after(vid('taller-resultado', 670, 418))}
  </div>`));

  S.push(icesi.sectionSlideEOrange('Presentaciones en dos fases<br><small style="font-size:0.5em;">El profe aprueba antes de construir</small>', wcard(flow([
    { icon: 'chat', t: 'Entrevista', s: 'para quién y qué', c: C.orange },
    { icon: 'doc', t: 'Plan', s: 'slide por slide', c: C.blue },
    { icon: 'user', t: 'Pausa', s: 'el profe aprueba', c: C.purple },
    { icon: 'screen', t: 'HTML', s: 'animado', c: C.green },
    { icon: 'upload', t: 'PDF', s: 'Saman o imprimir', c: C.orange },
  ], 1000, 230))));

  S.push(icesi.slideStandard('Esta presentación se hizo así', `<div class="stage" style="display:flex;gap:30px;align-items:center">${vid('slides-recorrido', 780, 439)}
    <div style="text-align:left;width:400px;display:flex;flex-direction:column;gap:16px">
      ${rowCard('screen', C.blue, 'Es una página web', 'Todo lo que ven es HTML: animaciones, piezas y video.', 'rise', 0)}
      ${rowCard('doc', C.green, 'Mismo sistema', 'Las slides semanales de los cursos salen igual.', 'rise', 1)}
      ${rowCard('spark', C.purple, 'Sin diseñador', 'Íconos, diagramas y paleta Icesi incluidos.', 'rise', 2)}
    </div></div>`));

  S.push(icesi.slideSidebarLeftBlue('DocuKelo: el curso como web', `<div style="display:flex;flex-direction:column;gap:14px;width:700px">
    ${rowCard('book', C.blue, 'Guías paso a paso', 'Numeradas, con código para copiar y modo oscuro.', 'rise', 0)}
    ${rowCard('cube', C.purple, 'Piezas interactivas', 'Más de 80 piezas embebidas en los capítulos.', 'rise', 1)}
    ${rowCard('check', C.green, 'Quizzes por tema', 'Autoevaluación al final de cada sección.', 'rise', 2)}
    ${rowCard('screen', C.orange, 'Slides de cada semana', 'Las presentaciones de clase, dentro del mismo sitio.', 'rise', 3)}
  </div>`, { type: 'icons', items: [
    { icon: svgIcon('screen'), label: 'Computación en Internet 2' },
    { icon: svgIcon('cube'), label: 'Computación en Internet 3' },
    { icon: svgIcon('doc'), label: 'Entornos Digitales Web' },
    { icon: svgIcon('bolt'), label: 'Seminario de Software' },
  ] }));

  S.push(icesi.slideStandard('Un recorrido por DocuKelo', `<div class="stage" style="display:flex;gap:30px;align-items:center">${vid('docukelo-recorrido', 790, 444)}
    <div style="text-align:left;width:360px">
      <div style="font-size:22px;font-weight:700;color:${C.ink};line-height:1.4">Español e inglés, en el celular y en el computador.</div>    </div></div>`));

  // Saman: grabación real (se crea un tema de prueba, se recorre y luego se borra).
  S.push(icesi.sectionSlideEYellow('Saman<br><small style="font-size:0.5em;">El material vivo, dentro del curso</small>'));
  S.push(icesi.slideStandard('Así llega a Saman', `<div class="stage" style="display:flex;justify-content:center">${vid('saman-recorrido', 800, 450, 2)}</div>`));
  S.push(icesi.slideTwoCols('El asistente que publica en Saman', `<div style="display:flex;flex-direction:column;gap:14px">
      ${rowCard('search', C.blue, '1. Lee antes de escribir', 'Verifica el curso y respalda la página actual.', 'rise', 0)}
      ${rowCard('eye', C.purple, '2. Crea oculto', 'Lo nuevo no lo ven los estudiantes hasta que el profe decida.', 'rise', 1)}
      ${rowCard('check', C.green, '3. Compara', 'Lo publicado frente al archivo local, sin sorpresas.', 'rise', 2)}
      ${rowCard('shield', C.orange, 'Nunca toca', 'Calificaciones, inscripciones ni borra sin permiso.', 'rise', 3)}
    </div>`, vid('saman-uploader', 590, 332, 3.5)));

  // ==== 3. Los estudiantes ====
  S.push(section('03', 'Los estudiantes', `Encuesta a ${F.n} estudiantes · 2026-2`));

  const freq = F.frecuencia;
  const weekly = (freq['Varias veces por semana'] || 0) + (freq['Una vez por semana'] || 0);
  S.push(icesi.slideTwoCols(`${F.n} estudiantes opinan`, `<div style="text-align:left">
      <div class="big"><span data-count="${F.calificacion.media}" data-dec="2">0</span><small> / 5</small></div>
      <div style="font-size:24px;font-weight:700;color:${C.ink};margin-top:12px">calificación de la documentación como apoyo al aprendizaje</div>
    </div>`, `<div style="text-align:left"><div style="font-size:22px;font-weight:800;color:${C.ink};margin-bottom:14px">¿De qué curso respondieron?</div>${bars(
      CURSOS.map((c) => ({ l: c.t || c.k, segs: [{ v: F.cursos[c.k] || 0, c: c.c }], val: F.cursos[c.k] || 0 })), Math.max(...Object.values(F.cursos)), 300)}</div>`));

  const usos = Object.entries(F.usos).filter(([, v]) => v > 1).slice(0, 5);
  S.push(icesi.slideTwoCols('¿Qué hacen con el material?', `<div style="text-align:left"><div style="font-size:22px;font-weight:800;color:${C.ink};margin-bottom:14px">Para qué lo usan</div>${bars(
      usos.map(([k, v], i) => ({ l: k, segs: [{ v, c: i < 2 ? C.blue : C.light }], val: v, hot: i === 0 })), F.n, 300)}</div>`,
    `<div style="text-align:left"><div style="font-size:22px;font-weight:800;color:${C.ink};margin-bottom:14px">¿Con qué frecuencia lo consultan?</div>${bars([
      { l: 'Varias veces por semana', segs: [{ v: freq['Varias veces por semana'], c: C.blue }], val: freq['Varias veces por semana'], hot: 1 },
      { l: 'Una vez por semana', segs: [{ v: freq['Una vez por semana'], c: C.blue }], val: freq['Una vez por semana'] },
      { l: 'Antes de talleres o parciales', segs: [{ v: freq['Solo antes de talleres o parciales'], c: C.light }], val: freq['Solo antes de talleres o parciales'] },
      { l: 'Casi nunca', segs: [{ v: freq['Casi nunca'] || 0, c: C.grey }], val: freq['Casi nunca'] || 0 },
    ], F.n, 230)}<div class="cap fragment fade-up" style="font-size:22px"><b>${weekly} de ${F.n}</b> lo usan al menos cada semana.</div></div>`));

  const ay = Object.entries(F.ayuda).map(([k, d]) => ({ k, mucho: d['Me ayuda mucho'], ayuda: d['Me ayuda'] }))
    .sort((a, b) => (b.mucho + b.ayuda) - (a.mucho + a.ayuda) || b.mucho - a.mucho);
  const rk = F.ranking.map((r) => r.item.replace(/ \(.*\)/, ''));
  const interact = F.acuerdo_doc['Lo interactivo me ayuda a recordar más que lo estático'];
  const interactYes = interact['De acuerdo'] + interact['Totalmente de acuerdo'];
  S.push(icesi.slideTwoCols('Lo interactivo enseña', `<div style="text-align:left"><div style="font-size:21px;font-weight:800;color:${C.ink};margin-bottom:12px">¿Cuánto les ayuda cada recurso?</div>${bars(
      ay.map((a) => ({ l: a.k, segs: [{ v: a.mucho, c: C.blue }, { v: a.ayuda, c: C.light }], val: `${a.mucho + a.ayuda}`, hot: /Animaciones/.test(a.k) })), F.n, 200)}
      <div class="legend"><span><i style="background:${C.blue}"></i>Me ayuda mucho</span><span><i style="background:${C.light}"></i>Me ayuda</span><span>de ${F.n}</span></div></div>`,
    `<div style="text-align:left"><div style="font-size:21px;font-weight:800;color:${C.ink};margin-bottom:12px">Lo más útil para aprender (ranking)</div>
      ${rk.map((t, i) => `<div class="rise" style="--i:${i};display:flex;align-items:center;gap:14px;padding:7px 14px;margin-bottom:8px;border-radius:10px;background:${/Piezas/.test(t) ? '#ececfd' : '#fff'};border:1px solid ${/Piezas/.test(t) ? C.blue : '#CECFD4'}"><span style="font-size:22px;font-weight:800;color:${/Piezas/.test(t) ? C.blue : C.muted};width:30px">${i + 1}°</span><span style="font-size:19px;font-weight:${/Piezas/.test(t) ? 800 : 600};color:${C.ink}">${t}</span></div>`).join('')}
      <div class="cap fragment fade-up" style="font-size:22px"><b>${interactYes} de ${F.n}</b>: lo interactivo les ayuda a recordar más que lo estático.</div></div>`));

  const io = F.ia_opinion;
  const ioParts = [
    { v: io['Me parece positivo si el docente los revisa y valida'], c: C.blue, l: 'Positivo si el docente revisa y valida' },
    { v: io['Me parece muy positivo, porque hay más y mejores gráficos'], c: C.green, l: 'Muy positivo: más y mejores gráficos' },
    { v: io['Me es indiferente; me importa el resultado, no cómo se hizo'], c: C.grey, l: 'Indiferente' },
    { v: io['Me genera dudas sobre su precisión'], c: C.orange, l: 'Dudas sobre la precisión' },
  ];
  const favor = ioParts[0].v + ioParts[1].v;
  S.push(icesi.slideTwoCols('¿Y que la IA ayude al profe?', `<div style="display:flex;gap:22px;align-items:center">${donut(ioParts, F.n, `${favor}/${F.n}`, 'a favor', 280)}
      <div style="text-align:left;display:flex;flex-direction:column;gap:10px">${ioParts.map((p, i) => `<div class="rise" style="--i:${i + 3};font-size:17px;line-height:1.3;color:${C.ink}"><i style="display:inline-block;width:14px;height:14px;border-radius:3px;background:${p.c};margin-right:8px;vertical-align:-1px"></i><b>${p.v}</b> ${p.l}</div>`).join('')}</div></div>
      <div class="cap fragment fade-up" style="font-size:22px;text-align:left">El mensaje: <b>el profe sigue siendo responsable</b> de lo que publica.</div>`,
    `<div style="text-align:left"><div style="font-size:21px;font-weight:800;color:${C.ink};margin-bottom:12px">En sus palabras</div>
      ${F.citas.slice(0, 3).map((q) => `<div class="quote fragment fade-up">«${q}»</div>`).join('')}</div>`));

  // ==== 4. Llévatelo ====
  S.push(section('04', 'Llévatelo', 'Lo que cambió, lo que viene y cómo empezar'));

  S.push(icesi.slideTwoCols('Lo que cambió y lo que voy a ajustar', `<div style="text-align:left"><div style="font-size:22px;font-weight:800;color:${C.ink};margin-bottom:12px">En mi práctica docente</div>
      <div style="display:flex;flex-direction:column;gap:12px">
      ${rowCard('search', C.blue, 'Diseño la explicación', 'Pienso qué confusión evitar; la IA construye.', 'sm rise', 0)}
      ${rowCard('puzzle', C.purple, 'Material que se reutiliza', 'Cada pieza deja lecciones para la siguiente.', 'sm rise', 1)}
      ${rowCard('user', C.green, 'Más tiempo en clase', 'Menos horas maquetando, más con los estudiantes.', 'sm rise', 2)}
      </div></div>`,
    `<div style="text-align:left"><div style="font-size:22px;font-weight:800;color:${C.ink};margin-bottom:12px">Lo que piden los estudiantes</div>
      <div style="display:flex;flex-direction:column;gap:12px">
      ${rowCard('check', C.orange, 'Quizzes más retadores', 'Hoy las respuestas se adivinan por descarte.', 'sm fragment fade-up')}
      ${rowCard('doc', C.blue, 'Código junto a la teoría', 'Ver el concepto y su código en el mismo lugar.', 'sm fragment fade-up')}
      ${rowCard('chat', C.purple, 'Analogías sencillas', 'Para entrar a los términos difíciles.', 'sm fragment fade-up')}
      ${rowCard('play', C.green, 'Enlaces a las grabaciones', 'La clase grabada al lado de su tema.', 'sm fragment fade-up')}
      </div></div>`));

  S.push(icesi.slideSidebarLeftPurple('Tu turno: las skills para tu curso', `<div style="width:700px">${chat([
    { user: 'Instala las skills docentes de Icesi' },
    { think: 1.2 },
    { ai: 'Instaladas: piezas interactivas, talleres, slides y Saman.' },
    { user: 'Crea el taller 1 de mi curso de Mercadeo con su rúbrica' },
    { think: 1.2 },
    { skill: 'talleres Icesi' },
    { ai: '<span class="ok">Listo:</span> taller-1.pdf con la marca Icesi.', wait: 0.4 },
  ], { h: 220, fs: 17 })}<div class="cap rise" style="--i:16">Instalar, abrir y pedir: la guía trae un ejemplo por skill.</div></div>`,
  { type: 'icons', items: [
    { icon: svgIcon('cube'), label: 'Piezas interactivas' },
    { icon: svgIcon('doc'), label: 'Talleres Icesi' },
    { icon: svgIcon('screen'), label: 'Slides Icesi' },
    { icon: svgIcon('cap'), label: 'Publicar en Saman' },
  ] }));

  S.push(icesi.titleSlideA('Gracias', '¿Preguntas?<br><span class="slide-footer-tag">Prof. Kevin David Rodríguez B. · Universidad Icesi</span>'));

  // ==== Anexo: piezas reales de los cursos (para mostrar si hay tiempo o en preguntas) ====
  S.push(icesi.sectionSlideEBlue('Anexo<br><small style="font-size:0.5em;">Cinco piezas reales de nuestros cursos</small>'));
  [
    ['Código paso a paso · Computación en Internet 2', 'pieces/computacion-2/semana-15/usestate-actualiza/index.html'],
    ['Iconos que viajan entre capas · Computación en Internet 3', 'pieces/computacion-3/semana-12/flujo-redux/index.html'],
    ['Una app que se puede tocar · Seminario de Software', 'pieces/seminario-de-i-d-i/semana-11/setstate-en-accion/index.html'],
    ['Capas concéntricas · Computación en Internet 3', 'pieces/computacion-3/semana-12/clean-architecture-circular/index.html'],
    ['Un protocolo con fallas simuladas · Computación en Internet 2', 'pieces/computacion-2/semana-1/tcp-en-accion/index.html'],
  ].forEach(([t, src]) => S.push(icesi.slideStandard(t, `<div class="stage" style="display:flex;justify-content:center">${live(src, 1216, 470, 0.9)}</div>`)));

  document.getElementById('icesi-slides').innerHTML = S.join('\n');

  // ---------- Comportamiento ----------
  // Placeholder cuando falta el video (la última <source> falla).
  document.querySelectorAll('.vid').forEach((box) => {
    const srcs = box.querySelectorAll('source');
    srcs[srcs.length - 1].addEventListener('error', () => box.classList.add('missing'));
  });
  // Cifras que cuentan hacia arriba y donas que se llenan.
  function enter(slide) {
    if (!slide) return;
    slide.querySelectorAll('[data-count]').forEach((el) => {
      const end = parseFloat(el.dataset.count), dec = +(el.dataset.dec || 0), t0 = performance.now();
      const step = (t) => { const k = Math.min(1, (t - t0) / 1400), e = 1 - Math.pow(1 - k, 3);
        el.textContent = (end * e).toFixed(dec).replace('.', ','); if (k < 1) requestAnimationFrame(step); };
      requestAnimationFrame(step);
    });
    slide.querySelectorAll('.donut .arc').forEach((a) => {
      const L = a.getAttribute('stroke-dasharray').split(' ')[1];
      a.setAttribute('stroke-dasharray', `0 ${L}`);
      requestAnimationFrame(() => requestAnimationFrame(() => a.setAttribute('stroke-dasharray', `${a.style.getPropertyValue('--len')} ${L}`)));
    });
  }
  window.deckEnter = enter;
})();
