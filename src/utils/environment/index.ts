const BASE_URL_ENV: string | undefined = process.env.EXPO_PUBLIC_API_URL;

//#region Validation
if (!BASE_URL_ENV) {
    throw new Error('Cần thêm biến môi trường EXPO_PUBLIC_API_URL vào .env');
}
//#endregion

export const BASE_URL: string = BASE_URL_ENV;
