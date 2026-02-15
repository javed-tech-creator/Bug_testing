import { Router } from "express";
// routes/role.routes.js
import express from "express";
import {
    createRole,
    getAllRoles,
    getRoleById,
    updateRole,
    deleteRole
} from "../../controller/role/role.controller.js"

const RoleRoutes = Router();

RoleRoutes.post("/add", createRole)
RoleRoutes.get("/list",getAllRoles)
RoleRoutes.put("/update/:id", updateRole)
RoleRoutes.delete("/delete/:id", deleteRole)


export default RoleRoutes;