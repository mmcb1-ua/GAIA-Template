// [Feature: News Management] [Story: NEWS-VIEW-001] [Ticket: NEWS-VIEW-001-FE-T03]
import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { NewsCard } from '../NewsCard';
import type { NewsArticle } from '../../types';

describe('NewsCard', () => {
    const mockArticle: NewsArticle = {
        id: '123',
        title: 'Test News Article',
        summary: 'This is a test summary',
        content: 'Full content here',
        cover_url: 'https://example.com/image.jpg',
        status: 'PUBLISHED',
        scope: 'GENERAL',
        author_id: 'author-123',
        published_at: '2026-02-05T12:00:00Z',
        created_at: '2026-02-05T10:00:00Z',
        updated_at: '2026-02-05T11:00:00Z'
    };

    it('renders article title', () => {
        render(<NewsCard article={mockArticle} />);
        expect(screen.getByText('Test News Article')).toBeInTheDocument();
    });

    it('renders article summary', () => {
        render(<NewsCard article={mockArticle} />);
        expect(screen.getByText('This is a test summary')).toBeInTheDocument();
    });

    it('renders cover image when provided', () => {
        render(<NewsCard article={mockArticle} />);
        const img = screen.getByAltText('Test News Article');
        expect(img).toBeInTheDocument();
        expect(img).toHaveAttribute('src', 'https://example.com/image.jpg');
        expect(img).toHaveAttribute('loading', 'lazy');
    });

    it('renders formatted date', () => {
        render(<NewsCard article={mockArticle} />);
        // Date should be formatted in Spanish locale
        expect(screen.getByText(/febrero/i)).toBeInTheDocument();
    });

    it('shows "Solo socios" badge for internal articles', () => {
        const internalArticle = { ...mockArticle, scope: 'INTERNAL_ASOCIACION' as const };
        render(<NewsCard article={internalArticle} />);
        expect(screen.getByText('Solo socios')).toBeInTheDocument();
    });

    it('does not show badge for general articles', () => {
        render(<NewsCard article={mockArticle} />);
        expect(screen.queryByText('Solo socios')).not.toBeInTheDocument();
    });
});
