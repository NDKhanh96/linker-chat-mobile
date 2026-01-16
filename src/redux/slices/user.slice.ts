import { createSlice, type ActionReducerMapBuilder, type PayloadAction } from '@reduxjs/toolkit';
import * as SecureStore from 'expo-secure-store';

import { decodeJWT } from '~utils/common';

type InitialState = {
    profile: {
        email: string;
        firstName: string;
        lastName: string;
        avatar: string;
    };
    nameOrder: 'western' | 'eastern';
};

const initialState: InitialState = {
    profile: {
        email: '',
        firstName: '',
        lastName: '',
        avatar: '',
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
        setProfile(state, action: PayloadAction<InitialState['profile']>) {
            state.profile = action.payload;
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

export const { setProfileByAccessToken, setProfile, setNameOrder } = userSlice.actions;
