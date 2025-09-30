import React from 'react';
import { TouchableOpacity, View } from 'react-native';

import type { ToastType } from '~/redux/slices';
import { CloseIcon, Icon } from '~components/ui/icon';
import { Toast, ToastDescription, ToastTitle } from '~components/ui/toast';

type Props = {
    title: string;
    description?: string;
    type: ToastType;
    toastId: string;
    borderClass: string;
    onClose: () => void;
};

export const BaseToast = React.memo((props: Props) => {
    const { title, description, type, toastId, borderClass, onClose } = props;

    return (
        <Toast
            key={toastId}
            nativeID={'toast-' + toastId}
            action={type}
            variant="outline"
            className={`p-4 gap-6 w-11/12 shadow-hard-5 flex-row justify-between self-center ${borderClass}`}
        >
            <View className="flex-row gap-3">
                <View className="flex-col gap-1">
                    <ToastTitle size="lg" className="font-bold">
                        {title}
                    </ToastTitle>

                    {description && <ToastDescription>{description}</ToastDescription>}
                </View>
            </View>

            <View className="min-[450px]:gap-3 gap-1 flex-row">
                <TouchableOpacity onPress={onClose}>
                    <Icon as={CloseIcon} />
                </TouchableOpacity>
            </View>
        </Toast>
    );
});

BaseToast.displayName = 'BaseToast';
