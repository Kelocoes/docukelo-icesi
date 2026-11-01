import React, { useEffect, useMemo, useRef, useState } from 'react';
import Layout from '@theme/Layout';
import Heading from '@theme/Heading';
import useBaseUrl from '@docusaurus/useBaseUrl';
import useDocusaurusContext from '@docusaurus/useDocusaurusContext';
import pieces from '@site/src/data/pieces.json';
import styles from './piezas.module.css';

const T = {
    es: {
        title: 'Galería de piezas interactivas',
        description: 'Todas las piezas interactivas de DocuKelo en un solo lugar: pruébalas, avanza paso a paso y ábrelas en pantalla completa.',
        intro: 'Todas las piezas interactivas del sitio. Elige un curso y una semana; cada tarjeta es la pieza real: avanza paso a paso, reinicia o abre en pantalla completa.',
        search: 'Buscar por título…',
        pickCourse: 'Elige un curso',
        pickWeek: 'Elige una semana',
        choose: 'Elige un curso y una semana para ver sus piezas.',
        pieces: 'piezas',
        showing: 'Mostrando',
        of: 'de',
        week: 'Semana',
        next: 'Siguiente',
        prev: 'Anterior',
        reset: 'Reiniciar',
        fullscreen: 'Pantalla completa',
        newTab: 'Abrir en pestaña',
        close: 'Cerrar',
        prevPiece: '← Pieza anterior',
        nextPiece: 'Pieza siguiente →',
        none: 'Ninguna pieza coincide con los filtros.',
        loading: 'Se carga al acercarte…',
    },
    en: {
        title: 'Interactive pieces gallery',
        description: 'Every DocuKelo interactive piece in one place: try them, step through them and open them in full screen.',
        intro: 'Every interactive piece on the site. Pick a course and a week; each card is the real piece: step through it, reset it or open it in full screen.',
        search: 'Search by title…',
        pickCourse: 'Pick a course',
        pickWeek: 'Pick a week',
        choose: 'Pick a course and a week to see its pieces.',
        pieces: 'pieces',
        showing: 'Showing',
        of: 'of',
        week: 'Week',
        next: 'Next',
        prev: 'Previous',
        reset: 'Reset',
        fullscreen: 'Full screen',
        newTab: 'Open in tab',
        close: 'Close',
        prevPiece: '← Previous piece',
        nextPiece: 'Next piece →',
        none: 'No piece matches the filters.',
        loading: 'Loads as you scroll to it…',
    },
};

// Pulsa un boton de la pieza (esta en un iframe del mismo origen). Los textos de los botones vienen del kit (Anterior,
// Siguiente, Reiniciar); si la pieza no tiene ese boton, no pasa nada.
function press(iframe, labels) {
    try {
        const btn = [...iframe.contentDocument.querySelectorAll('button')].find((b) => labels.includes(b.textContent.trim()));
        if (btn && !btn.disabled) btn.click();
    } catch { /* otro origen o aun sin cargar */ }
}

function Card({ piece, t, base, onOpen }) {
    const ref = useRef(null);
    const frameRef = useRef(null);
    const [visible, setVisible] = useState(false);

    // la pieza se monta solo cuando la tarjeta se acerca a la pantalla: son decenas de iframes
    useEffect(() => {
        const node = ref.current;
        if (!node || !('IntersectionObserver' in window)) { setVisible(true); return undefined; }
        const io = new IntersectionObserver(([e]) => { if (e.isIntersecting) { setVisible(true); io.disconnect(); } }, { rootMargin: '400px' });
        io.observe(node);
        return () => io.disconnect();
    }, []);

    return (
        <article className={styles.card} ref={ref}>
            <header className={styles.cardHead}>
                <div className={styles.cardTitle}>
                    <Heading as="h3">{piece.title}</Heading>
                    <span className={styles.meta}>{piece.courseName} · {t.week} {piece.weekNumber}</span>
                </div>
            </header>
            <div className={styles.controls}>
                <button type="button" onClick={() => press(frameRef.current, ['Anterior', 'Previous'])}>{t.prev}</button>
                <button type="button" className={styles.solid} onClick={() => press(frameRef.current, ['Siguiente', 'Next'])}>{t.next}</button>
                <button type="button" onClick={() => press(frameRef.current, ['Reiniciar', 'Reset'])}>{t.reset}</button>
                <span className={styles.spacer} />
                <button type="button" onClick={onOpen}>{t.fullscreen}</button>
                <a href={base + piece.src} target="_blank" rel="noopener noreferrer">{t.newTab}</a>
            </div>
            {visible
                ? <iframe ref={frameRef} className={styles.frame} src={base + piece.src} title={piece.title} />
                : <div className={styles.placeholder}>{t.loading}</div>}
        </article>
    );
}

function Viewer({ list, index, setIndex, t, base }) {
    const dialogRef = useRef(null);
    const piece = index === null ? null : list[index];

    useEffect(() => {
        const d = dialogRef.current;
        if (!d) return undefined;
        if (piece && !d.open) d.showModal();
        if (!piece && d.open) d.close();
        document.body.style.overflow = piece ? 'hidden' : '';
        return () => { document.body.style.overflow = ''; };
    }, [piece]);

    // flechas del teclado para pasar de pieza (el foco puede estar en el dialogo, no dentro del iframe)
    const onKeyDown = (e) => {
        if (index === null) return;
        if (e.key === 'ArrowLeft' && index > 0) setIndex(index - 1);
        if (e.key === 'ArrowRight' && index < list.length - 1) setIndex(index + 1);
    };

    return (
        <dialog ref={dialogRef} className={styles.dialog} onClose={() => setIndex(null)} onKeyDown={onKeyDown}
            onClick={(e) => { if (e.target === dialogRef.current) setIndex(null); }} aria-label={piece ? piece.title : 'viewer'}>
            {piece && (
                <>
                    <div className={styles.dialogHead}>
                        <button type="button" disabled={index === 0} onClick={() => setIndex(index - 1)}>{t.prevPiece}</button>
                        <span className={styles.dialogTitle}>
                            {piece.title}
                            <small> · {piece.courseName} · {t.week} {piece.weekNumber} · {index + 1}/{list.length}</small>
                        </span>
                        <button type="button" disabled={index === list.length - 1} onClick={() => setIndex(index + 1)}>{t.nextPiece}</button>
                        <button type="button" onClick={() => setIndex(null)}>{t.close}</button>
                    </div>
                    <iframe key={piece.id} className={styles.dialogFrame} src={base + piece.src} title={piece.title} data-dk-fixed="true" />
                </>
            )}
        </dialog>
    );
}

export default function PiecesGallery() {
    const { i18n } = useDocusaurusContext();
    const t = T[i18n.currentLocale] || T.es;
    const base = useBaseUrl('/').replace(/\/$/, '');

    const [q, setQ] = useState('');
    const [course, setCourse] = useState('');
    const [week, setWeek] = useState('');
    const [viewer, setViewer] = useState(null);

    const courses = useMemo(() => [...new Map(pieces.map((p) => [p.course, p.courseName])).entries()], []);
    const weeks = useMemo(
        () => [...new Set(pieces.filter((p) => p.course === course).map((p) => p.weekNumber))].sort((a, b) => a - b),
        [course],
    );

    // no se muestra ninguna pieza hasta elegir curso y semana: montar decenas de iframes de golpe es lento y abruma
    const ready = Boolean(course && week);
    const list = useMemo(() => {
        if (!ready) return [];
        const needle = q.trim().toLowerCase();
        return pieces.filter((p) =>
            p.course === course
            && String(p.weekNumber) === week
            && (!needle || p.title.toLowerCase().includes(needle)));
    }, [ready, q, course, week]);

    return (
        <Layout title={t.title} description={t.description}>
            <main className={styles.page}>
                <Heading as="h1">{t.title}</Heading>
                <p className={styles.intro}>{t.intro}</p>

                <p className={styles.total}><strong>{pieces.length}</strong> {t.pieces}</p>

                <div className={styles.filters}>
                    <select value={course} onChange={(e) => { setCourse(e.target.value); setWeek(''); }} aria-label={t.pickCourse}>
                        <option value="">{t.pickCourse}</option>
                        {courses.map(([id, name]) => <option key={id} value={id}>{name}</option>)}
                    </select>
                    <select value={week} onChange={(e) => setWeek(e.target.value)} disabled={!course} aria-label={t.pickWeek}>
                        <option value="">{t.pickWeek}</option>
                        {weeks.map((w) => <option key={w} value={w}>{t.week} {w}</option>)}
                    </select>
                    <input type="search" value={q} onChange={(e) => setQ(e.target.value)} disabled={!ready} placeholder={t.search} aria-label={t.search} />
                </div>

                {!ready && <p className={styles.empty}>{t.choose}</p>}
                {ready && <p className={styles.count}>{t.showing} {list.length} {t.of} {pieces.filter((p) => p.course === course && String(p.weekNumber) === week).length}</p>}
                {ready && list.length === 0 && <p className={styles.empty}>{t.none}</p>}
                <div className={styles.grid}>
                    {list.map((p, i) => <Card key={p.id} piece={p} t={t} base={base} onOpen={() => setViewer(i)} />)}
                </div>

                <Viewer list={list} index={viewer} setIndex={setViewer} t={t} base={base} />
            </main>
        </Layout>
    );
}
