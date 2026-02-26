import { z } from 'zod';

import { Conversation, Profile } from 'src/services';
import { showToast } from '~/redux/slices';
import { SOCKET_NAMESPACES, subscribeSocketReady } from '~/services/socket';
import type { CursorPaginationResponse } from '~/types';
import { API } from '~utils/configs';
import { getFetchErrorMessage } from '~utils/error-handle';
import { sendMessageSchema, updateMessageSchema } from '~utils/form-schema';

const messageApi = API.injectEndpoints({
    endpoints: build => ({
        messageDetail: build.query<Message, { id: string | number }>({
            query: ({ id }) => ({
                url: `messages/${id}`,
                method: 'GET',
            }),

            onQueryStarted: async (_arg, { queryFulfilled, dispatch }) => {
                try {
                    await queryFulfilled;
                } catch (error) {
                    dispatch(showToast({ title: 'Error', description: getFetchErrorMessage(error), type: 'error' }));
                }
            },
        }),

        messageUpdate: build.mutation<Message, z.infer<typeof updateMessageSchema> & { id: string | number }>({
            query: ({ id, ...body }) => ({
                url: `messages/${id}`,
                method: 'PATCH',
                body,
            }),

            onQueryStarted: async (_arg, { queryFulfilled, dispatch }) => {
                try {
                    await queryFulfilled;
                } catch (error) {
                    dispatch(showToast({ title: 'Error', description: getFetchErrorMessage(error), type: 'error' }));
                }
            },
        }),

        messageDelete: build.mutation<void, { id: string | number }>({
            query: ({ id }) => ({
                url: `messages/${id}`,
                method: 'DELETE',
            }),

            onQueryStarted: async (_arg, { queryFulfilled, dispatch }) => {
                try {
                    await queryFulfilled;
                } catch (error) {
                    dispatch(showToast({ title: 'Error', description: getFetchErrorMessage(error), type: 'error' }));
                }
            },
        }),

        getUnreadSummary: build.query<UnreadSummary, void>({
            query: () => ({
                url: 'unread-summary/me',
                method: 'GET',
            }),

            onQueryStarted: async (_arg, { queryFulfilled, dispatch }) => {
                try {
                    await queryFulfilled;
                } catch (error) {
                    dispatch(showToast({ title: 'Error', description: getFetchErrorMessage(error), type: 'error' }));
                }
            },

            onCacheEntryAdded: async (_arg, { updateCachedData, cacheDataLoaded, cacheEntryRemoved }) => {
                await cacheDataLoaded;

                const unsubscribe = subscribeSocketReady(SOCKET_NAMESPACES.chat, sock => {
                    sock.on('unread:updated', (data: UnreadSummary) => {
                        updateCachedData(draft => {
                            draft.total = data.total;
                            draft.byConversation = data.byConversation;
                        });
                    });
                });

                await cacheEntryRemoved;
                unsubscribe();
            },
        }),

        sendMessage: build.mutation<Message, SendMessageBody>({
            query: ({ conversationId, ...body }) => ({
                url: `conversations/${conversationId}/messages`,
                method: 'POST',
                body,
            }),

            onQueryStarted: async (_arg, { queryFulfilled, dispatch }) => {
                try {
                    await queryFulfilled;
                } catch (error) {
                    dispatch(showToast({ title: 'Error', description: getFetchErrorMessage(error), type: 'error' }));
                }
            },
        }),

        messageList: build.query<CursorPaginationResponse<Message>, { id: string }>({
            query: ({ id }) => ({
                url: `conversations/${id}/messages`,
                method: 'GET',
            }),

            onQueryStarted: async (_arg, { queryFulfilled, dispatch }) => {
                try {
                    await queryFulfilled;
                } catch (error) {
                    dispatch(showToast({ title: 'Error', description: getFetchErrorMessage(error), type: 'error' }));
                }
            },

            onCacheEntryAdded: async ({ id }, { updateCachedData, cacheDataLoaded, cacheEntryRemoved }) => {
                await cacheDataLoaded;

                const unsubscribe = subscribeSocketReady(SOCKET_NAMESPACES.chat, sock => {
                    sock.on('message:send', (message: Message) => {
                        if (String(message.conversation.id) !== id) {
                            return;
                        }

                        updateCachedData(draft => {
                            draft.data.unshift(message);
                        });
                    });

                    sock.on('message:updated', (message: Message) => {
                        if (String(message.conversation.id) !== id) {
                            return;
                        }

                        updateCachedData(draft => {
                            const index = draft.data.findIndex(m => m.id === message.id);

                            if (index !== -1) {
                                draft.data[index] = message;
                            }
                        });
                    });

                    sock.on('message:deleted', ({ messageId, conversationId }: { messageId: number; conversationId: number }) => {
                        if (String(conversationId) !== id) {
                            return;
                        }

                        updateCachedData(draft => {
                            draft.data = draft.data.filter(m => m.id !== messageId);
                        });
                    });
                });

                await cacheEntryRemoved;
                unsubscribe();
            },
        }),
    }),

    overrideExisting: false,
});

export const {
    useMessageDetailQuery,
    useLazyMessageDetailQuery,
    useMessageUpdateMutation,
    useMessageDeleteMutation,
    useGetUnreadSummaryQuery,
    useLazyGetUnreadSummaryQuery,
    useSendMessageMutation,
    useMessageListQuery,
    useLazyMessageListQuery,
} = messageApi;

export type Message = {
    id: number;
    conversation: Conversation;
    sender: Profile;
    type: string;
    createdAt: string;
    updatedAt: string | null;
    deletedAt: string | null;
    createdBy: number | null;
    updatedBy: number | null;
    deletedBy: number | null;
    content: string;
    isEdited: boolean;
    editedAt: string;
    replyTo: Message;
    attachments: string[];
};

type UnreadSummary = {
    total: number;
    byConversation: Record<number, number>;
};

type SendMessageBody = z.infer<typeof sendMessageSchema> & { conversationId: string | number; replyToId?: number };
