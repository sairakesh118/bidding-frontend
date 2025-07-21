import { apiSlice } from "../../api/appSlice";

export const profileApi = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getUserProfile: builder.query({
      query: (id) => `/profile/${id}`,
    }),
    getUserItems: builder.query({
      query: (id) => `/profile/items/${id}`,
    }),
    getUserBids: builder.query({
      query: (name) => `/profile/bids/${name}`,
    }),
  }),
});

export const {
  useGetUserProfileQuery,
  useGetUserItemsQuery,
  useGetUserBidsQuery,
} = profileApi;
export const {
  endpoints: { getUserProfile, getUserItems, getUserBids },
} = profileApi;