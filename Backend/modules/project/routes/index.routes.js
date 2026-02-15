import express from "express";
const router = express.Router();

import clientProjectMapRoute from "./clientProjectMap.routes.js";

router.use("/client-project-map", clientProjectMapRoute);

export default router;
