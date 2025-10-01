import { Input, InputField, InputIcon, InputSlot } from '~components/ui/input';

type SearchInputProps = {
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
};

export function SearchInput(props: SearchInputProps): React.JSX.Element {
    const { inputProps, inputFieldProps, iconProps } = props;

    return (
        <Input {...inputProps}>
            <InputSlot className="pl-3">
                <InputIcon {...iconProps} />
            </InputSlot>

            <InputField {...inputFieldProps} />
        </Input>
    );
}
