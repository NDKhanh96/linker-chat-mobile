import * as SecureStore from 'expo-secure-store';

/**
 *
 * @param authToken - The authentication token object containing access and refresh tokens.
 * This function stores the access and refresh tokens in secure storage.
 * If the tokens are not provided, it does nothing.
 *
 * @throws {Error} If there is an error while storing the tokens.
 * @returns
 */
export const storeTokens = async (authToken?: { accessToken?: string; refreshToken?: string }) => {
    if (!authToken) {
        return;
    }
    if (authToken.accessToken) {
        SecureStore.setItemAsync('accessToken', authToken.accessToken).catch((error: Error) => {
            throw error;
        });
    }

    if (authToken.refreshToken) {
        SecureStore.setItemAsync('refreshToken', authToken.refreshToken).catch((error: Error) => {
            throw error;
        });
    }
};

function base64UrlDecode(str: string): string {
    str = str.replace(/-/g, '+').replace(/_/g, '/');

    const padding = '='.repeat((4 - (str.length % 4)) % 4);

    str += padding;

    try {
        const decoded = atob(str);

        const utf8Decoder = new TextDecoder('utf-8');
        const bytes = new Uint8Array(decoded.split('').map(char => char.charCodeAt(0)));

        return utf8Decoder.decode(bytes);
    } catch {
        return atob(str);
    }
}

export const decodeJWT = <T = Record<string, unknown>>(token: string): T => {
    try {
        const parts = token.split('.');

        if (parts.length !== 3) {
            throw new Error('Invalid JWT format');
        }

        const payload = parts[1];

        const decodedPayload = base64UrlDecode(payload);

        return JSON.parse(decodedPayload) as T;
    } catch (error) {
        throw error;
    }
};

export const getProfileFromToken = (token: string) => {
    const profile = decodeJWT<{ email: string; firstName: string; lastName: string; avatar: string; sub: number }>(token);

    return { email: profile.email, firstName: profile.firstName, lastName: profile.lastName, avatar: profile.avatar, id: profile.sub };
};
