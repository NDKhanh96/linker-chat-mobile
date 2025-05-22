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
