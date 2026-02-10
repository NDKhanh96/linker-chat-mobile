import { z } from 'zod';

import { showToast } from '~/redux/slices';
import { API } from '~utils/configs';
import { getFetchErrorMessage } from '~utils/error-handle';
import { addConversationMemberSchema, updateConversationMemberScheme } from '~utils/form-schema';

const memberApi = API.injectEndpoints({
    endpoints: build => ({
        addMember: build.mutation<ConversationMember, z.infer<typeof addConversationMemberSchema> & { id: string | number }>({
            query: ({ id, ...body }) => ({
                url: `conversations/${id}/members`,
                method: 'POST',
                body,
            }),

            onQueryStarted: async (_arg, mutationLifeCycleApi) => {
                const { queryFulfilled, dispatch } = mutationLifeCycleApi;

                try {
                    await queryFulfilled;
                } catch (error) {
                    dispatch(showToast({ title: 'Error', description: getFetchErrorMessage(error), type: 'error' }));
                }
            },
        }),

        updateMember: build.mutation<void, z.infer<typeof updateConversationMemberScheme> & { id: string }>({
            query: ({ id, ...body }) => ({
                url: `conversations/${id}/members/me`,
                method: 'PATCH',
                body,
            }),

            onQueryStarted: async (_arg, mutationLifeCycleApi) => {
                const { queryFulfilled, dispatch } = mutationLifeCycleApi;

                try {
                    await queryFulfilled;
                } catch (error) {
                    dispatch(showToast({ title: 'Error', description: getFetchErrorMessage(error), type: 'error' }));
                }
            },
        }),

        leaveMember: build.mutation<void, { id: string | number }>({
            query: ({ id }) => ({
                url: `conversations/${id}/members/me`,
                method: 'POST',
            }),

            onQueryStarted: async (_arg, mutationLifeCycleApi) => {
                const { queryFulfilled, dispatch } = mutationLifeCycleApi;

                try {
                    await queryFulfilled;
                } catch (error) {
                    dispatch(showToast({ title: 'Error', description: getFetchErrorMessage(error), type: 'error' }));
                }
            },
        }),

        removeMember: build.mutation<void, { conversationId: string | number; userId: string | number }>({
            query: ({ conversationId, userId }) => ({
                url: `conversations/${conversationId}/members/${userId}`,
                method: 'DELETE',
            }),

            onQueryStarted: async (_arg, mutationLifeCycleApi) => {
                const { queryFulfilled, dispatch } = mutationLifeCycleApi;

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

export const { useAddMemberMutation, useRemoveMemberMutation, useLeaveMemberMutation } = memberApi;

export type ConversationMember = {
    conversationId: number;
    userId: number;
    role: string;
    createdAt: string;
    updatedAt?: string | null;
    deletedAt?: string | null;
    createdBy?: number | null;
    updatedBy?: number | null;
    deletedBy?: number | null;
    joinedAt: string;
    mutedUntil?: string | null;
    lastReadMessageId?: number | null;
};
