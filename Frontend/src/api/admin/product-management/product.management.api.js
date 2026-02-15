import { axiosBaseQuery } from "@/api/axiosBaseQuery";
import { createApi } from "@reduxjs/toolkit/query/react";

export const AdminProductManagementApi = createApi({
  reducerPath: "AdminProductManagementApi",
  baseQuery: axiosBaseQuery(),
  tagTypes: ["AdminProductManagement", "ProductWork"], //  separate karo space nahi hona chahiye

  endpoints: (builder) => ({
    /* ------------------ PRODUCT MANAGEMENT ------------------ */

    //  Create Product
    createProduct: builder.mutation({
      query: (formData) => ({
        url: "admin/product",
        method: "POST",
        data: formData,
      }),
      invalidatesTags: ["AdminProductManagement"],
    }),

    //  Get All Products
    getAllProducts: builder.query({
      query: () => ({
        url: "admin/product",
        method: "GET",
      }),
      providesTags: ["AdminProductManagement"],
    }),

    //  Get Product by ID
    getProductById: builder.query({
      query: (id) => ({
        url: `admin/product/${id}`,
        method: "GET",
      }),
      providesTags: ["AdminProductManagement"],
    }),

    //  Update Product
    updateProduct: builder.mutation({
      query: ({ id, formData }) => ({
        url: `admin/product/${id}`,
        method: "PUT",
        data: formData,
      }),
      invalidatesTags: ["AdminProductManagement"],
    }),

    //  Soft Delete Product
    softDeleteProduct: builder.mutation({
      query: (id) => ({
        url: `admin/product/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["AdminProductManagement"],
    }),

    /* ------------------ PRODUCT WORK MANAGEMENT ------------------ */

    //  1️ Create Product Work
    createProductWork: builder.mutation({
      query: (data) => ({
        url: "admin/product-works",
        method: "POST",
        data,
      }),
      invalidatesTags: ["AdminProductManagement","ProductWork"],
    }),

    //  2️ Get Product Work by Product ID
    getProductWorkById: builder.query({
      query: (productId) => ({
        url: `admin/product-works/${productId}`,
        method: "GET",
      }),
      providesTags: ["ProductWork"],
    }),

    //  3️ Update Product Work by Product ID
    updateProductWork: builder.mutation({
      query: ({ productId, ...data }) => ({
        url: `admin/product-works/${productId}`,
        method: "PUT",
        data,
      }),
      invalidatesTags: ["AdminProductManagement","ProductWork"],
    }),
  }),
});

export const {
  // product management
  useCreateProductMutation,
  useGetAllProductsQuery,
  useGetProductByIdQuery,
  useUpdateProductMutation,
  useSoftDeleteProductMutation,

  // product work management
  useCreateProductWorkMutation,
  useGetProductWorkByIdQuery,
  useUpdateProductWorkMutation,
} = AdminProductManagementApi;
