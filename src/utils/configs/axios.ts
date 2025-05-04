import axios, { type AxiosError, type AxiosInstance, type AxiosResponse, type InternalAxiosRequestConfig } from 'axios';
import * as SecureStore from 'expo-secure-store';

import { BASE_URL } from '~utils/environment';

const baseUrl: string = BASE_URL;

export const API: AxiosInstance = axios.create({ baseURL: baseUrl });

// Sử dụng axios interceptor để thêm accessToken vào header của mỗi request
API.interceptors.request.use(
    async (request: InternalAxiosRequestConfig<unknown>): Promise<InternalAxiosRequestConfig<unknown>> => {
        const accessToken: string | null = SecureStore.getItem('accessToken');

        if (accessToken) {
            request.headers.Authorization = `Bearer ${accessToken}`;
        }

        return request;
    },
    (error: AxiosError): Promise<never> => {
        return Promise.reject(error);
    },
);

API.interceptors.response.use(
    async (response: AxiosResponse<unknown, unknown>): Promise<AxiosResponse<unknown, unknown>> => {
        return response;
    },
    (error: AxiosError): Promise<never> => {
        return Promise.reject(error.response?.data);
    },
);
