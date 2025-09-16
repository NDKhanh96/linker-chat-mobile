import { zodResolver } from '@hookform/resolvers/zod';
import { Link, useRouter } from 'expo-router';
import { Lock, Mail } from 'lucide-react-native';
import { Controller, useForm } from 'react-hook-form';
import { Platform } from 'react-native';
import type { z } from 'zod';

import { useRegisterMutation } from '~/services';
import { ButtonGradientLoading } from '~components/button';
import { InputBase, InputPassword } from '~components/input';
import { AvatarPicker } from '~components/picker';
import { KeyboardAvoidingScrollView, Text, View } from '~components/themed';
import { registerSchema } from '~utils/form-schema';
import { t } from '~utils/locales';

export default function Register(): React.JSX.Element {
    const router = useRouter();
    const [register] = useRegisterMutation();

    const {
        control,
        handleSubmit,
        formState: { errors, isSubmitting },
    } = useForm<z.infer<typeof registerSchema>>({ resolver: zodResolver(registerSchema) });

    const handleRegister = async (data: z.infer<typeof registerSchema>) => {
        const res = await register(data);

        if (res.data) {
            router.navigate('/(main)');
        }
    };

    return (
        <KeyboardAvoidingScrollView className={`px-5 justify-center gap-y-8 ${Platform.OS === 'android' ? 'mt-10' : ''}`}>
            <View className="gap-y-2">
                <Text className="text-3xl font-bold">{t('auth.register')}</Text>

                <Text className="text-lg text-gray-500">{t('auth.register_description_1')}</Text>
            </View>

            <Controller
                control={control}
                name="picture"
                render={({ field: { onChange, value } }) => <AvatarPicker value={value} onChange={onChange} text={t('auth.add_avatar')} />}
            />

            <Controller
                control={control}
                name="email"
                render={({ field: { onChange, onBlur, value } }) => (
                    <InputBase
                        errorText={errors.email}
                        label={t('auth.email')}
                        required
                        inputProps={{
                            variant: 'outline',
                            size: 'xl',
                            isDisabled: isSubmitting,
                            isInvalid: !!errors.email,
                        }}
                        inputFieldProps={{
                            onBlur,
                            value,
                            autoCapitalize: 'none',
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
                        label={t('auth.password')}
                        required
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
                            placeholder: t('auth.password'),
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
                        label={t('auth.confirm_password')}
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
                            placeholder: t('auth.confirm_password'),
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
                name="firstName"
                render={({ field: { onChange, onBlur, value } }) => (
                    <InputBase
                        errorText={errors.firstName}
                        label={t('auth.first_name')}
                        inputProps={{
                            variant: 'outline',
                            size: 'xl',
                            isDisabled: isSubmitting,
                            isInvalid: !!errors.firstName,
                        }}
                        inputFieldProps={{
                            onBlur,
                            value,
                            onChangeText: onChange,
                            placeholder: t('auth.first_name'),
                        }}
                    />
                )}
            />

            <Controller
                control={control}
                name="lastName"
                render={({ field: { onChange, onBlur, value } }) => (
                    <InputBase
                        errorText={errors.lastName}
                        label={t('auth.last_name')}
                        inputProps={{
                            variant: 'outline',
                            size: 'xl',
                            isDisabled: isSubmitting,
                            isInvalid: !!errors.lastName,
                        }}
                        inputFieldProps={{
                            onBlur,
                            value,
                            onChangeText: onChange,
                            placeholder: t('auth.last_name'),
                        }}
                    />
                )}
            />

            <ButtonGradientLoading
                defaultText={t('auth.register')}
                isLoading={isSubmitting}
                loadingText={t('auth.logging_in')}
                buttonProps={{
                    onPress: handleSubmit(handleRegister),
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

            <Link dismissTo href={'/(auth)'} className="text-sky-500 self-center">
                {t('auth.return_to_login')}
            </Link>
        </KeyboardAvoidingScrollView>
    );
}
