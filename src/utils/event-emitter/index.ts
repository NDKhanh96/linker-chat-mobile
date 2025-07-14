import { EventEmitter } from 'events';

export const eventEmitter = new EventEmitter();

export const EVENTS = {
    SHOW_ERROR_TOAST: 'show_error_toast',
} as const;
