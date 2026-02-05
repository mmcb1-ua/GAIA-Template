// [Feature: News Management] [Story: NEWS-ADMIN-001] [Ticket: NEWS-ADMIN-001-FE-T03]
import React, { useState } from 'react';
import { NewsForm } from '../components/NewsForm';
import { createNewsArticle } from '../api/news';
import { type NewsFormData } from '../schema';
import { useNavigate } from 'react-router-dom';

export const CreateNewsPage: React.FC = () => {
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const navigate = useNavigate();

    const handleCreate = async (data: NewsFormData) => {
        setIsSubmitting(true);
        setError(null);
        try {
            await createNewsArticle(data);
            // On success, redirect to list (TBD in next tickets)
            alert('Noticia guardada como borrador localmente (Simulado)');
            navigate('/admin/news');
        } catch (err: any) {
            setError(err.response?.data?.message || 'Error al guardar la noticia');
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="container py-10">
            <div className="flex flex-col gap-2 mb-8 border-b pb-6">
                <h1 className="text-3xl font-bold tracking-tight text-brand-navy">Crear Nueva Noticia</h1>
                <p className="text-brand-gray">Completa los campos para crear un nuevo borrador de noticia.</p>
            </div>

            {error && (
                <div className="mb-6 p-4 bg-red-50 border border-red-200 text-red-700 rounded-md flex items-center gap-2">
                    <span>{error}</span>
                </div>
            )}

            <NewsForm
                onSubmit={handleCreate}
                isLoading={isSubmitting}
                onCancel={() => navigate('/admin/news')}
            />
        </div>
    );
};
