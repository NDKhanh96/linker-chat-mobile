import * as SecureStore from 'expo-secure-store';
import { z } from 'zod';

import type { Account, LoginResponse } from '~/types';
import { API } from '~utils/configs';
import { eventEmitter, EVENTS } from '~utils/event-emitter';
import type { loginSchema, registerSchema } from '~utils/form-schema';

export const registerApi = API.injectEndpoints({
    endpoints: build => ({
        register: build.mutation<Account, z.infer<typeof registerSchema>>({
            query: body => ({
                url: 'auth/register',
                method: 'POST',
                body,
            }),
            transformResponse: (response: Account) => {
                return response;
            },
        }),
        login: build.mutation<LoginResponse, z.infer<typeof loginSchema>>({
            query: body => ({
                url: 'auth/login',
                method: 'POST',
                body,
            }),
            transformResponse(response: LoginResponse) {
                SecureStore.setItemAsync('accessToken', response.authToken?.accessToken ?? '').catch((error: Error) => {
                    eventEmitter.emit(EVENTS.SHOW_ERROR_TOAST, error.message);
                });

                SecureStore.setItemAsync('refreshToken', response.authToken?.refreshToken ?? '').catch((error: Error) => {
                    eventEmitter.emit(EVENTS.SHOW_ERROR_TOAST, error.message);
                });

                return response;
            },
        }),
        exchangeSocialCode: build.mutation<LoginResponse, { provider: string; code: string; codeVerifier: string }>({
            query: ({ provider, code, codeVerifier }) => ({
                url: `auth/${provider}/login`,
                method: 'POST',
                body: { code, codeVerifier },
            }),
            transformResponse(response: LoginResponse) {
                SecureStore.setItemAsync('accessToken', response.authToken?.accessToken ?? '').catch((error: Error) => {
                    eventEmitter.emit(EVENTS.SHOW_ERROR_TOAST, error.message);
                });

                SecureStore.setItemAsync('refreshToken', response.authToken?.refreshToken ?? '').catch((error: Error) => {
                    eventEmitter.emit(EVENTS.SHOW_ERROR_TOAST, error.message);
                });

                return response;
            },
        }),
    }),
    overrideExisting: false,
});

export const { useRegisterMutation, useLoginMutation, useExchangeSocialCodeMutation } = registerApi;
