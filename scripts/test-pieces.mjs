// Prueba de humo de las piezas interactivas (static/interactive/**/index.html).
//
//   npm run test:pieces                 todas las piezas
//   npm run test:pieces -- redux        solo las que contengan "redux" en su ruta
//
// Para cada pieza abre un navegador real, la recorre y falla si hay errores de JavaScript, recursos locales que no
// cargan o si la pieza no dibuja nada:
//   1. Normal: recorre todos los pasos con "Siguiente", prueba "Reiniciar" y cada interruptor (y vuelve a recorrer).
//   2. Tema oscuro: recarga con el tema oscuro y recorre los pasos.
//   3. Pantalla completa: la carga dentro de un iframe fijo de 1400x800 con data-dk-fixed (como InteractiveFrame)
//      y comprueba que adopta el modo dk-fs y que no se desborda.
//
// Usa playwright-core (sin descargar navegadores): prueba Chrome, Edge o el Chromium de Playwright, en ese orden.
// En un equipo sin ninguno: npx playwright install chromium.
import { createServer } from 'node:http';
import { readFile, readdir, stat } from 'node:fs/promises';
import { extname, join, relative, resolve, sep } from 'node:path';
import { fileURLToPath } from 'node:url';
import { chromium } from 'playwright-core';

const ROOT = resolve(fileURLToPath(new URL('..', import.meta.url)), 'static');
const MIME = { '.html': 'text/html; charset=utf-8', '.js': 'text/javascript; charset=utf-8', '.css': 'text/css; charset=utf-8', '.svg': 'image/svg+xml', '.png': 'image/png', '.json': 'application/json' };
// motores cuya figura es un <svg> directo en el escenario: en pantalla completa no deben desbordar verticalmente
const FITS_FULLSCREEN = ['layers', 'tree', 'sequence', 'radial'];
const HTML_STAGE = ['anatomy', 'table', 'compare', 'phone'];
const MAX_STEPS = 80;

async function findPieces(dir, out = []) {
    for (const name of await readdir(dir)) {
        const p = join(dir, name);
        if ((await stat(p)).isDirectory()) {
            if (name !== '_shared') await findPieces(p, out);
        } else if (name === 'index.html') {
            out.push(relative(ROOT, dir).split(sep).join('/'));
        }
    }
    return out;
}

function startServer() {
    return new Promise((done) => {
        const server = createServer(async (req, res) => {
            const url = new URL(req.url, 'http://localhost');
            if (url.pathname === '/__wrap.html') {
                res.writeHead(200, { 'content-type': MIME['.html'] });
                res.end(`<!doctype html><body style="margin:0"><iframe id="f" data-dk-fixed="true" src="${url.searchParams.get('src')}" style="width:1400px;height:800px;border:0"></iframe>`);
                return;
            }
            let file = resolve(ROOT, '.' + decodeURIComponent(url.pathname));
            if (!file.startsWith(ROOT)) { res.writeHead(403).end(); return; }
            try {
                if ((await stat(file)).isDirectory()) file = join(file, 'index.html');
                const body = await readFile(file);
                res.writeHead(200, { 'content-type': MIME[extname(file)] || 'application/octet-stream' });
                res.end(body);
            } catch {
                res.writeHead(404).end('not found');
            }
        });
        server.listen(0, '127.0.0.1', () => done(server));
    });
}

async function launch() {
    const attempts = [{ channel: 'chrome' }, { channel: 'msedge' }, {}];
    let last;
    for (const opts of attempts) {
        try { return await chromium.launch({ headless: true, ...opts }); } catch (e) { last = e; }
    }
    throw new Error('No se encontro ningun navegador (Chrome, Edge o Chromium de Playwright). Ejecuta: npx playwright install chromium\n' + last.message);
}

const sleep = (ms) => new Promise((r) => setTimeout(r, ms));
const isLocal = (url, base) => url.startsWith(base) || url.startsWith('data:') || url.startsWith('about:');

function watch(page, base, errors) {
    page.on('pageerror', (e) => errors.push('JS: ' + e.message));
    page.on('console', (m) => {
        if (m.type() !== 'error') return;
        const loc = m.location()?.url || '';
        // un CDN caido o el favicon no son culpa de la pieza
        if (loc && (!isLocal(loc, base) || loc.endsWith('/favicon.ico'))) return;
        errors.push('consola: ' + m.text().slice(0, 160));
    });
    page.on('response', (r) => {
        if (r.status() >= 400 && isLocal(r.url(), base) && !r.url().endsWith('/favicon.ico')) errors.push(`HTTP ${r.status()}: ${r.url().replace(base, '')}`);
    });
}

async function clickByText(ctx, text) {
    const btn = ctx.getByRole('button', { name: text, exact: true });
    if (!(await btn.count())) return null;
    return btn.first();
}

// Avanza con "Siguiente" hasta que se deshabilita. Devuelve cuantos pasos dio.
async function walk(ctx) {
    let n = 0;
    for (; n < MAX_STEPS; n++) {
        const next = await clickByText(ctx, 'Siguiente');
        if (!next || (await next.isDisabled())) break;
        await next.click();
        await sleep(90);
    }
    return n;
}

async function testPiece(browser, base, piece) {
    const result = { piece, engines: [], steps: 0, toggles: 0, errors: [], notes: [] };
    const html = await readFile(join(ROOT, piece, 'index.html'), 'utf8');
    result.engines = ['radial', 'phone', 'layers', 'tree', 'table', 'anatomy', 'compare', 'sequence'].filter((e) => html.includes(`dk-${e}.js`));
    const url = `${base}/${piece}/index.html`;

    // 1 y 2: pagina normal, tema claro y oscuro
    for (const theme of ['light', 'dark']) {
        const context = await browser.newContext({ viewport: { width: 1280, height: 900 }, colorScheme: theme });
        const page = await context.newPage();
        watch(page, base, result.errors);
        await page.goto(url, { waitUntil: 'load' });
        await sleep(400);
        const drawn = await page.evaluate(() => !!(window.DK && document.querySelector('.dk-card')) || document.body.innerText.trim().length > 40);
        if (!drawn) result.errors.push(`no dibuja nada (${theme})`);

        const steps = await walk(page);
        if (theme === 'light') {
            result.steps = steps;
            const reset = await clickByText(page, 'Reiniciar');
            if (reset) { await reset.click(); await sleep(200); }
            const toggles = page.locator('.dk-toggle input[type=checkbox]');
            result.toggles = await toggles.count();
            for (let i = 0; i < result.toggles; i++) {
                await toggles.nth(i).click({ force: true });
                await sleep(200);
                await walk(page);
                const again = await clickByText(page, 'Reiniciar');
                if (again) { await again.click(); await sleep(150); }
            }
        }
        await context.close();
    }

    // 3: pantalla completa (iframe fijo como el del dialogo de InteractiveFrame)
    const context = await browser.newContext({ viewport: { width: 1400, height: 800 } });
    const page = await context.newPage();
    watch(page, base, result.errors);
    await page.goto(`${base}/__wrap.html?src=/${piece}/index.html`, { waitUntil: 'load' });
    await sleep(900);
    const frame = page.frames().find((f) => f !== page.mainFrame());
    if (!frame) {
        result.errors.push('pantalla completa: no cargo el iframe');
    } else {
        const m = await frame.evaluate(() => ({
            fs: document.documentElement.classList.contains('dk-fs'),
            overX: document.documentElement.scrollWidth - window.innerWidth,
            overY: document.documentElement.scrollHeight - window.innerHeight,
        }));
        if (!m.fs && result.engines.length) result.errors.push('pantalla completa: no se marco html.dk-fs (DK.autoHeight)');
        if (m.overX > 2) result.errors.push(`pantalla completa: desborde horizontal de ${m.overX}px`);
        if (m.overY > 2) {
            const msg = `pantalla completa: desborde vertical de ${m.overY}px`;
            // solo las piezas de figura SVG pura se exigen sin desborde; con un motor de escenario HTML (anatomy, table,
            // compare, phone) la pieza se desplaza dentro del dialogo, como en un iframe normal
            const svgOnly = result.engines.some((e) => FITS_FULLSCREEN.includes(e)) && !result.engines.some((e) => HTML_STAGE.includes(e));
            if (svgOnly) result.errors.push(msg);
            else result.notes.push(msg + ' (escenario HTML: se desplaza)');
        }
    }
    await context.close();
    return result;
}

const filter = process.argv[2];
const pieces = (await findPieces(join(ROOT, 'interactive'))).filter((p) => !filter || p.includes(filter)).sort();
if (!pieces.length) { console.error('Ninguna pieza coincide con el filtro.'); process.exit(2); }

const server = await startServer();
const base = `http://127.0.0.1:${server.address().port}`;
const browser = await launch();
const results = [];
for (const piece of pieces) {
    try {
        results.push(await testPiece(browser, base, piece));
    } catch (e) {
        results.push({ piece, engines: [], steps: 0, toggles: 0, errors: ['excepcion: ' + e.message.split('\n')[0]], notes: [] });
    }
    const r = results.at(-1);
    console.log(`${r.errors.length ? 'FALLA' : 'ok   '}  ${r.piece.replace(/^interactive\//, '')}  [${r.engines.join(',') || 'sin motor dk'}]  pasos=${r.steps} interruptores=${r.toggles}`);
    for (const e of [...new Set(r.errors)]) console.log('        - ' + e);
    for (const n of r.notes) console.log('        . ' + n);
}
await browser.close();
server.close();

const failed = results.filter((r) => r.errors.length);
console.log(`\n${results.length - failed.length} de ${results.length} piezas sin errores.`);
process.exit(failed.length ? 1 : 0);
