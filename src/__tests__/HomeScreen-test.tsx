/**
 * https://docs.expo.dev/develop/unit-testing/
 */

import { render } from '@testing-library/react-native';

import TabOneScreen from '~/app/(tabs)/index';

describe('<TabOneScreen />', () => {
    test('Text renders correctly on TabOneScreen', () => {
        const { getByText } = render(<TabOneScreen />);

        getByText('Tab One');
    });
});
