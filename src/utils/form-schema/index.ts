import { z } from 'zod';

import { t } from '~utils/locales';

export const registerSchema = z
    .object({
        email: z.string().email(),
        password: z.string().min(6, t('auth.password_min_length', { length: 6 })),
        confirmPassword: z.string().min(6, t('auth.password_min_length', { length: 6 })),
        firstName: z.string().optional(),
        lastName: z.string().optional(),
        picture: z.string().optional(),
    })
    .refine(data => data.password === data.confirmPassword, {
        message: t('auth.passwords_do_not_match'),
        path: ['confirmPassword'],
    });

export const loginSchema = z.object({
    email: z.string().email(t('auth.email_invalid')),
    password: z.string().min(1, t('auth.password_required')),
});

export const forgotPasswordSchema = z.object({
    email: z.string().email(t('auth.email_invalid')),
});

export const resetPasswordSchema = z
    .object({
        token: z.string().nonempty(t('forgot_password.token_required')),
        newPassword: z.string().min(6, t('auth.password_min_length', { length: 6 })),
        confirmPassword: z.string().min(6, t('auth.password_min_length', { length: 6 })),
    })
    .refine(data => data.newPassword === data.confirmPassword, {
        message: t('auth.passwords_do_not_match'),
        path: ['confirmPassword'],
    });
