import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import * as SecureStore from 'expo-secure-store';

import { BASE_URL } from '~utils/environment';

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

const baseQueryHandler: typeof baseQuery = async (args, api, extraOptions) => {
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

    return result;
};

export const API = createApi({
    reducerPath: 'api',
    baseQuery: baseQueryHandler,
    endpoints: () => ({}),
});
