import express from "express";
import {
  createProject,
  updateProject,
  getAllProjects,
  getProjectById,
  deleteProject,
  updateProjectProducts,
  getProjectProducts,
  deleteProjectProduct,
} from "../controllers/project.controller.js";
import Upload from "../../../middlewares/master/multer.middleware.js";
import { fileValidator } from "../../../middlewares/master/fileValidator.middleware.js";
const router = express.Router();

router.post(
  "/",
  Upload("project").fields([{ name: "documents", maxCount: 10 }]),
  createProject
);

router.get("/", getAllProjects);
router.put(
  "/:id",
  Upload("project").fields([
    { name: "documents", maxCount: 10 },
    fileValidator({ types: ["image", "pdf"], maxSizeMB: 15 }),
  ]),
  updateProject
);


router.delete("/:id", deleteProject);

//add products
router.post("/:id/products", updateProjectProducts);
router.get("/:id/products", getProjectProducts);
router.delete("/:id/products/:productId", deleteProjectProduct);

export default router;
