import express from "express";
import {
  applyLeave,
  getMyLeaves,
  approveLeave,
  rejectLeave,
  editLeave,
  deleteLeave,
  allEmployeeLeaves,
  singleLeaveSummary,
  todayLeaves,
  getLeavesByCity,
  getLeaveChart,
} from "../../controllers/leave/leave.controller.js";

const router = express.Router();

/**
 * Employee Leave Routes
 */
router.post("/apply/:id", applyLeave);  
router.get("/my-leaves/:id", getMyLeaves);  
router.put("/edit/:id", editLeave);  
router.delete("/delete/:id", deleteLeave); 

/**
 * Admin Routes
 */
router.get("/all", allEmployeeLeaves);  
router.get("/summary/:id", singleLeaveSummary);  
router.get("/today", todayLeaves);  
router.get("/by-city/:cityId", getLeavesByCity);
router.get("/chart", getLeaveChart);
router.put("/approve/:id", approveLeave);  
router.put("/reject/:id", rejectLeave);  

export default router;
 
