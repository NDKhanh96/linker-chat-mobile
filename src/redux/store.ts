import { combineReducers, configureStore } from '@reduxjs/toolkit';
import { useDispatch } from 'react-redux';

import { authSlice } from '~/redux/slices';
import { API } from '~utils/configs';

const rootReducer = combineReducers({
    auth: authSlice.reducer,
    [API.reducerPath]: API.reducer,
});

export const store = (preloadedState?: Partial<RootState>) => {
    return configureStore({
        reducer: rootReducer,
        preloadedState,
        middleware: getDefaultMiddleware => getDefaultMiddleware().concat(API.middleware),
    });
};

export type RootState = ReturnType<typeof rootReducer>;
export type AppStore = Prettify<ReturnType<typeof store>>;
export type AppDispatch = AppStore['dispatch'];

export const useAppDispatch: () => AppDispatch = useDispatch.withTypes<AppDispatch>();
