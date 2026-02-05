// [Feature: News Management] [Story: NEWS-VIEW-001] [Ticket: NEWS-VIEW-001-FE-T03]
import { useState, useEffect } from 'react';
import { NewsCard } from '../components/NewsCard';
import { getNewsFeed } from '../api/news';
import type { NewsArticle } from '../types';

export function NewsFeedPage() {
    const [articles, setArticles] = useState<NewsArticle[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [offset, setOffset] = useState(0);
    const [hasMore, setHasMore] = useState(true);
    const LIMIT = 12;

    const loadArticles = async (currentOffset: number) => {
        try {
            setLoading(true);
            const response = await getNewsFeed(LIMIT, currentOffset);

            if (currentOffset === 0) {
                setArticles(response.items);
            } else {
                setArticles(prev => [...prev, ...response.items]);
            }

            setHasMore(response.items.length === LIMIT);
            setError(null);
        } catch (err) {
            setError('Error al cargar las noticias');
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        loadArticles(0);
    }, []);

    const handleLoadMore = () => {
        const newOffset = offset + LIMIT;
        setOffset(newOffset);
        loadArticles(newOffset);
    };

    if (loading && articles.length === 0) {
        return (
            <div className="container mx-auto px-4 py-8">
                <div className="text-center text-gray-600">
                    Cargando noticias...
                </div>
            </div>
        );
    }

    if (error && articles.length === 0) {
        return (
            <div className="container mx-auto px-4 py-8">
                <div className="text-center text-red-600">
                    {error}
                </div>
            </div>
        );
    }

    if (articles.length === 0) {
        return (
            <div className="container mx-auto px-4 py-8">
                <div className="text-center text-gray-600">
                    <p className="text-xl font-outfit">No hay noticias publicadas</p>
                </div>
            </div>
        );
    }

    return (
        <div className="container mx-auto px-4 py-8">
            <h1 className="text-4xl font-outfit font-bold text-navyBlue mb-8">
                Noticias
            </h1>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
                {articles.map((article) => (
                    <NewsCard
                        key={article.id}
                        article={article}
                        onClick={() => {
                            // Future: navigate to detail page
                            console.log('Navigate to article:', article.id);
                        }}
                    />
                ))}
            </div>

            {hasMore && (
                <div className="text-center">
                    <button
                        onClick={handleLoadMore}
                        disabled={loading}
                        className="px-6 py-3 bg-terracottaAA text-white font-outfit rounded-lg hover:bg-opacity-90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        {loading ? 'Cargando...' : 'Cargar más'}
                    </button>
                </div>
            )}
        </div>
    );
}
