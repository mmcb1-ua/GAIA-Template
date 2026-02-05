import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { EditNewsPage } from '../EditNewsPage';
import * as newsApi from '../../api/news';
import { MemoryRouter, Route, Routes } from 'react-router-dom';

// [Feature: News Management] [Story: NEWS-ADMIN-003] [Ticket: NEWS-ADMIN-003-FE-T03]

// Mock the API
vi.mock('../../api/news', () => ({
    getNewsArticle: vi.fn(),
    updateNewsArticle: vi.fn(),
}));

// Mock ReactQuill to avoid findDOMNode error
vi.mock('react-quill', () => ({
    default: (props: any) => (
        <textarea
            aria-label="Contenido"
            value={props.value}
            onChange={(e) => props.onChange(e.target.value)}
        />
    ),
}));

const mockArticle = {
    id: 'test-id',
    title: 'Original Title',
    summary: 'Original Summary',
    content: '<p>Original Content</p>',
    status: 'DRAFT',
    scope: 'GENERAL',
    author_id: 'author-1',
    created_at: '2026-02-05T00:00:00Z',
    updated_at: '2026-02-05T00:00:00Z'
};

const renderWithRouter = () => {
    return render(
        <MemoryRouter initialEntries={['/admin/news/edit/test-id']}>
            <Routes>
                <Route path="/admin/news/edit/:id" element={<EditNewsPage />} />
                <Route path="/admin/news" element={<div>Admin News List</div>} />
            </Routes>
        </MemoryRouter>
    );
};

describe('EditNewsPage', () => {
    beforeEach(() => {
        vi.clearAllMocks();
    });

    it('fetches and displays article data on mount', async () => {
        (newsApi.getNewsArticle as any).mockResolvedValueOnce(mockArticle);

        renderWithRouter();

        expect(screen.getByText('Cargando noticia...')).toBeInTheDocument();

        await waitFor(() => {
            expect(newsApi.getNewsArticle).toHaveBeenCalledWith('test-id');
            expect(screen.getByDisplayValue('Original Title')).toBeInTheDocument();
            expect(screen.getByDisplayValue('Original Summary')).toBeInTheDocument();
        });
    });

    it('submits updated data and navigates back to list', async () => {
        (newsApi.getNewsArticle as any).mockResolvedValueOnce(mockArticle);
        (newsApi.updateNewsArticle as any).mockResolvedValueOnce({ ...mockArticle, title: 'Updated Title' });

        renderWithRouter();

        await waitFor(() => screen.getByDisplayValue('Original Title'));

        const titleInput = screen.getByLabelText(/Título/i);
        fireEvent.change(titleInput, { target: { value: 'Updated Title' } });

        const submitButton = screen.getByText('Actualizar Borrador');
        fireEvent.click(submitButton);

        await waitFor(() => {
            expect(newsApi.updateNewsArticle).toHaveBeenCalledWith('test-id', expect.objectContaining({
                title: 'Updated Title'
            }));
            expect(screen.getByText('Admin News List')).toBeInTheDocument();
        });
    });

    it('shows error if fetch fails', async () => {
        (newsApi.getNewsArticle as any).mockRejectedValueOnce(new Error('Fetch error'));

        renderWithRouter();

        await waitFor(() => {
            expect(screen.getByText('No se pudo encontrar la noticia o hubo un error al cargarla.')).toBeInTheDocument();
        });
    });

    it('shows error if update fails', async () => {
        (newsApi.getNewsArticle as any).mockResolvedValueOnce(mockArticle);
        (newsApi.updateNewsArticle as any).mockRejectedValueOnce(new Error('Update error'));

        renderWithRouter();

        await waitFor(() => screen.getByDisplayValue('Original Title'));

        const submitButton = screen.getByText('Actualizar Borrador');
        fireEvent.click(submitButton);

        await waitFor(() => {
            expect(screen.getByText('Hubo un error al actualizar la noticia. Por favor, inténtalo de nuevo.')).toBeInTheDocument();
        });
    });
});
