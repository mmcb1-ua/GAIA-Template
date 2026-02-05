// [Feature: News Management] [Story: NEWS-VIEW-001] [Ticket: NEWS-ADMIN-002-FE-T03]
import React, { useEffect, useState } from 'react';
import { getNewsArticles, deleteNewsArticle } from '../api/news';
import type { NewsArticle } from '../types';
import { NewsStatusBadge } from '../components/NewsStatusBadge';
import { PublishButton } from '../components/PublishButton';
import { Plus, Newspaper, Edit2, Trash2, AlertCircle } from 'lucide-react';
import { Link } from 'react-router-dom';

export const NewsAdminPage: React.FC = () => {
    const [articles, setArticles] = useState<NewsArticle[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [isDeleting, setIsDeleting] = useState<string | null>(null); // ID of article being deleted
    const [deleteError, setDeleteError] = useState<string | null>(null);

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

    const handleDelete = async (id: string) => {
        setDeleteError(null);
        try {
            await deleteNewsArticle(id);
            setArticles(prev => prev.filter(a => a.id !== id));
            setIsDeleting(null);
        } catch (err) {
            console.error('Failed to delete news:', err);
            setDeleteError('No se pudo eliminar la noticia. Por favor, intenta de nuevo.');
        }
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
                                                <Link
                                                    to={`/admin/news/edit/${article.id}`}
                                                    className="p-1.5 text-brand-gray hover:text-brand-navy hover:bg-black/5 rounded transition-colors"
                                                    title="Editar"
                                                >
                                                    <Edit2 className="w-4 h-4" />
                                                </Link>
                                                <button
                                                    onClick={() => setIsDeleting(article.id)}
                                                    className="p-1.5 text-brand-gray hover:text-destructive hover:bg-destructive/10 rounded transition-colors"
                                                    title="Eliminar"
                                                >
                                                    <Trash2 className="w-4 h-4" />
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            )}

            {/* Delete Confirmation Modal */}
            {isDeleting && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
                    <div className="bg-white rounded-xl shadow-xl max-w-md w-full p-6 animate-in fade-in zoom-in duration-200">
                        <div className="flex items-center gap-3 text-destructive mb-4">
                            <AlertCircle className="w-6 h-6" />
                            <h3 className="text-xl font-bold">¿Eliminar noticia?</h3>
                        </div>

                        <p className="text-brand-gray mb-6">
                            Esta acción marcará la noticia como eliminada y ya no será visible para los usuarios.
                        </p>

                        {deleteError && (
                            <div className="mb-4 p-3 bg-red-50 border border-red-100 text-red-600 text-sm rounded flex items-center gap-2">
                                <AlertCircle className="w-4 h-4 flex-shrink-0" />
                                {deleteError}
                            </div>
                        )}

                        <div className="flex items-center justify-end gap-3">
                            <button
                                onClick={() => {
                                    setIsDeleting(null);
                                    setDeleteError(null);
                                }}
                                className="px-4 py-2 text-brand-navy hover:bg-black/5 rounded-md transition-colors"
                            >
                                Cancelar
                            </button>
                            <button
                                onClick={() => handleDelete(isDeleting)}
                                className="px-4 py-2 bg-destructive text-white rounded-md hover:bg-destructive/90 transition-colors font-medium"
                            >
                                Eliminar permanentemente
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};
