import React, { useState } from 'react';
import { Send, Check, AlertCircle } from 'lucide-react';
import { publishNewsArticle } from '../api/news';
import { cn } from '../../../lib/utils';

interface PublishButtonProps {
    newsId: string;
    onSuccess: (updatedArticle: any) => void;
    className?: string;
}

export const PublishButton: React.FC<PublishButtonProps> = ({ newsId, onSuccess, className }) => {
    // [Feature: News Management] [Story: NEWS-ADMIN-002] [Ticket: NEWS-ADMIN-002-FE-T03]

    const [isConfirming, setIsConfirming] = useState(false);
    const [isPublishing, setIsPublishing] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const handlePublish = async () => {
        setIsPublishing(true);
        setError(null);
        try {
            const updated = await publishNewsArticle(newsId);
            onSuccess(updated);
            setIsConfirming(false);
        } catch (err) {
            console.error('Failed to publish:', err);
            setError('Hubo un error al publicar la noticia. Inténtalo de nuevo.');
        } finally {
            setIsPublishing(false);
        }
    };

    return (
        <div className={cn('relative', className)}>
            {!isConfirming ? (
                <button
                    type="button"
                    onClick={() => setIsConfirming(true)}
                    className="inline-flex items-center gap-2 px-4 py-2 bg-brand-green text-brand-navy rounded-lg font-semibold hover:bg-brand-green/90 transition-colors shadow-sm"
                >
                    <Send className="w-4 h-4" />
                    Publicar Noticia
                </button>
            ) : (
                <div className="flex flex-col gap-3 p-4 bg-white border border-brand-green rounded-lg shadow-lg min-w-[300px] z-10">
                    <div className="flex items-start gap-2">
                        <AlertCircle className="w-5 h-5 text-brand-terracotta shrink-0 mt-0.5" />
                        <div>
                            <p className="text-sm font-semibold text-brand-navy">¿Confirmar publicación?</p>
                            <p className="text-xs text-brand-gray mt-1">
                                La noticia será visible para todos los usuarios según su alcance.
                            </p>
                        </div>
                    </div>

                    {error && (
                        <p className="text-xs text-red-600 bg-red-50 p-2 rounded">{error}</p>
                    )}

                    <div className="flex justify-end gap-2 mt-1">
                        <button
                            type="button"
                            disabled={isPublishing}
                            onClick={() => setIsConfirming(false)}
                            className="px-3 py-1.5 text-xs text-brand-gray hover:text-brand-navy transition-colors disabled:opacity-50"
                        >
                            Cancelar
                        </button>
                        <button
                            type="button"
                            disabled={isPublishing}
                            onClick={handlePublish}
                            className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs bg-brand-green text-brand-navy rounded-md font-semibold hover:bg-brand-green/90 transition-colors disabled:opacity-50"
                        >
                            {isPublishing ? (
                                <span className="flex items-center gap-1.5">
                                    <span className="animate-spin h-3 w-3 border-2 border-brand-navy border-t-transparent rounded-full" />
                                    Publicando...
                                </span>
                            ) : (
                                <>
                                    <Check className="w-3.5 h-3.5" />
                                    Confirmar y Publicar
                                </>
                            )}
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
};
