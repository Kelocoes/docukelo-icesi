import '@testing-library/jest-dom/vitest';
import { cleanup } from '@testing-library/react';
import { afterEach } from 'vitest';

afterEach(() => {
    cleanup();
    localStorage.clear();
    document.documentElement.removeAttribute('data-focus-mode');
    document.documentElement.removeAttribute('data-focus-phase');
    document.documentElement.classList.remove('focus-mode');
    document.body.style.overflow = '';
});

// jsdom no implementa <dialog>.showModal()/close(): lo reemplazamos por una version minima
if (typeof HTMLDialogElement !== 'undefined' && !HTMLDialogElement.prototype.showModal) {
    HTMLDialogElement.prototype.showModal = function showModal() { this.setAttribute('open', ''); };
    HTMLDialogElement.prototype.close = function close() {
        this.removeAttribute('open');
        this.dispatchEvent(new Event('close'));
    };
}
