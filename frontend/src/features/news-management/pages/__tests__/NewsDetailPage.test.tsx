
import { render, screen, waitFor } from '@testing-library/react';
import { MemoryRouter, Route, Routes } from 'react-router-dom';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { NewsDetailPage } from '../NewsDetailPage';
import * as newsApi from '../../api/news';
import type { NewsArticle } from '../../types';

// [Feature: News Management] [Story: NEWS-VIEW-002] [Ticket: NEWS-VIEW-002-FE-T03]

vi.mock('../../api/news');

const mockArticle: NewsArticle = {
    id: '123',
    title: 'Test Article',
    summary: 'Test Summary',
    content: '<p>Test Content</p>',
    cover_url: 'http://example.com/image.jpg',
    status: 'PUBLISHED',
    scope: 'GENERAL',
    author_id: '456',
    published_at: '2024-01-01T10:00:00Z',
    created_at: '2024-01-01T10:00:00Z',
    updated_at: '2024-01-01T10:00:00Z',
};

describe('NewsDetailPage', () => {
    beforeEach(() => {
        vi.resetAllMocks();
    });

    it('renders article detail correctly', async () => {
        vi.mocked(newsApi.getNewsArticle).mockResolvedValue(mockArticle);

        render(
            <MemoryRouter initialEntries={['/news/123']}>
                <Routes>
                    <Route path="/news/:id" element={<NewsDetailPage />} />
                </Routes>
            </MemoryRouter>
        );

        await waitFor(() => {
            expect(screen.getByText('Test Article')).toBeInTheDocument();
            expect(screen.getByText('Test Content')).toBeInTheDocument();
        });
    });

    it('shows internal badge for internal scope', async () => {
        vi.mocked(newsApi.getNewsArticle).mockResolvedValue({
            ...mockArticle,
            scope: 'INTERNAL_ASOCIACION',
        });

        render(
            <MemoryRouter initialEntries={['/news/123']}>
                <Routes>
                    <Route path="/news/:id" element={<NewsDetailPage />} />
                </Routes>
            </MemoryRouter>
        );

        await waitFor(() => {
            expect(screen.getByText('Internal Only')).toBeInTheDocument();
        });
    });

    it('shows access denied for 403 error', async () => {
        vi.mocked(newsApi.getNewsArticle).mockRejectedValue({
            response: { status: 403 },
        });

        render(
            <MemoryRouter initialEntries={['/news/123']}>
                <Routes>
                    <Route path="/news/:id" element={<NewsDetailPage />} />
                </Routes>
            </MemoryRouter>
        );

        await waitFor(() => {
            expect(screen.getByText(/Access Denied/i)).toBeInTheDocument();
        });
    });

    it('shows not found for 404 error', async () => {
        vi.mocked(newsApi.getNewsArticle).mockRejectedValue({
            response: { status: 404 },
        });

        render(
            <MemoryRouter initialEntries={['/news/123']}>
                <Routes>
                    <Route path="/news/:id" element={<NewsDetailPage />} />
                </Routes>
            </MemoryRouter>
        );

        await waitFor(() => {
            expect(screen.getByText(/Not Found/i)).toBeInTheDocument();
        });
    });
});
