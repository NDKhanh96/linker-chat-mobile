import { memo } from 'react';
import { TouchableOpacity } from 'react-native';
import { useSelector } from 'react-redux';

import type { RootState } from '~/redux/store';
import { BASE_URL } from '~utils/environment';

import { Text, View } from '~components/themed';
import { Avatar, AvatarFallbackText, AvatarImage } from '~components/ui/avatar';

type MessageElement = {
    id: number;
    content: string;
    sender: {
        id: number;
        firstName: string;
        avatar?: string | null;
    };
    isFirstInBlock: boolean;
    isLastInBlock: boolean;
};

type Props = {
    message: MessageElement;
};

function Item({ message }: Props): React.JSX.Element {
    const userId = useSelector((state: RootState) => state.user.profile.id);
    const isMe = message.sender.id === userId;

    const { isFirstInBlock, isLastInBlock } = message;

    const showAvatar = !isMe && isLastInBlock;

    const bubbleClass = isMe
        ? `
      bg-blue-500 dark:bg-blue-600
      ${isFirstInBlock ? 'rounded-tr-2xl' : 'rounded-tr-md'}
      ${isLastInBlock ? 'rounded-br-2xl' : 'rounded-br-md'}
      rounded-tl-2xl rounded-bl-2xl
    `
        : `
      bg-gray-200 dark:bg-gray-700
      ${isFirstInBlock ? 'rounded-tl-2xl' : 'rounded-tl-md'}
      ${isLastInBlock ? 'rounded-bl-2xl' : 'rounded-bl-md'}
      rounded-tr-2xl rounded-br-2xl
    `;

    return (
        <View className={`flex gap-x-3 items-end ${isMe ? 'self-end' : 'flex-row'} ${isFirstInBlock ? 'mt-4' : 'mt-1'}`}>
            {!isMe && (
                <View className="w-8">
                    {showAvatar && (
                        <TouchableOpacity>
                            <Avatar size="sm">
                                <AvatarFallbackText>{message.sender.firstName}</AvatarFallbackText>

                                {message.sender.avatar?.trim() && (
                                    <AvatarImage
                                        source={{
                                            uri: BASE_URL + message.sender.avatar,
                                        }}
                                    />
                                )}
                            </Avatar>
                        </TouchableOpacity>
                    )}
                </View>
            )}

            <TouchableOpacity className={`px-4 py-2 flex-shrink ${bubbleClass}`}>
                <Text>{message.content}</Text>
            </TouchableOpacity>
        </View>
    );
}

export const MessageItem = memo(Item);
