import { RecceWaitingLostApi } from "@/api/recce/common/recce-waiting-lost.api"
import { TodayRecceApi } from "@/api/recce/common/today-recce.api"
import { RecceExeNextDayPlanningApi } from "@/api/recce/executive/recce-exe-nextday/recce-exe-nextday.api"
import { RecceExeUpcomingApi } from "@/api/recce/executive/recce-exe-upcoming/recce-exe-upcoming.api"
import { AssignedRecceApi } from "@/api/recce/manager/assigned-recce/assigned-recce.api"
import { RecceNextDayPlanningApi } from "@/api/recce/manager/next-day-planning/next-day-planning.api"
import { RequestAllApi } from "@/api/recce/manager/request-all/request-all.api"
import { ManagerTeamFlagDeclinedApi } from "@/api/recce/manager/team-flag-decline/team-flag-decline.api"





export const recceReducer = {
    [RecceNextDayPlanningApi.reducerPath]: RecceNextDayPlanningApi.reducer,
    [RequestAllApi.reducerPath]: RequestAllApi.reducer,
    [ManagerTeamFlagDeclinedApi.reducerPath]: ManagerTeamFlagDeclinedApi.reducer,
    [RecceWaitingLostApi.reducerPath]: RecceWaitingLostApi.reducer,
    [TodayRecceApi.reducerPath]: TodayRecceApi.reducer,
    [AssignedRecceApi.reducerPath]: AssignedRecceApi.reducer,


    // executive related
    [RecceExeNextDayPlanningApi.reducerPath]: RecceExeNextDayPlanningApi.reducer,
    [RecceExeUpcomingApi.reducerPath]: RecceExeUpcomingApi.reducer
}

export const recceMiddleware = [
    RecceNextDayPlanningApi.middleware,
    RequestAllApi.middleware,
    ManagerTeamFlagDeclinedApi.middleware,
    RecceWaitingLostApi.middleware,
    TodayRecceApi.middleware,
    AssignedRecceApi.middleware,



    // executive related
    RecceExeNextDayPlanningApi.middleware,
    RecceExeUpcomingApi.middleware
]