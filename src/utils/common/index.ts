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

export const decodeJWT = <T = Record<string, unknown>>(token: string): T => {
    try {
        const parts = token.split('.');

        if (parts.length !== 3) {
            throw new Error('Invalid JWT format');
        }

        const payload = parts[1];

        const paddedPayload = payload + '='.repeat((4 - (payload.length % 4)) % 4);

        const decodedPayload = atob(paddedPayload);

        return JSON.parse(decodedPayload) as T;
    } catch (error) {
        throw error;
    }
};
