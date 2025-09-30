import { createSlice, PayloadAction } from '@reduxjs/toolkit';

export type ToastType = 'success' | 'error' | 'warning' | 'info' | 'muted';

export interface ToastMessage {
    id: string;
    title: string;
    description?: string;
    type: ToastType;
    duration?: number;
    placement?: 'top' | 'bottom' | 'top left' | 'top right' | 'bottom left' | 'bottom right';
}

export interface ToastState {
    toasts: ToastMessage[];
}

const initialState: ToastState = {
    toasts: [],
};

const toastSlice = createSlice({
    name: 'toast',
    initialState,
    reducers: {
        showToast: (state, action: PayloadAction<Omit<ToastMessage, 'id'>>) => {
            const id = Date.now().toString() + Math.random().toString(36).substr(2, 9);
            const toast: ToastMessage = {
                id,
                duration: 3000,
                placement: 'top',
                ...action.payload,
            };

            state.toasts.push(toast);
        },
        hideToast: (state, action: PayloadAction<string>) => {
            state.toasts = state.toasts.filter(toast => toast.id !== action.payload);
        },
        clearAllToasts: state => {
            state.toasts = [];
        },
        updateToast: (state, action: PayloadAction<{ id: string; updates: Partial<ToastMessage> }>) => {
            const { id, updates } = action.payload;
            const toastIndex = state.toasts.findIndex(toast => toast.id === id);

            if (toastIndex !== -1) {
                state.toasts[toastIndex] = { ...state.toasts[toastIndex], ...updates };
            }
        },
    },
});

export const { showToast, hideToast, clearAllToasts, updateToast } = toastSlice.actions;
export { toastSlice };
