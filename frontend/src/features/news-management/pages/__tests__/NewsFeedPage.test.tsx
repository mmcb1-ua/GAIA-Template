// [Feature: News Management] [Story: NEWS-VIEW-001] [Ticket: NEWS-VIEW-001-FE-T03]
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { NewsFeedPage } from '../NewsFeedPage';
import * as newsApi from '../../api/news';
import type { NewsArticle, NewsFeedResponse } from '../../types';

vi.mock('../../api/news');

describe('NewsFeedPage', () => {
    const mockArticles: NewsArticle[] = [
        {
            id: '1',
            title: 'Article 1',
            summary: 'Summary 1',
            content: 'Content 1',
            cover_url: null,
            status: 'PUBLISHED',
            scope: 'GENERAL',
            author_id: 'author-1',
            published_at: '2026-02-05T12:00:00Z',
            created_at: '2026-02-05T10:00:00Z',
            updated_at: '2026-02-05T11:00:00Z'
        },
        {
            id: '2',
            title: 'Article 2',
            summary: 'Summary 2',
            content: 'Content 2',
            cover_url: null,
            status: 'PUBLISHED',
            scope: 'GENERAL',
            author_id: 'author-2',
            published_at: '2026-02-04T12:00:00Z',
            created_at: '2026-02-04T10:00:00Z',
            updated_at: '2026-02-04T11:00:00Z'
        }
    ];

    beforeEach(() => {
        vi.clearAllMocks();
    });

    it('renders loading state initially', () => {
        vi.mocked(newsApi.getNewsFeed).mockImplementation(() => new Promise(() => { }));
        render(<NewsFeedPage />);
        expect(screen.getByText('Cargando noticias...')).toBeInTheDocument();
    });

    it('renders articles after loading', async () => {
        const mockResponse: NewsFeedResponse = {
            items: mockArticles,
            total: 2,
            limit: 12,
            offset: 0
        };
        vi.mocked(newsApi.getNewsFeed).mockResolvedValue(mockResponse);

        render(<NewsFeedPage />);

        await waitFor(() => {
            expect(screen.getByText('Article 1')).toBeInTheDocument();
            expect(screen.getByText('Article 2')).toBeInTheDocument();
        });
    });

    it('renders empty state when no articles', async () => {
        const mockResponse: NewsFeedResponse = {
            items: [],
            total: 0,
            limit: 12,
            offset: 0
        };
        vi.mocked(newsApi.getNewsFeed).mockResolvedValue(mockResponse);

        render(<NewsFeedPage />);

        await waitFor(() => {
            expect(screen.getByText('No hay noticias publicadas')).toBeInTheDocument();
        });
    });

    it('loads more articles when button is clicked', async () => {
        // Return exactly 12 items to show "Load More" button
        const firstPageArticles = Array.from({ length: 12 }, (_, i) => ({
            id: `${i + 1}`,
            title: `Article ${i + 1}`,
            summary: `Summary ${i + 1}`,
            content: `Content ${i + 1}`,
            cover_url: null,
            status: 'PUBLISHED' as const,
            scope: 'GENERAL' as const,
            author_id: `author-${i + 1}`,
            published_at: '2026-02-05T12:00:00Z',
            created_at: '2026-02-05T10:00:00Z',
            updated_at: '2026-02-05T11:00:00Z'
        }));

        const firstResponse: NewsFeedResponse = {
            items: firstPageArticles,
            total: 12,
            limit: 12,
            offset: 0
        };

        const secondResponse: NewsFeedResponse = {
            items: [
                {
                    id: '13',
                    title: 'Article 13',
                    summary: 'Summary 13',
                    content: 'Content 13',
                    cover_url: null,
                    status: 'PUBLISHED',
                    scope: 'GENERAL',
                    author_id: 'author-13',
                    published_at: '2026-02-03T12:00:00Z',
                    created_at: '2026-02-03T10:00:00Z',
                    updated_at: '2026-02-03T11:00:00Z'
                }
            ],
            total: 1,
            limit: 12,
            offset: 12
        };

        vi.mocked(newsApi.getNewsFeed)
            .mockResolvedValueOnce(firstResponse)
            .mockResolvedValueOnce(secondResponse);

        render(<NewsFeedPage />);

        // Wait for first page to load
        await waitFor(() => {
            expect(screen.getByText('Article 1')).toBeInTheDocument();
        });

        // Button should be visible since we have exactly 12 items
        const loadMoreButton = screen.getByText('Cargar más');
        expect(loadMoreButton).toBeInTheDocument();

        // Click to load more
        await userEvent.click(loadMoreButton);

        // Wait for new article to appear
        await waitFor(() => {
            expect(screen.getByText('Article 13')).toBeInTheDocument();
        });

        // Button should be hidden now since second response had < 12 items
        await waitFor(() => {
            expect(screen.queryByText('Cargar más')).not.toBeInTheDocument();
        });
    });

    it('hides load more button when no more articles', async () => {
        // Return less than 12 items
        const mockResponse: NewsFeedResponse = {
            items: [mockArticles[0]],
            total: 1,
            limit: 12,
            offset: 0
        };
        vi.mocked(newsApi.getNewsFeed).mockResolvedValue(mockResponse);

        render(<NewsFeedPage />);

        await waitFor(() => {
            expect(screen.getByText('Article 1')).toBeInTheDocument();
        });

        // Button should not be present since we have < 12 items
        expect(screen.queryByText('Cargar más')).not.toBeInTheDocument();
    });
});
