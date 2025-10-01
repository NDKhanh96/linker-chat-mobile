import '~root/global.css';

import FontAwesome from '@expo/vector-icons/FontAwesome';
import { DarkTheme, DefaultTheme, ThemeProvider } from '@react-navigation/native';
import { useFonts } from 'expo-font';
import { Stack } from 'expo-router';
import * as SecureStore from 'expo-secure-store';
import * as SplashScreen from 'expo-splash-screen';
import { useEffect } from 'react';
import { useColorScheme } from 'react-native';
import 'react-native-reanimated';
import { Provider, useDispatch } from 'react-redux';

import { setProfileByAccessToken } from '~/redux/slices';
import { store } from '~/redux/store';
import SpaceMono from '~assets/fonts/SpaceMono-Regular.ttf';
import { SafeAreaView } from '~components/themed';
import { ToastProvider } from '~components/toast';
import { GluestackUIProvider } from '~components/ui/gluestack-ui-provider';

export {
    // Catch any errors thrown by the Layout component.
    ErrorBoundary,
} from 'expo-router';

const accessToken = SecureStore.getItem('accessToken');

/**
 * unstable_settings chưa dùng được với async router là nguyên nhân nó tên là unstable.
 * https://docs.expo.dev/router/reference/async-routes/
 */
export const unstable_settings = {
    /**
     * Để đảm bảo rằng tải lại các màn hình khác thì sẽ đều có nút back về initialRouteName.
     */
    initialRouteName: `(${accessToken ? 'main' : 'auth'})/index`,
};

// Prevent the splash screen from auto-hiding before asset loading is complete.
void SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
    const [loaded, error] = useFonts({
        SpaceMono,
        ...FontAwesome.font,
    });

    // Expo Router uses Error Boundaries to catch errors in the navigation tree.
    useEffect(() => {
        if (error) {
            throw error;
        }
    }, [error]);

    useEffect(() => {
        if (loaded) {
            void SplashScreen.hideAsync();
        }
    }, [loaded]);

    if (!loaded) {
        return null;
    }

    return (
        <Provider store={store()}>
            <RootLayoutNav />
        </Provider>
    );
}

function RootLayoutNav() {
    const colorScheme = useColorScheme();

    const dispatch = useDispatch();

    useEffect(() => {
        const token = SecureStore.getItem('accessToken');

        if (!token) {
            return;
        }

        dispatch(setProfileByAccessToken(token));
    }, [dispatch]);

    /**
     * mode needs to be set to system for enable switching between light and dark mode
     */
    return (
        <GluestackUIProvider mode="system">
            <ThemeProvider value={colorScheme === 'dark' ? DarkTheme : DefaultTheme}>
                <SafeAreaView className="flex-1">
                    <ToastProvider>
                        <Stack screenOptions={{ headerShown: false }}>
                            <Stack.Screen name="(auth)" />

                            <Stack.Screen name="(main)" />
                        </Stack>
                    </ToastProvider>
                </SafeAreaView>
            </ThemeProvider>
        </GluestackUIProvider>
    );
}
