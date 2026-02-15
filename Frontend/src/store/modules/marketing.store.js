import { brandRepoApi } from "@/api/marketing/brandRepo.api";
import { campaignManagementApi } from "../../api/marketing/campaignManagement.api";
import { leadManagementApi } from "../../api/marketing/leadGenerate.api";

export const marketingReducers = {
  [campaignManagementApi.reducerPath]: campaignManagementApi.reducer,
  [leadManagementApi.reducerPath]: leadManagementApi.reducer,
  [brandRepoApi.reducerPath]: brandRepoApi.reducer,
};

export const marketingMiddleware = [
  campaignManagementApi.middleware,
  leadManagementApi.middleware,
  brandRepoApi.middleware,
];
