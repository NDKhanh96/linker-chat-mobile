import Feather from '@expo/vector-icons/Feather';
import * as ExpoImagePicker from 'expo-image-picker';
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
        const result = await ExpoImagePicker.launchImageLibraryAsync({
            mediaTypes: ['images', 'videos'],
            allowsEditing: true,
            aspect: [4, 3],
            quality: 1,
        });

        if (!result.canceled) {
            onChange(result.assets[0].uri);
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
