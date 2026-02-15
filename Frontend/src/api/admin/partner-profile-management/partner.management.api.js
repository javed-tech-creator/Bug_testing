import { axiosBaseQuery } from "@/api/axiosBaseQuery";
import { createApi } from "@reduxjs/toolkit/query/react";

export const PartnerProfileManagementApi = createApi({
  reducerPath: "PartnerProfileManagementApi",
  baseQuery: axiosBaseQuery(),
  tagTypes: ["PartnerProfileManagement"],

  endpoints: (builder) => ({
    //  GET All Partners
    getAllPartners: builder.query({
      query: ({ page, limit, isActive } = {}) => ({
        url: `admin/partner?page=${page}&limit=${limit}&isActive=${isActive}`,
        method: "GET",
      }),
      providesTags: ["PartnerProfileManagement"],
    }),

    //  GET Partner By ID (Lazy supported)
    getPartnerById: builder.query({
      query: (id) => ({
        url: `admin/partner/${id}`,
        method: "GET",
      }),
      providesTags: ["PartnerProfileManagement"],
    }),

    //  CREATE Partner (with file upload)
    createPartner: builder.mutation({
      query: (data) => ({
        url: "admin/partner",
        method: "POST",
        data: data,
      }),
      invalidatesTags: ["PartnerProfileManagement"],
    }),

    //  UPDATE Partner (with file upload)
    updatePartner: builder.mutation({
      query: ({ id, data }) => ({
        url: `admin/partner/${id}`,
        method: "PUT",
        data: data,
      }),
      invalidatesTags: ["PartnerProfileManagement"],
    }),
  }),
});

export const {
  useCreatePartnerMutation,
  useGetAllPartnersQuery,
  useLazyGetAllPartnersQuery,
  useLazyGetPartnerByIdQuery,
  useUpdatePartnerMutation,
} = PartnerProfileManagementApi;
