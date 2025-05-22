import type { z } from 'zod';

import type { Account } from '~/types';
import { API } from '~utils/configs';
import { registerSchema } from '~utils/form-schema';

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
        // Thêm các endpoint khác ở đây
    }),
    overrideExisting: false,
});

export const { useRegisterMutation } = registerApi;
