import { z } from 'zod';

/**
 * Schema cập nhật profile
 * - avatar không có: Không cập nhật avatar
 * - avatar là object: Upload file mới từ image picker
 * - avatar là empty string: Xóa avatar hiện tại
 */
export const updateProfileSchema = z.object({
    firstName: z.string().optional(),
    lastName: z.string().optional(),
    avatar: z
        .string()
        .optional()
        .refine(v => !v || v.startsWith('data:image/') || v.startsWith('http'), { message: 'avatar must be base64 image or url' }),
});
