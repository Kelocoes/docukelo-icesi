#!/usr/bin/env node
// Instala o sincroniza la skill de graficos interactivos en un proyecto.
//
//   node <skill>/host/install.mjs                 instala o sincroniza (corre desde la raiz del proyecto)
//   node <skill>/host/install.mjs --check         no copia nada: sale con 1 si alguna copia no coincide con la skill
//
// Que instala:
//   kit      <skill>/kit/*                     -> static/interactive/_shared/        (siempre se sincroniza: es una copia generada)
//   frame    <skill>/host/InteractiveFrame/*   -> src/components/InteractiveFrame/   (solo Docusaurus; si ya existe y difiere, no se toca)
//   tests    <skill>/host/test-pieces.mjs      -> scripts/test-pieces.mjs            (si ya existe y difiere, no se toca)
//
// Opciones:
//   --kit-dir <ruta>      otro destino del kit (por defecto static/interactive/_shared)
//   --frame-dir <ruta>    otro destino de InteractiveFrame; --no-frame lo omite (sitios que no son Docusaurus)
//   --tests-file <ruta>   otro destino de la prueba de humo; --no-tests la omite
//   --npm-scripts         agrega al package.json los scripts kit:sync, kit:check y test:pieces (si faltan)
//   --force               sobrescribe frame y tests aunque difieran
//
// Solo usa la biblioteca estandar de Node 18+.
import { existsSync, mkdirSync, readFileSync, readdirSync, writeFileSync, rmSync, statSync } from 'node:fs';
import { dirname, join, relative, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const HOST = dirname(fileURLToPath(import.meta.url));
const SKILL = resolve(HOST, '..');
const args = process.argv.slice(2);
const flag = (n) => args.includes(n);
const opt = (n, d) => { const i = args.indexOf(n); return i >= 0 && args[i + 1] ? args[i + 1] : d; };

const CHECK = flag('--check');
const FORCE = flag('--force');
const cwd = process.cwd();
const kitDir = resolve(cwd, opt('--kit-dir', 'static/interactive/_shared'));
const frameDir = resolve(cwd, opt('--frame-dir', 'src/components/InteractiveFrame'));
const testsFile = resolve(cwd, opt('--tests-file', 'scripts/test-pieces.mjs'));

const norm = (buf) => buf.toString('utf8').replace(/\r\n/g, '\n');
const same = (a, b) => existsSync(a) && existsSync(b) && norm(readFileSync(a)) === norm(readFileSync(b));
const rel = (p) => relative(cwd, p).split('\\').join('/');
let differs = 0;

function copyFile(from, to) {
  mkdirSync(dirname(to), { recursive: true });
  writeFileSync(to, norm(readFileSync(from)));
}

// ---- kit: copia exacta (tambien borra los dk-* que ya no existen en la skill)
function syncKit() {
  const src = join(SKILL, 'kit');
  const files = readdirSync(src).filter((f) => statSync(join(src, f)).isFile());
  let changed = 0;
  for (const f of files) {
    const to = join(kitDir, f);
    if (same(join(src, f), to)) continue;
    changed++;
    if (CHECK) console.log(`  difiere: ${rel(to)}`);
    else copyFile(join(src, f), to);
  }
  if (existsSync(kitDir)) {
    for (const f of readdirSync(kitDir)) {
      if (/^dk-/.test(f) && !files.includes(f)) {
        changed++;
        if (CHECK) console.log(`  sobra: ${rel(join(kitDir, f))}`);
        else rmSync(join(kitDir, f));
      }
    }
  }
  console.log(`kit     ${rel(kitDir)}: ${changed ? (CHECK ? changed + ' archivo(s) no coinciden' : changed + ' archivo(s) actualizados') : 'al dia'} (${files.length} archivos)`);
  differs += changed;
}

// ---- piezas del anfitrion: se instalan si faltan; si existen y difieren, solo se avisa (pueden estar personalizadas)
function syncOne(label, files, destOf) {
  let installed = 0, ok = 0, skipped = 0;
  for (const f of files) {
    const from = f.from, to = destOf(f);
    if (!existsSync(to)) {
      installed++;
      if (CHECK) console.log(`  falta: ${rel(to)}`);
      else copyFile(from, to);
    } else if (same(from, to)) ok++;
    else if (FORCE && !CHECK) { copyFile(from, to); installed++; }
    else { skipped++; console.log(`  difiere (personalizado?): ${rel(to)}${CHECK ? '' : '. Usa --force para sobrescribir'}`); }
  }
  console.log(`${label.padEnd(7)} ${installed ? (CHECK ? installed + ' faltan' : installed + ' instalado(s)') : 'sin cambios'}${ok ? `, ${ok} al dia` : ''}${skipped ? `, ${skipped} distinto(s)` : ''}`);
  if (CHECK) differs += installed + skipped;
}

console.log(`Skill: ${SKILL}\nProyecto: ${cwd}\n`);
syncKit();

if (!flag('--no-frame')) {
  const dir = join(HOST, 'InteractiveFrame');
  syncOne('frame', readdirSync(dir).map((n) => ({ from: join(dir, n), name: n })), (f) => join(frameDir, f.name));
}
if (!flag('--no-tests')) {
  syncOne('tests', [{ from: join(HOST, 'test-pieces.mjs') }], () => testsFile);
}

// ---- scripts de npm
if (flag('--npm-scripts') && !CHECK) {
  const pkgPath = join(cwd, 'package.json');
  if (!existsSync(pkgPath)) console.log('package.json: no existe; omito los scripts de npm');
  else {
    const pkg = JSON.parse(readFileSync(pkgPath, 'utf8'));
    pkg.scripts = pkg.scripts || {};
    const me = rel(join(HOST, 'install.mjs'));
    const want = {
      'kit:sync': `node ${me}`,
      'kit:check': `node ${me} --check`,
      'test:pieces': `node ${rel(testsFile)}`,
    };
    const added = [];
    for (const [k, v] of Object.entries(want)) if (!pkg.scripts[k]) { pkg.scripts[k] = v; added.push(k); }
    if (added.length) writeFileSync(pkgPath, JSON.stringify(pkg, null, 2) + '\n');
    console.log(`npm     scripts agregados: ${added.join(', ') || 'ninguno (ya existian)'}`);
  }
}

if (CHECK) {
  if (differs) { console.log(`\nLas copias del proyecto no coinciden con la skill. Corre: node ${rel(join(HOST, 'install.mjs'))}`); process.exit(1); }
  console.log('\nTodo coincide con la skill.');
} else {
  const pkgPath = join(cwd, 'package.json');
  const deps = existsSync(pkgPath) ? (() => { const p = JSON.parse(readFileSync(pkgPath, 'utf8')); return { ...p.dependencies, ...p.devDependencies }; })() : {};
  console.log('\nListo. Pendiente en el proyecto anfitrion (ver references/host-integration.md):');
  console.log('  - Servir la carpeta del kit como archivos estaticos (en Docusaurus: static/).');
  if (!flag('--no-frame')) console.log('  - Registrar InteractiveFrame como componente MDX global (src/theme/MDXComponents.js).');
  if (!flag('--no-tests') && !deps['playwright-core']) console.log('  - npm install -D playwright-core   (lo usa la prueba de humo)');
}
