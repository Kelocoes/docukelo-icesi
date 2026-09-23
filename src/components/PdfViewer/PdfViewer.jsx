import React, { useRef } from 'react';
import { DocumentIcon } from '@site/src/components/IcesiIcons';
import styles from './PdfViewer.module.css';

function getDisplayTitle(src, title) {
  if (title) return title;
  if (!src) return 'Documento';
  try {
    const filename = src.split('/').pop().split('?')[0];
    return decodeURIComponent(filename).replace(/\.pdf$/i, '');
  } catch (e) {
    return 'Documento';
  }
}

export default function PdfViewer({ src, width = '100%', height = '600px', title }) {
  const containerRef = useRef(null);
  const iframeRef = useRef(null);
  const displayTitle = getDisplayTitle(src, title);
  const iframeId = 'pdfViewer-' + (src ? src.replace(/[^a-zA-Z0-9-_]/g, '-') : 'default');

  const handleFullscreen = () => {
    const target = iframeRef.current || document.getElementById(iframeId) || containerRef.current;
    if (!target) return;

    if (target.requestFullscreen) {
      target.requestFullscreen();
    } else if (target.webkitRequestFullscreen) {
      target.webkitRequestFullscreen();
    } else if (target.msRequestFullscreen) {
      target.msRequestFullscreen();
    }
  };

  return (
    <div className={styles.pdfViewerContainer} style={{ width }} ref={containerRef}>
      <div className={styles.toolbar}>
        <div className={styles.documentInfo} title={displayTitle}>
          <DocumentIcon className={styles.docIcon} size={18} />
          <span className={styles.documentTitle}>{displayTitle}</span>
        </div>
        <div className={styles.actions}>
          <button
            type="button"
            className={styles.fullscreenButton}
            onClick={handleFullscreen}
            title="Ver en pantalla completa"
            aria-label="Ver en pantalla completa"
          >
            <svg
              className={styles.fullscreenIcon}
              width="15"
              height="15"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2.2"
              strokeLinecap="round"
              strokeLinejoin="round"
              aria-hidden="true"
            >
              <polyline points="15 3 21 3 21 9" />
              <polyline points="9 21 3 21 3 15" />
              <line x1="21" y1="3" x2="14" y2="10" />
              <line x1="3" y1="21" x2="10" y2="14" />
            </svg>
            <span>Pantalla completa</span>
          </button>
        </div>
      </div>
      <div className={styles.iframeWrapper}>
        <iframe
          ref={iframeRef}
          id={iframeId}
          src={src}
          width="100%"
          height={height}
          title={displayTitle}
          allowFullScreen
          className={styles.iframe}
        >
          <p>
            Tu navegador no soporta iframes.{' '}
            <a href={src} target="_blank" rel="noopener noreferrer">
              Descarga o visualiza el documento aquí
            </a>.
          </p>
        </iframe>
      </div>
    </div>
  );
}