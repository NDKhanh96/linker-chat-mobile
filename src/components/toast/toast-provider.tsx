import React, { useCallback, useEffect, useRef } from 'react';
import { View } from 'react-native';

import { useToast } from '~/components/ui/toast';
import { useToastRedux } from '~/hooks';
import type { ToastMessage, ToastType } from '~/redux/slices';
import { BaseToast } from '~components/toast/base';

export interface ToastProviderProps {
    children: React.ReactNode;
}

const ToastProvider: React.FC<ToastProviderProps> = ({ children }) => {
    const toast = useToast();
    const { toasts, hide } = useToastRedux();
    /**
     * Dùng useRef để dữ liệu không bị reset lại khi re-render.
     * Và khi thay đổi dữ liệu toast cũng không re-render lại component này.
     */
    const displayedToasts = useRef(new Set<string>());

    const getBorderClass = useCallback((type: ToastType): string => {
        const borderMap = {
            error: 'border-error-800',
            warning: 'border-warning-700',
            success: 'border-success-700',
            info: 'border-info-700',
            muted: 'border-background-800',
        };

        return borderMap[type];
    }, []);

    /**
     * Memoize render function để tránh tạo mới component
     */
    const createToastRender = useCallback(
        (toastMessage: ToastMessage) => {
            const ToastComponent = ({ id: toastId }: { id: string }) => (
                <BaseToast
                    title={toastMessage.title}
                    description={toastMessage.description}
                    type={toastMessage.type}
                    toastId={toastId}
                    borderClass={getBorderClass(toastMessage.type)}
                    onClose={() => toast.close(toastMessage.id)}
                />
            );

            ToastComponent.displayName = 'ToastComponent';

            return ToastComponent;
        },
        [toast, getBorderClass],
    );

    useEffect(() => {
        toasts.forEach(toastMessage => {
            const { id, duration, placement } = toastMessage;

            if (displayedToasts.current.has(id)) {
                return;
            }

            displayedToasts.current.add(id);

            toast.show({
                id,
                placement: placement ?? 'top',
                duration: duration ?? 3000,
                render: createToastRender(toastMessage),
                onCloseComplete: () => {
                    displayedToasts.current.delete(id);
                    hide(id);
                },
            });
        });

        /**
         * Xoá các toast không còn trong state Redux.
         */
        const currentToastIds = new Set(toasts.map(t => t.id));

        displayedToasts.current.forEach(id => {
            if (!currentToastIds.has(id)) {
                displayedToasts.current.delete(id);
                toast.close(id);
            }
        });
    }, [toasts, toast, hide, createToastRender]);

    return <View style={{ flex: 1 }}>{children}</View>;
};

export { ToastProvider };
