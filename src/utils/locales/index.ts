import { getLocales } from 'expo-localization';
import { I18n } from 'i18n-js';

import en from '~utils/locales/english';
import vi from '~utils/locales/vietnam';

const translations = {
    en,
    vi,
};

const i18n = new I18n(translations);

type LocaleMap = typeof translations;

type LocaleName = keyof LocaleMap;

type Locale = LocaleMap[LocaleName];

type PathInto<T extends Record<string, unknown>> = keyof {
    [K in keyof T as T[K] extends string ? K : T[K] extends Record<string, unknown> ? `${K & string}.${PathInto<T[K]> & string}` : never]: unknown;
};

export type TranslationKeys = PathInto<Locale>;

export const t = (key: TranslationKeys, options?: Record<string, unknown>): string => i18n.t(key, options);

/**
 * Đặt ngôn ngữ mặc định cho ứng dụng theo ngôn ngữ hiện tại của máy.
 * Mặc định là tiếng Anh.
 * Nếu ngôn ngữ hiện tại không có trong danh sách ngôn ngữ hỗ trợ thì sẽ sử dụng tiếng Anh.
 */
i18n.locale = getLocales()[0]?.languageCode ?? 'en';

/**
 * Khi một giá trị bị thiếu trong một ngôn ngữ, nó sẽ quay lại một ngôn ngữ khác với khoá hiện có.
 * Ở thời điểm commit này, ví dụ tiếng việt không có giá trị cho khoá 'login' thì nó sẽ quay lại tiếng anh với khoá 'login'.
 */
i18n.enableFallback = true;
