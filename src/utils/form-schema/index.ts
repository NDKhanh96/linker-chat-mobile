import { z } from 'zod';

import { t } from '~utils/locales';

export const loginSchema = z.object({
    email: z.string().email(t('auth.email_invalid')),
    password: z.string().min(1, t('auth.password_required')),
});

export const forgotPasswordSchema = z.object({
    email: z.string().email(t('auth.email_invalid')),
});
