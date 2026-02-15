import { employeeApi } from "@/api/hr/employee.api";
import { jobApi } from "../../api/hr/job.api";
import {attendanceApi} from "../../api/hr/attendance.api"
import { EmploymentApi } from "@/api/hr/employment.api";
import {leaveApi} from "@/api/hr/leave.api"
import {payrollApi} from "@/api/hr/payroll.api"

export const hrReducers = {
  [jobApi.reducerPath]: jobApi.reducer,
  [employeeApi.reducerPath]:employeeApi.reducer,
  [attendanceApi.reducerPath]:attendanceApi.reducer,
  [EmploymentApi.reducerPath]:EmploymentApi.reducer,
  [leaveApi.reducerPath]:leaveApi.reducer,
  [payrollApi.reducerPath]:payrollApi.reducer
};

export const hrMiddleware = [
  jobApi.middleware,
  employeeApi.middleware,
  attendanceApi.middleware,
  EmploymentApi.middleware,
  leaveApi.middleware,
  payrollApi.middleware
];
