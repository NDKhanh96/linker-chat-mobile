import { tva } from '@gluestack-ui/nativewind-utils/tva';
import { LinearGradient as ExpoLinearGradient } from 'expo-linear-gradient';
import { cssInterop } from 'nativewind';
import React from 'react';

type LinearGradientProps = React.ComponentProps<typeof ExpoLinearGradient> & {
    className?: string;
};

cssInterop(ExpoLinearGradient, {
    className: 'style',
});

const linearGradientStyle = tva({
    base: '',
});

export const LinearGradient = React.forwardRef<React.ComponentRef<typeof ExpoLinearGradient>, LinearGradientProps>(({ className, ...props }, ref?) => {
    return <ExpoLinearGradient {...props} className={linearGradientStyle({ class: className })} ref={ref} />;
});

LinearGradient.displayName = 'LinearGradient';
