import { createApi } from "@reduxjs/toolkit/query/react";
import { axiosBaseQuery } from "../axiosBaseQuery";

export const networkInfrastructureApi = createApi({
  reducerPath: "networkInfrastructureApi",
  baseQuery: axiosBaseQuery(),
  tagTypes: ["NetworkInfra"],

  endpoints: (builder) => ({
 
 //  Add Device
    addDevice: builder.mutation({
      query: (data) => ({
        url: "/tech/network-infrastructure/add",
        method: "POST",
        data: data,
      }),
      invalidatesTags: ["NetworkInfra"],
    }),

    //  Get Devices (with pagination)
    getDevices: builder.query({
      query: ({ page, limit }) =>({
       url: `/tech/network-infrastructure/get?page=${page}&limit=${limit}`,
      }),
       providesTags: ["NetworkInfra"],
    }),

    //  Update Device
    updateDevice: builder.mutation({
      query: ({ id, ...data }) => ({
        url: `/tech/network-infrastructure/update/${id}`,
        method: "PUT",
        data: data,
      }),
      invalidatesTags: ["NetworkInfra"],
    }),

    //  Delete Device
    deleteDevice: builder.mutation({
      query: (id) => ({
        url: `/tech/network-infrastructure/delete/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["NetworkInfra"],
    }),
  

  }),
});

export const {
 useAddDeviceMutation,
  useGetDevicesQuery,
  useUpdateDeviceMutation,
  useDeleteDeviceMutation,
} = networkInfrastructureApi;
