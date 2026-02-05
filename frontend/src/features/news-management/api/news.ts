import { http } from '../../../api/http';
import type { NewsArticle, NewsCreate } from '../types';

export const createNewsArticle = async (data: NewsCreate): Promise<NewsArticle> => {
    // [Feature: News Management] [Story: NEWS-ADMIN-001] [Ticket: NEWS-ADMIN-001-FE-T03]
    const response = await http.post<NewsArticle>('/news_articles', data);
    return response.data;
};

export const publishNewsArticle = async (id: string): Promise<NewsArticle> => {
    // [Feature: News Management] [Story: NEWS-ADMIN-002] [Ticket: NEWS-ADMIN-002-FE-T03]
    const response = await http.patch<NewsArticle>(`/news_articles/${id}/status`, {
        status: 'PUBLISHED'
    });
    return response.data;
};
export const getNewsArticles = async (): Promise<NewsArticle[]> => {
    // [Feature: News Management] [Story: NEWS-VIEW-001] [Ticket: NEWS-VIEW-001-BE-T02]
    const response = await http.get<NewsArticle[]>('/news_articles');
    return response.data;
};

export const getNewsArticle = async (id: string): Promise<NewsArticle> => {
    // [Feature: News Management] [Story: NEWS-ADMIN-003] [Ticket: NEWS-ADMIN-003-FE-T03]
    const response = await http.get<NewsArticle>(`/news_articles/${id}`);
    return response.data;
};

export const updateNewsArticle = async (id: string, data: Partial<NewsCreate>): Promise<NewsArticle> => {
    // [Feature: News Management] [Story: NEWS-ADMIN-003] [Ticket: NEWS-ADMIN-003-FE-T03]
    const response = await http.put<NewsArticle>(`/news_articles/${id}`, data);
    return response.data;
};

export const deleteNewsArticle = async (id: string): Promise<void> => {
    // [Feature: News Management] [Story: NEWS-ADMIN-003] [Ticket: NEWS-ADMIN-003-FE-T03]
    await http.delete(`/news_articles/${id}`);
};
