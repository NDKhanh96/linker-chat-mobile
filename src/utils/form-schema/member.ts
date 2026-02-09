import { z } from 'zod';

export const addConversationMemberSchema = z.object({
    userIds: z.array(z.number()).min(1),
    role: z.enum(['member', 'admin']).optional(),
});

export const updateConversationMemberScheme = z.object({
    lastReadMessageId: z.number().optional(),
});
