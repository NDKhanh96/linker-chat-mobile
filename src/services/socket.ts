import { io, type Socket } from 'socket.io-client';

import { BASE_URL } from '~utils/environment';

/**
 * Các namespace socket hiện có.
 * Thêm namespace mới vào đây khi cần.
 */
export const SOCKET_NAMESPACES = {
    chat: 'chat',
    // notification: 'notification',
    // presence: 'presence',
} as const;

export type SocketNamespace = (typeof SOCKET_NAMESPACES)[keyof typeof SOCKET_NAMESPACES];

const sockets = new Map<SocketNamespace, Socket>();
const readySubscribers = new Map<SocketNamespace, Set<(socket: Socket) => void>>();
let currentToken: string | null = null;

const createSocket = (namespace: SocketNamespace, token: string): Socket => {
    const sock = io(`${BASE_URL}/${namespace}`, {
        auth: { token },
        transports: ['websocket'],
        reconnection: true,
    });

    // Đếm số lần connect_error để phân biệt lần đầu (bình thường) với lỗi liên tục
    let errorCount = 0;

    sock.on('connect', () => {
        console.info(`[Socket/${namespace}] Connected — id: ${sock.id}`);
        errorCount = 0;

        const subscribers = readySubscribers.get(namespace);

        if (subscribers) {
            subscribers.forEach(cb => cb(sock));
            subscribers.clear();
        }
    });

    sock.on('disconnect', reason => {
        console.info(`[Socket/${namespace}] Disconnected — reason: ${reason}`);
    });

    sock.on('connect_error', error => {
        errorCount++;

        // Lần đầu thất bại là bình thường (server chưa kịp ready), chỉ warn
        // Từ lần 2 trở đi mới là vấn đề thực sự
        if (errorCount === 1) {
            console.warn(`[Socket/${namespace}] Initial connection failed, retrying... (${error.message})`);
        } else {
            console.error(`[Socket/${namespace}] Connection error #${errorCount} — ${error.message}`);
        }
    });

    return sock;
};

/**
 * Khởi tạo kết nối socket cho tất cả (hoặc một số) namespace.
 * Gọi hàm này sau khi user đăng nhập thành công.
 *
 * @param token - JWT access token để xác thực với server.
 * @param namespaces - Danh sách namespace cần kết nối. Mặc định kết nối tất cả.
 */
export const initSocket = (token: string, namespaces: SocketNamespace[] = Object.values(SOCKET_NAMESPACES)): void => {
    if (currentToken === token && namespaces.every(ns => sockets.has(ns))) {
        return;
    }

    if (currentToken !== token) {
        disconnectSocket();
    }

    currentToken = token;

    for (const ns of namespaces) {
        if (!sockets.has(ns)) {
            sockets.set(ns, createSocket(ns, token));
        }
    }
};

/**
 * Lấy socket instance của một namespace cụ thể.
 *
 * @param namespace - Namespace cần lấy. Mặc định là 'chat'.
 * @returns Socket instance hoặc null nếu chưa khởi tạo.
 */
export const getSocket = (namespace: SocketNamespace = SOCKET_NAMESPACES.chat): Socket | null => sockets.get(namespace) ?? null;

/**
 * Ngắt kết nối và xoá tất cả socket.
 * Gọi hàm này khi user đăng xuất.
 */
export const disconnectSocket = (): void => {
    sockets.forEach(sock => sock.disconnect());
    sockets.clear();
    readySubscribers.clear();
    currentToken = null;
};

/**
 * Đăng ký callback sẽ được gọi khi socket của namespace sẵn sàng (connected).
 * Nếu socket đã connected rồi thì gọi callback ngay lập tức.
 *
 * @param namespace - Namespace cần lắng nghe.
 * @returns Hàm huỷ đăng ký (dùng trong cleanup của useEffect)
 */
export const subscribeSocketReady = (namespace: SocketNamespace, cb: (socket: Socket) => void): (() => void) => {
    const sock = sockets.get(namespace);

    if (sock?.connected) {
        cb(sock);

        return () => {};
    }

    if (!readySubscribers.has(namespace)) {
        readySubscribers.set(namespace, new Set());
    }

    readySubscribers.get(namespace)!.add(cb);

    return () => {
        readySubscribers.get(namespace)?.delete(cb);
    };
};
