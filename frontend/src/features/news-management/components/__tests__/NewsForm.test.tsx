// [Feature: News Management] [Story: NEWS-ADMIN-001] [Ticket: NEWS-ADMIN-001-FE-T03]
import { render, screen, waitFor, fireEvent } from '@testing-library/react';
import { vi, expect, it, describe, beforeEach } from 'vitest';
import { MemoryRouter } from 'react-router-dom';
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

    beforeEach(() => {
        vi.clearAllMocks();
    });

    it('renders correctly with all fields', () => {
        render(
            <MemoryRouter>
                <NewsForm onSubmit={mockOnSubmit} />
            </MemoryRouter>
        );

        expect(screen.getByLabelText(/Título/i)).toBeInTheDocument();
        expect(screen.getByLabelText(/Alcance/i)).toBeInTheDocument();
        expect(screen.getByLabelText(/Resumen/i)).toBeInTheDocument();
        expect(screen.getByLabelText(/Contenido/i)).toBeInTheDocument();
        expect(screen.getByRole('button', { name: /Guardar Borrador/i })).toBeInTheDocument();
    });

    it('shows validation error when title is empty', async () => {
        render(
            <MemoryRouter>
                <NewsForm onSubmit={mockOnSubmit} />
            </MemoryRouter>
        );

        fireEvent.click(screen.getByRole('button', { name: /Guardar Borrador/i }));

        await waitFor(() => {
            expect(screen.getByText(/El título es obligatorio/i)).toBeInTheDocument();
        });

        expect(mockOnSubmit).not.toHaveBeenCalled();
    });

    it('submits correctly when valid', async () => {
        render(
            <MemoryRouter>
                <NewsForm onSubmit={mockOnSubmit} />
            </MemoryRouter>
        );

        fireEvent.change(screen.getByLabelText(/Título/i), { target: { value: 'Test Title' } });

        const submitBtn = screen.getByRole('button', { name: /Guardar Borrador/i });
        fireEvent.click(submitBtn);

        await waitFor(() => {
            expect(mockOnSubmit).toHaveBeenCalled();
        }, { timeout: 3000 });
    });
});
