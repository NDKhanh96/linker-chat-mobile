import '~root/global.css';

import FontAwesome from '@expo/vector-icons/FontAwesome';
import { DarkTheme, DefaultTheme, ThemeProvider } from '@react-navigation/native';
import { useFonts } from 'expo-font';
import { Stack } from 'expo-router';
import * as SplashScreen from 'expo-splash-screen';
import { useEffect } from 'react';
import { useColorScheme } from 'react-native';
import 'react-native-reanimated';
import { Provider } from 'react-redux';
import { GluestackUIProvider } from '~components/ui/gluestack-ui-provider';

import { store } from '~/redux/store';

export {
    // Catch any errors thrown by the Layout component.
    ErrorBoundary,
} from 'expo-router';

/**
 * unstable_settings chưa dùng được với async router là nguyên nhân nó tên là unstable.
 * https://docs.expo.dev/router/reference/async-routes/
 */
export const unstable_settings = {
    /**
     * Để đảm bảo rằng tải lại các màn hình khác thì sẽ đều có nút back về initialRouteName.
     */
    initialRouteName: '(auth)',
};

// Prevent the splash screen from auto-hiding before asset loading is complete.
SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
    const [loaded, error] = useFonts({
        SpaceMono: require('~assets/fonts/SpaceMono-Regular.ttf'),
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
            SplashScreen.hideAsync();
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

    /**
     * mode needs to be set to system for enable switching between light and dark mode
     */
    return (
        <GluestackUIProvider mode="system">
            <ThemeProvider value={colorScheme === 'dark' ? DarkTheme : DefaultTheme}>
                <Stack initialRouteName="(auth)">
                    <Stack.Screen name="(auth)" options={{ headerShown: false }} />
                </Stack>
            </ThemeProvider>
        </GluestackUIProvider>
    );
}
