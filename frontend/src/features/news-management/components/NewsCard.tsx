// [Feature: News Management] [Story: NEWS-VIEW-001] [Ticket: NEWS-VIEW-001-FE-T03]
import type { NewsArticle } from '../types';

interface NewsCardProps {
    article: NewsArticle;
    onClick?: () => void;
}

export function NewsCard({ article, onClick }: NewsCardProps) {
    const formattedDate = article.published_at
        ? new Date(article.published_at).toLocaleDateString('es-ES', {
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        })
        : '';

    return (
        <div
            onClick={onClick}
            className="bg-warmWhite rounded-lg overflow-hidden shadow-sm hover:shadow-md transition-shadow cursor-pointer group"
        >
            {article.cover_url && (
                <div className="aspect-video w-full overflow-hidden">
                    <img
                        src={article.cover_url}
                        alt={article.title}
                        loading="lazy"
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                </div>
            )}
            <div className="p-6">
                <h3 className="font-outfit text-xl font-semibold text-navyBlue group-hover:text-terracottaAA transition-colors mb-2">
                    {article.title}
                </h3>
                {formattedDate && (
                    <p className="text-sm text-gray-500 mb-3">
                        {formattedDate}
                    </p>
                )}
                {article.summary && (
                    <p className="text-gray-700 line-clamp-3">
                        {article.summary}
                    </p>
                )}
                {article.scope === 'INTERNAL_ASOCIACION' && (
                    <span className="inline-block mt-3 px-3 py-1 bg-navyBlue text-white text-xs rounded-full">
                        Solo socios
                    </span>
                )}
            </div>
        </div>
    );
}
