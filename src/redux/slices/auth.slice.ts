import { createSlice, type ActionReducerMapBuilder } from '@reduxjs/toolkit';

type InitialState = {
    isLoading: boolean;
};

const initialState: InitialState = {
    isLoading: false,
};

export const authSlice = createSlice({
    name: 'auth',
    initialState,
    /**
     * Dùng để dispatch action đồng bộ
     */
    reducers: {},
    /**
     * Dùng để dispatch action bất đồng bộ như call API
     */
    extraReducers(builder: ActionReducerMapBuilder<InitialState>): void {},
});

export const {} = authSlice.actions;
