import { apiSlice } from "../../api/appSlice";

export const itemsApi = apiSlice.injectEndpoints({
    endpoints: (builder) => ({
        getItems:builder.query({
            query: () => ({
                url: "/items",
                method: "GET",
            }),
            providesTags: (result) =>
                result
                    ? [
                        ...result.map(({ id }) => ({ type: "Item", id })),
                        { type: "Item", id: "LIST" },
                    ]
                    : [{ type: "Item", id: "LIST" }],
        }),
        getItemById: builder.query({
            query: (id) => ({
                url: `/items/${id}`,
                method: "GET",
            }),
            providesTags: (result, error, id) => [{ type: "Item", id }],
        }),
        createItem: builder.mutation({
            query: (newItem) => ({
                url: "/items",
                method: "POST",
                body: newItem,
            }),
            invalidatesTags: [{ type: "Item", id: "LIST" }],
        }),
        updateItem: builder.mutation({
            query: ({ id, ...updatedItem }) => ({
                url: `/items/${id}`,
                method: "PATCH",
                body: updatedItem,
            }),
            invalidatesTags: (result, error, { id }) => [{ type: "Item", id }],
        }),
        deleteItem: builder.mutation({
            query: (id) => ({
                url: `/items/${id}`,
                method: "DELETE",
            }),
            invalidatesTags: (result, error, id) => [{ type: "Item", id }],
        }),
        searchItems: builder.query({
            query: (searchTerm) => ({
                url: `/items/search?query=${searchTerm}`,
                method: "GET",
            }),
            providesTags: (result) =>
                result
                    ? [
                        ...result.map(({ id }) => ({ type: "Item", id })),
                        { type: "Item", id: "LIST" },
                    ]
                    : [{ type: "Item", id: "LIST" }],
        }),
    }),

});
export const {
    useGetItemsQuery,
    useGetItemByIdQuery,
    useCreateItemMutation,
    useUpdateItemMutation,
    useDeleteItemMutation,
    useSearchItemsQuery,
} = itemsApi;