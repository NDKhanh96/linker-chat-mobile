import { useLocalSearchParams, useRouter } from 'expo-router';
import React, { useRef } from 'react';
import { Button } from 'react-native';

import { setProfile } from '~/redux/slices/user.slice';
import { useAppDispatch } from '~/redux/store';
import { useValidateEmailOtpMutation } from '~/services';
import { OTPInput, type OTPInputRef } from '~components/input';
import { Text, View } from '~components/themed';
import { getProfileFromToken } from '~utils/common';
import { t } from '~utils/locales';

/**
 * Screen này cần phải có email lấy từ params
 */
export default function OTP(): React.JSX.Element {
    const router = useRouter();
    const dispatch = useAppDispatch();
    const { email } = useLocalSearchParams<{ email: string }>();

    const [validateEmailOTP] = useValidateEmailOtpMutation();

    const otpInputRef = useRef<OTPInputRef>(null);

    const handleClearOTP = () => {
        otpInputRef.current?.clear();
    };

    const handleOTPComplete = async (otp: string) => {
        const res = await validateEmailOTP({ email, token: otp, getAuthTokens: true });

        if (res.data?.verified) {
            dispatch(setProfile(getProfileFromToken(res.data.authToken.accessToken)));
            router.replace('/(main)');
        }
    };

    return (
        <View className="flex-1 items-center justify-center px-5 gap-y-8">
            <Text className="text-2xl font-bold">Enter OTP</Text>

            <Text className="text-gray-500 text-center">{t('forgot_password.success_response')}</Text>

            <OTPInput ref={otpInputRef} onComplete={handleOTPComplete} />

            <Button title="Clear OTP" onPress={handleClearOTP} />
        </View>
    );
}
