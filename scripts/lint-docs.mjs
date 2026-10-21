#!/usr/bin/env node
// Linter de las reglas de escritura de DocuKelo (.agents/memory/docusaurus-guidelines.md).
// No tiene dependencias: lee los .md/.mdx de docs/ y de i18n/en/ y reporta lo que incumple.
//
// Uso:
//   npm run lint:docs                      resumen por regla y por curso (siempre termina con codigo 0)
//   npm run lint:docs -- --verbose         ademas, cada incumplimiento con archivo:linea
//   npm run lint:docs -- --rule=code-title solo esa regla (se puede repetir)
//   npm run lint:docs -- --changed         solo archivos modificados o nuevos segun git
//   npm run lint:docs -- --path=docs/flutter  solo archivos cuya ruta empiece asi (se puede repetir)
//   npm run lint:docs -- --check           falla (codigo 1) si algun archivo EMPEORA frente a la linea base
//   npm run lint:docs -- --update-baseline guarda el estado actual como linea base
//   npm run lint:docs -- --json            salida en JSON
//
// La linea base (scripts/lint-docs.baseline.json) permite adoptar el linter sin arreglar todo el
// contenido antiguo: lo existente se tolera, lo nuevo debe nacer limpio.

import { execFileSync } from 'node:child_process';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const REPO_ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const BASELINE_FILE = path.join(REPO_ROOT, 'scripts', 'lint-docs.baseline.json');
const ROOTS = ['docs', 'i18n/en/docusaurus-plugin-content-docs/current'];

// Bloques de shell de hasta N lineas se consideran comandos sueltos y no necesitan title=
const SHORT_SHELL_MAX_LINES = 3;
const SHELL_LANGS = new Set(['bash', 'sh', 'shell', 'zsh', 'powershell', 'ps1', 'cmd', 'bat', 'console']);
const NO_TITLE_LANGS = new Set(['mermaid', 'text', 'txt', 'plaintext', 'output', 'diff']);

const LESSON_NAME = /^\d{2}-[a-z0-9]+(-[a-z0-9]+)*\.mdx?$/;
// Emoji "reales" (presentacion de emoji o simbolo con selector de variacion). No incluye simbolos
// tipograficos como flechas, check mark o estrellas de texto.
const EMOJI = /\p{Emoji_Presentation}|\p{Extended_Pictographic}️/u;

const RULES = {
    'file-name': { severity: 'error', text: 'El archivo debe llamarse NN-kebab-case.md (intro.md es la unica excepcion)' },
    'missing-h1': { severity: 'error', text: 'El documento no tiene un titulo H1 (# ...)' },
    'missing-description': { severity: 'warn', text: 'Falta description: en el frontmatter' },
    'code-title': { severity: 'warn', text: 'Bloque de codigo sin title="..."' },
    'image-alt': { severity: 'error', text: 'Imagen sin texto alternativo (alt)' },
    emoji: { severity: 'error', text: 'Emoji en el contenido (prohibido por la guia)' },
    'inline-svg': { severity: 'error', text: 'SVG embebido en el documento; guardalo en static/img/<curso>/' },
    'admonition-title': { severity: 'error', text: 'Titulo de admonition sin corchetes; usa :::tipo[Titulo]' },
    'i18n-orphan': { severity: 'error', text: 'Traduccion en i18n/en sin original en docs/ (misma ruta y nombre)' },
    'i18n-position': { severity: 'error', text: 'sidebar_position o category (position/key) distinto entre original y traduccion' },
};

function toPosix(p) {
    return p.split(path.sep).join('/');
}

function listLessonFiles() {
    const files = [];
    const walk = (dir) => {
        for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
            const full = path.join(dir, entry.name);
            if (entry.isDirectory()) {
                walk(full);
            } else if (/\.mdx?$/.test(entry.name) && !entry.name.startsWith('_')) {
                files.push(toPosix(path.relative(REPO_ROOT, full)));
            }
        }
    };
    for (const root of ROOTS) {
        const abs = path.join(REPO_ROOT, root);
        if (fs.existsSync(abs)) walk(abs);
    }
    return files.sort();
}

function courseOf(file) {
    if (file.startsWith('docs/')) {
        const parts = file.split('/');
        return parts.length > 2 ? parts[1] : '(raiz)';
    }
    return 'en/' + file.slice(ROOTS[1].length + 1).split('/')[0];
}

function lintText(file, text) {
    const issues = [];
    const add = (rule, line, detail = '') => issues.push({ file, rule, line, detail });

    const name = path.posix.basename(file);
    const stem = name.replace(/\.mdx?$/, '');
    if (stem !== 'intro' && !LESSON_NAME.test(name)) add('file-name', 1, name);

    const lines = text.replace(/\r\n/g, '\n').split('\n');
    let i = 0;
    let hasDescription = false;
    if (lines[0] === '---') {
        const end = lines.indexOf('---', 1);
        if (end > 0) {
            hasDescription = lines.slice(1, end).some((l) => /^description:\s*\S/.test(l));
            i = end + 1;
        }
    }
    if (!hasDescription) add('missing-description', 1);

    let hasH1 = false;
    let fence = null; // { char, len, lang, hasTitle, startLine, bodyLines }
    for (; i < lines.length; i++) {
        const line = lines[i];
        const n = i + 1;

        const fenceMatch = line.match(/^\s*(`{3,}|~{3,})\s*([\w+#.-]*)(.*)$/);
        if (fence) {
            const closes =
                fenceMatch &&
                fenceMatch[1][0] === fence.char &&
                fenceMatch[1].length >= fence.len &&
                fenceMatch[2] === '' &&
                fenceMatch[3].trim() === '';
            if (closes) {
                const lang = fence.lang.toLowerCase();
                const needsTitle =
                    lang &&
                    !fence.hasTitle &&
                    !NO_TITLE_LANGS.has(lang) &&
                    !(SHELL_LANGS.has(lang) && fence.bodyLines <= SHORT_SHELL_MAX_LINES);
                if (needsTitle) add('code-title', fence.startLine, lang);
                fence = null;
            } else if (line.trim() !== '') {
                fence.bodyLines++;
            }
            continue;
        }
        if (fenceMatch) {
            fence = {
                char: fenceMatch[1][0],
                len: fenceMatch[1].length,
                lang: fenceMatch[2],
                hasTitle: /\btitle\s*=/.test(fenceMatch[3]),
                startLine: n,
                bodyLines: 0,
            };
            continue;
        }

        // A partir de aqui: prosa (fuera de bloques de codigo)
        if (/^#\s+\S/.test(line)) hasH1 = true;

        if (EMOJI.test(line)) add('emoji', n, line.trim().slice(0, 60));
        if (/<svg[\s>]/i.test(line)) add('inline-svg', n);
        if (/^\s*:::[a-z]+\s+[^[\s{]/i.test(line)) add('admonition-title', n, line.trim());
        if (/!\[\s*\]\(/.test(line)) add('image-alt', n, 'markdown ![](...)');

        if (/<img\b/i.test(line)) {
            // la etiqueta puede ocupar varias lineas
            let tag = line.slice(line.search(/<img\b/i));
            let j = i;
            while (!tag.includes('>') && j < lines.length - 1 && j - i < 12) tag += '\n' + lines[++j];
            if (!/\balt\s*=/.test(tag)) add('image-alt', n, '<img> sin alt');
        }
    }
    if (!hasH1) add('missing-h1', 1);
    return issues;
}

// Paridad entre docs/ (espanol) e i18n/en/ (ingles): misma ruta, mismo sidebar_position y categorias iguales.
const EN_ROOT = ROOTS[1];

function esTwin(enFile) {
    return 'docs/' + enFile.slice(EN_ROOT.length + 1);
}

function sidebarPositionOf(text) {
    const m = text.replace(/^\uFEFF/, '').match(/^---\r?\n([\s\S]*?)\r?\n---/);
    const p = m && m[1].match(/^sidebar_position:\s*(\d+)/m);
    return p ? Number(p[1]) : null;
}

function readJson(rel) {
    try {
        return JSON.parse(fs.readFileSync(path.join(REPO_ROOT, rel), 'utf8').replace(/^\uFEFF/, ''));
    } catch {
        return null;
    }
}

function lintI18nParity(files) {
    const issues = [];
    const exists = (rel) => fs.existsSync(path.join(REPO_ROOT, rel));
    const enDocs = files.filter((f) => f.startsWith(EN_ROOT + '/'));
    for (const file of enDocs) {
        const twin = esTwin(file);
        if (!exists(twin)) {
            issues.push({ file, rule: 'i18n-orphan', line: 1, detail: 'falta ' + twin });
            continue;
        }
        const a = sidebarPositionOf(fs.readFileSync(path.join(REPO_ROOT, twin), 'utf8'));
        const b = sidebarPositionOf(fs.readFileSync(path.join(REPO_ROOT, file), 'utf8'));
        if (a !== b) issues.push({ file, rule: 'i18n-position', line: 1, detail: `sidebar_position es=${a} en=${b}` });
    }
    // categorias: las de ingles deben tener original con la misma position/key, y las carpetas con
    // documentos en ingles deben tener su _category_.json si el original lo tiene
    const dirs = new Set(enDocs.map((f) => path.posix.dirname(f)));
    for (const dir of dirs) {
        const enCat = dir + '/_category_.json';
        const esCat = esTwin(enCat);
        if (!exists(enCat)) {
            if (exists(esCat)) issues.push({ file: enCat, rule: 'i18n-position', line: 1, detail: 'falta _category_.json en ingles' });
            continue;
        }
        const en = readJson(enCat);
        const es = exists(esCat) ? readJson(esCat) : null;
        if (!es) {
            issues.push({ file: enCat, rule: 'i18n-orphan', line: 1, detail: 'categoria sin original en espanol' });
        } else if (es.position !== en?.position || es.key !== en?.key) {
            issues.push({ file: enCat, rule: 'i18n-position', line: 1, detail: `category position es=${es.position} en=${en?.position}, key es=${es.key} en=${en?.key}` });
        }
    }
    return issues;
}

function changedFiles() {
    const run = (args) => execFileSync('git', args, { cwd: REPO_ROOT, encoding: 'utf8' }).split('\n').filter(Boolean);
    const set = new Set([
        ...run(['diff', '--name-only', '--diff-filter=ACMR', 'HEAD']),
        ...run(['ls-files', '--others', '--exclude-standard']),
    ]);
    return set;
}

function countByFileRule(issues) {
    const out = {};
    for (const { file, rule } of issues) {
        out[file] ??= {};
        out[file][rule] = (out[file][rule] ?? 0) + 1;
    }
    return out;
}

function main() {
    const args = process.argv.slice(2);
    const flag = (f) => args.includes(f);
    const onlyRules = args.filter((a) => a.startsWith('--rule=')).map((a) => a.slice(7));

    const onlyPaths = args.filter((a) => a.startsWith('--path=')).map((a) => a.slice(7));
    let files = listLessonFiles();
    if (onlyPaths.length) files = files.filter((f) => onlyPaths.some((p) => f.startsWith(p)));
    if (flag('--changed')) {
        const changed = changedFiles();
        files = files.filter((f) => changed.has(f));
    }

    let issues = [];
    for (const file of files) {
        issues.push(...lintText(file, fs.readFileSync(path.join(REPO_ROOT, file), 'utf8')));
    }
    issues.push(...lintI18nParity(files));
    if (onlyRules.length) issues = issues.filter((x) => onlyRules.includes(x.rule));

    if (flag('--update-baseline')) {
        const all = [];
        for (const file of listLessonFiles()) {
            all.push(...lintText(file, fs.readFileSync(path.join(REPO_ROOT, file), 'utf8')));
        }
        all.push(...lintI18nParity(listLessonFiles()));
        fs.writeFileSync(BASELINE_FILE, JSON.stringify(countByFileRule(all), null, 1) + '\n');
        console.log(`Linea base guardada en scripts/lint-docs.baseline.json (${all.length} incumplimientos en ${Object.keys(countByFileRule(all)).length} archivos).`);
        return 0;
    }

    if (flag('--json')) {
        console.log(JSON.stringify(issues, null, 1));
        return 0;
    }

    if (flag('--check')) {
        const baseline = fs.existsSync(BASELINE_FILE) ? JSON.parse(fs.readFileSync(BASELINE_FILE, 'utf8')) : {};
        const current = countByFileRule(issues);
        const regressions = [];
        for (const [file, rules] of Object.entries(current)) {
            for (const [rule, count] of Object.entries(rules)) {
                const allowed = baseline[file]?.[rule] ?? 0;
                if (count > allowed) regressions.push({ file, rule, count, allowed });
            }
        }
        if (regressions.length === 0) {
            console.log(`lint:docs OK (${files.length} archivos revisados, nada empeoro frente a la linea base).`);
            return 0;
        }
        console.log(`lint:docs FALLA: ${regressions.length} regla(s) empeoraron frente a la linea base:\n`);
        for (const r of regressions) {
            console.log(`  ${r.file}  [${r.rule}] ${RULES[r.rule].text}  (ahora ${r.count}, permitido ${r.allowed})`);
            if (flag('--verbose')) {
                issues
                    .filter((x) => x.file === r.file && x.rule === r.rule)
                    .forEach((x) => console.log(`      linea ${x.line} ${x.detail}`));
            }
        }
        return 1;
    }

    // Reporte
    const byRule = {};
    const byCourse = {};
    for (const x of issues) {
        byRule[x.rule] ??= { count: 0, files: new Set() };
        byRule[x.rule].count++;
        byRule[x.rule].files.add(x.file);
        const c = courseOf(x.file);
        byCourse[c] ??= {};
        byCourse[c][x.rule] = (byCourse[c][x.rule] ?? 0) + 1;
    }

    console.log(`\nlint:docs: ${files.length} archivos revisados, ${issues.length} incumplimientos\n`);
    const pad = (s, n) => String(s).padEnd(n);
    console.log(pad('Regla', 22) + pad('Nivel', 8) + pad('Archivos', 10) + pad('Casos', 8) + 'Descripcion');
    for (const [rule, meta] of Object.entries(RULES)) {
        const r = byRule[rule];
        console.log(pad(rule, 22) + pad(meta.severity, 8) + pad(r ? r.files.size : 0, 10) + pad(r ? r.count : 0, 8) + meta.text);
    }

    console.log('\nPor curso (casos por regla):');
    const ruleIds = Object.keys(RULES);
    console.log(pad('', 36) + ruleIds.map((r) => pad(r.slice(0, 10), 11)).join(''));
    for (const [course, rules] of Object.entries(byCourse).sort()) {
        console.log(pad(course, 36) + ruleIds.map((r) => pad(rules[r] ?? '.', 11)).join(''));
    }

    if (flag('--verbose')) {
        console.log('');
        for (const x of issues) {
            console.log(`${x.file}:${x.line}  [${x.rule}] ${x.detail}`);
        }
    }
    return 0;
}

process.exitCode = main();
