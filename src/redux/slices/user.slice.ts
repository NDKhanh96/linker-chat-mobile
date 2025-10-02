import { createSlice, type ActionReducerMapBuilder, type PayloadAction } from '@reduxjs/toolkit';
import * as SecureStore from 'expo-secure-store';

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
    nameOrder: 'western' | 'eastern';
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
    nameOrder: SecureStore.getItem('nameOrder') === 'western' ? 'western' : 'eastern',
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
        setNameOrder(state, action: PayloadAction<'western' | 'eastern'>) {
            state.nameOrder = action.payload;
        },
    },
    /**
     * Dùng để dispatch action bất đồng bộ như call API
     */
    extraReducers(_builder: ActionReducerMapBuilder<InitialState>): void {},
});

export const { setProfileByAccessToken, setNameOrder } = userSlice.actions;
