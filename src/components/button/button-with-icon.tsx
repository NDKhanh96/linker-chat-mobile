import { type LucideIcon } from 'lucide-react-native';
import { View } from '~components/themed';
import { Button, ButtonIcon, ButtonText } from '~components/ui/button';

type ButtonProps = {
    /**
     * Props cho pressable (kế thừa toàn bộ từ component Pressable của react native).
     */
    buttonProps?: {
        variant?: 'solid' | 'outline' | 'link';
        action?: 'primary' | 'secondary' | 'positive' | 'negative';
        className?: string;
    } & React.ComponentProps<typeof Button>;
    /**
     * Props cho container chứa title và text (kế thừa toàn bộ từ component View của react native).
     */
    containerTextProps?: React.ComponentProps<typeof View>;
    /**
     * Props cho title (kế thừa toàn bộ từ component Text của react native).
     */
    buttonTitleProps?: React.ComponentProps<typeof ButtonText>;
    /**
     * Title của button.
     */
    title?: string;
    /**
     * Props cho button text (kế thừa toàn bộ từ component Text của react native).
     */
    buttonTextProps?: React.ComponentProps<typeof ButtonText>;
    /**
     * Text hiển thị trên button.
     */
    text: string;
    /**
     * Icon hiển thị bên trái button.
     */
    leftIcon?: LucideIcon;
    /**
     * Icon hiển thị bên phải button.
     */
    rightIcon?: LucideIcon;
};

/**
 * Button cơ bản.
 */
export function ButtonWithIcon(props: ButtonProps) {
    const { buttonProps, buttonTextProps, buttonTitleProps, text, leftIcon, rightIcon, title, containerTextProps } = props;

    return (
        <Button {...buttonProps}>
            {leftIcon && <ButtonIcon as={leftIcon} />}

            <View {...containerTextProps}>
                {title && <ButtonText {...buttonTitleProps}>{title}</ButtonText>}

                <ButtonText {...buttonTextProps}>{text}</ButtonText>
            </View>

            {rightIcon && <ButtonIcon as={rightIcon} />}
        </Button>
    );
}
