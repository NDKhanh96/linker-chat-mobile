import { useRouter } from 'expo-router';
import { debounce } from 'lodash';
import { Platform, TouchableOpacity } from 'react-native';
import { useSelector } from 'react-redux';

import type { RootState } from '~/redux/store';
import { useGetProfileQuery, useListConversationQuery } from '~/services';
import { BASE_URL } from '~utils/environment';
import { t } from '~utils/locales';

import { ConversationItem } from '~components/conversation';
import { SearchInput } from '~components/input';
import { KeyboardAvoidingScrollView, View } from '~components/themed';
import { Avatar, AvatarBadge, AvatarFallbackText, AvatarImage } from '~components/ui/avatar';
import { Heading } from '~components/ui/heading';
import { SearchIcon } from '~components/ui/icon';

export default function Home(): React.JSX.Element {
    const router = useRouter();

    useGetProfileQuery();
    const { data } = useListConversationQuery({});

    const profile = useSelector((state: RootState) => state.user.profile);

    const handleSearch = debounce((text: string) => {
        if (text.trim()) {
            // TODO: Gọi API search và kiểm tra xem để debounce thế này ok chưa, có cần dc bọ bới useCallback hay useMemo không
        }
    }, 300);

    const handleProfilePress = (): void => {
        router.navigate({ pathname: '/(main)/(menu)' });
    };

    const handlePressConversation = (conversation: NonNullable<typeof data>['data'][number]) => {
        router.navigate({ pathname: '/(main)/conversation/[conversationId]', params: { conversationId: conversation.id.toString() } });
    };

    // TODO: Đổi thành KeyboardAvoidingView để có thể dùng Flatlist ở trong cho ConversationItem
    return (
        <KeyboardAvoidingScrollView className={`px-5 flex-1 gap-y-8 ${Platform.OS === 'android' ? 'mt-10' : ''}`}>
            <View className="flex-row items-center justify-between">
                <Heading size="3xl" bold italic className="text-blue-600">
                    Linker Chat
                </Heading>

                <TouchableOpacity onPress={handleProfilePress}>
                    <Avatar size="sm">
                        <AvatarFallbackText>{profile.firstName || profile.email}</AvatarFallbackText>

                        {profile.avatar?.trim() && (
                            <AvatarImage
                                source={{
                                    uri: BASE_URL + profile.avatar,
                                }}
                            />
                        )}

                        <AvatarBadge />
                    </Avatar>
                </TouchableOpacity>
            </View>

            <SearchInput
                inputFieldProps={{
                    placeholder: t('place_holders.search'),
                    className: 'flex-1 ',
                    onChangeText: handleSearch,
                }}
                iconProps={{ as: SearchIcon, size: 'xl', className: 'rounded-sm' }}
            />

            {data?.data.map(item => (
                <ConversationItem key={item.id} conversation={item} handlePressConversation={handlePressConversation} />
            ))}
        </KeyboardAvoidingScrollView>
    );
}
