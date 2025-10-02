import { debounce } from 'lodash';
import { Platform, TouchableOpacity } from 'react-native';
import { useSelector } from 'react-redux';

import type { RootState } from '~/redux/store';
import { t } from '~utils/locales';

import { useRouter } from 'expo-router';
import { SearchInput } from '~components/input';
import { KeyboardAvoidingScrollView, View } from '~components/themed';
import { Avatar, AvatarBadge, AvatarFallbackText, AvatarImage } from '~components/ui/avatar';
import { Heading } from '~components/ui/heading';
import { SearchIcon } from '~components/ui/icon';

export default function Home(): React.JSX.Element {
    const router = useRouter();

    const profile = useSelector((state: RootState) => state.user.profile);

    const handleSearch = debounce((text: string) => {
        if (text.trim()) {
            // TODO: Gọi API search
        }
    }, 300);

    const handleProfilePress = (): void => {
        router.navigate({ pathname: '/(main)/(menu)' });
    };

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
                                    uri: profile.avatar,
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
        </KeyboardAvoidingScrollView>
    );
}
