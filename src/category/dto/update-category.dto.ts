import { z } from 'zod';

export const UpdateategorySchema = z.object({
    name: z.string().min(1, 'Name is required'),
});

export type UpdateCategoryDto = z.infer<typeof UpdateategorySchema>;
