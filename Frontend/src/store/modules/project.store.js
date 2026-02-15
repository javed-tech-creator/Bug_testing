import { ClientProjectMapApi } from "@/api/project/clientProjectMap.api";

export const projectReducers = {
    [ClientProjectMapApi.reducerPath]:ClientProjectMapApi.reducer
};

export const projectMiddleware = [
    ClientProjectMapApi.middleware
];
