import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { NewsAdminPage } from '../NewsAdminPage';
import * as newsApi from '../../api/news';
import { MemoryRouter } from 'react-router-dom';

// [Feature: News Management] [Story: NEWS-ADMIN-003] [Ticket: NEWS-ADMIN-003-FE-T03]

// Mock the API
vi.mock('../../api/news', () => ({
    getNewsArticles: vi.fn(),
    deleteNewsArticle: vi.fn(),
}));

const mockArticles = [
    {
        id: '1',
        title: 'News 1',
        summary: 'Summary 1',
        status: 'DRAFT',
        scope: 'GENERAL',
        created_at: '2026-02-05T00:00:00Z',
    },
    {
        id: '2',
        title: 'News 2',
        summary: 'Summary 2',
        status: 'PUBLISHED',
        scope: 'INTERNAL_ASOCIACION',
        created_at: '2026-02-05T00:00:00Z',
    }
];

describe('NewsAdminPage Delete Flow', () => {
    beforeEach(() => {
        vi.clearAllMocks();
        (newsApi.getNewsArticles as any).mockResolvedValue(mockArticles);
    });

    it('renders the list of articles', async () => {
        render(
            <MemoryRouter>
                <NewsAdminPage />
            </MemoryRouter>
        );

        await waitFor(() => {
            expect(screen.getByText('News 1')).toBeInTheDocument();
            expect(screen.getByText('News 2')).toBeInTheDocument();
        });
    });

    it('opens delete confirmation modal when delete button is clicked', async () => {
        render(
            <MemoryRouter>
                <NewsAdminPage />
            </MemoryRouter>
        );

        await waitFor(() => screen.getByText('News 1'));

        const deleteButtons = screen.getAllByTitle('Eliminar');
        fireEvent.click(deleteButtons[0]);

        expect(screen.getByText('¿Eliminar noticia?')).toBeInTheDocument();
        expect(screen.getByText('Eliminar permanentemente')).toBeInTheDocument();
    });

    it('calls delete API and removes item from list upon confirmation', async () => {
        (newsApi.deleteNewsArticle as any).mockResolvedValueOnce(undefined);

        render(
            <MemoryRouter>
                <NewsAdminPage />
            </MemoryRouter>
        );

        await waitFor(() => screen.getByText('News 1'));

        const deleteButtons = screen.getAllByTitle('Eliminar');
        fireEvent.click(deleteButtons[0]);

        const confirmButton = screen.getByText('Eliminar permanentemente');
        fireEvent.click(confirmButton);

        await waitFor(() => {
            expect(newsApi.deleteNewsArticle).toHaveBeenCalledWith('1');
            expect(screen.queryByText('News 1')).not.toBeInTheDocument();
        });
    });

    it('shows error message if deletion fails', async () => {
        (newsApi.deleteNewsArticle as any).mockRejectedValueOnce(new Error('Delete Failed'));

        render(
            <MemoryRouter>
                <NewsAdminPage />
            </MemoryRouter>
        );

        await waitFor(() => screen.getByText('News 1'));

        const deleteButtons = screen.getAllByTitle('Eliminar');
        fireEvent.click(deleteButtons[0]);

        const confirmButton = screen.getByText('Eliminar permanentemente');
        fireEvent.click(confirmButton);

        await waitFor(() => {
            expect(screen.getByText('No se pudo eliminar la noticia. Por favor, intenta de nuevo.')).toBeInTheDocument();
        });

        // Modal should still be open
        expect(screen.getByText('¿Eliminar noticia?')).toBeInTheDocument();
        // Item should still be in the list (though background)
        expect(screen.getByText('News 1')).toBeInTheDocument();
    });
});
