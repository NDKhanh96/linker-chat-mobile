import { TouchableOpacity } from 'react-native';

import { Text } from '~components/themed';
import { ButtonSpinner } from '~components/ui/button';
import { LinearGradient } from '~components/ui/linear-gradient';

type ButtonProps = {
    /**
     * Props cho TouchableOpacity (kế thừa toàn bộ từ component TouchableOpacity của react native).
     * Riêng với className thì sẽ lấy từ className của LinearGradient.
     */
    buttonProps?: React.ComponentProps<typeof TouchableOpacity>;
    /**
     * Props cho linear gradient.
     */
    linearGradientProps: React.ComponentProps<typeof LinearGradient>;
    /**
     * Props cho button text (kế thừa toàn bộ từ component Text của react native).
     */
    buttonTextProps?: React.ComponentProps<typeof Text>;
    /**
     * trạng thái của spinner trên button.
     * @default falsy
     */
    isLoading: boolean;
    /**
     * Props cho spinner
     */
    buttonSpinnerProps?: React.ComponentProps<typeof ButtonSpinner>;
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
 * Button có linear gradient.
 */
export function ButtonGradientLoading(props: ButtonProps) {
    const { buttonProps, linearGradientProps, buttonTextProps, isLoading, buttonSpinnerProps, defaultText, loadingText } = props;

    return (
        <TouchableOpacity {...buttonProps} className={linearGradientProps.className}>
            <LinearGradient {...linearGradientProps}>
                {isLoading ? <ButtonSpinner {...buttonSpinnerProps} /> : null}

                <Text {...buttonTextProps}>{!isLoading ? defaultText : loadingText}</Text>
            </LinearGradient>
        </TouchableOpacity>
    );
}
