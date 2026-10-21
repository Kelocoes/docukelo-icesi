// Publica como "global data" la lista de cursos (carpetas de docs/) para la portada y la pagina de
// bienvenida: nombre, descripcion, numero de semanas y de documentos. Se lee de los
// _category_.json, asi que un curso nuevo aparece solo, sin editar ninguna pagina.
//
// Uso en el cliente: usePluginData('docukelo-courses').courses

import fs from 'node:fs';
import path from 'node:path';

export const PLUGIN_NAME = 'docukelo-courses';

function readJson(file) {
    try {
        return JSON.parse(fs.readFileSync(file, 'utf8').replace(/^﻿/, ''));
    } catch {
        return null;
    }
}

function isHidden(category) {
    return Boolean(category?.className && /\bhidden\b/.test(category.className));
}

// Cuenta documentos (.md/.mdx que no empiezan por "_") y semanas visibles de un curso.
function countCourse(courseDir) {
    let weeks = 0;
    // Devuelve cuantos documentos hay en la carpeta (incluyendo subcarpetas visibles)
    const walk = (dir) => {
        let total = 0;
        for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
            const full = path.join(dir, entry.name);
            if (entry.isDirectory()) {
                if (isHidden(readJson(path.join(full, '_category_.json')))) continue;
                const inside = walk(full);
                if (/^semana-\d+$/.test(entry.name) && inside > 0) weeks += 1;
                total += inside;
            } else if (/\.mdx?$/.test(entry.name) && !entry.name.startsWith('_')) {
                total += 1;
            }
        }
        return total;
    };
    return { docs: walk(courseDir), weeks };
}

export default function coursesPlugin(context) {
    const docsDir = path.join(context.siteDir, 'docs');
    const locale = context.i18n.currentLocale;
    const localizedDir =
        locale === context.i18n.defaultLocale
            ? null
            : path.join(context.siteDir, 'i18n', locale, 'docusaurus-plugin-content-docs', 'current');

    return {
        name: PLUGIN_NAME,

        getPathsToWatch() {
            return [path.join(docsDir, '**/_category_.json'), path.join(docsDir, '**/*.{md,mdx}')];
        },

        async loadContent() {
            const courses = [];
            for (const entry of fs.readdirSync(docsDir, { withFileTypes: true })) {
                if (!entry.isDirectory()) continue;
                const base = readJson(path.join(docsDir, entry.name, '_category_.json'));
                if (!base || isHidden(base)) continue;
                const translated = localizedDir && readJson(path.join(localizedDir, entry.name, '_category_.json'));
                const category = { ...base, ...(translated ?? {}) };
                const { docs, weeks } = countCourse(path.join(docsDir, entry.name));
                const hasIntro = ['intro.md', 'intro.mdx'].some((f) => fs.existsSync(path.join(docsDir, entry.name, f)));
                courses.push({
                    id: entry.name,
                    label: category.label ?? entry.name,
                    description: category.link?.description ?? '',
                    position: category.position ?? 999,
                    path: hasIntro ? `/docs/${entry.name}/intro` : `/docs/${entry.name}`,
                    docs,
                    weeks,
                });
            }
            return courses.sort((a, b) => a.position - b.position || a.label.localeCompare(b.label));
        },

        async contentLoaded({ content, actions }) {
            actions.setGlobalData({ courses: content });
        },
    };
}
