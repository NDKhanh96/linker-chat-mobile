module.exports = {
    preset: 'jest-expo',
    /**
     * Vì ột số thư viện sử dụng ESM (import/export) nhưng jest lại chỉ hiểu CommonJS (require).
     * Thông thường phần biên dịch ra Common Js nằm trong node_modules.
     * Tuy nhiên mặc định jest sẽ không chuyển đổi mã trong node_modules.
     * Vì vậy cần phải chỉ định rõ thư viện nào cần chuyển đổi mã ở trong transformIgnorePatterns.
     * Lưu ý: nếu có thay đổi ở transformIgnorePatterns thì cần chạy jest --clearCache
     */
    transformIgnorePatterns: [
        'node_modules/(?!(' +
            '@gluestack-ui|' +
            '@react-native|' +
            'react-native|' +
            'expo-modules-core|' +
            'expo|' +
            '@expo/vector-icons|' +
            'expo-font|' +
            'expo-asset/build|' +
            'expo-constants/build|' +
            'expo-router/build|' +
            '@react-navigation|' +
            'expo-linking/build|' +
            'expo-linear-gradient/build|' +
            'expo-localization/build|' +
            'react-native-css-interop/dist' +
            ')/)',
    ],
};
