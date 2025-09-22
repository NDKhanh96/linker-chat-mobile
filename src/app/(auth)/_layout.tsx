import { Stack } from 'expo-router';

export default function AuthLayout(): React.JSX.Element {
    return (
        <Stack screenOptions={{ headerShown: false }}>
            <Stack.Screen name="index" />

            <Stack.Screen name="register" />

            <Stack.Screen name="forgot-password" />

            <Stack.Screen name="otp-submit/[email]" />

            <Stack.Screen name="reset-password/[email]" />
        </Stack>
    );
}
