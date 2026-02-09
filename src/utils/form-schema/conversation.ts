import { z } from 'zod';

export const createConversationSchema = z.object({
    type: z.enum(['direct', 'group']),
    title: z.string().optional(),
    avatar: z.string().optional(),
    description: z.string().optional(),
    memberIds: z.array(z.number()).min(1),
});
