import { makeRedirectUri, useAuthRequest, type AuthRequest, type AuthRequestPromptOptions, type AuthSessionResult } from 'expo-auth-session';
import { useCallback, useEffect, useRef, useState } from 'react';

import { OAuthPlatform } from '~/types';
import { BASE_URL } from '~utils/environment';

type UseOAuthReturn = {
    request: AuthRequest | null;
    response: AuthSessionResult | null;
    result: AuthSessionResult | null | undefined;
    error: Error | null | undefined;
    promptAsync: (options?: AuthRequestPromptOptions) => Promise<AuthSessionResult>;
    whenComplete: (cb: (param: OAuthResponse) => void) => void;
};

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

type OAuthResponse = { data: AuthSessionResult; error: null } | { data: null; error: Error };

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
            authorizationEndpoint: `${BASE_URL}/auth/social/login`,
        },
    },
    facebook: {
        config: {
            clientId: 'facebook',
            scopes: ['public_profile', 'email'],
            redirectUri: makeRedirectUri(),
        },
        discovery: {
            authorizationEndpoint: `${BASE_URL}/auth/social/login`,
        },
    },
    github: {
        config: {
            clientId: 'github',
            scopes: ['read:user', 'user:email'],
            redirectUri: makeRedirectUri(),
        },
        discovery: {
            authorizationEndpoint: `${BASE_URL}/auth/social/login`,
        },
    },
};

/**
 * Lấy token từ backend của dự án chứ không phải từ server của social login service.
 */
async function fetchTokenFromProjectBackend(
    provider: keyof typeof configs,
    code: string,
    codeVerifier: string | undefined,
    setResult: (r: AuthSessionResult | null) => void,
    setError: (e: Error | null) => void,
) {
    if (!code || !codeVerifier) {
        return;
    }
    try {
        const loginEndpoint = `${BASE_URL}/auth/${provider}/login`;
        const res = await fetch(loginEndpoint, {
            method: 'POST',
            body: JSON.stringify({ code, codeVerifier }),
            headers: { 'Content-Type': 'application/json' },
        });

        if (!res.ok) {
            setError(new Error('Failed to fetch token'));
        }
        const data: AuthSessionResult = await res.json();

        setResult(data);
    } catch (err: any) {
        setResult(null);
        setError(err);
    }
}

/**
 * request: AuthRequest | null - Yêu cầu xác thực OAuth, có thể là null nếu chưa khởi tạo.
 * response: AuthSessionResult | null - Kết quả của yêu cầu xác thực, có thể là null nếu chưa có phản hồi.
 * result: AuthSessionResult | null - Kết quả cuối cùng của quá trình xác thực, có thể là null nếu chưa hoàn thành.
 * error: Error | null - Lỗi xảy ra trong quá trình xác thực, có thể là null nếu không có lỗi.
 * promptAsync: (options?: AuthRequestPromptOptions) => Promise<AuthSessionResult> - Hàm để khởi tạo quá trình xác thực OAuth, có thể nhận các tùy chọn bổ sung.
 * whenComplete: (cb: (data: AuthSessionResult | null, error: Error | null) => void) => void - Hàm để đăng ký callback sẽ được gọi khi quá trình xác thực hoàn thành, với dữ liệu kết quả hoặc lỗi nếu có.
 */
export function useSocialProviders(provider: keyof typeof configs): UseOAuthReturn {
    const { config, discovery } = configs[provider];
    const [request, response, promptAsync] = useAuthRequest(config, discovery);
    const [result, setResult] = useState<OAuthResponse | undefined>(undefined);

    const completeCallback = useRef<((param: OAuthResponse) => void) | null>(null);

    const whenComplete = useCallback((cb: (param: OAuthResponse) => void) => {
        completeCallback.current = cb;
    }, []);

    useEffect(() => {
        let cancelled = false;

        if (response?.type === 'error') {
            setResult({ data: null, error: new Error(response.params.message ?? 'An error occurred during OAuth authentication') });
        }

        if (response?.type === 'success') {
            fetchTokenFromProjectBackend(
                provider,
                response.params.code,
                request?.codeVerifier,
                data => {
                    if (!cancelled) {
                        setResult(data ? { data, error: null } : { data: null, error: new Error('No data returned from OAuth provider') });
                    }
                },
                err => {
                    if (!cancelled) {
                        setResult({ data: null, error: err ?? new Error('An error occurred while fetching the token') });
                    }
                },
            );
        }

        return () => {
            cancelled = true;
        };
    }, [response, request, provider]);

    useEffect(() => {
        if (completeCallback.current && result) {
            completeCallback.current(result);
        }
    }, [result]);

    return { request, response, result: result?.data, error: result?.error, promptAsync, whenComplete };
}

export function useOAuth() {
    return {
        google: useSocialProviders('google'),
        facebook: useSocialProviders('facebook'),
        github: useSocialProviders('github'),
    };
}
