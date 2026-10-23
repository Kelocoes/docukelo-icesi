import { act, render, screen } from '@testing-library/react';
import FocusModeButton from '@site/src/components/FocusModeButton';

const root = () => document.documentElement;
// La animacion del cambio dura 220 + 320 + 340 ms
const finishAnimation = () => act(() => { vi.advanceTimersByTime(1000); });

describe('FocusModeButton', () => {
    beforeEach(() => {
        vi.useFakeTimers();
        window.innerWidth = 1280;
    });
    afterEach(() => { vi.useRealTimers(); });

    it('arranca desactivado y no marca el documento', () => {
        render(<FocusModeButton />);
        expect(screen.getByRole('button', { name: 'Alternar Modo Enfoque' })).toHaveAttribute('aria-pressed', 'false');
        expect(root()).not.toHaveAttribute('data-focus-mode');
    });

    it('al pulsarlo activa el modo enfoque y lo guarda en localStorage', () => {
        render(<FocusModeButton />);
        act(() => { screen.getByRole('button', { name: 'Alternar Modo Enfoque' }).click(); });
        finishAnimation();

        expect(screen.getByRole('button', { name: 'Alternar Modo Enfoque' })).toHaveAttribute('aria-pressed', 'true');
        expect(root()).toHaveAttribute('data-focus-mode', 'true');
        expect(root()).toHaveClass('focus-mode');
        expect(localStorage.getItem('docukelo_focus_mode')).toBe('true');
    });

    it('al pulsarlo otra vez lo desactiva', () => {
        render(<FocusModeButton />);
        const button = () => screen.getByRole('button', { name: 'Alternar Modo Enfoque' });
        act(() => { button().click(); });
        finishAnimation();
        act(() => { button().click(); });
        finishAnimation();

        expect(button()).toHaveAttribute('aria-pressed', 'false');
        expect(root()).not.toHaveAttribute('data-focus-mode');
        expect(localStorage.getItem('docukelo_focus_mode')).toBe('false');
    });

    it('recupera el modo enfoque guardado de una visita anterior', () => {
        localStorage.setItem('docukelo_focus_mode', 'true');
        render(<FocusModeButton />);
        finishAnimation();
        expect(screen.getByRole('button', { name: 'Alternar Modo Enfoque' })).toHaveAttribute('aria-pressed', 'true');
        expect(root()).toHaveAttribute('data-focus-mode', 'true');
    });

    it('el atajo Alt+F lo alterna en escritorio', () => {
        render(<FocusModeButton />);
        act(() => { window.dispatchEvent(new KeyboardEvent('keydown', { key: 'f', altKey: true })); });
        finishAnimation();
        expect(root()).toHaveAttribute('data-focus-mode', 'true');
    });

    it('el atajo Alt+F no hace nada en pantallas pequenas', () => {
        window.innerWidth = 600;
        render(<FocusModeButton />);
        act(() => { window.dispatchEvent(new KeyboardEvent('keydown', { key: 'f', altKey: true })); });
        finishAnimation();
        expect(root()).not.toHaveAttribute('data-focus-mode');
    });
});
