import { Redirect } from 'expo-router';
import * as SecureStore from 'expo-secure-store';
import { useCallback, useEffect, useState } from 'react';

import { setProfileByAccessToken, showToast } from '~/redux/slices';
import { useAppDispatch } from '~/redux/store';

export default function Index() {
    const dispatch = useAppDispatch();

    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [isAuthChecked, setIsAuthChecked] = useState(false);

    const handleAuth = useCallback(() => {
        try {
            const token = SecureStore.getItem('accessToken');

            setIsLoggedIn(!!token);

            if (token) {
                dispatch(setProfileByAccessToken(token));
            }
        } catch (error) {
            if (error instanceof Error) {
                dispatch(showToast({ title: 'Error', description: error.message, type: 'error' }));
            } else {
                dispatch(showToast({ title: 'Error', description: 'An unknown error occurred', type: 'error' }));
            }
        } finally {
            setIsAuthChecked(true);
        }
    }, [dispatch]);

    useEffect(() => {
        handleAuth();
    }, [handleAuth]);

    if (!isAuthChecked) {
        return null;
    }

    if (!isLoggedIn) {
        return <Redirect href="/(auth)" />;
    }

    return <Redirect href="/(main)" />;
}
