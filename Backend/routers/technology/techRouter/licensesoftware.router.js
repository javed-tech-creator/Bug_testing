import express from "express";
import { checkRole, mockUser } from "../../../middlewares/asset.middleware/authMiddlware.js";
import { createLicense, getAllLicenses, getLicenses, hardDeleteLicense, patchLicense, softDeleteLicense, updateLicense } from "../../../controller/technology/licensesoftware.controller.js";

const licenseSoftwareRouter = express.Router();

// Sabhi routes pe pehle dummy user inject hoga
// licenseSoftwareRouter.use(mockUser);

licenseSoftwareRouter.post("/add", createLicense);
licenseSoftwareRouter.get("/get", getLicenses);
licenseSoftwareRouter.get("/get-all-data", getAllLicenses);
licenseSoftwareRouter.put("/update/:id", updateLicense);
licenseSoftwareRouter.patch("/assign/:id", patchLicense);
licenseSoftwareRouter.delete("/delete/:id", softDeleteLicense);
licenseSoftwareRouter.delete("/delete-hard/:id", hardDeleteLicense);

export default licenseSoftwareRouter;
