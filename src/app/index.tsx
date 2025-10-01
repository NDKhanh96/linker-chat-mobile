import { Redirect } from 'expo-router';
import * as SecureStore from 'expo-secure-store';
import { useCallback, useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';

import { setProfileByAccessToken, showToast } from '~/redux/slices';

export default function Index() {
    const dispatch = useDispatch();

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
