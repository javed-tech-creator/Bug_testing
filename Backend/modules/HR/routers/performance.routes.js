import express from "express"
import * as performance from "../controllers/performance/performance.controller.js"


const router=express.Router()
router.post("/",performance.createPerformance)
router.get("/",performance.getAllPerformance)
router.get("/:id",performance.getPerformanceById)
router.put("/:id",performance.updatePerformance)
router.delete("/:id",performance.deletePerformance)

export default router