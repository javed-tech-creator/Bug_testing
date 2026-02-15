import { licenseSoftwareApi } from "../../api/technology/licenseSoftware.api";
import { assetManagementApi } from "../../api/technology/assetManagement.api";
import { networkInfrastructureApi } from "../../api/technology/networkInfrastructure.api";
import { vendorAMCManagementApi } from "../../api/technology/vendorAMCManagement.api";
import { dataAccessControlApi } from "../../api/technology/dataAccessControl.api";
import { helpDeskApi } from "../../api/technology/helpdesk.api";
import { dashboardTechApi } from "../../api/technology/dashboard.api";

export const technologyReducers = {
  [licenseSoftwareApi.reducerPath]: licenseSoftwareApi.reducer,
  [assetManagementApi.reducerPath]: assetManagementApi.reducer,
  [networkInfrastructureApi.reducerPath]: networkInfrastructureApi.reducer,
  [vendorAMCManagementApi.reducerPath]: vendorAMCManagementApi.reducer,
  [dataAccessControlApi.reducerPath]: dataAccessControlApi.reducer,
  [helpDeskApi.reducerPath]: helpDeskApi.reducer,
  [dashboardTechApi.reducerPath]: dashboardTechApi.reducer,
};

export const technologyMiddleware = [
  licenseSoftwareApi.middleware,
  assetManagementApi.middleware,
  networkInfrastructureApi.middleware,
  vendorAMCManagementApi.middleware,
  dataAccessControlApi.middleware,
  helpDeskApi.middleware,
  dashboardTechApi.middleware,
];
