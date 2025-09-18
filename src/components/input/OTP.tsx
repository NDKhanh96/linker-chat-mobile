import React, { forwardRef, useImperativeHandle, useRef, useState } from 'react';
import { Keyboard, NativeSyntheticEvent, TextInput, TextInputKeyPressEventData } from 'react-native';

import { View } from '~components/themed';

export type OTPInputRef = {
    clear: () => void;
};

type OTPInputProps = {
    length?: number;
    onComplete: (otp: string) => void;
};

function OTP(Props: OTPInputProps, ref: React.Ref<OTPInputRef>) {
    const { length = 6, onComplete } = Props;

    const inputRefs = useRef(Array<TextInput | null>(length).fill(null));

    const [otp, setOtp] = useState<string[]>(Array(length).fill(''));

    /**
     * Expose các phương thức cho component cha thông qua ref
     */
    useImperativeHandle(ref, () => ({
        clear: () => {
            setOtp(Array(length).fill(''));
            inputRefs.current[0]?.focus();
        },
    }));

    const handleChange = (text: string, idx: number) => {
        if (text.length > 1) {
            handlePasteOTP(text);

            return;
        }
        setOtp(prev => {
            const newOtp = [...prev];

            newOtp[idx] = text;

            if (text && idx < length - 1) {
                setTimeout(() => {
                    inputRefs.current[idx + 1]?.focus();
                }, 10);
            } else if (!text && idx > 0) {
                setTimeout(() => {
                    inputRefs.current[idx - 1]?.focus();
                }, 10);
            }

            handleCheckComplete(newOtp);

            return newOtp;
        });
    };

    const handlePasteOTP = (text: string) => {
        const nonDigitRegex = /\D/g;
        const numericText = text.replace(nonDigitRegex, '').slice(0, length);

        if (numericText.length === 0) {
            return;
        }
        const newOtp = Array<string>(length).fill('');

        numericText.split('').forEach((digit, i) => {
            if (i < length) {
                newOtp[i] = digit;
            }
        });

        setOtp(newOtp);
        handleCheckComplete(newOtp);

        const nextIndex = Math.min(numericText.length, length - 1);

        setTimeout(() => {
            inputRefs.current[nextIndex]?.focus();
        }, 10);
    };

    /**
     * Kiểm tra nếu tất cả các ô đã được điền, gọi onComplete với mã OTP đầy đủ
     */
    const handleCheckComplete = (newOtp: string[]) => {
        if (newOtp.every(digit => digit !== '')) {
            onComplete(newOtp.join(''));
            Keyboard.dismiss();
        }
    };

    const handleKeyPress = (key: string, idx: number) => {
        if (key === 'Backspace' && !otp[idx] && idx > 0) {
            handlePressDelete(idx);
        }
    };

    const handlePressDelete = (idx: number) => {
        setOtp(prev => {
            const newOtp = [...prev];

            newOtp[idx - 1] = '';

            return newOtp;
        });

        setTimeout(() => {
            inputRefs.current[idx - 1]?.focus();
        }, 10);
    };

    return (
        <View className="flex-row justify-center items-center gap-x-2">
            {otp.map((value, index) => (
                <View key={index} className="w-[15%] h-16 border border-gray-300 rounded-lg items-center justify-center">
                    <TextInput
                        ref={ref => {
                            inputRefs.current[index] = ref;
                        }}
                        autoFocus={index === 0} // Chỉ focus input đầu tiên khi mount
                        value={value}
                        keyboardType="numeric"
                        onChangeText={(text: string) => handleChange(text, index)}
                        onKeyPress={({ nativeEvent }: NativeSyntheticEvent<TextInputKeyPressEventData>) => handleKeyPress(nativeEvent.key, index)}
                        textAlign="center"
                        autoComplete="sms-otp"
                        textContentType="oneTimeCode"
                    />
                </View>
            ))}
        </View>
    );
}

export const OTPInput = forwardRef<OTPInputRef, OTPInputProps>(OTP);
