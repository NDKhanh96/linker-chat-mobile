import { memo, useMemo } from 'react';
import { TouchableOpacity } from 'react-native';

import type { useListConversationQuery } from '~/services';
import { BASE_URL } from '~utils/environment';
import { t } from '~utils/locales';

import { Text, View } from '~components/themed';
import { Avatar, AvatarFallbackText, AvatarImage } from '~components/ui/avatar';

type ConversationElement = NonNullable<Awaited<ReturnType<ReturnType<typeof useListConversationQuery>['refetch']>>['data']>['data'][number];
type Props = {
    conversation: ConversationElement;
    handlePressConversation: (conversation: ConversationElement) => void;
};

function Item(props: Props): React.JSX.Element {
    const { id, avatar, title, updatedAt, createdAt, lastMessage } = props.conversation;

    const updateTime = useMemo(() => {
        const date = new Date(updatedAt || createdAt);
        const now = new Date();

        const isSameDay = (a: Date, b: Date) => a.getFullYear() === b.getFullYear() && a.getMonth() === b.getMonth() && a.getDate() === b.getDate();

        const yesterday = new Date(now);

        yesterday.setDate(yesterday.getDate() - 1);

        if (isSameDay(date, now)) {
            return date.toLocaleTimeString(undefined, {
                hour: '2-digit',
                minute: '2-digit',
            });
        }

        if (isSameDay(date, yesterday)) {
            return t('date.yesterday');
        }

        const MILLISECOND_OF_DAY = 86400000;
        const diffDays = (now.getTime() - date.getTime()) / MILLISECOND_OF_DAY;

        if (diffDays < 7) {
            return date.toLocaleDateString(undefined, { weekday: 'long' });
        }

        return date.toLocaleDateString(undefined);
    }, [updatedAt, createdAt]);

    return (
        <TouchableOpacity onPress={() => props.handlePressConversation(props.conversation)} className="flex flex-row gap-x-3">
            <Avatar size="md">
                <AvatarFallbackText>{id}</AvatarFallbackText>

                {avatar?.trim() && (
                    <AvatarImage
                        source={{
                            uri: BASE_URL + avatar,
                        }}
                    />
                )}
            </Avatar>

            <View className="gap-y-2">
                <Text className="font-semibold">{title}</Text>

                <View className="flex-row">
                    <Text>{lastMessage?.content ?? t('message.no_messages_yet')}</Text>

                    <Text> - {updateTime}</Text>
                </View>
            </View>
        </TouchableOpacity>
    );
}

export const ConversationItem = memo(Item);
