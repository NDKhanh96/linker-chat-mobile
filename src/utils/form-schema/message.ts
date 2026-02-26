import { z } from 'zod';

export const updateMessageSchema = z.object({
    content: z.string().min(1),
});

export const sendMessageSchema = z.object({
    content: z.string().min(1),
    attachmentIds: z.array(z.number()).optional(),
});
