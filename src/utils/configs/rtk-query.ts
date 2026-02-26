import { createApi, fetchBaseQuery, type BaseQueryFn, type FetchArgs } from '@reduxjs/toolkit/query/react';
import { router } from 'expo-router';
import * as SecureStore from 'expo-secure-store';

import { BASE_URL_API } from '~utils/environment';
import { getBaseQueryErrorMessage } from '~utils/error-handle';

const baseQuery = fetchBaseQuery({
    baseUrl: BASE_URL_API,
    prepareHeaders: async headers => {
        const token = await SecureStore.getItemAsync('accessToken');

        if (token) {
            headers.set('Authorization', `Bearer ${token}`);
        }

        return headers;
    },
});

const baseQueryHandler: BaseQueryFn<string | FetchArgs, unknown, unknown> = async (args, api, extraOptions) => {
    const result = await baseQuery(args, api, extraOptions);

    if (result.error?.status === 401) {
        router.replace('/(auth)');
        void Promise.allSettled([SecureStore.deleteItemAsync('accessToken'), SecureStore.deleteItemAsync('refreshToken')]);
    }

    if (result.error) {
        const message = getBaseQueryErrorMessage(result.error.data);

        return {
            error: {
                status: result.error.status,
                data: result.error.data,
                message: message,
            },
        };
    }

    return result;
};

export const API = createApi({
    reducerPath: 'api',
    baseQuery: baseQueryHandler,
    tagTypes: ['Conversation'],
    endpoints: () => ({}),
});
