#!/usr/bin/env node
// Crea una pieza nueva a partir de una plantilla, con las rutas al kit ya calculadas.
//
//   node <skill>/host/new-piece.mjs <plantilla> <carpeta-destino> [--kit-dir static/interactive/_shared]
//
//   plantilla: piece (secuencia por fases) | piece-canvas (escena libre) | piece-phone (simulador de app movil)
//   destino:   carpeta de la pieza, por ejemplo static/interactive/mi-curso/semana-1/mi-pieza
//
// Copia templates/<plantilla>/index.html al destino y reemplaza las rutas "../../../_shared/" por la ruta relativa
// real entre la pieza y el kit (las plantillas asumen la profundidad <curso>/<semana>/<pieza>/).
import { existsSync, mkdirSync, readFileSync, readdirSync, writeFileSync } from 'node:fs';
import { dirname, join, relative, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const SKILL = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const args = process.argv.slice(2);
const kIdx = args.indexOf('--kit-dir');
const kitDir = resolve(process.cwd(), kIdx >= 0 ? args[kIdx + 1] : 'static/interactive/_shared');
const pos = args.filter((a, i) => !a.startsWith('--') && (kIdx < 0 || i !== kIdx + 1));
const [template, destArg] = pos;

const available = readdirSync(join(SKILL, 'templates'));
if (!template || !destArg || !available.includes(template)) {
  console.error(`Uso: node new-piece.mjs <${available.join('|')}> <carpeta-destino> [--kit-dir <ruta>]`);
  process.exit(2);
}
const dest = resolve(process.cwd(), destArg);
const out = join(dest, 'index.html');
if (existsSync(out)) { console.error(`Ya existe ${out}. No la sobrescribo.`); process.exit(1); }
if (!existsSync(join(kitDir, 'dk-kit.js'))) { console.error(`No encuentro el kit en ${kitDir}. Instalalo con host/install.mjs.`); process.exit(1); }

let rel = relative(dest, kitDir).split('\\').join('/');
if (!rel.startsWith('.')) rel = './' + rel;
const html = readFileSync(join(SKILL, 'templates', template, 'index.html'), 'utf8').replace(/\.\.\/\.\.\/\.\.\/_shared/g, rel);
mkdirSync(dest, { recursive: true });
writeFileSync(out, html);
console.log(`Creada ${relative(process.cwd(), out)} (kit en ${rel}). Cambia solo los datos: actores, fases, pasos y textos.`);
