import { createApi } from '@reduxjs/toolkit/query/react';
import { axiosBaseQuery } from '../axiosBaseQuery';

export const vendorProductApi = createApi({
  
  reducerPath: 'vendor-product',
  baseQuery: axiosBaseQuery(),
  tagTypes: ['VendorProduct'],

  endpoints: (builder) => ({

    //  GET all products
    getProducts: builder.query({
      query: () => ({
        url: '/vendor/product/get',
        method: 'GET',
      }),
      providesTags: ['VendorProduct'],
    }),

//  ADD single product
addProduct: builder.mutation({
  query: ({formData} ) => ({     
    url: '/vendor/product/add',
    method: 'POST',
    data: formData, //  Correct key for fetch-based RTK Query
  }),
  invalidatesTags: ['VendorProduct'],
}),

       //  BULK UPLOAD products
    uploadBulkProducts: builder.mutation({
      query: (products) => ({
        url: '/vendor/product/import',
        method: 'POST',
        data: products, // should be an array of product objects
      }),
      invalidatesTags: ['VendorProduct'],
    }),

   //  UPDATE single product (PUT)
updateProduct: builder.mutation({
  query: ({ id, ...formData }) => ({
    url: `/vendor/product/update/${id}`,
    method: 'PUT',
    data: formData, //  Axios requires "data"
    headers: { 'Content-Type': 'application/json' },
  }),
  invalidatesTags: ['VendorProduct'],
}),
 
  }),
});

export const {
  useGetProductsQuery,
  useAddProductMutation,
  useUpdateProductMutation,
  useUploadBulkProductsMutation,
} = vendorProductApi;
