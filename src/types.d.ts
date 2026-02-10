import type AntDesign from '@expo/vector-icons/AntDesign';
import type { NavigationProp } from '@react-navigation/native';

type RootLayoutScreen = {
    index: undefined;
    '(auth)': undefined;
    '(main)': undefined;
};

export type RootNav = NavigationProp<RootLayoutScreen>;

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

export type CursorPaginationResponse<T> = {
    data: T[];
    meta: {
        nextCursor: string | null;
        hasMore: boolean;
        limit: number;
    };
};

export type OffsetPaginationResponse<T> = {
    data: T[];
    meta: {
        page: number;
        limit: number;
        total: number;
        totalPages: number;
        hasNextPage: boolean;
        hasPrevPage: boolean;
    };
};
