import { assignedRecceApi } from "@/api/admin/assignedRecce.api";
import { ContractorProfileManagementApi } from "@/api/admin/contractor-profile-management/contractor.management.api";
import { DepartmentApi } from "@/api/admin/department-management/department-designation/department.api";
import { MasterApi } from "@/api/admin/department-management/location-heirarchy/master.api";
import { FranchiseProfileManagementApi } from "@/api/admin/franchise-profile-management/franchise.management.api";
import { FreelancerProfileManagementApi } from "@/api/admin/freelancer-profile-management/freelancer.management.api";
import { notificationApi } from "@/api/admin/notification.api";
import { PartnerProfileManagementApi } from "@/api/admin/partner-profile-management/partner.management.api";
import { AdminProductManagementApi } from "@/api/admin/product-management/product.management.api";
import { UserManagementApi } from "@/api/admin/user-management/user.management.api";
import { VendorProfileManagementApi } from "@/api/admin/vendor-profile-management/vendor.management.api";

export const adminReducers = {
  [MasterApi.reducerPath]: MasterApi.reducer,
  [DepartmentApi.reducerPath]: DepartmentApi.reducer,
  [UserManagementApi.reducerPath]: UserManagementApi.reducer,
  [AdminProductManagementApi.reducerPath]: AdminProductManagementApi.reducer,
  [VendorProfileManagementApi.reducerPath]: VendorProfileManagementApi.reducer,
  [ContractorProfileManagementApi.reducerPath]:
    ContractorProfileManagementApi.reducer,
  [FreelancerProfileManagementApi.reducerPath]:
    FreelancerProfileManagementApi.reducer,
  [PartnerProfileManagementApi.reducerPath]:
    PartnerProfileManagementApi.reducer,
  [FranchiseProfileManagementApi.reducerPath]:
    FranchiseProfileManagementApi.reducer,
  [notificationApi.reducerPath]: notificationApi.reducer,
  [assignedRecceApi.reducerPath]: assignedRecceApi.reducer,
};

export const adminMiddleware = [
  MasterApi.middleware,
  DepartmentApi.middleware,
  UserManagementApi.middleware,
  AdminProductManagementApi.middleware,
  VendorProfileManagementApi.middleware,
  ContractorProfileManagementApi.middleware,
  FreelancerProfileManagementApi.middleware,
  PartnerProfileManagementApi.middleware,
  FranchiseProfileManagementApi.middleware,
  notificationApi.middleware,
  assignedRecceApi.middleware,
];
