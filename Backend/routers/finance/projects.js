import express from "express";
// import auth from "../../middlewares/finance/auth.js";
import * as ctrl from "../../controller/finance/projectController.js";

const projectRoutes = express.Router();

// projectRoutes.use(auth);

projectRoutes.post("/post", ctrl.create);
projectRoutes.get("/get", ctrl.list);
projectRoutes.get("/:id", ctrl.get);
projectRoutes.put("/:id", ctrl.update);
projectRoutes.delete("/:id", ctrl.remove);

export default projectRoutes;
