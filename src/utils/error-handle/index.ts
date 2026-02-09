import { isBaseQueryHandledError, isCustomError, isFetchError, isHttpError, isParsingError, isSerializedError, isTimeoutError } from '~utils/type-guards';
import { errorHttpSchema } from '~utils/validate-schema';

export function getBaseQueryErrorMessage(error: unknown): string {
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

export function getFetchErrorMessage(error: unknown): string {
    let message: string = 'RTK-Query Error';

    if (error instanceof Error) {
        message = error.message;
    } else if (isBaseQueryHandledError(error)) {
        message = error.error.message;
    }

    return message;
}
