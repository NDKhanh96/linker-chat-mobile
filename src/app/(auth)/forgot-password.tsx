import { zodResolver } from '@hookform/resolvers/zod';
import { Link, useRouter } from 'expo-router';
import { Mail } from 'lucide-react-native';
import { Controller, useForm } from 'react-hook-form';
import type { z } from 'zod';

import { useForgotPasswordMutation } from '~/services';
import { ButtonGradientLoading } from '~components/button';
import { InputBase } from '~components/input';
import { KeyboardAvoidingScrollView, Text, View } from '~components/themed';
import { forgotPasswordSchema } from '~utils/form-schema';
import { t } from '~utils/locales';

export default function ForgotPassword(): React.JSX.Element {
    const router = useRouter();
    const [forgotPassword] = useForgotPasswordMutation();

    const {
        control,
        handleSubmit,
        formState: { errors, isSubmitting },
    } = useForm<z.infer<typeof forgotPasswordSchema>>({ resolver: zodResolver(forgotPasswordSchema) });

    const handleForgotPassword = async (data: z.infer<typeof forgotPasswordSchema>) => {
        const res = await forgotPassword(data);

        if (res.data) {
            router.navigate({ pathname: '/(auth)/reset-password/[email]', params: { email: data.email } });
        }
    };

    return (
        <KeyboardAvoidingScrollView className="flex-1 px-5 justify-center gap-y-8">
            <View className="gap-y-2">
                <Text className="text-3xl font-bold">{t('auth.forgot_password')}</Text>

                <Text className="text-lg text-gray-500">{t('auth.forgot_password_description_1')}</Text>
            </View>

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
                            autoCapitalize: 'none',
                        }}
                        iconProps={{
                            as: Mail,
                        }}
                    />
                )}
            />

            <ButtonGradientLoading
                defaultText={t('global.submit')}
                isLoading={isSubmitting}
                loadingText={t('global.submitting')}
                buttonProps={{
                    onPress: handleSubmit(handleForgotPassword),
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

            <Text className="text-lg text-gray-500 text-center">{t('auth.forgot_password_description_2')}</Text>

            <Link href={'/(auth)'} className="text-sky-500 self-center">
                {t('auth.return_to_login')}
            </Link>
        </KeyboardAvoidingScrollView>
    );
}
