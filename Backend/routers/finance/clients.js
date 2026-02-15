import express from "express";
// import auth from "../../middlewares/finance/auth.js";
import * as ctrl from "../../controller/finance/clientController.js";

const clientRoutes = express.Router();

// clientRoutes.use(auth);

clientRoutes.post("/post", ctrl.create);
clientRoutes.get("/get", ctrl.list);
clientRoutes.get("/:id", ctrl.get);
clientRoutes.put("/:id", ctrl.update);
clientRoutes.delete("/:id", ctrl.remove);

export default clientRoutes;
