import { zodResolver } from '@hookform/resolvers/zod';
import { useRouter } from 'expo-router';
import { ChevronRight, Lock } from 'lucide-react-native';
import { Controller, useForm } from 'react-hook-form';
import { Platform } from 'react-native';
import type { z } from 'zod';

import { ButtonGradientLoading, ButtonWithIcon } from '~components/button';
import { InputBase } from '~components/input';
import { Divider } from '~components/line';
import { AvatarPicker } from '~components/picker';
import { KeyboardAvoidingScrollView, Text, View } from '~components/themed';

import { useProfileQuery, useUpdateProfileMutation } from '~/services';
import { updateProfileSchema } from '~utils/form-schema';
import { t } from '~utils/locales';

export default function Profile(): React.JSX.Element {
    const router = useRouter();
    const { data: profileData, isLoading } = useProfileQuery();
    const [updateProfile] = useUpdateProfileMutation();

    const {
        control,
        handleSubmit,
        formState: { errors, isSubmitting },
    } = useForm<z.infer<typeof updateProfileSchema>>({
        resolver: zodResolver(updateProfileSchema),
        values: {
            firstName: profileData?.firstName ?? '',
            lastName: profileData?.lastName ?? '',
            avatar: profileData?.avatar ?? '',
        },
    });

    const handleUpdateProfile = async (data: z.infer<typeof updateProfileSchema>) => {
        await updateProfile(data);
    };

    const handleToChangePassword = () => {
        router.push('/(main)/(menu)/(profile)/change-password');
    };

    return (
        <KeyboardAvoidingScrollView className={`px-5 flex-1 gap-y-8 ${Platform.OS === 'android' ? 'mt-10' : ''}`}>
            <View className="gap-y-2">
                <Text className="text-3xl font-bold">{t('profile.edit_profile')}</Text>

                <Text className="text-lg text-gray-500">{t('profile.edit_profile_description_1')}</Text>
            </View>

            <Controller
                control={control}
                name="avatar"
                render={({ field: { onChange, value } }) => <AvatarPicker value={value} onChange={onChange} text={t('auth.add_avatar')} />}
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
                            isDisabled: isSubmitting || isLoading,
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
                            isDisabled: isSubmitting || isLoading,
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
                defaultText={t('global.submit')}
                isLoading={isSubmitting || isLoading}
                loadingText={t('global.submitting')}
                buttonProps={{
                    onPress: handleSubmit(handleUpdateProfile),
                    disabled: isSubmitting || isLoading,
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

            <Divider content={t('auth.privacy_and_security')} />

            <ButtonWithIcon
                text={t('auth.change_password')}
                title={t('auth.change_password_title')}
                leftIcon={Lock}
                rightIcon={ChevronRight}
                buttonProps={{
                    variant: 'outline',
                    action: 'primary',
                    className: 'h-auto py-3',
                    onPress: handleToChangePassword,
                }}
                containerTextProps={{
                    className: 'flex-1 pl-2',
                }}
                buttonTitleProps={{
                    className: 'font-semibold text-base',
                }}
                buttonTextProps={{
                    className: 'text-sm text-gray-500 font-normal',
                }}
            />
        </KeyboardAvoidingScrollView>
    );
}
