import type { z } from 'zod';

import { setProfile, showToast } from '~/redux/slices';
import { API } from '~utils/configs';
import { getMutationErrorMessage } from '~utils/error-handle';
import type { updateProfileSchema } from '~utils/form-schema';

type Profile = {
    id: number;
    version: number;
    firstName: string;
    lastName: string;
    avatar: string;
    createdAt: string;
    updatedAt: string;
    deletedAt: string | null;
    isActive: boolean;
    account: {
        id: number;
        version: number;
        email: string;
        password: string;
        enableTotp: boolean;
        enableEmailOtp: boolean;
        isCredential: boolean;
        isActive: boolean;
        createdAt: string;
        updatedAt: string;
        deletedAt: string | null;
    };
};

const userApi = API.injectEndpoints({
    endpoints: build => ({
        profile: build.query<Profile, void>({
            query: () => ({
                url: 'users/profile',
                method: 'GET',
            }),

            onQueryStarted: async (arg, { queryFulfilled, dispatch }) => {
                try {
                    const { data } = await queryFulfilled;

                    if (!data) {
                        throw new Error('No profile data returned from server');
                    }

                    const {
                        account: { email },
                        firstName,
                        lastName,
                        avatar,
                    } = data;

                    dispatch(setProfile({ email, firstName, lastName, avatar }));
                } catch (error) {
                    dispatch(showToast({ title: 'Error', description: getMutationErrorMessage(error), type: 'error' }));
                }
            },
        }),
        updateProfile: build.mutation<Profile, z.infer<typeof updateProfileSchema>>({
            query: body => ({
                url: `users/profile`,
                method: 'PATCH',
                body,
            }),

            onQueryStarted: async (arg, { queryFulfilled, dispatch }) => {
                /**
                 * Optimistic Update để cập nhật UI trước, sau đó mới gọi API
                 * đồng thời nếu gọi API thất bại thì hoàn tác lại thay đổi UI trong phần catch
                 */
                const patchResult = dispatch(
                    userApi.util.updateQueryData('profile', undefined, draft => {
                        Object.assign(draft, {
                            firstName: arg.firstName,
                            lastName: arg.lastName,
                            avatar: arg.avatar,
                        });
                    }),
                );

                try {
                    const { data } = await queryFulfilled;

                    if (!data) {
                        throw new Error('No profile data returned from server');
                    }

                    const {
                        account: { email },
                        firstName,
                        lastName,
                        avatar,
                    } = data;

                    dispatch(setProfile({ email, firstName, lastName, avatar }));
                    dispatch(showToast({ title: 'Success', description: 'Profile updated successfully', type: 'success' }));
                } catch (error) {
                    patchResult.undo();
                    dispatch(showToast({ title: 'Error', description: getMutationErrorMessage(error), type: 'error' }));
                }
            },
        }),
    }),
    overrideExisting: true,
});

export const { useProfileQuery, useUpdateProfileMutation } = userApi;
