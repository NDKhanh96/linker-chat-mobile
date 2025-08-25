import { type JSX } from 'react';
import colors from 'tailwindcss/colors';

import { Text, View } from '~components/themed';

type Props = {
    content: string;
};

export function Divider(props: Props): JSX.Element {
    const { content } = props;

    return (
        <View className="flex flex-row items-center">
            <View lightColor={colors.gray[300]} darkColor="white" className="flex-1 h-px" />

            <Text className="text-typography-500 leading-1 text-center mx-4">{content}</Text>

            <View lightColor={colors.gray[300]} darkColor="white" className="flex-1 h-px" />
        </View>
    );
}
