import { useNavigation, useRouter } from 'expo-router';
import * as SecureStore from 'expo-secure-store';
import { useCallback } from 'react';
import { Platform, TouchableOpacity, useColorScheme } from 'react-native';
import { useSelector } from 'react-redux';

import { UserFullName } from '~components/text';
import { KeyboardAvoidingScrollView, Text, View } from '~components/themed';
import { Avatar, AvatarBadge, AvatarFallbackText, AvatarImage } from '~components/ui/avatar';
import { Button, ButtonText } from '~components/ui/button';
import { Heading } from '~components/ui/heading';
import { Switch } from '~components/ui/switch';

import { setNameOrder } from '~/redux/slices';
import { useAppDispatch, type RootState } from '~/redux/store';
import type { RootNav } from '~/types';
import Colors from '~utils/constants/colors';
import { BASE_URL } from '~utils/environment';
import { t } from '~utils/locales';

/**
 * Cần dùng useNavigation vì useRouter không navigate về root index được.
 */
export default function MainMenu(): React.JSX.Element {
    const colorScheme = useColorScheme();
    const router = useRouter();
    const rootLayout = useNavigation<RootNav>('/');
    const dispatch = useAppDispatch();

    const profile = useSelector((state: RootState) => state.user.profile);
    const nameOrder = useSelector((state: RootState) => state.user.nameOrder);

    const handleProfilePress = useCallback(() => {
        router.navigate({ pathname: '/(main)/(menu)/(profile)' });
    }, [router]);

    const handleToggleNameOrder = useCallback(
        (value: boolean) => {
            dispatch(setNameOrder(value ? 'western' : 'eastern'));
        },
        [dispatch],
    );

    const handleLogout = useCallback(async () => {
        await SecureStore.deleteItemAsync('accessToken');
        rootLayout.reset({ index: 0, routes: [{ name: 'index' }] });
    }, [rootLayout]);

    return (
        <KeyboardAvoidingScrollView className={`px-5 flex-1 gap-y-8 ${Platform.OS === 'android' ? 'mt-10' : ''}`}>
            <Heading size="xl" bold italic>
                Linker Chat
            </Heading>

            <View className="flex-col gap-y-4">
                <TouchableOpacity className="flex-row items-center gap-x-4" onPress={handleProfilePress}>
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

                    <View className="flex-col gap-y-1">
                        <UserFullName firstName={profile.firstName} lastName={profile.lastName} />

                        <View className="flex-row gap-x-4">
                            <Text className="text-xs" style={{ color: Colors[colorScheme ?? 'light'].tabIconDefault }}>
                                {t('profile.edit_profile')}
                            </Text>

                            <Text className="text-xs" style={{ color: Colors[colorScheme ?? 'light'].tabIconDefault }}>
                                {profile.email}
                            </Text>
                        </View>
                    </View>
                </TouchableOpacity>

                <View className="flex-row items-center justify-between">
                    <Text>{t('menu.use_western_name_order')}</Text>

                    <Switch
                        size="sm"
                        trackColor={{ false: '#d4d4d4', true: '#525252' }}
                        thumbColor="#fafafa"
                        ios_backgroundColor="#d4d4d4"
                        onValueChange={handleToggleNameOrder}
                        value={nameOrder === 'western'}
                    />
                </View>
            </View>

            <Button onPress={handleLogout}>
                <ButtonText>Log out</ButtonText>
            </Button>
        </KeyboardAvoidingScrollView>
    );
}
