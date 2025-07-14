import type { SerializedError } from '@reduxjs/toolkit';
import { createApi, fetchBaseQuery, type BaseQueryFn, type FetchArgs, type FetchBaseQueryError } from '@reduxjs/toolkit/query/react';
import * as SecureStore from 'expo-secure-store';

import { BASE_URL } from '~utils/environment';
import { getErrorMessage } from '~utils/error-handle';
import { isSerializedError } from '~utils/type-guards';

type StandardError = {
    message: string;
    code: number | string;
    data: unknown;
    originalError: FetchBaseQueryError | SerializedError;
};

const baseQuery = fetchBaseQuery({
    baseUrl: BASE_URL,
    prepareHeaders: async headers => {
        const token = await SecureStore.getItemAsync('accessToken');

        if (token) {
            headers.set('Authorization', `Bearer ${token}`);
        }

        return headers;
    },
});

const transformToStandardError: (error: FetchBaseQueryError | SerializedError) => StandardError = error => {
    if (isSerializedError(error)) {
        return {
            message: error.message || 'Serialized error',
            code: error.code ?? 'UNKNOWN_SERIALIZED_ERROR',
            data: error.stack,
            originalError: error,
        };
    }

    const message = getErrorMessage(error);

    return {
        message,
        code: error.status,
        data: error.data,
        originalError: error,
    };
};

const baseQueryHandler: BaseQueryFn<string | FetchArgs, unknown, StandardError> = async (args, api, extraOptions) => {
    const result = await baseQuery(args, api, extraOptions);

    if (result.error?.status === 401) {
        // Thực hiện điều hướng ở đây, ví dụ:
        // navigationRef.navigate('Login');
        // hoặc dispatch logout, clear token, v.v.
        // Ví dụ:
        // api.dispatch(logoutAction());
        // hoặc gọi hàm điều hướng toàn cục
        console.warn('401 detected, redirect to login!');
    }

    return result.error ? { ...result, error: transformToStandardError(result.error) } : { ...result, error: undefined };
};

export const API = createApi({
    reducerPath: 'api',
    baseQuery: baseQueryHandler,
    endpoints: () => ({}),
});
