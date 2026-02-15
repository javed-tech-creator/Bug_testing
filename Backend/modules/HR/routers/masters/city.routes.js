import express from "express";
import {
  createCity,
  getAllCities,
  getCityById,
  updateCity,
  softDeleteCity,
  deleteCityPermanently,
  getCityByStateId
} from "../../controllers/masters/city.controller.js";

const router = express.Router();

router.post("/", createCity);
router.get("/", getAllCities);
router.get("/:id", getCityById);
router.put("/:id", updateCity);
router.delete("/:id", softDeleteCity);
router.delete("/permanent/:id", deleteCityPermanently);
router.get("/state/:id", getCityByStateId);

export default router;
