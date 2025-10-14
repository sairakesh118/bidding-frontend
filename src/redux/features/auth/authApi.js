import { apiSlice } from "../../api/appSlice";


export const authApi = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    login: builder.mutation({
      query: (credentials) => ({
        url: "/auth/login",
        method: "POST",
        body: credentials,
      }),
    }),
    register: builder.mutation({
      query: (credentials) => ({
        url: '/auth/register',
        method: 'POST',
        body: credentials,
      }),
    }),
    googleAuth: builder.mutation({
      query: (userData) => ({
        url: "/auth/google/login",
        method: "POST",
        body: userData,
      }),
      transformResponse: (response) => {
        return response;
      },
      transformErrorResponse: (error) => {
        //console.error("API Error:", error);
        return error;
      },
    }),
    forgotPassword: builder.mutation({
      query: (email) => ({
        url: "/auth/forgot-password",
        method: "POST",
        body: { email },
      }),
    }),
    resetPassword: builder.mutation({
      query: ({ token, password }) => ({
        url: "/auth/reset-password",
        method: "POST",
        body: { token, password },
      }),
    }),
    updateProfile: builder.mutation({
      query: (data) => ({
        url: "/auth/profile",
        method: "PATCH",
        body: data,
      }),
    }),
    verifyEmail: builder.mutation({
      query: (token) => ({
        url: "/auth/verify-email",
        method: "POST",
        body: { token },
      }),
    }),
    resendVerification: builder.mutation({
      query: (email) => ({
        url: "/auth/resend-verification",
        method: "POST",
        body: { email },
      }),
    }),
    changePassword: builder.mutation({
      query: (data) => ({
        url: "/auth/change-password",
        method: "POST",
        body: data,
      }),
    }),
    updateNotifications: builder.mutation({
      query: (settings) => ({
        url: "/auth/notifications",
        method: "PATCH",
        body: settings,
      }),
    }),
    deleteAccount: builder.mutation({
      query: () => ({
        url: "/auth/delete-account",
        method: "DELETE",
      }),
    }),
    updateGoogleToken: builder.mutation({
      query: (credentials) => ({
        url: "auth/google/update-token",
        method: "POST",
        body: credentials,
      }),
    }),
    getGoogleAppsStatus: builder.query({
      query: () => ({
        url: "/auth/google/status",
        method: "GET",
      }),
    }),
  }),
});

export const {
  useLoginMutation,
  useRegisterMutation,
  useGoogleAuthMutation,
  useForgotPasswordMutation,
  useResetPasswordMutation,
  useUpdateProfileMutation,
  useVerifyEmailMutation,
  useResendVerificationMutation,
  useChangePasswordMutation,
  useUpdateNotificationsMutation,
  useDeleteAccountMutation,
  useUpdateGoogleTokenMutation,
  useGetGoogleAppsStatusQuery,
} = authApi;
