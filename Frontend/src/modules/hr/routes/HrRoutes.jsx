import React from "react";
import { Routes, Route } from "react-router-dom";
import HrLoginPage from "../pages/HrLoginPage";
import HrLayout from "../layouts/HrLayout";
import Dashboard from "../pages/dashboard/Dashboard";
import EmployeeList from "../pages/employeeProfile/EmployeeList";
import AttendanceLogs from "../pages/attendance/AttendanceLogs";
import LeaveLogs from "../pages/leave/LeaveLogs";
import ActionGroup from "../pages/designation/ActionGroup";
import DesignationList from "../pages/designation/DesignationList";
import JobListing from "../pages/Job/JobListing";
import DepartmentList from "../pages/department/DepartmentList";
import WorkingOnIt from "@/components/WorkingOnIt";
import JobPostForm from "../pages/Job/JobPostForm";
import CandidateListing from "../pages/Job/CandidateListing";
import CandidateProfile from "../pages/Job/candidateProfile/CandidateProfile";
import CandidateListByJob from "../pages/Job/CandidateListByJob";
import EmployeeOnboardingMain from "../pages/EmployeeOnboarding/EmployeeOnboardingMain";
import EmployeeProfile from "../pages/employeeProfile/EmployeeProfile";
import Payroll from "../pages/payroll/Payroll";
import EmployeePerformance from "../pages/performance/EmployeePerformance";
import KPIManagement from "../pages/kpiMangement/KpiManagement";
import KPIIncentiveManagement from "../pages/kpiMangement/KpiIncentive";
import AddCandidateForm from "../pages/Job/AddCandidateForm";

// Add SOP import
import SopForm from "@/modules/hr/pages/standardOperatingProcedure/SopForm.jsx";
import SopList from "@/modules/hr/pages/standardOperatingProcedure/SopList.jsx";

export default function HrRoutes() {
  return (
    <Routes>
      <Route path="login" element={<HrLoginPage />} />

      <Route element={<HrLayout />}>
        <Route path="dashboard" element={<Dashboard />} />

        <Route
          path="employee/onboarding"
          element={<EmployeeOnboardingMain />}
        />
        <Route
          path="employee/onboarding/:id"
          element={<EmployeeOnboardingMain />}
        />
        <Route path="employee/profile/:id" element={<EmployeeProfile />} />
        <Route path="employee/list" element={<EmployeeList />} />
        <Route path="attendance/logs" element={<AttendanceLogs />} />
        <Route path="leave/logs" element={<LeaveLogs />} />
        <Route path="employee/Payroll" element={<Payroll />} />

        {/*  SOP Route  */}
        <Route path="sop" element={<SopList />} />
        <Route path="sop/add" element={<SopForm />} />
        <Route path="sop/edit/:id" element={<SopForm />} />
        <Route path="sop/view/:id" element={<SopForm />} />

        <Route path="job/post" element={<JobListing />} />
        <Route path="job/add" element={<JobPostForm />} />
        <Route path="job/post/edit/:id" element={<JobPostForm />} />
        <Route path="job/candidates" element={<CandidateListing />} />
        <Route path="job/candidate/add" element={<AddCandidateForm />} />
        <Route
          path="job/candidate/profile/:id"
          element={<CandidateProfile />}
        />
        <Route path="job/application/:id" element={<CandidateListByJob />} />

        <Route path="department/management" element={<DepartmentList />} />

        <Route path="designation/management" element={<DesignationList />} />
        <Route path="department/permissions" element={<ActionGroup />} />
        <Route path="performance/employee" element={<EmployeePerformance />} />
        <Route path="kpi/employee" element={<KPIManagement />} />
        <Route path="kpi/incentive" element={<KPIIncentiveManagement />} />

        <Route path="*" element={<WorkingOnIt />} />

        <Route path="/hr/sop-list" element={<SopList />} />
        <Route path="/hr/sop-form" element={<SopForm />} />
      </Route>
    </Routes>
  );
}
