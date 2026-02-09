import { z } from 'zod';

export const updateMessageSchema = z.object({
    content: z.string().min(1),
});

export const sendMessageSchema = z.object({
    content: z.string().min(1),
    type: z.enum(['text', 'image', 'file', 'system']).optional(),
    replyToId: z.number(),
    attachmentIds: z.array(z.number()),
});
