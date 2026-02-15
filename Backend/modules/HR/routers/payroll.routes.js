import express from "express";
import {
  viewSallery_slipe,
  viewSallery_employee,
  add_salary_slip,
  download_salary_slip,
  SalaryPay,
  viewSalary_ByMonth,
  total_paid_unpaid,
  approveSalary,
  rejectSalary,
  getPayrollChart,
  //   cleanupDuplicates
} from "../controllers/payroll/payroll.controller.js"

const router = express.Router(); 
// router.delete('/cleanup',cleanupDuplicates)
router.get("/viewAll", viewSallery_slipe); 
router.get("/employee/:id", viewSallery_employee); 
router.post("/add", add_salary_slip); 
router.get("/download/:id", download_salary_slip); 
router.post("/pay", SalaryPay); 
router.get("/month/:id", viewSalary_ByMonth); 
router.get("/summary", total_paid_unpaid);
router.get("/chart", getPayrollChart);
router.post("/approve", approveSalary);
router.post("/reject", rejectSalary);

export default router;