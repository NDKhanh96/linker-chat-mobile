import { isCustomError, isFetchError, isHttpError, isParsingError, isSerializedError, isTimeoutError } from '~utils/type-guards';
import { errorHttpSchema } from '~utils/validate-schema';

export function getErrorMessage(error: unknown): string {
    let message: string = 'RTK-Query Error';

    if (isSerializedError(error)) {
        message = error.message ?? 'RTK-Query Serialized Error';
    } else if (isHttpError(error)) {
        const parsed = errorHttpSchema.safeParse(error.data);

        message = parsed.success ? parsed.data.message : `HTTP Error`;
    } else if (isFetchError(error)) {
        message = error.error ?? 'Fetch Error';
    } else if (isParsingError(error)) {
        message = error.error ?? error.data ?? 'Parsing Error';
    } else if (isTimeoutError(error)) {
        message = error.error ?? 'Timeout Error';
    } else if (isCustomError(error)) {
        message = error.error ?? 'Custom Error';
    }

    return message;
}
