import { createApi } from "@reduxjs/toolkit/query/react";
import { axiosBaseQuery } from "../../axiosBaseQuery";

export const productApi = createApi({
  reducerPath: "productApi",
  baseQuery: axiosBaseQuery({ baseUrl: "/products" }),
  tagTypes: ["Product"],

  endpoints: (builder) => ({
    // GET All Products
    getProducts: builder.query({
      query: () => ({ url: "/get", method: "GET" }),
      transformResponse: (response) => response.products,
      providesTags: (result) =>
        result
          ? [
              ...result.map(({ _id }) => ({ type: "Product", id: _id })),
              { type: "Product", id: "LIST" },
            ]
          : [{ type: "Product", id: "LIST" }],
    }),

    // GET Product by ID
    getProductById: builder.query({
      query: (id) => ({ url: `/${id}`, method: "GET" }),
      providesTags: (result, error, id) => [{ type: "Product", id }],
    }),

    // CREATE Product
    createProduct: builder.mutation({
      query: (newProduct) => ({ url: "/post", method: "POST", data: newProduct }),
      invalidatesTags: [{ type: "Product", id: "LIST" }],
    }),

    // UPDATE Product
    updateProduct: builder.mutation({
      query: ({ id, ...updateData }) => ({ url: `/${id}`, method: "PUT", data: updateData }),
      invalidatesTags: (result, error, { id }) => [
        { type: "Product", id },
        { type: "Product", id: "LIST" },
      ],
    }),

    // DELETE Product
    deleteProduct: builder.mutation({
      query: (id) => ({ url: `/${id}`, method: "DELETE" }),
      invalidatesTags: [{ type: "Product", id: "LIST" }],
    }),
  }),
});

export const {
  useGetProductsQuery,
  useGetProductByIdQuery,
  useCreateProductMutation,
  useUpdateProductMutation,
  useDeleteProductMutation,
} = productApi;
