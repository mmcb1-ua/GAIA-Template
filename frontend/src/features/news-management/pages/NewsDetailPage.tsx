
import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getNewsArticle } from '../api/news';
import type { NewsArticle } from '../types';
import DOMPurify from 'dompurify';
import { NewsStatusBadge } from '../components/NewsStatusBadge';
import { ChevronLeft, Shield } from 'lucide-react';

// [Feature: News Management] [Story: NEWS-VIEW-002] [Ticket: NEWS-VIEW-002-FE-T03]

export const NewsDetailPage: React.FC = () => {
    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();
    const [article, setArticle] = useState<NewsArticle | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchArticle = async () => {
            if (!id) return;
            try {
                const data = await getNewsArticle(id);
                setArticle(data);
            } catch (err: any) {
                if (err.response?.status === 404) {
                    setError('Not Found');
                } else if (err.response?.status === 403) {
                    setError('Access Denied');
                } else {
                    setError('Failed to load article');
                }
            } finally {
                setLoading(false);
            }
        };
        fetchArticle();
    }, [id]);

    if (loading) {
        return (
            <div className="flex justify-center items-center min-h-[50vh]">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary-600"></div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="flex flex-col items-center justify-center min-h-[50vh] text-center px-4">
                <h2 className="text-2xl font-bold text-gray-800 mb-2">{error}</h2>
                <button
                    onClick={() => navigate('/admin/news')} // Or generic news feed
                    className="text-primary-600 hover:text-primary-700 font-medium flex items-center gap-2"
                >
                    <ChevronLeft size={20} />
                    Back to News
                </button>
            </div>
        );
    }

    if (!article) return null;

    const sanitizedContent = DOMPurify.sanitize(article.content || '');

    return (
        <article className="max-w-4xl mx-auto px-4 py-8 animate-fade-in">
            {/* Navigation */}
            <button
                onClick={() => navigate('/admin/news')} // TODO: Link to public feed if public view?
                // Ticket says "Back button to Feed". 
                // If it's public view, /news. If admin, /admin/news? 
                // For now, let's assume /news (Public Feed) as default for "View News", 
                // but since we are in "admin/news" usually... 
                // Actually, this page will likely be mounted at /news/:id (Public) AND /admin/news/:id (Admin)?
                // The router currently has /admin/news. 
                // The ticket says "Back button to Feed".
                // I'll make it go back to history -1 or /news.
                className="mb-6 flex items-center text-gray-600 hover:text-primary-600 transition-colors"
            >
                <ChevronLeft size={20} className="mr-1" />
                Back to Feed
            </button>

            {/* Hero Image */}
            {article.cover_url && (
                <div className="w-full h-64 md:h-96 rounded-xl overflow-hidden mb-8 shadow-md">
                    <img
                        src={article.cover_url}
                        alt={article.title}
                        className="w-full h-full object-cover"
                    />
                </div>
            )}

            {/* Header */}
            <header className="mb-8">
                <div className="flex items-center gap-3 mb-4 flex-wrap">
                    <NewsStatusBadge status={article.status} />
                    {article.scope === 'INTERNAL_ASOCIACION' && (
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-amber-100 text-amber-800 border border-amber-200">
                            <Shield size={12} className="mr-1" />
                            Internal Only
                        </span>
                    )}
                    <span className="text-sm text-gray-500">
                        {new Date(article.published_at || article.created_at).toLocaleDateString()}
                    </span>
                </div>

                <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4 font-heading text-balance">
                    {article.title}
                </h1>

                {article.summary && (
                    <p className="text-xl text-gray-600 leading-relaxed font-light">
                        {article.summary}
                    </p>
                )}
            </header>

            {/* Content Body */}
            <div
                className="prose prose-lg prose-slate max-w-none 
                    prose-headings:font-heading prose-headings:font-bold prose-headings:text-slate-900
                    prose-a:text-primary-600 prose-a:no-underline hover:prose-a:underline
                    prose-img:rounded-lg prose-img:shadow-md"
                dangerouslySetInnerHTML={{ __html: sanitizedContent }}
            />

            {/* Author Footer */}
            <div className="mt-12 pt-8 border-t border-gray-200 text-sm text-gray-500 flex justify-between items-center">
                {/* Assuming author info might be enriched later. For now just ID or placeholder if not in DTO */}
                {/* DTO has author_id. API doesn't populate name yet in NewsResponse? */}
                {/* Check types.ts */}
            </div>
        </article>
    );
};
