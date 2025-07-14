import React from 'react';

import { useErrorToast } from '~components/toast/base';
import { eventEmitter, EVENTS } from '~utils/event-emitter';

export function ToastProvider({ children }: { children: React.ReactNode }) {
    const errorToast = useErrorToast();

    React.useEffect(() => {
        const handleShowErrorToast = (message: string) => {
            errorToast(message);
        };

        eventEmitter.on(EVENTS.SHOW_ERROR_TOAST, handleShowErrorToast);

        return () => {
            eventEmitter.off(EVENTS.SHOW_ERROR_TOAST, handleShowErrorToast);
        };
    }, [errorToast]);

    return <>{children}</>;
}
