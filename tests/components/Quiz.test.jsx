import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { Quiz, Question, Option } from '@site/src/components/Quiz/Quiz';

function renderQuiz(id = 'demo') {
    return render(
        <Quiz id={id}>
            <Question title="Capital de Francia">
                <Option correct>Paris</Option>
                <Option>Roma</Option>
            </Question>
            <Question title="Cuanto es 2 + 2">
                <Option>3</Option>
                <Option correct>4</Option>
            </Question>
        </Quiz>
    );
}

describe('Quiz', () => {
    it('muestra la primera pregunta y el progreso', () => {
        renderQuiz();
        expect(screen.getByText('Pregunta 1 de 2')).toBeInTheDocument();
        expect(screen.getByText('Capital de Francia')).toBeInTheDocument();
        expect(screen.queryByText('Cuanto es 2 + 2')).not.toBeInTheDocument();
    });

    it('no deja avanzar hasta responder', async () => {
        const user = userEvent.setup();
        renderQuiz();
        expect(screen.getByRole('button', { name: 'Siguiente' })).toBeDisabled();
        await user.click(screen.getByRole('button', { name: /Roma/ }));
        expect(screen.getByRole('button', { name: 'Siguiente' })).toBeEnabled();
    });

    it('marca la respuesta correcta y la incorrecta, y no permite cambiarla', async () => {
        const user = userEvent.setup();
        renderQuiz();
        await user.click(screen.getByRole('button', { name: /Roma/ }));
        expect(screen.getByLabelText('Incorrecta')).toBeInTheDocument();
        expect(screen.getByLabelText('Correcta')).toBeInTheDocument();
        expect(screen.getByRole('button', { name: /Paris/ })).toBeDisabled();
        expect(screen.getByRole('button', { name: /Roma/ })).toBeDisabled();
    });

    it('al terminar muestra el puntaje y el mensaje segun el resultado', async () => {
        const user = userEvent.setup();
        renderQuiz();
        await user.click(screen.getByRole('button', { name: /Paris/ }));
        await user.click(screen.getByRole('button', { name: 'Siguiente' }));
        await user.click(screen.getByRole('button', { name: /^.*3$/ }));
        await user.click(screen.getByRole('button', { name: 'Finalizar' }));

        expect(screen.getByText('Cuestionario Finalizado')).toBeInTheDocument();
        expect(screen.getByText('50%')).toBeInTheDocument();
        expect(screen.getByText(/Sigue estudiando/)).toBeInTheDocument();
    });

    it('con todas correctas da 100 % y felicita', async () => {
        const user = userEvent.setup();
        renderQuiz();
        await user.click(screen.getByRole('button', { name: /Paris/ }));
        await user.click(screen.getByRole('button', { name: 'Siguiente' }));
        await user.click(screen.getByRole('button', { name: /^.*4$/ }));
        await user.click(screen.getByRole('button', { name: 'Finalizar' }));
        expect(screen.getByText('100%')).toBeInTheDocument();
        expect(screen.getByText(/Excelente trabajo/)).toBeInTheDocument();
    });

    it('guarda el progreso en localStorage y lo recupera al volver a montar', async () => {
        const user = userEvent.setup();
        const { unmount } = renderQuiz('persistente');
        await user.click(screen.getByRole('button', { name: /Paris/ }));
        expect(JSON.parse(localStorage.getItem('docukelo-quiz-persistente')).answers).toEqual({ 0: 0 });
        unmount();

        renderQuiz('persistente');
        expect(await screen.findByRole('button', { name: /Paris/ })).toBeDisabled();
        expect(screen.getByLabelText('Correcta')).toBeInTheDocument();
    });

    it('cada cuestionario usa su propio id (no se mezclan los estados)', async () => {
        const user = userEvent.setup();
        const { unmount } = renderQuiz('uno');
        await user.click(screen.getByRole('button', { name: /Roma/ }));
        unmount();

        renderQuiz('dos');
        expect(await screen.findByRole('button', { name: /Roma/ })).toBeEnabled();
    });

    it('Reintentar reinicia las respuestas y deja guardado el estado inicial', async () => {
        const user = userEvent.setup();
        renderQuiz('reintento');
        await user.click(screen.getByRole('button', { name: /Paris/ }));
        await user.click(screen.getByRole('button', { name: 'Siguiente' }));
        await user.click(screen.getByRole('button', { name: /^.*4$/ }));
        await user.click(screen.getByRole('button', { name: 'Finalizar' }));
        await user.click(screen.getByRole('button', { name: 'Reintentar' }));

        expect(screen.getByText('Pregunta 1 de 2')).toBeInTheDocument();
        expect(screen.getByRole('button', { name: /Paris/ })).toBeEnabled();
        // el efecto de guardado reescribe enseguida la clave con el estado ya reiniciado
        expect(JSON.parse(localStorage.getItem('docukelo-quiz-reintento'))).toEqual({ answers: {}, currentQuestionIndex: 0, isCompleted: false });
    });
});
