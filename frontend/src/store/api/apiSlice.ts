import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import { Product, Order, User } from '../../types';

const baseQuery = fetchBaseQuery({
  baseUrl: import.meta.env.VITE_API_URL || 'http://localhost:3000',
  credentials: 'include',
  prepareHeaders: (headers) => {
      const token = localStorage.getItem('token');
      if (token) {
          headers.set('Authorization', `Bearer ${token}`);
      }
      return headers;
  },
});

const baseQueryWithReauth = async (args: any, api: any, extraOptions: any) => {
  let result = await baseQuery(args, api, extraOptions);
  if (result.error && result.error.status === 401) {
    // Dispatch logout action directly to avoid circular dependency
    api.dispatch({ type: 'auth/logOut' });
    api.dispatch(apiSlice.util.resetApiState());
  }
  return result;
};
export const apiSlice = createApi({
  reducerPath: 'api',
  baseQuery: baseQueryWithReauth,
  tagTypes: ['Product', 'Order', 'User'],
  endpoints: (builder) => ({
    // Items Endpoints
    getItems: builder.query<{ items: Product[], meta: any }, { page?: number; q?: string }>({
      query: ({ page = 1, q = '' }) => ({
          url: `/items`,
          params: { page, q },
      }),
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
        async onQueryStarted(_arg, { dispatch, queryFulfilled }) {
            try {
                const { data, meta } = await queryFulfilled;
                const token = meta?.response?.headers.get('Authorization');
                if (token) {
                    const splitToken = token.split(' ')[1];
                    dispatch({ 
                        type: 'auth/setCredentials', 
                        payload: { user: data, token: splitToken } 
                    });
                }
            } catch (err) {
                 // error
            }
        },
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
        async onQueryStarted(_arg, { dispatch, queryFulfilled }) {
            try {
                const { data, meta } = await queryFulfilled;
                const token = meta?.response?.headers.get('Authorization');
                if (token) {
                    const splitToken = token.split(' ')[1];
                    dispatch({ 
                        type: 'auth/setCredentials', 
                        payload: { user: data, token: splitToken } 
                    });
                }
            } catch (err) {
                 // error
            }
        },
        invalidatesTags: ['User'],
    }),

    logout: builder.mutation<void, void>({
        query: () => ({
            url: '/users/sign_out',
            method: 'DELETE',
        }),
        async onQueryStarted(_arg, { dispatch, queryFulfilled }) {
            try {
                await queryFulfilled;
                localStorage.removeItem('token');
                dispatch(apiSlice.util.resetApiState());
            } catch {
                localStorage.removeItem('token'); // Clear anyway on error
                dispatch(apiSlice.util.resetApiState());
            }
        },
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

    updateUser: builder.mutation<User, Partial<User> & { id: number }>({
        query: ({ id, ...patch }) => ({
            url: `/users/${id}`,
            method: 'PUT',
            body: { user: patch },
        }),
        invalidatesTags: ['User'],
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
    useGetUsersQuery,
    useUpdateUserMutation
} = apiSlice;
