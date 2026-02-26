import { z } from 'zod';

import { type Conversation, type Profile } from 'src/services';
import { ConversationType } from 'src/services/conversation';
import { showToast } from '~/redux/slices';
import type { RootState } from '~/redux/store';
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

            onQueryStarted: async ({ conversationId, content }, { queryFulfilled, dispatch, getState }) => {
                /**
                 * Docs của rtk nói chỉ có cách duy nhất để định nghĩa kiểu cho getState là type assertion ở thời điểm hiện tại
                 */
                const state = getState() as RootState;
                const profile = state.user.profile;

                /**
                 * Tạo tin nhắn tạm để hiển thị ngay lập tức (optimistic)
                 */
                const tempMessage: Message = {
                    id: Date.now(),
                    content,
                    sender: {
                        ...profile,
                        version: NaN,
                        createdAt: '',
                        updatedAt: '',
                        deletedAt: '',
                        createdBy: NaN,
                        updatedBy: null,
                        deletedBy: null,
                        isActive: true,
                    },
                    conversation: {
                        id: 0,
                        type: ConversationType.DIRECT,
                        title: '',
                        avatar: '',
                        description: '',
                        lastMessage: null,
                        lastMessageAt: null,
                        createdAt: '',
                        updatedAt: null,
                        deletedAt: null,
                        createdBy: null,
                        updatedBy: null,
                        deletedBy: null,
                        members: [],
                        messages: [],
                    },
                    type: 'text',
                    createdAt: new Date().toISOString(),
                    updatedAt: null,
                    deletedAt: null,
                    createdBy: profile.id,
                    updatedBy: null,
                    deletedBy: null,
                    isEdited: false,
                    editedAt: '',
                    replyTo: null,
                    attachments: [],
                };

                /**
                 * Thêm tin nhắn tạm vào cache để hiển thị ngay lập tức (optimistic)
                 */
                const patchResult = dispatch(
                    messageApi.util.updateQueryData('messageList', { id: String(conversationId) }, draft => {
                        draft.data.unshift(tempMessage);
                    }),
                );

                try {
                    /**
                     * Chờ server trả về tin nhắn thật → thay tin nhắn tạm bằng tin nhắn thật
                     */
                    const { data: realMessage } = await queryFulfilled;

                    dispatch(
                        messageApi.util.updateQueryData('messageList', { id: String(conversationId) }, draft => {
                            const tempIndex = draft.data.findIndex(m => m.id === tempMessage.id);

                            if (tempIndex === -1) {
                                return;
                            }

                            const realAlreadyExists = draft.data.some(m => m.id === realMessage.id);

                            if (realAlreadyExists) {
                                /**
                                 * Socket đã thêm real message trước khi HTTP response về
                                 * → chỉ xóa temp, tránh duplicate
                                 */
                                draft.data.splice(tempIndex, 1);
                            } else {
                                draft.data[tempIndex] = realMessage;
                            }
                        }),
                    );
                } catch (error) {
                    patchResult.undo();
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
                    sock.on('message:receive', ({ message, conversationId }: { message: Message; conversationId: number }) => {
                        if (String(conversationId) !== id) {
                            return;
                        }

                        updateCachedData(draft => {
                            const alreadyExists = draft.data.some(m => m.id === message.id);

                            if (!alreadyExists) {
                                draft.data.unshift(message);
                            }
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
    sender: Omit<Profile, 'account'>;
    type: string;
    createdAt: string;
    updatedAt: string | null;
    deletedAt: string | null;
    createdBy: number | null;
    updatedBy: number | null;
    deletedBy: number | null;
    content: string | null;
    isEdited: boolean;
    editedAt: string;
    replyTo: Message | null;
    attachments: Attachment[];
};

type Attachment = {
    id: number;
    message: Message;
    type: string;
    fileName: string;
    fileUrl: string;
    fileSize: number;
    mimeType: string;
    width: number;
    height: number;
    thumbnailUrl: string;
};

type UnreadSummary = {
    total: number;
    byConversation: Record<number, number>;
};

type SendMessageBody = z.infer<typeof sendMessageSchema> & { conversationId: string | number; replyToId?: number };
