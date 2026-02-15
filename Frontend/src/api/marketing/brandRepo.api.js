import { createApi } from "@reduxjs/toolkit/query/react";
import { axiosBaseQuery } from "../axiosBaseQuery";

export const brandRepoApi = createApi({
  reducerPath: "BrandRepoApi",
  baseQuery: axiosBaseQuery(),
  tagTypes: ["BrandRepo"],

  endpoints: (builder) => ({

     //  Create Brand (with file upload)
    createBrand: builder.mutation({
      query: (formData) => ({
        url: "marketing/brand-repo/add",
        method: "POST",
        data: formData, // FormData object (with attachment if any)
        headers: { "Content-Type": "multipart/form-data" },
      }),
      invalidatesTags: ["BrandRepo"],
    }),

    //  Get Brands (with optional filters)
   getBrands: builder.query({
  query: ({ campaignId, category, page, limit } = {}) => {
    let queryParams = "";
    if (campaignId || category || page || limit) {
      const params = new URLSearchParams();
      if (campaignId) params.append("campaignId", campaignId);
      if (category) params.append("category", category);
      if (page) params.append("page", page);
      if (limit) params.append("limit", limit);
      queryParams = `?${params.toString()}`;
    }

    return {
      url: `marketing/brand-repo/get${queryParams}`,   //  backend ka route
      method: "GET",               //  method specify kiya
    };
  },
  providesTags: ["BrandRepo"],
}),

getCategoryCounts: builder.query({
  query: () => ({
    url: "marketing/brand-repo/get-category-count", // backend route
    method: "GET",
  }),
  providesTags: ["BrandRepo"],
}),

 //  Update Brand
    updateBrand: builder.mutation({
      query: ({ id, data }) => ({
        url: `marketing/brand-repo/update/${id}`,
        method: "PUT",
        data: data, // FormData hona chahiye (file upload ke liye)
      }),
      invalidatesTags: ["BrandRepo"],
    }),

    //  Soft Delete Brand
    softDeleteBrand: builder.mutation({
      query: (id) => ({
        url: `marketing/brand-repo/delete/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["BrandRepo"],
    }),

  }),
});

export const {
  useCreateBrandMutation,
  useGetBrandsQuery,
  useGetCategoryCountsQuery,
   useUpdateBrandMutation,
  useSoftDeleteBrandMutation,
} = brandRepoApi;
