import { SearchInput } from '~components/input';
import { Text, View } from '~components/themed';
import { EditIcon, EyeOffIcon, Icon, SearchIcon } from '~components/ui/icon';

export default function Home(): React.JSX.Element {
    return (
        <View className="flex-1 px-5 justify-center gap-y-16">
            <View>
                <SearchInput
                    inputFieldProps={{ placeholder: 'Search', className: 'flex-1' }}
                    iconProps={{ as: SearchIcon, size: 'xl', className: 'rounded-sm' }}
                />

                <Icon as={EditIcon} size="lg" fill="#ffffff" stroke="currentColor" />

                <Icon as={EyeOffIcon} size="lg" fill="#ffffff" stroke="currentColor" />

                <Icon as={EditIcon} size="lg" stroke="currentColor" />

                <Icon as={EyeOffIcon} size="lg" stroke="currentColor" />

                <Text>Home Screen</Text>
            </View>
        </View>
    );
}
