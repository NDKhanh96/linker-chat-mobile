import { useState } from 'react';

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
     * Props cho pressable (kế thừa toàn bộ từ component Pressable của react native).
     */
    inputSlotProps?: React.ComponentProps<typeof InputSlot>;
    /**
     * Props cho view chứa icon (kế thừa toàn bộ từ component View của react native).
     */
    inputIconProps?: React.ComponentProps<typeof InputIcon>;
};

/**
 * Input dành cho password, có icon hiện/ẩn password.
 */
export const InputPassword = (props: PasswordInputProps) => {
    const { inputProps, inputFieldProps, inputSlotProps, inputIconProps } = props;

    const [showPassword, setShowPassword] = useState<boolean>(false);

    const onPressEyeIcon = () => {
        setShowPassword(prev => !prev);
    };

    return (
        <Input {...inputProps}>
            <InputField type={showPassword ? 'text' : 'password'} {...inputFieldProps} />

            <InputSlot onPress={onPressEyeIcon} {...inputSlotProps}>
                <InputIcon as={showPassword ? EyeIcon : EyeOffIcon} {...inputIconProps} />
            </InputSlot>
        </Input>
    );
};
