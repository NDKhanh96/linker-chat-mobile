import { createSlice, type ActionReducerMapBuilder } from '@reduxjs/toolkit';

type InitialState = unknown;

const initialState: InitialState = {};

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

// eslint-disable-next-line no-empty-pattern
export const {} = authSlice.actions;
