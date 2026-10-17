import React, { useState, useEffect, useCallback } from 'react';
import clsx from 'clsx';
import { useLocation } from '@docusaurus/router';
import styles from './styles.module.css';

const STORAGE_KEY = 'docukelo_focus_mode';
const FOCUS_CLASS = 'focus-mode';
const FOCUS_ATTR = 'data-focus-mode';
const DESKTOP_MIN_WIDTH = 997;

function isDesktop() {
  return typeof window !== 'undefined' && window.innerWidth >= DESKTOP_MIN_WIDTH;
}

function applyFocusMode(active) {
  if (typeof document === 'undefined') return;
  const root = document.documentElement;
  if (active) {
    root.setAttribute(FOCUS_ATTR, 'true');
    if (!root.classList.contains(FOCUS_CLASS)) {
      root.classList.add(FOCUS_CLASS);
    }
  } else {
    root.removeAttribute(FOCUS_ATTR);
    root.classList.remove(FOCUS_CLASS);
  }
}

export default function FocusModeButton({ className }) {
  const [isFocus, setIsFocus] = useState(false);
  const [isMounted, setIsMounted] = useState(false);
  const location = useLocation();

  // Inicialización segura en cliente
  useEffect(() => {
    setIsMounted(true);
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved === 'true') {
        setIsFocus(true);
      }
    } catch (e) {
      // Ignorar errores en navegadores con localStorage restringido
    }
  }, []);

  const toggleFocusMode = useCallback(() => {
    setIsFocus((prev) => !prev);
  }, []);

  // Sincronizar DOM, observer y localStorage cuando cambia isFocus
  useEffect(() => {
    if (!isMounted) return;

    if (isFocus) {
      applyFocusMode(true);
      try {
        localStorage.setItem(STORAGE_KEY, 'true');
      } catch (e) {}

      const observer = new MutationObserver(() => {
        const root = document.documentElement;
        const hasAttr = root.getAttribute(FOCUS_ATTR) === 'true';
        const hasClass = root.classList.contains(FOCUS_CLASS);
        if (!hasAttr || !hasClass) {
          applyFocusMode(true);
        }
      });

      observer.observe(document.documentElement, {
        attributes: true,
        attributeFilter: ['class', FOCUS_ATTR],
      });

      return () => observer.disconnect();
    } else {
      applyFocusMode(false);
      try {
        localStorage.setItem(STORAGE_KEY, 'false');
      } catch (e) {}
    }
  }, [isFocus, isMounted]);

  // Re-aplicar modo enfoque en navegaciones de página (Docusaurus SPA routing)
  useEffect(() => {
    if (isMounted && isFocus) {
      applyFocusMode(true);
    }
  }, [location.pathname, isFocus, isMounted]);

  // Atajo de teclado: Alt + F para alternar modo enfoque rápidamente (solo en desktop)
  useEffect(() => {
    const handleKeyDown = (event) => {
      if (event.altKey && (event.key === 'f' || event.key === 'F')) {
        if (!isDesktop()) return;
        event.preventDefault();
        toggleFocusMode();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [toggleFocusMode]);

  if (!isMounted) {
    // Renderizado estático inicial para SSR idéntico
    return (
      <button
        type="button"
        className={clsx(styles.focusButton, className)}
        title="Modo Enfoque (Ocultar barras laterales)"
        aria-label="Modo Enfoque"
      >
        <FocusIcon />
        <span>Focus Mode</span>
      </button>
    );
  }

  return (
    <button
      type="button"
      onClick={toggleFocusMode}
      className={clsx(
        styles.focusButton,
        isFocus && styles.focusButtonActive,
        className
      )}
      title={
        isFocus
          ? 'Desactivar Modo Enfoque (Mostrar barras laterales) [Alt+F]'
          : 'Activar Modo Enfoque (Ocultar barras laterales) [Alt+F]'
      }
      aria-label="Alternar Modo Enfoque"
      aria-pressed={isFocus}
    >
      <FocusIcon isFocus={isFocus} />
      <span>Focus Mode</span>
      {isFocus && <span className={styles.focusBadge} />}
    </button>
  );
}

function FocusIcon({ isFocus }) {
  if (isFocus) {
    // Icono de contraer / salir de enfoque
    return (
      <svg
        className={styles.icon}
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2.2"
        strokeLinecap="round"
        strokeLinejoin="round"
        aria-hidden="true"
      >
        <polyline points="4 14 10 14 10 20" />
        <polyline points="20 10 14 10 14 4" />
        <line x1="14" y1="10" x2="21" y2="3" />
        <line x1="3" y1="21" x2="10" y2="14" />
      </svg>
    );
  }

  // Icono de marco de enfoque / expandir lectura
  return (
    <svg
      className={styles.icon}
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
  );
}
