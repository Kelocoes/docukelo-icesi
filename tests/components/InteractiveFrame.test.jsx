import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import InteractiveFrame from '@site/src/components/InteractiveFrame';

const props = { src: '/interactive/demo/index.html', title: 'Pieza de prueba', height: 600 };

afterEach(() => { delete globalThis.__locale; });

describe('InteractiveFrame', () => {
    it('muestra la pieza en un iframe con su titulo y alto, y el boton de pantalla completa', () => {
        const { container } = render(<InteractiveFrame {...props} />);
        const frame = container.querySelector('iframe');
        expect(frame).toHaveAttribute('src', props.src);
        expect(frame).toHaveAttribute('title', props.title);
        expect(frame.style.height).toBe('600px');
        expect(screen.getByRole('button', { name: /Pantalla completa/ })).toBeInTheDocument();
    });

    it('no crea la segunda copia de la pieza hasta abrir la pantalla completa', () => {
        const { container } = render(<InteractiveFrame {...props} />);
        expect(container.querySelectorAll('iframe')).toHaveLength(1);
    });

    it('al abrir, monta la pieza en el dialogo marcada con data-dk-fixed y bloquea el scroll de la pagina', async () => {
        const user = userEvent.setup();
        const { container } = render(<InteractiveFrame {...props} />);
        await user.click(screen.getByRole('button', { name: /Pantalla completa/ }));

        const dialog = container.querySelector('dialog');
        expect(dialog).toHaveAttribute('open');
        const full = dialog.querySelector('iframe');
        expect(full).toHaveAttribute('src', props.src);
        expect(full).toHaveAttribute('data-dk-fixed', 'true');
        expect(document.body.style.overflow).toBe('hidden');
    });

    it('al cerrar elimina la pieza del dialogo y devuelve el scroll', async () => {
        const user = userEvent.setup();
        const { container } = render(<InteractiveFrame {...props} />);
        await user.click(screen.getByRole('button', { name: /Pantalla completa/ }));
        await user.click(screen.getByRole('button', { name: 'Cerrar' }));

        expect(container.querySelector('dialog')).not.toHaveAttribute('open');
        expect(container.querySelector('dialog iframe')).toBeNull();
        expect(document.body.style.overflow).toBe('');
    });

    it('usa las etiquetas en ingles cuando el idioma es en', () => {
        globalThis.__locale = 'en';
        render(<InteractiveFrame {...props} />);
        expect(screen.getByRole('button', { name: /Full screen/ })).toBeInTheDocument();
    });
});
