import { z } from 'zod';

import type { Account, LoginResponse } from '~/types';
import { storeTokens } from '~utils/common';
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
        login: build.mutation<LoginResponse, z.infer<typeof loginSchema>>({
            query: body => ({
                url: 'auth/login',
                method: 'POST',
                body,
            }),
            async transformResponse(response: LoginResponse) {
                await storeTokens(response.authToken);

                return response;
            },
        }),
        exchangeSocialCode: build.mutation<LoginResponse, { provider: string; code: string; codeVerifier: string }>({
            query: ({ provider, code, codeVerifier }) => ({
                url: `auth/${provider}/login`,
                method: 'POST',
                body: { code, codeVerifier },
            }),
            async transformResponse(response: LoginResponse) {
                await storeTokens(response.authToken);

                return response;
            },
        }),
    }),
    overrideExisting: false,
});

export const { useRegisterMutation, useLoginMutation, useExchangeSocialCodeMutation } = registerApi;
