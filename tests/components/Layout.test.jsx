import { render, screen } from '@testing-library/react';
import { CardGrid, Card } from '@site/src/components/CardGrid';
import { StepByStep, Step } from '@site/src/components/StepByStep';

describe('CardGrid y Card', () => {
    it('reparte las tarjetas en el numero de columnas pedido', () => {
        const { container } = render(
            <CardGrid cols={3}>
                <Card title="Uno" />
                <Card title="Dos" />
            </CardGrid>
        );
        expect(container.firstChild.style.gridTemplateColumns).toBe('repeat(3, minmax(0, 1fr))');
    });

    it('usa dos columnas por defecto', () => {
        const { container } = render(<CardGrid><Card title="Uno" /></CardGrid>);
        expect(container.firstChild.style.gridTemplateColumns).toBe('repeat(2, minmax(0, 1fr))');
    });

    it('una tarjeta con link es un enlace y sin link es un bloque', () => {
        render(
            <CardGrid>
                <Card title="Con enlace" description="Descripcion" link="https://docusaurus.io" />
                <Card title="Sin enlace" />
            </CardGrid>
        );
        expect(screen.getByRole('link', { name: /Con enlace/ })).toHaveAttribute('href', 'https://docusaurus.io');
        expect(screen.getByText('Descripcion')).toBeInTheDocument();
        expect(screen.queryByRole('link', { name: /Sin enlace/ })).toBeNull();
    });
});

describe('StepByStep y Step', () => {
    it('muestra el numero, el titulo y el contenido de cada paso', () => {
        render(
            <StepByStep>
                <Step number="1" title="Instalar"><p>Ejecuta npm install</p></Step>
                <Step number={2} title="Configurar"><p>Edita el .env</p></Step>
            </StepByStep>
        );
        expect(screen.getByRole('heading', { name: 'Instalar' })).toBeInTheDocument();
        expect(screen.getByRole('heading', { name: 'Configurar' })).toBeInTheDocument();
        expect(screen.getByText('1')).toBeInTheDocument();
        expect(screen.getByText('2')).toBeInTheDocument();
        expect(screen.getByText('Ejecuta npm install')).toBeInTheDocument();
    });
});
