import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import PdfViewer from '@site/src/components/PdfViewer/PdfViewer';

describe('PdfViewer', () => {
    it('incrusta el PDF con la altura indicada', () => {
        const { container } = render(<PdfViewer src="/files/curso/semana-1.pdf" height="480px" />);
        const frame = container.querySelector('iframe');
        expect(frame).toHaveAttribute('src', '/files/curso/semana-1.pdf');
        expect(frame).toHaveAttribute('height', '480px');
    });

    it('deriva el titulo del nombre del archivo cuando no se da title', () => {
        render(<PdfViewer src="/files/curso/Guia%20de%20Docker.pdf?v=2" />);
        expect(screen.getAllByTitle('Guia de Docker').length).toBeGreaterThan(0);
        expect(screen.getByText('Guia de Docker')).toBeInTheDocument();
    });

    it('usa el title cuando se da', () => {
        render(<PdfViewer src="/files/x.pdf" title="Semana 12: Redux" />);
        expect(screen.getByText('Semana 12: Redux')).toBeInTheDocument();
        expect(document.querySelector('iframe')).toHaveAttribute('title', 'Semana 12: Redux');
    });

    it('incluye un enlace de respaldo para navegadores sin soporte de iframes', () => {
        render(<PdfViewer src="/files/x.pdf" />);
        const link = screen.getByRole('link', { name: /Descarga o visualiza/ });
        expect(link).toHaveAttribute('href', '/files/x.pdf');
    });

    it('el boton de pantalla completa pide fullscreen sobre el iframe', async () => {
        const user = userEvent.setup();
        const { container } = render(<PdfViewer src="/files/x.pdf" />);
        const frame = container.querySelector('iframe');
        frame.requestFullscreen = vi.fn();
        await user.click(screen.getByRole('button', { name: 'Ver en pantalla completa' }));
        expect(frame.requestFullscreen).toHaveBeenCalledTimes(1);
    });
});
