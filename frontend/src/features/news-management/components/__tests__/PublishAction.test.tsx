import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { PublishButton } from '../PublishButton';
import * as newsApi from '../../api/news';

// Mock the API
vi.mock('../../api/news', () => ({
    publishNewsArticle: vi.fn(),
}));

describe('PublishButton', () => {
    // [Feature: News Management] [Story: NEWS-ADMIN-002] [Ticket: NEWS-ADMIN-002-FE-T03]

    const mockOnSuccess = vi.fn();
    const newsId = 'test-id';

    beforeEach(() => {
        vi.clearAllMocks();
    });

    it('renders the publish button initially', () => {
        render(<PublishButton newsId={newsId} onSuccess={mockOnSuccess} />);
        expect(screen.getByText('Publicar Noticia')).toBeInTheDocument();
    });

    it('opens confirmation modal when clicked', () => {
        render(<PublishButton newsId={newsId} onSuccess={mockOnSuccess} />);
        fireEvent.click(screen.getByText('Publicar Noticia'));
        expect(screen.getByText('¿Confirmar publicación?')).toBeInTheDocument();
        expect(screen.getByText('Confirmar y Publicar')).toBeInTheDocument();
    });

    it('cancels confirmation when Cancelar is clicked', () => {
        render(<PublishButton newsId={newsId} onSuccess={mockOnSuccess} />);
        fireEvent.click(screen.getByText('Publicar Noticia'));
        fireEvent.click(screen.getByText('Cancelar'));
        expect(screen.queryByText('¿Confirmar publicación?')).not.toBeInTheDocument();
        expect(screen.getByText('Publicar Noticia')).toBeInTheDocument();
    });

    it('calls publish API and triggers onSuccess when confirmed', async () => {
        const mockUpdatedArticle = { id: newsId, status: 'PUBLISHED' };
        (newsApi.publishNewsArticle as any).mockResolvedValueOnce(mockUpdatedArticle);

        render(<PublishButton newsId={newsId} onSuccess={mockOnSuccess} />);
        fireEvent.click(screen.getByText('Publicar Noticia'));
        fireEvent.click(screen.getByText('Confirmar y Publicar'));

        expect(screen.getByText('Publicando...')).toBeInTheDocument();

        await waitFor(() => {
            expect(newsApi.publishNewsArticle).toHaveBeenCalledWith(newsId);
            expect(mockOnSuccess).toHaveBeenCalledWith(mockUpdatedArticle);
        });
    });

    it('shows error message if API fails', async () => {
        (newsApi.publishNewsArticle as any).mockRejectedValueOnce(new Error('API Error'));

        render(<PublishButton newsId={newsId} onSuccess={mockOnSuccess} />);
        fireEvent.click(screen.getByText('Publicar Noticia'));
        fireEvent.click(screen.getByText('Confirmar y Publicar'));

        await waitFor(() => {
            expect(screen.getByText('Hubo un error al publicar la noticia. Inténtalo de nuevo.')).toBeInTheDocument();
        });

        expect(mockOnSuccess).not.toHaveBeenCalled();
    });
});
