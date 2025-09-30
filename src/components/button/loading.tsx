import colors from 'tailwindcss/colors';

import { Button, ButtonSpinner, ButtonText } from '~components/ui/button';

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
     * trạng thái của spinner trên button.
     * @default falsy
     */
    isLoading: boolean;
    /**
     * text hiển thị trên button nếu loading là falsy.
     */
    defaultText: string;
    /**
     * text hiển thị trên button nếu isLoading là true.
     */
    loadingText: string;
};

/**
 * Button cơ bản.
 */
export function ButtonLoading(props: ButtonProps) {
    const { buttonProps, buttonTextProps, isLoading, defaultText, loadingText } = props;

    return (
        <Button {...buttonProps}>
            {isLoading ? <ButtonSpinner color={colors.gray[400]} /> : null}

            <ButtonText {...buttonTextProps}>{!isLoading ? defaultText : loadingText}</ButtonText>
        </Button>
    );
}
