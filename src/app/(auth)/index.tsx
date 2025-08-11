import { zodResolver } from '@hookform/resolvers/zod';
import { Link } from 'expo-router';
import { Lock, Mail } from 'lucide-react-native';
import { Controller, useForm } from 'react-hook-form';
import type { z } from 'zod';

import { useLoginMutation } from '~/services';
import type { HandleOAuth, LoginResponse, SocialMediaIcon } from '~/types';
import { ButtonGradientLoading, OAuthButton } from '~components/button';
import { InputBase, InputPassword } from '~components/input';
import { Divider } from '~components/line';
import { KeyboardAvoidingScrollView, Text, View } from '~components/themed';
import { useErrorToast } from '~components/toast';
import { Image } from '~components/ui/image';
import { loginSchema } from '~utils/form-schema';
import { t } from '~utils/locales';

const SOCIAL_MEDIA_ICONS: SocialMediaIcon[] = [
    { name: 'google', color: { light: '#EF4444', dark: '#EF4444' }, size: 24, platform: 'google' },
    { name: 'facebook-square', color: { light: '#2463EB', dark: '#2463EB' }, size: 24, platform: 'facebook' },
    { name: 'github', color: { light: 'black', dark: 'white' }, size: 24, platform: 'github' },
];

export default function Login(): React.JSX.Element {
    const errorToast = useErrorToast();
    const [login] = useLoginMutation();
    const {
        control,
        handleSubmit,
        formState: { errors, isSubmitting },
    } = useForm<z.infer<typeof loginSchema>>({ resolver: zodResolver(loginSchema) });

    const handleCredentialLogin = async (data: z.infer<typeof loginSchema>) => {
        const res = await login(data);

        if (res.error) {
            return errorToast(res.error?.message);
        }
        handleLoginSuccess(res.data);
    };

    const handleOAuth: HandleOAuth = (res: Error | LoginResponse) => {
        if (res instanceof Error) {
            return errorToast(res.message);
        }

        handleLoginSuccess(res);
    };

    const handleLoginSuccess = (data: LoginResponse) => {
        // TODO: Handle successful login, e.g., navigate to the main app screen
        console.log('Login result:', data);
    };

    return (
        <KeyboardAvoidingScrollView className="flex-1 px-5 justify-center gap-y-16">
            <View className="items-center justify-center gap-y-5">
                <Image
                    size="md"
                    source={{
                        uri: 'https://images.unsplash.com/photo-1472214103451-9374bd1c798e?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80',
                    }}
                    alt="image"
                />
                <Text className="text-2xl font-bold">Linker Chat</Text>
            </View>

            <View className="gap-y-5">
                <Text className="text-2xl">{t('auth.login')}</Text>

                <Controller
                    control={control}
                    name="email"
                    render={({ field: { onChange, onBlur, value } }) => (
                        <InputBase
                            errorText={errors.email}
                            inputProps={{
                                variant: 'outline',
                                size: 'xl',
                                isDisabled: isSubmitting,
                                isInvalid: !!errors.email,
                            }}
                            inputFieldProps={{
                                onBlur,
                                value,
                                onChangeText: onChange,
                                placeholder: 'Email',
                            }}
                            iconProps={{
                                as: Mail,
                            }}
                        />
                    )}
                />

                <Controller
                    control={control}
                    name="password"
                    render={({ field: { onChange, onBlur, value } }) => (
                        <InputPassword
                            errorText={errors.password}
                            inputProps={{
                                variant: 'outline',
                                size: 'xl',
                                isDisabled: isSubmitting,
                                isInvalid: !!errors.password,
                            }}
                            inputFieldProps={{
                                onBlur,
                                value,
                                onChangeText: onChange,
                                placeholder: 'Password',
                            }}
                            iconLeftProps={{
                                as: Lock,
                            }}
                            iconRightProps={{
                                className: 'mr-2',
                            }}
                        />
                    )}
                />

                <Link href={'/(auth)/forgot-password'} className="text-sky-500 self-end">
                    {t('auth.forgot_password') + '?'}
                </Link>

                <ButtonGradientLoading
                    defaultText={t('auth.login')}
                    isLoading={isSubmitting}
                    loadingText={t('auth.logging_in')}
                    buttonProps={{
                        onPress: handleSubmit(handleCredentialLogin),
                        disabled: isSubmitting,
                    }}
                    linearGradientProps={{
                        className: 'w-full rounded-lg items-center flex-row justify-center gap-x-4 py-2 h-14',
                        colors: ['#3C82F6', '#A755F7'],
                        start: [0, 1],
                        end: [1, 0],
                    }}
                    buttonTextProps={{
                        className: 'text-white',
                        lightColor: 'white',
                    }}
                    buttonSpinnerProps={{
                        className: 'color-black',
                    }}
                />

                <Divider content={t('auth.or_login_with')} />

                <View className="flex-row justify-center gap-x-5">
                    {SOCIAL_MEDIA_ICONS.map(({ color, name, platform, size }, index) => (
                        <OAuthButton color={color} name={name} platform={platform} size={size} key={index} handleOAuth={handleOAuth} />
                    ))}
                </View>

                <View className="flex-row justify-center gap-x-1">
                    <Text>{t('auth.do_not_have_an_account')}</Text>
                    <Link href={'/(auth)/register'} className="text-sky-500 self-end">
                        {t('auth.register_now')}
                    </Link>
                </View>
            </View>
        </KeyboardAvoidingScrollView>
    );
}
