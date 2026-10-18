#!/usr/bin/env python3
"""dk_animate: anima un SVG existente a partir de una linea de tiempo (JSON), sin redibujarlo.

Una sola especificacion produce dos salidas:
  - SVG autoplay (CSS keyframes, en bucle): funciona dentro de ![](/img/..svg), sin JavaScript.
  - Player HTML paso a paso (Anterior / Siguiente / Reproducir, con leyenda por paso). Usa los tokens del kit
    (dk-base.css) y sigue el tema claro/oscuro del sitio (dk-theme.js); el SVG original se muestra sobre un panel claro.

Comandos:
  inspect  in.svg                      Lista los elementos con su numero (@N) y los comentarios de seccion.
  build    in.svg spec.json -o DIR     Genera DIR/<nombre>.animated.svg y DIR/<nombre>.player.html.

Solo biblioteca estandar de Python 3.8+.
"""
import argparse
import json
import re
import sys
import xml.etree.ElementTree as ET

SVG_NS = 'http://www.w3.org/2000/svg'
XLINK_NS = 'http://www.w3.org/1999/xlink'
ET.register_namespace('', SVG_NS)
ET.register_namespace('xlink', XLINK_NS)

SKIP_TAGS = {'defs', 'style', 'title', 'desc', 'metadata', 'script', 'marker', 'clipPath', 'mask', 'linearGradient', 'radialGradient', 'pattern'}
DRAWABLE = {'path', 'line', 'polyline', 'polygon', 'circle', 'ellipse', 'rect'}
FX = {'fade', 'rise', 'pop', 'draw', 'pulse', 'flow'}
HIDDEN = {  # estado inicial de cada efecto de entrada
    'fade': 'opacity:0',
    'rise': 'opacity:0;transform:translateY(14px)',
    'pop': 'opacity:0;transform:scale(.6)',
}
SHOWN = 'opacity:1;transform:none'
EASE = 'cubic-bezier(.2,.8,.2,1)'


def local(tag):
    return tag.split('}', 1)[1] if isinstance(tag, str) and tag.startswith('{') else tag


def parse(path):
    parser = ET.XMLParser(target=ET.TreeBuilder(insert_comments=True))
    return ET.parse(path, parser=parser).getroot()


def walk(root):
    """Elementos visibles en orden de documento, sin entrar a defs/style/etc. Comentarios incluidos."""
    out = []

    def rec(node, depth):
        for child in list(node):
            if child.tag is ET.Comment:
                out.append((child, depth))
                continue
            if local(child.tag) in SKIP_TAGS:
                continue
            out.append((child, depth))
            rec(child, depth + 1)

    rec(root, 0)
    return out


def text_of(el):
    return ''.join(el.itertext()).strip()


def parent_map(root):
    return {c: p for p in root.iter() for c in p}


# ---------- seleccion ----------

def index_map(root):
    idx, n = {}, 0
    for el, _ in walk(root):
        if el.tag is ET.Comment:
            continue
        n += 1
        idx[n] = el
    return idx


def select(root, sel, idx):
    """Selectores soportados (todos devuelven elementos en orden de documento):
      @N                  elemento numero N del comando inspect
      text:abc            <text> cuyo contenido contiene "abc" (sin distinguir mayusculas)
      after:abc           los hermanos que siguen al comentario que contiene "abc", hasta el siguiente comentario
      #id   .clase   tag   tag[attr=valor]   tag[attr*=valor]
    """
    sel = sel.strip()
    if sel.startswith('@'):
        return [idx[int(sel[1:])]]
    if sel.startswith('text:'):
        needle = sel[5:].lower()
        return [e for e, _ in walk(root) if e.tag is not ET.Comment and local(e.tag) == 'text' and needle in text_of(e).lower()]
    if sel.startswith('after:'):
        needle = sel[6:].strip().lower()
        found = []
        for parent in root.iter():
            active = False
            for child in list(parent):
                if child.tag is ET.Comment:
                    active = needle in (child.text or '').lower()
                    continue
                if active and local(child.tag) not in SKIP_TAGS:
                    found.append(child)
        return found
    m = re.match(r'^([a-zA-Z]*)(?:#([\w-]+)|\.([\w-]+))?(?:\[([\w-]+)(\*?=)([^\]]+)\])?$', sel)
    if not m:
        raise SystemExit(f'Selector no soportado: {sel!r}')
    tag, eid, cls, attr, op, val = m.groups()
    out = []
    for e, _ in walk(root):
        if e.tag is ET.Comment:
            continue
        if tag and local(e.tag) != tag:
            continue
        if eid and e.get('id') != eid:
            continue
        if cls and cls not in (e.get('class') or '').split():
            continue
        if attr:
            have = e.get(attr)
            if have is None or (op == '=' and have != val) or (op == '*=' and val not in have):
                continue
        out.append(e)
    return out


def resolve(root, target, groups, idx, only=None):
    names = [target] if isinstance(target, str) else list(target)
    found = []
    for name in names:
        defined = groups.get(name, name)
        for sel in defined if isinstance(defined, list) else [defined]:
            found.extend(select(root, sel, idx))
    seen, uniq = set(), []
    for e in found:
        if id(e) not in seen:
            seen.add(id(e))
            uniq.append(e)
    if only:
        wanted = {t.strip() for t in only.split(',')}
        uniq = [e for e in uniq if local(e.tag) in wanted]
    if not uniq:
        raise SystemExit(f'El objetivo {target!r} no selecciono ningun elemento. Use "inspect" para ver los elementos.')
    return uniq


# ---------- linea de tiempo ----------

def plan(root, spec):
    """Resuelve la especificacion a una lista de efectos con tiempos absolutos (segundos)."""
    idx = index_map(root)
    groups = spec.get('groups', {})
    effects, steps, t = [], [], 0.0
    for si, step in enumerate(spec['steps']):
        t0 = float(step.get('at', t))
        end = t0
        for item in step.get('do', []):
            fx = item['fx']
            if fx not in FX:
                raise SystemExit(f'Efecto desconocido: {fx} (validos: {sorted(FX)})')
            dur = float(item.get('dur', 0.6))
            stagger = float(item.get('stagger', 0))
            delay = float(item.get('delay', 0))
            for k, el in enumerate(resolve(root, item['target'], groups, idx, item.get('only'))):
                if fx == 'draw' and local(el.tag) not in DRAWABLE:
                    raise SystemExit(f'"draw" solo aplica a formas (path, line, circle...), no a <{local(el.tag)}>. Use otro efecto o apunte a la forma.')
                s = t0 + delay + k * stagger
                effects.append({'el': el, 'fx': fx, 'start': s, 'end': s + dur, 'step': si, 'dur': dur})
                end = max(end, s + dur)
        steps.append({'start': t0, 'end': end, 'caption': step.get('caption', ''), 'title': step.get('title', ''), 'dwell': float(step.get('dwell', 2.6))})
        t = end + float(step.get('hold', 0.7))
    return effects, steps, t


def prefix_of(spec):
    pid = re.sub(r'[^A-Za-z0-9]', '', spec.get('id', 'dk')) or 'dk'
    return pid


def prepare(root, effects, pid):
    """Envuelve cada elemento animado en <g class="dkw"> para no pisar su atributo transform.
    'draw' y 'flow' actuan sobre la forma, no sobre un envoltorio."""
    wrappers = {}  # id(el) -> (wrapper, n)
    own = {}       # id(el) -> n (draw/flow directamente sobre el elemento)
    counter = 0
    for e in effects:
        el = e['el']
        if e['fx'] in ('draw', 'flow'):
            if id(el) not in own:
                counter += 1
                own[id(el)] = counter
            e['cls'] = f'dk{pid}-e{own[id(el)]}'
            el.set('class', (el.get('class', '') + ' ' + e['cls']).strip())
            if e['fx'] == 'draw':
                el.set('pathLength', '1')
            continue
        if id(el) not in wrappers:
            counter += 1
            parent = parent_map(root)[el]
            pos = list(parent).index(el)
            g = ET.Element(f'{{{SVG_NS}}}g', {'class': f'dkw dk{pid}-w{counter}'})
            parent.remove(el)
            g.append(el)
            parent.insert(pos, g)
            wrappers[id(el)] = (g, counter)
        g, n = wrappers[id(el)]
        e['cls'] = f'dk{pid}-w{n}'
        e['wrapper'] = g
    return wrappers


def pct(x, total):
    return round(max(0.0, min(100.0, x / total * 100)), 3)


def keyframes_css(pid, effects, total, loop, tail):
    """CSS autoplay: un @keyframes por elemento, todos con el mismo ciclo."""
    css = [f'#{pid} .dkw{{transform-box:fill-box;transform-origin:center}}']
    by_cls = {}
    for e in effects:
        by_cls.setdefault(e['cls'], []).append(e)
    cycle = total + (tail if loop else 0)
    for cls, items in by_cls.items():
        appear = next((i for i in items if i['fx'] in HIDDEN), None)
        draw = next((i for i in items if i['fx'] == 'draw'), None)
        pulses = [i for i in items if i['fx'] == 'pulse']
        flow = next((i for i in items if i['fx'] == 'flow'), None)
        stops = []  # (porcentaje, css, easing opcional)
        if appear:
            hid = HIDDEN[appear['fx']]
            stops.append((0, hid, None))
            stops.append((pct(appear['start'], cycle), hid, EASE))
            stops.append((pct(appear['end'], cycle), SHOWN, None))
            for p in pulses:
                a, m, b = p['start'], p['start'] + p['dur'] / 2, p['end']
                stops.append((pct(a, cycle), SHOWN, 'ease-in-out'))
                stops.append((pct(m, cycle), 'opacity:1;transform:scale(1.14)', 'ease-in-out'))
                stops.append((pct(b, cycle), SHOWN, None))
            if loop:
                stops.append((pct(total, cycle), SHOWN, None))
                stops.append((100, hid, None))
        elif pulses:
            stops.append((0, SHOWN, None))
            for p in pulses:
                a, m, b = p['start'], p['start'] + p['dur'] / 2, p['end']
                stops.append((pct(a, cycle), SHOWN, 'ease-in-out'))
                stops.append((pct(m, cycle), 'opacity:1;transform:scale(1.14)', 'ease-in-out'))
                stops.append((pct(b, cycle), SHOWN, None))
            stops.append((100, SHOWN, None))
        if draw:
            stops2 = [(0, 'stroke-dashoffset:1', None), (pct(draw['start'], cycle), 'stroke-dashoffset:1', EASE), (pct(draw['end'], cycle), 'stroke-dashoffset:0', None)]
            if loop:
                stops2 += [(pct(total, cycle), 'stroke-dashoffset:0', None), (100, 'stroke-dashoffset:1', None)]
            css.append(f'#{pid} .{cls}{{stroke-dasharray:1}}')
            css.append(keyframe_block(f'{cls}-draw', stops2))
            css.append(f'#{pid} .{cls}{{animation:{cls}-draw {cycle:.2f}s linear infinite}}' if loop else f'#{pid} .{cls}{{animation:{cls}-draw {cycle:.2f}s linear both}}')
        if stops:
            css.append(keyframe_block(cls, stops))
            css.append(f'#{pid} .{cls}{{animation:{cls} {cycle:.2f}s linear {"infinite" if loop else "both"}}}')
        if flow:
            css.append(f'#{pid} .{cls}{{stroke-dasharray:10 8;animation:dk{pid}-flow 1s linear infinite}}')
    css.append(f'@keyframes dk{pid}-flow{{to{{stroke-dashoffset:-18}}}}')
    # sin movimiento: se muestra el estado final, sin animar
    css.append(f'@media (prefers-reduced-motion:reduce){{#{pid} .dkw,#{pid} [class*="dk{pid}-"]{{animation:none!important;opacity:1!important;transform:none!important;stroke-dashoffset:0!important}}}}')
    return '\n'.join(css)


def keyframe_block(name, stops):
    merged = {}  # un solo bloque por porcentaje; el ultimo declarado manda
    for p, props, ease in stops:
        merged[p] = (props, ease or merged.get(p, (None, None))[1])
    rows = []
    for p in sorted(merged):
        props, ease = merged[p]
        e = f';animation-timing-function:{ease}' if ease else ''
        rows.append(f'{p}%{{{props}{e}}}')
    return f'@keyframes {name}{{{"".join(rows)}}}'


def player_css(pid, effects):
    """CSS del player: estados ocultos por efecto; el JS agrega/quita la clase dk-off segun el paso."""
    css = [f'#{pid} .dkw{{transform-box:fill-box;transform-origin:center;transition:opacity .55s ease,transform .55s cubic-bezier(.2,.8,.2,1)}}']
    seen = set()
    for e in effects:
        c = e['cls']
        if c in seen:
            continue
        seen.add(c)
        group = [i for i in effects if i['cls'] == c]
        appear = next((i for i in group if i['fx'] in HIDDEN), None)
        if appear:
            css.append(f'#{pid} .{c}.dk-off{{{HIDDEN[appear["fx"]]}}}')
        if any(i['fx'] == 'draw' for i in group):
            css.append(f'#{pid} .{c}{{stroke-dasharray:1;transition:stroke-dashoffset .8s ease}} #{pid} .{c}.dk-off{{stroke-dashoffset:1}}')
        if any(i['fx'] == 'flow' for i in group):
            css.append(f'#{pid} .{c}{{stroke-dasharray:10 8;animation:dk{pid}-flow 1s linear infinite}}')
    css.append(f'#{pid} .dk-pulse{{animation:dk{pid}-pulse .9s ease-in-out}}')
    css.append(f'@keyframes dk{pid}-pulse{{50%{{transform:scale(1.14)}}}}')
    css.append(f'@keyframes dk{pid}-flow{{to{{stroke-dashoffset:-18}}}}')
    css.append(f'@media (prefers-reduced-motion:reduce){{#{pid} *{{transition:none!important;animation:none!important}}}}')
    return '\n'.join(css)


def set_style(root, css):
    style = ET.Element(f'{{{SVG_NS}}}style')
    style.text = '\n' + css + '\n'
    root.insert(0, style)


def ensure_root_id(root, pid):
    root.set('id', pid)
    # los ids internos (marker, filter...) llevan el prefijo para no chocar con otras figuras en la misma pagina
    ids = {e.get('id'): f'{pid}-{e.get("id")}' for e in root.iter() if e.get('id') and e is not root}
    for e in root.iter():
        for k, v in list(e.attrib.items()):
            if k == 'id' and e is not root:
                e.set('id', ids[v])
            else:
                for old, new in ids.items():
                    if f'url(#{old})' in v:
                        e.set(k, v.replace(f'url(#{old})', f'url(#{new})'))
                    if k.endswith('href') and v == f'#{old}':
                        e.set(k, f'#{new}')


def to_string(root):
    return ET.tostring(root, encoding='unicode')


PLAYER_HTML = """<!doctype html>
<html lang="es"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1">
<title>__TITLE__</title>
__KITLINKS__
<style>
/* Colores = tokens del kit (dk-base.css, claro/oscuro); los valores de respaldo son el tema claro si el kit no carga. */
*{box-sizing:border-box}
body{margin:0;background:transparent;font:15px/1.5 system-ui,'Segoe UI',Roboto,sans-serif;color:var(--dk-ink,#1C1B1F)}
.dkp{max-width:960px;margin:0 auto;background:var(--dk-card,#fff);border:1px solid var(--dk-line,#E3E3EA);border-radius:16px;padding:16px}
/* El SVG original trae colores fijos de tema claro: se muestra sobre un panel claro tambien en tema oscuro. */
.dkp .fig{background:#fff;border-radius:10px;padding:8px}
.dkp .fig svg{display:block;width:100%;height:auto}
.dkp .cap{min-height:64px;margin:12px 4px 4px}
.dkp .cap b{display:block;font-size:13px;letter-spacing:.04em;text-transform:uppercase;color:var(--dk-ctl,#5454e9);margin-bottom:2px}
.dkp .bar{display:flex;flex-wrap:wrap;gap:8px;align-items:center;justify-content:space-between;margin-top:8px}
.dkp .dots{display:flex;gap:6px}
.dkp .dots button{width:12px;height:12px;border-radius:50%;border:1px solid var(--dk-ctl,#5454e9);background:var(--dk-card,#fff);padding:0;cursor:pointer}
.dkp .dots button.on{background:var(--dk-ctl,#5454e9)}
.dkp .dots button.past{background:var(--dk-chip,#e8e8fc)}
.dkp .ctl{display:flex;gap:8px}
.dkp .ctl button{font:600 13px system-ui,sans-serif;border:1px solid var(--dk-ctl,#5454e9);background:transparent;color:var(--dk-ctl,#5454e9);border-radius:20px;padding:6px 14px;cursor:pointer}
.dkp .ctl button.solid{background:var(--dk-ctl,#5454e9);color:var(--dk-card,#fff)}
.dkp .ctl button:disabled{opacity:.45;cursor:default}
</style></head><body>
<div class="dkp" id="dkp">
  <div class="fig">__SVG__</div>
  <div class="cap" aria-live="polite"><b id="dkt"></b><span id="dkc"></span></div>
  <div class="bar"><div class="dots" id="dkd" aria-label="Pasos"></div>
    <div class="ctl"><button id="prev">Anterior</button><button id="play" class="solid">Reproducir</button><button id="next">Siguiente</button><button id="reset">Reiniciar</button></div></div>
</div>
<script>
(function(){
  var STEPS=__STEPS__, PID="__PID__";
  var root=document.getElementById(PID), cur=-1, timer=null;
  var nodes=[].slice.call(root.querySelectorAll('[data-dk-step]'));
  var dots=document.getElementById('dkd');
  STEPS.forEach(function(s,i){var b=document.createElement('button');b.title=s.title||('Paso '+(i+1));b.onclick=function(){stop();go(i)};dots.appendChild(b)});
  function go(n){
    cur=Math.max(-1,Math.min(STEPS.length-1,n));
    nodes.forEach(function(el){
      var on=Number(el.getAttribute('data-dk-step'))<=cur;
      el.classList.toggle('dk-off',!on);
    });
    (STEPS[cur]&&STEPS[cur].pulse||[]).forEach(function(c){var el=root.querySelector('.'+c);if(el){el.classList.remove('dk-pulse');void el.getBoundingClientRect();el.classList.add('dk-pulse')}});
    document.getElementById('dkt').textContent=cur<0?'':(STEPS[cur].title||'Paso '+(cur+1)+' de '+STEPS.length);
    document.getElementById('dkc').textContent=cur<0?'Pulsa Siguiente o Reproducir para ver el diagrama paso a paso.':STEPS[cur].caption;
    [].forEach.call(dots.children,function(b,i){b.className=i===cur?'on':(i<cur?'past':'')});
    document.getElementById('prev').disabled=cur<0;
    document.getElementById('next').disabled=cur>=STEPS.length-1;
  }
  function stop(){if(timer){clearTimeout(timer);timer=null}document.getElementById('play').textContent='Reproducir'}
  function play(){
    document.getElementById('play').textContent='Pausar';
    (function tick(){
      if(cur>=STEPS.length-1){stop();return}
      go(cur+1);timer=setTimeout(tick,(STEPS[cur].dwell||2.6)*1000);
    })();
  }
  document.getElementById('prev').onclick=function(){stop();go(cur-1)};
  document.getElementById('next').onclick=function(){stop();go(cur+1)};
  document.getElementById('reset').onclick=function(){stop();go(-1)};
  document.getElementById('play').onclick=function(){if(timer){stop()}else{if(cur>=STEPS.length-1)go(-1);play()}};
  document.addEventListener('keydown',function(e){if(e.key==='ArrowRight'){stop();go(cur+1)}if(e.key==='ArrowLeft'){stop();go(cur-1)}});
  go(-1);
})();
</script></body></html>
"""


def kit_links(out_dir, explicit=None):
    """Etiquetas <link>/<script> del kit (dk-base.css, dk-theme.js) con la ruta relativa desde out_dir.
    Sube por los padres de out_dir buscando static/interactive/_shared; si no lo encuentra, devuelve ''
    y el player usa los valores de respaldo (tema claro)."""
    import os
    base = explicit
    if base is None:
        d = os.path.abspath(out_dir)
        while True:
            cand = os.path.join(d, 'static', 'interactive', '_shared')
            if os.path.isdir(cand):
                base = os.path.relpath(cand, os.path.abspath(out_dir)).replace(os.sep, '/')
                break
            parent = os.path.dirname(d)
            if parent == d:
                break
            d = parent
    if not base:
        return ''
    return (f'<link rel="stylesheet" href="{base}/dk-base.css">\n'
            "<script>if(window.parent===window)document.documentElement.classList.add('solo')</script>\n"
            f'<script src="{base}/dk-theme.js"></script>')


def cmd_inspect(args):
    root = parse(args.svg)
    print(f'<svg> viewBox={root.get("viewBox")}')
    n = 0
    for el, depth in walk(root):
        if el.tag is ET.Comment:
            print(f'{"  " * depth}-- {el.text.strip()} --')
            continue
        n += 1
        attrs = ' '.join(f'{k}={v!r}' for k, v in el.attrib.items() if k in ('id', 'class', 'x', 'y', 'cx', 'cy', 'r', 'transform', 'fill', 'stroke'))
        txt = text_of(el)
        txt = f'  "{txt[:50]}"' if txt and local(el.tag) == 'text' else ''
        print(f'{"  " * depth}@{n} <{local(el.tag)}> {attrs}{txt}')


def cmd_build(args):
    import os
    spec = json.load(open(args.spec, encoding='utf-8'))
    pid = prefix_of(spec)
    stem = os.path.splitext(os.path.basename(args.svg))[0]  # el nombre del original, para emparejarlos
    os.makedirs(args.out, exist_ok=True)
    loop = spec.get('loop', True)
    tail = float(spec.get('tail', 2.4))

    # --- SVG autoplay ---
    root = parse(args.svg)
    effects, steps, total = plan(root, spec)
    prepare(root, effects, pid)
    set_style(root, keyframes_css(pid, effects, total, loop, tail))
    ensure_root_id(root, pid)
    svg_path = os.path.join(args.out, f'{stem}.animated.svg')
    open(svg_path, 'w', encoding='utf-8').write(to_string(root))

    # --- Player ---
    root = parse(args.svg)
    effects, steps, total = plan(root, spec)
    prepare(root, effects, pid)
    for e in effects:
        target = e.get('wrapper') if e.get('wrapper') is not None else e['el']
        if e['fx'] in HIDDEN or e['fx'] == 'draw':
            cur = target.get('data-dk-step')
            if cur is None or int(cur) > e['step']:
                target.set('data-dk-step', str(e['step']))
            if 'dk-off' not in (target.get('class') or ''):
                target.set('class', (target.get('class', '') + ' dk-off').strip())
    set_style(root, player_css(pid, effects))
    ensure_root_id(root, pid)
    js_steps = []
    for si, s in enumerate(steps):
        js_steps.append({'title': s['title'], 'caption': s['caption'], 'dwell': s['dwell'], 'pulse': [e['cls'] for e in effects if e['step'] == si and e['fx'] == 'pulse']})
    html = (PLAYER_HTML.replace('__TITLE__', spec.get('title', pid)).replace('__SVG__', to_string(root))
            .replace('__STEPS__', json.dumps(js_steps, ensure_ascii=False)).replace('__PID__', pid)
            .replace('__KITLINKS__', kit_links(args.out, args.kit)))
    player_path = os.path.join(args.out, f'{stem}.player.html')
    open(player_path, 'w', encoding='utf-8').write(html)

    print(f'Ciclo autoplay: {total + (tail if loop else 0):.1f}s, {len(steps)} pasos, {len(effects)} efectos')
    print(svg_path)
    print(player_path)


def main():
    if hasattr(sys.stdout, 'reconfigure'):
        sys.stdout.reconfigure(encoding='utf-8')
    ap = argparse.ArgumentParser(description=__doc__, formatter_class=argparse.RawDescriptionHelpFormatter)
    sub = ap.add_subparsers(dest='cmd', required=True)
    p = sub.add_parser('inspect')
    p.add_argument('svg')
    p.set_defaults(fn=cmd_inspect)
    p = sub.add_parser('build')
    p.add_argument('svg')
    p.add_argument('spec')
    p.add_argument('-o', '--out', required=True)
    p.add_argument('--kit', default=None, help='ruta (URL relativa) a static/interactive/_shared; por defecto se busca subiendo desde --out')
    p.set_defaults(fn=cmd_build)
    args = ap.parse_args()
    args.fn(args)


if __name__ == '__main__':
    sys.exit(main())
