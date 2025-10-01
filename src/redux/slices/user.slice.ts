import { createSlice, type ActionReducerMapBuilder, type PayloadAction } from '@reduxjs/toolkit';

import { decodeJWT } from '~utils/common';

type InitialState = {
    profile: {
        email: string;
        firstName: string;
        lastName: string;
        avatar: string;
        exp: number;
        iat: number;
        sub: number;
    };
};

const initialState: InitialState = {
    profile: {
        email: '',
        firstName: '',
        lastName: '',
        avatar: '',
        exp: NaN,
        iat: NaN,
        sub: NaN,
    },
};

export const userSlice = createSlice({
    name: 'user',
    initialState,
    /**
     * Dùng để dispatch action đồng bộ
     */
    reducers: {
        setProfileByAccessToken(state, action: PayloadAction<string>) {
            const profile = decodeJWT<InitialState['profile']>(action.payload);

            state.profile = profile;
        },
    },
    /**
     * Dùng để dispatch action bất đồng bộ như call API
     */
    extraReducers(_builder: ActionReducerMapBuilder<InitialState>): void {},
});

export const { setProfileByAccessToken } = userSlice.actions;
