import * as SecureStore from 'expo-secure-store';
import { useEffect, useRef } from 'react';
import { type Socket } from 'socket.io-client';

import { disconnectSocket, initSocket, SOCKET_NAMESPACES, subscribeSocketReady, type SocketNamespace } from '~/services/socket';

/**
 * Hook khởi tạo và quản lý kết nối socket cho tất cả namespace.
 * Dùng ở màn hình chính (main layout) - kích hoạt sau khi user đã đăng nhập.
 *
 * @example
 * ```tsx
 * // Trong (main)/_layout.tsx
 * export default function MainLayout() {
 *   useSocketInit();
 *   return <Stack />;
 * }
 * ```
 */
export const useSocketInit = (): void => {
    useEffect(() => {
        let isMounted = true;

        const connect = async () => {
            const token = await SecureStore.getItemAsync('accessToken');

            if (!token || !isMounted) {
                return;
            }

            /**
             * Kết nối tất cả namespace được khai báo trong SOCKET_NAMESPACES
             */
            initSocket(token);
        };

        void connect();

        return () => {
            isMounted = false;
            disconnectSocket();
        };
    }, []);
};

/**
 * Hook lắng nghe sự kiện socket theo namespace.
 *
 * @param namespace - Namespace cần lắng nghe (mặc định là 'chat').
 * @param event - Tên sự kiện socket cần lắng nghe.
 * @param handler - Callback xử lý khi nhận được sự kiện.
 *
 * @example
 * ```tsx
 * useSocketEvent('chat', 'message:new', (data) => {
 *   console.log('New message:', data);
 * });
 * ```
 */
export const useSocketEvent = <T = unknown>(namespace: SocketNamespace = SOCKET_NAMESPACES.chat, event: string, handler: (data: T) => void): void => {
    const handlerRef = useRef(handler);

    handlerRef.current = handler;

    useEffect(() => {
        const listener = (data: T) => handlerRef.current(data);

        /**
         * Giữ ref tới socket để cleanup đúng instance
         */
        let attachedSock: Socket | null = null;

        /**
         * subscribeSocketReady xử lý 2 trường hợp:
         * 1. Socket đã connected → gọi callback ngay lập tức
         * 2. Socket chưa ready → đợi connect event rồi mới attach listener
         */
        const unsubscribe = subscribeSocketReady(namespace, sock => {
            attachedSock = sock;
            sock.on(event, listener);
        });

        return () => {
            /**
             * Hủy đăng ký nếu socket chưa kịp ready (tránh attach sau khi unmount)
             */
            unsubscribe();
            attachedSock?.off(event, listener);
        };
    }, [namespace, event]);
};
