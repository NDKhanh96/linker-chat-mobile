import { combineReducers, configureStore } from '@reduxjs/toolkit';
import { useDispatch } from 'react-redux';
import devToolsEnhancer from 'redux-devtools-expo-dev-plugin';

import { secureStoreMiddleware } from '~/redux/middleware/secure-store-middleware';
import { authSlice, toastSlice, userSlice } from '~/redux/slices';
import { API } from '~utils/configs';

const rootReducer = combineReducers({
    auth: authSlice.reducer,
    toast: toastSlice.reducer,
    user: userSlice.reducer,
    [API.reducerPath]: API.reducer,
});

export const store = (preloadedState?: Partial<RootState>) => {
    return configureStore({
        reducer: rootReducer,
        preloadedState,
        devTools: false,
        middleware: getDefaultMiddleware => getDefaultMiddleware().concat(API.middleware).concat(secureStoreMiddleware.middleware),
        enhancers: getDefaultEnhancers => getDefaultEnhancers().concat(devToolsEnhancer()),
    });
};

export type RootState = ReturnType<typeof rootReducer>;
export type AppStore = Prettify<ReturnType<typeof store>>;
export type AppDispatch = AppStore['dispatch'];

export const useAppDispatch: () => AppDispatch = useDispatch.withTypes<AppDispatch>();
