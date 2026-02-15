import { createApi } from "@reduxjs/toolkit/query/react";
import { axiosBaseQuery } from "../axiosBaseQuery";

export const vendorBankApi = createApi({
  reducerPath: "vendor-bankDetailsApi",
  baseQuery: axiosBaseQuery(),
  tagTypes: ["BankDetails"],

  endpoints: (builder) => ({
    // ➤ Get All Banks
    getBanks: builder.query({
       query: () => ({
        url: "/vendor/get-bankdetails",
        method: "GET",
      }),
      providesTags: ["BankDetails"],
    }),

    // ➤ Add Bank
    addBank: builder.mutation({
      query: (addBank) => ({
        url: "/vendor/add-bankdetails",
        method: "POST",
         data: addBank,   // ✅ axios ke liye "data"
      }),
      invalidatesTags: ["BankDetails"],
    }),

    // ➤ Delete Bank
    // deleteBank: builder.mutation({
    //   query: (id) => ({
    //     url: `/banks/${id}`,
    //     method: "DELETE",
    //   }),
    //   invalidatesTags: ["BankDetails"],
    // }),
  }),
});

export const {
  useGetBanksQuery,
  useAddBankMutation,
  // useDeleteBankMutation,
} = vendorBankApi;
