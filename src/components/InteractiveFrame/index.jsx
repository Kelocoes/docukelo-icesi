import React, { useEffect, useRef, useState } from 'react';
import useDocusaurusContext from '@docusaurus/useDocusaurusContext';
import styles from './styles.module.css';

const LABELS = {
    es: { open: 'Pantalla completa', close: 'Cerrar', full: 'pantalla completa' },
    en: { open: 'Full screen', close: 'Close', full: 'full screen' },
};

// Incrusta una pieza interactiva (static/interactive/...) y agrega un boton "Pantalla completa" arriba a la derecha.
// El boton abre la misma pieza en un dialogo superpuesto casi del tamano de la ventana, para ver con mas espacio
// los graficos complejos. La pieza del dialogo se crea solo al abrirlo y se marca con data-dk-fixed: DK.autoHeight
// no ajusta su alto al contenido y la pieza se adapta al espacio disponible.
export default function InteractiveFrame({ src, title, height = 700 }) {
    const { i18n } = useDocusaurusContext();
    const t = LABELS[i18n.currentLocale] || LABELS.es;
    const dialogRef = useRef(null);
    const [open, setOpen] = useState(false);

    useEffect(() => {
        const dialog = dialogRef.current;
        if (!dialog) return undefined;
        if (open && !dialog.open) dialog.showModal();
        if (!open && dialog.open) dialog.close();
        document.body.style.overflow = open ? 'hidden' : '';
        return () => { document.body.style.overflow = ''; };
    }, [open]);

    // clic en el fondo (el propio <dialog>, fuera de su caja) cierra
    const onDialogClick = (e) => { if (e.target === dialogRef.current) setOpen(false); };

    return (
        <div className={styles.wrap}>
            <div className={styles.toolbar}>
                <button type="button" className={styles.expand} onClick={() => setOpen(true)} aria-haspopup="dialog">
                    <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                        <path d="M15 3h6v6M9 21H3v-6M21 3l-7 7M3 21l7-7" />
                    </svg>
                    {t.open}
                </button>
            </div>
            <iframe src={src} title={title} style={{ width: '100%', height, border: 0 }} loading="lazy" />

            <dialog ref={dialogRef} className={styles.dialog} onClose={() => setOpen(false)} onClick={onDialogClick} aria-label={title}>
                <div className={styles.header}>
                    <span className={styles.title}>{title}</span>
                    <button type="button" className={styles.close} onClick={() => setOpen(false)}>{t.close}</button>
                </div>
                {open && <iframe className={styles.full} src={src} title={`${title} (${t.full})`} data-dk-fixed="true" />}
            </dialog>
        </div>
    );
}
