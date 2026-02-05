// [Feature: News Management] [Story: NEWS-ADMIN-001] [Ticket: NEWS-ADMIN-001-FE-T03]
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { vi, expect, it, describe } from 'vitest';
import { NewsForm } from '../NewsForm';

// Mock React Quill
vi.mock('react-quill', () => ({
    default: ({ value, onChange }: { value: string, onChange: (c: string) => void }) => (
        <textarea
            aria-label="Contenido"
            data-testid="quill-mock"
            value={value}
            onChange={(e) => onChange(e.target.value)}
        />
    )
}));

describe('NewsForm', () => {
    const mockOnSubmit = vi.fn();

    it('renders correctly with all fields', () => {
        render(<NewsForm onSubmit={mockOnSubmit} />);

        expect(screen.getByLabelText(/Título/i)).toBeInTheDocument();
        expect(screen.getByLabelText(/Alcance/i)).toBeInTheDocument();
        expect(screen.getByLabelText(/Resumen/i)).toBeInTheDocument();
        expect(screen.getByLabelText(/Contenido/i)).toBeInTheDocument();
        expect(screen.getByRole('button', { name: /Guardar Borrador/i })).toBeInTheDocument();
    });

    it('shows validation error when title is empty', async () => {
        const user = userEvent.setup();
        render(<NewsForm onSubmit={mockOnSubmit} />);

        await user.click(screen.getByRole('button', { name: /Guardar Borrador/i }));

        await waitFor(() => {
            expect(screen.getByText(/El título es obligatorio/i)).toBeInTheDocument();
        });

        expect(mockOnSubmit).not.toHaveBeenCalled();
    });

    it('submits correctly when valid', async () => {
        const user = userEvent.setup();
        render(<NewsForm onSubmit={mockOnSubmit} />);

        await user.type(screen.getByLabelText(/Título/i), 'Test Title');
        const select = screen.getByLabelText(/Alcance/i);
        await user.selectOptions(select, 'INTERNAL_ASOCIACION');

        const submitBtn = screen.getByRole('button', { name: /Guardar Borrador/i });
        await user.click(submitBtn);

        await waitFor(() => {
            expect(mockOnSubmit).toHaveBeenCalledWith(expect.objectContaining({
                title: 'Test Title',
                scope: 'INTERNAL_ASOCIACION'
            }));
        });
    });
});
