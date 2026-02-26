import type { FieldError } from 'react-hook-form';

import { TextValidateError } from '~components/text';
import { Text, View } from '~components/themed';
import { Input, InputField, InputIcon, InputSlot } from '~components/ui/input';

type PasswordInputProps = {
    /**
     * Props cho view container ngoài cùng
     */
    containerProps?: React.ComponentProps<typeof View>;
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
    /**
     * Label của input.
     */
    label?: string;
    /**
     * Hiển thị * đỏ.
     * Lưu ý: Nếu không có label thì không hiển thị.
     * Lưu ý 2: Chỉ hiển thị giao diện chứ không tham gia logic validation.
     */
    required?: boolean;
};

/**
 * Input cơ bản.
 */
export const InputBase = (props: PasswordInputProps) => {
    const { containerProps, inputProps, inputFieldProps, iconProps, errorText, label, required } = props;
    const { className, ...restContainerProps } = containerProps ?? {};

    return (
        <View {...restContainerProps} className={['gap-y-3', className].filter(Boolean).join(' ')}>
            {label ? (
                <Text className="text-base font-semibold">
                    {label}

                    {required ? (
                        <Text darkColor="red" lightColor="red">
                            *
                        </Text>
                    ) : null}
                </Text>
            ) : null}

            <Input {...inputProps}>
                {iconProps ? (
                    <InputSlot className="pl-3">
                        <InputIcon {...iconProps} />
                    </InputSlot>
                ) : null}

                <InputField {...inputFieldProps} />
            </Input>

            <TextValidateError content={errorText} lightColor="red" darkColor="red" />
        </View>
    );
};
