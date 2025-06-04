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

export type LoginAppMfa = {
    authToken: {
        accessToken: string;
        refreshToken: string;
    };
    email: string;
    enableAppMfa: boolean;
    isCredential: boolean;
    id: number;
};

export type LoginJwt = {
    authToken: {
        accessToken: string;
        refreshToken: string;
    };
    email: string;
    enableAppMfa: boolean;
    isCredential: boolean;
    id: number;
};
