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

import { useSocketInit } from '~/hooks';
import { store } from '~/redux/store';
import SpaceMono from '~assets/fonts/SpaceMono-Regular.ttf';
import { SafeAreaView } from '~components/themed';
import { ToastProvider } from '~components/toast';
import { GluestackUIProvider } from '~components/ui/gluestack-ui-provider';

export {
    // Catch any errors thrown by the Layout component.
    ErrorBoundary,
} from 'expo-router';

// Prevent the splash screen from auto-hiding before asset loading is complete.
void SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
    useSocketInit();

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

    /**
     * mode needs to be set to system for enable switching between light and dark mode
     */
    return (
        <GluestackUIProvider mode="system">
            <ThemeProvider value={colorScheme === 'dark' ? DarkTheme : DefaultTheme}>
                <SafeAreaView className="flex-1">
                    <ToastProvider>
                        <Stack screenOptions={{ headerShown: false }}>
                            <Stack.Screen name="index" />

                            <Stack.Screen name="(auth)" />

                            <Stack.Screen name="(main)" />
                        </Stack>
                    </ToastProvider>
                </SafeAreaView>
            </ThemeProvider>
        </GluestackUIProvider>
    );
}
