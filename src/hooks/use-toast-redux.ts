import { useCallback } from 'react';
import { useSelector } from 'react-redux';

import { clearAllToasts, hideToast, showToast, ToastMessage, ToastType, updateToast } from '~/redux/slices/toast.slice';
import { useAppDispatch } from '~/redux/store';

import type { RootState } from '~/redux/store';

export interface ShowToastOptions {
    title: string;
    description?: string;
    type?: ToastType;
    duration?: number;
    placement?: 'top' | 'bottom' | 'top left' | 'top right' | 'bottom left' | 'bottom right';
}

export const useToastRedux = () => {
    const dispatch = useAppDispatch();
    const toasts = useSelector((state: RootState) => state.toast.toasts);

    const toast = useCallback(
        (options: ShowToastOptions) => {
            dispatch(
                showToast({
                    type: 'muted',
                    ...options,
                }),
            );
        },
        [dispatch],
    );

    const success = useCallback(
        (title: string, description?: string, options?: Omit<ShowToastOptions, 'title' | 'description' | 'type'>) => {
            dispatch(
                showToast({
                    title,
                    description,
                    type: 'success',
                    ...options,
                }),
            );
        },
        [dispatch],
    );

    const error = useCallback(
        (title: string, description?: string, options?: Omit<ShowToastOptions, 'title' | 'description' | 'type'>) => {
            dispatch(
                showToast({
                    title,
                    description,
                    type: 'error',
                    ...options,
                }),
            );
        },
        [dispatch],
    );

    const warning = useCallback(
        (title: string, description?: string, options?: Omit<ShowToastOptions, 'title' | 'description' | 'type'>) => {
            dispatch(
                showToast({
                    title,
                    description,
                    type: 'warning',
                    ...options,
                }),
            );
        },
        [dispatch],
    );

    const info = useCallback(
        (title: string, description?: string, options?: Omit<ShowToastOptions, 'title' | 'description' | 'type'>) => {
            dispatch(
                showToast({
                    title,
                    description,
                    type: 'info',
                    ...options,
                }),
            );
        },
        [dispatch],
    );

    const hide = useCallback(
        (id: string) => {
            dispatch(hideToast(id));
        },
        [dispatch],
    );

    const clear = useCallback(() => {
        dispatch(clearAllToasts());
    }, [dispatch]);

    const update = useCallback(
        (id: string, updates: Partial<ToastMessage>) => {
            dispatch(updateToast({ id, updates }));
        },
        [dispatch],
    );

    return {
        toasts,
        toast,
        success,
        error,
        warning,
        info,
        hide,
        clear,
        update,
    };
};
