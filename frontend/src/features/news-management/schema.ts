import { z } from 'zod';

export const newsSchema = z.object({
    title: z.string().min(1, 'El título es obligatorio').max(200, 'El título es demasiado largo'),
    summary: z.string().max(500, 'El resumen es demasiado largo').optional(),
    content: z.string().optional(),
    cover_url: z.string().url('Debe ser una URL válida').or(z.literal('')).optional(),
    scope: z.enum(['GENERAL', 'INTERNAL_ASOCIACION'], {
        errorMap: () => ({ message: 'Selecciona un alcance válido' }),
    }),
});

export type NewsFormData = z.infer<typeof newsSchema>;
