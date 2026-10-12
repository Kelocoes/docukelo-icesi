import React, { useState, useEffect, useCallback } from 'react';
import clsx from 'clsx';
import styles from './styles.module.css';

const STORAGE_KEY = 'docukelo_focus_mode';
const FOCUS_CLASS = 'focus-mode';

export default function FocusModeButton({ className }) {
  const [isFocus, setIsFocus] = useState(false);
  const [isMounted, setIsMounted] = useState(false);

  // Inicialización segura en cliente (evita discrepancias de SSR)
  useEffect(() => {
    setIsMounted(true);
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved === 'true') {
        setIsFocus(true);
        document.documentElement.classList.add(FOCUS_CLASS);
      }
    } catch (e) {
      // Ignorar errores en navegadores con localStorage restringido
    }
  }, []);

  const toggleFocusMode = useCallback(() => {
    setIsFocus((prev) => {
      const next = !prev;
      try {
        if (next) {
          document.documentElement.classList.add(FOCUS_CLASS);
          localStorage.setItem(STORAGE_KEY, 'true');
        } else {
          document.documentElement.classList.remove(FOCUS_CLASS);
          localStorage.setItem(STORAGE_KEY, 'false');
        }
      } catch (e) {
        // Fallback
      }
      return next;
    });
  }, []);

  // Atajo de teclado: Alt + F para alternar modo enfoque rápidamente
  useEffect(() => {
    const handleKeyDown = (event) => {
      if (event.altKey && (event.key === 'f' || event.key === 'F')) {
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
