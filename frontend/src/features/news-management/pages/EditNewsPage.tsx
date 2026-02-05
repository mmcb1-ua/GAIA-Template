// [Feature: News Management] [Story: NEWS-ADMIN-003] [Ticket: NEWS-ADMIN-003-FE-T03]
import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getNewsArticle, updateNewsArticle } from '../api/news';
import { NewsForm } from '../components/NewsForm';
import { type NewsArticle } from '../types';
import { type NewsFormData } from '../schema';
import { ArrowLeft } from 'lucide-react';
import { Link } from 'react-router-dom';

export const EditNewsPage: React.FC = () => {
    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();
    const [article, setArticle] = useState<NewsArticle | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [isSaving, setIsSaving] = useState(false);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchArticle = async () => {
            if (!id) return;
            setIsLoading(true);
            try {
                const data = await getNewsArticle(id);
                setArticle(data);
            } catch (err) {
                console.error('Failed to fetch article:', err);
                setError('No se pudo encontrar la noticia o hubo un error al cargarla.');
            } finally {
                setIsLoading(false);
            }
        };

        fetchArticle();
    }, [id]);

    const handleSubmit = async (data: NewsFormData) => {
        if (!id) return;
        setIsSaving(true);
        setError(null);
        try {
            await updateNewsArticle(id, data);
            navigate('/admin/news');
        } catch (err) {
            console.error('Failed to update news:', err);
            setError('Hubo un error al actualizar la noticia. Por favor, inténtalo de nuevo.');
            setIsSaving(false);
        }
    };

    const handlePublishSuccess = (updated: NewsArticle) => {
        setArticle(updated);
    };

    if (isLoading) {
        return (
            <div className="container py-10 flex flex-col items-center justify-center min-h-[400px]">
                <div className="animate-spin h-8 w-8 border-4 border-brand-terracotta border-t-transparent rounded-full mb-4" />
                <p className="text-brand-gray text-sm">Cargando noticia...</p>
            </div>
        );
    }

    if (!article && !isLoading) {
        return (
            <div className="container py-10 max-w-4xl">
                <div className="bg-red-50 border border-red-200 text-red-700 p-6 rounded-lg text-center">
                    <h2 className="text-xl font-bold mb-2">Error</h2>
                    <p>{error || 'Noticia no encontrada'}</p>
                    <Link to="/admin/news" className="inline-flex items-center gap-2 mt-4 text-brand-navy hover:underline">
                        <ArrowLeft className="w-4 h-4" />
                        Volver al listado
                    </Link>
                </div>
            </div>
        );
    }

    return (
        <div className="container py-10 max-w-4xl">
            <div className="mb-8">
                <Link to="/admin/news" className="inline-flex items-center gap-2 text-brand-gray hover:text-brand-navy transition-colors mb-4">
                    <ArrowLeft className="w-4 h-4" />
                    Volver a administración
                </Link>
                <h1 className="text-3xl font-bold tracking-tight text-brand-navy">Editar Noticia</h1>
                <p className="text-brand-gray mt-1">Realiza cambios en el borrador o noticia publicada.</p>
            </div>

            {error && (
                <div className="mb-6 p-4 bg-red-50 border border-red-200 text-red-700 rounded-md">
                    {error}
                </div>
            )}

            {article && (
                <NewsForm
                    onSubmit={handleSubmit}
                    initialData={{
                        title: article.title,
                        summary: article.summary || '',
                        content: article.content || '',
                        cover_url: article.cover_url || '',
                        scope: article.scope,
                    }}
                    isLoading={isSaving}
                    status={article.status}
                    newsId={article.id}
                    onPublishSuccess={handlePublishSuccess}
                    onCancel={() => navigate('/admin/news')}
                />
            )}
        </div>
    );
};
