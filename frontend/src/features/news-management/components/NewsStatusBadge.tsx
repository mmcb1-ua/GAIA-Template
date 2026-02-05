import React from 'react';
import { cn } from '../../../lib/utils';
import type { NewsStatus } from '../types';

interface NewsStatusBadgeProps {
    status: NewsStatus;
    className?: string;
}

export const NewsStatusBadge: React.FC<NewsStatusBadgeProps> = ({ status, className }) => {
    // [Feature: News Management] [Story: NEWS-ADMIN-002] [Ticket: NEWS-ADMIN-002-FE-T03]

    const config = {
        DRAFT: {
            label: 'Borrador',
            classes: 'bg-brand-gray/10 text-brand-gray border-brand-gray/20',
        },
        PUBLISHED: {
            label: 'Publicada',
            classes: 'bg-brand-green text-brand-navy border-brand-green-aa/30',
        },
        ARCHIVED: {
            label: 'Archivada',
            classes: 'bg-brand-navy/10 text-brand-navy border-brand-navy/20',
        },
    };

    const current = config[status];

    return (
        <span
            className={cn(
                'inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border transition-colors',
                current.classes,
                className
            )}
        >
            {current.label}
        </span>
    );
};
