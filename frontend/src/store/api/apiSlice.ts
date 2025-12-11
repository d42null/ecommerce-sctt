import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import { Product, Order, User } from '../../types';

// Define a service using a base URL and expected endpoints
export const apiSlice = createApi({
  reducerPath: 'api',
  baseQuery: fetchBaseQuery({ 
    baseUrl: import.meta.env.VITE_API_URL || 'http://localhost:3000',
    credentials: 'include', // Important for Cookies!
    prepareHeaders: (headers) => {
        // Since we use httpOnly cookies for session/auth, we just need to ensure credentials are sent
        // But if we had a token in state, we would attach it here.
        // For cors credential, fetchBaseQuery handles it via 'include' credentials mode if configured (?)
        // Actually fetchBaseQuery doesn't default credentials: 'include'.
        return headers;
    },
  }),
  tagTypes: ['Product', 'Order', 'User'],
  endpoints: (builder) => ({
    // Items Endpoints
    getItems: builder.query<{ items: Product[], meta: any }, { page?: number; q?: string }>({
      query: ({ page = 1, q = '' }) => ({
          url: `/items`,
          params: { page, q },
      }),
      // Transform response to handle the headers metadata if needed, 
      // OR better: Update backend to return meta in body?
      // Since backend returns Array directly, getting headers is tricky in RTK Query standard `query` 
      // without `transformResponse` having access to meta.
      // BUT: RTK Query `transformResponse` receives (response, meta, arg).
      transformResponse: (response: Product[], meta, _arg) => {
        return {
          items: response,
          meta: {
            totalPages: Number(meta?.response?.headers.get('total-pages') || 1),
            currentPage: Number(meta?.response?.headers.get('current-page') || 1)
          }
        };
      },
      providesTags: (result) => 
        result 
          ? [
              ...result.items.map(({ id }) => ({ type: 'Product' as const, id })),
              { type: 'Product', id: 'LIST' },
            ]
          : [{ type: 'Product', id: 'LIST' }],
    }),

    getItem: builder.query<Product, string>({
        query: (id) => `/items/${id}`,
        providesTags: (_result, _error, id) => [{ type: 'Product', id }],
    }),

    createItem: builder.mutation<Product, Partial<Product>>({
        query: (body) => ({
            url: '/items',
            method: 'POST',
            body: { item: body },
        }),
        invalidatesTags: [{ type: 'Product', id: 'LIST' }],
    }),

    updateItem: builder.mutation<Product, { id: number; item: Partial<Product> }>({
        query: ({ id, item }) => ({
            url: `/items/${id}`,
            method: 'PUT',
            body: { item },
        }),
        invalidatesTags: (_result, _error, { id }) => [{ type: 'Product', id }, { type: 'Product', id: 'LIST' }],
    }),

    deleteItem: builder.mutation<void, number>({
        query: (id) => ({
            url: `/items/${id}`,
            method: 'DELETE',
        }),
        invalidatesTags: [{ type: 'Product', id: 'LIST' }],
    }),
    
    // Auth Endpoints
    getCurrentUser: builder.query<User, void>({
      query: () => '/current_user',
      providesTags: ['User'],
    }),

    login: builder.mutation<User, { email: string; password: string }>({
        query: (credentials) => ({
            url: '/users/sign_in',
            method: 'POST',
            body: { user: credentials },
        }),
        invalidatesTags: ['User'],
    }),

    register: builder.mutation<User, { email: string; password: string; firstName: string; lastName: string }>({
        query: ({ email, password, firstName, lastName }) => ({
            url: '/users',
            method: 'POST',
            body: { 
                user: { 
                    email, 
                    password, 
                    first_name: firstName, 
                    last_name: lastName 
                } 
            },
        }),
        invalidatesTags: ['User'],
    }),

    logout: builder.mutation<void, void>({
        query: () => ({
            url: '/users/sign_out',
            method: 'DELETE',
        }),
        invalidatesTags: ['User', 'Order'], // Clear user data
    }),

    // Orders Endpoints
    getOrders: builder.query<Order[], void>({
        query: () => '/orders',
        providesTags: ['Order'],
    }),

    createOrder: builder.mutation<Order, { items: { item_id: number; quantity: number }[] }>({
        query: (body) => ({
            url: '/orders',
            method: 'POST',
            body,
        }),
        invalidatesTags: ['Order'],
    }),

    // Admin Users
    getUsers: builder.query<User[], void>({
        query: () => '/users',
        providesTags: ['User'],
    }),
  }),
});

export const { 
    useGetItemsQuery, 
    useGetItemQuery,
    useCreateItemMutation,
    useUpdateItemMutation,
    useDeleteItemMutation,
    useGetCurrentUserQuery, 
    useLoginMutation, 
    useRegisterMutation, 
    useLogoutMutation,
    useGetOrdersQuery,
    useCreateOrderMutation,
    useGetUsersQuery
} = apiSlice;
