import { zodResolver } from '@hookform/resolvers/zod';
import { useRouter } from 'expo-router';
import { Lock } from 'lucide-react-native';
import { Controller, useForm } from 'react-hook-form';
import { Platform } from 'react-native';
import type { z } from 'zod';

import { ButtonGradientLoading } from '~components/button';
import { InputPassword } from '~components/input';
import { KeyboardAvoidingScrollView, Text, View } from '~components/themed';

import { useChangePasswordMutation } from '~/services';
import { changePasswordSchema } from '~utils/form-schema';
import { t } from '~utils/locales';

export default function ChangePassword() {
    const router = useRouter();
    const [changePassword] = useChangePasswordMutation();

    const {
        control,
        handleSubmit,
        formState: { errors, isSubmitting },
    } = useForm<z.infer<typeof changePasswordSchema>>({
        resolver: zodResolver(changePasswordSchema),
        values: {
            oldPassword: '',
            newPassword: '',
            confirmPassword: '',
        },
    });

    const handleChangePassword = async (data: z.infer<typeof changePasswordSchema>) => {
        await changePassword(data);
        router.back();
    };

    return (
        <KeyboardAvoidingScrollView className={`px-5 flex-1 gap-y-8 ${Platform.OS === 'android' ? 'mt-10' : ''}`}>
            <View className="gap-y-2">
                <Text className="text-3xl font-bold">{t('auth.change_password_title')}</Text>

                <Text className="text-lg text-gray-500">{t('auth.change_password_description_1')}</Text>
            </View>

            <View className="gap-y-16">
                <View className="gap-y-4">
                    <Controller
                        control={control}
                        name="oldPassword"
                        render={({ field: { onChange, onBlur, value } }) => (
                            <InputPassword
                                errorText={errors.oldPassword}
                                label={t('auth.current_password')}
                                required
                                inputProps={{
                                    variant: 'outline',
                                    size: 'xl',
                                    isDisabled: isSubmitting,
                                    isInvalid: !!errors.oldPassword,
                                }}
                                inputFieldProps={{
                                    onBlur,
                                    value,
                                    onChangeText: onChange,
                                    placeholder: t('auth.current_password'),
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
                        name="newPassword"
                        render={({ field: { onChange, onBlur, value } }) => (
                            <InputPassword
                                errorText={errors.newPassword}
                                label={t('reset_password.new_password')}
                                required
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
                                label={t('reset_password.confirm_new_password')}
                                required
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
                </View>

                <ButtonGradientLoading
                    defaultText={t('global.submit')}
                    isLoading={isSubmitting}
                    loadingText={t('global.submitting')}
                    buttonProps={{
                        onPress: handleSubmit(handleChangePassword),
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
            </View>
        </KeyboardAvoidingScrollView>
    );
}
