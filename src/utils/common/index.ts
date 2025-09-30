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
