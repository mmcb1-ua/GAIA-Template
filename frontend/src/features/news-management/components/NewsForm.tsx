// [Feature: News Management] [Story: NEWS-ADMIN-001] [Ticket: NEWS-ADMIN-001-FE-T03]
import React from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { newsSchema, type NewsFormData } from '../schema';
import { cn } from '../../../lib/utils';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';

interface NewsFormProps {
    onSubmit: (data: NewsFormData) => void;
    initialData?: Partial<NewsFormData>;
    isLoading?: boolean;
}

export const NewsForm: React.FC<NewsFormProps> = ({ onSubmit, initialData, isLoading }) => {
    const {
        register,
        handleSubmit,
        setValue,
        watch,
        formState: { errors },
    } = useForm<NewsFormData>({
        resolver: zodResolver(newsSchema),
        defaultValues: {
            title: initialData?.title || '',
            summary: initialData?.summary || '',
            content: initialData?.content || '',
            cover_url: initialData?.cover_url || '',
            scope: initialData?.scope || 'GENERAL',
        },
    });

    const contentValue = watch('content');

    const onEditorChange = (content: string) => {
        setValue('content', content, { shouldValidate: true });
    };

    return (
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6 max-w-4xl mx-auto p-6 bg-brand-warm-white rounded-lg border border-brand-gray/20 shadow-sm">
            <div className="space-y-2">
                <label htmlFor="title" className="block text-sm font-medium text-brand-navy">
                    Título <span className="text-destructive">*</span>
                </label>
                <input
                    {...register('title')}
                    id="title"
                    type="text"
                    className={cn(
                        "w-full px-4 py-2 bg-white border rounded-md focus:ring-2 focus:ring-brand-terracotta/20 focus:border-brand-terracotta transition-colors",
                        errors.title ? "border-destructive" : "border-brand-gray/30"
                    )}
                    placeholder="Ej: Gran fiesta del barrio"
                />
                {errors.title && <p className="text-xs text-destructive">{errors.title.message}</p>}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                    <label htmlFor="scope" className="block text-sm font-medium text-brand-navy">
                        Alcance <span className="text-destructive">*</span>
                    </label>
                    <select
                        {...register('scope')}
                        id="scope"
                        className={cn(
                            "w-full px-4 py-2 bg-white border rounded-md focus:ring-2 focus:ring-brand-terracotta/20 focus:border-brand-terracotta transition-colors",
                            errors.scope ? "border-destructive" : "border-brand-gray/30"
                        )}
                    >
                        <option value="GENERAL">General (Público)</option>
                        <option value="INTERNAL_ASOCIACION">Interno (Solo Socios)</option>
                    </select>
                    {errors.scope && <p className="text-xs text-destructive">{errors.scope.message}</p>}
                </div>

                <div className="space-y-2">
                    <label htmlFor="cover_url" className="block text-sm font-medium text-brand-navy">
                        URL de Portada
                    </label>
                    <input
                        {...register('cover_url')}
                        id="cover_url"
                        type="text"
                        className={cn(
                            "w-full px-4 py-2 bg-white border rounded-md focus:ring-2 focus:ring-brand-terracotta/20 focus:border-brand-terracotta transition-colors",
                            errors.cover_url ? "border-destructive" : "border-brand-gray/30"
                        )}
                        placeholder="https://example.com/imagen.jpg"
                    />
                    {errors.cover_url && <p className="text-xs text-destructive">{errors.cover_url.message}</p>}
                </div>
            </div>

            <div className="space-y-2">
                <label htmlFor="summary" className="block text-sm font-medium text-brand-navy">
                    Resumen
                </label>
                <textarea
                    {...register('summary')}
                    id="summary"
                    rows={3}
                    className={cn(
                        "w-full px-4 py-2 bg-white border rounded-md focus:ring-2 focus:ring-brand-terracotta/20 focus:border-brand-terracotta transition-colors",
                        errors.summary ? "border-destructive" : "border-brand-gray/30"
                    )}
                    placeholder="Breve descripción para el listado..."
                />
                {errors.summary && <p className="text-xs text-destructive">{errors.summary.message}</p>}
            </div>

            <div className="space-y-2">
                <label className="block text-sm font-medium text-brand-navy">
                    Contenido
                </label>
                <div className="prose-sm bg-white rounded-md border border-brand-gray/30 overflow-hidden">
                    <ReactQuill
                        theme="snow"
                        value={contentValue}
                        onChange={onEditorChange}
                        modules={{
                            toolbar: [
                                [{ header: [1, 2, 3, false] }],
                                ['bold', 'italic', 'underline', 'strike'],
                                [{ list: 'ordered' }, { list: 'bullet' }],
                                ['link', 'clean'],
                            ],
                        }}
                        placeholder="Escribe el cuerpo de la noticia aquí..."
                    />
                </div>
            </div>

            <div className="pt-4 flex justify-end gap-4">
                <button
                    type="button"
                    className="px-6 py-2 border border-brand-gray/30 text-brand-navy rounded-md hover:bg-black/5 transition-colors"
                    disabled={isLoading}
                >
                    Cancelar
                </button>
                <button
                    type="submit"
                    disabled={isLoading}
                    className="px-6 py-2 bg-brand-terracotta-aa text-white rounded-md hover:bg-brand-terracotta transition-colors flex items-center gap-2"
                >
                    {isLoading ? 'Guardando...' : 'Guardar Borrador'}
                </button>
            </div>
        </form>
    );
};
