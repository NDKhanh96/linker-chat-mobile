import { makeRedirectUri, useAuthRequest, type AuthSessionResult } from 'expo-auth-session';
import { useCallback, useEffect } from 'react';

import { useExchangeSocialCodeMutation } from '~/services';
import { OAuthPlatform } from '~/types';
import { BASE_URL_API } from '~utils/environment';

type OAuthProviderConfig = {
    config: {
        clientId: OAuthPlatform;
        scopes: string[];
        redirectUri: string;
    };
    discovery: {
        authorizationEndpoint: string;
    };
};

/**
 * Dự án này áp dụng kiến trúc BFF (Backend-for-Frontend).
 * Do đó ở phần discovery sẽ không dùng trực tiếp URL của Google, Facebook, GitHub, mà sẽ dùng URL của backend.
 * Tương tự với clientId sẽ được lưu trên backend (google, facebook, github dùng để backend phân biệt và xử dụng clientId phù hợp chứ không thực sự là clientId của ứng dụng).
 * Backend sẽ:
 * - Nhận request từ client (web/native)
 * - Xử dụng clientId phù hợp dựa theo clientId trong request
 * - Gửi request tới Google OAuth
 * - Xử lý response từ Google (tạo JWT, set cookie, v.v.)
 * - Trả về kết quả cho frontend (web/native)
 */
const configs: Record<OAuthPlatform, OAuthProviderConfig> = {
    google: {
        config: {
            clientId: 'google',
            scopes: ['openid', 'profile', 'email'],
            redirectUri: makeRedirectUri(),
        },
        discovery: {
            authorizationEndpoint: `${BASE_URL_API}/auth/social/login`,
        },
    },
    facebook: {
        config: {
            clientId: 'facebook',
            scopes: ['public_profile', 'email'],
            redirectUri: makeRedirectUri(),
        },
        discovery: {
            authorizationEndpoint: `${BASE_URL_API}/auth/social/login`,
        },
    },
    github: {
        config: {
            clientId: 'github',
            scopes: ['read:user', 'user:email'],
            redirectUri: makeRedirectUri(),
        },
        discovery: {
            authorizationEndpoint: `${BASE_URL_API}/auth/social/login`,
        },
    },
};

export function useOAuth(provider: keyof typeof configs) {
    const { config, discovery } = configs[provider];
    const [request, _response, promptAsync] = useAuthRequest(config, discovery);

    const [fetchTokenFromProjectBackend, { isLoading, reset }] = useExchangeSocialCodeMutation();

    /**
     * Khi provider đổi, reset mutation state
     */
    useEffect(() => {
        reset();
    }, [provider, reset]);

    const oauthLogin = useCallback(async () => {
        try {
            const oauthResponse: Prettify<AuthSessionResult> = await promptAsync();

            /**
             * Chứa type phản ánh trạng thái xác thực OAuth:
             * - 'success': Xác thực thành công, có thể lấy mã thông báo.
             * - 'error': Khi có lỗi từ provider hoặc backend.
             * - 'cancel': Khi người dùng tắt browser hoặc webview, thường là bấm nút cancel.
             * - 'dismiss': Khi lập trình viên dùng AuthSession.dismiss().
             *
             * Locked và opened là các trạng thái không thường gặp, không được ghi rõ trong docs nhưng theo tìm hiểu từ các issue thì:
             * - 'locked': Khi mở phiên xác thực thứ 2 trong khi phiên trước vẫn đang mở, (mở 2 lần startAsync() hoặc promptAsync()).
             * - 'opened': Chỉ xảy ra trên web khi mở popup xác thực nhưng chưa có kết quả, thường dùng để loading trang chính.
             */
            const type = oauthResponse.type;

            switch (type) {
                case 'success': {
                    if (!request?.codeVerifier) {
                        throw new Error('Code verifier is missing. Ensure that the request was created with a code verifier.');
                    }
                    const response = await fetchTokenFromProjectBackend({
                        provider,
                        code: oauthResponse.params.code,
                        codeVerifier: request.codeVerifier,
                    });

                    /**
                     * Đã dc handler lỗi bên trong useExchangeSocialCodeMutation,
                     */
                    if (response.error) {
                        return;
                    }

                    return response.data;
                }
                case 'error': {
                    const message = oauthResponse.params?.message || oauthResponse.params?.error || 'An error occurred during OAuth authentication';

                    throw new Error(message);
                }
                case 'dismiss':
                    throw new Error('OAuth authentication was dismissed');
                case 'cancel':
                    throw new Error('OAuth authentication was cancelled');
                case 'locked':
                case 'opened':
                    throw new Error('An unknown error occurred during OAuth authentication');
                default:
                    throw new Error('Unhandled OAuth response type');
            }
        } catch (error) {
            return error instanceof Error ? error : new Error(typeof error === 'string' ? error : JSON.stringify(error));
        }
    }, [fetchTokenFromProjectBackend, promptAsync, provider, request?.codeVerifier]);

    return {
        isLoading,
        oauthLogin,
    };
}
