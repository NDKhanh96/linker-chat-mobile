import { Stack } from 'expo-router';

export default function AuthLayout(): React.JSX.Element {
    return (
        <Stack screenOptions={{ headerShown: true }}>
            <Stack.Screen name="index" />
            <Stack.Screen name="register" />
            <Stack.Screen name="forgot-password" />
        </Stack>
    );
}
