import React from 'react';
import { TouchableOpacity } from 'react-native';

import { View } from '~components/themed';
import { CloseIcon, Icon } from '~components/ui/icon';
import { Toast, ToastDescription, ToastTitle, useToast } from '~components/ui/toast';

export function useErrorToast() {
    const toast = useToast();

    const showErrorToast = React.useCallback(
        (message = 'Something went wrong.') => {
            const newId = Math.random().toString();

            toast.show({
                id: newId,
                placement: 'top',
                duration: 3000,
                render: ({ id }) => (
                    <Toast
                        action="error"
                        variant="outline"
                        nativeID={'toast-' + id}
                        className="p-4 gap-6 border-error-500 w-11/12 shadow-hard-5 flex-row justify-between self-center"
                    >
                        <View className="flex-row gap-3">
                            <View className="flex-col gap-1">
                                <ToastTitle size="lg" className="font-bold text-error-500">
                                    Error!
                                </ToastTitle>
                                <ToastDescription size="lg">{message}</ToastDescription>
                            </View>
                        </View>
                        <View className="min-[450px]:gap-3 gap-1 flex-row">
                            <TouchableOpacity onPress={() => toast.close(id)}>
                                <Icon as={CloseIcon} />
                            </TouchableOpacity>
                        </View>
                    </Toast>
                ),
            });
        },
        [toast],
    );

    return showErrorToast;
}
