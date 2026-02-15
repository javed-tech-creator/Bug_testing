import { ManagerDesignRequestedApi } from "@/api/design/manager/design-bt-decision/design.requested.api";
import { NextDayPlanningApi } from "@/api/design/manager/next-day-planning/nextdayplanning.api";
import { TeamExecutivesApi } from "@/api/design/manager/team-management/team-management.api";
import { TodayDesignsApi } from "@/api/design/manager/today-designs/todayDesigns.api";
import { LostWaitingApi } from "@/api/design/manager/lost-waiting/lost-waiting.api";
import { AssignedDesignsApi } from "@/api/design/manager/assigned-design/assigned-design.api";
import { NextDayPlanningExceApi } from "@/api/design/executive/next-day-planning/next-day-planning.api";
import { WaitingLostExceDesignsApi } from "@/api/design/executive/waiting-lost/waiting-lost.api";
import { AssignedExceDesignsApi } from "@/api/design/executive/assigned-design/assigned-designs.api";
import { DesignWorkFlowApi } from "@/api/design/common_workflow/work-flow.api";
import { ViewDesignOptionApi } from "@/api/design/common_workflow/view-design-option.api";
import { DesignReviewApi } from "@/api/design/common_workflow/design-review/design-review.api";
import { ManagerDashboardApi } from "@/api/design/manager/manager-dashboard/manager-dashboard.api";


// Reducer must use the slice's reducerPath as key
export const designReducers = {
  [ManagerDesignRequestedApi.reducerPath]: ManagerDesignRequestedApi.reducer,
  [NextDayPlanningApi.reducerPath]: NextDayPlanningApi.reducer,
  [TodayDesignsApi.reducerPath]: TodayDesignsApi.reducer,
  [TeamExecutivesApi.reducerPath]: TeamExecutivesApi.reducer,
  [LostWaitingApi.reducerPath]: LostWaitingApi.reducer,
  [AssignedDesignsApi.reducerPath]: AssignedDesignsApi.reducer,
  [DesignWorkFlowApi.reducerPath]: DesignWorkFlowApi.reducer,

  [ManagerDashboardApi.reducerPath]: ManagerDashboardApi.reducer,


  // executive related start
  [NextDayPlanningExceApi.reducerPath]: NextDayPlanningExceApi.reducer,
  [WaitingLostExceDesignsApi.reducerPath]: WaitingLostExceDesignsApi.reducer,
  [AssignedExceDesignsApi.reducerPath]: AssignedExceDesignsApi.reducer,
  [ViewDesignOptionApi.reducerPath]: ViewDesignOptionApi.reducer,
  [DesignReviewApi.reducerPath]: DesignReviewApi.reducer,


};

// Middleware must be an array
export const designMiddleware = [
  ManagerDesignRequestedApi.middleware,
  NextDayPlanningApi.middleware,
  TodayDesignsApi.middleware,
  TeamExecutivesApi.middleware,
  LostWaitingApi.middleware,
  AssignedDesignsApi.middleware,

  ManagerDashboardApi.middleware,


  // executive related start
  NextDayPlanningExceApi.middleware,
  WaitingLostExceDesignsApi.middleware,
  AssignedExceDesignsApi.middleware,
  DesignWorkFlowApi.middleware,
  ViewDesignOptionApi.middleware,
  DesignReviewApi.middleware,



];
