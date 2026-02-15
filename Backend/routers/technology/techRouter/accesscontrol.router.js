import express from "express";
import { createAccess, deleteAccess, getAccessRecords, revokeAccess, updateAccess } from "../../../controller/technology/accesscontrol.controller.js";
import { checkRole } from "../../../middlewares/asset.middleware/authMiddlware.js";


const dataAccessControlRouter = express.Router();

dataAccessControlRouter.post("/add", createAccess);
dataAccessControlRouter.get("/get", getAccessRecords);
dataAccessControlRouter.put("/update/:id", updateAccess);
dataAccessControlRouter.delete("/delete/:id", deleteAccess);
dataAccessControlRouter.patch("/revoke/:id", revokeAccess);


export default dataAccessControlRouter;
