import { zodResolver } from '@hookform/resolvers/zod';
import { Link, useLocalSearchParams, useRouter } from 'expo-router';
import { Lock } from 'lucide-react-native';
import { Controller, useForm } from 'react-hook-form';
import type { z } from 'zod';

import { useResetPasswordMutation } from '~/services';
import { ButtonGradientLoading } from '~components/button';
import { InputBase, InputPassword } from '~components/input';
import { KeyboardAvoidingScrollView, Text, View } from '~components/themed';
import { resetPasswordSchema } from '~utils/form-schema';
import { t } from '~utils/locales';

export default function ResetPassword(): React.JSX.Element {
    const router = useRouter();

    const { email } = useLocalSearchParams<{ email: string }>();

    const [resetPassword] = useResetPasswordMutation();

    const {
        control,
        handleSubmit,
        formState: { errors, isSubmitting },
    } = useForm<z.infer<typeof resetPasswordSchema>>({
        resolver: zodResolver(resetPasswordSchema),
        defaultValues: { token: '', newPassword: '', confirmPassword: '' },
    });

    const onSubmit = async (data: z.infer<typeof resetPasswordSchema>) => {
        const params = { ...data, email };

        const res = await resetPassword(params);

        if (res.data) {
            router.replace('/(auth)');
        }
    };

    return (
        <KeyboardAvoidingScrollView className="flex-1 px-5 justify-center gap-y-8">
            <View className="gap-y-2">
                <Text className="text-3xl font-bold">{t('reset_password.reset_password_screen_title')}</Text>

                <Text className="text-lg text-gray-500">{t('reset_password.reset_password_description_1')}</Text>
            </View>

            <Controller
                control={control}
                name="token"
                render={({ field: { onChange, onBlur, value } }) => (
                    <InputBase
                        errorText={errors.token}
                        inputProps={{
                            variant: 'outline',
                            size: 'xl',
                            isDisabled: isSubmitting,
                            isInvalid: !!errors.token,
                        }}
                        inputFieldProps={{
                            onBlur,
                            value,
                            onChangeText: onChange,
                            placeholder: t('reset_password.verification_code'),
                            autoCapitalize: 'none',
                        }}
                    />
                )}
            />

            <Controller
                control={control}
                name="newPassword"
                render={({ field: { onChange, onBlur, value } }) => (
                    <InputPassword
                        errorText={errors.newPassword}
                        inputProps={{
                            variant: 'outline',
                            size: 'xl',
                            isDisabled: isSubmitting,
                            isInvalid: !!errors.newPassword,
                        }}
                        inputFieldProps={{
                            onBlur,
                            value,
                            onChangeText: onChange,
                            placeholder: t('reset_password.new_password'),
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

            <Controller
                control={control}
                name="confirmPassword"
                render={({ field: { onChange, onBlur, value } }) => (
                    <InputPassword
                        errorText={errors.confirmPassword}
                        inputProps={{
                            variant: 'outline',
                            size: 'xl',
                            isDisabled: isSubmitting,
                            isInvalid: !!errors.confirmPassword,
                        }}
                        inputFieldProps={{
                            onBlur,
                            value,
                            onChangeText: onChange,
                            placeholder: t('reset_password.confirm_new_password'),
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

            <ButtonGradientLoading
                defaultText={t('global.submit')}
                isLoading={isSubmitting}
                loadingText={t('global.submitting')}
                buttonProps={{
                    onPress: handleSubmit(onSubmit),
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

            <Link href={'/(auth)'} className="text-sky-500 self-center">
                {t('auth.return_to_login')}
            </Link>
        </KeyboardAvoidingScrollView>
    );
}
