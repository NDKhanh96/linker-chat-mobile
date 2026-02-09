import { z } from 'zod';

import { Conversation, Profile } from 'src/services';
import { showToast } from '~/redux/slices';
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
        }),

        sendMessage: build.mutation<Message, z.infer<typeof sendMessageSchema> & { conversationId: string | number }>({
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

type Message = {
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
