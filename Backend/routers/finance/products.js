import express from "express";
// import auth from "../../middlewares/finance/auth.js";
import * as ctrl from "../../controller/finance/productController.js";

const productRoutes = express.Router();

// productRoutes.use(auth);

productRoutes.post("/post", ctrl.create);
productRoutes.get("/get", ctrl.list);
productRoutes.get("/:id", ctrl.get);
productRoutes.put("/:id", ctrl.update);
productRoutes.delete("/:id", ctrl.remove);

export default productRoutes;
