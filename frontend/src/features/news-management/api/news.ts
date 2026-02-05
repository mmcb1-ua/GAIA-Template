import { http } from '../../../api/http';
import { NewsArticle, NewsCreate } from '../types';

export const createNewsArticle = async (data: NewsCreate): Promise<NewsArticle> => {
    // [Feature: News Management] [Story: NEWS-ADMIN-001] [Ticket: NEWS-ADMIN-001-FE-T03]
    const response = await http.post<NewsArticle>('/news_articles', data);
    return response.data;
};
