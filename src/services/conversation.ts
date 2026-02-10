import { z } from 'zod';

import { showToast } from '~/redux/slices';
import type { ConversationMember, Message } from '~/services';
import type { CursorPaginationResponse } from '~/types';
import { API } from '~utils/configs';
import { getFetchErrorMessage } from '~utils/error-handle';
import type { createConversationSchema } from '~utils/form-schema';

export const conversationApi = API.injectEndpoints({
    endpoints: build => ({
        listConversation: build.query<CursorPaginationResponse<Conversation>, { cursor?: string; limit?: number }>({
            query: params => ({
                url: 'conversations',
                method: 'GET',
                params,
            }),

            providesTags: [{ type: 'Conversation', id: 'LIST' }],

            onQueryStarted: async (_arg, { queryFulfilled, dispatch }) => {
                try {
                    await queryFulfilled;
                } catch (error) {
                    dispatch(showToast({ title: 'Error', description: getFetchErrorMessage(error), type: 'error' }));
                }
            },
        }),

        createConversation: build.mutation<Conversation, z.infer<typeof createConversationSchema>>({
            query: body => ({
                url: 'conversations',
                method: 'POST',
                body,
            }),

            invalidatesTags: [{ type: 'Conversation', id: 'LIST' }],

            onQueryStarted: async (_arg, mutationLifeCycleApi) => {
                const { queryFulfilled, dispatch } = mutationLifeCycleApi;

                try {
                    await queryFulfilled;
                } catch (error) {
                    dispatch(showToast({ title: 'Error', description: getFetchErrorMessage(error), type: 'error' }));
                }
            },
        }),

        detailConversation: build.query<Conversation, { id: string | number }>({
            query: ({ id }) => `conversations/${id}`,

            providesTags: (_result, _error, { id }) => [{ type: 'Conversation', id }],

            onQueryStarted: async (_arg, { queryFulfilled, dispatch }) => {
                try {
                    await queryFulfilled;
                } catch (error) {
                    dispatch(showToast({ title: 'Error', description: getFetchErrorMessage(error), type: 'error' }));
                }
            },
        }),

        updateConversation: build.mutation<Conversation, { id: string | number }>({
            query: ({ id }) => ({
                url: `conversations/${id}`,
                method: 'PATCH',
            }),

            invalidatesTags: (_result, _error, { id }) => [
                { type: 'Conversation', id: 'LIST' },
                { type: 'Conversation', id },
            ],

            onQueryStarted: async (_arg, { queryFulfilled, dispatch }) => {
                try {
                    await queryFulfilled;
                } catch (error) {
                    dispatch(showToast({ title: 'Error', description: getFetchErrorMessage(error), type: 'error' }));
                }
            },
        }),

        deleteConversation: build.mutation<void, { id: string | number }>({
            query: ({ id }) => ({
                url: `conversations/${id}`,
                method: 'DELETE',
            }),

            invalidatesTags: (_result, _error, { id }) => [
                { type: 'Conversation', id: 'LIST' },
                { type: 'Conversation', id },
            ],

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
    useCreateConversationMutation,
    useListConversationQuery,
    useLazyListConversationQuery,
    useDetailConversationQuery,
    useLazyDetailConversationQuery,
    useUpdateConversationMutation,
} = conversationApi;

export type Conversation = {
    id: number;
    type: ConversationType;
    title: string;
    avatar: string;
    description: string;
    lastMessage: Message | null;
    lastMessageAt: Date | null;
    createdAt: Date;
    updatedAt: Date | null;
    deletedAt: Date | null;
    createdBy: number | null;
    updatedBy: number | null;
    deletedBy: number | null;
    members: ConversationMember[];
    messages: Message[];
};

enum ConversationType {
    DIRECT = 'direct',
    GROUP = 'group',
}
