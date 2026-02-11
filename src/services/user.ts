import type { z } from 'zod';

import { setProfile, showToast } from '~/redux/slices';
import { API } from '~utils/configs';
import { getFetchErrorMessage } from '~utils/error-handle';
import type { updateProfileSchema } from '~utils/form-schema';

const userApi = API.injectEndpoints({
    endpoints: build => ({
        getProfile: build.query<Profile, void>({
            query: () => ({
                url: 'users/profile',
                method: 'GET',
            }),

            async transformResponse(response: Profile) {
                return response;
            },

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
                        id,
                    } = data;

                    dispatch(setProfile({ email, firstName, lastName, avatar, id }));
                } catch (error) {
                    dispatch(showToast({ title: 'Error', description: getFetchErrorMessage(error), type: 'error' }));
                }
            },
        }),
        updateProfile: build.mutation<Profile, z.infer<typeof updateProfileSchema>>({
            query: body => ({
                url: `users/profile`,
                method: 'PATCH',
                body,
            }),

            async transformResponse(response: Profile) {
                return response;
            },

            onQueryStarted: async (arg, { queryFulfilled, dispatch }) => {
                /**
                 * Optimistic Update để cập nhật UI trước, sau đó mới gọi API
                 * đồng thời nếu gọi API thất bại thì hoàn tác lại thay đổi UI trong phần catch
                 */
                const patchResult = dispatch(
                    userApi.util.updateQueryData('getProfile', undefined, draft => {
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
                        id,
                    } = data;

                    dispatch(setProfile({ email, firstName, lastName, avatar, id }));
                    dispatch(showToast({ title: 'Success', description: 'Profile updated successfully', type: 'success' }));
                } catch (error) {
                    patchResult.undo();
                    dispatch(showToast({ title: 'Error', description: getFetchErrorMessage(error), type: 'error' }));
                }
            },
        }),
    }),
    overrideExisting: true,
});

export type Profile = {
    id: number;
    version: number;
    firstName: string;
    lastName: string;
    avatar: string;
    createdAt: string;
    updatedAt: string;
    deletedAt: string | null;
    createdBy: number | null;
    updatedBy: number | null;
    deletedBy: number | null;
    isActive: boolean;
    account: Account;
};

type Account = {
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
    createdBy: number | null;
    updatedBy: number | null;
    deletedBy: number | null;
    refreshToken: RefreshToken;
    user: Profile;
};

type RefreshToken = {
    id: number;
    token: string;
    expiresAt: string;
    createdAt: string;
    account: Account;
};

export const { useGetProfileQuery, useUpdateProfileMutation } = userApi;
