import AntDesign from '@expo/vector-icons/AntDesign';
import { TouchableOpacity, useColorScheme } from 'react-native';

import { useOAuth } from '~/hooks';
import type { HandleOAuth, SocialMediaIcon } from '~/types';

type Params = SocialMediaIcon & { handleOAuth: HandleOAuth };

export function OAuthButton(params: Params) {
    const { name, color, size, platform, handleOAuth } = params;

    const { oauthLogin, isLoading } = useOAuth(platform);
    const colorScheme = useColorScheme();

    const handlePressButton = async () => {
        const res = await oauthLogin();

        handleOAuth(res);
    };

    return (
        <TouchableOpacity
            disabled={isLoading}
            className="border border-gray-200 flex-1 rounded-lg items-center justify-center h-12"
            onPress={() => handlePressButton()}
        >
            <AntDesign name={name} size={size} color={colorScheme === 'dark' ? color.dark : color.light} />
        </TouchableOpacity>
    );
}
