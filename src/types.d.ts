import type AntDesign from '@expo/vector-icons/AntDesign';

export type Account = {
    id: number;
    email: string;
    enableAppMfa: boolean;
    isCredential: boolean;
    user: {
        id: number;
        firstName: string;
        lastName: string;
        avatar: string;
    };
};

export type AuthToken = {
    accessToken: string;
    refreshToken: string;
};

export type LoginResponse = {
    authToken: AuthToken | undefined;
    email: string;
    enableTotp: boolean;
    enableEmailOtp: boolean;
    isCredential: boolean;
    id: number;
};

export type OAuthPlatform = 'google' | 'facebook' | 'github';

export type SocialMediaIcon = {
    name: keyof typeof AntDesign.glyphMap;
    color: { light: string; dark: string };
    size: number;
    platform: OAuthPlatform;
};

export type HandleOAuth = (data: LoginAppMfa | LoginJwt | Error) => void;
