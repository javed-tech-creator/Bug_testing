import { createApi } from "@reduxjs/toolkit/query/react";
import { axiosBaseQuery } from "../axiosBaseQuery";

export const jobApi = createApi({
  reducerPath: "job",
  baseQuery: axiosBaseQuery(),
  tagTypes: ["job"],
  endpoints: (builder) => ({
    addJobPost: builder.mutation({
      query: ({ formData }) => ({
        url: "/hr/job-post",
        method: "POST",
        data: formData,
      }),
      invalidatesTags: ["job"],
    }),
    JobUpdate: builder.mutation({
      query: ({ formData, id }) => ({
        url: `/hr/job-post/${id}`,
        method: "PUT",
        data: formData,
      }),
      invalidatesTags: ["job"],
    }),
    getJobPostById: builder.query({
      query: ({ id }) => ({
        url: `/hr/job-post/${id}`,
        method: "GET",
      }),
    }),
    getAllJobPost: builder.query({
      query: () => ({
        url: `/hr/job-post`,
        method: "GET",
      }),
    }),
    changeJobStatus: builder.mutation({
      query: ({ id }) => ({
        url: `/hr/job-post/close/${id}`,
        method: "PATCH",
      }),
      invalidatesTags: ["job"],
    }),
    //candidate apis
    addCandidate: builder.mutation({
      query: ({formData}) => ({
        url: `/hr/candidate`,
        method: "POST",
        data:formData
      }),
    }),
    getAllCandidates: builder.query({
      query: () => ({
        url: `/hr/candidate`,
        method: "GET",
      }),
    }),
    getCandidateById: builder.query({
      query: ({id}) => ({
        url: `/hr/candidate/${id}`,
        method: "GET",
      }),
    }),  
    getCandidateByJobId:builder.query({
      query:({id})=>({
        url:`/hr/candidate/job/${id}`,
        method:"GET"
      })
    }),
    uploadOfferLetter:builder.mutation({
        query:({id,formData})=>({
            url:`/hr/candidate/offer-letter/${id}`,
            method:"PUT",
            data:formData
        })
    }),
    changeCandidateStatus:builder.mutation({
        query:({id,formData})=>({
            url:`/hr/candidate/status/${id}`,
            method:"PUT",
            data:formData
        })
    }),
    scheduleInterview:builder.mutation({
        query:({id,formData})=>({
            url:`/hr/candidate/interview/${id}`,
            method:"PUT",
            data:formData
        })
    }),
    updateResume:builder.mutation({
        query:({id,formData})=>({
            url:`/hr/candidate/resume/${id}`,
            method:"PUT",
            data:formData
        })
    })
  }),
});

export const {
  useAddJobPostMutation,
  useGetJobPostByIdQuery,
  useJobUpdateMutation,
  useGetAllJobPostQuery,
  useChangeJobStatusMutation,
  useGetAllCandidatesQuery,
  useChangeCandidateStatusMutation,
  useGetCandidateByIdQuery,
 useGetCandidateByJobIdQuery,
  useScheduleInterviewMutation,
  useUploadOfferLetterMutation,
  useUpdateResumeMutation,
  useAddCandidateMutation
} = jobApi;
