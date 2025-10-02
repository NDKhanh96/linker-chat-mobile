import { useMemo } from 'react';
import { useSelector } from 'react-redux';

import { Text } from '~components/themed';

import type { RootState } from '~/redux/store';

type Props = {
    firstName?: string;
    lastName?: string;
};

export function UserFullName({ firstName, lastName }: Props): React.JSX.Element {
    const nameOrder = useSelector((state: RootState) => state.user.nameOrder);

    const fullName = useMemo(() => {
        const names = nameOrder === 'western' ? [firstName, lastName] : [lastName, firstName];

        return names.filter(name => name && name.trim()).join(' ');
    }, [firstName, lastName, nameOrder]);

    return <Text>{fullName}</Text>;
}
