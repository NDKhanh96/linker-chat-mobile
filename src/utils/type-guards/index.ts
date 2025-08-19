import type { SerializedError } from '@reduxjs/toolkit';
import type { FetchBaseQueryError } from '@reduxjs/toolkit/query';

type BaseQueryHandledError = {
    error: {
        status: FetchBaseQueryError['status'];
        data: FetchBaseQueryError['data'];
        message: string;
    };
};

function isFetchBaseQueryError(error: unknown): error is FetchBaseQueryError {
    if (typeof error !== 'object' || error === null) {
        return false;
    }

    if (!('status' in error)) {
        return false;
    }

    if (typeof error.status === 'number') {
        return true;
    }

    if (typeof error.status === 'string' && ['FETCH_ERROR', 'PARSING_ERROR', 'TIMEOUT_ERROR', 'CUSTOM_ERROR'].includes(error.status)) {
        return true;
    }

    return false;
}

export function isSerializedError(error: unknown): error is SerializedError {
    return typeof error === 'object' && error !== null && ('message' in error || 'name' in error || 'stack' in error || 'code' in error);
}

export function isHttpError(error: unknown): error is Extract<FetchBaseQueryError, { status: number }> {
    return isFetchBaseQueryError(error) && typeof error.status === 'number';
}

export function isFetchError(error: unknown): error is Extract<FetchBaseQueryError, { status: 'FETCH_ERROR' }> {
    return isFetchBaseQueryError(error) && error.status === 'FETCH_ERROR';
}

export function isParsingError(error: unknown): error is Extract<FetchBaseQueryError, { status: 'PARSING_ERROR' }> {
    return isFetchBaseQueryError(error) && error.status === 'PARSING_ERROR';
}

export function isTimeoutError(error: unknown): error is Extract<FetchBaseQueryError, { status: 'TIMEOUT_ERROR' }> {
    return isFetchBaseQueryError(error) && error.status === 'TIMEOUT_ERROR';
}

export function isCustomError(error: unknown): error is Extract<FetchBaseQueryError, { status: 'CUSTOM_ERROR' }> {
    return isFetchBaseQueryError(error) && error.status === 'CUSTOM_ERROR';
}

export function isBaseQueryHandledError(error: unknown): error is BaseQueryHandledError {
    return (
        typeof error === 'object' &&
        error !== null &&
        'error' in error &&
        typeof error.error === 'object' &&
        error.error !== null &&
        'message' in error.error &&
        typeof error.error.message === 'string'
    );
}
