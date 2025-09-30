import { type JSX } from 'react';
import type { FieldError } from 'react-hook-form';

import { Text } from '~components/themed';

export type Props = React.ComponentProps<typeof Text> & {
    content?: FieldError;
};

export function TextValidateError(props: Props): JSX.Element | null {
    const { content, ...rest } = props;

    if (!content) {
        return null;
    }

    return <Text {...rest}>{content?.message}</Text>;
}
