// [Feature: News Management] [Story: NEWS-VIEW-001] [Ticket: NEWS-ADMIN-002-FE-T03]
import React, { useEffect, useState } from 'react';
import { getNewsArticles } from '../api/news';
import type { NewsArticle } from '../types';
import { NewsStatusBadge } from '../components/NewsStatusBadge';
import { PublishButton } from '../components/PublishButton';
import { Plus, Newspaper } from 'lucide-react';
import { Link } from 'react-router-dom';

export const NewsAdminPage: React.FC = () => {
    const [articles, setArticles] = useState<NewsArticle[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const fetchArticles = async () => {
        setIsLoading(true);
        try {
            const data = await getNewsArticles();
            setArticles(data);
        } catch (err) {
            console.error('Failed to fetch news:', err);
            setError('Error al cargar las noticias. Por favor, intenta de nuevo.');
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        fetchArticles();
    }, []);

    const handlePublishSuccess = (updatedArticle: NewsArticle) => {
        setArticles(prev => prev.map(a => a.id === updatedArticle.id ? updatedArticle : a));
    };

    if (isLoading) {
        return (
            <div className="container py-10 flex flex-col items-center justify-center min-h-[400px]">
                <div className="animate-spin h-8 w-8 border-4 border-brand-terracotta border-t-transparent rounded-full mb-4" />
                <p className="text-brand-gray">Cargando noticias...</p>
            </div>
        );
    }

    return (
        <div className="container py-10">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight text-brand-navy">Administración de Noticias</h1>
                    <p className="text-brand-gray mt-1">Gestiona los borradores y noticias publicadas de la asociación.</p>
                </div>
                <Link
                    to="/admin/news/create"
                    className="inline-flex items-center gap-2 px-4 py-2 bg-brand-terracotta-aa text-white rounded-md font-medium hover:bg-brand-terracotta transition-colors shadow-sm self-start sm:self-auto"
                >
                    <Plus className="w-4 h-4" />
                    Nueva Noticia
                </Link>
            </div>

            {error && (
                <div className="mb-6 p-4 bg-red-50 border border-red-200 text-red-700 rounded-md">
                    {error}
                </div>
            )}

            {articles.length === 0 ? (
                <div className="bg-brand-warm-white border border-dashed border-brand-gray/30 rounded-xl p-12 text-center">
                    <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-brand-gray/10 text-brand-gray mb-4">
                        <Newspaper className="w-6 h-6" />
                    </div>
                    <h3 className="text-lg font-medium text-brand-navy">No hay noticias</h3>
                    <p className="text-brand-gray mt-1">Empieza creando una nueva noticia para la asociación.</p>
                    <Link
                        to="/admin/news/create"
                        className="inline-flex items-center gap-2 mt-6 text-brand-terracotta-aa font-semibold hover:underline"
                    >
                        Crear primera noticia
                    </Link>
                </div>
            ) : (
                <div className="bg-white border border-brand-gray/20 rounded-xl shadow-sm overflow-hidden">
                    <div className="overflow-x-auto">
                        <table className="w-full text-left border-collapse">
                            <thead>
                                <tr className="bg-brand-warm-white border-b border-brand-gray/20">
                                    <th className="px-6 py-4 text-sm font-semibold text-brand-navy">Título</th>
                                    <th className="px-6 py-4 text-sm font-semibold text-brand-navy">Estado</th>
                                    <th className="px-6 py-4 text-sm font-semibold text-brand-navy">Alcance</th>
                                    <th className="px-6 py-4 text-sm font-semibold text-brand-navy">Fecha</th>
                                    <th className="px-6 py-4 text-sm font-semibold text-brand-navy text-right">Acciones</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-brand-gray/10">
                                {articles.map((article) => (
                                    <tr key={article.id} className="hover:bg-brand-warm-white/50 transition-colors">
                                        <td className="px-6 py-4">
                                            <div className="text-sm font-medium text-brand-navy line-clamp-1">{article.title}</div>
                                            <div className="text-xs text-brand-gray line-clamp-1 mt-0.5">{article.summary}</div>
                                        </td>
                                        <td className="px-6 py-4">
                                            <NewsStatusBadge status={article.status} />
                                        </td>
                                        <td className="px-6 py-4">
                                            <span className="text-xs text-brand-navy bg-brand-gray/10 px-2 py-1 rounded">
                                                {article.scope === 'GENERAL' ? 'Público' : 'Interno'}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4 text-xs text-brand-gray">
                                            {new Date(article.created_at).toLocaleDateString('es-ES')}
                                        </td>
                                        <td className="px-6 py-4 text-right">
                                            <div className="flex items-center justify-end gap-2">
                                                {article.status === 'DRAFT' && (
                                                    <PublishButton
                                                        newsId={article.id}
                                                        onSuccess={handlePublishSuccess}
                                                        className="scale-90"
                                                    />
                                                )}
                                                {/* Edit link could go here */}
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            )}
        </div>
    );
};
