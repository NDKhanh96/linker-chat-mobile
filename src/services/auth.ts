import * as SecureStore from 'expo-secure-store';
import type { z } from 'zod';

import type { Account, LoginAppMfa, LoginJwt } from '~/types';
import { API } from '~utils/configs';
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
        login: build.mutation<LoginJwt | LoginAppMfa, z.infer<typeof loginSchema>>({
            query: body => ({
                url: 'auth/login',
                method: 'POST',
                body,
            }),
            transformResponse(response: LoginJwt | LoginAppMfa) {
                SecureStore.setItemAsync('accessToken', response.authToken.accessToken);
                SecureStore.setItemAsync('refreshToken', response.authToken.refreshToken);

                return response;
            },
        }),
        exchangeSocialCode: build.mutation<LoginJwt | LoginAppMfa, { provider: string; code: string; codeVerifier: string }>({
            query: ({ provider, code, codeVerifier }) => ({
                url: `auth/${provider}/login`,
                method: 'POST',
                body: { code, codeVerifier },
            }),
            transformResponse(response: LoginJwt | LoginAppMfa) {
                SecureStore.setItemAsync('accessToken', response.authToken.accessToken);
                SecureStore.setItemAsync('refreshToken', response.authToken.refreshToken);

                return response;
            },
        }),
    }),
    overrideExisting: false,
});

export const { useRegisterMutation, useLoginMutation, useExchangeSocialCodeMutation } = registerApi;
