import { Input, InputField } from '~components/ui/input';

type PasswordInputProps = {
    /**
     * Props cho view container (kế thừa toàn bộ từ component View của react native).
     */
    inputProps?: React.ComponentProps<typeof Input>;
    /**
     * Props cho input field (kế thừa toàn bộ từ component TextInput của react native).
     */
    inputFieldProps?: React.ComponentProps<typeof InputField>;
};

/**
 * Input cơ bản.
 */
export const InputBase = (props: PasswordInputProps) => {
    const { inputProps, inputFieldProps } = props;

    return (
        <Input {...inputProps}>
            <InputField {...inputFieldProps} />
        </Input>
    );
};
