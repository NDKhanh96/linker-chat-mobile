/**
 * https://docs.expo.dev/develop/unit-testing/
 */

import { cleanup, render, waitFor } from '@testing-library/react-native';

import LoginScreen from '~/app/(auth)';

afterEach(() => {
    cleanup();
});

describe('<LoginScreen />', () => {
    test('Text renders correctly on LoginScreen', async () => {
        const { getByText } = render(<LoginScreen />);

        /**
         * Cần waitFor để đảm bảo rằng các component đã được render hoàn toàn trước khi kiểm tra, tránh lỗi:
         * An update to Icon inside a test was not wrapped in act(...)
         */
        await waitFor(() => {
            getByText('Linker Chat');
        });
    });
});
