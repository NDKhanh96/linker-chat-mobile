import { Button, ButtonText } from '~components/ui/button';

type ButtonProps = {
    /**
     * Props cho pressable (kế thừa toàn bộ từ component Pressable của react native).
     */
    buttonProps?: React.ComponentProps<typeof Button>;
    /**
     * Props cho button text (kế thừa toàn bộ từ component Text của react native).
     */
    buttonTextProps?: React.ComponentProps<typeof ButtonText>;
    /**
     * text hiển thị trên button.
     */
    text: string;
};

/**
 * Button cơ bản.
 */
export function ButtonBase(props: ButtonProps) {
    const { buttonProps, buttonTextProps, text } = props;

    return (
        <Button {...buttonProps}>
            <ButtonText {...buttonTextProps}>{text}</ButtonText>
        </Button>
    );
}
