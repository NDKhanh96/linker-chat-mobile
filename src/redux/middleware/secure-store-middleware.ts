import { createListenerMiddleware } from '@reduxjs/toolkit';
import * as SecureStore from 'expo-secure-store';

import { showToast } from '~/redux/slices';
import { setNameOrder } from '~/redux/slices/user.slice';

const secureStoreMiddleware = createListenerMiddleware();

const startAppListening = secureStoreMiddleware.startListening;

startAppListening({
    actionCreator: setNameOrder,
    effect: async (action, listenerApi) => {
        try {
            await SecureStore.setItemAsync('nameOrder', action.payload);
        } catch (error) {
            listenerApi.dispatch(showToast({ title: 'Error', description: 'Failed to save name order preference', type: 'error' }));
            console.error('Failed to persist nameOrder:', error);
        }
    },
});

export { secureStoreMiddleware };
