import { z } from 'zod';

import { showToast } from '~/redux/slices';
import type { Account, AuthToken, LoginResponse } from '~/types';
import { storeTokens } from '~utils/common';
import { API } from '~utils/configs';
import { getMutationErrorMessage } from '~utils/error-handle';
import type { loginSchema, registerSchema } from '~utils/form-schema';

export const registerApi = API.injectEndpoints({
    endpoints: build => ({
        register: build.mutation<Account, z.infer<typeof registerSchema>>({
            query: body => ({
                url: 'auth/register',
                method: 'POST',
                body,
            }),

            onQueryStarted: async (queryArgument, mutationLifeCycleApi) => {
                const { queryFulfilled, dispatch } = mutationLifeCycleApi;

                try {
                    await queryFulfilled;
                } catch (error) {
                    const message = getMutationErrorMessage(error);

                    dispatch(showToast({ title: 'Error', description: message, type: 'error' }));
                }
            },
        }),

        login: build.mutation<LoginResponse, z.infer<typeof loginSchema>>({
            query: body => ({
                url: 'auth/login',
                method: 'POST',
                body,
            }),

            async transformResponse(response: LoginResponse) {
                return response;
            },

            onQueryStarted: async (arg, mutationLifeCycleApi) => {
                const { queryFulfilled, dispatch } = mutationLifeCycleApi;

                try {
                    const result = await queryFulfilled;

                    if (result.data.authToken) {
                        await storeTokens(result.data.authToken);
                    }
                } catch (error) {
                    const message = getMutationErrorMessage(error);

                    dispatch(showToast({ title: 'Error', description: message, type: 'error' }));
                }
            },
        }),

        validateEmailOtp: build.mutation<{ verified: boolean; authToken: AuthToken }, { email: string; token: string; getAuthTokens: boolean }>({
            query: body => ({
                url: 'auth/email-otp/validate',
                method: 'POST',
                body,
            }),

            onQueryStarted: async (queryArgument, mutationLifeCycleApi) => {
                const { queryFulfilled, dispatch } = mutationLifeCycleApi;

                try {
                    const result = await queryFulfilled;

                    if (queryArgument.getAuthTokens && result.data?.authToken) {
                        await storeTokens(result.data.authToken);
                    }
                } catch (error) {
                    const message = getMutationErrorMessage(error);

                    dispatch(showToast({ title: 'Error', description: message, type: 'error' }));
                }
            },
        }),

        forgotPassword: build.mutation<{ message: string }, { email: string }>({
            query: body => ({
                url: 'auth/forgot-password',
                method: 'POST',
                body,
            }),

            onQueryStarted: async (queryArgument, mutationLifeCycleApi) => {
                const { queryFulfilled, dispatch } = mutationLifeCycleApi;

                try {
                    await queryFulfilled;
                } catch (error) {
                    const message = getMutationErrorMessage(error);

                    dispatch(showToast({ title: 'Error', description: message, type: 'error' }));
                }
            },
        }),

        resetPassword: build.mutation<{ message: string }, { email: string }>({
            query: body => ({
                url: 'auth/reset-password',
                method: 'POST',
                body,
            }),

            onQueryStarted: async (queryArgument, mutationLifeCycleApi) => {
                const { queryFulfilled, dispatch } = mutationLifeCycleApi;

                try {
                    await queryFulfilled;
                } catch (error) {
                    const message = getMutationErrorMessage(error);

                    dispatch(showToast({ title: 'Error', description: message, type: 'error' }));
                }
            },
        }),

        exchangeSocialCode: build.mutation<LoginResponse, { provider: string; code: string; codeVerifier: string }>({
            query: ({ provider, code, codeVerifier }) => ({
                url: `auth/${provider}/login`,
                method: 'POST',
                body: { code, codeVerifier },
            }),

            async transformResponse(response: LoginResponse) {
                return response;
            },

            onQueryStarted: async (arg, { queryFulfilled, dispatch }) => {
                try {
                    const result = await queryFulfilled;

                    await storeTokens(result.data.authToken);
                } catch (error) {
                    const message = getMutationErrorMessage(error);

                    dispatch(showToast({ title: 'Error', description: message, type: 'error' }));
                }
            },
        }),
    }),
    overrideExisting: false,
});

export const {
    useRegisterMutation,
    useLoginMutation,
    useValidateEmailOtpMutation,
    useForgotPasswordMutation,
    useResetPasswordMutation,
    useExchangeSocialCodeMutation,
} = registerApi;
