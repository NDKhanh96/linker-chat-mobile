import { z } from 'zod';

import { t } from '~utils/locales';

export const registerSchema = z
    .object({
        email: z.string().email(),
        password: z.string().min(6, 'Password must be at least 6 characters'),
        confirmPassword: z.string().min(6, 'Password must be at least 6 characters'),
        firstName: z.string().optional(),
        lastName: z.string().optional(),
        picture: z.string().optional(),
    })
    .refine(data => data.password === data.confirmPassword, {
        message: 'Passwords do not match',
        path: ['confirmPassword'],
    });

export const loginSchema = z.object({
    email: z.string().email(t('auth.email_invalid')),
    password: z.string().min(1, t('auth.password_required')),
});

export const forgotPasswordSchema = z.object({
    email: z.string().email(t('auth.email_invalid')),
});
