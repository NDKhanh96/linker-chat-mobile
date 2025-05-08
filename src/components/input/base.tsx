import type { FieldError } from 'react-hook-form';

import { TextValidateError } from '~components/text';
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
     * Props cho icon.
     */
    iconProps?: React.ComponentProps<typeof InputIcon>;
    /**
     * Text hiển thị lỗi.
     */
    errorText?: FieldError;
};

/**
 * Input cơ bản.
 */
export const InputBase = (props: PasswordInputProps) => {
    const { inputProps, inputFieldProps, iconProps, errorText } = props;

    return (
        <>
            <Input {...inputProps}>
                <InputSlot className="pl-3">
                    <InputIcon {...iconProps} />
                </InputSlot>

                <InputField {...inputFieldProps} />
            </Input>

            <TextValidateError content={errorText} lightColor="red" darkColor="red" />
        </>
    );
};
