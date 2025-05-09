import { useState } from 'react';
import type { FieldError } from 'react-hook-form';
import { TextValidateError } from '~components/text';

import { EyeIcon, EyeOffIcon } from '~components/ui/icon';
import { Input, InputField, InputIcon, InputSlot } from '~components/ui/input';

type PasswordInputProps = {
    /**
     * Props cho view container (kế thừa toàn bộ từ component View của react native).
     */
    inputProps?: React.ComponentProps<typeof Input>;

    /**
     * Props cho input field (kế thừa toàn bộ từ component TextInput của react native).
     */
    inputFieldProps?: React.ComponentProps<typeof InputField>;

    /**
     * Props cho pressable bên trái (kế thừa toàn bộ từ component Pressable của react native).
     */
    inputSlotLeftProps?: React.ComponentProps<typeof InputSlot>;

    /**
     * Props cho pressable bên phải (kế thừa toàn bộ từ component Pressable của react native).
     */
    inputSlotRightProps?: React.ComponentProps<typeof InputSlot>;

    /**
     * Props cho view chứa icon bên trái (kế thừa toàn bộ từ component View của react native).
     */
    iconLeftProps?: React.ComponentProps<typeof InputIcon>;

    /**
     * Props cho view chứa icon bên phải (kế thừa toàn bộ từ component View của react native).
     */
    iconRightProps?: React.ComponentProps<typeof InputIcon>;

    /**
     * Text hiển thị lỗi.
     */
    errorText?: FieldError;
};

/**
 * Input dành cho password, có icon hiện/ẩn password.
 */
export const InputPassword = (props: PasswordInputProps) => {
    const { inputProps, inputFieldProps, inputSlotLeftProps, inputSlotRightProps, iconLeftProps, iconRightProps, errorText } = props;

    const [showPassword, setShowPassword] = useState<boolean>(false);

    const onPressEyeIcon = () => {
        setShowPassword(prev => !prev);
    };

    return (
        <>
            <Input {...inputProps}>
                {iconLeftProps ? (
                    <InputSlot className="pl-3" {...inputSlotLeftProps}>
                        <InputIcon {...iconLeftProps} />
                    </InputSlot>
                ) : null}

                <InputField type={showPassword ? 'text' : 'password'} {...inputFieldProps} />

                <InputSlot onPress={onPressEyeIcon} {...inputSlotRightProps}>
                    <InputIcon as={showPassword ? EyeIcon : EyeOffIcon} {...iconRightProps} />
                </InputSlot>
            </Input>

            <TextValidateError content={errorText} lightColor="red" darkColor="red" />
        </>
    );
};
