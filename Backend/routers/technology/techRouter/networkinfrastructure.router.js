// routes/device.routes.js
import express from "express";
import { checkRole } from "../../../middlewares/asset.middleware/authMiddlware.js";
import { addDevice, deleteDevice, getDevices, updateDevice } from "../../../controller/technology/networkinfrastructure.controller.js";


const networkInfrastructureRouter = express.Router();

//  Role Permissions Example
// Manager, HOD, Coordinator can add/update/delete
// Employee can only view

networkInfrastructureRouter.post("/add",  addDevice);
networkInfrastructureRouter.get("/get", getDevices);
networkInfrastructureRouter.put("/update/:id",  updateDevice);
networkInfrastructureRouter.delete("/delete/:id",  deleteDevice);
// networkInfrastructureRouter.get("/:id", checkRole(["Manager", "HOD", "Coordinator", "Employee"]), getDeviceById);

export default networkInfrastructureRouter;
