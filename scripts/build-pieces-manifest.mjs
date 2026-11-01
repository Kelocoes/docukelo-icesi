// Genera src/data/pieces.json: el catalogo de piezas interactivas que muestra la galeria /piezas.
//
//   npm run pieces:manifest
//
// Recorre static/interactive/<curso>/<semana>/<pieza>/index.html y toma de cada una el titulo (<title>). Se ejecuta
// solo antes de `npm start` y `npm run build`.
import { readFile, readdir, stat, writeFile, mkdir } from 'node:fs/promises';
import { dirname, join, resolve } from 'node:path';

const ROOT = resolve(process.cwd(), 'static/interactive');
const OUT = resolve(process.cwd(), 'src/data/pieces.json');

const COURSE_NAMES = {
    'computacion-2': 'Computación 2',
    'computacion-3': 'Computación 3',
    'desarrollo-entornos-digitales-web': 'Desarrollo de entornos digitales web',
    'seminario-de-i-d-i': 'Seminario de I+D+I',
};

const decode = (s) => s.replace(/&amp;/g, '&').replace(/&lt;/g, '<').replace(/&gt;/g, '>').replace(/&quot;/g, '"').replace(/&#39;/g, "'");
const prettify = (slug) => { const t = slug.replace(/-/g, ' '); return t.charAt(0).toUpperCase() + t.slice(1); };
const dirs = async (p) => { const out = []; for (const n of await readdir(p)) if ((await stat(join(p, n))).isDirectory()) out.push(n); return out; };

const pieces = [];
for (const course of (await dirs(ROOT)).filter((d) => d !== '_shared').sort()) {
    for (const week of (await dirs(join(ROOT, course))).sort((a, b) => parseInt(a.replace(/\D/g, ''), 10) - parseInt(b.replace(/\D/g, ''), 10))) {
        for (const slug of (await dirs(join(ROOT, course, week))).sort()) {
            let html;
            try { html = await readFile(join(ROOT, course, week, slug, 'index.html'), 'utf8'); } catch { continue; }
            const title = decode((html.match(/<title>([\s\S]*?)<\/title>/i) || [])[1] || prettify(slug)).trim();
            pieces.push({
                id: `${course}/${week}/${slug}`,
                course,
                courseName: COURSE_NAMES[course] || prettify(course),
                week,
                weekNumber: parseInt(week.replace(/\D/g, ''), 10) || 0,
                slug,
                title,
                src: `/interactive/${course}/${week}/${slug}/index.html`,
            });
        }
    }
}

await mkdir(dirname(OUT), { recursive: true });
await writeFile(OUT, JSON.stringify(pieces, null, 2) + '\n');
console.log(`Catalogo de piezas: ${pieces.length} piezas -> src/data/pieces.json`);
