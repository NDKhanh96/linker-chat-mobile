import { z } from 'zod';

export const errorHttpSchema = z.object({
    message: z.string(),
    statusCode: z.number(),
    error: z.string(),
});
