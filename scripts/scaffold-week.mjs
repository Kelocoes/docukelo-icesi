#!/usr/bin/env node
// Crea la estructura de una semana nueva de un curso: carpeta, _category_.json, un documento por
// tema (NN-kebab-case.md con frontmatter y secciones base) y, opcionalmente, la pagina de slides.
// Respeta las reglas de la guia (.agents/memory/docusaurus-guidelines.md), asi que `npm run lint:docs`
// pasa sobre lo generado. No toca documentos existentes: si la semana ya existe, se detiene.
//
// Uso:
//   npm run scaffold-week -- --course computacion-2 --week 17 --topics "Tema uno, Tema dos"
//   npm run scaffold-week -- --course computacion-3 --week 13 --label "Next.js avanzado" --topics "Rutas, Datos" --slides
//   npm run scaffold-week -- ... --dry-run     solo muestra lo que crearia
//
// Opciones:
//   --course <carpeta>   curso dentro de docs/ (obligatorio)
//   --week <n>           numero de semana (obligatorio)
//   --topics "a, b, c"   titulos de los documentos, separados por coma (obligatorio)
//   --label "texto"      nombre de la semana en el menu (por defecto, el primer tema)
//   --slides             agrega un ultimo documento "Slides de la semana" con <PdfViewer>
//   --dry-run            no escribe archivos
//
// La traduccion al ingles (i18n/en) no se crea aqui: se hace despues, con el mismo nombre de archivo,
// y el linter (`i18n-orphan`, `i18n-position`) avisa si algo no coincide.

import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const REPO_ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');

function fail(message) {
    console.error('scaffold-week: ' + message);
    process.exit(1);
}

function parseArgs(argv) {
    const args = { flags: new Set() };
    for (let i = 0; i < argv.length; i += 1) {
        const arg = argv[i];
        if (!arg.startsWith('--')) fail(`argumento inesperado "${arg}"`);
        const name = arg.slice(2);
        if (['slides', 'dry-run'].includes(name)) {
            args.flags.add(name);
        } else {
            // El valor son todas las palabras hasta la siguiente opcion: asi funciona aunque la
            // consola (npm en Windows) pierda las comillas de "Tema uno, Tema dos".
            const words = [];
            while (i + 1 < argv.length && !argv[i + 1].startsWith('--')) {
                words.push(argv[i + 1]);
                i += 1;
            }
            if (words.length === 0) fail(`falta el valor de --${name}`);
            args[name] = words.join(' ');
        }
    }
    return args;
}

function slugify(text) {
    return text
        .normalize('NFKD')
        .replace(/[̀-ͯ]/g, '')
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/^-+|-+$/g, '');
}

function readJson(file) {
    try {
        return JSON.parse(fs.readFileSync(file, 'utf8').replace(/^﻿/, ''));
    } catch {
        return null;
    }
}

function nextCategoryPosition(courseDir) {
    let max = 1; // las semanas empiezan en 2 (la posicion 1 es de intro.md)
    for (const entry of fs.readdirSync(courseDir, { withFileTypes: true })) {
        if (!entry.isDirectory()) continue;
        const position = readJson(path.join(courseDir, entry.name, '_category_.json'))?.position;
        if (Number.isInteger(position)) max = Math.max(max, position);
    }
    return max + 1;
}

function lessonTemplate({ title, week, order }) {
    return `---
sidebar_position: ${order}
description: "Guía de la semana ${week} sobre ${title.replace(/"/g, "'")}."
---

# ${title}

Presenta el tema en un par de párrafos: qué problema resuelve, por qué importa y qué va a poder hacer el estudiante al terminar.

## Conceptos

Explica primero el porqué y la idea general, apoyándote en un diagrama cuando el tema tenga flujo, capas o actores. Después de cada diagrama, describe qué representa cada parte.

## Guía práctica

<StepByStep>
  <Step number="1" title="Primer paso">
    Describe la acción y su resultado esperado.
  </Step>
  <Step number="2" title="Segundo paso">
    Describe la acción y su resultado esperado.
  </Step>
</StepByStep>

## Resumen

- Idea clave 1.
- Idea clave 2.
`;
}

function slidesTemplate({ course, week, order }) {
    return `---
sidebar_position: ${order}
description: "Consulta las diapositivas oficiales de la semana ${week}."
---

# Slides de la semana

Diapositivas oficiales correspondientes a la Semana ${week}.

<PdfViewer
  src="/files/${course}/semana-${week}/semana-${week}.pdf"
  title="Semana ${week}"
/>
`;
}

const args = parseArgs(process.argv.slice(2));
const course = args.course ?? fail('falta --course');
const week = Number(args.week);
if (!Number.isInteger(week) || week < 1) fail('--week debe ser un numero entero positivo');
const topics = (args.topics ?? fail('falta --topics'))
    .split(',')
    .map((t) => t.trim())
    .filter(Boolean);
if (topics.length === 0) fail('--topics no tiene ningun tema');

const courseDir = path.join(REPO_ROOT, 'docs', course);
if (!fs.existsSync(courseDir)) fail(`no existe docs/${course}`);
const weekDir = path.join(courseDir, `semana-${week}`);
if (fs.existsSync(weekDir)) fail(`docs/${course}/semana-${week} ya existe; no se sobrescribe nada`);

const label = args.label ?? topics[0];
const files = new Map();
files.set(
    '_category_.json',
    JSON.stringify(
        {
            label: `S${week} - ${label}`,
            position: nextCategoryPosition(courseDir),
            link: { type: 'generated-index', description: `Contenido de la semana ${week}: ${topics.join(', ')}.` },
        },
        null,
        4,
    ) + '\n',
);
topics.forEach((topic, index) => {
    const order = index + 1;
    const name = `${String(order).padStart(2, '0')}-${slugify(topic)}.md`;
    files.set(name, lessonTemplate({ title: topic, week, order }));
});
if (args.flags.has('slides')) {
    const order = topics.length + 1;
    files.set(`${String(order).padStart(2, '0')}-slides.md`, slidesTemplate({ course, week, order }));
}

const dryRun = args.flags.has('dry-run');
console.log(`${dryRun ? '[simulacion] ' : ''}Semana ${week} de ${course}:`);
if (!dryRun) fs.mkdirSync(weekDir, { recursive: true });
for (const [name, content] of files) {
    console.log(`  docs/${course}/semana-${week}/${name}`);
    if (!dryRun) fs.writeFileSync(path.join(weekDir, name), content, 'utf8');
}
if (args.flags.has('slides') && !dryRun) {
    const filesDir = path.join(REPO_ROOT, 'static', 'files', course, `semana-${week}`);
    fs.mkdirSync(filesDir, { recursive: true });
    console.log(`  static/files/${course}/semana-${week}/   (deja aqui el PDF de las slides)`);
}
console.log(
    `\nSiguientes pasos: completa los documentos, valida con "npm run lint:docs -- --path=docs/${course}/semana-${week}/" ` +
        'y traduce a i18n/en con la misma ruta y nombre cuando corresponda.',
);
