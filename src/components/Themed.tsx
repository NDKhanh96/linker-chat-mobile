/**
 * Learn more about Light and Dark modes:
 * https://docs.expo.io/guides/color-schemes/
 */

import {
    KeyboardAvoidingView as DefaultKeyboardAvoidingView,
    Text as DefaultText,
    View as DefaultView,
    Platform,
    ScrollView,
    useColorScheme,
} from 'react-native';
import { SafeAreaView as DefaultSafeAreaView } from 'react-native-safe-area-context';

import Colors from '~utils/constants/colors';

type ThemeProps = {
    lightColor?: string;
    darkColor?: string;
};

export type TextProps = ThemeProps & DefaultText['props'];
export type ViewProps = ThemeProps & DefaultView['props'];
export type SafeAreaViewProps = ThemeProps & React.ComponentProps<typeof DefaultSafeAreaView>;
export type KeyboardAvoidingViewProps = ThemeProps & DefaultKeyboardAvoidingView['props'];

export function useThemeColor(props: { light?: string; dark?: string }, colorName: keyof typeof Colors.light & keyof typeof Colors.dark) {
    const theme = useColorScheme() ?? 'light';
    const colorFromProps = props[theme];

    if (colorFromProps) {
        return colorFromProps;
    }

    return Colors[theme][colorName];
}

export function Text(props: TextProps) {
    const { style, lightColor, darkColor, ...otherProps } = props;
    const color = useThemeColor({ light: lightColor, dark: darkColor }, 'text');

    return <DefaultText style={[{ color }, style]} {...otherProps} />;
}

export function View(props: ViewProps) {
    const { style, lightColor, darkColor, ...otherProps } = props;
    const backgroundColor = useThemeColor({ light: lightColor, dark: darkColor }, 'background');

    return <DefaultView style={[{ backgroundColor }, style]} {...otherProps} />;
}

export function SafeAreaView(props: ViewProps) {
    const { style, lightColor, darkColor, ...otherProps } = props;
    const backgroundColor = useThemeColor({ light: lightColor, dark: darkColor }, 'background');

    return <DefaultSafeAreaView style={[{ backgroundColor }, style]} {...otherProps} />;
}

export function KeyboardAvoidingScrollView(props: KeyboardAvoidingViewProps) {
    const { style, lightColor, darkColor, ...otherProps } = props;
    const backgroundColor = useThemeColor({ light: lightColor, dark: darkColor }, 'background');

    return (
        <ScrollView contentContainerClassName="grow">
            <DefaultKeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : undefined} style={[{ backgroundColor }, style]} {...otherProps} />
        </ScrollView>
    );
}
