import { createApi } from "@reduxjs/toolkit/query/react";
import { axiosBaseQuery } from "../axiosBaseQuery";

export const profileManagementApi = createApi({
  reducerPath: 'vendorProfileApi',
  baseQuery: axiosBaseQuery(),
  tagTypes: ['VendorProfile'],
  endpoints: (builder) => ({

    //  GET profile details (business, KYC, personal at once)
    getVendorProfile: builder.query({
      query: () => ({
        url: '/vendor/profile/get',
        method: 'GET',
      }),
      providesTags: ['VendorProfile'],
    }),

    //  PATCH update profile photo
 updateProfileImage: builder.mutation({
  query: ({formData}) => ({
    url: "/vendor/profile-image",
    method: "PATCH",
    data: formData, //  correct for FormData
  }),
  invalidatesTags: ["VendorProfile"],
}),

    // Put profile data 
updateProfile: builder.mutation({
  query: (data) => ({
    url: '/vendor/profile/update',
    method: 'PUT',
    data, //  not data:
  }),
  invalidatesTags: ['VendorProfile'],
}),

logout: builder.mutation({
  query: () => ({
    url: "/vendor/logout",
    method: "POST",
  }),
}),


  }),
});



export const {
  useLogoutMutation ,
  useGetVendorProfileQuery,
  useUpdateProfileImageMutation,
  useUpdateProfileMutation,

} = profileManagementApi;
