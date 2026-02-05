// [Feature: News Management] [Story: NEWS-ADMIN-001] [Ticket: NEWS-ADMIN-001-FE-T03]

export type NewsStatus = 'DRAFT' | 'PUBLISHED' | 'ARCHIVED';
export type NewsScope = 'GENERAL' | 'INTERNAL_ASOCIACION';

export interface NewsArticle {
    id: string;
    title: string;
    summary: string | null;
    content: string | null;
    cover_url: string | null;
    status: NewsStatus;
    scope: NewsScope;
    author_id: string;
    published_at: string | null;
    created_at: string;
    updated_at: string;
}

export interface NewsCreate {
    title: string;
    summary?: string;
    content?: string;
    cover_url?: string;
    scope: NewsScope;
}
