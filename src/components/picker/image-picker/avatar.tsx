import Feather from '@expo/vector-icons/Feather';
import { launchImageLibraryAsync } from 'expo-image-picker';
import { Image, TouchableOpacity } from 'react-native';

import { Text, View } from '~components/themed';

type AvatarPickerProps = {
    value: string | undefined;
    onChange: React.Dispatch<React.SetStateAction<string | undefined>>;
    containerClassName?: string;
    buttonClassName?: string;
    imageClassName?: string;
    text?: string;
    textClassName?: string;
};

export function AvatarPicker(props: AvatarPickerProps) {
    const { value, onChange, buttonClassName, containerClassName, imageClassName, text, textClassName } = props;

    const pickImage = async () => {
        const result = await launchImageLibraryAsync({
            mediaTypes: ['images'],
            allowsEditing: true,
            base64: true,
            aspect: [1, 1],
            quality: 0.7,
        });

        if (!result.canceled) {
            const asset = result.assets[0];

            const mimeType = asset.mimeType || 'image/jpeg';
            const base64 = `data:${mimeType};base64,${asset.base64}`;

            onChange(base64);
        }
    };

    return (
        <View className={`items-center justify-center rounded-full gap-y-3 ${containerClassName}`}>
            <TouchableOpacity className={`bg-gray-100 rounded-full h-40 w-40 items-center justify-center ${buttonClassName}`} onPress={pickImage}>
                {value ? (
                    <Image source={{ uri: value }} className={`h-40 w-40 rounded-full ${imageClassName}`} />
                ) : (
                    <Feather name="camera" size={24} color="black" />
                )}
            </TouchableOpacity>

            {text ? <Text className={textClassName}>{text}</Text> : null}
        </View>
    );
}
