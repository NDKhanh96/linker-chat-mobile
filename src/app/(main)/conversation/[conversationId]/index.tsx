import { zodResolver } from '@hookform/resolvers/zod';
import { useLocalSearchParams } from 'expo-router';
import { useMemo } from 'react';
import { Controller, useForm } from 'react-hook-form';
import { FlatList, TouchableOpacity } from 'react-native';
import type { z } from 'zod';

import { useMessageListQuery, useSendMessageMutation } from '~/services';

import { InputBase } from '~components/input';
import { MessageItem } from '~components/message';
import { Text, View } from '~components/themed';
import { sendMessageSchema } from '~utils/form-schema';

// TODO: thêm tính năng gửi file, ảnh, reply message, chỉnh sửa message, xoá message, typing indicator, seen indicator, pagination khi scroll lên trên
export default function Conversation(): React.JSX.Element {
    const { conversationId } = useLocalSearchParams<{ conversationId: string }>();

    const { data } = useMessageListQuery({ id: conversationId });
    const [sendMessageMutation] = useSendMessageMutation();

    const {
        control,
        handleSubmit,
        formState: { errors, isSubmitting },
    } = useForm<z.infer<typeof sendMessageSchema>>({ resolver: zodResolver(sendMessageSchema) });

    const sendMessage = async (values: z.infer<typeof sendMessageSchema>) => {
        await sendMessageMutation({
            conversationId,
            content: values.content,
            attachmentIds: values.attachmentIds,
            replyToId: undefined,
        });
    };

    /**
     * Vì dùng inverted trên FlatList nên:
     * - prev = arr[index + 1];
     * - next = arr[index - 1];
     *
     *  Nếu không dùng inverted thì đảo ngược lại
     */
    const processedMessages = useMemo(() => {
        if (!data?.data) {
            return [];
        }

        return data.data.map((msg, index, arr) => {
            const prev = arr[index + 1];
            const next = arr[index - 1];

            return {
                ...msg,
                isFirstInBlock: prev?.sender.id !== msg.sender.id,
                isLastInBlock: next?.sender.id !== msg.sender.id,
            };
        });
    }, [data]);

    return (
        <View className="flex-1">
            <FlatList
                data={processedMessages}
                contentContainerClassName="mx-5"
                inverted
                keyExtractor={item => item.id.toString()}
                renderItem={({ item }) => <MessageItem message={item} />}
            />

            <View className="flex-row items-center gap-x-2 px-4 pt-3 border-t border-gray-200">
                <TouchableOpacity className="bg-blue-500 px-4 py-2 rounded-full" onPress={handleSubmit(sendMessage)}>
                    <Text>+</Text>
                </TouchableOpacity>

                <Controller
                    control={control}
                    name="content"
                    render={({ field: { onChange, onBlur, value } }) => (
                        <InputBase
                            containerProps={{ className: 'flex-1' }}
                            errorText={errors.content}
                            inputProps={{
                                variant: 'outline',
                                size: 'xl',
                                isDisabled: isSubmitting,
                                isInvalid: !!errors.content,
                                className: 'border-0',
                            }}
                            inputFieldProps={{
                                onBlur,
                                value,
                                autoCapitalize: 'none',
                                onChangeText: onChange,
                                className: 'rounded-full bg-gray-200',
                            }}
                        />
                    )}
                />

                <TouchableOpacity className="bg-blue-500 px-4 py-2 rounded-full" onPress={handleSubmit(sendMessage)}>
                    <Text className="text-white text-center">Send</Text>
                </TouchableOpacity>
            </View>
        </View>
    );
}
